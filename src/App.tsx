import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useBranding } from "@/lib/useBranding";

// Avantis Tube pages
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Monitoramento from "./pages/Monitoramento";
import Exportar from "./pages/Exportar";
import NotFound from "./pages/NotFound";
import SystemSelect from "./pages/SystemSelect";
import CanaisMonitoradosMobile from "./pages/CanaisMonitoradosMobile";
import { AppSidebar } from "@/components/AppSidebar";
import { BottomNav } from "@/components/BottomNav";

// Avantis Dark layout + pages
import { DarkLayout } from "@/components/DarkLayout";
import DarkDashboard from "./pages/dark/DarkDashboard";
import BaixarThumbYoutube from "./pages/dark/BaixarThumbYoutube";
import CompactarThumb from "./pages/dark/CompactarThumb";
import GeradorSRT from "./pages/dark/GeradorSRT";
import ManipulacaoTexto from "./pages/dark/ManipulacaoTexto";
import QuadroBranco from "./pages/dark/QuadroBranco";
import DarkRoteiro from "./pages/dark/DarkRoteiro";
import DarkTranscricao from "./pages/dark/DarkTranscricao";
import DarkTraducao from "./pages/dark/DarkTraducao";
import DarkTraduzirRoteiros from "./pages/dark/DarkTraduzirRoteiros";
import ConfiguracoesLocal from "./pages/dark/ConfiguracoesLocal";

const queryClient = new QueryClient();

const TubeLayout = ({ children }: { children: React.ReactNode }) => {
  useBranding("tube");
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col md:flex-row w-full pb-[60px] md:pb-0">
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
        <BottomNav />
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Landing page — seleção de sistema */}
          <Route path="/" element={<SystemSelect />} />

          {/* ── Avantis Tube ── */}
          <Route path="/avantistube" element={<TubeLayout><Dashboard /></TubeLayout>} />
          <Route path="/avantistube/search" element={<TubeLayout><Search /></TubeLayout>} />
          <Route path="/avantistube/monitoramento" element={<TubeLayout><Monitoramento /></TubeLayout>} />
          <Route path="/avantistube/exportar" element={<TubeLayout><Exportar /></TubeLayout>} />
          <Route path="/avantistube/canais-monitorados" element={<TubeLayout><CanaisMonitoradosMobile /></TubeLayout>} />

          {/* ── Avantis Dark ── */}
          <Route path="/avantisdark" element={<DarkLayout><DarkDashboard /></DarkLayout>} />
          <Route path="/avantisdark/roteiro" element={<DarkLayout><DarkRoteiro /></DarkLayout>} />
          <Route path="/avantisdark/transcricao" element={<DarkLayout><DarkTranscricao /></DarkLayout>} />
          <Route path="/avantisdark/traducao" element={<DarkLayout><DarkTraducao /></DarkLayout>} />
          <Route path="/avantisdark/traduzir-roteiros" element={<DarkLayout><DarkTraduzirRoteiros /></DarkLayout>} />
          <Route path="/avantisdark/gerador-srt" element={<DarkLayout><GeradorSRT /></DarkLayout>} />
          <Route path="/avantisdark/quadro-branco" element={<DarkLayout><QuadroBranco /></DarkLayout>} />
          <Route path="/avantisdark/manipulacao-texto" element={<DarkLayout><ManipulacaoTexto /></DarkLayout>} />
          <Route path="/avantisdark/baixar-thumb" element={<DarkLayout><BaixarThumbYoutube /></DarkLayout>} />
          <Route path="/avantisdark/compactar-thumb" element={<DarkLayout><CompactarThumb /></DarkLayout>} />
          <Route path="/avantisdark/configuracoes" element={<DarkLayout><ConfiguracoesLocal /></DarkLayout>} />

          {/* Redirects de rotas antigas */}
          <Route path="/dashboard" element={<Navigate to="/avantistube" replace />} />
          <Route path="/search" element={<Navigate to="/avantistube/search" replace />} />
          <Route path="/monitoramento" element={<Navigate to="/avantistube/monitoramento" replace />} />
          <Route path="/exportar" element={<Navigate to="/avantistube/exportar" replace />} />
          <Route path="/canais-monitorados" element={<Navigate to="/avantistube/canais-monitorados" replace />} />
          <Route path="/auth" element={<Navigate to="/" replace />} />
          <Route path="/monitored" element={<Navigate to="/avantistube/monitoramento" replace />} />
          <Route path="/recent-videos" element={<Navigate to="/avantistube/monitoramento" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
