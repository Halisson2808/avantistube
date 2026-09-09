/** PDF — /pdf/sono-ervas · As 12 Ervas Fortes · Bump 3 · R$ 14,90 */
import { PdfContentPage } from '@/components/ebook/PdfContentPage';
import { DesignPage } from '@/components/ebook/DesignPage';
import { Callout, Divider, StyledTable, Spacer } from '@/components/ebook/VisualElements';
import { CORES, faixaDe, Capa, Item, Titulo, P, Assinatura } from '@/components/ebook/sono';

const C = CORES.ervas;
const F = faixaDe(C);

export default function EbookSonoErvas() {
  return (
    <>
      <DesignPage bg={C.base}>
        <Capa
          cor={C}
          titulo={<>As 12<br />Ervas Fortes</>}
          subtitulo="Pra quem já tentou chá e não sentiu nada"
          rodape="Dose · Preparo · O que não misturar"
        />
      </DesignPage>

      <PdfContentPage
        accentGradient={F} pageNumber={1} pageNumberColor={C.base}
        kicker="Antes de tudo" title="Este guia é diferente dos outros, e precisa ser lido diferente"
      >
        <P>
          As ervas daqui são fortes. Não são as do manual principal, que você pode tomar todo dia sem
          pensar muito. Estas exigem dose certa, exigem saber com o que não misturar, e algumas não
          servem pra uso contínuo.
        </P>
        <P>
          Por isso a página de segurança vem antes das ervas, e não depois. Se você ler só uma página
          deste guia, leia a próxima.
        </P>

        <Callout type="warning" title="A regra em uma frase">
          Erva calmante não anula remédio calmante. Ela soma. Os dois empilham o mesmo efeito, e o
          resultado pode ser sono demais, tontura, queda de pressão ou queda de verdade, ainda mais
          de madrugada quando você levanta pra ir ao banheiro.
        </Callout>

        <Titulo cor={C}>Como escolher a sua</Titulo>
        <P>
          Não é escolher a mais forte. É escolher a que trata o tipo da sua noite. Tem erva pra quem
          não pega no sono, pra quem acorda de madrugada, e pra quem deita com o corpo tenso. A
          tabela do fim do guia resolve isso em dez segundos.
        </P>

        <Titulo cor={C}>Comece sempre pela metade</Titulo>
        <P>
          Na primeira vez com qualquer erva deste guia, meia xícara. Se cair bem, na noite seguinte a
          xícara inteira. Erva forte na dose cheia de primeira é o que faz a pessoa acordar grogue e
          desistir achando que não serve pra ela.
        </P>
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={2} pageNumberColor={C.base}
        kicker="Segurança" title="O que não misturar"
      >
        <Titulo cor={C}>Se você toma remédio pra dormir, calmante ou ansiolítico</Titulo>
        <P>
          Não junte com nenhuma das doze deste guia por conta própria. Isso vale também pra
          relaxante muscular e pra antialérgico que dá sono, que é uma categoria em que quase
          ninguém pensa.
        </P>

        <Titulo cor={C}>Se você toma remédio pra pressão</Titulo>
        <P>
          Mulungu, valeriana e passiflora podem baixar a pressão um pouco. Somado ao remédio, isso dá
          tontura ao levantar. Fale com o médico antes.
        </P>

        <Titulo cor={C}>Se você toma anticoagulante</Titulo>
        <P>
          Camomila em quantidade grande e gengibre mexem com a coagulação. As doses deste guia são
          pequenas, mas quem usa remédio pra afinar o sangue deve confirmar antes.
        </P>

        <Titulo cor={C}>Gravidez e amamentação</Titulo>
        <P>
          Nenhuma das doze deste guia serve na gravidez sem orientação de quem acompanha. Várias são
          contraindicadas de forma clara. Na dúvida, fique só no manual principal.
        </P>

        <Divider variant="dashes" color={C.acento} />

        <Callout type="info" title="A conversa de trinta segundos com o médico">
          Leve o nome das ervas num papel e pergunte só isto: posso tomar chá dessas com o que eu já
          tomo? Ele responde na hora. Não peça pra trocar remédio por chá, e não pare nada por conta
          própria.
        </Callout>

        <Callout className="mt-3" type="warning" title="Pare e procure atendimento se">
          Der falta de ar, inchaço no rosto ou na garganta, coceira pelo corpo, batimento acelerado
          ou tontura forte ao levantar.
        </Callout>
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={3} pageNumberColor={C.base}
        kicker="As doze · 1 a 3" title="As três mais fortes"
        subtitle="Começo por estas porque são as que você provavelmente veio buscar. E também porque são as que mais exigem cuidado."
      >
        <Item cor={C} numero={1} nome="Mulungu"
          etiquetaEsq="Dose" etiquetaDir="Preparo"
          lista={['1 colher de chá da casca seca', '250ml de água', 'no máximo 3 vezes por semana']}
          texto="Ferve a casca por cinco minutos, com o fogo ligado, e deixa mais dez tampado fora do fogo. Coa e toma uma hora antes de deitar."
          porque="É a erva brasileira mais usada pra acalmar, e quase ninguém da cidade conhece. Diferente das outras, ela pede fervura de verdade, porque é casca e não folha."
          atencao="Baixa a pressão. Não use com remédio pra pressão, calmante ou indutor de sono. Não use na gravidez. Não use todo dia." />
        <Item cor={C} numero={2} nome="Valeriana"
          etiquetaEsq="Dose" etiquetaDir="Preparo"
          lista={['1 colher de chá da raiz seca', '200ml de água', 'no máximo 4 vezes por semana']}
          texto="Água fervida, fogo desligado, dez minutos tampado. Coa e toma uma hora antes de deitar. O cheiro é forte e desagradável; é normal."
          porque="É a mais estudada do mundo pra sono, e a mais usada na Europa. O cheiro ruim afasta muita gente, e é por isso que ela funciona melhor em cápsula, mas em chá também serve."
          atencao="Soma forte com remédio pra dormir e com álcool. Algumas pessoas têm o efeito contrário e ficam agitadas: se for o seu caso, pare. Não use na gravidez nem antes de dirigir." />
        <Item cor={C} numero={3} nome="Passiflora, a folha de maracujá"
          etiquetaEsq="Dose" etiquetaDir="Preparo"
          lista={['1 colher de sopa da folha seca', '200ml de água', 'até 4 vezes por semana']}
          texto="Água fervida, fogo desligado, dez minutos tampado. Uma hora antes de deitar."
          porque="É a folha, nunca o suco. O suco antes de dormir é açúcar, e açúcar atrapalha. A folha é outra coisa: acalma a cabeça acelerada mais que o corpo."
          atencao="Soma com calmante e indutor de sono. Não use na gravidez." />
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={4} pageNumberColor={C.base}
        kicker="As doze · 4 a 6" title="As de tradição europeia"
      >
        <Item cor={C} numero={4} nome="Lúpulo"
          etiquetaEsq="Dose" etiquetaDir="Preparo"
          lista={['1 colher de chá das flores secas', '200ml de água', 'até 4 vezes por semana']}
          texto="Água fervida, fogo desligado, oito minutos tampado. O gosto é amargo; mel resolve."
          porque="É o mesmo lúpulo da cerveja, e não é coincidência. Fica ainda melhor junto com valeriana, meia colher de cada, que é a combinação clássica europeia."
          atencao="Soma com calmante. Quem tem quadro depressivo deve evitar sem orientação. Não use na gravidez." />
        <Item cor={C} numero={5} nome="Tília"
          etiquetaEsq="Dose" etiquetaDir="Preparo"
          lista={['1 colher de sopa das flores', '250ml de água', 'até 5 vezes por semana']}
          texto="Água fervida, fogo desligado, dez minutos tampado. Uma hora antes de deitar."
          porque="É a do meio: mais forte que camomila, mais suave que valeriana. Serve muito bem pra quem quer subir um degrau sem ir direto pras três primeiras deste guia."
          atencao="Uso muito frequente e prolongado não é recomendado. Cinco vezes por semana é o teto." />
        <Item cor={C} numero={6} nome="Alfazema, a lavanda"
          etiquetaEsq="Dose" etiquetaDir="Preparo"
          lista={['1 colher de chá das flores secas', '200ml de água', 'pode todo dia']}
          texto="Água fervida, fogo desligado, sete minutos tampado. Ou, melhor ainda, use no banho e no travesseiro em vez de beber."
          porque="Ela trabalha mais pelo cheiro do que pela ingestão, e é por isso que num banho rende mais que numa xícara. Se você só tem uma erva em casa, que seja essa, porque serve dos dois jeitos." />
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={5} pageNumberColor={C.base}
        kicker="As doze · 7 a 9" title="As brasileiras"
      >
        <Item cor={C} numero={7} nome="Erva-de-santa-maria da noite, a melissa forte"
          etiquetaEsq="Dose" etiquetaDir="Preparo"
          lista={['2 colheres de sopa de melissa seca', '250ml de água', 'pode todo dia']}
          texto="É a erva-cidreira do manual principal, só que no dobro da quantidade e com quinze minutos de infusão em vez de sete."
          porque="Muita gente diz que cidreira não faz efeito, e quase sempre é dose. Na quantidade certa e com tempo de infusão maior, ela sobe de categoria e vira uma das melhores do guia." />
        <Item cor={C} numero={8} nome="Maracujina caseira"
          etiquetaEsq="Dose" etiquetaDir="Preparo"
          lista={['meia colher de chá de folha de maracujá', 'meia colher de chá de camomila', 'meia colher de chá de melissa', '250ml de água']}
          texto="Água fervida, fogo desligado, doze minutos tampado. Uma hora antes de deitar."
          porque="É a mistura que as farmácias de manipulação vendem pronta, feita em casa e por muito menos. As três se completam e nenhuma domina."
          atencao="Tem maracujá. Soma com calmante e indutor de sono. Não use na gravidez." />
        <Item cor={C} numero={9} nome="Capim-santo forte"
          etiquetaEsq="Dose" etiquetaDir="Preparo"
          lista={['6 folhas frescas picadas, ou 2 colheres de sopa do seco', '250ml de água', 'pode todo dia']}
          texto="Pica as folhas com tesoura, água fervida e fora do fogo, doze minutos tampado."
          porque="Mesma lógica da melissa: o capim-santo tem fama de fraco porque quase todo mundo usa pouco. No dobro da folha e com mais tempo, ele funciona de verdade e continua sendo dos mais seguros." />
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={6} pageNumberColor={C.base}
        kicker="As doze · 10 a 12" title="As de caso específico"
      >
        <Item cor={C} numero={10} nome="Alface em decocção"
          etiquetaEsq="Dose" etiquetaDir="Preparo"
          lista={['6 folhas externas, as mais escuras', '300ml de água', 'pode todo dia']}
          texto="Ferve as folhas na água por oito minutos, com o fogo ligado. Coa, deixa amornar e toma antes de deitar."
          porque="É das mais antigas que existem e quase ninguém conhece mais. O talo solta uma seiva branca, e é ela que acalma. Por isso as folhas de fora, que têm mais, e por isso fervura em vez de infusão." />
        <Item cor={C} numero={11} nome="Erva-doce em dose alta"
          etiquetaEsq="Dose" etiquetaDir="Preparo"
          lista={['1 colher de sopa de semente amassada', '250ml de água', 'até 5 vezes por semana']}
          texto="Amassa as sementes, água fervida e fora do fogo, dez minutos tampado."
          porque="Esta é pra quem não dorme por causa da barriga, e não da cabeça. Se você deita estufada e não relaxa, nenhuma das outras onze vai resolver, porque o problema é digestivo."
          atencao="Em dose alta e uso contínuo não é recomendada. Não use na gravidez." />
        <Item cor={C} numero={12} nome="A combinação da noite impossível"
          etiquetaEsq="Dose" etiquetaDir="Preparo"
          lista={['meia colher de chá de valeriana', 'meia colher de chá de lúpulo', '1 colher de chá de melissa', '250ml de água']}
          texto="Água fervida, fogo desligado, quinze minutos tampado. Uma hora e meia antes de deitar. Máximo duas vezes por semana."
          porque="É a mais forte do guia e a última de propósito. Valeriana e lúpulo é a combinação clássica europeia, e a melissa entra pra suavizar o gosto, que sem ela é bem ruim."
          atencao="Só duas vezes por semana. Não use com nenhum remédio que dê sono, nem com álcool. Não use na gravidez, e nunca em dia que você vá dirigir de manhã cedo." />
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={7} pageNumberColor={C.base}
        kicker="Consulta rápida" title="Qual erva pra qual noite"
      >
        <StyledTable
          color={C.base}
          headers={['O seu caso', 'A erva', 'Nº']}
          rows={[
            ['Não pego no sono, cabeça acelerada', 'Passiflora', '3'],
            ['Acordo de madrugada e não volto', 'Valeriana', '2'],
            ['Corpo tenso, ombro travado', 'Mulungu', '1'],
            ['Quero subir um degrau, sem exagerar', 'Tília', '5'],
            ['Achei a cidreira fraca', 'Melissa em dose alta', '7'],
            ['Deito estufada e não relaxo', 'Erva-doce em dose alta', '11'],
            ['Não gosto de tomar chá', 'Lavanda no banho e no travesseiro', '6'],
            ['Quero uma mistura pronta', 'Maracujina caseira', '8'],
            ['Noite impossível, já tentei tudo', 'A combinação, no máximo 2x na semana', '12'],
            ['Tomo remédio pra dormir', 'Nenhuma sem falar com o médico', '—'],
          ]}
        />
        <Spacer size="sm" />
        <Callout type="tip" title="A que eu começaria">
          A número 7, a melissa em dose alta. É segura, pode todo dia, e resolve a queixa mais comum
          que eu escuto, que é a de que chá não faz efeito. Quase sempre era dose, não era a erva.
        </Callout>
      </PdfContentPage>

      <PdfContentPage accentGradient={F} pageNumber={8} pageNumberColor={C.base} kicker="Pra terminar" title="Uma última coisa">
        <P>
          Erva forte não é erva melhor. É erva que exige mais atenção. Se as do manual principal
          resolvem a sua noite, fique nelas: são as que você pode tomar todo dia sem pensar.
        </P>
        <P>
          Este guia é pra quando elas não bastam. E mesmo aqui, comece pelas de baixo da lista, não
          pelas de cima. A número 12 existe pra três ou quatro noites por mês, não pra rotina.
        </P>
        <Callout type="warning" title="E a hora de parar de procurar chá">
          Se você já tentou várias destas e nada muda, o problema provavelmente não é o que você toma
          antes de deitar. Pode ser apneia, pode ser a medicação que você já usa, pode ser outra
          coisa. Nessa hora, médico. Nenhum chá deste guia substitui consulta, diagnóstico ou
          tratamento.
        </Callout>
        <Assinatura cor={C} frase="Com cuidado, que é como se usa erva forte." />
      </PdfContentPage>
    </>
  );
}
