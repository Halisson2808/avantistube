/**
 * PDF 9 — Rota: /pdf/ebook-nove · Alimentação para Pele Bonita
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';

const ACCENT = 'linear-gradient(to bottom, hsl(145 45% 40%), hsl(155 42% 36%), hsl(135 50% 32%))';

const C = {
  darkColor: 'hsl(145 50% 18%)',
  color:     'hsl(145 45% 38%)',
  lightBg:   'hsl(140 45% 93%)',
  border:    'hsl(145 38% 76%)',
};

// ── Componentes compartilhados ───────────────────────────────────────────────

function InfoBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg px-4 py-2.5 leading-normal" style={{ background: C.lightBg, borderLeft: `3px solid ${C.color}` }}>
      <div className="text-[12.5px] leading-snug text-foreground/90">{children}</div>
    </div>
  );
}

function SectionTitle({ children, emoji }: { children: ReactNode; emoji?: string }) {
  return (
    <div className="mb-2 mt-3 flex items-center gap-2 first:mt-0">
      {emoji && <span className="text-[1.05rem] leading-none" aria-hidden>{emoji}</span>}
      <h3 className="font-display text-[1rem] font-bold tracking-tight" style={{ color: C.darkColor }}>{children}</h3>
    </div>
  );
}

function BulletItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 text-[12.5px] leading-snug text-foreground/90">
      <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: C.color }} aria-hidden />
      {children}
    </div>
  );
}

// ── Módulo 1 ────────────────────────────────────────────────────────────────

function ComparisonColumn({ type, icon, items }: { type: 'bad' | 'good'; icon: string; items: string[] }) {
  const isBad = type === 'bad';
  const bg = isBad ? 'hsl(0 40% 96%)' : C.lightBg;
  const border = isBad ? 'hsl(0 40% 85%)' : C.border;
  const titleColor = isBad ? 'hsl(0 50% 32%)' : C.darkColor;
  const dotColor = isBad ? 'hsl(0 55% 55%)' : C.color;
  return (
    <div className="flex-1 rounded-xl p-3.5" style={{ background: bg, border: `1px solid ${border}` }}>
      <div className="mb-2.5 flex items-center gap-2">
        <span className="text-[1.2rem]" aria-hidden>{icon}</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: titleColor }}>
          {isBad ? 'Alimentação ruim' : 'Alimentação boa'}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <div key={item} className="flex gap-2 text-[12.5px] leading-snug text-foreground/90">
            <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: dotColor }} aria-hidden />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function InflamacaoItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2.5 text-[12.5px] leading-snug text-foreground/90">
      <span className="shrink-0 font-bold" style={{ color: 'hsl(0 50% 48%)' }}>→</span>
      {children}
    </div>
  );
}

// ── Módulo 2 ────────────────────────────────────────────────────────────────

function NutrientCard({ emoji, name, why, deficiency, sources, tip, attention }: {
  emoji: string; name: string; why: string; deficiency: string;
  sources: string[]; tip?: string; attention?: string;
}) {
  return (
    <div className="avoid-page-break rounded-xl p-3" style={{ background: 'white', border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[1.2rem] leading-none" aria-hidden>{emoji}</span>
        <h4 className="font-display text-[1rem] font-bold" style={{ color: C.darkColor }}>{name}</h4>
      </div>
      <p className="text-[12.5px] leading-snug text-foreground/85 mb-2">{why}</p>
      <div className="mb-2 rounded-md px-2.5 py-1.5 text-[11.5px]" style={{ background: C.lightBg }}>
        <span className="font-bold" style={{ color: C.color }}>Deficiência: </span>
        <span className="text-foreground/80">{deficiency}</span>
      </div>
      <div className="mb-1.5 text-[11.5px]">
        <span className="font-bold" style={{ color: C.darkColor }}>Fontes: </span>
        <span className="text-foreground/80">{sources.join(' · ')}</span>
      </div>
      {tip && (
        <div className="mt-1.5 rounded-md px-2.5 py-1.5 text-[11.5px] leading-normal" style={{ background: C.lightBg, borderLeft: `3px solid ${C.color}` }}>
          <span className="font-bold" style={{ color: C.color }}>Dica: </span>
          <span className="text-foreground/85">{tip}</span>
        </div>
      )}
      {attention && (
        <div className="mt-1.5 rounded-md px-2.5 py-1.5 text-[11.5px] leading-normal" style={{ background: 'hsl(38 85% 95%)', borderLeft: '3px solid hsl(38 80% 60%)' }}>
          <span className="font-bold" style={{ color: 'hsl(38 60% 35%)' }}>Atenção: </span>
          <span style={{ color: 'hsl(38 40% 30%)' }}>{attention}</span>
        </div>
      )}
    </div>
  );
}

function WaterCard() {
  const signs = ['Pele opaca e sem viço', 'Linhas finas mais visíveis', 'Oleosidade excessiva (a pele tenta compensar)', 'Olheiras mais marcadas'];
  return (
    <div className="rounded-xl p-3.5" style={{ background: 'white', border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[1.2rem] leading-none" aria-hidden>💧</span>
        <h4 className="font-display text-[1rem] font-bold" style={{ color: C.darkColor }}>Água — o nutriente mais subestimado</h4>
      </div>
      <p className="text-[12.5px] leading-snug text-foreground/85 mb-2">A hidratação interna afeta diretamente a elasticidade, o viço e a capacidade da pele de se regenerar. Pele desidratada por dentro parece cansada, tem linhas mais marcadas e produz mais oleosidade para compensar.</p>
      <div className="flex gap-3">
        <div className="flex-1 rounded-lg px-3 py-2.5" style={{ background: C.lightBg }}>
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5" style={{ color: C.color }}>Meta diária</div>
          <div className="font-display text-[1.3rem] font-bold mb-0.5" style={{ color: C.darkColor }}>2 a 2,5L</div>
          <div className="text-[11.5px] text-foreground/70">Mais em dias quentes ou com atividade física</div>
        </div>
        <div className="flex-1 rounded-lg px-3 py-2.5" style={{ background: C.lightBg }}>
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5" style={{ color: C.color }}>Sinais de desidratação</div>
          <div className="flex flex-col gap-1">
            {signs.map((s) => (
              <div key={s} className="flex gap-1.5 text-[11px] leading-snug text-foreground/85">
                <span className="shrink-0 mt-[3px] h-1.5 w-1.5 rounded-full" style={{ background: C.color }} aria-hidden />
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-2 rounded-md px-2.5 py-1.5 text-[11.5px] leading-normal" style={{ background: C.lightBg, borderLeft: `3px solid ${C.color}` }}>
        <span className="font-bold" style={{ color: C.color }}>Dica: </span>
        <span className="text-foreground/85">Chás sem açúcar (verde, branco, hibisco) contam para a hidratação diária e ainda entregam antioxidantes extras.</span>
      </div>
    </div>
  );
}

// ── Módulo 3 ────────────────────────────────────────────────────────────────

function SuperfoodCard({ emoji, name, children }: { emoji: string; name: string; children: ReactNode }) {
  return (
    <div className="rounded-xl p-3" style={{ background: 'white', border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[1.1rem] leading-none" aria-hidden>{emoji}</span>
        <h4 className="font-bold text-[13px]" style={{ color: C.darkColor }}>{name}</h4>
      </div>
      <p className="text-[12px] leading-snug text-foreground/85">{children}</p>
    </div>
  );
}

// ── Módulo 4 ────────────────────────────────────────────────────────────────

function AvoidCard({ emoji, name, description, sources, attention }: {
  emoji: string; name: string; description: string; sources: string[]; attention?: string;
}) {
  return (
    <div className="avoid-page-break rounded-xl p-3.5" style={{ background: 'hsl(0 30% 97%)', border: '1px solid hsl(0 35% 88%)' }}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[1.2rem] leading-none shrink-0" aria-hidden>{emoji}</span>
        <h4 className="font-bold text-[13.5px]" style={{ color: 'hsl(0 50% 25%)' }}>{name}</h4>
      </div>
      <p className="text-[12.5px] leading-snug text-foreground/85 mb-2">{description}</p>
      <div className="rounded-md px-2.5 py-2 mb-1.5" style={{ background: 'hsl(0 30% 94%)' }}>
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: 'hsl(0 50% 38%)' }}>Onde limitar</div>
        <div className="text-[11.5px] text-foreground/80">{sources.join(' · ')}</div>
      </div>
      {attention && (
        <div className="rounded-md px-2.5 py-1.5 text-[11.5px] leading-normal" style={{ background: 'hsl(38 85% 95%)', borderLeft: '3px solid hsl(38 80% 60%)' }}>
          <span className="font-bold" style={{ color: 'hsl(38 60% 35%)' }}>Atenção: </span>
          <span style={{ color: 'hsl(38 40% 30%)' }}>{attention}</span>
        </div>
      )}
    </div>
  );
}

// ── Módulo 5 ────────────────────────────────────────────────────────────────

function PlateZone({ percent, title, check, items }: { percent: string; title: string; check: string; items: string }) {
  return (
    <div className="flex gap-3 rounded-xl p-3" style={{ background: 'white', border: `1px solid ${C.border}` }}>
      <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-full text-white font-bold font-display text-[1.1rem]" style={{ background: C.color }}>
        {percent}
      </div>
      <div className="flex-1">
        <div className="font-bold text-[13px] mb-0.5" style={{ color: C.darkColor }}>{title}</div>
        <div className="text-[11.5px] mb-0.5" style={{ color: C.color }}>{check}</div>
        <div className="text-[12px] text-foreground/80">{items}</div>
      </div>
    </div>
  );
}

function DietPatternCard({ emoji, name, children }: { emoji: string; name: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl p-3" style={{ background: C.lightBg }}>
      <span className="text-[1.2rem] leading-none shrink-0 mt-0.5" aria-hidden>{emoji}</span>
      <div>
        <div className="font-bold text-[13px] mb-0.5" style={{ color: C.darkColor }}>{name}</div>
        <div className="text-[12.5px] leading-snug text-foreground/85">{children}</div>
      </div>
    </div>
  );
}

// ── Módulo 6 ────────────────────────────────────────────────────────────────

function SupplementCard({ emoji, name, children }: { emoji: string; name: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl p-3" style={{ background: 'white', border: `1px solid ${C.border}` }}>
      <span className="text-[1.2rem] leading-none shrink-0 mt-0.5" aria-hidden>{emoji}</span>
      <div>
        <div className="font-bold text-[13px] mb-0.5" style={{ color: C.darkColor }}>{name}</div>
        <div className="text-[12.5px] leading-snug text-foreground/85">{children}</div>
      </div>
    </div>
  );
}

// ── Módulo 7 ────────────────────────────────────────────────────────────────

function WeekCard({ week, focus, actions, expected }: {
  week: number; focus: string; actions: string[]; expected: string;
}) {
  return (
    <div className="avoid-page-break rounded-xl p-3.5" style={{ background: 'white', border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="block h-8 w-8 shrink-0 rounded-full text-center text-[12px] font-bold leading-8 text-white" style={{ background: C.color }}>{week}</span>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: C.color }}>Semana {week}</div>
          <div className="font-bold text-[13px]" style={{ color: C.darkColor }}>Foco: {focus}</div>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 rounded-lg px-3 py-2" style={{ background: C.lightBg }}>
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1.5" style={{ color: C.color }}>O que fazer</div>
          <div className="flex flex-col gap-1">
            {actions.map((a) => (
              <div key={a} className="flex gap-1.5 text-[12px] leading-snug text-foreground/90">
                <span className="shrink-0 mt-[4px] h-1.5 w-1.5 rounded-full" style={{ background: C.color }} aria-hidden />
                {a}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 rounded-lg px-3 py-2" style={{ background: C.lightBg }}>
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1.5" style={{ color: C.color }}>O que esperar</div>
          <div className="text-[12px] leading-snug text-foreground/85">{expected}</div>
        </div>
      </div>
    </div>
  );
}

// ── Capa ───────────────────────────────────────────────────────────────────
function Cover() {
  return (
    <section
      className="relative flex h-[297mm] flex-col overflow-hidden page-break-after print:shadow-none"
      style={{ backgroundImage: 'url(/capa-guia-alimentacao.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    />
  );
}

// ── Ebook ──────────────────────────────────────────────────────────────────
export default function EbookNove() {
  return (
    <>
      <Cover />

      {/* ── Módulo 1 / Pág 1 — Comparação + Inflamação */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 1" title="A Conexão Real Entre Alimentação e Pele" subtitle="Por que o que você come aparece na sua pele — e como mudar isso">
        <div className="space-y-3">
          <p className="text-[13px] leading-relaxed text-foreground/90">
            A pele é o maior órgão do corpo e um dos <strong>últimos a receber nutrientes</strong> — os órgãos vitais têm prioridade. Isso significa que deficiências nutricionais aparecem na pele antes de qualquer outro sinal externo.
          </p>
          <div className="flex gap-3">
            <ComparisonColumn type="bad" icon="❌" items={['Oleosidade excessiva ou ressecamento', 'Acne e inflamação', 'Opacidade e falta de viço', 'Envelhecimento acelerado', 'Cicatrização lenta', 'Olheiras e inchaço']} />
            <ComparisonColumn type="good" icon="✅" items={['Luminosidade natural', 'Menos inflamação e menos espinhas', 'Mais elasticidade e firmeza', 'Tom uniforme e saudável', 'Regeneração mais rápida']} />
          </div>
          <SectionTitle emoji="🔥">O conceito de inflamação silenciosa</SectionTitle>
          <p className="text-[12.5px] leading-snug text-foreground/85">A maior parte dos problemas de pele tem uma raiz em comum: <strong>inflamação crônica de baixo grau</strong>. Ela não dói, mas está presente no corpo de quem come mal de forma consistente.</p>
          <div className="flex flex-col gap-1.5 pl-2">
            <InflamacaoItem>Degrada o colágeno e a elastina</InflamacaoItem>
            <InflamacaoItem>Estimula a produção excessiva de sebo</InflamacaoItem>
            <InflamacaoItem>Piora a acne e a rosácea</InflamacaoItem>
            <InflamacaoItem>Acelera o envelhecimento celular</InflamacaoItem>
            <InflamacaoItem>Compromete a barreira de proteção da pele</InflamacaoItem>
          </div>
          <InfoBox><strong>Dica:</strong> A inflamação silenciosa responde à alimentação em poucas semanas — é um dos sistemas que muda mais rápido com a dieta.</InfoBox>
        </div>
      </PdfContentPage>

      {/* ── Módulo 1 / Pág 2 — Eixo intestino-pele */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 1" title="O Eixo Intestino-Pele">
        <div className="flex flex-1 flex-col justify-center space-y-4">
          <div className="rounded-2xl p-5" style={{ background: C.lightBg }}>
            <p className="text-[14px] leading-relaxed text-foreground/90 mb-4">
              O intestino e a pele se comunicam diretamente. Um intestino com microbioma desequilibrado — causado por má alimentação, excesso de açúcar e ultraprocessados — gera <strong>inflamação sistêmica que aparece na pele</strong>.
            </p>
            <div className="flex justify-center gap-6 my-4">
              {['Intestino desequilibrado', '→ Inflamação sistêmica', '→ Pele comprometida'].map((step) => (
                <div key={step} className="text-center flex-1 rounded-xl px-3 py-3 bg-white" style={{ border: `1px solid ${C.border}` }}>
                  <div className="text-[12.5px] font-semibold leading-snug" style={{ color: C.darkColor }}>{step}</div>
                </div>
              ))}
            </div>
            <p className="text-[13.5px] leading-relaxed text-foreground/90 font-semibold text-center" style={{ color: C.darkColor }}>
              Cuidar do intestino é cuidar da pele.
            </p>
          </div>
          <InfoBox>
            Os dois respondem à mesma coisa: <strong>menos açúcar, menos ultraprocessados, mais fibras e mais variedade.</strong>
          </InfoBox>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: '🍬', label: 'Menos açúcar', desc: 'Reduz inflamação e sebo' },
              { icon: '🌾', label: 'Mais fibras', desc: 'Alimenta bactérias boas' },
              { icon: '🎨', label: 'Mais variedade', desc: 'Microbioma diverso = pele saudável' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl p-3 text-center bg-white" style={{ border: `1px solid ${C.border}` }}>
                <div className="text-[1.5rem] mb-1" aria-hidden>{item.icon}</div>
                <div className="font-bold text-[12px] mb-0.5" style={{ color: C.darkColor }}>{item.label}</div>
                <div className="text-[11.5px] text-foreground/75">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </PdfContentPage>

      {/* ── Módulo 2 / Pág 1 — Vit C + Vit E */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 2" title="Os Nutrientes Essenciais para a Pele" subtitle="Vitaminas, minerais e gorduras que a pele precisa para funcionar">
        <div className="flex flex-col gap-3">
          <NutrientCard
            emoji="🍊" name="Vitamina C"
            why="O corpo não produz colágeno sem vitamina C. É literalmente o cofator que viabiliza a síntese dessa proteína. Também é antioxidante potente que neutraliza radicais livres."
            deficiency="Pele opaca, cicatrização lenta, tendência a manchas e envelhecimento precoce."
            sources={['Acerola', 'Goiaba', 'Kiwi', 'Pimentão vermelho e amarelo', 'Morango', 'Laranja, limão, caju', 'Brócolis e couve']}
            tip="A vitamina C é termossensível — frutas e vegetais crus têm mais do que os cozidos."
          />
          <NutrientCard
            emoji="🥑" name="Vitamina E"
            why="Protege as membranas celulares da oxidação, fortalece a barreira da pele e trabalha em sinergia com a vitamina C — as duas juntas são muito mais potentes do que separadas."
            deficiency="Pele seca, descamação, maior sensibilidade ao sol."
            sources={['Azeite de oliva extravirgem', 'Amêndoas e castanha-do-pará', 'Sementes de girassol e abóbora', 'Abacate', 'Gema de ovo', 'Espinafre']}
          />
          <NutrientCard
            emoji="🥕" name="Vitamina A"
            why="Regula a renovação das células da pele, controla a produção de sebo e mantém a pele hidratada. O retinol que você usa na pele é uma forma de vitamina A — e a alimentação fornece os precursores."
            deficiency="Pele seca, escamosa, poros entupidos, cicatrização lenta."
            sources={['Fígado bovino', 'Cenoura, abóbora, batata-doce, mamão', 'Ovos e laticínios integrais', 'Folhas verde-escuras (couve, espinafre)']}
            tip="O betacaroteno — pigmento laranja de cenoura e abóbora — com consumo regular dá um leve tom dourado saudável à pele."
          />
        </div>
      </PdfContentPage>

      {/* ── Módulo 2 / Pág 2 — Zinco + Ômega-3 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 2" title="Os Nutrientes Essenciais para a Pele">
        <div className="flex flex-col gap-3">
          <NutrientCard
            emoji="🌱" name="Zinco"
            why="Regula a produção de sebo, tem ação antibacteriana natural, é essencial para a cicatrização e para a produção de colágeno. Deficiência de zinco está diretamente associada à acne."
            deficiency="Acne, oleosidade excessiva, cicatrização lenta, pele sem elasticidade."
            sources={['Sementes de abóbora (uma das fontes mais ricas)', 'Carne vermelha magra', 'Frutos do mar (especialmente ostras)', 'Feijão, lentilha, grão-de-bico', 'Castanha-de-caju', 'Ovos']}
          />
          <NutrientCard
            emoji="🐟" name="Ômega-3"
            why="É o nutriente mais diretamente ligado à redução da inflamação na pele. Mantém a membrana das células saudável, melhora a hidratação interna e reduz vermelhidão, acne e sensibilidade."
            deficiency="Pele seca, inflamada, sensível, com tendência à acne e vermelhidão."
            sources={['Sardinha e atum em lata (acessíveis e muito boas)', 'Salmão', 'Chia e linhaça (moídas para melhor absorção)', 'Nozes', 'Óleo de linhaça']}
            tip="O ômega-3 animal (EPA e DHA) é mais biodisponível do que o vegetal (ALA). Se não come peixe regularmente, considere suplementação."
          />
        </div>
      </PdfContentPage>

      {/* ── Módulo 2 / Pág 3 — Silício + Selênio + Água */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 2" title="Os Nutrientes Essenciais para a Pele">
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <NutrientCard
              emoji="🌾" name="Silício"
              why="Participa da síntese de colágeno e elastina, melhora a firmeza da pele e fortalece cabelo e unhas."
              deficiency="Pele sem firmeza, cabelo e unhas frágeis."
              sources={['Aveia', 'Banana', 'Pepino (especialmente a casca)', 'Feijão-verde', 'Água mineral com silício']}
            />
          </div>
          <NutrientCard
            emoji="🌰" name="Selênio"
            why="Antioxidante potente que protege as células da pele do dano oxidativo, auxilia na proteção contra radiação UV e regula a produção de colágeno."
            deficiency="Maior dano oxidativo, pele mais envelhecida, unhas frágeis."
            sources={['Castanha-do-pará — 1 a 2 unidades já fornecem a dose diária', 'Ovos', 'Atum e sardinha', 'Frango']}
            attention="Castanha-do-pará em excesso pode causar selenose (toxicidade). Máximo 2 unidades por dia."
          />
          <WaterCard />
        </div>
      </PdfContentPage>

      {/* ── Módulo 3 / Pág 1 — Superalimentos (1ª metade) */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 3" title="Alimentos que Transformam a Pele" subtitle="Os superalimentos com maior impacto na saúde e aparência da pele">
        <div className="grid grid-cols-2 gap-2.5">
          <SuperfoodCard emoji="🥑" name="Abacate">Rico em gorduras boas (ômega-9), vitamina E e C. Hidrata de dentro para fora e fornece os lipídios que a pele usa para construir sua barreira de proteção.</SuperfoodCard>
          <SuperfoodCard emoji="🍅" name="Tomate">Rico em licopeno — antioxidante que protege contra dano solar e melhora a textura. O licopeno é melhor absorvido quando o tomate é cozido com um pouquinho de azeite.</SuperfoodCard>
          <SuperfoodCard emoji="🥕" name="Cenoura e batata-doce">Ricas em betacaroteno — precursor da vitamina A que regula a renovação celular e dá viço à pele. Consumo regular resulta em tom mais uniforme.</SuperfoodCard>
          <SuperfoodCard emoji="🫐" name="Frutas vermelhas">Ricas em antocianinas — antioxidantes que protegem o colágeno da degradação oxidativa e reduzem inflamação. Mirtilo tem um dos maiores índices antioxidantes.</SuperfoodCard>
          <SuperfoodCard emoji="🍵" name="Chá verde">Rico em EGCG — antioxidante com ação anti-inflamatória comprovada, proteção contra dano UV e efeito regulador da produção de sebo.</SuperfoodCard>
          <SuperfoodCard emoji="🫒" name="Azeite de oliva extravirgem">Rico em oleocanthal (anti-inflamatório natural), vitamina E e polifenóis. Substituir outras gorduras pelo azeite tem um dos maiores impactos na saúde da pele.</SuperfoodCard>
          <SuperfoodCard emoji="🥚" name="Ovos">Fonte completa de proteínas, biotina, vitamina A, vitamina E, zinco e selênio — praticamente um multivitamínico para a pele em um alimento só.</SuperfoodCard>
          <SuperfoodCard emoji="🌱" name="Sementes de abóbora">Uma das melhores fontes de zinco, magnésio e ômega-6. Um punhado pequeno por dia já faz diferença visível.</SuperfoodCard>
        </div>
      </PdfContentPage>

      {/* ── Módulo 3 / Pág 2 — Superalimentos (2ª metade) + Colágeno */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 3" title="Alimentos que Transformam a Pele">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <SuperfoodCard emoji="🐟" name="Sardinha e salmão">Ômega-3 + proteína + vitamina D — combinação anti-inflamatória e antienvelhecimento difícil de igualar. Sardinha em lata é igualmente nutritiva e muito mais acessível.</SuperfoodCard>
            <SuperfoodCard emoji="🍎" name="Romã">Rica em punicalaginas — antioxidantes que protegem o colágeno e têm ação anti-inflamatória superior à maioria das frutas.</SuperfoodCard>
          </div>
          <SectionTitle emoji="🦴">Colágeno e seus precursores</SectionTitle>
          <p className="text-[12.5px] leading-snug text-foreground/85">O colágeno é a principal proteína estrutural da pele. O corpo o produz a partir de aminoácidos. Para estimular a produção:</p>
          <div className="flex flex-col gap-1.5">
            <BulletItem>Proteínas de qualidade em todas as refeições (ovos, carnes, leguminosas)</BulletItem>
            <BulletItem>Caldo de ossos (rico em colágeno e gelatina naturais)</BulletItem>
            <BulletItem>Vitamina C junto com proteínas (potencializa a síntese)</BulletItem>
            <BulletItem>Gelatina sem sabor (fonte de aminoácidos do colágeno)</BulletItem>
          </div>
          <InfoBox><strong>Dica:</strong> Suplementos de colágeno hidrolisado têm evidências crescentes de benefício. Se optar por suplementar, consuma com vitamina C para melhor absorção.</InfoBox>
        </div>
      </PdfContentPage>

      {/* ── Módulo 4 / Pág 1 — O que evitar (açúcar, laticínios, gorduras trans) */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 4" title="O Que Evitar ao Máximo" subtitle="Os alimentos que inflamam, envelhecem e pioram a pele por dentro">
        <div className="flex flex-col gap-3">
          <AvoidCard
            emoji="🍬" name="Açúcar refinado"
            description="Dispara a glicação — o açúcar se liga às fibras de colágeno e elastina tornando-as rígidas e quebradiças. Também eleva a insulina → eleva androgênios → estimula produção de sebo."
            sources={['Refrigerantes e sucos industrializados', 'Iogurtes com sabor', 'Molhos prontos (ketchup, barbecue)', 'Pães brancos e cereais matinais', "Barras de cereal 'saudáveis'"]}
            attention="O açúcar é o alimento que mais envelhece a pele — acima do sol, do cigarro e do estresse. Reduzir é a mudança com maior impacto visível."
          />
          <AvoidCard
            emoji="🥛" name="Laticínios em excesso"
            description="O leite contém hormônios naturais (IGF-1) que estimulam as glândulas sebáceas. Estudos associam o consumo de leite — especialmente desnatado — ao aumento de acne em adultos."
            sources={['Leite (especialmente desnatado)', 'Queijos muito processados', 'Sorvete']}
          />
          <AvoidCard
            emoji="🍟" name="Gorduras trans e óleos refinados"
            description="Criam inflamação sistêmica e competem com o ômega-3 pelos mesmos receptores celulares — bloqueando seu efeito anti-inflamatório quando vencem."
            sources={['Margarina', 'Biscoitos recheados', 'Frituras industriais', 'Óleos de soja e milho em altas temperaturas']}
          />
        </div>
      </PdfContentPage>

      {/* ── Módulo 4 / Pág 2 — O que evitar (ultra, álcool, sal) */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 4" title="O Que Evitar ao Máximo">
        <div className="flex flex-col gap-3">
          <AvoidCard
            emoji="🥤" name="Ultraprocessados"
            description="Combinação de tudo que a pele não precisa: açúcar, gordura trans, sódio em excesso, corantes e zero de nutrientes reais. Inflamam, desequilibram o intestino e privam a pele do que ela precisa."
            sources={['Salgadinhos de pacote', 'Macarrão instantâneo', 'Embutidos (salsicha, mortadela)', 'Fast food no geral']}
          />
          <AvoidCard
            emoji="🍷" name="Álcool em excesso"
            description="Desidrata a pele profundamente, dilata vasos de forma crônica (vermelhidão), inibe a produção de colágeno, perturba o sono e sobrecarrega o fígado — essencial para eliminar toxinas."
            sources={['Mais de 1 dose por dia para mulheres já tem impacto negativo visível na pele']}
          />
          <AvoidCard
            emoji="🧂" name="Sal em excesso"
            description="Sódio em excesso causa retenção de líquido — rosto inchado, olheiras marcadas e pele sem definição. Não é gordura: é inflamação por retenção."
            sources={['Pão de forma industrial', 'Queijos processados', 'Enlatados e conservas', 'Temperos prontos']}
          />
        </div>
      </PdfContentPage>

      {/* ── Módulo 5 — A Dieta da Pele */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 5" title="A Dieta da Pele: Como Organizar" subtitle="O prato ideal, padrões alimentares e a regra 80/20 na prática">
        <div className="space-y-3">
          <SectionTitle>O prato ideal para a pele</SectionTitle>
          <p className="text-[12.5px] leading-snug text-foreground/85">Não é uma dieta restritiva — é um padrão alimentar. A cada refeição, pense em:</p>
          <div className="flex flex-col gap-2">
            <PlateZone percent="50%" title="Vegetais e legumes coloridos" check="Quanto mais cores, mais variedade de antioxidantes." items="Folhas verde-escuras, tomate, cenoura, abóbora, beterraba, brócolis" />
            <PlateZone percent="25%" title="Proteína de qualidade" check="Essencial para produzir colágeno e reparar a pele." items="Ovos, peixe, frango, carnes magras, feijão, lentilha, grão-de-bico" />
            <PlateZone percent="25%" title="Carboidrato de baixo IG" check="Libera açúcar lentamente, sem pico de insulina." items="Arroz integral, batata-doce, quinoa, aveia, mandioca" />
          </div>
          <InfoBox>+ <strong>Gordura boa em todas as refeições</strong> — azeite para temperar, abacate, castanhas, sementes — essenciais para a barreira da pele.</InfoBox>
          <div className="flex gap-3">
            <DietPatternCard emoji="🫒" name="Dieta mediterrânea">O padrão alimentar com mais evidências científicas para saúde da pele. Rica em azeite, peixes, vegetais e frutas — e baixa em açúcar e ultraprocessados.</DietPatternCard>
            <DietPatternCard emoji="🌿" name="Dieta anti-inflamatória">Foco em reduzir alimentos inflamatórios e aumentar os anti-inflamatórios. Resultados visíveis na pele em 3 a 4 semanas.</DietPatternCard>
          </div>
          <div className="flex gap-4 rounded-xl p-4" style={{ background: 'white', border: `1px solid ${C.border}` }}>
            <div className="text-center">
              <div className="font-display text-[1.8rem] font-bold" style={{ color: C.color }}>80%</div>
              <div className="text-[11.5px] text-foreground/70">Alimentação rica e anti-inflamatória</div>
            </div>
            <div className="w-px self-stretch" style={{ background: C.border }} />
            <div className="flex-1">
              <div className="font-bold text-[13px] mb-1" style={{ color: C.darkColor }}>A regra 80/20 para a pele</div>
              <p className="text-[12.5px] leading-snug text-foreground/85">Perfeição não é necessária nem sustentável. 20% de flexibilidade para comer o que quiser sem culpa. <strong>Consistência ao longo do tempo importa mais do que perfeição em alguns dias.</strong></p>
            </div>
          </div>
        </div>
      </PdfContentPage>

      {/* ── Módulo 6 — Suplementos */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 6" title="Suplementos que Fazem Diferença" subtitle="O que a ciência diz sobre colágeno, ômega-3, zinco e probióticos">
        <div className="space-y-3">
          <InfoBox><strong>Atenção:</strong> Suplementos complementam uma boa alimentação — não substituem. Idealmente são escolhidos com orientação profissional.</InfoBox>
          <div className="flex flex-col gap-2.5">
            <SupplementCard emoji="🩷" name="Colágeno hidrolisado">Estudos mostram melhora na elasticidade, hidratação e redução de rugas finas. Consuma sempre com vitamina C para potencializar a absorção.</SupplementCard>
            <SupplementCard emoji="☀️" name="Vitamina D">A maioria das pessoas tem deficiência subclínica. Está envolvida na regeneração celular da pele e na resposta imune que controla inflamação.</SupplementCard>
            <SupplementCard emoji="🐟" name="Ômega-3 (EPA + DHA)">Para quem não come peixe pelo menos 2× por semana. Um dos maiores impactos na inflamação da pele disponíveis em suplemento.</SupplementCard>
            <SupplementCard emoji="🌱" name="Zinco quelato">Para quem tem acne ou oleosidade excessiva. Mais biodisponível do que outras formas de zinco.</SupplementCard>
            <SupplementCard emoji="🦠" name="Probióticos">Equilibram o microbioma intestinal, que se comunica diretamente com a pele. Evidências crescentes para redução de acne, rosácea e dermatite.</SupplementCard>
            <SupplementCard emoji="💜" name="Biotina (vitamina B7)">Essencial para saúde da pele, cabelo e unhas. Suplementar pode ajudar quem tem queda de cabelo e pele descamativa.</SupplementCard>
          </div>
        </div>
      </PdfContentPage>

      {/* ── Módulo 7 / Pág 1 — Semanas 1 e 2 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 7" title="O Teste de 30 Dias para a Pele" subtitle="O protocolo prático com o que esperar semana a semana">
        <div className="space-y-3">
          <p className="text-[12.5px] leading-snug text-foreground/85">30 dias são suficientes para ver resultados reais e mensuráveis na pele quando a alimentação muda de verdade. Este protocolo é progressivo — cada semana adiciona um nível sobre o anterior.</p>
          <InfoBox><strong>Dica:</strong> Tire uma foto da pele no dia 1 e compare no dia 30. A diferença é sempre maior do que você percebe no espelho, que vê a mudança gradualmente.</InfoBox>
          <WeekCard
            week={1} focus="Cortar os vilões"
            actions={['Eliminar refrigerantes e sucos industrializados', 'Trocar pão branco por integral ou batata-doce', 'Parar com salgadinhos e ultraprocessados no intervalo', 'Beber 2 litros de água por dia']}
            expected="Possível piora momentânea nos primeiros dias (o corpo se ajustando). A partir do dia 5 a pele começa a reduzir o excesso de oleosidade."
          />
          <WeekCard
            week={2} focus="Adicionar os aliados"
            actions={['Incluir 1 porção de fruta vermelha por dia', 'Adicionar azeite de oliva nas refeições', 'Comer sardinha ou atum pelo menos 2× na semana', 'Incluir 1 punhado de castanhas/sementes diariamente']}
            expected="Pele começa a ficar menos inflamada. Possível redução de vermelhidão e oleosidade. Tom ligeiramente mais uniforme."
          />
        </div>
      </PdfContentPage>

      {/* ── Módulo 7 / Pág 2 — Semanas 3 e 4 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Módulo 7" title="O Teste de 30 Dias para a Pele">
        <div className="space-y-3">
          <WeekCard
            week={3} focus="Montar o prato ideal"
            actions={['Aplicar o modelo 50% vegetais / 25% proteína / 25% carboidrato complexo', 'Incluir proteína em todas as refeições', 'Adicionar cenoura, abóbora ou batata-doce diariamente', 'Tomar chá verde no lugar do café da tarde']}
            expected="Viço e luminosidade mais perceptíveis. Espinhas ativas diminuindo. Pele com aparência mais descansada."
          />
          <WeekCard
            week={4} focus="Consolidar e observar"
            actions={['Manter o padrão das semanas anteriores', 'Tirar fotos para comparar com o início', 'Avaliar: quais mudanças fizeram mais diferença?', 'Definir quais hábitos manter permanentemente']}
            expected="Resultados visíveis consolidados: tom mais uniforme, menos espinhas, mais viço, pele mais hidratada e com melhor textura."
          />
          <SectionTitle emoji="📊">Como avaliar o resultado</SectionTitle>
          <div className="flex flex-col gap-1.5">
            <BulletItem>Compare as fotos do dia 1 com o dia 30 com a mesma iluminação</BulletItem>
            <BulletItem>Observe: oleosidade, espinhas, viço, tom uniforme, textura</BulletItem>
            <BulletItem>Avalie como sua pele se sente ao toque — mais suave? Mais firme?</BulletItem>
            <BulletItem>Quais alimentos removidos fizeram mais diferença?</BulletItem>
            <BulletItem>Quais adicionados você percebeu mais impacto?</BulletItem>
          </div>
        </div>
      </PdfContentPage>

      {/* ── Conclusão */}
      <PdfContentPage accentGradient={ACCENT} kicker="Conclusão" title="A Pele Começa no Prato">
        <div className="flex flex-1 flex-col justify-center space-y-5">
          <div className="rounded-2xl p-6 text-center" style={{ background: C.lightBg }}>
            <div className="mb-4 text-[2.5rem] leading-none">🥗</div>
            <blockquote className="font-display text-[1.02rem] font-semibold leading-relaxed italic" style={{ color: C.darkColor }}>
              "Nenhum sérum do mundo compensa uma alimentação que inflama o corpo por dentro. A pele é o espelho do que você come — e quando você entende isso, começa a tratar a pele de dentro para fora. 30 dias de mudança real na alimentação fazem mais pela pele do que anos de produtos sem essa base."
            </blockquote>
          </div>
          <div className="rounded-xl p-4 space-y-2" style={{ background: 'white', border: `1px solid ${C.border}` }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: C.color }}>Os 3 pilares inegociáveis</div>
            {[
              'Menos açúcar e ultraprocessados — a maior mudança com mais impacto visível',
              'Mais proteína + vitamina C — base para produzir colágeno todos os dias',
              'Mais ômega-3 e azeite — anti-inflamatório que a pele sente em semanas',
            ].map((item) => (
              <div key={item} className="flex gap-2.5 text-[13px] leading-snug text-foreground/90">
                <span className="mt-[4px] font-bold shrink-0" style={{ color: C.color }}>✓</span>
                {item}
              </div>
            ))}
          </div>
          <div className="rounded-lg px-4 py-3 text-center" style={{ background: C.lightBg }}>
            <p className="text-[11.5px] leading-relaxed text-foreground/65">
              Este guia é informativo. Para condições específicas de pele ou dúvidas nutricionais, consulte sempre um dermatologista ou nutricionista habilitado.
            </p>
          </div>
        </div>
      </PdfContentPage>

      {/* ── Página final — Aviso Legal */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Aviso Legal"
        title="Informações importantes antes de começar"
        subtitle="Leia esta página com atenção. Ela garante que você aplique o conteúdo deste guia com segurança."
      >
        <div className="space-y-3">
          <InfoBox>
            <strong>Este material tem finalidade exclusivamente informativa e educativa.</strong> Não
            constitui consulta, diagnóstico, prescrição dietética ou tratamento, e não substitui o
            acompanhamento de um nutricionista, médico ou dermatologista.
          </InfoBox>

          <div className="rounded-xl p-4" style={{ background: 'hsl(38 85% 95%)', borderLeft: '3px solid hsl(38 80% 60%)' }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.15em] mb-1.5" style={{ color: 'hsl(38 60% 35%)' }}>
              Não interrompa nenhum tratamento por conta própria
            </div>
            <p className="text-[12.5px] leading-snug" style={{ color: 'hsl(38 40% 28%)' }}>
              As orientações deste guia são complementares. Nenhuma delas substitui medicamento,
              tratamento dermatológico ou plano alimentar prescrito por um profissional. Nunca
              suspenda ou altere uma prescrição sem falar com quem a indicou.
            </p>
          </div>

          <div className="rounded-xl p-4" style={{ background: 'white', border: `1px solid ${C.border}` }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: C.color }}>
              Consulte um profissional antes de aplicar este guia se você
            </div>
            <div className="flex flex-col gap-1.5">
              {[
                'Tem diabetes, resistência à insulina ou faz controle glicêmico — as orientações sobre carboidratos precisam ser individualizadas.',
                'Tem doença renal ou hepática — recomendações de proteína e suplementos exigem ajuste médico.',
                'Está grávida ou amamentando — as necessidades nutricionais são diferentes nesse período.',
                'Tem alergias ou intolerâncias alimentares — verifique cada item antes de incluir na rotina.',
                'Tem doença autoimune, tireoidiana ou gastrointestinal diagnosticada.',
                'Faz uso contínuo de medicamentos — alguns nutrientes e suplementos interagem com fármacos.',
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
                titulo: 'Sobre os suplementos citados',
                desc: 'São apresentados de forma informativa, com base na literatura disponível. Dose, necessidade real e duração devem ser definidas por um profissional — suplementar sem indicação pode ser inútil ou prejudicial.',
              },
              {
                titulo: 'Sobre o protocolo de 30 dias',
                desc: 'É uma sugestão de organização alimentar, não uma dieta prescrita. Não é indicado para quem tem histórico de transtorno alimentar, e não deve ser seguido de forma restritiva.',
              },
              {
                titulo: 'Sobre os resultados',
                desc: 'A resposta da pele à alimentação varia conforme genética, idade, saúde intestinal, hormônios e constância. Nenhum resultado específico é garantido dentro de qualquer prazo.',
              },
              {
                titulo: 'Procure um dermatologista se',
                desc: 'Sua condição de pele piora, não melhora em algumas semanas, ou vem acompanhada de dor, feridas, coceira intensa ou alterações súbitas. Nem toda alteração de pele tem origem alimentar.',
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
              guia, o leitor assume integral responsabilidade pela aplicação das orientações aqui
              descritas. Os autores e distribuidores não se responsabilizam por eventuais reações
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
