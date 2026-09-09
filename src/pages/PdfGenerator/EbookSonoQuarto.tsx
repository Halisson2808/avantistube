/** PDF — /pdf/sono-quarto · O Quarto Que Faz Dormir · Bump 4 · R$ 9,90 */
import { PdfContentPage } from '@/components/ebook/PdfContentPage';
import { DesignPage } from '@/components/ebook/DesignPage';
import { Callout, Divider, StyledTable, Spacer } from '@/components/ebook/VisualElements';
import { CORES, faixaDe, Capa, Item, Titulo, P, Assinatura } from '@/components/ebook/sono';

const C = CORES.quarto;
const F = faixaDe(C);

export default function EbookSonoQuarto() {
  return (
    <>
      <DesignPage bg={C.base}>
        <Capa
          cor={C}
          titulo={<>O Quarto Que<br />Faz Dormir</>}
          subtitulo="15 mudanças baratas que nenhum chá substitui"
          rodape="Luz · Barulho · Temperatura · Cama"
        />
      </DesignPage>

      <PdfContentPage
        accentGradient={F} pageNumber={1} pageNumberColor={C.base}
        kicker="Antes de tudo" title="Por que o quarto pesa mais do que qualquer receita"
      >
        <P>
          Eu passei o manual inteiro te ensinando chá, e agora vou dizer uma coisa que talvez soe
          estranha vindo de mim: nenhum chá deste mundo compensa um quarto errado.
        </P>
        <P>
          O corpo decide se é hora de dormir por sinais do ambiente, não por força de vontade. Luz,
          barulho e temperatura contam mais nessa conta do que tudo que você bebe antes de deitar.
        </P>

        <Callout type="info" title="Este guia é diferente dos outros">
          Aqui não tem receita nenhuma. São quinze mudanças no quarto, quase todas de graça ou de
          poucos reais. Eu ordenei da que mais muda pra que menos muda, então se você fizer só as
          cinco primeiras já terá feito a maior parte do trabalho.
        </Callout>

        <Titulo cor={C}>Como usar</Titulo>
        <P>
          Faça uma por dia, na ordem. Não tente fazer as quinze num sábado, porque aí você não sabe
          qual foi a que funcionou. Uma por dia, quinze dias, e no fim você tem um quarto diferente
          sem ter gasto quase nada.
        </P>
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={2} pageNumberColor={C.base}
        kicker="Luz · as cinco que mais mudam" title="Comece por aqui"
        subtitle="Se você fizer só esta página e mais nada, já vai ter feito mais que a maioria."
      >
        <Item cor={C} numero={1} nome="Escureça a janela de verdade"
          etiquetaEsq="Custa" etiquetaDir="O que fazer"
          lista={['de nada a uns poucos reais', 'cortina blackout, ou papelão, ou papel alumínio']}
          texto="Cubra a janela de modo que, com a luz apagada, você não consiga ver a própria mão. Cortina blackout resolve; papelão preso na janela resolve igual e custa nada."
          porque="Esta é a mudança número um do guia e nenhuma outra chega perto. Claridade, mesmo pouca, atrapalha o sono a noite inteira, e é pior ainda pra quem precisa dormir de dia."
          atencao="Se você mora de aluguel e não pode furar parede, use papelão encaixado ou máscara de dormir. Funciona." />
        <Item cor={C} numero={2} nome="Tire o celular da cabeceira"
          etiquetaEsq="Custa" etiquetaDir="O que fazer"
          lista={['nada', 'um carregador do outro lado do quarto']}
          texto="Carregue o celular longe da cama, de preferência fora do alcance do braço. Se ele é o seu despertador, compre um despertador de dez reais."
          porque="Não é só a luz da tela. É o fato de que, acordando de madrugada, a mão vai nele sozinha. Longe do braço, você não pega, e essa é a diferença entre voltar a dormir e perder uma hora." />
        <Item cor={C} numero={3} nome="Troque a luz do quarto por uma mais amarela"
          etiquetaEsq="Custa" etiquetaDir="O que fazer"
          lista={['uns poucos reais', '1 lâmpada de luz quente ou amarela']}
          texto="Substitua a lâmpada branca fria do quarto por uma amarela. Se puder, deixe também um abajur e use só ele na última hora antes de deitar."
          porque="Luz branca diz ao corpo que ainda é dia. Luz amarela e baixa não diz nada, e é justamente isso que se quer na última hora." />
      </PdfContentPage>

      <PdfContentPage accentGradient={F} pageNumber={3} pageNumberColor={C.base} kicker="Luz · continuação">
        <Item cor={C} numero={4} nome="Tape as luzinhas dos aparelhos"
          etiquetaEsq="Custa" etiquetaDir="O que fazer"
          lista={['nada', 'fita isolante preta ou esparadrapo']}
          texto="Tape o ponto vermelho da TV, o azul do roteador, o do ventilador, o do carregador. Dê uma volta no quarto com a luz apagada e tape tudo que pisca ou brilha."
          porque="Cada uma sozinha parece insignificante. Juntas, elas mantêm o quarto num crepúsculo permanente. E a que fica na altura do olho é a pior de todas." />
        <Item cor={C} numero={5} nome="Pegue luz forte assim que acordar"
          etiquetaEsq="Custa" etiquetaDir="O que fazer"
          lista={['nada', 'abrir a cortina, ou cinco minutos no quintal']}
          texto="Ao acordar, abra tudo. Se der, saia ao ar livre por cinco minutos. Quem trabalha à noite faz o mesmo na hora em que acorda, mesmo sendo cinco da tarde."
          porque="Parece o contrário de um guia sobre dormir, e é a segunda coisa mais importante daqui. É a luz da manhã que acerta a hora em que o sono vai chegar de noite. Escuro à noite e luz forte ao acordar são as duas metades da mesma coisa." />

        <Callout type="tip" title="Fim da parte de luz">
          Se você parar de ler aqui, tudo bem. Estas cinco valem mais do que as dez seguintes
          somadas, e quatro delas custam quase nada.
        </Callout>
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={4} pageNumberColor={C.base}
        kicker="Barulho · 6 a 8" title="O que se ouve sem perceber"
      >
        <Item cor={C} numero={6} nome="Tampão de ouvido"
          etiquetaEsq="Custa" etiquetaDir="O que fazer"
          lista={['poucos reais na farmácia', 'tampão de silicone ou de espuma']}
          texto="Compre o de silicone, que é mais confortável pra dormir de lado. Use por três noites seguidas antes de decidir se serve, porque a primeira noite sempre incomoda."
          porque="Barulho de rua acorda você várias vezes por noite sem que você lembre de nenhuma delas de manhã. Você não lembra, mas o sono foi picado. É a compra de melhor retorno deste guia." />
        <Item cor={C} numero={7} nome="Um som constante que cubra o resto"
          etiquetaEsq="Custa" etiquetaDir="O que fazer"
          lista={['nada, se já tem ventilador', 'ventilador, ar-condicionado ou som de chuva']}
          texto="Deixe um som contínuo e monótono no quarto. Ventilador serve, e é o mais barato. O que não pode é som que varia, como música com letra ou televisão."
          porque="O que acorda não é o barulho constante, é a mudança de barulho: a moto que passa, a porta do vizinho. Um som contínuo cobre essas mudanças e o cérebro para de reagir a cada uma." />
        <Item cor={C} numero={8} nome="Combine o silêncio da casa"
          etiquetaEsq="Custa" etiquetaDir="O que fazer"
          lista={['nada', 'uma conversa']}
          texto="Combine com quem mora com você um horário a partir do qual a TV baixa e a conversa vai pra outro cômodo. Quem trabalha em turno precisa combinar o inverso, no meio do dia."
          porque="Essa é a mais difícil do guia e não custa nada, porque não é sobre objeto, é sobre acordo. E é a que mais falta na casa de quem dorme de dia." />
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={5} pageNumberColor={C.base}
        kicker="Temperatura · 9 a 11" title="O quarto tem que esfriar"
      >
        <Item cor={C} numero={9} nome="Deixe o quarto mais fresco do que você acha confortável"
          etiquetaEsq="Custa" etiquetaDir="O que fazer"
          lista={['nada', 'janela aberta, ventilador, ou ar mais alto']}
          texto="O quarto de dormir deve ser mais fresco que o resto da casa. Um pouco frio ao deitar, com coberta boa, é melhor que morno."
          porque="É a mesma razão do banho: o sono começa quando o corpo esfria. Quarto morno atrapalha essa descida, e é por isso que noite quente é noite mal dormida mesmo com tudo o mais certo." />
        <Item cor={C} numero={10} nome="Pé quente, quarto frio"
          etiquetaEsq="Custa" etiquetaDir="O que fazer"
          lista={['nada', '1 par de meias']}
          texto="Meia nos pés e quarto fresco. Parece contraditório e não é."
          porque="O pé aquecido ajuda o corpo a soltar calor pelo resto, e é justamente esse solta-calor que faz a temperatura interna cair. Quem tem pé gelado demora mais pra pegar no sono por esse motivo." />
        <Item cor={C} numero={11} nome="Cobertor que dê pra ajustar"
          etiquetaEsq="Custa" etiquetaDir="O que fazer"
          lista={['nada', 'duas camadas leves em vez de uma pesada']}
          texto="Troque o cobertor único e grosso por duas camadas mais finas, que dá pra tirar uma no meio da noite sem levantar."
          porque="Muita gente acorda de madrugada de calor, tira tudo, esfria e acorda de novo. Duas camadas resolvem sem precisar acender luz." />
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={6} pageNumberColor={C.base}
        kicker="Cama e quarto · 12 a 15" title="As últimas quatro"
      >
        <Item cor={C} numero={12} nome="A cama é só pra dormir"
          etiquetaEsq="Custa" etiquetaDir="O que fazer"
          lista={['nada', 'uma cadeira, se tiver espaço']}
          texto="Não trabalhe, não coma e não assista nada na cama. Se acordar de madrugada e não voltar em vinte minutos, levante e vá pra outro cômodo com luz baixa."
          porque="A cama tem que significar sono e nada mais. Quando ela vira também escritório e sala, o corpo deixa de entender o sinal, e ficar deitada brigando com o travesseiro ensina justamente que cama é lugar de ficar acordada." />
        <Item cor={C} numero={13} nome="Troque o travesseiro se ele tem mais de dois anos"
          etiquetaEsq="Custa" etiquetaDir="O que fazer"
          lista={['de médio a caro, e vale', '1 travesseiro na altura do seu ombro']}
          texto="A altura certa é a que mantém o pescoço alinhado com a coluna na posição em que você dorme. Quem dorme de lado precisa mais alto que quem dorme de barriga pra cima."
          porque="É o item mais caro deste guia e o único em que vale gastar. Travesseiro errado é a causa mais comum de acordar com dor no pescoço e de virar a noite inteira sem saber por quê." />
        <Item cor={C} numero={14} nome="Tire o relógio de vista"
          etiquetaEsq="Custa" etiquetaDir="O que fazer"
          lista={['nada', 'virar o relógio pra parede']}
          texto="Vire o despertador de costas ou coloque numa gaveta. Você continua ouvindo o alarme, só para de ver as horas de madrugada."
          porque="Ver que são três e quarenta transforma um despertar comum em angústia, e a angústia é o que impede de voltar a dormir. Sem saber a hora, você só vira pro outro lado." />
        <Item cor={C} numero={15} nome="Deixe o quarto pronto antes de deitar"
          etiquetaEsq="Custa" etiquetaDir="O que fazer"
          lista={['dois minutos por noite', 'copo de água, meia, tampão, o que precisar']}
          texto="Antes de deitar, deixe na cabeceira o que você usaria de madrugada. Copo de água, meia, tampão, e o chá na garrafa térmica se for o caso."
          porque="Tudo neste guia depende de uma coisa só: não ter que levantar e acender luz de madrugada. Dois minutos de preparo evitam quarenta de sono perdido." />
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={7} pageNumberColor={C.base}
        kicker="Consulta rápida" title="Por onde começar, e o que custa"
      >
        <StyledTable
          color={C.base}
          headers={['Ordem', 'A mudança', 'Custa']}
          rows={[
            ['1', 'Escurecer a janela de verdade', 'Nada, com papelão'],
            ['2', 'Celular longe da cama', 'Nada'],
            ['3', 'Lâmpada amarela no quarto', 'Poucos reais'],
            ['4', 'Tapar as luzinhas dos aparelhos', 'Nada'],
            ['5', 'Luz forte ao acordar', 'Nada'],
            ['6', 'Tampão de ouvido', 'Poucos reais'],
            ['7', 'Som constante, ventilador serve', 'Nada'],
            ['8', 'Combinar o silêncio da casa', 'Nada'],
            ['9', 'Quarto mais fresco', 'Nada'],
            ['10', 'Meia no pé', 'Nada'],
            ['11', 'Duas camadas de coberta', 'Nada'],
            ['12', 'Cama só pra dormir', 'Nada'],
            ['13', 'Trocar o travesseiro', 'O único caro'],
            ['14', 'Relógio virado pra parede', 'Nada'],
            ['15', 'Deixar o quarto pronto', 'Dois minutos'],
          ]}
        />
        <Spacer size="sm" />
        <Callout type="tip" title="Treze das quinze são de graça ou quase">
          Só a lâmpada, o tampão e o travesseiro custam alguma coisa, e os dois primeiros saem por
          menos de vinte reais. O travesseiro é o único em que vale gastar de verdade.
        </Callout>
      </PdfContentPage>

      <PdfContentPage accentGradient={F} pageNumber={8} pageNumberColor={C.base} kicker="Pra terminar" title="Uma última coisa">
        <P>
          Eu sei que é estranho terminar um material meu dizendo que o quarto importa mais que o chá.
          Mas seria desonesto não dizer.
        </P>
        <P>
          Os chás ajudam, e eu faço todos os dias há quarenta anos. Só que eles trabalham a favor da
          maré ou contra ela, e é o quarto que decide pra que lado a maré corre. Escuro, silencioso e
          fresco, qualquer receita do manual rende mais.
        </P>
        <P>
          Faça uma por dia, na ordem. Em quinze dias você tem um quarto diferente e não gastou quase
          nada.
        </P>
        <Divider variant="ornament" color={C.acento} />
        <Callout type="warning" title="E o que quarto nenhum resolve">
          Se você arrumou tudo isso e continua acordando exausta, se ronca alto ou acorda engasgada,
          procure um médico. Pode ser apneia do sono, e apneia não se resolve com cortina nem com
          chá. Nada deste guia substitui consulta, diagnóstico ou tratamento.
        </Callout>
        <Assinatura cor={C} frase="Que o seu quarto trabalhe a seu favor." />
      </PdfContentPage>
    </>
  );
}
