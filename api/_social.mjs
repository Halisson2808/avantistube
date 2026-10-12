/**
 * api/_social.mjs — Perfis de TikTok / Instagram / Facebook sem API oficial.
 *
 * Lê a página pública do perfil:
 *   - TikTok: com user-agent de celular a página traz o JSON
 *     __UNIVERSAL_DATA_FOR_REHYDRATION__ (nome, foto, seguidores, curtidas, vídeos).
 *     Reserva: og-tags com user-agent de crawler.
 *   - Instagram / Facebook: og-tags servidas ao crawler do Facebook
 *     (og:title, og:image, og:description com seguidores).
 * Pode quebrar se as redes mudarem a página; nesse caso o perfil fica salvo
 * com `fetch_error` e dá para preencher nome/foto à mão.
 */

const MOBILE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const CRAWLER_UA = "facebookexternalhit/1.1";

/** Converte link (ou @usuario com prefixo de rede) em { platform, username, url }. */
export function parseProfileUrl(input) {
  const raw = String(input || "").trim();
  let u;
  try {
    u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^(www|m|vm|web)\./, "");
  const seg = u.pathname.split("/").filter(Boolean);

  if (host.endsWith("tiktok.com")) {
    const at = seg.find(s => s.startsWith("@"));
    if (!at) return null;
    const username = at.slice(1).toLowerCase();
    return { platform: "tiktok", username, url: `https://www.tiktok.com/@${username}` };
  }
  if (host.endsWith("instagram.com")) {
    const username = (seg[0] || "").toLowerCase();
    if (!username || ["p", "reel", "reels", "stories", "explore"].includes(username)) return null;
    return { platform: "instagram", username, url: `https://www.instagram.com/${username}/` };
  }
  if (host.endsWith("facebook.com") || host === "fb.com") {
    if (seg[0] === "profile.php") {
      const id = u.searchParams.get("id");
      return id ? { platform: "facebook", username: id, url: `https://www.facebook.com/profile.php?id=${id}` } : null;
    }
    const username = seg[0] === "people" ? seg[2] || seg[1] : seg[0];
    if (!username) return null;
    return { platform: "facebook", username, url: `https://www.facebook.com/${username}` };
  }
  return null;
}

