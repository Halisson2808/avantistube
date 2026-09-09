import { Download, ChevronRight, ChevronDown, ArrowLeft } from 'lucide-react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
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

  // Apenas o nicho em que você está trabalhando fica aberto.
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    activeCategory ? { [activeCategory]: true } : {},
  );

  // Ao navegar para outro nicho, abre o nicho de destino.
  useEffect(() => {
    if (activeCategory) setExpanded((prev) => ({ ...prev, [activeCategory]: true }));
  }, [activeCategory]);

  const toggle = (name: string) =>
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));

  const handleDownload = () => {
    const prevTitle = document.title;
    document.title = filenameMap[currentSlug] ?? currentSlug;
    window.print();
    document.title = prevTitle;
  };

  return (
    <div className="pdf-scope flex min-h-screen print:block">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="no-print fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-border bg-white shadow-sm">
        <div className="border-b border-border px-4 py-4">
          <NavLink
            to="/"
            className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            Avantis Studio
          </NavLink>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Gerador de PDF
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {ALL_GROUPS.map((cat, groupIndex) => {
            const isOpen = expanded[cat.name] ?? false;
            const hasActive = cat.name === activeCategory;
            return (
              <div key={cat.name}>
                <button
                  type="button"
                  onClick={() => toggle(cat.name)}
                  className={cn(
                    'flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors',
                    hasActive
                      ? 'text-primary hover:bg-primary/5'
                      : 'text-muted-foreground/60 hover:bg-muted hover:text-foreground/70',
                  )}
                >
                  {isOpen ? (
                    <ChevronDown className="h-3 w-3 shrink-0" />
                  ) : (
                    <ChevronRight className="h-3 w-3 shrink-0" />
                  )}
                  <span className="flex-1 text-left">{cat.name}</span>
                  <span className="text-[10px] font-semibold tracking-normal opacity-50">
                    {cat.routes.length}
                  </span>
                </button>

                {isOpen && (
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
                )}

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
      <main className="ml-56 flex-1 bg-gradient-to-b from-[hsl(28_42%_97%)] via-muted to-[hsl(345_35%_96%)] py-10 print:ml-0 print:bg-white print:py-0">
        <div
          id="pdf-content"
          className="mx-auto flex w-[210mm] flex-col gap-8 print:gap-0"
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
