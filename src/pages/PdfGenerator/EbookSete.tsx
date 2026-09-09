/**
 * PDF 7 — Rota: /pdf/ebook-sete · Sucos Anti-Idade: Vitalidade, Memória e Longevidade
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';

// ── Gradiente da faixa lateral (roxo/violeta) ─────────────────────────────
const ACCENT = 'linear-gradient(to bottom, hsl(28 78% 44%), hsl(34 75% 40%), hsl(22 72% 36%))';

// ── Tokens de cor ──────────────────────────────────────────────────────────
const C = {
  darkColor: 'hsl(28 70% 18%)',
  color:     'hsl(28 78% 40%)',
  lightBg:   'hsl(28 60% 93%)',
  border:    'hsl(28 55% 76%)',
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
  { number: 1, name: 'Juventude Dourada', ingredients: ['200ml de leite vegetal', '1 colher de chá de cúrcuma', '1 colher de chá de mel', '1 pitada de pimenta-do-reino', '1 pedaço de gengibre (1cm)'], preparo: 'Aqueça o leite, adicione os demais ingredientes e misture bem. Tome morno pela manhã.', porqueFunciona: 'A cúrcuma com pimenta-do-reino é um dos anti-inflamatórios naturais mais potentes conhecidos. Reduz dores nas articulações e combate o envelhecimento celular de dentro pra fora.' },
  { number: 2, name: 'Coração Forte', ingredients: ['1 beterraba pequena', '1 maçã', '1 cenoura média', '1 limão (suco)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'A beterraba aumenta o óxido nítrico no sangue, melhorando a circulação e reduzindo a pressão arterial. Essencial para quem tem mais de 45 e quer proteger o coração naturalmente.' },
  { number: 3, name: 'Memória Viva', ingredients: ['1 xícara de mirtilo ou amora', '1 maçã', '1 colher de chá de mel', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Mirtilos e amoras são ricos em antocianinas que protegem os neurônios e melhoram a memória. Estudos mostram que o consumo regular dessas frutas reduz o declínio cognitivo com o envelhecimento.' },
  { number: 4, name: 'Articulação Livre', ingredients: ['2 pedaços de abacaxi', '1 pedaço de gengibre (2cm)', '1 limão (suco)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'O abacaxi tem bromelina, enzima com ação anti-inflamatória direta nas articulações. Com gengibre, esse suco alivia dores nos joelhos, quadril e coluna comuns após os 45.' },
  { number: 5, name: 'Escudo Antioxidante', ingredients: ['1 xícara de romã (suco ou grãos)', '1 maçã', '1 colher de chá de mel', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'A romã tem três vezes mais antioxidantes que o vinho tinto. Combate os radicais livres responsáveis pelo envelhecimento precoce e protege o coração e as artérias.' },
  { number: 6, name: 'Ossos de Aço', ingredients: ['200ml de leite', '1 banana', '1 colher de sopa de gergelim', '1 colher de chá de mel', '1 pitada de canela'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.', porqueFunciona: 'O gergelim é uma das fontes vegetais mais ricas em cálcio e magnésio, minerais essenciais para a saúde óssea. Fundamental para prevenir osteoporose após os 45, especialmente em mulheres.' },
  { number: 7, name: 'Pele do Tempo', ingredients: ['1 cenoura média', '1 laranja (suco)', '1 colher de chá de azeite de oliva extra virgem', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'O azeite é rico em vitamina E e gorduras saudáveis que nutrem a pele de dentro pra fora. Com cenoura e laranja, esse suco reduz rugas e manchas, devolvendo luminosidade natural à pele madura.' },
  { number: 8, name: 'Energia Plena', ingredients: ['1 beterraba pequena', '1 laranja (suco)', '1 pedaço de gengibre (1cm)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'A beterraba melhora a oxigenação do sangue e reduz a sensação de cansaço. Com gengibre e laranja, combate a fadiga crônica tão comum após os 45 sem precisar de estimulantes artificiais.' },
  { number: 9, name: 'Digestão Tranquila', ingredients: ['2 fatias de mamão', '1 colher de chá de mel', '1 pedaço de gengibre (1cm)', '200ml de água morna'], preparo: 'Bata tudo no liquidificador e sirva morno ou em temperatura ambiente.', porqueFunciona: 'O mamão tem papaína e o gengibre tem gingerol, duas substâncias que melhoram a digestão e reduzem o inchaço abdominal. Problemas digestivos aumentam com a idade e esse suco trata a causa de forma natural.' },
  { number: 10, name: 'Circulação Ativa', ingredients: ['1 xícara de uva roxa', '1 maçã', '1 colher de chá de mel', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'A uva roxa tem resveratrol, substância que protege as veias e melhora a circulação periférica. Reduz o risco de varizes e sensação de peso nas pernas, queixas frequentes após os 45.' },
  { number: 11, name: 'Fígado Limpo', ingredients: ['1 beterraba pequena', '1 maçã verde', '1 limão (suco)', '1 pedaço de gengibre (1cm)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Beterraba e limão estimulam a produção de bile e auxiliam na desintoxicação do fígado. Com o envelhecimento, o fígado trabalha mais lentamente e esse suco ajuda a manter sua função em dia.' },
  { number: 12, name: 'Sono Profundo', ingredients: ['1 xícara de cereja', '1 banana', '200ml de leite morno', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador. Tome morno 30 minutos antes de dormir.', porqueFunciona: 'A cereja tem melatonina natural em quantidade significativa. Com banana e leite, esse suco combate a insônia que afeta grande parte das pessoas acima dos 45, sem dependência de remédios.' },
  { number: 13, name: 'Pressão Equilibrada', ingredients: ['1 pepino médio', '2 talos de aipo', '1 limão (suco)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Pepino e aipo são naturalmente diuréticos e ricos em potássio, mineral que equilibra a pressão arterial. A água de coco complementa com magnésio, formando um trio poderoso para quem tem pressão alta.' },
  { number: 14, name: 'Testosterona Natural', ingredients: ['1 romã (suco)', '1 colher de sopa de semente de abóbora', '1 colher de chá de mel', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'A romã e a semente de abóbora são conhecidas por apoiar a produção natural de testosterona em homens acima dos 45, combatendo a queda hormonal que causa cansaço, perda muscular e baixa libido.' },
  { number: 15, name: 'Vitamina da Longevidade', ingredients: ['1 maçã', '1 cenoura média', '1 laranja (suco)', '1 colher de chá de cúrcuma', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Combinação completa de betacaroteno, vitamina C e curcumina — três dos antioxidantes mais estudados para longevidade. Protege células, reduz inflamação crônica e mantém a vitalidade com o passar dos anos.' },
  { number: 16, name: 'Equilíbrio Hormonal', ingredients: ['1 xícara de espinafre', '1 banana', '1 colher de sopa de linhaça dourada', '200ml de leite vegetal'], preparo: 'Bata tudo no liquidificador até ficar homogêneo. Sirva gelado.', porqueFunciona: 'A linhaça é rica em lignanas, compostos que ajudam a equilibrar os hormônios naturalmente. Essencial tanto para mulheres na menopausa quanto para homens com queda de testosterona após os 45.' },
  { number: 17, name: 'Anti-Inflamatório Total', ingredients: ['1 pedaço de gengibre (2cm)', '1 colher de chá de cúrcuma', '1 limão (suco)', '1 colher de mel', '200ml de água morna'], preparo: 'Misture todos os ingredientes na água morna. Tome como shot pela manhã em jejum.', porqueFunciona: 'Gengibre e cúrcuma juntos formam a combinação anti-inflamatória mais poderosa da natureza. Consumido em jejum, esse shot reduz a inflamação crônica de baixo grau que acelera o envelhecimento.' },
  { number: 18, name: 'Visão Nítida', ingredients: ['2 cenouras médias', '1 laranja (suco)', '1 colher de chá de mel', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'A cenoura é rica em betacaroteno que o corpo converte em vitamina A, nutriente essencial para a saúde ocular. Protege contra a degeneração macular e ressecamento dos olhos, comuns após os 50.' },
  { number: 19, name: 'Detox Profundo', ingredients: ['1 pepino médio', '1 maçã verde', '1 limão (suco)', '2 folhas de hortelã', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva bem gelado.', porqueFunciona: 'Pepino e maçã verde têm efeito alcalinizante e diurético natural. A hortelã auxilia na digestão e o limão estimula o fígado, promovendo uma limpeza completa do organismo.' },
  { number: 20, name: 'Força Muscular', ingredients: ['1 banana', '1 colher de sopa de pasta de amendoim natural', '1 colher de sopa de aveia', '200ml de leite', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.', porqueFunciona: 'Após os 45, a perda muscular acelera naturalmente. Esse shake fornece proteínas, gorduras saudáveis e carboidratos de qualidade que ajudam a manter e recuperar a massa muscular com o envelhecimento.' },
  { number: 21, name: 'Imunidade Reforçada', ingredients: ['2 dentes de alho', '1 limão (suco)', '1 colher de mel', '1 pedaço de gengibre (1cm)', '200ml de água morna'], preparo: 'Bata tudo no liquidificador, coe bem e tome como shot pela manhã.', porqueFunciona: 'O alho tem alicina, um dos compostos antibacterianos e antivirais mais potentes da natureza. Com gengibre e limão, esse shot fortalece o sistema imunológico que naturalmente enfraquece com a idade.' },
  { number: 22, name: 'Leveza Abdominal', ingredients: ['2 fatias de abacaxi', '1 pedaço de gengibre (1cm)', '2 talos de aipo', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Abacaxi e aipo têm efeito diurético e anti-inflamatório que reduzem o inchaço abdominal. Com gengibre, esse suco melhora a digestão lenta que afeta muitas pessoas acima dos 45.' },
  { number: 23, name: 'Protetor Cerebral', ingredients: ['1 xícara de mirtilo', '1 colher de sopa de nozes picadas', '200ml de leite vegetal', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.', porqueFunciona: 'As nozes têm ômega-3 e vitamina E que protegem os neurônios do envelhecimento. Com mirtilo, esse shake é um dos mais estudados para prevenção de Alzheimer e melhora da memória em adultos maduros.' },
  { number: 24, name: 'Renovação Celular', ingredients: ['1 xícara de morango', '1 kiwi', '1 laranja (suco)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Morango, kiwi e laranja formam uma das combinações mais ricas em vitamina C da natureza. Esse nutriente é essencial para a produção de colágeno, que mantém a pele, articulações e vasos sanguíneos jovens.' },
  { number: 25, name: 'Relaxamento Profundo', ingredients: ['1 maracujá (polpa)', '1 banana', '1 colher de chá de mel', '200ml de leite morno'], preparo: 'Bata tudo no liquidificador. Tome morno 30 minutos antes de dormir.', porqueFunciona: 'O maracujá tem flavonoides com efeito ansiolítico comprovado. Com banana e leite, esse suco reduz a ansiedade e a tensão acumulada no dia a dia, problemas muito comuns após os 45.' },
  { number: 26, name: 'Tireoide Saudável', ingredients: ['1 maçã', '1 cenoura média', '1 colher de chá de gengibre em pó', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'A água de coco é rica em iodo e selênio, minerais essenciais para o funcionamento da tireoide. Problemas na tireoide são comuns após os 45 e esse suco apoia sua função de forma natural.' },
  { number: 27, name: 'Colesterol Equilibrado', ingredients: ['1 maçã verde', '1 limão (suco)', '1 colher de sopa de aveia', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'A aveia tem betaglucana, fibra solúvel comprovadamente eficaz na redução do colesterol ruim. Com maçã verde e limão, esse suco ajuda a manter os níveis de colesterol sob controle naturalmente.' },
  { number: 28, name: 'Vitalidade Masculina', ingredients: ['1 beterraba pequena', '1 romã (suco)', '1 colher de chá de mel', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Beterraba e romã melhoram a circulação sanguínea periférica, o que impacta diretamente na disposição e vitalidade masculina. Essa combinação é especialmente benéfica para homens acima dos 45.' },
  { number: 29, name: 'Pele Radiante', ingredients: ['1 fatia de mamão', '1 laranja (suco)', '1 colher de chá de azeite extra virgem', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'O mamão tem vitamina A e papaína que renovam as células da pele. O azeite fornece vitamina E e gorduras que nutrem profundamente, reduzindo rugas e devolvendo o brilho natural à pele madura.' },
  { number: 30, name: 'Elixir da Longevidade', ingredients: ['1 maçã', '1 beterraba pequena', '1 cenoura média', '1 limão (suco)', '1 pedaço de gengibre (1cm)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Beterraba, cenoura, maçã, gengibre e limão juntos formam um coquetel de antioxidantes, anti-inflamatórios e nutrientes que protegem o coração, o cérebro e as células do envelhecimento acelerado.' },
];

// ── Capa ───────────────────────────────────────────────────────────────────
function Cover() {
  return (
    <section
      className="relative flex h-[297mm] flex-col overflow-hidden page-break-after print:shadow-none"
      style={{
        backgroundImage: 'url(/capa-suco-anti-idade.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}
// ── Ebook ──────────────────────────────────────────────────────────────────
export default function EbookSete() {
  return (
    <>
      <Cover />

      {/* Página 2 — Introdução */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Introdução"
        title="Envelhecer é natural. Envelhecer sem vitalidade não precisa ser."
      >
        <div className="space-y-4">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Você acorda cansado mesmo depois de dormir. As articulações doem de manhã. A memória
            já não é a mesma. A energia some no meio do dia. O corpo parece mais lento, mais
            pesado, mais difícil de cuidar.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Esses sinais são reais. Mas eles não são inevitáveis.
          </p>

          <InfoBox>
            Após os 45, o corpo passa por mudanças significativas: a produção hormonal diminui,
            o metabolismo desacelera, a inflamação crônica de baixo grau aumenta e a capacidade
            de absorver certos nutrientes reduz.
          </InfoBox>

          <SectionTitle emoji="🔬">O que é envelhecimento celular e por que acontece?</SectionTitle>

          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Cada célula do seu corpo tem um relógio biológico. Com o tempo, os radicais livres
            danificam as células e aceleram esse relógio. O resultado visível é o envelhecimento:
            rugas, cansaço, dores, perda muscular e declínio cognitivo.
          </p>

          <InfoBox>
            Antioxidantes neutralizam esses radicais livres. E frutas, vegetais e raízes naturais
            são as fontes mais ricas e biodisponíveis de antioxidantes que existem.
          </InfoBox>

          <SectionTitle emoji="⚙️">Como funciona no corpo após os 45?</SectionTitle>

          <div className="grid grid-cols-2 gap-3">
            <HighlightBox label="🦴 Articulações">
              Bromelina do abacaxi, cúrcuma e gengibre reduzem a inflamação nas juntas e aliviam dores.
            </HighlightBox>
            <HighlightBox label="🫀 Coração">
              Beterraba, romã e uva roxa melhoram o fluxo sanguíneo e protegem as artérias.
            </HighlightBox>
            <HighlightBox label="🧠 Memória">
              Mirtilo, nozes e antioxidantes protegem os neurônios e apoiam a cognição.
            </HighlightBox>
            <HighlightBox label="💪 Ossos e hormônios">
              Cálcio e magnésio do gergelim fortalecem os ossos. Linhaça apoia o equilíbrio hormonal nessa fase.
            </HighlightBox>
          </div>
        </div>
      </PdfContentPage>

      {/* Página 3 — Por que suco + Como usar */}
      <PdfContentPage accentGradient={ACCENT} kicker="Introdução" title="Por que suco e não remédio?">
        <div className="space-y-3.5">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Remédios tratam sintomas. Nutrição trata causas. Os sucos deste receituário não
            substituem tratamentos médicos, mas atuam na raiz de muitos problemas relacionados
            ao envelhecimento: inflamação, deficiência nutricional e estresse oxidativo.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Além disso, são seguros, naturais, sem efeitos colaterais e podem ser consumidos
            junto com qualquer tratamento médico em andamento.
          </p>

          <SectionTitle emoji="📖">Como usar este e-book</SectionTitle>

          <div className="space-y-2">
            <BulletItem>Consulte seu médico se tiver condições de saúde específicas ou usar medicamentos contínuos</BulletItem>
            <BulletItem>Comece devagar — 1 suco por dia — e vá aumentando conforme o corpo responder</BulletItem>
            <BulletItem>Prefira ingredientes frescos e evite adicionar açúcar além do mel indicado nas receitas</BulletItem>
            <BulletItem>Alguns ingredientes como beterraba e cúrcuma podem colorir a urina temporariamente — isso é normal</BulletItem>
          </div>
        </div>
      </PdfContentPage>

      {chunk(recipes, 2).map((pair, i) => (
        <PdfContentPage
          key={`recipe-${i}`}
          accentGradient={ACCENT}
          kicker="Receitas"
          title="Receitas"
          subtitle={i === 0 ? 'Vitalidade, Memória e Longevidade após os 45.' : undefined}
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
            <HighlightBox label="🚶 Movimento">
              Caminhada, natação ou yoga combinados com os sucos potencializam os resultados para articulações, circulação e humor.
            </HighlightBox>
            <HighlightBox label="☀️ Sol diário">
              15 a 20 min de sol por dia aumentam a vitamina D, essencial para ossos, imunidade e humor após os 45.
            </HighlightBox>
            <HighlightBox label="🧘 Redução do estresse">
              O estresse crônico acelera o envelhecimento. Respiração profunda e caminhada na natureza amplificam os efeitos dos sucos.
            </HighlightBox>
            <HighlightBox label="⏳ Paciência">
              O organismo maduro responde mais lentamente. Os resultados são reais, mas pedem consistência de 3 a 4 semanas.
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
                <RoutineRow period="Ao acordar (jejum)" suco="Shot anti-inflamatório ou suco de fígado" />
                <RoutineRow period="Manhã" suco="Suco de energia ou circulação" />
                <RoutineRow period="Tarde" suco="Suco antioxidante ou de memória" />
                <RoutineRow period="Noite" suco="Suco de sono ou relaxamento" />
              </tbody>
            </table>
          </div>
        </div>
      </PdfContentPage>

      {/* Página 6 — Encerramento */}
      <PdfContentPage accentGradient={ACCENT} kicker="Encerramento" title="Os melhores anos da sua vida ainda estão por vir">
        <div className="space-y-4">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Aos 45, 50, 60 anos — você tem décadas de vida pela frente. A questão não é quantos
            anos você vai viver, mas como vai viver esses anos.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Vitalidade, disposição, clareza mental, corpo que funciona bem — tudo isso é possível
            quando você dá ao seu organismo o suporte que ele precisa nessa fase.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Cada suco que você preparar é um passo na direção de uma versão mais forte, mais
            saudável e mais viva de você mesmo.
          </p>

          <InfoBox>
            Vitalidade, saúde e muitos anos ainda pela frente.
          </InfoBox>
        </div>
      </PdfContentPage>
    </>
  );
}
