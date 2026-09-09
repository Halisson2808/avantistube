/**
 * PDF — /pdf/pele-coreana · Manual da Pele Coreana · Produto principal · R$ 29,90
 *
 * Persona: Kim Sung-woo, chamado de Kim. Homem coreano de 55 a 65 anos.
 * Estrutura fechada em Workspace Youtube (canal do Kim, pasta ainda a criar).
 *
 * 8 blocos de 8 receitas, 64 no total. O 64 é a promessa do subtítulo e é
 * verificável no índice da página 6.
 *
 * Arquivo deliberadamente autossuficiente: não importa CORES nem Item de
 * components/ebook/sono.tsx, que é a linha da Avó Yuki. Isto é outra marca,
 * outra persona e outra paleta, e misturar as duas linhas num componente
 * compartilhado é o começo de uma virar a outra.
 *
 * Paleta: celadon, o verde-acinzentado da cerâmica coreana, com dourado quente.
 * Não é o kakishibu da Yuki nem o rosa do EbookDezessete.
 *
 * PRIMEIRA VERSÃO, 8 de setembro de 2026. Conteúdo para revisar e alterar.
 * Capa final é uma arte única: imagem, título, subtítulo e autoria pertencem
 * ao mesmo PNG, sem camadas tipográficas renderizadas por React.
 */
