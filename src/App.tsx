import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import MonitoredChannels from "./pages/MonitoredChannels";
import MyChannels from "./pages/MyChannels";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { Menu, Youtube } from "lucide-react"; 
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <SidebarProvider>
      {/* HEADER VISÍVEL APENAS EM TELAS PEQUENAS PARA O BOTÃO HAMBURGUER */}
      <header className="sticky top-0 z-20 flex items-center h-16 border-b border-border bg-card/80 backdrop-blur-sm md:hidden p-4">
        {/* CORREÇÃO CRÍTICA: SidebarTrigger sem 'asChild' e usando ícone Menu */}
        <SidebarTrigger variant="ghost" size="icon"> 
          <Menu className="w-5 h-5" /> {/* Ícone Hambúrguer */}
        </SidebarTrigger>
        
        <div className="ml-4 flex items-center gap-2">
          <Youtube className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">AvantisTube</h1>
        </div>
      </header>

      {/* Container Principal: Flex (Desktop) / Bloco (Mobile) */}
      <div className="min-h-screen flex w-full">
        {/* Sidebar é gerenciada internamente para aparecer off-canvas no mobile */}
        <AppSidebar />
        
        {/* Conteúdo Principal (p-4 no mobile, p-6 no desktop) */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/search" element={<ProtectedLayout><Search /></ProtectedLayout>} />
          <Route path="/monitored" element={<ProtectedLayout><MonitoredChannels /></ProtectedLayout>} />
          <Route path="/my-channels" element={<ProtectedLayout><MyChannels /></ProtectedLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
