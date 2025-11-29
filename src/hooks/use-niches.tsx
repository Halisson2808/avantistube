import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useNiches = () => {
  const [niches, setNiches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadNiches = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const allNiches = new Set<string>();

      // Buscar nichos dos canais monitorados
      const { data: monitoredChannels } = await supabase
        .from('monitored_channels')
        .select('niche')
        .eq('user_id', user.id);

      monitoredChannels?.forEach((channel) => {
        if (channel.niche) allNiches.add(channel.niche);
      });

      // Buscar nichos dos meus canais
      const { data: myChannels } = await supabase
        .from('my_channels')
        .select('niche')
        .eq('user_id', user.id);

      myChannels?.forEach((channel) => {
        if (channel.niche) allNiches.add(channel.niche);
      });

      setNiches(Array.from(allNiches).sort());
    } catch (error) {
      console.error('Erro ao carregar nichos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renameNiche = async (oldNiche: string, newNiche: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Atualizar monitored_channels
      await supabase
        .from('monitored_channels')
        .update({ niche: newNiche })
        .eq('user_id', user.id)
        .eq('niche', oldNiche);

      // Atualizar my_channels
      await supabase
        .from('my_channels')
        .update({ niche: newNiche })
        .eq('user_id', user.id)
        .eq('niche', oldNiche);

      await loadNiches();
      return true;
    } catch (error) {
      console.error('Erro ao renomear nicho:', error);
      return false;
    }
  };

  useEffect(() => {
    loadNiches();
  }, []);

  return { niches, isLoading, renameNiche, loadNiches };
};
