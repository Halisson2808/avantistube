import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import MyChannels from "./pages/MyChannels";
import Monitoramento from "./pages/Monitoramento";
import Exportar from "./pages/Exportar";
import NotFound from "./pages/NotFound";
import { AppSidebar } from "@/components/AppSidebar";
import { BottomNav } from "@/components/BottomNav";
import CanaisMonitoradosMobile from "./pages/CanaisMonitoradosMobile";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col md:flex-row w-full pb-[60px] md:pb-0">
        {/* Sidebar - visível apenas no desktop */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        {/* Conteúdo principal */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>

        {/* BottomNav exclusiva para Mobile */}
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
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/search" element={<Layout><Search /></Layout>} />
          <Route path="/my-channels" element={<Layout><MyChannels /></Layout>} />
          <Route path="/monitoramento" element={<Layout><Monitoramento /></Layout>} />
          <Route path="/exportar" element={<Layout><Exportar /></Layout>} />
          <Route path="/canais-monitorados" element={<Layout><CanaisMonitoradosMobile /></Layout>} />
          {/* Redirect old routes */}
          <Route path="/auth" element={<Navigate to="/" replace />} />
          <Route path="/monitored" element={<Navigate to="/monitoramento" replace />} />
          <Route path="/recent-videos" element={<Navigate to="/monitoramento" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
