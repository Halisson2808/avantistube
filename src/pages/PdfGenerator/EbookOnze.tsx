/**
 * PDF 11 — Rota: /pdf/ebook-onze · Protocolo Detox Masculino
 * 14 dias para reprogramar o corpo com sucos funcionais masculinos
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';
import { DesignPage } from '@/components/ebook/DesignPage';

// ── Gradiente da faixa lateral — igual ao Sucos para Homens ───────────────
const ACCENT = 'linear-gradient(to bottom, hsl(18 72% 40%), hsl(24 68% 36%), hsl(12 65% 32%))';

// ── Tokens de cor ──────────────────────────────────────────────────────────
const C = {
  darkColor: 'hsl(18 65% 20%)',
  color:     'hsl(18 72% 40%)',
  lightBg:   'hsl(18 55% 93%)',
  border:    'hsl(18 50% 76%)',
};

// ── Cores por fase ─────────────────────────────────────────────────────────
const FASE = {
  1: { label: 'Fase 1 — Desinchaço',  color: 'hsl(155 55% 30%)' },
  2: { label: 'Fase 2 — Energia',     color: 'hsl(40 75% 42%)' },
  3: { label: 'Fase 3 — Performance', color: 'hsl(220 55% 45%)' },
} as const;

// ── Componentes auxiliares ─────────────────────────────────────────────────
function SectionTitle({ emoji, children }: { emoji?: string; children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2.5 border-b pb-2.5" style={{ borderColor: C.border }}>
      {emoji && <span className="text-[1.3rem] leading-none" aria-hidden>{emoji}</span>}
      <h3 className="font-display text-[1.18rem] font-semibold tracking-tight" style={{ color: C.darkColor }}>
        {children}
      </h3>
    </div>
  );
}

function CheckItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-[1px] shrink-0 text-[13px]" style={{ color: C.color }}>✓</span>
      <span className="text-[13px] leading-snug text-foreground/90">{children}</span>
    </div>
  );
}

function FaseCard({
  number, dias, title, color, desc, items,
}: {
  number: string; dias: string; title: string; color: string; desc: string; items: string[];
}) {
  return (
    <div className="flex-1 rounded-2xl p-4 flex flex-col gap-2" style={{ background: C.lightBg, border: `1.5px solid ${C.border}` }}>
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white" style={{ background: color }}>{number}</span>
        <div>
          <p className="text-[9.5px] font-bold uppercase tracking-widest" style={{ color }}>{dias}</p>
          <p className="text-[13px] font-bold leading-tight" style={{ color: C.darkColor }}>{title}</p>
        </div>
      </div>
      <p className="text-[12px] leading-snug text-foreground/80">{desc}</p>
      <div className="space-y-1 mt-1">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 text-[11.5px] text-foreground/80">
            <span style={{ color }} className="shrink-0">▸</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function RoutineBlock({ icon, period, action, suco }: { icon: string; period: string; action: string; suco: string }) {
  return (
    <div className="flex gap-3 rounded-xl p-3.5" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
      <span className="text-[1.5rem] leading-none shrink-0 pt-0.5">{icon}</span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: C.color }}>{period}</p>
        <p className="text-[12.5px] font-semibold text-foreground/90">{action}</p>
        <p className="text-[11.5px] text-foreground/65 mt-0.5">{suco}</p>
      </div>
    </div>
  );
}

// ── Tipos e helpers ─────────────────────────────────────────────────────────
type DayRecipe = { day: number; fase: 1 | 2 | 3; name: string; ingredients: string[]; preparo: string; porqueFunciona: string };
type Recipe    = { number: number; name: string; ingredients: string[]; preparo: string; porqueFunciona: string };

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// ── Card de receita do dia ─────────────────────────────────────────────────
function DayRecipeCard({ recipe }: { recipe: DayRecipe }) {
  const fase = FASE[recipe.fase];
  return (
    <div className="avoid-page-break flex-1 rounded-2xl p-4" style={{ background: 'white', border: `1.5px solid ${C.border}` }}>
      <div className="mb-3 flex items-center gap-3 border-b border-gray-100 pb-3">
        <span className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-full" style={{ background: C.color }}>
          <span className="text-[7.5px] font-bold uppercase text-white leading-none tracking-wider">DIA</span>
          <span className="text-[15px] font-black text-white leading-none">{recipe.day}</span>
        </span>
        <div className="flex-1 min-w-0">
          <span className="inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white mb-0.5" style={{ background: fase.color }}>
            {fase.label}
          </span>
          <h4 className="font-display text-[1.05rem] font-semibold leading-tight" style={{ color: C.darkColor }}>
            {recipe.name}
          </h4>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="rounded-xl px-4 py-3" style={{ background: C.lightBg }}>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: C.color }}>Ingredientes</div>
          <div className="space-y-1.5">
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2.5 text-[14px] leading-snug text-foreground/90">
                <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full" style={{ background: C.color }} aria-hidden />
                {ing}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: C.color }}>Modo de Preparo</div>
          <p className="text-[14px] leading-snug text-foreground/90">{recipe.preparo}</p>
        </div>
        <div className="rounded-xl px-4 py-3 leading-normal" style={{ background: C.lightBg, borderLeft: `3px solid ${C.border}` }}>
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: C.color }}>Por que funciona</div>
          <p className="text-[14px] leading-snug text-foreground/90">{recipe.porqueFunciona}</p>
        </div>
      </div>
    </div>
  );
}

// ── Card de receita extra ──────────────────────────────────────────────────
function LargeRecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="avoid-page-break flex-1 rounded-2xl p-4" style={{ background: 'white' }}>
      <div className="mb-3 flex items-center gap-3 border-b border-gray-100 pb-3">
        <span className="block h-8 w-8 shrink-0 rounded-full text-center text-[13px] font-bold leading-8 text-white" style={{ background: C.color }}>
          {recipe.number}
        </span>
        <h4 className="font-display text-[1.1rem] font-semibold leading-tight" style={{ color: C.darkColor }}>
          {recipe.name}
        </h4>
      </div>
      <div className="flex flex-col gap-3">
        <div className="rounded-xl px-4 py-3" style={{ background: C.lightBg }}>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: C.color }}>Ingredientes</div>
          <div className="space-y-1.5">
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2.5 text-[14px] leading-snug text-foreground/90">
                <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full" style={{ background: C.color }} aria-hidden />
                {ing}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: C.color }}>Modo de Preparo</div>
          <p className="text-[14px] leading-snug text-foreground/90">{recipe.preparo}</p>
        </div>
        <div className="rounded-xl px-4 py-3 leading-normal" style={{ background: C.lightBg, borderLeft: `3px solid ${C.border}` }}>
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: C.color }}>Por que funciona</div>
          <p className="text-[14px] leading-snug text-foreground/90">{recipe.porqueFunciona}</p>
        </div>
      </div>
    </div>
  );
}

// ── Receitas do Plano 14 Dias ──────────────────────────────────────────────
const planRecipes: DayRecipe[] = [
  // Fase 1
  { day: 1,  fase: 1, name: 'Reset Total',            ingredients: ['1 pepino médio', '1 maçã verde', '1 limão (suco)', '1 pedaço de gengibre (2cm)', '200ml de água'],                         preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado em jejum.',                                                         porqueFunciona: 'Pepino e maçã verde alcalinizam o sangue e ativam o fígado para iniciar a limpeza. O gengibre estimula a circulação e o limão acelera a eliminação de toxinas acumuladas. É o suco de abertura ideal — prepara o organismo para os próximos 13 dias.' },
  { day: 2,  fase: 1, name: 'Fígado Ativado',         ingredients: ['1 beterraba pequena', '1 maçã verde', '1 limão (suco)', '1 pedaço de gengibre (1cm)', '200ml de água'],                   preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.',                                                                   porqueFunciona: 'A beterraba estimula a produção de bile, fluido que o fígado usa para eliminar toxinas e metabolizar hormônios. Um fígado limpo é essencial para a produção de testosterona — hormônio que é sintetizado e regulado pelo fígado.' },
  { day: 3,  fase: 1, name: 'Anti-Inflamatório Interno', ingredients: ['2 fatias de abacaxi', '1 pedaço de gengibre (2cm)', '1 pitada de cúrcuma', '1 limão (suco)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.',                                                                         porqueFunciona: 'Abacaxi, gengibre e cúrcuma são os três anti-inflamatórios naturais mais estudados pela ciência. A inflamação crônica de baixo grau reduz a testosterona, prejudica o sono e trava a recuperação muscular. Esse suco ataca diretamente essa causa raiz.' },
  { day: 4,  fase: 1, name: 'Intestino Limpo',        ingredients: ['2 fatias de mamão', '1 colher de sopa de linhaça', '1 limão (suco)', '1 pedaço de gengibre (1cm)', '200ml de água morna'], preparo: 'Bata tudo no liquidificador e tome morno em jejum.',                                                                      porqueFunciona: 'O intestino inflamado bloqueia a absorção de zinco e magnésio — dois minerais diretamente ligados à produção de testosterona. A papaína do mamão e as fibras da linhaça limpam o intestino de forma profunda, melhorando a absorção de todos os nutrientes que vêm a seguir.' },
  { day: 5,  fase: 1, name: 'Purificação Final',      ingredients: ['2 folhas de couve', '1 pepino médio', '1 maçã verde', '1 limão (suco)', '200ml de água de coco'],                          preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.',                                                                   porqueFunciona: 'A couve tem clorofila que purifica o sangue e elimina metais pesados que interferem na produção hormonal. Com pepino diurético e água de coco mineralizante, esse suco fecha a fase de limpeza deixando o organismo pronto para absorver os nutrientes das fases seguintes.' },
  // Fase 2
  { day: 6,  fase: 2, name: 'Óxido Nítrico',         ingredients: ['1 beterraba pequena', '1 laranja (suco)', '1 pedaço de gengibre (2cm)', '200ml de água de coco'],                           preparo: 'Bata tudo no liquidificador, coe e sirva gelado 30 minutos antes do treino.',                                            porqueFunciona: 'A beterraba é a fonte natural mais rica em nitratos, que o corpo converte em óxido nítrico. O óxido nítrico dilata os vasos sanguíneos, aumenta o fluxo de oxigênio para os músculos e melhora o desempenho físico em até 16% — comprovado em estudos com atletas.' },
  { day: 7,  fase: 2, name: 'Termogênico Natural',   ingredients: ['1 laranja (suco)', '1 pedaço de gengibre (3cm)', '1 pitada de pimenta caiena', '1 colher de mel', '200ml de água morna'],   preparo: 'Misture tudo e tome como shot 20 minutos antes do treino ou pela manhã em jejum.',                                        porqueFunciona: 'Gengibre e pimenta caiena aumentam a temperatura corporal e ativam o metabolismo por até 3 horas após o consumo. Esse efeito termogênico acelera a queima de gordura e aumenta a energia disponível para o treino sem os picos e quedas da cafeína.' },
  { day: 8,  fase: 2, name: 'Resistência Máxima',    ingredients: ['1 beterraba pequena', '1 cenoura média', '1 maçã', '1 limão (suco)', '200ml de água'],                                       preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.',                                                                   porqueFunciona: 'Combinação de nitratos da beterraba, betacaroteno da cenoura e vitamina C da maçã que juntos melhoram a oxigenação muscular e reduzem o consumo de oxigênio durante esforço físico intenso. O resultado direto é aguentar mais tempo treinando antes de sentir fadiga.' },
  { day: 9,  fase: 2, name: 'Foco e Clareza',        ingredients: ['1 xícara de mirtilo ou amora', '1 maçã', '1 colher de sopa de nozes picadas', '200ml de água'],                             preparo: 'Bata tudo no liquidificador, coe e sirva gelado.',                                                                       porqueFunciona: 'As antocianinas do mirtilo atravessam a barreira hematoencefálica e nutrem diretamente os neurônios. O ômega-3 das nozes melhora a transmissão dos sinais nervosos. Resultado: foco aguçado, memória mais rápida e clareza mental que impacta tanto no treino quanto no trabalho.' },
  { day: 10, fase: 2, name: 'Recuperação Total',     ingredients: ['2 fatias de abacaxi', '1 banana', '1 pedaço de gengibre (1cm)', '200ml de água de coco'],                                   preparo: 'Bata tudo no liquidificador e sirva gelado imediatamente após o treino.',                                                 porqueFunciona: 'A bromelina do abacaxi reduz a inflamação muscular pós-treino em até 50%. A banana repõe o potássio perdido no suor e a água de coco reidrata com eletrólitos naturais. Esse suco tomado nos 30 minutos após o treino acelera a recuperação e reduz a dor muscular no dia seguinte.' },
  // Fase 3
  { day: 11, fase: 3, name: 'Zinco e Testosterona',  ingredients: ['1 romã (suco)', '1 colher de sopa de semente de abóbora', '1 colher de chá de mel', '200ml de água de coco'],               preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado em jejum.',                                                          porqueFunciona: 'A romã tem compostos que aumentam diretamente os níveis de testosterona livre no sangue — estudos mostram aumento de até 24% após consumo regular. A semente de abóbora é a fonte vegetal mais rica em zinco, mineral que o corpo usa como matéria-prima para sintetizar testosterona.' },
  { day: 12, fase: 3, name: 'Hormônio em Alta',      ingredients: ['1 xícara de espinafre', '1 maçã verde', '1 limão (suco)', '1 colher de sopa de semente de abóbora', '200ml de água'],       preparo: 'Bata tudo no liquidificador, coe e sirva gelado em jejum.',                                                              porqueFunciona: 'O espinafre tem magnésio que aumenta a testosterona livre no sangue ao reduzir a globulina que a prende e a inativa. Com zinco da semente de abóbora, essa combinação apoia a produção hormonal masculina nas duas frentes mais importantes: síntese e biodisponibilidade.' },
  { day: 13, fase: 3, name: 'Circulação e Vitalidade', ingredients: ['1 beterraba pequena', '1 romã (suco)', '1 limão (suco)', '1 colher de mel', '200ml de água de coco'],                     preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.',                                                                   porqueFunciona: 'Beterraba e romã são as duas frutas com maior impacto comprovado na circulação periférica masculina. O aumento do fluxo sanguíneo melhora a vitalidade, a disposição e impacta diretamente na libido. É o suco de maior efeito direto na saúde sexual masculina deste protocolo.' },
  { day: 14, fase: 3, name: 'Poder Total Masculino', ingredients: ['1 beterraba pequena', '1 romã (suco)', '1 colher de sopa de semente de abóbora', '1 pedaço de gengibre (1cm)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado em jejum.',                                                   porqueFunciona: 'O suco mais completo do protocolo. Beterraba e romã maximizam a circulação e o óxido nítrico, a semente de abóbora fornece zinco para produção de testosterona e o gengibre potencializa a absorção de todos os compostos ativos. É o encerramento ideal de 14 dias de transformação masculina.' },
];

// ── Receitas de Suporte (40 receitas) ──────────────────────────────────────
const supportRecipes: Recipe[] = [
  { number: 1,  name: 'Shot do Guerreiro',        ingredients: ['1 pedaço de gengibre (3cm)', '2 dentes de alho', '1 limão (suco)', '1 colher de mel', '200ml de água morna'],                            preparo: 'Bata tudo no liquidificador, coe bem e tome como shot pela manhã em jejum.',                               porqueFunciona: 'Gengibre e alho têm compostos antibacterianos e antivirais que fortalecem o sistema imunológico. Esse shot aumenta a disposição, reduz o cansaço pós-treino e mantém as defesas em alta durante rotinas intensas.' },
  { number: 2,  name: 'Energia Explosiva',        ingredients: ['1 beterraba pequena', '1 laranja (suco)', '1 cenoura média', '200ml de água de coco'],                                                    preparo: 'Bata tudo no liquidificador, coe e sirva gelado.',                                                         porqueFunciona: 'A beterraba aumenta o óxido nítrico que melhora o fluxo de oxigênio para os músculos. Com cenoura e laranja, esse suco combate o cansaço e entrega energia duradoura sem picos de açúcar.' },
  { number: 3,  name: 'Construtor Muscular',      ingredients: ['1 banana', '1 colher de sopa de pasta de amendoim natural', '1 colher de sopa de aveia', '200ml de leite', '1 colher de chá de mel'],    preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.',                                             porqueFunciona: 'Combinação rica em proteínas, carboidratos e gorduras saudáveis que o músculo precisa para crescer. Ideal após o treino para acelerar a recuperação e o ganho de massa muscular.' },
  { number: 4,  name: 'Circulação Máxima',        ingredients: ['1 beterraba pequena', '1 romã (suco)', '1 limão (suco)', '200ml de água'],                                                                preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.',                                                     porqueFunciona: 'Beterraba e romã são as duas frutas mais estudadas para melhora da circulação masculina. Aumentam o fluxo sanguíneo periférico, impactando diretamente na vitalidade e disposição.' },
  { number: 5,  name: 'Zinco Power',              ingredients: ['1 colher de sopa de semente de abóbora', '1 maçã', '1 colher de chá de mel', '200ml de leite vegetal'],                                  preparo: 'Bata tudo no liquidificador até ficar homogêneo. Sirva gelado.',                                           porqueFunciona: 'A semente de abóbora é uma das fontes mais ricas de zinco, mineral essencial para a produção de testosterona e saúde da próstata. Consumida regularmente, apoia a saúde hormonal masculina de forma natural.' },
  { number: 6,  name: 'Libido Ativo',             ingredients: ['1 romã (suco)', '1 beterraba pequena', '1 colher de chá de mel', '200ml de água de coco'],                                                preparo: 'Bata tudo no liquidificador, coe e sirva gelado.',                                                         porqueFunciona: 'Romã e beterraba aumentam a produção de óxido nítrico, que melhora a circulação periférica e a vitalidade masculina. Uma das combinações mais eficazes para apoiar a libido de forma natural.' },
  { number: 7,  name: 'Massa Magra',              ingredients: ['1 banana', '1 colher de sopa de aveia', '1 colher de sopa de pasta de amendoim', '1 colher de sopa de cacau em pó puro', '200ml de leite'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.',                                            porqueFunciona: 'O cacau puro tem flavonoides que melhoram a circulação muscular. Com aveia, banana e amendoim, esse shake fornece calorias de qualidade para ganho de massa magra sem acumular gordura.' },
  { number: 8,  name: 'Imunidade Masculina',      ingredients: ['2 laranjas (suco)', '1 limão (suco)', '1 pedaço de gengibre (2cm)', '1 colher de mel', '200ml de água'],                                  preparo: 'Misture os sucos com a água, bata o gengibre e coe. Sirva gelado.',                                        porqueFunciona: 'Vitamina C em alta concentração combinada com o poder antibacteriano do gengibre. Fortalece as defesas do organismo e reduz o tempo de recuperação em resfriados e gripes.' },
  { number: 9,  name: 'Sono Reparador',           ingredients: ['1 banana', '1 xícara de cereja', '200ml de leite morno', '1 colher de chá de mel'],                                                       preparo: 'Bata tudo no liquidificador. Tome morno 30 minutos antes de dormir.',                                      porqueFunciona: 'A maior parte da testosterona é produzida durante o sono profundo. Cereja com melatonina natural e banana com triptofano garantem um sono reparador, maximizando a produção hormonal noturna.' },
  { number: 10, name: 'Força Total',              ingredients: ['1 banana', '1 xícara de espinafre', '1 colher de sopa de aveia', '200ml de leite', '1 colher de chá de mel'],                            preparo: 'Bata tudo no liquidificador até ficar homogêneo. Sirva gelado.',                                           porqueFunciona: 'O espinafre tem nitratos e ferro que aumentam a força e a resistência muscular. Com banana e aveia, esse shake sustenta a energia durante treinos longos e reduz a fadiga muscular.' },
  { number: 11, name: 'Detox Hepático',           ingredients: ['1 maçã verde', '2 talos de aipo', '1 pepino médio', '1 limão (suco)', '200ml de água'],                                                   preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.',                                                     porqueFunciona: 'Aipo e pepino são diuréticos naturais que eliminam toxinas pelos rins. Com maçã verde e limão, esse suco purifica o fígado e melhora a absorção de nutrientes essenciais para o metabolismo hormonal.' },
  { number: 12, name: 'Pré-Treino Verde',         ingredients: ['1 xícara de espinafre', '1 maçã', '1 limão (suco)', '1 pedaço de gengibre (1cm)', '200ml de água de coco'],                              preparo: 'Bata tudo no liquidificador, coe e sirva gelado 30 minutos antes do treino.',                              porqueFunciona: 'O espinafre tem nitratos naturais que melhoram a eficiência muscular. Com gengibre termogênico e água de coco mineralizante, esse suco é um pré-treino completo que melhora o desempenho sem sobrecarregar o organismo.' },
  { number: 13, name: 'Hormônio em Alta',         ingredients: ['1 colher de sopa de semente de abóbora', '1 colher de sopa de semente de girassol', '1 banana', '200ml de leite vegetal', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador até ficar homogêneo. Sirva gelado.',                                porqueFunciona: 'Sementes de abóbora e girassol são ricas em zinco, selênio e vitamina E, três nutrientes essenciais para a produção de testosterona. Apoia o equilíbrio hormonal masculino de forma contínua e natural.' },
  { number: 14, name: 'Coração Forte',            ingredients: ['1 xícara de uva roxa', '1 maçã', '1 colher de chá de mel', '200ml de água de coco'],                                                     preparo: 'Bata tudo no liquidificador, coe e sirva gelado.',                                                         porqueFunciona: 'A uva roxa tem resveratrol que protege o coração e melhora a circulação. Homens têm maior risco cardiovascular e esse suco reduz o colesterol ruim e fortalece as artérias de forma natural.' },
  { number: 15, name: 'Explosão Anabólica',       ingredients: ['1 banana', '1 colher de sopa de aveia', '1 colher de sopa de pasta de amendoim', '1 ovo (apenas a clara)', '200ml de leite'],            preparo: 'Bata tudo no liquidificador até ficar homogêneo. Sirva gelado.',                                           porqueFunciona: 'A clara de ovo fornece proteína de alta qualidade sem gordura. Com aveia e amendoim, esse shake tem o perfil nutricional ideal para síntese proteica e crescimento muscular após treinos intensos.' },
  { number: 16, name: 'Stamina Máxima',           ingredients: ['1 beterraba pequena', '1 maçã', '1 cenoura média', '1 pedaço de gengibre (1cm)', '200ml de água'],                                       preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.',                                                     porqueFunciona: 'A beterraba dilata os vasos e melhora a entrega de oxigênio aos músculos. Com cenoura e gengibre, esse suco aumenta o stamina e a resistência em qualquer atividade física, permitindo treinar por mais tempo.' },
  { number: 17, name: 'Foco e Clareza',           ingredients: ['1 xícara de mirtilo ou amora', '1 colher de sopa de nozes picadas', '200ml de leite vegetal', '1 colher de chá de mel'],                 preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.',                                             porqueFunciona: 'As nozes têm ômega-3 que nutre o cérebro e melhora o foco. Com mirtilo rico em antioxidantes, esse shake é ideal para homens que precisam de desempenho mental além do físico.' },
  { number: 18, name: 'Próstata Saudável',        ingredients: ['1 colher de sopa de semente de abóbora', '1 tomate médio', '1 limão (suco)', '200ml de água'],                                            preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.',                                                     porqueFunciona: 'O tomate tem licopeno, antioxidante comprovadamente eficaz na proteção da próstata. Com semente de abóbora rica em zinco, esse suco cuida da saúde masculina preventiva de forma simples e diária.' },
  { number: 19, name: 'Recuperação Rápida',       ingredients: ['2 fatias de abacaxi', '1 banana', '1 pedaço de gengibre (1cm)', '200ml de água de coco'],                                                preparo: 'Bata tudo no liquidificador e sirva gelado logo após o treino.',                                           porqueFunciona: 'A bromelina do abacaxi reduz a inflamação muscular pós-treino. Com banana que repõe potássio e água de coco que reidrata com eletrólitos naturais, esse suco acelera a recuperação e reduz a dor muscular.' },
  { number: 20, name: 'Memória e Foco',           ingredients: ['1 xícara de mirtilo', '1 maçã', '1 colher de sopa de nozes', '200ml de água'],                                                            preparo: 'Bata tudo no liquidificador, coe e sirva gelado.',                                                         porqueFunciona: 'Mirtilo e nozes são os alimentos mais estudados para saúde cerebral masculina. Ômega-3 e antocianinas protegem os neurônios, melhoram a memória e o foco em atividades profissionais e esportivas.' },
  { number: 21, name: 'Detox Verde Profundo',     ingredients: ['2 folhas de couve', '1 pepino médio', '1 maçã verde', '1 limão (suco)', '200ml de água'],                                                 preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.',                                                     porqueFunciona: 'Couve e pepino têm clorofila que purifica o sangue e elimina metais pesados que interferem na produção hormonal. Com maçã verde e limão, esse suco realiza uma limpeza profunda e alcaliniza o organismo.' },
  { number: 22, name: 'Ossos e Articulações',     ingredients: ['200ml de leite', '1 colher de sopa de gergelim', '1 banana', '1 colher de chá de mel', '1 pitada de canela'],                            preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.',                                             porqueFunciona: 'O gergelim tem cálcio e magnésio que fortalecem os ossos e protegem as articulações de lesões durante treinos pesados. Essencial para homens que praticam musculação ou esportes de impacto regularmente.' },
  { number: 23, name: 'Superação do Cansaço',     ingredients: ['1 laranja (suco)', '1 cenoura média', '1 pedaço de gengibre (2cm)', '1 pitada de pimenta caiena', '200ml de água'],                     preparo: 'Bata tudo no liquidificador, coe e sirva gelado.',                                                         porqueFunciona: 'Gengibre e pimenta caiena ativam a circulação e aumentam a temperatura corporal, combatendo o cansaço físico e mental. Ideal para homens com rotina intensa que precisam de energia sem depender de cafeína.' },
  { number: 24, name: 'Ganho Seco',               ingredients: ['1 banana', '1 colher de sopa de aveia', '1 colher de chá de cacau em pó puro', '200ml de leite vegetal', '1 colher de chá de mel'],     preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.',                                             porqueFunciona: 'Esse shake fornece calorias de qualidade sem gordura excessiva. O cacau melhora a circulação muscular e a aveia sustenta a energia. Ideal para quem quer ganhar massa sem aumentar o percentual de gordura.' },
  { number: 25, name: 'Testosterona Verde',       ingredients: ['1 xícara de espinafre', '1 maçã verde', '1 limão (suco)', '1 colher de sopa de semente de abóbora', '200ml de água'],                   preparo: 'Bata tudo no liquidificador, coe e sirva gelado.',                                                         porqueFunciona: 'O espinafre tem magnésio que aumenta a testosterona livre no sangue. Com semente de abóbora rica em zinco, esse suco apoia a produção hormonal masculina nas duas frentes mais importantes.' },
  { number: 26, name: 'Anti-Stress Masculino',    ingredients: ['1 maracujá (polpa)', '1 banana', '1 colher de chá de mel', '200ml de leite vegetal'],                                                    preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado ou em temperatura ambiente.',                  porqueFunciona: 'O estresse crônico eleva o cortisol que é o antagonista direto da testosterona. O maracujá tem flavonoides que reduzem o cortisol naturalmente. Com banana rica em triptofano, esse suco quebra o ciclo estresse-queda hormonal.' },
  { number: 27, name: 'Hidratação Máxima',        ingredients: ['2 fatias de melancia', '1 pepino médio', '1 limão (suco)', '200ml de água de coco'],                                                     preparo: 'Bata tudo no liquidificador, coe e sirva bem gelado.',                                                     porqueFunciona: 'Melancia e pepino têm mais de 95% de água e são ricos em eletrólitos naturais. A desidratação leve já é suficiente para reduzir a performance física e a produção hormonal. Esse suco restaura o equilíbrio hídrico rapidamente.' },
  { number: 28, name: 'Protetor Cardiovascular',  ingredients: ['1 xícara de romã (suco ou grãos)', '1 maçã', '1 colher de chá de mel', '200ml de água'],                                                 preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.',                                                     porqueFunciona: 'A romã tem três vezes mais antioxidantes que o vinho tinto e reduz comprovadamente a pressão arterial. Protege as artérias, melhora a circulação e apoia a saúde cardiovascular de longo prazo.' },
  { number: 29, name: 'Muralha Dourada',          ingredients: ['200ml de leite vegetal', '1 colher de chá de cúrcuma', '1 colher de chá de mel', '1 pitada de pimenta-do-reino', '1 pedaço de gengibre (1cm)'], preparo: 'Aqueça o leite, adicione os demais ingredientes e misture bem. Tome morno.',                          porqueFunciona: 'Cúrcuma com pimenta-do-reino é uma das combinações anti-inflamatórias mais estudadas da ciência. Fortalece a imunidade, reduz inflamações crônicas e protege as células do envelhecimento precoce.' },
  { number: 30, name: 'Vitalidade Total',         ingredients: ['1 beterraba pequena', '1 romã (suco)', '1 maçã', '200ml de água de coco'],                                                                preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.',                                                     porqueFunciona: 'Beterraba e romã são duas das combinações mais ricas em antioxidantes e compostos que melhoram a circulação. Esse suco aumenta a energia, melhora o humor e protege o coração de forma contínua.' },
  { number: 31, name: 'Equilíbrio Hormonal',      ingredients: ['1 xícara de espinafre', '1 banana', '1 colher de sopa de linhaça dourada', '200ml de leite vegetal'],                                    preparo: 'Bata tudo no liquidificador até ficar homogêneo. Sirva gelado.',                                           porqueFunciona: 'A linhaça tem lignanas que equilibram os hormônios e o espinafre fornece magnésio que aumenta a testosterona biodisponível. Combinação ideal para homens que sentem queda de energia e disposição sem causa aparente.' },
  { number: 32, name: 'Defesa Cítrica',           ingredients: ['2 laranjas (suco)', '1 limão (suco)', '1 colher de chá de cúrcuma', '1 colher de mel', '200ml de água'],                                 preparo: 'Esprema as frutas, misture com a água, cúrcuma e mel. Sirva gelado.',                                      porqueFunciona: 'Vitamina C e curcumina atuam em conjunto para fortalecer as defesas do organismo. Esse suco cítrico com cúrcuma previne inflamações e infecções que comprometem o rendimento físico e mental.' },
  { number: 33, name: 'Digestão Masculina',       ingredients: ['2 fatias de abacaxi', '1 pedaço de gengibre (1cm)', '1 limão (suco)', '200ml de água de coco'],                                          preparo: 'Bata tudo no liquidificador, coe e sirva gelado.',                                                         porqueFunciona: 'A bromelina do abacaxi quebra proteínas e melhora a absorção de aminoácidos essenciais para a síntese muscular. Com gengibre que reduz o inchaço, esse suco otimiza a digestão e a absorção de nutrientes do protocolo.' },
  { number: 34, name: 'Renascimento Celular',     ingredients: ['1 xícara de morango', '1 kiwi', '1 laranja (suco)', '200ml de água'],                                                                     preparo: 'Bata tudo no liquidificador, coe e sirva gelado.',                                                         porqueFunciona: 'Morango, kiwi e laranja formam uma das combinações mais ricas em vitamina C. Esse nutriente é essencial para a produção de colágeno que mantém pele, articulações e vasos sanguíneos jovens e funcionais.' },
  { number: 35, name: 'Shot Termogênico',         ingredients: ['1 pedaço de gengibre (3cm)', '1 pitada de pimenta caiena', '1 limão (suco)', '1 colher de mel', '100ml de água morna'],                  preparo: 'Misture tudo e tome como shot em jejum ou antes do treino.',                                               porqueFunciona: 'Gengibre e pimenta caiena aumentam a temperatura corporal e o metabolismo por até 3 horas. Esse shot termogênico acelera a queima de gordura e aumenta a energia disponível sem os efeitos colaterais de pré-treinos industrializados.' },
  { number: 36, name: 'Purificador Noturno',      ingredients: ['1 pepino médio', '1 limão (suco)', '2 folhas de hortelã', '1 colher de chá de mel', '200ml de água'],                                    preparo: 'Bata tudo no liquidificador, coe e tome antes de dormir.',                                                 porqueFunciona: 'O fígado realiza a maior parte da desintoxicação durante a noite. Pepino e limão tomados antes de dormir potencializam esse processo natural, preparando o organismo para acordar mais leve e com mais energia.' },
  { number: 37, name: 'Vitamina da Força',        ingredients: ['1 banana', '1 xícara de morango', '1 colher de sopa de aveia', '200ml de leite', '1 colher de chá de mel'],                              preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.',                                             porqueFunciona: 'Banana e morango fornecem energia rápida e antioxidantes que combatem o cansaço. Rico em potássio, vitamina C e carboidratos de qualidade, esse shake é ideal como lanche entre refeições para manter o anabolismo ativo.' },
  { number: 38, name: 'Raízes e Força',           ingredients: ['1 beterraba pequena', '1 cenoura média', '1 pedaço de gengibre (1cm)', '1 laranja (suco)', '200ml de água'],                             preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.',                                                     porqueFunciona: 'Beterraba e cenoura são raízes ricas em minerais essenciais para energia e imunidade. Com gengibre e laranja, esse suco robustece o organismo e melhora o desempenho físico e mental do dia a dia.' },
  { number: 39, name: 'Elixir do Atleta',         ingredients: ['1 beterraba pequena', '1 maçã', '1 cenoura média', '1 limão (suco)', '200ml de água de coco'],                                           preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.',                                                     porqueFunciona: 'Combinação completa de nitratos, betacaroteno, vitamina C e eletrólitos. Esse suco cobre as principais necessidades do atleta — energia, oxigenação, recuperação e hidratação — em um único copo.' },
  { number: 40, name: 'Poder Total',              ingredients: ['1 beterraba pequena', '1 romã (suco)', '1 colher de sopa de semente de abóbora', '1 pedaço de gengibre (1cm)', '1 limão (suco)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.',                                porqueFunciona: 'O suco mais completo do banco de receitas. Beterraba e romã para circulação e vitalidade, semente de abóbora para testosterona, gengibre anti-inflamatório e limão detox. Tudo que o organismo masculino precisa em um único copo.' },
];

// ── Dados do Bônus: Erros que Travam o Corpo ──────────────────────────────
type Erro = { number: number; title: string; desc: string; fix: string };

const erros: Erro[] = [
  { number: 1, title: 'Beber pouca água',                      desc: 'O corpo masculino precisa de pelo menos 2,5 litros de água por dia para funcionar bem. Sem isso, o fígado não consegue eliminar as toxinas que processa, os rins trabalham com eficiência reduzida e os músculos perdem força e volume — porque músculo é 75% água.',                                                                                                                                     fix: 'Comece o dia com 1 copo de água morna com limão antes de qualquer suco. Mantenha uma garrafa visível durante o dia. Se a urina estiver amarela escura, você está desidratado.' },
  { number: 2, title: 'Dormir menos de 7 horas',               desc: 'A testosterona é produzida quase que exclusivamente durante o sono profundo. Estudos mostram que dormir menos de 6 horas por apenas uma semana reduz os níveis de testosterona em até 15% — o equivalente a envelhecer 10 anos hormonalmente. Nenhum suco compensa isso se o sono não estiver em ordem.',                                                                                             fix: 'Priorize 7 a 9 horas de sono. Tome o Suco Sono Reparador do protocolo 30 minutos antes de deitar. Desligue telas pelo menos 20 minutos antes de dormir — a luz azul bloqueia a produção de melatonina.' },
  { number: 3, title: 'Comer ultraprocessado após os sucos',   desc: 'Tomar um suco detox e em seguida comer um produto cheio de conservantes, corantes e açúcar refinado é como lavar a louça com sabão e depois sujar tudo de novo. Os ultraprocessados inflamam o intestino, sobrecarregam o fígado e bloqueiam a absorção dos nutrientes dos sucos.',                                                                                                                  fix: 'Não precisa ser perfeito. Mas tente manter pelo menos 1 hora entre o suco e qualquer alimento industrializado. Prefira alimentos com menos de 5 ingredientes no rótulo.' },
  { number: 4, title: 'Pular o café da manhã ou comer tarde',  desc: 'O metabolismo masculino é altamente sensível ao horário das refeições. Pular o café da manhã eleva o cortisol — hormônio do estresse que é o antagonista direto da testosterona. Comer tarde da noite sobrecarrega o fígado justamente no período em que ele deveria estar focado na desintoxicação.',                                                                                               fix: 'Tome o suco do protocolo em jejum e faça o café da manhã até 30 a 60 minutos depois. Tente jantar pelo menos 2 horas antes de dormir.' },
  { number: 5, title: 'Estresse sem válvula de escape',        desc: 'O cortisol crônico — produzido pelo estresse constante sem recuperação — destrói testosterona, acumula gordura abdominal, inflama o intestino e prejudica o sono. É um ciclo que se auto-alimenta e que nenhuma dieta consegue quebrar sozinha.',                                                                                                                                                     fix: '10 minutos de caminhada ao ar livre já reduzem o cortisol significativamente. Combine com o Suco Anti-Stress do banco de receitas. Uma pausa de 5 minutos de respiração profunda no meio do dia faz diferença real.' },
  { number: 6, title: 'Treinar sem recuperação adequada',      desc: 'Muitos homens treinam forte todos os dias achando que mais é melhor. Não é. O músculo não cresce durante o treino — cresce durante o descanso. Sem recuperação adequada, o corpo entra em estado catabólico: destrói músculo para usar como energia e eleva o cortisol.',                                                                                                                               fix: 'Respeite pelo menos 48 horas de descanso por grupo muscular. Tome o suco de Recuperação Rápida ou o Construtor Muscular nos dias de treino intenso. Sono profundo é o melhor suplemento de recuperação que existe.' },
  { number: 7, title: 'Excesso de cafeína no período da tarde', desc: 'O café é aliado quando consumido certo. O problema é quando vira muleta para compensar sono ruim e estresse — especialmente após as 14h. A cafeína tem meia-vida de 6 a 8 horas no organismo, o que significa que um café às 15h ainda está ativo no seu sangue à meia-noite, prejudicando o sono profundo onde a testosterona é produzida.',                                                          fix: 'Limite o café a 1 ou 2 xícaras pela manhã. Substitua o café da tarde pelo Shot Termogênico ou pelo Suco de Foco e Clareza do banco de receitas. Você terá energia sem comprometer o sono.' },
  { number: 8, title: 'Ignorar os sinais do corpo',            desc: 'Dor de cabeça frequente, cansaço após comer, inchaço constante, queda de libido sem motivo aparente — esses não são sinais de envelhecimento normal. São avisos de que algo está fora do equilíbrio. A maioria dos homens ignora esses sinais por meses ou anos até que virem problemas maiores.',                                                                                                      fix: 'Use este protocolo como uma ferramenta de escuta do seu próprio corpo. Observe como você se sente no Dia 3, no Dia 7, no Dia 14. Anote as mudanças. Quanto mais você presta atenção, mais rápido aprende a corrigir o que está fora do lugar.' },
];

// ── Card de erro ───────────────────────────────────────────────────────────
function ErrorCard({ erro }: { erro: Erro }) {
  return (
    <div className="avoid-page-break rounded-2xl overflow-hidden" style={{ border: `1.5px solid ${C.border}` }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ background: C.lightBg }}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-black text-white" style={{ background: C.color }}>
          {erro.number}
        </span>
        <div>
          <p className="text-[9.5px] font-bold uppercase tracking-widest mb-0.5" style={{ color: C.color }}>Erro {erro.number}</p>
          <h4 className="font-display text-[1rem] font-semibold leading-tight" style={{ color: C.darkColor }}>{erro.title}</h4>
        </div>
      </div>
      {/* Body */}
      <div className="bg-white px-4 py-3 flex flex-col gap-2.5">
        <p className="text-[13px] leading-snug text-foreground/85">{erro.desc}</p>
        <div className="rounded-lg px-3.5 py-2.5" style={{ background: C.lightBg, borderLeft: `3px solid ${C.color}` }}>
          <span className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: C.color }}>Como corrigir: </span>
          <span className="text-[13px] leading-snug text-foreground/85">{erro.fix}</span>
        </div>
      </div>
    </div>
  );
}

