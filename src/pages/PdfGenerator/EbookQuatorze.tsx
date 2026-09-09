/**
 * PDF 14 — Rota: /pdf/ebook-quatorze · El Código Oculto de Tu Hogar
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';
import {
  StepList,
  CheckList,
  Callout,
  HighlightBanner,
  ComparisonCard,
  FactBox,
  SectionDivider,
  Divider,
} from '@/components/ebook/VisualElements';

// ── Paleta monge / prosperidade ─────────────────────────────────
const C = {
  gold:       'hsl(40 78% 44%)',
  goldLight:  'hsl(42 70% 94%)',
  goldBorder: 'hsl(40 60% 70%)',
  dark:       'hsl(25 40% 13%)',
  earth:      'hsl(28 45% 26%)',
  ink:        'hsl(30 20% 18%)',
  parchment:  'hsl(42 50% 96%)',
  danger:     'hsl(0 60% 46%)',
};

const ACCENT_GOLD  = `linear-gradient(to bottom, ${C.gold}, hsl(35 65% 38%), hsl(28 50% 28%))`;
const ACCENT_EARTH = `linear-gradient(to bottom, hsl(25 40% 20%), hsl(20 35% 14%))`;

// ── Componentes visuais exclusivos ──────────────────────────────

function MonkWisdom({ children }: { children: ReactNode }) {
  return (
    <div
      className="my-3 flex items-start gap-3 rounded-lg px-4 py-3.5"
      style={{ background: C.dark, borderLeft: `3px solid ${C.gold}` }}
    >
      <span className="mt-0.5 shrink-0 text-[18px]">☯</span>
      <p className="text-[17.5px] font-semibold italic leading-snug" style={{ color: 'hsl(42 80% 88%)' }}>
        {children}
      </p>
    </div>
  );
}

function ImpactLine({ children }: { children: ReactNode }) {
  return (
    <p className="my-2.5 font-display text-[1rem] font-bold leading-snug" style={{ color: C.gold }}>
      {children}
    </p>
  );
}

function MostPeopleIgnore({ children }: { children: ReactNode }) {
  return (
    <div
      className="my-2.5 flex items-start gap-2.5 rounded-lg px-4 py-2.5"
      style={{ background: `${C.gold}18`, border: `1px solid ${C.goldBorder}` }}
    >
      <span className="mt-0.5 shrink-0 text-[17.5px]">👁</span>
      <div>
        <p className="text-[15px] font-bold uppercase tracking-[0.22em] mb-0.5" style={{ color: C.gold }}>
          La mayoría lo ignora
        </p>
        <p className="text-[17px] font-semibold leading-snug" style={{ color: C.earth }}>
          {children}
        </p>
      </div>
    </div>
  );
}

function HomeAreaCard({
  icon, area, error, consequence,
}: {
  icon: string; area: string; error: string; consequence: string;
}) {
  return (
    <div
      className="avoid-page-break mb-2.5 rounded-xl p-3"
      style={{ background: C.parchment, border: `1px solid ${C.goldBorder}` }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[18px]">{icon}</span>
        <p className="text-[16px] font-bold uppercase tracking-[0.18em]" style={{ color: C.gold }}>
          {area}
        </p>
      </div>
      <p className="text-[16.5px] leading-snug text-foreground/70 mb-1">
        <span className="font-semibold" style={{ color: C.earth }}>Error común: </span>
        {error}
      </p>
      <p className="text-[16.5px] leading-snug text-foreground/70">
        <span className="font-semibold" style={{ color: C.danger }}>Consecuencia: </span>
        {consequence}
      </p>
    </div>
  );
}

function RitualCard({
  number, title, how, time,
}: {
  number: string; title: string; how: string; time: string;
}) {
  return (
    <div
      className="avoid-page-break mb-2.5 rounded-xl px-3.5 py-3"
      style={{ background: C.dark, border: `1px solid ${C.gold}30` }}
    >
      <div className="flex items-start gap-2.5">
        <span
          className="shrink-0 flex items-center justify-center rounded-full text-[15.5px] font-bold w-5 h-5 mt-0.5"
          style={{ background: C.gold, color: C.dark }}
        >
          {number}
        </span>
        <div>
          <p className="text-[16.5px] font-bold mb-0.5" style={{ color: 'hsl(42 80% 88%)' }}>{title}</p>
          <p className="text-[16px] leading-snug mb-1" style={{ color: 'hsl(42 40% 65%)' }}>{how}</p>
          <p className="text-[15px] font-semibold uppercase tracking-[0.15em]" style={{ color: C.gold }}>
            ⏱ {time}
          </p>
        </div>
      </div>
    </div>
  );
}

function TwoColCards({ items }: { items: { label: string; text: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map(({ label, text }) => (
        <div
          key={label}
          className="rounded-lg p-2.5"
          style={{ background: C.goldLight, border: `1px solid ${C.goldBorder}` }}
        >
          <p className="text-[16.5px] font-semibold mb-0.5" style={{ color: C.earth }}>{label}</p>
          <p className="text-[16px] leading-snug text-foreground/65">{text}</p>
        </div>
      ))}
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3
      className="mb-2 mt-1 font-display text-[1rem] font-semibold tracking-tight"
      style={{ color: C.earth }}
    >
      {children}
    </h3>
  );
}

// ── Ebook principal ─────────────────────────────────────────────

export default function EbookQuatorze() {
  return (
    <>
      {/* ── COVER ──────────────────────────────────────────────────── */}
      <section
        className="relative h-[297mm] overflow-hidden page-break-after print:shadow-none"
        style={{
          backgroundImage: 'url(/capa-codigo-oculto.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: C.dark,
        }}
      />

      {/* ── INTRODUCCIÓN ───────────────────────────────────────────── */}
      <PdfContentPage
        kicker="Introducción"
        title="El Momento en que Todo Cambia"
        subtitle="Hay algo en tu casa que está bloqueando tu dinero. Y casi nadie lo sabe."
        accentGradient={ACCENT_GOLD}
      >
        <div
          className="avoid-page-break mb-3 rounded-xl px-4 py-3.5"
          style={{ background: C.goldLight, border: `1px solid ${C.goldBorder}` }}
        >
          <p className="font-display text-[1rem] font-semibold leading-snug" style={{ color: C.earth }}>
            El dinero entra… y desaparece.<br />
            Trabajas más… y no avanzas.<br />
            Sientes que algo te detiene… y no sabes qué es.
          </p>
        </div>

        <p className="mb-2 text-[18px] leading-relaxed text-foreground/80">
          Durante siglos, los monjes sabían algo que el mundo moderno ha olvidado: el ambiente donde vives no es neutro. Tu hogar respira, acumula y transmite energía. Cuando esa energía está bloqueada, todo en tu vida — incluido tu dinero — se estanca.
        </p>

        <ImpactLine>El problema puede no ser tú. Puede ser tu casa.</ImpactLine>

        <p className="mb-3 text-[18px] leading-relaxed text-foreground/80">
          Esto no es filosofía. No es desarrollo personal genérico. Es un diagnóstico práctico — con correcciones inmediatas — que puedes aplicar hoy mismo.
        </p>

        <SectionDivider title="Lo que encontrarás en esta guía" color={C.gold} />

        <CheckList color={C.gold} className="mt-2" items={[
          'Identificar exactamente qué está bloqueando el flujo de dinero en tu hogar',
          'Un diagnóstico rápido con checklist de puntos críticos',
          'Los errores más comunes — y cómo corregirlos hoy',
          'Rituales simples de corrección inmediata (sin complicaciones)',
          'Una rutina de mantenimiento que cabe en tu vida real',
        ]} />
      </PdfContentPage>

      {/* ── CAPÍTULO 1 — Los Bloqueos Invisibles ───────────────────── */}
      <PdfContentPage
        kicker="Capítulo 1"
        title="Los Bloqueos Invisibles"
        subtitle="Por qué tu ambiente tiene más poder sobre tu dinero de lo que imaginas."
        accentGradient={ACCENT_GOLD}
      >
        <p className="mb-2 text-[18px] leading-relaxed text-foreground/80">
          En los antiguos monasterios, los monjes pasaban horas cuidando cada rincón de su espacio. No era obsesión. Era sabiduría práctica: entendían que el ambiente donde se habita afecta directamente la mente, las decisiones y la prosperidad.
        </p>

        <MonkWisdom>
          "Un espacio en desorden es una mente en desorden. Un espacio bloqueado es una vida bloqueada. El monje que cuida su celda, cuida su destino."
        </MonkWisdom>

        <SectionDivider title="Los tres principios fundamentales" color={C.gold} />

        <StepList color={C.gold} className="mt-2 mb-3" steps={[
          {
            title: 'Los ambientes acumulan energía',
            text: 'Todo lo que ocurre en tu hogar deja una huella energética. Discusiones, estancamiento, objetos sin uso — todo se acumula y crea una capa invisible de resistencia.',
          },
          {
            title: 'Los objetos y el desorden influyen',
            text: 'Cada objeto roto, cada cajón lleno de cosas inútiles, cada rincón oscuro y olvidado actúa como un ancla que detiene el movimiento de la energía — y del dinero.',
          },
          {
            title: 'Pequeños errores crean grandes bloqueos',
            text: 'No hace falta una casa devastada. Errores pequeños y repetidos — guardar el dinero en cualquier lugar, tener cosas rotas, no limpiar energéticamente — son suficientes para bloquear todo.',
          },
        ]} />

        <MostPeopleIgnore>
          Esto parece pequeño, pero bloquea todo. La mayoría de las personas busca soluciones enormes cuando el problema está en los detalles de su espacio diario.
        </MostPeopleIgnore>
      </PdfContentPage>

      {/* ── CAPÍTULO 2 — Las Señales de Bloqueo ────────────────────── */}
      <PdfContentPage
        kicker="Capítulo 2"
        title="Las Señales de que Tu Casa Te Está Deteniendo"
        subtitle="Si te identificas con estos patrones, la solución puede estar en tu hogar."
        accentGradient={ACCENT_GOLD}
      >
        <p className="mb-3 text-[18px] leading-relaxed text-foreground/80">
          El hogar bloqueado no grita. Susurra. Y lo hace a través de señales que casi siempre atribuimos a "mala suerte" o a nosotros mismos. Estas son las señales más comunes — y casi nadie las conecta con su ambiente.
        </p>

        <TwoColCards items={[
          { label: 'El dinero nunca sobra', text: 'Ganas, gastas, no queda nada. La energía financiera no fluye — se escapa.' },
          { label: 'Sensación de peso al llegar a casa', text: 'Entras y en vez de relajarte, sientes cansancio inmediato. Es la energía estancada afectando tu sistema.' },
          { label: 'Desorganización constante', text: 'Por más que ordenas, en días vuelve el caos. Señal de que el espacio tiene un patrón energético de desorden.' },
          { label: 'Cosas rotas acumuladas', text: 'Objetos rotos que "ya vas a arreglar". Cada uno es un bloqueo activo al flujo de prosperidad.' },
          { label: 'Falta de motivación en casa', text: 'Afuera tienes energía, en casa te apagas. El ambiente está drenando tu fuerza.' },
          { label: 'Oportunidades que no llegan o no prosperan', text: 'Inicios de algo bueno que siempre se caen. El campo energético del hogar no está alineado con la abundancia.' },
        ]} />

        <ImpactLine>Si te identificaste con 3 o más — tu casa necesita atención urgente.</ImpactLine>

        <Callout type="warning" title="Atención importante">
          Estos síntomas no son definitivos por sí solos. Pero cuando se acumulan y persisten, el ambiente del hogar es casi siempre una parte fundamental del problema — y la más fácil de corregir.
        </Callout>
      </PdfContentPage>

      {/* ── CAPÍTULO 3 — Diagnóstico Rápido ────────────────────────── */}
      <PdfContentPage
        kicker="Capítulo 3"
        title="Diagnóstico Rápido: ¿Cuántos Bloqueos Tienes?"
        subtitle="Marca cada punto que aplica a tu hogar ahora mismo. Sin excusas, sin juicio."
        accentGradient={ACCENT_GOLD}
      >
        <p className="mb-3 text-[18px] leading-relaxed text-foreground/80">
          Este diagnóstico es directo. No necesitas prepararte ni analizar demasiado. Responde con honestidad — cada punto marcado es un bloqueo activo en tu hogar que está afectando tu flujo financiero.
        </p>

        <SectionDivider title="Checklist de diagnóstico" color={C.gold} />

        <CheckList color={C.gold} className="mt-2 mb-3" items={[
          'Guardo el dinero en cualquier lugar — billetera tirada, monedas sueltas, sin orden',
          'Tengo objetos rotos en casa que no he reparado ni descartado',
          'Hay rincones de la casa que evito o ignoro hace semanas',
          'Nunca hago una limpieza energética del ambiente (ni con humo, ni con sal, ni intencional)',
          'Siento un peso o cansancio inexplicable cuando entro a casa',
          'Tengo cajones, closets o espacios llenos de cosas que no uso',
          'La entrada de mi casa está descuidada, oscura o llena de objetos',
          'Mi cuarto no tiene un lugar definido y organizado para el dinero o documentos importantes',
          'En mi cocina hay alimentos vencidos, ollas rotas o desorden habitual',
          'Mi baño tiene objetos viejos, frascos vacíos o humedad acumulada',
        ]} />

        <div
          className="rounded-xl px-4 py-3 mt-1"
          style={{ background: C.dark }}
        >
          <p className="text-[15.5px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: C.gold }}>
            Interpretación de tu diagnóstico
          </p>
          <div className="space-y-1">
            {[
              { range: '1–3 puntos', label: 'Bloqueo leve', desc: 'Algunas correcciones simples generarán cambios rápidos.' },
              { range: '4–6 puntos', label: 'Bloqueo moderado', desc: 'Tu hogar está frenando activamente tu prosperidad. Actúa esta semana.' },
              { range: '7–10 puntos', label: 'Bloqueo crítico', desc: 'Cambios urgentes. El ambiente está trabajando en tu contra todos los días.' },
            ].map(({ range, label, desc }) => (
              <div key={range} className="flex items-start gap-2">
                <span className="shrink-0 text-[15.5px] font-bold w-16" style={{ color: C.gold }}>{range}</span>
                <p className="text-[16px] leading-snug" style={{ color: 'hsl(42 60% 80%)' }}>
                  <span className="font-semibold">{label}: </span>
                  <span style={{ color: 'hsl(42 35% 65%)' }}>{desc}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </PdfContentPage>

      {/* ── CAPÍTULO 4 — Los Principales Errores (Parte 1) ─────────── */}
      <PdfContentPage
        kicker="Capítulo 4"
        title="Los Errores que Bloquean el Dinero"
        subtitle="Cada uno de estos errores parece pequeño. Juntos, crean una barrera invisible contra la prosperidad."
        accentGradient={ACCENT_GOLD}
      >
        <p className="mb-3 text-[18px] leading-relaxed text-foreground/80">
          Quase nadie habla de esto porque parece demasiado simple. Pero los monjes lo sabían: los grandes bloqueos casi siempre tienen raíces pequeñas. Aquí están los errores más comunes y más destructivos.
        </p>

        <StepList color={C.gold} className="mb-3" steps={[
          {
            title: 'Guardar el dinero sin intención',
            text: 'Billetes en cualquier bolsillo, monedas sueltas por toda la casa, billetera tirada en cualquier lugar. El dinero tratado sin respeto no tiene razón para quedarse. Designa un lugar específico y honroso para guardarlo.',
          },
          {
            title: 'Acumular objetos sin uso',
            text: 'Ropa que no usas hace años, aparatos rotos, cajas llenas de "por si acaso". Cada objeto innecesario ocupa espacio físico y energético, dejando sin lugar a las cosas nuevas — incluyendo oportunidades.',
          },
          {
            title: 'Tolerar objetos rotos',
            text: 'Una silla rota, un grifo que gotea, una lámpara que parpadea. Esto parece pequeño, pero bloquea todo. Los objetos rotos son señales de estancamiento que el subconsciente registra como normal.',
          },
        ]} />

        <MostPeopleIgnore>
          Un grifo goteando no es solo un problema de plomería. Es dinero literalmente fluyendo hacia afuera de tu hogar, día tras día. Quase nadie lo conecta — pero el patrón es claro.
        </MostPeopleIgnore>

        <Callout type="tip" title="Acción inmediata">
          Antes de continuar leyendo, identifica UN objeto roto en tu casa. Decide ahora: ¿lo reparas esta semana o lo descartas? No lo dejes en un punto medio — eso refuerza el bloqueo.
        </Callout>
      </PdfContentPage>

      {/* ── CAPÍTULO 4 continued — Errores (Parte 2) ───────────────── */}
      <PdfContentPage
        kicker="Capítulo 4 — continuación"
        title="Los Errores que Bloquean el Dinero"
        subtitle="Los errores energéticos más sutiles — y más destructivos."
        accentGradient={ACCENT_GOLD}
      >
        <StepList color={C.gold} className="mb-3" steps={[
          {
            title: 'Bagunça en áreas estratégicas',
            text: 'Hay áreas del hogar directamente relacionadas con el flujo financiero: la entrada, la cocina y el escritorio de trabajo. Desorden en estos puntos específicos bloquea directamente las oportunidades y la abundancia.',
          },
          {
            title: 'Energía parada — sin renovación',
            text: 'Ambientes que nunca se ventilan, rincones que nadie toca hace semanas, olores estancados. La energía parada es el equivalente energético de agua empozada: fermenta y enferma todo lo que está alrededor.',
          },
          {
            title: 'Actuar sin intención en tu hogar',
            text: 'Entrar y salir de casa sin ninguna consciencia. No agradecer, no reconectar con el espacio, no marcar una intención al inicio del día. El hogar sin intención se convierte en un espacio neutro y sin vida.',
          },
        ]} />

        <ComparisonCard
          leftTitle="Hogar bloqueado"
          rightTitle="Hogar alineado"
          leftItems={[
            'Objetos rotos tolerados',
            'Dinero guardado sin orden',
            'Rincones olvidados y oscuros',
            'Sin limpieza energética',
            'Entrada descuidada',
          ]}
          rightItems={[
            'Todo funciona o está descartado',
            'Lugar definido y respetado para el dinero',
            'Cada rincón tiene intención',
            'Limpieza semanal consciente',
            'Entrada luminosa y ordenada',
          ]}
          color={C.gold}
        />

        <ImpactLine>La diferencia no está en tener una casa perfecta. Está en tener una casa viva.</ImpactLine>
      </PdfContentPage>

      {/* ── CAPÍTULO 5 — Puntos Críticos: Entrada y Dormitorio ─────── */}
      <PdfContentPage
        kicker="Capítulo 5"
        title="Los Puntos Críticos del Hogar"
        subtitle="Cada área de tu casa tiene una energía específica. Estas son las que más impactan tu prosperidad."
        accentGradient={ACCENT_GOLD}
      >
        <p className="mb-3 text-[18px] leading-relaxed text-foreground/80">
          No todas las áreas del hogar tienen el mismo peso energético. En la tradición monástica, se identificaban zonas de alto impacto — aquellas que, cuidadas o descuidadas, determinan el estado de todo el sistema. Empieza por estas.
        </p>

        <HomeAreaCard
          icon="🚪"
          area="Entrada de la casa"
          error="Zapatos acumulados, cajones llenos, decoración vieja o plantas secas justo en la entrada."
          consequence="La entrada es la boca de tu hogar. Todo lo que bloquea la entrada bloquea la llegada de oportunidades, dinero y personas positivas a tu vida."
        />

        <HomeAreaCard
          icon="🛏"
          area="Dormitorio"
          error="Cosas guardadas bajo la cama, desorden en cajones, ropa sin usar acumulada, espejos frente a la cama."
          consequence="El dormitorio es donde recargas tu energía. Un dormitorio desordenado garantiza que te despiertes ya cansado, con la mente llena de ruido — sin capacidad para tomar decisiones financieras claras."
        />

        <MostPeopleIgnore>
          La mayoría guarda cajas, valijas y ropa bajo la cama "para ahorrar espacio". Esto bloquea el flujo de energía mientras duermes — exactamente cuando tu sistema debería estar recuperándose y procesando oportunidades.
        </MostPeopleIgnore>

        <FactBox
          fact="En la tradición monástica tibetana, el espacio para descansar era sagrado — limpio, despejado y sin objetos que 'anclaran' energía estancada. Era considerado el primer acto de cuidado hacia uno mismo."
          color={C.gold}
          className="mt-3"
        />
      </PdfContentPage>

      {/* ── CAPÍTULO 5 continued — Cocina y Baño ──────────────────── */}
      <PdfContentPage
        kicker="Capítulo 5 — continuación"
        title="Cocina, Baño y los Rincones Olvidados"
        subtitle="Las áreas que más se descuidan — y que más pesan en el flujo de prosperidad."
        accentGradient={ACCENT_GOLD}
      >
        <HomeAreaCard
          icon="🍳"
          area="Cocina"
          error="Alimentos vencidos en la despensa, ollas o electrodomésticos rotos, desorden constante en mesadas."
          consequence="La cocina representa el sustento y la abundancia del hogar. Una cocina descuidada señala, a nivel simbólico y energético, que no hay cuidado con los recursos — y el dinero sigue el mismo patrón."
        />

        <HomeAreaCard
          icon="🚿"
          area="Baño"
          error="Frascos vacíos acumulados, toallas viejas y desgastadas, humedad sin tratar, desagüe tapado o lento."
          consequence="El baño está directamente relacionado con la purificación y la eliminación de lo que ya no sirve. Un baño estancado retiene energía vieja, deudas y situaciones que deberían haberse ido."
        />

        <HomeAreaCard
          icon="🌑"
          area="Rincones olvidados"
          error="Ángulos de la casa que nadie limpia, espacios detrás de muebles llenos de polvo, áreas oscuras sin iluminación."
          consequence="Los rincones olvidados son donde la energía estancada se concentra. Son los 'puntos ciegos' de tu hogar — y generalmente reflejan los puntos ciegos de tu vida financiera."
        />

        <Callout type="info" title="El principio del monje para el hogar">
          Antes de limpiar o decorar, identifica los espacios que más evitas en tu casa. Esos son exactamente los que más necesitan atención. Lo que evitas en tu hogar, lo evitas en tu vida.
        </Callout>
      </PdfContentPage>

      {/* ── CAPÍTULO 5 continued — Área de Trabajo y Sala ─────────── */}
      <PdfContentPage
        kicker="Capítulo 5 — continuación"
        title="Área de Trabajo y Sala de Estar"
        subtitle="Los dos espacios que más impactan tu mente financiera — y los más ignorados."
        accentGradient={ACCENT_GOLD}
      >
        <p className="mb-3 text-[18px] leading-relaxed text-foreground/80">
          Si tienes un espacio de trabajo en casa — aunque sea una mesa, un escritorio o un rincón donde manejas tu negocio o finanzas — ese espacio tiene peso crítico. Es donde tu mente toma decisiones. Un área de trabajo caótica produce decisiones caóticas.
        </p>

        <HomeAreaCard
          icon="💼"
          area="Área de trabajo / escritorio"
          error="Papeles acumulados, cables sueltos, documentos mezclados, objetos sin relación al trabajo llenando el escritorio."
          consequence="Tu mente procesa inconscientemente todo lo que ve. Un escritorio caótico garantiza una mente fragmentada al tomar decisiones financieras — más errores, menos claridad, más dinero perdido."
        />

        <HomeAreaCard
          icon="🛋"
          area="Sala de estar"
          error="Muebles mal posicionados, decoración obsoleta, objetos sin uso en estanterías, iluminación pobre o nula en rincones."
          consequence="La sala es el pulmón social y energético del hogar. Un espacio apretado o mal iluminado comprime la energía y transmite inconscientemente la sensación de escasez — no de abundancia."
        />

        <MostPeopleIgnore>
          Casi nadie conecta el desorden del escritorio con la calidad de sus decisiones financieras. Pero hay una relación directa: ambiente caótico = pensamiento caótico = dinero mal gestionado.
        </MostPeopleIgnore>

        <Callout type="tip" title="Acción para el área de trabajo">
          Despeja tu escritorio hasta que solo quede lo esencial para la tarea actual. Haz esto antes de cualquier decisión financiera importante — sentirás la diferencia en la claridad mental de inmediato.
        </Callout>
      </PdfContentPage>

      {/* ── CAPÍTULO 6 — Rituales de Corrección (Parte 1) ──────────── */}
      <PdfContentPage
        kicker="Capítulo 6"
        title="Rituales de Corrección Inmediata"
        subtitle="Simples, directos y aplicables hoy. Sin esoterismo, sin complicaciones."
        accentGradient={ACCENT_GOLD}
      >
        <p className="mb-3 text-[18px] leading-relaxed text-foreground/80">
          Los monjes no pasaban horas en rituales elaborados. Sus prácticas de mantenimiento del espacio eran simples, consistentes y con intención clara. Lo mismo aplica aquí. Estos rituales están diseñados para ser rápidos y efectivos.
        </p>

        <SectionHeading>Rituales de limpieza y activación</SectionHeading>

        <RitualCard
          number="1"
          title="Ritual del arroz — Activación de abundancia"
          how="Coloca un cuenco pequeño con arroz blanco crudo en la entrada de tu casa. Cámbialo cada 15 días. El arroz absorbe energía estancada y activa el símbolo de sustento y prosperidad en el punto de entrada del hogar."
          time="5 minutos / cada 15 días"
        />

        <RitualCard
          number="2"
          title="Limpieza con sal — Purificación del espacio"
          how="Coloca sal gruesa en los rincones de las habitaciones principales por 24 horas. Después descártala en agua corriente, nunca en la basura dentro de casa. La sal absorbe cargas energéticas negativas acumuladas."
          time="24 horas / mensual"
        />

        <RitualCard
          number="3"
          title="Ventilación intencional — Renovación del ambiente"
          how="Abre todas las ventanas durante al menos 15 minutos. Mientras lo haces, di en voz alta: 'Lo viejo se va. Lo nuevo llega.' No es magia — es programar tu mente y limpiar el ambiente de forma simultánea."
          time="15 minutos / semanal"
        />

        <MostPeopleIgnore>
          El ritual más poderoso es el más simple: abrir las ventanas con intención. Quase nadie lo hace conscientemente — y la diferencia energética entre ventilación mecánica y ventilación intencional es enorme.
        </MostPeopleIgnore>
      </PdfContentPage>

      {/* ── CAPÍTULO 6 continued — Rituales (Parte 2) ─────────────── */}
      <PdfContentPage
        kicker="Capítulo 6 — continuación"
        title="Rituales de Organización y Activación Financiera"
        subtitle="Los rituales que conectan directamente el orden del hogar con el flujo del dinero."
        accentGradient={ACCENT_GOLD}
      >
        <RitualCard
          number="4"
          title="El lugar del dinero — Respeto financiero"
          how="Designa un lugar específico y ordenado para guardar tu billetera, documentos financieros y cualquier efectivo. Mantenlo limpio y organizado. Antes de dormir, pon la billetera allí con gratitud — no de manera descuidada."
          time="2 minutos / diario"
        />

        <RitualCard
          number="5"
          title="Reorganización estratégica — Activación de puntos críticos"
          how="Una vez por semana, despeja y limpia la entrada de tu casa, la mesada de la cocina y tu escritorio o área de trabajo. Estos tres puntos son los principales reguladores del flujo energético doméstico."
          time="20 minutos / semanal"
        />

        <RitualCard
          number="6"
          title="Palabras de salida — Ancla mental y energética"
          how="Antes de salir de casa cada mañana, pausa un segundo en la puerta y di (en voz baja o en tu mente): 'Salgo preparado para recibir lo que es mío.' Es simple. Es poderoso. Programa tu estado mental para el día."
          time="10 segundos / diario"
        />

        <Divider variant="gradient" color={C.gold} className="my-3" />

        <HighlightBanner
          text="No necesitas hacer todos los rituales al mismo tiempo. Empieza con uno. La consistencia es más valiosa que la perfección."
          icon="☯"
          color={C.earth}
          className="mt-2"
        />
      </PdfContentPage>

      {/* ── CAPÍTULO 6 continued — Por Qué Funcionan ──────────────── */}
      <PdfContentPage
        kicker="Capítulo 6 — continuación"
        title="Por Qué Estos Rituales Realmente Funcionan"
        subtitle="No es misticismo. Es psicología aplicada con siglos de práctica monástica detrás."
        accentGradient={ACCENT_GOLD}
      >
        <p className="mb-2 text-[18px] leading-relaxed text-foreground/80">
          Los rituales monásticos no fueron inventados por casualidad. Surgieron de siglos de observación de cómo el ambiente afecta la mente, el comportamiento y los resultados. La psicología moderna confirma lo que los monjes ya sabían.
        </p>

        <SectionDivider title="La lógica detrás del ritual" color={C.gold} />

        <StepList color={C.gold} className="mt-2 mb-3" steps={[
          {
            title: 'El ambiente moldea el comportamiento',
            text: 'La psicología ambiental demuestra que el espacio físico influye directamente en el estado mental, el nivel de estrés y la capacidad de tomar decisiones. Un ambiente ordenado reduce el cortisol y activa el pensamiento estratégico.',
          },
          {
            title: 'Los rituales crean anclas mentales',
            text: 'Cuando realizas un ritual con intención, programas una respuesta condicionada. Tu mente asocia el acto con el estado deseado. Los monjes usaban esto para mantener claridad constante durante sus prácticas diarias.',
          },
          {
            title: 'El símbolo activa el subconsciente',
            text: 'El arroz, la sal, la luz — no son ingredientes mágicos. Son símbolos que comunican una intención a tu subconsciente. Y el subconsciente dirige entre el 85% y el 95% de tus decisiones diarias, incluidas las financieras.',
          },
        ]} />

        <FactBox
          fact="Investigadores de la Universidad de Minnesota encontraron que personas en habitaciones ordenadas tomaban decisiones más generosas, más saludables y más estratégicas que las mismas personas en habitaciones desordenadas."
          color={C.gold}
          className="mb-3"
        />

        <MonkWisdom>
          "El ritual no cambia el mundo exterior. Cambia al hombre que lo realiza. Y es el hombre cambiado quien transforma su mundo."
        </MonkWisdom>
      </PdfContentPage>

      {/* ── CAPÍTULO 6 continued — Errores al Aplicar ─────────────── */}
      <PdfContentPage
        kicker="Capítulo 6 — continuación"
        title="Los Errores más Comunes al Aplicar"
        subtitle="Hacer los rituales no es suficiente si caes en estas trampas. La mayoría las comete sin darse cuenta."
        accentGradient={ACCENT_GOLD}
      >
        <p className="mb-3 text-[18px] leading-relaxed text-foreground/80">
          El mayor error no es no hacer los rituales. Es hacerlos de manera incorrecta — mecánica, sin intención, o abandonarlos antes de que den resultado. Estos son los errores más frecuentes y más costosos.
        </p>

        <StepList color={C.gold} className="mb-3" steps={[
          {
            title: 'Hacerlo por obligación, no por intención',
            text: 'Si realizas el ritual pensando "ya, para salir del paso", el efecto es mínimo. La intención es el componente activo. Tómate 10 segundos antes de cada ritual para conectar con el propósito: activar el flujo de abundancia en mi hogar.',
          },
          {
            title: 'Esperar resultados en 48 horas',
            text: 'El cambio energético del hogar no es instantáneo. Requiere semanas de práctica consistente. Quien abandona en la primera semana nunca sabrá qué habría ocurrido en la cuarta.',
          },
          {
            title: 'Corregir una cosa y dejar todo lo demás igual',
            text: 'Poner arroz en la entrada no compensa 15 objetos rotos en el resto de la casa. Los rituales amplifican el orden — no lo reemplazan. Sin corrección de bloqueos básicos, el efecto es marginal.',
          },
          {
            title: 'Hacer el ritual y volver al mismo desorden',
            text: 'La limpieza del sábado no sobrevive al caos del lunes si no hay hábitos de mantenimiento. Sin estructura diaria básica, estás vaciando un balde con un hoyo en el fondo.',
          },
        ]} />

        <Callout type="warning" title="La regla de oro">
          Ritual sin orden es decoración. Orden sin ritual es solo higiene. Los dos juntos — con intención — es lo que abre el flujo de verdad.
        </Callout>
      </PdfContentPage>

      {/* ── CAPÍTULO 7 — Rutina de Mantenimiento ───────────────────── */}
      <PdfContentPage
        kicker="Capítulo 7"
        title="Rutina de Mantenimiento Simplificada"
        subtitle="Lo que hacer semanalmente para mantener el flujo abierto — sin convertirlo en otra carga."
        accentGradient={ACCENT_GOLD}
      >
        <p className="mb-3 text-[18px] leading-relaxed text-foreground/80">
          El secreto de los monjes no era la gran purificación anual. Era el mantenimiento diario pequeño y consistente. Una casa que se mantiene requiere menos esfuerzo que una que se descuida y luego necesita una renovación total.
        </p>

        <SectionDivider title="Lo que hacer cada semana" color={C.gold} />

        <StepList color={C.gold} className="mt-2 mb-3" steps={[
          {
            title: 'Lunes — Diagnóstico rápido',
            text: 'Tarda 5 minutos. Recorre tu hogar y observa: ¿hay algo roto que toleras? ¿Un rincón acumulando cosas? ¿La entrada despejada? Identifica un punto a corregir.',
          },
          {
            title: 'Miércoles — Ventilación y limpieza de puntos críticos',
            text: 'Abre ventanas. Limpia la entrada, la mesada de cocina y tu espacio de trabajo. Estos tres puntos deben mantenerse despejados consistentemente.',
          },
          {
            title: 'Viernes — Cierre de ciclo financiero',
            text: 'Ordena tu billetera, revisa tus documentos financieros y tira o guarda correctamente cualquier recibo, nota o papel suelto. Cierra la semana con orden financiero.',
          },
        ]} />

        <SectionDivider title="Lo que evitar" color={C.gold} />

        <CheckList color={C.danger} className="mt-2 mb-3" items={[
          'Dejar objetos rotos "para arreglar después" por más de 7 días',
          'Acumular ropa, zapatos u objetos sin uso sin una fecha límite para descartarlos',
          'Dejar la entrada de la casa descuidada más de 48 horas',
          'Guardar el dinero de manera descuidada — tirado, sin orden, sin respeto',
          'Ignorar el olor o sensación del ambiente (son señales de energía estancada)',
        ]} />

        <Callout type="tip" title="El hábito más importante">
          Si solo puedes hacer una cosa por semana, que sea esta: despeja y limpia la entrada de tu casa cada viernes. Este único hábito tiene el mayor impacto en el flujo de oportunidades y dinero hacia tu vida.
        </Callout>
      </PdfContentPage>

      {/* ── CAPÍTULO 7 continued — Hábitos que Amplifican ─────────── */}
      <PdfContentPage
        kicker="Capítulo 7 — continuación"
        title="Hábitos que Amplifican el Flujo"
        subtitle="Más allá del orden. Los comportamientos diarios que refuerzan o destruyen la energía del hogar."
        accentGradient={ACCENT_GOLD}
      >
        <p className="mb-2 text-[18px] leading-relaxed text-foreground/80">
          La rutina de mantenimiento abre el canal. Estos hábitos lo mantienen abierto. Son comportamientos simples que la mayoría nunca considera — pero que hacen toda la diferencia en la energía acumulada del hogar a lo largo del tiempo.
        </p>

        <SectionDivider title="Hábitos de alto impacto" color={C.gold} />

        <div className="space-y-2 mb-3">
          {[
            {
              habit: 'Ilumina tu hogar conscientemente',
              detail: 'La oscuridad acumula energía estancada. Enciende luces en cada rincón que usas. La luz — natural o artificial — activa el ambiente y señala al subconsciente que el espacio está vivo y en movimiento.',
            },
            {
              habit: 'Usa plantas vivas — no artificiales',
              detail: 'Las plantas vivas generan oxígeno, absorben toxinas y representan crecimiento activo. Una planta muerta o artificial hace lo opuesto — simboliza estancamiento. Una sola planta viva en la entrada cambia la energía de todo el acceso.',
            },
            {
              habit: 'Activa el espacio con sonido',
              detail: 'El silencio constante estanca la energía. Los monjes lo sabían: cantos, campanas, cuencos — el sonido activa el espacio. En casa, música suave mientras limpias o cocinas produce el mismo efecto.',
            },
            {
              habit: 'Cierra el día con intención',
              detail: 'Antes de dormir, da una vuelta rápida: apaga lo que debe apagarse, ordena lo que se desorganizó. Esta acción de 3 minutos cierra el ciclo diario y evita que el desorden acumule energía negativa nocturna.',
            },
          ].map(({ habit, detail }) => (
            <div
              key={habit}
              className="avoid-page-break rounded-lg px-3.5 py-2.5"
              style={{ background: C.goldLight, border: `1px solid ${C.goldBorder}` }}
            >
              <p className="text-[16.5px] font-bold mb-0.5" style={{ color: C.earth }}>✦ {habit}</p>
              <p className="text-[16px] leading-snug text-foreground/65">{detail}</p>
            </div>
          ))}
        </div>

        <ImpactLine>Un hogar vivo genera oportunidades vivas. Un hogar apagado genera una vida apagada.</ImpactLine>
      </PdfContentPage>

      {/* ── CAPÍTULO 8 — Qué Esperar ────────────────────────────────── */}
      <PdfContentPage
        kicker="Capítulo 8"
        title="Qué Esperar Después de Aplicar"
        subtitle="Los cambios no son dramáticos al inicio. Pero son reales, progresivos y acumulativos."
        accentGradient={ACCENT_GOLD}
      >
        <p className="mb-3 text-[18px] leading-relaxed text-foreground/80">
          Cuando empiezas a corregir los bloqueos de tu hogar, los primeros cambios son internos. La gente siempre espera ver el dinero aparecer de inmediato — pero el primer regalo es algo más valioso: claridad mental y una sensación diferente al entrar a tu casa.
        </p>

        <SectionDivider title="Lo que ocurre en las primeras semanas" color={C.gold} />

        <StepList color={C.gold} className="mt-2 mb-3" steps={[
          {
            title: 'Semana 1 — Sensación de leveza',
            text: 'Literalmente te sientes más ligero al entrar a casa. El ambiente limpio y ordenado reduce el ruido mental y el estrés sin que hayas "resuelto" nada externo.',
          },
          {
            title: 'Semana 2-3 — Mayor claridad para tomar decisiones',
            text: 'Las decisiones financieras empiezan a sentirse más claras. No porque el dinero haya cambiado — sino porque tu mente tiene menos ruido que procesar y más espacio para pensar.',
          },
          {
            title: 'Semana 4 en adelante — Oportunidades que llegan',
            text: 'Comienzan a aparecer oportunidades, contactos o situaciones favorables que antes no se presentaban. No es magia — es que ahora estás en un estado mental diferente para reconocerlas y recibirlas.',
          },
        ]} />

        <MonkWisdom>
          "El monje no espera milagros externos. Trabaja su interior y su espacio, y deja que los milagros sean consecuencia natural de ese orden."
        </MonkWisdom>

        <Callout type="success" title="Lo que no debes esperar">
          Resultados instantáneos o dramáticos en la primera semana. El proceso es como abrir una ventana que llevaba meses cerrada: el aire fresco entra gradualmente, pero la transformación del ambiente es real y permanente.
        </Callout>
      </PdfContentPage>

      {/* ── BÔNUS — Checklist Maestra de Prosperidad ───────────────── */}
      <PdfContentPage
        kicker="Bônus"
        title="Tu Checklist Maestra de Prosperidad"
        subtitle="Imprime esta página y tenla a mano. Es tu referencia rápida para mantener el flujo abierto."
        accentGradient={ACCENT_EARTH}
      >
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-[15px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: C.gold }}>
              ✦ Revisión semanal
            </p>
            <CheckList color={C.gold} items={[
              'Entrada limpia y despejada',
              'Ningún objeto roto tolerado',
              'Cajones y closets revisados',
              'Ventilación intencional hecha',
              'Escritorio / área de trabajo despejada',
              'Lugar del dinero ordenado',
            ]} />
          </div>
          <div>
            <p className="text-[15px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: C.gold }}>
              ✦ Revisión mensual
            </p>
            <CheckList color={C.gold} items={[
              'Ritual del arroz renovado',
              'Limpieza con sal completada',
              'Plantas vivas cuidadas',
              'Objetos sin uso descartados',
              'Rincones olvidados limpiados',
              'Diagnóstico rápido hecho',
            ]} />
          </div>
        </div>

        <Divider variant="gradient" color={C.gold} className="my-2" />

        <p className="text-[15px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: C.gold }}>
          ✦ Los 5 errores que NUNCA debes repetir
        </p>
        <div className="space-y-1.5 mb-3">
          {[
            'Dejar objetos rotos por más de 7 días sin decidir — reparar o descartar',
            'Guardar el dinero sin un lugar fijo, ordenado y respetado en casa',
            'Ignorar la entrada de tu casa más de 48 horas seguidas',
            'Hacer rituales sin intención — de forma mecánica y distraída',
            'Limpiar una sola vez y esperar que el efecto dure indefinidamente',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="shrink-0 text-[15.5px] font-bold mt-0.5" style={{ color: C.danger }}>✕</span>
              <p className="text-[16px] leading-snug text-foreground/70">{item}</p>
            </div>
          ))}
        </div>

        <HighlightBanner
          text="Esta checklist no es un recordatorio. Es tu escudo diario contra los bloqueos que la mayoría ni siquiera ve."
          icon="☯"
          color={C.earth}
        />
      </PdfContentPage>

      {/* ── CONCLUSIÓN — El Código es Tuyo ─────────────────────────── */}
      <PdfContentPage
        kicker="Conclusión"
        title="El Código es Tuyo"
        subtitle="Ahora sabes lo que la mayoría nunca descubrirá. La pregunta es qué harás con eso."
        accentGradient={ACCENT_EARTH}
      >
        <div
          className="avoid-page-break mb-3 rounded-xl px-4 py-3.5"
          style={{ background: C.goldLight, border: `1px solid ${C.goldBorder}` }}
        >
          <p className="font-display text-[1rem] font-semibold leading-snug" style={{ color: C.earth }}>
            Ahora sabes por qué el dinero se iba.<br />
            Ahora entiendes qué lo detenía.<br />
            Y ahora tienes las herramientas para cambiarlo.
          </p>
        </div>

        <p className="mb-2 text-[18px] leading-relaxed text-foreground/80">
          El código oculto de tu hogar no era magia oscura ni mala suerte. Era un patrón invisible que se repetía día a día, creando resistencia donde debía haber flujo. Ya no es invisible para ti.
        </p>

        <ImpactLine>La mayoría de las personas seguirá buscando la solución afuera. Tú ya sabes que empieza adentro — en el espacio que habitas.</ImpactLine>

        <SectionDivider title="Tus próximos tres pasos" color={C.gold} />

        <StepList color={C.gold} className="mt-2 mb-3" steps={[
          {
            title: 'Hoy — Un solo cambio',
            text: 'Identifica el punto más crítico de tu hogar según el diagnóstico. Un objeto roto, un rincón ignorado, la entrada descuidada. Corrígelo hoy. Un cambio real ahora vale más que diez cambios planeados para después.',
          },
          {
            title: 'Esta semana — Instala la rutina',
            text: 'Aplica la rutina de mantenimiento simplificada durante 7 días seguidos. No hace falta perfección — solo consistencia. Un pequeño ritual diario activa el cambio de patrón.',
          },
          {
            title: 'Este mes — Evalúa y ajusta',
            text: 'Después de 30 días, vuelve al diagnóstico rápido. Observa qué cambió — no solo en tu casa, sino en tu claridad mental, tus oportunidades y tu relación con el dinero.',
          },
        ]} />

        <MonkWisdom>
          "El hogar es el espejo del alma. Cuando el monje ordena su celda, ordena su mente. Cuando ordena su mente, ordena su destino."
        </MonkWisdom>

        <HighlightBanner
          text="El cambio ya comenzó. No fue cuando terminaste de leer — fue cuando decidiste que algo tenía que cambiar."
          icon="✦"
          color={C.gold}
          className="mt-3"
        />
      </PdfContentPage>
    </>
  );
}
