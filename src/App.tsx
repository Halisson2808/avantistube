import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { installApiAuthFetch } from "@/lib/apiAuth";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Funções (reaproveitadas dentro do Studio)
import Search from "./pages/Search";
import Monitoramento from "./pages/Monitoramento";
import Exportar from "./pages/Exportar";
import QuadroBranco from "./pages/dark/QuadroBranco";
import DarkTranscricao from "./pages/dark/DarkTranscricao";
import GeradorSRT from "./pages/dark/GeradorSRT";
import ManipulacaoTexto from "./pages/dark/ManipulacaoTexto";
import BaixarThumbYoutube from "./pages/dark/BaixarThumbYoutube";
import CompactarThumb from "./pages/dark/CompactarThumb";

// Avantis Studio (único sistema)
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
      {/* Entra direto no Studio */}
      <Route path="/" element={wrap(<StudioDashboard />)} />

      {/* Tube */}
      <Route path="/studio/tube/buscar" element={wrap(<Search />)} />
      <Route path="/studio/tube/monitoramento" element={wrap(<Monitoramento />)} />
      <Route path="/studio/tube/exportar" element={wrap(<Exportar />)} />

      {/* Dark */}
      <Route path="/studio/dark/quadro-branco" element={wrap(<QuadroBranco />)} />
      <Route path="/studio/dark/transcricao" element={wrap(<DarkTranscricao />)} />
      <Route path="/studio/dark/gerador-srt" element={wrap(<GeradorSRT />)} />
      <Route path="/studio/dark/manipulacao-texto" element={wrap(<ManipulacaoTexto />)} />
      <Route path="/studio/dark/thumbnails" element={wrap(<StudioThumbnails />)} />
      <Route path="/studio/dark/baixar-thumb" element={wrap(<BaixarThumbYoutube />)} />
      <Route path="/studio/dark/compactar-thumb" element={wrap(<CompactarThumb />)} />

      {/* Redireciona caminhos antigos para a raiz */}
      <Route path="/studio" element={<Navigate to="/" replace />} />
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
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ProtectedApp />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
