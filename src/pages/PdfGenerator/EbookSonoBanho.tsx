/** PDF — /pdf/sono-banho · Protocolo do Banho Japonês · Bump 1 · R$ 27,90 */
import { PdfContentPage } from '@/components/ebook/PdfContentPage';
import { DesignPage } from '@/components/ebook/DesignPage';
import { Callout, Divider, StyledTable, Spacer } from '@/components/ebook/VisualElements';
import { CORES, faixaDe, Capa, Item, Titulo, P, Assinatura } from '@/components/ebook/sono';

const C = CORES.banho;
const F = faixaDe(C);

export default function EbookSonoBanho() {
  return (
    <>
      <DesignPage bg={C.base}>
        <Capa
          cor={C}
          titulo={<>Protocolo do<br />Banho Japonês</>}
          subtitulo="21 noites pra relaxar o corpo antes de deitar"
          rodape="Banhos · Escalda-pés · Compressas"
        />
      </DesignPage>

      <PdfContentPage
        accentGradient={F} pageNumber={1} pageNumberColor={C.base}
        kicker="Antes de começar"
        title="Por que o banho funciona, e por que quase todo mundo faz na hora errada"
      >
        <P>
          Lá no Japão, o banho da noite não é pra se lavar. A gente se lava antes, fora da banheira.
          O banho é outra coisa, é o que encerra o dia. E é isso que este guia traz pra sua casa,
          com a sua bacia e o seu chuveiro.
        </P>
        <P>
          Mas tem uma coisa que precisa ficar clara logo, porque é onde quase todo mundo erra e
          depois acha que não funcionou.
        </P>

        <Callout type="info" title="O sono começa quando o corpo esfria">
          O banho quente não faz dormir por esquentar. Faz porque, depois dele, o corpo esfria mais
          rápido e mais fundo do que esfriaria sozinho. É a descida de temperatura que traz o sono,
          não a subida. Por isso o banho é de uma hora a uma hora e meia antes de deitar, nunca em
          cima da hora.
        </Callout>

        <Titulo cor={C}>O que você precisa ter</Titulo>
        <P>
          Uma bacia que caiba os dois pés, uma toalha e água morna. Só isso já faz doze dos catorze
          preparos deste guia. Banheira é bom, mas não é necessário, e eu escrevi tudo pensando em
          quem não tem.
        </P>

        <Titulo cor={C}>A temperatura certa</Titulo>
        <P>
          Morna, não fervendo. Se você põe a mão e quer tirar, está quente demais. A água deve ficar
          confortável por quinze minutos inteiros, e não só nos primeiros trinta segundos.
        </P>
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={2} pageNumberColor={C.base}
        kicker="Segurança" title="Antes do primeiro banho"
      >
        <Callout type="warning" title="Se você tem diabetes">
          Teste sempre a água com o cotovelo, nunca com o pé. Quem tem alteração de sensibilidade
          nos pés pode não sentir o calor e se queimar sem perceber. Depois do banho, seque bem entre
          os dedos e confira se não ficou nenhuma vermelhidão.
        </Callout>
        <Callout className="mt-3" type="warning" title="Se você tem varizes ou má circulação">
          Água muito quente e demorada piora varizes. Fique nos escalda-pés mornos de dez minutos e
          evite os banhos de imersão longos deste guia.
        </Callout>
        <Callout className="mt-3" type="warning" title="Se você tem pressão alta, é gestante ou idosa">
          Banho quente baixa a pressão e pode dar tontura ao levantar. Saia devagar, apoiada, e beba
          um copo de água antes de entrar. Na gestação, confirme com quem acompanha antes de banho
          de imersão e não use sal amargo.
        </Callout>

        <Divider variant="dashes" color={C.acento} />

        <Titulo cor={C}>Três regras que valem pra todos os catorze</Titulo>
        <P>
          Uma hora a uma hora e meia antes de deitar, nunca depois. Quinze minutos é o padrão e vinte
          é o máximo. E ao sair, se enxugue e se agasalhe logo: é isso que faz a descida de
          temperatura ser suave em vez de brusca.
        </P>
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={3} pageNumberColor={C.base}
        kicker="Os catorze preparos · 1 a 3" title="Os que não precisam de nada"
        subtitle="Comece por estes. Nenhum precisa de erva, de compra ou de banheira."
      >
        <Item cor={C} numero={1} nome="Escalda-pés simples"
          lista={['1 bacia', 'água morna até cobrir o tornozelo', '1 toalha', '1 par de meias']}
          texto="Quinze minutos com os pés na bacia, sentada, sem tela. Seca bem, principalmente entre os dedos, e põe a meia. Uma hora antes de deitar."
          porque="Os pés são onde o corpo mais solta calor. Aquece o pé, o corpo entende que pode relaxar, e depois a temperatura cai. A meia depois não é frescura: ela segura o calor tempo suficiente pra descida acontecer devagar." />
        <Item cor={C} numero={2} nome="O ofurô do chuveiro"
          lista={['seu chuveiro', 'água morna', '10 minutos']}
          texto="Banho morno de dez minutos, deixando a água bater nas costas e na nuca. Sai, se enxuga e se agasalha logo. Uma hora e meia antes de deitar."
          porque="É a versão de todo dia, pra quem não tem banheira. O que importa não é a banheira, é o corpo aquecer por dentro e depois esfriar. Nuca e costas porque é onde a tensão do dia se acumula." />
        <Item cor={C} numero={3} nome="Compressa morna na nuca"
          lista={['1 pano de prato', '1 bacia com água morna']}
          texto="Molha o pano, torce e deixa na nuca por cinco minutos, sentada. Repete duas vezes."
          porque="Pra noite em que você está cansada demais até pra tomar banho. Cinco minutos de calor na nuca destravam mais do que parece, e é o preparo mais curto do guia." />
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={4} pageNumberColor={C.base}
        kicker="Os catorze preparos · 4 a 6" title="Os de sal"
      >
        <Item cor={C} numero={4} nome="Escalda-pés com sal grosso"
          lista={['1 bacia de água morna', '2 colheres de sopa de sal grosso']}
          texto="Dissolve o sal na água morna e fica quinze minutos. Seca bem."
          porque="O sal deixa a água mais pesada e o calor mais constante, então ela esfria menos rápido que a água pura. É o mesmo do preparo 1, só que dura mais."
          atencao="Se tiver ferida, rachadura ou micose no pé, não use sal. Só água morna." />
        <Item cor={C} numero={5} nome="Banho de sal amargo"
          lista={['1 xícara de sal amargo, o de epsom, da farmácia', '1 banheira com água morna']}
          texto="Dissolve na água morna e fica quinze minutos. Enxágua com água limpa ao sair."
          porque="É o que eu indico pra quem tem o corpo dolorido junto com o sono ruim, que costumam vir juntos. Uma xícara basta, e o vidro dura semanas."
          atencao="Não use com pressão muito alta, problema nos rins, ou na gestação sem falar com o médico antes." />
        <Item cor={C} numero={6} nome="Escalda-pés de sal e cidreira"
          lista={['3 colheres de sopa de erva-cidreira', '1 litro de água fervente', '2 colheres de sopa de sal grosso', '1 bacia']}
          texto="Chá forte de cidreira, coa, junta o sal e despeja na bacia com água morna. Quinze minutos."
          porque="Junta as duas melhores coisas deste guia: o calor que dura do sal e o cheiro que acalma da cidreira. É o que eu faço na noite em que já sei que vou demorar a pegar no sono." />
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={5} pageNumberColor={C.base}
        kicker="Os catorze preparos · 7 a 9" title="Os de erva"
      >
        <Item cor={C} numero={7} nome="Escalda-pés de camomila"
          lista={['3 colheres de sopa de camomila seca', '1 litro de água fervente', '1 bacia com água morna']}
          texto="Faz o chá forte, coa e despeja na bacia. Quinze minutos."
          porque="O cheiro subindo da bacia faz metade do trabalho. Aqui não é o que a erva faz pela pele, é o que o cheiro faz pela cabeça." />
        <Item cor={C} numero={8} nome="Escalda-pés de gengibre"
          lista={['1 pedaço de gengibre de 3cm em rodelas', '1 litro de água', '1 bacia']}
          texto="Ferve o gengibre dez minutos, despeja na bacia com água morna, quinze minutos."
          porque="Pra noite fria e pra quem tem pé gelado que não esquenta nem debaixo do cobertor. O gengibre puxa o sangue pra superfície e o pé aquece de verdade."
          atencao="Não use com o pé machucado. E não deixe a água mais quente achando que aquece mais rápido." />
        <Item cor={C} numero={9} nome="Escalda-pés de hortelã"
          lista={['1 punhado grande de hortelã fresca', '1 litro de água fervente', '1 bacia']}
          texto="Amassa a hortelã com a mão, cobre com água fervente, dez minutos, e despeja na bacia com água morna."
          porque="Pra quem passa o dia em pé: enfermagem, cozinha, balcão, fábrica. A hortelã dá alívio na hora, e pé aliviado é o que permite o corpo parar." />
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={6} pageNumberColor={C.base}
        kicker="Os catorze preparos · 10 a 12" title="Os de banheira"
      >
        <Item cor={C} numero={10} nome="Banho de camomila"
          lista={['5 colheres de sopa de camomila seca', '2 litros de água fervente', '1 banheira com água morna']}
          texto="Chá bem forte, coa e despeja na banheira. Quinze a vinte minutos, água na altura do peito."
          porque="É o ofurô de verdade. O tempo maior deixa o corpo aquecer por inteiro, e a queda de temperatura depois é a mais funda de todo o guia."
          atencao="Vinte minutos é o máximo. Passar disso desidrata e dá tontura. Beba um copo de água antes de entrar." />
        <Item cor={C} numero={11} nome="Banho de alecrim e lavanda"
          lista={['2 ramos de alecrim', '2 colheres de sopa de lavanda seca', '2 litros de água fervente']}
          texto="Cobre as ervas com água fervente, quinze minutos tampado, coa e despeja na banheira. Ou joga do pescoço pra baixo no fim do banho de chuveiro."
          porque="A lavanda é a erva mais conhecida do mundo pra relaxamento por cheiro, e num banho ela fica no corpo e no quarto por horas." />
        <Item cor={C} numero={12} nome="Banho morno de aveia"
          lista={['1 xícara de aveia em flocos', '1 meia fina ou pano fino', '1 banheira com água morna']}
          texto="Põe a aveia dentro da meia, dá um nó, joga na banheira e aperta a trouxinha algumas vezes na água. Quinze minutos."
          porque="Pra quem tem a pele que coça à noite, e coceira é uma das coisas que mais acordam gente de madrugada sem que ela ligue uma coisa à outra." />
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={7} pageNumberColor={C.base}
        kicker="Os catorze preparos · 13 e 14" title="Os que fecham a noite"
      >
        <Item cor={C} numero={13} nome="Vapor de lavanda no quarto"
          lista={['2 colheres de sopa de lavanda seca', '1 xícara de água fervente', '1 pires']}
          texto="Cobre a lavanda com água fervente e deixa o pires longe da beirada enquanto você se arruma. Retira antes de deitar."
          porque="Não é banho, mas está aqui porque funciona pela mesma via, que é o cheiro. Serve pras noites em que você já deitou e não quer levantar."
          atencao="Retire o pires antes de deitar. Nunca deixe água quente na cabeceira durante o sono." />
        <Item cor={C} numero={14} nome="O ritual completo"
          lista={['1 preparo deste guia', '1 chá do manual principal', 'luz baixa', '40 minutos']}
          texto="Uma hora e meia antes de deitar, faz o banho ou o escalda-pés. Se enxuga, se agasalha e apaga a luz forte. Faz o chá e toma sentada. Vai pra cama sem passar pela tela."
          porque="É a soma de tudo, e dá mais resultado que qualquer preparo sozinho. A ordem importa: primeiro o calor, depois o chá, depois a cama." />
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={8} pageNumberColor={C.base}
        kicker="O cronograma" title="As 21 noites"
        subtitle="Três semanas. A primeira é só pra criar o hábito, a segunda aprofunda, e a terceira é a que mostra o que funciona pra você. Não precisa ser perfeito: noite perdida não zera nada."
      >
        <Titulo cor={C}>Semana 1 — só criar o hábito</Titulo>
        <P>
          Noites 1 a 7: escalda-pés simples, o preparo 1, todas as noites, quinze minutos. Só isso.
          Sem erva, sem sal, sem comprar nada. A meta desta semana não é dormir melhor, é conseguir
          sentar quinze minutos com os pés na água sem pegar o celular.
        </P>

        <Titulo cor={C}>Semana 2 — entra o cheiro e o sal</Titulo>
        <P>
          Noites 8 e 9, preparo 4, com sal grosso. Noites 10 e 11, preparo 7, com camomila. Noites 12
          e 13, preparo 6, com sal e cidreira. Noite 14, o que você mais gostou até aqui.
        </P>

        <Titulo cor={C}>Semana 3 — o corpo inteiro</Titulo>
        <P>
          Noites 15 e 16, preparo 2, o ofurô do chuveiro. Noites 17 e 18, preparo 10 ou 11, se tiver
          banheira, ou repete o 2 se não tiver. Noites 19 e 20, o preparo 14, o ritual completo. Noite
          21, escolhe o seu favorito e transforma em rotina.
        </P>

        <Callout type="tip" title="Nas noites em que não dá tempo de banho">
          Preparo 3, a compressa na nuca, cinco minutos. Ou o escalda-pés de dez em vez de quinze. É
          melhor fazer curto do que pular, porque o que constrói o hábito é a repetição e não a
          duração.
        </Callout>
      </PdfContentPage>

      <PdfContentPage
        accentGradient={F} pageNumber={9} pageNumberColor={C.base}
        kicker="Consulta rápida" title="Qual preparo pra qual noite"
      >
        <StyledTable
          color={C.base}
          headers={['A sua noite é assim', 'Faça', 'Nº']}
          rows={[
            ['Não tenho nada em casa e nem banheira', 'Escalda-pés simples', '1'],
            ['Estou exausta demais pra tomar banho', 'Compressa morna na nuca', '3'],
            ['Corpo dolorido junto com sono ruim', 'Banho de sal amargo', '5'],
            ['Pé gelado que não esquenta', 'Escalda-pés de gengibre', '8'],
            ['Passei o dia inteiro em pé', 'Escalda-pés de hortelã', '9'],
            ['Cabeça acelerada, noite difícil', 'Escalda-pés de sal e cidreira', '6'],
            ['Quero o mais forte que tem aqui', 'Banho de camomila na banheira', '10'],
            ['Pele coçando à noite', 'Banho morno de aveia', '12'],
            ['Já deitei e não quero levantar', 'Vapor de lavanda', '13'],
            ['Quero fazer tudo certo hoje', 'O ritual completo', '14'],
          ]}
        />
        <Spacer size="sm" />
        <Callout type="info" title="A que eu faria se tivesse que escolher uma">
          A número 1. Não precisa comprar nada, não precisa de banheira, e é a que mais gente
          consegue manter por três semanas. O melhor preparo é o que você repete.
        </Callout>
      </PdfContentPage>

      <PdfContentPage accentGradient={F} pageNumber={10} pageNumberColor={C.base} kicker="Pra terminar" title="Uma última coisa">
        <P>
          Se você fizer só a primeira semana deste guia, já vai ter feito mais do que a maioria das
          pessoas que compram um material sobre sono. Quinze minutos, uma bacia, água morna.
        </P>
        <P>
          E lembre da regra que abre este guia, porque ela é a que mais gente ignora: o banho é uma
          hora a uma hora e meia antes de deitar. Feito em cima da hora, ele atrapalha em vez de
          ajudar, porque o corpo ainda está quente na hora em que precisava estar esfriando.
        </P>
        <Callout type="warning" title="E o que erva nenhuma resolve">
          Se você ronca alto, acorda engasgada, ou dorme a noite inteira e continua exausta todos os
          dias, procure um médico. Isso pode ser apneia do sono. Nenhum preparo deste guia substitui
          consulta, diagnóstico ou tratamento.
        </Callout>
        <Assinatura cor={C} frase="Boa noite de verdade." />
      </PdfContentPage>
    </>
  );
}
