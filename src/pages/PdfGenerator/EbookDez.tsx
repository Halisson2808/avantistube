/**
 * PDF 10 — Rota: /pdf/ebook-dez · Pele Oleosa: Lista de Produtos Essenciais
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';

const ACCENT = 'linear-gradient(to bottom, hsl(205 65% 42%), hsl(210 62% 38%), hsl(200 60% 34%))';

const C = {
  darkColor: 'hsl(210 65% 20%)',
  color:     'hsl(205 65% 42%)',
  lightBg:   'hsl(200 65% 93%)',
  border:    'hsl(205 55% 76%)',
};

// ── Componentes ──────────────────────────────────────────────────────────────

function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
  return (
    <div className="rounded-xl px-4 py-3 mb-1" style={{ background: C.color }}>
      <div className="text-[9.5px] font-bold uppercase tracking-[0.22em] text-white/70 mb-0.5">{badge}</div>
      <div className="font-display text-[1.2rem] font-bold text-white leading-tight">{title}</div>
      <div className="text-[12px] text-white/75 mt-0.5">{subtitle}</div>
    </div>
  );
}

type NoteType = 'alert' | 'tip' | 'myth' | 'attention';

function ProductCard({ number, name, paraQueServe, oProcurar, frequencia, note, noteLabel, noteType = 'tip' }: {
  number: number; name: string;
  paraQueServe: string; oProcurar: string; frequencia: string;
  note?: string; noteLabel?: string; noteType?: NoteType;
}) {
  const noteStyle =
    noteType === 'alert' || noteType === 'attention'
      ? { bg: 'hsl(38 85% 95%)', border: 'hsl(38 80% 60%)', label: 'hsl(38 60% 35%)', text: 'hsl(38 40% 30%)' }
      : { bg: C.lightBg, border: C.color, label: C.color, text: 'inherit' };

  return (
    <div className="avoid-page-break rounded-xl p-4" style={{ background: 'white', border: `1px solid ${C.border}` }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3 pb-2.5 border-b border-gray-100">
        <span className="block h-8 w-8 shrink-0 rounded-full text-center text-[13px] font-bold leading-8 text-white" style={{ background: C.color }}>
          {number}
        </span>
        <h4 className="font-display text-[1.1rem] font-bold leading-tight" style={{ color: C.darkColor }}>{name}</h4>
      </div>

      {/* Body */}
      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        <div className="rounded-lg px-3 py-2.5" style={{ background: C.lightBg }}>
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: C.color }}>Para que serve</div>
          <div className="text-[12.5px] leading-snug text-foreground/90">{paraQueServe}</div>
        </div>
        <div className="rounded-lg px-3 py-2.5" style={{ background: C.lightBg }}>
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: C.color }}>O que procurar</div>
          <div className="text-[12.5px] leading-snug text-foreground/90">{oProcurar}</div>
        </div>
      </div>

      {/* Frequência */}
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white" style={{ background: C.color }}>
          Frequência
        </span>
        <span className="text-[12.5px] text-foreground/85">{frequencia}</span>
      </div>

      {/* Note */}
      {note && noteLabel && (
        <div className="rounded-md px-3 py-2 text-[12px] leading-normal" style={{ background: noteStyle.bg, borderLeft: `3px solid ${noteStyle.border}` }}>
          <span className="font-bold" style={{ color: noteStyle.label }}>{noteLabel}: </span>
          <span style={{ color: noteStyle.text === 'inherit' ? undefined : noteStyle.text }} className={noteStyle.text === 'inherit' ? 'text-foreground/85' : ''}>
            {note}
          </span>
        </div>
      )}
    </div>
  );
}

function PriorityItem({ number, children }: { number: number; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="block h-6 w-6 shrink-0 rounded-full text-center text-[11px] font-bold leading-6 text-white" style={{ background: C.color }}>{number}</span>
      <span className="text-[13px] leading-snug text-foreground/90">{children}</span>
    </div>
  );
}

function IgnoreItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-[2px] text-[1rem] leading-none shrink-0" aria-hidden>🚫</span>
      <div className="text-[13px] leading-snug text-foreground/90">{children}</div>
    </div>
  );
}

