import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/ogg']
const MAX_IMAGE_BYTES = 10 * 1024 * 1024  // 10MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024 // 100MB
const BUCKET = 'manual-media'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })
    }

    const isImage = IMAGE_TYPES.includes(file.type)
    const isVideo = VIDEO_TYPES.includes(file.type)

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: '지원하지 않는 파일 형식입니다. (JPG/PNG/WEBP/GIF/MP4/MOV/WebM)' },
        { status: 400 }
      )
    }

    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES
    if (file.size > maxBytes) {
      const mb = Math.round(maxBytes / 1024 / 1024)
      return NextResponse.json(
        { error: `파일이 너무 큽니다. 최대 ${mb}MB까지 가능합니다.` },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()

    // 파일명: images/1234-abcd.jpg 또는 videos/1234-abcd.mp4
    const ext = file.name.split('.').pop()?.toLowerCase() ?? (isImage ? 'jpg' : 'mp4')
    const folder = isImage ? 'images' : 'videos'
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const bytes = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, bytes, { contentType: file.type, upsert: false })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName)

    return NextResponse.json({
      url: publicUrl,
      type: isImage ? 'image' : 'video',
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '업로드에 실패했습니다.'
    // Supabase 미설정 오류를 명확히 구분
    const isConfig = msg.includes('환경변수') || msg.includes('supabaseUrl')
    return NextResponse.json(
      { error: msg, code: isConfig ? 'supabase_not_configured' : 'upload_failed' },
      { status: isConfig ? 503 : 500 }
    )
  }
}
