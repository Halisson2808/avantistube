-- ============================================================================
-- Avantis Studio — cadastro automático de site pelo pixel
-- ----------------------------------------------------------------------------
-- Quando chega um evento com uma chave que ainda não existe, o backend cria o
-- site sozinho usando o nome que o pixel manda (data-site-name). Esta coluna
-- marca esses casos, para separar no painel do que foi cadastrado a mão.
--
-- Como aplicar: Supabase Dashboard -> SQL Editor -> cole tudo -> Run.
-- ============================================================================

alter table public.tracking_sites
  add column if not exists auto_created boolean not null default false;

comment on column public.tracking_sites.auto_created is
  'true = site criado sozinho na primeira visita rastreada (data-site-name do pixel), nao cadastrado a mao no painel.';

notify pgrst, 'reload schema';