// ── Capa ───────────────────────────────────────────────────────────────────
function Cover() {
  return (
    <section
      className="relative flex h-[297mm] flex-col overflow-hidden page-break-after print:shadow-none"
      style={{ backgroundImage: 'url(/capa-guia-produtos-essenciais.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    />
  );
}

// ── Ebook ──────────────────────────────────────────────────────────────────
export default function EbookDez() {
  return (
    <>
      <Cover />

      {/* ── Pág 2 — Quote + Prioridades */}
      <PdfContentPage accentGradient={ACCENT} kicker="Sobre este guia" title="Menos produtos, mais resultado">
        <div className="space-y-4">
          <div className="rounded-2xl px-6 py-5" style={{ background: C.lightBg }}>
            <div className="mb-3 text-[1.8rem] leading-none text-center" aria-hidden>💬</div>
            <blockquote className="font-display text-[1.02rem] font-semibold leading-relaxed italic text-center" style={{ color: C.darkColor }}>
              "Você não precisa de 20 produtos para ter uma pele bonita. Precisa dos produtos certos, usados da forma certa. Este guia mostra exatamente o que é essencial, o que é opcional e o que você pode ignorar completamente."
            </blockquote>
          </div>

          <div className="rounded-xl p-4" style={{ background: 'white', border: `1px solid ${C.border}` }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: C.color }}>
              🎯 Pele Oleosa — Essenciais prioritários
            </div>
            <div className="flex flex-col gap-2">
              <PriorityItem number={1}>Sabonete com ácido salicílico para controlar sebo</PriorityItem>
              <PriorityItem number={2}>Hidratante gel oil-free — nunca pule este passo</PriorityItem>
              <PriorityItem number={3}>Protetor solar com toque seco ou matte</PriorityItem>
              <PriorityItem number={4}>Sérum com niacinamida — controla poros e oleosidade</PriorityItem>
              <PriorityItem number={5}>Esfoliante com ácido salicílico 2× por semana</PriorityItem>
            </div>
          </div>

          <div className="rounded-xl px-4 py-3" style={{ background: C.lightBg, borderLeft: `3px solid ${C.color}` }}>
            <div className="text-[12.5px] leading-snug text-foreground/85">
              Este guia está dividido em <strong>3 categorias</strong>: <strong>Indispensáveis</strong> (toda rotina precisa), <strong>Potencializadores</strong> (fazem diferença real quando os básicos já são hábito) e <strong>Especializados</strong> (para necessidades específicas).
            </div>
          </div>
        </div>
      </PdfContentPage>

      {/* ── Pág 3 — Os Indispensáveis: Sabonete + Hidratante */}
      <PdfContentPage accentGradient={ACCENT} kicker="Os Indispensáveis" title="Toda rotina precisa ter estes três">
        <div className="space-y-3">
          <SectionHeader badge="Prioridade máxima" title="Os Indispensáveis" subtitle="Toda rotina precisa ter estes três — sem exceção." />
          <ProductCard
            number={1} name="Sabonete Facial"
            paraQueServe="Remove oleosidade, suor, poluição e resíduos do dia sem agredir a pele."
            oProcurar="Fórmula específica para o rosto (nunca sabonete de corpo), sem sulfatos agressivos, pH balanceado entre 4,5 e 6,5."
            frequencia="2× por dia — manhã e noite"
            noteLabel="Sinal de alerta" noteType="alert"
            note="Rosto apertado ou ressecado após lavar — o produto está retirando a oleosidade protetora natural."
          />
          <ProductCard
            number={2} name="Hidratante Facial"
            paraQueServe="Repõe a umidade da pele e fortalece a barreira de proteção contra agressores externos."
            oProcurar="Para pele oleosa: textura gel ou gel-creme oil-free. Para mista: fluido ou loção. Para seca: creme rico."
            frequencia="2× por dia — manhã e noite"
            noteLabel="Sinal de alerta" noteType="alert"
            note="Pele volta a ficar ressecada ou muito oleosa poucas horas depois — indica que o hidratante não é adequado para o seu tipo."
          />
        </div>
      </PdfContentPage>

      {/* ── Pág 4 — Protetor Solar + Início Potencializadores */}
      <PdfContentPage accentGradient={ACCENT} kicker="Os Indispensáveis" title="Toda rotina precisa ter estes três">
        <div className="space-y-3">
          <ProductCard
            number={3} name="Protetor Solar"
            paraQueServe="Protege contra manchas, envelhecimento precoce, perda de colágeno e câncer de pele. É o produto anti-idade mais eficaz que existe."
            oProcurar="FPS 30 ou mais, fórmula facial (não a de corpo), preferencialmente com toque seco ou leve para uso diário."
            frequencia="Toda manhã — obrigatório, mesmo em casa, mesmo em dia nublado"
            noteLabel="Sinal de alerta" noteType="alert"
            note="Deixa a pele branca, pegajosa ou muito oleosa — experimente outra textura ou formulação."
          />
          <SectionHeader badge="Alta recomendação" title="Os Potencializadores" subtitle="Fazem diferença real quando os básicos já são hábito." />
          <ProductCard
            number={4} name="Demaquilante ou Água Micelar"
            paraQueServe="Remove maquiagem completamente antes da limpeza. Nenhum sabonete sozinho dissolve maquiagem à prova d'água ou base de cobertura alta."
            oProcurar="Sem álcool, sem fragrância forte. Bifásico para maquiagem pesada. Micelar para peles sensíveis."
            frequencia="Sempre que usar maquiagem — antes do sabonete, nunca no lugar dele"
            noteLabel="Por que vale" noteType="tip"
            note="Quem usa maquiagem e pula este passo acorda com resíduo pigmentado nos poros que, ao longo do tempo, causa acne e opacidade."
          />
        </div>
      </PdfContentPage>

      {/* ── Pág 5 — Potencializadores: Niacinamida + AH */}
      <PdfContentPage accentGradient={ACCENT} kicker="Os Potencializadores" title="Fazem diferença real quando os básicos já são hábito">
        <div className="space-y-3">
          <ProductCard
            number={5} name="Sérum com Niacinamida"
            paraQueServe="Controla oleosidade, reduz poros visíveis, uniformiza o tom da pele e clareia manchas leves."
            oProcurar="Concentração entre 5% e 10% de niacinamida. Textura leve, sem perfume, preferencialmente sem álcool."
            frequencia="1× por dia — preferencialmente à noite"
            noteLabel="Por que vale" noteType="tip"
            note="Um dos ativos mais versáteis do skincare: funciona para quase todos os tipos de pele, tem excelente custo-benefício e raramente causa irritação."
          />
          <ProductCard
            number={6} name="Sérum com Ácido Hialurônico"
            paraQueServe="Hidratação profunda — atrai água para as camadas internas da pele, deixando-a com volume e elasticidade."
            oProcurar="Aplicar sempre com a pele levemente úmida para potencializar o efeito de atração de água."
            frequencia="1× por dia — pode usar manhã ou noite"
            noteLabel="Por que vale" noteType="tip"
            note="Ideal para quem sente a pele 'cansada', sem viço ou com pequenas linhas de desidratação. Funciona em todos os tipos de pele."
          />
        </div>
      </PdfContentPage>

      {/* ── Pág 6 — Os Especializados: Esfoliante + Máscara */}
      <PdfContentPage accentGradient={ACCENT} kicker="Os Especializados" title="Para necessidades e objetivos específicos">
        <div className="space-y-3">
          <SectionHeader badge="Conforme necessidade" title="Os Especializados" subtitle="Para necessidades e objetivos específicos." />
          <ProductCard
            number={7} name="Esfoliante Facial"
            paraQueServe="Remove células mortas acumuladas, desobstrói poros e deixa a pele mais receptiva e luminosa."
            oProcurar="Esfoliante químico (AHA – ácido glicólico / BHA – ácido salicílico) para pele seca e sensível. Físico muito suave apenas para oleosa e mista."
            frequencia="1 a 2× por semana — nunca diariamente"
            noteLabel="Atenção" noteType="attention"
            note="Sempre use protetor solar no dia seguinte à esfoliação — a pele fica mais sensível ao sol e pode manchar."
          />
          <ProductCard
            number={8} name="Máscara Facial"
            paraQueServe="Tratamento concentrado e pontual — hidratação intensa, limpeza profunda de poros ou efeito calmante."
            oProcurar="Argila (caulim ou bentonita) para pele oleosa e mista. Tecido hidratante ou gel para pele seca e sensível."
            frequencia="1× por semana como ritual de cuidado"
            noteLabel="Dica" noteType="tip"
            note="Ótima opção para dias que você quer um tratamento mais intenso sem precisar adicionar vários séruns."
          />
        </div>
      </PdfContentPage>

      {/* ── Pág 7 — Óleo Facial + Contorno dos Olhos */}
      <PdfContentPage accentGradient={ACCENT} kicker="Os Especializados" title="Para necessidades e objetivos específicos">
        <div className="space-y-3">
          <ProductCard
            number={9} name="Óleo Facial"
            paraQueServe="Nutrição profunda, brilho saudável e fortalecimento da barreira lipídica da pele."
            oProcurar="Óleo de rosa mosqueta para manchas e cicatrizes. Óleo de jojoba para equilibrar até pele oleosa. Óleo de argan para nutrição intensa em pele seca."
            frequencia="À noite, após o hidratante — 2 a 3 gotas são suficientes"
            noteLabel="Mito desfeito" noteType="tip"
            note="Mito: óleo causa acne. Depende do tipo. Jojoba e rosa mosqueta são não-comedogênicos e não entopem poros."
          />
          <ProductCard
            number={10} name="Contorno dos Olhos"
            paraQueServe="A pele ao redor dos olhos é 4× mais fina que o restante do rosto e envelhece de forma diferente — precisa de cuidado específico."
            oProcurar="Fórmula desenvolvida especificamente para a área dos olhos. Com cafeína para olheiras e inchaço. Com retinol suave para linhas finas."
            frequencia="1 a 2× por dia — aplique sempre com o dedo anelar, que exerce menos pressão"
            noteLabel="Dica" noteType="tip"
            note="Nunca use o hidratante facial comum na área dos olhos — a pele é muito mais delicada e pode reagir a ingredientes que o rosto tolera bem."
          />
        </div>
      </PdfContentPage>

      {/* ── Pág 8 — O que Ignorar + Dica Final */}
      <PdfContentPage accentGradient={ACCENT} kicker="O que Você Pode Ignorar" title="A indústria vende muito — mas não são essenciais">
        <div className="space-y-4">
          <div className="rounded-xl p-4" style={{ background: 'hsl(0 30% 97%)', border: '1px solid hsl(0 30% 88%)' }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: 'hsl(0 45% 35%)' }}>
              🚫 Pode ignorar com segurança
            </div>
            <div className="flex flex-col gap-2.5">
              <IgnoreItem><strong>Tônico adstringente forte</strong> — Se seu sabonete é bom, o tônico agressivo é redundante e pode irritar a pele.</IgnoreItem>
              <IgnoreItem><strong>Spray facial</strong> — Bonito nas redes sociais, mas com pouco efeito real e durável.</IgnoreItem>
              <IgnoreItem><strong>Primer sem protetor solar</strong> — A menos que seu protetor já funcione como primer.</IgnoreItem>
              <IgnoreItem><strong>Qualquer produto com mais de 15 ingredientes ativos</strong> — Mais não é mais — pode irritar e dificulta identificar o que funciona.</IgnoreItem>
            </div>
          </div>

          <div className="rounded-2xl px-6 py-5" style={{ background: C.lightBg }}>
            <div className="mb-3 text-[1.8rem] leading-none text-center" aria-hidden>✨</div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3 text-center" style={{ color: C.color }}>Dica final</div>
            <blockquote className="font-display text-[1rem] font-semibold leading-relaxed italic text-center" style={{ color: C.darkColor }}>
              "Monte sua rotina aos poucos. Comece pelos 3 indispensáveis — sabonete, hidratante e protetor solar. Quando esses três virarem hábito, adicione um produto por vez. Sua pele agradece a consistência muito mais do que a quantidade."
            </blockquote>
          </div>

          <div className="rounded-xl p-4" style={{ background: 'white', border: `1px solid ${C.border}` }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: C.color }}>Resumo da rotina para pele oleosa</div>
            {[
              { period: '☀️ Manhã', steps: 'Sabonete → Sérum Niacinamida → Hidratante gel → Protetor solar matte' },
              { period: '🌙 Noite', steps: 'Demaquilante (se maquiagem) → Sabonete → Sérum AH → Hidratante gel' },
              { period: '2× /semana', steps: 'Esfoliante com ácido salicílico (noite) → Protetor solar no dia seguinte' },
              { period: '1× /semana', steps: 'Máscara de argila (caulim ou bentonita)' },
            ].map((row) => (
              <div key={row.period} className="flex gap-3 py-2 border-t first:border-t-0" style={{ borderColor: C.border }}>
                <div className="w-24 shrink-0 text-[12px] font-bold" style={{ color: C.darkColor }}>{row.period}</div>
                <div className="text-[12px] leading-snug text-foreground/85">{row.steps}</div>
              </div>
            ))}
          </div>
        </div>
      </PdfContentPage>
    </>
  );
}
