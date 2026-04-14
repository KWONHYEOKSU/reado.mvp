import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/quizzes/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error
    if (!data) return NextResponse.json({ error: '테스트를 찾을 수 없습니다.' }, { status: 404 })
    return NextResponse.json(data)
  } catch (err) {
    const msg = err instanceof Error ? err.message : '조회 실패'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// DELETE /api/quizzes/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase.from('quizzes').delete().eq('id', params.id)
    if (error) throw error
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '삭제 실패'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
