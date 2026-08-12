/**
 * use-social-links.tsx
 * Links de perfil do TikTok/Instagram salvos (Supabase como storage).
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const API = '/api';

export type SocialPlatform = 'tiktok' | 'instagram' | 'other';

export interface SocialLink {
  id: string;
  url: string;
  label?: string;
  platform: SocialPlatform;
  addedAt: string;
  favorite: boolean;
}

interface ApiSocialLinkRaw {
  id: string;
  url: string;
  label?: string;
  platform: SocialPlatform;
  added_at: string;
  favorite?: boolean;
}

function mapLink(raw: ApiSocialLinkRaw): SocialLink {
  return {
    id: raw.id,
    url: raw.url,
    label: raw.label || undefined,
    platform: raw.platform,
    addedAt: raw.added_at,
    favorite: !!raw.favorite,
  };
}

export const useSocialLinks = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLinks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/social-links`);
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data: ApiSocialLinkRaw[] = await res.json();
      setLinks(data.map(mapLink));
    } catch (error) {
      console.error('Erro ao carregar links:', error);
      toast.error('Erro ao carregar links salvos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  const addLink = async (url: string, label?: string) => {
    try {
      const res = await fetch(`${API}/social-links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, label }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Erro ${res.status}`);
      }
      await loadLinks();
      toast.success('Link adicionado!');
      return true;
    } catch (error) {
      console.error('Erro ao adicionar link:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao adicionar link');
      return false;
    }
  };

  const removeLink = async (id: string) => {
    try {
      const res = await fetch(`${API}/social-links/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      await loadLinks();
      toast.success('Link removido');
    } catch (error) {
      console.error('Erro ao remover link:', error);
      toast.error('Erro ao remover link');
    }
  };

  const toggleFavorite = async (id: string, favorite: boolean) => {
    // Atualização otimista: reordena na hora, sem esperar o servidor.
    setLinks((prev) =>
      [...prev]
        .map((l) => (l.id === id ? { ...l, favorite } : l))
        .sort((a, b) => {
          if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        })
    );
    try {
      const res = await fetch(`${API}/social-links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite }),
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
    } catch (error) {
      console.error('Erro ao favoritar link:', error);
      toast.error('Erro ao favoritar link');
      await loadLinks();
    }
  };

  return { links, isLoading, loadLinks, addLink, removeLink, toggleFavorite };
};
