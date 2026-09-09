/**
 * DesignPage — Canvas livre A4 para layouts de poster/magazine
 *
 * Diferente do PdfContentPage, não tem padding interno fixo nem estrutura vertical forçada.
 * Você posiciona os elementos livremente usando CSS Grid, Flexbox ou position: absolute.
 *
 * Uso:
 *   <DesignPage bg="#0a1a0a">
 *     <div className="absolute top-8 left-8">Título</div>
 *     <div className="absolute inset-0 flex ...">Layout livre</div>
 *   </DesignPage>
 */
import type { CSSProperties, ReactNode } from 'react';
import { PageOverflowWarning, usePageOverflowGuard } from './pageGuard';

interface DesignPageProps {
  /** Cor ou gradiente de fundo. Padrão: branco */
  bg?: string;
  /** Conteúdo posicionado livremente */
  children: ReactNode;
  /** Classes Tailwind extras no container */
  className?: string;
  /** Estilos inline extras */
  style?: CSSProperties;
}

export function DesignPage({ bg = 'white', children, className = '', style }: DesignPageProps) {
  const [contentRef, overflow] = usePageOverflowGuard(import.meta.env.DEV);
  return (
    <section
      data-pdf-page
      className={`relative h-[297mm] w-full overflow-hidden page-break-after print:shadow-none ${className}`}
      style={{ background: bg, ...style }}
    >
      <div ref={contentRef} className="absolute inset-0 overflow-hidden">{children}</div>
      <PageOverflowWarning overflow={overflow} />
    </section>
  );
}

/**
 * Bloco de texto posicionado absolutamente na DesignPage.
 * Use top/left/right/bottom em porcentagem ou px.
 */
interface AbsBlockProps {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  width?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  zIndex?: number;
}

export function AbsBlock({
  top, left, right, bottom, width, children, className = '', style, zIndex,
}: AbsBlockProps) {
  return (
    <div
      className={`absolute ${className}`}
      style={{ top, left, right, bottom, width, zIndex, ...style }}
    >
      {children}
    </div>
  );
}
