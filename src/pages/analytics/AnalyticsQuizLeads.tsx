/**
 * AnalyticsQuizLeads.tsx — leads e respostas dos quizzes, separados por nicho.
 * A tela é somente leitura; a integração de cada quiz será feita depois.
 */
import { useMemo, useState } from "react";
import {
  ChevronDown, ChevronRight, ClipboardList, MessageCircle, Phone, RefreshCw,
  Search, UserRound, UsersRound,
} from "lucide-react";

import { useQuizLeads } from "@/hooks/use-analytics";
import { EmptyState, MetricCard, Panel } from "@/components/analytics/AnalyticsShell";

const fmtDate = (value: string) => new Date(value).toLocaleString("pt-BR", {
  day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
});

// Texto provisório: será substituído quando a régua de remarketing for fechada.
const whatsappHref = (phone: string, name: string, result?: string | null) => {
  const digits = phone.replace(/\D/g, "");
  const international = digits.length === 10 || digits.length === 11 ? `55${digits}` : digits;
  const firstName = name.trim().split(/\s+/)[0] || name;
  const resultText = result ? ` e recebeu o resultado “${result}”` : "";
  const message = `Olá, ${firstName}! Vi que você concluiu a avaliação da Avó Yuki${resultText}. Posso te ajudar a entender por onde começar?`;
  return `https://wa.me/${international}?text=${encodeURIComponent(message)}`;
};

