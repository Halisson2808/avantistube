import { useEffect } from "react";
import { BarChart2, Loader2 } from "lucide-react";

// URL do sistema Avantis Dark. Ajuste conforme o ambiente.
const AVANTIS_DARK_URL = "http://localhost:5173";

const AvantisDark = () => {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = AVANTIS_DARK_URL;
        }, 1800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-6">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-cyan-900/40">
                <BarChart2 size={36} className="text-white" />
            </div>

            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Avantis Dark</h2>
                <p className="text-white/50 text-sm">Redirecionando para o sistema…</p>
            </div>

            <Loader2 size={24} className="text-cyan-400 animate-spin" />
        </div>
    );
};

export default AvantisDark;
