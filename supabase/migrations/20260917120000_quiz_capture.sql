-- Captura pública dos quizzes: deduplicação, origem e última etapa alcançada.

alter table public.quiz_leads
  add column if not exists origin jsonb not null default '{}'::jsonb,
  add column if not exists last_stage text,
  add column if not exists last_stage_at timestamptz;

create unique index if not exists uq_quiz_leads_funnel_phone
  on public.quiz_leads (funnel_id, phone);

alter table public.quiz_attempts
  add column if not exists origin jsonb not null default '{}'::jsonb,
  add column if not exists last_stage text,
  add column if not exists last_stage_at timestamptz;

update public.quiz_funnels
set status = 'active', updated_at = now()
where funnel_key = 'avo-yuki';

notify pgrst, 'reload schema';
