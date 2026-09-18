/**
 * AnalyticsQuizLeads.tsx — leads e respostas separados por site e quiz.
 * A tela agrupa cada pessoa por telefone e oferece a recuperação manual em duas mensagens.
 */
import { useMemo, useState } from "react";
import {
  Check, ChevronDown, ChevronRight, Clipboard, ClipboardList, MessageCircle, Phone, RefreshCw,
  Search, UserRound, UsersRound,
} from "lucide-react";

import { useQuizLeads } from "@/hooks/use-analytics";
import { EmptyState, MetricCard, Panel } from "@/components/analytics/AnalyticsShell";

const fmtDate = (value: string) => new Date(value).toLocaleString("pt-BR", {
  day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
});

const firstName = (name: string) => name.trim().split(/\s+/)[0] || name;

const resultFocus = (result?: string | null) => {
  if (!result) return "o cuidado indicado nas suas respostas";
  return result
    .replace(/^Seu foco principal (?:hoje )?está em\s*/i, "")
    .replace(/^Seu incômodo pede\s*/i, "")
    .replace(/^Sua atenção está em\s*/i, "")
    .replace(/[.!]$/, "")
    .toLocaleLowerCase("pt-BR");
};

const recommendedBlock = (resultKey?: string | null, resultLabel?: string | null) => {
  const key = (resultKey || resultLabel || "").toLocaleLowerCase("pt-BR");
  if (/articula|mobilidade|osso|dor/.test(key)) return "Dor e articulação";
  if (/circula|perna|variz/.test(key)) return "Circulação e pernas";
  if (/digest|barriga|fígado|figado|incha/.test(key)) return "Digestão e inchaço";
  if (/respira|pulmão|pulmao|tosse|imunidade/.test(key)) return "Pulmão, tosse e imunidade";
  if (/pele/.test(key)) return "Pele";
  if (/sono|descanso|ansiedade|cansaço|cansaco|energia/.test(key)) return "Sono, ansiedade e cansaço";
  return null;
};

const answerByQuestion = (attempt: { answers: Array<{ questionLabel: string; answerLabel: string }> } | undefined, term: RegExp) =>
  attempt?.answers.find((answer) => term.test(answer.questionLabel))?.answerLabel;

const firstRecoveryMessage = (name: string, attempt?: { resultLabel?: string | null; answers: Array<{ questionLabel: string; answerLabel: string }> }) => {
  const situation = answerByQuestion(attempt, /situação|situacao/i);
  const frequency = answerByQuestion(attempt, /frequência|frequencia/i);
  const details = situation && frequency
    ? ` Você marcou que ${situation.toLocaleLowerCase("pt-BR")} e que isso aparece ${frequency.toLocaleLowerCase("pt-BR")}.`
    : "";

  return `Oi, ${firstName(name)}. Revisei sua avaliação da Avó Yuki.\n\nSeu resultado mostrou que o ponto que mais merece atenção hoje é ${resultFocus(attempt?.resultLabel)}.${details}\n\nJá deixei separado o bloco por onde você deve começar. Responda SIM que eu te envio o acesso agora.`;
};

const offerRecoveryMessage = (name: string, attempt?: { resultKey?: string | null; resultLabel?: string | null }) => {
  const block = recommendedBlock(attempt?.resultKey, attempt?.resultLabel);
  const direction = block
    ? `Para o resultado da sua avaliação, comece pelo bloco ${block} do Caderno da Avó Yuki.`
    : "Para o resultado da sua avaliação, confira os nove blocos do Caderno da Avó Yuki e comece pelo que corresponde ao incômodo descrito no material.";

  return `Perfeito, ${firstName(name)}.\n\nO seu próximo passo não é continuar salvando dicas soltas e tentando lembrar o que usar quando o incômodo aparece.\n\n${direction}\n\nNele você encontra preparos organizados, com quantidade, modo de preparo, frequência e cuidados importantes — para não continuar escolhendo receitas no escuro.\n\nO acesso completo inclui mais de 70 receitas separadas por sintomas e está por R$ 37,90.\n\nVocê tem 7 dias para abrir e conferir o material.\n\nPegue seu acesso aqui:\nhttps://yukinakamura.vercel.app/acesso`;
};

const whatsappHref = (phone: string, message: string) => {
  const digits = phone.replace(/\D/g, "");
  const international = digits.length === 10 || digits.length === 11 ? `55${digits}` : digits;
  return `https://wa.me/${international}?text=${encodeURIComponent(message)}`;
};

