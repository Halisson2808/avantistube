-- ============================================================================
-- Avantis Studio — Analytics de sites e ofertas (rastreio de cliques / funil)
-- ----------------------------------------------------------------------------
-- Guarda os eventos enviados pelo pixel (/avantis-pixel.js) instalado nos sites
-- e nas páginas de oferta. Serve para montar funil, origem de tráfego (UTM),
-- ROI de anúncios e a lista de eventos ao vivo.
--
-- Escrita: apenas pelo backend (service_role, via /api/track).
-- Leitura: usuário logado no painel.
--
-- Como aplicar: Supabase Dashboard -> SQL Editor -> cole tudo -> Run.
-- ============================================================================

-- ── Sites / ofertas cadastradas ──────────────────────────────────────────────
create table if not exists public.tracking_sites (
  id          uuid primary key default gen_random_uuid(),
  site_key    text not null unique,
  name        text not null,
  domain      text,
  kind        text not null default 'organic'
                     check (kind in ('organic', 'paid', 'both')),
  notes       text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_tracking_sites_created_at
  on public.tracking_sites (created_at desc);

-- ── Eventos brutos (pageview, clique, lead, venda…) ──────────────────────────
create table if not exists public.tracking_events (
  id             uuid primary key default gen_random_uuid(),
  site_key       text not null,
  event_type     text not null default 'custom'
                        check (event_type in ('pageview', 'click', 'lead', 'purchase', 'custom')),
  event_name     text not null default 'evento',

  page_url       text,
  path           text,
  referrer       text,
  referrer_host  text,

  utm_source     text,
  utm_medium     text,
  utm_campaign   text,
  utm_content    text,
  utm_term       text,
  click_id       text,   -- fbclid / gclid / ttclid
  ad_network     text,   -- meta | google | tiktok | outro

  visitor_id     text,
  session_id     text,

  value          numeric(12, 2),
  currency       text default 'BRL',

  device         text,   -- desktop | mobile | tablet
  browser        text,
  os             text,
  country        text,
  language       text,
  user_agent     text,

  meta           jsonb   not null default '{}'::jsonb,
  created_at     timestamptz not null default now()
);

create index if not exists idx_tracking_events_site_created
  on public.tracking_events (site_key, created_at desc);
create index if not exists idx_tracking_events_type
  on public.tracking_events (site_key, event_type, created_at desc);
create index if not exists idx_tracking_events_session
  on public.tracking_events (session_id);
create index if not exists idx_tracking_events_campaign
  on public.tracking_events (site_key, utm_campaign);

-- ── Etapas do funil (configuráveis por site) ─────────────────────────────────
create table if not exists public.tracking_funnel_steps (
  id          uuid primary key default gen_random_uuid(),
  site_key    text not null,
  position    int  not null default 0,
  label       text not null,
  event_name  text not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_tracking_funnel_site
  on public.tracking_funnel_steps (site_key, position);

-- ── RLS: leitura para quem está logado; escrita só via service_role ──────────
alter table public.tracking_sites        enable row level security;
alter table public.tracking_events       enable row level security;
alter table public.tracking_funnel_steps enable row level security;

drop policy if exists "read tracking sites" on public.tracking_sites;
create policy "read tracking sites"
  on public.tracking_sites for select
  to authenticated
  using (true);

drop policy if exists "read tracking events" on public.tracking_events;
create policy "read tracking events"
  on public.tracking_events for select
  to authenticated
  using (true);

drop policy if exists "read tracking funnel" on public.tracking_funnel_steps;
create policy "read tracking funnel"
  on public.tracking_funnel_steps for select
  to authenticated
  using (true);

notify pgrst, 'reload schema';
