/**
 * PDF 8 — Rota: /pdf/ebook-oito · Guia Anti-Rugas
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';

const ACCENT = 'linear-gradient(to bottom, hsl(270 45% 44%), hsl(280 42% 40%), hsl(260 48% 36%))';

const C = {
  darkColor: 'hsl(270 45% 18%)',
  color:     'hsl(270 42% 42%)',
  lightBg:   'hsl(270 38% 93%)',
  border:    'hsl(270 35% 78%)',
};

// ── Componentes compartilhados ───────────────────────────────────────────────

function InfoBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg px-4 py-3 leading-normal" style={{ background: C.lightBg, borderLeft: `3px solid ${C.color}` }}>
      <div className="text-[13px] leading-snug text-foreground/90">{children}</div>
    </div>
  );
}

function SectionTitle({ children, emoji }: { children: ReactNode; emoji?: string }) {
  return (
    <div className="mb-2 mt-4 flex items-center gap-2 first:mt-0">
      {emoji && <span className="text-[1.1rem] leading-none" aria-hidden>{emoji}</span>}
      <h3 className="font-display text-[1.05rem] font-semibold tracking-tight" style={{ color: C.darkColor }}>
        {children}
      </h3>
    </div>
  );
}

// ── Módulo 1 ────────────────────────────────────────────────────────────────

function ComponentCard({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl p-3" style={{ background: C.lightBg }}>
      <span className="text-[1.3rem] leading-none mt-0.5" aria-hidden>{icon}</span>
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.15em] mb-0.5" style={{ color: C.color }}>{title}</div>
        <div className="text-[13px] leading-snug text-foreground/90">{children}</div>
      </div>
    </div>
  );
}

function AgingTypeCard({ title, percent, description }: { title: string; percent: string; description: string }) {
  return (
    <div className="flex-1 rounded-xl p-4" style={{ background: 'white', border: `1px solid ${C.border}` }}>
      <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: C.color }}>{title}</div>
      <div className="mb-2 font-display text-[1.6rem] font-bold" style={{ color: C.darkColor }}>{percent}</div>
      <div className="text-[12.5px] leading-snug text-foreground/80">{description}</div>
    </div>
  );
}

function AcceleratorCard({ emoji, title, children }: { emoji: string; title: string; children: ReactNode }) {
  return (
    <div className="avoid-page-break flex gap-3 rounded-xl p-3" style={{ background: 'white', border: `1px solid ${C.border}` }}>
      <span className="text-[1.4rem] leading-none shrink-0 mt-0.5" aria-hidden>{emoji}</span>
      <div>
        <div className="text-[12px] font-bold mb-0.5" style={{ color: C.darkColor }}>{title}</div>
        <div className="text-[12.5px] leading-snug text-foreground/85">{children}</div>
      </div>
    </div>
  );
}

// ── Módulo 2 ────────────────────────────────────────────────────────────────

function WrinkleCard({ title, local, causa, tratamento, observacao }: {
  title: string; local: string; causa: string; tratamento: string; observacao: string;
}) {
  return (
    <div className="avoid-page-break rounded-xl p-4" style={{ background: 'white', border: `1px solid ${C.border}` }}>
      <h4 className="font-display text-[1.05rem] font-semibold mb-1" style={{ color: C.darkColor }}>{title}</h4>
      <div className="text-[11.5px] text-foreground/55 mb-3 italic">{local}</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-lg px-3 py-2" style={{ background: C.lightBg }}>
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5" style={{ color: C.color }}>Causa principal</div>
          <div className="text-[12.5px] leading-snug text-foreground/90">{causa}</div>
        </div>
        <div className="rounded-lg px-3 py-2" style={{ background: C.lightBg }}>
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5" style={{ color: C.color }}>Tratamento cosmético</div>
          <div className="text-[12.5px] leading-snug text-foreground/90">{tratamento}</div>
        </div>
        <div className="rounded-lg px-3 py-2 leading-normal" style={{ background: C.lightBg, borderLeft: `3px solid ${C.border}` }}>
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5" style={{ color: C.color }}>Observação</div>
          <div className="text-[12.5px] leading-snug text-foreground/85">{observacao}</div>
        </div>
      </div>
    </div>
  );
}

// ── Módulo 3 ────────────────────────────────────────────────────────────────

function ActiveCard({ name, tagline, description, comoUsar, resultado, attention, tip }: {
  name: string; tagline: string; description: string;
  comoUsar: string; resultado: string; attention?: string; tip?: string;
}) {
  return (
    <div className="avoid-page-break rounded-xl p-3.5" style={{ background: 'white', border: `1px solid ${C.border}` }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h4 className="font-display text-[1.05rem] font-bold leading-tight" style={{ color: C.darkColor }}>{name}</h4>
          <div className="text-[11px] font-semibold mt-0.5" style={{ color: C.color }}>{tagline}</div>
        </div>
        <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ background: C.lightBg, color: C.darkColor, border: `1px solid ${C.border}` }}>
          {resultado}
        </span>
      </div>
      <p className="text-[12.5px] leading-snug text-foreground/85 mb-2">{description}</p>
      <div className="rounded-lg px-3 py-2" style={{ background: C.lightBg }}>
        <div className="text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5" style={{ color: C.color }}>Como usar</div>
        <div className="text-[12px] leading-snug text-foreground/90">{comoUsar}</div>
      </div>
      {attention && (
        <div className="mt-2 rounded-md px-2.5 py-1.5 text-[11.5px] leading-normal" style={{ background: 'hsl(38 85% 95%)', borderLeft: '3px solid hsl(38 80% 60%)' }}>
          <span className="font-bold" style={{ color: 'hsl(38 60% 35%)' }}>Atenção: </span>
          <span style={{ color: 'hsl(38 40% 30%)' }}>{attention}</span>
        </div>
      )}
      {tip && (
        <div className="mt-2 rounded-md px-2.5 py-1.5 text-[11.5px] leading-normal" style={{ background: C.lightBg, borderLeft: `3px solid ${C.color}` }}>
          <span className="font-bold" style={{ color: C.color }}>Dica: </span>
          <span className="text-foreground/85">{tip}</span>
        </div>
      )}
    </div>
  );
}

// ── Módulo 4 ────────────────────────────────────────────────────────────────

function RoutineStep({ step, title, instruction, why, tip, attention }: {
  step: number; title: string; instruction: string; why: string; tip?: string; attention?: string;
}) {
  return (
    <div className="avoid-page-break flex gap-3 rounded-xl p-3" style={{ background: 'white', border: `1px solid ${C.border}` }}>
      <span className="block h-7 w-7 shrink-0 rounded-full text-center text-[12px] font-bold leading-7 text-white" style={{ background: C.color }}>
        {step}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold mb-0.5" style={{ color: C.darkColor }}>{title}</div>
        <div className="text-[12.5px] leading-snug text-foreground/85 mb-1.5">{instruction}</div>
        <div className="rounded-md px-2.5 py-1.5 text-[11.5px] leading-normal" style={{ background: C.lightBg, borderLeft: `3px solid ${C.border}` }}>
          <span className="font-bold" style={{ color: C.color }}>Por quê? </span>
          <span className="text-foreground/85">{why}</span>
        </div>
        {attention && (
          <div className="mt-1.5 rounded-md px-2.5 py-1.5 text-[11.5px] leading-normal" style={{ background: 'hsl(38 85% 95%)', borderLeft: '3px solid hsl(38 80% 60%)' }}>
            <span className="font-bold" style={{ color: 'hsl(38 60% 35%)' }}>Atenção: </span>
            <span style={{ color: 'hsl(38 40% 30%)' }}>{attention}</span>
          </div>
        )}
        {tip && (
          <div className="mt-1.5 rounded-md px-2.5 py-1.5 text-[11.5px] leading-normal" style={{ background: C.lightBg, borderLeft: `3px solid ${C.color}` }}>
            <span className="font-bold" style={{ color: C.color }}>Dica: </span>
            <span className="text-foreground/85">{tip}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ProtocolTable() {
  const rows = [
    { step: '1', morning: 'Limpeza suave',            night: 'Demaquilante' },
    { step: '2', morning: 'Sérum Vitamina C',          night: 'Limpeza' },
    { step: '3', morning: 'Sérum Ácido Hialurônico',   night: 'Sérum Ácido Hialurônico' },
    { step: '4', morning: 'Hidratante c/ peptídeos',   night: 'Retinol (3–5×/semana)' },
    { step: '5', morning: 'Protetor solar FPS 50+',    night: 'Hidratante noturno rico' },
    { step: '6', morning: '—',                         night: 'Óleo facial (opcional)' },
  ];
  return (
    <div className="overflow-hidden rounded-xl" style={{ border: `1px solid ${C.border}` }}>
      <table className="w-full border-collapse text-left text-[12px]">
        <thead>
          <tr style={{ background: C.lightBg }}>
            <th className="px-3 py-2 font-bold" style={{ color: C.darkColor }}>Passo</th>
            <th className="px-3 py-2 font-bold" style={{ color: C.darkColor }}>☀️ Manhã</th>
            <th className="px-3 py-2 font-bold" style={{ color: C.darkColor }}>🌙 Noite</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.step} className="border-t" style={{ borderColor: C.border }}>
              <td className="px-3 py-1.5 font-bold" style={{ color: C.color }}>{r.step}</td>
              <td className="px-3 py-1.5 text-foreground/90">{r.morning}</td>
              <td className="px-3 py-1.5 text-foreground/90">{r.night}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Módulo 5 ────────────────────────────────────────────────────────────────

function RegionCard({ emoji, title, oQueTratar, produtos, comoAplicar, dica }: {
  emoji: string; title: string; oQueTratar: string; produtos: string; comoAplicar: string; dica?: string;
}) {
  return (
    <div className="avoid-page-break rounded-xl p-3.5" style={{ background: 'white', border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[1.3rem] leading-none" aria-hidden>{emoji}</span>
        <h4 className="font-display text-[1.05rem] font-bold" style={{ color: C.darkColor }}>{title}</h4>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-2">
        {[
          { label: 'O que tratar', value: oQueTratar },
          { label: 'Produtos',     value: produtos },
          { label: 'Como aplicar', value: comoAplicar },
        ].map((item) => (
          <div key={item.label} className="rounded-lg px-2.5 py-2" style={{ background: C.lightBg }}>
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] mb-0.5" style={{ color: C.color }}>{item.label}</div>
            <div className="text-[12px] leading-snug text-foreground/90">{item.value}</div>
          </div>
        ))}
      </div>
      {dica && (
        <div className="rounded-md px-3 py-2 text-[12px] leading-normal" style={{ background: C.lightBg, borderLeft: `3px solid ${C.color}` }}>
          <span className="font-bold" style={{ color: C.color }}>Dica: </span>
          <span className="text-foreground/85">{dica}</span>
        </div>
      )}
    </div>
  );
}

// ── Módulo 6 ────────────────────────────────────────────────────────────────

function BadHabitItem({ children }: { children: ReactNode }) {
  return (
    <div className="avoid-page-break flex gap-3 rounded-xl px-3.5 py-3" style={{ background: 'white', border: `1px solid ${C.border}` }}>
      <span className="text-[1.1rem] leading-none shrink-0 mt-0.5" aria-hidden>❌</span>
      <div className="text-[13px] leading-snug text-foreground/90">{children}</div>
    </div>
  );
}

// ── Módulo 7 ────────────────────────────────────────────────────────────────

function NutrientCard({ icon, title, description, fontes }: {
  icon: string; title: string; description: string; fontes: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl p-3" style={{ background: 'white', border: `1px solid ${C.border}` }}>
      <span className="text-[1.2rem] leading-none shrink-0 mt-0.5" aria-hidden>{icon}</span>
      <div>
        <div className="text-[12.5px] font-bold mb-0.5" style={{ color: C.darkColor }}>{title}</div>
        <div className="text-[12px] leading-snug text-foreground/80 mb-1">{description}</div>
        <div className="text-[11px] leading-snug" style={{ color: C.color }}>
          <span className="font-bold">Fontes: </span>{fontes}
        </div>
      </div>
    </div>
  );
}

function AvoidItem({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl px-3 py-2.5" style={{ background: 'hsl(0 50% 97%)', border: '1px solid hsl(0 40% 88%)' }}>
      <span className="text-[1rem] leading-none shrink-0 mt-0.5" aria-hidden>⚠️</span>
      <div>
        <div className="text-[12px] font-bold mb-0.5" style={{ color: 'hsl(0 45% 30%)' }}>{title}</div>
        <div className="text-[12px] leading-snug text-foreground/80">{children}</div>
      </div>
    </div>
  );
}

function LifestyleItem({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl p-3" style={{ background: C.lightBg }}>
      <span className="text-[1.1rem] leading-none shrink-0 mt-0.5" aria-hidden>{icon}</span>
      <div>
        <div className="text-[12px] font-bold" style={{ color: C.darkColor }}>{title}</div>
        <div className="text-[12px] leading-snug text-foreground/80">{children}</div>
      </div>
    </div>
  );
}

// ── Módulo 8 ────────────────────────────────────────────────────────────────

function BulletCheck({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2.5 text-[13px] leading-snug text-foreground/90">
      <span className="mt-[4px] text-[11px] font-bold shrink-0" style={{ color: C.color }}>✓</span>
      {children}
    </div>
  );
}

function ProcedureRow({ name, description }: { name: string; description: string }) {
  return (
    <tr className="border-t" style={{ borderColor: C.border }}>
      <td className="px-3 py-2 text-[12px] font-semibold shrink-0" style={{ color: C.darkColor }}>{name}</td>
      <td className="px-3 py-2 text-[12px] leading-snug text-foreground/85">{description}</td>
    </tr>
  );
}

// ── Capa ───────────────────────────────────────────────────────────────────
function Cover() {
  return (
    <section
      className="relative flex h-[297mm] flex-col overflow-hidden page-break-after print:shadow-none"
      style={{ backgroundImage: 'url(/capa-guia-anti-rugas.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    />
  );
}

// ── Ebook ──────────────────────────────────────────────────────────────────
export default function EbookOito() {
  return (
    <>
      <Cover />

      {/* ── Módulo 1 / Pág 1 — O que acontece na pele */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 1" title="Por Que a Pele Envelhece" subtitle="O mecanismo biológico e os principais aceleradores externos">
        <div className="space-y-3">
          <SectionTitle>O que acontece na pele com o tempo</SectionTitle>
          <p className="text-[13px] leading-relaxed text-foreground/90">
            A pele jovem tem três componentes que a mantêm firme, elástica e preenchida:
          </p>
          <div className="flex flex-col gap-2">
            <ComponentCard icon="🧬" title="Colágeno">Proteína que sustenta a estrutura da pele, como uma teia de apoio.</ComponentCard>
            <ComponentCard icon="🌀" title="Elastina">Fibra que dá elasticidade — permite a pele "voltar" após uma expressão.</ComponentCard>
            <ComponentCard icon="💧" title="Ácido Hialurônico Natural">Substância que retém água e mantém o volume.</ComponentCard>
          </div>
          <InfoBox>
            A partir dos 25 anos, a produção de colágeno cai cerca de <strong>1% ao ano</strong>. Isso é inevitável. O que não é inevitável é a <em>velocidade</em> em que acontece.
          </InfoBox>
          <SectionTitle>Tipos de envelhecimento</SectionTitle>
          <div className="flex gap-3">
            <AgingTypeCard title="Cronológico" percent="~20%" description="Natural, genético. Não tem como parar — só amenizar." />
            <AgingTypeCard title="Ambiental" percent="~80%" description="Causado por fatores externos. Aqui o skincare faz diferença real." />
          </div>
        </div>
      </PdfContentPage>

      {/* ── Módulo 1 / Pág 2 — Aceleradores */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 1" title="Principais Aceleradores do Envelhecimento">
        <div className="flex flex-col gap-2.5">
          <AcceleratorCard emoji="☀️" title="Exposição solar sem proteção">Responsável por até 80% das rugas. A radiação UV quebra as fibras de colágeno e elastina diretamente. É o fator número um de envelhecimento prematuro.</AcceleratorCard>
          <AcceleratorCard emoji="🚬" title="Tabagismo">A nicotina reduz o fluxo sanguíneo na pele, privando-a de oxigênio. Fumantes desenvolvem rugas em média 10 anos antes de não fumantes.</AcceleratorCard>
          <AcceleratorCard emoji="😰" title="Estresse crônico">Eleva o cortisol → degrada o colágeno → acelera o envelhecimento celular.</AcceleratorCard>
          <AcceleratorCard emoji="😴" title="Privação de sono">Durante o sono profundo a pele produz hormônio de crescimento que repara danos e estimula colágeno. Dormir mal cronicamente é dormir sem regenerar.</AcceleratorCard>
          <AcceleratorCard emoji="🍭" title="Açúcar em excesso — glicação">O açúcar se liga às fibras de colágeno tornando-as rígidas e quebradiças. Resultado: pele sem elasticidade que forma rugas com mais facilidade.</AcceleratorCard>
          <AcceleratorCard emoji="😶" title="Expressões repetitivas + sono de lado">Linhas de expressão surgem de movimentos musculares repetidos. Dormir sempre do mesmo lado cria marcas permanentes com o tempo.</AcceleratorCard>
        </div>
      </PdfContentPage>

      {/* ── Módulo 2 / Pág 1 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 2" title="Tipos de Rugas e Como Tratar" subtitle="4 tipos com causa, tratamento e prevenção específicos">
        <div className="flex flex-col gap-4">
          <WrinkleCard title="Linhas finas de expressão" local="Cantos dos olhos (pés de galinha), testa, entre sobrancelhas" causa="Movimentos musculares repetidos + desidratação" tratamento="Ácido hialurônico + peptídeos" observacao="Hidratação constante + protetor solar + óculos de sol" />
          <WrinkleCard title="Rugas de ressecamento" local="Linhas superficiais em todo o rosto, mais visíveis em pele seca" causa="Perda de água transepidérmica — pele que não retém hidratação" tratamento="Ácido hialurônico + ceramidas + hidratante oclusivo à noite" observacao="Hidratação diária consistente + umidificador de ar" />
        </div>
      </PdfContentPage>

      {/* ── Módulo 2 / Pág 2 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 2" title="Tipos de Rugas e Como Tratar">
        <div className="flex flex-col gap-4">
          <WrinkleCard title="Rugas gravitacionais" local="Sulcos nasolabiais, queda das bochechas, papada" causa="Perda de colágeno + elastina + gordura subcutânea + gravidade" tratamento="Retinol + peptídeos tensores + vitamina C" observacao="Cosmético previne e desacelera — rugas profundas precisam de procedimento" />
          <WrinkleCard title="Manchas de envelhecimento" local="Manchas amarronzadas em regiões expostas — rosto, mãos, colo" causa="Dano solar acumulado ao longo dos anos" tratamento="Vitamina C + ácido azelaico + niacinamida + FPS 50+" observacao="8 a 16 semanas de uso consistente para ver resposta" />
        </div>
      </PdfContentPage>

      {/* ── Módulo 3 / Pág 1 — Ativos (Retinol, Vitamina C, Peptídeos) */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 3" title="Os Ativos com Comprovação Científica" subtitle="6 ingredientes que realmente funcionam contra o envelhecimento">
        <div className="flex flex-col gap-3">
          <ActiveCard
            name="Retinol"
            tagline="O mais estudado"
            description="Estimula produção de colágeno novo, acelera renovação celular, atenua manchas e linhas finas."
            comoUsar="Apenas à noite, 2× por semana inicialmente. Concentração baixa (0,025% a 0,05%) para começar."
            resultado="12–16 semanas"
            attention="Contraindicado na gravidez e amamentação. Use bakuchiol nesses casos."
          />
          <ActiveCard
            name="Vitamina C"
            tagline="Protege e trata"
            description="Estimula síntese de colágeno, neutraliza radicais livres do sol e poluição, clareia manchas."
            comoUsar="Pela manhã, antes do protetor solar. Ácido L-ascórbico (mais potente) ou ascorbil glucosídeo (mais suave)."
            resultado="8–12 semanas"
            tip="Vitamina C manhã + retinol à noite = o protocolo antienvelhecimento mais eficaz sem prescrição."
          />
          <ActiveCard
            name="Peptídeos"
            tagline="Mensageiros do colágeno"
            description="Estimulam fibroblastos a produzir mais colágeno e elastina. Alguns têm efeito 'botox-like' superficial."
            comoUsar="Sérum — manhã e/ou noite. Combinam bem com ácido hialurônico e niacinamida."
            resultado="8–12 semanas"
            tip="Ideais para pele sensível que não tolera retinol — muito bem tolerados."
          />
        </div>
      </PdfContentPage>

      {/* ── Módulo 3 / Pág 2 — Ativos (AH, Niacinamida, Bakuchiol) */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 3" title="Os Ativos com Comprovação Científica">
        <div className="flex flex-col gap-3">
          <ActiveCard
            name="Ácido Hialurônico"
            tagline="Preenchimento imediato"
            description="Atrai e retém água nas camadas da pele (até 1000× seu peso). Preenche linhas finas, melhora elasticidade."
            comoUsar="Aplique sempre em pele úmida, antes do hidratante. Manhã e noite."
            resultado="Efeito imediato"
            tip="Produtos com múltiplos pesos moleculares são os mais completos — penetram fundo e hidratam a superfície."
          />
          <ActiveCard
            name="Niacinamida"
            tagline="Multitarefa"
            description="Estimula ceramidas, atenua manchas de envelhecimento, reduz vermelhidão, melhora textura."
            comoUsar="Sérum ou hidratante — manhã e noite. Seguro para qualquer tipo de pele."
            resultado="6–8 semanas"
          />
          <ActiveCard
            name="Bakuchiol"
            tagline="Alternativa ao retinol"
            description="Resultados similares ao retinol — estimula colágeno, atenua rugas — com muito menos irritação e sem restrição na gravidez."
            comoUsar="Sérum ou óleo — pode ser usado manhã e noite. Ideal para pele sensível ou iniciantes."
            resultado="8–12 semanas"
          />
        </div>
      </PdfContentPage>

      {/* ── Módulo 4 / Pág 1 — Rotina Manhã */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 4" title="Rotina Antienvelhecimento Completa" subtitle="Protocolo manhã e noite com cada passo explicado">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[1.2rem]" aria-hidden>☀️</span>
          <h3 className="font-display text-[1.1rem] font-bold" style={{ color: C.darkColor }}>Rotina da Manhã</h3>
        </div>
        <div className="flex flex-col gap-2">
          <RoutineStep step={1} title="Limpeza Suave" instruction="Sabonete cremoso ou gel suave, sem sulfatos agressivos. 30 segundos de massagem gentil." why="A manhã é limpeza leve — remove o que foi aplicado à noite e prepara a pele para os ativos." />
          <RoutineStep step={2} title="Sérum de Vitamina C" instruction="Em pele limpa e levemente úmida. Deixe absorver por 1 a 2 minutos." why="A vitamina C cria uma camada antioxidante que protege durante o dia e potencializa o protetor solar." />
          <RoutineStep step={3} title="Sérum de Ácido Hialurônico" instruction="Logo após a vitamina C, enquanto a pele ainda está levemente úmida." why="A umidade na pele potencializa a captação de água pelo ácido hialurônico." />
          <RoutineStep step={4} title="Hidratante com Peptídeos ou Niacinamida" instruction="Movimentos ascendentes (de baixo para cima) ao aplicar." why="Sela a hidratação e entrega os ativos de firmeza e uniformização ao longo do dia." />
          <RoutineStep step={5} title="Protetor Solar FPS 50+" instruction="Último passo — sempre. Reaplicar no meio do dia se houver exposição solar." why="Sem protetor, todos os outros passos têm metade da eficácia. O sol desfaz o trabalho dos ativos." />
        </div>
      </PdfContentPage>

      {/* ── Módulo 4 / Pág 2 — Rotina Noite */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 4" title="Rotina Antienvelhecimento Completa">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[1.2rem]" aria-hidden>🌙</span>
          <h3 className="font-display text-[1.1rem] font-bold" style={{ color: C.darkColor }}>Rotina da Noite</h3>
        </div>
        <div className="flex flex-col gap-2">
          <RoutineStep step={1} title="Demaquilante" instruction="Óleo de limpeza ou água micelar sem álcool." why="Pele com resíduos não absorve os ativos noturnos corretamente." />
          <RoutineStep step={2} title="Limpeza" instruction="Sabonete suave. Massagem gentil por até 1 minuto." why="Segunda limpeza garante remoção total de impurezas antes da noite de tratamento." />
          <RoutineStep step={3} title="Sérum de Ácido Hialurônico" instruction="Em pele ainda úmida, antes dos tratamentos." why="Hidratação profunda cria base ideal para os ativos de tratamento." />
          <RoutineStep step={4} title="Retinol (3–5× por semana)" instruction="Após o sérum estar absorvido. Comece 2× por semana e aumente gradualmente." why="A noite é o único momento de usar retinol — age durante a renovação celular noturna." tip="Nas noites sem retinol, use sérum de peptídeos ou bakuchiol no lugar." />
          <RoutineStep step={5} title="Hidratante Noturno Rico" instruction="Creme mais espesso que o da manhã — com ceramidas, manteigas ou óleos nutritivos." why="A noite é o momento de nutrição intensa — hidratante mais rico aproveita esse pico." />
          <RoutineStep step={6} title="Óleo Facial (opcional, 2–3×/semana)" instruction="Sobre o hidratante, como último passo. 2 a 3 gotas são suficientes." why="Sela toda a hidratação e entrega nutrição adicional. Óleo de rosa mosqueta é excelente para pele madura." />
        </div>
      </PdfContentPage>

      {/* ── Módulo 4 / Pág 3 — Resumo do protocolo */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 4" title="Resumo do Protocolo">
        <div className="space-y-4">
          <ProtocolTable />
          <InfoBox>
            Consistência supera perfeição. Uma rotina simples feita todos os dias traz mais resultado do que uma rotina complexa feita três vezes por semana.
          </InfoBox>
        </div>
      </PdfContentPage>

      {/* ── Módulo 5 — Cuidados por Região */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 5" title="Cuidados Específicos por Região" subtitle="Olhos, pescoço, colo e lábios — o que a maioria esquece">
        <div className="flex flex-col gap-3">
          <RegionCard
            emoji="👁️"
            title="Área dos Olhos"
            oQueTratar="Pés de galinha, olheiras, bolsas, pálpebra caída"
            produtos="Contorno dos olhos com retinol suave, peptídeos ou cafeína"
            comoAplicar="Dedo anelar, toque suave do canto interno para o externo"
            dica="Cafeína no contorno dos olhos reduz bolsas e olheiras — melhor resultado quando o produto é mantido na geladeira."
          />
          <RegionCard
            emoji="🦢"
            title="Pescoço e Colo"
            oQueTratar="Linhas horizontais, flacidez, manchas solares"
            produtos="Hidratante, vitamina C, retinol e protetor solar — as mesmas etapas do rosto"
            comoAplicar="Movimentos ascendentes (de baixo para cima) no pescoço"
          />
          <RegionCard
            emoji="💋"
            title="Lábios"
            oQueTratar="Rugas verticais, perda de volume, ressecamento"
            produtos="Hidratante labial com ácido hialurônico ou peptídeos"
            comoAplicar="Bálsamo labial com FPS durante o dia — os lábios recebem radiação UV constantemente"
          />
          <InfoBox>
            A pele ao redor dos olhos é <strong>4× mais fina</strong> que o resto do rosto e envelhece primeiro. O pescoço e o colo envelhecem tão rápido quanto o rosto — às vezes mais.
          </InfoBox>
        </div>
      </PdfContentPage>

      {/* ── Módulo 6 — Hábitos que envelhecem */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 6" title="Hábitos que Envelhecem Sem Você Perceber" subtitle="7 comportamentos que aceleram o envelhecimento da pele">
        <div className="flex flex-col gap-2.5">
          <BadHabitItem><strong>Pular o protetor solar em dias nublados.</strong> Em dias nublados, até 80% da radiação UV chega à pele normalmente. As nuvens bloqueiam a luz visível, não o UV.</BadHabitItem>
          <BadHabitItem><strong>Não aplicar protetor no pescoço, colo e mãos.</strong> As mãos são a parte do corpo que mais entrega a idade real de uma pessoa. Proteja diariamente.</BadHabitItem>
          <BadHabitItem><strong>Dormir com o rosto no travesseiro.</strong> O atrito repetido cria linhas de compressão que se tornam rugas permanentes. Fronha de cetim ou seda reduz muito esse problema.</BadHabitItem>
          <BadHabitItem><strong>Franzir os olhos sem usar óculos de sol.</strong> Além de proteger contra UV, os óculos evitam o movimento repetitivo de franzir — uma das principais causas dos pés de galinha.</BadHabitItem>
          <BadHabitItem><strong>Lavar o rosto com água quente.</strong> Água quente remove os lipídios naturais da pele e acelera a perda de elasticidade. Sempre água morna a fria.</BadHabitItem>
          <BadHabitItem><strong>Aplicar produtos com movimentos descendentes.</strong> Sempre movimentos ascendentes (de baixo para cima). Movimentos para baixo contribuem para a ptose (queda) dos tecidos.</BadHabitItem>
          <BadHabitItem><strong>Não reaplicar o protetor solar ao longo do dia.</strong> O FPS protege por ~2h de exposição direta. Em ambientes internos, uma reaplicação no meio do dia já é suficiente.</BadHabitItem>
        </div>
      </PdfContentPage>

      {/* ── Módulo 7 / Pág 1 — Nutrientes */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 7" title="Alimentação e Estilo de Vida" subtitle="Nutrientes que constroem colágeno e o que evitar">
        <div className="space-y-3">
          <SectionTitle emoji="✅">Nutrientes que constroem colágeno</SectionTitle>
          <div className="flex flex-col gap-2">
            <NutrientCard icon="🍊" title="Vitamina C" description="Indispensável para síntese de colágeno." fontes="Acerola, laranja, kiwi, pimentão vermelho, morango, brócolis" />
            <NutrientCard icon="🥚" title="Proteínas de qualidade" description="O colágeno é uma proteína — o corpo precisa de aminoácidos para produzi-lo." fontes="Ovos, frango, peixe, leguminosas, carne magra" />
            <NutrientCard icon="🌱" title="Zinco" description="Cofator essencial na produção de colágeno e na cicatrização." fontes="Abóbora, feijão, castanha, frutos do mar" />
            <NutrientCard icon="🐟" title="Ômega-3" description="Reduz inflamação sistêmica que acelera o envelhecimento." fontes="Sardinha, salmão, chia, linhaça, nozes" />
            <NutrientCard icon="🫐" title="Antioxidantes (polifenóis)" description="Neutralizam radicais livres que destroem colágeno e elastina." fontes="Frutas vermelhas, uva escura, chá verde, cacau 70%+, romã" />
          </div>
        </div>
      </PdfContentPage>

      {/* ── Módulo 7 / Pág 2 — Evitar + Estilo de Vida */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 7" title="Alimentação e Estilo de Vida">
        <div className="space-y-3">
          <SectionTitle emoji="⚠️">O que evitar</SectionTitle>
          <div className="flex flex-col gap-2">
            <AvoidItem title="Açúcar e carboidratos refinados">Glicação — o açúcar danifica diretamente as fibras de colágeno. Dos mecanismos mais estudados de envelhecimento acelerado.</AvoidItem>
            <AvoidItem title="Álcool em excesso">Desidrata a pele, inibe a produção de colágeno e sobrecarrega o fígado.</AvoidItem>
            <AvoidItem title="Ultraprocessados ricos em sódio">Retenção de líquido + inflamação + deficiência de micronutrientes = pele sem viço.</AvoidItem>
          </div>
          <SectionTitle emoji="📋">Protocolo de Estilo de Vida</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            <LifestyleItem icon="😴" title="7–9 horas de sono">Pico de produção de colágeno ocorre durante o sono profundo.</LifestyleItem>
            <LifestyleItem icon="🏃" title="Atividade física regular">Aumenta circulação e oxigenação da pele + reduz cortisol.</LifestyleItem>
            <LifestyleItem icon="💧" title="Hidratação (2L de água/dia)">Hidratação interna reflete diretamente na elasticidade visível.</LifestyleItem>
            <LifestyleItem icon="🧘" title="Gestão de estresse">Cortisol elevado cronicamente degrada colágeno.</LifestyleItem>
          </div>
        </div>
      </PdfContentPage>

      {/* ── Módulo 8 / Pág 1 — Quando o cosmético não basta */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 8" title="Quando o Cosmético Não é Suficiente" subtitle="O que o skincare faz e quando buscar procedimentos estéticos">
        <div className="space-y-3">
          <div className="flex gap-4">
            <div className="flex-1 rounded-xl p-3.5" style={{ background: 'white', border: `1px solid ${C.border}` }}>
              <div className="text-[11px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: C.color }}>✅ O que o cosmético faz</div>
              <div className="flex flex-col gap-1.5">
                <BulletCheck>Prevenir e desacelerar o envelhecimento</BulletCheck>
                <BulletCheck>Atenuar linhas finas e rugas superficiais</BulletCheck>
                <BulletCheck>Melhorar textura, tom e luminosidade</BulletCheck>
                <BulletCheck>Estimular a produção de colágeno ao longo do tempo</BulletCheck>
                <BulletCheck>Tratar manchas e uniformizar o tom</BulletCheck>
              </div>
            </div>
            <div className="flex-1 rounded-xl p-3.5" style={{ background: 'hsl(0 50% 97%)', border: '1px solid hsl(0 40% 88%)' }}>
              <div className="text-[11px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: 'hsl(0 50% 38%)' }}>⚠️ O que requer procedimento</div>
              <div className="flex flex-col gap-1.5">
                {['Rugas profundas e sulcos estabelecidos', 'Perda de volume e contorno facial', 'Flacidez intensa', 'Manchas resistentes a cosméticos'].map((item) => (
                  <div key={item} className="flex gap-2 text-[12.5px] leading-snug text-foreground/85">
                    <span className="shrink-0 mt-[3px]" style={{ color: 'hsl(0 50% 48%)' }}>→</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <SectionTitle>Procedimentos complementares</SectionTitle>
          <div className="overflow-hidden rounded-xl" style={{ border: `1px solid ${C.border}` }}>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr style={{ background: C.lightBg }}>
                  <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: C.darkColor }}>Procedimento</th>
                  <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: C.darkColor }}>O que faz</th>
                </tr>
              </thead>
              <tbody>
                <ProcedureRow name="Peeling químico" description="Renova a pele por esfoliação controlada, melhora textura e manchas" />
                <ProcedureRow name="Microagulhamento" description="Estimula colágeno por microlesões controladas" />
                <ProcedureRow name="Bioestimuladores" description="Injetáveis que estimulam produção de colágeno próprio" />
                <ProcedureRow name="Toxina botulínica" description="Relaxa músculos responsáveis por linhas de expressão" />
                <ProcedureRow name="Laser / LIP" description="Trata manchas, vasinhos e estimula colágeno" />
              </tbody>
            </table>
          </div>

          <InfoBox>
            <strong>Dica:</strong> Todos os procedimentos são complementares a uma boa rotina de skincare — nunca substitutos. A pele bem cuidada responde melhor a qualquer procedimento.
          </InfoBox>
        </div>
      </PdfContentPage>

      {/* ── Módulo 8 / Pág 2 — Conclusão */}
      <PdfContentPage accentGradient={ACCENT} kicker="Conclusão" title="O Caminho para uma Pele Saudável">
        <div className="flex flex-1 flex-col justify-center space-y-5">
          <div className="rounded-2xl p-6 text-center" style={{ background: C.lightBg }}>
            <div className="mb-4 text-[2.5rem] leading-none">✨</div>
            <blockquote className="font-display text-[1.05rem] font-semibold leading-relaxed italic" style={{ color: C.darkColor }}>
              "Antienvelhecimento não é sobre parecer mais jovem do que você é. É sobre manter a saúde da pele pelo maior tempo possível. Uma rotina simples com protetor solar todos os dias, retinol à noite e vitamina C pela manhã — feita com consistência — vai fazer mais pela sua pele do que qualquer procedimento feito sem essa base."
            </blockquote>
          </div>
          <div className="rounded-xl p-4 space-y-2" style={{ background: 'white', border: `1px solid ${C.border}` }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: C.color }}>Os 3 pilares inegociáveis</div>
            <BulletCheck><strong>Protetor solar FPS 50+ todos os dias</strong> — previne 80% do envelhecimento visível</BulletCheck>
            <BulletCheck><strong>Vitamina C pela manhã</strong> — protege e estimula colágeno durante o dia</BulletCheck>
            <BulletCheck><strong>Retinol à noite</strong> — renova e repara durante o sono</BulletCheck>
          </div>
          <div className="rounded-lg px-4 py-3 text-center" style={{ background: C.lightBg }}>
            <p className="text-[11.5px] leading-relaxed text-foreground/65">
              Este guia é informativo. Para condições específicas ou procedimentos estéticos, consulte sempre um dermatologista ou profissional habilitado.
            </p>
          </div>
        </div>
      </PdfContentPage>

      {/* ── Página final — Aviso Legal */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Aviso Legal"
        title="Informações importantes antes de começar"
        subtitle="Leia esta página com atenção. Ela garante o uso seguro dos ativos recomendados neste guia."
      >
        <div className="space-y-3">
          <InfoBox>
            <strong>Este material tem finalidade exclusivamente informativa e educativa.</strong> Não
            constitui consulta, diagnóstico, prescrição ou tratamento médico, e não substitui o
            acompanhamento de um dermatologista ou profissional de saúde qualificado.
          </InfoBox>

          <div className="rounded-xl p-4" style={{ background: 'hsl(38 85% 95%)', borderLeft: '3px solid hsl(38 80% 60%)' }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.15em] mb-1.5" style={{ color: 'hsl(38 60% 35%)' }}>
              Contraindicação absoluta — retinol e retinoides
            </div>
            <p className="text-[12.5px] leading-snug" style={{ color: 'hsl(38 40% 28%)' }}>
              Retinol, tretinoína e demais retinoides <strong>não devem ser usados durante a gravidez
              ou amamentação</strong> por risco comprovado ao bebê. Se você está grávida, tentando
              engravidar ou amamentando, suspenda o uso e converse com seu médico antes de iniciar
              qualquer protocolo deste guia.
            </p>
          </div>

          <div className="rounded-xl p-4" style={{ background: 'white', border: `1px solid ${C.border}` }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: C.color }}>
              Regras de segurança ao usar ativos
            </div>
            <div className="flex flex-col gap-1.5">
              {[
                'Faça o teste de contato: aplique uma pequena quantidade no antebraço e aguarde 24 horas antes do primeiro uso no rosto.',
                'Introduza um ativo por vez, com 2 semanas de intervalo. Vários ativos novos juntos impedem identificar o que causou uma reação.',
                'Comece o retinol 2× por semana e aumente só conforme a tolerância da pele.',
                'Nunca combine retinol, ácidos esfoliantes e vitamina C na mesma aplicação — alterne entre dias ou períodos.',
                'Protetor solar é obrigatório sempre que usar ácidos ou retinol: eles fotossensibilizam e, sem FPS, pioram manchas.',
                'Interrompa o uso diante de ardência persistente, vermelhidão que não passa ou descamação intensa.',
              ].map((item) => (
                <div key={item} className="flex gap-2 text-[12.5px] leading-snug text-foreground/90">
                  <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: C.color }} aria-hidden />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              {
                titulo: 'Procure um dermatologista se',
                desc: 'Você tem rosácea, dermatite, psoríase, melasma extenso ou qualquer condição de pele diagnosticada. Rugas profundas e flacidez acentuada exigem avaliação profissional.',
              },
              {
                titulo: 'Consulte antes de usar se',
                desc: 'Está grávida ou amamentando, faz uso de isotretinoína oral, ou realizou peeling, laser ou preenchimento nas últimas semanas.',
              },
              {
                titulo: 'Sobre os procedimentos citados',
                desc: 'Toxina botulínica, preenchimento, laser e microagulhamento são atos médicos. São mencionados apenas de forma informativa e devem ser realizados exclusivamente por profissional habilitado.',
              },
              {
                titulo: 'Sobre os resultados',
                desc: 'Os efeitos variam conforme tipo de pele, idade, genética, saúde geral e constância. Nenhum resultado específico é garantido, e este guia não promete cura ou reversão do envelhecimento.',
              },
            ].map((item) => (
              <div key={item.titulo} className="rounded-xl p-3.5" style={{ background: 'white', border: `1px solid ${C.border}` }}>
                <div className="mb-1 text-[12px] font-bold" style={{ color: C.darkColor }}>{item.titulo}</div>
                <p className="text-[12px] leading-snug text-foreground/85">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg px-4 py-3" style={{ background: 'hsl(0 0% 97%)' }}>
            <p className="text-[11.5px] leading-snug text-foreground/70">
              <strong>Responsabilidade e direitos autorais.</strong> Ao utilizar as informações deste
              guia, o leitor assume integral responsabilidade pela aplicação das rotinas e ativos aqui
              descritos. Os autores e distribuidores não se responsabilizam por eventuais reações
              adversas, danos ou prejuízos decorrentes do uso indevido do conteúdo. Este material é
              protegido por direitos autorais — a reprodução, revenda ou distribuição total ou parcial
              sem autorização expressa é proibida.
            </p>
          </div>
        </div>
      </PdfContentPage>
    </>
  );
}
