import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/quiz-results?quiz_id=xxx  — 퀴즈별 결과
// GET /api/quiz-results              — 전체 결과 (대시보드)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const quizId = searchParams.get('quiz_id')

    let query = supabase
      .from('quiz_results')
      .select(`
        *,
        quizzes ( title, manual_id )
      `)
      .order('created_at', { ascending: false })

    if (quizId) {
      query = query.eq('quiz_id', quizId)
    }

    const { data, error } = await query

    if (error) throw error
    return NextResponse.json(data ?? [])
  } catch (err) {
    const msg = err instanceof Error ? err.message : '조회 실패'
    const isConfig = msg.includes('환경변수') || msg.includes('supabaseUrl')
    return NextResponse.json(
      { error: msg, code: isConfig ? 'supabase_not_configured' : 'fetch_failed' },
      { status: isConfig ? 503 : 500 }
    )
  }
}

// POST /api/quiz-results — 결과 저장
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { quiz_id, taker_name, answers, score, passed } = body

    if (!quiz_id || !taker_name || !Array.isArray(answers)) {
      return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('quiz_results')
      .insert({ quiz_id, taker_name, answers, score, passed })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '저장 실패'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
