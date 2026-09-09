/**
 * PDF — Rota: /pdf/ebook-sono · Manual do Sono Caseiro · Avó Yuki
 *
 * Conteúdo em Informações MD/sono_*.md
 * Paleta espelha a página de vendas em Sistemas/avantis-paginas/sono-avo-yuki
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';
import { DesignPage, AbsBlock } from '@/components/ebook/DesignPage';
import {
  Callout, SectionDivider, Divider, StyledTable, CheckList, StepList, Spacer,
} from '@/components/ebook/VisualElements';

/* ── paleta ─────────────────────────────────────────────────────── */
const INDIGO = 'hsl(224 39% 22%)';
const INDIGO_SUAVE = 'hsl(224 30% 34%)';
const TERRA = 'hsl(21 66% 49%)';
const CREME = 'hsl(39 47% 94%)';
const AREIA = 'hsl(31 58% 71%)';
const FAIXA = `linear-gradient(to bottom, ${INDIGO}, ${INDIGO_SUAVE}, ${TERRA})`;

/* ── tigela de chá, o símbolo da marca ──────────────────────────── */
function TigelaChá({ size = 44, color = CREME }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <path d="M14 30h36v6a18 18 0 0 1-18 18 18 18 0 0 1-18-18v-6Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M50 33h4a5 5 0 0 1 0 10h-2" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M26 22c0-4 3-4 3-8s-3-4-3-4" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <path d="M36 22c0-4 3-4 3-8s-3-4-3-4" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

/* ── cartão de receita ──────────────────────────────────────────── */
function Receita({
  numero,
  nome,
  ingredientes,
  preparo,
  porque,
  atencao,
}: {
  numero: number;
  nome: string;
  ingredientes: string[];
  preparo: string;
  porque: string;
  atencao?: string;
}) {
  return (
    <div className="avoid-page-break mb-3.5 rounded-xl border bg-white/95 p-3.5 shadow-sm" style={{ borderColor: 'hsl(224 39% 22% / 0.14)' }}>
      <div className="flex items-baseline gap-2.5">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ background: INDIGO }}
        >
          {numero}
        </span>
        <h4 className="font-display text-[1.02rem] font-semibold leading-snug" style={{ color: INDIGO }}>
          {nome}
        </h4>
      </div>

      <div className="mt-2.5 grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3">
        <div>
          <span className="text-[9.5px] font-bold uppercase tracking-[0.14em]" style={{ color: TERRA }}>
            Você precisa de
          </span>
          <ul className="mt-1 space-y-0.5">
            {ingredientes.map((i) => (
              <li key={i} className="text-[11.5px] leading-snug text-foreground/85">
                <span style={{ color: AREIA }}>—</span> {i}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="text-[9.5px] font-bold uppercase tracking-[0.14em]" style={{ color: TERRA }}>
            Como faz
          </span>
          <p className="mt-1 text-[11.5px] leading-snug text-foreground/90">{preparo}</p>
        </div>
      </div>

      <div className="mt-2.5 rounded-lg px-2.5 py-1.5" style={{ background: 'hsl(224 39% 22% / 0.055)' }}>
        <span className="text-[9.5px] font-bold uppercase tracking-[0.14em]" style={{ color: INDIGO }}>
          Por que funciona
        </span>
        <p className="mt-0.5 text-[11.5px] leading-snug text-foreground/88">{porque}</p>
      </div>

      {atencao && (
        <div className="mt-1.5 rounded-lg border-l-[3px] px-2.5 py-1.5" style={{ borderColor: TERRA, background: 'hsl(21 66% 49% / 0.07)' }}>
          <span className="text-[9.5px] font-bold uppercase tracking-[0.14em]" style={{ color: TERRA }}>
            Atenção
          </span>
          <p className="mt-0.5 text-[11.5px] leading-snug text-foreground/88">{atencao}</p>
        </div>
      )}
    </div>
  );
}

function Titulo({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-2 mt-1 font-display text-[1.15rem] font-semibold tracking-tight first:mt-0" style={{ color: INDIGO }}>
      {children}
    </h3>
  );
}

function Paragrafo({ children }: { children: ReactNode }) {
  return <p className="mb-2.5 text-[13px] leading-relaxed text-foreground/90">{children}</p>;
}


/* ── tabela do diário, com colunas visíveis pra escrever à mão ──── */
function TabelaDiario() {
  const colunas = ['Noite', 'Receita', 'Demorei a dormir', 'Acordei de madrugada', 'Acordei descansada'];
  const larguras = ['10%', '26%', '21%', '22%', '21%'];
  const borda = '1px solid hsl(224 39% 22% / 0.28)';
  return (
    <table className="w-full" style={{ borderCollapse: 'collapse', border: borda }}>
      <thead>
        <tr style={{ background: INDIGO }}>
          {colunas.map((c, i) => (
            <th
              key={c}
              className="px-2 py-2 text-[9.5px] font-bold uppercase leading-tight tracking-[0.06em] text-white"
              style={{ width: larguras[i], borderRight: i < 4 ? '1px solid hsl(0 0% 100% / 0.22)' : undefined }}
            >
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 14 }, (_, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? 'white' : 'hsl(224 39% 22% / 0.035)' }}>
            <td
              className="px-2 text-center text-[11px] font-semibold"
              style={{ height: '26px', border: borda, color: INDIGO }}
            >
              {i + 1}
            </td>
            {[1, 2, 3, 4].map((j) => (
              <td key={j} style={{ height: '26px', border: borda }} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ── página ─────────────────────────────────────────────────────── */
export default function EbookSono() {
  return (
    <>
      {/* ─── CAPA ─────────────────────────────────────────────── */}
      <DesignPage bg={INDIGO}>
        <AbsBlock top="0" left="0" right="0" bottom="0">
          <div className="absolute inset-6 rounded-lg border" style={{ borderColor: 'hsl(31 58% 71% / 0.28)' }} />
        </AbsBlock>

        <AbsBlock top="16%" left="0" right="0" className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.34em]" style={{ color: AREIA }}>
            Avó Yuki
          </p>
        </AbsBlock>

        <AbsBlock top="27%" left="12%" right="12%" className="text-center">
          <h1 className="font-display text-[3.4rem] font-bold leading-[1.06] tracking-tight" style={{ color: CREME }}>
            Manual do<br />Sono Caseiro
          </h1>
        </AbsBlock>

        <AbsBlock top="49%" left="0" right="0" className="flex justify-center">
          <TigelaChá size={62} color={AREIA} />
        </AbsBlock>

        <AbsBlock top="61%" left="16%" right="16%" className="text-center">
          <div className="mx-auto mb-4 h-px w-16" style={{ background: 'hsl(31 58% 71% / 0.5)' }} />
          <p className="text-[14.5px] font-medium leading-relaxed" style={{ color: 'hsl(39 30% 86%)' }}>
            62 receitas caseiras pra pegar no sono,<br />atravessar a noite e acordar descansada
          </p>
        </AbsBlock>

        <AbsBlock bottom="9%" left="0" right="0" className="text-center">
          <p className="text-[10.5px] uppercase tracking-[0.2em]" style={{ color: 'hsl(31 40% 62%)' }}>
            Chás · Banhos · Ofurô · Escalda-pés
          </p>
        </AbsBlock>
      </DesignPage>

      {/* ─── ABERTURA ─────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={FAIXA} pageNumber={1} pageNumberColor={INDIGO}
        kicker="Antes de tudo"
        title="Quem eu sou e o que este manual não é"
      >
        <Paragrafo>
          Eu não inventei nada do que está aqui dentro. Isso é o que a minha avó fazia lá no Japão,
          o que a minha mãe continuou fazendo, e o que eu venho fazendo há mais de quarenta anos.
        </Paragrafo>
        <Paragrafo>
          O que eu fiz foi outra coisa, e é por isso que este manual existe. Eu troquei tudo que não
          se acha aqui. Erva que só tem lá, eu tirei. No lugar entrou o que você compra na feira, no
          mercado ou colhe no quintal. E anotei o que ninguém anota: a quantidade certa e a hora de tomar.
        </Paragrafo>

        <Divider variant="ornament" color={AREIA} />

        <Titulo>O que este manual é</Titulo>
        <Paragrafo>
          É um caderno de receitas organizado pelo que está te acordando. Você não procura por erva,
          procura pelo problema. Não consegue pegar no sono, acorda às três, dorme e acorda cansada,
          trabalha de noite. Cada bloco tem o seu.
        </Paragrafo>

        <Titulo>O que ele não é</Titulo>
        <Paragrafo>
          Não é remédio e não substitui médico. Não promete que você vai dormir em tantos dias, porque
          quem promete isso está inventando. E não serve pra tratar doença nenhuma.
        </Paragrafo>

        <Callout type="warning" title="Uma coisa que eu preciso dizer logo">
          Se você ronca alto, se acorda engasgada, ou se dorme a noite inteira e mesmo assim acorda
          exausta todo dia, procure um médico antes de qualquer chá. Isso pode ser apneia do sono, e
          apneia não se resolve com erva. Fingir que resolve seria desonesto da minha parte.
        </Callout>
      </PdfContentPage>

      {/* ─── POR QUE NÃO FUNCIONOU ────────────────────────────── */}
      <PdfContentPage
        accentGradient={FAIXA} pageNumber={2} pageNumberColor={INDIGO}
        kicker="A parte que quase ninguém conta"
        title="Não é falta de esforço. É sinal trocado."
        subtitle="Se você já tentou de tudo e não saiu do lugar, provavelmente foi por um destes três motivos. Eles vêm antes das receitas de propósito."
      >
        <SectionDivider title="Primeiro" color={INDIGO} />
        <Titulo>A hora de acordar manda mais que a hora de dormir</Titulo>
        <Paragrafo>
          Quase todo mundo tenta a mesma coisa: ir pra cama mais cedo. Deita, fica rolando, se irrita,
          e conclui que não tem jeito. O corpo não funciona assim. O que acerta o relógio de dentro é
          o outro extremo, a hora em que você levanta e a hora em que você toma sol. Fixa o despertar,
          inclusive no fim de semana, e o resto vai atrás sozinho.
        </Paragrafo>

        <SectionDivider title="Segundo" color={INDIGO} />
        <Titulo>A luz pesa mais que o chá</Titulo>
        <Paragrafo>
          Nenhuma receita deste manual rende o que poderia se o corpo continuar recebendo sinal de dia
          até a hora de deitar. Luz forte à noite, e principalmente tela na cara, mantém o corpo
          achando que ainda é tarde. Meia hora de luz baixa antes de dormir faz mais do que qualquer
          erva que eu possa te dar.
        </Paragrafo>

        <SectionDivider title="Terceiro" color={INDIGO} />
        <Titulo>O café da tarde ainda está lá</Titulo>
        <Paragrafo>
          Essa é a que mais gera discussão. A cafeína demora muito mais pra sair do corpo do que a
          gente imagina, e aquele cafezinho das quatro da tarde ainda está circulando na hora de
          deitar. Mesmo em quem jura que café não faz efeito nenhum.
        </Paragrafo>

        <Callout type="tip" title="Se você fizer só uma coisa deste manual">
          Faça as três acima por uma semana, antes de tomar qualquer chá. Sem isso, as receitas
          trabalham contra a maré.
        </Callout>
      </PdfContentPage>

      {/* ─── COMO USAR + SEGURANÇA ────────────────────────────── */}
      <PdfContentPage
        accentGradient={FAIXA} pageNumber={3} pageNumberColor={INDIGO}
        kicker="Como usar"
        title="Como achar o seu e como começar"
      >
        <Titulo>Procure pelo problema, não pela erva</Titulo>
        <Paragrafo>
          Vá direto no bloco que descreve a sua noite. Dentro dele, comece pela primeira receita, que
          é sempre a mais suave. As últimas de cada bloco são as mais fortes, e eu deixo por último de
          propósito.
        </Paragrafo>

        <Titulo>Horário e quantidade</Titulo>
        <Paragrafo>
          Toda receita diz de quanto tempo antes de deitar ela é. Isso não é detalhe: chá tomado na
          hora de apagar a luz não deu tempo de fazer nada. E tomar sentada, sem pressa, sem tela,
          já é metade do trabalho.
        </Paragrafo>

        <Titulo>Quantas vezes por semana</Titulo>
        <Paragrafo>
          As suaves você pode tomar todo dia. As fortes, que estão marcadas, não. Erva forte todo dia
          perde o efeito e cansa o corpo.
        </Paragrafo>

        <Divider variant="dashes" color={AREIA} />

        <Titulo>Antes do primeiro gole</Titulo>
        <Paragrafo>
          Estas seis perguntas levam menos de um minuto e valem pra qualquer receita que você fizer
          pela primeira vez. Estão também no bônus, em folha solta, pra deixar na cozinha.
        </Paragrafo>

        <div className="mb-3 space-y-1.5">
          {[
            'Você toma algum remédio pra dormir, calmante ou ansiolítico? Se sim, leia o Bônus 1 antes.',
            'Está grávida ou amamentando? Várias ervas daqui não servem. Confirme com o médico.',
            'Tem alergia a alguma planta, principalmente camomila, arnica ou girassol?',
            'É a primeira vez com essa erva? Comece com metade da xícara.',
            'A receita tem aviso de Atenção? Leia antes, não depois.',
            'Você vai dirigir ou trabalhar nas próximas horas? Então não é hora dessa receita.',
          ].map((q, i) => (
            <div key={q} className="flex gap-2 rounded-lg px-2.5 py-1.5" style={{ background: CREME }}>
              <span className="text-[11px] font-bold" style={{ color: TERRA }}>{i + 1}</span>
              <span className="text-[12px] leading-snug text-foreground/88">{q}</span>
            </div>
          ))}
        </div>

        <Callout type="info" title="Uma regra que vale pra tudo">
          Erva calmante soma com remédio calmante. Não é que uma anule a outra: elas se empilham. Por
          isso o Bônus 1 é a página mais importante deste manual, e não é força de expressão.
        </Callout>
      </PdfContentPage>

      {/* ─── BLOCO 1 ──────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={FAIXA} pageNumber={4} pageNumberColor={INDIGO}
        kicker="Bloco 1 · Receitas 1 a 14"
        title="Pra quando a cabeça não desliga"
        subtitle="Pra noite em que o corpo já parou e a cabeça continua. Toma sentada, sem pressa, entre trinta minutos e uma hora antes de deitar. Se tomar e ir mexer no celular, não adianta."
      >
        <Receita
          numero={1}
          nome="O chá de toda noite"
          ingredientes={['1 colher de sopa de camomila seca', '200ml de água', '1 colher de chá de mel, se quiser']}
          preparo="Ferve a água e desliga o fogo. Só então joga a camomila, tampa e deixa dez minutos. Coa e toma morno, quarenta minutos antes de deitar."
          porque="A camomila é a erva mais usada no mundo pra acalmar antes de dormir, e não é à toa. Ela não derruba ninguém: tira o corpo do estado de alerta, que é outra coisa. Fervendo a erva junto com a água você perde metade do que ela tem de bom, por isso a gente desliga o fogo antes."
          atencao="Quem tem alergia a camomila, arnica ou girassol pode reagir. Se nunca tomou, começa com meia xícara."
        />
        <Receita
          numero={2}
          nome="Cidreira com mel"
          ingredientes={['1 punhado de folha fresca de erva-cidreira, ou 1 colher de sopa da seca', '200ml de água', '1 colher de chá de mel']}
          preparo="Água fervida, fogo desligado, folha dentro, tampa por sete minutos. Coa, adoça e toma trinta minutos antes de deitar."
          porque="A cidreira é a mais suave de todas as que estão neste manual, e por isso é por onde eu mando começar quem nunca tomou chá pra dormir. Ela acalma sem pesar no dia seguinte."
        />
        <Receita
          numero={3}
          nome="Cidreira com camomila"
          ingredientes={['1 colher de chá de camomila seca', '1 colher de chá de erva-cidreira seca', '200ml de água']}
          preparo="Mesma coisa das outras: água fervida, fogo desligado, as duas ervas juntas, tampa por dez minutos. Coa e toma quarenta minutos antes de deitar."
          porque="As duas se completam. A camomila trabalha no corpo tenso e a cidreira na cabeça acelerada. Quando uma sozinha não resolve, é essa que eu faço."
        />
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={5} pageNumberColor={INDIGO} kicker="Bloco 1 · continuação">
        <Receita
          numero={4}
          nome="Capim-santo da janela"
          ingredientes={['3 folhas frescas de capim-santo, picadas', '250ml de água']}
          preparo="Pica as folhas com a tesoura, joga na água já fervida e fora do fogo, tampa por dez minutos. Coa e toma morno."
          porque="Capim-santo é a erva mais fácil de ter em casa, cresce em vaso e não morre. E é calmante de verdade, não é só cheiro bom. Se você não tem nenhuma erva em casa, planta essa primeiro."
        />
        <Receita
          numero={5}
          nome="Maracujá da folha, não do suco"
          ingredientes={['1 colher de sopa de folha de maracujá seca', '200ml de água']}
          preparo="Água fervida, fogo desligado, folha dentro, tampa por dez minutos. Coa e toma uma hora antes de deitar."
          porque="Aqui é onde quase todo mundo erra. O que acalma é a folha, não a fruta. Suco de maracujá antes de dormir é açúcar, e açúcar antes de deitar atrapalha em vez de ajudar. A folha é outra coisa, e é forte."
          atencao="Essa soma efeito com remédio pra dormir, calmante e ansiolítico. Se você toma alguma coisa assim, vá no Bônus 1 antes. Não use na gravidez."
        />
        <Receita
          numero={6}
          nome="Erva-doce da noite pesada"
          ingredientes={['1 colher de chá de semente de erva-doce', '200ml de água']}
          preparo="Amassa as sementes com o fundo da colher antes, pra soltar o cheiro. Água fervida, fogo desligado, tampa por oito minutos."
          porque="Essa é pra noite em que você deitou com a barriga cheia e não consegue relaxar. A erva-doce ajuda a digestão a andar, e quando a barriga acalma a cabeça vai atrás."
        />
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={6} pageNumberColor={INDIGO} kicker="Bloco 1 · continuação">
        <Receita
          numero={7}
          nome="Leite morno da minha avó"
          ingredientes={['200ml de leite', '1 colher de chá de mel', '1 pitada pequena de canela em pó']}
          preparo="Aquece o leite sem deixar ferver. Tira do fogo, mistura o mel e a canela. Toma morno, sentada, trinta minutos antes de deitar."
          porque="Não é lenda de vó, mas também não é mágica. O leite morno tem duas coisas a favor: é pesado o suficiente pra tirar a fome da madrugada, e o gesto de tomar algo quente sentada, sem pressa, já é metade do trabalho."
        />
        <Receita
          numero={8}
          nome="Leite com banana"
          ingredientes={['200ml de leite morno', 'meia banana bem madura', '1 colher de chá de mel']}
          preparo="Bate tudo no liquidificador por um minuto. Toma na hora, morno, quarenta minutos antes de deitar."
          porque="A banana madura e o leite juntos são a combinação que mais me pedem repetir. Enche sem pesar, e é o que eu faço pra quem acorda de fome no meio da noite."
        />
        <Receita
          numero={9}
          nome="Tília da noite difícil"
          ingredientes={['1 colher de sopa de flor de tília', '200ml de água']}
          preparo="Água fervida, fogo desligado, flor dentro, tampa por dez minutos. Coa e toma uma hora antes de deitar."
          porque="A tília é mais forte que a camomila e mais suave que o maracujá. É a do meio, e é a que eu guardo pra noite que eu já sei que vai ser difícil."
        />
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={7} pageNumberColor={INDIGO} kicker="Bloco 1 · continuação">
        <Receita
          numero={10}
          nome="Hortelã com cidreira"
          ingredientes={['4 folhas de hortelã fresca', '1 punhado de erva-cidreira fresca', '250ml de água']}
          preparo="Água fervida, fogo desligado, as folhas dentro, tampa por sete minutos. Coa e toma morno."
          porque="Essa é pra quem acha chá de dormir amargo e desiste no segundo dia. A hortelã deixa o gosto bom sem tirar o efeito da cidreira. Receita que a pessoa não gosta é receita que ela não repete."
        />
        <Receita
          numero={11}
          nome="Água de alface"
          ingredientes={['4 folhas grandes de alface, as de fora, que são as mais escuras', '250ml de água']}
          preparo="Ferve a água com as folhas dentro por cinco minutos, dessa vez com o fogo ligado. Coa, deixa amornar e toma antes de deitar."
          porque="Essa é das mais antigas que existem, e quase ninguém conhece mais. O talo da alface solta uma seiva branca, e é ela que acalma. Por isso usa as folhas de fora, que têm mais."
        />
        <Receita
          numero={12}
          nome="Camomila com laranja"
          ingredientes={['1 colher de sopa de camomila seca', '1 pedaço de casca de laranja, só a parte alaranjada', '250ml de água']}
          preparo="Água fervida, fogo desligado, camomila e casca juntas, tampa por dez minutos. Coa e toma morno."
          porque="A casca da laranja tem o óleo que dá o cheiro, e cheiro faz mais pelo sono do que a gente imagina. Essa é a que eu faço quando quero que a casa inteira fique com cheiro de calma."
          atencao="Use a casca bem lavada, e só a parte de fora. A parte branca amarga."
        />
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={8} pageNumberColor={INDIGO} kicker="Bloco 1 · fim">
        <Receita
          numero={13}
          nome="Gengibre morno da noite fria"
          ingredientes={['2 rodelas finas de gengibre', '200ml de água', '1 colher de chá de mel']}
          preparo="Ferve o gengibre na água por três minutos, com o fogo ligado. Desliga, deixa amornar, adoça e toma."
          porque="Essa não é calmante, é aquecedora, e serve pra noite em que você não dorme de pé frio. Corpo aquecido por dentro relaxa e depois esfria, e é a descida que traz o sono."
          atencao="Não é pra tomar quente demais nem perto de deitar. Uma hora antes, e morno."
        />
        <Receita
          numero={14}
          nome="A mistura das três"
          ingredientes={['1 colher de chá de camomila seca', '1 colher de chá de erva-cidreira seca', 'meia colher de chá de folha de maracujá seca', '250ml de água']}
          preparo="Água fervida, fogo desligado, as três juntas, tampa por doze minutos. Coa e toma uma hora antes de deitar."
          porque="Essa é a mais forte deste bloco, e é a que eu deixo por último de propósito. Só faz quando as outras não deram conta, e não faz toda noite."
          atencao="Por causa do maracujá, soma efeito com remédio pra dormir e com calmante. Leia o Bônus 1 antes. Não use na gravidez, e não use mais de três vezes por semana."
        />

        <Callout type="tip" title="Fim do bloco 1">
          Se nenhuma das catorze resolveu, o problema provavelmente não é a hora de deitar. Vá pro
          Bloco 3, que trata da noite anterior, ou pro Bloco 5, dos banhos.
        </Callout>
      </PdfContentPage>
      {/* ─── BLOCO 2 ──────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={FAIXA} pageNumber={9} pageNumberColor={INDIGO}
        kicker="Bloco 2 · Receitas 15 a 24"
        title="Pra acordar de madrugada e não voltar"
        subtitle="Essas são diferentes das outras. São pra fazer no escuro, com sono, sem medir nada e sem acender luz forte. Metade delas você deixa pronta antes de deitar, e é esse o segredo: às três da manhã ninguém tem paciência de ferver água."
      >
        <Callout type="tip" title="A regra das três da manhã">
          Não acenda a luz do teto. Não pegue o celular. Se em vinte minutos não voltou o sono,
          levante e vá pra outro cômodo com luz baixa até dar sono de novo. Ficar deitada brigando
          com o travesseiro ensina o corpo que a cama é lugar de ficar acordada.
        </Callout>
        <Receita
          numero={15}
          nome="A garrafa térmica da cabeceira"
          ingredientes={['1 colher de sopa de camomila ou cidreira', '400ml de água', '1 garrafa térmica pequena']}
          preparo="Faz o chá antes de deitar, do jeito de sempre, coa e guarda na térmica ao lado da cama. Se acordar, é só servir meia xícara e beber ali mesmo, no escuro."
          porque="Essa é a mais importante deste bloco e por isso é a primeira. O problema das três da manhã não é a falta de chá, é ter que ir até a cozinha, acender luz e acordar de vez. Preparado antes, o gesto leva vinte segundos."
        />
        <Receita
          numero={16}
          nome="Água morna com mel"
          ingredientes={['1 copo de água morna', '1 colher de chá de mel']}
          preparo="Mistura e bebe devagar, sentada na beira da cama. Serve água do dia mesmo, só não pode estar gelada."
          porque="Muita gente acorda de madrugada simplesmente com sede, e nem percebe. Água gelada desperta; morna não. O mel dá o docinho que tira aquela sensação de vazio no estômago."
        />
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={10} pageNumberColor={INDIGO} kicker="Bloco 2 · continuação">
        <Receita
          numero={17}
          nome="Leite de quarenta segundos"
          ingredientes={['150ml de leite', '1 colher de chá de mel']}
          preparo="Micro-ondas por quarenta segundos, mexe o mel e toma. Não precisa acender a luz da cozinha, a do micro-ondas basta."
          porque="É a versão de madrugada do leite morno. Enche o estômago o suficiente pra tirar aquela fome que às vezes é o que está te segurando acordada, e o calor faz o corpo relaxar de novo."
        />
        <Receita
          numero={18}
          nome="O sachê que já fica no copo"
          ingredientes={['1 sachê de camomila', '1 copo já separado na cozinha', 'água quente da garrafa térmica']}
          preparo="Deixa o copo com o sachê dentro pronto na bancada antes de dormir. De madrugada é só despejar a água da térmica e esperar cinco minutos."
          porque="Mesma lógica da receita 15, pra quem não gosta de chá guardado. O trabalho todo você faz acordada, e de madrugada sobra só o gesto."
        />
        <Receita
          numero={19}
          nome="Meia banana com mel"
          ingredientes={['meia banana madura', '1 colher de chá de mel']}
          preparo="Amassa com o garfo e come devagar. Deixa a banana já na fruteira do quarto se você acorda com fome toda noite."
          porque="Pra quem acorda com o estômago roncando. Banana é doce, mas é o tipo de doce que não sobe e desce rápido, então não vai te acordar de vez daqui a meia hora."
        />
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={11} pageNumberColor={INDIGO} kicker="Bloco 2 · continuação">
        <Receita
          numero={20}
          nome="Chá de casca de maçã"
          ingredientes={['a casca de 1 maçã', '250ml de água', '1 pau de canela pequeno']}
          preparo="Ferve tudo junto por cinco minutos, coa e guarda na térmica antes de dormir. De madrugada, meia xícara."
          porque="Essa é pra quem já enjoou de camomila. A casca da maçã com canela dá um chá adocicado que não precisa de açúcar nenhum, e o cheiro é o que a maioria descreve como cheiro de casa."
        />
        <Receita
          numero={21}
          nome="Água com sal e mel"
          ingredientes={['1 copo de água morna', '1 pitada bem pequena de sal', '1 colher de chá de mel']}
          preparo="Dissolve e bebe devagar. A pitada de sal é literalmente uma pitada, não é uma colher."
          porque="Essa é pra quem acorda de madrugada com câimbra ou com a boca seca, principalmente depois de dia quente ou de trabalho pesado. Repõe o que suou sem mexer com o estômago."
          atencao="Se você tem pressão alta ou o médico mandou reduzir sal, pula essa e fica na 16."
        />
        <Receita
          numero={22}
          nome="Cidreira da geladeira"
          ingredientes={['1 chá de erva-cidreira feito antes', 'geladeira']}
          preparo="Faz o chá de tarde, deixa esfriar e guarda numa garrafa na geladeira. De madrugada, meio copo em temperatura ambiente."
          porque="Pra quem acorda com calor e não quer nada quente. Não precisa estar gelado: tira da geladeira e deixa um minuto na mão que já serve."
        />
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={12} pageNumberColor={INDIGO} kicker="Bloco 2 · fim">
        <Receita
          numero={23}
          nome="Erva-doce de dois minutos"
          ingredientes={['1 colher de chá de semente de erva-doce', '200ml de água quente da térmica']}
          preparo="Amassa as sementes antes de dormir e deixa numa xícara na cozinha. De madrugada, água quente por cima e cinco minutos tampado."
          porque="Pra quem acorda com a barriga estufada no meio da noite, que é mais comum do que se imagina depois de jantar tarde. A erva-doce solta o gás e alivia rápido."
        />
        <Receita
          numero={24}
          nome="A mistura da madrugada"
          ingredientes={['2 colheres de sopa de camomila seca', '2 colheres de sopa de erva-cidreira seca', '1 colher de sopa de erva-doce', '1 pote de vidro com tampa']}
          preparo="Mistura tudo seco e guarda no pote. Quando precisar, 1 colher de sopa da mistura para 250ml de água quente, cinco minutos tampado. Dura três meses."
          porque="Essa é a que resolve o problema de verdade: você faz uma vez e não pensa mais. Deixa o pote e uma xícara juntos na bancada, e de madrugada não precisa escolher nada nem medir nada."
        />

        <Callout type="warning" title="Se acontece toda noite">
          Acordar de madrugada uma ou outra vez é normal. Acontecer todas as noites, por semanas, com
          cansaço no dia seguinte, já é outra conversa e merece um médico. Principalmente se vier
          junto com ronco alto ou com sensação de engasgo.
        </Callout>
      </PdfContentPage>

      {/* ─── BLOCO 3 ──────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={FAIXA} pageNumber={13} pageNumberColor={INDIGO}
        kicker="Bloco 3 · Receitas 25 a 34"
        title="Pra dormir a noite toda e acordar cansada"
        subtitle="Esse é o problema mais mal entendido de todos. Quem dorme oito horas e acorda moída não tem problema na hora de deitar: tem problema na noite anterior. Estas receitas são do fim da tarde e da hora do jantar, não da cama."
      >
        <Receita
          numero={25}
          nome="A sopa que não pesa"
          ingredientes={['1 batata pequena', '1 cenoura', '1 punhado de abobrinha', '500ml de água', 'sal a gosto', '1 fio de azeite no fim']}
          preparo="Cozinha tudo, bate e serve. Janta duas a três horas antes de deitar, nunca em cima da hora."
          porque="O corpo não descansa direito enquanto está digerindo comida pesada. Se você janta tarde e pesado, dorme a noite inteira e o corpo trabalhou a noite inteira junto. Sopa resolve isso sem te deixar com fome."
        />
        <Receita
          numero={26}
          nome="Erva-doce depois do jantar"
          ingredientes={['1 colher de chá de semente de erva-doce', '200ml de água']}
          preparo="Amassa as sementes, água fervida e fora do fogo, oito minutos tampado. Toma logo depois de comer."
          porque="Chá depois do jantar não é frescura, é o que faz a digestão andar mais rápido. Quanto antes o estômago esvazia, mais cedo o corpo pode começar a descansar de verdade."
        />
        <Receita
          numero={27}
          nome="Camomila com erva-doce"
          ingredientes={['1 colher de chá de camomila seca', '1 colher de chá de erva-doce', '250ml de água']}
          preparo="Água fervida, fogo desligado, as duas juntas, dez minutos tampado. Uma hora depois do jantar."
          porque="Junta as duas frentes: a erva-doce cuida da digestão e a camomila da tensão. É a que eu faço quando jantei mais tarde do que devia."
        />
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={14} pageNumberColor={INDIGO} kicker="Bloco 3 · continuação">
        <Receita
          numero={28}
          nome="Água de maçã com canela"
          ingredientes={['1 maçã cortada com casca', '500ml de água', '1 pau de canela']}
          preparo="Ferve tudo por dez minutos, coa e toma morno no fim da tarde. Rende duas xícaras."
          porque="Essa é do fim de tarde, não da noite. Serve pra marcar pro corpo que o dia está virando, que é o que a gente perde quando trabalha até tarde e não tem transição nenhuma entre trabalho e cama."
        />
        <Receita
          numero={29}
          nome="Mingau leve de aveia"
          ingredientes={['2 colheres de sopa de aveia em flocos', '200ml de leite ou água', '1 colher de chá de mel', '1 pitada de canela']}
          preparo="Cozinha a aveia no leite em fogo baixo por cinco minutos, mexendo. Adoça e come morno, duas horas antes de deitar."
          porque="Pra quem janta cedo e acorda de madrugada com fome. A aveia segura o estômago por horas sem pesar, que é o oposto de um sanduíche às dez da noite."
        />
        <Receita
          numero={30}
          nome="Hortelã do fim do jantar"
          ingredientes={['5 folhas de hortelã fresca', '200ml de água']}
          preparo="Água fervida, fogo desligado, folhas dentro, cinco minutos tampado."
          porque="A hortelã é a mais rápida pra desinchar a barriga depois de comer, e a que tem o gosto mais fácil de aceitar."
          atencao="Se você tem refluxo ou azia frequente, essa não serve: a hortelã relaxa justamente o músculo que segura o ácido no lugar. Nesse caso use a 26, de erva-doce."
        />
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={15} pageNumberColor={INDIGO} kicker="Bloco 3 · continuação">
        <Receita
          numero={31}
          nome="Leite morno com cúrcuma"
          ingredientes={['200ml de leite', 'meia colher de chá de cúrcuma em pó', '1 pitada de pimenta-do-reino', '1 colher de chá de mel']}
          preparo="Aquece o leite sem ferver, mistura a cúrcuma e a pitada de pimenta, adoça. Toma morno, uma hora antes de deitar."
          porque="A pimenta parece estranha aí, mas é ela que faz a cúrcuma ser aproveitada pelo corpo. Sem ela, a cúrcuma passa reto. É uma pitada só, não dá gosto de pimenta."
          atencao="Cúrcuma em quantidade grande não combina com remédio anticoagulante. Meia colher de chá por dia é seguro pra maioria, mas se você toma remédio pra afinar o sangue, pergunte ao médico."
        />
        <Receita
          numero={32}
          nome="A ceia dos três ingredientes"
          ingredientes={['meia banana', '1 colher de sopa de aveia', '1 colher de chá de mel']}
          preparo="Amassa a banana, mistura a aveia e o mel, come com colher. Duas horas antes de deitar."
          porque="É a ceia mais simples que existe e a que eu mais indico pra quem trabalha até tarde e não tem tempo de cozinhar. Três coisas, um garfo, dois minutos."
        />
        <Receita
          numero={33}
          nome="Chá de casca de maçã com cravo"
          ingredientes={['a casca de 1 maçã', '3 cravos-da-índia', '250ml de água']}
          preparo="Ferve tudo por cinco minutos, coa e toma morno depois do jantar."
          porque="O cravo é digestivo e o cheiro dele é dos mais fortes que existem pra dar sensação de fim de dia. Use três cravos, não mais: em quantidade grande fica amargo e enjoa."
        />
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={16} pageNumberColor={INDIGO} kicker="Bloco 3 · fim">
        <Receita
          numero={34}
          nome="O chá do fim de tarde"
          ingredientes={['1 colher de chá de capim-santo', '1 colher de chá de erva-cidreira', '250ml de água']}
          preparo="Água fervida, fogo desligado, dez minutos tampado. Toma entre cinco e sete da tarde, sentada, longe da tela."
          porque="Essa não é pra dormir, é pra marcar o fim do dia. Quem trabalha e vai direto do serviço pra cama não dá ao corpo nenhum aviso de que a noite chegou. Vinte minutos com uma xícara na mão é o aviso mais barato que existe."
        />

        <Callout type="info" title="O corte do café">
          Não é receita, mas é o que mais muda esse bloco. O último café do dia precisa ser no
          começo da tarde. Se você toma café às quatro ou cinco, ele ainda está circulando quando
          você deita, mesmo que você jure que não sente nada. Testa uma semana e compara.
        </Callout>
      </PdfContentPage>

      {/* ─── BLOCO 4 ──────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={FAIXA} pageNumber={17} pageNumberColor={INDIGO}
        kicker="Bloco 4 · Receitas 35 a 42"
        title="Pra quem trabalha em escala ou turno"
        subtitle="Dormir de dia é outro problema, e quase tudo que se lê por aí sobre sono não serve pra você. Este bloco é pra enfermagem, segurança, motorista, portaria, fábrica e todo mundo que não escolhe a hora de deitar."
      >
        <Callout type="warning" title="A regra que vem antes de todas">
          Nenhuma receita calmante deste manual serve antes de dirigir ou de operar máquina. Elas
          somam sono, e sono no volante mata. Se você vai trabalhar, veja a receita 39, que é a
          única deste bloco feita pra isso.
        </Callout>
        <Receita
          numero={35}
          nome="O chá do pós-plantão"
          ingredientes={['1 colher de chá de camomila', '1 colher de chá de erva-cidreira', '250ml de água']}
          preparo="Chega em casa, toma banho, e só então faz o chá. Toma sentada, com a cortina já fechada, e vai deitar em seguida."
          porque="Quem sai do plantão vem com o corpo ligado, mesmo exausto. O chá aqui não é pra dar sono, é pra desligar o alerta. E fazer isso na ordem certa, banho antes e cortina fechada antes, importa mais que a erva."
        />
        <Receita
          numero={36}
          nome="Leite reforçado de dormir de dia"
          ingredientes={['200ml de leite', 'meia banana', '1 colher de sopa de aveia', '1 colher de chá de mel']}
          preparo="Bate tudo e toma morno, logo antes de deitar de manhã."
          porque="Dormir de dia dá menos horas, então o corpo acorda com fome mais rápido. Essa é mais reforçada que as outras de propósito, pra você não acordar às onze com o estômago vazio."
        />
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={18} pageNumberColor={INDIGO} kicker="Bloco 4 · continuação">
        <Receita
          numero={37}
          nome="O chá da virada de turno"
          ingredientes={['1 colher de sopa de flor de tília', '250ml de água']}
          preparo="Na noite anterior à virada, uma hora antes de deitar. Só nos dois ou três dias da virada, não sempre."
          porque="A virada de turno é o pior dia da escala, e todo mundo que trabalha assim sabe. A tília é mais forte que a camomila e serve justamente pra esses dias em que o corpo está sendo obrigado a mudar de horário de uma vez."
          atencao="Nos dias de virada, não use junto com a receita 42 nem com a 14. Uma forte por noite basta."
        />
        <Receita
          numero={38}
          nome="Água morna do quarto escuro"
          ingredientes={['1 copo de água morna', '1 colher de chá de mel']}
          preparo="Deixa pronto na cabeceira antes de deitar de manhã. Se acordar no meio do dia com barulho de rua, bebe e volta a deitar sem abrir a cortina."
          porque="Quem dorme de dia acorda várias vezes, e o erro é levantar e ver luz. Um copo ao lado da cama evita o levantar, e não abrir a cortina evita o corpo entender que o dia começou."
        />
        <Receita
          numero={39}
          nome="O chá que se leva pro turno"
          ingredientes={['1 colher de chá de gengibre ralado', '1 colher de chá de hortelã', '400ml de água', '1 garrafa térmica']}
          preparo="Ferve o gengibre três minutos, desliga, joga a hortelã, cinco minutos tampado. Coa, põe na térmica e leva."
          porque="Essa é a única deste bloco que não é calmante, e por isso ela existe. Gengibre e hortelã aquecem e despertam um pouco, sem ser café. Serve pra madrugada de trabalho, quando você precisa estar acordada e não quer mais um café às três da manhã."
        />
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={19} pageNumberColor={INDIGO} kicker="Bloco 4 · fim">
        <Receita
          numero={40}
          nome="Mistura da folga"
          ingredientes={['1 colher de chá de camomila', '1 colher de chá de capim-santo', '250ml de água']}
          preparo="No primeiro dia de folga, à noite, uma hora antes de deitar."
          porque="O dia de folga é onde quase todo mundo estraga a escala: dorme o dia inteiro pra compensar e chega no próximo turno pior ainda. Essa é uma receita suave de propósito, pra você dormir à noite na folga e não virar o relógio de novo."
        />
        <Receita
          numero={41}
          nome="Chá gelado pra levar"
          ingredientes={['2 colheres de sopa de erva-cidreira', '1 litro de água', '1 garrafa']}
          preparo="Faz o chá, deixa esfriar, guarda na geladeira e leva na garrafa. Toma ao longo do turno, gelado ou natural."
          porque="Substitui o refrigerante e o energético do plantão, que são os dois maiores inimigos de quem trabalha à noite. Hidrata sem dar aquele pico e queda que deixa você pior às cinco da manhã."
        />
        <Receita
          numero={42}
          nome="Chá da recuperação"
          ingredientes={['1 colher de chá de camomila', '1 colher de chá de erva-cidreira', 'meia colher de chá de folha de maracujá', '250ml de água']}
          preparo="Depois de uma sequência de noites, no dia em que você finalmente pode dormir direito. Doze minutos tampado, uma hora antes de deitar."
          porque="É a mais forte do bloco e existe pra um dia específico: o de recuperar depois de vários turnos seguidos. Não é de uso comum."
          atencao="Tem maracujá, então soma efeito com remédio de dormir e calmante. Leia o Bônus 1. Não use na gravidez, e nunca antes de trabalhar ou dirigir."
        />

        <Callout type="tip" title="O que vale mais que qualquer chá deste bloco">
          Cortina que escureça de verdade, e tampão de ouvido. Custam pouco e fazem mais pelo seu
          sono de dia do que todas as oito receitas acima juntas. As receitas ajudam; o quarto escuro
          resolve.
        </Callout>
      </PdfContentPage>

      {/* ─── BLOCO 5 ──────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={FAIXA} pageNumber={20} pageNumberColor={INDIGO}
        kicker="Bloco 5 · Receitas 43 a 56"
        title="Banhos, ofurô e escalda-pés"
        subtitle="Este é o bloco que me pediram pra deixar de fora porque parecia trabalhoso demais, e é justamente o que mais funciona. Se você só fizer uma coisa deste manual, faça este bloco."
      >
        <Callout type="info" title="Por que o banho quente funciona, e por que quase todo mundo faz na hora errada">
          O sono começa quando a temperatura do corpo cai. O banho quente não faz dormir por
          esquentar: faz porque, depois dele, o corpo esfria mais rápido e mais fundo do que
          esfriaria sozinho. É a descida que traz o sono, não a subida. Por isso o banho é de
          uma hora a uma hora e meia antes de deitar, e não em cima da hora.
        </Callout>
        <Callout className="mt-3" type="warning" title="Antes de qualquer banho deste bloco">
          Água morna, não fervendo. Se você tem diabetes, teste sempre a água com o cotovelo e
          nunca com o pé, porque o pé pode não sentir o calor e queimar sem você perceber. Quem tem
          varizes, pressão descontrolada, problema de circulação ou está grávida deve falar com o
          médico antes de banho quente demorado.
        </Callout>
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={21} pageNumberColor={INDIGO} kicker="Bloco 5 · continuação">
        <Receita
          numero={43}
          nome="O ofurô adaptado do chuveiro"
          ingredientes={['seu chuveiro', 'água morna', '10 minutos']}
          preparo="Banho morno de dez minutos, deixando a água bater nas costas e na nuca. Sai, se enxuga e se agasalha logo. Uma hora a uma hora e meia antes de deitar."
          porque="É a versão de todo dia do ofurô, pra quem não tem banheira. O que importa não é a banheira, é o corpo aquecer por dentro e depois esfriar. Se agasalhar ao sair faz a descida ser mais suave e mais funda."
        />
        <Receita
          numero={44}
          nome="Escalda-pés simples"
          ingredientes={['1 bacia', 'água morna até cobrir o tornozelo', '1 toalha']}
          preparo="Quinze minutos com os pés na bacia, sentada, sem tela. Seca bem e põe meia. Uma hora antes de deitar."
          porque="Essa é a que eu mais indico pra quem mora sozinha e acha banho demorado uma perda de tempo. Os pés são onde o corpo mais solta calor. Aquece o pé, o corpo entende que pode relaxar, e depois a temperatura cai."
        />
        <Receita
          numero={45}
          nome="Escalda-pés com sal grosso"
          ingredientes={['1 bacia de água morna', '2 colheres de sopa de sal grosso']}
          preparo="Dissolve o sal na água morna e fica quinze minutos. Seca bem, principalmente entre os dedos."
          porque="O sal deixa a água mais pesada e o calor mais constante, então esfria menos rápido que a água pura. É a mesma coisa da 44, só que dura mais."
          atencao="Se tiver qualquer ferida, rachadura ou micose no pé, não use sal. Só água morna."
        />
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={22} pageNumberColor={INDIGO} kicker="Bloco 5 · continuação">
        <Receita
          numero={46}
          nome="Escalda-pés de camomila"
          ingredientes={['3 colheres de sopa de camomila seca', '1 litro de água fervente', '1 bacia com água morna']}
          preparo="Faz o chá forte de camomila, coa e despeja na bacia com a água morna. Quinze minutos."
          porque="O cheiro da camomila subindo da bacia faz metade do trabalho. Aqui não é o que a erva faz pela pele, é o que o cheiro faz pela cabeça."
        />
        <Receita
          numero={47}
          nome="Escalda-pés de gengibre"
          ingredientes={['1 pedaço de gengibre de 3cm, em rodelas', '1 litro de água', '1 bacia']}
          preparo="Ferve o gengibre dez minutos, despeja na bacia com água morna e fica quinze minutos."
          porque="Essa é pra noite fria e pra quem tem pé gelado que não esquenta nem debaixo do cobertor. O gengibre puxa o sangue pra superfície e o pé aquece de verdade, não só por fora."
          atencao="Não use com o pé machucado, e não deixe a água quente demais achando que aquece mais rápido."
        />
        <Receita
          numero={48}
          nome="Escalda-pés de hortelã pro pé cansado"
          ingredientes={['1 punhado grande de hortelã fresca', '1 litro de água fervente', '1 bacia']}
          preparo="Amassa a hortelã com a mão, cobre com a água fervente, espera dez minutos e despeja na bacia com água morna."
          porque="Pra quem passa o dia em pé: enfermagem, cozinha, balcão, fábrica. A hortelã dá aquela sensação de alívio na hora, e pé aliviado é o que permite o corpo parar."
        />
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={23} pageNumberColor={INDIGO} kicker="Bloco 5 · continuação">
        <Receita
          numero={49}
          nome="Banho de camomila na banheira"
          ingredientes={['5 colheres de sopa de camomila seca', '2 litros de água fervente', '1 banheira com água morna']}
          preparo="Faz o chá bem forte, coa e despeja na banheira. Fica de quinze a vinte minutos, com a água na altura do peito. Uma hora e meia antes de deitar."
          porque="É o ofurô de verdade, pra quem tem banheira. O tempo maior deixa o corpo aquecer por inteiro, e a queda de temperatura depois é a mais funda de todo o bloco."
          atencao="Vinte minutos é o máximo. Passar disso deixa tonta e desidrata. Beba um copo de água antes de entrar."
        />
        <Receita
          numero={50}
          nome="Banho de sal de epsom"
          ingredientes={['1 xícara de sal amargo, o sal de epsom', '1 banheira com água morna']}
          preparo="Dissolve o sal na água morna e fica quinze minutos. Enxágua com água limpa ao sair."
          porque="É o banho que eu indico pra quem tem o corpo dolorido junto com o sono ruim, que costumam vir juntos. Compra em farmácia, é barato, e uma xícara basta."
          atencao="Não use se tiver pressão muito alta, problema nos rins ou estiver grávida sem falar com o médico antes."
        />
        <Receita
          numero={51}
          nome="Banho de alecrim e lavanda"
          ingredientes={['2 ramos de alecrim', '2 colheres de sopa de lavanda seca', '2 litros de água fervente']}
          preparo="Cobre as ervas com água fervente, espera quinze minutos tampado, coa e despeja na banheira ou joga do pescoço pra baixo no fim do banho."
          porque="A lavanda é a erva mais estudada do mundo pra relaxamento por cheiro, e num banho ela fica no corpo e no quarto por horas. O alecrim entra pelo cheiro também, e porque as duas juntas ficam melhor do que cada uma sozinha."
        />
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={24} pageNumberColor={INDIGO} kicker="Bloco 5 · continuação">
        <Receita
          numero={52}
          nome="Banho morno de aveia"
          ingredientes={['1 xícara de aveia em flocos', '1 meia fina ou pano fino', '1 banheira com água morna']}
          preparo="Põe a aveia dentro da meia, dá um nó e joga na banheira. Aperta a trouxinha algumas vezes na água. Quinze minutos."
          porque="Pra quem tem a pele que coça à noite, e coceira é uma das coisas que mais acordam gente de madrugada sem que ela associe uma coisa à outra. A aveia acalma a pele sem deixar a banheira entupida."
        />
        <Receita
          numero={53}
          nome="Compressa morna na nuca"
          ingredientes={['1 pano de prato', '1 bacia com água morna', '1 colher de sopa de camomila, se quiser']}
          preparo="Molha o pano na água morna, torce e deixa na nuca por cinco minutos, sentada. Repete duas vezes."
          porque="Essa é pra quem não pode tomar banho de noite ou está cansada demais pra isso. A nuca e os ombros são onde a tensão do dia se junta, e cinco minutos de calor ali destravam mais do que parece."
        />
        <Receita
          numero={54}
          nome="Vapor de lavanda no travesseiro"
          ingredientes={['2 colheres de sopa de lavanda seca', '1 xícara de água fervente', '1 pires']}
          preparo="Cobre a lavanda com a água fervente e deixa o pires ao lado da cama, longe da beirada, enquanto você se arruma pra dormir. Retira antes de deitar."
          porque="Não é banho, mas está aqui porque funciona pela mesma via: o cheiro. Serve pras noites em que você já deitou e não quer levantar pra tomar banho."
          atencao="Retire o pires antes de deitar, e nunca deixe água quente na cabeceira durante o sono."
        />
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={25} pageNumberColor={INDIGO} kicker="Bloco 5 · fim">
        <Receita
          numero={55}
          nome="Escalda-pés de cidreira e sal"
          ingredientes={['3 colheres de sopa de erva-cidreira', '1 litro de água fervente', '2 colheres de sopa de sal grosso', '1 bacia']}
          preparo="Chá forte de cidreira, coa, junta o sal e despeja na bacia com água morna. Quinze minutos, uma hora antes de deitar."
          porque="É a mistura das duas melhores coisas deste bloco: o calor que dura do sal e o cheiro que acalma da cidreira. É a que eu faço nas noites em que já sei que vou demorar a pegar no sono."
        />
        <Receita
          numero={56}
          nome="O ritual completo da noite"
          ingredientes={['1 banho ou escalda-pés deste bloco', '1 chá do Bloco 1', 'luz baixa', '40 minutos']}
          preparo="Uma hora e meia antes de deitar, faz o banho ou o escalda-pés. Se enxuga, se agasalha e apaga a luz forte. Faz o chá e toma sentada. Vai pra cama sem passar pela tela."
          porque="É a receita 56 porque é a soma de tudo, e é a que dá mais resultado do manual inteiro. Nenhuma das duas coisas sozinha faz o que as duas juntas fazem, e a ordem importa: primeiro o calor, depois o chá, depois a cama."
        />

        <Callout type="tip" title="Se você tiver que escolher uma só">
          Escolha a 44, o escalda-pés simples. Não precisa de erva, não precisa de banheira, não
          precisa comprar nada. Uma bacia, água morna e quinze minutos sentada.
        </Callout>
      </PdfContentPage>

      {/* ─── BLOCO 6 ──────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={FAIXA} pageNumber={26} pageNumberColor={INDIGO}
        kicker="Bloco 6 · Receitas 57 a 62"
        title="Preparos de base pra guardar"
        subtitle="Estes são os que fazem o resto virar rotina. Você faz uma vez no domingo e usa a semana inteira. Sem isso, na terceira noite cansada você não faz nada e o manual vira mais um arquivo esquecido no celular."
      >
        <Receita
          numero={57}
          nome="Mistura da noite, pote de vidro"
          ingredientes={['4 colheres de sopa de camomila seca', '4 colheres de sopa de erva-cidreira seca', '2 colheres de sopa de erva-doce', '1 pote de vidro com tampa']}
          preparo="Mistura tudo seco e guarda no pote, longe do sol e do calor do fogão. Usa 1 colher de sopa para 250ml de água quente, dez minutos tampado."
          porque="Esta é a base do manual inteiro. Feita uma vez, resolve a maioria das noites do Bloco 1 e do Bloco 2 sem você precisar decidir nada. Dura três meses no pote fechado."
        />
        <Receita
          numero={58}
          nome="Mistura forte, pra noite difícil"
          ingredientes={['3 colheres de sopa de camomila', '3 colheres de sopa de flor de tília', '2 colheres de sopa de folha de maracujá', '1 pote separado, bem identificado']}
          preparo="Mistura e guarda num pote diferente do outro, com etiqueta. Usa 1 colher de sopa para 250ml, doze minutos tampado."
          porque="É a versão guardada da receita 14. Ter em pote separado e etiquetado evita o erro mais comum, que é fazer a forte achando que era a suave numa noite em que você está com sono e sem paciência."
          atencao="Tem maracujá. Soma efeito com remédio de dormir e calmante, não serve na gravidez, e não é pra toda noite. Máximo três vezes por semana."
        />
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={27} pageNumberColor={INDIGO} kicker="Bloco 6 · continuação">
        <Receita
          numero={59}
          nome="Sachês prontos da semana"
          ingredientes={['a mistura da receita 57', 'filtros de café de papel', 'linha de costura']}
          preparo="Põe 1 colher de sopa da mistura no filtro, dobra e amarra com a linha. Faz sete de uma vez, um pra cada noite, e guarda num pote."
          porque="Tira o último obstáculo, que é coar. Com o sachê pronto é água quente por cima e pronto. E é o que faz funcionar pra quem tem tremor nas mãos ou pouca paciência de madrugada."
        />
        <Receita
          numero={60}
          nome="Calda de mel com gengibre"
          ingredientes={['1 xícara de mel', '2 colheres de sopa de gengibre ralado', '1 pote pequeno']}
          preparo="Mistura o gengibre no mel, guarda no pote e deixa dois dias antes de usar. Uma colher de chá em qualquer chá deste manual. Dura dois meses na geladeira."
          porque="Serve pra adoçar e aquecer ao mesmo tempo, e economiza o passo de ralar gengibre toda vez. Uma colherada resolve as noites frias sem fazer receita nova."
        />
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={28} pageNumberColor={INDIGO} kicker="Bloco 6 · fim">
        <Receita
          numero={61}
          nome="Chá gelado da semana"
          ingredientes={['3 colheres de sopa de erva-cidreira', '1,5 litro de água', '1 garrafa de vidro']}
          preparo="Faz o chá, deixa esfriar tampado, coa e guarda na geladeira. Dura três dias. Serve pra beber ao longo do dia ou de madrugada."
          porque="É a base do Bloco 2 e do Bloco 4 pronta na geladeira. Quem trabalha em escala deveria ter essa garrafa sempre cheia."
        />
        <Receita
          numero={62}
          nome="O kit da cabeceira"
          ingredientes={['1 garrafa térmica pequena', '1 xícara', '1 sachê da receita 59', '1 banana']}
          preparo="Monta antes de deitar, todas as noites, e deixa na mesa de cabeceira. Leva dois minutos."
          porque="Esta é a última receita do manual e é a mais importante de todas, mesmo não sendo um chá. Tudo que a gente viu sobre a madrugada depende de uma coisa só: não ter que sair da cama e acender luz. O kit resolve isso. Se você guardar uma única página deste manual, guarde esta."
        />
      </PdfContentPage>

      {/* ─── BÔNUS 1 ──────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={FAIXA} pageNumber={29} pageNumberColor={INDIGO}
        kicker="Bônus 1"
        title="O que não misturar com o teu remédio de dormir"
        subtitle="Esta é a página mais importante do manual, e não é força de expressão. Se você toma alguma coisa pra dormir, pra ansiedade ou pra pressão, leia isto antes de fazer qualquer receita."
      >
        <Callout type="warning" title="A regra em uma frase">
          Erva calmante não anula remédio calmante. Ela soma. Os dois empilham o mesmo efeito, e o
          resultado pode ser sono demais, tontura, queda de pressão ou quedas de verdade, principalmente
          de madrugada quando você levanta pra ir ao banheiro.
        </Callout>

        <Titulo>As ervas deste manual que somam efeito</Titulo>
        <Paragrafo>
          Três das ervas daqui são as que mais somam com remédio, e eu marquei todas as receitas onde
          elas aparecem. São a <strong>folha de maracujá</strong>, a <strong>flor de tília</strong> e,
          em menor grau, a <strong>erva-cidreira</strong> em quantidade grande.
        </Paragrafo>
        <Paragrafo>
          As receitas onde elas aparecem em quantidade que importa são a 5, a 9, a 14, a 37, a 42 e a
          58. Todas estão marcadas com Atenção no próprio cartão.
        </Paragrafo>

        <Titulo>Se você toma remédio pra dormir ou calmante</Titulo>
        <Paragrafo>
          Não junte com as receitas acima por conta própria. Isso vale pra qualquer indutor de sono,
          ansiolítico, relaxante muscular ou antialérgico que dê sono, que é uma categoria em que
          muita gente nem pensa.
        </Paragrafo>
        <Paragrafo>
          O que você pode fazer com tranquilidade são as suaves: camomila, capim-santo, erva-doce,
          hortelã, o leite morno e todos os banhos e escalda-pés do Bloco 5. Nenhum deles tem esse
          problema.
        </Paragrafo>

        <Callout type="info" title="A conversa que vale ter com o médico">
          Leve o nome das ervas escrito num papel e pergunte apenas isto: posso tomar chá dessas com
          o que eu já tomo? É uma pergunta de trinta segundos e o médico responde na hora. Não peça
          pra trocar o remédio por chá, e não pare remédio nenhum por conta própria.
        </Callout>
      </PdfContentPage>

      <PdfContentPage accentGradient={FAIXA} pageNumber={30} pageNumberColor={INDIGO} kicker="Bônus 1 · continuação">
        <Titulo>Se você toma remédio pra pressão</Titulo>
        <Paragrafo>
          Ervas calmantes podem baixar a pressão um pouco, e somadas ao remédio isso pode dar tontura
          ao levantar. Se você usa remédio pra pressão, fique nas suaves e evite banho muito quente e
          demorado, que baixa a pressão também.
        </Paragrafo>

        <Titulo>Se você toma anticoagulante</Titulo>
        <Paragrafo>
          Cúrcuma e gengibre em quantidade grande mexem com a coagulação. As quantidades deste manual
          são pequenas e culinárias, mas a receita 31, do leite com cúrcuma, é a que eu deixaria de
          fora sem falar com o médico antes.
        </Paragrafo>

        <Titulo>Se você está grávida ou amamentando</Titulo>
        <Paragrafo>
          Não use folha de maracujá, tília, sal amargo em banho, nem erva-doce em quantidade grande.
          Camomila em chá fraco e escalda-pés morno costumam ser liberados, mas confirme com quem
          acompanha a gestação, porque cada caso é um caso.
        </Paragrafo>

        <Titulo>Se você tem alergia a planta</Titulo>
        <Paragrafo>
          Quem reage a camomila, arnica, girassol ou artemísia pode reagir a camomila em chá e em
          banho. Se for a primeira vez, faça o teste do braço: passe um pouco do chá frio na parte de
          dentro do antebraço e espere vinte minutos.
        </Paragrafo>

        <Callout type="warning" title="Pare e procure médico se">
          Der falta de ar, inchaço no rosto, nos lábios ou na garganta, coceira pelo corpo, batimento
          acelerado, ou tontura forte ao levantar. Qualquer um desses, pare tudo e procure
          atendimento no mesmo dia.
        </Callout>
      </PdfContentPage>

      {/* ─── BÔNUS 2 ──────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={FAIXA} pageNumber={31} pageNumberColor={INDIGO}
        kicker="Bônus 2"
        title="A tabela das três da manhã"
        subtitle="Uma folha só, pra consultar com sono e no escuro. Imprima e deixe na gaveta da cabeceira, ou salve como foto no celular com o brilho no mínimo."
      >
        <StyledTable
          color={INDIGO}
          headers={['O que está acontecendo', 'O que fazer', 'Receita']}
          rows={[
            ['Acordei e não volto a dormir', 'Meia xícara do chá da térmica, sentada, no escuro', '15'],
            ['Acordei com sede', 'Água morna com mel, devagar', '16'],
            ['Acordei com fome', 'Meia banana com mel, ou leite de 40 segundos', '19 ou 17'],
            ['Acordei com a barriga estufada', 'Erva-doce de dois minutos', '23'],
            ['Acordei com câimbra ou boca seca', 'Água com pitada de sal e mel', '21'],
            ['Acordei com calor', 'Meio copo da cidreira da geladeira', '22'],
            ['Acordei e a cabeça disparou', 'Levanta, luz baixa, outro cômodo, chá na mão', '15'],
            ['Já se passaram 20 minutos deitada', 'Sai da cama. Volta só quando o sono vier', '—'],
          ]}
        />

        <Spacer size="sm" />

        <Callout type="warning" title="O que não fazer às três da manhã">
          Não acenda a luz do teto. Não pegue o celular, nem pra ver a hora. Não olhe o relógio, que
          só aumenta a angústia. E não tome café nem nada com cafeína achando que já é quase manhã.
        </Callout>

        <Callout className="mt-3" type="tip" title="O preparo que faz esta tabela funcionar">
          Nada aqui funciona se você tiver que ir até a cozinha ferver água. Monte o kit da receita
          62 todas as noites, antes de deitar. Dois minutos de preparo economizam quarenta de sono
          perdido.
        </Callout>
      </PdfContentPage>

      {/* ─── BÔNUS 3 ──────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={FAIXA} pageNumber={32} pageNumberColor={INDIGO}
        kicker="Bônus 3"
        title="Lista de compras da feira"
        subtitle="Tudo do manual cabe nesta lista, e nada aqui precisa ser encomendado nem comprado em loja de suplemento. Leve impressa e marque o que já tem em casa."
      >
        <Titulo>Ervas secas, no mercado ou na feira</Titulo>
        <CheckList
          color={INDIGO}
          columns={2}
          items={[
            'Camomila — a mais usada, compre a maior',
            'Erva-cidreira ou melissa',
            'Erva-doce em semente',
            'Flor de tília',
            'Folha de maracujá seca',
            'Lavanda seca',
            'Alecrim, fresco ou seco',
            'Cravo-da-índia',
            'Canela em pau e em pó',
          ]}
        />

        <Titulo>Frescos, o que compra toda semana</Titulo>
        <CheckList
          color={INDIGO}
          columns={2}
          items={[
            'Capim-santo, ou uma muda pra plantar',
            'Hortelã fresca',
            'Banana, sempre madura',
            'Maçã',
            'Gengibre',
            'Alface de folha escura',
            'Laranja, pela casca',
            'Batata, cenoura e abobrinha',
          ]}
        />

        <Titulo>Despensa e farmácia</Titulo>
        <CheckList
          color={INDIGO}
          columns={2}
          items={[
            'Mel, o maior que couber no orçamento',
            'Aveia em flocos',
            'Leite, do que você já toma',
            'Cúrcuma em pó',
            'Sal grosso',
            'Sal amargo, o de epsom, na farmácia',
          ]}
        />

        <Titulo>Utensílios, compra uma vez só</Titulo>
        <CheckList
          color={INDIGO}
          columns={2}
          items={[
            'Garrafa térmica pequena, a mais importante',
            'Dois potes de vidro com tampa',
            'Bacia pro escalda-pés',
            'Filtros de café de papel',
            'Etiquetas ou fita crepe',
          ]}
        />

        <Callout type="tip" title="Se o dinheiro estiver curto este mês">
          Compre só camomila, erva-cidreira, mel e uma garrafa térmica. Com esses quatro você faz
          mais da metade do manual, incluindo tudo do Bloco 2. O resto vai entrando aos poucos.
        </Callout>
      </PdfContentPage>

      {/* ─── BÔNUS 4 ──────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={FAIXA} pageNumber={33} pageNumberColor={INDIGO}
        kicker="Bônus 4"
        title="Checklist do primeiro gole"
        subtitle="Seis perguntas antes de fazer qualquer receita pela primeira vez. Leva menos de um minuto e evita o único tipo de problema que este manual pode causar. Imprima e cole na porta do armário da cozinha."
      >
        <StepList
          color={INDIGO}
          steps={[
            { title: 'Você toma algum remédio que dá sono?', text: 'Indutor de sono, calmante, ansiolítico, relaxante muscular ou antialérgico. Se sim, fique nas suaves e leia o Bônus 1 antes.' },
            { title: 'Está grávida ou amamentando?', text: 'Várias ervas daqui não servem. Confirme com quem acompanha a gestação antes de qualquer uma.' },
            { title: 'Tem alergia a alguma planta?', text: 'Principalmente camomila, arnica, girassol ou artemísia. Na dúvida, faça o teste do braço com o chá frio e espere vinte minutos.' },
            { title: 'É a primeira vez com essa erva?', text: 'Comece com metade da xícara. Se cair bem, na próxima noite faz a xícara inteira.' },
            { title: 'A receita tem aviso de Atenção?', text: 'Leia antes de fazer, não depois de tomar. Os avisos estão no cartão da própria receita.' },
            { title: 'Você vai dirigir ou trabalhar nas próximas horas?', text: 'Então não é hora de receita calmante nenhuma. Veja a receita 39, que é a única feita pra isso.' },
          ]}
        />

        <Callout type="info" title="Uma sétima, que não é obrigatória">
          Anote no diário do Bônus 5 qual receita você fez. Daqui a duas semanas você vai querer
          saber qual foi a que funcionou, e ninguém lembra.
        </Callout>
      </PdfContentPage>

      {/* ─── BÔNUS 5 ──────────────────────────────────────────── */}
      <PdfContentPage
        accentGradient={FAIXA} pageNumber={34} pageNumberColor={INDIGO}
        kicker="Bônus 5"
        title="Diário das 14 noites"
        subtitle="Duas semanas é o tempo que a maioria destas receitas pede pra mostrar alguma coisa. Sem anotar, você não enxerga o que mudou, porque a memória de quem dorme mal é a pior testemunha que existe."
      >
        <Paragrafo>
          Preencha de manhã, não de noite. Leva vinte segundos e não precisa ser bonito. As três
          colunas do meio você marca com um número de 1 a 5, onde 1 é péssimo e 5 é ótimo.
        </Paragrafo>

        <TabelaDiario />

        <Spacer size="sm" />

        <Callout type="tip" title="O que olhar no fim das duas semanas">
          Compare as três primeiras noites com as três últimas. Não olhe noite por noite, porque
          noite ruim isolada acontece com todo mundo e não quer dizer nada. O que interessa é a média
          do começo contra a média do fim, e qual receita aparece mais nas noites boas.
        </Callout>
      </PdfContentPage>

      {/* ─── ENCERRAMENTO ─────────────────────────────────────── */}
      <PdfContentPage accentGradient={FAIXA} pageNumber={35} pageNumberColor={INDIGO} kicker="Pra terminar" title="Uma última coisa">
        <Paragrafo>
          Se você chegou até aqui, já sabe que este manual não promete nada. Não digo em quantos dias
          você vai dormir, e desconfie de quem disser.
        </Paragrafo>
        <Paragrafo>
          O que eu posso dizer é o que eu vi em quarenta anos fazendo isso. Quem começa pelos três
          pontos do começo do livro, a hora de acordar, a luz e o café, e só depois vai pras
          receitas, chega em algum lugar. Quem pula direto pro chá costuma achar que não funcionou.
        </Paragrafo>
        <Paragrafo>
          Comece pela receita 44, o escalda-pés, que não precisa comprar nada. Faça o kit da receita
          62 toda noite. E anote no diário. Só isso já é mais do que a maioria faz.
        </Paragrafo>

        <Divider variant="ornament" color={AREIA} />

        <Callout type="warning" title="E a coisa que eu repito porque importa">
          Se você ronca alto, acorda engasgada, ou dorme a noite inteira e mesmo assim acorda
          exausta todos os dias, procure um médico. Isso pode ser apneia do sono, e apneia não se
          resolve com chá nenhum. Nenhuma receita deste manual substitui consulta, diagnóstico ou
          tratamento. Se você faz uso de medicação, converse com quem te acompanha antes de mudar
          qualquer coisa.
        </Callout>

        <Spacer size="md" />

        <div className="mt-auto text-center">
          <div className="mx-auto mb-3 flex justify-center">
            <TigelaChá size={40} color={INDIGO} />
          </div>
          <p className="font-display text-[1.1rem] font-semibold" style={{ color: INDIGO }}>
            Boa noite de verdade.
          </p>
          <p className="mt-1 text-[12px] uppercase tracking-[0.2em]" style={{ color: TERRA }}>
            Avó Yuki
          </p>
        </div>
      </PdfContentPage>

    </>
  );
}
