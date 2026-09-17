-- Organização operacional: Site -> Quiz numerado -> Lead -> Tentativas.
-- A rota é metadado e pode mudar sem alterar a identidade do quiz.

alter table public.quiz_funnels
  alter column niche_id drop not null,
  add column if not exists quiz_number int,
  add column if not exists route text not null default '/';

update public.quiz_funnels
set site_key = 'avo-yuki',
    quiz_number = 1,
    route = '/',
    name = 'Quiz 01',
    updated_at = now()
where funnel_key = 'avo-yuki';

alter table public.quiz_funnels
  alter column quiz_number set default 1;

create unique index if not exists uq_quiz_funnels_site_number
  on public.quiz_funnels (site_key, quiz_number)
  where site_key is not null and quiz_number is not null;

notify pgrst, 'reload schema';
