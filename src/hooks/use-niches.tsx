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
        if (channel.niche && channel.niche.trim()) {
          // Normalizar o nicho: primeira letra maiúscula, resto minúsculo
          const trimmed = channel.niche.trim();
          const normalizedNiche = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
          allNiches.add(normalizedNiche);
        }
      });

      // Ordenar alfabeticamente com suporte a português
      const sortedNiches = Array.from(allNiches).sort((a, b) => 
        a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })
      );
      
      setNiches(sortedNiches);
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

      await loadNiches();
      return true;
    } catch (error) {
      console.error('Erro ao renomear nicho:', error);
      return false;
    }
  };

  // Carregar nichos na inicialização e quando houver mudanças
  useEffect(() => {
    loadNiches();

    // Subscribe para mudanças em tempo real
    const channel = supabase
      .channel('niches-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'monitored_channels',
        },
        () => {
          loadNiches();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { niches, isLoading, renameNiche, loadNiches };
};
