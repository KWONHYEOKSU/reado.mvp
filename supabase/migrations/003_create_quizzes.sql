-- quizzes 테이블
create table if not exists quizzes (
  id          uuid primary key default gen_random_uuid(),
  manual_id   uuid references manuals(id) on delete cascade,
  title       text not null,
  questions   jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);

-- quiz_results 테이블
create table if not exists quiz_results (
  id          uuid primary key default gen_random_uuid(),
  quiz_id     uuid references quizzes(id) on delete cascade,
  taker_name  text not null,
  answers     jsonb not null default '[]'::jsonb,
  score       integer not null default 0,
  passed      boolean not null default false,
  created_at  timestamptz not null default now()
);

-- 인덱스
create index if not exists quizzes_manual_id_idx on quizzes(manual_id);
create index if not exists quiz_results_quiz_id_idx on quiz_results(quiz_id);
create index if not exists quiz_results_created_at_idx on quiz_results(created_at desc);

-- RLS 활성화 (데모: 전체 허용)
alter table quizzes enable row level security;
alter table quiz_results enable row level security;

create policy "demo: allow all quizzes"
  on quizzes for all
  to public
  using (true)
  with check (true);

create policy "demo: allow all quiz_results"
  on quiz_results for all
  to public
  using (true)
  with check (true);
