import { useState } from "react";
import { useLocalStorage } from "./use-local-storage";
import { toast } from "sonner";

export interface VideoData {
  id: string;
  type?: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  channelId?: string;
  channelCreatedAt?: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  duration: string;
  channelSubscribers?: string;
  subscriberCount?: string;
}

export const useSearchHistory = () => {
  const [history, setHistory] = useLocalStorage<VideoData[]>('youtube-search-history', []);
  const [isLoading, setIsLoading] = useState(false);

  const addToHistory = async (videos: VideoData[]) => {
    const newHistory = [...videos, ...history];
    const uniqueHistory = newHistory.filter((video, index, self) =>
      index === self.findIndex((v) => v.id === video.id)
    );
    setHistory(uniqueHistory.slice(0, 500));
  };

  const clearHistory = async () => {
    setHistory([]);
    toast.success('Histórico limpo!');
  };

  return { history, isLoading, addToHistory, clearHistory };
};
