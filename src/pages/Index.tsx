import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Youtube, Loader2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      
      <div className="relative z-10 container mx-auto p-8">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AvantisTube Pro</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sair
          </Button>
        </div>

        <div className="glass-effect shadow-card rounded-2xl p-8 max-w-2xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Bem-vindo ao AvantisTube Pro</h2>
          <p className="text-muted-foreground mb-6">
            Sua plataforma profissional para monitorar e analisar canais do YouTube
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="gradient" size="lg">
              Começar Análise
            </Button>
            <Button variant="outline" size="lg">
              Ver Documentação
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
