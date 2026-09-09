/**
 * PDF — /pdf/menopausa · A Menopausa Sem Sufoco · Bump 1 · R$ 37,90
 *
 * Escada em Workspace Produtos/Ofertas/avo-yuki/_Inteligencia/analise-bumps.md
 *
 * Completo: 4 blocos de 5 preparos, 20 no total, mais a rotina de 21 dias.
 *
 * Recorte deliberado: só entra aqui o que os 9 blocos do Caderno não cobrem.
 * Calorão, suor de madrugada e ressecamento não existem lá. Sono e humor
 * existem, então aqui eles aparecem só no recorte da menopausa, nunca como
 * receita genérica, senão o bump vira sobra do produto principal.
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';
import { DesignPage } from '@/components/ebook/DesignPage';
import { Callout, Spacer } from '@/components/ebook/VisualElements';
import { CORES, faixaDe, Item, Titulo, P, Assinatura } from '@/components/ebook/sono';

const C = CORES.menopausa;
const F = faixaDe(C);

const BLOCOS = [
  ['Calorão e suor', 5],
  ['A noite: suor e madrugada', 5],
  ['Corpo ressecado', 5],
  ['Humor, memória e energia', 5],
] as const;

/** Alerta de abertura de bloco. O Callout não tem margem própria e cola no primeiro cartão. */
function AvisoDoBloco({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Callout type="warning" title={title} className="mb-3.5">
      {children}
    </Callout>
  );
}

/** Linha de atalho: da queixa principal para o preparo por onde comecar. */
function Atalho({ queixa, onde }: { queixa: string; onde: string }) {
  return (
    <div className="mb-1.5 flex gap-3 rounded-lg px-3 py-2" style={{ background: `${C.base}0C` }}>
      <span className="w-[42%] shrink-0 text-[11.5px] font-semibold leading-snug" style={{ color: C.base }}>
        {queixa}
      </span>
      <span className="flex-1 text-[11.5px] leading-snug text-foreground/88">{onde}</span>
    </div>
  );
}

/** Uma semana da rotina, com os dias para marcar. */
function SemanaGrade({
  n, nome, dias, entra, mantem,
}: { n: number; nome: string; dias: number[]; entra: string; mantem: string }) {
  return (
    <div className="avoid-page-break mb-3 rounded-xl border p-3" style={{ borderColor: `${C.base}22` }}>
      <div className="mb-2 flex items-baseline justify-between">
        <h4 className="font-display text-[1rem] font-semibold" style={{ color: C.base }}>
          Semana {n} — {nome}
        </h4>
        <span className="text-[9.5px] font-bold uppercase tracking-[0.14em]" style={{ color: C.acento }}>
          Marque cada dia
        </span>
      </div>
      <div className="mb-2.5 flex gap-1.5">
        {dias.map((d) => (
          <span
            key={d}
            className="flex h-7 flex-1 items-center justify-center rounded border text-[10.5px] font-bold"
            style={{ borderColor: `${C.base}33`, color: C.suave }}
          >
            {d}
          </span>
        ))}
      </div>
      <p className="text-[11.5px] leading-snug text-foreground/88">
        <strong style={{ color: C.base }}>Entra:</strong> {entra}
      </p>
      <p className="mt-1 text-[11.5px] leading-snug text-foreground/88">
        <strong style={{ color: C.base }}>Mantém:</strong> {mantem}
      </p>
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
            <span className="font-display text-[13.5px] font-semibold" style={{ color: C.base }}>{nome}</span>
          </span>
          <span className="text-[11.5px] font-medium" style={{ color: C.suave }}>{n} preparos</span>
        </div>
      ))}
    </div>
  );
}

