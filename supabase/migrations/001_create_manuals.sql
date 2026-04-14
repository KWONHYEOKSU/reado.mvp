-- manuals 테이블 생성
create table if not exists public.manuals (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  blocks     jsonb not null default '[]'::jsonb,
  owner_id   text not null default 'demo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at 자동 갱신 트리거
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger manuals_updated_at
  before update on public.manuals
  for each row
  execute function public.set_updated_at();

-- RLS 활성화 (추후 auth 연동 대비)
alter table public.manuals enable row level security;

-- 데모용: 모든 접근 허용 (추후 auth.uid() 기반으로 교체)
create policy "demo: allow all" on public.manuals
  for all using (true) with check (true);

-- 인덱스
create index if not exists manuals_owner_created
  on public.manuals (owner_id, created_at desc);
