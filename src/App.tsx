import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Loader2 } from "lucide-react";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { installApiAuthFetch } from "@/lib/apiAuth";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

// Módulo YouTube — dados de canais e vídeos (rotas em /youtube)
import Search from "./pages/Search";
import Monitoramento from "./pages/Monitoramento";
import MeusCanais from "./pages/MeusCanais";
import Exportar from "./pages/Exportar";
import PerfisSociais from "./pages/PerfisSociais";
import BaixarThumbYoutube from "./pages/dark/BaixarThumbYoutube";
import CompactarThumb from "./pages/dark/CompactarThumb";
import StudioDashboard from "./pages/studio/StudioDashboard";
import StudioThumbnails from "./pages/studio/StudioThumbnails";

// Módulo Sites & Tráfego — cliques, funil e anúncios (rotas em /analytics)
import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard";
import AnalyticsSites from "./pages/analytics/AnalyticsSites";
import AnalyticsFunnel from "./pages/analytics/AnalyticsFunnel";
import AnalyticsEvents from "./pages/analytics/AnalyticsEvents";
import AnalyticsUtm from "./pages/analytics/AnalyticsUtm";

// Módulo Gerador de PDF — carregado sob demanda (bundle próprio, ~30 ebooks)
const PdfModule = lazy(() => import("./pages/PdfGenerator/PdfModule"));

import { StudioLayout } from "@/components/StudioLayout";

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
      {/* Início — escolhe o módulo */}
      <Route path="/" element={wrap(<Home />)} />

      {/* Módulo YouTube */}
      <Route path="/youtube" element={wrap(<StudioDashboard />)} />
      <Route path="/youtube/buscar" element={wrap(<Search />)} />
      <Route path="/youtube/monitoramento" element={wrap(<Monitoramento />)} />
      <Route path="/youtube/meus-canais" element={wrap(<MeusCanais />)} />
      <Route path="/youtube/exportar" element={wrap(<Exportar />)} />
      <Route path="/youtube/perfis" element={wrap(<PerfisSociais />)} />
      <Route path="/youtube/thumbnails" element={wrap(<StudioThumbnails />)} />
      <Route path="/youtube/baixar-thumb" element={wrap(<BaixarThumbYoutube />)} />
      <Route path="/youtube/compactar-thumb" element={wrap(<CompactarThumb />)} />

      {/* Módulo Sites & Tráfego */}
      <Route path="/analytics" element={wrap(<AnalyticsDashboard />)} />
      <Route path="/analytics/funil" element={wrap(<AnalyticsFunnel />)} />
      <Route path="/analytics/eventos" element={wrap(<AnalyticsEvents />)} />
      <Route path="/analytics/sites" element={wrap(<AnalyticsSites />)} />
      <Route path="/analytics/utm" element={wrap(<AnalyticsUtm />)} />

      {/* Módulo Gerador de PDF (tema claro próprio, fora do StudioLayout) */}
      <Route
        path="/pdf/*"
        element={
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-[hsl(240,10%,3.9%)]">
                <Loader2 className="h-6 w-6 animate-spin text-red-500" />
              </div>
            }
          >
            <PdfModule />
          </Suspense>
        }
      />

      {/* Rotas antigas → novas (mantém links e favoritos funcionando) */}
      <Route path="/buscar" element={<Navigate to="/youtube/buscar" replace />} />
      <Route path="/monitoramento" element={<Navigate to="/youtube/monitoramento" replace />} />
      <Route path="/meus-canais" element={<Navigate to="/youtube/meus-canais" replace />} />
      <Route path="/exportar" element={<Navigate to="/youtube/exportar" replace />} />
      <Route path="/perfis" element={<Navigate to="/youtube/perfis" replace />} />
      <Route path="/thumbnails" element={<Navigate to="/youtube/thumbnails" replace />} />
      <Route path="/baixar-thumb" element={<Navigate to="/youtube/baixar-thumb" replace />} />
      <Route path="/compactar-thumb" element={<Navigate to="/youtube/compactar-thumb" replace />} />
      <Route path="/studio/tube/buscar" element={<Navigate to="/youtube/buscar" replace />} />
      <Route path="/studio/tube/monitoramento" element={<Navigate to="/youtube/monitoramento" replace />} />
      <Route path="/studio/tube/meus-canais" element={<Navigate to="/youtube/meus-canais" replace />} />
      <Route path="/studio/tube/exportar" element={<Navigate to="/youtube/exportar" replace />} />
      <Route path="/studio/tube/perfis" element={<Navigate to="/youtube/perfis" replace />} />
      <Route path="/studio/dark/thumbnails" element={<Navigate to="/youtube/thumbnails" replace />} />
      <Route path="/studio/dark/baixar-thumb" element={<Navigate to="/youtube/baixar-thumb" replace />} />
      <Route path="/studio/dark/compactar-thumb" element={<Navigate to="/youtube/compactar-thumb" replace />} />
      <Route path="/studio" element={<Navigate to="/" replace />} />
      <Route path="/studio/*" element={<Navigate to="/" replace />} />
      <Route path="/avantistube/*" element={<Navigate to="/youtube" replace />} />
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
