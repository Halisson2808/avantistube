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
      is_own_channel: !!body.isOwnChannel,
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

  return { status: 404, json: { error: "Not found" } };
}
