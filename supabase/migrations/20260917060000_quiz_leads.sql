-- ============================================================================
-- Avantis Studio — leads e respostas de quizzes, separados por nicho e funil
-- ----------------------------------------------------------------------------
-- Não conecta nenhum quiz externo. Apenas prepara o banco e o painel para que
-- vários nichos e várias versões de funil coexistam sem misturar respostas.
-- ============================================================================

create table if not exists public.quiz_niches (
  id          uuid primary key default gen_random_uuid(),
  niche_key   text not null unique,
  name        text not null,
  description text,
  created_at  timestamptz not null default now()
);

create table if not exists public.quiz_funnels (
  id          uuid primary key default gen_random_uuid(),
  niche_id    uuid not null references public.quiz_niches(id) on delete restrict,
  funnel_key  text not null unique,
  name        text not null,
  version     text not null default '1',
  site_key    text,
  status      text not null default 'draft'
                   check (status in ('draft', 'active', 'paused', 'archived')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.quiz_leads (
  id                uuid primary key default gen_random_uuid(),
  funnel_id         uuid not null references public.quiz_funnels(id) on delete restrict,
  name              text not null,
  phone             text not null,
  email             text,
  consent_whatsapp  boolean not null default false,
  consent_at        timestamptz,
  source            text,
  status            text not null default 'new'
                         check (status in ('new', 'contacted', 'replied', 'converted', 'lost', 'unsubscribed')),
  external_id       text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id             uuid primary key default gen_random_uuid(),
  funnel_id      uuid not null references public.quiz_funnels(id) on delete restrict,
  lead_id        uuid references public.quiz_leads(id) on delete cascade,
  visitor_id     text,
  session_id     text,
  quiz_version   text not null default '1',
  result_key     text,
  result_label   text,
  started_at     timestamptz not null default now(),
  completed_at   timestamptz,
  created_at     timestamptz not null default now()
);

create table if not exists public.quiz_answers (
  id              uuid primary key default gen_random_uuid(),
  attempt_id      uuid not null references public.quiz_attempts(id) on delete cascade,
  question_key    text not null,
  question_label  text not null,
  answer_key      text,
  answer_label    text not null,
  answer_value    jsonb,
  position        int not null default 0,
  created_at      timestamptz not null default now(),
  unique (attempt_id, question_key)
);

create index if not exists idx_quiz_funnels_niche
  on public.quiz_funnels (niche_id, created_at desc);
create index if not exists idx_quiz_leads_funnel_created
  on public.quiz_leads (funnel_id, created_at desc);
create index if not exists idx_quiz_leads_phone
  on public.quiz_leads (phone);
create index if not exists idx_quiz_attempts_lead
  on public.quiz_attempts (lead_id, started_at desc);
create index if not exists idx_quiz_attempts_funnel
  on public.quiz_attempts (funnel_id, started_at desc);
create index if not exists idx_quiz_answers_attempt
  on public.quiz_answers (attempt_id, position);

alter table public.quiz_niches  enable row level security;
alter table public.quiz_funnels enable row level security;
alter table public.quiz_leads   enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_answers enable row level security;

-- Não criar políticas para anon/authenticated: nome, telefone e respostas são
-- dados privados. Apenas o backend do Studio, autenticado e usando service_role,
-- acessa estas tabelas. O quiz externo ganhará um endpoint público restrito em
-- uma etapa posterior; nunca receberá acesso direto ao banco.

insert into public.quiz_niches (niche_key, name, description)
values ('saude-natural', 'Saúde natural', 'Funis de receitas, bem-estar e cuidados naturais.')
on conflict (niche_key) do update set name = excluded.name, description = excluded.description;

insert into public.quiz_funnels (niche_id, funnel_key, name, version, status)
select id, 'avo-yuki', 'Quiz da Avó Yuki', '1', 'draft'
from public.quiz_niches
where niche_key = 'saude-natural'
on conflict (funnel_key) do update
set niche_id = excluded.niche_id, name = excluded.name, version = excluded.version;

notify pgrst, 'reload schema';
