import { Home, Search, TrendingUp, Youtube, Lock } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: Home, locked: false },
  { title: "Buscar Vídeos", url: "/search", icon: Search, locked: false },
  { title: "Canais Monitorados", url: "/monitored", icon: TrendingUp, locked: false },
  { title: "Meus Canais", url: "/my-channels", icon: Youtube, locked: false },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="w-64 bg-card border-r border-border" collapsible="none">
      <SidebarContent className="bg-card">
        <div className="p-4 flex items-center gap-2 border-b border-border">
          <img src={logo} alt="Logo" className="w-8 h-8" />
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
                      activeClassName="bg-accent/20 text-primary font-medium"
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-2" />
                        <span>{item.title}</span>
                      </div>
                      {item.locked && <Lock className="w-3 h-3 text-muted-foreground" />}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
