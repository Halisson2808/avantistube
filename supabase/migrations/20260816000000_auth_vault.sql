-- ============================================================================
-- Avantis Studio — Cofre 2FA e Contas (auth_vault)
-- ----------------------------------------------------------------------------
-- Armazena o cofre criptografado (AES-256-GCM Zero-Knowledge) diretamente
-- no Supabase para sincronizar automaticamente entre Localhost, Web e Celular.
--
-- Como aplicar: Supabase Dashboard -> SQL Editor -> cole tudo -> Run.
-- ============================================================================

create table if not exists public.auth_vault (
  id text primary key default 'default',
  ciphertext text not null,
  salt text not null,
  iv text not null,
  version int not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.auth_vault enable row level security;

drop policy if exists "public read/write auth vault" on public.auth_vault;
create policy "public read/write auth vault"
  on public.auth_vault for all
  to anon, authenticated
  using (true)
  with check (true);

notify pgrst, 'reload schema';
