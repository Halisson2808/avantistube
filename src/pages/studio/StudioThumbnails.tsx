import { useState } from "react";
import { Download, Minimize2 } from "lucide-react";
import BaixarThumbYoutube from "@/pages/dark/BaixarThumbYoutube";
import CompactarThumb from "@/pages/dark/CompactarThumb";

type Tab = "baixar" | "compactar";

export default function StudioThumbnails() {
    const [active, setActive] = useState<Tab>("baixar");

    return (
        <div className="space-y-6">
            {/* Toggle */}
            <div className="flex justify-center">
            <div className="inline-flex items-center rounded-xl bg-white/[0.05] border border-white/[0.08] p-1 gap-1">
                <button
                    onClick={() => setActive("baixar")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        active === "baixar"
                            ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                >
                    <Download className="h-4 w-4" />
                    Baixar Thumb
                </button>
                <button
                    onClick={() => setActive("compactar")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        active === "compactar"
                            ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                >
                    <Minimize2 className="h-4 w-4" />
                    Compactar Thumb
                </button>
            </div>
            </div>

            {/* Conteúdo */}
            <div>
                {active === "baixar" ? <BaixarThumbYoutube /> : <CompactarThumb />}
            </div>
        </div>
    );
}
