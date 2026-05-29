-- ============================================================================
-- Avantis Tube — Schema inicial do Supabase
-- ----------------------------------------------------------------------------
-- Espelha os arquivos locais:
--   data/channels.json  -> public.channels
--   data/history.json   -> public.channel_history
--
-- Como aplicar:
--   Opção A (mais simples): copie este arquivo inteiro e cole no
--     Supabase Dashboard -> SQL Editor -> Run.
--   Opção B (CLI): supabase link --project-ref hakvewukaphjuqgbdueb
--                  supabase db push
-- ============================================================================

-- ─── Canais monitorados ─────────────────────────────────────────────────────
create table if not exists public.channels (
  id                  uuid primary key default gen_random_uuid(),
  channel_id          text not null unique,                 -- ID do YouTube (UCxxxx)
  channel_name        text not null,
  channel_thumbnail   text,
  subscriber_count    bigint  not null default 0,
  view_count          bigint  not null default 0,           -- bigint: passa de 2 bilhões
  video_count         integer not null default 0,
  niche               text,
  notes               text,
  content_type        text    not null default 'longform'
                              check (content_type in ('longform', 'shorts')),
  initial_subscribers bigint,
  initial_views       bigint,
  added_at            timestamptz not null default now(),
  last_updated        timestamptz not null default now()
);

create index if not exists idx_channels_niche on public.channels (niche);

-- ─── Histórico de crescimento (1 ponto por dia por canal) ───────────────────
create table if not exists public.channel_history (
  id               bigint generated always as identity primary key,
  channel_id       text not null
                   references public.channels(channel_id) on delete cascade,
  recorded_at      timestamptz not null,
  subscriber_count bigint  not null default 0,
  view_count       bigint  not null default 0,
  video_count      integer not null default 0,
  unique (channel_id, recorded_at)   -- evita pontos duplicados na reimportação
);

create index if not exists idx_channel_history_lookup
  on public.channel_history (channel_id, recorded_at);

-- ─── Row Level Security ─────────────────────────────────────────────────────
-- App pessoal, sem login. Liberamos apenas LEITURA para a chave pública (anon).
-- Escritas (add/edit/delete) passarão pelas Edge Functions usando a service_role
-- key, que ignora o RLS — então não criamos políticas de escrita para o anon.
alter table public.channels        enable row level security;
alter table public.channel_history enable row level security;

drop policy if exists "public read channels" on public.channels;
create policy "public read channels"
  on public.channels for select
  to anon, authenticated
  using (true);

drop policy if exists "public read history" on public.channel_history;
create policy "public read history"
  on public.channel_history for select
  to anon, authenticated
  using (true);

-- ─── Forçar o PostgREST a recarregar o cache de schema ──────────────────────
-- (sem isso, a API pode responder "Could not find the table in the schema cache")
notify pgrst, 'reload schema';
