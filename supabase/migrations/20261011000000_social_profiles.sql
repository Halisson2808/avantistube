-- ============================================================================
-- Avantis Studio — Outras Redes (TikTok / Instagram / Facebook)
-- ----------------------------------------------------------------------------
-- Perfis monitorados fora do YouTube. Nome, foto e números vêm de scraping
-- da página pública (api/_social.mjs); a foto é copiada para o Storage porque
-- os links do CDN das redes expiram em poucos dias.
-- ============================================================================

create table if not exists public.social_profiles (
  id              uuid primary key default gen_random_uuid(),
  platform        text not null check (platform in ('tiktok', 'instagram', 'facebook')),
  username        text not null,
  url             text not null,
  display_name    text,
  avatar_url      text,
  followers       bigint,
  posts           bigint,
  likes           bigint,
  niche           text,
  fetch_error     text,
  last_fetched_at timestamptz,
  added_at        timestamptz not null default now(),
  unique (platform, username)
);

create index if not exists idx_social_profiles_added_at on public.social_profiles (added_at desc);

alter table public.social_profiles enable row level security;

-- Bucket público para as fotos de perfil
insert into storage.buckets (id, name, public)
values ('social-avatars', 'social-avatars', true)
on conflict (id) do nothing;

notify pgrst, 'reload schema';
