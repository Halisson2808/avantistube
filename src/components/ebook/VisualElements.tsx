/**
 * VisualElements — Biblioteca de elementos visuais para PDFs
 * Uso: import { Divider, QuoteBlock, ... } from '@/components/ebook/VisualElements'
 */
import type { ReactNode, CSSProperties } from 'react';

// ── Dividers ──────────────────────────────────────────────────────────────────

/** Divisor decorativo com várias variantes */
export function Divider({
  variant = 'line',
  color = 'hsl(var(--border))',
  className = '',
}: {
  variant?: 'line' | 'dots' | 'ornament' | 'gradient' | 'dashes';
  color?: string;
  className?: string;
}) {
  if (variant === 'dots') {
    return (
      <div className={`my-3 flex items-center justify-center gap-2 ${className}`}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: color, opacity: i === 1 ? 1 : 0.4 }} />
        ))}
      </div>
    );
  }
  if (variant === 'ornament') {
    return (
      <div className={`my-3 flex items-center gap-3 ${className}`}>
        <div className="flex-1 border-t" style={{ borderColor: color }} />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2L9.5 6.5H14L10.5 9L12 13.5L8 11L4 13.5L5.5 9L2 6.5H6.5L8 2Z" fill={color} />
        </svg>
        <div className="flex-1 border-t" style={{ borderColor: color }} />
      </div>
    );
  }
  if (variant === 'gradient') {
    return (
      <div className={`my-3 h-px w-full ${className}`} style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }} />
    );
  }
  if (variant === 'dashes') {
    return (
      <div className={`my-3 flex items-center gap-1 ${className}`}>
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="h-px flex-1 rounded-full" style={{ background: color, opacity: i % 3 === 0 ? 1 : 0.3 }} />
        ))}
      </div>
    );
  }
  return <div className={`my-3 border-t ${className}`} style={{ borderColor: color }} />;
}

// ── Arrows ────────────────────────────────────────────────────────────────────

