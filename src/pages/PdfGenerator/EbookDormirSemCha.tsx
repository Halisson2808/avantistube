/**
 * PDF — /pdf/dormir-sem-cha · Dormir Sem Chá · Bump 3 · R$ 19,90
 *
 * Escada em Workspace Produtos/Ofertas/avo-yuki/_Inteligencia/analise-bumps.md
 *
 * Substituiu o Quando o Sono Não Vem em 4 de setembro de 2026. Aquele tinha 12
 * saídas em 11 páginas e ficava menor que o produto de R$ 9,90 logo abaixo dele
 * na escada, que tem 20 pontos em 12 páginas. Inversão de valor dentro da
 * própria escada.
 *
 * A correção foi mesclar o conteúdo de dois materiais num guia só, e não
 * grampear arquivos. Entraram as 12 saídas da noite e 13 das 15 mudanças do
 * quarto, num total de 25 itens em 17 páginas.
 *
 * Duas mudanças do quarto foram cortadas por duplicarem coisa que já existe.
 * Tire o relógio de vista é a mesma coisa que a saída 5, cobrir o relógio.
 * Pegue luz forte ao acordar é fundamento do bloco 9 do Caderno, e este guia é
 * da noite, não do dia.
 *
 * O eixo que sustenta o produto e dá o nome: aqui não se prepara nada. O
 * Caderno tem os fundamentos, o Manual do Sono tem os preparos, e sobrou tudo
 * que faz dormir melhor sem passar pelo fogão. É também a única coisa que o
 * concorrente direto não pode dizer, porque o produto dele é só receita.
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';
import { DesignPage } from '@/components/ebook/DesignPage';
import { Callout, Divider, Spacer } from '@/components/ebook/VisualElements';
import { CORES, faixaDe, Item, Titulo, P, Assinatura } from '@/components/ebook/sono';

const C = CORES.dormir;
const F = faixaDe(C);

/** Alerta de abertura de bloco. O Callout não tem margem própria e cola no primeiro cartão. */
function AvisoDoBloco({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Callout type="warning" title={title} className="mb-3.5">
      {children}
    </Callout>
  );
}

/** Um item do guia. Reaproveita o cartão da linha, trocando os dois rótulos. */
function Passo(props: {
  numero: number; nome: string; precisa: string[]; como: string; porque: string; atencao: string;
}) {
  return (
    <Item
      cor={C}
      numero={props.numero}
      nome={props.nome}
      etiquetaEsq="Você precisa de"
      lista={props.precisa}
      etiquetaDir="O que fazer"
      texto={props.como}
      porque={props.porque}
      atencao={props.atencao}
    />
  );
}

const BLOCOS = [
  ['A noite: não pego no sono', 4],
  ['A noite: acordo de madrugada', 4],
  ['A noite: durmo e acordo cansada', 4],
  ['O quarto: a luz', 4],
  ['O quarto: barulho e temperatura', 5],
  ['O quarto: a cama e o resto', 4],
] as const;

function Indice() {
  return (
    <div className="mt-1 overflow-hidden rounded-xl border" style={{ borderColor: `${C.base}22` }}>
      {BLOCOS.map(([nome, n], i) => (
        <div
          key={nome}
          className="flex items-baseline justify-between px-3.5 py-[8px]"
          style={{ background: i % 2 ? `${C.base}08` : 'transparent' }}
        >
          <span className="flex items-baseline gap-2.5">
            <span
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ background: C.base }}
            >
              {i + 1}
            </span>
            <span className="font-display text-[13.5px] font-semibold" style={{ color: C.base }}>{nome}</span>
          </span>
          <span className="text-[11.5px] font-medium" style={{ color: C.suave }}>{n} itens</span>
        </div>
      ))}
    </div>
  );
}

