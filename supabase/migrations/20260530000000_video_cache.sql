-- ============================================================================
-- Avantis Studio — Cache de vídeos recentes no banco (sincroniza entre aparelhos)
-- ----------------------------------------------------------------------------
-- 1 linha por canal; os vídeos ficam num JSON. Substitui o antigo cache que
-- ficava só no navegador (localStorage). Agora: atualiza no PC -> aparece no
-- celular já com os dados e as thumbs.
--
-- Como aplicar: Supabase Dashboard -> SQL Editor -> cole tudo -> Run.
-- ============================================================================

create table if not exists public.channel_video_cache (
  channel_id      text primary key
                  references public.channels(channel_id) on delete cascade,
  videos          jsonb       not null default '[]'::jsonb,
  channel_deleted boolean     not null default false,
  error           text,
  fetched_at      timestamptz not null default now()
);

alter table public.channel_video_cache enable row level security;

drop policy if exists "public read video cache" on public.channel_video_cache;
create policy "public read video cache"
  on public.channel_video_cache for select
  to anon, authenticated
  using (true);

notify pgrst, 'reload schema';