export default function AnalyticsQuizLeads() {
  const [site, setSite] = useState("");
  const [quiz, setQuiz] = useState("");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [openLead, setOpenLead] = useState<string | null>(null);
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  const { sites, funnels, leads, isLoading, reload } = useQuizLeads({
    site: site || undefined,
    quiz: quiz ? Number(quiz) : undefined,
    search: appliedSearch || undefined,
  });

  const visibleFunnels = useMemo(() => {
    if (!site) return funnels;
    return funnels.filter((item) => item.siteKey === site);
  }, [funnels, site]);

  const completed = leads.filter((lead) => lead.attempts.some((attempt) => attempt.completedAt)).length;
  const consented = leads.filter((lead) => lead.consentWhatsapp).length;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Leads dos Quizzes</h1>
          <p className="text-white/40 text-xs mt-0.5">
            Nome, telefone, resultado e respostas separados por site e quiz.
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
            value={site}
            onChange={(event) => { setSite(event.target.value); setQuiz(""); }}
            className="h-9 rounded-lg bg-[#101014] border border-white/[0.08] text-white text-xs px-3 outline-none focus:border-emerald-500/40"
          >
            <option value="">Todos os sites</option>
            {sites.map((item) => <option key={item.id} value={item.key}>{item.name}</option>)}
          </select>
          <select
            value={quiz}
            onChange={(event) => setQuiz(event.target.value)}
            className="h-9 rounded-lg bg-[#101014] border border-white/[0.08] text-white text-xs px-3 outline-none focus:border-emerald-500/40"
          >
            <option value="">Todos os quizzes</option>
            {visibleFunnels.map((item) => (
              <option key={item.id} value={item.quizNumber}>Quiz {String(item.quizNumber).padStart(2, "0")} · {item.route}</option>
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
            const openingMessage = firstRecoveryMessage(lead.name, latest);
            const offerMessage = offerRecoveryMessage(lead.name, latest);
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
                          {lead.site.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                          Quiz {String(lead.funnel.quizNumber).padStart(2, "0")} · {lead.funnel.route}
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
                    href={whatsappHref(lead.phone, openingMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Abrir WhatsApp com a primeira mensagem de recuperação"
                    className="w-14 border-l border-white/[0.06] flex items-center justify-center text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </a>
                </div>

                {isOpen && (
                  <div className="border-t border-white/[0.06] p-4 bg-black/20 space-y-4">
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] p-3 space-y-3">
                      <div>
                        <p className="text-emerald-200 text-xs font-semibold">Recuperação pelo WhatsApp</p>
                        <p className="text-white/45 text-[11px] mt-1">
                          Abra a conversa com a mensagem curta. Quando a pessoa responder SIM, copie e envie a oferta.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={whatsappHref(lead.phone, openingMessage)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-500 px-3 text-xs font-semibold text-emerald-950 hover:bg-emerald-400 transition-colors"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          Abrir conversa
                        </a>
                        <button
                          type="button"
                          onClick={async () => {
                            const copyKey = `${lead.id}:opening`;
                            await navigator.clipboard.writeText(openingMessage);
                            setCopiedMessage(copyKey);
                            window.setTimeout(() => setCopiedMessage((current) => current === copyKey ? null : current), 2000);
                          }}
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.10] bg-white/[0.05] px-3 text-xs font-semibold text-white/80 hover:bg-white/[0.09] hover:text-white transition-colors"
                        >
                          {copiedMessage === `${lead.id}:opening` ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Clipboard className="h-3.5 w-3.5" />}
                          {copiedMessage === `${lead.id}:opening` ? "Mensagem 1 copiada" : "Copiar mensagem 1"}
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const copyKey = `${lead.id}:offer`;
                            await navigator.clipboard.writeText(offerMessage);
                            setCopiedMessage(copyKey);
                            window.setTimeout(() => setCopiedMessage((current) => current === copyKey ? null : current), 2000);
                          }}
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.10] bg-white/[0.05] px-3 text-xs font-semibold text-white/80 hover:bg-white/[0.09] hover:text-white transition-colors"
                        >
                          {copiedMessage === `${lead.id}:offer` ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Clipboard className="h-3.5 w-3.5" />}
                          {copiedMessage === `${lead.id}:offer` ? "Mensagem 2 copiada" : "Copiar mensagem 2"}
                        </button>
                      </div>
                      <details className="text-[11px] text-white/45">
                        <summary className="cursor-pointer hover:text-white/70">Conferir as duas mensagens</summary>
                        <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-2">
                          <pre className="whitespace-pre-wrap font-sans rounded-lg border border-white/[0.06] bg-black/20 p-3 text-white/65">{openingMessage}</pre>
                          <pre className="whitespace-pre-wrap font-sans rounded-lg border border-white/[0.06] bg-black/20 p-3 text-white/65">{offerMessage}</pre>
                        </div>
                      </details>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                      <Info label="Telefone" value={lead.phone} />
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
