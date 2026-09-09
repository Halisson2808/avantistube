/**
 * PDF 2 — Rota: /pdf/ebook-dois · Sucos para Imunidade e Sono
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';

// ── Gradiente da faixa lateral (azul-verde saúde) ─────────────────────────
const ACCENT = 'linear-gradient(to bottom, hsl(215 52% 36%), hsl(195 55% 38%), hsl(175 48% 34%))';

// ── Tokens de cor ──────────────────────────────────────────────────────────
const C = {
  darkGreen:   'hsl(145 40% 16%)',
  green:       'hsl(145 45% 34%)',
  greenLight:  'hsl(145 38% 93%)',
  greenBorder: 'hsl(145 35% 78%)',
  blue:        'hsl(215 52% 36%)',
  blueLight:   'hsl(215 50% 93%)',
  blueBorder:  'hsl(215 45% 78%)',
  muted:       'hsl(0 0% 42%)',
};

// ── Tipos de dados ─────────────────────────────────────────────────────────
type Recipe = {
  number: number;
  name: string;
  ingredients: string[];
  preparo: string;
  porqueFunciona: string;
};

// ── Receitas de Imunidade ──────────────────────────────────────────────────
const imunidadeRecipes: Recipe[] = [
  {
    number: 1,
    name: 'Detox Defesa Verde',
    ingredients: ['2 folhas de couve', '1 laranja (suco)', '1 pedaço de gengibre (1cm)', '200ml de água de coco'],
    preparo: 'Bata tudo no liquidificador, coe e sirva gelado.',
    porqueFunciona: 'A couve é carregada de vitamina C e K, que fortalecem as defesas. O gengibre tem ação anti-inflamatória natural e a água de coco hidrata e repõe minerais essenciais.',
  },
  {
    number: 2,
    name: 'Detox Bomba de Vitamina C',
    ingredients: ['2 laranjas (suco)', '1 limão (suco)', '1 cenoura média', '200ml de água'],
    preparo: 'Esprema as laranjas e o limão. Bata a cenoura com a água, coe e misture com os sucos. Sirva gelado.',
    porqueFunciona: 'Combinação clássica de vitamina C em alta concentração. Estimula a produção de glóbulos brancos, as células de defesa contra vírus e bactérias.',
  },
  {
    number: 3,
    name: 'Detox Muralha Dourada',
    ingredients: ['200ml de leite vegetal ou de vaca', '1 col. chá de cúrcuma', '1 col. chá de mel', '1 pitada de pimenta-do-reino'],
    preparo: 'Aqueça o leite, adicione os demais ingredientes e misture bem. Tome morno.',
    porqueFunciona: 'A cúrcuma com pimenta-do-reino é uma das combinações anti-inflamatórias mais poderosas da natureza, fortalecendo a imunidade e reduzindo a ansiedade.',
  },
  {
    number: 4,
    name: 'Detox Soldado do Inverno',
    ingredients: ['1 pedaço de gengibre (2cm)', '2 dentes de alho', '1 limão (suco)', '1 col. mel', '200ml de água morna'],
    preparo: 'Bata tudo no liquidificador, coe bem e tome como shot pela manhã.',
    porqueFunciona: 'Gengibre e alho juntos são antibacterianos e antivirais naturais. Ativa o sistema imunológico rapidamente, ideal em períodos de gripe e resfriado.',
  },
  {
    number: 5,
    name: 'Detox Escudo Tropical',
    ingredients: ['2 fatias de abacaxi', '1 pedaço de gengibre (1cm)', '1 limão (suco)', '200ml de água de coco'],
    preparo: 'Bata tudo no liquidificador, coe e sirva gelado.',
    porqueFunciona: 'O abacaxi tem bromelina, enzima com ação anti-inflamatória que melhora a absorção de nutrientes. Com gengibre e limão, o efeito imunológico é potencializado.',
  },
  {
    number: 6,
    name: 'Detox Imunidade em Chamas',
    ingredients: ['1 laranja (suco)', '1 cenoura média', '1 pedaço de cúrcuma fresca (1cm)', '1 pedaço de gengibre (1cm)', '200ml de água'],
    preparo: 'Bata tudo no liquidificador, coe e sirva gelado.',
    porqueFunciona: 'Cúrcuma e gengibre juntos formam uma dupla anti-inflamatória poderosa. A cenoura e a laranja carregam betacaroteno e vitamina C para aumentar a resistência.',
  },
  {
    number: 7,
    name: 'Detox Protetor Roxo',
    ingredients: ['1 xícara de amora ou mirtilo', '1 maçã', '1 col. chá de mel', '200ml de água'],
    preparo: 'Bata tudo no liquidificador, coe e sirva gelado.',
    porqueFunciona: 'Amoras e mirtilos são ricos em antocianinas, antioxidantes que protegem as células do sistema imunológico. Reduz o tempo de recuperação em resfriados.',
  },
  {
    number: 8,
    name: 'Detox Raiz Forte',
    ingredients: ['1 pedaço de gengibre (2cm)', '1 limão (suco)', '1 col. mel', '1 pitada de pimenta caiena', '200ml de água morna'],
    preparo: 'Misture todos os ingredientes na água morna. Tome como shot ou diluído pela manhã.',
    porqueFunciona: 'A pimenta caiena ativa a circulação e potencializa o efeito do gengibre. Juntos, estimulam o sistema imunológico e combatem vírus e bactérias com eficiência.',
  },
  {
    number: 9,
    name: 'Detox Vitamina do Sol',
    ingredients: ['2 fatias de mamão', '1 laranja (suco)', '1 cenoura pequena', '200ml de água'],
    preparo: 'Bata tudo no liquidificador, coe e sirva gelado.',
    porqueFunciona: 'O mamão é rico em vitamina A, C e papaína, que melhora a absorção de nutrientes. Fortalece as mucosas do nariz e da garganta, primeira barreira contra vírus.',
  },
  {
    number: 10,
    name: 'Detox Guerreiro Cítrico',
    ingredients: ['1 toranja (grapefruit) média', '1 laranja (suco)', '1 limão (suco)', '1 col. mel', '200ml de água'],
    preparo: 'Esprema todas as frutas, misture com a água e o mel. Sirva gelado.',
    porqueFunciona: 'A toranja tem alta concentração de vitamina C e flavonoides, que combatem inflamações. Com laranja e limão, vira uma bomba de antioxidantes cítricos.',
  },
  // Bonus (posição 11 visualmente)
  {
    number: 11,
    name: 'Detox Blindagem Completa',
    ingredients: ['1 beterraba pequena', '1 maçã', '1 cenoura média', '1 limão (suco)', '200ml de água'],
    preparo: 'Bata tudo no liquidificador, coe bem e sirva gelado.',
    porqueFunciona: 'A beterraba aumenta a produção de óxido nítrico, melhorando a circulação e o transporte de nutrientes para as células de defesa. Suco mais completo para o sistema imunológico.',
  },
];

// ── Receitas de Sono ───────────────────────────────────────────────────────
const sonoRecipes: Recipe[] = [
  {
    number: 12,
    name: 'Detox Escudo Noturno',
    ingredients: ['1 copo de leite morno (200ml)', '1 banana madura', '1 col. chá de mel', '1 pitada de canela em pó'],
    preparo: 'Bata tudo no liquidificador por 1 minuto. Tome morno, 30 minutos antes de dormir.',
    porqueFunciona: 'A banana é rica em triptofano, que o corpo converte em serotonina e melatonina. A canela estabiliza o açúcar no sangue durante a noite, evitando despertares.',
  },
  {
    number: 13,
    name: 'Detox Relaxante Azul',
    ingredients: ['1 xícara de uvas roxas', '1 maçã', '1 col. chá de mel', '200ml de água'],
    preparo: 'Bata tudo no liquidificador, coe e sirva em temperatura ambiente ou levemente morno.',
    porqueFunciona: 'As uvas roxas contêm resveratrol e melatonina natural, que regulam o ciclo do sono. A maçã tem quercetina, que reduz a inflamação e acalma o sistema nervoso.',
  },
  {
    number: 14,
    name: 'Detox Noite Tranquila',
    ingredients: ['1 maracujá (polpa)', '1 banana', '200ml de água de coco', '1 col. chá de mel'],
    preparo: 'Bata tudo no liquidificador por 1 minuto. Sirva gelado ou em temperatura ambiente.',
    porqueFunciona: 'O maracujá contém flavonoides com efeito calmante comprovado, reduzindo ansiedade. A banana complementa com triptofano para um sono mais profundo.',
  },
  {
    number: 15,
    name: 'Detox Sono de Criança',
    ingredients: ['1 xícara de cereja (fresca ou congelada)', '1 banana', '200ml de leite', '1 col. chá de mel'],
    preparo: 'Bata tudo no liquidificador até ficar cremoso. Tome 30 minutos antes de dormir.',
    porqueFunciona: 'A cereja é uma das poucas frutas com melatonina natural em quantidade significativa. Com banana e leite, vira um indutor de sono natural e sem efeitos colaterais.',
  },
  {
    number: 16,
    name: 'Detox Veludo Noturno',
    ingredients: ['1 xícara de morango', '1 col. sopa de aveia', '200ml de leite', '1 col. chá de mel'],
    preparo: 'Bata tudo no liquidificador até ficar homogêneo. Tome morno ou gelado antes de dormir.',
    porqueFunciona: 'A aveia é rica em melatonina e magnésio, ligados diretamente à qualidade do sono. O morango adiciona vitamina C e antioxidantes que protegem o organismo durante o descanso.',
  },
  {
    number: 17,
    name: 'Detox Acalma Mente',
    ingredients: ['1 xícara de melão', '1 banana', '1 col. chá de mel', '200ml de água de coco'],
    preparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva gelado ou em temperatura ambiente.',
    porqueFunciona: 'O melão tem alto teor de potássio, que relaxa os músculos e reduz a tensão. Com a banana, o efeito calmante é potencializado, preparando o corpo para um sono tranquilo.',
  },
  {
    number: 18,
    name: 'Detox Noite de Lavanda',
    ingredients: ['1 xícara de uva roxa', '1 pera', '1 col. chá de mel', '200ml de água'],
    preparo: 'Bata tudo no liquidificador, coe e sirva em temperatura ambiente antes de dormir.',
    porqueFunciona: 'A pera tem magnésio e potássio que relaxam o sistema nervoso. A uva roxa adiciona melatonina natural, sendo um aliado direto para quem tem dificuldade de adormecer.',
  },
  {
    number: 19,
    name: 'Detox Silêncio Verde',
    ingredients: ['1 xícara de espinafre', '1 banana', '1 kiwi', '200ml de leite vegetal'],
    preparo: 'Bata tudo no liquidificador até ficar homogêneo. Tome 30 minutos antes de dormir.',
    porqueFunciona: 'O espinafre é rico em magnésio, essencial para o relaxamento muscular e nervoso. O kiwi tem serotonina natural e a banana completa com triptofano para um sono profundo.',
  },
  {
    number: 20,
    name: 'Detox Manto Quente',
    ingredients: ['200ml de leite morno', '1 col. chá de mel', '1 pitada de noz-moscada', '1 pitada de canela'],
    preparo: 'Aqueça o leite, adicione os demais ingredientes e misture bem. Tome morno, 20 minutos antes de dormir.',
    porqueFunciona: 'A noz-moscada tem propriedades sedativas naturais reconhecidas há séculos. Com a canela e o mel, acalma o sistema nervoso e induz um sono mais rápido e reparador.',
  },
];

// ── Componentes auxiliares ──────────────────────────────────────────────────
function SectionTitle({ emoji, children }: { emoji?: string; children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2.5 border-b pb-2.5" style={{ borderColor: C.greenBorder }}>
      {emoji && <span className="text-[1.3rem] leading-none" aria-hidden>{emoji}</span>}
      <h3 className="font-display text-[1.18rem] font-semibold tracking-tight" style={{ color: C.darkGreen }}>
        {children}
      </h3>
    </div>
  );
}

function BlueSectionTitle({ emoji, children }: { emoji?: string; children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2.5 border-b pb-2.5" style={{ borderColor: C.blueBorder }}>
      {emoji && <span className="text-[1.3rem] leading-none" aria-hidden>{emoji}</span>}
      <h3 className="font-display text-[1.18rem] font-semibold tracking-tight" style={{ color: C.blue }}>
        {children}
      </h3>
    </div>
  );
}

function InfoBox({ children, variant = 'green' }: { children: ReactNode; variant?: 'green' | 'blue' }) {
  const bg     = variant === 'blue' ? C.blueLight  : C.greenLight;
  const border = variant === 'blue' ? C.blueBorder : C.greenBorder;
  const color  = variant === 'blue' ? C.blue       : C.green;
  return (
    <div className="overflow-hidden rounded-lg px-3.5 py-2.5 leading-normal" style={{ background: bg, borderLeft: `3px solid ${border}` }}>
      <div className="text-[13px] leading-snug" style={{ color }}>{children}</div>
    </div>
  );
}

function HighlightBox({ label, children, variant = 'green' }: { label: string; children: ReactNode; variant?: 'green' | 'blue' }) {
  const bg     = variant === 'blue' ? C.blueLight  : C.greenLight;
  const border = variant === 'blue' ? C.blueBorder : C.greenBorder;
  const color  = variant === 'blue' ? C.blue       : C.green;
  return (
    <div className="overflow-hidden rounded-xl px-3.5 py-3" style={{ background: bg, border: `1px solid ${border}` }}>
      <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color }}>{label}</div>
      <div className="text-[13px] leading-snug text-foreground/90">{children}</div>
    </div>
  );
}

function BulletItem({ children, variant = 'green' }: { children: ReactNode; variant?: 'green' | 'blue' }) {
  const color = variant === 'blue' ? C.blue : C.green;
  return (
    <div className="flex gap-2.5">
      <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full" style={{ background: color }} aria-hidden />
      <span className="text-[13px] leading-snug text-foreground/90">{children}</span>
    </div>
  );
}

function TipBox({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-md px-2.5 py-1.5 leading-normal" style={{ background: C.greenLight, border: `1px solid ${C.greenBorder}` }}>
      <span className="text-[12px] font-semibold" style={{ color: C.green }}>Dica: </span>
      <span className="text-[12px] text-foreground/90">{children}</span>
    </div>
  );
}

function LargeRecipeCard({ recipe, variant = 'green' }: { recipe: Recipe; variant?: 'green' | 'blue' }) {
  const bg     = variant === 'blue' ? C.blueLight  : C.greenLight;
  const border = variant === 'blue' ? C.blueBorder : C.greenBorder;
  const color  = variant === 'blue' ? C.blue       : C.green;
  const dark   = variant === 'blue' ? C.blue       : C.darkGreen;
  return (
    <div className="avoid-page-break flex-1 rounded-2xl p-4" style={{ background: 'white' }}>
      {/* Cabeçalho */}
      <div className="mb-3 flex items-center gap-3 border-b border-gray-100 pb-3">
        <span
          className="block h-8 w-8 shrink-0 rounded-full text-center text-[13px] font-bold leading-8 text-white"
          style={{ background: color }}
        >
          {recipe.number}
        </span>
        <h4 className="font-display text-[1.1rem] font-semibold leading-tight" style={{ color: dark }}>
          {recipe.name}
        </h4>
      </div>

      {/* Corpo: coluna única */}
      <div className="flex flex-col gap-3">
        {/* Ingredientes */}
        <div className="rounded-xl px-4 py-3" style={{ background: bg }}>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color }}>
            Ingredientes
          </div>
          <div className="space-y-1.5">
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2.5 text-[14px] leading-snug text-foreground/90">
                <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full" style={{ background: color }} aria-hidden />
                {ing}
              </div>
            ))}
          </div>
        </div>

        {/* Preparo */}
        <div>
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color }}>
            Preparo
          </div>
          <p className="text-[14px] leading-snug text-foreground/90">{recipe.preparo}</p>
        </div>

        {/* Por que funciona */}
        <div className="rounded-xl px-4 py-3 leading-normal" style={{ background: bg, borderLeft: `3px solid ${border}` }}>
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color }}>
            Por que funciona
          </div>
          <p className="text-[14px] leading-snug text-foreground/90">{recipe.porqueFunciona}</p>
        </div>
      </div>
    </div>
  );
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}

