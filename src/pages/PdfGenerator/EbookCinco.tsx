/**
 * PDF 5 — Rota: /pdf/ebook-cinco · Sucos para Homens: Testosterona, Músculo e Energia
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';

// ── Gradiente da faixa lateral (azul navy) ────────────────────────────────
const ACCENT = 'linear-gradient(to bottom, hsl(18 72% 40%), hsl(24 68% 36%), hsl(12 65% 32%))';

// ── Tokens de cor ──────────────────────────────────────────────────────────
const C = {
  darkColor: 'hsl(18 65% 20%)',
  color:     'hsl(18 72% 40%)',
  lightBg:   'hsl(18 55% 93%)',
  border:    'hsl(18 50% 76%)',
};

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

function InfoBox({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg px-3.5 py-2.5 leading-normal" style={{ background: C.lightBg, borderLeft: `3px solid ${C.border}` }}>
      <div className="text-[13px] leading-snug" style={{ color: C.color }}>{children}</div>
    </div>
  );
}

function HighlightBox({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl px-3.5 py-3" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
      <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: C.color }}>{label}</div>
      <div className="text-[13px] leading-snug text-foreground/90">{children}</div>
    </div>
  );
}

function BulletItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full" style={{ background: C.color }} aria-hidden />
      <span className="text-[13px] leading-snug text-foreground/90">{children}</span>
    </div>
  );
}

function RoutineRow({ period, suco }: { period: string; suco: string }) {
  return (
    <tr className="border-t" style={{ borderColor: C.border }}>
      <td className="px-3 py-2 text-[12px] font-semibold" style={{ color: C.color }}>{period}</td>
      <td className="px-3 py-2 text-[12px] text-foreground/90">{suco}</td>
    </tr>
  );
}

// ── Tipos e helpers ─────────────────────────────────────────────────────────
type Recipe = { number: number; name: string; ingredients: string[]; preparo: string; porqueFunciona: string };

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

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
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: C.color }}>Preparo</div>
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

const recipes: Recipe[] = [
  { number: 1, name: 'Boost de Testosterona', ingredients: ['1 romã (suco)', '1 colher de sopa de semente de abóbora', '1 colher de chá de mel', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'A romã aumenta naturalmente os níveis de testosterona e melhora a circulação. A semente de abóbora é rica em zinco, mineral diretamente ligado à produção hormonal masculina.' },
  { number: 2, name: 'Energia Explosiva', ingredients: ['1 beterraba pequena', '1 laranja (suco)', '1 pedaço de gengibre (2cm)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'A beterraba aumenta o óxido nítrico no sangue, melhorando o fluxo de oxigênio para os músculos. Ideal para tomar antes do treino, dá energia explosiva e melhora o desempenho físico.' },
  { number: 3, name: 'Construtor Muscular', ingredients: ['1 banana', '1 colher de sopa de pasta de amendoim natural', '1 colher de sopa de aveia', '200ml de leite', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.', porqueFunciona: 'Combinação rica em proteínas, carboidratos e gorduras saudáveis que o músculo precisa para crescer. Esse shake é ideal após o treino para acelerar a recuperação e o ganho de massa muscular.' },
  { number: 4, name: 'Shot do Guerreiro', ingredients: ['1 pedaço de gengibre (3cm)', '2 dentes de alho', '1 limão (suco)', '1 colher de mel', '200ml de água morna'], preparo: 'Bata tudo no liquidificador, coe bem e tome como shot pela manhã em jejum.', porqueFunciona: 'Gengibre e alho têm efeito anti-inflamatório e antibacteriano que fortalecem o organismo. Esse shot aumenta a disposição, reduz o cansaço pós-treino e fortalece o sistema imunológico masculino.' },
  { number: 5, name: 'Circulação Máxima', ingredients: ['1 beterraba pequena', '1 romã (suco)', '1 limão (suco)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Beterraba e romã são as duas frutas mais estudadas para melhora da circulação masculina. Essa combinação aumenta o fluxo sanguíneo periférico, impactando diretamente na vitalidade e disposição.' },
  { number: 6, name: 'Força Total', ingredients: ['1 banana', '1 xícara de espinafre', '1 colher de sopa de aveia', '200ml de leite', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador até ficar homogêneo. Sirva gelado.', porqueFunciona: 'O espinafre tem nitratos e ferro que aumentam a força e a resistência muscular. Com banana e aveia, esse shake sustenta a energia durante treinos longos e reduz a fadiga muscular.' },
  { number: 7, name: 'Zinco Power', ingredients: ['1 colher de sopa de semente de abóbora', '1 maçã', '1 colher de chá de mel', '200ml de leite vegetal'], preparo: 'Bata tudo no liquidificador até ficar homogêneo. Sirva gelado.', porqueFunciona: 'A semente de abóbora é uma das fontes mais ricas de zinco, mineral essencial para a produção de testosterona e saúde da próstata. Consumida regularmente, apoia a saúde hormonal masculina de forma natural.' },
  { number: 8, name: 'Recuperação Rápida', ingredients: ['2 fatias de abacaxi', '1 banana', '1 pedaço de gengibre (1cm)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador e sirva gelado logo após o treino.', porqueFunciona: 'O abacaxi tem bromelina que reduz a inflamação muscular pós-treino. Com banana que repõe potássio e água de coco que reidrata, esse suco acelera a recuperação e reduz a dor muscular.' },
  { number: 9, name: 'Testosterona Verde', ingredients: ['1 xícara de espinafre', '1 maçã verde', '1 limão (suco)', '1 colher de sopa de semente de abóbora', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'O espinafre tem magnésio que aumenta a testosterona livre no sangue. Com semente de abóbora rica em zinco, esse suco apoia a produção hormonal masculina de forma contínua e natural.' },
  { number: 10, name: 'Pré-Treino Natural', ingredients: ['1 beterraba pequena', '1 laranja (suco)', '1 pedaço de gengibre (1cm)', '1 pitada de pimenta caiena', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado 30 minutos antes do treino.', porqueFunciona: 'A beterraba aumenta a resistência física e a pimenta caiena eleva a temperatura corporal, potencializando o desempenho. Esse é o melhor pré-treino natural para quem quer treinar mais forte sem suplementos.' },
  { number: 11, name: 'Massa Magra', ingredients: ['1 banana', '1 colher de sopa de aveia', '1 colher de sopa de pasta de amendoim', '1 colher de sopa de cacau em pó puro', '200ml de leite'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.', porqueFunciona: 'O cacau puro tem flavonoides que melhoram a circulação muscular. Com aveia, banana e amendoim, esse shake fornece as proteínas e calorias necessárias para ganho de massa magra sem acumular gordura.' },
  { number: 12, name: 'Libido Ativo', ingredients: ['1 romã (suco)', '1 beterraba pequena', '1 colher de chá de mel', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Romã e beterraba aumentam a produção de óxido nítrico, que melhora a circulação periférica e a vitalidade masculina. Essa combinação é uma das mais eficazes para apoiar a libido de forma natural.' },
  { number: 13, name: 'Foco e Clareza', ingredients: ['1 xícara de mirtilo ou amora', '1 colher de sopa de nozes picadas', '200ml de leite vegetal', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.', porqueFunciona: 'As nozes têm ômega-3 que nutre o cérebro e melhora o foco e a concentração. Com mirtilo rico em antioxidantes, esse shake é ideal para homens que precisam de desempenho mental além do físico.' },
  { number: 14, name: 'Resistência de Aço', ingredients: ['1 beterraba pequena', '1 cenoura média', '1 maçã', '1 limão (suco)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'A beterraba aumenta a resistência aeróbica e reduz o consumo de oxigênio durante exercícios intensos. Com cenoura e maçã, esse suco melhora o condicionamento físico e permite treinar por mais tempo.' },
  { number: 15, name: 'Hormônio em Alta', ingredients: ['1 colher de sopa de semente de abóbora', '1 colher de sopa de semente de girassol', '1 banana', '200ml de leite vegetal', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador até ficar homogêneo. Sirva gelado.', porqueFunciona: 'Sementes de abóbora e girassol são ricas em zinco, selênio e vitamina E, três nutrientes essenciais para a produção de testosterona. Esse shake apoia o equilíbrio hormonal masculino de forma contínua e natural.' },
  { number: 16, name: 'Explosão Anabólica', ingredients: ['1 banana', '1 colher de sopa de aveia', '1 colher de sopa de pasta de amendoim', '1 ovo (apenas a clara)', '200ml de leite'], preparo: 'Bata tudo no liquidificador até ficar homogêneo. Sirva gelado.', porqueFunciona: 'A clara de ovo fornece proteína de alta qualidade sem gordura. Com aveia e amendoim, esse shake tem o perfil nutricional ideal para síntese proteica e crescimento muscular após treinos intensos.' },
  { number: 17, name: 'Detox Masculino', ingredients: ['1 maçã verde', '1 pepino médio', '1 limão (suco)', '1 pedaço de gengibre (1cm)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Homens acumulam mais toxinas no fígado devido ao metabolismo mais acelerado. Esse suco limpa o fígado, melhora a digestão e aumenta a absorção de nutrientes essenciais para o desempenho físico.' },
  { number: 18, name: 'Coração Forte', ingredients: ['1 xícara de uva roxa', '1 maçã', '1 colher de chá de mel', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'A uva roxa tem resveratrol que protege o coração e melhora a circulação. Homens têm maior risco cardiovascular e esse suco reduz o colesterol ruim e fortalece as artérias de forma natural.' },
  { number: 19, name: 'Anti-Inflamatório Muscular', ingredients: ['2 fatias de abacaxi', '1 pedaço de gengibre (2cm)', '1 limão (suco)', '1 pitada de cúrcuma', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Abacaxi, gengibre e cúrcuma são os três anti-inflamatórios naturais mais potentes. Esse suco reduz a inflamação muscular após treinos pesados, acelerando a recuperação e permitindo treinar com mais frequência.' },
  { number: 20, name: 'Stamina Máxima', ingredients: ['1 beterraba pequena', '1 maçã', '1 cenoura média', '1 pedaço de gengibre (1cm)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'A beterraba aumenta a produção de óxido nítrico que dilata os vasos e melhora a entrega de oxigênio aos músculos. Com cenoura e gengibre, esse suco aumenta o stamina e a resistência em qualquer atividade física.' },
  { number: 21, name: 'Próstata Saudável', ingredients: ['1 colher de sopa de semente de abóbora', '1 tomate médio', '1 limão (suco)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'O tomate tem licopeno, antioxidante comprovadamente eficaz na proteção da próstata. Com semente de abóbora rica em zinco, esse suco é um dos mais importantes para a saúde masculina preventiva.' },
  { number: 22, name: 'Superação do Cansaço', ingredients: ['1 laranja (suco)', '1 cenoura média', '1 pedaço de gengibre (2cm)', '1 pitada de pimenta caiena', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Gengibre e pimenta caiena ativam a circulação e aumentam a temperatura corporal, combatendo o cansaço físico e mental. Ideal para homens com rotina intensa que precisam de energia sem depender de cafeína.' },
  { number: 23, name: 'Ganho Seco', ingredients: ['1 banana', '1 colher de sopa de aveia', '1 colher de chá de cacau em pó puro', '200ml de leite vegetal', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.', porqueFunciona: 'Esse shake fornece calorias de qualidade sem gordura excessiva. O cacau melhora a circulação muscular e a aveia sustenta a energia. Ideal para quem quer ganhar massa sem aumentar o percentual de gordura.' },
  { number: 24, name: 'Fígado Limpo', ingredients: ['1 beterraba pequena', '1 maçã verde', '1 limão (suco)', '1 pedaço de gengibre (1cm)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'O fígado saudável é essencial para a produção de testosterona e metabolismo dos hormônios masculinos. Beterraba e limão estimulam a desintoxicação hepática, melhorando indiretamente a saúde hormonal.' },
  { number: 25, name: 'Ossos e Articulações', ingredients: ['200ml de leite', '1 colher de sopa de gergelim', '1 banana', '1 colher de chá de mel', '1 pitada de canela'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.', porqueFunciona: 'O gergelim tem cálcio e magnésio que fortalecem os ossos e protegem as articulações de lesões durante treinos pesados. Essencial para homens que praticam musculação ou esportes de impacto.' },
  { number: 26, name: 'Memória e Foco', ingredients: ['1 xícara de mirtilo', '1 maçã', '1 colher de sopa de nozes', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Mirtilo e nozes são os alimentos mais estudados para saúde cerebral masculina. Ômega-3 das nozes e antocianinas do mirtilo protegem os neurônios, melhoram a memória e o foco em atividades profissionais e esportivas.' },
  { number: 27, name: 'Sono Reparador', ingredients: ['1 banana', '1 xícara de cereja', '200ml de leite morno', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador. Tome morno 30 minutos antes de dormir.', porqueFunciona: 'A maior parte da testosterona é produzida durante o sono profundo. Cereja com melatonina natural e banana com triptofano garantem um sono reparador, maximizando a produção hormonal noturna.' },
  { number: 28, name: 'Imunidade Masculina', ingredients: ['2 laranjas (suco)', '1 limão (suco)', '1 pedaço de gengibre (2cm)', '1 colher de mel', '200ml de água'], preparo: 'Misture os sucos com a água, bata o gengibre e coe. Sirva gelado.', porqueFunciona: 'Vitamina C em alta concentração combinada com o poder antibacteriano do gengibre. Esse suco fortalece as defesas do organismo e reduz o tempo de recuperação em resfriados e gripes.' },
  { number: 29, name: 'Equilíbrio Total', ingredients: ['1 maçã', '1 cenoura média', '1 beterraba pequena', '1 limão (suco)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Esse suco equilibra energia, circulação e imunidade em um único copo. Beterraba para desempenho, cenoura para visão e pele, maçã para digestão e água de coco para hidratação completa.' },
  { number: 30, name: 'Poder Total Masculino', ingredients: ['1 beterraba pequena', '1 romã (suco)', '1 colher de sopa de semente de abóbora', '1 pedaço de gengibre (1cm)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'A receita mais completa do recetário masculino. Beterraba e romã maximizam a circulação e a vitalidade, a semente de abóbora eleva o zinco para produção de testosterona e o gengibre potencializa tudo com seu efeito anti-inflamatório e energizante.' },
];

// ── Capa ───────────────────────────────────────────────────────────────────
function Cover() {
  return (
    <section
      className="relative flex h-[297mm] flex-col overflow-hidden page-break-after print:shadow-none"
      style={{
        backgroundImage: 'url(/capa-suco-homens.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}
// ── Ebook ──────────────────────────────────────────────────────────────────
export default function EbookCinco() {
  return (
    <>
      <Cover />

      {/* Página 2 — Introdução */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Introdução"
        title="Você não está ficando velho — está ficando sem combustível"
      >
        <div className="space-y-4">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Cansaço que aparece mais cedo. Treinos que rendem menos. Dificuldade para ganhar músculo
            mesmo se esforçando. Libido que caiu sem motivo aparente. Energia que some no meio do dia.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Se você reconhece algum desses sinais, saiba que na maioria das vezes a causa não é a
            idade — é a falta dos nutrientes certos para o corpo masculino funcionar no seu melhor.
          </p>

          <InfoBox>
            A testosterona começa a cair naturalmente após os 30. O metabolismo desacelera. A
            recuperação muscular fica mais lenta. Mas isso não significa que você precisa aceitar
            isso passivamente.
          </InfoBox>

          <SectionTitle emoji="⚗️">O que é testosterona e por que ela importa?</SectionTitle>

          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            A testosterona é o principal hormônio masculino. Ela controla a massa muscular, a
            libido, a energia, o humor, a força óssea e até a clareza mental. Quando os níveis
            caem, o homem sente no corpo e na mente.
          </p>

          <InfoBox>
            A alimentação tem impacto direto na produção hormonal. Ingredientes ricos em zinco,
            magnésio, vitamina D e antioxidantes específicos estimulam o organismo a produzir mais
            testosterona de forma natural.
          </InfoBox>

          <SectionTitle emoji="⚙️">Como funciona no corpo?</SectionTitle>

          <div className="grid grid-cols-2 gap-3">
            <HighlightBox label="🧬 Produção hormonal">
              Zinco da semente de abóbora, selênio das sementes — nutrientes que o corpo usa para sintetizar testosterona.
            </HighlightBox>
            <HighlightBox label="🩸 Circulação">
              Óxido nítrico da beterraba e bromelina do abacaxi melhoram o fluxo sanguíneo e o desempenho físico.
            </HighlightBox>
            <HighlightBox label="💪 Recuperação muscular">
              Proteínas do amendoim e anti-inflamatórios do gengibre aceleram a recuperação e o crescimento.
            </HighlightBox>
            <HighlightBox label="⚡ Energia">
              Carboidratos da banana, ferro da beterraba e vitaminas do complexo B para manter o desempenho ao longo do dia.
            </HighlightBox>
          </div>
        </div>
      </PdfContentPage>

      {/* Página 3 — Por que suco + Como usar */}
      <PdfContentPage accentGradient={ACCENT} kicker="Introdução" title="Por que suco e não suplemento?">
        <div className="space-y-3.5">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Suplementos isolam compostos. A natureza os combina. Quando você consome beterraba com
            gengibre, por exemplo, os compostos se potencializam mutuamente de um jeito que nenhum
            suplemento isolado replica.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Além disso, sucos naturais não têm efeitos colaterais, não sobrecarregam os rins e são
            absorvidos com muito mais eficiência pelo organismo do que cápsulas e pós industrializados.
          </p>

          <SectionTitle emoji="📖">Como usar este e-book</SectionTitle>

          <div className="space-y-2">
            <BulletItem>Sucos pré-treino funcionam melhor 30 a 45 minutos antes do exercício</BulletItem>
            <BulletItem>Shakes de recuperação devem ser tomados em até 30 minutos após o treino</BulletItem>
            <BulletItem>Sucos de testosterona são mais eficazes tomados pela manhã em jejum</BulletItem>
            <BulletItem>Comece com 1 receita por dia e aumente conforme a rotina se ajustar</BulletItem>
          </div>
        </div>
      </PdfContentPage>

      {chunk(recipes, 2).map((pair, i) => (
        <PdfContentPage
          key={`recipe-${i}`}
          accentGradient={ACCENT}
          kicker="Receitas"
          title="Receitas"
          subtitle={i === 0 ? 'Testosterona, Músculo e Energia para o dia a dia.' : undefined}
        >
          <div className="flex flex-1 flex-col gap-4">
            {pair.map((r) => <LargeRecipeCard key={r.number} recipe={r} />)}
          </div>
        </PdfContentPage>
      ))}

      {/* Página 5 — Recomendações */}
      <PdfContentPage accentGradient={ACCENT} kicker="Recomendações" title="Como potencializar os resultados">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <HighlightBox label="😴 Sono">
              A maior parte da testosterona é produzida durante o sono profundo. Dormir menos de 7h reduz significativamente os níveis hormonais.
            </HighlightBox>
            <HighlightBox label="🏋️ Treino de força">
              A combinação de musculação com os sucos potencializa muito os resultados. O treino estimula a testosterona.
            </HighlightBox>
            <HighlightBox label="🍯 Evite o açúcar">
              O açúcar em excesso eleva o cortisol, antagonista direto da testosterona. Prefira mel como adoçante.
            </HighlightBox>
            <HighlightBox label="📆 Consistência">
              Os efeitos são cumulativos. Os melhores resultados aparecem após 3 a 4 semanas de consumo regular.
            </HighlightBox>
          </div>

          <SectionTitle emoji="📅">Rotina sugerida</SectionTitle>

          <div className="overflow-hidden rounded-xl" style={{ border: `1px solid ${C.border}` }}>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr style={{ background: C.lightBg }}>
                  <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: C.darkColor }}>Horário</th>
                  <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: C.darkColor }}>Suco recomendado</th>
                </tr>
              </thead>
              <tbody>
                <RoutineRow period="Ao acordar (jejum)" suco="Shot de testosterona ou suco de zinco" />
                <RoutineRow period="Pré-treino" suco="Suco de beterraba com gengibre" />
                <RoutineRow period="Pós-treino" suco="Shake de recuperação com banana e amendoim" />
                <RoutineRow period="Noite" suco="Suco de sono reparador" />
              </tbody>
            </table>
          </div>
        </div>
      </PdfContentPage>

      {/* Página 6 — Encerramento */}
      <PdfContentPage accentGradient={ACCENT} kicker="Encerramento" title="Força não é só física — é uma escolha diária">
        <div className="space-y-4">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            O corpo masculino foi feito para ser forte, resistente e vital. Mas ele precisa de
            combustível de qualidade para funcionar assim.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Cada suco que você preparar é um investimento direto no seu desempenho, na sua saúde
            e na sua qualidade de vida. Não é sobre estar na academia sete dias por semana — é
            sobre dar ao seu corpo o que ele precisa para se manter forte todos os dias.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Comece hoje. Seu corpo vai responder.
          </p>

          <InfoBox>
            Força, saúde e vitalidade.
          </InfoBox>
        </div>
      </PdfContentPage>
    </>
  );
}