export default function AnalyticsQuizLeads() {
  const [niche, setNiche] = useState("");
  const [funnel, setFunnel] = useState("");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [openLead, setOpenLead] = useState<string | null>(null);
  const { niches, funnels, leads, isLoading, reload } = useQuizLeads({
    niche: niche || undefined,
    funnel: funnel || undefined,
    search: appliedSearch || undefined,
  });

  const visibleFunnels = useMemo(() => {
    if (!niche) return funnels;
    const nicheId = niches.find((item) => item.key === niche)?.id;
    return funnels.filter((item) => item.nicheId === nicheId);
  }, [funnels, niche, niches]);

  const completed = leads.filter((lead) => lead.attempts.some((attempt) => attempt.completedAt)).length;
  const consented = leads.filter((lead) => lead.consentWhatsapp).length;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Leads dos Quizzes</h1>
          <p className="text-white/40 text-xs mt-0.5">
            Nome, telefone, resultado e respostas separados por nicho e funil.
          </p>
        </div>
        <button
          onClick={reload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Atualizar
        </button>
      </div>

      <Panel title="Filtros da operação" icon={ClipboardList}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.4fr] gap-2">
          <select
            value={niche}
            onChange={(event) => { setNiche(event.target.value); setFunnel(""); }}
            className="h-9 rounded-lg bg-[#101014] border border-white/[0.08] text-white text-xs px-3 outline-none focus:border-emerald-500/40"
          >
            <option value="">Todos os nichos</option>
            {niches.map((item) => <option key={item.id} value={item.key}>{item.name}</option>)}
          </select>
          <select
            value={funnel}
            onChange={(event) => setFunnel(event.target.value)}
            className="h-9 rounded-lg bg-[#101014] border border-white/[0.08] text-white text-xs px-3 outline-none focus:border-emerald-500/40"
          >
            <option value="">Todos os funis</option>
            {visibleFunnels.map((item) => (
              <option key={item.id} value={item.key}>{item.name} · v{item.version}</option>
            ))}
          </select>
          <form
            onSubmit={(event) => { event.preventDefault(); setAppliedSearch(search.trim()); }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/25" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar nome, telefone ou e-mail"
                className="w-full h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs pl-9 pr-3 outline-none focus:border-emerald-500/40 placeholder:text-white/25"
              />
            </div>
            <button className="h-9 px-4 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-200 hover:bg-emerald-500/25 text-xs">
              Buscar
            </button>
          </form>
        </div>
      </Panel>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard icon={UsersRound} label="Leads encontrados" value={leads.length} loading={isLoading} />
        <MetricCard icon={ClipboardList} label="Quiz concluído" value={completed} loading={isLoading} />
        <MetricCard icon={MessageCircle} label="Consentimento WhatsApp" value={consented} loading={isLoading} />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((item) => <div key={item} className="h-20 rounded-xl bg-white/[0.04] animate-pulse" />)}
        </div>
      ) : leads.length === 0 ? (
        <EmptyState
          title="Nenhum lead capturado ainda"
          description="O quiz já está conectado. Os primeiros contatos aparecerão aqui assim que concluírem a identificação."
        />
      ) : (
        <div className="space-y-2">
          {leads.map((lead) => {
            const isOpen = openLead === lead.id;
            const latest = lead.attempts[0];
            return (
              <div key={lead.id} className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                <div className="flex items-stretch">
                  <button
                    onClick={() => setOpenLead(isOpen ? null : lead.id)}
                    className="flex-1 min-w-0 p-4 text-left hover:bg-white/[0.025] transition-colors"
                  >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/12 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <UserRound className="h-4 w-4 text-emerald-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="text-white text-sm font-medium">{lead.name}</p>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-white/50">
                          {lead.niche.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                          {lead.funnel.name}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[11px] text-white/40">
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>
                        <span>{latest?.resultLabel || "Resultado ainda não registrado"}</span>
                        <span>{lead.lastStage || "Etapa não informada"}</span>
                        <span>{fmtDate(lead.createdAt)}</span>
                      </div>
                    </div>
                    {isOpen
                      ? <ChevronDown className="h-4 w-4 text-white/40" />
                      : <ChevronRight className="h-4 w-4 text-white/40" />}
                  </div>
                  </button>
                  <a
                    href={whatsappHref(lead.phone, lead.name, latest?.resultLabel)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Abrir WhatsApp com mensagem provisória"
                    className="w-14 border-l border-white/[0.06] flex items-center justify-center text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </a>
                </div>

                {isOpen && (
                  <div className="border-t border-white/[0.06] p-4 bg-black/20 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                      <Info label="Telefone" value={lead.phone} />
                      <Info label="E-mail" value={lead.email || "Não informado"} />
                      <Info label="WhatsApp" value={lead.consentWhatsapp ? "Consentimento registrado" : "Sem consentimento"} />
                      <Info label="Origem" value={lead.source || "Não informada"} />
                      <Info label="Status" value={lead.status} />
                      <Info label="Última etapa" value={lead.lastStage || "Não informada"} />
                      <Info label="Tentativas" value={String(lead.attempts.length)} />
                    </div>

                    {lead.attempts.map((attempt, attemptIndex) => (
                      <div key={attempt.id} className="rounded-lg border border-white/[0.07] overflow-hidden">
                        <div className="px-3 py-2 bg-white/[0.035] flex flex-wrap justify-between gap-2">
                          <p className="text-white/75 text-xs font-medium">
                            Tentativa {lead.attempts.length - attemptIndex} · {attempt.resultLabel || "Sem resultado"}
                          </p>
                          <p className="text-white/30 text-[10px]">
                            {attempt.completedAt ? `Concluído em ${fmtDate(attempt.completedAt)}` : "Não concluído"}
                          </p>
                        </div>
                        {attempt.answers.length ? (
                          <div className="divide-y divide-white/[0.05]">
                            {attempt.answers.map((answer) => (
                              <div key={answer.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1.2fr] gap-1 px-3 py-2.5 text-xs">
                                <span className="text-white/45">{answer.questionLabel}</span>
                                <span className="text-white/85 font-medium">{answer.answerLabel}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="px-3 py-4 text-white/30 text-xs">Nenhuma resposta registrada nesta tentativa.</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/[0.03] border border-white/[0.05] px-3 py-2">
      <p className="text-white/30 text-[9px] uppercase tracking-wider">{label}</p>
      <p className="text-white/75 mt-0.5 break-words">{value}</p>
    </div>
  );
}
