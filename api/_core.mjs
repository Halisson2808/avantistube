/**
 * api/_core.mjs — Núcleo compartilhado das rotas do Avantis Tube.
 *
 * Mesma lógica usada por:
 *   - server.mjs              (dev local, porta 3001)
 *   - api/[...path].mjs       (funções serverless no Vercel)
 *
 * Storage: Supabase (tabelas channels / channel_history) via service_role key.
 * YouTube: chamado diretamente com a YOUTUBE_API_KEY (fica só no servidor).
 *
 * Variáveis de ambiente esperadas:
 *   SUPABASE_URL ou VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   YOUTUBE_API_KEY ou VITE_YOUTUBE_API_KEY
 */

import { createClient } from "@supabase/supabase-js";

const YT_BASE = "https://www.googleapis.com/youtube/v3";

// ─── Clientes/segredos (lazy: lidos só quando usados) ──────────────────────────
let _sb = null;
function getSupabase() {
  if (_sb) return _sb;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase não configurado (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  }
  _sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return _sb;
}

function getYtKey() {
  const k = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY;
  if (!k) throw new Error("YOUTUBE_API_KEY não configurada no servidor.");
  return k;
}

// ─── Auth (verifica o token de login do Supabase) ──────────────────────────────
let _sbAnon = null;
function getSupabaseAnon() {
  if (_sbAnon) return _sbAnon;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase anon não configurado.");
  _sbAnon = createClient(url, key, { auth: { persistSession: false } });
  return _sbAnon;
}

/** Retorna o usuário se o token for válido, senão null. */
async function verifyUser(token) {
  if (!token) return null;
  let result;
  try {
    result = await getSupabaseAnon().auth.getUser(token);
  } catch (error) {
    throw new Error(`Serviço de autenticação temporariamente indisponível: ${error.message}`);
  }

  const { data, error } = result;
  if (error) {
    const status = Number(error.status) || 0;
    // Token inválido/expirado é falha real de autenticação. Timeout, rate
    // limit e erros 5xx são indisponibilidade e não devem expulsar o usuário.
    if (status >= 400 && status < 500 && status !== 408 && status !== 429) return null;
    throw new Error(`Serviço de autenticação temporariamente indisponível: ${error.message}`);
  }
  return data?.user || null;
}

// Rotas liberadas sem login: status e a ingestão do pixel, que roda em sites externos.
const PUBLIC_PATHS = ["/status", "/track"];