export default function EbookDormirSemCha() {
  return (
    <>
      {/*
        Capa: dormir-sem-cha.png em public/. Enquanto a arte nova não existir, a
        página sai na cor cheia do produto, sem quebrar nada.
      */}
      <DesignPage
        bg={C.base}
        style={{
          backgroundImage: 'url(/dormir-sem-cha.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* ── p1 · abertura ─────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={1} pageNumberColor={C.base}
        kicker="Antes de tudo"
        title="Tudo que faz dormir melhor e não é chá"
      >
        <P>
          Eu passei a vida anotando receita, então vou dizer uma coisa que talvez soe estranha vindo
          de mim: chá nenhum conserta um quarto errado, e chá nenhum resolve uma noite que já começou
          torta. Este guia é o resto. É o que fazer quando você já está deitada, e é como deixar o
          quarto de um jeito que trabalhe a seu favor.
        </P>
        <P>
          São vinte e cinco coisas, e nenhuma delas passa pelo fogão. Não tem o que ferver, o que
          coar, nem o que comprar em loja de erva. A maior parte é de graça e a que custa alguma coisa
          custa poucos reais.
        </P>

        <Callout type="info" title="O que este guia não é">
          Não é livro de receita, não tem chá e não tem preparo nenhum. Também não é tratamento de
          insônia: é o que fazer nesta noite e como arrumar o quarto neste fim de semana. Se as noites
          ruins passaram de três meses e acontecem na maioria das semanas, isso tem nome, tem
          tratamento e a conversa é com um médico.
        </Callout>

        <Titulo cor={C}>Por que dividido em noite e quarto</Titulo>
        <P>
          Porque são dois momentos diferentes e a maioria das pessoas só trabalha um. A primeira
          metade é o que você faz na hora, com a luz já apagada. A segunda é o que se arruma antes, de
          dia, com a casa acordada. As duas juntas rendem mais que qualquer uma sozinha, e a do quarto
          é a que fica: hábito acaba, cortina não.
        </P>

        <Titulo cor={C}>Quanto tempo leva</Titulo>
        <P>
          As mudanças do quarto valem já na primeira noite, porque elas não dependem de você aprender
          nada. As saídas da noite precisam de três ou quatro tentativas para você pegar o jeito.
          Nenhuma funciona todas as noites, e isso é normal: até quem dorme muito bem tem noite ruim.
        </P>

        <Titulo cor={C}>Por que não tem chá aqui</Titulo>
        <P>
          Porque chá é o que eu já escrevi e é o que todo mundo escreve. O que quase ninguém conta é
          que boa parte da noite ruim não se resolve com nada que se bebe. Se resolve com uma cortina,
          com o celular fora da cabeceira e com saber o que fazer quando os olhos abrem às três da
          manhã. Isso não vende tão bonito quanto uma erva, mas é o que muda a noite de hoje.
        </P>
        <P>
          Tem outra vantagem, e ela é prática: não depende de você ter o ingrediente em casa nem de
          ter disposição para levantar e ferver água. Serve na noite em que você está exausta demais
          para fazer qualquer coisa, que costuma ser justamente a noite em que você mais precisa.
        </P>
      </PdfContentPage>

      {/* ── p2 · os três tipos ────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={2} pageNumberColor={C.base}
        kicker="Antes de escolher"
        title="Os três tipos de noite ruim"
      >
        <P>
          Quase toda queixa de sono cai num destes três, e eles pedem coisas diferentes. Tentar a
          saída do tipo errado é o motivo mais comum de alguém dizer que já tentou de tudo.
        </P>

        <Titulo cor={C}>Deito e não pego no sono</Titulo>
        <P>
          Você apaga a luz e fica meia hora, uma hora, virando. A cabeça está acesa, repassando o dia
          ou a conversa. O corpo está cansado e a cabeça não acompanha. É o tipo que mais responde a
          técnica, e é onde as saídas agem mais rápido.
        </P>

        <Titulo cor={C}>Pego no sono e acordo de madrugada</Titulo>
        <P>
          Você dorme rápido, e às duas ou três da manhã os olhos abrem sozinhos. O problema não é
          pegar no sono, é voltar. Aqui o que decide é o que você faz nos primeiros dez minutos depois
          de acordar, e quase todo mundo faz exatamente o que não deve.
        </P>

        <Titulo cor={C}>Durmo a noite toda e acordo cansada</Titulo>
        <P>
          Este é o mais mal entendido dos três. Você não tem dificuldade para dormir, dorme sete ou
          oito horas, e acorda como se não tivesse deitado. Aqui o problema quase nunca está na hora
          de deitar: está na qualidade da noite, e as causas mais comuns são coisas que ninguém liga
          ao sono.
        </P>

        <Divider />

        <Callout type="tip" title="O quarto vale para os três">
          A segunda metade do guia não se divide por tipo, porque quarto escuro, silencioso e fresco
          ajuda em todos eles. Se você não souber qual é o seu tipo, comece pelo quarto: é a parte que
          funciona sem diagnóstico nenhum.
        </Callout>

        <Titulo cor={C}>Você pode ser de mais de um tipo</Titulo>
        <P>
          É comum, e não é problema. Muita gente demora a pegar no sono e ainda acorda às três. Nesse
          caso, comece pelo que mais incomoda: se o que pesa é a hora deitada olhando o teto, vá pelo
          primeiro bloco; se o que arruína o dia seguinte é a madrugada em claro, vá pelo segundo. O
          outro bloco continua ali para depois, e nada se perde por esperar.
        </P>
      </PdfContentPage>

      {/* ── p3 · como usar ────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={3} pageNumberColor={C.base}
        kicker="Como usar"
        title="Vinte e cinco itens, e você não precisa de todos"
      >
        <P>
          Escolha uma saída da noite e dê a ela pelo menos três noites antes de trocar. Do quarto,
          faça uma mudança por dia, na ordem em que estão. Fazer as quinze num sábado não acelera
          nada e ainda tira de você a informação que interessa, que é saber qual delas mudou alguma
          coisa.
        </P>

        <Indice />

        <Spacer size="sm" />

        <Callout type="tip" title="Leia de dia, use de noite">
          Leia o guia inteiro uma vez, com a luz acesa, antes de precisar dele. Às três da manhã
          ninguém aprende coisa nova: só consegue fazer o que já sabe. Marque as duas ou três saídas
          que você acha que servem para você, e é só isso que você vai usar no escuro.
        </Callout>

        <Titulo cor={C}>Se você divide a cama com alguém</Titulo>
        <P>
          Várias saídas envolvem sair da cama, escrever no escuro ou mexer no travesseiro, e isso
          costuma travar quem tem medo de acordar quem dorme junto. Deixe o que vai precisar do seu
          lado, ao alcance do braço, e combine antes, de dia: quem sabe que a outra pessoa vai
          levantar de madrugada acorda menos do que quem leva um susto.
        </P>

        <Titulo cor={C}>Como saber se está funcionando</Titulo>
        <P>
          Não olhe noite por noite, porque uma noite não diz nada: até quem dorme bem tem noite ruim
          sem motivo. Anote só três coisas de manhã, num papel, numa linha: se demorou muito para
          pegar no sono, quantas vezes acordou e como está o corpo ao levantar. Em duas semanas
          compare as três primeiras manhãs com as três últimas, e não o dia de ontem com o de hoje.
        </P>
      </PdfContentPage>

      {/* ── p4 · bloco 1, itens 1 e 2 ─────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={4} pageNumberColor={C.base}
        kicker="Bloco 1 · Itens 1 a 4"
        title="A noite: não pego no sono"
        subtitle="Pra noite em que o corpo já parou e a cabeça continua acesa."
      >
        <AvisoDoBloco title="Antes destas quatro">
          Nenhuma funciona na primeira vez do jeito que funciona na quinta. São técnicas, e técnica se
          aprende praticando quando não é urgente. Faça uma vez numa tarde de sábado, sem precisar
          dormir, e ela vai estar pronta na noite em que você precisar.
        </AvisoDoBloco>
        <Passo
          numero={1} nome="A varredura do corpo"
          precisa={['5 minutos', 'a própria cama']}
          como="Deitada e de olhos fechados, leve a atenção para os dedos do pé. Suba devagar, uma parte por vez: pé, tornozelo, panturrilha, joelho, coxa, quadril, barriga, peito, ombro, braço, mão, pescoço e rosto. Em cada uma, repare se está dura e solte."
          porque="Dá à cabeça uma tarefa monótona e sem fim, que é o oposto de repassar o dia. E no caminho você encontra tensão que nem sabia que estava segurando, quase sempre no maxilar, no ombro e na testa."
          atencao="Se você adormecer no meio, é para isso mesmo. Se chegar ao alto da cabeça acordada, comece de novo pelos pés, sem se irritar com isso."
        />
        <Passo
          numero={2} nome="A contagem de trás para frente"
          precisa={['nada', 'os olhos fechados']}
          como="Conte de trezentos para trás, de três em três: trezentos, duzentos e noventa e sete, duzentos e noventa e quatro. Conte no ritmo da respiração, um número a cada vez que solta o ar. Errou, volta para trezentos."
          porque="Contar para frente é fácil demais e sobra cabeça livre para pensar em outra coisa. De três em três e para trás ocupa a atenção inteira, e é por isso que funciona onde contar carneirinho não funciona."
          atencao="Não vale usar o celular para conferir a conta. Errar e voltar não é falha: é o que mantém a tarefa difícil o bastante para ocupar a cabeça."
        />
      </PdfContentPage>

      {/* ── p5 · bloco 1, itens 3 e 4 ─────────────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={5} pageNumberColor={C.base} kicker="Bloco 1 · Fim">
        <Passo
          numero={3} nome="Manter os olhos abertos de propósito"
          precisa={['nada', 'o escuro']}
          como="Deitada, confortável e no escuro, tente ficar acordada. Mantenha os olhos abertos sem forçar e repita para você mesma que vai ficar acordada mais um pouco. Se a pálpebra fechar sozinha, deixe."
          porque="Parece o contrário do que se quer, e é por isso que funciona. Boa parte da dificuldade de pegar no sono é a tensão de tentar pegar no sono, e ela cresce a cada olhada no relógio. Tirando a obrigação, o corpo relaxa sozinho."
          atencao="Não é para se levantar nem para se distrair: é para continuar deitada, no escuro, sem tentar dormir. Se virar esforço, você inverteu a técnica."
        />
        <Passo
          numero={4} nome="A janela dos bocejos"
          precisa={['prestar atenção', 'a hora que você já deita']}
          como="Nas próximas noites, repare em que horário chegam os primeiros sinais: bocejo em sequência, olho que arde, mão e pé esfriando, a linha lida três vezes sem entender. Deite dentro dos vinte minutos seguintes."
          porque="O sono chega em ondas, com mais ou menos uma hora e meia entre uma e outra. Quem perde a onda espera a próxima, e é daí que vem a sensação de estar cansada e mesmo assim não conseguir dormir."
          atencao="Se a sua janela chegar cedo demais para a sua vida, isso não se resolve deitando às oito: se resolve mexendo na hora de acordar e na luz do dia, que é assunto do Caderno."
        />

        <Callout type="tip" title="Se você só fizer uma coisa deste bloco">
          Faça a varredura do corpo. Não precisa de conta, não precisa de disciplina e é a única das
          quatro que funciona igual quando você está cansada demais para pensar.
        </Callout>
      </PdfContentPage>

      {/* ── p6 · bloco 2, itens 5 e 6 ─────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={6} pageNumberColor={C.base}
        kicker="Bloco 2 · Itens 5 a 8"
        title="A noite: acordo de madrugada"
        subtitle="Pra noite em que os olhos abrem às três e o sono não volta mais."
      >
        <AvisoDoBloco title="Antes destas quatro">
          Acordar uma ou duas vezes por noite é normal e acontece com todo mundo, inclusive com quem
          diz que dorme bem. O que faz virar problema é o que acontece depois: a conta das horas que
          faltam, o celular, e a irritação de estar acordada.
        </AvisoDoBloco>
        <Passo
          numero={5} nome="Cobrir o relógio"
          precisa={['1 pano', 'ou virar o despertador para a parede']}
          como="Antes de deitar, cubra ou vire para a parede qualquer relógio que dê para ver da cama, inclusive o do micro-ondas se ele aparece pela porta. Deixe o celular fora do alcance do braço, com a tela para baixo."
          porque="Olhar a hora de madrugada não devolve o sono e faz uma coisa só: começa a conta de quanto falta para o despertador. Essa conta acorda de vez, porque é cálculo e preocupação ao mesmo tempo."
          atencao="Quem depende do despertador continua usando, só que virado. Quem precisa do celular por perto por causa de filho ou de plantão deixa a tela para baixo e o brilho no mínimo."
        />
        <Passo
          numero={6} nome="O canto preparado"
          precisa={['1 cadeira ou poltrona', '1 manta', '1 luz baixa', '1 livro chato']}
          como="Antes de dormir, deixe pronto um canto fora do quarto com manta e luz fraca. Se acordar e não voltar em uns vinte minutos, vá para lá e fique até o sono chegar. Volte para a cama só quando ele vier."
          porque="Levantar da cama ajuda a dormir, mas ninguém levanta se for para ficar em pé no escuro procurando o que fazer. Deixar o canto pronto à tarde é o que faz você conseguir sair da cama de madrugada."
          atencao="Luz baixa e amarela, nunca a do teto. Nada de televisão, celular nem tarefa de casa: se você começar a produzir, o corpo entende que o dia começou."
        />
      </PdfContentPage>

      {/* ── p7 · bloco 2, itens 7 e 8 ─────────────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={7} pageNumberColor={C.base} kicker="Bloco 2 · Fim">
        <Passo
          numero={7} nome="A respiração de lado, com a mão na barriga"
          precisa={['nada', 'deitada de lado']}
          como="De lado, uma das mãos apoiada na barriga, logo abaixo das costelas. Respire de modo que a mão suba, e não o peito. Solte o ar mais devagar do que puxa, mais ou menos o dobro do tempo, sem contar."
          porque="Quem acorda assustada de madrugada respira curto e alto, no peito, que é o jeito de quem está em alerta. Fazer a mão da barriga subir devolve a respiração de quem está dormindo, e o corpo lê esse sinal antes de a cabeça entender."
          atencao="Se a mão não sobe, não force: só continue prestando atenção nela. Quem tem refluxo dorme melhor do lado esquerdo e com a cabeceira um pouco elevada."
        />
        <Passo
          numero={8} nome="A regra de não resolver nada"
          precisa={['1 papel e 1 caneta na cabeceira']}
          como="Se acordar com um problema na cabeça, escreva uma linha só sobre ele no papel da cabeceira, no escuro, sem ler o que escreveu e sem acender nada. Depois deite de novo."
          porque="A cabeça insiste porque tem medo de esquecer, e repete a mesma coisa justamente para não perder. Escrever é o que a convence a soltar. Resolver de madrugada não funciona: quase nada decidido às três da manhã presta de manhã."
          atencao="Nada de celular para anotar, porque a tela acorda. Papel e caneta ficam na cabeceira e você escreve sem acender luz nenhuma, mesmo que saia torto."
        />

        <Callout type="warning" title="Quando acordar de madrugada não é insônia">
          Se você acorda várias vezes com falta de ar, engasgo ou boca muito seca, ou se alguém já
          disse que você para de respirar e volta roncando, isso não é assunto deste guia. É o quadro
          típico de apneia do sono, tem exame e tem tratamento, e nenhuma técnica daqui resolve.
        </Callout>
      </PdfContentPage>

      {/* ── p8 · bloco 3, itens 9 e 10 ────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={8} pageNumberColor={C.base}
        kicker="Bloco 3 · Itens 9 a 12"
        title="A noite: durmo e acordo cansada"
        subtitle="Pra noite inteira dormida que não descansou nada."
      >
        <AvisoDoBloco title="Antes destas quatro">
          Aqui a causa costuma estar fora do sono, e as quatro são de investigar, não de técnica. Se
          depois de tentar as quatro você continuar acordando moída todos os dias, isso pede consulta:
          cansaço que não melhora com noite dormida tem várias causas médicas.
        </AvisoDoBloco>
        <Passo
          numero={9} nome="O ronco, o seu ou o do lado"
          precisa={['alguém que durma com você', 'ou o gravador do celular ligado a noite toda']}
          como="Pergunte a quem dorme com você se você ronca, se para de respirar em algum momento e se se mexe muito. Sem ninguém em casa, deixe o gravador de voz ligado uma noite, longe do travesseiro, e escute trechos de manhã."
          porque="Ronco alto com pausas na respiração é a causa mais comum de dormir a noite toda e acordar sem descanso, e a que mais passa despercebida, porque a pessoa não se vê dormindo."
          atencao="Se aparecer ronco alto com pausas, ou se você acorda com dor de cabeça e boca seca, leve isso ao médico. Apneia não tratada mexe com pressão e com coração, e não é frescura."
        />
        <Passo
          numero={10} nome="O remédio que atrapalha, e o horário dele"
          precisa={['a lista dos seus remédios', 'a próxima consulta']}
          como="Anote tudo o que você toma e em que horário, inclusive o que não é receitado. Leve a lista ao médico ou ao farmacêutico e faça duas perguntas: algum destes atrapalha o sono, e algum pode ser tomado em outro horário."
          porque="Remédio de pressão que faz urinar, corticoide, alguns para tireoide e alguns para humor mexem com o sono, e muitas vezes o problema é a hora e não o remédio. Trocar o horário é de graça."
          atencao="Nunca mude horário nem dose por conta própria, e não pare nada. Isto é para perguntar, não para decidir: a resposta é de quem receitou."
        />
      </PdfContentPage>

      {/* ── p9 · bloco 3, itens 11 e 12 ───────────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={9} pageNumberColor={C.base} kicker="Bloco 3 · Fim">
        <Passo
          numero={11} nome="A taça da noite"
          precisa={['honestidade', '1 semana de observação']}
          como="Se você bebe à noite, mesmo pouco e mesmo só no fim de semana, experimente uma semana sem nada depois das seis da tarde. Anote como acorda em cada uma dessas manhãs e compare com a semana anterior."
          porque="O álcool derruba rápido e por isso parece que ajuda. Só que ele quebra a segunda metade da noite, que é justamente a parte que descansa, e é comum acordar às três da manhã por causa disso."
          atencao="Isto não é sermão e não é sobre quantidade. Se parar por uma semana for difícil, isso por si só é informação para conversar com um médico, sem julgamento nenhum."
        />
        <Passo
          numero={12} nome="A conta das horas que você realmente dorme"
          precisa={['1 papel', '7 noites']}
          como="Anote de manhã, num papel e sem aplicativo nenhum: a hora que deitou, a hora aproximada em que pegou no sono e a hora que levantou. Sete dias seguidos. No fim, some as horas dormidas e divida por sete."
          porque="Fecha a primeira metade com a conta que quase ninguém faz. Muita gente que se diz cansada dorme cinco horas e meia e jura que dorme sete, porque conta o tempo na cama e não o tempo dormindo."
          atencao="Se der menos de sete horas, o problema é de rotina e não de sono, e nenhuma saída daqui resolve isso. Se der sete ou mais e você continuar exausta, é consulta."
        />

        <Callout type="tip" title="Daqui em diante muda o assunto">
          Até aqui foi o que você faz. Da próxima página em diante é o que você arruma, e essa parte
          não depende de você lembrar de nada às três da manhã.
        </Callout>
      </PdfContentPage>

      {/* ── p10 · bloco 4, itens 13 e 14 ──────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={10} pageNumberColor={C.base}
        kicker="Bloco 4 · Itens 13 a 16"
        title="O quarto: a luz"
        subtitle="A parte mais barata do guia e a que muda mais. Comece por aqui se não souber por onde começar."
      >
        <AvisoDoBloco title="A ordem importa nesta parte">
          Faça uma mudança por dia, na ordem em que estão. As quinze num sábado não aceleram nada e
          ainda tiram de você a única informação que interessa, que é saber qual delas mudou alguma
          coisa para você.
        </AvisoDoBloco>
        <Passo
          numero={13} nome="Escureça a janela de verdade"
          precisa={['cortina blackout, ou papelão, ou papel alumínio', 'fita crepe']}
          como="Cubra a janela de modo que, com a luz apagada, você não consiga enxergar a sua própria mão à frente do rosto. Se não puder trocar a cortina, papelão preso na janela com fita resolve igual."
          porque="É a mudança que mais muda de todas as quinze e uma das mais baratas. O corpo lê claridade como hora de acordar, e luz de poste entrando pela fresta faz isso a noite inteira sem você perceber."
          atencao="Se você precisa se levantar de madrugada, deixe uma luz baixa e amarela no caminho do banheiro. Escuro total com tropeço no meio não compensa."
        />
        <Passo
          numero={14} nome="Tire o celular da cabeceira"
          precisa={['1 tomada do outro lado do quarto']}
          como="Carregue o celular longe da cama, de preferência do outro lado do quarto, onde você precise levantar para pegar. Se ele é o seu despertador, compre um despertador de pilha, que custa poucos reais."
          porque="Não é só a luz da tela: é o fato de que, estando ao alcance da mão, você olha. E cada olhada de madrugada recomeça a conta das horas e acorda a cabeça."
          atencao="Quem precisa ficar acessível por causa de filho, de pai idoso ou de plantão deixa o celular por perto com o som alto e a tela para baixo, e resolve metade do problema."
        />
      </PdfContentPage>

      {/* ── p11 · bloco 4, itens 15 e 16 ──────────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={11} pageNumberColor={C.base} kicker="Bloco 4 · Fim">
        <Passo
          numero={15} nome="Troque a luz do quarto por uma mais amarela"
          precisa={['1 lâmpada de luz amarela ou quente', 'poucos reais']}
          como="Troque a lâmpada branca do quarto por uma amarela e acostume a usar só ela nas duas horas antes de deitar. Se puder, use o abajur e deixe a luz do teto apagada nesse período."
          porque="Luz branca e forte à noite diz ao corpo que ainda é dia. A amarela e baixa faz o contrário e prepara a descida sem você precisar fazer nada."
          atencao="Não precisa trocar a casa inteira, só o quarto e o caminho até ele. Quem tem dificuldade de enxergar deve manter luz suficiente para não tropeçar."
        />
        <Passo
          numero={16} nome="Tape as luzinhas dos aparelhos"
          precisa={['fita isolante preta ou esparadrapo']}
          como="Apague tudo, dê uma volta no quarto no escuro e tape cada ponto que pisca ou brilha: o vermelho da televisão, o azul do roteador, o do ventilador, o do carregador."
          porque="São pontos pequenos, mas ficam acesos a noite inteira dentro do seu campo de visão. É a mudança mais barata do guia inteiro e a que dá mais trabalho de acreditar antes de testar."
          atencao="Não tape saída de ar nem sensor de aparelho a gás, e não cubra a luz de aviso de nada que precise ser vigiado."
        />

        <Callout type="tip" title="Se você só fizer uma coisa do quarto">
          Escureça a janela. É a primeira da lista de propósito: sozinha, ela costuma mudar mais que
          as outras catorze somadas, e dá para resolver hoje com papelão e fita.
        </Callout>
      </PdfContentPage>

      {/* ── p12 · bloco 5, itens 17 e 18 ──────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={12} pageNumberColor={C.base}
        kicker="Bloco 5 · Itens 17 a 21"
        title="O quarto: barulho e temperatura"
        subtitle="As duas coisas que acordam sem você lembrar de manhã que acordou."
      >
        <AvisoDoBloco title="Antes destas cinco">
          Barulho e calor não precisam acordar você por completo para estragar a noite. Eles tiram
          você do sono profundo por alguns segundos, várias vezes, e de manhã não sobra lembrança
          nenhuma disso, só o cansaço.
        </AvisoDoBloco>
        <Passo
          numero={17} nome="Tampão de ouvido"
          precisa={['tampão de silicone ou de espuma', 'poucos reais na farmácia']}
          como="Compre o de silicone, que é mais confortável para quem dorme de lado. Use por três noites seguidas antes de decidir se serve, porque a primeira noite estranha sempre."
          porque="Resolve barulho de rua, de vizinho e de ronco do lado, que são as três coisas que você não tem como desligar. É a solução mais barata para o problema mais difícil de resolver."
          atencao="Quem precisa ouvir filho pequeno, campainha ou alarme não deve usar. Não empurre o tampão fundo demais, e não use se tiver dor de ouvido ou secreção."
        />
        <Passo
          numero={18} nome="Um som constante que cubra o resto"
          precisa={['1 ventilador', 'ou um aparelho de som baixo']}
          como="Deixe um som baixo e sempre igual a noite inteira: ventilador, purificador de ar, ou som de chuva no volume mínimo. O que importa é ser constante e sem letra."
          porque="O que acorda não é o barulho, é a mudança de barulho: o carro que passa, o portão que bate. Um som constante por cima faz essas mudanças deixarem de se destacar."
          atencao="Nada com letra, nada de rádio e nada de televisão, porque a fala prende a atenção. Se usar ventilador, não aponte direto para você a noite toda."
        />
      </PdfContentPage>

      {/* ── p13 · bloco 5, itens 19 a 21 ──────────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={13} pageNumberColor={C.base} kicker="Bloco 5 · Fim">
        <Passo
          numero={19} nome="Combine o silêncio da casa"
          precisa={['uma conversa de cinco minutos']}
          como="Combine com quem mora com você um horário a partir do qual a televisão da sala baixa, a louça fica para o dia seguinte e a conversa sai do corredor. Uma hora antes de você deitar já resolve."
          porque="É a mudança que não custa nada e que quase ninguém faz, porque parece implicância. Não é: som de casa acordada mantém o corpo em estado de espera mesmo com a porta fechada."
          atencao="Combine, não imponha. Se a casa não colaborar, o tampão de ouvido e o som constante resolvem boa parte sem depender de ninguém."
        />
        <Passo
          numero={20} nome="Deixe o quarto mais fresco do que você acha confortável"
          precisa={['janela aberta, ventilador ou ar-condicionado']}
          como="O quarto de dormir deve ser mais fresco que o resto da casa. Um pouco frio ao deitar, com coberta boa, é melhor do que quente e confortável no momento de deitar."
          porque="O sono só começa quando a temperatura do corpo cai, e num quarto quente essa descida não acontece. É por isso que se dorme mal em noite abafada mesmo estando exausta."
          atencao="Frio demais atrapalha igual. Quem tem problema de circulação, pressão ou dor articular deve buscar o meio termo e manter os pés aquecidos, que é o item seguinte."
        />
        <Passo
          numero={21} nome="Pé quente, quarto frio"
          precisa={['1 par de meias', 'ou 1 bolsa de água morna']}
          como="Durma de meia ou com uma bolsa morna nos pés, mantendo o quarto fresco. Se a meia incomodar, use por meia hora antes de deitar e tire depois."
          porque="Parece contradição com o item anterior e não é: o corpo perde calor pelas pontas, e pé gelado atrapalha justamente a descida de temperatura que traz o sono. Pé quente ajuda o corpo a esfriar."
          atencao="Quem tem diabetes deve conferir a temperatura da bolsa com o cotovelo e nunca dormir com bolsa quente encostada na pele, pela perda de sensibilidade no pé."
        />
      </PdfContentPage>

      {/* ── p14 · bloco 6, itens 22 e 23 ──────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={14} pageNumberColor={C.base}
        kicker="Bloco 6 · Itens 22 a 25"
        title="O quarto: a cama e o resto"
        subtitle="As últimas quatro, e a primeira delas é a que mais gente resiste a fazer."
      >
        <AvisoDoBloco title="Antes destas quatro">
          Estas mexem com hábito, e hábito custa mais que dinheiro. Nenhuma delas exige comprar nada
          caro, mas três exigem parar de fazer alguma coisa, o que é sempre mais difícil do que
          começar.
        </AvisoDoBloco>
        <Passo
          numero={22} nome="A cama é só pra dormir"
          precisa={['1 cadeira no quarto, se tiver espaço']}
          como="Não trabalhe, não coma e não assista nada na cama. Se for ficar acordada na cama por mais de uns vinte minutos, levante e use o canto preparado do item 6."
          porque="O corpo aprende por associação. Cama usada para tudo vira lugar de estar acordada, e aí deitar deixa de ser sinal de dormir. Este item e o item 6 são o mesmo trabalho: um é a regra, o outro é a saída."
          atencao="Quem tem dor ou mobilidade reduzida e passa muito tempo na cama por necessidade deve adaptar isso com quem acompanha o caso, e não seguir ao pé da letra."
        />
        <Passo
          numero={23} nome="Troque o travesseiro se ele tem mais de dois anos"
          precisa={['1 travesseiro novo', 'a altura certa para o seu jeito de dormir']}
          como="Dobre o travesseiro ao meio: se ele não voltar sozinho, está na hora. Quem dorme de lado precisa de um mais alto, quem dorme de barriga para cima precisa de um mais baixo."
          porque="Travesseiro murcho joga o pescoço fora de linha a noite inteira, e o corpo passa a noite corrigindo. É a causa mais comum de acordar com dor no ombro e no pescoço."
          atencao="Se você acorda com dor de cabeça, formigamento no braço ou dor que irradia para a mão, isso pede avaliação médica e não troca de travesseiro."
        />
      </PdfContentPage>

      {/* ── p15 · bloco 6, itens 24 e 25 ──────────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={15} pageNumberColor={C.base} kicker="Bloco 6 · Fim">
        <Passo
          numero={24} nome="Deixe o quarto pronto antes de deitar"
          precisa={['5 minutos, no fim da tarde']}
          como="Antes do jantar, deixe o quarto na condição de dormir: cortina fechada, luz baixa ligada, cama arrumada, água na cabeceira e o pijama à mão. Depois disso, entrar no quarto já é entrar no sono."
          porque="Arrumar quarto na hora de deitar acorda, porque é tarefa. Feito de tarde, ele vira um lugar que só serve para uma coisa, e o corpo lê isso na hora em que você abre a porta."
          atencao="Não vale ligar televisão nem começar arrumação grande. São cinco minutos de deixar pronto, não é faxina."
        />
        <Passo
          numero={25} nome="O quarto que você já tem"
          precisa={['nada', 'uma volta pelo quarto com a luz apagada']}
          como="Apague tudo, fique dois minutos parada no escuro e repare no que sobrou: uma fresta de luz, um zumbido, um cheiro forte, um relógio que faz barulho. Anote e resolva um por semana."
          porque="Fecha o guia devolvendo o trabalho para você, porque o seu quarto tem coisas que nenhum guia adivinha. Dois minutos no escuro mostram mais do que uma lista pronta."
          atencao="Não vale gastar dinheiro nesta etapa. O objetivo é achar o que incomoda, e quase tudo que aparece se resolve com pano, fita ou mudar de lugar."
        />

        <Callout type="tip" title="Por onde começar de verdade">
          Escureça a janela, tire o celular da cabeceira e deixe o quarto mais fresco. As três são de
          graça ou quase, valem já na primeira noite e não dependem de você lembrar de nada às três da
          manhã.
        </Callout>
      </PdfContentPage>

      {/* ── p16 · aviso legal e encerramento ──────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={16} pageNumberColor={C.base} kicker="Pra terminar" title="Uma última coisa">
        <P>
          Eu sei que é estranho eu, que passei a vida anotando chá, terminar um material dizendo que o
          quarto importa mais. Mas seria desonesto não dizer. O chá ajuda, e eu faço todo dia há
          quarenta anos. Só que ele trabalha a favor da maré ou contra ela, e é o quarto que decide
          para que lado a maré vai.
        </P>
        <P>
          Leia isto de dia, marque duas saídas e três mudanças, e deixe o guia guardado. Você vai
          lembrar delas quando precisar, e é para isso que ele é curto.
        </P>

        <Callout type="warning" title="Aviso importante">
          Este material é informativo. Não substitui consulta, diagnóstico ou tratamento médico, e não
          deve ser usado para mudar horário, dose ou uso de nenhum remédio prescrito. Dificuldade para
          dormir que dura mais de três meses, ronco com pausas na respiração, sonolência ao dirigir,
          pernas inquietas que impedem o sono, ou cansaço que não melhora mesmo dormindo o suficiente,
          exigem avaliação médica.
        </Callout>

        <Spacer size="sm" />
        <Assinatura cor={C} frase="A noite passa, filha." />
      </PdfContentPage>
    </>
  );
}
