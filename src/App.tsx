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
import MyChannels from "./pages/MyChannels";
import Monitoramento from "./pages/Monitoramento";
import Exportar from "./pages/Exportar";
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
      <div className="min-h-screen flex flex-col md:flex-row w-full">
        {/* Header mobile com hamburguer */}
        <header className="sticky top-0 z-30 flex items-center h-14 border-b border-border bg-card md:hidden px-4">
          <SidebarTrigger className="h-9 w-9">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
          <div className="ml-3 flex items-center gap-2">
            <Youtube className="h-5 w-5 text-primary" />
            <span className="font-bold text-base">AvantisTube</span>
          </div>
        </header>

        {/* Sidebar - offcanvas no mobile, fixa no desktop */}
        <AppSidebar />
        
        {/* Conteúdo principal */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
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
          <Route path="/my-channels" element={<ProtectedLayout><MyChannels /></ProtectedLayout>} />
          <Route path="/monitoramento" element={<ProtectedLayout><Monitoramento /></ProtectedLayout>} />
          <Route path="/exportar" element={<ProtectedLayout><Exportar /></ProtectedLayout>} />
          {/* Redirect old routes */}
          <Route path="/monitored" element={<Navigate to="/monitoramento" replace />} />
          <Route path="/recent-videos" element={<Navigate to="/monitoramento" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
