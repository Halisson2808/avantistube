-- ============================================================================
-- Avantis Studio — Favoritar links de perfil
-- ----------------------------------------------------------------------------
-- Links favoritados aparecem primeiro na lista.
--
-- Como aplicar: Supabase Dashboard -> SQL Editor -> cole tudo -> Run.
-- ============================================================================

alter table public.social_links
  add column if not exists favorite boolean not null default false;

create index if not exists idx_social_links_favorite on public.social_links (favorite desc, added_at desc);

notify pgrst, 'reload schema';
