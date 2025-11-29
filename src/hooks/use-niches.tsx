import { useState, useEffect } from 'react';
import { useLocalStorage } from './use-local-storage';

export const useNiches = () => {
  const [monitoredChannels] = useLocalStorage<any[]>('monitored-channels', []);
  const [myChannels] = useLocalStorage<any[]>('my-channels', []);
  const [niches, setNiches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadNiches = () => {
    const allNiches = new Set<string>();

    monitoredChannels.forEach((channel: any) => {
      if (channel.niche) allNiches.add(channel.niche);
    });

    myChannels.forEach((channel: any) => {
      if (channel.niche) allNiches.add(channel.niche);
    });

    setNiches(Array.from(allNiches).sort());
  };

  const renameNiche = async (oldNiche: string, newNiche: string): Promise<boolean> => {
    loadNiches();
    return true;
  };

  useEffect(() => {
    loadNiches();
  }, [monitoredChannels, myChannels]);

  return { niches, isLoading, renameNiche, loadNiches };
};
