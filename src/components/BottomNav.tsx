import { Home, Search, TrendingUp, Youtube, ListVideo } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

export function BottomNav() {
    const location = useLocation();
    const currentPath = location.pathname;

    const items = [
        { title: "Início", url: "/", icon: Home },
        { title: "Buscar", url: "/search", icon: Search },
        { title: "Monitorar", url: "/monitoramento", icon: TrendingUp },
        { title: "Canais", url: "/canais-monitorados", icon: ListVideo },
        { title: "Meus", url: "/my-channels", icon: Youtube },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card z-50 flex items-center justify-around pb-safe min-h-[70px]">
            {items.map((item) => {
                const isActive = currentPath === item.url;
                return (
                    <NavLink
                        key={item.url}
                        to={item.url}
                        className={`flex flex-col items-center justify-center w-full py-3 space-y-1 ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-[11px] sm:text-xs text-center font-medium leading-tight">
                            {item.title}
                        </span>
                    </NavLink>
                );
            })}
        </nav>
    );
}
