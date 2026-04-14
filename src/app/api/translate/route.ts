import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { ManualBlock } from '@/lib/supabase'
import { LANG_FULL_NAMES } from '@/lib/i18n'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { blocks, targetLang } = body as {
      blocks: ManualBlock[]
      targetLang: string
    }

    if (!blocks || blocks.length === 0) {
      return NextResponse.json({ error: '번역할 내용이 없습니다.' }, { status: 400 })
    }

    const langName = LANG_FULL_NAMES[targetLang as keyof typeof LANG_FULL_NAMES]
    if (!langName) {
      return NextResponse.json({ error: '지원하지 않는 언어입니다.' }, { status: 400 })
    }

    // 텍스트 블록만 추출 (이미지 블록은 번역 불필요)
    const textIndices: number[] = []
    const textItems: string[] = []
    blocks.forEach((block, i) => {
      if (block.type === 'text' && block.content.trim()) {
        textIndices.push(i)
        textItems.push(block.content)
      }
    })

    if (textItems.length === 0) {
      return NextResponse.json({ translatedBlocks: blocks })
    }

    const prompt = `You are a professional translator specializing in workplace operation manuals for small businesses (restaurants, cafes, retail shops, etc.).

Translate the following ${textItems.length} text items to ${langName}.
The content is work instructions for employees.

CRITICAL RULES:
- Return ONLY a valid JSON array of strings — no explanation, no markdown, no code block
- The array must contain exactly ${textItems.length} elements in the same order as the input
- Use natural, simple language appropriate for part-time workers
- Preserve formatting: numbered lists (1., 2.), bullets (•, -, *), line structure
- Keep proper nouns, brand names, and product names as appropriate

Input JSON array:
${JSON.stringify(textItems)}`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const rawText =
      response.content[0].type === 'text' ? response.content[0].text.trim() : ''

    // JSON 배열 추출 (마크다운 코드블록 포함 대응)
    const jsonMatch = rawText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('번역 결과를 파싱할 수 없습니다.')
    }

    const translatedTexts: string[] = JSON.parse(jsonMatch[0])

    if (!Array.isArray(translatedTexts) || translatedTexts.length !== textItems.length) {
      throw new Error('번역 결과 수가 입력과 다릅니다.')
    }

    // 번역된 텍스트를 원래 블록 배열에 매핑
    const translatedBlocks: ManualBlock[] = blocks.map((block, i) => {
      const idx = textIndices.indexOf(i)
      if (idx !== -1) {
        return { ...block, content: translatedTexts[idx] }
      }
      return block
    })

    return NextResponse.json({ translatedBlocks })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '번역에 실패했습니다.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
