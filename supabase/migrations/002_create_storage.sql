-- manual-media 스토리지 버킷 생성
-- Supabase 대시보드 > Storage > New Bucket 에서도 생성 가능

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'manual-media',
  'manual-media',
  true,                                    -- 공개 버킷 (URL로 직접 접근 가능)
  104857600,                               -- 100MB
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/quicktime', 'video/webm', 'video/ogg'
  ]
)
on conflict (id) do nothing;

-- 업로드 정책: 인증 불필요 (데모용 — 추후 auth.uid() 기반으로 교체)
create policy "demo: allow upload"
  on storage.objects for insert
  to public
  with check (bucket_id = 'manual-media');

-- 읽기 정책: 공개
create policy "demo: allow read"
  on storage.objects for select
  to public
  using (bucket_id = 'manual-media');

-- 삭제 정책: 데모용 허용
create policy "demo: allow delete"
  on storage.objects for delete
  to public
  using (bucket_id = 'manual-media');
