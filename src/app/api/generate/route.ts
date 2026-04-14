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

    if (images.length > 5) {
      return new Response(
        JSON.stringify({ error: '최대 5장까지 분석할 수 있습니다.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const systemPrompt =
      GENERATE_SYSTEM_PROMPTS[lang as keyof typeof GENERATE_SYSTEM_PROMPTS] ??
      GENERATE_SYSTEM_PROMPTS['ko']

    // Claude Vision 메시지 구성
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
        ? `Analyze the above photo${images.length > 1 ? `s (${images.length} total)` : ''} and write the work manual.`
        : lang === 'ja'
        ? `上記の写真${images.length > 1 ? `（計${images.length}枚）` : ''}を分析して業務マニュアルを作成してください。`
        : lang === 'zh'
        ? `请分析以上照片${images.length > 1 ? `（共${images.length}张）` : ''}并编写工作手册。`
        : `위 사진${images.length > 1 ? `들(총 ${images.length}장)` : ''}을 분석하여 업무 매뉴얼을 작성해주세요.`

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
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

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              const data = JSON.stringify({ text: chunk.delta.text })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          const msg = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
          )
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '서버 오류가 발생했습니다.'
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
