/**
 * PDF — /pdf/caderno · O Caderno da Avó Yuki · Produto principal · R$ 47,90
 *
 * Oferta e estrutura em Workspace Produtos/Ofertas/avo-yuki/_Inteligencia/oferta.md
 * Paleta kakishibu, espelhando a página de vendas em Ofertas/avo-yuki/Site/index.html
 *
 * EM CONSTRUÇÃO. São 9 blocos de 8 receitas, 72 no total.
 * Escritos até agora: bloco 1 (digestão e inchaço) e bloco 2 (fígado), receitas 1 a 16.
 * Faltam os blocos 3 a 9. O número 72 do subtítulo e do índice só vale quando todos existirem.
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';
import { DesignPage } from '@/components/ebook/DesignPage';
import { Callout, Divider, Spacer } from '@/components/ebook/VisualElements';
import { CORES, faixaDe, Item, Titulo, P, Assinatura } from '@/components/ebook/sono';

const C = CORES.caderno;
const F = faixaDe(C);

/** Os 9 blocos por sintoma. A contagem é a prova verificável da promessa. */
const BLOCOS = [
  ['Digestão e inchaço', 8],
  ['Fígado', 8],
  ['Circulação e pernas', 8],
  ['Dor e articulação', 8],
  ['Pulmão e tosse', 8],
  ['Imunidade', 8],
  ['Pele', 8],
  ['Ansiedade e cansaço', 8],
  ['Sono', 8],
] as const;

/**
 * Alerta que abre um bloco.
 * Existe porque o Callout não tem margem vertical própria e o Item só tem
 * margem embaixo: alerta seguido de cartão gruda um no outro. Centralizar o
 * espaçamento aqui evita repetir o erro em cada bloco novo.
 */
function AvisoDoBloco({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Callout type="warning" title={title} className="mb-3.5">
      {children}
    </Callout>
  );
}

/** Linha de atalho: da queixa principal para o bloco por onde comecar. */
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

function Indice() {
  return (
    <div className="mt-1 overflow-hidden rounded-xl border" style={{ borderColor: `${C.base}22` }}>
      {BLOCOS.map(([nome, n], i) => (
        <div
          key={nome}
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
              {nome}
            </span>
          </span>
          <span className="text-[11.5px] font-medium" style={{ color: C.suave }}>
            {n} receitas
          </span>
        </div>
      ))}
    </div>
  );
}

