-- Fila de canais aguardando cota da API do YouTube.
-- Links adicionados enquanto a cota está esgotada ficam aqui até o botão "Adicionar da fila".
create table if not exists public.channel_queue (
  id           uuid primary key default gen_random_uuid(),
  input        text not null unique,
  niche        text,
  notes        text,
  content_type text not null default 'longform',
  last_error   text,
  created_at   timestamptz not null default now()
);

-- Acesso só pelo backend (service_role); sem policies para anon/authenticated.
alter table public.channel_queue enable row level security;

notify pgrst, 'reload schema';
