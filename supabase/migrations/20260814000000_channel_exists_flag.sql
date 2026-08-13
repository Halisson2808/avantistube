-- ============================================================================
-- Avantis Studio — Distingue "canal encerrado" de "canal ativo sem vídeos
-- públicos" (vídeos privados ou removidos, mas o canal continua existindo)
-- ----------------------------------------------------------------------------
-- Como aplicar: Supabase Dashboard -> SQL Editor -> cole tudo -> Run.
-- ============================================================================

alter table public.channel_video_cache
  add column if not exists channel_exists boolean not null default true;

alter table public.my_channel_video_cache
  add column if not exists channel_exists boolean not null default true;

notify pgrst, 'reload schema';
