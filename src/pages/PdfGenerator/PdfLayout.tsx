import { Download, ChevronRight, ArrowLeft, Menu, X } from 'lucide-react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { useEffect, useState, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

type PdfRoute = {
  slug: string;
  label: string;
  filename: string;
};

type Category = {
  name: string;
  routes: PdfRoute[];
};

const CATEGORIES: Category[] = [
  {
    name: 'Avó Yuki · Saúde',
    routes: [
      { slug: 'caderno',   label: 'O Caderno da Avó Yuki',   filename: 'O-Caderno-da-Avo-Yuki' },
      { slug: 'menopausa', label: 'Bump 1 · Menopausa',      filename: 'A-Menopausa-Sem-Sufoco' },
      { slug: 'barriga',   label: 'Bump 2 · Barriga',        filename: 'O-Protocolo-da-Barriga' },
      { slug: 'dormir-sem-cha', label: 'Bump 3 · Dormir Sem Chá', filename: 'Dormir-Sem-Cha' },
      { slug: 'pontos',    label: 'Bump 4 · Pontos',         filename: 'Alivio-Sem-Tomar-Nada' },
    ],
  },
  {
    name: 'Kim · Pele Coreana',
    routes: [
      { slug: 'pele-coreana', label: 'Manual da Pele Coreana', filename: 'Manual-da-Pele-Coreana' },
    ],
  },
  {
    name: 'Sono',
    routes: [
      { slug: 'ebook-sono',  label: 'Manual do Sono Caseiro', filename: 'Manual-do-Sono-Caseiro-Avo-Yuki' },
      { slug: 'sono-banho',  label: 'Bump 1 · Banho Japonês',  filename: 'Protocolo-do-Banho-Japones' },
      { slug: 'sono-turno',  label: 'Bump 2 · Turno Noturno',  filename: 'Manual-do-Turno-Noturno' },
      { slug: 'sono-ervas',  label: 'Bump 3 · 12 Ervas Fortes', filename: 'As-12-Ervas-Fortes' },
      { slug: 'sono-quarto', label: 'Bump 4 · O Quarto',       filename: 'O-Quarto-Que-Faz-Dormir' },
    ],
  },
  {
    name: 'Saúde',
    routes: [
      { slug: 'ebook-dezesseis', label: 'Protocolo Garganta Limpia', filename: 'Protocolo-Garganta-Limpia' },
    ],
  },
  {
    name: 'Estética',
    routes: [
      // Principal
      { slug: 'ebook-dezessete', label: 'Pele Coreana 50+', filename: 'Metodo-Pele-Coreana-50-Plus' },
      // Order bumps
      { slug: 'ebook-dezoito', label: 'Raiz Forte 50+',          filename: 'Metodo-Raiz-Forte-50-Plus' },
      { slug: 'ebook-oito',    label: 'Anti-Rugas 50+',       filename: 'Guia-Anti-Rugas' },
      { slug: 'ebook-nove',    label: 'Beleza de Dentro 50+', filename: 'Alimentacao-para-Pele-Bonita' },
      // A descartar deste funil
      { slug: 'ebook-um',   label: 'Guia Anti-Acne',         filename: 'Guia-Anti-Acne' },
      { slug: 'ebook-dez',  label: 'Pele Oleosa — Produtos', filename: 'Pele-Oleosa-Lista-de-Produtos' },
    ],
  },
  {
    name: 'Alquimia',
    routes: [
      { slug: 'ebook-treze',    label: 'The Collapse Code',        filename: 'The-Collapse-Code' },
    ],
  },
  {
    name: 'Monge',
    routes: [
      { slug: 'ebook-quatorze', label: 'El Código Oculto de Tu Hogar',        filename: 'El-Codigo-Oculto-de-Tu-Hogar' },
      { slug: 'ebook-quince',   label: 'Las 7 Activaciones del Monje', filename: 'Las-7-Activaciones-del-Monje' },
    ],
  },
  {
    name: 'Sucos & Detox',
    routes: [
      { slug: 'ebook-doze',   label: 'Protocolo Alfa — Testosterona', filename: 'Protocolo-Alfa-Testosterona' },
      { slug: 'ebook-onze',   label: 'Protocolo Detox Masc.',  filename: 'Protocolo-Detox-Masculino' },
      { slug: 'ebook-tres',   label: 'Programa Detox Natural', filename: 'Programa-Detox-Natural' },
      { slug: 'ebook-quatro', label: 'Sucos para Mulheres',    filename: 'Sucos-para-Mulheres' },
      { slug: 'ebook-cinco',  label: 'Sucos para Homens',      filename: 'Sucos-para-Homens' },
      { slug: 'ebook-sete',   label: 'Sucos Anti-Idade',       filename: 'Sucos-Anti-Idade' },
      { slug: 'ebook-seis',   label: 'Sucos para Crianças',    filename: 'Sucos-para-Criancas' },
      { slug: 'ebook-dois',   label: 'Imunidade & Sono',       filename: 'Sucos-Imunidade-e-Sono' },
    ],
  },
];