// ─── YouTube helpers ───────────────────────────────────────────────────────────
async function ytFetch(path) {
  const apiKey = getYtKey();
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${YT_BASE}${path}${sep}key=${apiKey}`);
  if (!res.ok) throw new Error(`YouTube API error ${res.status}: ${await res.text()}`);
  return res.json();
}

async function resolveChannelId(input) {
  if (/^UC[\w-]{22}$/.test(input)) return input;

  const urlChannel = input.match(/youtube\.com\/channel\/(UC[\w-]{22})/);
  if (urlChannel) return urlChannel[1];

  // Handles do YouTube podem conter ponto (ex.: @roamingearth.) — sem o "." na
  // classe de caracteres, o regex cortava o handle e resolvia outro canal.
  const handle = input.match(/@([\w.-]+)/)?.[1] || input.match(/youtube\.com\/@([\w.-]+)/)?.[1];
  if (handle) {
    const data = await ytFetch(`/channels?part=id&forHandle=@${handle}`);
    if (data.items?.[0]) return data.items[0].id;
  }

  const custom = input.match(/youtube\.com\/(?:c|user)\/([\w-]+)/)?.[1];
  if (custom) {
    const data = await ytFetch(`/channels?part=id&forUsername=${custom}`);
    if (data.items?.[0]) return data.items[0].id;
  }

  throw new Error("Não foi possível identificar o canal. Use o ID UCxxxx ou @handle.");
}

async function getChannelInfo(channelId) {
  const data = await ytFetch(`/channels?part=snippet,statistics&id=${channelId}`);
  const item = data.items?.[0];
  if (!item) throw new Error("Canal não encontrado");
  return {
    id: item.id,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails?.default?.url,
    subscriberCount: parseInt(item.statistics?.subscriberCount || "0"),
    viewCount: parseInt(item.statistics?.viewCount || "0"),
    videoCount: parseInt(item.statistics?.videoCount || "0"),
  };
}

/**
 * Busca os últimos vídeos de um canal.
 * "channelDown" = true tanto quando o canal foi encerrado/excluído (não resolve
 * mais no /channels) quanto quando o canal existe mas está sem nenhum vídeo
 * público (apagados ou deixados como privados) — nos dois casos não há nada
 * novo pra ver. "channelExists" distingue os dois: false = canal realmente
 * sumiu; true = canal continua no ar, só sem vídeos públicos no momento.
 */
async function getLatestVideos(channelId, maxResults = 7) {
  const chData = await ytFetch(`/channels?part=contentDetails&id=${channelId}`);
  const channelExists = !!chData.items?.[0];
  const uploadsId = chData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) return { videos: [], channelDown: true, channelExists };

  const plData = await ytFetch(`/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=${maxResults}`);
  const videoIds = plData.items?.map((i) => i.snippet.resourceId.videoId).join(",");
  if (!videoIds) return { videos: [], channelDown: true, channelExists: true };

  const vidData = await ytFetch(`/videos?part=snippet,statistics,contentDetails&id=${videoIds}`);
  const videos = (vidData.items || []).map((v) => ({
    videoId: v.id,
    title: v.snippet.title,
    thumbnailUrl: v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url,
    publishedAt: v.snippet.publishedAt,
    viewCount: parseInt(v.statistics?.viewCount || "0"),
    likeCount: parseInt(v.statistics?.likeCount || "0"),
    commentCount: parseInt(v.statistics?.commentCount || "0"),
    duration: v.contentDetails?.duration,
  }));
  return { videos, channelDown: videos.length === 0, channelExists: true };
}

// ─── Storage (Supabase) ─────────────────────────────────────────────────────────

/** Lê TODO o histórico, paginando (Supabase limita ~1000 linhas/consulta). */
async function fetchAllHistory(sb) {
  const pageSize = 1000;
  let from = 0;
  const all = [];
  for (;;) {
    const { data, error } = await sb
      .from("channel_history")
      .select("channel_id, recorded_at, subscriber_count, view_count, video_count")
      .order("recorded_at", { ascending: true })
      .range(from, from + pageSize - 1);
    if (error) throw new Error(error.message);
    all.push(...(data || []));
    if (!data || data.length < pageSize) break;
    from += pageSize;
  }
  return all;
}

/** Grava (ou atualiza) o ponto de HOJE no histórico de um canal. */
async function recordHistory(channelId, subscriberCount, viewCount, videoCount) {
  const sb = getSupabase();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const start = `${today}T00:00:00.000Z`;
  const end = `${today}T23:59:59.999Z`;

  const { data: existing } = await sb
    .from("channel_history")
    .select("id")
    .eq("channel_id", channelId)
    .gte("recorded_at", start)
    .lte("recorded_at", end)
    .limit(1);

  const entry = {
    channel_id: channelId,
    recorded_at: new Date().toISOString(),
    subscriber_count: subscriberCount,
    view_count: viewCount,
    video_count: videoCount,
  };

  if (existing && existing.length) {
    await sb.from("channel_history").update(entry).eq("id", existing[0].id);
  } else {
    await sb.from("channel_history").insert(entry);
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** channel_ids do YouTube são "UCxxxx" (nunca uuid) → distingue a coluna-alvo. */
function idColumn(id) {
  return UUID_RE.test(id) ? "id" : "channel_id";
}

// ─── Analytics de sites (pixel, funil, UTM) ───────────────────────────────────

/** GIF transparente 1x1 devolvido no beacon GET /track. */
const PIXEL_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

function str(v, max) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s ? s.slice(0, max) : null;
}

function slugify(s) {
  return String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30) || "site";
}

function randomToken(n) {
  const abc = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < n; i++) out += abc[Math.floor(Math.random() * abc.length)];
  return out;
}

function cleanDomain(v) {
  const s = str(v, 200);
  if (!s) return null;
  return s.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").toLowerCase();
}

function safeHost(url) {
  if (!url) return null;
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return null; }
}

function safePath(url) {
  if (!url) return null;
  try { return new URL(url).pathname || "/"; } catch { return null; }
}

function deviceFromUA(ua = "") {
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile";
  return ua ? "desktop" : null;
}

function browserFromUA(ua = "") {
  if (/Edg\//i.test(ua)) return "Edge";
  if (/OPR\/|Opera/i.test(ua)) return "Opera";
  if (/Chrome\//i.test(ua)) return "Chrome";
  if (/Safari\//i.test(ua)) return "Safari";
  if (/Firefox\//i.test(ua)) return "Firefox";
  return ua ? "Outro" : null;
}

function osFromUA(ua = "") {
  if (/Windows/i.test(ua)) return "Windows";
  if (/Android/i.test(ua)) return "Android";
  if (/iPhone|iPad|iOS/i.test(ua)) return "iOS";
  if (/Mac OS X/i.test(ua)) return "macOS";
  if (/Linux/i.test(ua)) return "Linux";
  return ua ? "Outro" : null;
}

function clampDays(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 7;
  return Math.min(Math.max(Math.round(n), 1), 365);
}

const DIA_MS = 24 * 60 * 60 * 1000;

/**
 * Período consultado. Aceita `days` (últimos N dias) ou o par `from`/`to`
 * (datas YYYY-MM-DD, inclusive nas duas pontas) vindo do seletor do painel.
 */
const HORA_MS = 60 * 60 * 1000;

/**
 * Fuso do navegador, em minutos, no formato de `Date#getTimezoneOffset()`
 * (Brasil = 180, porque UTC está 180 min à frente). Sem esse ajuste, "hoje" e
 * "as horas do dia" seriam contados em UTC — e um evento das 21h em Brasília
 * cairia no dia seguinte.
 */
function resolveTz(searchParams) {
  const n = Number(searchParams.get("tz"));
  return Number.isFinite(n) && Math.abs(n) <= 14 * 60 ? n : 0;
}

/** Instante UTC → Date deslocada para a hora local de quem está olhando. */
function paraLocal(iso, tzMin) {
  return new Date(new Date(iso).getTime() - tzMin * 60000);
}

function resolveRange(searchParams) {
  const from = (searchParams.get("from") || "").trim();
  const to = (searchParams.get("to") || "").trim();
  const tzMin = resolveTz(searchParams);
  const dataValida = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);

  if (dataValida(from) && dataValida(to)) {
    // Meia-noite LOCAL do primeiro dia até 23:59:59.999 local do último.
    const inicio = new Date(Date.parse(`${from}T00:00:00.000Z`) + tzMin * 60000);
    const fim = new Date(Date.parse(`${to}T23:59:59.999Z`) + tzMin * 60000);
    if (inicio <= fim) {
      // `fim` é 23:59:59.999 do último dia, então floor + 1 conta as duas pontas.
      const dias = Math.min(Math.floor((fim - inicio) / DIA_MS) + 1, 365);
      return {
        fromIso: inicio.toISOString(),
        toIso: fim.toISOString(),
        fromDate: from,
        toDate: to,
        days: dias,
        tzMin,
        // Um dia só vira gráfico por hora; vários dias, por dia.
        granularity: dias <= 1 ? "hour" : "day",
        custom: true,
      };
    }
  }

  const days = clampDays(searchParams.get("days"));
  const fim = new Date();

  // "24h": as últimas 24 horas corridas, terminando na hora atual — a hora de
  // agora fica sempre no fim do gráfico. As horas de ontem vão marcadas como
  // "ontem" no painel, para não parecer que o gráfico aponta para outro dia.
  if (days === 1) {
    const inicio = new Date(fim.getTime() - 23 * HORA_MS);
    inicio.setUTCMinutes(0, 0, 0);
    return {
      fromIso: inicio.toISOString(),
      toIso: fim.toISOString(),
      fromDate: paraLocal(inicio, tzMin).toISOString().slice(0, 10),
      toDate: paraLocal(fim, tzMin).toISOString().slice(0, 10),
      days: 1,
      tzMin,
      granularity: "hour",
      custom: false,
    };
  }

  // Começa na meia-noite local de (hoje - days + 1).
  const inicioLocal = paraLocal(new Date(fim.getTime() - (days - 1) * DIA_MS), tzMin);
  const diaLocal = inicioLocal.toISOString().slice(0, 10);
  const inicio = new Date(Date.parse(`${diaLocal}T00:00:00.000Z`) + tzMin * 60000);

  return {
    fromIso: inicio.toISOString(),
    toIso: fim.toISOString(),
    fromDate: diaLocal,
    toDate: paraLocal(fim, tzMin).toISOString().slice(0, 10),
    days,
    tzMin,
    granularity: "day",
    custom: false,
  };
}

/**
 * Cadastro automático de site.
 *
 * O pixel manda `siteName` junto com os eventos (atributo data-site-name da
 * tag). Na primeira visita de uma chave desconhecida, o site entra sozinho no
 * painel já com o nome certo — assim quem monta a oferta não precisa esperar
 * ninguém cadastrar nada à mão.
 *
 * Nunca derruba a ingestão: qualquer erro aqui é engolido, o evento já foi
 * gravado de qualquer jeito.
 */
const _sitesConhecidos = new Set();

