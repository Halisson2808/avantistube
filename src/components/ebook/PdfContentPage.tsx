import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { PageOverflowWarning, usePageOverflowGuard } from './pageGuard';

/**
 * Detector de conteúdo cortado.
 *
 * A página é A4 de altura fixa com overflow-hidden, então conteúdo que passa do
 * fim é simplesmente cortado, sem erro, sem aviso e sem barra de rolagem. O PDF
 * sai com metade de um cartão e ninguém percebe até abrir o arquivo.
 *
 * Este hook mede a borda inferior dos filhos contra a do container e devolve
 * quantos pixels sobraram. Só roda em desenvolvimento: nada disso vai para a
 * build de produção nem para a impressão.
 */
type PdfContentPageProps = {
  /** Título do capítulo / módulo */
  title?: string;
  /** Linha abaixo do título (ex.: resumo do módulo) */
  subtitle?: string;
  /** Número ou rótulo curto (ex.: "Módulo 1") */
  kicker?: string;
  children: ReactNode;
  className?: string;
  /** Gradiente CSS da faixa lateral esquerda. Padrão: coral-rosa do Anti-Acne. */
  accentGradient?: string;
  /** Número impresso no rodapé. Omitido = sem numeração. */
  pageNumber?: number;
  /** Cor do número de página. */
  pageNumberColor?: string;
};

/**
 * Página A4 interna do ebook — fundo papel, faixa coral–rosa e tipografia alinhada à capa.
 * Use uma instância por página de conteúdo (cada uma com `page-break-after`).
 */
export function PdfContentPage({ title, subtitle, kicker, children, className, accentGradient, pageNumber, pageNumberColor }: PdfContentPageProps) {
  const defaultGradient = 'linear-gradient(to bottom, hsl(14 82% 56%), hsl(350 58% 52%), hsl(330 45% 48%))';
  const [corteRef, sobra] = usePageOverflowGuard(import.meta.env.DEV);
  return (
    <section
      data-pdf-page
      className={cn(
        'relative flex h-[297mm] flex-col overflow-hidden bg-[hsl(var(--ebook-paper))] text-foreground shadow-xl page-break-after print:shadow-none',
        className,
      )}
    >
      <div
        className="absolute left-0 top-0 h-full w-[10px]"
        style={{ background: accentGradient ?? defaultGradient }}
        aria-hidden
      />
      <div className="flex flex-1 flex-col pl-12 pr-14 pt-12">
        {(kicker || title) && (
          <header className="mb-6 border-b border-primary/15 pb-5">
            {kicker && (
              <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                {kicker}
              </p>
            )}
            {title && (
              <h2 className="font-display text-[1.65rem] font-semibold leading-tight tracking-tight text-[hsl(340_28%_22%)] sm:text-3xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-3 max-w-prose font-sans text-sm font-medium leading-relaxed text-muted-foreground">
                {subtitle}
              </p>
            )}
          </header>
        )}
        <div
          ref={corteRef}
          className="prose-ebook flex flex-1 flex-col font-sans text-[15px] leading-relaxed text-foreground/95"
        >
          {children}
        </div>
        {pageNumber !== undefined && (
          <div className="pb-7 pt-4 text-center">
            <span
              className="text-[10.5px] font-semibold tracking-[0.18em]"
              style={{ color: pageNumberColor ?? 'hsl(var(--primary))', opacity: 0.55 }}
            >
              {pageNumber}
            </span>
          </div>
        )}
      </div>

      {/* Aviso de corte. Só em desenvolvimento, nunca na impressão nem na build. */}
      <PageOverflowWarning overflow={sobra} pageNumber={pageNumber} />
    </section>
  );
}