// ── Divider: Bônus ─────────────────────────────────────────────────────────
function BonusSectionDivider() {
  const darkBg   = 'hsl(18 70% 8%)';
  const midBg    = 'hsl(18 60% 12%)';
  const accentCol = C.color;

  return (
    <DesignPage bg={darkBg}>
      <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: `linear-gradient(to right, transparent, ${accentCol}, transparent)` }} />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-14 text-center">
        <p className="mb-4 text-[10.5px] font-bold uppercase tracking-[0.45em]" style={{ color: accentCol }}>
          Protocolo Detox Masculino
        </p>

        <h1 className="font-display leading-none tracking-tighter text-white">
          <span className="block text-[2rem] font-semibold opacity-70">BÔNUS</span>
          <span className="block text-[2.6rem] font-black" style={{ color: accentCol }}>GUIA DE ERROS</span>
          <span className="block text-[1.5rem] font-semibold opacity-70 mt-1">QUE TRAVAM O CORPO</span>
        </h1>

        <div className="my-6 h-[1.5px] w-20" style={{ background: accentCol }} />

        <div className="max-w-sm rounded-2xl px-6 py-4 text-left" style={{ background: midBg, border: `1px solid ${accentCol}30` }}>
          <p className="text-[12.5px] leading-relaxed text-white/70">
            O que você está fazendo <span className="font-semibold" style={{ color: accentCol }}>sem perceber</span> que mantém seu corpo inchado, cansado e sem energia — mesmo quando você está fazendo o resto certo.
          </p>
        </div>

        <p className="mt-6 text-[11px] text-white/35 uppercase tracking-widest">8 erros · correções práticas</p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[4px]" style={{ background: `linear-gradient(to right, transparent, ${accentCol}, transparent)` }} />
    </DesignPage>
  );
}

