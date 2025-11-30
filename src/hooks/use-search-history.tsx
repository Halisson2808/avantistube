import { useLocalStorage } from './use-local-storage';
import { VideoData } from '@/components/VideoCard';

const MAX_HISTORY_ITEMS = 500;

export function useSearchHistory() {
  const [history, setHistory] = useLocalStorage<VideoData[]>('youtube-search-history', []);

  const addToHistory = (videos: VideoData[]) => {
    setHistory((prev) => {
      // Remove duplicatas por ID
      const existingIds = new Set(prev.map(v => v.id));
      const newVideos = videos.filter(v => !existingIds.has(v.id));
      
      // Adiciona novos vídeos no início
      const updated = [...newVideos, ...prev];
      
      // Limita ao máximo de itens
      return updated.slice(0, MAX_HISTORY_ITEMS);
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return { history, addToHistory, clearHistory };
}