export default function EbookMenopausa() {
  return (
    <>
      {/*
        Capa: arte aprovada em 3 de setembro de 2026, em public/menopausa-avo-yuki.jpg.
        É a mesma imagem do checkout e da página de vendas, então o comprador
        abre o PDF e vê exatamente a capa que viu antes de comprar. A arte é 2:3
        e a página é A4: com cover, perde cerca de 3 por cento em cima e embaixo,
        o que cai só na margem.
      */}
      <DesignPage
        bg={C.base}
        style={{
          backgroundImage: 'url(/menopausa-avo-yuki.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* ── p1 · abertura ─────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={1} pageNumberColor={C.base}
        kicker="Antes de tudo"
        title="Menopausa não é doença, e este guia não é tratamento"
      >
        <P>
          Menopausa não é doença. É uma passagem, e ela é diferente em cada mulher: tem quem quase
          não sinta e tem quem sofra de verdade. Eu não vou dizer para você qual das duas você é, nem
          em quanto tempo alguma coisa muda.
        </P>
        <P>
          O que eu tenho é o que a minha avó fazia e o que a minha mãe fez, anotado com quantidade,
          hora e limite. É alívio para o dia a dia, e é isso que este guia entrega.
        </P>

        <Callout type="warning" title="Procure a médica ou o médico se">
          Você teve qualquer sangramento depois de passar doze meses sem menstruar. Isso não se trata
          em casa, em nenhuma hipótese, e é o aviso mais importante deste guia inteiro. Também:
          calorão que atrapalha a vida, dor durante a relação, tristeza que não passa, ou coração
          disparado. Existe tratamento para menopausa, e nenhum chá substitui essa conversa.
        </Callout>

        <Titulo cor={C}>O que este guia não faz</Titulo>
        <P>
          Não substitui reposição hormonal nem qualquer remédio prescrito, e não serve de motivo para
          parar nenhum deles. Não promete acabar com o calorão, porque isso não depende só do que
          você bebe. E não promete prazo, porque prazo em menopausa é a promessa mais fácil de
          desmentir que existe.
        </P>

        <Titulo cor={C}>Em que fase você está</Titulo>
        <P>
          Muita mulher me procura sem saber o nome do que está vivendo, e o nome ajuda a entender o
          que esperar. Antes da parada, vêm os anos em que a menstruação fica irregular, atrasa,
          adianta, some um mês e volta no outro. É nessa fase que o calorão costuma ser mais forte, e
          é a que mais assusta justamente porque ainda há menstruação e ninguém liga uma coisa à outra.
        </P>
        <P>
          A menopausa em si é uma data, e ela só se sabe olhando para trás: é o dia em que se completa
          doze meses sem menstruar. Depois disso vem o resto da vida, em que o calorão tende a
          diminuir com o tempo, mas o ressecamento e o osso passam a pedir mais atenção do que pediam.
        </P>
        <P>
          Este guia serve para as três fases. O que muda é o bloco que vai te interessar mais em cada
          uma delas.
        </P>
      </PdfContentPage>

      {/* ── p2 · o que está acontecendo ───────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={2} pageNumberColor={C.base}
        kicker="A parte que quase ninguém explica"
        title="Por que o corpo desregula o termostato"
      >
        <P>
          O calorão não é calor de verdade. A temperatura do quarto não mudou, o corpo é que passou a
          ler errado. O termostato ficou sensível demais, e uma variação mínima, que antes passava em
          branco, agora dispara a ordem de esfriar tudo de uma vez: vaso abre, sangue vai para a
          pele, e vem o calor com o suor logo atrás.
        </P>

        <Callout type="info" title="Por isso o que funciona é o que evita a disparada">
          Não adianta correr atrás do calorão depois que ele começou, porque em três minutos ele já
          passou sozinho. O que muda o dia é reduzir o que dispara: bebida quente demais, álcool,
          pimenta, roupa que não respira, e o susto do estresse. É por isso que este guia tem tanto
          hábito quanto chá.
        </Callout>

        <Titulo cor={C}>E por que a madrugada é pior</Titulo>
        <P>
          À noite o corpo já baixa a temperatura sozinho para dormir. Se o termostato está sensível,
          essa descida vira disparada, e você acorda encharcada às três da manhã. Não é sono ruim, é
          o mesmo calorão em outro horário, e é por isso que ele tem bloco próprio aqui.
        </P>

        <Titulo cor={C}>Onde este guia para</Titulo>
        <P>
          Ele cuida do calorão, do suor, do ressecamento e do humor. Sono em geral e ansiedade em
          geral não são assunto daqui: estão no Caderno da Avó Yuki, e o que está neste guia é só o
          recorte da menopausa.
        </P>

        <Titulo cor={C}>Por que é tão diferente de uma mulher para outra</Titulo>
        <P>
          Tem mulher que atravessa quase sem sentir e tem mulher que sofre por anos, e isso não é
          força de vontade nem falta dela. Pesa a história do corpo, o peso, o cigarro, a rotina de
          sono, o quanto de calor faz onde você mora, e o quanto de sossego a sua vida permite. Nada
          disso é culpa, e não adianta comparar a sua passagem com a da sua irmã.
        </P>

        <Callout type="myth" title="O que não é causa, por mais que pareça">
          Calorão não é pressão alta, não é problema de tireoide por si só, e não é sinal de que algo
          está errado com você. Mas todas essas coisas existem e podem aparecer na mesma idade, com
          sintomas parecidos. É por isso que um exame de rotina nessa fase vale mais do que qualquer
          chá deste guia, e por isso eu insisto tanto na consulta.
        </Callout>
      </PdfContentPage>

      {/* ── p3 · como usar e índice ───────────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={3} pageNumberColor={C.base}
        kicker="Como usar"
        title="Os quatro blocos, e por onde começar"
      >
        <P>
          Comece pelo bloco que mais te incomoda hoje, e dentro dele pela primeira receita, que é
          sempre a mais suave. Se você não sabe por onde começar, comece pelo bloco 1: calorão é o
          que mais tira o sossego e é o que responde mais rápido a mudança de hábito.
        </P>

        <Indice />

        <Spacer size="sm" />

        <Callout type="tip" title="Anote o que dispara">
          Por uma semana, anote a hora de cada calorão e o que você tinha feito nos trinta minutos
          antes. Quase toda mulher que faz isso descobre dois ou três gatilhos próprios, e tirar
          esses dois ou três costuma valer mais que qualquer chá deste guia.
        </Callout>

        <Spacer size="sm" />

        <Titulo cor={C}>Se você só quiser saber por onde começar</Titulo>
        <Atalho queixa="A onda de calor no meio do dia" onde="Bloco 1, e comece pelo borrifador (preparo 3) e pela semana dos gatilhos (preparo 5)." />
        <Atalho queixa="Acordar encharcada de madrugada" onde="Bloco 2, e comece pela camisola seca (preparo 6) e pela roupa de cama (preparo 7)." />
        <Atalho queixa="Pele repuxando e olho ardendo" onde="Bloco 3, e comece pela água do dia (preparo 12) e pelo banho curto (preparo 15)." />
        <Atalho queixa="Pavio curto e cansaço que não passa" onde="Bloco 4, e comece pela caminhada (preparo 16), que é a que faz mais coisas de uma vez." />
        <Atalho queixa="Não sei, é tudo ao mesmo tempo" onde="Faça a rotina de 21 dias na ordem em que ela está escrita, e não escolha nada." />
      </PdfContentPage>

      {/* ── p4 · bloco 1, preparos 1 e 2 ──────────────────────────── */}
      <PdfContentPage
        accentGradient={F} pageNumber={4} pageNumberColor={C.base}
        kicker="Bloco 1 · Preparos 1 a 5"
        title="Calorão e suor"
        subtitle="Pra onda de calor que sobe do peito pro rosto e deixa a blusa molhada em três minutos."
      >
        <AvisoDoBloco title="Antes deste bloco">
          Nada daqui acaba com o calorão, e quem promete isso está inventando. O que dá para fazer é
          reduzir a frequência e a força, e isso já muda o dia. Se o calorão está atrapalhando o
          trabalho ou o sono a ponto de você não aguentar, existe tratamento médico e ele funciona:
          essa conversa é com a ginecologista.
        </AvisoDoBloco>
        <Item
          cor={C} numero={1} nome="Chá de folha de amora"
          lista={['1 colher de chá da folha seca', '250ml de água']}
          texto="Água fervida, fogo desligado, tampa por dez minutos. Coa e toma morno, uma xícara por dia, de preferência no fim da tarde."
          porque="É o chá que toda brasileira ouve falar quando chega nessa idade, e é o mais suave de todos. Por ser suave, é o que dá para tomar com regularidade."
          atencao="Pode baixar o açúcar do sangue: quem toma remédio para diabetes deve falar com o médico antes. Não usar em gestação. Uma xícara por dia é o suficiente, e mais não melhora."
        />
        <Item
          cor={C} numero={2} nome="Chá de sálvia"
          lista={['meia colher de chá de folha seca de sálvia', '250ml de água']}
          texto="Água fervida, fogo desligado, tampa por oito minutos. Coa e toma morno, uma xícara por dia, no fim da tarde."
          porque="É o preparo tradicional para suor, e é o mais forte deste bloco. Meia colher basta: sálvia demais fica amarga e não ajuda mais por isso."
          atencao="No máximo sete dias seguidos, com pausa de uma semana depois. Não usar em gestação, amamentação, epilepsia, nem por quem já teve câncer de mama sem falar com o médico."
        />
      </PdfContentPage>

      {/* ── p5 · bloco 1, preparos 3 a 5 ──────────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={5} pageNumberColor={C.base} kicker="Bloco 1 · Fim">
        <Item
          cor={C} numero={3} nome="O borrifador da bolsa"
          lista={['1 borrifador pequeno', 'água filtrada', '1 lenço de algodão']}
          texto="Borrifa no rosto, na nuca e nos pulsos assim que sentir a onda começar, e abana com o lenço. Guarda o borrifador na bolsa e outro na gaveta do trabalho."
          porque="A água evaporando esfria a pele mais rápido que qualquer bebida gelada esfria por dentro. É o único deste guia que age no minuto em que está acontecendo."
          atencao="Água limpa, trocada a cada dois dias. Não adicione álcool nem óleo essencial: no rosto, os dois ardem e podem irritar a pele."
        />
        <Item
          cor={C} numero={4} nome="As camadas de algodão"
          lista={['roupas de algodão', 'uma peça a mais para tirar']}
          texto="Vista-se em camadas finas de tecido natural, de modo que dê para tirar uma peça em qualquer lugar sem ficar sem roupa. Evite poliéster junto à pele."
          porque="Tecido sintético segura o suor contra o corpo e faz o calorão durar mais do que duraria. Algodão deixa evaporar, e evaporar é o que encerra a onda."
          atencao="Vale também para a roupa de cama e para o pijama. Lençol de microfibra é bonito e é o pior para quem sua de madrugada."
        />
        <Item
          cor={C} numero={5} nome="A semana dos gatilhos"
          lista={['1 papel', '1 caneta', '7 dias']}
          texto="Anote a hora de cada calorão e o que você fez nos trinta minutos antes. No fim da semana, olhe a lista e corte os dois que mais se repetirem."
          porque="Os gatilhos mais comuns são café, bebida muito quente, álcool, pimenta e estresse, mas os seus podem ser outros. Descobrir os seus vale mais que qualquer chá daqui."
          atencao="Não corte tudo de uma vez, porque aí você não sabe qual era. Um por semana, e observe. E não use a lista para se culpar: gatilho não é culpa, é informação."
        />
      </PdfContentPage>

      {/* -- p6 - bloco 2, preparos 6 e 7 -- */}
      <PdfContentPage
        accentGradient={F} pageNumber={6} pageNumberColor={C.base}
        kicker="Bloco 2 · Preparos 6 a 10"
        title="A noite: suor e madrugada"
        subtitle="Pra acordar encharcada às três da manhã e não conseguir voltar a dormir depois."
      >
        <AvisoDoBloco title="Antes deste bloco">
          Suor de madrugada é o mesmo calorão em outro horário, e por isso ele se resolve mais pela
          preparação da noite do que pelo que se bebe. Sono em geral não é assunto deste guia: se o
          problema é pegar no sono, e não o suor, isso está no Caderno da Avó Yuki.
        </AvisoDoBloco>
        <Item
          cor={C} numero={6} nome="A camisola trocada"
          lista={['1 camisola de algodão dobrada', '1 toalha de rosto', 'a cadeira ao lado da cama']}
          texto="Deixe uma camisola seca e uma toalha ao alcance da mão antes de deitar. Ao acordar suada, seca, troca e volta a deitar sem acender luz forte."
          porque="O que rouba a noite não é o suor, é o que vem depois: levantar, procurar roupa, acender a luz e acordar de vez. Com tudo ali do lado, isso leva um minuto."
          atencao="Luz do celular no mínimo, ou nenhuma. Luz forte às três da manhã acorda o corpo por completo e aí o suor deixa de ser o problema."
        />
        <Item
          cor={C} numero={7} nome="O lençol de algodão em camadas"
          lista={['lençol de algodão', '2 cobertas finas no lugar de 1 grossa']}
          texto="Troque o lençol de microfibra por algodão e a coberta grossa por duas finas, que dá para tirar uma no meio da noite sem se descobrir inteira."
          porque="Microfibra é bonita e é a pior para quem sua: segura o suor contra a pele. Duas cobertas finas resolvem o que uma grossa não deixa ajustar."
          atencao="Vale também para o travesseiro: fronha de algodão, trocada com mais frequência nas semanas de suor forte."
        />
      </PdfContentPage>

      {/* -- p7 - bloco 2, preparos 8 a 10 -- */}
      <PdfContentPage accentGradient={F} pageNumber={7} pageNumberColor={C.base} kicker="Bloco 2 · Fim">
        <Item
          cor={C} numero={8} nome="Chá de trevo-vermelho"
          lista={['1 colher de chá da flor seca', '250ml de água']}
          texto="Água fervida, fogo desligado, tampa por dez minutos. Coa e toma morno, uma xícara por dia, no fim da tarde."
          porque="É o preparo tradicional mais associado a essa fase, e é por isso que ele vem com a lista de ressalvas mais longa deste guia."
          atencao="Não usar por quem teve câncer de mama, de útero ou de ovário, nem por quem toma tamoxifeno, anticoagulante ou anticoncepcional, sem falar com a médica. Não usar em gestação. No máximo cinco dias por semana."
        />
        <Item
          cor={C} numero={9} nome="O gergelim preto do dia"
          lista={['1 colher de sopa de gergelim preto', '1 pilão ou moedor']}
          texto="Moa na hora e polvilhe sobre a comida do almoço, sobre o arroz ou sobre a salada. Uma colher por dia, todo dia."
          porque="Lá em casa o gergelim preto era comida de mulher mais velha, e era moído na hora porque inteiro passa direto sem ser aproveitado."
          atencao="Moa na hora: moído de véspera rança e perde o gosto. Quem tem divertículo ou alergia a gergelim deve evitar. Uma colher por dia é suficiente."
        />
        <Item
          cor={C} numero={10} nome="O registro da madrugada"
          lista={['1 papel na cabeceira', '1 caneta']}
          texto="Marque com um risco cada vez que acordar suada, por duas semanas. Só o risco, sem escrever nada, para não acordar de vez."
          porque="Duas semanas de riscos mostram se está melhorando ou piorando, e é o papel que você leva para a consulta. Memória de quem dorme mal não serve de prova."
          atencao="Se o número de riscos estiver crescendo, ou se você não estiver conseguindo trabalhar de tão cansada, leve esse papel à ginecologista. É informação de tratamento, não de chá."
        />
      </PdfContentPage>

      {/* -- p8 - bloco 3, preparos 11 e 12 -- */}
      <PdfContentPage
        accentGradient={F} pageNumber={8} pageNumberColor={C.base}
        kicker="Bloco 3 · Preparos 11 a 15"
        title="Corpo ressecado"
        subtitle="Pra pele que repuxa, olho que arde, boca seca e o ressecamento de que ninguém fala."
      >
        <AvisoDoBloco title="Antes deste bloco">
          Ressecamento é a queixa que mais gente tem e que menos gente diz em voz alta, principalmente
          o íntimo. Vale dizer com todas as letras: existe tratamento para isso, é simples e é
          eficaz, e a conversa é com a ginecologista. O que está aqui é conforto, não tratamento.
        </AvisoDoBloco>
        <Item
          cor={C} numero={11} nome="Compressa de camomila para o olho seco"
          lista={['1 xícara de chá de camomila morno, coado', '2 discos de algodão']}
          texto="Molha o algodão no chá morno, bem coado, e deixa sobre os olhos fechados por cinco minutos, à noite."
          porque="O olho seco dessa fase arde mais no fim do dia. O morno ajuda a soltar o que está ressecado na borda da pálpebra, e é o que dá alívio para dormir."
          atencao="Coe muito bem, para não ficar pedacinho de erva. Não use se o olho estiver vermelho, com secreção ou com dor, que é caso de médico. Não substitui colírio prescrito."
        />
        <Item
          cor={C} numero={12} nome="A água do dia inteiro"
          lista={['1 garrafa de meio litro', '2 enchidas por dia, no mínimo']}
          texto="Deixe a garrafa à vista e beba ao longo do dia, não de uma vez. O objetivo é a urina ficar clara, quase sem cor."
          porque="Boa parte do ressecamento de pele e de boca é falta de água, e não falta de creme. É o mais barato deste guia e o que quase todo mundo pula."
          atencao="Quem tem insuficiência cardíaca ou renal deve seguir a quantidade que o médico indicou, e não esta. Urina muito escura e persistente merece avaliação."
        />
      </PdfContentPage>

      {/* -- p9 - bloco 3, preparos 13 a 15 -- */}
      <PdfContentPage accentGradient={F} pageNumber={9} pageNumberColor={C.base} kicker="Bloco 3 · Fim">
        <Item
          cor={C} numero={13} nome="O óleo de coco para o ressecamento íntimo"
          lista={['óleo de coco puro, sem perfume', 'as mãos limpas']}
          texto="Uma quantidade pequena, por fora, quando houver ardência ou repuxamento. Nunca dentro, e nunca com produto perfumado."
          porque="É o alívio caseiro mais usado e o mais simples. Está aqui porque é melhor dizer como usar do que fingir que essa queixa não existe."
          atencao="Não use com preservativo de látex: o óleo desfaz a borracha. Não é lubrificante estéril nem tratamento. Ardência, corrimento, cheiro forte, sangramento ou dor na relação são consulta médica, e existe tratamento específico que funciona muito melhor que isto."
        />
        <Item
          cor={C} numero={14} nome="O gole pequeno para a boca seca"
          lista={['água à mão', 'goma de mascar sem açúcar']}
          texto="Goles pequenos ao longo do dia e goma sem açúcar depois das refeições. Evite enxaguante bucal com álcool, que resseca mais."
          porque="Boca seca dessa fase aumenta cárie e mau hálito, e quase ninguém liga uma coisa à outra. Mascar é o que faz a saliva voltar."
          atencao="Goma sem açúcar, sempre. Se a boca seca for constante, avise a dentista e a médica: pode ser efeito de remédio que você já toma e que dá para ajustar."
        />
        <Item
          cor={C} numero={15} nome="O banho mais curto e mais morno"
          lista={['5 a 10 minutos', 'água morna, não quente']}
          texto="Banho curto e morno, sabonete só onde precisa, e hidratante na pele ainda úmida, antes de secar com a toalha."
          porque="Banho quente e demorado tira a gordura natural da pele, e nessa fase ela já está reduzida. O banho que parece bom na hora é o que deixa a perna coçando à noite."
          atencao="Se a pele coça a ponto de tirar o sono, ou se aparecerem placas e descamação, isso é dermatologista, e não banho."
        />
      </PdfContentPage>

      {/* -- p10 - bloco 4, preparos 16 e 17 -- */}
      <PdfContentPage
        accentGradient={F} pageNumber={10} pageNumberColor={C.base}
        kicker="Bloco 4 · Preparos 16 a 20"
        title="Humor, memória e energia"
        subtitle="Pra pavio curto, palavra que some no meio da frase e cansaço que não passa com sono."
      >
        <AvisoDoBloco title="Antes deste bloco">
          Esquecer nome e perder a palavra no meio da frase assusta, e nessa fase costuma ser
          passageiro. Mas tristeza que não passa, perda de interesse por tudo ou pensamento de se
          machucar não são coisa de fase, são motivo para procurar ajuda agora. E quem já toma
          remédio para humor não deve mexer nele por causa de nada escrito aqui.
        </AvisoDoBloco>
        <Item
          cor={C} numero={16} nome="A caminhada de vinte minutos"
          lista={['1 par de sapato confortável', '20 minutos', 'de preferência de manhã']}
          texto="Vinte minutos de caminhada, cinco dias por semana, num ritmo em que dê para conversar mas não para cantar."
          porque="Se eu pudesse deixar uma coisa só deste guia, seria esta. Ajuda humor, sono, osso e calorão ao mesmo tempo, e é a única daqui que faz as quatro coisas juntas."
          atencao="Quem tem problema de coração, de joelho ou pressão descontrolada deve começar com dez minutos e falar com o médico. Dor no peito, falta de ar ou tontura ao caminhar é parar e procurar atendimento."
        />
        <Item
          cor={C} numero={17} nome="O lugar fixo das coisas"
          lista={['1 gancho para a chave', '1 lugar só para os óculos e o celular']}
          texto="Um lugar fixo para cada coisa que some, e devolver sempre ali. Some a isso uma lista escrita à noite para o dia seguinte."
          porque="Metade do que parece falha de memória é falta de rotina. Lugar fixo tira da cabeça a tarefa de lembrar, e a cabeça agradece."
          atencao="Se a dificuldade for para lembrar de coisas recentes importantes, se perder em lugar conhecido ou trocar palavras com frequência, isso merece avaliação médica e não é assunto de organização."
        />
      </PdfContentPage>

      {/* -- p11 - bloco 4, preparos 18 a 20 -- */}
      <PdfContentPage accentGradient={F} pageNumber={11} pageNumberColor={C.base} kicker="Bloco 4 · Fim">
        <Item
          cor={C} numero={18} nome="O ferro do prato"
          lista={['feijão, carne, folha escura', '1 fruta cítrica na mesma refeição']}
          texto="Coma a folha escura e o feijão junto com uma fruta cítrica, e deixe o café e o chá para uma hora depois da refeição, nunca durante."
          porque="Café e chá tomados na refeição atrapalham o aproveitamento do ferro do prato. A fruta cítrica faz o contrário. É de graça e quase ninguém sabe."
          atencao="Não tome suplemento de ferro por conta própria: ferro a mais faz mal e a dose depende de exame. Cansaço que não melhora merece exame de sangue, não suplemento adivinhado."
        />
        <Item
          cor={C} numero={19} nome="O cálcio e o sol de cada dia"
          lista={['leite, iogurte, sardinha, folha escura, gergelim', '15 minutos de sol nos braços']}
          texto="Uma fonte de cálcio em cada refeição principal e um pouco de sol nos braços, fora do horário mais forte, na maioria dos dias."
          porque="É a única coisa deste guia que é sobre daqui a dez anos, e não sobre esta semana. Osso perde mais rápido nessa fase, e o que se come agora conta."
          atencao="Não tome cálcio nem vitamina D por conta própria: os dois em excesso fazem mal, e a dose sai de exame. Peça à médica para avaliar, principalmente se houver fratura na família."
        />
        <Item
          cor={C} numero={20} nome="As três conversas"
          lista={['3 mulheres que você conhece', 'nenhum preparo']}
          texto="Converse com três mulheres da sua idade sobre o que você está sentindo. Sem procurar solução, só para escutar como foi com cada uma."
          porque="Fecha o guia sem nada para tomar, de propósito. Boa parte do peso dessa fase vem de achar que é só com você, e é justamente aí que a conversa faz o que nenhum chá faz."
          atencao="Conselho de conhecida não é receita médica. Se alguém indicar hormônio, suplemento ou remédio que deu certo para ela, leve o nome à médica antes de tomar."
        />
      </PdfContentPage>

      {/* -- p12 - a rotina de 21 dias, em grade -- */}
      <PdfContentPage
        accentGradient={F} pageNumber={12} pageNumberColor={C.base}
        kicker="A rotina"
        title="Os 21 dias, na ordem"
        subtitle="Uma coisa nova por semana. Não é promessa de resultado: é a ordem que evita fazer tudo junto e não saber o que ajudou."
      >
        <SemanaGrade
          n={1} nome="só o que é de graça" dias={[1, 2, 3, 4, 5, 6, 7]}
          entra="a semana dos gatilhos (5), algodão na roupa e na cama (4 e 7), a camisola seca na cadeira (6), o borrifador na bolsa (3) e a caminhada de vinte minutos (16)."
          mantem="nada ainda, porque esta é a base. Nenhum chá nesta semana, e isso é de propósito."
        />
        <SemanaGrade
          n={2} nome="entra um chá só" dias={[8, 9, 10, 11, 12, 13, 14]}
          entra="a folha de amora (1), uma xícara no fim da tarde. Se o que mais incomoda for o suor, e não o calor, troque pela sálvia (2) e respeite os sete dias dela."
          mantem="tudo da semana 1, e comece a marcar os riscos da madrugada (10)."
        />
        <SemanaGrade
          n={3} nome="o corpo e o osso" dias={[15, 16, 17, 18, 19, 20, 21]}
          entra="o gergelim do almoço (9), o ferro do prato (18) e o cálcio de cada refeição (19). Se o ressecamento incomoda, entre com o bloco 3 inteiro nesta semana."
          mantem="tudo que já está de pé, inclusive o chá escolhido na semana 2."
        />

        <Callout type="tip" title="No fim dos 21 dias">
          Pegue o papel dos riscos da madrugada e compare a terceira semana com a primeira. Se
          melhorou, você já sabe o que manter. Se não mudou nada, isso também é resposta, e é
          exatamente essa a informação que vale levar para a consulta.
        </Callout>
      </PdfContentPage>

      {/* -- p13 - aviso legal e encerramento ───────────────────────── */}
      <PdfContentPage accentGradient={F} pageNumber={13} pageNumberColor={C.base} kicker="Pra terminar" title="Uma última coisa">
        <P>
          Menopausa não é o fim de nada, e também não é fácil. As duas coisas são verdade ao mesmo
          tempo, e quem te disser só uma delas está vendendo alguma coisa.
        </P>
        <P>
          Faça o que couber na sua semana, comece pelos gatilhos, que são de graça, e procure a sua
          médica quando o corpo pedir mais do que uma cozinha pode dar.
        </P>

        <Callout type="warning" title="Aviso importante">
          Este material é informativo e de tradição caseira. Não substitui consulta, diagnóstico ou
          tratamento médico, não substitui reposição hormonal e não deve ser usado para interromper
          nenhum remédio prescrito. Erva interage com medicamento: se você toma remédio de uso
          contínuo, já teve câncer de mama, tem problema de fígado, rim, tireoide ou coração,
          converse com a sua médica antes de usar qualquer preparo daqui. Sangramento após doze meses
          sem menstruar exige avaliação médica sempre.
        </Callout>

        <Spacer size="sm" />
        <Assinatura cor={C} frase="Uma passagem, e você atravessa." />
      </PdfContentPage>
    </>
  );
}