// ── Capa ───────────────────────────────────────────────────────────────────
function Cover() {
  return (
    <section
      className="relative h-[297mm] w-full overflow-hidden page-break-after print:shadow-none"
      style={{
        backgroundImage: 'url(/Protocolo-Detox-Masculino.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}

// ── Divider: Plano 14 Dias ─────────────────────────────────────────────────
function PlanoSectionDivider() {
  const darkBg = 'hsl(18 70% 8%)';
  const midBg  = 'hsl(18 60% 12%)';
  const accentCol = C.color;

  return (
    <DesignPage bg={darkBg}>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: `linear-gradient(to right, transparent, ${accentCol}, transparent)` }} />

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-14 text-center">
        <p className="mb-4 text-[10.5px] font-bold uppercase tracking-[0.45em]" style={{ color: accentCol }}>
          Protocolo Detox Masculino
        </p>

        <h1 className="font-display leading-none tracking-tighter text-white">
          <span className="block text-[2rem] font-semibold opacity-70">PLANO</span>
          <span className="block text-[5rem] font-black" style={{ WebkitTextStroke: `1px ${accentCol}`, color: 'white' }}>14</span>
          <span className="block text-[2.6rem] font-black" style={{ color: accentCol }}>DIAS</span>
        </h1>

        <div className="my-6 h-[1.5px] w-20" style={{ background: accentCol }} />

        <p className="max-w-xs text-[13px] leading-relaxed text-white/60">
          Uma receita exclusiva para cada dia — cada suco escolhido para a fase certa do protocolo
        </p>

        {/* Phase cards */}
        <div className="mt-8 flex gap-3">
          {([
            { n: '01–05', label: 'Desinchaço', color: 'hsl(155 55% 30%)' },
            { n: '06–10', label: 'Energia',    color: 'hsl(40 75% 42%)' },
            { n: '11–14', label: 'Performance',color: 'hsl(220 55% 45%)' },
          ] as const).map(({ n, label, color }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 rounded-2xl px-5 py-3.5" style={{ background: midBg, border: `1px solid ${color}40` }}>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>Dias {n}</span>
              <span className="text-[13px] font-semibold text-white">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[4px]" style={{ background: `linear-gradient(to right, transparent, ${accentCol}, transparent)` }} />
    </DesignPage>
  );
}

// ── Divider: Receitas de Suporte ──────────────────────────────────────────
function SuporteSectionDivider() {
  const darkBg = 'hsl(18 70% 8%)';
  const midBg  = 'hsl(18 60% 12%)';
  const accentCol = C.color;

  return (
    <DesignPage bg={darkBg}>
      <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: `linear-gradient(to right, transparent, ${accentCol}, transparent)` }} />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-14 text-center">
        <p className="mb-4 text-[10.5px] font-bold uppercase tracking-[0.45em]" style={{ color: accentCol }}>
          Protocolo Detox Masculino
        </p>

        <h1 className="font-display leading-none tracking-tighter text-white">
          <span className="block text-[2rem] font-semibold opacity-70">RECEITAS</span>
          <span className="block text-[3.5rem] font-black" style={{ color: accentCol }}>DE SUPORTE</span>
        </h1>

        <div className="my-6 h-[1.5px] w-20" style={{ background: accentCol }} />

        <div className="max-w-sm rounded-2xl px-6 py-4 text-left" style={{ background: midBg, border: `1px solid ${accentCol}30` }}>
          <p className="text-[12.5px] leading-relaxed text-white/70">
            <span className="font-semibold" style={{ color: accentCol }}>40 receitas adicionais </span>
            para substituir qualquer suco do plano quando quiser variar, não tiver algum ingrediente disponível ou simplesmente quiser explorar novas combinações. Todas seguem os mesmos princípios do protocolo — ingredientes naturais, funcionais e direcionados para a saúde masculina.
          </p>
        </div>

        <p className="mt-6 text-[11px] text-white/35 uppercase tracking-widest">40 receitas · banco completo</p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[4px]" style={{ background: `linear-gradient(to right, transparent, ${accentCol}, transparent)` }} />
    </DesignPage>
  );
}

// ── Ebook ──────────────────────────────────────────────────────────────────
export default function EbookOnze() {
  return (
    <>
      <Cover />

      {/* Página 2 — Abertura */}
      <PdfContentPage accentGradient={ACCENT} kicker="Abertura" title="Algo mudou no seu corpo. E você sabe disso.">
        <div className="space-y-3">
          <p className="text-[13px] leading-relaxed text-foreground/85">
            Não foi de repente. Foi aos poucos. A energia que você tinha antes foi sumindo. O treino
            que rendia bem começou a render menos. O sono passou a ser pesado mas não reparador.
            A disposição para o dia foi ficando curta.
          </p>
          <p className="text-[13px] leading-relaxed text-foreground/85">
            Você tentou dormir mais. Tentou se alimentar melhor. Mas algo continua travado — e você
            não consegue identificar exatamente o quê.
          </p>
          <p className="text-[13px] leading-relaxed text-foreground/85">
            O problema quase sempre está onde ninguém olha: no acúmulo de toxinas no fígado, na
            inflamação crônica de baixo grau e na deficiência de micronutrientes específicos que o
            organismo masculino precisa para operar no seu nível máximo.
          </p>

          <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: C.color }}>
            Você sente alguns desses sinais?
          </p>

          <div className="grid grid-cols-2 gap-2">
            {[
              ['😴', 'Cansaço constante',  'Mesmo dormindo bem, falta disposição para o dia'],
              ['😤', 'Barriga inchada',    'Inchaço que não melhora mesmo comendo bem'],
              ['⚡', 'Disposição baixa',   'Energia que some no meio do dia sem motivo'],
              ['🔥', 'Libido reduzida',    'Queda no interesse e vitalidade sexual'],
              ['🧠', 'Falta de foco',      'Dificuldade de concentrar em tarefas simples'],
              ['💤', 'Sono ruim',          'Acorda sem ter descansado de verdade'],
            ].map(([icon, title, desc]) => (
              <div key={title as string} className="flex gap-2.5 rounded-xl p-3" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
                <span className="text-[1.2rem] shrink-0 leading-none pt-0.5">{icon}</span>
                <div>
                  <p className="text-[12px] font-bold" style={{ color: C.darkColor }}>{title}</p>
                  <p className="text-[11px] text-foreground/70 leading-tight mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg px-4 py-3" style={{ background: C.lightBg, borderLeft: `3px solid ${C.color}` }}>
            <p className="text-[13px] leading-relaxed" style={{ color: C.darkColor }}>
              Se você se identificou com 2 ou mais desses sinais, seu corpo está pedindo um reset.
              Não uma dieta radical. Não um suplemento caro. Uma limpeza interna — feita com
              ingredientes que a natureza já criou e a ciência já comprovou.{' '}
              <strong>É exatamente isso que este protocolo faz.</strong>
            </p>
          </div>
        </div>
      </PdfContentPage>

      {/* Página 3 — Como Funciona */}
      <PdfContentPage accentGradient={ACCENT} kicker="Como Funciona" title="3 Fases para Reprogramar seu Corpo">
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-foreground/90">
            O protocolo é dividido em três fases progressivas. Cada fase prepara o corpo para a
            próxima, criando um efeito cumulativo que potencializa os resultados ao longo dos 14 dias.
          </p>

          <div className="flex flex-col gap-3">
            <FaseCard
              number="1"
              dias="Dias 1–5"
              title="Desinchaço e Limpeza"
              color="hsl(155 65% 30%)"
              desc="O foco é eliminar toxinas acumuladas no fígado, reduzir a inflamação sistêmica e o inchaço corporal. O corpo entra em modo de limpeza profunda."
              items={['Sucos de desintoxicação hepática', 'Anti-inflamatórios naturais (gengibre, cúrcuma)', 'Redução do inchaço e retenção de líquidos', 'Melhora da digestão e absorção de nutrientes']}
            />
            <FaseCard
              number="2"
              dias="Dias 6–10"
              title="Energia e Foco"
              color="hsl(40 80% 42%)"
              desc="Com o organismo limpo, ativamos o metabolismo energético. O foco é aumentar o óxido nítrico, melhorar a circulação e recarregar os reservatórios de energia."
              items={['Sucos de beterraba para óxido nítrico', 'Pré-treino natural com pimenta caiena', 'Foco mental e clareza cognitiva', 'Resistência e stamina em atividades físicas']}
            />
            <FaseCard
              number="3"
              dias="Dias 11–14"
              title="Performance e Equilíbrio"
              color="hsl(230 55% 45%)"
              desc="A fase final otimiza a produção hormonal, fortalece músculos e apoia a saúde de longo prazo. O corpo opera no seu máximo potencial masculino."
              items={['Estímulo natural à testosterona (zinco, romã)', 'Shakes de recuperação e ganho muscular', 'Suporte à saúde cardiovascular', 'Equilíbrio hormonal sustentável']}
            />
          </div>
        </div>
      </PdfContentPage>

      {/* Página 4 — Como Usar */}
      <PdfContentPage accentGradient={ACCENT} kicker="Como Usar" title="Sua Rotina Diária com o Protocolo">
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-foreground/90">
            Você não precisa mudar sua alimentação inteira. Apenas incorpore os sucos nos momentos
            certos do dia para maximizar o efeito de cada receita.
          </p>

          <div className="space-y-2.5">
            <RoutineBlock icon="🌅" period="Manhã — Em Jejum"              action="Suco detox ou hormonal"         suco="Detox Masculino, Shot do Guerreiro ou Testosterona Verde — 200ml em jejum" />
            <RoutineBlock icon="🏋️" period="Pré-Treino (30–45 min antes)"  action="Suco de energia ou resistência" suco="Pré-Treino Natural, Energia Explosiva ou Resistência Máxima" />
            <RoutineBlock icon="💪" period="Pós-Treino (até 30 min depois)" action="Shake de recuperação"           suco="Recuperação Total, Construtor Muscular ou Explosão Anabólica" />
            <RoutineBlock icon="🌙" period="Noite (30 min antes de dormir)" action="Suco de recuperação e sono"     suco="Sono Reparador — tome morno para melhor absorção do triptofano" />
          </div>

          <SectionTitle emoji="📌">Regras Simples</SectionTitle>

          <div className="grid grid-cols-2 gap-2">
            {[
              ['🥤', '200–300ml por vez',     'Dose ideal para absorção sem exageros'],
              ['⚡', 'Beba imediatamente',     'Oxidação reduz os nutrientes em minutos'],
              ['🚫', 'Sem açúcar refinado',    'Use apenas mel puro como adoçante'],
              ['📅', 'Consistência é tudo',    'Os efeitos são cumulativos — não pule dias'],
            ].map(([icon, rule, tip]) => (
              <div key={rule as string} className="rounded-xl p-3" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
                <p className="text-[1.1rem] mb-1">{icon}</p>
                <p className="text-[12px] font-bold" style={{ color: C.darkColor }}>{rule}</p>
                <p className="text-[11px] text-foreground/65 mt-0.5 leading-tight">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </PdfContentPage>

      {/* ── SEÇÃO: PLANO 14 DIAS ── */}
      <PlanoSectionDivider />

      {chunk(planRecipes, 2).map((pair, i) => (
        <PdfContentPage
          key={`plan-${i}`}
          accentGradient={ACCENT}
          kicker={`Plano 14 Dias — ${FASE[pair[0].fase].label}`}
          title="Receitas do Plano Dia a Dia"
        >
          <div className="flex flex-1 flex-col gap-4">
            {pair.map((r) => <DayRecipeCard key={r.day} recipe={r} />)}
          </div>
        </PdfContentPage>
      ))}

      {/* ── SEÇÃO: RECEITAS DE SUPORTE ── */}
      <SuporteSectionDivider />

      {chunk(supportRecipes, 2).map((pair, i) => (
        <PdfContentPage
          key={`suporte-${i}`}
          accentGradient={ACCENT}
          kicker="Receitas de Suporte — Banco Completo"
          title="Receitas Extras"
        >
          <div className="flex flex-1 flex-col gap-4">
            {pair.map((r) => <LargeRecipeCard key={r.number} recipe={r} />)}
          </div>
        </PdfContentPage>
      ))}

      {/* ── SEÇÃO: BÔNUS — GUIA DE ERROS ── */}
      <BonusSectionDivider />

      {chunk(erros, 2).map((pair, i) => (
        <PdfContentPage
          key={`erro-${i}`}
          accentGradient={ACCENT}
          kicker="Bônus — Guia de Erros que Travam o Corpo"
          title={i === 0 ? 'O que você faz sem perceber' : 'Erros que sabotam os resultados'}
        >
          <div className="flex flex-1 flex-col gap-4">
            {pair.map((e) => <ErrorCard key={e.number} erro={e} />)}
          </div>
        </PdfContentPage>
      ))}

      {/* Resumo dos Erros */}
      <PdfContentPage accentGradient={ACCENT} kicker="Bônus — Resumo" title="Tabela de Correções Rápidas">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl" style={{ border: `1.5px solid ${C.border}` }}>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr style={{ background: C.darkColor }}>
                  <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white">Erro</th>
                  <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white">Consequência</th>
                  <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white">Correção Imediata</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Pouca água',            'Toxinas circulando no sangue',   '1 copo ao acordar + 2,5L ao dia'],
                  ['Sono curto',            'Queda de testosterona',          '7–9h + suco noturno'],
                  ['Ultraprocessados',      'Intestino inflamado',            'Reduzir + esperar 1h após o suco'],
                  ['Pular café da manhã',   'Cortisol elevado',               'Suco em jejum + refeição em 1h'],
                  ['Estresse crônico',      'Testosterona destruída',         'Caminhada + respiração + suco anti-stress'],
                  ['Sem recuperação',       'Perda muscular',                 'Descanso + suco pós-treino'],
                  ['Cafeína à tarde',       'Sono prejudicado',               'Café só até meio-dia'],
                  ['Ignorar sinais',        'Problemas maiores',              'Observar e anotar as mudanças'],
                ].map(([erro, cons, fix], i) => (
                  <tr key={erro} className="border-t" style={{ borderColor: C.border, background: i % 2 === 0 ? 'white' : C.lightBg }}>
                    <td className="px-3 py-2.5 text-[12px] font-bold" style={{ color: C.color }}>{erro}</td>
                    <td className="px-3 py-2.5 text-[12px] text-foreground/85">{cons}</td>
                    <td className="px-3 py-2.5 text-[12px] text-foreground/75">{fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl px-5 py-4" style={{ background: C.lightBg, border: `1.5px solid ${C.border}` }}>
            <p className="text-[13.5px] font-semibold leading-snug mb-2" style={{ color: C.darkColor }}>
              Corrigir esses erros não exige perfeição. Exige consciência.
            </p>
            <p className="text-[13px] leading-relaxed text-foreground/80">
              Um erro corrigido por semana já transforma o resultado do protocolo.
              Comece pelo mais fácil e vá avançando. Seu corpo vai responder.
            </p>
          </div>
        </div>
      </PdfContentPage>

      {/* Página — Regras de Ouro */}
      <PdfContentPage accentGradient={ACCENT} kicker="Regras" title="5 Regras de Ouro do Protocolo">
        <div className="space-y-4">
          <div className="space-y-2.5">
            {[
              ['1', 'Consistência acima de perfeição',   'Um suco por dia todos os dias vale mais do que 5 sucos num dia e nenhum no outro. A consistência é o que gera resultados.'],
              ['2', 'Em jejum para sucos hormonais',     'Os sucos de testosterona e detox têm absorção até 3x maior quando tomados com o estômago vazio pela manhã.'],
              ['3', 'Hidratação entre os sucos',         'Beba pelo menos 2 litros de água por dia. Os sucos não substituem a água — eles potencializam sua ação no organismo.'],
              ['4', 'Respeite as fases',                 'Cada fase tem um propósito. Não pule para os sucos de testosterona sem antes fazer os 5 dias de detox — a sequência é o que faz funcionar.'],
              ['5', 'Sono como aliado',                  'A maior parte dos resultados (testosterona, músculo, memória) acontece durante o sono. Priorize 7 a 8 horas por noite.'],
            ].map(([num, rule, desc]) => (
              <div key={num as string} className="flex gap-3 rounded-xl p-3.5" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-black text-white" style={{ background: C.color }}>{num}</span>
                <div>
                  <p className="text-[13px] font-bold" style={{ color: C.darkColor }}>{rule}</p>
                  <p className="text-[12px] text-foreground/75 mt-0.5 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <SectionTitle emoji="📋">Sua Rotina Simples de 14 Dias</SectionTitle>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl p-3.5" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: C.color }}>Manhã</p>
              <div className="space-y-1">
                <CheckItem>Acordar → Água morna com limão</CheckItem>
                <CheckItem>20 min depois → Suco do protocolo</CheckItem>
                <CheckItem>Café da manhã normal após 30 min</CheckItem>
              </div>
            </div>
            <div className="rounded-xl p-3.5" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: C.color }}>Noite</p>
              <div className="space-y-1">
                <CheckItem>Jantar leve — evite frituras</CheckItem>
                <CheckItem>30 min antes de dormir → Sono Reparador</CheckItem>
                <CheckItem>Tela desligada 20 min antes de dormir</CheckItem>
              </div>
            </div>
          </div>
        </div>
      </PdfContentPage>

      {/* Página — Encerramento Parte 1 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Encerramento" title="Você não é o mesmo homem que começou o Dia 1.">
        <div className="space-y-3.5">
          <p className="text-[13px] leading-relaxed text-foreground/85">
            Quatorze dias atrás, seu corpo estava acumulando toxinas, operando com inflamação crônica
            e produzindo hormônios abaixo do seu potencial. Hoje não.
          </p>
          <p className="text-[13px] leading-relaxed text-foreground/85">
            Você passou por três fases que poucos homens têm disciplina de completar. Limpou o
            fígado. Ativou o metabolismo. Elevou os nutrientes que seu corpo precisa para produzir
            testosterona, construir músculo e funcionar com vitalidade real.
          </p>
          <p className="text-[13px] leading-relaxed text-foreground/85">
            Isso não foi sorte. Foi uma escolha que você fez todos os dias — mesmo nos dias difíceis,
            mesmo quando deu vontade de pular.
          </p>

          <div className="h-px my-1" style={{ background: C.border }} />

          <SectionTitle emoji="🔄">O que acontece agora?</SectionTitle>

          <p className="text-[13px] leading-relaxed text-foreground/85">
            Os resultados do protocolo não param no Dia 14. Eles continuam se aprofundando nas
            próximas semanas, desde que você mantenha o hábito. Você tem três caminhos:
          </p>

          <div className="space-y-2">
            {[
              ['🔁', 'Repetir o protocolo',             'Faça mais um ciclo completo de 14 dias. Os efeitos se multiplicam a cada rodada. Muitos homens relatam que o segundo ciclo é onde os resultados mais visíveis aparecem: mais definição muscular, sono mais profundo e energia mais estável.'],
              ['🥤', 'Manutenção com 1 suco por dia',   'Escolha livremente entre as receitas do banco de suporte e tome pelo menos 1 por dia. O hábito já está formado. Agora é só manter o motor rodando.'],
              ['🏋️', 'Potencializar com treino',        'Se você ainda não treina com regularidade, esse é o momento certo para começar. O protocolo preparou seu organismo para responder melhor ao estímulo físico. Testosterona em alta, inflamação baixa e nutrição adequada — as condições estão perfeitas.'],
            ].map(([icon, title, desc]) => (
              <div key={title as string} className="flex gap-3 rounded-xl p-3.5" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
                <span className="text-[1.3rem] shrink-0 leading-none pt-0.5">{icon}</span>
                <div>
                  <p className="text-[12.5px] font-bold mb-0.5" style={{ color: C.darkColor }}>{title}</p>
                  <p className="text-[12px] leading-snug text-foreground/75">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PdfContentPage>

      {/* Página — Encerramento Parte 2 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Encerramento" title="Uma última coisa.">
        <div className="space-y-4">
          <p className="text-[13.5px] leading-relaxed text-foreground/85">
            A maioria dos homens sabe o que precisa fazer para se sentir melhor. O problema nunca foi
            falta de informação — foi falta de começo.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/85">
            Você começou. Isso já te coloca em um grupo pequeno.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/85">
            Agora você sabe como seu corpo responde a ingredientes naturais. Sabe quais sucos te dão
            energia, quais melhoram o sono, quais apoiam sua testosterona. Esse conhecimento é seu —
            e ninguém tira.
          </p>

          <p className="text-[13.5px] font-semibold leading-relaxed" style={{ color: C.darkColor }}>
            Use todos os dias.
          </p>

          <div className="h-px my-2" style={{ background: C.border }} />

          <div className="flex flex-col gap-3">
            {[
              ['Fase 1 — Desinchaço', '1–5',   'Limpeza hepática e redução da inflamação crônica'],
              ['Fase 2 — Energia',    '6–10',  'Ativação metabólica, foco e resistência física'],
              ['Fase 3 — Performance','11–14', 'Otimização hormonal, músculo e vitalidade'],
            ].map(([fase, dias, desc], i) => {
              const colors = ['hsl(155 55% 30%)', 'hsl(40 75% 42%)', 'hsl(220 55% 45%)'];
              return (
                <div key={fase as string} className="flex items-center gap-4 rounded-xl px-4 py-3" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white" style={{ background: colors[i] }}>{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <p className="text-[12.5px] font-bold" style={{ color: C.darkColor }}>{fase}</p>
                      <p className="text-[10.5px] font-semibold" style={{ color: colors[i] }}>Dias {dias}</p>
                    </div>
                    <p className="text-[11.5px] text-foreground/70 mt-0.5">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl px-5 py-5 text-center mt-2" style={{ background: C.darkColor }}>
            <p className="text-[14px] font-bold text-white leading-snug">
              Força, saúde e vitalidade — o resultado de quem age.
            </p>
            <p className="mt-2 text-[11px] text-white/55 leading-relaxed">
              Protocolo Detox Masculino · 14 Dias · Feito para homens que não aceitam menos do que o seu melhor.
            </p>
          </div>
        </div>
      </PdfContentPage>
    </>
  );
}
