/**
 * PDF — /pdf/pontos · Alívio Sem Tomar Nada · Bump 4 · R$ 9,90
 *
 * Escada em Workspace Produtos/Ofertas/avo-yuki/_Inteligencia/analise-bumps.md
 *
 * Completo: 4 blocos de 5 pontos, 20 no total.
 *
 * É o degrau piso, e a função dele é pegar quem recusou todos os outros. Por
 * isso ele é o único produto da linha sem nenhum ingrediente: não se prepara,
 * não se bebe, não se compra nada. Sobreposição com o Caderno é impossível por
 * construção, que foi o problema que derrubou dois bumps anteriores.
 *
 * O título vende a dor, não a técnica: shiatsu aparece no corpo do guia, nunca
 * no nome, porque nome que precisa de explicação já perdeu a venda.
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';
import { DesignPage } from '@/components/ebook/DesignPage';
import { Callout, Divider, Spacer } from '@/components/ebook/VisualElements';
import { CORES, faixaDe, Item, Titulo, P, Assinatura } from '@/components/ebook/sono';

const C = CORES.pontos;
const F = faixaDe(C);

/** Alerta de abertura de bloco. O Callout não tem margem própria e cola no primeiro cartão. */
function AvisoDoBloco({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Callout type="warning" title={title} className="mb-3.5">
      {children}
    </Callout>
  );
}

/** Ponto de pressão. Reaproveita o cartão da linha, trocando os dois rótulos. */
function Ponto(props: {
  numero: number; nome: string; onde: string[]; como: string; porque: string; atencao: string;
}) {
  return (
    <Item
      cor={C}
      numero={props.numero}
      nome={props.nome}
      etiquetaEsq="Onde fica"
      lista={props.onde}
      etiquetaDir="Como apertar"
      texto={props.como}
      porque={props.porque}
      atencao={props.atencao}
    />
  );
}

