/* eslint-disable react-refresh/only-export-components -- hook and warning are one guard API */
import { useEffect, useRef, useState, type RefObject } from 'react';

export function usePageOverflowGuard(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(0);

  useEffect(() => {
    if (!active) return;
    const content = ref.current;
    if (!content) return;

    const measure = () => {
      const page = content.closest<HTMLElement>('section[data-pdf-page]');
      if (!page) return;
      const pageBottom = page.getBoundingClientRect().bottom;
      const contentBottom = content.getBoundingClientRect().bottom;
      const scrollOverflow = Math.max(0, content.scrollHeight - content.clientHeight);
      setOverflow(Math.max(0, Math.round(contentBottom - pageBottom), Math.round(scrollOverflow)));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    Array.from(content.children).forEach((child) => observer.observe(child));
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener('load', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('load', measure);
    };
  }, [active]);

  return [ref, overflow] as const;
}

export function PageOverflowWarning({ overflow, pageNumber }: { overflow: number; pageNumber?: number }) {
  if (overflow <= 0) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-50 print:hidden" aria-hidden>
      <div className="absolute inset-0 border-4 border-red-500/70" />
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-red-500/25" />
      <div className="absolute bottom-2 right-3 rounded bg-red-600 px-2 py-1 text-[11px] font-bold text-white shadow">
        Conteúdo cortado{pageNumber !== undefined ? ` na página ${pageNumber}` : ''}: sobram {overflow}px
      </div>
    </div>
  );
}

export type PageGuardRef = RefObject<HTMLDivElement>;
