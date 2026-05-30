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
  try {
    const { data, error } = await getSupabaseAnon().auth.getUser(token);
    if (error || !data?.user) return null;
    return data.user;
  } catch {
    return null;
  }
}

// Rotas liberadas sem login (status + proxies de imagem/título usados em <img>).
const PUBLIC_PATHS = ["/status", "/proxy/thumbnail", "/proxy/oembed"];

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

  const handle = input.match(/@([\w-]+)/)?.[1] || input.match(/youtube\.com\/@([\w-]+)/)?.[1];
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

async function getLatestVideos(channelId, maxResults = 7) {
  const chData = await ytFetch(`/channels?part=contentDetails&id=${channelId}`);
  const uploadsId = chData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) return [];

  const plData = await ytFetch(`/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=${maxResults}`);
  const videoIds = plData.items?.map((i) => i.snippet.resourceId.videoId).join(",");
  if (!videoIds) return [];

  const vidData = await ytFetch(`/videos?part=snippet,statistics,contentDetails&id=${videoIds}`);
  return (vidData.items || []).map((v) => ({
    videoId: v.id,
    title: v.snippet.title,
    thumbnailUrl: v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url,
    publishedAt: v.snippet.publishedAt,
    viewCount: parseInt(v.statistics?.viewCount || "0"),
    likeCount: parseInt(v.statistics?.likeCount || "0"),
    commentCount: parseInt(v.statistics?.commentCount || "0"),
    duration: v.contentDetails?.duration,
  }));
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

// ─── Handler principal ───────────────────────────────────────────────────────────
/**
 * @returns {Promise<{status:number, json?:any, buffer?:Buffer, contentType?:string, cacheControl?:string}>}
 */
export async function handleApiRequest({ method, pathname, searchParams, body, authToken }) {
  // normaliza: aceita "/api/x" ou "/x"
  const path = pathname.replace(/^\/api/, "") || "/";

  // ── Proteção: tudo que não é público exige login válido ────────────────────
  if (!PUBLIC_PATHS.includes(path)) {
    const user = await verifyUser(authToken);
    if (!user) return { status: 401, json: { error: "Não autorizado. Faça login." } };
  }

  // ── Status ──────────────────────────────────────────────────────────────────
  if (path === "/status" && method === "GET") {
    return { status: 200, json: { status: "ok", version: "2.0.0", supabase: true } };
  }

  // ── Canais ────────────────────────────────────────────────────────────────────
  if (path === "/channels" && method === "GET") {
    const db = getSupabase();
    const { data: channels, error } = await db.from("channels").select("*").order("added_at", { ascending: true });
    if (error) throw new Error(error.message);

    const histRows = await fetchAllHistory(db);
    const histByChannel = new Map();
    for (const r of histRows) {
      if (!histByChannel.has(r.channel_id)) histByChannel.set(r.channel_id, []);
      histByChannel.get(r.channel_id).push(r);
    }

    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const cutoff = now - sevenDaysMs;

    const enriched = (channels || []).map((ch) => {
      const records = histByChannel.get(ch.channel_id) || []; // já vem ordenado asc
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

    const { data: dup } = await db.from("channels").select("id").eq("channel_id", channelId).limit(1);
    if (dup && dup.length) return { status: 409, json: { error: "already being monitored" } };

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
      added_at: nowIso,
      last_updated: nowIso,
    };
    const { data: inserted, error } = await db.from("channels").insert(row).select().single();
    if (error) throw new Error(error.message);

    await recordHistory(channelId, info.subscriberCount, info.viewCount, info.videoCount);
    return { status: 201, json: { channel: inserted } };
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
    const videos = await getLatestVideos(channelId, max);
    return { status: 200, json: { channelId, videos, success: true } };
  }

  if (path === "/youtube/search" && method === "GET") {
    const q = searchParams.get("q");
    const maxResults = searchParams.get("max") || "10";
    if (!q) return { status: 400, json: { error: "Missing q" } };
    const data = await ytFetch(`/search?part=snippet&type=channel&q=${encodeURIComponent(q)}&maxResults=${maxResults}`);
    return { status: 200, json: data };
  }

  // ── Proxy de thumbnail (evita CORS/referrer block) ─────────────────────────────
  if (path === "/proxy/thumbnail" && method === "GET") {
    const videoId = searchParams.get("videoId");
    if (!videoId) return { status: 400, json: { error: "Missing videoId" } };

    const YT_HEADERS = { Referer: "https://www.youtube.com/", "User-Agent": "Mozilla/5.0" };
    async function tryQuality(quality) {
      const r = await fetch(`https://img.youtube.com/vi/${videoId}/${quality}.jpg`, { headers: YT_HEADERS });
      if (!r.ok) return null;
      const buf = Buffer.from(await r.arrayBuffer());
      return buf.byteLength > 5000 ? buf : null;
    }
    const buf = (await tryQuality("maxresdefault")) || (await tryQuality("sddefault")) || (await tryQuality("hqdefault"));
    if (!buf) return { status: 404, json: { error: "Thumbnail não encontrada" } };

    return { status: 200, buffer: buf, contentType: "image/jpeg", cacheControl: "public, max-age=3600" };
  }

  // ── Proxy de oEmbed (título sem CORS) ──────────────────────────────────────────
  if (path === "/proxy/oembed" && method === "GET") {
    const videoId = searchParams.get("videoId");
    if (!videoId) return { status: 400, json: { error: "Missing videoId" } };
    const r = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { headers: { Referer: "https://www.youtube.com/" } }
    );
    if (!r.ok) return { status: 200, json: { title: "" } };
    const data = await r.json();
    return { status: 200, json: { title: data.title || "" } };
  }

  return { status: 404, json: { error: "Not found" } };
}
