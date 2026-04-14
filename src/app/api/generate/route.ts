import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { GENERATE_SYSTEM_PROMPTS } from '@/lib/i18n'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { images, lang = 'ko' } = body as {
      images: Array<{ base64: string; mediaType: string }>
      lang?: string
    }

    if (!images || images.length === 0) {
      return new Response(
        JSON.stringify({ error: '이미지를 하나 이상 업로드해주세요.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (images.length > 10) {
      return new Response(
        JSON.stringify({ error: '최대 10장까지 분석할 수 있습니다.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const systemPrompt =
      GENERATE_SYSTEM_PROMPTS[lang as keyof typeof GENERATE_SYSTEM_PROMPTS] ??
      GENERATE_SYSTEM_PROMPTS['ko']

    const imageContents: Anthropic.ImageBlockParam[] = images.map((img) => ({
      type: 'image',
      source: {
        type: 'base64',
        media_type: img.mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
        data: img.base64,
      },
    }))

    const userText =
      lang === 'en'
        ? `Analyze the above photo${images.length > 1 ? `s (${images.length} total)` : ''} and write the work manual as JSON.`
        : lang === 'ja'
        ? `上記の写真${images.length > 1 ? `（計${images.length}枚）` : ''}を分析して業務マニュアルをJSONで作成してください。`
        : lang === 'zh'
        ? `请分析以上照片${images.length > 1 ? `（共${images.length}张）` : ''}并以JSON格式编写工作手册。`
        : `위 사진${images.length > 1 ? `들(총 ${images.length}장)` : ''}을 분석하여 업무 매뉴얼을 JSON으로 작성해주세요.`

    // Non-streaming: collect full response then parse JSON
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            ...imageContents,
            { type: 'text', text: userText },
          ],
        },
      ],
    })

    const rawText = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as Anthropic.TextBlock).text)
      .join('')

    // JSON 파싱 (마크다운 코드블록 제거 후)
    const jsonStr = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim()

    let parsed: { sections: Array<{ section_title: string; content: string }> }
    try {
      parsed = JSON.parse(jsonStr)
    } catch {
      // JSON 파싱 실패 시 텍스트를 단일 섹션으로 래핑
      parsed = { sections: [{ section_title: '매뉴얼', content: rawText }] }
    }

    return new Response(JSON.stringify(parsed), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '서버 오류가 발생했습니다.'
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
