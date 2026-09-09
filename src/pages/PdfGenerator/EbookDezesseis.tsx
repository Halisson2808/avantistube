/**
 * PDF 16 — Rota: /pdf/ebook-dezesseis · Protocolo Garganta Limpia
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';
import {
  StepList,
  CheckList,
  Callout,
  HighlightBanner,
  SectionDivider,
  Divider,
  FactBox,
} from '@/components/ebook/VisualElements';

// ── Paleta azul / salud ──────────────────────────────────────────
const C = {
  blue:         'hsl(210 72% 40%)',
  blueLight:    'hsl(210 60% 96%)',
  blueBorder:   'hsl(210 50% 74%)',
  blueDark:     'hsl(210 68% 18%)',
  navy:         'hsl(222 62% 34%)',
  navyLight:    'hsl(222 52% 96%)',
  navyBorder:   'hsl(222 44% 72%)',
  sky:          'hsl(198 68% 44%)',
  skyLight:     'hsl(198 55% 95%)',
  skyBorder:    'hsl(198 46% 72%)',
  warn:         'hsl(36 90% 44%)',
  warnLight:    'hsl(36 80% 94%)',
  warnBorder:   'hsl(36 70% 72%)',
  ink:          'hsl(220 35% 12%)',
};

const ACCENT_BLUE = `linear-gradient(to bottom, ${C.blue}, hsl(210 65% 30%), ${C.blueDark})`;
const ACCENT_NAVY = `linear-gradient(to bottom, ${C.navy}, hsl(222 58% 26%), hsl(222 55% 16%))`;

// ── Componentes exclusivos ───────────────────────────────────────

function Body({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-[15px] leading-relaxed text-foreground/80">
      {children}
    </p>
  );
}

function ChapterHook({ children }: { children: ReactNode }) {
  return (
    <div
      className="mb-4 rounded-xl px-5 py-4"
      style={{ background: C.blueDark }}
    >
      <p className="text-[15px] font-semibold italic leading-relaxed" style={{ color: 'hsl(210 60% 84%)' }}>
        {children}
      </p>
    </div>
  );
}

function AlertBox({ children }: { children: ReactNode }) {
  return (
    <div
      className="my-3 rounded-xl px-5 py-4"
      style={{ background: C.warnLight, border: `1.5px solid ${C.warnBorder}` }}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-1" style={{ color: C.warn }}>
        ⚠ Atención
      </p>
      <p className="text-[14px] leading-relaxed font-semibold" style={{ color: C.ink }}>
        {children}
      </p>
    </div>
  );
}

function TipCard({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <div
      className="avoid-page-break mb-2.5 rounded-xl px-4 py-3.5"
      style={{ background: C.blueLight, border: `1px solid ${C.blueBorder}` }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[18px]">{icon}</span>
        <p className="text-[13px] font-bold uppercase tracking-[0.18em]" style={{ color: C.blue }}>
          {title}
        </p>
      </div>
      <p className="text-[14px] leading-snug text-foreground/70">{children}</p>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="flex-1 rounded-xl px-3 py-3 text-center"
      style={{ background: C.blueDark }}
    >
      <p className="font-display text-[1.6rem] font-black leading-none mb-1" style={{ color: 'hsl(210 80% 80%)' }}>
        {value}
      </p>
      <p className="text-[11px] leading-snug" style={{ color: 'hsl(210 40% 65%)' }}>{label}</p>
    </div>
  );
}

function DayProtocol({
  day, title, color, mission, items,
}: {
  day: string; title: string; color: string; mission: string; items: string[];
}) {
  return (
    <div
      className="avoid-page-break mb-2.5 rounded-xl overflow-hidden"
      style={{ border: `1.5px solid ${C.blueBorder}` }}
    >
      <div className="px-4 py-2.5 flex items-center gap-3" style={{ background: color }}>
        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/80">{day}</span>
        <span className="text-[14px] font-bold text-white">{title}</span>
      </div>
      <div className="px-4 pt-2.5 pb-1" style={{ background: `${color}18` }}>
        <p className="text-[12px] italic font-medium mb-2" style={{ color }}>🎯 {mission}</p>
      </div>
      <div className="px-4 py-2.5 space-y-1.5" style={{ background: C.blueLight }}>
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="shrink-0 text-[12px] font-bold mt-0.5" style={{ color: C.blue }}>▸</span>
            <p className="text-[13px] leading-snug text-foreground/75">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function NaturalRemedy({
  icon, name, how, benefit,
}: {
  icon: string; name: string; how: string; benefit: string;
}) {
  return (
    <div
      className="avoid-page-break mb-2.5 rounded-xl p-3.5"
      style={{ background: C.navyLight, border: `1px solid ${C.navyBorder}` }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[20px]">{icon}</span>
        <p className="text-[14px] font-bold" style={{ color: C.navy }}>{name}</p>
      </div>
      <p className="text-[13px] leading-snug text-foreground/70 mb-1">
        <span className="font-semibold" style={{ color: C.blue }}>Cómo usarlo: </span>
        {how}
      </p>
      <p className="text-[13px] leading-snug text-foreground/70">
        <span className="font-semibold" style={{ color: C.navy }}>Por qué funciona: </span>
        {benefit}
      </p>
    </div>
  );
}

function RoutineBlock({ period, icon, items }: { period: string; icon: string; items: string[] }) {
  return (
    <div
      className="avoid-page-break mb-2.5 rounded-xl overflow-hidden"
      style={{ border: `1px solid ${C.blueBorder}` }}
    >
      <div
        className="flex items-center gap-2.5 px-4 py-2"
        style={{ background: C.blue }}
      >
        <span className="text-[16px]">{icon}</span>
        <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-white">{period}</p>
      </div>
      <div className="px-4 py-2.5 space-y-1.5" style={{ background: C.blueLight }}>
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="shrink-0 text-[11px] font-bold mt-0.5" style={{ color: C.blue }}>✓</span>
            <p className="text-[13px] leading-snug text-foreground/75">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImpactLine({ children }: { children: ReactNode }) {
  return (
    <p className="my-3 font-display text-[1rem] font-bold leading-snug" style={{ color: C.blueDark }}>
      {children}
    </p>
  );
}

// ── Ebook principal ──────────────────────────────────────────────

export default function EbookDezesseis() {
  return (
    <>
      {/* ── PORTADA ───────────────────────────────────────────────── */}
      <section
        className="relative h-[297mm] overflow-hidden page-break-after print:shadow-none"
        style={{
          backgroundImage: 'url(/garganta-limpa.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: C.blueDark,
        }}
      />

      {/* ── ÍNDICE ────────────────────────────────────────────────── */}
      <PdfContentPage
        kicker="Índice"
        title="Lo que vas a aprender"
        subtitle="Un recorrido directo del problema a la solución — en 7 días."
        accentGradient={ACCENT_BLUE}
      >
        <div className="space-y-1">
          {[
            { num: '01', title: 'Entendiendo el Problema',         desc: 'Por qué la flema no es normal — y qué indica.' },
            { num: '02', title: 'Principales Causas',               desc: 'Lo que realmente está provocando esta situación.' },
            { num: '03', title: 'Señales de Alerta',                desc: 'Qué ignorar y qué tomar en serio.' },
            { num: '04', title: 'Hábitos que Empeoran la Flema',    desc: 'Lo que haces cada día que alimenta el problema.' },
            { num: '05', title: 'Hábitos que Reducen la Flema',     desc: 'Pequeños cambios con gran impacto inmediato.' },
            { num: '06', title: 'Protocolo Práctico — 7 Días',      desc: 'Tu misión diaria para una garganta limpia.' },
            { num: '07', title: 'Soluciones Naturales',             desc: 'Lo que realmente funciona — y cómo usarlo.' },
            { num: '08', title: 'Rutina Diaria Ideal',              desc: 'Mañana, tarde y noche: cada momento importa.' },
            { num: '09', title: 'Prevención a Largo Plazo',         desc: 'Cómo asegurarte de que el problema no regrese.' },
            { num: '10', title: 'Preguntas Frecuentes',             desc: 'Las dudas que frenan a quienes están empezando.' },
            { num: '11', title: 'Consideraciones Finales',          desc: 'Qué hacer ahora mismo — en este momento.' },
          ].map(({ num, title, desc }) => (
            <div
              key={num}
              className="flex items-center gap-3 rounded-lg px-3 py-2"
              style={{ background: C.blueLight, border: `1px solid ${C.blueBorder}` }}
            >
              <span className="shrink-0 text-[12px] font-black w-6" style={{ color: C.blue }}>
                {num}
              </span>
              <div className="flex items-baseline gap-2 flex-1 min-w-0">
                <p className="text-[13px] font-bold shrink-0" style={{ color: C.blueDark }}>{title}</p>
                <p className="text-[11.5px] leading-snug text-foreground/55 truncate">— {desc}</p>
              </div>
            </div>
          ))}
        </div>
      </PdfContentPage>

      {/* ── CAPÍTULO 1 — Entendiendo el Problema ─────────────────── */}
      <PdfContentPage
        kicker="Capítulo 1"
        title="Entendiendo el Problema"
        subtitle="Esa sensación de algo atascado en la garganta no es normal. Es una señal que tu cuerpo está enviando — y necesitas escucharla."
        accentGradient={ACCENT_BLUE}
      >
        <ChapterHook>
          ¿Alguna vez te levantaste con la garganta llena de mucosidad? ¿Pasaste el día aclarándote la garganta, intentando limpiar algo que simplemente no desaparece? Ese malestar constante tiene nombre — y, más importante, tiene solución.
        </ChapterHook>

        <Body>
          El moco es parte del funcionamiento saludable del cuerpo. Protege las vías respiratorias, filtra el aire y atrapa virus y bacterias antes de que causen daño. En condiciones normales, apenas notas que existe. El problema comienza cuando el cuerpo pierde el equilibrio y empieza a producir más de lo que necesita.
        </Body>

        <div className="flex gap-2.5 mb-4">
          <StatCard value="30%" label="de los adultos sufren exceso de mucosidad de forma recurrente" />
          <StatCard value="3 de 5" label="casos tienen causa alimentaria o ambiental — no infecciosa" />
          <StatCard value="7 días" label="es el tiempo promedio para una mejora significativa con los ajustes correctos" />
        </div>

        <SectionDivider title="Moco normal vs. flema persistente — entiende la diferencia" color={C.blue} />

        <Body>
          Cuando el organismo entra en estado inflamatorio — por alergia, alimentación inadecuada, reflujo o irritación crónica — la producción de moco se dispara. Lo que era discreto y fluido se vuelve espeso, visible y constante. Ahí es cuando el moco se convierte en flema: esa secreción que se pega, molesta y no se va con fuerza de voluntad.
        </Body>

        <StepList color={C.blue} className="mb-3" steps={[
          {
            title: 'Moco normal',
            text: 'Fino, transparente, prácticamente invisible. Fluye por la garganta sin causar ninguna molestia. Señal de que el sistema respiratorio está funcionando bien.',
          },
          {
            title: 'Exceso de moco',
            text: 'Producción aumentada por factores inflamatorios. Empieza a acumularse, especialmente por las mañanas. El carraspeo frecuente es el primer aviso — no lo ignores.',
          },
          {
            title: 'Flema persistente',
            text: 'Moco espeso, con color, que no desaparece solo. Indica inflamación crónica o infección activa. Cuando dura más de dos semanas, el cuerpo está pidiendo intervención.',
          },
        ]} />

        <TipCard icon="💡" title="Por qué algunas personas sufren más que otras">
          La predisposición genética a alergias, el historial de reflujo silencioso o la exposición diaria a aire seco y contaminado crean un ambiente interno donde el moco se vuelve crónico — independientemente de cualquier infección. No es mala suerte. Es fisiología. Y la fisiología tiene solución.
        </TipCard>
      </PdfContentPage>

      {/* ── CAPÍTULO 2 — Principales Causas ──────────────────────── */}
      <PdfContentPage
        kicker="Capítulo 2"
        title="Principales Causas"
        subtitle="La flema que no desaparece te está diciendo algo. Descubre qué es."
        accentGradient={ACCENT_BLUE}
      >
        <ChapterHook>
          La mayoría de las personas trata el síntoma — e ignora la causa. Toman un medicamento para desobstruir, mejoran dos días y la flema vuelve. Eso ocurre porque el desencadenante real nunca fue tocado.
        </ChapterHook>

        <Body>
          La flema persistente raramente tiene un único origen. Casi siempre es la combinación de dos o tres factores que, juntos, mantienen al cuerpo en modo inflamatorio continuo. Identificar cuál de ellos está activo en ti es el paso más importante de todo este proceso.
        </Body>

        <div className="space-y-2.5 mb-3">
          {[
            {
              icon: '🍽️',
              cause: 'Alimentación inflamatoria',
              detail: 'Los lácteos, el azúcar, las harinas refinadas y los ultraprocesados son los mayores enemigos de las vías respiratorias. Activan mecanismos inflamatorios a los que el cuerpo responde produciendo más moco — sin que notes la conexión.',
            },
            {
              icon: '🌿',
              cause: 'Alergias respiratorias',
              detail: 'Los ácaros, el pelo de animales, el polen y el moho activan el sistema inmunológico en las vías aéreas. La respuesta es inmediata: inflamación y producción acelerada de moco como escudo de defensa. Para muchos, este ciclo nunca se detiene.',
            },
            {
              icon: '🔥',
              cause: 'Reflujo silencioso (LPR)',
              detail: 'Este es el villano invisible. El ácido gástrico sube e irrita la laringe y la faringe sin causar acidez — por eso pasa desapercibido. El resultado es una irritación crónica que estimula la producción constante de moco. Crees que es "flema" cuando en realidad es reflujo.',
            },
            {
              icon: '🫁',
              cause: 'Problemas respiratorios recurrentes',
              detail: 'La sinusitis, bronquitis, asma e infecciones repetidas mantienen las vías aéreas en estado de alerta permanente. El moco en estos casos es un síntoma — pero si no se trata, se convierte en un problema en sí mismo.',
            },
            {
              icon: '🌬️',
              cause: 'Ambiente que agrede las mucosas',
              detail: 'El aire seco, el polvo acumulado, el moho, el humo del cigarrillo y la contaminación irritan las mucosas todos los días. El cuerpo responde como puede: produciendo más moco para protegerse. Cambia el ambiente — y el problema cambia con él.',
            },
          ].map(({ icon, cause, detail }) => (
            <div
              key={cause}
              className="avoid-page-break flex items-start gap-3 rounded-lg px-3.5 py-3"
              style={{ background: C.blueLight, border: `1px solid ${C.blueBorder}` }}
            >
              <span className="shrink-0 text-[20px] mt-0.5">{icon}</span>
              <div>
                <p className="text-[13px] font-bold mb-0.5" style={{ color: C.blue }}>{cause}</p>
                <p className="text-[13px] leading-snug text-foreground/65">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        <ImpactLine>Quien identifica la causa correcta resuelve en días lo que otros arrastran por meses.</ImpactLine>
      </PdfContentPage>

      {/* ── CAPÍTULO 3 — Señales de Alerta ───────────────────────── */}
      <PdfContentPage
        kicker="Capítulo 3"
        title="Señales de Alerta"
        subtitle="Saber qué ignorar — y qué tomar en serio — puede ser la diferencia entre un ajuste simple y un problema grave."
        accentGradient={ACCENT_BLUE}
      >
        <ChapterHook>
          No toda flema es igual. La mayoría de los casos es funcional y se resuelve con los cambios correctos. Pero hay señales que el cuerpo usa para gritar que necesita atención médica — ignorarlas es un error que ninguna guía puede cubrir.
        </ChapterHook>

        <Body>
          Antes de comenzar cualquier protocolo, necesitas saber en qué grupo estás. La siguiente lista es objetiva: si estás en el primer grupo, esta guía fue hecha para ti. Si estás en el segundo, ve al médico primero — y usa este material como complemento.
        </Body>

        <SectionDivider title="Señales de flema funcional — puedes actuar ahora" color={C.sky} />

        <CheckList color={C.sky} className="mt-2 mb-4" items={[
          'Flema clara o blanca, sin olor fuerte',
          'Aparece principalmente por las mañanas o después de comer',
          'Empeora en cambios climáticos o con exposición al polvo',
          'Mejora al tomar agua caliente o infusiones — aunque sea temporalmente',
          'No viene acompañada de fiebre persistente',
          'Sin dolor intenso al tragar ni al respirar',
        ]} />

        <SectionDivider title="Señales de alerta — busca evaluación médica" color={C.blue} />

        <CheckList color={C.blue} className="mt-2 mb-3" items={[
          'Flema amarilla o verde intensa por más de 10 días consecutivos',
          'Cualquier presencia de sangre en la secreción',
          'Fiebre por encima de 38°C por más de 3 días',
          'Dificultad progresiva para respirar o tragar',
          'Pérdida de peso sin explicación junto con flema crónica',
          'Sibilancias en el pecho acompañando el exceso de moco',
        ]} />

        <AlertBox>
          Si tienes alguna de las señales anteriores, busca evaluación médica antes de seguir este protocolo. No porque sea peligroso — sino porque esos síntomas pueden indicar algo que necesita diagnóstico profesional antes de cualquier intervención.
        </AlertBox>

        <Body>
          Para la mayoría de las personas, los síntomas son funcionales: carraspeo constante (especialmente después de comer), sensación de flema bajando por la garganta al acostarse, tos seca que aparece y desaparece, y esa irritación leve que no llega a doler pero no desaparece. Ese perfil es exactamente el que este protocolo fue desarrollado para resolver.
        </Body>
      </PdfContentPage>

      {/* ── CAPÍTULO 4 — Hábitos que Empeoran ───────────────────── */}
      <PdfContentPage
        kicker="Capítulo 4"
        title="Hábitos que Empeoran la Flema"
        subtitle="No es mala suerte. Es que estás repitiendo, cada día, comportamientos que alimentan el problema."
        accentGradient={ACCENT_BLUE}
      >
        <ChapterHook>
          Este es el capítulo que más incomoda — porque muestra que gran parte del problema tiene origen en decisiones del día a día. No para culparte, sino para darte poder: si tú creaste el ambiente, tú puedes cambiarlo.
        </ChapterHook>

        <SectionDivider title="Los alimentos que tu cuerpo no tolera" color={C.blue} />

        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { food: 'Leche y lácteos', why: 'Espesan el moco y aumentan directamente la producción en las vías aéreas. Es la causa alimentaria número 1.' },
            { food: 'Azúcar y dulces', why: 'Alimentan la inflamación sistémica y crean el ambiente perfecto para que proliferen las bacterias.' },
            { food: 'Harina blanca y pan', why: 'Alto índice glucémico, altamente proinflamatorio — aumenta el moco aunque no lo notes.' },
            { food: 'Alimentos fritos', why: 'La grasa saturada irrita las mucosas y es un detonante directo del reflujo silencioso.' },
            { food: 'Bebidas heladas', why: 'Contraen los tejidos de la garganta, dificultan el drenaje y espesan el moco existente.' },
            { food: 'Alcohol', why: 'Deshidrata las mucosas y agrava cualquier proceso inflamatorio en las vías respiratorias.' },
          ].map(({ food, why }) => (
            <div
              key={food}
              className="rounded-lg p-2.5"
              style={{ background: C.blueLight, border: `1px solid ${C.blueBorder}` }}
            >
              <p className="text-[12.5px] font-bold mb-0.5" style={{ color: C.navy }}>{food}</p>
              <p className="text-[11.5px] leading-snug text-foreground/60">{why}</p>
            </div>
          ))}
        </div>

        <SectionDivider title="Comportamientos que perpetúan el ciclo" color={C.blue} />

        <StepList color={C.blue} className="mt-2" steps={[
          {
            title: 'Forzar el carraspeo varias veces al día',
            text: 'Parece que ayuda — pero hace lo contrario. Cada carraspeo forzado irrita la mucosa y le señala al cuerpo que produzca aún más moco. Es un ciclo vicioso que se retroalimenta.',
          },
          {
            title: 'Respirar por la boca sin darte cuenta',
            text: 'El aire entra sin ser filtrado ni humidificado, directo sobre las mucosas. El cuerpo compensa produciendo más moco para proteger lo que la nariz debería estar protegiendo.',
          },
          {
            title: 'Vivir en un ambiente seco',
            text: 'El aire acondicionado y la calefacción resecan el ambiente. Mucosa seca es mucosa irritada — y mucosa irritada produce moco espeso como defensa. Humidificar el ambiente es parte del tratamiento.',
          },
          {
            title: 'Acostarse justo después de comer',
            text: 'Facilita el reflujo silencioso — el ácido sube sin causar acidez, pero irrita la laringe de forma crónica. El resultado es esa sensación de "flema eterna" aunque no haya ninguna infección.',
          },
        ]} />
      </PdfContentPage>

      {/* ── CAPÍTULO 5 — Hábitos que Reducen ────────────────────── */}
      <PdfContentPage
        kicker="Capítulo 5"
        title="Hábitos que Reducen la Flema"
        subtitle="Pequeños cambios con impacto real — algunos los vas a sentir desde el primer día."
        accentGradient={ACCENT_BLUE}
      >
        <ChapterHook>
          La buena noticia: el mismo principio que mantiene el problema también lo resuelve. Cambia los detonantes — y el cuerpo responde rápido. Más rápido de lo que imaginas.
        </ChapterHook>

        <SectionDivider title="Hidratación — tu aliado más poderoso" color={C.sky} />

        <Body>
          El agua tibia es, por lejos, el recurso más eficaz contra la flema. Fluidifica el moco, facilita el drenaje y mantiene las mucosas hidratadas — que es exactamente lo contrario de lo que el problema necesita para existir. La meta es 2 a 2,5 litros por día, en sorbos, a lo largo de las horas. No todo de una vez.
        </Body>

        <TipCard icon="💧" title="El ritual que cambia tu día desde la mañana">
          Al despertar, antes de cualquier otra cosa: un vaso de agua tibia con unas gotas de limón. Esto estimula la digestión, alcaliniza levemente el ambiente de la garganta y comienza a disolver el moco acumulado durante la noche. Vas a respirar mejor en los primeros 30 minutos.
        </TipCard>

        <SectionDivider title="Alimentos que trabajan a tu favor" color={C.sky} />

        <CheckList color={C.sky} className="mt-2 mb-3" items={[
          'Jengibre: antiinflamatorio potente — fluidifica el moco y alivia la irritación al instante',
          'Ajo y cebolla: expectorantes naturales con acción antimicrobiana comprobada',
          'Piña: la bromelina que contiene rompe activamente el moco y reduce la inflamación',
          'Frutas cítricas: la vitamina C fortalece la inmunidad y combate el estado inflamatorio',
          'Vegetales de hoja verde: antioxidantes que reducen la carga inflamatoria sistémica',
          'Caldos y sopas calientes: humidifican las vías aéreas y facilitan el drenaje inmediato',
        ]} />

        <SectionDivider title="Ajustes que no cuestan nada y entregan mucho" color={C.sky} />

        <div className="space-y-2">
          {[
            { icon: '🛏️', tip: 'Elevar la cabecera de la cama apenas 15 cm elimina gran parte del reflujo nocturno — el principal responsable de la flema matinal que parece no tener fin.' },
            { icon: '🌬️', tip: 'Lavar las fosas nasales con solución salina una vez al día desobstruye las vías e interrumpe el goteo posnasal. Simple, económico, eficaz.' },
            { icon: '🚭', tip: 'Ningún cambio tiene mayor impacto que alejarse del humo del cigarrillo — activo o pasivo. Es el detonante más agresivo para las mucosas.' },
            { icon: '💨', tip: 'Un humidificador o un recipiente con agua caliente en el ambiente cambia la calidad del aire que respiras — y tu garganta lo nota en horas.' },
          ].map(({ icon, tip }) => (
            <div
              key={icon}
              className="flex items-start gap-2.5 rounded-lg px-3.5 py-2.5"
              style={{ background: C.skyLight, border: `1px solid ${C.skyBorder}` }}
            >
              <span className="shrink-0 text-[18px] mt-0.5">{icon}</span>
              <p className="text-[13px] leading-snug text-foreground/70">{tip}</p>
            </div>
          ))}
        </div>
      </PdfContentPage>

      {/* ── CAPÍTULO 6 — Protocolo 7 Días ────────────────────────── */}
      <PdfContentPage
        kicker="Capítulo 6"
        title="Protocolo Práctico — 7 Días"
        subtitle="No es una lista de tareas. Es una misión con inicio, desarrollo y cierre — y vas a salir diferente del otro lado."
        accentGradient={ACCENT_NAVY}
      >
        <ChapterHook>
          Siete días. Es todo lo que necesitas para sentir una diferencia real en tu garganta — si sigues el protocolo como corresponde. Cada fase tiene un propósito. No te saltes etapas. Confía en el proceso.
        </ChapterHook>

        <Body>
          El protocolo está dividido en tres fases progresivas. La primera elimina los detonantes. La segunda profundiza los cambios y activa las soluciones naturales. La tercera consolida lo que funcionó y te prepara para mantener el resultado. Juntas, forman una secuencia que respeta el ritmo de tu cuerpo.
        </Body>

        <DayProtocol
          day="Días 1 – 2"
          title="Misión: Cortar los Detonantes"
          color={C.blue}
          mission="Tu único objetivo ahora es dejar de alimentar el problema. El cuerpo va a empezar a responder en 48 horas."
          items={[
            'Elimina los lácteos, el azúcar y la harina blanca — completamente, por 7 días',
            'Toma 2L de agua tibia o a temperatura ambiente a lo largo del día',
            'Bebe té de jengibre con miel por la mañana, en ayunas',
            'Eleva la cabecera de la cama y no te acuestes en las 2h posteriores a las comidas',
            'Lávate las fosas nasales con solución salina antes de dormir',
            'Anota: intensidad de la flema, los momentos más difíciles, lo que comiste antes',
          ]}
        />

        <DayProtocol
          day="Días 3 – 5"
          title="Misión: Activar las Soluciones"
          color={C.navy}
          mission="Con los detonantes cortados, ahora empiezas a trabajar activamente para limpiar lo que quedó. Ya deberías estar notando una diferencia."
          items={[
            'Vaporizaciones con eucalipto: mañana y noche, 5 minutos cada una',
            'Agrega ajo crudo o cocido en al menos una comida al día',
            'Reemplaza todas las bebidas frías por calientes o tibias',
            'Gárgaras con agua tibia y sal: mañana y noche',
            'Mantén los 2L de agua y el té de jengibre diario',
            'Observa: la flema debería estar más fluida y fácil de eliminar',
          ]}
        />

        <DayProtocol
          day="Días 6 – 7"
          title="Misión: Consolidar y Planificar"
          color={C.sky}
          mission="La fase final no es sobre resolver — es sobre asegurarte de que el resultado dure. Estás en la recta final."
          items={[
            'Revisa lo que comiste: identifica qué alimento generó más reacción',
            'Mantén la vaporización, pero puedes reducirla a 1 vez al día',
            'Incorpora propóleo, guaco o miel con cúrcuma como planta medicinal',
            'Evalúa el ambiente: humedad, polvo, moho — corrige lo que identifiques',
            'Define cómo mantener los ajustes alimentarios a largo plazo',
            'Compara con el día 1: la diferencia debe ser clara y medible',
          ]}
        />

        <Callout type="tip" title="¿Qué fase va a impactarte más?">
          Depende de tu causa. Reflujo silencioso: la mayor mejora viene de elevar la cabecera y del cambio alimentario. Alergia: la solución salina y las vaporizaciones son las protagonistas. Alimentación: eliminar los lácteos y el azúcar es el punto de quiebre. Cuando conozcas tu causa, el protocolo se vuelve aún más preciso.
        </Callout>
      </PdfContentPage>

      {/* ── CAPÍTULO 7 — Soluciones Naturales (Infusiones) ──────── */}
      <PdfContentPage
        kicker="Capítulo 7"
        title="Soluciones Naturales"
        subtitle="Infusiones y bebidas que hacen el trabajo que ningún medicamento de farmacia necesita hacer — cuando se usan bien."
        accentGradient={ACCENT_BLUE}
      >
        <ChapterHook>
          La naturaleza tiene respuestas para la inflamación de las vías respiratorias que la medicina tradicional usa desde hace siglos. No son milagros. Son compuestos bioactivos con mecanismos de acción conocidos — y que funcionan cuando se aplican con constancia.
        </ChapterHook>

        <FactBox
          fact="Estudios publicados en el Journal of Ethnopharmacology confirman que el jengibre y la miel poseen propiedades mucolíticas y antiinflamatorias medibles en las vías respiratorias superiores — con un efecto comparable al de algunos antihistamínicos en casos de inflamación leve."
          color={C.blue}
          className="mb-3"
        />

        <SectionDivider title="Infusiones y bebidas funcionales" color={C.blue} />

        <NaturalRemedy
          icon="🫚"
          name="Té de Jengibre con Miel"
          how="Hierve 2 rodajas de jengibre fresco en 300ml de agua por 10 min. Agrega 1 cucharada de miel cuando esté tibio. Toma en ayunas por las mañanas."
          benefit="Acción mucolítica directa: fluidifica el moco, reduce la inflamación de la mucosa y alivia la irritación. Vas a sentir la garganta más limpia en minutos."
        />

        <NaturalRemedy
          icon="🌿"
          name="Té de Guaco"
          how="1 cucharada de hoja seca en 200ml de agua hirviendo. Tapar y esperar 10 min. Tomar 2–3 veces al día, especialmente en momentos de crisis."
          benefit="Expectorante y broncodilatador natural. Facilita la eliminación del moco acumulado y ayuda a respirar con más facilidad."
        />

        <NaturalRemedy
          icon="🍋"
          name="Agua Tibia con Limón y Sal"
          how="Jugo de medio limón + 1 pizca de sal en 200ml de agua tibia. Tomar en ayunas o usar como gárgaras."
          benefit="Alcaliniza el ambiente de la garganta, combate bacterias locales y reduce la inflamación superficial. Simple — pero subestimado."
        />

        <NaturalRemedy
          icon="🫐"
          name="Té de Propóleo con Miel"
          how="Agrega 5–10 gotas de extracto de propóleo en una infusión tibia (manzanilla o anís). Tomar 2 veces al día."
          benefit="Acción antibacteriana y antiinflamatoria intensa — especialmente eficaz cuando la garganta está muy irritada o con inicio de infección."
        />
      </PdfContentPage>

      {/* ── CAPÍTULO 7 cont. — Vaporizaciones ───────────────────── */}
      <PdfContentPage
        kicker="Capítulo 7 — continuación"
        title="Vaporizaciones y Aplicaciones Directas"
        subtitle="Cuando necesitas alivio rápido — y duradero."
        accentGradient={ACCENT_BLUE}
      >
        <Body>
          Las infusiones trabajan de adentro hacia afuera. Las vaporizaciones y aplicaciones directas actúan exactamente en el foco del problema — en las vías aéreas, en el punto donde el moco se acumula. Usa las dos estrategias juntas para resultados más rápidos.
        </Body>

        <NaturalRemedy
          icon="☁️"
          name="Vaporización con Eucalipto"
          how="Hierve agua y colócala en un recipiente. Agrega 3–4 gotas de aceite esencial de eucalipto. Cúbrete la cabeza con una toalla e inhala por 5–10 min. Cierra los ojos."
          benefit="Desobstruye las vías aéreas en minutos, fluidifica el moco de inmediato y tiene acción antiséptica sobre las mucosas. Es el recurso de alivio más rápido de este protocolo."
        />

        <NaturalRemedy
          icon="🧂"
          name="Nebulización Salina"
          how="Usa solución salina al 0,9% en nebulizador o spray nasal. 2–3 veces al día en crisis, 1 vez al día para el mantenimiento."
          benefit="Hidrata y desobstruye las vías aéreas sin ningún efecto rebote. Seguro para uso diario — incluso a largo plazo."
        />

        <NaturalRemedy
          icon="🍯"
          name="Miel con Cúrcuma"
          how="Mezcla 1 cucharada de miel con una pizca de cúrcuma en polvo. Toma directamente o disuelve en agua tibia. Ideal por las noches."
          benefit="Combinación antiinflamatoria y antimicrobiana potente. Calma la garganta para una noche sin carraspeo — y duermes mejor."
        />

        <NaturalRemedy
          icon="🌸"
          name="Gárgaras con Agua Tibia y Sal"
          how="Disuelve 1 cucharadita de sal en 200ml de agua tibia. Haz gárgaras durante 30 segundos. Repite 2–3 veces al día."
          benefit="Elimina el moco acumulado en la superficie de la garganta, reduce la inflamación local y tiene acción antibacteriana inmediata."
        />

        <HighlightBanner
          text="Usa al menos una infusión + una vaporización o gárgaras por día. Esa combinación potencia el efecto del protocolo de forma consistente."
          icon="✓"
          color={C.blue}
          className="mt-3"
        />
      </PdfContentPage>

      {/* ── CAPÍTULO 8 — Rutina Diaria Ideal ─────────────────────── */}
      <PdfContentPage
        kicker="Capítulo 8"
        title="Rutina Diaria Ideal"
        subtitle="Cada parte del día tiene un rol. Seguir esta secuencia es lo que separa el resultado del intento."
        accentGradient={ACCENT_BLUE}
      >
        <ChapterHook>
          Un remedio tomado una vez por semana no trata nada. Una rutina seguida durante 7 días cambia el estado del cuerpo. La constancia no es un detalle — es el protocolo en sí.
        </ChapterHook>

        <RoutineBlock
          period="Mañana — Prepara el terreno"
          icon="🌅"
          items={[
            'Al despertar: 1 vaso de agua tibia con limón antes que cualquier otra cosa',
            'Lavar las fosas nasales con solución salina — elimina el moco acumulado durante la noche',
            'Tomar té de jengibre con miel — desayuno sin lácteos',
            'Si la flema matinal es intensa: vaporización rápida de 5 min con eucalipto',
            'Respirar conscientemente por la nariz durante los primeros 30 min — no por la boca',
          ]}
        />

        <RoutineBlock
          period="Tarde — Mantén el ritmo"
          icon="☀️"
          items={[
            'Hidratación constante: 1 vaso de agua cada 1–2 horas, tibia o a temperatura ambiente',
            'Almuerzo antiinflamatorio: verduras, pollo, arroz integral — sin frituras',
            'No acostarse después del almuerzo — si necesitas descansar, usa posición semi-sentada',
            'Ambientes con aire acondicionado: usa humidificador o un recipiente con agua cerca',
            'Gárgaras con agua tibia y sal si sientes la garganta irritada a mitad del día',
          ]}
        />

        <RoutineBlock
          period="Noche — Protege el sueño"
          icon="🌙"
          items={[
            'Cena liviana: evita frituras, lácteos y alimentos pesados — el reflujo ataca de noche',
            'Deja de comer 2–3 horas antes de acostarte — es la regla más importante de la noche',
            'Gárgaras con agua tibia y sal antes de cepillarte los dientes',
            'Vaporización nocturna si la flema está intensa — 5 a 10 minutos',
            'Cabecera elevada: mínimo 15 cm — vas a dormir mejor y despertar con menos moco',
            'Miel con cúrcuma antes de dormir: calma la garganta y protege el sueño',
          ]}
        />

        <HighlightBanner
          text="Quien sigue esta rutina durante 7 días consecutivos raramente necesita ir más allá para sentir una diferencia real y duradera."
          icon="✓"
          color={C.blue}
          className="mt-3"
        />
      </PdfContentPage>

      {/* ── CAPÍTULO 9 — Prevención a Largo Plazo ────────────────── */}
      <PdfContentPage
        kicker="Capítulo 9"
        title="Prevención a Largo Plazo"
        subtitle="Resolver la flema es excelente. Asegurarte de que no vuelva es lo que realmente importa."
        accentGradient={ACCENT_BLUE}
      >
        <ChapterHook>
          La flema regresa a quienes vuelven a los mismos hábitos. No porque el protocolo haya fallado — sino porque el detonante fue reactivado. La prevención no es complicada. Es constancia en algunas elecciones clave.
        </ChapterHook>

        <Body>
          No necesitas mantener todo el protocolo para siempre. Pero hay ajustes que, si se mantienen, crean un ambiente interno donde la flema crónica simplemente no tiene dónde instalarse.
        </Body>

        <SectionDivider title="Los hábitos que mantienen la garganta limpia" color={C.blue} />

        <StepList color={C.blue} className="mt-2 mb-3" steps={[
          {
            title: 'Reduce los lácteos de forma permanente',
            text: 'No tienes que eliminarlos para siempre. Pero reducirlos a máximo 1 porción pequeña al día ya es suficiente para quienes tienen predisposición. La diferencia es inmediata y acumulativa.',
          },
          {
            title: 'Convierte la hidratación en un hábito automático',
            text: 'La mucosa hidratada produce moco fluido — que drena sin molestar. Mantener 1,5 a 2L de agua al día (preferentemente tibia) es el hábito más simple con el mayor retorno.',
          },
          {
            title: 'Solución salina como mantenimiento',
            text: 'Tres veces por semana — o diariamente en épocas de sequía y polvo. Este hábito de dos minutos previene el goteo posnasal y mantiene las vías despejadas.',
          },
          {
            title: 'Cuida el ambiente que respiras',
            text: 'Filtros de aire acondicionado limpios, ropa de cama lavada semanalmente, ambientes ventilados y sin focos de moho. El aire que entra a tu cuerpo importa tanto como lo que comes.',
          },
        ]} />

        <SectionDivider title="Mantente alerta — la flema avisa antes de volver" color={C.warn} />

        <CheckList color={C.warn} className="mt-2 mb-3" items={[
          'Carraspeo que vuelve todas las mañanas — señal de reflujo o exceso de lácteos',
          'Sensación de flema en el fondo de la garganta después de comer',
          'Aumento en el consumo de azúcar o lácteos en los últimos días',
          'Respiración más difícil en ambientes con aire acondicionado',
          'Regreso de moco espeso sin infección aparente',
        ]} />

        <TipCard icon="🔄" title="Si aparecen las señales — actúa antes de que se instale">
          Dos o más señales de las anteriores es el momento indicado para volver al protocolo de 7 días. No esperes que el problema se establezca. Cuanto antes actúes, menor es el esfuerzo para resolverlo.
        </TipCard>
      </PdfContentPage>

      {/* ── CAPÍTULO 10 — Preguntas Frecuentes ───────────────────── */}
      <PdfContentPage
        kicker="Capítulo 10"
        title="Preguntas Frecuentes"
        subtitle="Las dudas que más frenan a quienes están empezando — respondidas sin rodeos."
        accentGradient={ACCENT_BLUE}
      >
        <div className="space-y-3">
          {[
            {
              q: '¿Esto funciona para todo tipo de flema?',
              a: 'Funciona para la flema funcional — causada por hábitos, alimentación, reflujo leve o alergias. Esos casos representan la gran mayoría. Para la flema causada por infección bacteriana activa, bronquitis crónica grave u otras condiciones diagnosticadas, el acompañamiento médico es indispensable y esta guía debe usarse como complemento, no como sustituto.',
            },
            {
              q: '¿Cuánto tiempo hasta sentir resultados?',
              a: 'La mayoría de las personas nota una mejora perceptible entre el 3er y el 5to día cuando sigue el protocolo de forma constante. Los casos más crónicos — años con el mismo problema — pueden tardar de 2 a 4 semanas para una resolución completa. La constancia es más determinante que cualquier remedio aislado.',
            },
            {
              q: '¿Puedo tomar leche durante el protocolo?',
              a: 'No — especialmente en los primeros 7 días. Los lácteos son el principal detonante alimentario del exceso de moco en personas con predisposición. Reemplazarlos por leche vegetal (avena, almendra, coco) durante el protocolo es el enfoque correcto. Después de los 7 días, reintrodúcelos gradualmente y observa cómo responde tu cuerpo.',
            },
            {
              q: '¿Puedo seguir usando el aire acondicionado?',
              a: 'Sí — con adaptaciones. Mantén la temperatura por encima de 22°C, usa un humidificador junto con él, toma más agua y limpia los filtros con regularidad. El aire acondicionado en sí no es el problema; el aire seco que produce sí lo es. Corrige el ambiente y el problema desaparece.',
            },
            {
              q: 'Tengo alergia diagnosticada. ¿El protocolo sigue funcionando?',
              a: 'Funciona como complemento al tratamiento médico — no como sustituto. La higiene nasal, la humidificación y los ajustes alimentarios reducen la carga inflamatoria y facilitan la acción de los medicamentos recetados. Muchos pacientes alérgicos reportan una mejora significativa de los síntomas solo con estos ajustes.',
            },
            {
              q: '¿Los niños pueden seguir el protocolo?',
              a: 'Partes del protocolo son adaptables para niños — hidratación, solución salina y vaporizaciones con supervisión. Sin embargo, para niños menores de 12 años con flema persistente, la evaluación pediátrica es esencial antes de cualquier cambio significativo. No apliques el protocolo completo sin orientación médica en niños pequeños.',
            },
          ].map(({ q, a }) => (
            <div
              key={q}
              className="avoid-page-break rounded-xl overflow-hidden"
              style={{ border: `1px solid ${C.blueBorder}` }}
            >
              <div className="px-4 py-2.5" style={{ background: C.blue }}>
                <p className="text-[13px] font-bold text-white">❓ {q}</p>
              </div>
              <div className="px-4 py-3" style={{ background: C.blueLight }}>
                <p className="text-[13px] leading-relaxed text-foreground/70">{a}</p>
              </div>
            </div>
          ))}
        </div>
      </PdfContentPage>

      {/* ── CAPÍTULO 11 — Consideraciones Finales ────────────────── */}
      <PdfContentPage
        kicker="Capítulo 11"
        title="Consideraciones Finales"
        subtitle="Tienes el mapa. Ahora necesitas caminar."
        accentGradient={ACCENT_NAVY}
      >
        <div
          className="mb-4 rounded-xl px-5 py-4"
          style={{ background: C.blueDark }}
        >
          <p className="font-display text-[1.05rem] font-semibold leading-snug text-white">
            La flema que sientes hoy no es tu estado natural.<br />
            Es el resultado de un ambiente interno que necesita ser corregido.<br />
            Y ahora sabes exactamente cómo hacerlo.
          </p>
        </div>

        <Body>
          Recorriste todos los capítulos. Entendiste el mecanismo del problema, identificaste las causas, aprendiste qué lo empeora y qué lo resuelve, recibiste un protocolo de 7 días con misiones diarias y tienes en tus manos las soluciones naturales más eficaces para cada momento. Eso no es poco — es suficiente para cambiar completamente tu relación con este problema.
        </Body>

        <Body>
          Lo que separa a quien resuelve de quien sigue sufriendo no es el acceso a la información. Es la decisión de aplicarla. Hoy. No mañana, no la semana que viene. El primer paso cuesta menos de lo que parece: cambia la bebida fría por tibia, toma el té de jengibre por las mañanas, eleva la cabecera de la cama. Tres acciones. Y el cuerpo ya empieza a responder.
        </Body>

        <SectionDivider title="Qué hacer ahora mismo — en este momento" color={C.navy} />

        <CheckList color={C.navy} className="mt-2 mb-4" items={[
          'Identifica tu causa principal: alimentación, reflujo, ambiente o alergia',
          'Elige el primer ajuste más sencillo y aplícalo hoy mismo',
          'Comienza el Protocolo de 7 Días mañana temprano — con el té de jengibre en ayunas',
          'Usa al menos una solución natural por día durante los 7 días',
          'En los días 6 y 7: planifica cómo mantener los hábitos después del protocolo',
        ]} />

        <ImpactLine>Siete días de constancia logran lo que meses de intentos dispersos nunca pudieron.</ImpactLine>

        <Divider variant="gradient" color={C.blue} className="my-4" />

        <div
          className="rounded-2xl px-5 py-4"
          style={{ background: C.warnLight, border: `1.5px solid ${C.warnBorder}` }}
        >
          <p className="text-[11px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: C.warn }}>
            ⚠ Aviso Importante
          </p>
          <p className="text-[13px] leading-relaxed text-foreground/70 mb-2">
            Este e-book tiene una finalidad <strong>exclusivamente informativa y educativa</strong>. Las orientaciones aquí contenidas están basadas en prácticas tradicionales y conocimientos generales sobre salud respiratoria.
          </p>
          <p className="text-[13px] leading-relaxed text-foreground/70 mb-2">
            <strong>Este material no sustituye la consulta médica, el diagnóstico profesional ni el tratamiento prescrito por un especialista.</strong> Si tus síntomas son intensos, persisten más de 2 semanas, o vienen acompañados de fiebre, sangre o dificultad para respirar, busca atención médica de inmediato.
          </p>
          <p className="text-[13px] leading-relaxed text-foreground/70">
            Cada organismo responde de forma individual. Usa esta guía con responsabilidad y sentido común — es un punto de partida, no un diagnóstico.
          </p>
        </div>
      </PdfContentPage>
    </>
  );
}
