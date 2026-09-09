/**
 * PDF 12 — Rota: /pdf/ebook-doze · Protocolo Alfa: 7 Dias para Aumentar sua Testosterona
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';
import { DesignPage } from '@/components/ebook/DesignPage';

// ── Gradiente da faixa lateral ─────────────────────────────────────────────
const ACCENT = 'linear-gradient(to bottom, hsl(0 72% 32%), hsl(355 65% 27%), hsl(350 58% 22%))';

// ── Tokens de cor ──────────────────────────────────────────────────────────
const C = {
  darkColor: 'hsl(0 65% 18%)',
  color:     'hsl(0 72% 35%)',
  lightBg:   'hsl(0 45% 96%)',
  border:    'hsl(0 38% 82%)',
};

// ── Componentes auxiliares ─────────────────────────────────────────────────

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: C.color }}>
      {children}
    </p>
  );
}

function CheckItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-[1px] shrink-0 text-[13px] font-bold" style={{ color: C.color }}>✓</span>
      <span className="text-[13px] leading-snug text-foreground/90">{children}</span>
    </div>
  );
}

function XItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-[1px] shrink-0 text-[13px] font-bold" style={{ color: 'hsl(0 70% 40%)' }}>✕</span>
      <span className="text-[13px] leading-snug text-foreground/90">{children}</span>
    </div>
  );
}

function SymptomCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex gap-2.5 rounded-xl p-3" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
      <span className="text-[1.3rem] shrink-0 leading-none pt-0.5">{icon}</span>
      <div>
        <p className="text-[12.5px] font-bold" style={{ color: C.darkColor }}>{title}</p>
        <p className="text-[11.5px] text-foreground/70 leading-tight mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

type DayData = {
  day: number;
  subtitle: string;
  juiceName: string;
  ingredients: string[];
  preparo: string;
  habit: string;
  habitDesc: string;
  avoid: string;
  avoidDesc: string;
  insight: string;
};

function DayCard({ data }: { data: DayData }) {
  return (
    <div className="avoid-page-break flex flex-col rounded-2xl overflow-hidden" style={{ border: `1.5px solid ${C.border}` }}>
      <div className="flex items-center gap-3 px-4 py-3" style={{ background: C.darkColor }}>
        <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-full border-2 border-white/20">
          <span className="text-[7px] font-bold uppercase text-white/70 leading-none tracking-wider">DIA</span>
          <span className="text-[17px] font-black text-white leading-none">{data.day}</span>
        </span>
        <h4 className="font-display text-[1.05rem] font-black text-white leading-tight">
          Dia {data.day} — {data.subtitle}
        </h4>
      </div>

      <div className="bg-white px-4 py-3 flex flex-col gap-3">
        <div className="rounded-xl p-3.5" style={{ background: C.lightBg }}>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[1rem]">🥤</span>
            <span className="text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: C.color }}>
              Suco do Dia — {data.juiceName}
            </span>
          </div>
          <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1">
            {data.ingredients.map((ing, i) => (
              <span key={i} className="flex items-center gap-1.5 text-[12px] text-foreground/85">
                <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: C.color }} />
                {ing}
              </span>
            ))}
          </div>
          <p className="text-[11.5px] text-foreground/70 italic">{data.preparo}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl p-3" style={{ background: 'hsl(120 40% 96%)', border: '1px solid hsl(120 30% 82%)' }}>
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="text-[0.9rem]">⚡</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-green-700">Hábito Obrigatório</span>
            </div>
            <p className="text-[12.5px] font-semibold text-foreground/90 leading-tight">{data.habit}</p>
            <p className="text-[11px] text-foreground/65 mt-0.5 leading-tight">{data.habitDesc}</p>
          </div>

          <div className="rounded-xl p-3" style={{ background: 'hsl(0 40% 96%)', border: '1px solid hsl(0 30% 84%)' }}>
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="text-[0.9rem]">🚫</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-700">Evitar Hoje</span>
            </div>
            <p className="text-[12.5px] font-semibold text-foreground/90 leading-tight">{data.avoid}</p>
            <p className="text-[11px] text-foreground/65 mt-0.5 leading-tight">{data.avoidDesc}</p>
          </div>
        </div>

        <div className="rounded-lg px-3.5 py-2.5" style={{ background: C.lightBg, borderLeft: `3px solid ${C.color}` }}>
          <p className="text-[12.5px] leading-snug text-foreground/85">{data.insight}</p>
        </div>
      </div>
    </div>
  );
}

function CompactDayCard({ data }: { data: DayData }) {
  return (
    <div className="avoid-page-break flex-1 rounded-2xl overflow-hidden flex flex-col" style={{ border: `1.5px solid ${C.border}` }}>
      <div className="flex items-center gap-2.5 px-3.5 py-2.5" style={{ background: C.darkColor }}>
        <span className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-full border-2 border-white/20">
          <span className="text-[6px] font-bold uppercase text-white/70 leading-none tracking-wider">DIA</span>
          <span className="text-[14px] font-black text-white leading-none">{data.day}</span>
        </span>
        <h4 className="font-display text-[0.95rem] font-black text-white leading-tight">
          {data.subtitle}
        </h4>
      </div>

      <div className="bg-white px-3.5 py-3 flex flex-col gap-2.5 flex-1">
        <div className="rounded-lg p-2.5" style={{ background: C.lightBg }}>
          <div className="mb-1.5 text-[9.5px] font-bold uppercase tracking-[0.15em]" style={{ color: C.color }}>
            🥤 {data.juiceName}
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 mb-1">
            {data.ingredients.map((ing, i) => (
              <span key={i} className="text-[10.5px] text-foreground/80">· {ing}</span>
            ))}
          </div>
          <p className="text-[10px] text-foreground/60 italic">{data.preparo}</p>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <div className="rounded-lg p-2" style={{ background: 'hsl(120 40% 96%)', border: '1px solid hsl(120 30% 82%)' }}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-green-700 mb-0.5">⚡ Hábito</p>
            <p className="text-[11px] font-semibold leading-tight text-foreground/90">{data.habit}</p>
            <p className="text-[10px] text-foreground/60 mt-0.5 leading-tight">{data.habitDesc}</p>
          </div>
          <div className="rounded-lg p-2" style={{ background: 'hsl(0 40% 96%)', border: '1px solid hsl(0 30% 84%)' }}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-red-700 mb-0.5">🚫 Evitar</p>
            <p className="text-[11px] font-semibold leading-tight text-foreground/90">{data.avoid}</p>
            <p className="text-[10px] text-foreground/60 mt-0.5 leading-tight">{data.avoidDesc}</p>
          </div>
        </div>

        <div className="rounded-lg px-2.5 py-2" style={{ background: C.lightBg, borderLeft: `3px solid ${C.color}` }}>
          <p className="text-[11px] leading-snug text-foreground/80">{data.insight}</p>
        </div>
      </div>
    </div>
  );
}

// ── Dados dos 7 dias ───────────────────────────────────────────────────────
const days: DayData[] = [
  {
    day: 1,
    subtitle: 'Início do Reset',
    juiceName: 'Reset Total',
    ingredients: ['1 pepino médio', '1 maçã verde', '1 limão', '2cm de gengibre', '200ml de água'],
    preparo: 'Bata tudo no liquidificador, coe bem e tome em jejum pela manhã.',
    habit: 'Durma 8 horas esta noite',
    habitDesc: '90% da testosterona é produzida durante o sono profundo',
    avoid: 'Álcool e cigarros',
    avoidDesc: 'Destroem testosterona por até 48h após o consumo',
    insight: 'O primeiro dia é sobre sinalizar ao corpo que a mudança começa. Pepino e limão iniciam a limpeza do fígado — o órgão responsável por metabolizar seus hormônios.',
  },
  {
    day: 2,
    subtitle: 'Ativação Solar',
    juiceName: 'Óxido Nítrico',
    ingredients: ['1 beterraba pequena', '1 laranja (suco)', '2cm de gengibre', '200ml de água de coco'],
    preparo: 'Bata tudo no liquidificador, coe e tome 30 min antes do treino ou pela manhã.',
    habit: '20 min de sol pela manhã',
    habitDesc: 'Luz solar aumenta vitamina D — precursor direto da testosterona',
    avoid: 'Ultraprocessados e refrigerantes',
    avoidDesc: 'Xenoestrógenos em embalagens e aditivos desequilibram hormônios',
    insight: 'A vitamina D derivada do sol é um dos nutrientes mais estudados para elevar testosterona. 20 minutos de sol pela manhã equivalem a 2000 UI de vitamina D3.',
  },
  {
    day: 3,
    subtitle: 'Força e Movimento',
    juiceName: 'Termogênico Verde',
    ingredients: ['1 xícara de espinafre', '1 maçã', '1 limão', '2cm de gengibre', '200ml de água'],
    preparo: 'Bata tudo no liquidificador, coe e tome 30 min antes do treino.',
    habit: 'Treino de força hoje',
    habitDesc: 'Agachamento, terra ou supino — 30 min são suficientes',
    avoid: 'Cafeína após as 14h',
    avoidDesc: 'Cafeína noturna destrói o sono profundo onde a testosterona é sintetizada',
    insight: 'O treino com pesos pesados é o estímulo mais poderoso para aumentar testosterona naturalmente. Em até 30 minutos pós-treino há um pico hormonal real no sangue.',
  },
  {
    day: 4,
    subtitle: 'Controle do Cortisol',
    juiceName: 'Anti-Cortisol',
    ingredients: ['1 maracujá (polpa)', '1 banana', '1 pitada de cúrcuma', '200ml de leite vegetal'],
    preparo: 'Bata tudo até ficar cremoso. Tome morno ou gelado no café da manhã.',
    habit: '10 min de respiração profunda',
    habitDesc: 'Reduz cortisol em até 20% — antagonista direto da testosterona',
    avoid: 'Redes sociais pela manhã',
    avoidDesc: 'Notícias e comparações geram picos de cortisol que duram horas',
    insight: 'Cortisol e testosterona são hormônios opostos — quanto mais um sobe, mais o outro cai. Controlar o estresse não é fraqueza. É estratégia hormonal.',
  },
  {
    day: 5,
    subtitle: 'Zinco e Hormônio',
    juiceName: 'Zinco Power',
    ingredients: ['1 romã (suco)', '1 col. de sopa de semente de abóbora', '1 col. de mel', '200ml de água de coco'],
    preparo: 'Bata tudo no liquidificador, coe bem e tome em jejum pela manhã.',
    habit: 'Banho frio (2 min frio ao final)',
    habitDesc: 'Melhora circulação, testosterona e resistência mental',
    avoid: 'Ficar sentado por mais de 1h sem pausa',
    avoidDesc: 'Sedentarismo prolongado reduz testosterona e eleva cortisol',
    insight: 'A romã contém compostos que aumentam testosterona livre em até 24%. A semente de abóbora é a fonte vegetal mais rica em zinco — mineral que o corpo usa como matéria-prima hormonal.',
  },
  {
    day: 6,
    subtitle: 'Circulação Máxima',
    juiceName: 'Vitalidade Total',
    ingredients: ['1 beterraba pequena', '1 romã (suco)', '1 limão', '1 col. de mel', '200ml de água de coco'],
    preparo: 'Bata tudo no liquidificador, coe bem e tome gelado.',
    habit: 'Caminhada rápida de 30 min ao ar livre',
    habitDesc: 'Aumenta óxido nítrico natural e melhora disposição mental',
    avoid: 'Telas após as 21h',
    avoidDesc: 'Luz azul bloqueia melatonina e destrói o sono reparador',
    insight: 'Beterraba e romã juntas formam a combinação mais estudada para circulação masculina. O óxido nítrico gerado melhora vitalidade, energia e libido de forma direta.',
  },
  {
    day: 7,
    subtitle: 'Protocolo Completo',
    juiceName: 'Protocolo Alfa',
    ingredients: ['1 beterraba pequena', '1 romã (suco)', '1 xícara de espinafre', '1 col. de sopa de semente de abóbora', '1cm de gengibre', '200ml de água de coco'],
    preparo: 'Bata tudo no liquidificador, coe bem e tome em jejum. É o suco mais completo do protocolo.',
    habit: 'Repita os 7 hábitos como rotina permanente',
    habitDesc: 'O protocolo funcionou — agora é sobre manter, não recomeçar',
    avoid: 'Voltar aos hábitos antigos',
    avoidDesc: 'Uma semana de consistência já criou uma nova linha de base hormonal',
    insight: 'Se você chegou até aqui, já está à frente da maioria dos homens. Não por sorte — por escolha. Agora o trabalho é sustentar o que você construiu.',
  },
];

// ── Capa ───────────────────────────────────────────────────────────────────
function Cover() {
  return (
    <section
      className="relative h-[297mm] w-full overflow-hidden page-break-after print:shadow-none"
      style={{
        backgroundImage: 'url(/Protocolo-Alfa.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}

// ── Section Divider ────────────────────────────────────────────────────────
function SectionDivider({ label, big, title, detail }: { label: string; big: string; title: string; detail: string }) {
  const darkBg    = 'hsl(0 70% 7%)';
  const midBg     = 'hsl(0 60% 11%)';
  const accentCol = C.color;

  return (
    <DesignPage bg={darkBg}>
      <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: `linear-gradient(to right, transparent, ${accentCol}, transparent)` }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-14 text-center">
        <p className="mb-4 text-[10.5px] font-bold uppercase tracking-[0.45em]" style={{ color: accentCol }}>{label}</p>
        <h1 className="font-display leading-none tracking-tighter text-white">
          <span className="block text-[2rem] font-semibold opacity-70">{title}</span>
          <span className="block text-[4rem] font-black" style={{ color: accentCol }}>{big}</span>
        </h1>
        <div className="my-6 h-[1.5px] w-20" style={{ background: accentCol }} />
        <div className="max-w-sm rounded-2xl px-6 py-4" style={{ background: midBg, border: `1px solid ${accentCol}30` }}>
          <p className="text-[12.5px] leading-relaxed text-white/70">{detail}</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[4px]" style={{ background: `linear-gradient(to right, transparent, ${accentCol}, transparent)` }} />
    </DesignPage>
  );
}

// ── Ebook ──────────────────────────────────────────────────────────────────
export default function EbookDoze() {
  return (
    <>
      <Cover />

      {/* Página 2 — Identificação da Dor */}
      <PdfContentPage accentGradient={ACCENT} kicker="O Diagnóstico" title="Isso que você sente tem nome.">
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-foreground/85">
            Cansaço sem motivo. Energia que some no meio do dia. Dificuldade de foco. Libido em queda.
            Esses não são sinais de envelhecimento normal — são sinais de que algo está fora do equilíbrio.
          </p>

          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: '😴', title: 'Cansaço constante',           desc: 'Acorda já cansado, sem disposição para o dia' },
              { icon: '⚡', title: 'Falta de energia',             desc: 'Energia que cai no meio da manhã sem motivo' },
              { icon: '🔥', title: 'Baixa libido',                 desc: 'Queda no interesse sexual e na vitalidade' },
              { icon: '🧠', title: 'Dificuldade de foco',          desc: 'Mente travada, pensamento lento, pouca clareza' },
              { icon: '💪', title: 'Dificuldade de ganhar músculo',desc: 'Treina mas não vê resultado proporcional' },
              { icon: '😤', title: 'Irritabilidade sem causa',     desc: 'Humor instável, paciência curta, ansiedade' },
            ].map(({ icon, title, desc }) => (
              <SymptomCard key={title} icon={icon} title={title} desc={desc} />
            ))}
          </div>

          <div className="rounded-xl px-5 py-4 text-center" style={{ background: C.darkColor }}>
            <p className="text-[14.5px] font-bold text-white leading-snug">
              Se você sente 2 ou mais desses sintomas,
              <br />
              <span style={{ color: 'hsl(0 55% 80%)' }}>sua testosterona pode estar baixa.</span>
            </p>
          </div>

          <p className="text-[12.5px] leading-relaxed text-foreground/70 text-center">
            A boa notícia: você não precisa de injeções nem de suplementos caros.
            <br />
            7 dias com o protocolo certo já fazem diferença real.
          </p>
        </div>
      </PdfContentPage>

      {/* Página 3 — O Problema */}
      <PdfContentPage accentGradient={ACCENT} kicker="O Problema" title="O que está derrubando sua testosterona.">
        <div className="space-y-3.5">
          <p className="text-[13px] leading-relaxed text-foreground/85">
            A testosterona não cai à toa. Existe uma causa clara — e ela está nos seus hábitos diários.
            A vida moderna criou um ambiente perfeitamente hostil para o sistema hormonal masculino.
          </p>

          <div className="space-y-2.5">
            {[
              {
                icon: '🍔',
                problem: 'Alimentação industrializada',
                detail: 'Alimentos ultraprocessados contêm xenoestrógenos — compostos que imitam estrogênio no corpo e suprimem a produção de testosterona. Quanto mais industrializado o que você come, mais você trabalha contra seus próprios hormônios.',
              },
              {
                icon: '😴',
                problem: 'Privação de sono',
                detail: 'Mais de 90% da testosterona diária é produzida durante o sono profundo. Dormir menos de 7 horas por uma semana reduz os níveis em até 15% — o equivalente a envelhecer 10 anos hormonalmente.',
              },
              {
                icon: '☀️',
                problem: 'Falta de exposição ao sol',
                detail: 'A vitamina D derivada do sol é o precursor direto da testosterona. Homens com deficiência de vitamina D têm testosterona significativamente mais baixa. Passar o dia fechado é hormônio perdido.',
              },
              {
                icon: '📱',
                problem: 'Estresse crônico e telas',
                detail: 'Cortisol — o hormônio do estresse — é o antagonista direto da testosterona. Redes sociais, notícias negativas e luz azul elevam o cortisol e prejudicam o sono, criando um ciclo hormonal destrutivo.',
              },
              {
                icon: '🪑',
                problem: 'Sedentarismo',
                detail: 'O corpo só produz testosterona em quantidade quando percebe que precisa dela — e isso acontece principalmente durante o esforço físico. Sem movimento, o sinal para produzir hormônio simplesmente não chega.',
              },
            ].map(({ icon, problem, detail }) => (
              <div key={problem} className="flex gap-3 rounded-xl p-3.5" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
                <span className="text-[1.4rem] shrink-0 leading-none pt-0.5">{icon}</span>
                <div>
                  <p className="text-[12.5px] font-bold mb-0.5" style={{ color: C.darkColor }}>{problem}</p>
                  <p className="text-[12px] leading-snug text-foreground/75">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PdfContentPage>

      {/* Página 4 — O Erro Comum */}
      <PdfContentPage accentGradient={ACCENT} kicker="O Erro Comum" title="O que a maioria faz errado.">
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-foreground/85">
            Quando percebem a queda de energia e disposição, a maioria dos homens toma decisões
            impulsivas que gastam dinheiro e não resolvem nada. O problema nunca foi falta de esforço.
          </p>

          <div className="space-y-2.5">
            {[
              {
                mistake: 'Suplementos caros sem resultado',
                detail: 'Testosterona não vem de pílula. Nenhum suplemento funciona se os hábitos básicos estão quebrados. É como tentar rechear um balde furado.',
              },
              {
                mistake: 'Dietas radicais e aleatórias',
                detail: 'Cortar carboidrato de vez, jejum extremo sem orientação, dieta da moda — essas abordagens aumentam o cortisol e derrubam ainda mais a testosterona.',
              },
              {
                mistake: 'Treinar demais sem descanso',
                detail: 'O músculo cresce e o hormônio aumenta durante o descanso — não durante o treino. Treinar todo dia sem recuperação é catabólico: destrói o que você tentou construir.',
              },
              {
                mistake: 'Falta de consistência',
                detail: 'Fazer tudo certo por 3 dias e abandonar resolve menos que fazer 1 coisa certa por 7 dias seguidos. O hormônio responde à consistência, não à intensidade isolada.',
              },
              {
                mistake: 'Ignorar o sono',
                detail: 'Homens investem horas no treino e ignoram o sono. Sem dormir bem, o treino é 60% menos eficaz e a testosterona produzida durante a noite cai significativamente.',
              },
            ].map(({ mistake, detail }, i) => (
              <div key={i} className="flex gap-3 rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                <div className="flex w-8 shrink-0 items-center justify-center" style={{ background: C.darkColor }}>
                  <span className="text-[11px] font-black text-white">{i + 1}</span>
                </div>
                <div className="px-3 py-2.5">
                  <p className="text-[12.5px] font-bold mb-0.5" style={{ color: C.darkColor }}>{mistake}</p>
                  <p className="text-[12px] leading-snug text-foreground/75">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl px-5 py-4 text-center" style={{ background: C.darkColor }}>
            <p className="text-[14px] font-bold text-white">
              "Não é falta de esforço.
              <br />
              <span style={{ color: 'hsl(0 55% 78%)' }}>É falta de direção."</span>
            </p>
          </div>
        </div>
      </PdfContentPage>

      {/* Página 5 — A Ciência por trás */}
      <PdfContentPage accentGradient={ACCENT} kicker="A Ciência" title="Por que este protocolo funciona.">
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-foreground/85">
            Cada elemento do Protocolo Alfa é baseado em mecanismos fisiológicos comprovados.
            Não é promessa — é como o corpo masculino funciona.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { num: '1', title: 'Sucos funcionais', desc: 'Zinco, magnésio, nitratos e compostos bioativos que estimulam diretamente a síntese hormonal' },
              { num: '2', title: 'Treino de força', desc: 'Estímulo mecânico nos músculos grandes gera picos de testosterona e GH em até 30 min pós-treino' },
              { num: '3', title: 'Sono profundo', desc: 'O hipotálamo libera LH durante o sono — o hormônio que sinaliza os testículos para produzir testosterona' },
              { num: '4', title: 'Controle do cortisol', desc: 'Cortisol e testosterona são produzidos pelo mesmo precursor. Reduzir um libera recurso para o outro' },
              { num: '5', title: 'Exposição solar', desc: 'Receptores de vitamina D existem nas células de Leydig — exatamente onde a testosterona é sintetizada' },
              { num: '6', title: 'Consistência de 7 dias', desc: 'O eixo hipotálamo-hipófise-gônada leva dias para recalibrar. 7 dias consecutivos criam nova linha de base hormonal' },
            ].map(({ num, title, desc }) => (
              <div key={num} className="rounded-xl p-3.5" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white" style={{ background: C.color }}>{num}</span>
                  <p className="text-[12.5px] font-bold" style={{ color: C.darkColor }}>{title}</p>
                </div>
                <p className="text-[11.5px] leading-snug text-foreground/75">{desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl px-4 py-3.5" style={{ background: C.lightBg, borderLeft: `3px solid ${C.color}` }}>
            <p className="text-[12.5px] font-semibold mb-1" style={{ color: C.darkColor }}>Atenção:</p>
            <p className="text-[12.5px] leading-snug text-foreground/80">
              Cada dia do protocolo foi estruturado para um propósito específico. Não pule dias e não troque
              a ordem. A sequência é o que faz funcionar — não apenas os ingredientes isolados.
            </p>
          </div>
        </div>
      </PdfContentPage>

      {/* ── SEÇÃO: OS 7 DIAS ── */}
      <SectionDivider
        label="Protocolo Alfa"
        title="OS"
        big="7 DIAS"
        detail="Um suco, um hábito obrigatório e uma coisa a evitar — simples e direto. Execute os 7 dias na ordem e observe as mudanças no seu corpo e na sua energia."
      />

      {/* Dia 1 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Protocolo Alfa — Dia 1" title="Início do Reset">
        <DayCard data={days[0]} />
        <div className="mt-4 rounded-xl px-4 py-3.5 space-y-1.5" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
          <SectionLabel>Antes de dormir hoje</SectionLabel>
          <CheckItem>Programe o alarme para garantir 8h de sono</CheckItem>
          <CheckItem>Separe os ingredientes do suco de amanhã</CheckItem>
          <CheckItem>Desligue telas 30 min antes de dormir</CheckItem>
        </div>
      </PdfContentPage>

      {/* Dia 2 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Protocolo Alfa — Dia 2" title="Ativação Solar">
        <DayCard data={days[1]} />
        <div className="mt-4 rounded-xl px-4 py-3.5 space-y-1.5" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
          <SectionLabel>Checklist do Dia 2</SectionLabel>
          <CheckItem>Suco em jejum → esperar 20 min → café da manhã normal</CheckItem>
          <CheckItem>Sol pela manhã — 20 min sem protetor nos primeiros 10 min</CheckItem>
          <XItem>Nenhum ultraprocessado ou refrigerante hoje</XItem>
        </div>
      </PdfContentPage>

      {/* Dia 3 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Protocolo Alfa — Dia 3" title="Força e Movimento">
        <DayCard data={days[2]} />
        <div className="mt-4 rounded-xl px-4 py-3.5 space-y-1.5" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
          <SectionLabel>Checklist do Dia 3</SectionLabel>
          <CheckItem>Suco 30 min antes do treino — absorção máxima com estômago vazio</CheckItem>
          <CheckItem>Treino: priorize compostos grandes — agachamento, terra ou supino</CheckItem>
          <XItem>Sem cafeína após as 14h — o sono profundo de hoje vai repor tudo</XItem>
        </div>
      </PdfContentPage>

      {/* Dia 4 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Protocolo Alfa — Dia 4" title="Controle do Cortisol">
        <DayCard data={days[3]} />
        <div className="mt-4 rounded-xl px-4 py-3.5 space-y-1.5" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
          <SectionLabel>Checklist do Dia 4</SectionLabel>
          <CheckItem>Respiração: inspire 4s → segure 4s → expire 4s · repita por 10 min</CheckItem>
          <CheckItem>Suco no café da manhã junto com frutas ou ovos</CheckItem>
          <XItem>Sem redes sociais antes das 9h — o cortisol matinal já é alto naturalmente</XItem>
        </div>
      </PdfContentPage>

      {/* Dia 5 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Protocolo Alfa — Dia 5" title="Zinco e Hormônio">
        <DayCard data={days[4]} />
        <div className="mt-4 rounded-xl px-4 py-3.5 space-y-1.5" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
          <SectionLabel>Checklist do Dia 5</SectionLabel>
          <CheckItem>Suco em jejum — a absorção do zinco é até 3× maior sem outros alimentos</CheckItem>
          <CheckItem>Banho frio: termine o banho com 2 min de água fria progressiva</CheckItem>
          <XItem>Sem ficar sentado mais de 1h seguida — levante e ande 5 min a cada hora</XItem>
        </div>
      </PdfContentPage>

      {/* Dia 6 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Protocolo Alfa — Dia 6" title="Circulação Máxima">
        <DayCard data={days[5]} />
        <div className="mt-4 rounded-xl px-4 py-3.5 space-y-1.5" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
          <SectionLabel>Checklist do Dia 6</SectionLabel>
          <CheckItem>Suco pela manhã ou 30 min antes da caminhada</CheckItem>
          <CheckItem>Caminhada: mínimo 30 min em ritmo acelerado, preferencialmente ao ar livre</CheckItem>
          <XItem>Telas desligadas às 21h — use o tempo para ler ou simplesmente descansar</XItem>
        </div>
      </PdfContentPage>

      {/* Dia 7 */}
      <PdfContentPage accentGradient={ACCENT} kicker="Protocolo Alfa — Dia 7" title="Encerramento do Protocolo">
        <DayCard data={days[6]} />
        <div className="mt-4 rounded-xl px-5 py-4 text-center" style={{ background: C.darkColor }}>
          <p className="text-[15px] font-bold text-white leading-snug">
            "Se você chegou até aqui,
            <br />
            <span style={{ color: 'hsl(0 55% 78%)' }}>já está à frente da maioria."</span>
          </p>
          <p className="mt-2 text-[11px] text-white/50">
            7 dias · 7 sucos · 7 hábitos · Uma nova linha de base hormonal
          </p>
        </div>
      </PdfContentPage>

      {/* Página — Aceleradores Finais */}
      <PdfContentPage accentGradient={ACCENT} kicker="Aceleradores" title="O que potencializa seus resultados.">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-4" style={{ background: 'hsl(120 40% 96%)', border: '1px solid hsl(120 30% 82%)' }}>
              <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.3em] text-green-700">Alimentos que aumentam testosterona</p>
              <div className="space-y-1.5">
                {[
                  'Ovos inteiros (colesterol e vitamina D)',
                  'Carne vermelha magra (zinco e proteína)',
                  'Semente de abóbora (zinco)',
                  'Brócolis e couve (I3C antiestrogênico)',
                  'Romã e beterraba (óxido nítrico)',
                  'Azeite de oliva extra virgem',
                  'Nozes e castanhas (magnésio e selênio)',
                  'Alho (alicina — estimula LH)',
                ].map((item) => <CheckItem key={item}>{item}</CheckItem>)}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-xl p-3.5" style={{ background: 'hsl(120 40% 96%)', border: '1px solid hsl(120 30% 82%)' }}>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">Hábitos que aumentam energia</p>
                <div className="space-y-1.5">
                  {[
                    'Treino de força 3–4× por semana',
                    '7–9 horas de sono por noite',
                    '20 min de sol pela manhã',
                    'Água: mínimo 2,5 L por dia',
                    'Respiração profunda (10 min/dia)',
                    'Caminhada ao ar livre diária',
                  ].map((item) => <CheckItem key={item}>{item}</CheckItem>)}
                </div>
              </div>

              <div className="rounded-xl p-3.5" style={{ background: 'hsl(0 40% 96%)', border: '1px solid hsl(0 30% 84%)' }}>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-red-700">Hábitos a eliminar</p>
                <div className="space-y-1.5">
                  {[
                    'Álcool frequente',
                    'Dormir menos de 7h',
                    'Estresse sem válvula de escape',
                    'Cafeína após as 14h',
                    'Ultraprocessados diários',
                    'Sedentarismo prolongado',
                  ].map((item) => <XItem key={item}>{item}</XItem>)}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl px-5 py-4 text-center" style={{ background: C.darkColor }}>
            <p className="text-[14px] font-bold text-white leading-snug">
              "Agora depende de você executar."
            </p>
            <p className="mt-2 text-[12px] text-white/60">
              Conhecimento sem ação não muda nada. Você tem o protocolo — use.
            </p>
          </div>
        </div>
      </PdfContentPage>

      {/* Bônus — Tabela de Alimentos */}
      <PdfContentPage accentGradient={ACCENT} kicker="Bônus — Nutrição" title="O que comer para maximizar os resultados.">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl" style={{ border: `1.5px solid ${C.border}` }}>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr style={{ background: C.darkColor }}>
                  <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white">Alimento</th>
                  <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white">Nutriente-chave</th>
                  <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white">Benefício hormonal</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Ovo inteiro',          'Colesterol + vitamina D', 'Matéria-prima direta para síntese de testosterona'],
                  ['Semente de abóbora',   'Zinco',                   'Zinco é co-fator essencial na produção de testosterona'],
                  ['Brócolis',             'Indol-3-carbinol',        'Reduz estrogênio e libera testosterona bloqueada'],
                  ['Romã',                 'Polifenóis',              'Aumenta testosterona livre em até 24%'],
                  ['Beterraba',            'Nitratos',                'Aumenta óxido nítrico e vitalidade masculina'],
                  ['Carne vermelha magra', 'Zinco + creatina',        'Apoia síntese muscular e hormonal'],
                  ['Alho',                 'Alicina',                 'Estimula o LH — hormônio que aciona produção de testosterona'],
                  ['Espinafre',            'Magnésio',                'Aumenta testosterona biodisponível ao reduzir SHBG'],
                  ['Nozes',                'Selênio + ômega-3',       'Protege as células testiculares e melhora fertilidade'],
                  ['Azeite extra virgem',  'Gordura monoinsaturada',  'Gordura saudável é necessária para síntese hormonal'],
                ].map(([food, nutrient, benefit], i) => (
                  <tr key={food} className="border-t" style={{ borderColor: C.border, background: i % 2 === 0 ? 'white' : C.lightBg }}>
                    <td className="px-3 py-2.5 text-[12px] font-bold" style={{ color: C.color }}>{food}</td>
                    <td className="px-3 py-2.5 text-[12px] text-foreground/85">{nutrient}</td>
                    <td className="px-3 py-2.5 text-[12px] text-foreground/75">{benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl px-4 py-3.5" style={{ background: C.lightBg, border: `1.5px solid ${C.border}` }}>
            <p className="text-[13px] font-semibold leading-snug mb-1" style={{ color: C.darkColor }}>
              Regra simples de nutrição hormonal:
            </p>
            <p className="text-[12.5px] leading-relaxed text-foreground/80">
              Proteína de qualidade, gordura saudável e vegetais ricos em zinco e magnésio em cada refeição.
              Evite o que inflama. Sem rigidez — com consistência.
            </p>
          </div>
        </div>
      </PdfContentPage>

      {/* Bônus — Rotina Diária */}
      <PdfContentPage accentGradient={ACCENT} kicker="Bônus — Rotina" title="Sua rotina diária de 7 dias.">
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-foreground/85">
            Você não precisa virar a vida de cabeça para baixo. Apenas encaixe o protocolo nos momentos
            certos do dia e observe o efeito cumulativo ao longo da semana.
          </p>

          <div className="space-y-2">
            {[
              { icon: '🌅', period: 'Ao acordar',                   action: 'Água morna com limão (antes de qualquer coisa)',   detail: 'Reidrata o corpo e inicia a ativação do fígado' },
              { icon: '🥤', period: '20 min depois',                action: 'Suco do dia em jejum',                             detail: 'Absorção máxima — sem outros alimentos concorrendo' },
              { icon: '☀️', period: 'Manhã',                        action: '20 min de sol + hábito obrigatório do dia',        detail: 'Vitamina D natural e o hábito de cada dia do protocolo' },
              { icon: '🍽️', period: 'Café da manhã',               action: 'Refeição rica em proteína e gordura saudável',     detail: 'Ovos, abacate, castanhas — base hormonal da manhã' },
              { icon: '🏋️', period: 'Treino (dias 3, 5 e 7)',      action: 'Treino de força — 30 a 45 minutos',               detail: 'Compostos grandes primeiro: agachamento, supino, terra' },
              { icon: '🌙', period: 'Noite',                        action: 'Jantar leve + telas desligadas às 21h',            detail: 'Preparar o organismo para produzir testosterona durante o sono' },
              { icon: '💤', period: 'Ao dormir',                    action: '7–9 horas de sono ininterrupto',                   detail: 'Onde 90% da testosterona diária é produzida' },
            ].map(({ icon, period, action, detail }) => (
              <div key={period} className="flex gap-3 rounded-xl p-3" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
                <span className="text-[1.4rem] shrink-0 leading-none pt-0.5">{icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider shrink-0 mb-0.5" style={{ color: C.color }}>{period}</p>
                  <p className="text-[12.5px] font-semibold text-foreground/90 leading-tight">{action}</p>
                  <p className="text-[11.5px] text-foreground/60 mt-0.5">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PdfContentPage>

      {/* Página — Encerramento */}
      <PdfContentPage accentGradient={ACCENT} kicker="Encerramento" title="O próximo passo depende de você.">
        <div className="space-y-4">
          <p className="text-[13.5px] leading-relaxed text-foreground/85">
            Você acabou de receber um protocolo que a maioria dos homens nunca vai seguir. Não porque não querem
            resultados — mas porque vão procrastinar, achar desculpas ou esperar o momento perfeito.
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/85">
            O momento perfeito não existe. O único momento que existe é agora.
          </p>

          <div className="space-y-2">
            {[
              ['Comece amanhã cedo',      'O Dia 1 é uma decisão, não uma preparação. Separe os ingredientes hoje à noite.'],
              ['7 dias sem pular',        'A consistência é o que cria o resultado. Um dia errado não arruína o protocolo — parar arruína.'],
              ['Observe as mudanças',     'Anote como você está no Dia 1 e compare no Dia 7. Energia, sono, foco, libido. Os dados são seus.'],
              ['Repita o ciclo',          'Após os 7 dias, descanse 3 dias e repita. Os resultados se multiplicam a cada ciclo.'],
            ].map(([step, desc], i) => (
              <div key={i} className="flex gap-3 rounded-xl p-3.5" style={{ background: C.lightBg, border: `1px solid ${C.border}` }}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-black text-white" style={{ background: C.color }}>{i + 1}</span>
                <div>
                  <p className="text-[13px] font-bold" style={{ color: C.darkColor }}>{step}</p>
                  <p className="text-[12px] text-foreground/75 mt-0.5 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 rounded-xl px-5 py-5 text-center" style={{ background: C.darkColor }}>
            <p className="text-[15px] font-black text-white leading-snug mb-1">
              Força, hormônio e vitalidade.
            </p>
            <p className="text-[12.5px] text-white/60 leading-relaxed">
              O resultado de quem age quando os outros apenas leem.
            </p>
            <div className="mt-4 h-px w-16 mx-auto" style={{ background: `${C.color}60` }} />
            <p className="mt-3 text-[10px] text-white/30 uppercase tracking-widest">
              Protocolo Alfa · 7 Dias · Testosterona Natural
            </p>
          </div>
        </div>
      </PdfContentPage>
    </>
  );
}
