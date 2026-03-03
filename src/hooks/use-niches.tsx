/**
 * use-niches.tsx
 * Deriva os nichos diretamente dos canais monitorados (arquivo local).
 * Sem Supabase, sem Docker.
 */

import { useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:3001/api';

export const useNiches = () => {
  const [niches, setNiches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadNiches = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/channels`);
      if (!res.ok) return;
      const channels: any[] = await res.json();

      const allNiches = new Set<string>();
      channels.forEach((ch) => {
        if (ch.niche?.trim()) {
          const t = ch.niche.trim();
          allNiches.add(t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
        }
      });

      setNiches(
        Array.from(allNiches).sort((a, b) =>
          a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })
        )
      );
    } catch (error) {
      console.error('Erro ao carregar nichos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renameNiche = async (oldNiche: string, newNiche: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/channels`);
      if (!res.ok) return false;
      const channels: any[] = await res.json();

      // Atualizar todos os canais com o nicho antigo
      await Promise.all(
        channels
          .filter((ch) => ch.niche?.toLowerCase() === oldNiche.toLowerCase())
          .map((ch) =>
            fetch(`${API}/channels/${ch.channel_id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ niche: newNiche }),
            })
          )
      );

      await loadNiches();
      return true;
    } catch (error) {
      console.error('Erro ao renomear nicho:', error);
      return false;
    }
  };

  useEffect(() => {
    loadNiches();
  }, [loadNiches]);

  return { niches, isLoading, renameNiche, loadNiches };
};
