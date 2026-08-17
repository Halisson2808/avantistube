import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Loader2 } from "lucide-react";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { installApiAuthFetch } from "@/lib/apiAuth";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Funções e Páginas do Sistema
import Search from "./pages/Search";
import Monitoramento from "./pages/Monitoramento";
import MeusCanais from "./pages/MeusCanais";
import Exportar from "./pages/Exportar";
import PerfisSociais from "./pages/PerfisSociais";
import BaixarThumbYoutube from "./pages/dark/BaixarThumbYoutube";
import CompactarThumb from "./pages/dark/CompactarThumb";

// Avantis Studio Layout e Dashboard
import { StudioLayout } from "@/components/StudioLayout";
import StudioDashboard from "./pages/studio/StudioDashboard";
import StudioThumbnails from "./pages/studio/StudioThumbnails";

// Anexa o token de login a todas as chamadas /api.
installApiAuthFetch();

const queryClient = new QueryClient();

const wrap = (el: React.ReactNode) => <StudioLayout>{el}</StudioLayout>;

function ProtectedApp() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(240,10%,3.9%)]">
        <Loader2 className="h-6 w-6 animate-spin text-red-500" />
      </div>
    );
  }

  if (!session) return <Login />;

  return (
    <Routes>
      {/* Rotas Diretas na Raiz */}
      <Route path="/" element={wrap(<StudioDashboard />)} />
      <Route path="/buscar" element={wrap(<Search />)} />
      <Route path="/monitoramento" element={wrap(<Monitoramento />)} />
      <Route path="/meus-canais" element={wrap(<MeusCanais />)} />
      <Route path="/exportar" element={wrap(<Exportar />)} />
      <Route path="/perfis" element={wrap(<PerfisSociais />)} />
      <Route path="/thumbnails" element={wrap(<StudioThumbnails />)} />
      <Route path="/baixar-thumb" element={wrap(<BaixarThumbYoutube />)} />
      <Route path="/compactar-thumb" element={wrap(<CompactarThumb />)} />

      {/* Redirecionamentos de Rotas Legadas para as Novas Rotas Diretas */}
      <Route path="/studio/tube/buscar" element={<Navigate to="/buscar" replace />} />
      <Route path="/studio/tube/monitoramento" element={<Navigate to="/monitoramento" replace />} />
      <Route path="/studio/tube/meus-canais" element={<Navigate to="/meus-canais" replace />} />
      <Route path="/studio/tube/exportar" element={<Navigate to="/exportar" replace />} />
      <Route path="/studio/tube/perfis" element={<Navigate to="/perfis" replace />} />
      <Route path="/studio/dark/thumbnails" element={<Navigate to="/thumbnails" replace />} />
      <Route path="/studio/dark/baixar-thumb" element={<Navigate to="/baixar-thumb" replace />} />
      <Route path="/studio/dark/compactar-thumb" element={<Navigate to="/compactar-thumb" replace />} />
      <Route path="/studio" element={<Navigate to="/" replace />} />
      <Route path="/studio/*" element={<Navigate to="/" replace />} />
      <Route path="/avantistube/*" element={<Navigate to="/" replace />} />
      <Route path="/avantisdark/*" element={<Navigate to="/" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Analytics />
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ProtectedApp />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
