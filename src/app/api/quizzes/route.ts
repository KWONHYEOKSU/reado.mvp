import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/quizzes?manual_id=xxx  — 매뉴얼별 퀴즈 목록
// GET /api/quizzes                — 전체 퀴즈 목록
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const manualId = searchParams.get('manual_id')

    let query = supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false })

    if (manualId) {
      query = query.eq('manual_id', manualId)
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

// POST /api/quizzes — 퀴즈 생성
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { manual_id, title, questions } = body

    if (!manual_id || !title || !questions?.length) {
      return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('quizzes')
      .insert({ manual_id, title, questions })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '저장 실패'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