export default function EbookPontos() {
  return (
    <>
      {/*
        Capa: arte aprovada em 3 de setembro de 2026, em public/pontos-avo-yuki.jpg.
        É a mesma imagem do checkout e da página de vendas, então o comprador
        abre o PDF e vê exatamente a capa que viu antes de comprar. A arte é 2:3
        e a página é A4: com cover, perde cerca de 3 por cento em cima e embaixo,
        o que cai só na margem.
      */}
      <DesignPage
        bg={C.base}
        style={{
          backgroundImage: 'url(/pontos-avo-yuki.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* ── p1 · abertura ─────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={1} pageNumberColor={C.base}
        kicker="Antes de tudo"
        title="Quando não dá pra tomar nada"
      >
        <P>
          Tem hora em que não dá para fazer chá. Você está no trabalho, no ônibus, na fila, na casa
          dos outros, ou é três da manhã e você não vai acender o fogão. É para essas horas que este
          guia existe.
        </P>
        <P>
          No Japão isso tem nome: shiatsu, que quer dizer pressão com os dedos. Não é massagem e não
          é mágica. É apertar um lugar certo, com força certa, pelo tempo certo. Não custa nada, não
          precisa comprar nada, e você leva com você para todo lado, porque são as suas mãos.
        </P>

        <Callout type="info" title="O que dá para esperar, e o que não dá">
          Isto alivia desconforto na hora e ajuda a passar o momento. Não trata doença, não cura nada
          e não substitui remédio nem médico. Quando funciona, funciona em minutos; quando não
          funciona, insistir mais forte não melhora, só machuca.
        </Callout>

        <Titulo cor={C}>Por que a Avó Yuki ensina isso</Titulo>
        <P>
          Porque metade das mulheres que me escrevem já toma remédio demais, e algumas não podem
          tomar mais nada por causa do que já tomam. Para essas, um chá a mais é problema, e a mão é
          a única coisa que não soma com nada.
        </P>

        <Titulo cor={C}>Quantas vezes por dia</Titulo>
        <P>
          Até três vezes ao dia no mesmo ponto, e sem pressa entre uma e outra. Não é remédio que se
          toma de horário: é para quando o incômodo aparece. Se você está apertando o mesmo ponto de
          hora em hora e nada muda, o problema não é a quantidade de vezes.
        </P>

        <Titulo cor={C}>Quando não vai adiantar</Titulo>
        <P>
          Quando a dor tem causa que precisa ser tratada, e isso a mão não resolve. Dente inflamado,
          sinusite com febre, dor de cabeça que apareceu com pressão alta, cólica de pedra no rim.
          Nesses casos o alívio, quando vem, dura pouco e atrasa o que precisa ser feito.
        </P>
      </PdfContentPage>

      {/* ── p2 · como apertar ─────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={2} pageNumberColor={C.base}
        kicker="A técnica inteira"
        title="Como apertar, e é só isto"
      >
        <Titulo cor={C}>A força</Titulo>
        <P>
          Firme, e do tipo que dói bom. Se você fizer careta de dor, está forte demais; se não sentir
          nada, está fraco demais. O ponto certo costuma ser um pouco mais sensível que a pele em
          volta, e é assim que você sabe que achou.
        </P>

        <Titulo cor={C}>O tempo</Titulo>
        <P>
          Um minuto de pressão contínua, ou trinta segundos em círculos pequenos e lentos. Depois
          solta e faz do outro lado, quando o ponto tiver os dois lados. Pode repetir três vezes ao
          dia.
        </P>

        <Titulo cor={C}>A respiração</Titulo>
        <P>
          Aperta soltando o ar, e alivia puxando. Parece detalhe e não é: apertar prendendo a
          respiração deixa o corpo mais duro e o ponto responde menos.
        </P>

        <Divider />

        <Callout type="warning" title="Quando não apertar, e isto vale para todos os 20">
          Grávida não deve usar os pontos das mãos, dos tornozelos e do alto do ombro, e os que têm
          essa ressalva estão marcados um a um. Nunca aperte sobre ferida, machucado, pinta, verruga,
          variz saliente, pele vermelha ou inchada, nem sobre região operada há pouco tempo. Quem
          toma anticoagulante aperta leve, porque marca roxo com facilidade. E nunca aperte a ponto
          de deixar marca.
        </Callout>

        <Titulo cor={C}>Como achar o ponto</Titulo>
        <P>
          A descrição deste guia te leva até perto, e o dedo acha o resto. Passe a ponta do polegar
          devagar pela região descrita, procurando o lugar que responde diferente: mais sensível, mais
          duro, ou com uma covinha que os outros lugares não têm. É esse. Em cada pessoa ele fica um
          dedo para um lado ou para o outro, e isso é normal.
        </P>

        <Titulo cor={C}>Os dois lados, sempre</Titulo>
        <P>
          Todo ponto que existe nos dois lados do corpo se faz nos dois, um de cada vez, mesmo quando
          a dor é só de um lado. Comece pelo lado que dói menos, porque ali você aprende a força certa
          sem se assustar.
        </P>
      </PdfContentPage>

      {/* ── p3 · bloco 1, pontos 1 e 2 ────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={3} pageNumberColor={C.base}
        kicker="Bloco 1 · Pontos 1 a 5"
        title="Cabeça e pescoço"
        subtitle="Pra dor de cabeça de fim de tarde, nuca travada e peso atrás dos olhos."
      >
        <AvisoDoBloco title="Antes deste bloco">
          Dor de cabeça súbita e a pior da sua vida, com febre, vômito, confusão, fraqueza de um lado
          do corpo, fala embolada ou depois de uma pancada, não é ponto de pressão: é emergência, e é
          para procurar atendimento agora. Dor de cabeça que mudou de padrão ou que aparece quase
          todo dia também pede médico.
        </AvisoDoBloco>
        <Ponto
          numero={1} nome="O ponto entre as sobrancelhas"
          onde={['bem no meio, na covinha entre as duas sobrancelhas', 'logo acima do nariz']}
          como="Dedo médio ou polegar, pressão firme e contínua, um minuto, com os olhos fechados. Solta o ar enquanto aperta."
          porque="É o primeiro que eu ensino, porque é fácil de achar sozinha e dá para fazer em qualquer lugar sem ninguém reparar."
          atencao="Não usar sobre pele ferida ou irritada. Se a dor de cabeça vier com visão embaçada ou vômito, pare e procure atendimento."
        />
        <Ponto
          numero={2} nome="As duas covinhas da nuca"
          onde={['na base do crânio, logo abaixo do osso', 'uma de cada lado, no vão dos músculos']}
          como="Polegares nas duas covinhas ao mesmo tempo, cabeça um pouco inclinada para trás, pressão firme por um minuto."
          porque="É onde a tensão do dia se junta em quem trabalha olhando para tela. Costuma doer bom já no primeiro toque."
          atencao="Pressão firme, nunca brusca, e nada de sacudir ou torcer o pescoço. Quem tem problema de coluna cervical, tontura ou pressão alta descontrolada deve apertar leve e por pouco tempo."
        />
      </PdfContentPage>

      {/* ── p4 · bloco 1, pontos 3 a 5 ────────────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={4} pageNumberColor={C.base} kicker="Bloco 1 · Fim">
        <Ponto
          numero={3} nome="As têmporas"
          onde={['no vão macio ao lado dos olhos', 'um dedo depois do fim da sobrancelha']}
          como="Dedos médios dos dois lados, círculos pequenos e lentos, trinta segundos, com a boca relaxada."
          porque="Serve especialmente para a dor que aperta dos dois lados, aquela de fim de expediente, e alivia junto o hábito de travar o maxilar."
          atencao="Pressão leve, porque a região é fina e sensível. Não usar se houver dor ao mastigar com estalo forte no maxilar, que é caso de dentista."
        />
        <Ponto
          numero={4} nome="O vão entre o polegar e o indicador"
          onde={['nas costas da mão', 'no monte de carne entre os dois dedos']}
          como="Aperta com o polegar da outra mão, firme, um minuto de cada lado. É um dos mais sensíveis do corpo."
          porque="É o mais famoso de todos e o mais usado para dor de cabeça e tensão. Também é o mais fácil de fazer disfarçadamente."
          atencao="Não usar na gravidez, em nenhum mês. Quem toma anticoagulante deve apertar leve. Não apertar sobre ferida ou inflamação na mão."
        />
        <Ponto
          numero={5} nome="O alto da cabeça"
          onde={['no ponto mais alto do crânio', 'na linha que liga o topo das duas orelhas']}
          como="Ponta dos dedos médios, pressão suave e contínua, um minuto, sentada e com os ombros soltos."
          porque="É o que eu uso quando a cabeça está cheia e não dói exatamente em lugar nenhum. Fecha o bloco por ser o mais calmo dos cinco."
          atencao="Pressão suave, sempre. Não usar em quem tem ferimento, cirurgia recente na cabeça ou pontos no couro cabeludo."
        />
      </PdfContentPage>

      {/* ── p5 · bloco 2, pontos 6 e 7 ────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={5} pageNumberColor={C.base}
        kicker="Bloco 2 · Pontos 6 a 10"
        title="Barriga e enjoo"
        subtitle="Pra enjoo de viagem, estômago embrulhado e aquela sensação de comida parada."
      >
        <AvisoDoBloco title="Antes deste bloco">
          Enjoo com dor forte na barriga, vômito que não para, sangue no vômito ou nas fezes, febre,
          ou barriga dura ao toque, é caso de emergência e não de ponto de pressão. E enjoo
          persistente sem explicação merece consulta, mesmo quando o alívio da mão funciona.
        </AvisoDoBloco>
        <Ponto
          numero={6} nome="O ponto do enjoo, no pulso"
          onde={['na parte de dentro do antebraço', 'três dedos acima da dobra do pulso, no meio, entre os dois tendões']}
          como="Polegar firme sobre o ponto, um minuto de cada lado, respirando devagar. Pode repetir sempre que o enjoo voltar."
          porque="É o ponto daquelas pulseiras de enjoo de barco e de viagem, e é o mais conhecido do mundo para isso. Dá para fazer sentada no ônibus."
          atencao="Não usar sobre machucado, tatuagem recente ou pele irritada. Quem toma anticoagulante aperta leve. Enjoo de gravidez: converse com a médica antes."
        />
        <Ponto
          numero={7} nome="O ponto abaixo do joelho"
          onde={['quatro dedos abaixo da rótula', 'um dedo para fora do osso da canela, no músculo']}
          como="Polegar ou nó do dedo, pressão firme com círculos lentos, um minuto de cada perna, sentada."
          porque="Lá é o ponto do cansaço e da digestão ao mesmo tempo, e é o que eu mais uso depois de comida pesada."
          atencao="Não apertar sobre variz, machucado ou perna inchada, quente e dolorida de um lado só. Quem tem prótese ou cirurgia recente no joelho deve evitar."
        />
      </PdfContentPage>

      {/* ── p6 · bloco 2, pontos 8 a 10 ───────────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={6} pageNumberColor={C.base} kicker="Bloco 2 · Fim">
        <Ponto
          numero={8} nome="O meio do caminho do estômago"
          onde={['na linha do meio da barriga', 'na metade entre o fim do osso do peito e o umbigo']}
          como="Dedos médio e indicador juntos, pressão suave e constante, um minuto, deitada e com os joelhos dobrados."
          porque="É o ponto de quando a comida parece que ficou parada no meio do peito. Suave já basta, porque a região é mole."
          atencao="Nunca logo depois de comer. Pressão suave: se doer, pare. Não usar em gestação, sobre hérnia, cirurgia recente na barriga ou dor forte."
        />
        <Ponto
          numero={9} nome="Os lados do umbigo"
          onde={['dois dedos para cada lado do umbigo', 'na altura exata dele']}
          como="Dedos dos dois lados ao mesmo tempo, círculos lentos por trinta segundos, deitada."
          porque="Fecha o trabalho que a massagem no sentido do relógio faz, e serve para os dias de intestino preguiçoso."
          atencao="Não usar em gestação, sobre hérnia ou cirurgia recente. Pare se houver dor, e nunca aperte barriga dura ou dolorida ao toque."
        />
        <Ponto
          numero={10} nome="O centro da palma"
          onde={['no meio da palma da mão', 'onde a ponta do dedo médio encosta quando você fecha a mão']}
          como="Polegar da outra mão, pressão firme e contínua, um minuto de cada lado."
          porque="É o mais discreto de todos, dá para fazer numa reunião, e serve tanto para o enjoo quanto para o nervoso que vem junto com ele."
          atencao="Não usar sobre corte, calo inflamado ou ferida na mão. Quem toma anticoagulante aperta leve."
        />
      </PdfContentPage>

      {/* ── p7 · bloco 3, pontos 11 e 12 ──────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={7} pageNumberColor={C.base}
        kicker="Bloco 3 · Pontos 11 a 15"
        title="Peito e nervoso"
        subtitle="Pra aperto no peito de ansiedade, respiração curta e coração acelerado de susto."
      >
        <AvisoDoBloco title="Leia isto antes de tudo neste bloco">
          Dor ou aperto no peito que se espalha para o braço, o pescoço, o queixo ou as costas, com
          suor frio, falta de ar, enjoo ou desmaio, é emergência: chame o SAMU pelo 192 ou vá ao
          pronto-socorro imediatamente. Não fique apertando ponto nenhum para ver se passa. Este
          bloco é para o aperto de ansiedade, e distinguir os dois não é tarefa sua sozinha em casa.
        </AvisoDoBloco>
        <Ponto
          numero={11} nome="O meio do peito"
          onde={['no osso do meio do peito', 'na altura aproximada dos mamilos, no ponto que é mais sensível ao toque']}
          como="Dedos médio e indicador, pressão suave e constante, um minuto, respirando devagar e soltando o ar longo."
          porque="É o ponto do aperto, e ele é sensível justamente em quem anda apertada. Faz par com a respiração: sem respirar devagar, ele não faz nada."
          atencao="Pressão suave sobre o osso, nunca forte. Se o aperto vier com os sinais do alerta acima, pare e procure atendimento agora."
        />
        <Ponto
          numero={12} nome="O ponto do pulso, lado do dedinho"
          onde={['na dobra do pulso, do lado do dedo mínimo', 'na covinha logo abaixo do osso pequeno']}
          como="Polegar, pressão firme, um minuto de cada lado, de preferência sentada e com o braço apoiado."
          porque="É o que eu ensino para quem acorda de madrugada com o coração acelerado sem motivo. Fácil de achar no escuro."
          atencao="Não usar sobre machucado ou pele irritada. Coração acelerado que não passa, com tontura ou desmaio, é caso de médico e não de ponto."
        />
      </PdfContentPage>

      {/* ── p8 · bloco 3, pontos 13 a 15 ──────────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={8} pageNumberColor={C.base} kicker="Bloco 3 · Fim">
        <Ponto
          numero={13} nome="O vão entre o dedão e o segundo dedo do pé"
          onde={['nas costas do pé', 'no vão entre o dedão e o dedo do lado, subindo dois dedos']}
          como="Polegar, pressão firme com círculos lentos, um minuto de cada pé, sentada."
          porque="É o ponto de descarregar, e é o que eu faço no fim do dia difícil. Nos pés a gente aperta mais forte que nas mãos sem machucar."
          atencao="Não apertar sobre ferida, unha encravada, micose ou pele rachada. Quem tem diabetes deve olhar o pé antes e apertar leve, pela sensibilidade reduzida."
        />
        <Ponto
          numero={14} nome="Abaixo da clavícula"
          onde={['logo abaixo do osso da clavícula', 'na covinha perto do ombro, dos dois lados']}
          como="Dedos cruzados no peito, cada mão no lado oposto, pressão firme por um minuto enquanto solta o ar devagar."
          porque="Serve para a respiração curta de quem está tensa e respira só com a parte de cima do peito. A posição dos braços já ajuda sozinha."
          atencao="Pressão firme mas sem forçar o osso. Não usar em quem tem marca-passo, cirurgia recente no peito ou fratura de clavícula."
        />
        <Ponto
          numero={15} nome="A sola do pé"
          onde={['na sola, no terço de cima', 'na covinha que aparece quando você dobra os dedos do pé']}
          como="Polegar ou nó do dedo, pressão firme por um minuto de cada pé, sentada e com o pé apoiado no joelho oposto."
          porque="Fecha o bloco com o ponto mais distante da cabeça, e é justamente por isso que ele funciona para quem está com a cabeça cheia demais."
          atencao="Não usar na gravidez. Não apertar sobre ferida, rachadura ou micose. Quem tem diabetes ou pouca sensibilidade no pé deve apertar leve e conferir a pele depois."
        />
      </PdfContentPage>

      {/* ── p9 · bloco 4, pontos 16 e 17 ──────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={9} pageNumberColor={C.base}
        kicker="Bloco 4 · Pontos 16 a 20"
        title="Corpo cansado e noite"
        subtitle="Pra ombro travado, lombar pesada, perna cansada e a madrugada em que o sono não volta."
      >
        <AvisoDoBloco title="Antes deste bloco">
          Dor nas costas com formigamento, fraqueza na perna, dificuldade para segurar o xixi ou dor
          que acorda você toda noite não é caso de apertar ponto: é consulta. E perna inchada,
          quente, vermelha ou dolorida de um lado só é motivo para procurar médico no mesmo dia, sem
          massagem nenhuma antes.
        </AvisoDoBloco>
        <Ponto
          numero={16} nome="O alto do ombro"
          onde={['no ponto mais alto do músculo do ombro', 'na metade entre o pescoço e a ponta do ombro']}
          como="Dedos da mão oposta em pinça, aperta e solta lentamente por um minuto de cada lado, com o ombro relaxado."
          porque="É onde quase todo mundo carrega o dia, e costuma estar duro em quem passa horas no celular ou no computador."
          atencao="Não usar na gravidez, em nenhum mês. Quem tem hérnia de disco cervical, cirurgia recente no ombro ou dor irradiando para o braço deve falar com médico antes."
        />
        <Ponto
          numero={17} nome="As duas covinhas da lombar"
          onde={['na altura da cintura, nas costas', 'dois dedos para cada lado da coluna, nunca em cima dela']}
          como="Polegares nas duas covinhas, em pé e com as mãos na cintura, pressão firme com círculos lentos por um minuto."
          porque="É a região que mais reclama em quem passa o dia de pé. Fazer em pé, com as mãos na cintura, já coloca o polegar quase no lugar certo."
          atencao="Nunca aperte em cima da coluna, sempre nos lados. Não usar sobre a região dos rins com força, nem em quem tem pedra nos rins, infecção urinária ou cirurgia recente nas costas."
        />
      </PdfContentPage>

      {/* ── p10 · bloco 4, pontos 18 a 20 ─────────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={10} pageNumberColor={C.base} kicker="Bloco 4 · Fim">
        <Ponto
          numero={18} nome="A batata da perna"
          onde={['no meio da panturrilha', 'na parte mais carnuda, atrás da perna']}
          como="As duas mãos em volta da panturrilha, aperta e solta lentamente subindo do tornozelo em direção ao joelho, um minuto por perna."
          porque="Sempre de baixo para cima, no sentido da volta. É o que alivia a perna de quem passou o dia em pé ou sentada sem se mexer."
          atencao="Não fazer em perna quente, vermelha, inchada ou dolorida de um lado só, nem sobre variz saliente. Quem já teve trombose deve falar com o médico antes."
        />
        <Ponto
          numero={19} nome="Atrás do tornozelo"
          onde={['no vão entre o osso do tornozelo interno e o tendão de trás', 'do lado de dentro do pé']}
          como="Polegar e indicador em pinça dos dois lados do tendão, pressão suave por um minuto de cada pé, antes de deitar."
          porque="É o ponto da noite, e por isso ele está no fim do guia. Faz par com o próximo, e os dois juntos levam menos de três minutos."
          atencao="Não usar na gravidez, em nenhum mês. Não apertar sobre inchaço, ferida ou tornozelo torcido recentemente."
        />
        <Ponto
          numero={20} nome="A testa inteira, com a palma"
          onde={['a testa toda', 'da sobrancelha até a linha do cabelo']}
          como="A palma da mão inteira apoiada na testa, sem apertar, só o peso da mão, por dois minutos, deitada e de olhos fechados."
          porque="Fecha o guia com o único que não é pressão, é peso. É o que eu faço na minha neta quando ela não dorme, e o que eu faço em mim quando é três da manhã."
          atencao="Nenhuma contraindicação, desde que não haja ferida na testa. Se a insônia for constante, isso pede mais do que a mão na testa: veja o Manual do Sono ou procure orientação."
        />
      </PdfContentPage>

      {/* ── p11 · aviso legal e encerramento ──────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={11} pageNumberColor={C.base} kicker="Pra terminar" title="Uma última coisa">
        <P>
          Vinte pontos é muito para decorar, e você não precisa. Escolha dois, os que servem para o
          que mais te pega, e use esses. Quando virarem hábito, você aprende outro.
        </P>
        <P>
          E lembre da regra que abre o guia, porque é a que mais gente ignora: se apertar mais forte
          não melhorou, apertar ainda mais forte também não vai melhorar. Sai do ponto e volta
          depois.
        </P>

        <Callout type="warning" title="Aviso importante">
          Este material é informativo e de tradição caseira. Não substitui consulta, diagnóstico ou
          tratamento médico, e não deve ser usado para adiar atendimento nem para interromper
          qualquer remédio prescrito. Gestantes não devem usar os pontos das mãos, dos pés, dos
          tornozelos e do alto do ombro. Não pressione sobre feridas, varizes, pintas, inchaços,
          áreas operadas recentemente ou regiões com dor de causa desconhecida. Dor no peito, falta
          de ar, fraqueza de um lado do corpo, fala embolada ou dor de cabeça súbita e muito forte
          são emergência: procure atendimento imediatamente.
        </Callout>

        <Spacer size="sm" />
        <Assinatura cor={C} frase="As suas mãos bastam, filha." />
      </PdfContentPage>
    </>
  );
}
