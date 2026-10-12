/**
 * use-social-profiles.tsx
 * Perfis do TikTok / Instagram / Facebook monitorados (aba "Outras Redes").
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const API = '/api';

export type SocialNetwork = 'tiktok' | 'instagram' | 'facebook';

export interface SocialProfile {
  id: string;
  platform: SocialNetwork;
  username: string;
  url: string;
  display_name: string | null;
  avatar_url: string | null;
  followers: number | null;
  posts: number | null;
  likes: number | null;
  niche: string | null;
  fetch_error: string | null;
  last_fetched_at: string | null;
  added_at: string;
}

async function errorMessage(res: Response) {
  const data = await res.json().catch(() => ({}));
  return data.error || `Erro ${res.status}`;
}

export const useSocialProfiles = () => {
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshingIds, setRefreshingIds] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API}/social-profiles`);
      if (!res.ok) throw new Error(await errorMessage(res));
      setProfiles(await res.json());
    } catch (error) {
      console.error('Erro ao carregar perfis:', error);
      toast.error('Erro ao carregar perfis');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const replace = (p: SocialProfile) => setProfiles(prev => prev.map(x => (x.id === p.id ? p : x)));

  const addProfile = async (url: string, niche?: string) => {
    try {
      const res = await fetch(`${API}/social-profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, niche }),
      });
      if (!res.ok) throw new Error(await errorMessage(res));
      const p: SocialProfile = await res.json();
      setProfiles(prev => [p, ...prev]);
      if (p.fetch_error) toast.warning(`Perfil salvo, mas não deu para puxar os dados: ${p.fetch_error}. Edite para colocar nome e foto.`);
      else toast.success(`${p.display_name} adicionado!`);
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao adicionar perfil');
      return false;
    }
  };

  const refreshProfile = async (id: string, silent = false) => {
    setRefreshingIds(prev => new Set(prev).add(id));
    try {
      const res = await fetch(`${API}/social-profiles/${id}/refresh`, { method: 'POST' });
      if (!res.ok) throw new Error(await errorMessage(res));
      const p: SocialProfile = await res.json();
      replace(p);
      if (!silent) p.fetch_error ? toast.error(`Falhou: ${p.fetch_error}`) : toast.success('Perfil atualizado');
      return !p.fetch_error;
    } catch (error) {
      if (!silent) toast.error(error instanceof Error ? error.message : 'Erro ao atualizar');
      return false;
    } finally {
      setRefreshingIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    }
  };

  const refreshAll = async () => {
    let ok = 0;
    let fail = 0;
    // de 3 em 3 pra não levar bloqueio das redes
    const queue = [...profiles];
    const worker = async () => {
      while (queue.length) {
        const p = queue.shift()!;
        (await refreshProfile(p.id, true)) ? ok++ : fail++;
      }
    };
    await Promise.all([worker(), worker(), worker()]);
    toast.success(`Atualizados: ${ok}${fail ? ` · falhas: ${fail}` : ''}`);
  };

  const updateProfile = async (id: string, updates: Partial<Pick<SocialProfile, 'display_name' | 'avatar_url' | 'niche'>>) => {
    try {
      const res = await fetch(`${API}/social-profiles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(await errorMessage(res));
      replace(await res.json());
      toast.success('Perfil salvo');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar');
      return false;
    }
  };

  const removeProfile = async (id: string) => {
    try {
      const res = await fetch(`${API}/social-profiles/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await errorMessage(res));
      setProfiles(prev => prev.filter(p => p.id !== id));
      toast.success('Perfil removido');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao remover');
    }
  };

  return { profiles, isLoading, refreshingIds, addProfile, refreshProfile, refreshAll, updateProfile, removeProfile };
};
