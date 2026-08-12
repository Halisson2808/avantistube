-- ============================================================================
-- Avantis Studio — Links de perfil (TikTok/Instagram)
-- ----------------------------------------------------------------------------
-- Lista simples de links salvos: clicar abre o perfil, botão copia a URL.
-- Sem nicho, sem estatísticas — só um repositório de links.
--
-- Como aplicar: Supabase Dashboard -> SQL Editor -> cole tudo -> Run.
-- ============================================================================

create table if not exists public.social_links (
  id         uuid primary key default gen_random_uuid(),
  url        text not null,
  label      text,
  platform   text not null default 'other'
                    check (platform in ('tiktok', 'instagram', 'other')),
  added_at   timestamptz not null default now()
);

create index if not exists idx_social_links_added_at on public.social_links (added_at desc);

alter table public.social_links enable row level security;

drop policy if exists "public read social links" on public.social_links;
create policy "public read social links"
  on public.social_links for select
  to anon, authenticated
  using (true);

notify pgrst, 'reload schema';
