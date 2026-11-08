-- Ordinance database tables. Run with: npm run db:setup
create table if not exists questions (
  id          bigserial primary key,
  question    text not null,
  zone        text,
  sections    text[] not null default '{}',
  covered     boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists feedback (
  id           bigserial primary key,
  question_id  bigint references questions(id) on delete cascade,
  helpful      boolean not null,
  created_at   timestamptz not null default now()
);

-- Only saved when someone clicks "Save & share". Address is optional.
create table if not exists prechecks (
  id          text primary key,
  project     jsonb not null,
  result      jsonb not null,
  address     text,
  created_at  timestamptz not null default now()
);

-- One row per AI call, for the daily limit. No personal info.
create table if not exists ai_usage (
  id   bigserial primary key,
  day  date not null
);
create index if not exists ai_usage_day on ai_usage(day);
create index if not exists questions_created on questions(created_at);