import { Fragment, type ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';
import { DesignPage } from '@/components/ebook/DesignPage';
import { Callout, Spacer } from '@/components/ebook/VisualElements';

const C = {
  base: 'hsl(168 32% 22%)',
  suave: 'hsl(168 24% 36%)',
  acento: 'hsl(38 62% 55%)',
};
const F = `linear-gradient(to bottom, ${C.base}, ${C.suave}, ${C.acento})`;
const CREME = 'hsl(40 40% 94%)';
const TERRA = 'hsl(21 66% 49%)';
const AREIA = 'hsl(38 45% 70%)';

// ── Tipos ──────────────────────────────────────────────────────────────────

type Receita = {
  n: number;
  nome: string;
  itens: string[];
  comoFaz: string;
  porque: string;
  atencao: string;
};

type Bloco = {
  nome: string;
  sub: string;
  avisoTitulo: string;
  aviso: string;
  receitas: Receita[];
};

// ── Componentes locais ─────────────────────────────────────────────────────

function Titulo({ children }: { children: ReactNode }) {
  return (
    <h3
      className="mb-2 mt-1 font-display text-[1.15rem] font-semibold tracking-tight first:mt-0"
      style={{ color: C.base }}
    >
      {children}
    </h3>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="mb-2.5 text-[13px] leading-relaxed text-foreground/90">{children}</p>;
}

function ImagemEditorial({
  src,
  alt,
  className = '',
  position = 'center',
}: {
  src: string;
  alt: string;
  className?: string;
  position?: string;
}) {
  return (
    <figure className={`overflow-hidden rounded-[14px] border border-black/10 bg-[hsl(40_32%_90%)] shadow-sm ${className}`}>
      <img src={src} alt={alt} className="h-full w-full object-cover" style={{ objectPosition: position }} />
    </figure>
  );
}

/** Cartão de receita. Mesma anatomia do Item da linha Yuki, redesenhado aqui. */
function Cartao({ r }: { r: Receita }) {
  return (
    <div
      className="avoid-page-break mb-3.5 rounded-xl border bg-white/95 p-3.5 shadow-sm"
      style={{ borderColor: `${C.base}24` }}
    >
      <div className="flex items-baseline gap-2.5">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ background: C.base }}
        >
          {r.n}
        </span>
        <h4 className="font-display text-[1.02rem] font-semibold leading-snug" style={{ color: C.base }}>
          {r.nome}
        </h4>
      </div>

      <div className="mt-2.5 grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3">
        <div>
          <span className="text-[9.5px] font-bold uppercase tracking-[0.14em]" style={{ color: C.acento }}>
            Você precisa de
          </span>
          <ul className="mt-1 space-y-0.5">
            {r.itens.map((i) => (
              <li key={i} className="text-[11.5px] leading-snug text-foreground/85">
                <span style={{ color: AREIA }}>—</span> {i}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="text-[9.5px] font-bold uppercase tracking-[0.14em]" style={{ color: C.acento }}>
            Como faz
          </span>
          <p className="mt-1 text-[11.5px] leading-snug text-foreground/90">{r.comoFaz}</p>
        </div>
      </div>

      <div className="mt-2.5 rounded-lg px-2.5 py-1.5" style={{ background: `${C.base}0E` }}>
        <span className="text-[9.5px] font-bold uppercase tracking-[0.14em]" style={{ color: C.base }}>
          Por que funciona
        </span>
        <p className="mt-0.5 text-[11.5px] leading-snug text-foreground/88">{r.porque}</p>
      </div>

      <div
        className="mt-1.5 rounded-lg border-l-[3px] px-2.5 py-1.5"
        style={{ borderColor: TERRA, background: 'hsl(21 66% 49% / 0.07)' }}
      >
        <span className="text-[9.5px] font-bold uppercase tracking-[0.14em]" style={{ color: TERRA }}>
          Atenção
        </span>
        <p className="mt-0.5 text-[11.5px] leading-snug text-foreground/88">{r.atencao}</p>
      </div>
    </div>
  );
}

/** Linha de atalho: da queixa para o bloco por onde começar. */
function Atalho({ queixa, onde }: { queixa: string; onde: string }) {
  return (
    <div className="mb-1.5 flex gap-3 rounded-lg px-3 py-2" style={{ background: `${C.base}0C` }}>
      <span className="w-[44%] shrink-0 text-[11.5px] font-semibold leading-snug" style={{ color: C.base }}>
        {queixa}
      </span>
      <span className="flex-1 text-[11.5px] leading-snug text-foreground/88">{onde}</span>
    </div>
  );
}

function Indice({ blocos }: { blocos: Bloco[] }) {
  return (
    <div className="mt-1 overflow-hidden rounded-xl border" style={{ borderColor: `${C.base}22` }}>
      {blocos.map((b, i) => (
        <div
          key={b.nome}
          className="flex items-baseline justify-between px-3.5 py-[7px]"
          style={{ background: i % 2 ? `${C.base}08` : 'transparent' }}
        >
          <span className="flex items-baseline gap-2.5">
            <span
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ background: C.base }}
            >
              {i + 1}
            </span>
            <span className="font-display text-[13.5px] font-semibold" style={{ color: C.base }}>
              {b.nome}
            </span>
          </span>
          <span className="text-[11.5px] font-medium" style={{ color: C.suave }}>
            {b.receitas.length} receitas
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Conteúdo ───────────────────────────────────────────────────────────────

const BLOCOS: Bloco[] = [
  {
    nome: 'Limpeza e remoção',
    sub: 'Pra tirar o dia do rosto sem tirar junto a gordura que protege a pele.',
    avisoTitulo: 'Lavar demais é o erro mais comum deste bloco',
    aviso:
      'Depois dos cinquenta a pele produz menos gordura, e sabonete forte tira a pouca que sobrou. Duas lavagens por dia é o teto, e a água é morna, nunca quente.',
    receitas: [
      {
        n: 1,
        nome: 'Água de arroz para lavar o rosto',
        itens: ['meia xícara de arroz cru', '1 xícara de água filtrada'],
        comoFaz:
          'Lava o arroz e joga essa primeira água fora. Cobre com a água filtrada, deixa vinte minutos e coa. De manhã, molha o rosto com ela no lugar do sabonete e enxágua com água morna.',
        porque:
          'É a base deste livro inteiro e você já tem em casa. Lava sem deixar aquela sensação de repuxado que o sabonete comum deixa.',
        atencao:
          'Guarda em vidro fechado na geladeira e usa em até dois dias. Passou disso, joga fora e faz outra. Preparo com água estraga rápido, e rosto não é lugar de testar sorte.',
      },
      {
        n: 2,
        nome: 'Óleo para tirar a maquiagem',
        itens: ['1 colher de sopa de óleo de gergelim ou de óleo de arroz', '1 pano de algodão macio'],
        comoFaz:
          'Com o rosto seco, espalha o óleo e massageia por um minuto, inclusive sobre os olhos fechados. Molha o pano em água morna, torce e retira. Repete o pano se precisar.',
        porque:
          'Maquiagem e protetor solar não saem só com água. O óleo dissolve os dois sem esfregar, e esfregar é o que machuca pele fina.',
        atencao:
          'Não usar em quem está com acne inflamada. Se entrar no olho e arder, enxagua com água corrente e não repete no dia seguinte.',
      },
      {
        n: 3,
        nome: 'Pó de farinha de arroz no lugar do sabonete',
        itens: ['2 colheres de sopa de farinha de arroz fina', 'água morna, aos poucos'],
        comoFaz:
          'Põe a farinha na palma da mão e pinga água até virar uma pasta rala. Espalha no rosto molhado com a ponta dos dedos, sem esfregar, por trinta segundos. Enxágua.',
        porque:
          'É o jeito coreano mais antigo de lavar o rosto. Limpa por absorção e não por detergente, então não arranca a camada que protege a pele.',
        atencao:
          'Farinha fina, nunca arroz moído em casa com pedaço grosso: grão com ponta risca. No máximo uma vez por dia.',
      },
      {
        n: 4,
        nome: 'A segunda lavagem, só com pano e água morna',
        itens: ['1 pano de algodão limpo', 'água morna'],
        comoFaz:
          'Depois de tirar a maquiagem com óleo, molha o pano em água morna, torce e passa no rosto em movimentos leves, de dentro para fora. Sem sabonete nenhum.',
        porque:
          'Na Coreia se lava duas vezes: a primeira tira o que é gordura, a segunda tira o que é suor e poeira. A segunda não precisa de produto.',
        atencao:
          'Pano limpo todo dia. Reaproveitar o pano de ontem é o caminho mais curto para espinha no queixo.',
      },
      {
        n: 5,
        nome: 'Leite morno para o rosto que repuxa',
        itens: ['2 colheres de sopa de leite integral', 'algodão'],
        comoFaz:
          'Amorna o leite, molha o algodão e passa no rosto todo. Deixa dois minutos e enxágua com água morna. À noite.',
        porque:
          'Para quem sente o rosto repuxando logo depois de lavar. O leite limpa e devolve gordura na mesma passada.',
        atencao:
          'Faz na hora e o que sobrar vai fora, sem guardar. Quem tem alergia à proteína do leite não usa nem na pele.',
      },
      {
        n: 6,
        nome: 'Chá verde frio para tirar o dia do rosto',
        itens: ['1 saquinho de chá verde', '200ml de água'],
        comoFaz:
          'Faz o chá, deixa esfriar e passa com algodão no fim da tarde, antes da limpeza da noite. Não enxágua.',
        porque:
          'É o que eu faço quando chego em casa e ainda não vou lavar o rosto. Tira a poeira e acalma a pele que passou o dia no sol e na rua.',
        atencao:
          'Guarda na geladeira por até dois dias. Chá esquecido fora da geladeira cria mofo, e ele iria direto para o seu rosto.',
      },
      {
        n: 7,
        nome: 'Aveia moída para quem fica vermelha',
        itens: ['1 colher de sopa de aveia em flocos finos', 'água morna'],
        comoFaz:
          'Bate a aveia até virar pó, mistura com água até formar um leite grosso e espalha no rosto molhado. Deixa um minuto e enxágua.',
        porque:
          'Aveia é a limpeza de quem não aguenta nada. Se o seu rosto fica vermelho depois de lavar, comece por aqui e não pela farinha de arroz.',
        atencao:
          'Aveia sem açúcar e sem sabor. Se você tem doença celíaca confirmada, pula esta e usa a de arroz.',
      },
      {
        n: 8,
        nome: 'A massagem de sessenta segundos dentro da limpeza',
        itens: ['as suas duas mãos', 'sessenta segundos'],
        comoFaz:
          'Enquanto lava, faz círculos pequenos com a ponta dos dedos: do queixo para a orelha, do canto do nariz para a maçã, da sobrancelha para a têmpora. Sempre de dentro para fora e de baixo para cima.',
        porque:
          'É a única parte da limpeza que não custa nada, e é a que mais muda a cara de manhã, porque move o inchaço da noite.',
        atencao:
          'Pressão leve, o suficiente para mover a pele e não para esticá-la. Se ficou vermelho, você apertou demais.',
      },
    ],
  },
  {
    nome: 'Manchas e tom desigual',
    sub: 'Pra pele que ficou com o tom remendado depois de anos de sol.',
    avisoTitulo: 'Limão não entra neste livro, e este é o bloco onde isso importa',
    aviso:
      'A internet manda passar limão na mancha. Limão e qualquer cítrico na pele, seguidos de sol, causam queimadura e mancha nova, que é o oposto do que você quer. Nenhuma das oito receitas abaixo leva cítrico, e isso é de propósito.',
    receitas: [
      {
        n: 9,
        nome: 'Tônico de água de arroz do dia',
        itens: ['meia xícara de arroz cru', '1 xícara de água filtrada'],
        comoFaz:
          'A mesma água da receita 1. Depois de lavar o rosto, passa com algodão, espera secar sozinho e segue com o óleo. Manhã e noite.',
        porque:
          'É o passo que mais falta na rotina de quem reclama de tom desigual. Pele limpa e seca não absorve o que vem depois, e o tônico é o que prepara ela.',
        atencao: 'Dois dias na geladeira, em vidro fechado. Se cheirou azedo, foi fora.',
      },
      {
        n: 10,
        nome: 'Máscara de arroz com mel',
        itens: ['2 colheres de sopa de farinha de arroz', '1 colher de sopa de mel', 'água morna aos poucos'],
        comoFaz:
          'Mistura até virar uma pasta que não escorre. Espalha no rosto limpo, longe dos olhos, e deixa quinze minutos. Tira com pano morno.',
        porque:
          'Arroz com mel é a dupla mais repetida da cozinha coreana no rosto. O mel segura água na pele e o arroz vai emparelhando o tom com o tempo.',
        atencao: 'Duas vezes por semana, não mais. Faz na hora e não guarda.',
      },
      {
        n: 11,
        nome: 'Compressa de chá verde para o tom desigual',
        itens: ['2 saquinhos de chá verde', '300ml de água', '1 pano de algodão'],
        comoFaz:
          'Faz o chá forte, deixa amornar, molha o pano e deita com ele sobre o rosto por dez minutos. Duas ou três vezes por semana.',
        porque:
          'É o que eu indico para quem tem a pele marcada de sol e não quer usar nada forte. Trabalha devagar e não irrita.',
        atencao: 'Morno, nunca quente. Não usar sobre pele com ferida ou descamando.',
      },
      {
        n: 12,
        nome: 'Máscara de iogurte natural',
        itens: ['2 colheres de sopa de iogurte natural integral, sem açúcar', '1 colher de chá de mel'],
        comoFaz:
          'Mistura, espalha no rosto limpo e deixa dez minutos. Enxágua com água morna. Uma vez por semana.',
        porque:
          'O iogurte tem um ácido suave, parecido com o que existe em produto caro de farmácia, só que fraco o bastante para não queimar.',
        atencao:
          'Dez minutos e nem um a mais. Se arder antes disso, tira na hora. Não usar no mesmo dia de esfoliação. Faz na hora e não guarda.',
      },
      {
        n: 13,
        nome: 'Compressa de batata ralada',
        itens: ['1 batata crua média', '1 pano fino'],
        comoFaz:
          'Rala a batata, põe dentro do pano, dobra e apoia sobre a área manchada por dez minutos. Enxágua depois.',
        porque:
          'É receita de avó em qualquer país, e a coreana usa igual. Não apaga mancha, mas tira o vermelho e o aspecto cansado da pele.',
        atencao:
          'Batata sem parte verde e sem broto, porque o verde da batata é tóxico. Faz na hora e joga fora depois de usar.',
      },
      {
        n: 14,
        nome: 'Máscara de aveia com leite',
        itens: ['2 colheres de sopa de aveia fina', '3 colheres de sopa de leite morno'],
        comoFaz: 'Deixa a aveia inchar no leite por cinco minutos, espalha no rosto e deixa quinze. Tira com pano morno.',
        porque:
          'Para pele manchada e seca ao mesmo tempo, que é a combinação mais comum depois dos cinquenta.',
        atencao: 'Faz na hora. Não guarda no pote para o dia seguinte, nem na geladeira.',
      },
      {
        n: 15,
        nome: 'Água de cevada como tônico da tarde',
        itens: ['1 colher de sopa de cevada torrada em grão', '500ml de água'],
        comoFaz:
          'Ferve cinco minutos, coa e deixa esfriar. Passa com algodão ou borrifa no rosto. O resto vai para a geladeira.',
        porque:
          'Na Coreia essa água é o que se bebe no lugar da água comum. No rosto ela acalma e não deixa oleoso.',
        atencao:
          'Dois dias na geladeira. Se você também bebe, separa um vidro só para o rosto e não mistura os dois.',
      },
      {
        n: 16,
        nome: 'O protetor solar, a única coisa que eu mando você comprar',
        itens: ['1 protetor solar facial, fator 30 ou mais', 'a quantidade de dois dedos'],
        comoFaz:
          'Passa toda manhã, depois do tônico, mesmo em dia nublado e mesmo dentro de casa perto da janela. Repõe se ficar horas no sol.',
        porque:
          'Não adianta fazer as quinze receitas anteriores e sair no sol sem isto. Mancha é sol somado a tempo, e essa é a parte que não dá para resolver na cozinha.',
        atencao:
          'É o único item deste manual que não é caseiro, e ele está aqui porque omitir seria desonesto. Se você fizer uma coisa só da página inteira, faça esta.',
      },
    ],
  },
  {
    nome: 'Ressecamento e descamação',
    sub: 'Pra pele que repuxa, descama nos cantos e bebe tudo que você passa.',
    avisoTitulo: 'Óleo em pele seca não hidrata',
    aviso:
      'Óleo não põe água na pele, ele segura a que já está lá. Por isso toda receita com óleo neste bloco pede a pele úmida antes. Passar óleo em pele seca é o erro que faz a pessoa achar que óleo não funciona para ela.',
    receitas: [
      {
        n: 17,
        nome: 'Mel puro no rosto',
        itens: ['1 colher de sopa de mel', 'o rosto levemente úmido'],
        comoFaz: 'Espalha o mel no rosto úmido, deixa quinze minutos e tira com pano morno. Duas vezes por semana.',
        porque:
          'É a receita mais curta do livro e a que mais gente repete. O mel puxa água para a pele e segura ali.',
        atencao: 'Não usar sobre ferida aberta. Faz na hora.',
      },
      {
        n: 18,
        nome: 'Máscara de abóbora com mel',
        itens: ['2 colheres de sopa de abóbora cozida e amassada', '1 colher de chá de mel'],
        comoFaz:
          'Mistura morna, nunca quente. Espalha, deixa quinze minutos e tira com pano morno. Uma vez por semana.',
        porque: 'Abóbora é doce, macia e cheia de água. Na Coreia ela entra na papa e no rosto pelo mesmo motivo.',
        atencao: 'Espera amornar antes de encostar no rosto. Faz na hora e não guarda.',
      },
      {
        n: 19,
        nome: 'Óleo para selar depois do banho',
        itens: ['3 gotas de óleo de arroz ou de gergelim'],
        comoFaz:
          'Com o rosto ainda úmido do banho, aquece as gotas entre as mãos e pressiona no rosto, sem esfregar. Todas as noites.',
        porque: 'É a aplicação prática do aviso deste bloco: a pele precisa estar úmida antes de o óleo entrar.',
        atencao: 'Três gotas, não mais. Óleo em excesso entope e aparece como cravo em uma semana.',
      },
      {
        n: 20,
        nome: 'Compressa morna antes de hidratar',
        itens: ['1 pano de algodão', 'água morna'],
        comoFaz: 'Pano morno sobre o rosto por dois minutos antes de passar o óleo. Só isso.',
        porque: 'Pele aquecida e úmida absorve muito mais do que pele fria e seca. É o passo de graça que faz o resto render.',
        atencao: 'Morno de encostar no pulso sem doer. Água quente resseca mais do que ajuda.',
      },
      {
        n: 21,
        nome: 'Máscara de aveia com iogurte',
        itens: ['2 colheres de sopa de aveia fina', '2 colheres de sopa de iogurte natural'],
        comoFaz: 'Mistura, deixa cinco minutos, espalha e deixa quinze. Tira com pano morno. Uma vez por semana.',
        porque: 'Para o rosto que descama e coça ao mesmo tempo. A aveia acalma e o iogurte amolece a casquinha.',
        atencao:
          'Descamação com vermelhidão que não passa pode ser dermatite, e isso é caso de médico, não de máscara.',
      },
      {
        n: 22,
        nome: 'Papa de arroz cozido com leite',
        itens: ['2 colheres de sopa de arroz cozido', '2 colheres de sopa de leite morno'],
        comoFaz: 'Amassa o arroz com o leite até virar papa lisa. Espalha morna, deixa quinze minutos e tira com pano.',
        porque:
          'É comida de criança doente virada máscara, e é a mais confortável do livro para pele sensível e seca ao mesmo tempo.',
        atencao:
          'Faz na hora, com arroz cozido no dia. Arroz cozido guardado é um dos lugares onde bactéria cresce mais rápido na cozinha.',
      },
      {
        n: 23,
        nome: 'Óleo só nas áreas que descamam',
        itens: ['2 gotas de óleo de gergelim'],
        comoFaz:
          'Só no canto do nariz, na sobrancelha e no queixo, que é onde descama primeiro. Depois do tônico, com a pele úmida.',
        porque:
          'Não precisa passar óleo no rosto inteiro. A maior parte das pessoas descama em três pontos, e só neles.',
        atencao:
          'Óleo de gergelim comum de cozinha serve, desde que não seja o torrado, que é escuro e tem cheiro forte.',
      },
      {
        n: 24,
        nome: 'O pano morno antes de dormir',
        itens: ['1 pano de algodão', 'água morna', 'dois minutos'],
        comoFaz: 'Última coisa da noite, antes do óleo. Pano morno no rosto, deita e respira. Dois minutos.',
        porque:
          'É metade cuidado de pele e metade fim de dia. E rosto que dorme relaxado amanhece diferente de rosto que dorme apertado.',
        atencao: 'Não usar quente, e não usar se você tem rosácea ou vermelhidão que piora com calor.',
      },
    ],
  },
  {
    nome: 'Oleosidade, poro e acne',
    sub: 'Pra zona que brilha no meio do dia e pra espinha que ainda aparece depois dos quarenta.',
    avisoTitulo: 'Pele oleosa depois dos cinquenta quase sempre é pele com sede',
    aviso:
      'Quando a pele fica sem água, ela produz mais gordura para compensar. Por isso ressecar mais, com álcool ou sabonete forte, piora em duas semanas. Todas as receitas deste bloco tiram o brilho sem tirar a água.',
    receitas: [
      {
        n: 25,
        nome: 'Máscara de argila branca',
        itens: ['1 colher de sopa de argila branca', 'água ou água de arroz, aos poucos'],
        comoFaz:
          'Mistura até virar pasta, espalha só no nariz, na testa e no queixo e deixa dez minutos. Tira antes de secar. Uma vez por semana.',
        porque: 'A argila branca é a mais fraca de todas e é a certa para pele madura. As outras tiram gordura demais.',
        atencao:
          'Nunca deixa secar até rachar: é aí que ela puxa água da pele e o rosto amanhece pior. Só na zona oleosa, nunca no rosto todo.',
      },
      {
        n: 26,
        nome: 'Vapor de chá verde',
        itens: ['1 litro de água quente', '2 saquinhos de chá verde', '1 toalha'],
        comoFaz:
          'Põe o chá na água quente numa bacia, senta com o rosto a um palmo e meio de distância e cobre a cabeça com a toalha por cinco minutos.',
        porque: 'Abre o caminho antes da argila e antes da máscara. Cinco minutos por semana bastam.',
        atencao:
          'Um palmo e meio de distância, nunca mais perto, e cinco minutos, nunca mais. Não fazer com rosácea, pressão alta descontrolada ou vermelhidão no rosto. Vapor perto demais queima.',
      },
      {
        n: 27,
        nome: 'Tônico de chá verde gelado',
        itens: ['1 saquinho de chá verde', '200ml de água'],
        comoFaz: 'Chá pronto e gelado, com algodão, de manhã e no meio do dia se o rosto brilhar. Não enxágua.',
        porque: 'É o substituto do papel absorvente. Tira o brilho sem tirar a água.',
        atencao: 'Dois dias na geladeira e acabou.',
      },
      {
        n: 28,
        nome: 'Máscara de aveia com mel para o rosto com espinha',
        itens: ['2 colheres de sopa de aveia fina', '1 colher de chá de mel', 'água morna'],
        comoFaz: 'Pasta rala, espalha, deixa dez minutos e tira com pano morno. Uma ou duas vezes por semana.',
        porque: 'Acalma sem ressecar, que é o contrário do que a maioria faz com espinha depois dos quarenta.',
        atencao: 'Espinha com nódulo fundo e doloroso não é caso de máscara. Isso é dermatologista.',
      },
      {
        n: 29,
        nome: 'Compressa morna no ponto inflamado',
        itens: ['1 pano pequeno', 'água morna'],
        comoFaz: 'Pano morno sobre o ponto por cinco minutos, duas vezes ao dia. Só nele, não no rosto todo.',
        porque: 'É o que substitui a vontade de espremer. Amolece e ajuda a resolver sozinho.',
        atencao: 'Não espreme. Espremer é o que transforma espinha de três dias em mancha de três meses.',
      },
      {
        n: 30,
        nome: 'Esfoliação suave de farinha de arroz com iogurte',
        itens: ['1 colher de sopa de farinha de arroz fina', '1 colher de sopa de iogurte natural'],
        comoFaz: 'Mistura, passa em círculos muito leves por trinta segundos e enxágua. Uma vez por semana, no máximo.',
        porque:
          'É a esfoliação mais fraca que existe e é a certa aqui. Pele madura não precisa de esfoliação forte, precisa de constância.',
        atencao:
          'Uma vez por semana. Esfoliar mais é o erro que mais estraga pele, e o mais fácil de cometer, porque na hora parece que melhorou.',
      },
      {
        n: 31,
        nome: 'Máscara de argila com água de arroz',
        itens: ['1 colher de sopa de argila branca', 'água de arroz até dar ponto'],
        comoFaz: 'No lugar da água comum, usa a água de arroz. Mesma aplicação da receita 25.',
        porque: 'É a versão para quem achou a argila pura pesada demais. Fica mais macia e sai mais fácil.',
        atencao: 'As mesmas da receita 25: não deixa rachar e não passa no rosto todo.',
      },
      {
        n: 32,
        nome: 'Não tocar o rosto, que é a receita mais difícil do livro',
        itens: ['nada', 'só reparar'],
        comoFaz:
          'Durante um dia inteiro, presta atenção em quantas vezes você encosta a mão no rosto, apoia o queixo ou passa a mão na testa. Só conta, não corrige. No dia seguinte, corrige.',
        porque:
          'É o único item deste bloco que não custa nada e o que mais muda resultado em quem tem espinha adulta.',
        atencao:
          'Vale também para o celular encostado na bochecha e para a fronha, que se troca duas vezes por semana.',
      },
    ],
  },
  {
    nome: 'Flacidez e firmeza',
    sub: 'Pro contorno que mudou e pro rosto que amanhece pesado.',
    avisoTitulo: 'Leia isto antes das oito receitas',
    aviso:
      'Nada feito em cozinha reverte perda de colágeno, e quem promete isso está mentindo. O que este bloco entrega é real e é outra coisa: menos inchaço, contorno mais definido por algumas horas e o tônus que vem de mover o rosto todo dia. Firmeza de verdade se sustenta em três coisas que estão aqui dentro e são de graça: protetor solar, sono e não puxar a pele. Se você quer resultado além disso, quem resolve é dermatologista, e dizer isso é mais honesto do que te vender um chá.',
    receitas: [
      {
        n: 33,
        nome: 'A compressa fria feita do jeito certo',
        itens: ['2 ou 3 pedras de gelo', '1 pano de algodão fino'],
        comoFaz:
          'Enrola o gelo no pano. Passa no rosto de baixo para cima, sem parar em nenhum ponto, por no máximo um minuto no rosto inteiro. De manhã.',
        porque:
          'É o que faz o rosto amanhecer menos inchado e mais definido. E é a técnica que mais assusta as pessoas, porque quase todo mundo ensina sem as regras abaixo.',
        atencao:
          'Gelo nunca encosta direto na pele, sempre com pano no meio. No máximo um minuto. Não fazer com rosácea, vermelhidão, sensibilidade ao frio ou sinusite em crise. Se doer ou avermelhar, para.',
      },
      {
        n: 34,
        nome: 'A drenagem do centro para fora',
        itens: ['as duas mãos', 'um pouco de óleo', 'três minutos'],
        comoFaz:
          'Com a pele limpa e um pouco de óleo, desliza os dedos do centro do rosto até a orelha, e da orelha até o pescoço, sempre no mesmo sentido. Dez vezes cada linha.',
        porque:
          'É o que move o líquido parado no rosto. Não é firmeza, é inchaço a menos, e a diferença aparece na hora.',
        atencao:
          'Sempre o mesmo sentido e sempre leve. Não fazer se houver caroço, gânglio inchado ou dor no pescoço.',
      },
      {
        n: 35,
        nome: 'Massagem com óleo, de baixo para cima',
        itens: ['4 gotas de óleo de gergelim ou de arroz', 'cinco minutos'],
        comoFaz:
          'Do queixo para a orelha, da boca para a maçã, do nariz para a têmpora. Sempre subindo, nunca descendo. Cinco minutos, à noite.',
        porque: 'O sentido importa mais que a força. Massagem que desce trabalha a favor do que você quer evitar.',
        atencao:
          'Nunca puxar nem esticar. O dedo desliza sobre o óleo; se a pele arrasta junto, é porque falta óleo.',
      },
      {
        n: 36,
        nome: 'A colher gelada no contorno',
        itens: ['2 colheres de metal', '1 copo com gelo'],
        comoFaz:
          'Gela as colheres, seca e passa as costas delas pelo contorno do maxilar e por baixo do olho, de dentro para fora. Trinta segundos de cada lado.',
        porque: 'É o mais rápido de todos e serve para o dia em que você acordou com o rosto inchado.',
        atencao: 'Colher gelada, nunca congelada, porque metal congelado gruda na pele. As mesmas restrições da receita 33.',
      },
      {
        n: 37,
        nome: 'Máscara de clara de ovo',
        itens: ['1 clara de ovo'],
        comoFaz:
          'Bate a clara com o garfo até espumar, espalha fina no rosto e deixa quinze minutos sem falar. Enxágua com água morna.',
        porque:
          'Ela repuxa e dá um efeito de firmeza que você vê no espelho. É temporário, e eu prefiro dizer isso a fingir que não é.',
        atencao:
          'Efeito de horas, não de semanas. Ovo cru na pele pede mão lavada antes e depois. Não usar sobre ferida. Quem tem alergia a ovo não faz. Não guarda.',
      },
      {
        n: 38,
        nome: 'Compressa de chá verde gelado para o rosto pesado',
        itens: ['2 saquinhos de chá verde', '300ml de água', '1 pano'],
        comoFaz:
          'Chá forte, gelado na geladeira, pano molhado nele e apoiado no rosto por dez minutos, deitada. Três vezes por semana.',
        porque: 'Junta o frio com o chá, que é o que acalma. Serve para o fim de tarde de quem passou o dia em pé.',
        atencao: 'Gelado, não congelado. Dois dias de validade na geladeira.',
      },
      {
        n: 39,
        nome: 'Massagem da linha do maxilar',
        itens: ['os nós dos dedos', 'óleo ou creme', 'dois minutos'],
        comoFaz:
          'Fecha a mão e desliza os nós dos dedos pela linha do maxilar, do queixo até a orelha, dez vezes de cada lado. Nunca na pele seca.',
        porque:
          'É a área onde a mudança de contorno mais incomoda e a que mais responde a movimento, porque tem músculo embaixo.',
        atencao:
          'Pressão média, não forte. Se você tem problema na articulação da mandíbula, faz mais leve ou pula esta.',
      },
      {
        n: 40,
        nome: 'Como você dorme aparece no rosto',
        itens: ['a sua posição de dormir', 'a sua fronha'],
        comoFaz:
          'Dormir de barriga para cima quando conseguir, não apoiar a bochecha na mão e trocar a fronha duas vezes por semana. Fronha de algodão fino ou de seda marca menos.',
        porque:
          'Boa parte das linhas de um lado só do rosto vem de dormir sempre do mesmo lado. Isso é de graça e quase ninguém conta.',
        atencao:
          'Se você tem refluxo ou ronco, não mude a posição de dormir por causa da pele sem falar com o seu médico antes.',
      },
    ],
  },
  {
    nome: 'Linhas e rugas',
    sub: 'Pros vincos da testa, do canto do olho e do contorno da boca.',
    avisoTitulo: 'Linha marcada não some, mas fica menos funda',
    aviso:
      'Este bloco trabalha hidratação profunda, soltura do músculo apertado e a proteção que impede a linha nova. Nenhuma receita aqui apaga vinco, e nenhuma promete isso. Óleo essencial puro nunca entra no rosto, em nenhuma delas.',
    receitas: [
      {
        n: 41,
        nome: 'Óleo no vinco, com o dedo parado',
        itens: ['2 gotas de óleo de arroz', 'o dedo anelar'],
        comoFaz:
          'Aquece a gota entre os dedos e pressiona sobre o vinco, sem deslizar, contando até dez. Repete três vezes. À noite.',
        porque: 'Deslizar sobre uma linha marcada não faz nada. Pressionar e deixar o óleo entrar faz.',
        atencao: 'Óleo puro de cozinha, sem perfume. Nunca óleo essencial puro no rosto.',
      },
      {
        n: 42,
        nome: 'Máscara de mel com azeite',
        itens: ['1 colher de sopa de mel', '1 colher de chá de azeite de oliva'],
        comoFaz: 'Mistura, espalha no rosto limpo, deixa vinte minutos e tira com pano morno. Uma vez por semana.',
        porque: 'Mel segura água e azeite segura o mel. É a máscara mais gordurosa do livro, e é para pele já fina.',
        atencao: 'Não usar em pele oleosa nem com espinha ativa. Faz na hora.',
      },
      {
        n: 43,
        nome: 'Massagem da testa e do meio das sobrancelhas',
        itens: ['as pontas dos dedos', 'óleo', 'dois minutos'],
        comoFaz:
          'Com óleo, alisa a testa de baixo para cima com as duas mãos alternadas, vinte vezes. Depois pressiona o ponto entre as sobrancelhas por dez segundos, três vezes.',
        porque:
          'A linha entre as sobrancelhas é músculo apertado, e músculo apertado solta com pressão e com você reparando que está apertando.',
        atencao: 'Sem arrastar a pele. Se ficou vermelho, foi força demais.',
      },
      {
        n: 44,
        nome: 'Compressa morna antes do óleo',
        itens: ['1 pano', 'água morna'],
        comoFaz: 'Pano morno dobrado sobre a testa e o contorno dos olhos por dois minutos, antes do óleo da receita 41.',
        porque: 'Mesma lógica da receita 20: pele morna absorve, pele fria não.',
        atencao: 'Morno, e nunca quente perto dos olhos.',
      },
      {
        n: 45,
        nome: 'Máscara de abóbora com mel e óleo',
        itens: ['2 colheres de sopa de abóbora cozida', '1 colher de chá de mel', '3 gotas de óleo de arroz'],
        comoFaz: 'Mistura morna, espalha, deixa quinze minutos e tira com pano. Uma vez por semana.',
        porque: 'É a versão mais rica da receita 18, para quem já tem linha marcada e não só pele seca.',
        atencao: 'Espera amornar. Faz na hora e não guarda.',
      },
      {
        n: 46,
        nome: 'Óleo no contorno da boca',
        itens: ['2 gotas de óleo de gergelim'],
        comoFaz: 'Do canto da boca para fora e para cima, com o dedo anelar, dez vezes de cada lado. À noite.',
        porque: 'É a área que mais seca e a que menos gente lembra, porque a mão costuma parar no queixo.',
        atencao: 'Pouco óleo. Em excesso ele escorre para o pescoço e mancha a fronha.',
      },
      {
        n: 47,
        nome: 'O óculos de sol, que é receita e ninguém trata como tal',
        itens: ['1 óculos de sol com proteção de verdade', 'o hábito de usar'],
        comoFaz: 'Todo dia de sol, inclusive no carro e caminhando. Não é vaidade, é para parar de apertar os olhos.',
        porque:
          'O vinco no canto do olho é feito de apertar os olhos milhares de vezes. Parar de apertar rende mais do que qualquer creme.',
        atencao:
          'Lente escura sem proteção real é pior que não usar, porque a pupila abre e entra mais luz. Confere a etiqueta.',
      },
      {
        n: 48,
        nome: 'Infusão de gengibre e ginseng como tônico',
        itens: ['1 colher de chá de gengibre ralado', '1 fatia fina de ginseng, ou mais gengibre se não achar', '250ml de água'],
        comoFaz:
          'Ferve cinco minutos, coa, deixa esfriar completamente e usa como tônico com algodão, à noite. Duas vezes por semana.',
        porque:
          'Ginseng é a raiz da tradição coreana. Se você não achar, o gengibre faz trabalho parecido e está em qualquer feira.',
        atencao:
          'Precisa estar frio, não morno. Testa no antebraço antes da primeira vez. Se arder ou avermelhar, dilui com metade de água. Dois dias na geladeira.',
      },
    ],
  },
  {
    nome: 'Olheira e área dos olhos',
    sub: 'Pra pálpebra inchada de manhã e pra sombra que não sai com sono.',
    avisoTitulo: 'A pele daqui é a mais fina do corpo',
    aviso:
      'Nesta área não entra esfoliante, não entra argila e não entra nada ácido. Nenhuma das oito receitas abaixo tem qualquer um dos três, e se você adaptar alguma coisa de outro bloco para cá, essa é a regra que não se quebra.',
    receitas: [
      {
        n: 49,
        nome: 'Saquinho de chá verde usado e gelado',
        itens: ['2 saquinhos de chá verde já usados', 'geladeira'],
        comoFaz:
          'Guarda os saquinhos usados na geladeira e, no dia seguinte, apoia um sobre cada olho fechado por dez minutos.',
        porque:
          'É o aproveitamento mais bonito da cozinha coreana: o chá que você bebeu de manhã trabalha para você à noite.',
        atencao:
          'Só do dia anterior, nunca da semana passada. Saquinho velho cria mofo e ele iria direto no seu olho.',
      },
      {
        n: 50,
        nome: 'Rodela de pepino gelada',
        itens: ['2 rodelas grossas de pepino gelado'],
        comoFaz: 'Sobre os olhos fechados por dez minutos, deitada.',
        porque: 'É clichê e funciona, porque é frio e é água. Desincha a pálpebra em dez minutos.',
        atencao: 'Pepino bem lavado. Não usar com conjuntivite ou olho irritado.',
      },
      {
        n: 51,
        nome: 'Rodela de batata crua',
        itens: ['2 rodelas finas de batata crua'],
        comoFaz: 'Sobre a pálpebra fechada e a área escura de baixo, por dez minutos. Enxágua depois.',
        porque: 'Para a olheira mais escura, mais arroxeada. Não some, mas clareia o tom.',
        atencao: 'Batata sem parte verde e sem broto. Enxaguar depois, sempre.',
      },
      {
        n: 52,
        nome: 'As costas da colher gelada',
        itens: ['2 colheres de metal', 'gelo'],
        comoFaz:
          'Gela as colheres num copo com gelo, seca e apoia as costas delas sob os olhos por trinta segundos de cada lado. De manhã.',
        porque: 'É o mais rápido de todos e cabe antes de sair de casa.',
        atencao: 'Gelada, não congelada, e seca antes de encostar. Metal congelado gruda na pele.',
      },
      {
        n: 53,
        nome: 'A batidinha com o anelar',
        itens: ['1 gota de óleo', 'o dedo anelar', 'um minuto'],
        comoFaz:
          'Dá batidinhas leves do canto de dentro do olho para fora, por baixo. Vinte de cada lado, sem arrastar.',
        porque:
          'O anelar é o dedo mais fraco da mão, e é por isso que se usa ele aqui. Com o indicador você aperta demais sem perceber.',
        atencao: 'Nunca esfregar nem esticar essa pele.',
      },
      {
        n: 54,
        nome: 'Uma gota de óleo na pálpebra de baixo',
        itens: ['1 gota de óleo de arroz para os dois olhos'],
        comoFaz:
          'Uma gota só, dividida entre os dois anelares, na pálpebra de baixo e no canto de fora. À noite, depois do tônico.',
        porque: 'A área do olho seca antes do resto do rosto e é onde a linha aparece primeiro.',
        atencao:
          'Uma gota, não mais, e longe da linha dos cílios. Óleo que migra para dentro do olho arde e deixa a pálpebra inchada de manhã.',
      },
      {
        n: 55,
        nome: 'O sal do jantar e a altura do travesseiro',
        itens: ['o seu jantar', '1 travesseiro a mais'],
        comoFaz:
          'Jantar com menos sal e dormir com a cabeça um pouco mais alta. Duas noites já mostram diferença em quem acorda com o olho inchado.',
        porque:
          'Boa parte da olheira da manhã é líquido, não pigmento. Isto resolve a parte de líquido, e nenhuma máscara resolve.',
        atencao:
          'Quem tem pressão alta ou problema de rim não mexe no sal por conta própria: quem manda nisso é o médico.',
      },
      {
        n: 56,
        nome: 'Compressa alternada, morna e fria',
        itens: ['1 pano morno', '1 pano frio'],
        comoFaz:
          'Dois minutos com o pano morno sobre os olhos fechados, depois um minuto com o frio. Termina no frio. Três vezes por semana.',
        porque: 'O morno solta e o frio fecha. É a mesma lógica do banho quente e frio, num pano de rosto.',
        atencao: 'Morno de encostar sem doer. Não fazer com terçol, conjuntivite ou qualquer infecção no olho.',
      },
    ],
  },
  {
    nome: 'Viço e textura',
    sub: 'Pro rosto opaco, pra pele áspera ao toque e pro brilho que sumiu.',
    avisoTitulo: 'Constância ganha de quantidade, sempre',
    aviso:
      'Este é o bloco onde mais dá vontade de fazer tudo junto, e é o que mais estraga rosto. A sequência completa é uma vez por semana. Nos outros dias, três passos bastam.',
    receitas: [
      {
        n: 57,
        nome: 'Tônico de arroz com chá verde',
        itens: ['meia xícara de água de arroz', 'meia xícara de chá verde frio'],
        comoFaz: 'Mistura os dois num vidro. Usa como tônico de manhã e de noite, com algodão.',
        porque: 'É o tônico que eu uso, e é a mistura dos dois ingredientes que mais aparecem neste livro.',
        atencao: 'Dois dias na geladeira, em vidro fechado e limpo. Cheiro azedo, vai fora.',
      },
      {
        n: 58,
        nome: 'Máscara de tecido feita em casa',
        itens: ['1 pano de algodão fino ou 2 discos grandes de algodão', '4 colheres de sopa do tônico da receita 57'],
        comoFaz:
          'Encharca o pano no tônico, deita e apoia no rosto por quinze minutos. Tira antes de secar e pressiona o que sobrou na pele.',
        porque: 'É a máscara de tecido coreana sem comprar o sachê, e é o passo que mais dá viço na semana.',
        atencao:
          'Tira antes de secar. Máscara de tecido que seca no rosto começa a puxar de volta a água da pele.',
      },
      {
        n: 59,
        nome: 'Esfoliação de farinha de arroz, uma vez por semana',
        itens: ['1 colher de sopa de farinha de arroz fina', 'água morna'],
        comoFaz: 'Pasta rala, círculos leves por trinta segundos, enxágua. Uma vez por semana, sempre no mesmo dia.',
        porque:
          'Textura melhora com constância e piora com exagero. Uma vez por semana no domingo rende mais que três vezes numa semana e nada na outra.',
        atencao: 'Não fazer no mesmo dia da máscara de iogurte nem depois de um dia de sol forte.',
      },
      {
        n: 60,
        nome: 'A sequência completa de domingo',
        itens: ['as receitas 26, 59, 58, 57 e 19', 'quarenta minutos'],
        comoFaz:
          'Vapor de cinco minutos, esfoliação de trinta segundos, máscara de tecido de quinze minutos, tônico e óleo. Nessa ordem, uma vez por semana.',
        porque: 'É a única vez na semana em que vale fazer tudo junto. Nos outros dias, menos é mais.',
        atencao:
          'Uma vez por semana e só. Repetir a sequência duas ou três vezes é o caminho mais rápido para o rosto irritado.',
      },
      {
        n: 61,
        nome: 'Máscara de mel com iogurte',
        itens: ['2 colheres de sopa de iogurte natural', '1 colher de chá de mel'],
        comoFaz: 'Mistura, espalha, deixa dez minutos e enxágua com água morna. Uma vez por semana.',
        porque: 'É a máscara mais equilibrada do livro: limpa um pouco, hidrata um pouco e deixa a pele lisa no dia seguinte.',
        atencao: 'Dez minutos. Não usar no mesmo dia da esfoliação. Faz na hora.',
      },
      {
        n: 62,
        nome: 'A pressão das palmas no fim de tudo',
        itens: ['as duas mãos', 'um minuto'],
        comoFaz: 'Depois do óleo, pressiona as palmas quentes sobre o rosto inteiro e conta até dez. Repete três vezes.',
        porque:
          'Serve para duas coisas: o calor da mão ajuda o óleo a entrar, e você termina o dia tocando o próprio rosto com cuidado.',
        atencao: 'Mão limpa. É o único cuidado que esta tem.',
      },
      {
        n: 63,
        nome: 'Borrifador de água de cevada',
        itens: ['água de cevada gelada', '1 borrifador limpo'],
        comoFaz:
          'Borrifa no rosto no meio do dia, quando a pele repuxar, e dá batidinhas para entrar. Não enxágua.',
        porque: 'Serve para quem passa o dia no ar condicionado, que é onde a pele seca sem ninguém perceber.',
        atencao:
          'Borrifador lavado e seco antes de encher, e dois dias na geladeira. Borrifar sem selar depois pode secar mais: se repuxar, passa uma gota de óleo por cima.',
      },
      {
        n: 64,
        nome: 'A rotina mínima de cinco minutos',
        itens: ['cinco minutos', 'três receitas deste livro'],
        comoFaz:
          'De manhã: lava com água de arroz, tônico, protetor solar. À noite: óleo para tirar o dia, lava, tônico, óleo para selar. É isso.',
        porque:
          'Se você fizer só esta página e ignorar as outras sessenta e três, ainda vai estar fazendo mais do que a maioria das pessoas faz.',
        atencao:
          'Constância vale mais que quantidade. Rotina curta feita todo dia ganha de rotina longa feita quando dá.',
      },
    ],
  },
];

/** Renderiza um bloco em 3 páginas de receita, deliberadamente sem foto decorativa. */
function PaginasDoBloco({ bloco, indice, primeiraPagina }: { bloco: Bloco; indice: number; primeiraPagina: number }) {
  const r = bloco.receitas;
  return (
    <>
      <PdfContentPage
        accentGradient={F}
        pageNumber={primeiraPagina}
        pageNumberColor={C.base}
        kicker={`Bloco ${indice + 1} · Receitas ${r[0].n} a ${r[r.length - 1].n}`}
        title={bloco.nome}
        subtitle={bloco.sub}
      >
        <Callout type="warning" title={bloco.avisoTitulo} className="mb-3.5">
          {bloco.aviso}
        </Callout>
        {r.slice(0, 2).map((x) => (
          <Cartao key={x.n} r={x} />
        ))}
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F}
        pageNumber={primeiraPagina + 1}
        pageNumberColor={C.base}
        kicker={`Bloco ${indice + 1} · Continuação`}
      >
        {r.slice(2, 5).map((x) => (
          <Cartao key={x.n} r={x} />
        ))}
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F}
        pageNumber={primeiraPagina + 2}
        pageNumberColor={C.base}
        kicker={`Bloco ${indice + 1} · Continuação`}
      >
        {r.slice(5).map((x) => (
          <Cartao key={x.n} r={x} />
        ))}
      </PdfContentPage>
    </>
  );
}

function AberturaDeBloco({ bloco, indice, pageNumber }: { bloco: Bloco; indice: number; pageNumber: number }) {
  const visual = VISUAIS_DOS_BLOCOS[indice];
  const rotulo = `Bloco ${indice + 1} · 8 receitas`;
  const texto = (
    <div>
      <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: C.acento }}>
        {rotulo}
      </p>
      <h2 className="font-display text-[2.7rem] font-semibold leading-[1.02] tracking-tight" style={{ color: C.base }}>
        {bloco.nome}
      </h2>
      <p className="mt-5 max-w-[27rem] text-[15px] font-medium leading-relaxed text-foreground/78">{bloco.sub}</p>
      <div className="mt-8 h-px w-16" style={{ background: C.acento }} />
      <p className="mt-4 max-w-[26rem] text-[12.5px] leading-relaxed text-foreground/70">
        Na próxima página, comece pela primeira receita e leia o aviso antes de testar qualquer preparo.
      </p>
    </div>
  );
  const numero = (
    <span className="absolute bottom-8 left-0 right-0 text-center text-[10.5px] font-semibold tracking-[0.18em]" style={{ color: C.base, opacity: 0.55 }}>
      {pageNumber}
    </span>
  );

  if (visual.tipo === 'topo') {
    return (
      <DesignPage bg={CREME}>
        <img src={visual.src} alt={visual.alt} className="absolute inset-x-0 top-0 h-[43%] w-full object-cover" />
        <div className="absolute bottom-[12%] left-[10%] right-[10%]">{texto}</div>
        {numero}
      </DesignPage>
    );
  }

  if (visual.tipo === 'lateral') {
    return (
      <DesignPage bg={CREME}>
        <img src={visual.src} alt={visual.alt} className="absolute bottom-0 left-0 top-0 w-[43%] object-cover" />
        <div className="absolute bottom-[16%] left-[51%] right-[9%]">{texto}</div>
        {numero}
      </DesignPage>
    );
  }

  if (visual.tipo === 'quadrado') {
    return (
      <DesignPage bg={CREME}>
        <div className="absolute left-[10%] top-[18%] w-[43%]">{texto}</div>
        <div className="absolute right-[9%] top-[22%] h-[40%] w-[34%] overflow-hidden rounded-[24px] border-[8px] border-white shadow-xl">
          <img src={visual.src} alt={visual.alt} className="h-full w-full object-cover" />
        </div>
        <div className="absolute bottom-[21%] right-[13%] h-20 w-20 rounded-full" style={{ background: `${C.acento}38` }} aria-hidden />
        {numero}
      </DesignPage>
    );
  }

  return (
    <DesignPage bg={CREME}>
      <div className="absolute left-[10%] right-[10%] top-[14%]">{texto}</div>
      <img src={visual.src} alt={visual.alt} className="absolute inset-x-0 bottom-0 h-[36%] w-full object-cover" />
      {numero}
    </DesignPage>
  );
}

// ── Documento ──────────────────────────────────────────────────────────────

/**
 * O aviso legal é a página 7 e vem ANTES da primeira receita, por decisão do
 * dono em 8 de setembro de 2026. Aviso legal no fim do arquivo é aviso que
 * quase ninguém lê, porque a pessoa vai direto ao índice e para no bloco dela.
 * Aqui ele fica no caminho de quem folheia até as receitas.
 */
const PAGINA_DO_AVISO = 7;
const PRIMEIRA_PAGINA_DOS_BLOCOS = 8;
const PAGINAS_POR_BLOCO = 4; // 1 abertura editorial + 3 páginas de receitas

const IMAGENS_DOS_BLOCOS = [
  '/pele-coreana/capitulos/01-limpeza.jpg',
  '/pele-coreana/capitulos/02-manchas.jpg',
  '/pele-coreana/capitulos/03-ressecamento.jpg',
  '/pele-coreana/capitulos/04-oleosidade.jpg',
  '/pele-coreana/capitulos/05-firmeza.jpg',
  '/pele-coreana/capitulos/06-linhas.jpg',
  '/pele-coreana/capitulos/07-olheiras.jpg',
  '/pele-coreana/capitulos/08-vico.jpg',
] as const;

/**
 * Cada bloco abre com uma composição distinta. A imagem não é enfeite
 * intercambiável: sua posição cria ritmo e evita oito páginas idênticas.
 */
const VISUAIS_DOS_BLOCOS = [
  { tipo: 'topo', src: IMAGENS_DOS_BLOCOS[0], alt: 'Água de arroz e pano de algodão para limpeza suave' },
  { tipo: 'lateral', src: '/pele-coreana/capitulos-formatos/02-manchas-vertical.jpg', alt: 'Pepino, aveia e iogurte em cerâmica celadon' },
  { tipo: 'rodape', src: IMAGENS_DOS_BLOCOS[2], alt: 'Aveia, mel e cerâmica para cuidado de pele ressecada' },
  { tipo: 'quadrado', src: '/pele-coreana/capitulos-formatos/04-oleosidade-quadrado.jpg', alt: 'Argila branca, chá verde e pepino em composição serena' },
  { tipo: 'rodape', src: IMAGENS_DOS_BLOCOS[4], alt: 'Colher de massagem, água fresca e pedras lisas' },
  { tipo: 'lateral', src: '/pele-coreana/capitulos-formatos/06-linhas-vertical.jpg', alt: 'Óleo de arroz, aveia e flor de camélia' },
  { tipo: 'quadrado', src: '/pele-coreana/capitulos-formatos/07-olheiras-quadrado.jpg', alt: 'Colheres frias, pepino e algodão para a área dos olhos' },
  { tipo: 'rodape', src: IMAGENS_DOS_BLOCOS[7], alt: 'Água de arroz, aveia e pepino para viço da pele' },
] as const;

const IMAGENS_DA_ABERTURA = {
  kim: '/pele-coreana/abertura/kim-agua-de-arroz.jpg',
  comoUsar: '/pele-coreana/abertura/como-usar.jpg',
  naoUsar: '/pele-coreana/abertura/nao-usar.jpg',
  habitos: '/pele-coreana/abertura/habitos.jpg',
  armazenamento: '/pele-coreana/abertura/armazenamento.jpg',
} as const;

export default function EbookPeleCoreana() {
  const ultimaPaginaDeBloco = PRIMEIRA_PAGINA_DOS_BLOCOS + BLOCOS.length * PAGINAS_POR_BLOCO - 1;

  return (
    <>
      {/* ── capa ───────────────────────────────────────────────────── */}
      <DesignPage
        bg={C.base}
        style={{
          backgroundImage: "url('/capas/manual-pele-coreana-opcao-02-celadon.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0" aria-hidden="true" />
      </DesignPage>

      {/* ── p1 · abertura ──────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={F}
        pageNumber={1}
        pageNumberColor={C.base}
        kicker="Antes de tudo"
        title="O que você comprou e por onde começar"
      >
        <div className="mb-3.5 flex gap-4">
          <div className="min-w-0 flex-1">
            <P>
              Meu nome é Kim Sung-woo. Nasci na Coreia e cresci vendo a minha família cuidar da pele
              com o que estava na cozinha, porque era o que tinha. Não inventei nada do que está
              aqui: eu reuni, adaptei para o que se encontra no mercado brasileiro e escrevi a
              quantidade, a frequência e o que não pode passar no rosto.
            </P>
            <P>
              Este manual tem 64 receitas separadas em 8 blocos, cada bloco por uma queixa. Você
              não precisa ler do começo ao fim. Vá no índice da página 6, escolha o que mais te
              incomoda hoje e comece pela primeira receita daquele bloco.
            </P>
          </div>
          <ImagemEditorial
            src={IMAGENS_DA_ABERTURA.kim}
            alt="Kim Sung-woo preparando água de arroz em uma tigela de cerâmica"
            className="h-[188px] w-[142px] shrink-0"
            position="57% center"
          />
        </div>

        <Titulo>O que este manual não é</Titulo>
        <P>
          Não é tratamento e não substitui dermatologista. Não promete prazo, não promete resultado
          e não vai clarear, apagar nem rejuvenescer nada. Se algum material por aí te promete isso
          com ingrediente de cozinha, ele está te enganando.
        </P>
        <P>
          O que ele é: um jeito organizado de cuidar da pele em casa, com a medida certa, a
          frequência certa e a lista do que nunca deve ir no rosto. Essa última parte é a razão de
          este livro existir, porque é justamente o que ninguém escreve.
        </P>

        <Callout type="tip" title="Antes da primeira receita">
          Leia as páginas 2 a 5. São cinco páginas e elas evitam os erros que fazem a pessoa
          desistir na primeira semana achando que a pele dela é o problema.
        </Callout>
      </PdfContentPage>

      {/* ── p2 · como ler e o teste ────────────────────────────────── */}
      <PdfContentPage
        accentGradient={F}
        pageNumber={2}
        pageNumberColor={C.base}
        kicker="Como usar"
        title="Como ler uma receita e o teste que vem antes"
      >
        <ImagemEditorial
          src={IMAGENS_DA_ABERTURA.comoUsar}
          alt="Ingredientes, pote de vidro e utensílios limpos para preparar uma receita"
          className="mb-4 h-[92px] w-full"
          position="center 55%"
        />
        <Titulo>Os quatro campos de cada receita</Titulo>
        <P>
          Você precisa de: os ingredientes com a quantidade medida. Como faz: o preparo, onde
          aplicar, quanto tempo deixar e com que frequência repetir. Por que funciona: o motivo, em
          palavra simples. Atenção: quem não deve usar, o limite e, quando o preparo tem água ou
          leite, por quanto tempo ele dura.
        </P>
        <P>
          O campo Atenção não é formalidade e não é enfeite jurídico. Ele é o produto. Leia sempre,
          inclusive nas receitas que parecem inofensivas.
        </P>

        <Titulo>O teste do antebraço, que vem antes de tudo</Titulo>
        <P>
          Antes de usar uma receita nova no rosto, passa um pouco dela na dobra interna do braço, do
          lado de dentro do cotovelo. Deixa pelo mesmo tempo que a receita pede e repete duas vezes
          por dia, durante quatro dias. Preparo com alimento é feito fresco a cada teste.
        </P>
        <P>
          Se aparecer vermelhidão, coceira, ardência ou bolinha, essa receita não é para você e não
          adianta insistir com menos quantidade. Se não aparecer nada até o dia seguinte ao último
          teste, pode usar no rosto. O teste reduz o risco, mas não garante que nunca haverá reação.
        </P>
        <P>
          Repete o teste a cada receita nova, e não só na primeira. Você pode reagir ao mel e não
          reagir a nada mais no livro inteiro.
        </P>

        <Callout type="warning" title="Se você faz tratamento de pele">
          Quem usa ácido, retinoide, medicação para acne ou fez procedimento recente tem a pele em
          outro estado. Fale com o seu dermatologista antes de começar qualquer coisa daqui.
        </Callout>
      </PdfContentPage>

      {/* ── p3 · o que nunca vai no rosto ──────────────────────────── */}
      <PdfContentPage
        accentGradient={F}
        pageNumber={3}
        pageNumberColor={C.base}
        kicker="A página mais importante"
        title="O que nunca vai no rosto"
        subtitle="Nove coisas que a internet ensina e que eu não uso em ninguém."
      >
        <P>
          Nenhuma delas aparece nas 64 receitas deste manual, e isso não é esquecimento. Se você
          encontrar uma receita caseira por aí que leve qualquer uma destas nove, já sabe o que
          fazer com ela.
        </P>
        <ImagemEditorial
          src={IMAGENS_DA_ABERTURA.naoUsar}
          alt="Itens que não devem ser usados no rosto organizados sobre uma superfície"
          className="mb-3.5 h-[60px] w-full"
          position="center 48%"
        />

        <Titulo>Limão e qualquer cítrico</Titulo>
        <P>
          É a mais repetida de todas e a mais perigosa. Suco de limão, laranja ou lima na pele,
          seguido de sol, causa uma queimadura que deixa mancha escura e demora meses para sair. O
          nome disso é fitofotodermatite. É o oposto do que quem passa limão está procurando.
        </P>

        <Titulo>Bicarbonato de sódio</Titulo>
        <P>
          A pele é levemente ácida e é isso que segura a barreira dela. O bicarbonato é o contrário
          disso e desmonta essa barreira. Nos primeiros dias parece que limpou, e depois a pele
          fica sensível, vermelha e mais oleosa do que antes.
        </P>

        <Titulo>Canela, óleo essencial puro e alho cru</Titulo>
        <P>
          Os três queimam pele fina. Óleo essencial só se usa muito diluído, e não existe motivo
          para arriscar isso no rosto quando mel e aveia fazem o trabalho sem risco nenhum.
        </P>

        <Titulo>Pasta de dente na espinha</Titulo>
        <P>
          Pasta de dente é feita para esmalte, não para pele. Ela resseca com detergente e deixa
          uma mancha que dura mais que a espinha que você queria esconder.
        </P>

        <Titulo>Açúcar e sal como esfoliante de rosto</Titulo>
        <P>
          O grão tem ponta e corta. No corpo passa, no rosto não. A esfoliação deste manual é feita
          com farinha de arroz, que é redonda e fina.
        </P>

        <Titulo>Vinagre puro e água oxigenada</Titulo>
        <P>
          Vinagre sem diluir queima a barreira e a água oxigenada mata também a célula boa. Nenhum
          dos dois tem lugar no rosto.
        </P>
      </PdfContentPage>

      {/* ── p4 · erros que pioram ──────────────────────────────────── */}
      <PdfContentPage
        accentGradient={F}
        pageNumber={4}
        pageNumberColor={C.base}
        kicker="Antes de começar"
        title="Os erros que pioram, e que não têm nada a ver com ingrediente"
      >
        <P>
          Estes oito não estão em nenhuma receita porque não são receita. São os hábitos que fazem
          uma rotina boa não render, e corrigir eles não custa nada.
        </P>
        <ImagemEditorial
          src={IMAGENS_DA_ABERTURA.habitos}
          alt="Objetos de rotina de cuidado com a pele organizados em uma composição editorial"
          className="mb-3.5 h-[54px] w-full"
          position="center 50%"
        />

        <Titulo>Trocar de receita toda semana</Titulo>
        <P>
          Pele responde devagar. Quem troca antes de duas semanas nunca sabe o que funcionou, e
          acaba concluindo que nada funciona.
        </P>

        <Titulo>Esfoliar demais</Titulo>
        <P>
          É o erro mais comum e o mais difícil de perceber, porque na hora a pele fica lisa. Uma vez
          por semana é o teto para pele madura.
        </P>

        <Titulo>Pular o protetor solar</Titulo>
        <P>
          Sem ele, metade do que você faz aqui é gasto para repor o que o sol tirou no mesmo dia.
        </P>

        <Titulo>Dormir sem tirar a maquiagem</Titulo>
        <P>Uma noite não faz nada. O hábito faz, e aparece em poro e em textura.</P>

        <Titulo>Exagerar na quantidade</Titulo>
        <P>
          Dobrar a receita não dobra o efeito. Em óleo e em argila, mais quantidade só aumenta o
          risco de entupir e de ressecar.
        </P>

        <Titulo>Lavar com água quente</Titulo>
        <P>Quente tira a gordura de proteção e deixa o rosto vermelho. Morna resolve tudo.</P>

        <Titulo>Usar tudo na ordem errada</Titulo>
        <P>
          A ordem é sempre do mais líquido para o mais grosso: lava, tônico, óleo, protetor. Óleo
          antes do tônico bloqueia o tônico.
        </P>

        <Titulo>Encostar a mão no rosto o dia inteiro</Titulo>
        <P>Isso é a receita 32, e é a mais difícil do livro justamente por ser a mais boba.</P>
      </PdfContentPage>

      {/* ── p5 · guardar e quando procurar médico ──────────────────── */}
      <PdfContentPage
        accentGradient={F}
        pageNumber={5}
        pageNumberColor={C.base}
        kicker="Segurança"
        title="Como guardar, quanto tempo dura e quando parar"
      >
        <div className="mb-2 flex gap-4">
          <div className="min-w-0 flex-1">
            <Titulo>Preparo com água, leite, iogurte ou fruta</Titulo>
            <P>
              Estraga rápido. Máscara e papa se fazem na hora e o que sobra vai fora, mesmo
              parecendo desperdício. Água de arroz, chá e água de cevada duram dois dias em vidro
              fechado na geladeira, e não mais que isso.
            </P>
            <P>
              Isto é a resposta para a pergunta que mais me fazem, que é se pode guardar na
              geladeira para amanhã. Para o líquido, dois dias. Para o resto, não.
            </P>
          </div>
          <ImagemEditorial
            src={IMAGENS_DA_ABERTURA.armazenamento}
            alt="Potes de vidro, ingredientes secos e água de arroz organizados para armazenamento"
            className="mt-1 h-[156px] w-[156px] shrink-0"
            position="center"
          />
        </div>

        <Titulo>Preparo seco</Titulo>
        <P>
          Farinha de arroz, aveia moída e argila em pó duram meses em vidro fechado, longe do calor
          e do sol, desde que você tire com colher seca. Água dentro do pote acaba com isso.
        </P>

        <Titulo>Óleo</Titulo>
        <P>
          Dura o que está escrito na embalagem, guardado longe do fogão. Óleo com cheiro rançoso não
          se usa no rosto.
        </P>

        <Callout type="warning" title="Sinal de que o preparo estragou">
          Cheiro azedo, cor mudada, textura escorregadia ou qualquer ponto de mofo. Na dúvida,
          descarta. Rosto não é lugar de arriscar por causa de duas colheres de arroz.
        </Callout>

        <Spacer size="sm" />

        <Titulo>Quando parar e procurar dermatologista</Titulo>
        <P>
          Mancha que muda de forma, de cor ou de tamanho. Ferida que não fecha em duas semanas.
          Nódulo fundo e doloroso. Vermelhidão com descamação que não passa. Coceira intensa que
          espalha. Qualquer reação forte a uma receita daqui.
        </P>
        <P>
          Nenhuma dessas é caso de máscara caseira, e insistir só faz perder tempo. Este manual
          cuida da pele saudável no dia a dia, e é isso que ele faz bem.
        </P>
      </PdfContentPage>

      {/* ── p6 · índice ───────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={F}
        pageNumber={6}
        pageNumberColor={C.base}
        kicker="Índice"
        title="Os oito blocos, e por onde começar"
      >
        <P>
          Vá direto no bloco que descreve o que mais te incomoda. Faça a primeira receita dele por
          algumas semanas antes de passar para a próxima. Fazer três de uma vez não acelera nada e
          tira de você a única informação que interessa, que é saber qual funcionou.
        </P>

        <Indice blocos={BLOCOS} />

        <Spacer size="sm" />

        <Titulo>Se você não sabe por onde começar</Titulo>
        <Atalho queixa="A pele repuxa depois de lavar" onde="Bloco 1, receita 1, e depois o bloco 3 inteiro." />
        <Atalho queixa="O tom do rosto está remendado" onde="Bloco 2, e leia o aviso do bloco antes de tudo." />
        <Atalho queixa="O rosto amanhece inchado" onde="Bloco 5, receita 33, com as regras do gelo." />
        <Atalho queixa="A pele brilha no meio do dia" onde="Bloco 4, receita 27. Não resseque mais." />
        <Atalho queixa="Olheira e pálpebra pesada" onde="Bloco 7, receita 49, que usa o chá de ontem." />
        <Atalho queixa="Só quero o básico bem feito" onde="Bloco 8, receita 64. São cinco minutos por dia." />

        <Spacer size="sm" />

        <Callout type="tip" title="A regra da quantidade">
          Toda receita aqui tem medida e limite de frequência. Planta e comida não são inofensivas
          por serem naturais: é por funcionarem que elas têm dose.
        </Callout>
      </PdfContentPage>

      {/* ── p7 · aviso legal, antes da primeira receita ─────────────── */}
      <AvisoLegal />

      {/* ── blocos 1 a 8 ───────────────────────────────────────────── */}
      {BLOCOS.map((bloco, i) => {
        const primeiraPaginaDoBloco = PRIMEIRA_PAGINA_DOS_BLOCOS + i * PAGINAS_POR_BLOCO;
        return (
          <Fragment key={bloco.nome}>
            <AberturaDeBloco bloco={bloco} indice={i} pageNumber={primeiraPaginaDoBloco} />
            <PaginasDoBloco bloco={bloco} indice={i} primeiraPagina={primeiraPaginaDoBloco + 1} />
          </Fragment>
        );
      })}

      {/* ── fecho ─────────────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={F}
        pageNumber={ultimaPaginaDeBloco + 1}
        pageNumberColor={C.base}
        kicker="Para terminar"
        title="A parte que ninguém vende"
      >
        <P>
          Se você chegou até aqui procurando qual das 64 é a mais forte, eu vou te poupar o tempo:
          não existe. A que funciona é a que você faz três vezes por semana durante dois meses, e
          quase sempre ela é uma das mais simples do livro.
        </P>
        <P>
          Minha família não tinha prateleira de produto. Tinha arroz, chá, mel e a mão. O que fazia
          diferença não era o ingrediente raro, era ninguém pular o dia.
        </P>
        <P>
          Comece pequeno. A receita 64 é a rotina mínima e leva cinco minutos. Faça só ela por duas
          semanas antes de acrescentar qualquer outra coisa. Depois disso, escolha um bloco, um só,
          e vá com calma.
        </P>
        <P>
          E lembre da página 3 sempre que alguém te ensinar uma receita nova. Se ela tiver limão,
          bicarbonato ou pasta de dente, você já sabe.
        </P>

        <Spacer size="md" />

        <div className="mt-auto text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full border-2" style={{ borderColor: C.base }} />
          <p className="font-display text-[1.1rem] font-semibold" style={{ color: C.base }}>
            Cuidar da pele é hábito, não é milagre.
          </p>
          <p className="mt-1 text-[12px] uppercase tracking-[0.2em]" style={{ color: C.acento }}>
            Kim Sung-woo
          </p>
        </div>
      </PdfContentPage>

      {/* AVISO LEGAL MOVIDO: agora é a página 7, antes do bloco 1. */}
    </>
  );
}

function AvisoLegal() {
  return (
    <PdfContentPage
      accentGradient={F}
      pageNumber={PAGINA_DO_AVISO}
      pageNumberColor={C.base}
      kicker="Aviso legal"
      title="Leia antes de usar qualquer receita deste material"
    >
        <P>
          Este material é informativo e reúne preparos de uso caseiro e tradicional para cuidados
          com a pele. Ele não substitui consulta, diagnóstico ou tratamento médico, e não constitui
          orientação dermatológica individual.
        </P>
        <P>
          Nenhuma receita aqui trata doença de pele. Nenhuma promete resultado, prazo ou efeito
          garantido. As respostas variam de pessoa para pessoa, e o que serve para uma pele pode não
          servir para outra.
        </P>
        <P>
          Faça o teste no antebraço descrito na página 2 antes de usar qualquer preparo no rosto, e
          repita a cada receita nova. Interrompa o uso imediatamente diante de vermelhidão,
          ardência, coceira, inchaço ou qualquer reação, e procure um profissional de saúde.
        </P>
        <P>
          Procure um dermatologista diante de mancha que muda de forma, cor ou tamanho, ferida que
          não cicatriza, nódulo doloroso, vermelhidão persistente com descamação ou qualquer lesão
          que não melhora. Sinais assim exigem avaliação e não devem ser tratados em casa.
        </P>
        <P>
          Gestantes, lactantes, pessoas com dermatite, rosácea, psoríase ou doença de pele
          diagnosticada, pessoas em uso de ácidos, retinoides ou medicação para acne, e pessoas com
          alergia alimentar conhecida devem consultar o seu médico antes de utilizar qualquer
          preparo descrito aqui.
        </P>
        <P>
          As indicações de proteção solar deste material são gerais. A escolha do produto adequado
          ao seu tipo de pele deve ser feita com orientação profissional.
        </P>
        <P>
          O uso das informações contidas neste material é de responsabilidade do leitor. Em caso de
          dúvida sobre qualquer receita, ingrediente ou frequência, consulte um profissional de
          saúde antes de utilizar.
        </P>
    </PdfContentPage>
  );
}
