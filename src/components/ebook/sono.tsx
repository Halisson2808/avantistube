/**
 * Componentes compartilhados dos ebooks da linha Avó Yuki.
 * Usados pelo manual principal e pelos quatro complementos.
 *
 * Cada produto tem a própria cor. O que fica igual é a tipografia,
 * a estrutura do cartão e a assinatura. A regra está registrada em
 * Workspace Produtos/Ofertas/sono-escala/_Inteligencia/order-bumps.md
 */
import type { ReactNode } from 'react';

export const CREME = 'hsl(39 47% 94%)';
export const AREIA = 'hsl(31 58% 71%)';
export const TERRA = 'hsl(21 66% 49%)';

/**
 * Paleta de cada produto da linha.
 *
 * Atualizada em 3 de setembro de 2026: as cores passaram a ser amostradas das
 * capas geradas, e não o contrário. A capa virou arquivo e é ela que o
 * comprador vê primeiro, então o código segue a arte. Estes valores alimentam a
 * faixa lateral, os títulos e as bolinhas de número das páginas internas, e é
 * isso que faz o miolo combinar com a capa.
 */
export const CORES = {
  /**
   * caderno — produto principal da oferta de saúde ampla.
   * Kakishibu, o papel japonês tingido com tanino de caqui. Sai da paleta da
   * página de vendas em Ofertas/avo-yuki/Site. É deliberadamente quente: o índigo
   * passou a ser a cor do manual do sono, que virou bump.
   */
  caderno: { base: 'hsl(14 80% 25%)', suave: 'hsl(15 55% 38%)', acento: 'hsl(38 70% 58%)' },
  /**
   * menopausa — bump 1 da oferta de saúde. Rosa-vinho apagado, escolhido por
   * eliminação: não é o kakishibu do caderno, não é o índigo do sono, não é a
   * terracota do quarto nem o verde-água do banho.
   */
  menopausa: { base: 'hsl(351 36% 22%)', suave: 'hsl(351 26% 36%)', acento: 'hsl(38 65% 58%)' },
  /**
   * barriga - bump 2. Ameixa escura, roxo de berinjela. Separa do rosa-vinho da
   * menopausa por ser roxo e nao rosa, e nao encosta em nenhuma das outras.
   */
  barriga: { base: 'hsl(316 30% 25%)', suave: 'hsl(316 22% 38%)', acento: 'hsl(38 65% 58%)' },
  /**
   * pontos - bump 4, o degrau piso. Verde-pinho acinzentado. Nao encosta no
   * verde-oliva das ervas (82) por ser azulado, e e o unico frio da linha nova.
   */
  pontos: { base: 'hsl(146 36% 16%)', suave: 'hsl(146 26% 29%)', acento: 'hsl(38 65% 58%)' },
  /**
   * dormir - bump 3, o Dormir Sem Cha. Azul-violeta de noite. Separa do
   * indigo do Manual do Sono (224), que saiu da escada e virou oferta propria,
   * e da ameixa da barriga (292) por ficar entre os dois. Chamava-se noites
   * ate 4 de setembro de 2026, quando o produto foi reescrito e renomeado.
   */
  dormir: { base: 'hsl(251 53% 34%)', suave: 'hsl(251 38% 47%)', acento: 'hsl(38 65% 58%)' },
  manual: { base: 'hsl(224 39% 22%)', suave: 'hsl(224 30% 34%)', acento: 'hsl(21 66% 49%)' },
  banho: { base: 'hsl(188 44% 22%)', suave: 'hsl(188 33% 33%)', acento: 'hsl(31 58% 60%)' },
  turno: { base: 'hsl(220 13% 20%)', suave: 'hsl(220 10% 31%)', acento: 'hsl(38 72% 55%)' },
  ervas: { base: 'hsl(82 26% 24%)', suave: 'hsl(82 19% 34%)', acento: 'hsl(31 58% 60%)' },
  quarto: { base: 'hsl(18 45% 40%)', suave: 'hsl(18 34% 50%)', acento: 'hsl(39 47% 82%)' },
} as const;

export type Cor = { base: string; suave: string; acento: string };

export const faixaDe = (c: Cor) => `linear-gradient(to bottom, ${c.base}, ${c.suave}, ${c.acento})`;