function nomeAPartirDaChave(siteKey) {
  return String(siteKey)
    .replace(/-[a-z0-9]{4}$/, "")
    .split(/[-_]/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ") || siteKey;
}

async function ensureSite({ siteKey, name, url }) {
  if (_sitesConhecidos.has(siteKey)) return;

  try {
    const db = getSupabase();
    const { data } = await db
      .from("tracking_sites")
      .select("id, name, auto_created")
      .eq("site_key", siteKey)
      .limit(1);

    const existente = data && data[0];
    if (existente) {
      // Site criado automaticamente sem nome decente e agora chegou um nome de
      // verdade na tag: aproveita e corrige.
      if (existente.auto_created && name && name !== existente.name) {
        await db.from("tracking_sites").update({ name }).eq("id", existente.id);
      }
      _sitesConhecidos.add(siteKey);
      return;
    }

    await db.from("tracking_sites").insert({
      site_key: siteKey,
      name: name || nomeAPartirDaChave(siteKey),
      domain: safeHost(url),
      auto_created: true,
    });
    _sitesConhecidos.add(siteKey);
  } catch {
    /* silencioso: o evento importa mais que o cadastro */
  }
}

/**
 * Rotas selecionadas no painel (`?path=/,/sono`). Vazio = site inteiro.
 * O site é um só; as rotas são recortes dele.
 */
function resolvePaths(searchParams) {
  const bruto = searchParams.get("path") || searchParams.get("paths") || "";
  const lista = bruto
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  return lista.length ? lista : null;
}

/** Aplica o recorte de rotas sobre os eventos já lidos. */
function filtrarPorRota(rows, paths) {
  if (!paths) return rows;
  const set = new Set(paths);
  return rows.filter((r) => set.has(r.path || "/"));
}

/** Todas as rotas que apareceram no período — alimenta o seletor do painel. */
function rotasDisponiveis(rows) {
  const contagem = new Map();
  for (const r of rows) {
    const p = r.path || "/";
    contagem.set(p, (contagem.get(p) || 0) + 1);
  }
  return [...contagem.entries()]
    .map(([path, events]) => ({ path, events }))
    .sort((a, b) => b.events - a.events)
    .slice(0, 50);
}

/**
 * Tráfego de teste — validação de pixel, deploy, a própria IA conferindo a
 * instalação. Reconhecido por marcador em nome de evento ou UTM
 * (`teste_conexao`, `utm_campaign=validacao`…) e pelos ids de checagem de
 * deploy. Ids de sessão comuns NÃO entram na regra: são aleatórios e dariam
 * falso positivo.
 */
const MARCADOR_TESTE = /(^|[^a-z])(teste?s?|testing|validacao|validação|debug|demo|homolog)([^a-z]|$)/i;
const SESSAO_TESTE = /^(deploy-check|prod-check|demo-)/i;

function ehTeste(r) {
  if (SESSAO_TESTE.test(r.session_id || "") || SESSAO_TESTE.test(r.visitor_id || "")) return true;
  return [r.event_name, r.utm_source, r.utm_medium, r.utm_campaign, r.utm_content]
    .some((v) => v && MARCADOR_TESTE.test(String(v)));
}

/**
 * Remove a SESSÃO inteira que teve qualquer evento de teste — senão o pageview
 * e a rolagem da visita de validação continuariam contando.
 */
function separarTestes(rows) {
  const chaveSessao = (r) => r.session_id || r.visitor_id || r.id;
  const sessoesTeste = new Set();
  for (const r of rows) if (ehTeste(r)) sessoesTeste.add(chaveSessao(r));
  if (!sessoesTeste.size) return { rows, ocultas: 0 };
  return {
    rows: rows.filter((r) => !sessoesTeste.has(chaveSessao(r))),
    ocultas: sessoesTeste.size,
  };
}

/** Lê os eventos do período (limite alto o bastante para uso pessoal). */
async function fetchEvents({ siteKey, range }) {
  const db = getSupabase();
  let q = db
    .from("tracking_events")
    .select("*")
    .gte("created_at", range.fromIso)
    .lte("created_at", range.toIso)
    .order("created_at", { ascending: true })
    .limit(20000);
  if (siteKey) q = q.eq("site_key", siteKey);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data || [];
}

function topBy(rows, keyFn, limit = 8) {
  const map = new Map();
  for (const r of rows) {
    const key = keyFn(r) || "(direto)";
    const cur = map.get(key) || { name: key, events: 0, sessions: new Set(), value: 0 };
    cur.events += 1;
    if (r.session_id) cur.sessions.add(r.session_id);
    cur.value += Number(r.value) || 0;
    map.set(key, cur);
  }
  return [...map.values()]
    .map((v) => ({ name: v.name, events: v.events, sessions: v.sessions.size, value: v.value }))
    .sort((a, b) => b.events - a.events)
    .slice(0, limit);
}

/**
 * Marcos percentuais (rolagem, vídeo) reconstruídos a partir dos nomes de evento
 * — `rolagem_50`, `video_75`, `video_completo` — ou de `meta.percentual`.
 * Devolve quantas sessões chegaram em cada marco, em ordem crescente.
 */
function milestones(rows, prefixo) {
  const porMarco = new Map();

  for (const r of rows) {
    const nome = String(r.event_name || "");
    if (!nome.startsWith(prefixo)) continue;

    let pct = Number(r.meta && r.meta.percentual);
    if (!Number.isFinite(pct)) {
      const m = nome.match(/_(\d+)$/);
      if (m) pct = Number(m[1]);
      else if (/_(completo|complete)$/.test(nome)) pct = 100;
    }
    if (!Number.isFinite(pct)) continue;

    const cur = porMarco.get(pct) || { percent: pct, events: 0, sessions: new Set() };
    cur.events += 1;
    if (r.session_id) cur.sessions.add(r.session_id);
    porMarco.set(pct, cur);
  }

  return [...porMarco.values()]
    .map((v) => ({ percent: v.percent, events: v.events, sessions: v.sessions.size }))
    .sort((a, b) => a.percent - b.percent);
}

/** Média simples de um campo numérico guardado em meta. */
function mediaMeta(rows, campo) {
  const valores = rows
    .map((r) => Number(r.meta && r.meta[campo]))
    .filter((n) => Number.isFinite(n));
  if (!valores.length) return 0;
  return valores.reduce((s, n) => s + n, 0) / valores.length;
}

/** Monta os números do painel a partir dos eventos brutos. */
function buildOverview(rows, range, paths) {
  const days = range.days;
  const pageviews = rows.filter((r) => r.event_type === "pageview");
  const clicks = rows.filter((r) => r.event_type === "click");
  const leads = rows.filter((r) => r.event_type === "lead");
  const purchases = rows.filter((r) => r.event_type === "purchase");

  const visitors = new Set(rows.map((r) => r.visitor_id).filter(Boolean)).size;
  const sessions = new Set(rows.map((r) => r.session_id).filter(Boolean)).size;
  const revenue = purchases.reduce((s, r) => s + (Number(r.value) || 0), 0);

  // Série temporal. Em "24h" cada ponto é uma HORA (24 pontos, mesmo os
  // vazios); em períodos maiores, cada ponto é um dia. Sempre no fuso de quem
  // está olhando — senão as horas apareceriam deslocadas.
  const tz = range.tzMin || 0;
  const porHora = range.granularity === "hour";
  const passo = porHora ? HORA_MS : DIA_MS;

  /** Chave/rótulo do balde a que um instante pertence, já em hora local. */
  const chave = (iso) => {
    const local = paraLocal(iso, tz).toISOString();
    return porHora ? local.slice(0, 13) : local.slice(0, 10);
  };
  const rotulo = (k) => (porHora ? `${k.slice(11, 13)}h` : `${k.slice(8, 10)}/${k.slice(5, 7)}`);

  const byDay = new Map();
  const futuros = new Set();
  const inicioSerie = new Date(range.fromIso);
  const fimSerie = new Date(range.seriesEndIso || range.toIso);
  const agora = Date.now();
  const baldes = Math.min(
    Math.floor((fimSerie - inicioSerie) / passo) + 1,
    porHora ? 48 : 365,
  );
  for (let i = 0; i < baldes; i++) {
    const inicioBalde = inicioSerie.getTime() + i * passo;
    const k = chave(new Date(inicioBalde).toISOString());
    // Hora que ainda não chegou fica null: a linha para no "agora" em vez de
    // despencar para zero, e o eixo continua mostrando o dia inteiro.
    const futuro = inicioBalde > agora;
    if (futuro) futuros.add(k);
    const v = futuro ? null : 0;
    byDay.set(k, {
      date: k,
      // Dia local do balde: o painel usa para marcar "ontem" / "hoje".
      day: k.slice(0, 10),
      label: rotulo(k),
      pageviews: v, clicks: v, leads: v, purchases: v, revenue: v,
    });
  }
  for (const r of rows) {
    const d = chave(r.created_at);
    const bucket = byDay.get(d);
    if (!bucket || futuros.has(d)) continue;
    if (r.event_type === "pageview") bucket.pageviews += 1;
    else if (r.event_type === "click") bucket.clicks += 1;
    else if (r.event_type === "lead") bucket.leads += 1;
    else if (r.event_type === "purchase") {
      bucket.purchases += 1;
      bucket.revenue += Number(r.value) || 0;
    }
  }

  const saidas = rows.filter((r) => r.event_name === "saida_pagina");
  const saidaIntencao = rows.filter((r) => r.event_name === "saida_intencao");
  const custom = rows.filter((r) => r.event_type === "custom");

  return {
    days,
    range: {
      from: range.fromDate,
      to: range.toDate,
      custom: range.custom,
      granularity: range.granularity || "day",
    },
    // Rotas do site no período (independem do recorte atual) + o que está ativo.
    paths: paths || [],
    selectedPaths: null,
    totals: {
      events: rows.length,
      pageviews: pageviews.length,
      clicks: clicks.length,
      leads: leads.length,
      purchases: purchases.length,
      visitors,
      sessions,
      revenue,
      clickRate: pageviews.length ? clicks.length / pageviews.length : 0,
      conversionRate: sessions ? purchases.length / sessions : 0,
      // Engajamento, vindo do resumo enviado no fim de cada visita.
      avgSeconds: mediaMeta(saidas, "segundos"),
      avgScroll: mediaMeta(saidas, "rolagem"),
      exitIntents: saidaIntencao.length,
    },
    timeseries: [...byDay.values()],
    sources: topBy(rows, (r) => r.utm_source || r.referrer_host),
    campaigns: topBy(rows.filter((r) => r.utm_campaign), (r) => r.utm_campaign),
    pages: topBy(pageviews, (r) => r.path),
    devices: topBy(rows, (r) => r.device),
    topClicks: topBy(clicks, (r) => r.event_name),
    sites: topBy(rows, (r) => r.site_key),
    // Sinais de comportamento — a régua muda de site para site, então tudo que
    // o pixel mandar com nome de marco aparece aqui sem precisar mexer no código.
    scroll: milestones(rows, "rolagem"),
    video: milestones(rows, "video"),
    customEvents: topBy(custom, (r) => r.event_name, 15),
    // O resumo copiável para IA inclui também eventos menos frequentes, como
    // CTA final, pop-up e chegada à oferta — não apenas o top 20.
    allEvents: topBy(rows, (r) => r.event_name, 100),
  };
}

// ─── Handler principal ───────────────────────────────────────────────────────────
/**
 * @returns {Promise<{status:number, json?:any, buffer?:Buffer, contentType?:string, cacheControl?:string}>}
 */
export async function handleApiRequest({ method, pathname, searchParams, body, authToken }) {
  // normaliza: aceita "/api/x" ou "/x"
  const path = pathname.replace(/^\/api/, "") || "/";

  // ── Proteção: tudo que não é público exige login válido ────────────────────
  if (!PUBLIC_PATHS.includes(path)) {
    let user;
    try {
      user = await verifyUser(authToken);
    } catch (error) {
      return { status: 503, json: { error: error.message } };
    }
    if (!user) return { status: 401, json: { error: "Não autorizado. Faça login." } };
  }

  // ── Status ──────────────────────────────────────────────────────────────────
  if (path === "/status" && method === "GET") {
    return {
      status: 200,
      json: {
        status: "ok",
        version: "2.1.0",
        supabase: true,
        // Marcadores do que este backend implementa. Servem para conferir de
        // fora (sem login) se o deploy realmente subiu.
        features: ["analytics", "track", "route-filter", "auto-site", "date-range"],
      },
    };
  }

  // ── Canais ────────────────────────────────────────────────────────────────────
  if (path === "/channels" && method === "GET") {
    const db = getSupabase();
    // Ordena do mais novo para o mais antigo (added_at DESC)
    const { data: channels, error } = await db.from("channels").select("*").order("added_at", { ascending: false });
    if (error) throw new Error(error.message);

    const now = Date.now();
    const eightDaysMs = 8 * 24 * 60 * 60 * 1000;
    const cutoffDate = new Date(now - eightDaysMs).toISOString();

    // Busca apenas o histórico recente dos últimos 8 dias em vez de ler a tabela inteira
    let histRows = [];
    try {
      const { data: recentHist } = await db
        .from("channel_history")
        .select("channel_id, recorded_at, subscriber_count, view_count, video_count")
        .gte("recorded_at", cutoffDate)
        .order("recorded_at", { ascending: true })
        .limit(3000);
      histRows = recentHist || [];
    } catch {
      histRows = [];
    }

    const histByChannel = new Map();
    for (const r of histRows) {
      if (!histByChannel.has(r.channel_id)) histByChannel.set(r.channel_id, []);
      histByChannel.get(r.channel_id).push(r);
    }

    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const cutoff = now - sevenDaysMs;

    const enriched = (channels || []).map((ch) => {
      const records = histByChannel.get(ch.channel_id) || [];
      let baseline = null;
      for (let i = records.length - 1; i >= 0; i--) {
        if (new Date(records[i].recorded_at).getTime() <= cutoff) {
          baseline = records[i];
          break;
        }
      }
      if (!baseline && records.length > 0) baseline = records[0];

      const subsDelta = baseline ? ch.subscriber_count - baseline.subscriber_count : 0;
      const viewsDelta = baseline ? ch.view_count - baseline.view_count : 0;
      return {
        ...ch,
        subscribers_last_7_days: subsDelta,
        views_last_7_days: viewsDelta,
        is_exploding: subsDelta > 1000 || viewsDelta > 50000,
      };
    });

    return { status: 200, json: enriched };
  }

  if (path === "/channels" && method === "POST") {
    const db = getSupabase();
    const channelId = await resolveChannelId(body.channelInput || body.channelId);

    const { data: dup } = await db.from("channels").select("*").eq("channel_id", channelId).limit(1);
    if (dup && dup.length) {
      // "Meus Canais" e "Monitoramento" compartilham a mesma tabela. Se o
      // canal já estiver no monitoramento, salvá-lo como próprio deve movê-lo
      // para a outra lista — não acusar duplicidade e deixá-lo invisível.
      if (body.isOwnChannel) {
        const { data: moved, error } = await db
          .from("channels")
          .update({ is_own_channel: true, niche: null, last_updated: new Date().toISOString() })
          .eq("channel_id", channelId)
          .select()
          .single();
        if (error) throw new Error(error.message);
        return { status: 200, json: { channel: moved, moved: true } };
      }
      return { status: 409, json: { error: "already being monitored" } };
    }

    const info = await getChannelInfo(channelId);
    const nowIso = new Date().toISOString();
    const row = {
      channel_id: channelId,
      channel_name: info.title,
      channel_thumbnail: info.thumbnail,
      subscriber_count: info.subscriberCount,
      view_count: info.viewCount,
      video_count: info.videoCount,
      niche: body.niche || null,
      notes: body.notes || null,
      content_type: body.contentType || "longform",
      is_own_channel: !!body.isOwnChannel,
      added_at: nowIso,
      last_updated: nowIso,
    };
    const { data: inserted, error } = await db.from("channels").insert(row).select().single();
    if (error) throw new Error(error.message);

    await recordHistory(channelId, info.subscriberCount, info.viewCount, info.videoCount);
    return { status: 201, json: { channel: inserted } };
  }

  if (path.startsWith("/channels/") && path.endsWith("/move-to-own") && method === "POST") {
    const db = getSupabase();
    const channelId = decodeURIComponent(path.split("/")[2]);
    const { data, error } = await db
      .from("channels")
      .update({ is_own_channel: true, niche: null, last_updated: new Date().toISOString() })
      .eq(idColumn(channelId), channelId)
      .select()
      .single();
    if (error) return { status: 404, json: { error: error.message } };
    return { status: 200, json: { channel: data } };
  }

  if (path.startsWith("/channels/") && method === "PUT") {
    const db = getSupabase();
    const id = decodeURIComponent(path.split("/")[2]);
    const updates = { ...body, last_updated: new Date().toISOString() };
    const { data, error } = await db.from("channels").update(updates).eq(idColumn(id), id).select().single();
    if (error) return { status: 404, json: { error: error.message } };
    return { status: 200, json: data };
  }

  if (path.startsWith("/channels/") && method === "DELETE") {
    const db = getSupabase();
    const id = decodeURIComponent(path.split("/")[2]);
    // o histórico some por ON DELETE CASCADE
    const { error } = await db.from("channels").delete().eq(idColumn(id), id);
    if (error) throw new Error(error.message);
    return { status: 200, json: { ok: true } };
  }

  // ── Links de perfil (TikTok/Instagram) ───────────────────────────────────────
  if (path === "/social-links" && method === "GET") {
    const db = getSupabase();
    const { data, error } = await db
      .from("social_links")
      .select("*")
      .neq("label", "__VAULT_PAYLOAD__")
      .order("favorite", { ascending: false })
      .order("added_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { status: 200, json: data || [] };
  }

  if (path === "/social-links" && method === "POST") {
    const url = (body.url || "").trim();
    if (!url) return { status: 400, json: { error: "Missing url" } };

    const platform = /tiktok\.com/i.test(url) ? "tiktok" : /instagram\.com/i.test(url) ? "instagram" : "other";
    const db = getSupabase();
    const row = {
      url,
      label: body.label?.trim() || null,
      platform,
    };
    const { data, error } = await db.from("social_links").insert(row).select().single();
    if (error) throw new Error(error.message);
    return { status: 201, json: data };
  }

  if (path.startsWith("/social-links/") && method === "PUT") {
    const db = getSupabase();
    const id = decodeURIComponent(path.split("/")[2]);
    const updates = {};
    if (body.favorite !== undefined) updates.favorite = !!body.favorite;
    if (body.label !== undefined) updates.label = body.label;
    const { data, error } = await db.from("social_links").update(updates).eq("id", id).select().single();
    if (error) return { status: 404, json: { error: error.message } };
    return { status: 200, json: data };
  }

  if (path.startsWith("/social-links/") && method === "DELETE") {
    const db = getSupabase();
    const id = decodeURIComponent(path.split("/")[2]);
    const { error } = await db.from("social_links").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { status: 200, json: { ok: true } };
  }

  // ── Histórico ───────────────────────────────────────────────────────────────
  if (path === "/history" && method === "GET") {
    // histórico completo, no formato { channelId: [pontos...] } (usado em Exportar)
    const db = getSupabase();
    const rows = await fetchAllHistory(db);
    const grouped = {};
    for (const r of rows) {
      (grouped[r.channel_id] ||= []).push({
        recorded_at: r.recorded_at,
        subscriber_count: r.subscriber_count,
        view_count: r.view_count,
        video_count: r.video_count,
      });
    }
    return { status: 200, json: grouped };
  }

  if (path.startsWith("/history/") && method === "GET") {
    const db = getSupabase();
    const channelId = decodeURIComponent(path.split("/")[2]);
    const { data, error } = await db
      .from("channel_history")
      .select("channel_id, recorded_at, subscriber_count, view_count, video_count")
      .eq("channel_id", channelId)
      .order("recorded_at", { ascending: true });
    if (error) throw new Error(error.message);
    return { status: 200, json: data || [] };
  }

  // ── YouTube ───────────────────────────────────────────────────────────────────
  if (path === "/youtube/channel" && method === "GET") {
    const channelId = searchParams.get("channelId");
    if (!channelId) return { status: 400, json: { error: "Missing channelId" } };

    const info = await getChannelInfo(channelId);
    const db = getSupabase();
    await db
      .from("channels")
      .update({
        subscriber_count: info.subscriberCount,
        view_count: info.viewCount,
        video_count: info.videoCount,
        last_updated: new Date().toISOString(),
      })
      .eq("channel_id", channelId);

    await recordHistory(channelId, info.subscriberCount, info.viewCount, info.videoCount);
    return { status: 200, json: info };
  }

  if (path === "/youtube/videos" && method === "GET") {
    const channelId = searchParams.get("channelId");
    const max = parseInt(searchParams.get("max") || "7");
    if (!channelId) return { status: 400, json: { error: "Missing channelId" } };
    const { videos, channelDown, channelExists } = await getLatestVideos(channelId, max);
    return { status: 200, json: { channelId, videos, success: true, channelDown, channelExists } };
  }

  if (path === "/youtube/search" && method === "GET") {
    const q = searchParams.get("q");
    if (!q) return { status: 400, json: { error: "Missing q" } };
    const maxResults = searchParams.get("max") || "10";
    const order = searchParams.get("order") || "relevance";
    const videoDefinition = searchParams.get("videoDefinition");
    const publishedAfter = searchParams.get("publishedAfter");
    const publishedBefore = searchParams.get("publishedBefore");
    const relevanceLanguage = searchParams.get("relevanceLanguage");
    const regionCode = searchParams.get("regionCode");

    let searchPath = `/search?part=snippet&type=video&q=${encodeURIComponent(q)}&maxResults=${maxResults}&order=${order}`;
    if (videoDefinition) searchPath += `&videoDefinition=${videoDefinition}`;
    if (publishedAfter) searchPath += `&publishedAfter=${encodeURIComponent(publishedAfter)}`;
    if (publishedBefore) searchPath += `&publishedBefore=${encodeURIComponent(publishedBefore)}`;
    if (relevanceLanguage) searchPath += `&relevanceLanguage=${relevanceLanguage}`;
    if (regionCode) searchPath += `&regionCode=${regionCode}`;

    const searchData = await ytFetch(searchPath);
    const videoIds = (searchData.items || []).map((i) => i.id?.videoId).filter(Boolean);
    if (videoIds.length === 0) return { status: 200, json: [] };

    const videosData = await ytFetch(`/videos?part=snippet,statistics,contentDetails&id=${videoIds.join(",")}`);
    const videoItems = videosData.items || [];

    const channelIds = [...new Set(videoItems.map((v) => v.snippet.channelId))];
    const channelsData = await ytFetch(`/channels?part=snippet,statistics&id=${channelIds.join(",")}`);
    const channelById = new Map((channelsData.items || []).map((c) => [c.id, c]));

    const results = videoIds
      .map((id) => videoItems.find((v) => v.id === id))
      .filter(Boolean)
      .map((v) => {
        const channel = channelById.get(v.snippet.channelId);
        return {
          id: v.id,
          title: v.snippet.title,
          description: v.snippet.description,
          thumbnail: v.snippet.thumbnails?.high?.url || v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url,
          channelTitle: v.snippet.channelTitle,
          channelId: v.snippet.channelId,
          channelCreatedAt: channel?.snippet?.publishedAt,
          publishedAt: v.snippet.publishedAt,
          viewCount: v.statistics?.viewCount || "0",
          likeCount: v.statistics?.likeCount || "0",
          duration: v.contentDetails?.duration || "PT0S",
          subscriberCount: channel?.statistics?.subscriberCount || "0",
        };
      });

    return { status: 200, json: results };
  }

  // ── Cache de vídeos recentes (sincroniza entre aparelhos) ──────────────────
  if (path === "/videos" && method === "GET") {
    const db = getSupabase();
    const { data, error } = await db
      .from("channel_video_cache")
      .select("channel_id, videos, channel_deleted, channel_exists, error, fetched_at");
    if (error) throw new Error(error.message);
    const grouped = {};
    for (const row of data || []) {
      grouped[row.channel_id] = {
        channelId: row.channel_id,
        videos: row.videos || [],
        lastFetched: row.fetched_at,
        channelDeleted: row.channel_deleted,
        channelExists: row.channel_exists,
        error: row.error || undefined,
      };
    }
    return { status: 200, json: grouped };
  }

  if (path === "/videos" && method === "POST") {
    const db = getSupabase();
    const { channelId, videos = [], channelDeleted = false, channelExists = true, error = null } = body;
    if (!channelId) return { status: 400, json: { error: "channelId é obrigatório" } };
    const { error: upErr } = await db.from("channel_video_cache").upsert(
      {
        channel_id: channelId,
        videos: videos.slice(0, 7),
        channel_deleted: channelDeleted,
        channel_exists: channelExists,
        error,
        fetched_at: new Date().toISOString(),
      },
      { onConflict: "channel_id" }
    );
    if (upErr) throw new Error(upErr.message);
    return { status: 200, json: { ok: true } };
  }

  if (path.startsWith("/videos/") && method === "DELETE") {
    const db = getSupabase();
    const channelId = decodeURIComponent(path.split("/")[2]);
    const { error } = await db.from("channel_video_cache").delete().eq("channel_id", channelId);
    if (error) throw new Error(error.message);
    return { status: 200, json: { ok: true } };
  }

  // ── Analytics de sites (rastreio de cliques / funil) ─────────────────────────
  if (path === "/analytics/sites" && method === "GET") {
    const db = getSupabase();
    const { data, error } = await db
      .from("tracking_sites")
      .select("id, site_key, name, domain, notes, auto_created, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { status: 200, json: data || [] };
  }

  if (path === "/analytics/sites" && method === "POST") {
    const db = getSupabase();
    const name = String(body.name || "").trim();
    if (!name) return { status: 400, json: { error: "Informe o nome do site." } };
    const siteKey = String(body.siteKey || "").trim() || slugify(name) + "-" + randomToken(4);

    const { data: dup } = await db
      .from("tracking_sites").select("id").eq("site_key", siteKey).limit(1);
    if (dup && dup.length) return { status: 409, json: { error: "Já existe um site com essa chave." } };

    const { data, error } = await db
      .from("tracking_sites")
      .insert({
        site_key: siteKey,
        name,
        domain: cleanDomain(body.domain),
        notes: body.notes || null,
      })
      .select("id, site_key, name, domain, notes, auto_created, created_at")
      .single();
    if (error) throw new Error(error.message);
    return { status: 201, json: data };
  }

  if (path.startsWith("/analytics/sites/") && method === "PUT") {
    const db = getSupabase();
    const id = decodeURIComponent(path.split("/")[3]);
    const patch = {};
    if (body.name !== undefined) {
      patch.name = String(body.name).trim();
      // Nome ajustado à mão passa a valer sobre o que o pixel manda na tag.
      patch.auto_created = false;
    }
    if (body.domain !== undefined) patch.domain = cleanDomain(body.domain);
    if (body.notes !== undefined) patch.notes = body.notes || null;
    const { error } = await db.from("tracking_sites").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { status: 200, json: { ok: true } };
  }

  if (path.startsWith("/analytics/sites/") && method === "DELETE") {
    const db = getSupabase();
    const id = decodeURIComponent(path.split("/")[3]);
    const { data: site } = await db.from("tracking_sites").select("site_key").eq("id", id).single();
    const { error } = await db.from("tracking_sites").delete().eq("id", id);
    if (error) throw new Error(error.message);
    if (site?.site_key) {
      await db.from("tracking_events").delete().eq("site_key", site.site_key);
      await db.from("tracking_funnel_steps").delete().eq("site_key", site.site_key);
    }
    return { status: 200, json: { ok: true } };
  }

  // Leads identificados e respostas dos quizzes. A leitura é separada do
  // pixel: um mesmo site pode ter vários funis e cada funil pertence a um
  // nicho, impedindo que operações diferentes sejam misturadas no painel.
  if (path === "/analytics/quiz-leads" && method === "GET") {
    const db = getSupabase();
    const nicheKey = String(searchParams.get("niche") || "").trim();
    const funnelKey = String(searchParams.get("funnel") || "").trim();
    const search = String(searchParams.get("search") || "").trim().slice(0, 80);
    const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 200, 1), 500);

    const { data: niches, error: nichesError } = await db
      .from("quiz_niches")
      .select("id, niche_key, name")
      .order("name");
    if (nichesError) throw new Error(nichesError.message);

    const { data: funnels, error: funnelsError } = await db
      .from("quiz_funnels")
      .select("id, niche_id, funnel_key, name, version")
      .order("name");
    if (funnelsError) throw new Error(funnelsError.message);

    const nicheById = new Map((niches || []).map((n) => [n.id, n]));
    const funnelById = new Map((funnels || []).map((f) => [f.id, f]));
    let allowedFunnels = funnels || [];
    if (nicheKey) {
      const nicheIds = new Set((niches || []).filter((n) => n.niche_key === nicheKey).map((n) => n.id));
      allowedFunnels = allowedFunnels.filter((f) => nicheIds.has(f.niche_id));
    }
    if (funnelKey) allowedFunnels = allowedFunnels.filter((f) => f.funnel_key === funnelKey);

    if ((nicheKey || funnelKey) && !allowedFunnels.length) {
      return {
        status: 200,
        json: {
          niches: (niches || []).map((n) => ({ id: n.id, key: n.niche_key, name: n.name })),
          funnels: (funnels || []).map((f) => ({ id: f.id, key: f.funnel_key, name: f.name, version: f.version, nicheId: f.niche_id })),
          leads: [],
        },
      };
    }

    let leadsQuery = db
      .from("quiz_leads")
      .select("id, funnel_id, name, phone, email, consent_whatsapp, source, status, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (nicheKey || funnelKey) leadsQuery = leadsQuery.in("funnel_id", allowedFunnels.map((f) => f.id));
    if (search) {
      const safe = search.replace(/[%_,]/g, " ");
      leadsQuery = leadsQuery.or(`name.ilike.%${safe}%,phone.ilike.%${safe}%,email.ilike.%${safe}%`);
    }
    const { data: leads, error: leadsError } = await leadsQuery;
    if (leadsError) throw new Error(leadsError.message);

    const leadIds = (leads || []).map((lead) => lead.id);
    let attempts = [];
    if (leadIds.length) {
      const { data, error } = await db
        .from("quiz_attempts")
        .select("id, lead_id, funnel_id, result_key, result_label, started_at, completed_at")
        .in("lead_id", leadIds)
        .order("started_at", { ascending: false });
      if (error) throw new Error(error.message);
      attempts = data || [];
    }

    const attemptIds = attempts.map((attempt) => attempt.id);
    let answers = [];
    if (attemptIds.length) {
      const { data, error } = await db
        .from("quiz_answers")
        .select("id, attempt_id, question_key, question_label, answer_key, answer_label, answer_value, position")
        .in("attempt_id", attemptIds)
        .order("position", { ascending: true });
      if (error) throw new Error(error.message);
      answers = data || [];
    }

    const answersByAttempt = new Map();
    for (const answer of answers) {
      if (!answersByAttempt.has(answer.attempt_id)) answersByAttempt.set(answer.attempt_id, []);
      answersByAttempt.get(answer.attempt_id).push({
        id: answer.id,
        questionKey: answer.question_key,
        questionLabel: answer.question_label,
        answerKey: answer.answer_key,
        answerLabel: answer.answer_label,
        answerValue: answer.answer_value,
        position: answer.position,
      });
    }

    const attemptsByLead = new Map();
    for (const attempt of attempts) {
      if (!attemptsByLead.has(attempt.lead_id)) attemptsByLead.set(attempt.lead_id, []);
      attemptsByLead.get(attempt.lead_id).push({
        id: attempt.id,
        resultKey: attempt.result_key,
        resultLabel: attempt.result_label,
        startedAt: attempt.started_at,
        completedAt: attempt.completed_at,
        answers: answersByAttempt.get(attempt.id) || [],
      });
    }

    const result = (leads || []).map((lead) => {
      const funnel = funnelById.get(lead.funnel_id);
      const niche = funnel ? nicheById.get(funnel.niche_id) : null;
      return {
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        consentWhatsapp: lead.consent_whatsapp,
        source: lead.source,
        status: lead.status,
        createdAt: lead.created_at,
        updatedAt: lead.updated_at,
        niche: niche
          ? { id: niche.id, key: niche.niche_key, name: niche.name }
          : { id: "", key: "sem-nicho", name: "Sem nicho" },
        funnel: funnel
          ? { id: funnel.id, key: funnel.funnel_key, name: funnel.name, version: funnel.version }
          : { id: "", key: "sem-funil", name: "Sem funil", version: "" },
        attempts: attemptsByLead.get(lead.id) || [],
      };
    });

    return {
      status: 200,
      json: {
        niches: (niches || []).map((n) => ({ id: n.id, key: n.niche_key, name: n.name })),
        funnels: (funnels || []).map((f) => ({ id: f.id, key: f.funnel_key, name: f.name, version: f.version, nicheId: f.niche_id })),
        leads: result,
      },
    };
  }

  // Visão geral: totais, série temporal, origens, campanhas, páginas, aparelhos.
  if (path === "/analytics/overview" && method === "GET") {
    const range = resolveRange(searchParams);
    const siteKey = searchParams.get("site") || null;
    const paths = resolvePaths(searchParams);
    const lidas = await fetchEvents({ siteKey, range });
    const { rows: todas, ocultas } = searchParams.get("hideTests") === "1"
      ? separarTestes(lidas)
      : { rows: lidas, ocultas: 0 };
    const rows = filtrarPorRota(todas, paths);
    const json = buildOverview(rows, range, rotasDisponiveis(todas));
    json.selectedPaths = paths;
    json.hiddenTestSessions = ocultas;
    return { status: 200, json };
  }

  // Funil: etapas configuradas (ou padrão) + taxa de conversão entre elas.
  if (path === "/analytics/funnel" && method === "GET") {
    const db = getSupabase();
    const range = resolveRange(searchParams);
    const siteKey = searchParams.get("site") || null;

    let steps = [];
    if (siteKey) {
      const { data } = await db
        .from("tracking_funnel_steps")
        .select("*")
        .eq("site_key", siteKey)
        .order("position", { ascending: true });
      steps = data || [];
    }

    const lidas = await fetchEvents({ siteKey, range });
    const { rows: semTeste, ocultas } = searchParams.get("hideTests") === "1"
      ? separarTestes(lidas)
      : { rows: lidas, ocultas: 0 };
    const rows = filtrarPorRota(semTeste, resolvePaths(searchParams));

    if (!steps.length) {
      // Funil padrão de página de oferta: entrou → leu → clicou no checkout →
      // comprou. Vale para qualquer site com o pixel instalado, sem configurar
      // nada; quem quiser detalhar troca as etapas no painel.
      steps = [
        { label: "Entrou", event_name: "pageview", position: 0 },
        { label: "Rolou a página", event_name: "rolagem_50", position: 1 },
        { label: "Foi pro checkout", event_name: "click", position: 2 },
        { label: "Comprou", event_name: "purchase", position: 3 },
      ];
    }

    const result = steps.map((s) => {
      const matched = rows.filter(
        (r) => r.event_name === s.event_name || r.event_type === s.event_name
      );
      const sessions = new Set(matched.map((r) => r.session_id || r.id)).size;
      return {
        label: s.label,
        eventName: s.event_name,
        events: matched.length,
        sessions,
        value: matched.reduce((sum, r) => sum + (Number(r.value) || 0), 0),
      };
    });

    return {
      status: 200,
      json: {
        days: range.days,
        range: { from: range.fromDate, to: range.toDate, custom: range.custom },
        steps: result,
        hiddenTestSessions: ocultas,
      },
    };
  }

  if (path === "/analytics/funnel-steps" && method === "POST") {
    const db = getSupabase();
    const siteKey = String(body.siteKey || "").trim();
    if (!siteKey) return { status: 400, json: { error: "siteKey obrigatório." } };
    const steps = Array.isArray(body.steps) ? body.steps : [];
    await db.from("tracking_funnel_steps").delete().eq("site_key", siteKey);
    if (steps.length) {
      const rows = steps.map((s, i) => ({
        site_key: siteKey,
        position: i,
        label: String(s.label || `Etapa ${i + 1}`),
        event_name: String(s.eventName || s.event_name || "pageview"),
      }));
      const { error } = await db.from("tracking_funnel_steps").insert(rows);
      if (error) throw new Error(error.message);
    }
    return { status: 200, json: { ok: true } };
  }

  // Visitas para "Eventos ao Vivo": uma linha por sessão, com a lista de tudo o
  // que a pessoa fez dentro. Evita que uma visita rolando a página vire uma
  // parede de linhas soltas.
  if (path === "/analytics/sessions" && method === "GET") {
    const db = getSupabase();
    const limite = Math.min(Number(searchParams.get("limit")) || 100, 300);
    const siteKey = searchParams.get("site") || null;
    const range = resolveRange(searchParams);
    const paths = resolvePaths(searchParams);

    let q = db
      .from("tracking_events")
      .select("id, site_key, event_type, event_name, path, referrer_host, utm_source, utm_medium, utm_campaign, utm_content, visitor_id, session_id, value, device, browser, os, created_at")
      .gte("created_at", range.fromIso)
      .lte("created_at", range.toIso)
      .order("created_at", { ascending: false })
      .limit(5000);
    if (siteKey) q = q.eq("site_key", siteKey);
    if (paths) q = q.in("path", paths);

    const { data, error } = await q;
    if (error) throw new Error(error.message);

    const porSessao = new Map();
    for (const ev of data || []) {
      const id = ev.session_id || ev.visitor_id || ev.id;
      if (!porSessao.has(id)) porSessao.set(id, []);
      porSessao.get(id).push(ev);
    }

    const sessoes = [...porSessao.entries()]
      .map(([id, evs]) => {
        evs.sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
        const primeiro = evs[0];
        const ultimo = evs[evs.length - 1];
        const comOrigem = evs.find((e) => e.utm_source || e.referrer_host);
        const tipos = {};
        for (const e of evs) tipos[e.event_type] = (tipos[e.event_type] || 0) + 1;
        return {
          id,
          visitorId: primeiro.visitor_id || null,
          siteKey: primeiro.site_key,
          startedAt: primeiro.created_at,
          lastAt: ultimo.created_at,
          entryPath: primeiro.path || "/",
          paths: [...new Set(evs.map((e) => e.path || "/"))],
          source: comOrigem ? comOrigem.utm_source || comOrigem.referrer_host : null,
          campaign: evs.find((e) => e.utm_campaign)?.utm_campaign || null,
          device: primeiro.device || null,
          browser: primeiro.browser || null,
          os: primeiro.os || null,
          eventCount: evs.length,
          types: tipos,
          value: evs
            .filter((e) => e.event_type === "purchase")
            .reduce((sum, e) => sum + (Number(e.value) || 0), 0),
          converted: evs.some((e) => e.event_type === "purchase"),
          isTest: evs.some(ehTeste),
          events: evs,
        };
      })
      .sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1))
      .slice(0, limite);

    return { status: 200, json: sessoes };
  }

  // Eventos recentes (lista ao vivo).
  if (path === "/analytics/events" && method === "GET") {
    const db = getSupabase();
    const limit = Math.min(Number(searchParams.get("limit")) || 100, 500);
    const siteKey = searchParams.get("site") || null;
    let q = db
      .from("tracking_events")
      .select("id, site_key, event_type, event_name, page_url, path, referrer_host, utm_source, utm_medium, utm_campaign, utm_content, visitor_id, session_id, value, currency, device, browser, os, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (siteKey) q = q.eq("site_key", siteKey);

    // Mesmos recortes do resto do painel: período, rota e nome do evento.
    const range = resolveRange(searchParams);
    q = q.gte("created_at", range.fromIso).lte("created_at", range.toIso);

    const paths = resolvePaths(searchParams);
    if (paths) q = q.in("path", paths);

    const eventName = searchParams.get("event");
    if (eventName) q = q.eq("event_name", eventName);

    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return { status: 200, json: data || [] };
  }

  // ── Ingestão pública do pixel ────────────────────────────────────────────────
  if (path === "/track" && (method === "POST" || method === "GET")) {
    const raw = method === "POST" ? body : Object.fromEntries(searchParams.entries());
    const siteKey = String(raw.siteKey || raw.s || "").trim();
    if (!siteKey) return { status: 400, json: { error: "siteKey obrigatório." } };

    const eventName = String(raw.eventName || raw.e || "pageview").slice(0, 80);
    const eventType = ["pageview", "click", "lead", "purchase", "custom"].includes(raw.eventType)
      ? raw.eventType
      : ["pageview", "click", "lead", "purchase"].includes(eventName)
        ? eventName
        : "custom";

    const pageUrl = str(raw.url, 1000);
    const referrer = str(raw.referrer, 1000);
    const ua = str(raw.userAgent, 500);

    const row = {
      site_key: siteKey,
      event_type: eventType,
      event_name: eventName,
      page_url: pageUrl,
      path: str(raw.path, 500) || safePath(pageUrl),
      referrer,
      referrer_host: safeHost(referrer),
      utm_source: str(raw.utmSource, 200),
      utm_medium: str(raw.utmMedium, 200),
      utm_campaign: str(raw.utmCampaign, 200),
      utm_content: str(raw.utmContent, 200),
      utm_term: str(raw.utmTerm, 200),
      visitor_id: str(raw.visitorId, 80),
      session_id: str(raw.sessionId, 80),
      value: raw.value !== undefined && raw.value !== "" ? Number(raw.value) || 0 : null,
      currency: str(raw.currency, 10) || "BRL",
      device: str(raw.device, 20) || deviceFromUA(ua),
      browser: str(raw.browser, 40) || browserFromUA(ua),
      os: str(raw.os, 40) || osFromUA(ua),
      country: str(raw.country, 5),
      language: str(raw.language, 20),
      user_agent: ua,
      meta: typeof raw.meta === "object" && raw.meta ? raw.meta : {},
    };

    const { error } = await getSupabase().from("tracking_events").insert(row);
    if (error) throw new Error(error.message);

    // Site novo entra sozinho no painel, com o nome que veio na tag.
    await ensureSite({
      siteKey,
      name: str(raw.siteName, 120),
      url: pageUrl,
    });

    // GET = beacon via <img>: devolve um GIF 1x1 transparente.
    if (method === "GET") {
      return {
        status: 200,
        buffer: PIXEL_GIF,
        contentType: "image/gif",
        cacheControl: "no-store, no-cache, must-revalidate",
      };
    }
    return { status: 200, json: { ok: true } };
  }

  return { status: 404, json: { error: "Not found" } };
}