// Páginas de apoio — não são PDFs, não entram no fluxo de download.
const DOCS: Category[] = [
  {
    name: 'Descrições',
    routes: [
      { slug: 'descricoes', label: 'Estética', filename: 'Descricoes-Estetica' },
    ],
  },
];

const ALL_GROUPS = [...DOCS, ...CATEGORIES];

const filenameMap: Record<string, string> = Object.fromEntries(
  CATEGORIES.flatMap((c) => c.routes.map((r) => [r.slug, r.filename])),
);

function categoryOfSlug(slug: string): string | undefined {
  return ALL_GROUPS.find((c) => c.routes.some((r) => r.slug === slug))?.name;
}

export default function PdfLayout() {
  const location = useLocation();
  const currentSlug = location.pathname.split('/').pop() ?? '';
  const activeCategory = categoryOfSlug(currentSlug);
  const isPdfRoute = currentSlug in filenameMap;
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);

  // Encaixa a largura A4 na tela pequena sem alterar o PDF impresso.
  useEffect(() => {
    const updatePreviewScale = () => {
      const a4WidthInPixels = (210 * 96) / 25.4;
      const availableWidth = window.innerWidth - 16;
      setPreviewScale(window.innerWidth < 768 ? Math.min(1, availableWidth / a4WidthInPixels) : 1);
    };

    updatePreviewScale();
    window.addEventListener('resize', updatePreviewScale);
    return () => window.removeEventListener('resize', updatePreviewScale);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleDownload = () => {
    const prevTitle = document.title;
    document.title = filenameMap[currentSlug] ?? currentSlug;
    window.print();
    document.title = prevTitle;
  };

  return (
    <div className="pdf-scope flex min-h-screen print:block">
      {/* Barra móvel: as opções ficam disponíveis sem ocupar a prévia. */}
      <header className="no-print fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-white/95 px-3 shadow-sm backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-foreground shadow-sm"
          aria-label="Abrir opções de ebook"
        >
          <Menu className="h-4 w-4" />
          Opções de ebook
        </button>
        {isPdfRoute && (
          <button
            type="button"
            onClick={handleDownload}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm"
            aria-label="Baixar PDF"
          >
            <Download className="h-4 w-4" />
          </button>
        )}
      </header>

      {menuOpen && (
        <button
          type="button"
          className="no-print fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Fechar opções de ebook"
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className={cn(
        'no-print fixed left-0 top-0 z-50 flex h-screen w-[min(20rem,88vw)] flex-col border-r border-border bg-white shadow-xl transition-transform duration-200 md:z-40 md:w-56 md:translate-x-0 md:shadow-sm',
        menuOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        <div className="border-b border-border px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <NavLink
                to="/"
                className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3 w-3" />
                Avantis Studio
              </NavLink>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Gerador de Ebook
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
              aria-label="Fechar opções"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {ALL_GROUPS.map((cat, groupIndex) => {
            const hasActive = cat.name === activeCategory;
            return (
              <div key={cat.name}>
                <div
                  className={cn(
                    'flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors',
                    hasActive
                      ? 'bg-primary/5 text-primary'
                      : 'text-muted-foreground/60',
                  )}
                >
                  <span className="flex-1 text-left">{cat.name}</span>
                  <span className="text-[10px] font-semibold tracking-normal opacity-50">
                    {cat.routes.length}
                  </span>
                </div>

                <div className="mt-0.5 space-y-0.5 pb-1">
                  {cat.routes.map(({ slug, label }) => (
                    <NavLink
                      key={slug}
                      to={`/pdf/${slug}`}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-1.5 rounded-md py-2 pl-4 pr-2 text-[13px] font-medium transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground/70 hover:bg-muted hover:text-foreground',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <ChevronRight
                            className={cn('h-3 w-3 shrink-0 transition-transform', isActive ? 'opacity-100' : 'opacity-0')}
                          />
                          {label}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>

                {groupIndex === DOCS.length - 1 && (
                  <div className="my-2 border-t border-border" />
                )}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <button
            type="button"
            disabled={!isPdfRoute}
            onClick={handleDownload}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all',
              isPdfRoute
                ? 'bg-gradient-to-r from-primary to-[hsl(350_58%_50%)] text-primary-foreground shadow-md shadow-primary/20 hover:brightness-105'
                : 'cursor-not-allowed bg-muted text-muted-foreground/60',
            )}
          >
            <Download className="h-4 w-4" />
            Baixar PDF
          </button>
        </div>
      </aside>

      {/* ── Conteúdo ────────────────────────────────────────────────── */}
      <main
        className="ml-0 flex-1 overflow-x-hidden bg-gradient-to-b from-[hsl(28_42%_97%)] via-muted to-[hsl(345_35%_96%)] px-2 pb-8 pt-[4.5rem] md:ml-56 md:px-0 md:py-10 print:ml-0 print:bg-white print:p-0"
        style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
      >
        <div
          id="pdf-content"
          className={cn(
            'mx-auto flex flex-col gap-8 print:gap-0',
            isPdfRoute ? 'w-[210mm]' : 'w-full max-w-4xl px-2 md:px-0',
          )}
          style={isPdfRoute ? ({ zoom: previewScale } as CSSProperties) : undefined}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
