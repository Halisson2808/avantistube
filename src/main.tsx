import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ─── Desregistrar todos os Service Workers (Supabase Realtime registrava sw.js automaticamente)
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
            registration.unregister();
            console.log("[main] Service Worker desregistrado:", registration.scope);
        }
    });
    // Limpar todo o cache dos Service Workers
    if ("caches" in window) {
        caches.keys().then((cacheNames) => {
            cacheNames.forEach((cacheName) => {
                caches.delete(cacheName);
                console.log("[main] Cache apagado:", cacheName);
            });
        });
    }
}

createRoot(document.getElementById("root")!).render(<App />);
