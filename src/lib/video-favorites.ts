export interface FavoriteVideoInput {
  videoId: string;
  title: string;
  thumbnailUrl?: string;
  publishedAt?: string;
  viewCount?: number;
  channelId: string;
  channelName: string;
  channelThumbnail?: string;
  duration?: string;
}
export interface FavoriteVideo extends FavoriteVideoInput {
  savedAt: string;
}
export interface FavoritesStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export const EMPTY_FAVORITES: FavoriteVideo[] = [];
const isFavorite = (value: unknown): value is FavoriteVideo => {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.videoId === 'string' && /^[\w-]{11}$/.test(item.videoId)
    && typeof item.title === 'string' && typeof item.channelId === 'string'
    && typeof item.channelName === 'string' && typeof item.savedAt === 'string';
};

// Persistência separada do cache: atualizar/remover canais nunca apaga favoritos.
export function createFavoritesStore(key: string, storage: () => FavoritesStorage) {
  let snapshot: FavoriteVideo[] = EMPTY_FAVORITES;
  let raw: string | null | undefined;
  let ids = new Set<string>();
  let loaded = false;
  const listeners = new Set<() => void>();
  const getSnapshot = () => {
    if (loaded) return snapshot;
    loaded = true;
    let next: string | null;
    try { next = storage().getItem(key); } catch { return snapshot; }
    if (next === raw) return snapshot;
    raw = next;
    try {
      const parsed: unknown = next ? JSON.parse(next) : [];
      const unique = new Map<string, FavoriteVideo>();
      if (Array.isArray(parsed)) for (const item of parsed) if (isFavorite(item)) unique.set(item.videoId, item);
      snapshot = [...unique.values()].sort((a, b) => b.savedAt.localeCompare(a.savedAt));
      ids = new Set(unique.keys());
    } catch { /* Mantém o último retrato válido se o armazenamento estiver ilegível. */ }
    return snapshot;
  };
  const notify = () => { loaded = false; getSnapshot(); listeners.forEach(listener => listener()); };
  const has = (videoId: string) => { getSnapshot(); return ids.has(videoId); };
  const toggle = (video: FavoriteVideoInput) => {
    if (!/^[\w-]{11}$/.test(video.videoId)) throw new Error('Este vídeo não tem um identificador válido.');
    loaded = false;
    const current = getSnapshot();
    const removing = ids.has(video.videoId);
    const saved: FavoriteVideo = {
      videoId: video.videoId, title: video.title, channelId: video.channelId, channelName: video.channelName,
      thumbnailUrl: video.thumbnailUrl, publishedAt: video.publishedAt, viewCount: video.viewCount,
      channelThumbnail: video.channelThumbnail, duration: video.duration, savedAt: new Date().toISOString(),
    };
    const next = removing ? current.filter(item => item.videoId !== video.videoId) : [saved, ...current];
    // Só confirma na interface depois da gravação; falhas não fingem que o favorito foi salvo.
    storage().setItem(key, JSON.stringify(next));
    notify();
    return !removing;
  };
  return { key, getSnapshot, has, toggle, notify,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
  };
}
