/**
 * server.mjs — Servidor local do Avantis Tube
 * Porta: 3001
 *
 * Arquivos gerados em data/:
 *   channels.json → canais monitorados (add/edit/delete)
 *   history.json  → histórico de crescimento (1 ponto por dia por canal)
 */

import { createServer } from "http";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "data");
const DB_FILE = join(DATA_DIR, "channels.json");  // canais monitorados
const HIST_FILE = join(DATA_DIR, "history.json");   // histórico de crescimento
const PORT = 3001;

// ─── Carregar .env ────────────────────────────────────────────────────────────
function loadEnv() {
    try {
        const env = readFileSync(join(__dirname, ".env"), "utf-8");
        for (const line of env.replace(/\r/g, "").split("\n")) {
            const [k, ...rest] = line.split("=");
            if (k && rest.length) {
                process.env[k.trim()] = rest.join("=").trim().replace(/^"|"$/g, "");
            }
        }
    } catch { }
}
loadEnv();

console.log("[server] YT API Key carregada:", process.env.VITE_YOUTUBE_API_KEY ? "OK (" + process.env.VITE_YOUTUBE_API_KEY.slice(0, 8) + "...)" : "❌ NÃO ENCONTRADA");

const YT_BASE = "https://www.googleapis.com/youtube/v3";

// ─── channels.json ───────────────────────────────────────────────────────────

function readDB() {
    if (!existsSync(DB_FILE)) return { monitored: [], myChannels: [] };
    try { return JSON.parse(readFileSync(DB_FILE, "utf-8")); }
    catch { return { monitored: [], myChannels: [] }; }
}