function RoutineRow({ period, suco }: { period: string; suco: string }) {
  return (
    <tr className="border-t" style={{ borderColor: C.greenBorder }}>
      <td className="px-3 py-2 text-[12px] font-semibold" style={{ color: C.green }}>{period}</td>
      <td className="px-3 py-2 text-[12px] text-foreground/90">{suco}</td>
    </tr>
  );
}

// ── Capa ───────────────────────────────────────────────────────────────────
function Cover() {
  return (
    <section
      className="relative flex h-[297mm] flex-col overflow-hidden page-break-after print:shadow-none"
      style={{
        backgroundImage: 'url(/capa-suco-imunidade.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}
// ── Ebook ──────────────────────────────────────────────────────────────────
export default function EbookDois() {
  return (
    <>
      <Cover />

      {/* Página 2 — Introdução */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Introdução"
        title="Seu corpo se cura enquanto você dorme"
        subtitle="Entenda por que imunidade e sono caminham juntos — e como interromper esse ciclo de dentro pra fora."
      >
        <div className="space-y-4">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Você acorda com o corpo doído mesmo sem ter feito nada. Pega qualquer gripe que aparece.
            Demora semanas para se recuperar de uma infecção simples. À noite, fica horas na cama sem
            conseguir dormir — ou dorme, mas acorda sem energia.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Imunidade fraca e sono ruim raramente aparecem sozinhos. Eles caminham juntos, se
            alimentam um do outro e criam um ciclo difícil de quebrar.
          </p>

          <InfoBox variant="blue">
            Quando você não dorme bem, o sistema imunológico não se recupera adequadamente. Quando a
            imunidade está baixa, o corpo fica em estado de alerta constante que dificulta o sono. E
            assim o ciclo continua.
          </InfoBox>

          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            A solução está em interromper esse ciclo de dentro pra fora — com os nutrientes certos
            para fortalecer as defesas e acalmar o sistema nervoso ao mesmo tempo.
          </p>

          <SectionTitle emoji="🛡️">Como o sistema imunológico funciona?</SectionTitle>

          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            O sistema imunológico é uma rede complexa de células, tecidos e órgãos que trabalham
            juntos para defender o corpo. Ele aprende, se adapta e se fortalece — mas precisa de
            matéria-prima para isso.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <HighlightBox label="Nutrientes essenciais" variant="green">
              Vitamina C, zinco, vitamina D e antioxidantes são os principais combustíveis do sistema imunológico.
            </HighlightBox>
            <HighlightBox label="Consequência da falta" variant="blue">
              Quando esses nutrientes estão em falta, as defesas caem e o corpo fica vulnerável a infecções.
            </HighlightBox>
          </div>
        </div>
      </PdfContentPage>

      {/* Página 3 — Sono + Como usar */}
      <PdfContentPage accentGradient={ACCENT} kicker="Introdução" title="Por que o sono é tão importante para a saúde?">
        <div className="space-y-3.5">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Durante o sono profundo, o corpo produz citocinas — proteínas essenciais para combater
            infecções. Também é durante o sono que o sistema linfático limpa o cérebro de toxinas
            acumuladas durante o dia.
          </p>

          <InfoBox variant="blue">
            Dormir menos de 7 horas por noite reduz em até{' '}
            <strong>50% a eficiência do sistema imunológico</strong>. Você pode tomar todos os
            suplementos do mundo e ainda assim ficar doente com facilidade se não estiver dormindo bem.
          </InfoBox>

          <BlueSectionTitle emoji="⚙️">Como os sucos atuam no corpo?</BlueSectionTitle>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3.5" style={{ background: C.greenLight, border: `1px solid ${C.greenBorder}` }}>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: C.green }}>🍋 Imunidade</div>
              <div className="space-y-1.5">
                <BulletItem>Vitamina C da laranja e limão</BulletItem>
                <BulletItem>Zinco do alho</BulletItem>
                <BulletItem>Compostos antibacterianos do gengibre</BulletItem>
                <BulletItem>Antioxidantes das frutas vermelhas</BulletItem>
              </div>
            </div>
            <div className="rounded-xl p-3.5" style={{ background: C.blueLight, border: `1px solid ${C.blueBorder}` }}>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: C.blue }}>🌙 Sono</div>
              <div className="space-y-1.5">
                <BulletItem variant="blue">Melatonina da cereja e uva roxa</BulletItem>
                <BulletItem variant="blue">Triptofano da banana e leite</BulletItem>
                <BulletItem variant="blue">Magnésio da aveia e espinafre</BulletItem>
                <BulletItem variant="blue">Flavonoides do maracujá</BulletItem>
              </div>
            </div>
          </div>

          <BlueSectionTitle emoji="📖">Como usar este e-book</BlueSectionTitle>

          <div className="space-y-1.5">
            <BulletItem>Sucos de imunidade funcionam melhor pela manhã em jejum ou durante o dia</BulletItem>
            <BulletItem variant="blue">Sucos de sono devem ser tomados 30 minutos antes de deitar</BulletItem>
            <BulletItem>Em períodos de gripe, aumente para 2 sucos de imunidade por dia</BulletItem>
            <BulletItem variant="blue">Evite telas e cafeína pelo menos 1 hora antes dos sucos noturnos</BulletItem>
          </div>
        </div>
      </PdfContentPage>

      {/* Páginas de Imunidade — 2 receitas por página */}
      {chunk(imunidadeRecipes, 2).map((pair, i) => (
        <PdfContentPage accentGradient={ACCENT}
          key={`imun-${i}`}
          kicker="Receitas · Imunidade"
          title="Sucos de Imunidade"
          subtitle={i === 0 ? 'Tome pela manhã em jejum ou durante o dia para fortalecer as defesas do organismo.' : undefined}
        >
          <div className="flex flex-1 flex-col gap-4">
            {pair.map((r) => <LargeRecipeCard key={r.number} recipe={r} variant="green" />)}
          </div>
        </PdfContentPage>
      ))}

      {/* Páginas de Sono — 2 receitas por página */}
      {chunk(sonoRecipes, 2).map((pair, i) => (
        <PdfContentPage accentGradient={ACCENT}
          key={`sono-${i}`}
          kicker="Receitas · Sono"
          title="Sucos de Sono"
          subtitle={i === 0 ? 'Tome 30 minutos antes de deitar. Evite telas e cafeína 1 hora antes para potencializar o efeito.' : undefined}
        >
          <div className="flex flex-1 flex-col gap-4">
            {pair.map((r) => <LargeRecipeCard key={r.number} recipe={r} variant="blue" />)}
          </div>
        </PdfContentPage>
      ))}

      {/* Página 8 — Recomendações */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Recomendações"
        title="Como potencializar os resultados"
        subtitle="Pequenos hábitos que amplificam o efeito dos sucos e transformam sua rotina."
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <HighlightBox label="🌑 Ambiente do sono" variant="blue">
              Quarto escuro, silencioso e fresco potencializa o efeito dos sucos noturnos. A melatonina natural só é produzida em ambientes com pouca luz.
            </HighlightBox>
            <HighlightBox label="☕ Evite cafeína após 14h" variant="green">
              Café, chá preto e refrigerantes com cafeína interferem na produção natural de melatonina. Substitua por sucos naturais ou chás de ervas.
            </HighlightBox>
            <HighlightBox label="🕐 Rotina de horários" variant="blue">
              Dormir e acordar no mesmo horário todos os dias regula o relógio biológico e potencializa os efeitos dos sucos de sono.
            </HighlightBox>
            <HighlightBox label="☀️ Sol pela manhã" variant="green">
              Exposição à luz solar regula o ritmo circadiano, melhora o sono à noite e a produção de vitamina D para a imunidade.
            </HighlightBox>
          </div>

          <TipBox>
            Beba bastante água ao longo do dia. A desidratação leve já é suficiente para comprometer tanto o sono quanto a função imunológica.
          </TipBox>

          <SectionTitle emoji="📅">Rotina sugerida para 7 dias</SectionTitle>

          <div className="overflow-hidden rounded-xl" style={{ border: `1px solid ${C.greenBorder}` }}>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr style={{ background: C.greenLight }}>
                  <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: C.darkGreen }}>Horário</th>
                  <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: C.darkGreen }}>Suco recomendado</th>
                </tr>
              </thead>
              <tbody>
                <RoutineRow period="Ao acordar" suco="Shot de imunidade ou suco cítrico" />
                <RoutineRow period="Manhã" suco="Suco antioxidante ou de vitamina C" />
                <RoutineRow period="Tarde" suco="Suco de imunidade reforçada" />
                <RoutineRow period="1h antes de dormir" suco="Suco de sono ou vitamina calmante" />
              </tbody>
            </table>
          </div>
        </div>
      </PdfContentPage>

      {/* Página 9 — Encerramento */}
      <PdfContentPage accentGradient={ACCENT} kicker="Encerramento" title="Quando você dorme bem e se mantém saudável, tudo muda">
        <div className="space-y-4">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            A qualidade do seu sono determina a qualidade da sua vida. Sua clareza mental, seu humor,
            sua energia, sua resistência às doenças — tudo começa por uma boa noite de sono e por um
            sistema imunológico forte.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Não são coisas que você precisa conquistar com esforço enorme. São coisas que acontecem
            naturalmente quando você dá ao seu corpo os nutrientes certos, na hora certa.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Esse receituário é o seu guia para começar. Uma receita de cada vez, uma noite melhor de
            cada vez.
          </p>

          <InfoBox variant="green">
            <strong>Saúde, proteção e noites tranquilas para você.</strong>
          </InfoBox>

        </div>
      </PdfContentPage>
    </>
  );
}