export default function EbookCaderno() {
  return (
    <>
      {/*
        A capa deixou de ser renderizada pelo componente Capa e passou a ser a
        arte aprovada em 3 de setembro de 2026, em public/caderno-avo-yuki.jpg.
        O motivo é consistência: é a mesma imagem que vai na página de vendas e
        na tela do tablet, então o comprador abre o PDF e vê exatamente a capa
        que viu antes de comprar.

        A arte é 2:3 e a página é A4, que é um pouco mais larga. Com
        backgroundSize cover, a imagem preenche a largura e perde cerca de 3 por
        cento em cima e embaixo, o que cai só na margem. A cor de fundo fica
        atrás como rede de segurança para impressão.
      */}
      <DesignPage
        bg={C.base}
        style={{
          backgroundImage: 'url(/caderno-avo-yuki.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* ── p1 · abertura ─────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={1} pageNumberColor={C.base}
        kicker="Antes de tudo"
        title="Quem eu sou e o que este caderno não é"
      >
        <P>
          Eu não inventei nada do que está aqui dentro. Isto é o que a minha avó fazia lá no Japão,
          o que a minha mãe continuou fazendo, e o que eu venho fazendo há mais de quarenta anos na
          minha cozinha.
        </P>
        <P>
          O que eu fiz foi outra coisa: anotei. Anotei a quantidade, anotei a hora, anotei quantas
          vezes por semana, e anotei o que não pode ser misturado com o que. É essa última parte que
          quase nunca está escrita em lugar nenhum, e é a que mais importa.
        </P>

        <Callout type="warning" title="O que este caderno não promete">
          Eu não digo em quantos dias você vai sentir alguma coisa, e desconfie de quem disser.
          Isto não cura, não substitui remédio e não substitui médico. É comida, é chá e é banho,
          feito do jeito certo e na quantidade certa.
        </Callout>

        <Titulo cor={C}>Por que separado por sintoma</Titulo>
        <P>
          Quase todo livro de receita caseira é organizado por planta. Você abre e encontra a
          camomila, e aí precisa descobrir sozinha para que ela serve. Aqui é o contrário: você
          procura o que está te incomodando hoje, abre o bloco, e escolhe ali dentro.
        </P>
        <P>
          São nove blocos. Dentro de cada um, a primeira receita é sempre a mais suave e a mais
          barata de fazer. As últimas são as mais fortes, e eu deixo por último de propósito.
        </P>

        <Titulo cor={C}>O que você já tem em casa</Titulo>
        <P>
          Abra o seu armário antes de sair comprando. Sal, mel, canela, cravo, louro, gengibre,
          limão, aveia, arroz e azeite já resolvem boa parte deste caderno, e quase toda casa tem
          esses dez. O resto se acha na feira, no mercado ou na banca de ervas, e nada aqui pede loja
          de suplemento nem cápsula.
        </P>
        <P>
          Se for comprar erva seca, compre pouco de cada vez. Erva guardada por mais de um ano perde
          o cheiro, e erva que não tem cheiro não tem mais o que dar.
        </P>
      </PdfContentPage>

      {/* ── p2 · o mecanismo ──────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={2} pageNumberColor={C.base}
        kicker="A parte que quase ninguém conta"
        title="No Japão a gente lê a barriga"
      >
        <P>
          Lá, quando alguém não está bem e ainda não está doente, a primeira coisa que se olha é a
          barriga. Não o pulso, não a língua: a barriga. Se ela está dura, se está estufada, se está
          fria ao toque, se dói quando aperta de leve. É de lá que sai o resto.
        </P>

        <Callout type="info" title="Energia, sangue e água">
          A tradição da minha avó lê tudo por três coisas. A energia, que é o que te levanta de
          manhã. O sangue, que é o que leva e traz. E a água, que é o que precisa circular e sair.
          Quando uma das três está fraca, parada ou acumulada, o corpo avisa antes de adoecer — e
          quase sempre avisa pela barriga.
        </Callout>

        <Titulo cor={C}>O corpo avisa antes</Titulo>
        <P>
          Existe um nome lá para o estado de quem não está doente mas também não está bem. É aquele
          período em que você está cansada sem motivo, inchada sem ter comido nada demais, dormindo
          mal sem ter mudado nada. Não é doença ainda, e é exatamente aí que dá para fazer alguma
          coisa em casa.
        </P>
        <P>
          É para esse estado que este caderno foi escrito. Passou disso, é com o médico, e eu digo
          isso em todas as páginas em que precisa ser dito.
        </P>

        <Divider />

        <Titulo cor={C}>As três perguntas antes de escolher</Titulo>
        <P>
          Antes de fazer qualquer receita, responda três coisas. Você toma algum remédio todo dia?
          Você está grávida ou amamentando? Você tem pressão alta, diabetes, problema de rim ou de
          fígado já diagnosticado?
        </P>
        <P>
          Se respondeu sim para qualquer uma, leia o aviso de atenção de cada receita antes de
          fazer. Ele está em toda receita que precisa, e não é formalidade.
        </P>

        <Titulo cor={C}>Como reconhecer cada uma das três</Titulo>
        <P>
          Energia fraca é o cansaço que não passa com sono, a voz que sai baixa, o frio que chega
          antes nos outros, a vontade de sentar no meio da tarefa. Sangue parado é a dor que fixa
          sempre no mesmo lugar, o roxo que aparece fácil, a pele sem viço e a mão que demora a
          esquentar. Água acumulada é o inchaço, o peso no corpo, a cabeça pesada em dia úmido e a
          marca do dente na beirada da língua.
        </P>
        <P>
          Não precisa acertar de primeira. Isto serve para você desconfiar por onde começar, e o
          próprio corpo corrige o palpite depois de alguns dias.
        </P>
      </PdfContentPage>

      {/* ── p3 · como usar e índice ───────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={3} pageNumberColor={C.base}
        kicker="Como usar"
        title="Os nove blocos, e por onde começar"
      >
        <P>
          Vá direto no bloco que descreve o que você está sentindo. Comece pela primeira receita
          dele, faça por alguns dias, e só depois passe para a próxima. Fazer três de uma vez não
          acelera nada e tira de você a única informação que interessa, que é saber qual funcionou.
        </P>

        <Indice />

        <Spacer size="sm" />

        <Callout type="tip" title="A regra da quantidade">
          Toda receita aqui tem quantidade medida e limite de quantas vezes por semana. Erva não é
          inofensiva por ser natural: é justamente por funcionar que ela tem dose. Dobrar a
          quantidade não dobra o efeito, só aumenta o risco.
        </Callout>

        <Spacer size="sm" />

        <Titulo cor={C}>Se você só quiser saber por onde começar</Titulo>
        <Atalho queixa="Barriga estufa depois de comer" onde="Bloco 1, receita 1. É a mais simples do caderno inteiro." />
        <Atalho queixa="Corpo pesado e boca amarga" onde="Bloco 2, e leia o alerta que abre o bloco antes de tudo." />
        <Atalho queixa="Perna pesada no fim do dia" onde="Bloco 3, receita 18, que não se toma e não custa nada." />
        <Atalho queixa="Dorme mal ou acorda de madrugada" onde="Bloco 9, e comece pelos fundamentos, não pelos dois chás." />
      </PdfContentPage>

      {/* ── p4 · bloco 1, receitas 1 a 3 ──────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={4} pageNumberColor={C.base}
        kicker="Bloco 1 · Receitas 1 a 8"
        title="Digestão e inchaço"
        subtitle="Pra barriga que estufa depois de comer e para a roupa que aperta no fim da tarde."
      >
        <Item
          cor={C} numero={1} nome="Chá de gengibre depois da refeição"
          lista={['2 rodelas finas de gengibre fresco', '200ml de água']}
          texto="Ferve o gengibre na água por três minutos. Desliga, espera amornar e toma sentada, logo depois do almoço."
          porque="O gengibre aquece e ajuda o estômago a esvaziar. É o preparo mais simples do caderno e o que eu mais faço."
          atencao="No máximo duas xícaras por dia. Quem toma anticoagulante ou remédio para pressão deve falar com o médico antes de usar gengibre todo dia."
        />
        <Item
          cor={C} numero={2} nome="Água de erva-doce"
          lista={['1 colher de chá de semente de erva-doce', '250ml de água fervida']}
          texto="Amassa as sementes com o fundo da colher, cobre com a água já fervida e fora do fogo, tampa por dez minutos. Coa e toma morno."
          porque="A erva-doce é o que a minha avó dava para barriga estufada de criança. Ajuda a soltar o gás preso, que é metade do inchaço."
          atencao="Evite em gestação e amamentação. Não usar mais de três xícaras por dia."
        />
        <Item
          cor={C} numero={3} nome="Compressa morna na barriga"
          lista={['1 toalha de rosto', 'água morna', '10 minutos deitada']}
          texto="Molha a toalha na água morna, torce bem e deita com ela sobre a barriga por dez minutos. Não precisa beber nada."
          porque="É a receita que não se toma, e é a que eu indico para quem já tomou remédio demais. O calor relaxa a parede da barriga."
          atencao="Água morna, nunca quente. Não usar sobre a pele com ferida, queimadura ou vermelhidão."
        />
      </PdfContentPage>

      {/* ── p5 · bloco 1, receitas 4 a 6 ──────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={5} pageNumberColor={C.base}
        kicker="Bloco 1 · Continuação"
      >
        <Item
          cor={C} numero={4} nome="Chá de hortelã depois de comer"
          lista={['5 folhas de hortelã fresca', '250ml de água']}
          texto="Água fervida, fogo desligado, folhas dentro, tampa por sete minutos. Coa e toma morno."
          porque="Alivia o peso depois de comida gordurosa e é o mais fácil de ter em casa, porque hortelã cresce em qualquer vaso."
          atencao="Quem tem refluxo ou azia frequente deve evitar: a hortelã relaxa a válvula do estômago e pode piorar."
        />
        <Item
          cor={C} numero={5} nome="Caldo claro do fim do dia"
          lista={['1 cenoura', '1 pedaço de abóbora', '1 fatia fina de gengibre', '600ml de água', 'sal a gosto']}
          texto="Ferve tudo por vinte minutos, coa e toma só o caldo, morno, no lugar do jantar pesado."
          porque="Lá em casa, quando a barriga não estava boa, ninguém pulava a refeição: trocava por caldo. Alimenta sem dar trabalho."
          atencao="Quem tem restrição de sal deve usar pouco ou nenhum. Não substituir mais de uma refeição por dia."
        />
        <Item
          cor={C} numero={6} nome="Água morna com limão pela manhã"
          lista={['suco de meio limão', '250ml de água morna']}
          texto="Espreme o limão na água morna e toma em jejum, devagar, antes do café."
          porque="Acorda o intestino sem forçar. É o mais barato do caderno e o mais fácil de manter."
          atencao="Enxágue a boca com água pura depois. O ácido do limão desgasta o esmalte do dente com o uso diário. Quem tem gastrite ou úlcera deve evitar em jejum."
        />
      </PdfContentPage>

      {/* ── p6 · bloco 1, receitas 7 e 8 ──────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={6} pageNumberColor={C.base}
        kicker="Bloco 1 · Fim"
      >
        <Item
          cor={C} numero={7} nome="Chá de casca de tangerina seca"
          lista={['a casca de 1 tangerina, seca ao sol por 2 dias', '250ml de água']}
          texto="Ferve a casca por cinco minutos, coa e toma morno depois da refeição maior do dia."
          porque="É a receita mais antiga que eu tenho anotada. A casca seca é mais forte que a fresca, e é por isso que se guarda."
          atencao="Use só casca de fruta bem lavada e sem cera. Evite se estiver com a garganta muito seca ou com tosse seca persistente."
        />
        <Item
          cor={C} numero={8} nome="Chá de camomila com erva-doce"
          lista={['1 colher de chá de camomila seca', 'meia colher de chá de erva-doce', '250ml de água']}
          texto="Água fervida, fogo desligado, as duas juntas, tampa por dez minutos. Coa e toma no fim da tarde."
          porque="É a mistura para quando a barriga incomoda por causa de nervoso, e não por causa de comida. As duas trabalham juntas."
          atencao="Quem tem alergia a plantas da família da margarida deve evitar camomila. Não usar junto com remédio calmante sem falar com o médico."
        />

        <Callout type="tip" title="Se você só fizer uma coisa deste bloco">
          Faça a caminhada curta depois do almoço e deixe a água para fora da refeição. Nenhuma das
          duas é receita, nenhuma custa nada, e as duas juntas costumam mudar mais a barriga da tarde
          do que qualquer chá desta página. Os chás entram depois, quando essas duas já forem hábito.
        </Callout>
      </PdfContentPage>

      {/* ── p7 · bloco 2, receitas 9 e 10 ─────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={7} pageNumberColor={C.base}
        kicker="Bloco 2 · Receitas 9 a 16"
        title="Fígado"
        subtitle="Pra quando o corpo está pesado, a boca amarga e a comida gordurosa começou a cair mal."
      >
        <AvisoDoBloco title="Leia antes deste bloco inteiro">
          Este é o bloco que mais pede cuidado. Quase toda planta amarga que ajuda o fígado também
          mexe com a vesícula. Quem tem ou já teve pedra na vesícula não deve fazer nenhuma receita
          deste bloco sem falar com o médico antes.
        </AvisoDoBloco>
        <Item
          cor={C} numero={9} nome="Chá de boldo"
          lista={['1 folha de boldo', '250ml de água']}
          texto="Água fervida, fogo desligado, a folha dentro, tampa por dez minutos. Coa e toma morno depois da refeição pesada."
          porque="É o mais conhecido e o mais mal usado. Uma folha basta, e não é para tomar todo dia."
          atencao="No máximo três dias seguidos, uma xícara por dia. Não usar em gestação, amamentação, pedra na vesícula ou doença de fígado já diagnosticada."
        />
        <Item
          cor={C} numero={10} nome="Água de beterraba com limão"
          lista={['meia beterraba crua fatiada', 'suco de meio limão', '400ml de água']}
          texto="Bate no liquidificador, coa e toma morno ou gelado, uma vez ao dia, pela manhã."
          porque="A beterraba é da terra e a minha avó chamava de comida de sangue. Aqui ela entra crua, que é como ela rende mais."
          atencao="Quem tem diabetes deve contar o açúcar da beterraba. A urina pode ficar avermelhada por um ou dois dias, e isso é normal."
        />
      </PdfContentPage>

      {/* ── p8 · bloco 2, receitas 11 a 13 ────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={8} pageNumberColor={C.base}
        kicker="Bloco 2 · Continuação"
      >
        <Item
          cor={C} numero={11} nome="Chá leve de cúrcuma"
          lista={['meia colher de chá de cúrcuma em pó', '1 pitada de pimenta-do-reino', '250ml de água']}
          texto="Ferve a água, desliga, mistura a cúrcuma e a pitada de pimenta. Toma morno, no máximo uma vez por dia."
          porque="A pimenta não é tempero aqui: sem ela o corpo aproveita muito pouco da cúrcuma."
          atencao="Não usar com pedra na vesícula. Quem toma anticoagulante deve falar com o médico. Máximo cinco dias por semana."
        />
        <Item
          cor={C} numero={12} nome="Caldo de missô leve"
          lista={['1 colher de chá de missô', '250ml de água quente', '1 pedaço pequeno de cebolinha']}
          texto="Dissolve o missô na água quente fora do fogo, nunca fervendo. Toma no começo da refeição."
          porque="É o que se toma todo dia lá, e é o mais suave deste bloco. Fervido, perde o que tem de bom."
          atencao="É salgado. Quem tem pressão alta ou restrição de sódio deve usar meia colher ou trocar por outra receita deste bloco."
        />
        <Item
          cor={C} numero={13} nome="Chá de dente-de-leão"
          lista={['1 colher de chá da folha seca', '250ml de água']}
          texto="Água fervida, fogo desligado, tampa por dez minutos. Coa e toma morno, uma vez ao dia."
          porque="Cresce em terreno baldio e quase ninguém olha para ela. É amarga, e é a amargura que faz o trabalho."
          atencao="Aumenta a produção de urina. Quem toma diurético ou remédio para pressão deve falar com o médico. Não usar com pedra na vesícula."
        />
      </PdfContentPage>

      {/* ── p9 · bloco 2, receitas 14 a 16 ────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={9} pageNumberColor={C.base}
        kicker="Bloco 2 · Fim"
      >
        <Item
          cor={C} numero={14} nome="Chá de alecrim"
          lista={['1 ramo pequeno de alecrim fresco', '250ml de água']}
          texto="Água fervida, fogo desligado, o ramo dentro, tampa por sete minutos. Toma pela manhã ou no começo da tarde."
          porque="Levanta sem agitar, e cai bem em quem acorda pesada. É o único deste bloco que não é amargo."
          atencao="Não usar em gestação. Quem tem pressão alta deve usar no máximo três vezes por semana."
        />
        <Item
          cor={C} numero={15} nome="Chá verde fraco da manhã"
          lista={['meia colher de chá de chá verde', '250ml de água a 70 graus, não fervendo']}
          texto="Água quente mas não fervente, dois minutos só, e coa. Passou disso fica amargo e pesado no estômago."
          porque="É o chá de todo dia lá em casa. Fraco e curto, do jeito que se toma no Japão, não do jeito que se faz aqui."
          atencao="Tem cafeína: não tomar à noite. Não tomar junto com remédio de ferro nem na hora da refeição, porque atrapalha a absorção do ferro dos alimentos."
        />
        <Item
          cor={C} numero={16} nome="Compressa morna do lado direito"
          lista={['1 toalha pequena', 'água morna', '15 minutos deitada']}
          texto="Toalha molhada em água morna e bem torcida, sobre o lado direito das costelas, quinze minutos, no fim do dia."
          porque="Fecha o bloco com o que não se bebe. Para quem já toma remédio demais, é a única coisa daqui que não soma com nada."
          atencao="Água morna, nunca quente. Se houver dor forte, febre ou pele amarelada, não faça compressa nenhuma e procure um médico no mesmo dia."
        />
      </PdfContentPage>

      {/* ── p10 · bloco 3, receitas 17 e 18 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={10} pageNumberColor={C.base}
        kicker="Bloco 3 · Receitas 17 a 24"
        title="Circulação e pernas"
        subtitle="Pra perna pesada no fim do dia, pé inchado e a marca da meia que não sai."
      >
        <AvisoDoBloco title="Antes deste bloco">
          Perna inchada dos dois lados no fim do dia é uma coisa. Perna inchada de um lado só, quente,
          vermelha ou dolorida é outra, e não se trata em casa: procure um médico no mesmo dia. Nada
          deste bloco serve para esse caso.
        </AvisoDoBloco>
        <Item
          cor={C} numero={17} nome="Escalda-pés de sal grosso"
          lista={['1 bacia com água morna', '2 colheres de sopa de sal grosso']}
          texto="Dissolve o sal na água morna até cobrir o tornozelo. Quinze minutos sentada, no fim do dia. Seca bem, principalmente entre os dedos."
          porque="A água morna com sal fica mais pesada e o calor se mantém por mais tempo. É o mais simples do bloco e o que eu mais faço."
          atencao="Quem tem diabetes deve testar a água com o cotovelo, nunca com o pé, e conferir a pele depois. Não fazer se houver ferida, corte ou vermelhidão no pé."
        />
        <Item
          cor={C} numero={18} nome="Pernas na parede"
          lista={['1 parede livre', '1 almofada fina', '10 minutos']}
          texto="Deita no chão de lado para a parede, sobe as pernas apoiadas nela, com a almofada embaixo do quadril. Dez minutos, respirando devagar."
          porque="Não se bebe nada e não custa nada. É a gravidade fazendo o trabalho de trazer de volta o que desceu o dia inteiro."
          atencao="Quem tem pressão descontrolada, glaucoma ou tontura ao levantar deve começar com cinco minutos e descer devagar. Se der pressão na cabeça, pare."
        />
      </PdfContentPage>

      {/* ── p11 · bloco 3, receitas 19 a 21 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={11} pageNumberColor={C.base}
        kicker="Bloco 3 · Continuação"
      >
        <Item
          cor={C} numero={19} nome="Chá de cavalinha"
          lista={['1 colher de chá da planta seca', '250ml de água']}
          texto="Água fervida, fogo desligado, tampa por dez minutos. Coa e toma uma xícara pela manhã."
          porque="É a mais conhecida para retenção de água, e é justamente por funcionar que ela tem hora e limite."
          atencao="No máximo três dias seguidos, uma xícara por dia. Não usar em gestação, amamentação, problema de rim, nem junto com remédio diurético ou de pressão sem falar com o médico."
        />
        <Item
          cor={C} numero={20} nome="Chá de gengibre com limão"
          lista={['2 rodelas finas de gengibre', 'suco de meio limão', '250ml de água']}
          texto="Ferve o gengibre por três minutos, desliga, espera amornar e só então espreme o limão. Toma pela manhã."
          porque="O gengibre aquece de dentro e é o que a minha avó dava para quem vivia de pé gelado. O limão entra fora do fogo para não perder o que tem."
          atencao="Máximo duas xícaras por dia. Quem toma anticoagulante ou remédio de pressão deve falar com o médico antes do uso diário."
        />
        <Item
          cor={C} numero={21} nome="Banho de contraste nos pés"
          lista={['2 bacias', 'água morna numa', 'água fria na outra']}
          texto="Três minutos na morna, trinta segundos na fria, e repete três vezes. Termina sempre na fria e seca bem."
          porque="A troca de temperatura faz o vaso abrir e fechar, e é isso que move o que está parado. É o preparo mais eficiente do bloco e não usa erva nenhuma."
          atencao="Não fazer com diabetes, problema de circulação diagnosticado, ferida no pé ou pressão descontrolada. Água fria de torneira, nunca com gelo."
        />
      </PdfContentPage>

      {/* ── p12 · bloco 3, receitas 22 a 24 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={12} pageNumberColor={C.base}
        kicker="Bloco 3 · Fim"
      >
        <Item
          cor={C} numero={22} nome="Água de hibisco"
          lista={['1 colher de chá de flor de hibisco seca', '400ml de água']}
          texto="Água fervida, fogo desligado, tampa por dez minutos. Coa, deixa esfriar e toma ao longo da manhã."
          porque="É azeda e bonita, e ajuda a soltar a água parada sem ser tão forte quanto a cavalinha."
          atencao="Quem tem pressão baixa deve evitar. Não usar em gestação nem junto com remédio diurético. Máximo quatro dias por semana."
        />
        <Item
          cor={C} numero={23} nome="Massagem do pé para o joelho"
          lista={['1 colher de sopa de óleo de girassol ou de gergelim', 'as duas mãos']}
          texto="Óleo morno na mão, e desliza sempre do pé em direção ao joelho, nunca no sentido contrário. Cinco minutos em cada perna, à noite."
          porque="O sentido importa mais que a força. Sempre para cima, porque é para onde o corpo quer levar o que ficou parado embaixo."
          atencao="Não massagear por cima de variz saliente, nem em perna quente, vermelha, endurecida ou dolorida de um lado só. Nesses casos, médico primeiro."
        />
        <Item
          cor={C} numero={24} nome="Chá de alecrim com casca de laranja"
          lista={['1 ramo pequeno de alecrim', 'a casca de meia laranja', '300ml de água']}
          texto="Ferve a casca por cinco minutos, desliga, joga o alecrim, tampa por cinco. Coa e toma no começo da tarde."
          porque="Fecha o bloco com o que levanta sem agitar. É o que eu tomo quando o corpo está pesado mas ainda falta meio dia de trabalho."
          atencao="Não usar em gestação. Quem tem pressão alta deve limitar a três vezes por semana. Use casca de laranja bem lavada e sem cera."
        />
      </PdfContentPage>

      {/* ── p13 · bloco 4, receitas 25 e 26 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={13} pageNumberColor={C.base}
        kicker="Bloco 4 · Receitas 25 a 32"
        title="Dor e articulação"
        subtitle="Pra joelho que reclama ao levantar, ombro travado de manhã e coluna que pesa no fim do dia."
      >
        <AvisoDoBloco title="Antes deste bloco">
          Dor que vem devagar e piora com o uso é uma coisa. Dor que apareceu de repente, com inchaço,
          vermelhidão, calor ou febre, é outra, e pede médico antes de qualquer coisa. Nada daqui
          substitui remédio de dor prescrito, e nenhuma receita deste bloco deve ser usada para
          aguentar uma dor que está aumentando.
        </AvisoDoBloco>
        <Item
          cor={C} numero={25} nome="Compressa morna de gengibre"
          lista={['1 pedaço de gengibre ralado', '1 litro de água quente', '1 pano de prato']}
          texto="Deixa o gengibre na água quente por dez minutos, molha o pano, torce bem e põe sobre o lugar que dói. Vinte minutos, trocando quando esfriar."
          porque="É a receita que a minha avó fazia para o joelho dela. O calor solta o que está travado, e o gengibre faz a pele esquentar por dentro."
          atencao="Água morna, nunca fervendo, e teste no antebraço antes. Não usar sobre pele ferida, nem em articulação inchada e vermelha, que pede frio e médico."
        />
        <Item
          cor={C} numero={26} nome="Leite morno com cúrcuma"
          lista={['200ml de leite', 'meia colher de chá de cúrcuma', '1 pitada de pimenta-do-reino', '1 colher de chá de mel']}
          texto="Aquece o leite sem ferver, mistura a cúrcuma e a pitada de pimenta, adoça e toma à noite."
          porque="A pimenta parece detalhe e não é: sem ela o corpo aproveita muito pouco da cúrcuma. O leite morno faz o mesmo trabalho da gordura."
          atencao="Não usar com pedra na vesícula. Quem toma anticoagulante deve falar com o médico. Máximo cinco vezes por semana."
        />
      </PdfContentPage>

      {/* ── p14 · bloco 4, receitas 27 a 29 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={14} pageNumberColor={C.base}
        kicker="Bloco 4 · Continuação"
      >
        <Item
          cor={C} numero={27} nome="A compressa fria das primeiras horas"
          lista={['1 saco de ervilha congelada', '1 pano fino']}
          texto="Nas primeiras horas depois de torcer, bater ou forçar, é frio e não calor. Quinze minutos com o pano entre o gelado e a pele, algumas vezes ao dia."
          porque="Está aqui de propósito, porque é o erro mais comum: quase todo mundo põe calor logo depois de machucar, e calor em coisa recém-inchada piora."
          atencao="Nunca encoste gelo direto na pele. Não usar mais de vinte minutos seguidos. Quem tem diabetes ou pouca sensibilidade no local deve evitar."
        />
        <Item
          cor={C} numero={28} nome="Banho de sal amargo"
          lista={['1 xícara de sal amargo', '1 banheira com água morna, ou 1 bacia grande']}
          texto="Dissolve o sal na água morna e fica de quinze a vinte minutos. Se não tiver banheira, faz na bacia só para os pés e as mãos."
          porque="É o preparo mais antigo que existe para corpo dolorido, e continua sendo o que mais gente me diz que ajudou."
          atencao="Não beber. Quem tem diabetes, pressão alta, problema de rim ou de coração deve falar com o médico antes de banho morno demorado. Não usar sobre ferida aberta."
        />
        <Item
          cor={C} numero={29} nome="Óleo morno de gergelim para massagem"
          lista={['2 colheres de sopa de óleo de gergelim', '1 tigela pequena']}
          texto="Amorna a tigela em banho-maria, nunca no fogo direto. Massageia a articulação em movimentos redondos por cinco minutos, à noite."
          porque="O óleo de gergelim morno é a base da massagem caseira lá em casa. O calor entra devagar e dura mais que o da compressa."
          atencao="Teste uma gota no antebraço e espere um dia antes de usar em área grande. Não usar sobre pele ferida, nem em perna quente, vermelha ou dolorida de um lado só."
        />
      </PdfContentPage>

      {/* ── p15 · bloco 4, receitas 30 a 32 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={15} pageNumberColor={C.base}
        kicker="Bloco 4 · Fim"
      >
        <Item
          cor={C} numero={30} nome="Chá de folha de louro"
          lista={['3 folhas de louro secas', '400ml de água']}
          texto="Ferve as folhas por cinco minutos, desliga, tampa por dez. Coa e toma morno, uma xícara ao dia, no fim da tarde."
          porque="Todo mundo tem louro na cozinha e quase ninguém sabe que ele é chá. É o mais barato deste bloco."
          atencao="No máximo cinco dias seguidos. Não usar em gestação, amamentação, nem antes de cirurgia. Quem toma remédio para diabetes deve falar com o médico."
        />
        <Item
          cor={C} numero={31} nome="Compressa de repolho no joelho"
          lista={['3 folhas grandes de repolho', '1 rolo de macarrão ou garrafa', '1 pano para amarrar']}
          texto="Amassa as folhas com o rolo até soltarem o suco, envolve o joelho e amarra com o pano. Deixa uma hora, sentada."
          porque="Parece coisa de outro tempo e é, mas é o que se fazia antes de existir bolsa térmica. Refresca e desincha sem molhar nada."
          atencao="Não usar sobre pele ferida, cortada ou irritada. Se aparecer coceira ou vermelhidão, retire e lave com água."
        />
        <Item
          cor={C} numero={32} nome="O aquecimento antes de levantar"
          lista={['5 minutos', 'a própria cama']}
          texto="Antes de pôr o pé no chão, mexe o tornozelo dez vezes para cada lado, dobra e estica o joelho dez vezes, e só então levanta devagar."
          porque="Fecha o bloco com o que não se toma e não se passa. Articulação parada a noite inteira não gosta de receber o peso do corpo de uma vez."
          atencao="Se houver tontura ao sentar na beirada da cama, espere sentada mais um pouco antes de levantar. Dor forte ao mover, pare e procure um médico."
        />
      </PdfContentPage>

      {/* ── p16 · bloco 5, receitas 33 e 34 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={16} pageNumberColor={C.base}
        kicker="Bloco 5 · Receitas 33 a 40"
        title="Pulmão e tosse"
        subtitle="Pra garganta arranhando, tosse que não passa e peito carregado depois do resfriado."
      >
        <AvisoDoBloco title="Antes deste bloco">
          Nada daqui serve para falta de ar, chiado no peito, febre alta, dor ao respirar ou catarro
          com sangue. Qualquer um desses é médico no mesmo dia. Tosse que passa de três semanas
          também, mesmo sem nenhum outro sintoma.
        </AvisoDoBloco>
        <Item
          cor={C} numero={33} nome="Vapor de água quente"
          lista={['1 tigela funda', 'água bem quente', '1 toalha']}
          texto="Põe a tigela numa mesa firme, cobre a cabeça com a toalha e respira o vapor por cinco minutos, com o rosto a um palmo da água."
          porque="É o mais simples e o que mais alivia garganta seca. O vapor amolece o catarro grudado, que é o que faz a tosse não render."
          atencao="A tigela fica na mesa, nunca no colo, por causa de queimadura. Não deixe criança fazer sozinha. Quem tem asma deve falar com o médico antes."
        />
        <Item
          cor={C} numero={34} nome="Gargarejo de água morna com sal"
          lista={['1 copo de água morna', 'meia colher de chá de sal']}
          texto="Dissolve o sal na água morna, gargareja por trinta segundos e cospe. Repete três vezes ao dia enquanto a garganta estiver arranhando."
          porque="Alivia a garganta sem nada para engolir, e é o único do bloco que serve para quem não pode tomar quase nada."
          atencao="Não engolir. Quem tem restrição de sódio deve usar menos sal ou trocar por água morna pura, que ajuda quase igual."
        />
      </PdfContentPage>

      {/* ── p17 · bloco 5, receitas 35 a 37 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={17} pageNumberColor={C.base}
        kicker="Bloco 5 · Continuação"
      >
        <Item
          cor={C} numero={35} nome="Xarope de mel com limão"
          lista={['3 colheres de sopa de mel', 'suco de meio limão']}
          texto="Mistura os dois num pote pequeno e toma uma colher de chá, devagar, até três vezes ao dia. Guarda na geladeira por até cinco dias."
          porque="É o xarope da casa da minha avó. Toma-se devagar de propósito: parte do alívio é o mel passando pela garganta, não o que ele faz depois."
          atencao="Nunca dar mel a criança menor de 1 ano, em nenhuma quantidade e em nenhuma receita. Quem tem diabetes deve contar o açúcar do mel."
        />
        <Item
          cor={C} numero={36} nome="Chá de tomilho"
          lista={['1 colher de chá de tomilho seco', '250ml de água']}
          texto="Água fervida, fogo desligado, tampa por dez minutos. Coa e toma morno, até duas xícaras ao dia."
          porque="É o tempero que virou remédio. Ajuda a soltar o catarro e é mais suave que qualquer xarope de farmácia."
          atencao="Não usar em gestação nem amamentação. Máximo sete dias seguidos. Quem tem alergia a orégano ou manjericão pode reagir ao tomilho."
        />
        <Item
          cor={C} numero={37} nome="Compressa morna no peito"
          lista={['1 pano de prato', 'água morna', '10 minutos']}
          texto="Pano molhado em água morna e bem torcido, sobre o peito, por dez minutos, sentada e recostada. Nunca deitada de barriga para cima."
          porque="Solta o peito carregado sem nada para tomar. É o que eu faço quando já tomei chá demais no mesmo dia."
          atencao="Água morna, nunca quente, e teste no antebraço. Se aparecer falta de ar ou aperto durante a compressa, tire e procure um médico."
        />
      </PdfContentPage>

      {/* ── p18 · bloco 5, receitas 38 a 40 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={18} pageNumberColor={C.base}
        kicker="Bloco 5 · Fim"
      >
        <Item
          cor={C} numero={38} nome="Xarope de cebola com mel"
          lista={['1 cebola pequena em rodelas', '4 colheres de sopa de mel', '1 pote com tampa']}
          texto="Cobre as rodelas com o mel, tampa e deixa descansar oito horas. Coa e toma uma colher de chá, até três vezes ao dia."
          porque="É a receita mais velha que eu tenho e a que mais gente torce o nariz antes de provar. Não tem gosto de cebola depois de coado."
          atencao="Nunca dar a criança menor de 1 ano, por causa do mel. Guarde na geladeira e use em até três dias. Quem tem diabetes deve contar o açúcar."
        />
        <Item
          cor={C} numero={39} nome="Chá de gengibre com cravo"
          lista={['2 rodelas de gengibre', '2 cravos-da-índia', '250ml de água']}
          texto="Ferve os dois juntos por cinco minutos, coa e toma morno, uma xícara no fim da tarde."
          porque="Aquece o peito e é o que eu tomo quando a tosse é daquelas que piora com o frio da noite."
          atencao="Não usar em gestação. Máximo duas xícaras por dia. Quem toma anticoagulante deve falar com o médico antes do uso frequente."
        />
        <Item
          cor={C} numero={40} nome="A tigela de água no quarto"
          lista={['1 tigela de água', '1 canto do quarto']}
          texto="Deixa a tigela num canto do quarto à noite, longe da cama e da tomada. Troca a água todo dia."
          porque="Fecha o bloco com o que não se toma. Ar seco é metade da tosse de madrugada, e ninguém precisa comprar aparelho para melhorar isso."
          atencao="Troque a água diariamente e lave a tigela: água parada por dias vira criadouro de mosquito. Não use em quarto de bebê sem trocar todo dia."
        />
      </PdfContentPage>

      {/* ── p19 · bloco 6, receitas 41 e 42 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={19} pageNumberColor={C.base}
        kicker="Bloco 6 · Receitas 41 a 48"
        title="Imunidade"
        subtitle="Pra quem pega tudo que passa, demora pra melhorar e sente o inverno chegar antes dos outros."
      >
        <AvisoDoBloco title="Antes deste bloco">
          Este bloco é de rotina, não de tratamento. É para os dias em que você está bem e quer
          continuar assim. Nada daqui trata infecção, não substitui vacina, não substitui antibiótico
          e não substitui nenhum tratamento prescrito. Com febre, você para de cozinhar e procura um
          médico.
        </AvisoDoBloco>
        <Item
          cor={C} numero={41} nome="Chá morno de acerola"
          lista={['6 acerolas maduras, ou 1 colher de sopa da polpa', '250ml de água morna']}
          texto="Amassa as acerolas na água morna, nunca fervente, mexe e coa. Toma logo depois de pronto, pela manhã."
          porque="Água fervendo estraga boa parte do que a acerola tem de melhor. É por isso que ela entra morna e é bebida na hora, e não guardada."
          atencao="Quem tem gastrite, refluxo ou úlcera deve tomar depois de comer, nunca em jejum. Não guardar de um dia para o outro."
        />
        <Item
          cor={C} numero={42} nome="Alho curtido no mel"
          lista={['4 dentes de alho descascados e amassados', '4 colheres de sopa de mel', '1 pote de vidro com tampa']}
          texto="Cobre o alho com o mel, tampa e deixa três dias fora da geladeira. Depois guarda na geladeira e toma meia colher de chá pela manhã."
          porque="Curtir tira a ardência e é o que faz o alho virar rotina em vez de sacrifício. Meia colher por dia é o suficiente."
          atencao="Nunca dar mel a criança menor de 1 ano. Quem toma anticoagulante deve falar com o médico, e quem for operar deve suspender uma semana antes. Diabéticos contam o açúcar do mel."
        />
      </PdfContentPage>

      {/* ── p20 · bloco 6, receitas 43 a 45 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={20} pageNumberColor={C.base}
        kicker="Bloco 6 · Continuação"
      >
        <Item
          cor={C} numero={43} nome="Caldo de shiitake"
          lista={['4 shiitakes secos', '600ml de água', '1 pitada de sal']}
          texto="Deixa os cogumelos de molho na água por trinta minutos, ferve tudo junto por vinte, coa e toma só o caldo, morno."
          porque="Este é o mais japonês do caderno. Lá o caldo de cogumelo é o que se toma no começo do frio, e a água do molho entra na panela junto, porque é onde fica o gosto."
          atencao="Cozinhe bem: shiitake cru ou malcozido pode causar reação na pele em algumas pessoas. Quem tem gota ou ácido úrico alto deve usar no máximo uma vez por semana."
        />
        <Item
          cor={C} numero={44} nome="Iogurte natural com linhaça"
          lista={['1 pote de iogurte natural sem açúcar', '1 colher de chá de linhaça moída na hora']}
          texto="Mistura a linhaça no iogurte e come no café da manhã. Moa na hora, porque moída de véspera perde o que tem de bom."
          porque="Metade da defesa do corpo mora no intestino, e o que cuida do intestino é fermentado com fibra. É o mais simples de manter todo dia."
          atencao="Beba água ao longo do dia quando usar linhaça, senão ela trava em vez de soltar. Quem toma anticoagulante deve falar com o médico antes do uso diário."
        />
        <Item
          cor={C} numero={45} nome="Chá de canela com cravo"
          lista={['1 pau de canela pequeno', '3 cravos-da-índia', '300ml de água']}
          texto="Ferve os dois juntos por cinco minutos, desliga e tampa por cinco. Coa e toma morno, no fim da tarde do dia frio."
          porque="É o cheiro do inverno lá em casa. Aquece por dentro e é o que eu faço quando o frio chega antes da roupa quente sair do armário."
          atencao="Não usar em gestação. Máximo quatro vezes por semana, porque canela em excesso e por muito tempo não é indiferente ao fígado. Quem toma remédio para diabetes deve falar com o médico."
        />
      </PdfContentPage>

      {/* ── p21 · bloco 6, receitas 46 a 48 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={21} pageNumberColor={C.base}
        kicker="Bloco 6 · Fim"
      >
        <Item
          cor={C} numero={46} nome="Suco de agrião com laranja"
          lista={['1 punhado de agrião lavado', 'suco de 2 laranjas', 'meio copo de água']}
          texto="Bate tudo no liquidificador, coa se preferir e toma na hora, de manhã. Não guarda."
          porque="Agrião sozinho quase ninguém toma, e com laranja some o amargo. É o verde mais fácil de fazer entrar."
          atencao="Não usar em gestação. Quem toma anticoagulante deve manter quantidade constante de folhas verdes e falar com o médico. Lave bem o agrião em água corrente."
        />
        <Item
          cor={C} numero={47} nome="Sopa de cenoura com gengibre"
          lista={['2 cenouras', '1 fatia fina de gengibre', '600ml de água', 'sal a gosto']}
          texto="Cozinha tudo por vinte minutos, amassa com o garfo e toma morno, no jantar do dia em que o corpo pediu descanso."
          porque="Alimenta e aquece ao mesmo tempo, e é o que se dá para quem está começando a ficar gripado, antes de ficar."
          atencao="Quem tem restrição de sal deve usar pouco ou nenhum. Máximo duas fatias de gengibre por dia somando todas as receitas."
        />
        <Item
          cor={C} numero={48} nome="O prato de sete cores"
          lista={['a sua própria comida', 'nenhum ingrediente novo']}
          texto="Olha o prato antes de comer e conta as cores. Menos de três, acrescenta uma folha, um legume ou uma fruta ao lado. Uma vez por dia basta."
          porque="Fecha o bloco sem receita, de propósito. Lá em casa não se contava vitamina, contava-se cor, e dá quase no mesmo sem precisar de tabela nenhuma."
          atencao="Não vale contar cor de bala, de refrigerante nem de embalagem. E isto não substitui orientação de nutricionista para quem tem dieta prescrita."
        />
      </PdfContentPage>

      {/* ── p22 · bloco 7, receitas 49 e 50 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={22} pageNumberColor={C.base}
        kicker="Bloco 7 · Receitas 49 a 56"
        title="Pele"
        subtitle="Pra pele seca, rosto cansado e aquele inchaço em volta dos olhos que já vem de manhã."
      >
        <AvisoDoBloco title="Antes deste bloco, e isto é o mais importante">
          Nunca passe limão, laranja, lima ou qualquer cítrico na pele. É a receita caseira mais
          repetida por aí e é a mais perigosa: com o sol depois, ela queima de verdade e deixa mancha
          escura que demora anos para sair. Nenhuma receita deste bloco leva cítrico na pele, e isso
          é de propósito. Antes de usar qualquer uma, passe um pouco no antebraço e espere um dia.
        </AvisoDoBloco>
        <Item
          cor={C} numero={49} nome="Compressa fria de chá verde para os olhos"
          lista={['1 xícara de chá verde fraco, já frio', '2 discos de algodão']}
          texto="Molha o algodão no chá gelado, deita e deixa sobre os olhos fechados por dez minutos, de manhã."
          porque="O frio faz mais que o chá aqui, e o chá faz mais que a água. Juntos, tiram o inchaço da noite sem precisar de creme nenhum."
          atencao="Chá feito no dia, guardado na geladeira, nunca de véspera. Não use se estiver com o olho vermelho, com secreção ou com terçol, que é caso de médico."
        />
        <Item
          cor={C} numero={50} nome="Água de arroz para o rosto"
          lista={['meia xícara de arroz cru', '1 xícara de água', '1 pote de vidro']}
          texto="Lava o arroz, descarta a primeira água e cobre com a segunda. Deixa vinte minutos, coa e guarda. Passa no rosto limpo com algodão, à noite."
          porque="Esta é da minha avó e é a mais japonesa deste bloco. A água que sobra do arroz nunca foi jogada fora lá em casa."
          atencao="Guarde na geladeira e use em até três dias, porque azeda rápido. Se tiver cheiro forte, jogue fora. Teste no antebraço antes da primeira vez."
        />
      </PdfContentPage>

      {/* ── p23 · bloco 7, receitas 51 a 53 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={23} pageNumberColor={C.base}
        kicker="Bloco 7 · Continuação"
      >
        <Item
          cor={C} numero={51} nome="Máscara de aveia com iogurte"
          lista={['2 colheres de sopa de aveia fina', '2 colheres de sopa de iogurte natural']}
          texto="Mistura até virar pasta, espalha no rosto limpo evitando os olhos, deixa dez minutos e lava com água morna."
          porque="A aveia acalma e o iogurte amolece. É a máscara que serve para quase toda pele, inclusive a que se irrita com tudo."
          atencao="Dez minutos bastam, e mais tempo não melhora nada. Não use sobre pele ferida, descascando ou com espinha inflamada. Teste no antebraço antes."
        />
        <Item
          cor={C} numero={52} nome="Vapor de camomila no rosto"
          lista={['2 colheres de sopa de camomila seca', '1 tigela de água quente', '1 toalha']}
          texto="Cobre a camomila com a água quente, espera um minuto e fica com o rosto a dois palmos da tigela, coberta pela toalha, por cinco minutos."
          porque="Abre e amolece antes da máscara, e por isso vem antes dela quando eu faço as duas na mesma noite."
          atencao="Dois palmos de distância, nunca perto, por causa de queimadura. Quem tem rosácea, vasinho aparente no rosto ou pele muito sensível deve pular esta. No máximo uma vez por semana."
        />
        <Item
          cor={C} numero={53} nome="Óleo de gergelim para a pele seca"
          lista={['1 colher de chá de óleo de gergelim', 'a pele ainda úmida do banho']}
          texto="Esquenta o óleo entre as mãos e passa no corpo logo depois do banho, com a pele ainda molhada, antes de secar com a toalha."
          porque="Com a pele úmida o óleo segura a água que já está ali. Passado na pele seca, ele só fica por cima e não faz metade do trabalho."
          atencao="Teste uma gota no antebraço e espere um dia. Não use no rosto se você tem pele oleosa ou tendência a espinha. Cuidado no chão do banheiro, que fica escorregadio."
        />
      </PdfContentPage>

      {/* ── p24 · bloco 7, receitas 54 a 56 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={24} pageNumberColor={C.base}
        kicker="Bloco 7 · Fim"
      >
        <Item
          cor={C} numero={54} nome="Esfoliante de fubá com mel"
          lista={['1 colher de sopa de fubá fino', '1 colher de sopa de mel']}
          texto="Mistura, passa no rosto limpo com o dedo, em movimentos redondos e leves, por trinta segundos. Lava com água morna."
          porque="Trinta segundos é de propósito. Esfoliante caseiro erra quase sempre por excesso, não por falta."
          atencao="Uma vez por semana, no máximo. Não use sobre espinha inflamada, pele ferida ou queimada de sol. Se arder, lave na hora."
        />
        <Item
          cor={C} numero={55} nome="Máscara de mamão"
          lista={['2 colheres de sopa de mamão maduro amassado']}
          texto="Espalha no rosto limpo, evitando a área dos olhos, deixa dez minutos e lava com água morna."
          porque="O mamão bem maduro amolece a pele sozinho, sem esfregar nada. É a alternativa para quem não pode usar esfoliante."
          atencao="No máximo dez minutos e uma vez por semana. Quem tem alergia a látex pode reagir ao mamão. Teste no antebraço antes da primeira vez."
        />
        <Item
          cor={C} numero={56} nome="A sombra e o chapéu"
          lista={['1 chapéu', 'a calçada do lado da sombra']}
          texto="Andar pelo lado sombreado da rua e usar chapéu nos horários de sol forte. Todo dia, sem exceção."
          porque="Fecha o bloco com a verdade que ninguém quer ouvir: nenhuma máscara deste caderno faz pela sua pele metade do que o sol desfaz. Sombra é de graça e é o que mais funciona."
          atencao="Isto não substitui protetor solar, e não é para ser usado no lugar dele. Mancha nova, que muda de cor, cresce ou sangra, é dermatologista, e não receita caseira."
        />
      </PdfContentPage>

      {/* ── p25 · bloco 8, receitas 57 e 58 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={25} pageNumberColor={C.base}
        kicker="Bloco 8 · Receitas 57 a 64"
        title="Ansiedade e cansaço"
        subtitle="Pra aperto no peito no meio do dia, cabeça acelerada e aquele cansaço que dormir não resolve."
      >
        <AvisoDoBloco title="Antes deste bloco">
          Este bloco é para o cansaço e o aperto do dia a dia. Não é tratamento. Se existe crise de
          pânico, tristeza que não passa, medo que impede de sair de casa ou qualquer pensamento de
          se machucar, isso é ajuda profissional e é urgente. Se você já toma remédio para ansiedade
          ou depressão, não pare nem diminua por causa de nada que esteja escrito aqui.
        </AvisoDoBloco>
        <Item
          cor={C} numero={57} nome="A respiração de quatro tempos"
          lista={['nenhum ingrediente', '2 minutos', 'uma cadeira']}
          texto="Sentada, puxa o ar contando até quatro, segura contando até quatro, solta contando até seis. Repete seis vezes, sem pressa."
          porque="Abre o bloco de propósito com o que não se prepara, porque é o único que funciona no meio do expediente, sem cozinha e sem ninguém perceber."
          atencao="Se der tontura, pare e volte a respirar normalmente. Não faça em pé nem dirigindo."
        />
        <Item
          cor={C} numero={58} nome="Chá de folha de maracujá"
          lista={['1 colher de chá da folha seca', '250ml de água']}
          texto="Água fervida, fogo desligado, tampa por dez minutos. Coa e toma morno, no fim da tarde."
          porque="É a folha, não a fruta, e é a mais forte deste bloco. Por isso ela vem com hora marcada e não a qualquer momento do dia."
          atencao="Dá sono: nunca antes de dirigir, de trabalhar com máquina ou de qualquer coisa que exija atenção. Não usar junto com calmante, remédio de dormir ou antidepressivo sem falar com o médico. Não usar em gestação."
        />
      </PdfContentPage>

      {/* ── p26 · bloco 8, receitas 59 a 61 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={26} pageNumberColor={C.base}
        kicker="Bloco 8 · Continuação"
      >
        <Item
          cor={C} numero={59} nome="Chá de folha de laranjeira"
          lista={['3 folhas de laranjeira lavadas', '250ml de água']}
          texto="Água fervida, fogo desligado, as folhas dentro, tampa por sete minutos. Coa e toma morno no meio da tarde."
          porque="É mais suave que o maracujá e não derruba. Serve para o dia em que a cabeça está acelerada mas ainda falta trabalho pela frente."
          atencao="Use folha de árvore que você saiba que não foi pulverizada. Pode dar sonolência leve em algumas pessoas: teste num dia de folga antes de tomar em dia de trabalho."
        />
        <Item
          cor={C} numero={60} nome="Compressa fria na nuca"
          lista={['1 pano pequeno', 'água fria da torneira']}
          texto="Pano molhado em água fria, bem torcido, na nuca, por três minutos, sentada e com os ombros soltos."
          porque="É o mais rápido de todos e serve para o momento exato do aperto. O frio na nuca corta a aceleração antes que ela cresça."
          atencao="Água fria de torneira, nunca gelo direto. Quem tem pressão alta descontrolada ou problema de circulação deve usar por um minuto só."
        />
        <Item
          cor={C} numero={61} nome="Água de coco com uma pitada de sal"
          lista={['1 copo de água de coco', '1 pitada pequena de sal']}
          texto="Mistura e toma devagar, no meio da tarde, no lugar do café da tarde."
          porque="Boa parte do cansaço das três da tarde é falta de água, não falta de energia. Este é o que mais gente me diz que resolveu sem acreditar antes."
          atencao="Quem tem doença renal ou restrição de potássio não deve tomar água de coco sem falar com o médico. Quem tem pressão alta deve deixar o sal de fora."
        />
      </PdfContentPage>

      {/* ── p27 · bloco 8, receitas 62 a 64 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={27} pageNumberColor={C.base}
        kicker="Bloco 8 · Fim"
      >
        <Item
          cor={C} numero={62} nome="Vitamina de banana com aveia"
          lista={['1 banana', '2 colheres de sopa de aveia', '200ml de leite ou bebida vegetal', '1 pitada de canela']}
          texto="Bate tudo e toma no café da manhã, ou no lugar do lanche da tarde quando o cansaço bate cedo."
          porque="Cansaço de tarde quase sempre começa num café da manhã fraco. Este é o que segura até o almoço sem pedir açúcar de novo às dez."
          atencao="Quem tem diabetes deve contar o açúcar da banana e falar com o médico ou nutricionista. Quem tem intolerância à lactose usa bebida vegetal."
        />
        <Item
          cor={C} numero={63} nome="O cochilo de vinte minutos"
          lista={['20 minutos', '1 despertador', 'um lugar para recostar']}
          texto="Cochilo de vinte minutos, com despertador, sempre antes das três da tarde. Passou disso, você acorda pior do que deitou."
          porque="Vinte minutos é o que descansa sem entrar no sono profundo. É o número que importa aqui, e é por isso que o despertador não é opcional."
          atencao="Nunca depois das três da tarde, porque aí ele rouba o sono da noite. Quem já dorme mal à noite deve pular este e usar a receita 57 no lugar."
        />
        <Item
          cor={C} numero={64} nome="As três linhas no papel"
          lista={['1 papel', '1 caneta', '3 minutos']}
          texto="Escreve em três linhas o que está pesando, no fim da tarde. Não precisa resolver nada, nem ficar bonito. Só sair da cabeça e ir para o papel."
          porque="Fecha o bloco sem nada para tomar. O que fica só na cabeça roda a noite inteira, e o que está escrito para de rodar."
          atencao="Se ao escrever aparecer sempre a mesma dor, ou pensamento de se machucar, isso não é assunto de papel: procure ajuda profissional."
        />
      </PdfContentPage>

      {/* ── p28 · bloco 9, receitas 65 e 66 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={28} pageNumberColor={C.base}
        kicker="Bloco 9 · Receitas 65 a 72"
        title="Sono"
        subtitle="Pra pegar no sono, atravessar a noite e acordar descansada. Os fundamentos, mais dois preparos fortes."
      >
        <AvisoDoBloco title="Como este bloco é diferente dos outros">
          Os oito blocos anteriores são de preparo. Este é quase todo de fundamento, e é de propósito.
          Chá nenhum vence uma hora de acordar bagunçada, uma tela na cara até tarde ou um café das
          cinco da tarde. Aqui estão as seis coisas que decidem, e dois preparos para as noites em que
          os fundamentos já estão certos e o sono ainda não vem.
        </AvisoDoBloco>
        <Item
          cor={C} numero={65} nome="A hora de acordar, não a de deitar"
          lista={['1 despertador', 'o mesmo horário todo dia']}
          texto="Escolhe uma hora de acordar e mantém, inclusive no fim de semana, com no máximo uma hora de diferença. Não tenta dormir mais cedo: acorda igual."
          porque="É o fundamento que quase ninguém sabe. O corpo se organiza pela hora que você levanta, não pela que você deita. Mexer na ponta errada é por que tanta gente tenta e não sai do lugar."
          atencao="Nas duas primeiras semanas você vai ficar mais cansada antes de melhorar, e isso é esperado. Quem trabalha em escala não consegue horário fixo, e para esse caso a regra é outra."
        />
        <Item
          cor={C} numero={66} nome="A luz das duas pontas"
          lista={['a janela de manhã', 'a lâmpada baixa à noite']}
          texto="Dez minutos de luz natural até uma hora depois de acordar, e luz baixa e amarela na última hora antes de deitar."
          porque="A luz é o que acerta o relógio do corpo, e ela pesa mais que qualquer coisa que se bebe. É de graça e é o que mais muda."
          atencao="Luz natural, não precisa ser sol direto no rosto. Em dia nublado vale igual, só demora um pouco mais."
        />
      </PdfContentPage>

      {/* ── p29 · bloco 9, receitas 67 a 69 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={29} pageNumberColor={C.base}
        kicker="Bloco 9 · Continuação"
      >
        <Item
          cor={C} numero={67} nome="O corte do café das duas da tarde"
          lista={['1 relógio', 'nada mais']}
          texto="Último café, chá preto, chá verde, refrigerante escuro ou energético até as duas da tarde. Depois disso, só o que não tem cafeína."
          porque="A cafeína demora muito mais para sair do corpo do que o gosto na boca sugere. Boa parte do café da tarde ainda está circulando na hora de deitar, mesmo em quem jura que não sente nada."
          atencao="Quem toma muito café todo dia deve cortar aos poucos, meia xícara por vez, senão vem dor de cabeça. Chá verde e chá preto contam como café."
        />
        <Item
          cor={C} numero={68} nome="O banho de uma hora antes"
          lista={['seu chuveiro', 'água morna', '10 minutos']}
          texto="Banho morno de dez minutos, de uma hora a uma hora e meia antes de deitar. Nunca em cima da hora."
          porque="O sono começa quando a temperatura do corpo cai. O banho não faz dormir por esquentar: faz porque, depois dele, o corpo esfria mais fundo. É a descida que traz o sono, e ela leva uma hora."
          atencao="Morna, não quente. Quem tem pressão baixa, varizes ou problema de circulação deve encurtar para cinco minutos e sair devagar."
        />
        <Item
          cor={C} numero={69} nome="A regra dos vinte minutos"
          lista={['1 outro cômodo', '1 luz baixa']}
          texto="Se passar mais ou menos vinte minutos acordada na cama, levanta, vai para outro cômodo com luz baixa, e volta só quando o sono vier."
          porque="É a mais contraintuitiva de todas. Ficar deitada acordada ensina o corpo que cama é lugar de esperar, e não de dormir. Levantar ajuda a dormir."
          atencao="Não olhe o relógio para contar os vinte minutos, porque olhar a hora piora. É por sensação. E fora da cama, nada de tela nem de luz forte."
        />
      </PdfContentPage>

      {/* ── p30 · bloco 9, receitas 70 a 72 ───────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={30} pageNumberColor={C.base}
        kicker="Bloco 9 · Fim"
      >
        <Item
          cor={C} numero={70} nome="O jantar que não pesa"
          lista={['o seu jantar de sempre', '3 horas antes de deitar']}
          texto="Jantar até três horas antes de deitar, e mais leve do que o almoço. Se der fome depois, uma fruta ou meio copo de leite morno resolvem."
          porque="Digestão pesada e sono profundo não acontecem ao mesmo tempo. O corpo escolhe a digestão, e você acorda às três da manhã sem saber por quê."
          atencao="Quem tem refluxo deve deixar três horas mesmo, sem exceção, e elevar a cabeceira da cama. Quem tem diabetes não deve pular a ceia sem falar com o médico."
        />
        <Item
          cor={C} numero={71} nome="Chá de mulungu"
          lista={['1 colher de chá da casca seca', '300ml de água']}
          texto="Ferve por cinco minutos, desliga, tampa por dez. Coa e toma morno, uma hora antes de deitar, só nas noites difíceis."
          porque="É o mais forte deste caderno e por isso é o penúltimo. Não é para todo dia: é para a noite em que os fundamentos já estão certos e o sono ainda não veio."
          atencao="Dá sono de verdade: nunca antes de dirigir ou operar máquina. Não usar junto com calmante, remédio de dormir, antidepressivo ou remédio de pressão sem falar com o médico. Não usar em gestação nem amamentação. No máximo três noites seguidas."
        />
        <Item
          cor={C} numero={72} nome="Chá de maracujá com mel"
          lista={['1 colher de chá de folha de maracujá seca', '250ml de água', '1 colher de chá de mel']}
          texto="Água fervida, fogo desligado, tampa por dez minutos. Coa, adoça com o mel e toma morno, quarenta minutos antes de deitar."
          porque="Fecha o caderno com o mais suave dos dois fortes. Serve para a noite agitada que não chega a ser noite ruim."
          atencao="Nunca dar mel a criança menor de 1 ano. Dá sonolência: não usar antes de dirigir. Não misturar com calmante ou remédio de dormir sem falar com o médico. Não usar em gestação."
        />
      </PdfContentPage>

      {/* ── p31 · aviso legal e encerramento ───────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={31} pageNumberColor={C.base} kicker="Pra terminar" title="Uma última coisa">
        <P>
          Se você chegou até aqui, já viu que eu não prometo nada. Não digo em quantos dias, não digo
          quanto, e não digo que resolve. O que eu digo é o que eu vi em quarenta anos de cozinha:
          quem começa pelo mais simples e faz por alguns dias seguidos costuma perceber alguma coisa.
          Quem faz cinco receitas numa noite não percebe nada, porque não sabe o que testou.
        </P>

        <Callout type="warning" title="Aviso importante">
          Este material é informativo e de tradição caseira. Não substitui consulta, diagnóstico ou
          tratamento médico, e não deve ser usado para substituir nenhum remédio prescrito.
          Erva e alimento interagem com medicamento: se você toma qualquer remédio de uso contínuo,
          está grávida, amamentando, ou tem doença de fígado, rim, coração ou vesícula, converse com
          o seu médico antes de usar qualquer receita deste caderno. Diante de dor forte, febre,
          sangramento, perda de peso sem explicação ou pele amarelada, procure atendimento médico.
        </Callout>

        <Spacer size="sm" />
        <Assinatura cor={C} frase="Cuida de você, filha." />
      </PdfContentPage>
    </>
  );
}
