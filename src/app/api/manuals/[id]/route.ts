import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase
      .from('manuals')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    const msg = err instanceof Error ? err.message : '매뉴얼을 불러오지 못했습니다.'
    return NextResponse.json({ error: msg }, { status: 404 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { title, blocks } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: '제목을 입력해주세요.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('manuals')
      .update({
        title: title.trim(),
        blocks: blocks ?? [],
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    const msg = err instanceof Error ? err.message : '수정에 실패했습니다.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase
      .from('manuals')
      .delete()
      .eq('id', params.id)

    if (error) throw error
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '삭제에 실패했습니다.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
