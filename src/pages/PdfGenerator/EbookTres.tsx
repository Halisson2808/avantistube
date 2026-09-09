/**
 * PDF 3 — Rota: /pdf/ebook-tres · 50 Sucos Naturais: Detox, Imunidade e Energia
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';

// ── Gradiente da faixa lateral (laranja/âmbar) ─────────────────────────────
const ACCENT = 'linear-gradient(to bottom, hsl(28 85% 52%), hsl(38 82% 48%), hsl(20 80% 44%))';

// ── Tokens de cor ──────────────────────────────────────────────────────────
const C = {
  darkColor:  'hsl(28 70% 18%)',
  color:      'hsl(28 82% 40%)',
  lightBg:    'hsl(38 85% 94%)',
  border:     'hsl(28 70% 78%)',
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

// ── Receitas ────────────────────────────────────────────────────────────────
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
  { number: 1, name: 'Detox Verde Clássico', ingredients: ['2 folhas de couve', '1 maçã verde', '1 limão (suco)', '1 pedaço de gengibre (1cm)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'A couve alcaliniza o organismo e o gengibre ativa a eliminação de toxinas. Com maçã verde e limão, esse é o suco detox mais completo para limpar o corpo de dentro pra fora.' },
  { number: 2, name: 'Detox Escudo Imunológico', ingredients: ['2 laranjas (suco)', '1 limão (suco)', '1 pedaço de gengibre (2cm)', '1 colher de mel', '200ml de água'], preparo: 'Esprema as frutas, bata com o gengibre e a água. Coe e sirva gelado.', porqueFunciona: 'Alta concentração de vitamina C combinada com o poder antibacteriano do gengibre. Esse suco ativa as defesas do organismo e reduz o risco de gripes e infecções.' },
  { number: 3, name: 'Detox Explosão de Energia', ingredients: ['1 beterraba pequena', '1 laranja (suco)', '1 cenoura média', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'A beterraba aumenta o óxido nítrico que melhora a oxigenação do sangue. Com cenoura e laranja, esse suco combate o cansaço e dá energia duradoura sem picos de açúcar.' },
  { number: 4, name: 'Detox Limpeza Total', ingredients: ['1 pepino médio', '1 maçã verde', '1 limão (suco)', '2 folhas de hortelã', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva bem gelado.', porqueFunciona: 'Pepino e maçã verde têm efeito alcalinizante e diurético. A hortelã auxilia na digestão e o limão estimula o fígado, promovendo uma limpeza completa e suave do organismo.' },
  { number: 5, name: 'Detox Vitamina do Sol', ingredients: ['2 fatias de mamão', '1 laranja (suco)', '1 cenoura pequena', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Mamão, laranja e cenoura são ricos em vitamina A e C que fortalecem as mucosas do nariz e garganta, primeira barreira do corpo contra vírus e bactérias.' },
  { number: 6, name: 'Detox Raio Amarelo', ingredients: ['1 manga pequena', '1 laranja (suco)', '1 cenoura média', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Manga e cenoura têm betacaroteno em alta concentração, nutriente que protege as células e melhora a imunidade. A água de coco hidrata e repõe minerais essenciais para o dia a dia.' },
  { number: 7, name: 'Shot Detox Matinal', ingredients: ['1 limão (suco)', '1 pedaço de gengibre (2cm)', '1 pitada de cúrcuma', '1 colher de mel', '100ml de água morna'], preparo: 'Misture todos os ingredientes na água morna e tome como shot em jejum.', porqueFunciona: 'Cúrcuma e gengibre tomados em jejum ativam o fígado e aceleram a eliminação de toxinas acumuladas durante a noite. Um dos rituais matinais mais eficazes para desintoxicação diária.' },
  { number: 8, name: 'Detox Hidratação Profunda', ingredients: ['2 fatias de melancia', '1 pepino médio', '1 limão (suco)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva bem gelado.', porqueFunciona: 'Melancia e pepino têm mais de 95% de água e são ricos em eletrólitos naturais. Esse suco hidrata profundamente, elimina toxinas pelos rins e revitaliza o corpo em qualquer hora do dia.' },
  { number: 9, name: 'Detox Protetor Roxo', ingredients: ['1 xícara de uva roxa', '1 maçã', '1 colher de chá de mel', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'A uva roxa tem resveratrol e antocianinas que protegem as células dos radicais livres. Com maçã, esse suco fortalece a imunidade e melhora a circulação de forma contínua.' },
  { number: 10, name: 'Detox Energia da Terra', ingredients: ['1 beterraba pequena', '1 maçã', '1 cenoura média', '1 limão (suco)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Combinação clássica de raízes e frutas que aumenta a disposição e melhora a oxigenação do sangue. Rico em ferro, vitamina C e betacaroteno, esse suco combate o cansaço crônico naturalmente.' },
  { number: 11, name: 'Detox Antioxidante Vermelho', ingredients: ['1 xícara de morango', '1 xícara de framboesa ou amora', '1 colher de chá de mel', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Frutas vermelhas têm a maior concentração de antioxidantes por grama de qualquer alimento. Esse suco combate os radicais livres, fortalece a imunidade e retarda o envelhecimento celular.' },
  { number: 12, name: 'Detox Digestão Perfeita', ingredients: ['2 fatias de abacaxi', '1 pedaço de gengibre (1cm)', '1 limão (suco)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'O abacaxi tem bromelina que quebra proteínas e melhora a digestão. Com gengibre que reduz o inchaço e limão que alcaliniza, esse suco resolve problemas digestivos de forma rápida e natural.' },
  { number: 13, name: 'Detox Muralha Dourada', ingredients: ['200ml de leite vegetal', '1 col. chá de cúrcuma', '1 col. chá de mel', '1 pitada de pimenta-do-reino', '1 pedaço de gengibre (1cm)'], preparo: 'Aqueça o leite, adicione os demais ingredientes e misture bem. Tome morno.', porqueFunciona: 'Cúrcuma com pimenta-do-reino é uma das combinações anti-inflamatórias mais estudadas da ciência. Fortalece a imunidade, reduz inflamações e protege as células do envelhecimento precoce.' },
  { number: 14, name: 'Detox Frescor Tropical', ingredients: ['2 fatias de abacaxi', '1 maracujá (polpa)', '200ml de água de coco', '1 col. chá de mel'], preparo: 'Bata tudo no liquidificador, coe e sirva bem gelado.', porqueFunciona: 'O abacaxi desintoxica e o maracujá relaxa o sistema nervoso. Com água de coco que hidrata e repõe minerais, esse suco é perfeito para dias quentes ou momentos de estresse.' },
  { number: 15, name: 'Detox Bomba Verde', ingredients: ['1 xícara de espinafre', '1 maçã', '1 limão (suco)', '1 pedaço de gengibre (1cm)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'O espinafre é rico em ferro, magnésio e vitamina K que energizam o corpo e fortalecem o sistema imunológico. Com maçã e gengibre, esse suco verde é completo e fácil de tomar todos os dias.' },
  { number: 16, name: 'Detox Cítrico Poderoso', ingredients: ['1 toranja (grapefruit)', '1 laranja (suco)', '1 limão (suco)', '1 colher de mel', '200ml de água'], preparo: 'Esprema todas as frutas, misture com a água e o mel. Sirva gelado.', porqueFunciona: 'Toranja, laranja e limão formam uma bomba de vitamina C e flavonoides. Esse suco combate inflamações, fortalece as defesas e melhora a absorção de ferro pelo organismo.' },
  { number: 17, name: 'Detox Purificador Matinal', ingredients: ['1 maçã verde', '2 talos de aipo', '1 pepino médio', '1 limão (suco)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Aipo e pepino são diuréticos naturais que eliminam toxinas pelos rins. Com maçã verde e limão, esse suco purifica o organismo pela manhã e prepara o corpo para absorver melhor os nutrientes do dia.' },
  { number: 18, name: 'Detox Vitalidade Total', ingredients: ['1 beterraba pequena', '1 romã (suco)', '1 maçã', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Beterraba e romã são duas das frutas mais ricas em antioxidantes e compostos que melhoram a circulação. Esse suco aumenta a energia, melhora o humor e protege o coração de forma natural.' },
  { number: 19, name: 'Tropical Detox', ingredients: ['2 fatias de abacaxi', '1 pepino médio', '1 limão (suco)', '2 folhas de hortelã', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva bem gelado.', porqueFunciona: 'O abacaxi tem bromelina e o pepino tem silício, dois compostos que limpam o organismo e reduzem inflamações. A hortelã refresca e melhora a digestão, tornando esse suco um detox tropical completo.' },
  { number: 20, name: 'Detox Escudo Tropical', ingredients: ['1 manga pequena', '1 laranja (suco)', '1 pedaço de gengibre (1cm)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'A manga tem vitamina C, B6 e betacaroteno que fortalecem a imunidade. Com gengibre anti-inflamatório e água de coco mineralizante, esse suco é um escudo completo contra doenças sazonais.' },
  { number: 21, name: 'Detox Clareza Mental', ingredients: ['1 xícara de mirtilo ou amora', '1 maçã', '1 col. sopa de nozes picadas', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Mirtilo e nozes são os alimentos mais estudados para saúde cerebral. Antocianinas do mirtilo e ômega-3 das nozes melhoram a memória, o foco e protegem os neurônios do envelhecimento.' },
  { number: 22, name: 'Detox Imunidade em Chamas', ingredients: ['1 laranja (suco)', '1 cenoura média', '1 col. chá de cúrcuma', '1 pedaço de gengibre (1cm)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Cúrcuma e gengibre juntos formam um duo anti-inflamatório e imunoestimulante. Com laranja e cenoura ricos em vitamina C e betacaroteno, esse suco ativa as defesas do organismo em múltiplas frentes.' },
  { number: 23, name: 'Detox Energia Sustentada', ingredients: ['1 banana', '1 col. sopa de aveia', '1 col. chá de mel', '1 pitada de canela', '200ml de leite'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.', porqueFunciona: 'A aveia fornece carboidratos de absorção lenta que mantêm a energia estável por horas. Com banana e mel, esse shake evita picos e quedas de energia, sendo ideal para começar o dia com disposição.' },
  { number: 24, name: 'Detox Renovação Celular', ingredients: ['1 xícara de morango', '1 kiwi', '1 laranja (suco)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Morango, kiwi e laranja formam uma das combinações mais ricas em vitamina C. Esse nutriente é essencial para a produção de colágeno e para a renovação celular que mantém o corpo jovem e funcional.' },
  { number: 25, name: 'Detox Pureza Verde', ingredients: ['2 folhas de couve', '1 pepino médio', '1 maçã verde', '1 limão (suco)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Couve e pepino alcalinizam o sangue e eliminam toxinas acumuladas. Com maçã verde e limão, esse suco verde é um dos mais completos para limpeza do organismo e fortalecimento da imunidade diária.' },
  { number: 26, name: 'Detox Fígado Novo', ingredients: ['1 beterraba pequena', '1 maçã verde', '1 limão (suco)', '1 pedaço de gengibre (1cm)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Beterraba e limão estimulam a produção de bile e auxiliam diretamente na desintoxicação do fígado. Um fígado limpo processa melhor os nutrientes e elimina toxinas com mais eficiência.' },
  { number: 27, name: 'Detox Protetor Solar Interno', ingredients: ['2 cenouras médias', '1 laranja (suco)', '1 col. chá de mel', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'O betacaroteno da cenoura protege a pele dos danos causados pelo sol de dentro pra fora. Com laranja, a vitamina C potencializa esse efeito e melhora a elasticidade da pele naturalmente.' },
  { number: 28, name: 'Detox Anti-Stress', ingredients: ['1 maracujá (polpa)', '1 banana', '1 col. chá de mel', '200ml de leite vegetal'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado ou em temperatura ambiente.', porqueFunciona: 'O maracujá tem flavonoides com efeito calmante comprovado que reduzem o cortisol, hormônio do estresse. Com banana rica em triptofano, esse suco acalma a mente e melhora o humor naturalmente.' },
  { number: 29, name: 'Detox Guerreiro do Inverno', ingredients: ['2 dentes de alho', '1 limão (suco)', '1 pedaço de gengibre (2cm)', '1 colher de mel', '200ml de água morna'], preparo: 'Bata tudo no liquidificador, coe bem e tome como shot pela manhã.', porqueFunciona: 'Alho e gengibre têm compostos antibacterianos e antivirais que ativam o sistema imunológico rapidamente. Esse shot é especialmente eficaz nos meses frios para prevenir gripes e resfriados.' },
  { number: 30, name: 'Detox Desintoxicante Noturno', ingredients: ['1 pepino médio', '1 limão (suco)', '2 folhas de hortelã', '1 col. chá de mel', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e tome antes de dormir.', porqueFunciona: 'O fígado realiza a maior parte da desintoxicação durante a noite. Pepino e limão tomados antes de dormir potencializam esse processo natural, preparando o organismo para acordar mais leve e disposto.' },
  { number: 31, name: 'Detox Coquetel Verde', ingredients: ['1 xícara de espinafre', '1 pepino médio', '1 maçã', '1 limão (suco)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Espinafre e pepino têm clorofila que purifica o sangue e alcaliniza o organismo. Com maçã e limão, esse suco é um dos mais completos para quem quer começar uma rotina de detox de forma simples.' },
  { number: 32, name: 'Detox Raízes e Força', ingredients: ['1 beterraba pequena', '1 cenoura média', '1 pedaço de gengibre (1cm)', '1 laranja (suco)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Beterraba e cenoura são raízes ricas em minerais essenciais para energia e imunidade. Com gengibre e laranja, esse suco robustece o organismo e melhora o desempenho físico e mental do dia a dia.' },
  { number: 33, name: 'Detox Leveza Digestiva', ingredients: ['2 fatias de mamão', '1 pedaço de gengibre (1cm)', '1 limão (suco)', '200ml de água morna'], preparo: 'Bata tudo no liquidificador e sirva morno ou em temperatura ambiente.', porqueFunciona: 'O mamão tem papaína e o gengibre tem gingerol, duas substâncias que melhoram a digestão e reduzem o inchaço abdominal. Ideal para quem sofre com digestão lenta ou desconforto após as refeições.' },
  { number: 34, name: 'Detox Vitamina da Tarde', ingredients: ['1 banana', '1 xícara de morango', '200ml de leite', '1 col. chá de mel'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.', porqueFunciona: 'Banana e morango fornecem energia rápida e antioxidantes que combatem o cansaço da tarde. Rico em potássio e vitamina C, esse shake é um lanche nutritivo que sustenta até a próxima refeição.' },
  { number: 35, name: 'Detox Defesa Cítrica', ingredients: ['2 laranjas (suco)', '1 limão (suco)', '1 col. chá de cúrcuma', '1 colher de mel', '200ml de água'], preparo: 'Esprema as frutas, misture com a água, cúrcuma e mel. Sirva gelado.', porqueFunciona: 'Vitamina C e curcumina atuam em conjunto para fortalecer as defesas do organismo. Esse suco cítrico com cúrcuma é um dos mais eficazes para prevenir inflamações e infecções de forma contínua.' },
  { number: 36, name: 'Detox Purificador Roxo', ingredients: ['1 xícara de uva roxa', '1 beterraba pequena', '1 maçã', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Uva roxa e beterraba têm pigmentos naturais ricos em antioxidantes que purificam o sangue e protegem o coração. Com maçã, esse suco melhora a circulação e elimina toxinas de forma eficaz.' },
  { number: 37, name: 'Detox Energia da Manhã', ingredients: ['1 laranja (suco)', '1 cenoura média', '1 pedaço de gengibre (1cm)', '1 pitada de pimenta caiena', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Gengibre e pimenta caiena aumentam a temperatura corporal e ativam o metabolismo logo pela manhã. Com laranja e cenoura, esse suco dá energia, foco e disposição para começar o dia com força.' },
  { number: 38, name: 'Detox Antioxidante Total', ingredients: ['1 xícara de romã (suco ou grãos)', '1 xícara de mirtilo', '1 col. chá de mel', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Romã e mirtilo são dois dos alimentos com maior índice antioxidante do planeta. Juntos, combatem os radicais livres, protegem as células e reduzem o risco de doenças crônicas com o consumo regular.' },
  { number: 39, name: 'Detox Intestino Limpo', ingredients: ['2 fatias de mamão', '1 col. sopa de linhaça', '1 limão (suco)', '200ml de água morna'], preparo: 'Bata tudo no liquidificador e tome morno pela manhã em jejum.', porqueFunciona: 'Mamão e linhaça têm fibras solúveis que regulam o intestino de forma suave e eficaz. Um intestino funcionando bem é essencial para a imunidade, já que grande parte das defesas do corpo vive no intestino.' },
  { number: 40, name: 'Detox Refrescante Verde', ingredients: ['1 pepino médio', '2 talos de aipo', '1 maçã verde', '2 folhas de hortelã', '200ml de água com gás'], preparo: 'Bata tudo no liquidificador, coe e sirva bem gelado com cubos de gelo.', porqueFunciona: 'Pepino, aipo e maçã verde são diuréticos naturais com baixíssimas calorias. Esse suco elimina toxinas, reduz o inchaço e hidrata profundamente, sendo perfeito para os dias mais quentes.' },
  { number: 41, name: 'Detox Proteção Completa', ingredients: ['1 cenoura média', '1 laranja (suco)', '1 maçã', '1 pedaço de gengibre (1cm)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Essa combinação cobre as principais vitaminas do sistema imunológico: vitamina A da cenoura, C da laranja e compostos anti-inflamatórios do gengibre. Um suco de proteção completa para o dia a dia.' },
  { number: 42, name: 'Detox Força das Raízes', ingredients: ['1 beterraba pequena', '1 cenoura média', '1 maçã', '1 limão (suco)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Beterraba, cenoura e maçã formam um trio nutritivo e energizante. Rico em ferro, betacaroteno e vitamina C, esse suco combate a anemia, melhora a disposição e fortalece o organismo inteiro.' },
  { number: 43, name: 'Detox Digestão Alcalina', ingredients: ['1 pepino médio', '1 limão (suco)', '1 col. chá de mel', '1 pitada de bicarbonato de sódio', '200ml de água'], preparo: 'Misture todos os ingredientes, mexa bem e tome em temperatura ambiente.', porqueFunciona: 'Pepino e limão têm efeito alcalinizante que neutraliza a acidez do estômago. Com uma pitada de bicarbonato, esse suco alivia a azia e melhora o pH interno do organismo de forma rápida e natural.' },
  { number: 44, name: 'Detox Elixir Verde', ingredients: ['1 xícara de espinafre', '1 maçã verde', '1 kiwi', '1 limão (suco)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe e sirva gelado.', porqueFunciona: 'Espinafre, kiwi e limão são ricos em vitamina C, K e magnésio. Esse suco alcaliniza o corpo, fortalece os ossos, melhora a imunidade e dá energia de forma equilibrada e duradoura.' },
  { number: 45, name: 'Detox Tônico da Vitalidade', ingredients: ['1 romã (suco)', '1 beterraba pequena', '1 pedaço de gengibre (1cm)', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Romã e beterraba aumentam o óxido nítrico e melhoram a circulação sanguínea. Com gengibre, esse tônico combate a fadiga, melhora o humor e aumenta a vitalidade de forma rápida e natural.' },
  { number: 46, name: 'Detox Limpeza Profunda', ingredients: ['2 folhas de couve', '1 pepino médio', '1 limão (suco)', '1 pedaço de gengibre (1cm)', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Couve e pepino têm clorofila e silício que limpam o sangue e eliminam metais pesados do organismo. Com gengibre e limão, esse suco realiza uma limpeza profunda e completa do sistema digestivo.' },
  { number: 47, name: 'Detox Vitamina Completa', ingredients: ['1 banana', '1 xícara de morango', '1 kiwi', '200ml de leite vegetal', '1 col. chá de mel'], preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado.', porqueFunciona: 'Banana, morango e kiwi cobrem as principais vitaminas do grupo B, C e potássio. Esse shake nutritivo sustenta a energia, melhora o humor e fornece os micronutrientes essenciais para o funcionamento do organismo.' },
  { number: 48, name: 'Detox Vermelho', ingredients: ['1 beterraba pequena', '1 romã (suco)', '1 limão (suco)', '1 colher de mel', '200ml de água'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'Beterraba e romã limpam o fígado e purificam o sangue de forma poderosa. Com limão, esse detox vermelho é um dos mais eficazes para eliminar toxinas acumuladas e renovar a energia do organismo.' },
  { number: 49, name: 'Detox Escudo Diário', ingredients: ['1 laranja (suco)', '1 limão (suco)', '1 pedaço de gengibre (1cm)', '1 colher de mel', '1 pitada de cúrcuma', '200ml de água'], preparo: 'Esprema as frutas, bata com o gengibre e a água. Adicione o mel e a cúrcuma. Sirva gelado.', porqueFunciona: 'Esse suco reúne vitamina C, gingerol e curcumina em um único copo, formando um escudo imunológico completo. Tomado diariamente, mantém as defesas do organismo sempre ativas e preparadas.' },
  { number: 50, name: 'Detox Elixir da Saúde', ingredients: ['1 maçã', '1 beterraba pequena', '1 cenoura média', '1 limão (suco)', '1 pedaço de gengibre (1cm)', '1 pitada de cúrcuma', '200ml de água de coco'], preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.', porqueFunciona: 'A receita mais completa do receituário. Beterraba para circulação, cenoura para imunidade, maçã para digestão, gengibre anti-inflamatório, limão detox e cúrcuma antioxidante. Um suco que cuida do corpo inteiro em cada gole.' },
];

// ── Capa ───────────────────────────────────────────────────────────────────
function Cover() {
  return (
    <section
      className="relative flex h-[297mm] flex-col overflow-hidden page-break-after print:shadow-none"
      style={{
        backgroundImage: 'url(/capa-detox-natural.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}

// ── Ebook ──────────────────────────────────────────────────────────────────
export default function EbookTres() {
  return (
    <>
      <Cover />

      {/* Página 2 — Introdução */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Introdução"
        title="Seu corpo está pedindo socorro — e você provavelmente não percebeu"
      >
        <div className="space-y-4">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Cansaço constante. Barriga inchada. Sensação de que o corpo não funciona como deveria.
            Sono que não descansa. Aquela indisposição que você foi aceitando como normal com o
            passar dos anos.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Nada disso é normal. É sinal de que seu organismo está sobrecarregado de toxinas,
            inflamações silenciosas e deficiências nutricionais que se acumulam dia após dia —
            causadas pela alimentação industrializada, pelo estresse, pela falta de sono e pelo
            ritmo acelerado da vida moderna.
          </p>

          <InfoBox>
            A boa notícia é que a natureza já criou a solução. E ela é muito mais simples do que
            você imagina.
          </InfoBox>

          <SectionTitle emoji="🧪">O que é detox?</SectionTitle>

          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Detox é o processo natural pelo qual o corpo elimina substâncias tóxicas acumuladas
            nos órgãos, tecidos e sangue. Seu fígado, rins, intestino e pele fazem isso o tempo
            todo — mas quando a carga de toxinas é maior do que a capacidade do organismo de
            eliminar, começa o problema.
          </p>

          <InfoBox>
            Sucos detox não são milagre. Eles são ferramentas que fornecem ao seu corpo os
            nutrientes certos para que ele faça o que já sabe fazer — só que com muito mais
            eficiência.
          </InfoBox>

          <SectionTitle emoji="⚙️">Como funciona no corpo?</SectionTitle>

          <div className="grid grid-cols-2 gap-3">
            <HighlightBox label="Antioxidantes">
              Neutralizam os radicais livres responsáveis pelo envelhecimento celular.
            </HighlightBox>
            <HighlightBox label="Enzimas digestivas">
              Melhoram a absorção de nutrientes e limpam o intestino.
            </HighlightBox>
            <HighlightBox label="Anti-inflamatórios">
              Reduzem inflamações silenciosas que causam cansaço e doenças.
            </HighlightBox>
            <HighlightBox label="Vitaminas e minerais">
              Produzem energia, fortalecem as defesas e renovam as células.
            </HighlightBox>
          </div>
        </div>
      </PdfContentPage>

      {/* Página 3 — Por que suco + Como usar */}
      <PdfContentPage accentGradient={ACCENT} kicker="Introdução" title="Por que suco e não outra forma?">
        <div className="space-y-3.5">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Quando você consome os ingredientes na forma de suco, o organismo absorve os nutrientes
            muito mais rapidamente do que em alimentos sólidos. Não há trabalho digestivo pesado —
            os compostos ativos chegam direto à corrente sanguínea em minutos.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Além disso, um único copo de suco pode reunir a quantidade de nutrientes que levaria
            horas para consumir em alimentos separados. É praticidade e eficiência ao mesmo tempo.
          </p>

          <SectionTitle emoji="📖">Como usar este e-book</SectionTitle>

          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Este receituário foi organizado para ser simples e prático. Cada receita traz os
            ingredientes, o modo de preparo e uma explicação direta de por que aquela combinação
            funciona no seu corpo.
          </p>

          <div className="space-y-2">
            <BulletItem>Leia todas as receitas antes de escolher por onde começar</BulletItem>
            <BulletItem>Prefira ingredientes frescos e orgânicos sempre que possível</BulletItem>
            <BulletItem>Comece com 1 suco por dia e vá aumentando conforme sentir os efeitos</BulletItem>
            <BulletItem>Os sucos são mais eficazes tomados em jejum ou longe das refeições principais</BulletItem>
            <BulletItem>Ouça seu corpo — cada organismo responde de forma diferente</BulletItem>
          </div>
        </div>
      </PdfContentPage>

      {chunk(recipes, 2).map((pair, i) => (
        <PdfContentPage
          key={`recipe-${i}`}
          accentGradient={ACCENT}
          kicker="Receitas"
          title="Receitas"
          subtitle={i === 0 ? 'Detox, Imunidade e Energia para o dia a dia.' : undefined}
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
            <HighlightBox label="💧 Hidratação">
              Beba pelo menos 2 litros de água por dia além dos sucos.
            </HighlightBox>
            <HighlightBox label="⏰ Horário ideal">
              A maioria dos sucos detox são mais eficazes pela manhã em jejum.
            </HighlightBox>
            <HighlightBox label="📅 Consistência">
              Um suco isolado faz pouco. A transformação acontece com consumo regular por 14 dias.
            </HighlightBox>
            <HighlightBox label="🥤 Conservação">
              Consuma logo após o preparo. Se guardar, use vidro fechado e consuma em até 24h.
            </HighlightBox>
          </div>

          <SectionTitle emoji="📅">Montando sua rotina de 7 dias</SectionTitle>

          <div className="overflow-hidden rounded-xl" style={{ border: `1px solid ${C.border}` }}>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr style={{ background: C.lightBg }}>
                  <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: C.darkColor }}>Horário</th>
                  <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: C.darkColor }}>Suco recomendado</th>
                </tr>
              </thead>
              <tbody>
                <RoutineRow period="Manhã (em jejum)" suco="Shot detox ou suco verde" />
                <RoutineRow period="Café da manhã" suco="Vitamina energética com frutas" />
                <RoutineRow period="Tarde" suco="Suco de imunidade ou antioxidante" />
                <RoutineRow period="Noite (opcional)" suco="Suco calmante ou digestivo" />
              </tbody>
            </table>
          </div>
        </div>
      </PdfContentPage>

      {/* Página 6 — Encerramento */}
      <PdfContentPage accentGradient={ACCENT} kicker="Encerramento" title="Você deu o primeiro passo. Agora não pare.">
        <div className="space-y-4">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Mudar a saúde não exige perfeição. Exige consistência. Um suco por dia, feito com
            ingredientes simples que você encontra em qualquer mercado, já é suficiente para começar
            a transformar como seu corpo funciona.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            A natureza colocou tudo que você precisa nas plantas, frutas e raízes que crescem ao
            redor do mundo. Este receituário é apenas o guia para você encontrar o caminho de volta
            a isso.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Cuide do seu corpo. Ele é a única casa que você vai ter para sempre.
          </p>

          <InfoBox>
            Saúde e vitalidade para você e para quem você ama.
          </InfoBox>
        </div>
      </PdfContentPage>

      {/* Página Bônus */}
      <section
        className="relative flex h-[297mm] flex-col overflow-hidden page-break-after print:shadow-none"
        style={{ background: `linear-gradient(160deg, hsl(28 70% 12%) 0%, hsl(28 65% 22%) 50%, hsl(38 60% 28%) 100%)` }}
      >
        {/* Fundo decorativo */}
        <div className="absolute -right-20 -top-20 h-[360px] w-[360px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, hsl(38 90% 70%), transparent 70%)' }} aria-hidden />
        <div className="absolute -bottom-16 -left-16 h-[280px] w-[280px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, hsl(28 80% 60%), transparent 70%)' }} aria-hidden />

        <div className="relative flex flex-1 flex-col items-center justify-center px-14 py-12 text-center">
          {/* Header */}
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: 'hsl(38 90% 72%)' }}>
            Programa Detox Natural
          </div>
          <h1 className="font-display text-[2.2rem] font-bold leading-[1.08] tracking-tight text-white">
            ESPERA, AINDA NÃO ACABOU...
          </h1>
          <div className="mt-4 h-[2px] w-20 rounded-full" style={{ background: 'hsl(38 85% 60%)' }} />
          <p className="mt-4 max-w-[360px] text-[14.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.80)' }}>
            Se você adquiriu nosso Programa hoje, você também leva esses{' '}
            <span className="font-bold text-white">2 Bônus Exclusivos</span> de PRESENTE!
          </p>

          {/* Bônus cards */}
          <div className="mt-8 flex w-full max-w-[440px] flex-col gap-4">
            {/* Bônus 1 */}
            <div className="rounded-2xl px-6 py-5 text-left" style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)' }}>
              <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: 'hsl(38 90% 72%)' }}>
                BÔNUS 1
              </div>
              <div className="font-display text-[1.15rem] font-bold text-white">Checklist Detox Diário</div>
              <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Guia rápido para acompanhar sua rotina de desintoxicação dia a dia. Prático, visual e fácil de seguir.
              </p>
            </div>

            {/* Bônus 2 */}
            <div className="rounded-2xl px-6 py-5 text-left" style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)' }}>
              <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: 'hsl(38 90% 72%)' }}>
                BÔNUS 2
              </div>
              <div className="font-display text-[1.15rem] font-bold text-white">Guia de Hábitos que Sabotam seus Resultados</div>
              <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Descubra o que você está fazendo sem saber que impede seu corpo de se desintoxicar — e como corrigir.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="relative px-14 pb-10 text-center text-[12.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Esses bônus são o complemento perfeito e estão incluídos de presente na sua compra.
        </div>
      </section>

      {/* ── BÔNUS 1 — Plano Detox de 14 Dias ────────────────────────────────── */}

      {/* Bônus 1 / Pág 1 — Como funciona + Dias 1–4 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Bônus 1" title="Plano Detox de 14 Dias" subtitle="Um Suco por Dia para Transformar seu Corpo">
        {/* Como funciona */}
        <div className="mb-2.5 rounded-lg px-3.5 py-2.5" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
          <div className="mb-1 text-[10.5px] font-bold uppercase tracking-widest" style={{ color: C.color }}>Como Funciona</div>
          <p className="mb-1 text-[12px] leading-relaxed text-foreground/85">
            Durante 14 dias, você vai tomar um suco específico por dia, escolhido estrategicamente para guiar seu corpo por uma jornada completa de desintoxicação. Cada dia tem um objetivo diferente.
          </p>
          <div className="grid grid-cols-2 gap-x-4 text-[11px]" style={{ color: C.darkColor }}>
            {['Tome o suco pela manhã, em jejum', 'Beba pelo menos 2 litros de água', 'Não precisa parar de comer', 'Se um dia falhar, continue no seguinte'].map(r => (
              <div key={r} className="flex items-center gap-1.5">
                <span style={{ color: C.color }}>→</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Semana 1 header */}
        <div className="mb-2 px-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: C.color }}>Semana 1 — Preparação e Limpeza</span>
          <p className="text-[10.5px] text-foreground/65 mt-0.5">Nos primeiros 7 dias o foco é preparar o organismo, ativar o fígado e começar a eliminar toxinas acumuladas.</p>
        </div>

        {/* Dias 1–4 */}
        {[
          { n: '1', foco: 'Despertar o Corpo', suco: 'Shot Detox Matinal (limão + gengibre + cúrcuma + mel + água morna)', corpo: 'O gengibre e a cúrcuma em jejum ativam o fígado e sinalizam para o corpo que o processo de limpeza começou. Muitas pessoas já relatam menos inchaço no final do primeiro dia.', esperar: 'Mais vontade de urinar — sinal de que os rins estão respondendo.' },
          { n: '2', foco: 'Hidratar por Dentro', suco: 'Hidratação Profunda (melancia + pepino + limão + água de coco)', corpo: 'A maioria das toxinas é eliminada pelos rins — e para isso o corpo precisa estar bem hidratado. Esse suco hidrata as células de dentro pra fora.', esperar: 'Pele mais luminosa e menos olheiras já nas primeiras 48 horas.' },
          { n: '3', foco: 'Limpar o Fígado', suco: 'Fígado Novo (beterraba + maçã verde + limão + gengibre + água)', corpo: 'Beterraba e limão estimulam a produção de bile, o fluido que o fígado usa para eliminar toxinas. Esse é um dos dias mais importantes do plano.', esperar: 'Leve dor de cabeça é normal — é o fígado trabalhando. Beba mais água.' },
          { n: '4', foco: 'Regular o Intestino', suco: 'Leveza Digestiva (mamão + gengibre + limão + água morna)', corpo: 'A papaína do mamão e o gingerol do gengibre limpam o intestino de forma suave e natural, sem cólicas ou desconforto.', esperar: 'Intestino mais regular e redução do inchaço abdominal.' },
        ].map(({ n, foco, suco, corpo, esperar }) => (
          <div key={n} className="mb-1.5 rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-2 px-3 py-1" style={{ background: C.color }}>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold" style={{ color: C.color }}>{n}</span>
              <span className="font-display text-[12.5px] font-bold text-white">Dia {n} — {foco}</span>
              <span className="ml-auto text-[10px] text-white/70 italic truncate max-w-[180px]">{suco.split('(')[0].trim()}</span>
            </div>
            <div className="px-3 py-1.5" style={{ background: 'white' }}>
              <p className="text-[11px] leading-snug text-foreground/80 mb-1">{corpo}</p>
              <div className="flex items-start gap-1 text-[10.5px]">
                <span className="font-bold shrink-0" style={{ color: C.color }}>Esperar:</span>
                <span className="text-foreground/70">{esperar}</span>
              </div>
            </div>
          </div>
        ))}
      </PdfContentPage>

      {/* Bônus 1 / Pág 2 — Dias 5–7 + início Semana 2 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Bônus 1" title="Plano Detox de 14 Dias" subtitle="Semana 1 — Dias 5 a 7">
        {[
          { n: '5', foco: 'Purificar o Sangue', suco: 'Purificador Roxo', corpo: 'As antocianinas da uva roxa e os pigmentos da beterraba têm ação direta na purificação do sangue, eliminando radicais livres e melhorando a circulação.', esperar: 'Melhora no humor e na disposição mental.' },
          { n: '6', foco: 'Reforçar as Defesas', suco: 'Imunidade em Chamas', corpo: 'Após 5 dias de limpeza, o sistema imunológico precisa ser reforçado. A combinação de vitamina C, betacaroteno e curcumina ativa as células de defesa e prepara o corpo para a segunda semana.', esperar: 'Sensação de corpo mais leve e menos suscetível a gripes.' },
          { n: '7', foco: 'Descanso e Renovação', suco: 'Noite Tranquila — tome à noite', corpo: 'O sétimo dia é de regeneração. O maracujá reduz o cortisol acumulado da semana e a banana fornece triptofano para um sono profundo. Durante o sono dessa noite, o corpo consolida toda a limpeza feita.', esperar: 'Sono mais profundo e acordar com mais energia no dia 8.' },
        ].map(({ n, foco, suco, corpo, esperar }) => (
          <div key={n} className="mb-2 rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: C.color }}>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold" style={{ color: C.color }}>{n}</span>
              <span className="font-display text-[13px] font-bold text-white">Dia {n} — {foco}</span>
              <span className="ml-auto text-[10.5px] italic text-white/80">{suco}</span>
            </div>
            <div className="px-3 py-2" style={{ background: 'white' }}>
              <p className="text-[11.5px] leading-relaxed text-foreground/80 mb-1.5">{corpo}</p>
              <div className="flex items-start gap-1.5 text-[11px]">
                <span className="font-bold shrink-0" style={{ color: C.color }}>Esperar:</span>
                <span className="text-foreground/70">{esperar}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Semana 2 header */}
        <div className="mt-3 rounded-lg px-3.5 py-2.5" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.2em]" style={{ color: C.color }}>Semana 2 — Energia, Vitalidade e Renovação</div>
          <p className="mt-0.5 text-[11.5px] text-foreground/80">Na segunda semana, o corpo já está mais limpo. O foco agora é energia, renovação celular e manutenção dos resultados.</p>
        </div>
      </PdfContentPage>

      {/* Bônus 1 / Pág 3 — Dias 8–11 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Bônus 1" title="Plano Detox de 14 Dias" subtitle="Semana 2 — Dias 8 a 11">
        {[
          { n: '8',  foco: 'Energia Renovada',        suco: 'Explosão de Energia',  corpo: 'Com o fígado e intestino mais limpos, o corpo absorve nutrientes com muito mais eficiência. A energia chega mais rápido e dura mais tempo.', esperar: 'Disposição visivelmente maior em comparação à semana anterior.' },
          { n: '9',  foco: 'Renovar as Células',      suco: 'Renovação Celular',    corpo: 'A vitamina C em alta concentração estimula a produção de colágeno e acelera a renovação celular. Pele, articulações e vasos sanguíneos se beneficiam diretamente.', esperar: 'Pele com mais brilho e firmeza, lábios mais hidratados.' },
          { n: '10', foco: 'Fortalecer o Coração',    suco: 'Vitalidade Total',     corpo: 'Beterraba e romã juntas formam a combinação mais estudada para saúde cardiovascular natural. Melhoram a pressão, reduzem o colesterol oxidado e protegem as artérias.', esperar: 'Sensação de coração mais leve e menos cansaço ao se movimentar.' },
          { n: '11', foco: 'Clareza Mental',           suco: 'Clareza Mental',      corpo: 'Após 10 dias de limpeza e nutrição, o cérebro está mais receptivo. O ômega-3 das nozes e as antocianinas do mirtilo chegam com muito mais eficiência aos neurônios.', esperar: 'Foco aguçado, memória mais ágil e menos névoa mental.' },
        ].map(({ n, foco, suco, corpo, esperar }) => (
          <div key={n} className="mb-2 rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: C.color }}>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold" style={{ color: C.color }}>{n}</span>
              <span className="font-display text-[13px] font-bold text-white">Dia {n} — {foco}</span>
              <span className="ml-auto text-[10.5px] italic text-white/80">{suco}</span>
            </div>
            <div className="px-3 py-2" style={{ background: 'white' }}>
              <p className="text-[11.5px] leading-relaxed text-foreground/80 mb-1.5">{corpo}</p>
              <div className="flex items-start gap-1.5 text-[11px]">
                <span className="font-bold shrink-0" style={{ color: C.color }}>Esperar:</span>
                <span className="text-foreground/70">{esperar}</span>
              </div>
            </div>
          </div>
        ))}
      </PdfContentPage>

      {/* Bônus 1 / Pág 4 — Dias 12–14 + Resumo */}
      <PdfContentPage accentGradient={ACCENT} kicker="Bônus 1" title="Plano Detox de 14 Dias" subtitle="Semana 2 — Dias 12 a 14 e Resumo Completo">
        {[
          { n: '12', foco: 'Anti-Inflamatório Total', suco: 'Muralha Dourada',     corpo: 'A inflamação crônica de baixo grau é a raiz de quase todas as doenças modernas. Esse suco age diretamente nessa inflamação silenciosa, protegendo células, articulações e órgãos.', esperar: 'Menos dores no corpo, articulações mais soltas e disposição para se movimentar.' },
          { n: '13', foco: 'Blindagem Final',         suco: 'Escudo Diário',       corpo: 'Penúltimo dia do plano. Vitamina C, gingerol e curcumina criam um escudo imunológico completo — proteção final antes do encerramento.', esperar: 'Sistema imunológico no pico. Sensação de proteção e vitalidade.' },
          { n: '14', foco: 'Elixir da Conquista',     suco: 'Elixir da Saúde',    corpo: 'O suco mais completo do receituário para encerrar o plano mais completo da sua rotina. Cada ingrediente representa um dos sistemas que você limpou e fortaleceu durante os 14 dias.', esperar: 'Uma versão mais leve, mais disposta e mais saudável de você mesmo.' },
        ].map(({ n, foco, suco, corpo, esperar }) => (
          <div key={n} className="mb-2 rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: C.color }}>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold" style={{ color: C.color }}>{n}</span>
              <span className="font-display text-[13px] font-bold text-white">Dia {n} — {foco}</span>
              <span className="ml-auto text-[10.5px] italic text-white/80">{suco}</span>
            </div>
            <div className="px-3 py-2" style={{ background: 'white' }}>
              <p className="text-[11.5px] leading-relaxed text-foreground/80 mb-1.5">{corpo}</p>
              <div className="flex items-start gap-1.5 text-[11px]">
                <span className="font-bold shrink-0" style={{ color: C.color }}>Esperar:</span>
                <span className="text-foreground/70">{esperar}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Resumo tabela compacta */}
        <div className="mt-2">
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: C.color }}>Resumo do Plano</div>
          <div className="grid grid-cols-2 gap-x-3">
            {[
              ['1','Despertar o corpo','Shot Detox Matinal'],['2','Hidratar por dentro','Hidratação Profunda'],
              ['3','Limpar o fígado','Fígado Novo'],['4','Regular o intestino','Leveza Digestiva'],
              ['5','Purificar o sangue','Purificador Roxo'],['6','Reforçar as defesas','Imunidade em Chamas'],
              ['7','Descanso e renovação','Noite Tranquila'],['8','Energia renovada','Explosão de Energia'],
              ['9','Renovar as células','Renovação Celular'],['10','Fortalecer o coração','Vitalidade Total'],
              ['11','Clareza mental','Clareza Mental'],['12','Anti-inflamatório','Muralha Dourada'],
              ['13','Blindagem final','Escudo Diário'],['14','Elixir da conquista','Elixir da Saúde'],
            ].map(([n, foco, suco]) => (
              <div key={n} className="flex items-center gap-1.5 py-0.5 border-b text-[10.5px]" style={{ borderColor: C.border }}>
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: C.color }}>{n}</span>
                <span className="font-medium shrink-0" style={{ color: C.darkColor }}>{foco}</span>
                <span className="text-foreground/50 truncate">· {suco}</span>
              </div>
            ))}
          </div>
        </div>
      </PdfContentPage>

      {/* Bônus 1 / Pág 5 — Após os 14 dias + Encerramento */}
      <PdfContentPage accentGradient={ACCENT} kicker="Bônus 1" title="Plano Detox de 14 Dias" subtitle="O Que Fazer Após os 14 Dias">
        <p className="mb-3 text-[13px] leading-relaxed text-foreground/85">
          Parabéns. Seu corpo passou por uma transformação real. Agora você tem duas opções:
        </p>

        <div className="mb-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl px-4 py-4" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wide" style={{ color: C.color }}>Opção 1 — Repetir o Plano</div>
            <p className="text-[12.5px] leading-relaxed text-foreground/80">
              Faça mais um ciclo de 14 dias. Os resultados se aprofundam a cada ciclo, especialmente para pele, peso e energia.
            </p>
          </div>
          <div className="rounded-xl px-4 py-4" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wide" style={{ color: C.color }}>Opção 2 — Manutenção Livre</div>
            <p className="text-[12.5px] leading-relaxed text-foreground/80">
              Use o receituário principal de forma livre, escolhendo os sucos que mais gosta. O hábito já está formado — agora é só manter.
            </p>
          </div>
        </div>

        <div className="mb-4 rounded-lg px-4 py-3" style={{ background: C.color }}>
          <p className="text-[13px] font-semibold text-white text-center">
            Em ambos os casos: continue bebendo pelo menos 1 suco por dia.<br />
            É o hábito mais simples e poderoso que você pode ter pela sua saúde.
          </p>
        </div>

        <div className="rounded-xl px-5 py-5 text-center" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: C.color }}>Encerramento</div>
          <p className="mb-3 font-display text-[1.1rem] font-semibold leading-snug" style={{ color: C.darkColor }}>
            Quatorze dias. Quatorze sucos.<br />Uma versão melhor de você.
          </p>
          <p className="text-[12.5px] leading-relaxed text-foreground/80">
            Não foi sobre perfeição. Foi sobre aparecer todos os dias e fazer algo bom pelo seu corpo. E você fez isso.
          </p>
          <p className="mt-3 font-semibold text-[13px]" style={{ color: C.color }}>
            Continue. Seu corpo agradece.
          </p>
        </div>
      </PdfContentPage>

      {/* ── BÔNUS 2 — Guia de Hábitos ─────────────────────────────────────────── */}

      {/* Bônus 2 / Pág 1 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Bônus 2" title="Hábitos que Sabotam seus Resultados" subtitle="O que você está fazendo sem saber que impede seu corpo de se desintoxicar">
        <p className="mb-3 text-[12.5px] leading-relaxed text-foreground/85">
          Você está tomando os sucos, bebendo mais água, tentando comer melhor. Mas algo ainda não está funcionando. O problema muitas vezes não está no que você está fazendo — está no que você <strong>continua fazendo sem perceber</strong> que está sabotando tudo.
        </p>

        {[
          {
            n: '1', title: 'Beber Pouca Água',
            corpo: 'As toxinas que seu fígado processa precisam ser eliminadas pelos rins. Sem água suficiente, essas toxinas ficam circulando no sangue. O resultado é cansaço, dor de cabeça e pele sem viço.',
            fix: ['Beba pelo menos 2 litros de água por dia, além dos sucos', 'Comece o dia com 1 copo antes de qualquer outra coisa', 'Se não gosta de água pura, adicione rodelas de limão ou hortelã'],
          },
          {
            n: '2', title: 'Dormir Mal ou Pouco',
            corpo: 'É durante o sono profundo que o fígado realiza a maior parte da desintoxicação. Dormir menos de 7 horas interrompe esse processo — é como tentar limpar a casa com a vassoura pela metade.',
            fix: ['Durma entre 7 e 9 horas por noite', 'Evite telas pelo menos 30 minutos antes de dormir', 'Tome o suco calmante do receituário 30 minutos antes de deitar'],
          },
          {
            n: '3', title: 'Estresse Crônico',
            corpo: 'O estresse eleva o cortisol, hormônio que em excesso bloqueia a queima de gordura, inflama o intestino e enfraquece a imunidade. Você pode tomar todos os sucos do mundo — se o cortisol estiver alto, os resultados serão limitados.',
            fix: ['Reserve 5 a 10 minutos por dia para respiração profunda', 'Faça caminhadas ao ar livre — 20 minutos já reduzem o cortisol', 'Reduza o consumo de notícias e redes sociais pela manhã'],
          },
        ].map(({ n, title, corpo, fix }) => (
          <div key={n} className="mb-2.5 rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: C.color }}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold" style={{ color: C.color }}>{n}</span>
              <span className="font-display text-[13px] font-bold text-white">Sabotador {n}: {title}</span>
            </div>
            <div className="px-3 py-2" style={{ background: 'white' }}>
              <p className="mb-1.5 text-[11.5px] leading-relaxed text-foreground/80">{corpo}</p>
              <div className="text-[10.5px] font-bold uppercase tracking-wide mb-1" style={{ color: C.darkColor }}>Como corrigir:</div>
              {fix.map(f => (
                <div key={f} className="flex items-start gap-1.5 mb-0.5">
                  <span className="text-[11px] font-bold shrink-0" style={{ color: C.color }}>✓</span>
                  <span className="text-[11px] leading-tight text-foreground/80">{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </PdfContentPage>

      {/* Bônus 2 / Pág 2 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Bônus 2" title="Hábitos que Sabotam seus Resultados" subtitle="Sabotadores 4 a 6">
        {[
          {
            n: '4', title: 'Excesso de Açúcar Refinado',
            corpo: 'O açúcar refinado inflama o fígado, alimenta bactérias ruins no intestino e gera picos de insulina que favorecem o acúmulo de gordura. Cada colher de açúcar branco é um passo para trás no detox.',
            fix: ['Substitua o açúcar branco por mel, tâmara ou frutas maduras', 'Leia os rótulos — açúcar se esconde em molhos, pães e bebidas prontas', 'Quando a vontade de doce aparecer, tome um suco de frutas do receituário', 'Reduza gradualmente — cortar tudo de vez gera compulsão e recaída'],
          },
          {
            n: '5', title: 'Intestino Preso',
            corpo: 'O intestino é o principal canal de eliminação de toxinas. Quando ele não funciona, as toxinas que deveriam ser eliminadas nas fezes são reabsorvidas pelo sangue — gerando inchaço, pele ruim e cansaço.',
            fix: ['Beba mais água — a causa número 1 de intestino preso é desidratação', 'Consuma os sucos com mamão, linhaça e abacaxi do receituário', 'Aumente o consumo de fibras: frutas com casca, legumes, aveia', 'Movimente-se — uma caminhada de 20 minutos estimula o intestino'],
          },
          {
            n: '6', title: 'Comer Rápido e Sem Atenção',
            corpo: 'Quando você come rápido, o estômago recebe pedaços grandes que não consegue digerir eficientemente. O resultado é fermentação, gases, inchaço e absorção deficiente — o oposto do que você quer com o detox.',
            fix: ['Mastigue cada garfada pelo menos 20 vezes', 'Desligue a TV e o celular durante as refeições', 'Pare de comer quando sentir 80% de saciedade — o sinal chega com 20 minutos de atraso'],
          },
        ].map(({ n, title, corpo, fix }) => (
          <div key={n} className="mb-2.5 rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: C.color }}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold" style={{ color: C.color }}>{n}</span>
              <span className="font-display text-[13px] font-bold text-white">Sabotador {n}: {title}</span>
            </div>
            <div className="px-3 py-2" style={{ background: 'white' }}>
              <p className="mb-1.5 text-[11.5px] leading-relaxed text-foreground/80">{corpo}</p>
              <div className="text-[10.5px] font-bold uppercase tracking-wide mb-1" style={{ color: C.darkColor }}>Como corrigir:</div>
              {fix.map(f => (
                <div key={f} className="flex items-start gap-1.5 mb-0.5">
                  <span className="text-[11px] font-bold shrink-0" style={{ color: C.color }}>✓</span>
                  <span className="text-[11px] leading-tight text-foreground/80">{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </PdfContentPage>

      {/* Bônus 2 / Pág 3 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Bônus 2" title="Hábitos que Sabotam seus Resultados" subtitle="Sabotadores 7 a 10 + Resumo Final">
        {[
          {
            n: '7', title: 'Álcool e Cafeína em Excesso',
            corpo: 'O álcool ocupa toda a capacidade do fígado enquanto é metabolizado — durante esse tempo, a desintoxicação de outras substâncias fica pausada. A cafeína em excesso desidrata e perturba o sono.',
            fix: ['Reduza o álcool ao máximo durante o período de detox', 'Limite o café a 1 ou 2 xícaras pela manhã, sem açúcar', 'Substitua o café da tarde por chá de ervas ou suco energético'],
          },
          {
            n: '8', title: 'Alimentos Ultraprocessados Escondidos',
            corpo: 'Conservantes, corantes e adoçantes artificiais inflamam o intestino e sobrecarregam o fígado. O pior: muitos parecem saudáveis — barras de cereal, iogurtes com sabor, sucos de caixinha.',
            fix: ['Se tem mais de 5 ingredientes no rótulo, pense bem antes de consumir', 'Troque sucos de caixinha pelos sucos do receituário', 'Cozinhe mais em casa — você sabe o que está colocando na comida'],
          },
          {
            n: '9', title: 'Sedentarismo',
            corpo: 'O sistema linfático depende do movimento muscular para funcionar. Sem movimento, ele fica estagnado e as toxinas se acumulam nos tecidos.',
            fix: ['Caminhe pelo menos 20 a 30 minutos por dia', 'Se trabalha sentado, levante e ande 5 minutos a cada hora', 'Alongamentos simples já ajudam a estimular o sistema linfático'],
          },
          {
            n: '10', title: 'Impaciência com o Processo',
            corpo: 'O maior sabotador de todos. O corpo humano não se desintoxica em 3 dias. Quem abandona a rotina antes de 14 dias raramente vê resultados — e culpa o método quando o problema foi a consistência.',
            fix: ['Comprometa-se com pelo menos 14 dias antes de avaliar resultados', 'Use o Checklist Detox Diário para acompanhar o progresso', 'Celebre pequenas vitórias: mais energia, menos inchaço, sono melhor'],
          },
        ].map(({ n, title, corpo, fix }) => (
          <div key={n} className="mb-2 rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: C.color }}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold" style={{ color: C.color }}>{n}</span>
              <span className="font-display text-[13px] font-bold text-white">Sabotador {n}: {title}</span>
            </div>
            <div className="px-3 py-2" style={{ background: 'white' }}>
              <p className="mb-1 text-[11px] leading-relaxed text-foreground/80">{corpo}</p>
              <div className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: C.darkColor }}>Como corrigir:</div>
              {fix.map(f => (
                <div key={f} className="flex items-start gap-1.5 mb-0.5">
                  <span className="text-[10.5px] font-bold shrink-0" style={{ color: C.color }}>✓</span>
                  <span className="text-[10.5px] leading-tight text-foreground/80">{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <InfoBox>
          Nenhum suco do mundo vai funcionar se você continuar alimentando os hábitos que criaram o problema. Corrija um sabotador por semana. <strong>Seu corpo tem tudo que precisa para se curar. Agora é só parar de atrapalhar.</strong>
        </InfoBox>
      </PdfContentPage>
    </>
  );
}