function writeDB(data) {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ─── history.json ─────────────────────────────────────────────────────────────
// Formato: { "UCxxxx": [ { recorded_at, subscriber_count, view_count, video_count }, ... ] }

function readHistory() {
    if (!existsSync(HIST_FILE)) return {};
    try { return JSON.parse(readFileSync(HIST_FILE, "utf-8")); }
    catch { return {}; }
}

function writeHistory(data) {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(HIST_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/** Grava (ou atualiza) o ponto de hoje no histórico de um canal */
function recordHistory(channelId, subscriberCount, viewCount, videoCount) {
    const hist = readHistory();
    if (!hist[channelId]) hist[channelId] = [];

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const idx = hist[channelId].findIndex(r => r.recorded_at.startsWith(today));

    const entry = {
        recorded_at: new Date().toISOString(),
        subscriber_count: subscriberCount,
        view_count: viewCount,
        video_count: videoCount,
    };

    if (idx !== -1) {
        hist[channelId][idx] = entry; // atualiza o do dia
    } else {
        hist[channelId].push(entry);  // novo ponto
    }

    writeHistory(hist);
}

/** Remove histórico de um canal (quando ele é deletado) */
function deleteHistory(channelId) {
    const hist = readHistory();
    delete hist[channelId];
    writeHistory(hist);
}

// ─── YouTube API helpers ──────────────────────────────────────────────────────

async function ytFetch(path) {
    const apiKey = process.env.VITE_YOUTUBE_API_KEY;
    if (!apiKey) throw new Error("VITE_YOUTUBE_API_KEY não encontrada no .env");
    const sep = path.includes("?") ? "&" : "?";
    const url = `${YT_BASE}${path}${sep}key=${apiKey}`;
    const res = await fetch(url);
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
    const videoIds = plData.items?.map(i => i.snippet.resourceId.videoId).join(",");
    if (!videoIds) return [];

    const vidData = await ytFetch(`/videos?part=snippet,statistics,contentDetails&id=${videoIds}`);
    return (vidData.items || []).map(v => ({
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

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

function cors(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function json(res, data, status = 200) {
    cors(res);
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", c => body += c);
        req.on("end", () => {
            try { resolve(body ? JSON.parse(body) : {}); }
            catch { reject(new Error("Invalid JSON")); }
        });
    });
}

// ─── Routes ───────────────────────────────────────────────────────────────────

const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const path = url.pathname;
    const method = req.method;

    cors(res);
    if (method === "OPTIONS") { res.writeHead(204); res.end(); return; }

    try {

        // ── Status ──────────────────────────────────────────────────────────────
        if (path === "/api/status" && method === "GET") {
            return json(res, { status: "ok", version: "1.1.0", ytApiKey: !!process.env.VITE_YOUTUBE_API_KEY });
        }

        // ── Canais Monitorados ─────────────────────────────────────────────────

        if (path === "/api/channels" && method === "GET") {
            return json(res, readDB().monitored || []);
        }

        if (path === "/api/channels" && method === "POST") {
            const body = await readBody(req);
            const db = readDB();
            const channelId = await resolveChannelId(body.channelInput || body.channelId);

            if (db.monitored.find(c => c.channel_id === channelId)) {
                return json(res, { error: "already being monitored" }, 409);
            }

            const info = await getChannelInfo(channelId);

            const channel = {
                id: crypto.randomUUID(),
                channel_id: channelId,
                channel_name: info.title,
                channel_thumbnail: info.thumbnail,
                subscriber_count: info.subscriberCount,
                view_count: info.viewCount,
                video_count: info.videoCount,
                niche: body.niche || null,
                notes: body.notes || null,
                content_type: body.contentType || "longform",
                added_at: new Date().toISOString(),
                last_updated: new Date().toISOString(),
            };

            db.monitored.push(channel);
            writeDB(db);

            // Grava o primeiro ponto no histórico
            recordHistory(channelId, info.subscriberCount, info.viewCount, info.videoCount);

            return json(res, { channel }, 201);
        }

        if (path.startsWith("/api/channels/") && method === "PUT") {
            const id = path.split("/")[3];
            const body = await readBody(req);
            const db = readDB();
            const idx = db.monitored.findIndex(c => c.channel_id === id || c.id === id);
            if (idx === -1) return json(res, { error: "Not found" }, 404);
            db.monitored[idx] = { ...db.monitored[idx], ...body, last_updated: new Date().toISOString() };
            writeDB(db);
            return json(res, db.monitored[idx]);
        }

        if (path.startsWith("/api/channels/") && method === "DELETE") {
            const id = path.split("/")[3];
            const db = readDB();

            // Descobrir o channel_id real antes de deletar
            const ch = db.monitored.find(c => c.channel_id === id || c.id === id);
            db.monitored = db.monitored.filter(c => c.channel_id !== id && c.id !== id);
            writeDB(db);

            // Apagar histórico do canal deletado
            if (ch) deleteHistory(ch.channel_id);

            return json(res, { ok: true });
        }

        // ── Histórico de Crescimento ───────────────────────────────────────────

        if (path.startsWith("/api/history/") && method === "GET") {
            const channelId = decodeURIComponent(path.split("/")[3]);
            const hist = readHistory();
            const records = (hist[channelId] || []).sort(
                (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
            );
            return json(res, records);
        }

        // ── YouTube ────────────────────────────────────────────────────────────

        if (path === "/api/youtube/channel" && method === "GET") {
            const channelId = url.searchParams.get("channelId");
            if (!channelId) return json(res, { error: "Missing channelId" }, 400);

            const info = await getChannelInfo(channelId);

            // Atualizar stats no channels.json
            const db = readDB();
            const idx = db.monitored.findIndex(c => c.channel_id === channelId);
            if (idx !== -1) {
                db.monitored[idx].subscriber_count = info.subscriberCount;
                db.monitored[idx].view_count = info.viewCount;
                db.monitored[idx].video_count = info.videoCount;
                db.monitored[idx].last_updated = new Date().toISOString();
                writeDB(db);
            }

            // Gravar ponto no histórico (1 por dia)
            recordHistory(channelId, info.subscriberCount, info.viewCount, info.videoCount);

            return json(res, info);
        }

        if (path === "/api/youtube/videos" && method === "GET") {
            const channelId = url.searchParams.get("channelId");
            const max = parseInt(url.searchParams.get("max") || "7");
            if (!channelId) return json(res, { error: "Missing channelId" }, 400);
            const videos = await getLatestVideos(channelId, max);
            return json(res, { channelId, videos, success: true });
        }

        if (path === "/api/youtube/search" && method === "GET") {
            const q = url.searchParams.get("q");
            const maxResults = url.searchParams.get("max") || "10";
            if (!q) return json(res, { error: "Missing q" }, 400);
            const data = await ytFetch(`/search?part=snippet&type=channel&q=${encodeURIComponent(q)}&maxResults=${maxResults}`);
            return json(res, data);
        }

        json(res, { error: "Not found" }, 404);

    } catch (err) {
        console.error(`[Server] ${method} ${path} →`, err.message);
        json(res, { error: err.message }, 500);
    }
});

server.listen(PORT, () => {
    console.log(`\x1b[32m✅ Avantis Tube API rodando em http://localhost:${PORT}\x1b[0m`);
    console.log(`   📁 Canais:    ${DB_FILE}`);
    console.log(`   📈 Histórico: ${HIST_FILE}`);
    console.log(`   🔑 YouTube API Key: ${process.env.VITE_YOUTUBE_API_KEY ? "✓ configurada" : "✗ NÃO configurada!"}`);
});
