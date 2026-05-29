import { StudioSidebar } from "@/components/StudioSidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBranding } from "@/lib/useBranding";

interface StudioLayoutProps {
    children: React.ReactNode;
}

export function StudioLayout({ children }: StudioLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    useBranding("studio");

    return (
        <div className="min-h-screen flex w-full bg-[hsl(240,10%,3.9%)] selection:bg-blue-500/30">
            {/* Mobile Header */}
            <header
                className="md:hidden fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-4 border-b border-white/5"
                style={{ background: "rgba(10,10,14,0.90)", backdropFilter: "blur(12px)" }}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-white hover:bg-white/5"
                >
                    <Menu className="h-5 w-5" />
                </Button>
                <h1 className="ml-3 text-sm font-semibold tracking-wide text-white">Avantis Studio</h1>
            </header>

            {/* Sidebar */}
            <StudioSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:ml-64 pt-14 md:pt-0 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-red-500/6 blur-[120px] rounded-full pointer-events-none" />
                <main className="flex-1 p-4 md:p-6 z-10 w-full">
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
