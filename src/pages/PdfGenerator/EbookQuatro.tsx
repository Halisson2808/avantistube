/**
 * PDF 4 — Rota: /pdf/ebook-quatro · Sucos para Mulheres: Emagrecimento, Barriga Chapada e Pele Radiante
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';

// ── Gradiente da faixa lateral (rosa/rose) ─────────────────────────────────
const ACCENT = 'linear-gradient(to bottom, hsl(340 65% 50%), hsl(350 60% 46%), hsl(330 55% 42%))';

// ── Tokens de cor ──────────────────────────────────────────────────────────
const C = {
  darkColor: 'hsl(340 55% 18%)',
  color:     'hsl(340 62% 42%)',
  lightBg:   'hsl(340 55% 94%)',
  border:    'hsl(340 50% 80%)',
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
  { number: 1, name: 'Barriga Zero', ingredients: ['1 pepino médio', '1 limão (suco)', '2 folhas de hortelã', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva bem gelado.', porqueFunciona: 'O pepino é diurético natural e reduz o inchaço abdominal rapidamente. Com limão e hortelã, esse suco desincha a barriga e elimina o excesso de líquido retido no corpo.' },
  { number: 2, name: 'Queima Gordura Verde', ingredients: ['2 folhas de couve', '1 maçã verde', '1 limão (suco)', '1 pedaço de gengibre (1cm)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'A couve acelera o metabolismo e o gengibre tem efeito termogênico natural. Juntos, aumentam o gasto calórico do corpo e ajudam na queima de gordura, especialmente na região abdominal.' },
  { number: 3, name: 'Detox Feminino', ingredients: ['2 fatias de abacaxi', '1 pepino médio', '1 limão (suco)', '2 folhas de hortelã', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva bem gelado.', porqueFunciona: 'O abacaxi tem bromelina que quebra gorduras e melhora a digestão. Com pepino e hortelã, esse suco elimina toxinas, reduz o inchaço e desincha o abdômen em poucos dias.' },
  { number: 4, name: 'Colágeno Natural', ingredients: ['1 xícara de morango', '1 laranja (suco)', '1 kiwi', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Morango, laranja e kiwi formam uma bomba de vitamina C, nutriente essencial para a produção de colágeno. Consumido regularmente, melhora a firmeza da pele, reduz rugas e combate a flacidez.' },
  { number: 5, name: 'Metabolismo Ativo', ingredients: ['1 toranja (grapefruit)', '1 laranja (suco)', '1 pedaço de gengibre (1cm)', '200ml de água'], preparo: 'Esprema as frutas, bata com o gengibre e a água. Coe e sirva gelado.', porqueFunciona: 'A toranja tem naringenina, composto que ativa o metabolismo e reduz o acúmulo de gordura. Com gengibre termogênico, esse suco acelera a queima calórica de forma natural.' },
  { number: 6, name: 'Pele de Veludo', ingredients: ['1 cenoura média', '1 laranja (suco)', '1 colher de chá de azeite extra virgem', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'A cenoura é rica em betacaroteno que protege a pele do sol e reduz manchas. O azeite fornece vitamina E e gorduras que hidratam profundamente, deixando a pele mais luminosa e uniforme.' },
  { number: 7, name: 'Anticelulite', ingredients: ['1 xícara de uva roxa', '1 limão (suco)', '1 pedaço de gengibre (1cm)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'A uva roxa tem resveratrol que melhora a circulação e fortalece as paredes dos vasos sanguíneos. Com gengibre e água de coco, esse suco combate a celulite atacando sua principal causa: a má circulação.' },
  { number: 8, name: 'Saciedade Total', ingredients: ['1 maçã', '1 colher de sopa de aveia', '1 colher de chá de mel', '200ml de água'], preparo: 'Bata tudo no liquidificador e sirva gelado.', porqueFunciona: 'A aveia é rica em fibras solúveis que prolongam a saciedade por horas. Com maçã, esse suco controla a fome entre as refeições e reduz a compulsão por doces, sendo aliado direto no emagrecimento.' },
  { number: 9, name: 'Hormônio Equilibrado', ingredients: ['1 xícara de espinafre', '1 banana', '1 colher de sopa de linhaça dourada', '200ml de leite vegetal'], preparo: 'Bata tudo no liquidificador até ficar homogêneo. Sirva gelado.', porqueFunciona: 'A linhaça tem fitoestrógenos que ajudam a equilibrar os hormônios femininos. Essencial para mulheres que sofrem com TPM, menopausa ou irregularidade menstrual, aliviando sintomas de forma natural.' },
  { number: 10, name: 'Ventre Liso', ingredients: ['2 talos de aipo', '1 pepino médio', '1 limão (suco)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Aipo e pepino são dois dos alimentos mais diuréticos da natureza. Esse suco elimina o excesso de sódio e líquido retido que causa a barriga estufada, deixando o ventre mais liso em poucos dias.' },
  { number: 11, name: 'Antioxidante Rosa', ingredients: ['1 xícara de morango', '1 xícara de framboesa ou amora', '1 colher de chá de mel', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Frutas vermelhas são as mais ricas em antioxidantes que combatem o envelhecimento da pele. Consumidas regularmente, reduzem manchas, melhoram o tom da pele e deixam o rosto mais jovem e luminoso.' },
  { number: 12, name: 'Queima Noturna', ingredients: ['1 pepino médio', '1 limão (suco)', '1 colher de chá de mel', '1 pitada de canela', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e tome antes de dormir.', porqueFunciona: 'A canela tem efeito termogênico que mantém o metabolismo ativo mesmo durante o sono. Com pepino e limão, esse suco potencializa a queima de gordura noturna sem causar insônia.' },
  { number: 13, name: 'Tônico da Beleza', ingredients: ['2 fatias de mamão', '1 laranja (suco)', '1 colher de chá de mel', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'O mamão tem papaína e vitamina A que renovam as células da pele e reduzem acne e manchas. Com laranja, esse suco nutre a pele de dentro pra fora, sendo um dos melhores tônicos naturais da beleza feminina.' },
  { number: 14, name: 'Energia Sem Inchaço', ingredients: ['1 beterraba pequena', '1 maçã', '1 limão (suco)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'A beterraba aumenta a energia e a disposição sem causar retenção de líquidos. Com maçã e água de coco, esse suco dá ânimo para os treinos e atividades do dia sem inchar o corpo.' },
  { number: 15, name: 'Emagrecedor Tropical', ingredients: ['2 fatias de abacaxi', '1 maracujá (polpa)', '1 limão (suco)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'O abacaxi quebra gorduras e o maracujá reduz a ansiedade que leva à compulsão alimentar. Juntos, esse suco emagrece atacando dois dos maiores obstáculos da perda de peso feminina: gordura localizada e fome emocional.' },
  { number: 16, name: 'Desinchaço Expresso', ingredients: ['1 pepino médio', '2 talos de aipo', '1 limão (suco)', '1 pedaço de gengibre (1cm)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Pepino, aipo e gengibre formam a combinação mais eficaz para eliminar retenção de líquidos. Esse suco age em poucas horas, reduzindo o inchaço nas pernas, rosto e abdômen.' },
  { number: 17, name: 'Vitamina da Mulher', ingredients: ['1 banana', '1 xícara de morango', '1 colher de sopa de linhaça', '200ml de leite vegetal', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.', porqueFunciona: 'Essa vitamina combina ferro da linhaça, potássio da banana e antioxidantes do morango. Ideal para mulheres que sentem cansaço, fraqueza e queda de cabelo, sintomas comuns de deficiências nutricionais femininas.' },
  { number: 18, name: 'Pele Sem Acne', ingredients: ['1 cenoura média', '1 maçã verde', '1 limão (suco)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'A cenoura e a maçã verde têm zinco e vitamina A que regulam a produção de sebo da pele. Com limão, esse suco reduz a oleosidade e combate a acne hormonal de dentro pra fora.' },
  { number: 19, name: 'Cintura Fina', ingredients: ['1 maçã verde', '1 pepino médio', '1 limão (suco)', '2 folhas de hortelã', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva bem gelado.', porqueFunciona: 'Maçã verde e pepino têm baixíssimas calorias e alto poder saciante. Esse suco reduz o apetite, elimina o inchaço e potencializa a definição da cintura quando consumido antes das refeições.' },
  { number: 20, name: 'Antienvelhecimento Feminino', ingredients: ['1 xícara de romã (suco ou grãos)', '1 maçã', '1 colher de chá de mel', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'A romã tem três vezes mais antioxidantes que o vinho tinto e estimula a produção de colágeno naturalmente. Consumida regularmente, retarda o envelhecimento da pele, reduz rugas e manchas causadas pelo sol.' },
  { number: 21, name: 'Turbina Cabelo', ingredients: ['1 cenoura média', '1 laranja (suco)', '1 colher de sopa de semente de girassol', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'A semente de girassol é rica em biotina e vitamina E, nutrientes essenciais para o crescimento e fortalecimento dos fios. Com cenoura e laranja, esse suco nutre o couro cabeludo e reduz a queda de cabelo.' },
  { number: 22, name: 'Noite de Beleza', ingredients: ['1 xícara de cereja', '1 banana', '200ml de leite morno', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador. Tome morno 30 minutos antes de dormir.', porqueFunciona: 'A cereja tem melatonina natural que melhora a qualidade do sono. Durante o sono profundo, o corpo produz hormônio do crescimento que repara a pele e os tecidos, tornando esse suco um aliado da beleza noturna.' },
  { number: 23, name: 'Termogênico Feminino', ingredients: ['1 laranja (suco)', '1 pedaço de gengibre (2cm)', '1 pitada de pimenta caiena', '1 colher de mel', '200ml de água morna'], preparo: 'Misture todos os ingredientes. Tome morno pela manhã em jejum.', porqueFunciona: 'Gengibre e pimenta caiena aumentam a temperatura corporal e aceleram o metabolismo por horas após o consumo. Esse shot termogênico potencializa a queima de gordura especialmente quando tomado antes do exercício.' },
  { number: 24, name: 'Equilíbrio Total', ingredients: ['1 maracujá (polpa)', '1 banana', '1 colher de chá de mel', '200ml de leite vegetal'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado ou em temperatura ambiente.', porqueFunciona: 'O maracujá tem flavonoides que reduzem a ansiedade e o cortisol, hormônio do estresse que favorece o acúmulo de gordura abdominal. Com banana, esse suco equilibra o humor e controla a fome emocional.' },
  { number: 25, name: 'Firmeza da Pele', ingredients: ['1 xícara de morango', '1 colher de chá de azeite extra virgem', '1 laranja (suco)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'O azeite fornece esqualeno e vitamina E que combatem a flacidez da pele. Com morango e laranja ricos em vitamina C, esse suco estimula o colágeno e devolve a firmeza à pele do rosto e do corpo.' },
  { number: 26, name: 'Limpeza Intestinal', ingredients: ['2 fatias de mamão', '1 colher de sopa de linhaça', '1 colher de chá de mel', '200ml de água morna'], preparo: 'Bata tudo no liquidificador e tome morno pela manhã em jejum.', porqueFunciona: 'O mamão tem papaína e fibras que regulam o intestino. A linhaça adiciona mucilagem que limpa o intestino de forma suave e natural. Intestino regulado é essencial para o emagrecimento e a saúde da pele feminina.' },
  { number: 27, name: 'Hidratação Profunda', ingredients: ['2 fatias de melancia', '1 pepino médio', '1 limão (suco)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva bem gelado.', porqueFunciona: 'Melancia e pepino têm mais de 95% de água e são ricos em silício, mineral que hidrata a pele de dentro pra fora. Esse suco é o mais hidratante do recetário, essencial para pele seca e sem viço.' },
  { number: 28, name: 'Controle do Apetite', ingredients: ['1 maçã verde', '1 colher de sopa de aveia', '1 limão (suco)', '200ml de água'], preparo: 'Bata tudo no liquidificador e sirva gelado 20 minutos antes das refeições.', porqueFunciona: 'A aveia e a maçã verde têm pectina e fibras solúveis que formam um gel no estômago, prolongando a saciedade. Tomado antes das refeições, reduz o quanto se come sem esforço ou sacrifício.' },
  { number: 29, name: 'Tônico Anti-TPM', ingredients: ['1 banana', '1 xícara de morango', '1 colher de sopa de cacau em pó puro', '200ml de leite vegetal'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.', porqueFunciona: 'O cacau puro é rico em magnésio, mineral que reduz cólicas, irritabilidade e retenção de líquidos durante a TPM. Com banana e morango, esse suco alivia os sintomas hormonais de forma natural e ainda satisfaz a vontade de doce.' },
  { number: 30, name: 'Poder Feminino', ingredients: ['1 beterraba pequena', '1 maçã', '1 cenoura média', '1 limão (suco)', '1 pedaço de gengibre (1cm)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Essa é a receita mais completa do recetário feminino. Beterraba dá energia, cenoura cuida da pele, maçã controla o apetite, gengibre acelera o metabolismo e limão desintoxica. Um suco para a mulher que quer resultado em tudo ao mesmo tempo.' },
];

// ── Capa ───────────────────────────────────────────────────────────────────
function Cover() {
  return (
    <section
      className="relative flex h-[297mm] flex-col overflow-hidden page-break-after print:shadow-none"
      style={{
        backgroundImage: 'url(/capa-suco-mulheres.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}
// ── Ebook ──────────────────────────────────────────────────────────────────
export default function EbookQuatro() {
  return (
    <>
      <Cover />

      {/* Página 2 — Introdução */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Introdução"
        title="Seu corpo não está contra você — ele só precisa de ajuda"
      >
        <div className="space-y-4">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Barriga que não sai mesmo fazendo dieta. Pele sem brilho, apagada. Inchaço que aparece
            do nada e some quando quer. Aquela sensação de que o corpo retém tudo e elimina nada.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Se você já se sentiu assim, saiba que não é falta de força de vontade. É o seu corpo
            pedindo os nutrientes certos para funcionar como foi feito para funcionar.
          </p>

          <InfoBox>
            O corpo feminino é complexo e sensível a variações hormonais, níveis de estresse,
            qualidade do sono e hidratação. Quando um desses fatores sai do equilíbrio, os efeitos
            aparecem imediatamente.
          </InfoBox>

          <SectionTitle emoji="🔬">O que causa o inchaço e a barriga difícil?</SectionTitle>

          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            O inchaço abdominal feminino tem causas diversas: retenção de líquidos por
            desequilíbrio hormonal, inflamação intestinal, excesso de sódio na dieta, variações
            do ciclo menstrual e estresse crônico que eleva o cortisol e favorece o acúmulo de
            gordura abdominal.
          </p>

          <SectionTitle emoji="⚙️">Como funciona no corpo?</SectionTitle>

          <div className="grid grid-cols-2 gap-3">
            <HighlightBox label="💧 Eliminação de líquidos">
              Pepino, aipo e água de coco eliminam o excesso de sódio e líquido que causa inchaço.
            </HighlightBox>
            <HighlightBox label="🔥 Metabolismo">
              Gengibre, pimenta caiena e toranja têm efeito termogênico que aumenta o gasto calórico.
            </HighlightBox>
            <HighlightBox label="✨ Saúde da pele">
              Vitamina C, betacaroteno e vitamina E estimulam o colágeno e renovam as células da pele.
            </HighlightBox>
            <HighlightBox label="🌸 Equilíbrio hormonal">
              Linhaça e maracujá ajudam a regular os hormônios femininos, reduzindo sintomas de TPM.
            </HighlightBox>
          </div>
        </div>
      </PdfContentPage>

      {/* Página 3 — Por que suco + Como usar */}
      <PdfContentPage accentGradient={ACCENT} kicker="Introdução" title="Por que suco e não dieta?">
        <div className="space-y-3.5">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Dietas restritivas criam privação, que gera compulsão, que sabota os resultados. Sucos
            naturais funcionam de forma diferente: eles nutrem o corpo com o que ele precisa,
            reduzindo naturalmente o apetite, os desejos por doce e a retenção de líquidos — sem
            sofrimento.
          </p>

          <InfoBox>
            Você não vai passar fome. Vai passar a dar ao seu corpo o combustível certo.
          </InfoBox>

          <SectionTitle emoji="📖">Como usar este e-book</SectionTitle>

          <div className="space-y-2">
            <BulletItem>Sucos detox e de emagrecimento funcionam melhor tomados em jejum pela manhã</BulletItem>
            <BulletItem>Sucos de pele podem ser tomados em qualquer horário</BulletItem>
            <BulletItem>Sucos calmantes e de sono devem ser tomados à noite</BulletItem>
            <BulletItem>Comece com 1 suco por dia por pelo menos 14 dias para sentir os resultados</BulletItem>
          </div>
        </div>
      </PdfContentPage>

      {chunk(recipes, 2).map((pair, i) => (
        <PdfContentPage
          key={`recipe-${i}`}
          accentGradient={ACCENT}
          kicker="Receitas"
          title="Receitas"
          subtitle={i === 0 ? 'Emagrecimento, Barriga Chapada e Pele Radiante.' : undefined}
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
            <HighlightBox label="🧂 Reduza o sódio">
              O sal em excesso é o principal causador de retenção. Evite processados para potencializar o efeito diurético.
            </HighlightBox>
            <HighlightBox label="😴 Durma bem">
              O sono regula os hormônios da fome e do estresse. Dormir mal eleva o cortisol que favorece o acúmulo de gordura.
            </HighlightBox>
            <HighlightBox label="🚶 Movimento diário">
              Uma caminhada de 30 min por dia combinada com os sucos acelera significativamente os resultados.
            </HighlightBox>
            <HighlightBox label="⏳ Consistência">
              Os sucos de pele precisam de 3 semanas de consumo regular para mostrar resultados visíveis.
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
                <RoutineRow period="Ao acordar (jejum)" suco="Suco detox ou de barriga" />
                <RoutineRow period="Manhã" suco="Suco energético ou de imunidade" />
                <RoutineRow period="Tarde" suco="Suco antioxidante ou de pele" />
                <RoutineRow period="Noite" suco="Suco calmante ou de sono" />
              </tbody>
            </table>
          </div>
        </div>
      </PdfContentPage>

      {/* Página 6 — Encerramento */}
      <PdfContentPage accentGradient={ACCENT} kicker="Encerramento" title="Você merece se sentir bem dentro do seu próprio corpo">
        <div className="space-y-4">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Cuidar da saúde não é punição nem sacrifício. É o ato mais gentil que você pode ter
            consigo mesma.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Cada suco que você preparar é uma mensagem para o seu corpo de que você está prestando
            atenção nele. Que você se importa. E o corpo responde a isso — com energia, com leveza,
            com pele que brilha e com uma disposição que você talvez não sentisse há muito tempo.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Comece hoje. Um copo de cada vez.
          </p>

          <InfoBox>
            Saúde, leveza e beleza para você.
          </InfoBox>
        </div>
      </PdfContentPage>
    </>
  );
}
