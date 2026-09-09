/**
 * PDF 15 — Rota: /pdf/ebook-quince · Las 7 Activaciones Mentales del Monje
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';
import {
  Divider,
  SectionDivider,
  HighlightBanner,
  Callout,
} from '@/components/ebook/VisualElements';

// ── Paleta ────────────────────────────────────────────────────────
const C = {
  indigo:       'hsl(242 42% 36%)',
  indigoLight:  'hsl(242 40% 96%)',
  indigoBorder: 'hsl(242 35% 76%)',
  dark:         'hsl(240 38% 10%)',
  darkMid:      'hsl(240 32% 16%)',
  gold:         'hsl(42 78% 48%)',
  goldLight:    'hsl(42 70% 94%)',
  goldBorder:   'hsl(42 60% 70%)',
  muted:        'hsl(242 20% 55%)',
  cream:        'hsl(40 30% 97%)',
};

const ACCENT_INDIGO = `linear-gradient(to bottom, ${C.indigo}, hsl(255 38% 28%), hsl(265 30% 20%))`;
const ACCENT_GOLD   = `linear-gradient(to bottom, hsl(42 78% 44%), hsl(38 65% 36%), hsl(32 55% 28%))`;

// ── Componentes exclusivos ─────────────────────────────────────────

function ActivationNumber({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-4 flex items-start gap-4">
      <div
        className="shrink-0 flex items-center justify-center rounded-full w-10 h-10 text-[18px] font-bold font-display mt-0.5"
        style={{ background: C.gold, color: C.dark }}
      >
        {number}
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-0.5" style={{ color: C.gold }}>
          Activación
        </p>
        <h2 className="font-display text-[1.4rem] font-bold leading-tight" style={{ color: C.dark }}>
          {title}
        </h2>
      </div>
    </div>
  );
}

function EmotionalReflection({ children }: { children: ReactNode }) {
  return (
    <div
      className="mb-3 rounded-xl px-5 py-4"
      style={{ background: C.indigoLight, border: `1.5px solid ${C.indigoBorder}` }}
    >
      <p className="text-[15px] italic leading-relaxed" style={{ color: C.indigo }}>
        {children}
      </p>
    </div>
  );
}

function MonkTeaching({ children }: { children: ReactNode }) {
  return (
    <div
      className="my-3 rounded-xl px-5 py-4"
      style={{ background: C.dark }}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-2" style={{ color: C.gold }}>
        ☯ La enseñanza
      </p>
      <p className="text-[15px] leading-relaxed" style={{ color: 'hsl(240 20% 80%)' }}>
        {children}
      </p>
    </div>
  );
}

function ActivationPhrase({ children }: { children: ReactNode }) {
  return (
    <div
      className="my-4 rounded-2xl px-5 py-5 text-center"
      style={{ background: C.darkMid, border: `1px solid ${C.gold}35` }}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: C.muted }}>
        Frase de activación
      </p>
      <p className="font-display text-[1.15rem] font-bold leading-snug" style={{ color: C.gold }}>
        "{children}"
      </p>
    </div>
  );
}

function HomeConnection({ children }: { children: ReactNode }) {
  return (
    <div
      className="mt-3 rounded-lg px-4 py-3"
      style={{ background: `${C.gold}12`, borderLeft: `2px solid ${C.gold}` }}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: C.gold }}>
        ◆ Conexión con tu hogar
      </p>
      <p className="text-[13px] font-semibold italic leading-snug" style={{ color: C.indigo }}>
        {children}
      </p>
    </div>
  );
}

function NarrativeBody({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-[15px] leading-relaxed text-foreground/80">
      {children}
    </p>
  );
}

// ── Ebook principal ────────────────────────────────────────────────

export default function EbookQuince() {
  return (
    <>
      {/* ── COVER ─────────────────────────────────────────────────── */}
      <section
        className="relative h-[297mm] overflow-hidden page-break-after print:shadow-none"
        style={{
          backgroundImage: 'url(/capa-7-activaciones.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: C.dark,
        }}
      />

      {/* ── INTRODUCCIÓN ─────────────────────────────────────────── */}
      <PdfContentPage
        kicker="Introducción"
        title="Antes de Comenzar"
        subtitle="Lo que nadie te dijo sobre los bloqueos del dinero."
        accentGradient={ACCENT_INDIGO}
      >
        <NarrativeBody>
          Hay un momento en la vida de cada persona en el que la pregunta deja de ser "¿cuándo voy a tener más dinero?" y se convierte en algo más profundo, más incómodo: "¿por qué, sin importar lo que haga, el dinero nunca se queda?"
        </NarrativeBody>

        <NarrativeBody>
          Los monjes estudiaron esa pregunta durante siglos. No desde la óptica de la economía o las finanzas — sino desde el lugar donde todo comienza: la mente. Entendieron que el bloqueo financiero no es solo un problema del mundo exterior. Es, antes que nada, un patrón interno. Una programación que opera silenciosamente, tomando decisiones antes de que tú lo hagas conscientemente.
        </NarrativeBody>

        <div
          className="rounded-xl px-5 py-4 mb-3"
          style={{ background: C.dark }}
        >
          <p className="font-display text-[1rem] font-semibold leading-snug" style={{ color: 'hsl(42 70% 85%)' }}>
            No es falta de esfuerzo.<br />
            No es mala suerte.<br />
            Es un código interno que nunca fue actualizado.
          </p>
        </div>

        <NarrativeBody>
          Las 7 Activaciones que encontrarás en estas páginas no son afirmaciones positivas vacías. Son textos guiados — diseñados para llevarte a ese espacio interior donde los bloqueos viven — para que puedas verlos, entenderlos, y comenzar a liberarlos.
        </NarrativeBody>

        <NarrativeBody>
          Léelas con calma. Sin prisa. Pueden leerse en secuencia o volver a la que más necesites en cada momento. Cada vez que las leas, algo diferente resonará en ti.
        </NarrativeBody>

        <HomeConnection>
          El bloqueo interno y el bloqueo externo se alimentan mutuamente. Por eso este bônus acompaña al método principal: cuando limpias tu espacio y tu mente al mismo tiempo, el cambio es profundo y duradero.
        </HomeConnection>
      </PdfContentPage>

      {/* ── INTRODUCCIÓN Pt2 ──────────────────────────────────────── */}
      <PdfContentPage
        kicker="Introducción — continuación"
        title="Cómo Usar Este Bônus"
        subtitle="Una guía breve para sacar el máximo de cada activación."
        accentGradient={ACCENT_INDIGO}
      >
        <NarrativeBody>
          Los monjes tenían un principio fundamental: la preparación es parte del ritual. Antes de recibir, había que estar listo para recibir. Antes de leer estas activaciones, existe una forma de abordarlas que multiplica su efecto.
        </NarrativeBody>

        <SectionDivider title="Antes de cada activación" color={C.indigo} />

        <div className="space-y-2.5 mb-3 mt-2">
          {[
            {
              step: '01',
              title: 'Busca silencio',
              text: 'No es necesario un ritual elaborado. Bastam dos minutos en un lugar tranquilo, sin el teléfono cerca. La mente necesita espacio para absorber lo que va a leer.',
            },
            {
              step: '02',
              title: 'Lee despacio',
              text: 'Estas páginas no son para consumir rápido. Son para sentir. Si una frase te detiene — bien. Quédate ahí. Eso es exactamente donde el trabajo ocurre.',
            },
            {
              step: '03',
              title: 'Repite la frase de activación',
              text: 'Al final de cada texto hay una frase corta. No la leas y pases de página. Repítela en voz baja, tres veces. Déjala instalarse.',
            },
            {
              step: '04',
              title: 'Vuelve cuando lo necesites',
              text: 'No existe un orden obligatorio después de la primera lectura. Si hoy sientes que te estancaste, abre la Activación 2. Si sientes miedo al dinero, abre la 5. Este material es un recurso vivo.',
            },
          ].map(({ step, title, text }) => (
            <div key={step} className="flex items-start gap-3 rounded-lg px-3.5 py-2.5"
              style={{ background: C.indigoLight, border: `1px solid ${C.indigoBorder}` }}>
              <span className="shrink-0 text-[11px] font-bold w-5 mt-0.5" style={{ color: C.indigo }}>{step}</span>
              <div>
                <p className="text-[13px] font-semibold mb-0.5" style={{ color: C.indigo }}>{title}</p>
                <p className="text-[13px] leading-snug text-foreground/65">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <HighlightBanner
          text="No necesitas creer en nada. Solo necesitas estar dispuesto a mirar hacia adentro."
          icon="☯"
          color={C.indigo}
        />
      </PdfContentPage>

      {/* ── ACTIVACIÓN 1 ──────────────────────────────────────────── */}
      <PdfContentPage
        kicker="Activación 1"
        title="Cuando el Dinero No Alcanza"
        subtitle=""
        accentGradient={ACCENT_INDIGO}
      >
        <ActivationNumber number="1" title="Cuando el Dinero No Alcanza" />

        <EmotionalReflection>
          Trabajas. Te esfuerzas. Calculas. Y aun así, al final del mes, el dinero simplemente no alcanza. No es que no hagas nada — es que lo que haces nunca parece ser suficiente. Y esa palabra, "suficiente", empieza a pegarse a ti de maneras que van más allá de las finanzas.
        </EmotionalReflection>

        <NarrativeBody>
          Lo que pocas personas entienden es que la escasez tiene una dimensión que no aparece en ninguna cuenta bancaria. Es una frecuencia. Una manera de habitar el mundo que se instala tan profundo que empieza a parecer simplemente "la realidad". Ya no cuestionas por qué no alcanza — solo asumes que así son las cosas para ti.
        </NarrativeBody>

        <MonkTeaching>
          El monje enseña esto: la mente que vive en escasez no puede reconocer la abundancia aunque esté frente a ella. No porque sea ciega — sino porque está calibrada para confirmar lo que ya cree. Cada vez que el dinero no alcanza, el sistema interno dice "lo sabía". Y esa certeza, repetida mil veces, se vuelve un muro invisible.
        </MonkTeaching>

        <NarrativeBody>
          El primer paso no es ganar más. Es romper la certeza de que nunca será suficiente. Porque mientras esa certeza viva en ti, cualquier cantidad de dinero que llegue pasará por tus manos como agua entre los dedos.
        </NarrativeBody>

        <ActivationPhrase>Yo no persigo el dinero. Creo las condiciones para que llegue y se quede.</ActivationPhrase>

        <HomeConnection>
          El dinero no permanece donde el caos gobierna. Así como tu mente necesita orden para retenerlo, tu hogar necesita estructura para recibirlo. Los dos trabajan juntos — o los dos fallan juntos.
        </HomeConnection>
      </PdfContentPage>

      {/* ── ACTIVACIÓN 2 ──────────────────────────────────────────── */}
      <PdfContentPage
        kicker="Activación 2"
        title="Cuando Todo Se Estanca"
        subtitle=""
        accentGradient={ACCENT_INDIGO}
      >
        <ActivationNumber number="2" title="Cuando Todo Se Estanca" />

        <EmotionalReflection>
          Hay días en que la vida se siente como un río que de pronto dejó de correr. No hay caos visible. No hay crisis declarada. Solo una quietud densa, pesada — la sensación de que nada avanza, nada cambia, nada se mueve. Y lo más desconcertante es que no sabes por qué.
        </EmotionalReflection>

        <NarrativeBody>
          El estancamiento tiene una característica peligrosa: es silencioso. No llega con alarmas. Llega gradualmente, con pequeñas rendiciones disfrazadas de "realismo". Dejas de aplicar a esa oportunidad porque "seguramente no es para mí". Dejas de intentar porque "ya lo intenté antes". El movimiento se detiene no por falta de camino, sino por falta de impulso interno.
        </NarrativeBody>

        <MonkTeaching>
          El monje observa el agua estancada y entiende: no es ausencia de movimiento — es movimiento bloqueado. La energía sigue ahí, atrapada. Y todo lo que está atrapado, con el tiempo, fermenta. Se vuelve pesado. Se vuelve tóxico. El estancamiento no es una pausa — es una acumulación que crece en la dirección equivocada.
        </MonkTeaching>

        <NarrativeBody>
          Romper el estancamiento no requiere un gran salto. Requiere un pequeño movimiento real. Un solo acto genuino que le diga a tu sistema interno: el flujo es posible. Que demostrarse que las cosas pueden moverse es a menudo todo lo que se necesita para que vuelvan a hacerlo.
        </NarrativeBody>

        <ActivationPhrase>Lo que no fluye, fermenta. Hoy elijo el movimiento, aunque sea pequeño.</ActivationPhrase>

        <HomeConnection>
          Un ambiente estancado alimenta una mente estancada. Mover un mueble, limpiar un rincón olvidado, abrir una ventana — estos actos físicos son mensajes reales al sistema interno. Cuando mueves el espacio, le recuerdas al cuerpo que el movimiento es posible.
        </HomeConnection>
      </PdfContentPage>

      {/* ── ACTIVACIÓN 3 ──────────────────────────────────────────── */}
      <PdfContentPage
        kicker="Activación 3"
        title="Cuando Sientes Que No Avanzas"
        subtitle=""
        accentGradient={ACCENT_INDIGO}
      >
        <ActivationNumber number="3" title="Cuando Sientes Que No Avanzas" />

        <EmotionalReflection>
          Te mueves, actúas, haces — pero la sensación persiste: estás en el mismo lugar de hace meses, quizás de hace años. Como si hubiera un techo invisible que te permite crecer hasta cierto punto y no más. Y lo más frustrante es que no puedes señalar con el dedo exactamente qué lo está causando.
        </EmotionalReflection>

        <NarrativeBody>
          Ese techo existe. Pero no está arriba de ti. Está dentro de ti. Es el límite que aprendiste a no cruzar — a veces por experiencias dolorosas, a veces por lo que otros dijeron sobre lo que eras capaz, a veces simplemente porque nunca viste a nadie a tu alrededor ir más allá de ese punto. El límite fue instalado tanto tiempo atrás que ya no parece una creencia. Parece simplemente "la verdad sobre mí".
        </NarrativeBody>

        <MonkTeaching>
          El monje sabe que el obstáculo más difícil de ver es el que está dentro del propio observador. Puedes ver los obstáculos del camino — pero ¿puedes ver el mapa distorsionado con el que lo estás leyendo? El límite que sientes no es una pared del mundo. Es una idea sobre el mundo que has repetido tantas veces que se solidificó.
        </MonkTeaching>

        <NarrativeBody>
          La pregunta que cambia todo no es "¿cómo supero este obstáculo?" — es "¿qué tendría que creer sobre mí mismo para que este obstáculo no existiera?" Ahí está la puerta.
        </NarrativeBody>

        <ActivationPhrase>No tengo un límite externo. Tengo una creencia que actúa como uno. Y las creencias pueden cambiar.</ActivationPhrase>

        <HomeConnection>
          El orden en tu hogar es la primera señal visible hacia ti mismo de que estás dispuesto a ir más allá. Cuando cuidas tu espacio, le demuestras a tu mente que eres capaz de sostener algo nuevo — y esa demostración tiene más peso que mil afirmaciones.
        </HomeConnection>
      </PdfContentPage>

      {/* ── ACTIVACIÓN 4 ──────────────────────────────────────────── */}
      <PdfContentPage
        kicker="Activación 4"
        title="Cuando Pierdes Oportunidades"
        subtitle=""
        accentGradient={ACCENT_INDIGO}
      >
        <ActivationNumber number="4" title="Cuando Pierdes Oportunidades" />

        <EmotionalReflection>
          La conociste de cerca. Esa oportunidad que parecía perfecta — y que por alguna razón no se concretó. Quizás llegó en el momento equivocado. Quizás te faltó algo para tomarla. Quizás simplemente pasó de largo sin que pudieras alcanzarla. Y la pregunta que queda flotando es siempre la misma: ¿por qué a mí no me llegan las cosas que sí le llegan a otros?
        </EmotionalReflection>

        <NarrativeBody>
          La respuesta incómoda es esta: las oportunidades no se pierden por mala suerte. Se pierden porque en el momento en que aparecen, no estamos en el estado interno necesario para reconocerlas, para recibirlas, o para actuar sobre ellas. El miedo las hace invisibles. El caos mental las hace incomprensibles. La falta de preparación las hace imposibles de sostener.
        </NarrativeBody>

        <MonkTeaching>
          El monje no se lamenta por las oportunidades perdidas. Las usa como diagnóstico: "¿En qué estado estaba yo cuando eso apareció?" Porque una oportunidad no recibida casi siempre señala a algo que faltaba adentro — no afuera. No se trata de culpa. Se trata de honestidad. Y de preparación para la próxima vez.
        </MonkTeaching>

        <NarrativeBody>
          La pregunta correcta no es "¿por qué las pierdo?" — es "¿qué necesito cultivar en mí para estar listo cuando lleguen?" Esa pregunta orienta. La primera paraliza.
        </NarrativeBody>

        <ActivationPhrase>Estoy abierto. Estoy preparado. Lo que es mío, me encuentra.</ActivationPhrase>

        <HomeConnection>
          Las oportunidades no se instalan en espacios bloqueados. Un hogar limpio, ordenado y con intención es una declaración silenciosa: "Hay espacio aquí para algo nuevo." Despeja el camino — físico y mental.
        </HomeConnection>
      </PdfContentPage>

      {/* ── ACTIVACIÓN 5 ──────────────────────────────────────────── */}
      <PdfContentPage
        kicker="Activación 5"
        title="Cuando el Miedo al Dinero Aparece"
        subtitle=""
        accentGradient={ACCENT_INDIGO}
      >
        <ActivationNumber number="5" title="Cuando el Miedo al Dinero Aparece" />

        <EmotionalReflection>
          Existe un miedo que nadie admite fácilmente — el miedo al dinero mismo. No el miedo a la pobreza. El miedo a la abundancia. El miedo a querer más y que eso diga algo malo sobre ti. El miedo a tener más y perder quién eres, o perder a quienes te rodean. El miedo, en el fondo, de que merecer no sea algo que aplique a ti.
        </EmotionalReflection>

        <NarrativeBody>
          Este miedo tiene raíces. Tal vez creciste oyendo que el dinero corrompe. Que los ricos son malos. Que pedir más es codicia. Que conformarse es virtud. Esas frases, repetidas en la infancia, se convierten en programas que operan décadas después — saboteando silenciosamente cada esfuerzo genuino de prosperidad.
        </NarrativeBody>

        <MonkTeaching>
          El monje diferencia claramente: el apego al dinero es una trampa. Pero el flujo del dinero es natural. El agua no es mala por correr hacia donde puede — es su naturaleza. El dinero tampoco es malo por fluir hacia quien está preparado para recibirlo. El problema nunca fue el dinero. Fue la historia que te contaron sobre él — y que tú, en algún punto, decidiste creer.
        </MonkTeaching>

        <NarrativeBody>
          Hoy puedes elegir una historia diferente. No porque sea más optimista. Sino porque es más verdadera: la prosperidad no te aleja de quien eres. Te da más libertad para serlo plenamente.
        </NarrativeBody>

        <ActivationPhrase>Merecer abundancia no es un privilegio de otros. Es mi estado natural cuando dejo de resistirlo.</ActivationPhrase>

        <HomeConnection>
          El ambiente donde vives debe reflejar que el dinero es bienvenido. Un hogar con un lugar definido, respetado y ordenado para el dinero envía este mensaje: "Aquí hay espacio para más." El espacio externo confirma lo que la mente empieza a creer.
        </HomeConnection>
      </PdfContentPage>

      {/* ── ACTIVACIÓN 6 ──────────────────────────────────────────── */}
      <PdfContentPage
        kicker="Activación 6"
        title="Cuando Tu Hogar Se Siente Pesado"
        subtitle=""
        accentGradient={ACCENT_INDIGO}
      >
        <ActivationNumber number="6" title="Cuando Tu Hogar Se Siente Pesado" />

        <EmotionalReflection>
          Hay hogares que se sienten vivos — donde entras y algo en ti se relaja, se expande, respira. Y hay hogares que se sienten pesados — donde entras y, sin saber bien por qué, algo en ti se apaga. No es decoración. No es tamaño. Es algo más sutil, más real, que la mayoría elige no nombrar porque no sabe cómo.
        </EmotionalReflection>

        <NarrativeBody>
          El hogar acumula todo lo que ocurre dentro de él. Las conversaciones que no se terminaron bien. Las noches de angustia. El estrés crónico de quien lo habita. Los objetos que representan épocas dolorosas que nadie tuvo el valor de soltar. Todo eso permanece — no de forma fantasmal, sino de forma muy concreta: en el ambiente, en la energía del espacio, en cómo te sientes cuando estás ahí.
        </NarrativeBody>

        <MonkTeaching>
          El monje entiende que el espacio es una extensión del estado interno de quien lo habita — y al mismo tiempo, lo moldea. Es un ciclo: el interior crea el exterior, y el exterior refuerza el interior. Un hogar pesado crea una mente pesada. Una mente pesada crea un hogar más pesado. El ciclo se rompe cuando decides intervenir conscientemente en alguno de los dos lados.
        </MonkTeaching>

        <NarrativeBody>
          Cuidar tu hogar no es una tarea doméstica. Es un acto de cuidado propio. Es decirte a ti mismo que el espacio donde habitas merece atención — y que tú mereces habitar un espacio que te nutra, no que te drene.
        </NarrativeBody>

        <ActivationPhrase>Mi hogar es un reflejo de mi estado. Lo cuido porque me cuido a mí mismo.</ActivationPhrase>

        <HomeConnection>
          Un hogar pesado no es un destino — es una señal. Señal de que algo necesita moverse, limpiarse, soltarse. La limpieza del espacio es, al mismo tiempo, la limpieza de la mente. Los dos se liberan juntos.
        </HomeConnection>
      </PdfContentPage>

      {/* ── ACTIVACIÓN 7 ──────────────────────────────────────────── */}
      <PdfContentPage
        kicker="Activación 7"
        title="Cuando Necesitas Reempezar"
        subtitle=""
        accentGradient={ACCENT_INDIGO}
      >
        <ActivationNumber number="7" title="Cuando Necesitas Reempezar" />

        <EmotionalReflection>
          A veces la vida no te da una advertencia. Solo te presenta el resultado: todo lo que construiste está en el piso. El proyecto que no funcionó. La relación que terminó. El dinero que se fue. El plan que se desmoronó. Y ahí estás tú, mirando lo que quedó, preguntándote cómo es posible empezar de nuevo cuando sientes que ya no te queda nada para comenzar.
        </EmotionalReflection>

        <NarrativeBody>
          El reinicio es el momento más difícil — y el más mal entendido. La cultura lo presenta como fracaso. Como un retroceso. Pero el reinicio genuino no te devuelve al principio. Te lleva a un lugar diferente: uno donde ya sabes lo que no funciona, donde ya probaste una versión de ti que tenía límites, donde ya entiendes algo que antes no entendías. Eso no es cero. Eso es más.
        </NarrativeBody>

        <MonkTeaching>
          El monje no ve el reinicio como derrota — lo ve como alquimia. La materia prima que no funcionó en su forma anterior es ahora el material para algo diferente. Nada se pierde realmente. Todo se transforma. La pregunta no es "¿por qué me pasó esto?" — es "¿en qué me convierte esto si lo permito?"
        </MonkTeaching>

        <NarrativeBody>
          Reempezar no exige grandiosidad. Exige un primer acto honesto. Un solo movimiento real que diga: esto terminó, y lo nuevo comienza ahora. Ese acto puede ser tan simple como reorganizar un rincón de tu casa — porque el orden físico le dice al sistema nervioso que hay tierra firme donde pararse.
        </NarrativeBody>

        <ActivationPhrase>No estoy empezando de cero. Estoy empezando desde todo lo que aprendí.</ActivationPhrase>

        <HomeConnection>
          El primer acto de un nuevo comienzo puede comenzar en tu hogar. Ordena un espacio. Descarta algo que pertenece al pasado. Ese gesto físico es una declaración real: lo viejo terminó. El nuevo ciclo comienza aquí.
        </HomeConnection>
      </PdfContentPage>

      {/* ── CIERRE FINAL ─────────────────────────────────────────── */}
      <PdfContentPage
        kicker="Cierre"
        title="El Cambio Ya Está Ocurriendo"
        subtitle="Lo que leer estas páginas significa — aunque todavía no lo sientas."
        accentGradient={ACCENT_GOLD}
      >
        <div
          className="mb-4 rounded-xl px-5 py-4"
          style={{ background: C.dark }}
        >
          <p className="font-display text-[1.1rem] font-semibold leading-snug" style={{ color: 'hsl(42 70% 85%)' }}>
            Llegaste hasta aquí.<br />
            Eso no es casualidad.<br />
            Es el primer signo de que algo en ti ya está listo para cambiar.
          </p>
        </div>

        <NarrativeBody>
          Las 7 Activaciones no son una solución instantánea. Son semillas. Y las semillas no hacen ruido mientras crecen. Lo que ocurre ahora, después de haberlas leído, es un proceso silencioso pero real: tu mente empieza a reorganizarse en torno a nuevas posibilidades.
        </NarrativeBody>

        <NarrativeBody>
          No esperes sentir un cambio dramático mañana. Espera algo más sutil y más permanente: notar que reaccionas diferente en ciertos momentos. Que ciertos pensamientos ya no tienen el mismo peso. Que algo que antes te paralizaba ahora te genera curiosidad en lugar de miedo. Esos son los signos reales de transformación.
        </NarrativeBody>

        <SectionDivider title="Cómo seguir usando este bônus" color={C.gold} />

        <div className="space-y-2 my-3">
          {[
            'Vuelve a la activación que más resonó contigo — léela una vez por semana durante un mes.',
            'Cuando atravieses una situación difícil, identifica cuál de las 7 activaciones habla de lo que sientes.',
            'Repite la frase de activación correspondiente cada mañana durante 7 días seguidos.',
            'Combina cada activación con una acción concreta en tu hogar: limpiar, reorganizar, descartar.',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 rounded-lg px-3.5 py-2.5"
              style={{ background: C.goldLight, border: `1px solid ${C.goldBorder}` }}>
              <span className="shrink-0 text-[12px] font-bold mt-0.5" style={{ color: C.gold }}>✦</span>
              <p className="text-[14px] leading-snug text-foreground/75">{item}</p>
            </div>
          ))}
        </div>

        <Divider variant="gradient" color={C.gold} className="my-3" />

        <div
          className="rounded-2xl px-5 py-4 text-center"
          style={{ background: C.dark }}
        >
          <p className="font-display text-[1.05rem] font-bold mb-1" style={{ color: C.gold }}>
            "El monje no transforma el mundo con grandes gestos.<br />
            Lo transforma con pequeños actos repetidos con intención."
          </p>
          <p className="text-[13px] mt-2" style={{ color: C.muted }}>— Sabiduría monástica</p>
        </div>
      </PdfContentPage>
    </>
  );
}
