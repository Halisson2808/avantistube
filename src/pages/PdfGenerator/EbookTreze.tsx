/**
 * PDF 13 — Rota: /pdf/ebook-treze · The Collapse Code
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
  TagRow,
  SectionDivider,
  Divider,
} from '@/components/ebook/VisualElements';

const C = {
  // Destaques — vermelho escuro para títulos e acentos
  red:      'hsl(355 68% 36%)',
  redLight: 'hsl(355 55% 96%)',
  redBorder:'hsl(355 50% 78%)',
  // Seções especiais — preto para quotes e reality cuts
  black:    'hsl(0 0% 7%)',
  blackSoft:'hsl(0 0% 12%)',
  // Final — dourado de transformação
  gold:     'hsl(42 80% 50%)',
  goldLight:'hsl(42 70% 94%)',
  // Neutros
  paper:    '#F5F5F5',
  white:    '#ffffff',
  ink:      'hsl(0 0% 15%)',
};

// Accent gradients por contexto
const ACCENT_RED  = `linear-gradient(to bottom, ${C.red}, hsl(355 60% 28%))`;
const ACCENT_GOLD = `linear-gradient(to bottom, ${C.gold}, hsl(42 65% 40%))`;

function RealityCut({ children }: { children: ReactNode }) {
  return (
    <div
      className="my-3 flex items-start gap-3 rounded-lg px-4 py-3"
      style={{ background: C.black, borderLeft: `3px solid ${C.red}` }}
    >
      <span className="mt-0.5 shrink-0 text-[11px] font-bold" style={{ color: C.red }}>▸</span>
      <p className="text-[12px] font-semibold italic leading-snug text-white/90">
        {children}
      </p>
    </div>
  );
}

function DoThisNow({ items, gold = false }: { items: string[]; gold?: boolean }) {
  const accent = gold ? C.gold : C.red;
  return (
    <div
      className="mt-3 rounded-xl px-4 py-3"
      style={{ background: gold ? `${C.gold}14` : C.redLight, border: `1.5px solid ${gold ? C.gold + '50' : C.redBorder}` }}
    >
      <p className="mb-2 text-[9.5px] font-bold uppercase tracking-[0.28em]" style={{ color: accent }}>
        ◆ Do this now
      </p>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-0.5 text-[11px] font-bold shrink-0" style={{ color: accent }}>{i + 1}.</span>
            <p className="text-[11.5px] leading-snug text-foreground/80">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImpactLine({ children, gold = false }: { children: ReactNode; gold?: boolean }) {
  return (
    <p className="my-2.5 font-display text-[1rem] font-bold leading-snug" style={{ color: gold ? C.gold : C.red }}>
      {children}
    </p>
  );
}

function TwoColCards({ items, gold = false }: { items: { label: string; text: string }[]; gold?: boolean }) {
  const accent = gold ? C.gold : C.red;
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map(({ label, text }) => (
        <div key={label} className="rounded-lg p-2.5"
          style={{ background: gold ? `${C.gold}10` : C.redLight, border: `1px solid ${gold ? C.gold + '35' : C.redBorder}` }}>
          <p className="text-[11px] font-semibold" style={{ color: accent }}>{label}</p>
          <p className="mt-0.5 text-[10.5px] leading-snug text-foreground/65">{text}</p>
        </div>
      ))}
    </div>
  );
}

function DarkQuote({ text, author }: { text: string; author?: string }) {
  return (
    <div className="my-3 rounded-lg px-5 py-4" style={{ background: C.black }}>
      <svg className="mb-2 opacity-40" width="24" height="18" viewBox="0 0 28 20" fill={C.gold}>
        <path d="M0 20V12.4C0 8.13 1.4 4.67 4.2 2 7 .667 10.13 0 13.6 0v4C11.2 4 9.4 4.73 8.2 6.2 7 7.67 6.4 9.53 6.4 11.8H11.2V20H0ZM16.8 20V12.4C16.8 8.13 18.2 4.67 21 2 23.8.667 26.93 0 30.4 0v4C28 4 26.2 4.73 25 6.2 23.8 7.67 23.2 9.53 23.2 11.8H28V20H16.8Z" />
      </svg>
      <p className="text-[12.5px] italic leading-relaxed text-white/85">{text}</p>
      {author && <p className="mt-2 text-[10.5px] font-semibold" style={{ color: C.gold }}>— {author}</p>}
    </div>
  );
}

// Gancho de capítulo — loop aberto que puxa o leitor pra frente
function ChapterHook({ children }: { children: ReactNode }) {
  return (
    <div
      className="mt-3 flex items-start gap-2.5 rounded-lg px-4 py-2.5"
      style={{ background: C.blackSoft, borderLeft: `2px solid ${C.red}55` }}
    >
      <span className="mt-0.5 shrink-0 text-[10px]" style={{ color: C.red }}>→</span>
      <p className="text-[11px] italic leading-snug text-white/50">{children}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function EbookTreze() {
  return (
    <>
      {/* ── COVER ──────────────────────────────────────────────────── */}
      <section
        className="relative h-[297mm] overflow-hidden page-break-after print:shadow-none"
        style={{
          backgroundImage: 'url(/The-Collapse-Code.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* ── INTRODUCTION ─────────────────────────────────────────────── */}
      <PdfContentPage
        kicker="Introduction"
        title="This Is Not Random"
        subtitle="The collapse you feel has a structure. This guide shows you what it is."
        accentGradient={ACCENT_RED}
      >
        <div className="avoid-page-break mb-3 rounded-xl px-4 py-3.5"
          style={{ background: C.redLight, border: `1px solid ${C.redBorder}` }}>
          <p className="font-display text-[1rem] font-semibold leading-snug" style={{ color: C.red }}>
            You don't want your life back.<br />
            You want the pain to stop.<br />
            And those are not the same thing.
          </p>
        </div>

        <p className="mb-3 text-[12.5px] leading-relaxed text-foreground/80">
          Here is what nobody tells you: what you are experiencing is not a malfunction. It is a process — specific, documented, predictable — one that has been happening to human beings for thousands of years, long before anyone had clinical language for it.
        </p>

        <RealityCut>This process does not stop on its own. Understanding it is the first move.</RealityCut>

        <SectionDivider title="What this guide gives you" color={C.red} />

        <CheckList color={C.red} className="mt-2 mb-3" items={[
          "A name and a structure for what you are experiencing right now",
          "An explanation of the part of you that has been working against you without your awareness",
          "An honest look at why you keep repeating patterns you want to stop",
          "The markers of the rebuild phase — and what it actually requires",
          "Practical steps at the end of each section — awareness first, not perfection",
        ]} />

        <Divider variant="gradient" color={C.red} />

        <Callout type="info" title="One thing before you continue">
          This guide will not comfort you with false reassurance. It will give you something more useful — an honest map of where you are and what comes next.
        </Callout>
      </PdfContentPage>

      {/* ── CHAPTER 1 — The Collapse Phase ──────────────────────────── */}
      <PdfContentPage
        kicker="Chapter 1"
        title="The Collapse Phase"
        subtitle="What the alchemists understood about breakdown — and why it changes everything."
        accentGradient={ACCENT_RED}
      >
        <HighlightBanner
          text="Nigredo — Latin for 'blackening.' The first stage of alchemical transformation. The burning that must happen before gold can form."
          icon="🔥"
          color={C.black}
          className="mb-3"
        />

        <p className="mb-2 text-[12.5px] leading-relaxed text-foreground/80">
          Before gold could form, the alchemists knew the raw material had to be reduced to ash first. The blackening phase — the Nigredo — looked like destruction. To the alchemist, it was the beginning.
        </p>

        <ImpactLine>You are in the fire right now. That is not a metaphor.</ImpactLine>

        <p className="mb-3 text-[12.5px] leading-relaxed text-foreground/80">
          The identity you have been living inside — built from roles, habits, and expectations — is losing its structure. The collapse is real. The disorientation is real. But it is not permanent damage. It is evidence that the process has started.
        </p>

        <SectionDivider title="The three layers of Nigredo" color={C.red} />

        <StepList color={C.red} className="mt-2 mb-3" steps={[
          {
            title: 'The Burning — Loss of meaning',
            text: "Things that used to matter stop mattering. Goals feel hollow. The internal fuel that sustained your old identity runs out.",
          },
          {
            title: 'The Ash — Loss of form',
            text: "Hollowness. Numbness. A sense of watching yourself from outside. The old structure has burned and what remains is unformed.",
          },
          {
            title: 'The Ground Clearing — Loss of direction',
            text: "You do not know who you are or what you want. This is not confusion — this is space. The most essential ingredient for what comes next.",
          },
        ]} />

        <RealityCut>If you rebuild your old identity right now, you will end up back here — sooner and harder.</RealityCut>

        <DoThisNow items={[
          "Write one sentence: 'I am in the _______ phase.' (Burning / Ash / Ground Clearing). Name it exactly.",
          "Stop asking when this will end. Start asking: what is this clearing space for?",
        ]} />
      </PdfContentPage>

      {/* ── CHAPTER 1 cont — Symptoms ───────────────────────────────── */}
      <PdfContentPage
        kicker="Chapter 1 — continued"
        title="What the Collapse Actually Feels Like"
        subtitle="The symptoms you are misreading as permanent damage — and what they actually mean."
        accentGradient={ACCENT_RED}
      >
        <p className="mb-3 text-[12.5px] leading-relaxed text-foreground/80">
          The Nigredo has specific symptoms. You have probably experienced most of them — and interpreted each one as evidence that something is permanently wrong. That interpretation is the most dangerous part of the process.
        </p>

        <TwoColCards items={[
          { label: 'Emotional numbness or sudden waves', text: "Your emotional system is rerouting. Old pathways shutting down, new ones not formed yet." },
          { label: 'Inability to make decisions', text: "The value system you used to decide from is dissolving. You are between operating systems." },
          { label: 'Loss of interest in everything', text: "Those things belonged to the old identity. The new version has not found its sources of meaning yet." },
          { label: '"Something is wrong with me"', text: "Voice of the dying identity — not the truth. Gets loudest right before a breakthrough." },
          { label: 'Social withdrawal', text: "Transformation is an inward process. The withdrawal is protective — energy is directing inward." },
          { label: 'Physical exhaustion', text: "Holding a collapsing structure costs enormous energy. The body is asking you to stop fighting it." },
        ]} />

        <RealityCut>Fighting the collapse extends it. Understanding it moves you through it.</RealityCut>

        <FactBox
          fact="Carl Jung called the Nigredo 'the dark night of the soul' — not a crisis to be avoided, but a descent that must be completed before genuine psychological transformation can begin."
          color={C.red}
          className="mt-3 mb-2"
        />

        <ChapterHook>
          In the next chapter, you will understand why "feeling lost" is not the real problem — and what is actually happening underneath it that nobody talks about.
        </ChapterHook>
      </PdfContentPage>

      {/* ── CHAPTER 2 — Why You Feel Lost ──────────────────────────── */}
      <PdfContentPage
        kicker="Chapter 2"
        title="Why You Feel Lost"
        subtitle="This is not a breakdown. It is an identity death — and they are entirely different things."
        accentGradient={ACCENT_RED}
      >
        <div className="avoid-page-break mb-3">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/45">
            Questions that will not leave you alone
          </p>
          <TagRow tags={[
            "Who am I without this?",
            "What do I actually want?",
            "Why does nothing feel like enough?",
            "Am I the problem?",
            "What is the point?",
          ]} color={C.red} />
        </div>

        <p className="mb-2 text-[12.5px] leading-relaxed text-foreground/80">
          These questions have no quick answer because they are not problems to solve — they are symptoms of a process already happening. Your identity is dissolving. Not who you fundamentally are, but the structure — the roles, the achievements, the performance — built on top of it.
        </p>

        <RealityCut>You are not confused. You are avoiding something. The confusion is the cover story.</RealityCut>

        <ImpactLine>You cannot go back to who you were. That version of you is what broke down.</ImpactLine>

        <Callout type="warning" title="The trap that keeps people stuck for years" className="mb-3">
          Treating identity collapse like a temporary problem to fix. So they run — into work, into new plans, into new relationships — anything to stop the feeling. The feeling keeps returning because it is not asking to be silenced. It is asking to be understood.
        </Callout>

        <ComparisonCard
          leftTitle="What it feels like"
          rightTitle="What it actually is"
          leftItems={['Failure', 'Permanent damage', 'Weakness', 'Something wrong with me']}
          rightItems={['Identity dissolving', 'Transformation activating', 'Necessary process', 'The system working']}
          color={C.red}
          className="mb-3"
        />

        <DoThisNow items={[
          "Write down three roles you used to identify with that feel hollow now. Just name them — no judgment.",
          "Ask: which of those roles was genuinely mine — and which did I build to survive or be accepted?",
        ]} />
      </PdfContentPage>

      {/* ── CHAPTER 2 cont — Four Layers ────────────────────────────── */}
      <PdfContentPage
        kicker="Chapter 2 — continued"
        title="The Four Layers of Identity"
        subtitle="Understanding exactly what is dissolving — and what remains untouched underneath."
        accentGradient={ACCENT_RED}
      >
        <p className="mb-3 text-[12.5px] leading-relaxed text-foreground/80">
          Identity does not collapse all at once. It dissolves from the outside in. Understanding which layer is cracking tells you exactly where you are — and what you still have underneath to build from.
        </p>

        <StepList color={C.red} className="mb-3" steps={[
          {
            title: 'Social Identity — Who you are to other people',
            text: "Job title. Relationship status. Reputation. When these shift, the first wave of disorientation hits. Real — but not the deepest layer.",
          },
          {
            title: 'Role Identity — What you do for other people',
            text: "The provider. The responsible one. The fixer. When these get disrupted, the second wave arrives. You feel purposeless.",
          },
          {
            title: 'Value Identity — What you believe you should want',
            text: "The goals, the lifestyle, the version of success you were chasing. When these stop feeling true, everything you built toward feels hollow.",
          },
          {
            title: 'Core Identity — Who you are beneath all of it',
            text: "This is what the Nigredo is trying to reach. The version of you that exists without role, status, or approval. Most people never touch this — because they stop the process too early.",
          },
        ]} />

        <Callout type="info" title="What does not collapse in the Nigredo" className="mb-3">
          Your deepest values. Your capacity to feel. Your intuition. Your body. These are not destroyed — they get uncovered. The Nigredo removes the noise. Not the signal.
        </Callout>

        <ChapterHook>
          In the next chapter, you will meet the part of you that has been working against everything you want — quietly, invisibly, for years. Most people never identify it. That is why they keep losing.
        </ChapterHook>
      </PdfContentPage>

      {/* ── CHAPTER 3 — The Hidden Enemy ────────────────────────────── */}
      <PdfContentPage
        kicker="Chapter 3"
        title="The Hidden Enemy"
        subtitle="There is a part of you working against you. It has been there for years. You have never been properly introduced."
        accentGradient={ACCENT_RED}
      >
        <p className="mb-2 text-[12.5px] leading-relaxed text-foreground/80">
          From the moment you were born, you learned which parts of you were acceptable and which were not. The anger that made people uncomfortable. The neediness that was called weakness. The ambition that was called arrogance. One by one, you put those parts away. They did not disappear. They went underground.
        </p>

        <ImpactLine>Psychologists call it the Shadow. It is the sum of everything you rejected in yourself in order to survive.</ImpactLine>

        <RealityCut>You don't feel lost. You feel exposed. The Shadow has been exposed — and everything in you wants to push it back down.</RealityCut>

        <SectionDivider title="How the Shadow was built" color={C.red} />

        <TwoColCards items={[
          { label: 'Early emotional suppression', text: "Every emotion you were punished or shamed for expressing got pushed down and added to the Shadow's weight." },
          { label: 'Performed identity', text: "The gap between who you present to the world and how you actually feel — that gap is where the Shadow lives." },
          { label: 'Unprocessed experiences', text: "Pain you absorbed but never worked through. It does not leave — it waits." },
          { label: 'Social conditioning', text: "Rules absorbed from family, culture, and environment about which parts of you were allowed and which were not." },
        ]} />

        <DarkQuote text="Everything you refuse to look at inside yourself will find a way out — through your relationships, your patterns, your breakdowns. The Shadow does not wait indefinitely." />

        <DoThisNow items={[
          "Name the emotion you express the least. Write it down.",
          "Ask: where did I learn that this emotion was not allowed? Who taught me that?",
        ]} />
      </PdfContentPage>

      {/* ── CHAPTER 3 cont — Recognizing the Shadow ─────────────────── */}
      <PdfContentPage
        kicker="Chapter 3 — continued"
        title="How to Recognize Your Shadow"
        subtitle="It does not announce itself. It shows up in your patterns — at the worst possible moments."
        accentGradient={ACCENT_RED}
      >
        <p className="mb-3 text-[12.5px] leading-relaxed text-foreground/80">
          The Shadow speaks through behavior — reactions that feel disproportionate, patterns you repeat without wanting to, the things you do the moment something starts going well. It is always loudest when you are close to something good, and when someone triggers something you have refused to acknowledge in yourself.
        </p>

        <SectionDivider title="Signs the Shadow is running the show" color={C.red} />

        <CheckList color={C.red} className="mt-2 mb-3" items={[
          "You explode at small things — the real anger is always about something much older",
          "You push people away right before intimacy deepens — before they can leave you first",
          "You chase success or approval compulsively — not from desire, but from fear of who you are without them",
          "You repeat the same relationship dynamic with completely different people, every time",
          "You destroy things right before they get good — success feels more frightening than failure",
          "Certain traits in others trigger reactions that feel much bigger than the situation warrants",
        ]} />

        <Callout type="tip" title="The projection signal" className="mb-3">
          The qualities that bother you most in other people are often the ones you have refused to allow in yourself. That charge you feel is not a judgment — it is a signal pointing directly at your own Shadow.
        </Callout>

        <RealityCut>If you ignore the Shadow, it does not disappear. It waits — and eventually it makes the decision for you.</RealityCut>

        <ChapterHook>
          In the next chapter, you will understand exactly why — even when you know what is happening — you still cannot stop doing it. The answer is not what you think.
        </ChapterHook>
      </PdfContentPage>

      {/* ── CHAPTER 4 — Self-Sabotage ────────────────────────────────── */}
      <PdfContentPage
        kicker="Chapter 4"
        title="Why You Keep Self-Sabotaging"
        subtitle="You are not broken. You are running a protection program installed a long time ago — and never updated."
        accentGradient={ACCENT_RED}
      >
        <div className="avoid-page-break mb-3 rounded-xl px-4 py-3.5"
          style={{ background: C.redLight, border: `1px solid ${C.redBorder}` }}>
          <p className="font-display text-[0.95rem] font-bold leading-snug" style={{ color: C.red }}>
            You're not stuck.<br />
            You're refusing to let go.<br />
            And somewhere underneath, you know it.
          </p>
        </div>

        <p className="mb-2 text-[12.5px] leading-relaxed text-foreground/80">
          Something good was happening — a goal getting close, a relationship deepening — and something inside you pulled the brake. You called it self-sabotage. But that label does not explain anything. The real question is: what was the sabotage protecting you from?
        </p>

        <ImpactLine>Your nervous system does not distinguish safe from comfortable. It distinguishes known from unknown — and the unknown, even when good, registers as threat.</ImpactLine>

        <SectionDivider title="The sabotage cycle — exactly how it works" color={C.red} />

        <StepList color={C.red} className="mt-2 mb-3" steps={[
          {
            title: 'Forward movement begins',
            text: "Something new and real is happening. Progress is visible.",
          },
          {
            title: 'The Shadow reads this as danger',
            text: "\"Good\" registers as \"unfamiliar.\" \"Unfamiliar\" registers as threat. The alarm fires — below conscious thought.",
          },
          {
            title: 'A behavior is triggered',
            text: "Procrastination. An argument from nothing. Disappearing. The function is always the same: return to familiar ground.",
          },
          {
            title: 'The return to known pain',
            text: "The system relaxes. You are back where you started. The pain is familiar — and that familiarity feels like safety.",
          },
          {
            title: 'Self-blame and confusion',
            text: "You do not understand what happened. You blame your discipline. The actual driver — the Shadow — remains invisible.",
          },
        ]} />

        <RealityCut>This pattern does not break itself. It requires being seen — specifically, precisely, without self-blame.</RealityCut>
      </PdfContentPage>

      {/* ── CHAPTER 4 cont — Root of Sabotage ──────────────────────── */}
      <PdfContentPage
        kicker="Chapter 4 — continued"
        title="Where the Sabotage Comes From"
        subtitle="Every self-sabotage pattern was once a solution. Understanding the original problem changes everything."
        accentGradient={ACCENT_RED}
      >
        <p className="mb-3 text-[12.5px] leading-relaxed text-foreground/80">
          Self-sabotage almost never starts in adulthood. It starts when you are young — when specific outcomes taught you that moving forward is dangerous. Those strategies were intelligent for the situations that created them. The problem is they were installed as permanent programs, still running now in situations where they no longer apply.
        </p>

        <SectionDivider title="Common patterns — and the protection logic underneath" color={C.red} />

        <TwoColCards items={[
          { label: 'Chronic procrastination', text: "If I never fully try, I can never fully fail. A shield against the judgment that comes with real effort." },
          { label: 'Sabotaging intimacy', text: "If I pull away first, I control the loss. The preemptive withdrawal feels like power — but it is fear." },
          { label: 'Creating conflict when things are good', text: "Peace feels dangerous. The conflict takes control of chaos before it arrives on its own." },
          { label: 'Staying smaller than your capacity', text: "Visibility is threatening. Staying small avoids the consequences of being seen — and potentially criticized." },
        ]} />

        <Callout type="tip" title="The shift that breaks the pattern" className="mb-3">
          Stop asking "why do I keep doing this?" Start asking "what was I afraid of when this started?" The first produces shame. The second produces understanding — the only thing that actually interrupts the cycle.
        </Callout>

        <DoThisNow items={[
          "Name one specific way you sabotage forward movement — exactly what you do, not just 'I self-sabotage.'",
          "Complete the sentence: 'I do this because I am afraid that if I don't, ____________.'",
        ]} />

        <ChapterHook>
          In the next chapter, you will understand what happens after the Nigredo ends — and why most people miss it, or leave before it fully arrives.
        </ChapterHook>
      </PdfContentPage>

      {/* ── CHAPTER 5 — The Rebuild Phase ───────────────────────────── */}
      <PdfContentPage
        kicker="Chapter 5"
        title="The Rebuild Phase"
        subtitle="The Nigredo does not last forever. But entering the next phase requires something most people are not willing to do."
        accentGradient={ACCENT_RED}
      >
        <HighlightBanner
          text="Albedo — Latin for 'whitening.' The purification phase. What remains after the burning becomes the foundation for something new."
          icon="🌫️"
          color={C.blackSoft}
          className="mb-3"
        />

        <p className="mb-2 text-[12.5px] leading-relaxed text-foreground/80">
          The Albedo begins not with a dramatic revelation but with a quiet shift — you stop fighting the collapse and start working with it. It does not feel like sudden relief. It feels like things getting slightly quieter inside. Moments of unexpected clarity between the difficult days.
        </p>

        <ImpactLine>You cannot force the Albedo. But you can stop obstructing it — and that alone changes everything.</ImpactLine>

        <SectionDivider title="Signs the Albedo has started" color={C.red} />

        <CheckList color={C.red} className="mt-2 mb-3" items={[
          "You stop blaming yourself for the collapse — you start getting curious about what it is showing you",
          "Small things start to matter again — not everything, but something returns",
          "Patterns you used to repeat automatically start to become visible before they complete",
          "You feel less need to perform and more permission to be honest",
          "You start making choices aligned with something deeper — even without fully understanding why",
        ]} />

        <Callout type="success" title="What the Albedo requires — and what it does not">
          It requires patience and the willingness to sit with discomfort without immediately resolving it. It does NOT require answers or a plan. You are integrating — not rebuilding yet.
        </Callout>

        <RealityCut>What gets built without integration collapses again. Most people discover this the hard way.</RealityCut>
      </PdfContentPage>

      {/* ── CHAPTER 5 cont — Working With Albedo ────────────────────── */}
      <PdfContentPage
        kicker="Chapter 5 — continued"
        title="How to Work With the Albedo"
        subtitle="What genuinely supports the rebuild — and what delays it without you realizing."
        accentGradient={ACCENT_RED}
      >
        <p className="mb-3 text-[12.5px] leading-relaxed text-foreground/80">
          The biggest mistake in the Albedo is forcing reconstruction before integration is complete. A structure built on unintegrated material will crack at the first real pressure. Most of the work here is about removing interference — not adding new strategies.
        </p>

        <StepList color={C.red} className="mb-3" steps={[
          {
            title: 'Honest self-observation without punishment',
            text: "Notice your patterns without immediately trying to fix them. Ask 'why did I just do that?' — not to criticize, but to build awareness.",
          },
          {
            title: 'Reduce the performance',
            text: "Every time you perform okayness you do not feel, you delay the process. Find one person or space where you can be honest.",
          },
          {
            title: 'Let old things end without forcing them',
            text: "Relationships and identities that no longer fit — do not hold them with desperation or abandon them with anger. Let them end with awareness.",
          },
          {
            title: 'Follow small signals before they make sense',
            text: "Unexpected interest in something new. A moment of energy for no reason. These are early signals of the emerging identity. Follow them.",
          },
        ]} />

        <Callout type="warning" title="About setbacks inside the Albedo" className="mb-3">
          You will have days that feel like you went back to the Nigredo. This is normal. The process is not linear. The critical difference: you will know what is happening. And knowing changes everything.
        </Callout>

        <ChapterHook>
          In the next chapter, you will see exactly what shifts on the other side — not the version you imagined, but the true one. It is quieter than you expect. And more permanent.
        </ChapterHook>
      </PdfContentPage>

      {/* ── CHAPTER 6 — What You Become ─────────────────────────────── */}
      <PdfContentPage
        kicker="Chapter 6"
        title="What You Become After This"
        subtitle="Not who you were. Not someone else. Something more honest and more durable than either."
        accentGradient={ACCENT_RED}
      >
        <p className="mb-2 text-[12.5px] leading-relaxed text-foreground/80">
          Nobody who goes through a genuine Nigredo comes out the same. The entire function of the process is transformation — not improvement of the old version, but a fundamental change in structure. What changes is not your personality. What changes is the relationship you have with yourself.
        </p>

        <ImpactLine>Instead of being swept by the current, you start to navigate it. The difference between those two things is everything.</ImpactLine>

        <SectionDivider title="What genuinely shifts after the collapse" color={C.red} />

        <StepList color={C.red} className="mt-2 mb-3" steps={[
          {
            title: 'From reacting to responding',
            text: "The trigger still fires. But there is a pause between stimulus and action that did not exist before. In that pause, you get to choose.",
          },
          {
            title: 'From performing to being',
            text: "The masks become heavier — you notice them. And slowly, in moments where it is safe, you start putting them down.",
          },
          {
            title: 'From fear-driven goals to values-driven choices',
            text: "You stop chasing things because you are afraid of what happens without them. You start choosing from what is genuinely aligned with who you are.",
          },
          {
            title: 'From suppressing the Shadow to working with it',
            text: "Your anger becomes information. Your fear tells you something matters. Your envy shows you what you want but have not admitted.",
          },
        ]} />

        <RealityCut>This is not a permanent arrival. It is a new baseline — from which the next phase of growth becomes possible.</RealityCut>
      </PdfContentPage>

      {/* ── CHAPTER 6 cont — Markers of Transformation ──────────────── */}
      <PdfContentPage
        kicker="Chapter 6 — continued"
        title="The Real Markers of Transformation"
        subtitle="What it looks and feels like when the process has done its work — not the dramatic version, the true one."
        accentGradient={ACCENT_RED}
      >
        <p className="mb-3 text-[12.5px] leading-relaxed text-foreground/80">
          Transformation does not arrive as a dramatic morning where everything is different. It arrives in ordinary moments — in how you handle a conversation that used to destroy you, in how you respond to a failure that used to define you, in how you treat yourself when no one is watching.
        </p>

        <SectionDivider title="You will know the process has worked when..." color={C.red} />

        <CheckList color={C.red} className="mt-2 mb-3" items={[
          "You can feel difficult emotions without immediately needing to escape or suppress them",
          "You catch patterns mid-action — before they complete automatically",
          "You need less external validation to know what you want and who you are",
          "You can hold uncertainty without it collapsing into panic",
          "You make decisions from what you actually want — not from what you are supposed to want",
          "You can acknowledge your flaws without it becoming self-destruction",
        ]} />

        <DarkQuote text="The goal is not to become someone else. The goal is to become the version of you that existed before the conditioning, before the performance, before the fear — and to live from that place deliberately." />

        <Callout type="info" title="What does not change — and why that matters">
          You will still have hard days. Still get triggered. Still feel old patterns pulling. The difference: you will have a name for it and a map for it. Knowing changes the experience from being lost inside a storm to watching the storm from solid ground.
        </Callout>
      </PdfContentPage>

      {/* ── FINAL — gold theme ───────────────────────────────────────── */}
      <PdfContentPage
        kicker="Final"
        title="The Next Step"
        subtitle="Most people who start something like this do not finish it. You did. Now comes the harder part."
        accentGradient={ACCENT_GOLD}
      >
        <div className="avoid-page-break mb-3 rounded-xl px-4 py-3.5"
          style={{ background: C.goldLight, border: `1px solid ${C.gold}50` }}>
          <p className="font-display text-[0.95rem] font-bold leading-snug" style={{ color: C.gold }}>
            If this hit you, you are not at the end.<br />
            You are at the beginning.<br />
            And that is the most important thing to understand right now.
          </p>
        </div>

        <p className="mb-2 text-[12.5px] leading-relaxed text-foreground/80">
          Most people close something like this and return immediately to what they were doing before. Not because they do not want to change — but because understanding and change are two completely different things. Understanding is the map. Change is the walk. Nobody walks the map.
        </p>

        <ImpactLine gold>The collapse brought you here. What you do in the next 72 hours determines whether it meant anything.</ImpactLine>

        <SectionDivider title="What to do — starting now, not eventually" color={C.gold} />

        <StepList color={C.gold} className="mt-2 mb-3" steps={[
          {
            title: 'Name your phase',
            text: "Nigredo (collapse, numbness) or Albedo (early integration, small movement). Write it down. Naming removes some of the terror.",
          },
          {
            title: 'Pick one Shadow pattern',
            text: "From Chapter 3 — one pattern you recognized. Not to fix it. Observe it this week. That observation alone begins to interrupt the automation.",
          },
          {
            title: 'Track the brake once',
            text: "This week, notice once when you pull back from something good. What were you about to do? What did you feel right before you stopped?",
          },
        ]} />

        <DarkQuote
          text="You did not fall apart randomly. You fell apart exactly on schedule. The collapse was not the end of you — it was the end of a version of you that could not take you where you actually need to go."
          author="The Collapse Code"
        />

        <DoThisNow gold items={[
          "Come back to this guide when the Nigredo returns — and it will. The map is most useful when you feel most lost.",
          "There is a deeper layer most people never reach. What you do with this framework determines whether you get there.",
        ]} />

        <HighlightBanner
          text="The process continues. The only question is whether you continue with it."
          color={C.gold}
          className="mt-3"
        />
      </PdfContentPage>
    </>
  );
}