function decodeHtml(s) {
  if (!s) return s;
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

function metaTag(html, prop) {
  const re1 = new RegExp(`<meta[^>]+(?:property|name)="${prop}"[^>]*content="([^"]*)"`, "i");
  const re2 = new RegExp(`<meta[^>]+content="([^"]*)"[^>]*(?:property|name)="${prop}"`, "i");
  return decodeHtml(html.match(re1)?.[1] ?? html.match(re2)?.[1] ?? null);
}

/** "104M" / "1.2K" / "28.717.046" / "4,962" -> número */
function parseCount(s) {
  if (!s) return null;
  const m = String(s).trim().match(/^([\d.,]+)\s*([KMB])?/i);
  if (!m) return null;
  let num = m[1];
  const suffix = m[2]?.toUpperCase();
  if (suffix) num = num.replace(",", ".");
  else num = num.replace(/[.,]/g, "");
  const n = parseFloat(num);
  if (!isFinite(n)) return null;
  const mult = suffix === "K" ? 1e3 : suffix === "M" ? 1e6 : suffix === "B" ? 1e9 : 1;
  return Math.round(n * mult);
}

async function getHtml(url, ua) {
  const res = await fetch(url, {
    headers: { "User-Agent": ua, Accept: "text/html", "Accept-Language": "en-US,en;q=0.9" },
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function scrapeTikTok(p) {
  try {
    const html = await getHtml(p.url, MOBILE_UA);
    const m = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
    const info = m ? JSON.parse(m[1]).__DEFAULT_SCOPE__?.["webapp.user-detail"]?.userInfo : null;
    if (info?.user) {
      const stats = info.statsV2 || info.stats || {};
      return {
        display_name: info.user.nickname || p.username,
        avatar_src: info.user.avatarLarger || info.user.avatarMedium || null,
        followers: parseCount(stats.followerCount),
        posts: parseCount(stats.videoCount),
        likes: parseCount(stats.heartCount ?? stats.heart),
      };
    }
  } catch { /* tenta a reserva */ }

  const html = await getHtml(p.url, CRAWLER_UA);
  const title = metaTag(html, "og:title");
  if (!title) throw new Error("TikTok não retornou dados do perfil");
  return {
    display_name: title.replace(/\s+on TikTok$/i, ""),
    avatar_src: metaTag(html, "og:image"),
    followers: null, posts: null, likes: null,
  };
}

async function scrapeOg(p) {
  const html = await getHtml(p.url, CRAWLER_UA);
  const title = metaTag(html, "og:title");
  if (!title || /^(Instagram|Facebook|Log in|Entrar)/i.test(title)) {
    throw new Error("Perfil não encontrado ou exige login");
  }
  const desc = metaTag(html, "og:description") || metaTag(html, "description") || "";
  if (p.platform === "instagram") {
    return {
      // "NASA (@nasa) • Instagram photos and videos"
      display_name: title.replace(/\s*\(@[^)]+\).*$/, "").trim() || p.username,
      avatar_src: metaTag(html, "og:image"),
      followers: parseCount(desc.match(/([\d.,]+\s*[KMB]?)\s+Followers/i)?.[1]),
      posts: parseCount(desc.match(/([\d.,]+\s*[KMB]?)\s+Posts/i)?.[1]),
      likes: null,
    };
  }
  return {
    display_name: title.trim(),
    avatar_src: metaTag(html, "og:image"),
    followers: parseCount(desc.match(/([\d.,]+\s*[KMB]?)\s+(?:seguidores|followers)/i)?.[1]),
    posts: null,
    likes: parseCount(desc.match(/([\d.,]+\s*[KMB]?)\s+(?:curtidas|likes)/i)?.[1]),
  };
}

/** Busca nome, foto e números do perfil. Lança erro se nada vier. */
export async function scrapeProfile(p) {
  return p.platform === "tiktok" ? scrapeTikTok(p) : scrapeOg(p);
}

/** Copia a foto para o Storage (links do CDN das redes expiram). Retorna URL pública ou null. */
export async function storeAvatar(db, p, src) {
  if (!src) return null;
  try {
    const res = await fetch(src, { headers: { "User-Agent": MOBILE_UA }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") || "image/jpeg";
    const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg";
    const path = `${p.platform}/${p.username.replace(/[^a-z0-9._-]/gi, "_")}.${ext}`;
    const buf = Buffer.from(await res.arrayBuffer());
    const { error } = await db.storage.from("social-avatars").upload(path, buf, { contentType: type, upsert: true });
    if (error) return null;
    const { data } = db.storage.from("social-avatars").getPublicUrl(path);
    // ?v= força o navegador a buscar a foto nova depois de atualizar
    return `${data.publicUrl}?v=${Date.now()}`;
  } catch {
    return null;
  }
}

/** Raspa o perfil e devolve as colunas para gravar (com fetch_error em caso de falha). */
export async function fetchProfileColumns(db, p) {
  try {
    const d = await scrapeProfile(p);
    const avatar_url = await storeAvatar(db, p, d.avatar_src);
    const cols = { display_name: d.display_name, fetch_error: null, last_fetched_at: new Date().toISOString() };
    if (avatar_url) cols.avatar_url = avatar_url;
    if (d.followers != null) cols.followers = d.followers;
    if (d.posts != null) cols.posts = d.posts;
    if (d.likes != null) cols.likes = d.likes;
    return cols;
  } catch (e) {
    return { fetch_error: e.message || "Falha ao buscar perfil", last_fetched_at: new Date().toISOString() };
  }
}
