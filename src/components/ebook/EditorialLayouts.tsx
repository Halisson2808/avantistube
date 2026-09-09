import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { PageOverflowWarning, usePageOverflowGuard } from './pageGuard';

export interface EditorialImageSpec {
  src: string;
  alt: string;
  objectPosition?: CSSProperties['objectPosition'];
  className?: string;
}

export interface EditorialPageProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  kicker?: string;
  pageNumber?: number;
  accent?: string;
  background?: string;
  className?: string;
  contentClassName?: string;
}

function EditorialImage({ image, className }: { image: EditorialImageSpec; className?: string }) {
  return (
    <img
      src={image.src}
      alt={image.alt}
      className={cn('block h-full w-full object-cover', image.className, className)}
      style={{ objectPosition: image.objectPosition ?? 'center' }}
    />
  );
}

export function EditorialPage({
  children, title, subtitle, kicker, pageNumber, accent = 'hsl(var(--primary))',
  background = 'hsl(var(--ebook-paper))', className, contentClassName,
}: EditorialPageProps) {
  const [contentRef, overflow] = usePageOverflowGuard(import.meta.env.DEV);
  return (
    <section
      data-pdf-page
      className={cn('relative flex h-[297mm] w-full flex-col overflow-hidden text-foreground shadow-xl page-break-after print:shadow-none', className)}
      style={{ background }}
    >
      <div className="absolute inset-y-0 left-0 w-[10px]" style={{ background: accent }} aria-hidden />
      <div ref={contentRef} className={cn('flex min-h-0 flex-1 flex-col overflow-hidden py-11 pl-12 pr-12', contentClassName)}>
        {(kicker || title || subtitle) && (
          <header className="mb-6 shrink-0 border-b pb-5" style={{ borderColor: `${accent}26` }}>
            {kicker && <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em]" style={{ color: accent }}>{kicker}</p>}
            {title && <h2 className="font-display text-[1.85rem] font-semibold leading-tight tracking-tight">{title}</h2>}
            {subtitle && <p className="mt-3 max-w-prose text-sm leading-relaxed text-foreground/65">{subtitle}</p>}
          </header>
        )}
        <div className="prose-ebook flex min-h-0 flex-1 flex-col">{children}</div>
        {pageNumber !== undefined && <span className="shrink-0 pt-4 text-center text-[10px] font-bold tracking-[0.18em] opacity-50">{pageNumber}</span>}
      </div>
      <PageOverflowWarning overflow={overflow} pageNumber={pageNumber} />
    </section>
  );
}

export function TextPortraitPage({ image, imageSide = 'right', children, ...page }: EditorialPageProps & { image: EditorialImageSpec; imageSide?: 'left' | 'right' }) {
  return (
    <EditorialPage {...page}>
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_36%] gap-7">
        <div className={cn('min-w-0', imageSide === 'left' && 'col-start-2')}>{children}</div>
        <div className={cn('h-[178mm] self-center overflow-hidden rounded-[24px] border border-black/10 shadow-sm', imageSide === 'left' && 'col-start-1 row-start-1')}>
          <EditorialImage image={image} />
        </div>
      </div>
    </EditorialPage>
  );
}

export function SplitEditorialPage({ image, imageSide = 'left', children, ...page }: EditorialPageProps & { image: EditorialImageSpec; imageSide?: 'left' | 'right' }) {
  return (
    <EditorialPage {...page} contentClassName="py-0 pl-[10px] pr-0">
      <div className="grid min-h-0 flex-1 grid-cols-2">
        <div className={cn('overflow-hidden', imageSide === 'right' && 'col-start-2')}><EditorialImage image={image} /></div>
        <div className={cn('flex min-w-0 flex-col justify-center px-10 py-12', imageSide === 'right' && 'col-start-1 row-start-1')}>{children}</div>
      </div>
    </EditorialPage>
  );
}

