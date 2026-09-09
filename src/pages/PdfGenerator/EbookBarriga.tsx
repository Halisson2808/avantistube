/**
 * PDF — /pdf/barriga · O Protocolo da Barriga · Bump 2 · R$ 27,90
 *
 * Escada em Workspace Produtos/Ofertas/avo-yuki/_Inteligencia/analise-bumps.md
 *
 * Completo: 16 preparos, a grade dia a dia dos 14 dias e a página das comidas
 * que incham.
 *
 * Recorte deliberado, e é o que faz este bump existir. O Caderno já tem 16
 * receitas de digestão, inchaço e fígado nos blocos 1 e 2. Se este produto
 * fosse só mais receitas, seria sobra. Ele é sequência: o Caderno diz o que
 * fazer, este diz em que ordem, em que dia e em que hora. Nenhum dos 16
 * preparos daqui existe no Caderno, e isso foi conferido um a um.
 *
 * Revisado depois da primeira versão, que tinha 8 preparos e resolvia as duas
 * semanas em prosa. Ficou magro: o produto promete cronograma dia a dia e
 * entregava três parágrafos por semana. Agora a grade é de verdade, com os 14
 * dias em manhã, tarde e noite.
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';
import { DesignPage } from '@/components/ebook/DesignPage';
import { Callout, Divider, Spacer } from '@/components/ebook/VisualElements';
import { CORES, faixaDe, Item, Titulo, P, Assinatura } from '@/components/ebook/sono';

const C = CORES.barriga;
const F = faixaDe(C);

/** Alerta de abertura de bloco. O Callout não tem margem própria e cola no primeiro cartão. */
function AvisoDoBloco({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Callout type="warning" title={title} className="mb-3.5">
      {children}
    </Callout>
  );
}

/** Linha da página do dia inteiro. */
function Hora({ hora, o, q }: { hora: string; o: string; q: string }) {
  return (
    <div className="mb-1.5 flex gap-3 rounded-lg px-3 py-2" style={{ background: `${C.base}0C` }}>
      <span className="w-20 shrink-0 text-[11px] font-bold uppercase tracking-wider" style={{ color: C.base }}>
        {hora}
      </span>
      <span className="flex-1 text-[12px] leading-snug text-foreground/90">
        <strong className="font-semibold">{o}</strong> — {q}
      </span>
    </div>
  );
}

