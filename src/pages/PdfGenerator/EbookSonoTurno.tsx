/** PDF — /pdf/sono-turno · Manual do Turno Noturno · Bump 2 · R$ 19,90 */
import { PdfContentPage } from '@/components/ebook/PdfContentPage';
import { DesignPage } from '@/components/ebook/DesignPage';
import { Callout, Divider, StyledTable, Spacer } from '@/components/ebook/VisualElements';
import { CORES, faixaDe, Capa, Item, Titulo, P, Assinatura } from '@/components/ebook/sono';

const C = CORES.turno;
const F = faixaDe(C);

export default function EbookSonoTurno() {
  return (
    <>
      <DesignPage bg={C.base}>
        <Capa
          cor={C}
          titulo={<>Manual do<br />Turno Noturno</>}
          subtitulo="Como dormir de dia quando você trabalha à noite"
          rodape="12x36 · Noturno fixo · Revezamento"
        />
      </DesignPage>

      <PdfContentPage
        accentGradient={F} pageNumber={1} pageNumberColor={C.base}
        kicker="Antes de tudo" title="Quase nada do que se lê sobre sono serve pra você"
      >
        <P>
          Todo conselho que existe parte do mesmo lugar: durma cedo, acorde cedo, mantenha horário
          fixo. Você não escolhe a hora de deitar. A escala escolhe por você.
        </P>
        <P>
          Este guia é pra enfermagem, segurança, portaria, motorista, fábrica e todo mundo que
          trabalha quando os outros dormem. E ele parte de outro lugar: seu problema não é insônia,
          é desalinhamento imposto pelo trabalho.
        </P>

        <Callout type="warning" title="A regra que vem antes de todas as outras">
          Nenhum preparo calmante deste guia ou do manual principal serve antes de dirigir ou operar
          máquina. Eles somam sono, e sono no volante mata. Se você vai trabalhar, o único preparo
          deste guia feito pra isso é o número 6.
        </Callout>

        <Titulo cor={C}>O que dá pra mudar e o que não dá</Titulo>
        <P>
          Não dá pra mudar a escala. Dá pra mudar três coisas, e são elas que este guia trata: a luz
          que o seu corpo recebe, a hora em que você come, e o que você faz na primeira hora depois
          do plantão.
        </P>
        <P>
          Essas três valem mais do que qualquer chá, e é por isso que elas vêm primeiro.
        </P>
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={2} pageNumberColor={C.base}
        kicker="O que mais importa" title="A luz é o seu maior inimigo e a sua melhor ferramenta"
      >
        <Titulo cor={C}>Na volta pra casa</Titulo>
        <P>
          Sair do plantão às sete da manhã e pegar sol no caminho é o que mais atrapalha o seu sono,
          e quase ninguém sabe disso. A luz forte da manhã diz pro seu corpo que o dia começou, bem
          na hora em que você precisa que ele entenda o contrário.
        </P>
        <P>
          Óculos escuros no trajeto de volta. Não é vaidade nem frescura, é a coisa mais barata e
          mais eficaz deste guia inteiro.
        </P>

        <Titulo cor={C}>No quarto</Titulo>
        <P>
          Cortina que escureça de verdade. Se não puder trocar a cortina, papelão na janela resolve,
          e resolve bem. Máscara de dormir é a alternativa de quem divide o quarto.
        </P>

        <Titulo cor={C}>Ao acordar de tarde</Titulo>
        <P>
          Aí sim, luz forte, e quanto antes melhor. Abra tudo, saia no quintal cinco minutos. É o que
          marca pro corpo que o seu dia começou agora, e é isso que segura o relógio no lugar até o
          próximo turno.
        </P>

        <Callout type="tip" title="Se você comprar duas coisas este mês">
          Uma cortina blackout e um tampão de ouvido. Custam pouco e fazem mais pelo seu sono do que
          todos os oito preparos deste guia juntos. Eu preferia que você soubesse disso agora do que
          descobrisse na terceira semana.
        </Callout>
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={3} pageNumberColor={C.base}
        kicker="Rotina por escala" title="12 por 36"
        subtitle="A escala mais comum e a mais fácil de acertar, porque ela se repete. O segredo dela é não tentar viver como quem trabalha de dia nos dias de folga."
      >
        <Titulo cor={C}>No dia do plantão noturno</Titulo>
        <P>
          Durma até o meio da manhã e acorde com luz. À tarde, um cochilo de uma hora e meia, nunca
          mais que isso, e nunca depois das cinco. Esse cochilo é o que segura a madrugada, e quem
          pula chega às três da manhã pior.
        </P>

        <Titulo cor={C}>Na volta, de manhã</Titulo>
        <P>
          Óculos escuros no trajeto. Chegando, banho, uma refeição leve, cortina fechada e o preparo
          1 deste guia. Deitar em seguida. Não fique no celular na cama, porque é ali que a maioria
          perde uma hora de sono.
        </P>

        <Titulo cor={C}>No dia de folga</Titulo>
        <P>
          Este é o dia em que quase todo mundo estraga a escala. Dormir o dia inteiro pra compensar
          parece certo e é o pior que se pode fazer, porque vira o relógio de novo e você chega no
          próximo turno como se fosse o primeiro.
        </P>
        <P>
          O certo é dormir até o meio da manhã, viver o dia, e dormir à noite como todo mundo. Use o
          preparo 5, que é suave de propósito.
        </P>
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={4} pageNumberColor={C.base}
        kicker="Rotina por escala" title="Noturno fixo e revezamento"
      >
        <Titulo cor={C}>Noturno fixo</Titulo>
        <P>
          É a escala mais fácil de estabilizar e a mais difícil de aguentar socialmente, porque o
          mundo inteiro funciona no horário oposto ao seu.
        </P>
        <P>
          A regra aqui é uma só: mantenha o mesmo horário também nos dias de folga. Sei que é o
          conselho mais impopular deste guia. Mas quem dorme de dia a semana toda e vira à noite no
          fim de semana passa a vida em jet lag permanente, sem sair do lugar.
        </P>
        <P>
          Se precisar ceder num dia, ceda no sábado, e volte no domingo.
        </P>

        <Divider variant="dashes" color={C.acento} />

        <Titulo cor={C}>Revezamento</Titulo>
        <P>
          É a pior de todas, e não adianta eu dizer o contrário. O corpo nunca chega a se ajustar
          porque a escala muda antes disso.
        </P>
        <P>
          O que dá pra fazer é reduzir o estrago, e o jeito é ir na direção do relógio: manhã, depois
          tarde, depois noite. Se a sua empresa deixa escolher, escolha essa ordem. Ir no sentido
          contrário, da noite pra tarde pra manhã, é bem mais duro.
        </P>
        <P>
          E use o preparo 3 nos dois ou três dias em torno da virada, que é onde o corpo mais sofre.
        </P>
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={5} pageNumberColor={C.base}
        kicker="O dia da virada" title="O pior dia da escala, e o que fazer nele"
      >
        <P>
          Todo mundo que trabalha em turno sabe qual é: o dia em que você tem que virar o horário de
          uma vez. É o dia em que você não dorme direito nem de dia nem de noite.
        </P>

        <Titulo cor={C}>Na véspera</Titulo>
        <P>
          Preparo 3, o mais forte deste guia, uma hora antes de deitar. Só na véspera da virada, não
          sempre.
        </P>

        <Titulo cor={C}>No dia</Titulo>
        <P>
          Se você vai virar pra noite, durma até tarde e faça um cochilo longo à tarde, de duas
          horas. Se vai virar pro dia, acorde mais cedo do que aguenta e não cochile em hipótese
          nenhuma, por pior que esteja. É duro, e é um dia só.
        </P>

        <Titulo cor={C}>Na comida</Titulo>
        <P>
          Coma nos horários do turno novo, mesmo sem fome. A hora da refeição é o segundo maior
          sinal que o corpo usa pra saber que horas são, atrás só da luz.
        </P>

        <Callout type="warning" title="Uma coisa que eu não posso deixar de dizer">
          Nos dias de virada, o risco de cochilar ao volante é o mais alto de toda a escala. Se você
          dirige pro trabalho e está muito mal, é melhor pedir carona, pagar um carro ou dormir vinte
          minutos no estacionamento antes de sair. Nenhum turno vale isso.
        </Callout>
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={6} pageNumberColor={C.base}
        kicker="Os oito preparos · 1 a 3" title="Pra dormir depois do plantão"
      >
        <Item cor={C} numero={1} nome="O chá do pós-plantão"
          lista={['1 colher de chá de camomila', '1 colher de chá de erva-cidreira', '250ml de água']}
          texto="Chega em casa, toma banho, e só então faz o chá. Toma sentada, com a cortina já fechada, e vai deitar em seguida."
          porque="Quem sai do plantão vem com o corpo ligado, mesmo exausto. O chá não é pra dar sono, é pra desligar o alerta. E a ordem importa mais que a erva: banho antes, cortina fechada antes." />
        <Item cor={C} numero={2} nome="Leite reforçado de dormir de dia"
          lista={['200ml de leite', 'meia banana', '1 colher de sopa de aveia', '1 colher de chá de mel']}
          texto="Bate tudo e toma morno, logo antes de deitar de manhã."
          porque="Dormir de dia dá menos horas, e o corpo acorda com fome mais rápido. Essa é mais reforçada de propósito, pra você não acordar às onze com o estômago vazio." />
        <Item cor={C} numero={3} nome="O chá da virada"
          lista={['1 colher de sopa de flor de tília', '250ml de água']}
          texto="Água fervida, fogo desligado, dez minutos tampado. Na véspera da virada, uma hora antes de deitar."
          porque="A tília é mais forte que a camomila e serve justamente pros dias em que o corpo está sendo obrigado a mudar de horário de uma vez."
          atencao="Só nos dias de virada, no máximo três vezes por semana. Soma efeito com remédio pra dormir e calmante. Não use na gravidez, e nunca antes de dirigir." />
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={7} pageNumberColor={C.base}
        kicker="Os oito preparos · 4 a 6" title="Pra atravessar o turno e a folga"
      >
        <Item cor={C} numero={4} nome="Água morna do quarto escuro"
          lista={['1 copo de água morna', '1 colher de chá de mel']}
          texto="Deixa pronto na cabeceira antes de deitar de manhã. Se acordar no meio do dia com barulho, bebe e volta a deitar sem abrir a cortina."
          porque="Quem dorme de dia acorda várias vezes, e o erro é levantar e ver luz. O copo ao lado da cama evita o levantar, e não abrir a cortina evita o corpo entender que o dia começou." />
        <Item cor={C} numero={5} nome="Mistura da folga"
          lista={['1 colher de chá de camomila', '1 colher de chá de capim-santo', '250ml de água']}
          texto="No primeiro dia de folga, à noite, uma hora antes de deitar."
          porque="Suave de propósito. A folga não é pra dormir o dia todo e sim pra dormir à noite, e essa ajuda a virar sem forçar." />
        <Item cor={C} numero={6} nome="O chá que se leva pro turno"
          lista={['1 colher de chá de gengibre ralado', '1 colher de chá de hortelã', '400ml de água', '1 garrafa térmica']}
          texto="Ferve o gengibre três minutos, desliga, joga a hortelã, cinco minutos tampado. Coa, põe na térmica e leva."
          porque="A única deste guia que não é calmante, e por isso ela existe. Gengibre e hortelã aquecem e despertam um pouco, sem ser mais um café às três da manhã. É a que você pode tomar trabalhando." />
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={8} pageNumberColor={C.base}
        kicker="Os oito preparos · 7 e 8" title="Pra hidratar e pra recuperar"
      >
        <Item cor={C} numero={7} nome="Chá gelado da garrafa"
          lista={['2 colheres de sopa de erva-cidreira', '1 litro de água', '1 garrafa']}
          texto="Faz o chá, deixa esfriar, guarda na geladeira e leva na garrafa. Toma ao longo do turno."
          porque="Substitui o refrigerante e o energético do plantão, que são os dois maiores inimigos de quem trabalha à noite. Hidrata sem o pico e a queda que deixam você pior às cinco da manhã." />
        <Item cor={C} numero={8} nome="Chá da recuperação"
          lista={['1 colher de chá de camomila', '1 colher de chá de erva-cidreira', 'meia colher de chá de folha de maracujá', '250ml de água']}
          texto="Doze minutos tampado, uma hora antes de deitar. Depois de uma sequência de noites, no dia em que você finalmente pode dormir direito."
          porque="É o mais forte do guia e existe pra um dia específico: recuperar depois de vários turnos seguidos. Não é de uso comum."
          atencao="Tem maracujá, então soma efeito com remédio de dormir e calmante. Não use na gravidez, e nunca antes de trabalhar ou dirigir." />

        <Callout type="tip" title="O erro mais caro de todos">
          Café depois da metade do turno. Parece que ajuda a terminar a madrugada, e ajuda mesmo,
          mas é o que te impede de dormir quando você chega em casa. Depois das três da manhã, só o
          preparo 6.
        </Callout>
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={9} pageNumberColor={C.base}
        kicker="Consulta rápida" title="O que fazer em cada momento"
      >
        <StyledTable
          color={C.base}
          headers={['O momento', 'O que fazer', 'Nº']}
          rows={[
            ['Saindo do plantão de manhã', 'Óculos escuros no trajeto', '—'],
            ['Chegando em casa', 'Banho, refeição leve, cortina, chá', '1'],
            ['Antes de deitar de manhã, com fome', 'Leite reforçado', '2'],
            ['Acordou no meio do dia com barulho', 'Água morna da cabeceira, sem abrir cortina', '4'],
            ['Véspera do dia da virada', 'Chá da tília, só nesses dias', '3'],
            ['No meio do turno, com sono', 'Chá de gengibre e hortelã da térmica', '6'],
            ['Sede durante o turno', 'Chá gelado da garrafa', '7'],
            ['Primeiro dia de folga, à noite', 'Mistura da folga', '5'],
            ['Depois de vários turnos seguidos', 'Chá da recuperação', '8'],
            ['Acordando de tarde', 'Luz forte, sair no sol cinco minutos', '—'],
          ]}
        />
        <Spacer size="sm" />
        <Callout type="info" title="Se você fizer só três coisas deste guia">
          Óculos escuros na volta pra casa, cortina que escureça de verdade, e não dormir o dia
          inteiro na folga. As três são de graça ou quase, e valem mais que os oito preparos.
        </Callout>
      </PdfContentPage>

      <PdfContentPage accentGradient={F} pageNumber={10} pageNumberColor={C.base} kicker="Pra terminar" title="Uma última coisa">
        <P>
          Quem trabalha em turno não vai dormir como quem trabalha de dia, e não adianta ninguém
          prometer isso. O que dá pra fazer é reduzir o estrago, e é bastante coisa.
        </P>
        <P>
          Comece pela luz, que é de graça. Depois pela cortina. Os chás vêm por último, porque são
          os que menos pesam nessa conta, mesmo sendo o que todo mundo procura primeiro.
        </P>
        <Callout type="warning" title="E o que precisa de médico">
          Se você dorme as horas que consegue e ainda assim vive exausta, se ronca alto, ou se já
          cochilou dirigindo, procure um médico. Trabalho em turno aumenta o risco de apneia e de
          outros problemas de sono, e nenhum deles se resolve com chá.
        </Callout>
        <Assinatura cor={C} frase="Bom descanso, mesmo fora de hora." />
      </PdfContentPage>
    </>
  );
}
