import { createClient, SupabaseClient } from '@supabase/supabase-js'

export type ManualBlock = {
  type: 'text' | 'image' | 'video'
  content: string  // text: 본문 / image|video: URL
}

export type Manual = {
  id: string
  title: string
  blocks: ManualBlock[]
  owner_id: string
  created_at: string
  updated_at: string
}

// 빌드 시 환경변수 미설정 오류 방지를 위해 지연 초기화
let _client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      'Supabase 환경변수가 설정되지 않았습니다. .env.local에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 추가해주세요.'
    )
  }

  _client = createClient(url, key)
  return _client
}

// API 라우트에서 편의상 사용하는 getter
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
})
