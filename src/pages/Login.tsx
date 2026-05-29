import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
    }
    // onAuthStateChange no AuthProvider cuida de redirecionar ao logar.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(240,10%,3.9%)] px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-red-500/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-sm z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-red-600 flex items-center justify-center shadow-xl shadow-red-900/40 mb-4">
            <img src="/studiologo.png" alt="Avantis Studio" className="h-10 w-10 object-contain" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Avantis <span className="bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">Studio</span>
          </h1>
          <p className="text-white/40 text-xs mt-1">Acesso restrito</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 backdrop-blur-sm"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/70 text-sm">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              placeholder="voce@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/70 text-sm">Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Entrando...</>
            ) : (
              <><Lock className="h-4 w-4 mr-2" /> Entrar</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
