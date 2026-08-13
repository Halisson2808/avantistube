-- ============================================================================
-- Avantis Studio — Meus Canais
-- ----------------------------------------------------------------------------
-- Lista simples dos canais do próprio usuário: sem nicho, sem tags — só
-- cola o link, salva e pronto. Mesmo formato visual do Monitoramento
-- (thumb, stats, últimos vídeos), mas guardado numa tabela separada.
--
-- Como aplicar: Supabase Dashboard -> SQL Editor -> cole tudo -> Run.
-- ============================================================================

create table if not exists public.my_channels (
  id                  uuid primary key default gen_random_uuid(),
  channel_id          text not null unique,
  channel_name        text not null,
  channel_thumbnail   text,
  subscriber_count    bigint  not null default 0,
  view_count          bigint  not null default 0,
  video_count         integer not null default 0,
  added_at            timestamptz not null default now(),
  last_updated        timestamptz not null default now()
);

create table if not exists public.my_channel_video_cache (
  channel_id      text primary key
                  references public.my_channels(channel_id) on delete cascade,
  videos          jsonb       not null default '[]'::jsonb,
  channel_deleted boolean     not null default false,
  error           text,
  fetched_at      timestamptz not null default now()
);

alter table public.my_channels            enable row level security;
alter table public.my_channel_video_cache enable row level security;

drop policy if exists "public read my_channels" on public.my_channels;
create policy "public read my_channels"
  on public.my_channels for select
  to anon, authenticated
  using (true);

drop policy if exists "public read my_channel_video_cache" on public.my_channel_video_cache;
create policy "public read my_channel_video_cache"
  on public.my_channel_video_cache for select
  to anon, authenticated
  using (true);

notify pgrst, 'reload schema';
