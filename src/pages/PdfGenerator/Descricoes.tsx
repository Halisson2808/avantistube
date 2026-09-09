/**
 * Descrições — Rota: /pdf/descricoes
 * Textos internos para cadastro de produto na Hotmart (não são vistos pelo cliente).
 * Cada descrição tem no mínimo 200 caracteres.
 */
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

type Status = 'principal' | 'bump' | 'descartar';

type Descricao = {
  produto: string;
  status: Status;
  texto: string;
};

const STATUS_LABEL: Record<Status, { label: string; bg: string; color: string; border: string }> = {
  principal:  { label: 'Produto principal', bg: 'hsl(340 48% 95%)', color: 'hsl(340 58% 38%)', border: 'hsl(340 42% 82%)' },
  bump:       { label: 'Order bump',        bg: 'hsl(95 32% 94%)',  color: 'hsl(95 34% 30%)',  border: 'hsl(95 26% 76%)' },
  descartar:  { label: 'A descartar',       bg: 'hsl(0 0% 95%)',    color: 'hsl(0 0% 40%)',    border: 'hsl(0 0% 82%)' },
};

const ESTETICA: Descricao[] = [
  {
    produto: 'O Método da Pele Coreana — Para Mulheres 50+',
    status: 'principal',
    texto:
      'Ebook digital em PDF sobre cuidados naturais com a pele do rosto para mulheres acima de 50 anos, ' +
      'baseado nos rituais da tradição coreana de beleza. Reúne 31 receitas caseiras de limpeza, tônicos, ' +
      'máscaras, séruns e óleos preparados com ingredientes comuns de cozinha, além de 8 rotinas completas ' +
      'organizadas por tipo de pele, calendário de máscaras de 12 semanas, diário de acompanhamento e 7 bônus. ' +
      'Material informativo da área de estética, beleza e autocuidado feminino.',
  },
  {
    produto: 'O Método Raiz Forte — Cabelo e Unhas Para Mulheres 50+',
    status: 'bump',
    texto:
      'Ebook digital em PDF sobre fortalecimento natural de cabelo e unhas para mulheres acima de 50 anos. ' +
      'Explica as mudanças hormonais que afinam o fio e enfraquecem a unha após a menopausa e apresenta 30 ' +
      'receitas e rituais caseiros, incluindo óleos capilares, tônicos, máscaras de nutrição, massagem de couro ' +
      'cabeludo e banhos de fortalecimento das unhas. Traz ainda 6 rotinas prontas por tipo, calendário de 12 ' +
      'semanas, diário de 8 semanas e 6 bônus. Material da área de estética, beleza e autocuidado feminino.',
  },
  {
    produto: 'O Guia Anti-Rugas — Para Mulheres 50+',
    status: 'bump',
    texto:
      'Ebook digital em PDF sobre prevenção e tratamento de rugas e sinais de envelhecimento facial. Aborda o ' +
      'mecanismo biológico do envelhecimento da pele, os quatro tipos de ruga e o tratamento indicado para cada ' +
      'um, os ativos cosméticos com respaldo científico como vitamina C, retinol, ácido hialurônico, niacinamida ' +
      'e peptídeos, além de protocolo completo de rotina de manhã e de noite, cuidados específicos por região do ' +
      'rosto e orientação informativa sobre procedimentos estéticos. Conteúdo da área de estética e dermocosmética.',
  },
  {
    produto: 'Beleza de Dentro — Alimentação Para a Pele 50+',
    status: 'bump',
    texto:
      'Ebook digital em PDF sobre nutrição aplicada à saúde e à aparência da pele. Explica a conexão entre o ' +
      'intestino e a pele, os nutrientes essenciais para a produção de colágeno, os alimentos que melhoram a ' +
      'condição da pele e os que pioram o quadro inflamatório, como montar o prato ideal no dia a dia, o papel ' +
      'dos suplementos mais estudados e um protocolo prático de 30 dias com o que esperar semana a semana. ' +
      'Material informativo das áreas de nutrição, bem-estar e estética.',
  },
  {
    produto: 'Guia Anti-Acne',
    status: 'descartar',
    texto:
      'Ebook digital em PDF sobre tratamento da acne e cuidados com pele acneica. Explica o mecanismo de formação ' +
      'da acne e os quatro fatores que a causam, os diferentes tipos de lesão, o protocolo completo de rotina ' +
      'diária de manhã e de noite, os ativos com evidência científica, o tratamento das manchas e cicatrizes ' +
      'pós-acne, os hábitos que sabotam o resultado e os fatores ambientais que agravam o quadro. Conteúdo ' +
      'informativo da área de estética, dermocosmética e cuidados com a pele.',
  },
  {
    produto: 'Pele Oleosa — Lista de Produtos Essenciais',
    status: 'descartar',
    texto:
      'Ebook digital em PDF com guia de produtos essenciais de skincare voltado para pele oleosa. Organiza os ' +
      'cosméticos em três categorias, sendo indispensáveis, potencializadores e especializados, explicando para ' +
      'que serve cada produto, o que procurar na formulação ao comprar, com que frequência utilizar e quais itens ' +
      'vendidos pela indústria podem ser dispensados sem prejuízo para a rotina. Material informativo da área de ' +
      'estética, dermocosmética e cuidados faciais.',
  },
];

function DescricaoCard({ item }: { item: Descricao }) {
  const [copied, setCopied] = useState(false);
  const s = STATUS_LABEL[item.status];

  const copy = async () => {
    await navigator.clipboard.writeText(item.texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-4 border-b border-border/60 pb-3">
        <div>
          <h3 className="font-display text-[1.05rem] font-semibold leading-tight text-foreground">
            {item.produto}
          </h3>
          <span
            className="mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
            style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
          >
            {s.label}
          </span>
        </div>
        <button
          type="button"
          onClick={copy}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-[12px] font-semibold text-primary transition-colors hover:bg-primary/20"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>

      <p className="text-[13.5px] leading-relaxed text-foreground/85">{item.texto}</p>

      <p className="mt-3 text-[11px] text-muted-foreground">
        {item.texto.length} caracteres
      </p>
    </div>
  );
}

export default function Descricoes() {
  return (
    <div className="rounded-2xl bg-white/60 p-8">
      <header className="mb-6 border-b border-border pb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          Descrições · Hotmart
        </p>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground">
          Descrições internas dos produtos
        </h1>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
          Textos para o cadastro do produto na Hotmart — servem para a plataforma identificar do que se trata
          e não são exibidos ao cliente. Todas têm mais de 200 caracteres. Clique em copiar e cole direto no
          campo de descrição.
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70">
          Nicho Estética
        </h2>
        <div className="space-y-3">
          {ESTETICA.map((item) => (
            <DescricaoCard key={item.produto} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
