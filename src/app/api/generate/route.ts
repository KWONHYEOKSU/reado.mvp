import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `당신은 소규모 자영업장의 업무 매뉴얼 작성 전문가입니다.
업로드된 매장 사진을 분석하여, 신규 아르바이트생이 이해하기 쉬운
단계별 업무 매뉴얼을 한국어로 작성해주세요.

출력 형식:
- 매뉴얼 제목
- 업무 단계 (번호 목록, 각 단계마다 구체적인 행동 지침)
- 주의사항 (있는 경우)

간결하고 명확하게 작성하세요.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { images } = body as {
      images: Array<{ base64: string; mediaType: string }>
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

    // Claude Vision 메시지 구성 (이미지 + 텍스트)
    const imageContents: Anthropic.ImageBlockParam[] = images.map((img) => ({
      type: 'image',
      source: {
        type: 'base64',
        media_type: img.mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
        data: img.base64,
      },
    }))

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            ...imageContents,
            {
              type: 'text',
              text: `위 사진${images.length > 1 ? `들(총 ${images.length}장)` : ''}을 분석하여 업무 매뉴얼을 작성해주세요.`,
            },
          ],
        },
      ],
    })

    // SSE 스트리밍 응답 반환
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
          const errorMsg = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorMsg })}\n\n`)
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
    const errorMsg = err instanceof Error ? err.message : '서버 오류가 발생했습니다.'
    return new Response(
      JSON.stringify({ error: errorMsg }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
