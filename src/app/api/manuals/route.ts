import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('manuals')
      .select('id, title, created_at, updated_at')
      .eq('owner_id', 'demo')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    const msg = err instanceof Error ? err.message : '목록을 불러오지 못했습니다.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, blocks } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: '제목을 입력해주세요.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('manuals')
      .insert({ title: title.trim(), blocks: blocks ?? [], owner_id: 'demo' })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '저장에 실패했습니다.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
