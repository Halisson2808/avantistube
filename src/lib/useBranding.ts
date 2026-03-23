import { useEffect } from "react";

type BrandingConfig = {
    title: string;
    favicon: string; // path relativo à raiz pública, ex: "/studio-favicon.png"
};

const BRANDS: Record<"studio" | "tube" | "dark", BrandingConfig> = {
    studio: {
        title: "Avantis Studio",
        favicon: "/studio-favicon.png",
    },
    tube: {
        title: "Avantis Tube",
        favicon: "/tube-favicon.png",
    },
    dark: {
        title: "Avantis Dark",
        favicon: "/favicon.png", // logo branca fundo preto
    },
};

function setFavicon(href: string) {
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        link.type = "image/png";
        document.head.appendChild(link);
    }
    link.href = href;
}

export function useBranding(brand: keyof typeof BRANDS) {
    useEffect(() => {
        const config = BRANDS[brand];
        document.title = config.title;
        setFavicon(config.favicon);

        return () => {
            // restaura Studio ao sair (opcional — evita aba desatualizada)
            document.title = BRANDS.studio.title;
            setFavicon(BRANDS.studio.favicon);
        };
    }, [brand]);
}
