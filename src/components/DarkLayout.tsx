import { DarkSidebar } from "@/components/DarkSidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBranding } from "@/lib/useBranding";

interface DarkLayoutProps {
    children: React.ReactNode;
}

export function DarkLayout({ children }: DarkLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    useBranding("dark");

    return (
        <div className="min-h-screen flex w-full bg-[hsl(240,10%,3.9%)] selection:bg-blue-500/30">
            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-4 border-b border-white/5"
                style={{ background: 'rgba(15,15,18,0.85)', backdropFilter: 'blur(12px)' }}>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-white hover:bg-white/5"
                >
                    <Menu className="h-5 w-5" />
                </Button>
                <h1 className="ml-3 text-sm font-semibold tracking-wide text-white">Avantis Dark</h1>
            </header>

            {/* Sidebar */}
            <DarkSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:ml-64 pt-14 md:pt-0 relative overflow-hidden">
                {/* Ambient light decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
                <main className="flex-1 p-6 md:p-10 lg:p-12 z-10 w-full max-w-7xl mx-auto">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