/** Tigela de chá com vapor — símbolo da linha. */
export function Tigela({ size = 44, color = CREME }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <path d="M14 30h36v6a18 18 0 0 1-18 18 18 18 0 0 1-18-18v-6Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M50 33h4a5 5 0 0 1 0 10h-2" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M26 22c0-4 3-4 3-8s-3-4-3-4" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <path d="M36 22c0-4 3-4 3-8s-3-4-3-4" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

/** Capa padrão da linha. */
export function Capa({
  cor, marca = 'Avó Yuki', titulo, subtitulo, rodape,
}: { cor: Cor; marca?: string; titulo: ReactNode; subtitulo: string; rodape: string }) {
  return (
    <>
      <div className="absolute inset-6 rounded-lg border" style={{ borderColor: `${cor.acento}40` }} />
      <div className="absolute left-0 right-0 text-center" style={{ top: '15%' }}>
        <p className="text-[11px] font-bold uppercase tracking-[0.34em]" style={{ color: cor.acento }}>{marca}</p>
      </div>
      <div className="absolute text-center" style={{ top: '26%', left: '10%', right: '10%' }}>
        <h1 className="font-display font-bold leading-[1.08] tracking-tight text-[2.9rem]" style={{ color: CREME }}>{titulo}</h1>
      </div>
      <div className="absolute left-0 right-0 flex justify-center" style={{ top: '52%' }}>
        <Tigela size={56} color={cor.acento} />
      </div>
      <div className="absolute text-center" style={{ top: '63%', left: '14%', right: '14%' }}>
        <div className="mx-auto mb-4 h-px w-16" style={{ background: `${cor.acento}80` }} />
        <p className="text-[14px] font-medium leading-relaxed" style={{ color: 'hsl(39 30% 86%)' }}>{subtitulo}</p>
      </div>
      <div className="absolute left-0 right-0 text-center" style={{ bottom: '9%' }}>
        <p className="text-[10.5px] uppercase tracking-[0.2em]" style={{ color: `${cor.acento}B0` }}>{rodape}</p>
      </div>
    </>
  );
}

/** Cartão de receita ou de preparo. */
export function Item({
  cor, numero, nome, etiquetaEsq = 'Você precisa de', lista, etiquetaDir = 'Como faz',
  texto, porque, atencao,
}: {
  cor: Cor; numero: number; nome: string; etiquetaEsq?: string; lista: string[];
  etiquetaDir?: string; texto: string; porque: string; atencao?: string;
}) {
  return (
    <div className="avoid-page-break mb-3.5 rounded-xl border bg-white/95 p-3.5 shadow-sm" style={{ borderColor: `${cor.base}24` }}>
      <div className="flex items-baseline gap-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: cor.base }}>{numero}</span>
        <h4 className="font-display text-[1.02rem] font-semibold leading-snug" style={{ color: cor.base }}>{nome}</h4>
      </div>
      <div className="mt-2.5 grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3">
        <div>
          <span className="text-[9.5px] font-bold uppercase tracking-[0.14em]" style={{ color: cor.acento }}>{etiquetaEsq}</span>
          <ul className="mt-1 space-y-0.5">
            {lista.map((i) => (
              <li key={i} className="text-[11.5px] leading-snug text-foreground/85"><span style={{ color: AREIA }}>—</span> {i}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className="text-[9.5px] font-bold uppercase tracking-[0.14em]" style={{ color: cor.acento }}>{etiquetaDir}</span>
          <p className="mt-1 text-[11.5px] leading-snug text-foreground/90">{texto}</p>
        </div>
      </div>
      <div className="mt-2.5 rounded-lg px-2.5 py-1.5" style={{ background: `${cor.base}0E` }}>
        <span className="text-[9.5px] font-bold uppercase tracking-[0.14em]" style={{ color: cor.base }}>Por que funciona</span>
        <p className="mt-0.5 text-[11.5px] leading-snug text-foreground/88">{porque}</p>
      </div>
      {atencao && (
        <div className="mt-1.5 rounded-lg border-l-[3px] px-2.5 py-1.5" style={{ borderColor: TERRA, background: 'hsl(21 66% 49% / 0.07)' }}>
          <span className="text-[9.5px] font-bold uppercase tracking-[0.14em]" style={{ color: TERRA }}>Atenção</span>
          <p className="mt-0.5 text-[11.5px] leading-snug text-foreground/88">{atencao}</p>
        </div>
      )}
    </div>
  );
}

export function Titulo({ cor, children }: { cor: Cor; children: ReactNode }) {
  return <h3 className="mb-2 mt-1 font-display text-[1.15rem] font-semibold tracking-tight first:mt-0" style={{ color: cor.base }}>{children}</h3>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mb-2.5 text-[13px] leading-relaxed text-foreground/90">{children}</p>;
}

/** Assinatura de encerramento. */
export function Assinatura({ cor, frase }: { cor: Cor; frase: string }) {
  return (
    <div className="mt-auto text-center">
      <div className="mx-auto mb-3 flex justify-center"><Tigela size={38} color={cor.base} /></div>
      <p className="font-display text-[1.1rem] font-semibold" style={{ color: cor.base }}>{frase}</p>
      <p className="mt-1 text-[12px] uppercase tracking-[0.2em]" style={{ color: cor.acento }}>Avó Yuki</p>
    </div>
  );
}
