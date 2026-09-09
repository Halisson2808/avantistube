/**
 * AnalyticsUtm.tsx — montador de links com UTM para colar nos anúncios.
 */
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, Link2, Wand2 } from "lucide-react";

import { useTrackingSites } from "@/hooks/use-analytics";
import { Panel } from "@/components/analytics/AnalyticsShell";

const PRESETS = [
    { label: "Meta Ads", source: "facebook", medium: "cpc", campaign: "{{campaign.name}}", content: "{{ad.name}}" },
    { label: "Google Ads", source: "google", medium: "cpc", campaign: "{campaignid}", content: "{creative}" },
    { label: "TikTok Ads", source: "tiktok", medium: "cpc", campaign: "__CAMPAIGN_NAME__", content: "__AID_NAME__" },
    { label: "Bio Instagram", source: "instagram", medium: "organico", campaign: "bio", content: "link-bio" },
    { label: "YouTube (descrição)", source: "youtube", medium: "organico", campaign: "video", content: "descricao" },
];

export default function AnalyticsUtm() {
    const { sites } = useTrackingSites();
    const [base, setBase] = useState("");
    const [source, setSource] = useState("");
    const [medium, setMedium] = useState("");
    const [campaign, setCampaign] = useState("");
    const [content, setContent] = useState("");
    const [term, setTerm] = useState("");

    const url = useMemo(() => {
        if (!base.trim()) return "";
        const normalizada = /^https?:\/\//i.test(base.trim()) ? base.trim() : `https://${base.trim()}`;
        let u: URL;
        try { u = new URL(normalizada); } catch { return ""; }

        const campos: Array<[string, string]> = [
            ["utm_source", source],
            ["utm_medium", medium],
            ["utm_campaign", campaign],
            ["utm_content", content],
            ["utm_term", term],
        ];
        for (const [k, v] of campos) {
            if (v.trim()) u.searchParams.set(k, v.trim());
        }
        return decodeURIComponent(u.toString());
    }, [base, source, medium, campaign, content, term]);

    function aplicarPreset(p: typeof PRESETS[number]) {
        setSource(p.source);
        setMedium(p.medium);
        setCampaign(p.campaign);
        setContent(p.content);
        toast.success(`Preset ${p.label} aplicado.`);
    }

    return (
        <div className="space-y-6 pb-10">
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Gerador de Links (UTM)</h1>
                <p className="text-white/40 text-xs mt-0.5">
                    Monte o link do anúncio com as marcações que o painel usa para separar cada origem.
                </p>
            </div>

            <Panel title="Atalhos por plataforma" icon={Wand2}>
                <div className="flex flex-wrap gap-1.5">
                    {PRESETS.map((p) => (
                        <button
                            key={p.label}
                            onClick={() => aplicarPreset(p)}
                            className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.08] text-[11px] transition-colors"
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </Panel>

            <Panel title="Link" icon={Link2}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Field label="URL de destino" value={base} onChange={setBase} placeholder="https://minhaoferta.com.br/vsl" full
                        list={sites.filter(s => s.domain).map(s => `https://${s.domain}`)} />
                    <Field label="utm_source (de onde vem)" value={source} onChange={setSource} placeholder="facebook" />
                    <Field label="utm_medium (tipo)" value={medium} onChange={setMedium} placeholder="cpc" />
                    <Field label="utm_campaign (campanha)" value={campaign} onChange={setCampaign} placeholder="black-friday" />
                    <Field label="utm_content (criativo)" value={content} onChange={setContent} placeholder="video-01" />
                    <Field label="utm_term (palavra-chave)" value={term} onChange={setTerm} placeholder="opcional" />
                </div>

                <div className="pt-2 space-y-2">
                    <div className="rounded-lg bg-black/40 border border-white/[0.08] p-3 min-h-[52px] break-all">
                        <p className="text-[11px] text-emerald-200/90 font-mono">
                            {url || <span className="text-white/25">Preencha a URL de destino para gerar o link.</span>}
                        </p>
                    </div>
                    <button
                        disabled={!url}
                        onClick={() => navigator.clipboard.writeText(url).then(
                            () => toast.success("Link copiado."),
                            () => toast.error("Não foi possível copiar."),
                        )}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-200 hover:bg-emerald-500/25 text-xs transition-colors disabled:opacity-40"
                    >
                        <Copy className="h-3.5 w-3.5" /> Copiar link
                    </button>
                </div>
            </Panel>

            <p className="text-white/30 text-[11px]">
                O pixel guarda a UTM e o identificador do anúncio (fbclid, gclid, ttclid) durante toda a sessão —
                então uma venda feita minutos depois continua atribuída à campanha certa.
            </p>
        </div>
    );
}

function Field({ label, value, onChange, placeholder, full, list }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    full?: boolean;
    list?: string[];
}) {
    const listId = list?.length ? `dl-${label.replace(/\W/g, "")}` : undefined;
    return (
        <div className={`space-y-1 ${full ? "md:col-span-2" : ""}`}>
            <label className="text-white/40 text-[10px] uppercase tracking-wider">{label}</label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                list={listId}
                className="w-full h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs px-3 outline-none focus:border-emerald-500/40 placeholder:text-white/25"
            />
            {listId && (
                <datalist id={listId}>
                    {list?.map((v) => <option key={v} value={v} />)}
                </datalist>
            )}
        </div>
    );
}