export function ArrowRight({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="inline-block">
      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowDown({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="inline-block">
      <path d="M12 5V19M19 12L12 19L5 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowCurved({ size = 24, color = 'currentColor', direction = 'right' }: { size?: number; color?: string; direction?: 'right' | 'down' | 'left' }) {
  const rotate = direction === 'down' ? 'rotate(90)' : direction === 'left' ? 'rotate(180)' : '';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="inline-block" transform={rotate}>
      <path d="M3 12C3 7 7 3 12 3C17 3 21 7 21 12" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M21 12L17 8M21 12L17 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── Number Stat ───────────────────────────────────────────────────────────────

/** Número grande destacado com rótulo — ótimo para estatísticas e fatos */
export function NumberStat({
  number,
  label,
  color = 'hsl(var(--primary))',
  size = 'md',
  className = '',
}: {
  number: string | number;
  label: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const numSize = { sm: 'text-[2rem]', md: 'text-[2.8rem]', lg: 'text-[3.5rem]' }[size];
  const lblSize = { sm: 'text-[11px]', md: 'text-[12px]', lg: 'text-[13px]' }[size];
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <span className={`font-display font-bold leading-none ${numSize}`} style={{ color }}>{number}</span>
      <span className={`mt-1 font-medium text-foreground/70 ${lblSize}`}>{label}</span>
    </div>
  );
}

/** Linha de stats lado a lado */
export function StatsRow({ stats, color }: { stats: { number: string; label: string }[]; color?: string }) {
  return (
    <div className="flex items-start justify-around py-2">
      {stats.map((s, i) => (
        <NumberStat key={i} number={s.number} label={s.label} color={color} size="sm" />
      ))}
    </div>
  );
}

// ── Quote Block ───────────────────────────────────────────────────────────────

/** Bloco de citação com aspas decorativas grandes */
export function QuoteBlock({
  text,
  author,
  color = 'hsl(var(--primary))',
  className = '',
}: {
  text: string;
  author?: string;
  color?: string;
  className?: string;
}) {
  return (
    <div className={`relative my-2 rounded-r-lg border-l-4 py-3 pl-5 pr-4 ${className}`} style={{ borderColor: color, background: `${color}10` }}>
      <svg className="absolute -top-1 left-3 opacity-20" width="28" height="20" viewBox="0 0 28 20" fill={color}>
        <path d="M0 20V12.4C0 8.13 1.4 4.67 4.2 2 7 .667 10.13 0 13.6 0v4C11.2 4 9.4 4.73 8.2 6.2 7 7.67 6.4 9.53 6.4 11.8H11.2V20H0ZM16.8 20V12.4C16.8 8.13 18.2 4.67 21 2 23.8.667 26.93 0 30.4 0v4C28 4 26.2 4.73 25 6.2 23.8 7.67 23.2 9.53 23.2 11.8H28V20H16.8Z" />
      </svg>
      <p className="text-[13px] leading-relaxed text-foreground/85 italic">{text}</p>
      {author && <p className="mt-2 text-[11px] font-semibold" style={{ color }}>— {author}</p>}
    </div>
  );
}

// ── Step List ─────────────────────────────────────────────────────────────────

/** Lista de passos numerados com linha conectora */
export function StepList({
  steps,
  color = 'hsl(var(--primary))',
  className = '',
}: {
  steps: { title: string; text?: string }[];
  color?: string;
  className?: string;
}) {
  return (
    <div className={`space-y-0 ${className}`}>
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: color }}>
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className="w-px flex-1 my-1" style={{ background: `${color}40` }} />}
          </div>
          <div className={`${i < steps.length - 1 ? 'pb-3' : ''}`}>
            <p className="text-[12.5px] font-semibold leading-tight" style={{ color }}>{step.title}</p>
            {step.text && <p className="mt-0.5 text-[11.5px] leading-relaxed text-foreground/75">{step.text}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Highlight Banner ──────────────────────────────────────────────────────────

/** Banner horizontal colorido de destaque */
export function HighlightBanner({
  text,
  icon,
  color = 'hsl(var(--primary))',
  textColor = 'white',
  className = '',
}: {
  text: string;
  icon?: string;
  color?: string;
  textColor?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 rounded-lg px-4 py-3 ${className}`} style={{ background: color }}>
      {icon && <span className="text-[1.2rem] shrink-0" aria-hidden>{icon}</span>}
      <p className="text-[13px] font-semibold leading-snug" style={{ color: textColor }}>{text}</p>
    </div>
  );
}

// ── Callout Box ───────────────────────────────────────────────────────────────

const CALLOUT_CONFIG = {
  tip:     { icon: '💡', label: 'Dica',     bg: 'hsl(48 90% 96%)',  border: 'hsl(45 80% 60%)',  text: 'hsl(40 70% 25%)' },
  warning: { icon: '⚠️', label: 'Atenção',  bg: 'hsl(25 90% 96%)',  border: 'hsl(25 80% 60%)',  text: 'hsl(22 70% 25%)' },
  info:    { icon: 'ℹ️', label: 'Saiba',    bg: 'hsl(210 80% 96%)', border: 'hsl(210 65% 60%)', text: 'hsl(215 60% 25%)' },
  success: { icon: '✅', label: 'Resultado', bg: 'hsl(140 65% 96%)', border: 'hsl(140 55% 55%)', text: 'hsl(145 55% 20%)' },
  myth:    { icon: '❌', label: 'Mito',      bg: 'hsl(355 80% 96%)', border: 'hsl(355 65% 60%)', text: 'hsl(355 60% 28%)' },
};

/** Caixa de destaque: dica, atenção, informação, resultado ou mito */
export function Callout({
  type = 'tip',
  title,
  children,
  color,
  className = '',
}: {
  type?: keyof typeof CALLOUT_CONFIG;
  title?: string;
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  const cfg = CALLOUT_CONFIG[type];
  return (
    <div
      className={`rounded-lg border-l-4 px-3.5 py-2.5 ${className}`}
      style={{ background: cfg.bg, borderColor: color ?? cfg.border }}
    >
      <div className="mb-1 flex items-center gap-1.5">
        <span className="text-[14px]">{cfg.icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: color ?? cfg.text }}>
          {title ?? cfg.label}
        </span>
      </div>
      <div className="text-[12px] leading-relaxed" style={{ color: cfg.text }}>{children}</div>
    </div>
  );
}

// ── Icon Badge ────────────────────────────────────────────────────────────────

/** Crachá circular com emoji e rótulo */
export function IconBadge({
  emoji,
  label,
  color = 'hsl(var(--primary))',
  size = 'md',
  className = '',
}: {
  emoji: string;
  label?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const dim = { sm: 'h-8 w-8 text-[1rem]', md: 'h-11 w-11 text-[1.4rem]', lg: 'h-14 w-14 text-[1.8rem]' }[size];
  const lbl = { sm: 'text-[10px]', md: 'text-[11px]', lg: 'text-[12px]' }[size];
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div className={`flex shrink-0 items-center justify-center rounded-full ${dim}`} style={{ background: `${color}18`, border: `2px solid ${color}30` }}>
        <span aria-hidden>{emoji}</span>
      </div>
      {label && <span className={`font-medium text-foreground/70 ${lbl}`}>{label}</span>}
    </div>
  );
}

/** Linha de ícones */
export function IconRow({ items, color }: { items: { emoji: string; label: string }[]; color?: string }) {
  return (
    <div className="flex items-start justify-around py-1">
      {items.map((item) => (
        <IconBadge key={item.label} emoji={item.emoji} label={item.label} color={color} size="sm" />
      ))}
    </div>
  );
}

// ── Check List ────────────────────────────────────────────────────────────────

/** Lista com checkmarks coloridos */
export function CheckList({
  items,
  color = 'hsl(var(--primary))',
  columns = 1,
  className = '',
}: {
  items: string[];
  color?: string;
  columns?: 1 | 2;
  className?: string;
}) {
  return (
    <div className={`${columns === 2 ? 'grid grid-cols-2 gap-x-4' : 'space-y-1'} ${className}`}>
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2 py-0.5">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 shrink-0">
            <circle cx="7" cy="7" r="7" fill={color} fillOpacity="0.15" />
            <path d="M4 7L6 9L10 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[12px] leading-tight text-foreground/80">{item}</span>
        </div>
      ))}
    </div>
  );
}

/** Lista com X (negativo) */
export function CrossList({
  items,
  color = 'hsl(355 65% 50%)',
  className = '',
}: {
  items: string[];
  color?: string;
  className?: string;
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2 py-0.5">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 shrink-0">
            <circle cx="7" cy="7" r="7" fill={color} fillOpacity="0.15" />
            <path d="M5 5L9 9M9 5L5 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[12px] leading-tight text-foreground/80">{item}</span>
        </div>
      ))}
    </div>
  );
}

// ── Tag Row ───────────────────────────────────────────────────────────────────

/** Linha de tags/etiquetas coloridas */
export function TagRow({
  tags,
  color = 'hsl(var(--primary))',
  className = '',
}: {
  tags: string[];
  color?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
          style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

// ── Comparison Card ───────────────────────────────────────────────────────────

/** Comparação lado a lado (ex: Antes x Depois, Certo x Errado) */
export function ComparisonCard({
  leftTitle = 'Sem',
  rightTitle = 'Com',
  leftItems,
  rightItems,
  color = 'hsl(var(--primary))',
  className = '',
}: {
  leftTitle?: string;
  rightTitle?: string;
  leftItems: string[];
  rightItems: string[];
  color?: string;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-2 gap-0 overflow-hidden rounded-xl border ${className}`} style={{ borderColor: `${color}30` }}>
      <div className="border-r p-3" style={{ borderColor: `${color}30` }}>
        <div className="mb-2 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="7" fill="hsl(355 65% 50%)" fillOpacity="0.15" />
            <path d="M5 5L9 9M9 5L5 9" stroke="hsl(355 65% 50%)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[10.5px] font-bold uppercase tracking-wide text-foreground/60">{leftTitle}</span>
        </div>
        <CrossList items={leftItems} />
      </div>
      <div className="p-3" style={{ background: `${color}06` }}>
        <div className="mb-2 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="7" fill={color} fillOpacity="0.15" />
            <path d="M4 7L6 9L10 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color }}>{rightTitle}</span>
        </div>
        <CheckList items={rightItems} color={color} />
      </div>
    </div>
  );
}

// ── Fact Box ──────────────────────────────────────────────────────────────────

/** Caixa de fato destacado — para dados, pesquisas e números impactantes */
export function FactBox({
  fact,
  source,
  color = 'hsl(var(--primary))',
  className = '',
}: {
  fact: string;
  source?: string;
  color?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl px-5 py-4 text-center ${className}`} style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
      <svg className="absolute left-2 top-1 opacity-10" width="32" height="32" viewBox="0 0 24 24" fill={color}>
        <path d="M13 9h-2V7h2m0 10h-2v-6h2m-1-9A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z" />
      </svg>
      <p className="font-display text-[1.05rem] font-semibold leading-snug" style={{ color }}>{fact}</p>
      {source && <p className="mt-1.5 text-[10px] text-foreground/50">{source}</p>}
    </div>
  );
}

// ── Section Divider with Title ────────────────────────────────────────────────

/** Divisor de seção com título centralizado */
export function SectionDivider({
  title,
  color = 'hsl(var(--primary))',
  className = '',
}: {
  title: string;
  color?: string;
  className?: string;
}) {
  return (
    <div className={`my-3 flex items-center gap-3 ${className}`}>
      <div className="flex-1 border-t" style={{ borderColor: `${color}30` }} />
      <span className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white" style={{ background: color }}>
        {title}
      </span>
      <div className="flex-1 border-t" style={{ borderColor: `${color}30` }} />
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────

/** Barra de progresso visual */
export function ProgressBar({
  value,
  max = 100,
  label,
  color = 'hsl(var(--primary))',
  showPercent = true,
  className = '',
}: {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  showPercent?: boolean;
  className?: string;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="mb-1 flex items-center justify-between">
          {label && <span className="text-[11.5px] font-medium text-foreground/80">{label}</span>}
          {showPercent && <span className="text-[11px] font-bold" style={{ color }}>{pct}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: `${color}20` }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ── Two Column Layout ─────────────────────────────────────────────────────────

/** Layout de 2 colunas para conteúdo do PDF */
export function TwoColumns({
  left,
  right,
  gap = 'md',
  className = '',
}: {
  left: ReactNode;
  right: ReactNode;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const gapClass = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' }[gap];
  return (
    <div className={`grid grid-cols-2 ${gapClass} ${className}`}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}

// ── Highlight Text ────────────────────────────────────────────────────────────

/** Texto com fundo destacado (como marca-texto) */
export function Highlight({
  children,
  color = 'hsl(var(--primary))',
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <span className="rounded px-1 py-0.5 font-semibold" style={{ background: `${color}20`, color }}>
      {children}
    </span>
  );
}

// ── Timeline ──────────────────────────────────────────────────────────────────

/** Linha do tempo horizontal simples */
export function Timeline({
  items,
  color = 'hsl(var(--primary))',
  className = '',
}: {
  items: { time: string; label: string }[];
  color?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-start justify-between relative ${className}`}>
      <div className="absolute top-3 left-0 right-0 h-px" style={{ background: `${color}30` }} />
      {items.map((item, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 relative z-10">
          <div className="h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: color }}>
            {i + 1}
          </div>
          <span className="text-[10px] font-bold" style={{ color }}>{item.time}</span>
          <span className="text-[10px] text-foreground/70 text-center max-w-[60px]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Decorative Frame ──────────────────────────────────────────────────────────

/** Moldura decorativa com cantos ornamentados */
export function DecorativeFrame({
  children,
  color = 'hsl(var(--primary))',
  className = '',
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  const corner = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M0 0H6V2H2V6H0V0Z" fill={color} fillOpacity="0.5" />
    </svg>
  );
  return (
    <div className={`relative p-4 ${className}`}>
      <div className="absolute top-0 left-0">{corner}</div>
      <div className="absolute top-0 right-0 rotate-90">{corner}</div>
      <div className="absolute bottom-0 right-0 rotate-180">{corner}</div>
      <div className="absolute bottom-0 left-0 -rotate-90">{corner}</div>
      <div className="rounded border px-3 py-2" style={{ borderColor: `${color}20` }}>{children}</div>
    </div>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────

/** Tabela estilizada simples */
export function StyledTable({
  headers,
  rows,
  color = 'hsl(var(--primary))',
  className = '',
}: {
  headers: string[];
  rows: string[][];
  color?: string;
  className?: string;
}) {
  return (
    <table className={`w-full text-[11.5px] overflow-hidden rounded-lg ${className}`} style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: color }}>
          {headers.map((h) => (
            <th key={h} className="px-3 py-2 text-left font-semibold text-white">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? 'white' : `${color}08` }}>
            {row.map((cell, j) => (
              <td key={j} className="px-3 py-1.5 text-foreground/80" style={{ borderBottom: `1px solid ${color}15` }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Spacer ────────────────────────────────────────────────────────────────────

export function Spacer({ size = 'md' }: { size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const h = { xs: 'h-1', sm: 'h-2', md: 'h-4', lg: 'h-6' }[size];
  return <div className={h} aria-hidden />;
}

// ── Cover Overlay Text (para usar sobre imagens) ──────────────────────────────

/** Texto sobreposto a imagem com fundo escuro gradiente */
export function ImageCaption({
  title,
  subtitle,
  position = 'bottom',
  style,
}: {
  title: string;
  subtitle?: string;
  position?: 'top' | 'bottom' | 'center';
  style?: CSSProperties;
}) {
  const posClass = {
    top: 'top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent pt-4 pb-8',
    bottom: 'bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-8 pb-4',
    center: 'inset-0 flex flex-col items-center justify-center bg-black/40',
  }[position];
  return (
    <div className={`absolute px-4 ${posClass}`} style={style}>
      <p className="font-display text-[1rem] font-bold text-white leading-tight">{title}</p>
      {subtitle && <p className="mt-0.5 text-[11px] text-white/80">{subtitle}</p>}
    </div>
  );
}
