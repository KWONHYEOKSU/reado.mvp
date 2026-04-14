import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import type { ManualBlock, QuizQuestion } from '@/lib/supabase'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const QUIZ_SYSTEM_PROMPT = `You are an expert at creating multiple-choice quiz questions from work manuals.
Given the manual content, generate clear, practical quiz questions that test understanding of the key procedures.

Respond ONLY with valid JSON (no markdown, no code blocks):
{
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}

Rules:
- answer is the 0-based index of the correct option (0=A, 1=B, 2=C, 3=D)
- Make options plausible but only one clearly correct
- Questions should be practical and based on the manual content
- Write questions and options in the same language as the manual`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { blocks, count = 5 } = body as {
      blocks: ManualBlock[]
      count: 5 | 10
    }

    if (!blocks || blocks.length === 0) {
      return NextResponse.json({ error: '매뉴얼 내용이 없습니다.' }, { status: 400 })
    }

    // 텍스트 블록만 추출하여 매뉴얼 내용 구성
    const manualText = blocks
      .filter((b) => b.type === 'text')
      .map((b) => (b.section_title ? `## ${b.section_title}\n${b.content}` : b.content))
      .join('\n\n')

    if (!manualText.trim()) {
      return NextResponse.json({ error: '텍스트 내용이 없습니다.' }, { status: 400 })
    }

    const userPrompt = `Generate exactly ${count} multiple-choice questions based on this work manual:\n\n${manualText}`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: QUIZ_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const rawText = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as Anthropic.TextBlock).text)
      .join('')

    const jsonStr = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim()

    let parsed: { questions: QuizQuestion[] }
    try {
      parsed = JSON.parse(jsonStr)
    } catch {
      return NextResponse.json({ error: 'AI 응답 파싱 실패. 다시 시도해주세요.' }, { status: 500 })
    }

    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      return NextResponse.json({ error: '문제가 생성되지 않았습니다.' }, { status: 500 })
    }

    return NextResponse.json({ questions: parsed.questions })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '서버 오류가 발생했습니다.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
