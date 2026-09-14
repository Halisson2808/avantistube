/**
 * AuthContext — estado de login (Supabase Auth) para todo o app.
 */
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void (async () => {
      const current = await supabase.auth.getSession();
      if (!current.error) return current.data.session;

      // getSession já renova tokens expirados, mas uma segunda tentativa
      // explícita cobre falhas transitórias ocorridas durante a restauração.
      const refreshed = await supabase.auth.refreshSession();
      if (refreshed.error) throw refreshed.error;
      return refreshed.data.session;
    })()
      .then((restoredSession) => {
        if (active) setSession(restoredSession);
      })
      .catch((error) => {
        // Mantém a tela utilizável mesmo se o Supabase oscilar durante a
        // restauração inicial; a próxima tentativa poderá renovar a sessão.
        console.error("[auth] Não foi possível restaurar a sessão:", error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (active) setSession(s);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
