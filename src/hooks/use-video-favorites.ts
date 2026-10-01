import { useSyncExternalStore } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createFavoritesStore, EMPTY_FAVORITES } from '@/lib/video-favorites';

const stores = new Map<string, ReturnType<typeof createFavoritesStore>>();
function getStore(userId: string) {
  const key = `avantis-video-favorites-v1:${userId}`;
  let store = stores.get(key);
  if (!store) {
    store = createFavoritesStore(key, () => window.localStorage);
    stores.set(key, store);
  }
  return store;
}
if (typeof window !== 'undefined') window.addEventListener('storage', event => {
  for (const store of stores.values()) if (event.key === store.key || event.key === null) store.notify();
});
function useFavoritesStore() {
  const { session } = useAuth();
  return getStore(session?.user.id || 'guest');
}
export function useVideoFavorites() {
  const store = useFavoritesStore();
  const favorites = useSyncExternalStore(store.subscribe, store.getSnapshot, () => EMPTY_FAVORITES);
  return { favorites, toggleFavorite: store.toggle };
}
export function useFavoriteStatus(videoId: string) {
  const store = useFavoritesStore();
  // Cada botão observa somente seu estado, sem renderizar todos os cards a cada favorito.
  const saved = useSyncExternalStore(store.subscribe, () => store.has(videoId), () => false);
  return { saved, toggleFavorite: store.toggle };
}
