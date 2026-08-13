-- ============================================================================
-- Avantis Studio — Meus Canais passa a usar a MESMA tabela do Monitoramento
-- ----------------------------------------------------------------------------
-- Em vez de manter uma tabela paralela (my_channels / my_channel_video_cache)
-- duplicando toda a lógica de busca/cache de vídeos, "Meus Canais" agora é só
-- um filtro visual sobre public.channels — mesma tabela, mesmo pipeline de
-- vídeos/estatísticas já testado no Monitoramento. A diferença é 100% na UI.
--
-- 1) Marca canais com is_own_channel (canal próprio, sem nicho/tags).
-- 2) Migra os dados que já existiam em my_channels / my_channel_video_cache.
-- 3) Remove as tabelas antigas.
--
-- Como aplicar: Supabase Dashboard -> SQL Editor -> cole tudo -> Run.
-- ============================================================================

alter table public.channels
  add column if not exists is_own_channel boolean not null default false;

create index if not exists idx_channels_is_own on public.channels (is_own_channel);

-- Migra os canais próprios já salvos (se a tabela antiga ainda existir).
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'my_channels') then
    insert into public.channels (channel_id, channel_name, channel_thumbnail, subscriber_count, view_count, video_count, content_type, is_own_channel, added_at, last_updated)
    select channel_id, channel_name, channel_thumbnail, subscriber_count, view_count, video_count, 'longform', true, added_at, last_updated
    from public.my_channels
    on conflict (channel_id) do update set is_own_channel = true;
  end if;

  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'my_channel_video_cache') then
    insert into public.channel_video_cache (channel_id, videos, channel_deleted, channel_exists, error, fetched_at)
    select channel_id, videos, channel_deleted, channel_exists, error, fetched_at
    from public.my_channel_video_cache
    on conflict (channel_id) do update set
      videos = excluded.videos,
      channel_deleted = excluded.channel_deleted,
      channel_exists = excluded.channel_exists,
      error = excluded.error,
      fetched_at = excluded.fetched_at;
  end if;
end $$;

drop table if exists public.my_channel_video_cache;
drop table if exists public.my_channels;

notify pgrst, 'reload schema';
