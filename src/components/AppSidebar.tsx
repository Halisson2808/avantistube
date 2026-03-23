import { Home, Search, TrendingUp, Lock, ExternalLink, Download, ArrowLeft } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import tubeLogo from "@/assets/logo.png";
import { useMonitoredChannels } from "@/hooks/use-monitored-channels";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
}
  from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/avantistube", icon: Home, locked: false },
  { title: "Buscar Vídeos", url: "/avantistube/search", icon: Search, locked: false },
  { title: "Monitoramento", url: "/avantistube/monitoramento", icon: TrendingUp, locked: false },
  { title: "Exportar Dados", url: "/avantistube/exportar", icon: Download, locked: false },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { channels } = useMonitoredChannels();

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="w-64 bg-card border-r border-border z-40" collapsible="offcanvas">
      <SidebarContent className="bg-card">
        <div className="p-4 flex items-center gap-3 border-b border-border">
          <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
            <img src={tubeLogo} alt="Avantis Tube" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-sm block truncate">Avantis Tube</span>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-muted/50 transition-smooth flex items-center justify-between"
                      activeClassName="sidebar-active font-medium"
                    >
                      <>
                        <div className="flex items-center">
                          <item.icon className="mr-2" />
                          <span>{item.title}</span>
                        </div>
                        {item.locked && <Lock className="w-3 h-3 text-muted-foreground" />}
                      </>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Lista de Canais Monitorados */}
        {channels.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>
              <span>Canais ({channels.length})</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <ScrollArea className="h-[350px]">
                <div className="space-y-1 pr-2">
                  {[...channels]
                    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
                    .map((channel) => (
                      <a
                        key={channel.channelId}
                        href={`https://youtube.com/channel/${channel.channelId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-smooth group cursor-pointer"
                      >
                        {channel.channelThumbnail && (
                          <img
                            src={channel.channelThumbnail}
                            alt={channel.channelTitle}
                            className="w-6 h-6 rounded-full flex-shrink-0"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate group-hover:text-foreground">
                            {channel.channelTitle}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {channel.niche && (
                              <span className="text-[9px] text-muted-foreground truncate max-w-[50px]">
                                {channel.niche}
                              </span>
                            )}
                            {channel.niche && channel.contentType && (
                              <span className="text-[9px] text-muted-foreground">•</span>
                            )}
                            {channel.contentType && (
                              <span className={`text-[9px] ${channel.contentType === 'shorts' ? 'text-purple-400' : 'text-blue-400'
                                }`}>
                                {channel.contentType === 'shorts' ? 'Shorts' : 'Long'}
                              </span>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </a>
                    ))}
                </div>
              </ScrollArea>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      {/* Rodapé fixo — Avantis Studio */}
      <div className="border-t border-border p-3 mt-auto">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Avantis Studio</span>
        </button>
      </div>
    </Sidebar>
  );
}