export function HeroEditorialPage({ image, position = 'top', size = 'medium', children, ...page }: EditorialPageProps & { image: EditorialImageSpec; position?: 'top' | 'bottom'; size?: 'medium' | 'large' }) {
  const height = size === 'large' ? 'h-[116mm]' : 'h-[78mm]';
  const hero = <div className={cn('shrink-0 overflow-hidden rounded-2xl border border-black/10', height)}><EditorialImage image={image} /></div>;
  return (
    <EditorialPage {...page}>
      <div className="flex min-h-0 flex-1 flex-col gap-7">
        {position === 'top' && hero}
        <div className="min-h-0 flex-1">{children}</div>
        {position === 'bottom' && hero}
      </div>
    </EditorialPage>
  );
}

export function FloatingImagePage({ image, corner = 'top-right', children, ...page }: EditorialPageProps & { image: EditorialImageSpec; corner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const align = corner.endsWith('right') ? 'self-end' : 'self-start';
  const order = corner.startsWith('bottom') ? 'order-last mt-auto' : 'mb-5';
  return (
    <EditorialPage {...page}>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className={cn('h-[58mm] w-[58mm] shrink-0 overflow-hidden rounded-2xl border-4 border-white shadow-lg', align, order)}><EditorialImage image={image} /></div>
        <div>{children}</div>
      </div>
    </EditorialPage>
  );
}

export function InlineImagePage({ image, shape = 'square', before, after, ...page }: Omit<EditorialPageProps, 'children'> & { image: EditorialImageSpec; shape?: 'square' | 'portrait'; before: ReactNode; after: ReactNode }) {
  return (
    <EditorialPage {...page}>
      <div>{before}</div>
      <div className={cn('my-6 shrink-0 overflow-hidden rounded-2xl border border-black/10', shape === 'square' ? 'h-[67mm] w-[67mm]' : 'h-[82mm] w-[58mm]')}><EditorialImage image={image} /></div>
      <div>{after}</div>
    </EditorialPage>
  );
}

export function BackgroundInsightPage({ image, children, overlay = 'rgba(20, 15, 20, 0.62)', ...page }: EditorialPageProps & { image: EditorialImageSpec; overlay?: string }) {
  return (
    <EditorialPage {...page} className={cn('text-white', page.className)} contentClassName="relative justify-center py-16 pl-16 pr-14">
      <EditorialImage image={image} className="absolute inset-0" />
      <div className="absolute inset-0" style={{ background: overlay }} />
      <div className="relative z-10 rounded-3xl border border-white/25 bg-black/20 p-10 backdrop-blur-[2px]">{children}</div>
    </EditorialPage>
  );
}

export function ChapterOpenerPage({ image, children, ...page }: EditorialPageProps & { image: EditorialImageSpec }) {
  return (
    <EditorialPage {...page} className={cn('text-white', page.className)} contentClassName="relative justify-end py-16 pl-16 pr-14">
      <EditorialImage image={image} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />
      <div className="relative z-10 max-w-[82%]">{children}</div>
    </EditorialPage>
  );
}

export function IllustratedContentPage({ illustration, children, placement = 'top-right', ...page }: EditorialPageProps & { illustration: EditorialImageSpec; placement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  return (
    <EditorialPage {...page}>
      <div className="grid min-h-0 flex-1 grid-cols-[1fr_110px] gap-5">
        <div className={cn(placement.endsWith('left') && 'col-start-2')}>{children}</div>
        <div className={cn('h-[110px] overflow-hidden rounded-2xl bg-white p-2 shadow-sm', placement.endsWith('left') && 'col-start-1 row-start-1', placement.startsWith('bottom') && 'self-end')}>
          <EditorialImage image={illustration} className="object-contain" />
        </div>
      </div>
    </EditorialPage>
  );
}

export function VisualBreatherPage({ image, caption, ...page }: Omit<EditorialPageProps, 'children'> & { image: EditorialImageSpec; caption?: ReactNode }) {
  return (
    <EditorialPage {...page} className={cn('text-white', page.className)} contentClassName="relative py-0 pl-[10px] pr-0">
      <EditorialImage image={image} className="absolute inset-0" />
      {caption && <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-14 pb-14 pt-28">{caption}</div>}
    </EditorialPage>
  );
}
