/**
 * PDF 1 — Rota: /pdf/ebook-um · Guia Anti-Acne
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';
import {
  StatsRow, StepList, CheckList, CrossList, Callout,
  QuoteBlock, ComparisonCard, HighlightBanner, SectionDivider,
  Timeline, TagRow, FactBox, Divider,
} from '@/components/ebook/VisualElements';

function LesionCard({
  name,
  description,
  tratamento,
}: {
  name: string;
  description: string;
  tratamento: string;
}) {
  return (
    <div className="avoid-page-break mb-3 rounded-xl border border-primary/12 bg-white/90 p-3.5 shadow-sm shadow-primary/[0.06]">
      <h4 className="font-display text-[1.05rem] font-semibold leading-snug text-primary">{name}</h4>
      <p className="mt-1.5 text-[13px] leading-snug text-foreground/88">{description}</p>
      <div className="mt-2.5 border-t border-primary/10 pt-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">Tratamento</span>
        <p className="mt-0.5 text-[13px] leading-snug text-foreground/90">{tratamento}</p>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-2.5 mt-1 font-display text-lg font-semibold tracking-tight text-[hsl(340_26%_24%)] first:mt-0">
      {children}
    </h3>
  );
}

function PorQueBox({ children }: { children: ReactNode }) {
  return (
    <div className="mt-2 overflow-hidden rounded-lg border-l-[3px] border-primary/45 bg-primary/[0.07] px-3 py-2 leading-normal">
      <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">Por quê?</div>
      <div className="text-[12.5px] leading-snug text-foreground/90">{children}</div>
    </div>
  );
}

function RoutinePeriodHeader({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="mb-3 flex items-center gap-2.5 border-b border-primary/15 pb-2.5">
      <span className="text-[1.35rem] leading-none" aria-hidden>
        {emoji}
      </span>
      <h3 className="font-display text-[1.25rem] font-semibold tracking-tight text-primary">{label}</h3>
    </div>
  );
}

function RoutineStep({
  step,
  title,
  instruction,
  why,
  attention,
  tip,
}: {
  step: number;
  title: string;
  instruction: ReactNode;
  why: ReactNode;
  attention?: string;
  tip?: string;
}) {
  return (
    <div className="avoid-page-break mb-3.5 rounded-xl border border-primary/10 bg-white/85 p-3 shadow-sm shadow-primary/[0.04] last:mb-0">
      <div className="flex gap-2.5">
        <span className="block h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-primary to-[hsl(350_58%_48%)] text-center text-xs font-bold leading-7 text-primary-foreground shadow-sm">
          {step}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="font-display text-[1.02rem] font-semibold leading-tight text-[hsl(340_28%_22%)]">
            {title}
          </h4>
          <div className="mt-1.5 text-[13px] leading-snug text-foreground/90">{instruction}</div>
          <PorQueBox>{why}</PorQueBox>
          {attention && (
            <div className="mt-2 overflow-hidden rounded-md border border-amber-200/80 bg-amber-50/90 px-2.5 py-1.5 text-[12px] leading-normal text-amber-950/90">
              <span className="font-semibold text-amber-900">Atenção: </span>
              {attention}
            </div>
          )}
          {tip && (
            <div className="mt-2 overflow-hidden rounded-md border border-primary/15 bg-primary/[0.05] px-2.5 py-1.5 text-[12px] leading-normal text-foreground/90">
              <span className="font-semibold text-primary">Dica: </span>
              {tip}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProtocolTable() {
  const rows = [
    { passo: '1', manha: 'Sabonete c/ ácido salicílico', noite: 'Demaquilante' },
    { passo: '2', manha: 'Tônico BHA (opcional)', noite: 'Sabonete c/ ácido salicílico' },
    { passo: '3', manha: 'Sérum niacinamida', noite: 'Peróxido de benzoíla (pontual)' },
    { passo: '4', manha: 'Hidratante oil-free', noite: 'Sérum retinol (2–3×/semana)' },
    { passo: '5', manha: 'Protetor solar', noite: 'Hidratante oil-free' },
  ];
  return (
    <div className="avoid-page-break overflow-hidden rounded-xl border border-primary/15 bg-white/95 shadow-sm">
      <table className="w-full border-collapse text-left text-[11px] leading-snug">
        <thead>
          <tr className="bg-gradient-to-r from-primary/12 to-[hsl(350_40%_94%)]">
            <th className="px-2 py-2 font-display font-semibold text-[hsl(340_28%_22%)]">Passo</th>
            <th className="px-2 py-2 font-display font-semibold text-[hsl(340_28%_22%)]">
              <span aria-hidden>☀️ </span>Manhã
            </th>
            <th className="px-2 py-2 font-display font-semibold text-[hsl(340_28%_22%)]">
              <span aria-hidden>🌙 </span>Noite
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.passo} className="border-t border-primary/10 odd:bg-[hsl(var(--ebook-paper))]">
              <td className="px-2 py-1.5 font-semibold text-primary">{r.passo}</td>
              <td className="px-2 py-1.5 text-foreground/92">{r.manha}</td>
              <td className="px-2 py-1.5 text-foreground/92">{r.noite}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActiveIngredientCard({
  name,
  concentration,
  description,
  melhorPara,
  comoUsar,
  attention,
}: {
  name: string;
  concentration: string;
  description: string;
  melhorPara: string;
  comoUsar: string;
  attention?: string;
}) {
  return (
    <div className="avoid-page-break mb-3.5 rounded-xl border border-primary/12 bg-white/90 p-3.5 shadow-sm shadow-primary/[0.05] last:mb-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="font-display text-[1.06rem] font-semibold leading-snug text-[hsl(340_28%_22%)]">{name}</h4>
        <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-center text-[10px] font-bold uppercase tracking-wide text-primary">
          {concentration}
        </span>
      </div>
      <p className="mt-2 text-[13px] leading-snug text-foreground/90">{description}</p>
      <div className="mt-3 space-y-2 border-t border-primary/10 pt-3">
        <p className="text-[12.5px] leading-snug text-foreground/92">
          <span className="font-semibold text-primary">Melhor para </span>
          {melhorPara}
        </p>
        <p className="text-[12.5px] leading-snug text-foreground/92">
          <span className="font-semibold text-primary">Como usar </span>
          {comoUsar}
        </p>
      </div>
      {attention && (
        <div className="mt-2.5 overflow-hidden rounded-lg border border-amber-200/90 bg-amber-50/95 px-2.5 py-2 text-[12px] leading-normal text-amber-950/90">
          <span className="font-semibold text-amber-900">Atenção: </span>
          {attention}
        </div>
      )}
    </div>
  );
}

function SequelaCard({
  title,
  causa,
  tempo,
  tratamento,
}: {
  title: string;
  causa: string;
  tempo: string;
  tratamento: string;
}) {
  return (
    <div className="avoid-page-break mb-3.5 rounded-xl border border-primary/12 bg-white/90 p-3.5 shadow-sm shadow-primary/[0.05] last:mb-0">
      <h4 className="font-display text-[1.06rem] font-semibold leading-snug text-[hsl(340_28%_22%)]">{title}</h4>
      <dl className="mt-3 space-y-2.5 border-t border-primary/10 pt-3 text-[13px] leading-snug text-foreground/92">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">Causa</dt>
          <dd className="mt-0.5">{causa}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">Tempo</dt>
          <dd className="mt-0.5">{tempo}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">Tratamento</dt>
          <dd className="mt-0.5">{tratamento}</dd>
        </div>
      </dl>
    </div>
  );
}

function SabotageHabit({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="avoid-page-break mb-2.5 flex gap-2.5 rounded-xl border border-[hsl(350_35%_88%)] bg-white/95 p-3 shadow-sm shadow-primary/[0.04] last:mb-0">
      <span className="pt-0.5 text-[1.2rem] leading-none" aria-hidden>
        ❌
      </span>
      <div className="min-w-0 flex-1">
        <h4 className="font-display text-[1.02rem] font-semibold leading-snug text-[hsl(340_28%_22%)]">{title}</h4>
        <p className="mt-1 text-[13px] leading-snug text-foreground/90">{children}</p>
      </div>
    </div>
  );
}

function NutritionSectionTitle({ emoji, children }: { emoji: string; children: ReactNode }) {
  return (
    <div className="mb-3 mt-4 flex items-center gap-2.5 border-b border-primary/12 pb-2.5 first:mt-0">
      <span className="text-[1.35rem] leading-none" aria-hidden>
        {emoji}
      </span>
      <h3 className="font-display text-[1.15rem] font-semibold tracking-tight text-[hsl(340_28%_22%)]">
        {children}
      </h3>
    </div>
  );
}

function NutritionPitfall({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="avoid-page-break mb-2.5 rounded-xl border border-amber-200/75 bg-gradient-to-br from-amber-50/90 to-orange-50/40 p-3 last:mb-0">
      <h4 className="font-display text-[1.02rem] font-semibold leading-snug text-amber-950/95">{title}</h4>
      <p className="mt-1 text-[13px] leading-snug text-foreground/90">{children}</p>
    </div>
  );
}

function NutritionBenefit({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="avoid-page-break mb-2.5 rounded-xl border border-emerald-200/65 bg-gradient-to-br from-emerald-50/70 to-teal-50/30 p-3 last:mb-0">
      <h4 className="font-display text-[1.02rem] font-semibold leading-snug text-emerald-950/90">{title}</h4>
      <p className="mt-1 text-[13px] leading-snug text-foreground/90">{children}</p>
    </div>
  );
}

function InvisibleFactorCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="avoid-page-break mb-2.5 rounded-xl border border-primary/10 border-l-[4px] border-l-primary/55 bg-white/95 p-3.5 pl-4 shadow-sm shadow-primary/[0.05] last:mb-0">
      <h4 className="font-display text-[1.02rem] font-semibold leading-snug text-[hsl(340_28%_22%)]">{title}</h4>
      <p className="mt-1 text-[13px] leading-snug text-foreground/90">{children}</p>
    </div>
  );
}

export default function EbookUm() {
  return (
    <>
      {/* Capa */}
      <section
        className="relative flex h-[297mm] flex-col overflow-hidden page-break-after print:shadow-none"
        style={{ backgroundImage: 'url(/capa-guia-anti-acne.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* Módulo 1 — parte 1 */}
      <PdfContentPage
        kicker="Módulo 1"
        title="Entendendo a Acne de Verdade"
        subtitle="O mecanismo, os 4 fatores causadores e os tipos de lesão"
      >
        <StatsRow
          color="hsl(var(--primary))"
          stats={[
            { number: '85%', label: 'das pessoas têm acne na vida' },
            { number: '4', label: 'fatores causadores' },
            { number: '6–8 sem', label: 'para ver resultado' },
          ]}
        />

        <Divider variant="gradient" color="hsl(var(--primary))" className="my-2" />

        <SectionHeading>O que acontece na sua pele</SectionHeading>
        <p>
          A pele tem glândulas que produzem sebo. Quando esse sebo se mistura com células mortas e obstrói o
          poro, cria o ambiente perfeito para bactérias se proliferarem. O resultado é inflamação — espinha,
          cravo ou cisto.
        </p>

        <SectionDivider title="Os 4 fatores causadores" color="hsl(var(--primary))" className="mt-3" />

        <StepList
          color="hsl(var(--primary))"
          steps={[
            { title: 'Excesso de sebo', text: 'Estimulado por hormônios, estresse e alimentação' },
            { title: 'Poros obstruídos', text: 'Células mortas que não foram removidas adequadamente' },
            { title: 'Bactérias', text: 'Se multiplicam no ambiente oleoso dentro do poro' },
            { title: 'Inflamação', text: 'A resposta do corpo à presença dessas bactérias' },
          ]}
        />
      </PdfContentPage>

      {/* Módulo 1 — tipos de lesão */}
      <PdfContentPage kicker="Módulo 1" title="Tipos de acne — identifique o seu">
        <LesionCard
          name="Cravo aberto (ponto preto)"
          description="Poro obstruído exposto ao ar — oxida e fica escuro."
          tratamento="Esfoliação + ácido salicílico"
        />
        <LesionCard
          name="Cravo fechado (ponto branco)"
          description="Poro obstruído sem abertura."
          tratamento="Esfoliação química + retinol"
        />
        <LesionCard
          name="Pápula"
          description="Espinha vermelha e dolorida, sem pus."
          tratamento="Ácido salicílico + niacinamida"
        />
        <LesionCard
          name="Pústula"
          description="Espinha com pus no centro."
          tratamento="Peróxido de benzoíla"
        />
      </PdfContentPage>

      {/* Módulo 1 — grau severo + alertas + adultos */}
      <PdfContentPage kicker="Módulo 1" title="Próximos passos e causas em adultos">
        <LesionCard
          name="Nódulo / cisto"
          description="Lesão grande, profunda e muito dolorosa."
          tratamento="Dermatologista obrigatório"
        />

        <Callout type="warning" title="Atenção">
          Nódulos e cistos precisam de acompanhamento médico. Os demais graus respondem bem à rotina correta.
        </Callout>

        <SectionDivider title="Por que aparece em adultos" color="hsl(var(--primary))" className="mt-3" />

        <CheckList
          color="hsl(var(--primary))"
          items={[
            'Variações hormonais (ciclo menstrual, anticoncepcional, gravidez)',
            'Estresse elevado → eleva o cortisol → aumenta a produção de sebo',
            'Produtos comedogênicos usados sem saber',
            'Alimentação com alto índice glicêmico',
            'Privação de sono',
          ]}
        />
      </PdfContentPage>

      {/* Módulo 2 — introdução + manhã (passos 1–2) */}
      <PdfContentPage
        kicker="Módulo 2"
        title="Rotina Anti-Acne: O Protocolo Completo"
        subtitle="Passo a passo da manhã e noite com ativos certos"
      >
        <p className="mb-3 text-[14px] leading-relaxed text-foreground/92">
          A rotina tem um objetivo duplo: tratar as lesões existentes e impedir que novas se formem. Cada passo tem
          uma função específica e a ordem importa.
        </p>

        <Timeline
          color="hsl(var(--primary))"
          className="mb-4"
          items={[
            { time: 'Passo 1', label: 'Limpeza' },
            { time: 'Passo 2', label: 'Tônico BHA' },
            { time: 'Passo 3', label: 'Sérum' },
            { time: 'Passo 4', label: 'Hidratante' },
            { time: 'Passo 5', label: 'Protetor' },
          ]}
        />

        <RoutinePeriodHeader emoji="☀️" label="Rotina da Manhã" />

        <RoutineStep
          step={1}
          title="Limpeza Anti-Acne"
          instruction="Use um sabonete com ácido salicílico. Água morna, movimentos suaves, 30 segundos. Enxágue bem."
          why="O ácido salicílico é lipossolúvel — consegue entrar no poro onde o problema começa."
        />
        <RoutineStep
          step={2}
          title="Tônico com BHA"
          instruction="Aplique com algodão evitando a área dos olhos. Passo opcional, mas potente."
          why="O tônico com BHA faz uma segunda limpeza química nos poros, potencializando o efeito do sabonete."
          attention="Se a pele ficar muito ressecada, pule esse passo e mantenha apenas o sabonete."
        />
      </PdfContentPage>

      {/* Módulo 2 — manhã (passos 3–5) */}
      <PdfContentPage kicker="Módulo 2" title="Manhã — final da rotina" subtitle="Últimos passos antes do sol">
        <RoutinePeriodHeader emoji="☀️" label="Rotina da Manhã (continuação)" />

        <RoutineStep
          step={3}
          title="Sérum com Niacinamida"
          instruction="Aplique antes do hidratante, com as pontas dos dedos."
          why="Reduz inflamação, controla sebo, diminui vermelhidão das espinhas ativas e previne novas lesões."
        />
        <RoutineStep
          step={4}
          title="Hidratante Oil-Free"
          instruction="Use uma quantidade pequena de hidratante gel ou fluido, não comedogênico."
          why="Pele desidratada produz mais óleo para compensar. O hidratante leve equilibra sem entupir poros."
        />
        <RoutineStep
          step={5}
          title="Protetor Solar"
          instruction="FPS 30 ou mais, toque seco, não comedogênico. Obrigatório, sem exceção."
          why="A maioria dos ativos anti-acne deixa a pele mais sensível ao sol. Sem protetor, o tratamento piora as manchas."
        />
      </PdfContentPage>

      {/* Módulo 2 — noite (passos 1–3) */}
      <PdfContentPage kicker="Módulo 2" title="Rotina da noite" subtitle="Limpeza profunda e tratamento">
        <RoutinePeriodHeader emoji="🌙" label="Rotina da Noite" />

        <RoutineStep
          step={1}
          title="Demaquilante"
          instruction="Água micelar ou óleo de limpeza sem fragrância — apenas se usar maquiagem."
          why="Resíduos de maquiagem + oleosidade do dia = poros entupidos durante o sono."
        />
        <RoutineStep
          step={2}
          title="Limpeza"
          instruction="Repita o sabonete com ácido salicílico. À noite pode massagear por até 1 minuto."
          why="Remove a oleosidade acumulada do dia e prepara a pele para os ativos noturnos."
        />
        <RoutineStep
          step={3}
          title="Tratamento Pontual"
          instruction="Aplique peróxido de benzoíla diretamente nas espinhas inflamadas — apenas nos pontos afetados."
          why="Age diretamente nas bactérias causadoras da inflamação. É o tratamento pontual mais eficaz sem prescrição."
          tip="Comece com concentração baixa (2,5%) para testar a tolerância antes de usar versões mais fortes."
        />
      </PdfContentPage>

      {/* Módulo 2 — noite (4–5) */}
      <PdfContentPage kicker="Módulo 2" title="Noite — retinol e hidratação">
        <RoutinePeriodHeader emoji="🌙" label="Rotina da Noite (continuação)" />

        <RoutineStep
          step={4}
          title="Sérum com Retinol"
          instruction="Aplique após o tratamento pontual, antes do hidratante. Use apenas 2 a 3× por semana."
          why="Acelera a renovação celular, desobstrói os poros e previne a formação de novos cravos e espinhas."
          attention="Nunca use retinol e ácidos (salicílico, glicólico) na mesma noite. Alterne: ácido numa noite, retinol na outra."
        />
        <RoutineStep
          step={5}
          title="Hidratante Noturno"
          instruction="Hidratante leve oil-free. Pode ser o mesmo da manhã."
          why="Mantém a barreira hidratada durante a noite enquanto os ativos trabalham."
        />
      </PdfContentPage>

      {/* Módulo 2 — tabela-resumo */}
      <PdfContentPage kicker="Módulo 2" title="Resumo do protocolo" subtitle="Visão rápida manhã × noite">
        <TagRow
          tags={['Ácido Salicílico', 'Niacinamida', 'Peróxido de Benzoíla', 'Retinol', 'FPS 30+']}
          color="hsl(var(--primary))"
          className="mb-3"
        />
        <p className="mb-3 text-[13px] leading-relaxed text-muted-foreground">
          Use esta tabela para conferir a ordem dos passos em cada período do dia.
        </p>
        <ProtocolTable />
      </PdfContentPage>

      {/* Módulo 3 — ativos 1–2 */}
      <PdfContentPage
        kicker="Módulo 3"
        title="Os Ativos que Realmente Funcionam"
        subtitle="Guia dos 6 ingredientes com evidência científica"
      >
        <ActiveIngredientCard
          name="Ácido Salicílico (BHA)"
          concentration="0,5% a 2%"
          description="Penetra no poro e dissolve sebo e células mortas de dentro para fora."
          melhorPara="Cravos, poros entupidos, oleosidade excessiva"
          comoUsar="Sabonete, tônico ou sérum — manhã e/ou noite"
        />
        <ActiveIngredientCard
          name="Niacinamida"
          concentration="5% a 10%"
          description="Anti-inflamatório, controla produção de sebo, reduz vermelhidão e clareia manchas."
          melhorPara="Acne inflamatória ativa e manchas pós-acne"
          comoUsar="Sérum — manhã e noite"
        />
      </PdfContentPage>

      {/* Módulo 3 — ativos 3–4 */}
      <PdfContentPage kicker="Módulo 3" title="Tratamento antibacteriano e renovação" subtitle="Peróxido de benzoíla e retinol">
        <ActiveIngredientCard
          name="Peróxido de Benzoíla"
          concentration="2,5%"
          description="Mata as bactérias causadoras da inflamação diretamente no poro."
          melhorPara="Espinhas inflamadas ativas (pápulas e pústulas)"
          comoUsar="Gel de tratamento pontual — apenas nas lesões, à noite"
          attention="Pode clarear tecido — evite contato com roupas e toalhas escuras."
        />
        <ActiveIngredientCard
          name="Retinol (Vitamina A)"
          concentration="0,025% a 0,3%"
          description="Acelera a renovação celular, desobstrói poros, previne novas lesões e trata manchas."
          melhorPara="Prevenção de acne + tratamento de marcas"
          comoUsar="Sérum ou creme — apenas à noite, 2 a 3× por semana"
          attention="Aumenta a sensibilidade solar — protetor solar obrigatório."
        />
      </PdfContentPage>

      {/* Módulo 3 — ativos 5–6 */}
      <PdfContentPage kicker="Módulo 3" title="Opções para pele sensível e oleosidade" subtitle="Ácido azelaico e zinco">
        <ActiveIngredientCard
          name="Ácido Azelaico"
          concentration="10% a 20%"
          description="Antibacteriano, anti-inflamatório e clareador ao mesmo tempo."
          melhorPara="Acne leve a moderada + manchas pós-acne em pele sensível"
          comoUsar="Sérum ou creme — manhã ou noite"
        />
        <ActiveIngredientCard
          name="Zinco"
          concentration="Tópico: 1% a 5%"
          description="Regula a produção de sebo e tem ação anti-inflamatória."
          melhorPara="Acne hormonal e oleosidade excessiva"
          comoUsar="Sérum tópico ou suplemento oral (zinco quelato)"
        />
      </PdfContentPage>

      {/* Módulo 4 — introdução + manchas hiper e eritema */}
      <PdfContentPage
        kicker="Módulo 4"
        title="Manchas Pós-Acne: Como Tratar"
        subtitle="3 tipos de sequela e como resolver cada uma"
      >
        <p className="mb-4 text-[14px] leading-relaxed text-foreground/92">
          Quando uma espinha inflama, o processo estimula a produção excessiva de melanina na área — resultado:
          mancha escura que pode durar semanas ou meses.
        </p>
        <Callout type="myth" title="Mito perigoso" className="mb-3">
          Espremer "resolve" a espinha. Na verdade, transforma uma lesão de 5 dias em uma mancha de 3 meses.
        </Callout>

        <SequelaCard
          title="Mancha hiperpigmentada (escura)"
          causa="Inflamação que estimulou melanina em excesso"
          tempo="4 a 12 semanas"
          tratamento="Niacinamida + ácido azelaico + protetor solar religiosamente"
        />
        <SequelaCard
          title="Mancha vermelha/rosada (eritema)"
          causa="Vasos dilatados que ficaram após a inflamação"
          tempo="4 a 8 semanas"
          tratamento="Niacinamida + centella asiática + protetor solar"
        />
      </PdfContentPage>

      {/* Módulo 4 — cicatriz + dica vitamina C */}
      <PdfContentPage kicker="Módulo 4" title="Cicatrizes e cuidados extras" subtitle="Quando a pele já alterou textura">
        <SequelaCard
          title="Cicatriz (depressão ou elevação)"
          causa="Destruição do colágeno durante inflamação intensa — especialmente de cistos espremidos"
          tempo="Tratamento médico"
          tratamento="Requer procedimento estético (peeling, microagulhamento, laser)"
        />
        <Callout type="tip" className="mt-1">
          Vitamina C (ácido ascórbico) é clareadora poderosa, mas instável. Use versões estabilizadas (ascorbil glucosídeo) se a pele for sensível.
        </Callout>
      </PdfContentPage>

      {/* Módulo 5 — hábitos 1–4 */}
      <PdfContentPage
        kicker="Módulo 5"
        title="Hábitos que Sabotam o Tratamento"
        subtitle="7 erros que impedem a melhora mesmo com produto certo"
      >
        <HighlightBanner
          color="hsl(var(--primary))"
          icon="⚠️"
          text="Mesmo com a rotina correta, estes comportamentos costumam atrasar o resultado — reconhecer é o primeiro passo para mudar."
          className="mb-4"
        />

        <div className="space-y-2.5">
          {[
            { title: 'Trocar de produto toda semana', text: 'Os ativos anti-acne levam 6 a 8 semanas para mostrar resultado. Quem troca antes nunca sabe o que funciona.' },
            { title: 'Espremer espinhas', text: 'Transforma uma espinha de 5 dias em uma mancha de 3 meses — e espalha bactérias para poros ao redor.' },
            { title: 'Usar mais produto para acelerar', text: 'Excesso de ativo irrita a pele, quebra a barreira de proteção e piora a acne.' },
            { title: 'Pular o hidratante por ter pele oleosa', text: 'Pele desidratada produz mais sebo. O hidratante leve é parte do tratamento, não o inimigo.' },
            { title: 'Não usar protetor solar', text: 'Qualquer ativo anti-acne aumenta a fotossensibilidade. O sol cancela o progresso e escurece as manchas.' },
            { title: 'Tocar o rosto ao longo do dia', text: 'As mãos transferem bactérias e oleosidade diretamente para os poros.' },
            { title: 'Usar maquiagem comedogênica', text: 'Bases e corretivos que entopem poros. Sempre prefira produtos não comedogênico ou oil-free.' },
          ].map(({ title, text }) => (
            <div key={title} className="flex gap-2.5 rounded-lg border border-[hsl(355_50%_88%)] bg-white/95 px-3 py-2.5">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="mt-0.5 shrink-0">
                <circle cx="7" cy="7" r="7" fill="hsl(355 65% 50%)" fillOpacity="0.15" />
                <path d="M5 5L9 9M9 5L5 9" stroke="hsl(355 65% 50%)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div>
                <span className="text-[12.5px] font-semibold text-[hsl(340_28%_22%)]">{title} — </span>
                <span className="text-[12.5px] leading-snug text-foreground/80">{text}</span>
              </div>
            </div>
          ))}
        </div>
      </PdfContentPage>

      {/* Módulo 6 — intro + alimentos a evitar */}
      <PdfContentPage
        kicker="Módulo 6"
        title="Alimentação e Acne"
        subtitle="O que comer e o que evitar para resultados melhores"
      >
        <p className="mb-3 text-[14px] leading-relaxed text-foreground/92">
          A relação entre alimentação e acne é real — especialmente para acne hormonal e acne adulta. Não é mito.
        </p>

        <ComparisonCard
          leftTitle="Evitar"
          rightTitle="Incluir"
          color="hsl(var(--primary))"
          leftItems={[
            'Açúcar e carboidratos de alto IG',
            'Leite e derivados',
            'Ultraprocessados e gordura trans',
            'Bebidas adoçadas e refrigerantes',
          ]}
          rightItems={[
            'Ômega-3 (sardinha, chia, linhaça)',
            'Zinco (abóbora, castanha, feijão)',
            'Antioxidantes (frutas vermelhas, chá verde)',
            'Água (mínimo 2L por dia)',
          ]}
          className="mb-3"
        />

        <FactBox
          color="hsl(var(--primary))"
          fact="🧪 Teste de 30 dias: reduzir açúcar, laticínios e ultraprocessados por 30 dias é a mudança alimentar com maior impacto na acne hormonal. Melhora visível em 2 a 3 semanas."
        />
      </PdfContentPage>

      {/* Módulo 7 — fatores 1–4 */}
      <PdfContentPage
        kicker="Módulo 7"
        title="Fatores Invisíveis que Causam Acne"
        subtitle="O que está te sabotando sem você saber"
      >
        <InvisibleFactorCard title="Fronha do travesseiro">
          Acumula oleosidade, células mortas e bactérias toda noite. Troca mínima: 2× por semana. Fronha de cetim
          absorve menos.
        </InvisibleFactorCard>
        <InvisibleFactorCard title="Celular encostado no rosto">
          A tela do celular tem mais bactérias que um vaso sanitário. Use viva-voz ou fone. Limpe com álcool
          regularmente.
        </InvisibleFactorCard>
        <InvisibleFactorCard title="Óculos e fone de ouvido">
          Acumulam oleosidade na região de contato com a pele. Limpe com álcool diariamente.
        </InvisibleFactorCard>
        <InvisibleFactorCard title="Cabelo no rosto">
          Oleosidade e produtos capilares (leave-in, condicionador) entopem poros da testa, têmporas e queixo.
        </InvisibleFactorCard>
      </PdfContentPage>

      {/* Módulo 7 — fatores 5–6 + regra de ouro + aviso */}
      <PdfContentPage kicker="Módulo 7" title="Hábitos do ambiente e o emocional" subtitle="Últimos fatores invisíveis">
        <InvisibleFactorCard title="Toalha de rosto compartilhada">
          Bactérias se multiplicam em toalhas úmidas. Toalha exclusiva, trocada 2× por semana. Melhor: papel-toalha
          descartável.
        </InvisibleFactorCard>
        <InvisibleFactorCard title="Estresse elevado">
          Eleva o cortisol → aumenta produção de sebo → piora a acne. Sono, exercício e relaxamento fazem parte do
          tratamento.
        </InvisibleFactorCard>

        <QuoteBlock
          color="hsl(var(--primary))"
          text="Acne melhora com consistência, não com quantidade. Uma rotina simples feita todos os dias supera qualquer protocolo elaborado feito às vezes. Escolha seus 3 a 5 produtos certos, use por pelo menos 8 semanas, e só então avalie se precisa mudar algo."
          author="A Regra de Ouro"
          className="mt-2"
        />

        <Callout type="info" title="Aviso importante" className="mt-3">
          Este guia é informativo. Casos de acne moderada a grave, nódulos, cistos ou acne que não melhora em 8 semanas devem ser avaliados por um dermatologista.
        </Callout>
      </PdfContentPage>
    </>
  );
}
