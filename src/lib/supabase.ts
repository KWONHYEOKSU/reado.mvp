import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type ManualBlock = {
  type: 'text' | 'image'
  content: string
}

export type Manual = {
  id: string
  title: string
  blocks: ManualBlock[]
  owner_id: string
  created_at: string
  updated_at: string
}
