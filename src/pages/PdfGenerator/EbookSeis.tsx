/**
 * PDF 6 — Rota: /pdf/ebook-seis · Sucos para Crianças: Nutritivos, Gostosos e Divertidos
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';

// ── Gradiente da faixa lateral (amarelo vibrante) ─────────────────────────
const ACCENT = 'linear-gradient(to bottom, hsl(38 90% 52%), hsl(28 88% 50%), hsl(48 85% 46%))';

// ── Tokens de cor ──────────────────────────────────────────────────────────
const C = {
  darkColor: 'hsl(38 80% 18%)',
  color:     'hsl(38 88% 42%)',
  lightBg:   'hsl(45 90% 93%)',
  border:    'hsl(38 80% 76%)',
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
  { number: 1, name: 'Suco do Super-Herói', ingredients: ['2 fatias de melancia', '1 morango', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado com canudinho colorido.', porqueFunciona: 'A melancia hidrata e repõe minerais essenciais. O morango adiciona vitamina C que fortalece a imunidade das crianças de forma natural e saborosa.' },
  { number: 2, name: 'Vitamina Amarela', ingredients: ['1 banana', '1 manga pequena', '200ml de leite', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.', porqueFunciona: 'Banana e manga juntas fornecem energia rápida e duradoura. Ricas em potássio e vitamina A, ajudam no crescimento saudável e na disposição para brincar e estudar.' },
  { number: 3, name: 'Suco Arco-Íris', ingredients: ['1 cenoura pequena', '1 laranja (suco)', '1 fatia de abacaxi', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Combinação rica em betacaroteno e vitamina C, que protege a visão e fortalece as defesas do organismo. Ideal para crianças em fase escolar.' },
  { number: 4, name: 'Shake do Crescimento', ingredients: ['1 banana', '1 colher de sopa de aveia', '200ml de leite', '1 colher de chá de mel', '1 pitada de canela'], preparo: 'Bata tudo no liquidificador até ficar homogêneo. Sirva gelado ou em temperatura ambiente.', porqueFunciona: 'A aveia fornece carboidratos complexos e fibras que sustentam a energia por horas. Com o leite e a banana, esse shake apoia o crescimento muscular e ósseo das crianças.' },
  { number: 5, name: 'Suco Detetive', ingredients: ['1 maçã', '1 pera', '1 colher de chá de mel', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Maçã e pera são ricas em fibras solúveis que regulam o intestino das crianças. O sabor suave agrada até os mais resistentes a frutas.' },
  { number: 6, name: 'Poção Mágica Verde', ingredients: ['1 maçã', '1 kiwi', '1 fatia de abacaxi', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado. Pode adicionar cubos de gelo.', porqueFunciona: 'O kiwi tem mais vitamina C que a laranja. Com abacaxi e maçã, esse suco reforça a imunidade e melhora a digestão de forma divertida e colorida.' },
  { number: 7, name: 'Suco do Leão', ingredients: ['2 laranjas (suco)', '1 cenoura média', '1 colher de chá de mel', '200ml de água'], preparo: 'Esprema as laranjas, bata a cenoura com a água, coe e misture tudo. Sirva gelado.', porqueFunciona: 'Rico em vitamina C e betacaroteno, esse suco protege contra gripes e resfriados. A cenoura ainda ajuda na saúde dos olhos e da pele das crianças.' },
  { number: 8, name: 'Shake Roxo Mágico', ingredients: ['1 xícara de uva roxa', '1 banana', '200ml de leite', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.', porqueFunciona: 'A uva roxa é rica em antioxidantes que protegem as células. Com banana e leite, esse shake vira uma refeição nutritiva que as crianças adoram pelo sabor adocicado natural.' },
  { number: 9, name: 'Suco da Sereia', ingredients: ['1 xícara de morango', '1 xícara de melancia', '200ml de água de coco', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador, coe e sirva bem gelado.', porqueFunciona: 'Morango e melancia hidratam profundamente e são carregados de vitamina C. Perfeito para dias quentes, repõe energia e minerais perdidos nas brincadeiras.' },
  { number: 10, name: 'Vitamina do Astronauta', ingredients: ['1 banana', '1 xícara de morango', '200ml de leite', '1 colher de sopa de aveia', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador até ficar homogêneo. Sirva gelado.', porqueFunciona: 'Combinação completa de carboidratos, proteínas e antioxidantes. Sustenta a energia das crianças por horas e apoia o desenvolvimento muscular e cerebral.' },
  { number: 11, name: 'Suco do Dinossauro', ingredients: ['1 fatia de abacaxi', '1 maçã verde', '1 pedaço pequeno de gengibre (0,5cm)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'O abacaxi tem bromelina que melhora a digestão. A maçã verde e o toque suave de gengibre reforçam a imunidade sem deixar o sabor forte demais para as crianças.' },
  { number: 12, name: 'Shake da Princesa', ingredients: ['1 xícara de morango', '1 banana', '200ml de iogurte natural', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.', porqueFunciona: 'O iogurte fornece probióticos que equilibram a flora intestinal das crianças. Com morango e banana, esse shake apoia a imunidade e a saúde digestiva de forma deliciosa.' },
  { number: 13, name: 'Suco Tropical Feliz', ingredients: ['2 fatias de mamão', '1 laranja (suco)', '200ml de água de coco', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'O mamão é rico em vitamina A e papaína, que melhoram a digestão e fortalecem as mucosas. Com a laranja e água de coco, esse suco hidrata e protege contra infecções.' },
  { number: 14, name: 'Poção do Sono Feliz', ingredients: ['1 banana', '200ml de leite morno', '1 colher de chá de mel', '1 pitada de canela'], preparo: 'Bata tudo no liquidificador. Sirva morno 30 minutos antes de dormir.', porqueFunciona: 'A banana é rica em triptofano e magnésio, que ajudam o cérebro das crianças a relaxar. O leite morno com mel é um indutor de sono natural sem efeitos colaterais.' },
  { number: 15, name: 'Suco do Pirata', ingredients: ['1 manga pequena', '1 laranja (suco)', '1 cenoura pequena', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Manga, laranja e cenoura formam um trio rico em vitamina A e C, essenciais para a visão, pele e sistema imunológico das crianças em fase de crescimento.' },
  { number: 16, name: 'Shake do Campeão', ingredients: ['1 banana', '1 colher de sopa de pasta de amendoim natural', '200ml de leite', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.', porqueFunciona: 'A pasta de amendoim fornece proteínas e gorduras saudáveis essenciais para o desenvolvimento muscular. Com banana e leite, esse shake é ideal após atividades físicas ou brincadeiras intensas.' },
  { number: 17, name: 'Suco da Fada', ingredients: ['1 xícara de uva verde', '1 maçã', '1 colher de chá de mel', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'A uva verde tem resveratrol e antioxidantes que protegem as células. Com maçã, esse suco regula o intestino e mantém a energia estável ao longo do dia escolar.' },
  { number: 18, name: 'Vitamina do Urso', ingredients: ['2 fatias de melancia', '1 xícara de morango', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva bem gelado.', porqueFunciona: 'Melancia e morango têm altíssimo teor de água e vitamina C. Esse suco hidrata, repõe energia e protege a pele das crianças que passam muito tempo ao sol.' },
  { number: 19, name: 'Suco do Robô', ingredients: ['1 beterraba pequena', '1 maçã', '1 laranja (suco)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'A beterraba é rica em ferro e folato, nutrientes essenciais para o desenvolvimento cerebral das crianças. Com maçã e laranja, o sabor fica suave e agradável mesmo com a beterraba.' },
  { number: 20, name: 'Shake do Fim de Dia', ingredients: ['1 banana', '1 xícara de morango', '1 colher de sopa de aveia', '200ml de leite', '1 colher de chá de mel'], preparo: 'Bata tudo no liquidificador até ficar homogêneo. Sirva gelado ou em temperatura ambiente.', porqueFunciona: 'Rico em magnésio, triptofano e carboidratos de absorção lenta, esse shake acalma as crianças agitadas no fim do dia e prepara o corpo para uma noite de sono reparador.' },
];

// ── Capa ───────────────────────────────────────────────────────────────────
function Cover() {
  return (
    <section
      className="relative flex h-[297mm] flex-col overflow-hidden page-break-after print:shadow-none"
      style={{
        backgroundImage: 'url(/capa-suco-criancas.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}
// ── Ebook ──────────────────────────────────────────────────────────────────
export default function EbookSeis() {
  return (
    <>
      <Cover />

      {/* Página 2 — Introdução */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Introdução"
        title="Fazer seu filho comer bem não precisa ser uma batalha diária"
      >
        <div className="space-y-4">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            A criança que faz cara feia para legumes. Que só quer comer macarrão e biscoito. Que
            você sabe que não está recebendo os nutrientes que precisa para crescer bem, se
            concentrar na escola e ter imunidade forte.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Se você é mãe ou pai, conhece essa situação. E sabe que forçar não funciona.
          </p>

          <InfoBox>
            A solução está em tornar a alimentação saudável irresistível. E sucos naturais com
            nomes divertidos, cores vibrantes e sabores que as crianças adoram são uma das formas
            mais eficazes de fazer isso.
          </InfoBox>

          <SectionTitle emoji="🌱">Por que crianças precisam de nutrição de qualidade?</SectionTitle>

          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            O organismo infantil está em construção. Ossos, músculos, cérebro, sistema imunológico
            — tudo está se desenvolvendo ao mesmo tempo, e cada nutriente tem um papel específico
            nesse processo.
          </p>

          <InfoBox>
            Deficiências nutricionais na infância não aparecem imediatamente. Elas se acumulam e
            podem causar problemas de concentração, imunidade fraca e cansaço excessivo.
          </InfoBox>

          <SectionTitle emoji="⚙️">Como funciona no corpo das crianças?</SectionTitle>

          <div className="grid grid-cols-2 gap-3">
            <HighlightBox label="🦴 Crescimento">
              Cálcio do leite e gergelim, proteínas da aveia e vitamina D para absorção do cálcio e desenvolvimento dos ossos.
            </HighlightBox>
            <HighlightBox label="🛡️ Imunidade">
              Vitamina C da laranja, morango e kiwi que fortalecem as defesas contra vírus e bactérias.
            </HighlightBox>
            <HighlightBox label="🧠 Energia e concentração">
              Carboidratos da banana e aveia, ferro da beterraba e ômega-3 para o desenvolvimento cerebral.
            </HighlightBox>
            <HighlightBox label="🦠 Saúde intestinal">
              Probióticos do iogurte e fibras da maçã e mamão que regulam o intestino e fortalecem a imunidade.
            </HighlightBox>
          </div>
        </div>
      </PdfContentPage>

      {/* Página 3 — Como usar */}
      <PdfContentPage accentGradient={ACCENT} kicker="Introdução" title="Como usar este e-book">
        <div className="space-y-3.5">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            As receitas foram organizadas por objetivo. Cada uma tem um nome divertido que você
            pode usar com a criança para criar curiosidade e entusiasmo.
          </p>

          <div className="space-y-2">
            <BulletItem>Envolva a criança no preparo — deixe ela escolher a fruta, apertar o liquidificador, decorar o copo</BulletItem>
            <BulletItem>Comece pelos sabores mais suaves e vá introduzindo ingredientes novos aos poucos</BulletItem>
            <BulletItem>Use canudinho colorido, copo temático ou cubos de gelo para tornar a experiência mais divertida</BulletItem>
            <BulletItem>Não force — ofereça com entusiasmo e repita. A aceitação vem com o tempo</BulletItem>
            <BulletItem>Adapte as quantidades para a idade e tamanho da criança</BulletItem>
          </div>
        </div>
      </PdfContentPage>

      {chunk(recipes, 2).map((pair, i) => (
        <PdfContentPage
          key={`recipe-${i}`}
          accentGradient={ACCENT}
          kicker="Receitas"
          title="Receitas"
          subtitle={i === 0 ? 'Receitas Nutritivas, Gostosas e Divertidas.' : undefined}
        >
          <div className="flex flex-1 flex-col gap-4">
            {pair.map((r) => <LargeRecipeCard key={r.number} recipe={r} />)}
          </div>
        </PdfContentPage>
      ))}

      {/* Página 5 — Recomendações */}
      <PdfContentPage accentGradient={ACCENT} kicker="Recomendações" title="Como criar o hábito de forma natural">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <HighlightBox label="🕐 Rotina">
              Ofereça o suco no mesmo horário todos os dias. A criança cria expectativa e o hábito se forma em 2 a 3 semanas.
            </HighlightBox>
            <HighlightBox label="📖 Nomes e histórias">
              Use os nomes das receitas para criar histórias. Crianças respondem muito bem a narrativas e personagens.
            </HighlightBox>
            <HighlightBox label="🍽️ Não substitua refeições">
              Os sucos são complementos nutricionais, não substitutos de refeições. Use como lanche da manhã ou da tarde.
            </HighlightBox>
            <HighlightBox label="⚠️ Alergia e intolerância">
              Observe a reação ao introduzir ingrediente novo, especialmente nozes, amendoim e laticínios.
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
                <RoutineRow period="Café da manhã" suco="Vitamina ou shake nutritivo" />
                <RoutineRow period="Lanche da manhã" suco="Suco de frutas simples" />
                <RoutineRow period="Lanche da tarde" suco="Shake energético ou suco de imunidade" />
                <RoutineRow period="Antes de dormir (opcional)" suco="Suco calmante ou vitamina de banana" />
              </tbody>
            </table>
          </div>
        </div>
      </PdfContentPage>

      {/* Página 6 — Encerramento */}
      <PdfContentPage accentGradient={ACCENT} kicker="Encerramento" title="O maior presente que você pode dar ao seu filho é saúde">
        <div className="space-y-4">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Cada copo de suco nutritivo que você prepara para seu filho é um ato de amor. É mais
            do que uma bebida — é um hábito que ele vai carregar para a vida adulta, uma relação
            saudável com a comida que vai protegê-lo por décadas.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Você não precisa ser perfeito. Só precisa começar. Um suco por dia já faz diferença.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            E quando seu filho pedir de novo amanhã, você vai saber que está no caminho certo.
          </p>

          <InfoBox>
            Saúde, crescimento e muito amor.
          </InfoBox>
        </div>
      </PdfContentPage>
    </>
  );
}