/** Cabeçalho da grade dos 14 dias. */
function GradeTopo() {
  return (
    <div className="mb-1 flex gap-2 px-2.5">
      <span className="w-6 shrink-0" />
      <div className="grid flex-1 grid-cols-3 gap-2">
        {['Manhã', 'Tarde', 'Noite'].map((h) => (
          <span key={h} className="text-[9.5px] font-bold uppercase tracking-[0.14em]" style={{ color: C.acento }}>
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Um dia da grade. `novo` destaca o dia em que entra algo novo. */
function Dia({ n, manha, tarde, noite, novo }: { n: number; manha: string; tarde: string; noite: string; novo?: boolean }) {
  return (
    <div
      className="mb-1 flex items-start gap-2 rounded-lg px-2.5 py-[7px]"
      style={{ background: novo ? `${C.base}16` : `${C.base}07` }}
    >
      <span
        className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
        style={{ background: novo ? C.base : C.suave }}
      >
        {n}
      </span>
      <div className="grid flex-1 grid-cols-3 gap-2 text-[10.5px] leading-snug text-foreground/88">
        <span>{manha}</span>
        <span>{tarde}</span>
        <span>{noite}</span>
      </div>
    </div>
  );
}

export default function EbookBarriga() {
  return (
    <>
      {/*
        Capa: arte aprovada em 3 de setembro de 2026, em public/barriga-avo-yuki.jpg.
        É a mesma imagem do checkout e da página de vendas, então o comprador
        abre o PDF e vê exatamente a capa que viu antes de comprar. A arte é 2:3
        e a página é A4: com cover, perde cerca de 3 por cento em cima e embaixo,
        o que cai só na margem.
      */}
      <DesignPage
        bg={C.base}
        style={{
          backgroundImage: 'url(/barriga-avo-yuki.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* ── p1 · abertura ─────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={1} pageNumberColor={C.base}
        kicker="Antes de tudo"
        title="Isto não é mais um punhado de receitas"
      >
        <P>
          Se você já tem o meu Caderno, ali estão as receitas de digestão, de inchaço e de fígado.
          Aqui não tem nenhuma delas repetida, e eu não ia te vender a mesma coisa duas vezes.
        </P>
        <P>
          O que falta para quase todo mundo não é receita, é ordem. Saber o que tomar não resolve
          quando não se sabe em que hora, em que dia, e o que parar de fazer enquanto isso. Este guia
          é a ordem: catorze dias escritos um por um, com manhã, tarde e noite.
        </P>

        <Callout type="info" title="Serve sozinho, e serve junto">
          Os dezesseis preparos deste guia não estão no Caderno, então dá para seguir o protocolo
          inteiro sem ter nenhum outro material meu. Quem tiver os dois ganha mais opção nos dias em
          que faltar um ingrediente, e é só isso.
        </Callout>

        <Titulo cor={C}>Por que catorze dias</Titulo>
        <P>
          Porque menos que isso não dá tempo de saber, e mais que isso ninguém cumpre. Duas semanas é
          o que cabe numa vida real e é o suficiente para você comparar a segunda semana com a
          primeira e enxergar alguma coisa.
        </P>
        <P>
          E fica dito logo: eu não prometo o que vai acontecer no décimo quarto dia. O que eu prometo
          é a ordem, escrita dia a dia, e a lista do que atrapalha enquanto você tenta.
        </P>
      </PdfContentPage>

      {/* ── p2 · as três barrigas ─────────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={2} pageNumberColor={C.base}
        kicker="Antes de começar"
        title="As três barrigas, e a sua é uma delas"
      >
        <P>
          Barriga inchada não é uma coisa só, e é por isso que tanta gente tenta a receita da vizinha
          e não acontece nada: a queixa parecia igual e o problema era outro. Antes de começar os
          catorze dias, descubra qual é a sua.
        </P>

        <Titulo cor={C}>A que estufa depois de comer</Titulo>
        <P>
          De manhã está lisa, e vinte minutos depois do almoço a roupa aperta. Some ou diminui à
          noite. Vem com arroto, gás e sensação de comida parada. Esta é de digestão, e responde
          rápido ao que se faz em volta da refeição.
        </P>

        <Titulo cor={C}>A que incha ao longo do dia</Titulo>
        <P>
          Começa leve e vai enchendo até a noite, junto com pé e tornozelo marcados pela meia. Piora
          no calor, em dia de muito sal e antes da menstruação, quando ainda há. Esta é de água
          parada, e é a que mais melhora com movimento.
        </P>

        <Titulo cor={C}>A que já acorda pesada</Titulo>
        <P>
          Você deita bem e acorda estufada, com a boca amarga e sem vontade de café da manhã. Vem
          junto com intestino preso e com peso depois de comida gordurosa. Esta é a mais lenta das
          três e é a que pede a noite arrumada, não a manhã.
        </P>

        <Divider />

        <Callout type="tip" title="Não precisa escolher só uma">
          Muita mulher tem duas ao mesmo tempo, e o protocolo funciona igual. Saber qual é a
          principal serve para você escolher, dentro de cada dia, qual preparo priorizar quando o
          tempo estiver curto.
        </Callout>
      </PdfContentPage>

      {/* ── p3 · o dia ────────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={3} pageNumberColor={C.base}
        kicker="Como usar"
        title="O dia inteiro numa página"
        subtitle="Esta é a página para imprimir e deixar na porta da geladeira. O resto do guia explica cada linha."
      >
        <Hora hora="Ao acordar" o="Copo de água em temperatura ambiente" q="devagar, sentada, antes do café" />
        <Hora hora="Café" o="Kefir ou iogurte natural (preparo 4)" q="com fruta, sem açúcar" />
        <Hora hora="Antes do almoço" o="Chá de carqueja (preparo 1)" q="quinze minutos antes, morno e amargo" />
        <Hora hora="No almoço" o="Água entre as refeições, não durante (preparo 7)" q="e a mastigação contada (preparo 16)" />
        <Hora hora="Depois do almoço" o="Caminhada de dez minutos (preparo 6)" q="qualquer caminhada, mesmo dentro de casa" />
        <Hora hora="Meio da tarde" o="Chá de espinheira-santa (preparo 2)" q="só nos dias de azia ou peso" />
        <Hora hora="19h" o="Jantar reduzido (preparo 8)" q="mais leve que o almoço, três horas antes de deitar" />
        <Hora hora="Depois do jantar" o="Chá de cardamomo (preparo 14)" q="nos dias de comida pesada" />
        <Hora hora="Antes de deitar" o="Massagem da barriga (preparo 5)" q="cinco minutos, no sentido do relógio" />
        <Hora hora="Nos dias travados" o="Água de ameixa ou de chia (preparos 3 e 9)" q="deixadas de molho na noite anterior" />

        <Spacer size="sm" />

        <Callout type="tip" title="Se der para fazer só três coisas">
          A caminhada depois do almoço, a água fora da refeição e o jantar às sete. As três são de
          graça, não dependem de comprar nada, e são as que mais mudam a barriga que estufa.
        </Callout>
      </PdfContentPage>

      {/* ── p4 · preparos 1 e 2 ───────────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={4} pageNumberColor={C.base}
        kicker="Os dezesseis preparos"
        title="O que entra no protocolo"
        subtitle="Nenhum destes está no Caderno da Avó Yuki. Foram escolhidos um a um para não repetir o que você já tem."
      >
        <AvisoDoBloco title="Antes de qualquer preparo">
          Barriga que dói de verdade, que incha de um lado só, que vem com febre, vômito, sangue nas
          fezes, perda de peso sem explicação ou intestino que mudou e não voltou, não é assunto de
          protocolo caseiro. Isso é consulta, e de preferência esta semana.
        </AvisoDoBloco>
        <Item
          cor={C} numero={1} nome="Chá de carqueja antes do almoço"
          lista={['1 colher de chá de carqueja seca', '250ml de água']}
          texto="Água fervida, fogo desligado, tampa por dez minutos. Coa e toma morno quinze minutos antes do almoço. É amargo mesmo, e não se adoça."
          porque="O amargo antes de comer é o que prepara a digestão, e adoçar tira justamente o que faz efeito. Quinze minutos antes, não durante."
          atencao="Não usar em gestação, amamentação nem por quem tem pressão baixa. Pode baixar o açúcar do sangue: quem toma remédio para diabetes fala com o médico. No máximo dez dias seguidos."
        />
        <Item
          cor={C} numero={2} nome="Chá de espinheira-santa"
          lista={['1 colher de chá da folha seca', '250ml de água']}
          texto="Água fervida, fogo desligado, tampa por dez minutos. Coa e toma morno no meio da tarde, só nos dias em que houver azia ou peso no estômago."
          porque="É a folha que a minha avó usava para estômago ardido, e não é para tomar todo dia. Entra no protocolo como socorro, não como rotina."
          atencao="Não usar em gestação nem amamentação. No máximo sete dias seguidos. Azia frequente e persistente é caso de investigar com médico, não de repetir chá."
        />
      </PdfContentPage>

      {/* ── p5 · preparos 3 a 5 ───────────────────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={5} pageNumberColor={C.base} kicker="Os preparos · Continuação">
        <Item
          cor={C} numero={3} nome="A água de ameixa da noite"
          lista={['3 ameixas secas sem caroço', '1 copo de água']}
          texto="Deixa as ameixas de molho no copo de água ao deitar. De manhã, bebe a água e come as ameixas, em jejum."
          porque="Fruta seca de molho trabalha a noite inteira, e de manhã já está pronta. É mais suave que qualquer laxante e não vicia o intestino."
          atencao="Só nos dias travados, não todo dia. Passar de três ameixas costuma dar cólica e gás. Quem tem diabetes deve contar o açúcar da fruta seca."
        />
        <Item
          cor={C} numero={4} nome="O kefir ou iogurte do café"
          lista={['1 copo de kefir, ou 1 pote de iogurte natural sem açúcar', '1 fruta']}
          texto="No café da manhã, todo dia dos catorze. Com fruta picada, sem açúcar e sem adoçante."
          porque="É a única coisa do protocolo que trabalha no intestino de dentro para fora e precisa de repetição diária para valer alguma coisa."
          atencao="Comece com meio copo na primeira semana, porque gás e barulho no começo são comuns. Quem tem intolerância à lactose usa a versão sem lactose ou de água."
        />
        <Item
          cor={C} numero={5} nome="A massagem no sentido do relógio"
          lista={['as duas mãos', '5 minutos', 'deitada de barriga para cima']}
          texto="Com a mão espalmada, faz círculos lentos em volta do umbigo, sempre no sentido do relógio, começando pelo lado direito de baixo. Cinco minutos, antes de deitar."
          porque="O sentido não é superstição: é o caminho que o intestino faz. No sentido contrário, você trabalha contra ele."
          atencao="Pressão leve, sem forçar. Não fazer sobre dor forte, hérnia, cirurgia recente na barriga, nem em gestação. Se doer, pare."
        />
      </PdfContentPage>

      {/* ── p6 · preparos 6 a 8 ───────────────────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={6} pageNumberColor={C.base} kicker="Os preparos · Continuação">
        <Item
          cor={C} numero={6} nome="A caminhada de dez minutos depois do almoço"
          lista={['10 minutos', 'qualquer lugar, inclusive dentro de casa']}
          texto="Dez minutos de caminhada leve começando até meia hora depois do almoço. Não precisa trocar de roupa nem sair de casa."
          porque="É o mais poderoso do guia e o que ninguém leva a sério por ser simples demais. Andar move a comida; sentar depois de comer é o que deixa tudo parado."
          atencao="Caminhada leve, não exercício. Quem tem refluxo não deve se deitar depois de comer, e esta é justamente a alternativa. Dor ou falta de ar ao caminhar é parar e procurar médico."
        />
        <Item
          cor={C} numero={7} nome="A água entre as refeições"
          lista={['1 garrafa de água', 'nada durante o prato']}
          texto="Beba água entre as refeições, e no máximo meio copo durante. O resto do dia, à vontade."
          porque="Copo grande de líquido junto da comida estufa e dilui. Não é proibição de água: é mudar a hora, e isso sozinho já muda a barriga da tarde."
          atencao="Quem toma remédio junto da refeição continua tomando com a água necessária. Isto não vale para quem tem orientação médica de líquido diferente."
        />
        <Item
          cor={C} numero={8} nome="O jantar das sete, reduzido"
          lista={['o seu jantar de sempre', 'metade do prato do almoço', '3 horas antes de deitar']}
          texto="Jante até as sete, ou pelo menos três horas antes de deitar, e sirva menos do que serve no almoço. Se der fome, uma fruta."
          porque="Barriga que acorda pesada quase sempre nasce no jantar da véspera, e não na manhã. É a mudança que mais gente resiste e a que mais responde."
          atencao="Quem trabalha à noite, é diabético ou toma remédio com a ceia não deve pular refeição: ajuste o horário com o médico em vez de seguir esta linha ao pé da letra."
        />
      </PdfContentPage>

      {/* ── p7 · preparos 9 a 11 ──────────────────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={7} pageNumberColor={C.base} kicker="Os preparos · Continuação">
        <Item
          cor={C} numero={9} nome="A água de chia da manhã"
          lista={['1 colher de chá de semente de chia', '1 copo de água']}
          texto="Deixa a chia no copo de água por vinte minutos, até virar um gel. Toma tudo, com mais um copo de água limpa depois."
          porque="A chia trabalha puxando água e formando volume, e é isso que empurra o intestino parado. Sem o gel formado, ela não faz esse trabalho."
          atencao="Nunca engolir a chia seca, porque ela incha na garganta e engasga. Sempre de molho até virar gel, e sempre com água depois. Quem tem estreitamento no intestino ou diverticulite em crise deve evitar."
        />
        <Item
          cor={C} numero={10} nome="Mamão com aveia no café"
          lista={['meio mamão papaia', '2 colheres de sopa de aveia em flocos']}
          texto="Amassa o mamão, mistura a aveia e deixa cinco minutos antes de comer, para a aveia amolecer. No café da manhã, nos dias de intestino preso."
          porque="A dupla é antiga e continua sendo a mais eficiente que eu conheço para intestino preguiçoso, sem precisar de nada de farmácia."
          atencao="Beba água ao longo do dia, senão a aveia trava em vez de soltar. Quem tem diabetes deve contar o açúcar do mamão. Alergia a látex pode reagir ao mamão."
        />
        <Item
          cor={C} numero={11} nome="Vinagre de maçã diluído antes do almoço"
          lista={['1 colher de chá de vinagre de maçã', '1 copo de água']}
          texto="Dissolve bem na água e toma com canudo, dez minutos antes do almoço. Enxágua a boca com água pura depois."
          porque="É o ácido antes da comida, do mesmo jeito que o amargo da carqueja. Serve para quem sente a comida parada no estômago."
          atencao="Nunca puro, sempre diluído, e sempre com enxágue depois, porque o ácido desgasta o esmalte do dente. Quem tem gastrite, úlcera ou refluxo deve evitar. Quem toma diurético ou remédio para diabetes fala com o médico."
        />
      </PdfContentPage>

      {/* ── p8 · preparos 12 a 14 ─────────────────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={8} pageNumberColor={C.base} kicker="Os preparos · Continuação">
        <Item
          cor={C} numero={12} nome="Chá de alcachofra"
          lista={['1 colher de chá da folha seca', '250ml de água']}
          texto="Água fervida, fogo desligado, tampa por dez minutos. Coa e toma morno depois da refeição mais pesada do dia."
          porque="É amarga como a carqueja, mas trabalha depois de comer e não antes. Entra nos dias de comida gordurosa, e é para isso que ela serve."
          atencao="Não usar por quem tem pedra na vesícula ou obstrução das vias biliares, nem em gestação e amamentação. No máximo cinco dias por semana."
        />
        <Item
          cor={C} numero={13} nome="Água de abacaxi com casca"
          lista={['a casca de meio abacaxi, bem lavada', '1 litro de água']}
          texto="Ferve a casca por dez minutos, coa, deixa esfriar e toma ao longo da tarde, no lugar de outra bebida."
          porque="A casca é o que quase todo mundo joga fora, e é a parte que a minha avó usava. Ajuda a soltar o peso da comida e rende o dia inteiro."
          atencao="Lave a casca em água corrente esfregando bem, porque é a parte que mais junta sujeira. Quem tem gastrite ou boca sensível deve diluir mais. Não guardar mais de um dia."
        />
        <Item
          cor={C} numero={14} nome="Chá de cardamomo depois do jantar"
          lista={['3 sementes de cardamomo amassadas', '200ml de água']}
          texto="Amassa as sementes, cobre com a água fervida fora do fogo e tampa por sete minutos. Coa e toma morno depois do jantar pesado."
          porque="É o tempero que vira chá, e é o mais gostoso deste guia. Ajuda no gás e no peso da noite, que é quando eles mais atrapalham o sono."
          atencao="Não usar em dose alta na gestação. Quem tem pedra na vesícula deve evitar. Três sementes bastam, e mais que isso deixa o chá forte demais para tomar à noite."
        />
      </PdfContentPage>

      {/* ── p9 · preparos 15 e 16 ─────────────────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={9} pageNumberColor={C.base} kicker="Os preparos · Fim">
        <Item
          cor={C} numero={15} nome="A compressa seca de sal grosso"
          lista={['1 xícara de sal grosso', '1 pano de algodão ou meia limpa', '1 frigideira']}
          texto="Aquece o sal na frigideira seca por três minutos, mexendo, põe dentro do pano e amarra. Deixa sobre a barriga por dez minutos, por cima da roupa."
          porque="É calor seco, e ele entra mais fundo e dura mais que o da compressa molhada. É o que eu faço nas noites de barriga estufada e dura."
          atencao="Sempre por cima da roupa e nunca direto na pele, porque queima. Teste no antebraço antes. Não usar em gestação, sobre dor forte, hérnia, cirurgia recente ou barriga dura e dolorida ao toque."
        />
        <Item
          cor={C} numero={16} nome="A mastigação contada"
          lista={['a sua comida de sempre', 'nada além disso']}
          texto="Conte vinte mastigadas em cada garfada, nas primeiras cinco garfadas de cada refeição. Depois disso o corpo continua sozinho, mais devagar."
          porque="Fecha os preparos sem nada para preparar. Metade do gás de quem estufa depois de comer entra pela boca junto com a comida engolida rápido."
          atencao="Quem tem dificuldade para mastigar, dentadura mal adaptada ou dente faltando deve resolver isso primeiro com a dentista: mastigar mal é causa de má digestão e não se resolve com chá."
        />
      </PdfContentPage>

      {/* ── p10 · a grade, semana 1 ───────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={10} pageNumberColor={C.base}
        kicker="O protocolo · Semana 1"
        title="Dias 1 a 7 — tirar o que atrapalha"
        subtitle="Nesta semana entra pouca coisa nova. O trabalho é parar de fazer o que trabalha contra. Os dias destacados são os que trazem algo novo."
      >
        <GradeTopo />
        <Dia n={1} novo manha="Copo de água ao acordar" tarde="Caminhada de 10 min depois do almoço" noite="Jantar até as 19h" />
        <Dia n={2} novo manha="Água ao acordar" tarde="Caminhada + água fora da refeição" noite="Jantar até as 19h" />
        <Dia n={3} manha="Água ao acordar" tarde="Caminhada + água fora da refeição" noite="Jantar até as 19h" />
        <Dia n={4} novo manha="Água + kefir, meio copo" tarde="Caminhada + água fora da refeição" noite="Jantar + massagem de 5 min" />
        <Dia n={5} manha="Água + kefir, meio copo" tarde="Caminhada + água fora da refeição" noite="Jantar + massagem" />
        <Dia n={6} novo manha="Água + kefir, copo cheio" tarde="Caminhada + mastigação contada" noite="Jantar + massagem" />
        <Dia n={7} manha="Água + kefir" tarde="Caminhada + mastigação contada" noite="Jantar + massagem + anotar a semana" />

        <Spacer size="xs" />

        <Callout type="warning" title="O que sai nesta semana">
          Refrigerante, inclusive o de zero, e canudo. Chiclete durante o dia. Comer andando ou em pé.
          Os quatro entram ar na barriga, e ar é metade do inchaço de quem estufa depois de comer.
        </Callout>
      </PdfContentPage>

      {/* ── p11 · a grade, semana 2 ───────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={11} pageNumberColor={C.base}
        kicker="O protocolo · Semana 2"
        title="Dias 8 a 14 — entra o que se toma"
        subtitle="Agora os preparos, um por vez, com a base da semana 1 já de pé. Tudo que entrou continua."
      >
        <GradeTopo />
        <Dia n={8} novo manha="Água + kefir" tarde="Carqueja 15 min antes do almoço + caminhada" noite="Jantar + massagem" />
        <Dia n={9} manha="Água + kefir" tarde="Carqueja + caminhada" noite="Jantar + massagem" />
        <Dia n={10} novo manha="Água de chia ou de ameixa, se travada" tarde="Carqueja + caminhada" noite="Jantar + massagem" />
        <Dia n={11} novo manha="Kefir + mamão com aveia" tarde="Carqueja + caminhada" noite="Jantar + massagem" />
        <Dia n={12} novo manha="Kefir + mamão com aveia" tarde="Carqueja + alcachofra, se pesado" noite="Cardamomo depois do jantar" />
        <Dia n={13} novo manha="Kefir + mamão" tarde="Espinheira-santa, se houver azia" noite="Compressa de sal, se houver peso" />
        <Dia n={14} manha="O que ficou de pé" tarde="Caminhada + água fora da refeição" noite="Comparar as anotações das duas semanas" />

        <Spacer size="xs" />

        <Callout type="tip" title="No décimo quarto dia">
          Compare as sete anotações da segunda semana com as sete da primeira. Não olhe o espelho,
          olhe o papel: memória de barriga é péssima testemunha e o papel não tem opinião. Se não
          mudou nada em catorze dias fazendo tudo, isso é resposta também, e é hora de levar essa
          informação a um médico em vez de repetir a dose.
        </Callout>
      </PdfContentPage>

      {/* ── p12 · as comidas que incham ───────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={12} pageNumberColor={C.base}
        kicker="A lista"
        title="O que incha em silêncio"
        subtitle="Não é lista de proibição. É lista de suspeitos, para você testar um por vez e descobrir os seus."
      >
        <P>
          Estes são os que mais aparecem quando alguém me conta o que comeu antes de estufar. Eles não
          fazem mal a todo mundo, e é justamente por isso que a lista é de teste e não de corte.
        </P>

        <Titulo cor={C}>Os quatro mais comuns</Titulo>
        <P>
          Leite e derivados em quem já não digere bem, e isso costuma aparecer depois dos quarenta em
          quem tomava leite a vida inteira sem problema. Feijão, grão-de-bico e lentilha em
          quantidade grande, principalmente sem deixar de molho antes. Trigo, em quem sente peso e
          sono depois do pão. E adoçante, principalmente os que terminam em ol, que fermentam no
          intestino e produzem gás.
        </P>

        <Titulo cor={C}>Como testar sem se enganar</Titulo>
        <P>
          Tire um só, por cinco dias, mantendo o resto igual. Anote. Depois volte a comer e veja o
          que acontece. Tirar os quatro de uma vez não ensina nada, e ainda deixa a comida triste sem
          motivo.
        </P>

        <Callout type="warning" title="Antes de cortar qualquer grupo de alimento">
          Não corte leite, glúten ou grãos por tempo indeterminado por conta própria. Teste, observe e
          leve o resultado a um médico ou nutricionista. Dieta restritiva sem acompanhamento tira
          nutriente e é o caminho mais comum para o problema virar outro.
        </Callout>
      </PdfContentPage>

      {/* ── p13 · aviso legal e encerramento ──────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={13} pageNumberColor={C.base} kicker="Pra terminar" title="Uma última coisa">
        <P>
          Se você fizer só a primeira semana deste guia, já vai ter feito mais do que a maioria. Os
          hábitos do começo não custam nada, não dependem de erva nenhuma e ficam com você depois que
          o protocolo acabar.
        </P>
        <P>
          E guarde o papel das anotações. Ele vale mais que a sua memória e, se um dia precisar de
          consulta, é a melhor coisa que você pode levar junto.
        </P>

        <Callout type="warning" title="Aviso importante">
          Este material é informativo e de tradição caseira. Não substitui consulta, diagnóstico ou
          tratamento médico e não deve ser usado para interromper nenhum remédio prescrito. Erva
          interage com medicamento: se você toma remédio de uso contínuo, está grávida, amamentando,
          ou tem doença de fígado, rim, coração, intestino ou vesícula, converse com o seu médico
          antes de usar qualquer preparo daqui. Dor forte na barriga, febre, vômito persistente,
          sangue nas fezes, perda de peso sem explicação ou mudança do intestino que não volta ao
          normal exigem avaliação médica.
        </Callout>

        <Spacer size="sm" />
        <Assinatura cor={C} frase="Uma coisa por vez, filha." />
      </PdfContentPage>
    </>
  );
}
