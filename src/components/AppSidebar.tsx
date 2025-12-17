import { Home, Search, TrendingUp, Youtube, Lock, Clock, ExternalLink } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
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
  { title: "Dashboard", url: "/", icon: Home, locked: false },
  { title: "Buscar Vídeos", url: "/search", icon: Search, locked: false },
  { title: "Canais Monitorados", url: "/monitored", icon: TrendingUp, locked: false },
  { title: "Meus Canais", url: "/my-channels", icon: Youtube, locked: false },
  { title: "Vídeos Recentes", url: "/recent-videos", icon: Clock, locked: false },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { channels } = useMonitoredChannels();
  
  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="w-64 bg-card border-r border-border z-40" collapsible="offcanvas"> 
      <SidebarContent className="bg-card">
        <div className="p-4 flex items-center gap-3 border-b border-border">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-xl object-cover" />
          <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AvantisTube
          </span>
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
                  {channels.map((channel) => (
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
                            <span className={`text-[9px] ${
                              channel.contentType === 'shorts' ? 'text-purple-400' : 'text-blue-400'
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
    </Sidebar>
  );
}
