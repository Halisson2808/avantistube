/**
 * PDF 17 — Rota: /pdf/ebook-dezessete
 * O Método da Pele Coreana Para Mulheres 50+
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';

const ACCENT = 'linear-gradient(to bottom, hsl(340 50% 36%), hsl(15 58% 46%), hsl(38 62% 52%))';

const C = {
  rose:       'hsl(340 58% 38%)',
  roseMd:     'hsl(340 52% 52%)',
  roseLight:  'hsl(340 48% 95%)',
  roseBorder: 'hsl(340 42% 80%)',
  gold:       'hsl(38 68% 40%)',
  goldLight:  'hsl(38 62% 95%)',
  goldBorder: 'hsl(38 55% 78%)',
  teal:       'hsl(172 48% 34%)',
  tealLight:  'hsl(172 40% 94%)',
  tealBorder: 'hsl(172 36% 74%)',
  dark:       'hsl(340 28% 14%)',
  muted:      'hsl(340 8% 44%)',
};

// ── Tipos ─────────────────────────────────────────────────────────────────

type CleansingRecipe = {
  number: number; name: string;
  ingredients: string[]; modoPreparo: string;
  tempo: string; resultadoEsperado: string; tipoPele: string;
};

type TonicRecipe = {
  number: number; name: string;
  ingredients: string[]; modoPreparo: string;
  tempoDescanso: string; formaAplicacao: string;
  validade: string; tipoPele: string;
};

type MaskRecipe = {
  number: number; name: string;
  ingredients: string[]; modoPreparo: string;
  tempoAplicacao: string; frequenciaSemanal: string; tipoPele: string;
};

type SerumRecipe = {
  number: number; name: string; purpose: string;
  ingredients: string[]; modoPreparo: string;
  formaAplicacao: string; validade: string; tipoPele: string;
};

type AntiAgeRitual = {
  number: number; name: string;
  duracao: string; frequencia: string; beneficio: string;
  passos: string[];
};

type FoodRecipe = {
  number: number; name: string;
  ingredients: string[]; modoPreparo: string;
  quando: string; beneficio: string;
};

type Routine = {
  tipoPele: string; emoji: string; problema: string;
  manha: string[]; noite: string[];
  semanal: string[]; receitasIndicadas: string;
};

// ── Dados ─────────────────────────────────────────────────────────────────

const cleansingRecipes: CleansingRecipe[] = [
  {
    number: 1, name: 'Limpeza Dupla com Óleo de Girassol',
    ingredients: ['1 colher de sopa de óleo de girassol puro', 'Água morna', 'Flanela ou lenço de algodão macio'],
    modoPreparo: 'Aplique o óleo no rosto seco com as pontas dos dedos. Massageie em movimentos circulares por 60 segundos, concentrando nas áreas com mais impureza. Umedeça a flanela com água morna e remova o óleo com pressão suave. Repita com sabonete facial leve.',
    tempo: '3–5 minutos',
    resultadoEsperado: 'Remove protetor solar, maquiagem e impurezas sem ressecar. Pele limpa, macia e sem sensação de tração.',
    tipoPele: 'Todos os tipos',
  },
  {
    number: 2, name: 'Limpeza com Mel Puro',
    ingredients: ['1 colher de chá de mel puro (preferencialmente orgânico)', 'Água morna para remover'],
    modoPreparo: 'Aplique o mel diretamente no rosto úmido. Faça movimentos circulares suaves por 30 a 60 segundos. Deixe agir por mais 1 minuto. Remova com água morna em movimentos delicados.',
    tempo: '2–3 minutos',
    resultadoEsperado: 'Pele limpa, hidratada e com brilho natural. O mel é antibacteriano e retém umidade — limpa sem agredir a barreira.',
    tipoPele: 'Pele seca, sensível e madura',
  },
  {
    number: 3, name: 'Água Micelar Caseira com Água de Rosa',
    ingredients: ['100ml de água de rosa pura (sem álcool)', '1 colher de sopa de glicerina vegetal', '1 colher de chá de óleo de girassol', 'Frasco com tampa'],
    modoPreparo: 'Misture todos os ingredientes no frasco e agite bem. Aplique em um algodão e passe suavemente pelo rosto, sem esfregar. Não é necessário enxaguar.',
    tempo: '1–2 minutos',
    resultadoEsperado: 'Remove impurezas leves e resíduos de maquiagem sem ressecar. Ideal como primeira etapa da limpeza dupla coreana.',
    tipoPele: 'Pele seca e sensível',
  },
  {
    number: 4, name: 'Limpeza com Leite de Coco Integral',
    ingredients: ['2 colheres de sopa de leite de coco integral', 'Algodão ou gaze macia'],
    modoPreparo: 'Aplique o leite de coco diretamente no algodão. Passe suavemente pelo rosto em movimentos ascendentes, do queixo até a testa. Enxague com água fria.',
    tempo: '1–2 minutos',
    resultadoEsperado: 'Remove impurezas e nutre simultaneamente com ácidos graxos essenciais. Pele acetinada e sem ressecamento após o uso.',
    tipoPele: 'Pele seca e muito seca',
  },
];

const tonicRecipes: TonicRecipe[] = [
  {
    number: 5, name: 'Tônico de Água de Arroz Simples',
    ingredients: ['½ xícara de arroz branco cru', '1 xícara de água filtrada'],
    modoPreparo: 'Lave o arroz em água corrente. Deixe de molho na água filtrada por 30 minutos. Coe a água e transfira para um frasco limpo com tampa.',
    tempoDescanso: '30 minutos', formaAplicacao: 'Aplique com algodão ou nas palmas das mãos, tampando suavemente no rosto após a limpeza. Não enxaguar.',
    validade: 'Até 7 dias na geladeira', tipoPele: 'Todos os tipos',
  },
  {
    number: 6, name: 'Tônico de Água de Arroz Fermentada',
    ingredients: ['½ xícara de arroz branco cru', '1 xícara de água filtrada'],
    modoPreparo: 'Siga o preparo do Tônico 5 mas, em vez de usar imediatamente, deixe a água em temperatura ambiente por 24 a 48 horas até fermentar levemente. Dilua com água na proporção 1:9 antes de usar.',
    tempoDescanso: '24–48 horas (fermentação natural)', formaAplicacao: 'Aplique com algodão após a limpeza. Use 1x por semana no início e aumente conforme tolerância.',
    validade: 'Até 10 dias na geladeira', tipoPele: 'Pele normal, oleosa e com manchas',
  },
  {
    number: 7, name: 'Tônico de Água de Pepino com Aloe Vera',
    ingredients: ['½ pepino grande (com casca)', '2 colheres de sopa de gel de babosa puro', '100ml de água filtrada'],
    modoPreparo: 'Bata o pepino com a água no liquidificador. Coe e misture com o gel de babosa. Agite bem antes de usar.',
    tempoDescanso: 'Imediato', formaAplicacao: 'Aplique com algodão ou borrifador diretamente no rosto após a limpeza. Não enxaguar.',
    validade: 'Até 5 dias na geladeira', tipoPele: 'Pele sensível, irritada e com vermelhidão',
  },
  {
    number: 8, name: 'Tônico de Chá Verde com Mel',
    ingredients: ['200ml de chá verde preparado e resfriado', '1 colher de chá de mel puro', '1 colher de chá de glicerina vegetal'],
    modoPreparo: 'Prepare o chá verde e deixe esfriar completamente. Misture o mel e a glicerina até dissolver. Transfira para um frasco com borrifador.',
    tempoDescanso: '15 minutos (resfriamento)', formaAplicacao: 'Borrife diretamente no rosto ou aplique com algodão. Use após a limpeza, antes do sérum.',
    validade: 'Até 7 dias na geladeira', tipoPele: 'Pele oleosa e com sinais de envelhecimento',
  },
  {
    number: 9, name: 'Tônico de Água de Rosa com Glicerina',
    ingredients: ['150ml de água de rosa pura (sem álcool)', '1 colher de chá de glicerina vegetal'],
    modoPreparo: 'Misture os ingredientes no frasco. Agite bem antes de cada uso.',
    tempoDescanso: 'Imediato', formaAplicacao: 'Aplique com algodão ou borrifador após a limpeza. Não enxaguar. Ideal para o 7 Skin Method (Ritual 25).',
    validade: 'Até 30 dias em local fresco e escuro', tipoPele: 'Pele seca, sensível e madura',
  },
  {
    number: 10, name: 'Tônico Calmante de Camomila para Pele Sensível',
    ingredients: ['200ml de chá de camomila forte (3 saquinhos)', '1 colher de chá de mel', '½ colher de chá de gel de aloe vera'],
    modoPreparo: 'Prepare o chá com 3 saquinhos para 200ml de água quente. Infuse por 10 minutos. Coe, resfrie completamente e misture mel e aloe vera.',
    tempoDescanso: '10 minutos + resfriamento', formaAplicacao: 'Aplique com algodão em movimentos suaves e ascendentes. Use diariamente à noite após a limpeza.',
    validade: 'Até 7 dias na geladeira', tipoPele: 'Pele muito sensível, reativa e rosácea',
  },
];

const maskRecipes: MaskRecipe[] = [
  {
    number: 11, name: 'Máscara de Arroz e Mel para Luminosidade',
    ingredients: ['2 colheres de sopa de farinha de arroz', '1 colher de sopa de mel puro', 'Água filtrada (o suficiente para pasta)'],
    modoPreparo: 'Misture a farinha de arroz e o mel. Adicione água aos poucos até obter uma pasta cremosa. Aplique em camada uniforme no rosto limpo, evitando os olhos.',
    tempoAplicacao: '15–20 minutos', frequenciaSemanal: '2x por semana', tipoPele: 'Todos os tipos — especialmente pele sem luminosidade',
  },
  {
    number: 12, name: 'Máscara de Babosa e Óleo de Coco para Hidratação Profunda',
    ingredients: ['2 colheres de sopa de gel de babosa puro', '1 colher de chá de óleo de coco virgem'],
    modoPreparo: 'Misture o gel de babosa com o óleo de coco até homogeneizar. Aplique uma camada generosa no rosto limpo, evitando os olhos. Remova com água morna.',
    tempoAplicacao: '20 minutos', frequenciaSemanal: '2–3x por semana', tipoPele: 'Pele seca, muito seca e desidratada',
  },
  {
    number: 13, name: 'Máscara de Aveia e Iogurte para Pele Sensível',
    ingredients: ['2 colheres de sopa de aveia fina (não instantânea)', '1 colher de sopa de iogurte natural integral', '1 colher de chá de mel'],
    modoPreparo: 'Amasse a aveia com o iogurte até formar uma pasta. Adicione o mel e misture. Aplique em camada uniforme e remova com água fria.',
    tempoAplicacao: '15 minutos', frequenciaSemanal: '1–2x por semana', tipoPele: 'Pele sensível e reativa',
  },
  {
    number: 14, name: 'Máscara de Banana e Mel para Firmeza',
    ingredients: ['½ banana madura amassada', '1 colher de sopa de mel puro', '1 colher de chá de óleo de oliva extravirgem'],
    modoPreparo: 'Amasse a banana com um garfo até pasta fina. Adicione mel e óleo de oliva. Misture bem. Aplique imediatamente e remova com água morna.',
    tempoAplicacao: '15–20 minutos', frequenciaSemanal: '2x por semana', tipoPele: 'Pele madura com perda de firmeza',
  },
  {
    number: 15, name: 'Máscara de Clara de Ovo para Poros Dilatados',
    ingredients: ['1 clara de ovo em temperatura ambiente', '1 colher de chá de água de rosa (sem álcool)', '½ colher de chá de argila branca (opcional — para pele muito oleosa)'],
    modoPreparo: 'Bata a clara levemente com garfo (não em neve). Misture a água de rosa até homogeneizar. Aplique em 2 camadas finas, deixando secar entre elas. Remova com água morna.',
    tempoAplicacao: '15 minutos (até secar)', frequenciaSemanal: '1x por semana', tipoPele: 'Pele oleosa e com poros dilatados',
  },
  {
    number: 16, name: 'Máscara de Batata Crua para Manchas',
    ingredients: ['½ batata inglesa crua, ralada finamente', '1 colher de chá de mel'],
    modoPreparo: 'Rale a batata e esprema levemente para remover excesso de líquido. Misture com o mel. Aplique concentrando nas áreas com manchas.',
    tempoAplicacao: '20 minutos', frequenciaSemanal: '3x por semana para manchas ativas', tipoPele: 'Pele com manchas de sol e hiperpigmentação',
  },
  {
    number: 17, name: 'Máscara de Cúrcuma e Leite para Uniformizar o Tom',
    ingredients: ['½ colher de chá de cúrcuma em pó', '1 colher de sopa de leite integral', '1 colher de chá de mel'],
    modoPreparo: 'Misture todos os ingredientes até pasta uniforme. Aplique camada fina. Atenção: a cúrcuma mancha tecidos — use roupas velhas. Remova com água morna.',
    tempoAplicacao: '10–15 minutos', frequenciaSemanal: '2x por semana', tipoPele: 'Pele com tom irregular e manchas',
  },
  {
    number: 18, name: 'Máscara de Pepino e Argila para Oleosidade',
    ingredients: ['2 colheres de sopa de pepino ralado (coe o excesso)', '1 colher de sopa de argila branca ou verde', '1 colher de chá de água de rosa'],
    modoPreparo: 'Misture a argila com a água de rosa até pasta. Adicione o pepino coado e misture. Aplique com pincel. Remova antes de secar completamente.',
    tempoAplicacao: '10 minutos', frequenciaSemanal: '1–2x por semana', tipoPele: 'Pele oleosa e mista após os 50',
  },
];

const serumRecipes: SerumRecipe[] = [
  {
    number: 19, name: 'Sérum de Óleo de Rosa Mosqueta para Manchas',
    purpose: 'Clareia manchas e estimula renovação celular',
    ingredients: ['1 colher de sopa de óleo de rosa mosqueta', '3 gotas de vitamina E (óleo de cápsula)'],
    modoPreparo: 'Misture os óleos em um frasco conta-gotas escuro. Agite suavemente antes de cada uso.',
    formaAplicacao: '3–5 gotas aplicadas em movimentos suaves de baixo para cima. Use à noite, após o tônico, antes do hidratante.',
    validade: 'Até 6 meses em local fresco e escuro', tipoPele: 'Pele com manchas e madura',
  },
  {
    number: 20, name: 'Sérum de Óleo de Jojoba para Hidratação',
    purpose: 'Hidrata em profundidade sem obstruir poros',
    ingredients: ['1 colher de sopa de óleo de jojoba', '2 gotas de óleo essencial de lavanda (opcional)'],
    modoPreparo: 'Misture os ingredientes. O óleo de jojoba é quimicamente semelhante ao sebo natural e não precisa de processamento adicional.',
    formaAplicacao: '2–3 gotas aquecidas entre as palmas. Aplique com pressão suave (não esfregar). Use manhã e noite.',
    validade: 'Até 12 meses', tipoPele: 'Todos os tipos — especialmente seca e desidratada',
  },
  {
    number: 21, name: 'Óleo de Tratamento Noturno com Vitamina E',
    purpose: 'Repara e regenera a pele durante o sono',
    ingredients: ['1 colher de sopa de óleo de amêndoas doce', '1 colher de chá de óleo de gergelim', '5 cápsulas de vitamina E (perfure e esprema o óleo)'],
    modoPreparo: 'Misture todos os óleos em um frasco escuro. Agite antes de usar.',
    formaAplicacao: '4–5 gotas aplicadas no rosto e pescoço antes de dormir. Última etapa da rotina noturna.',
    validade: 'Até 4 meses em local fresco', tipoPele: 'Pele seca, madura e com sinais de envelhecimento',
  },
  {
    number: 22, name: 'Sérum de Babosa com Vitamina C Natural',
    purpose: 'Ilumina e uniformiza o tom da pele',
    ingredients: ['2 colheres de sopa de gel de babosa puro', '1 colher de chá de suco de acerola ou camu-camu em pó', '1 colher de chá de glicerina vegetal'],
    modoPreparo: 'Misture até homogeneizar. Guarde em frasco escuro na geladeira. Prepare em pequenas quantidades — a vitamina C é instável.',
    formaAplicacao: 'Aplique com conta-gotas após o tônico. Use à noite. Protetor solar obrigatório no dia seguinte.',
    validade: 'Até 7 dias (prepare semanalmente)', tipoPele: 'Pele com manchas e sem luminosidade',
  },
  {
    number: 23, name: 'Óleo Facial de Girassol com Camomila',
    purpose: 'Acalma e nutre pele sensível e reativa',
    ingredients: ['2 colheres de sopa de óleo de girassol', '1 saquinho de chá de camomila'],
    modoPreparo: 'Aqueça o óleo de girassol em banho-maria (fogo baixo). Adicione o saquinho de camomila e deixe em infusão por 20 minutos. Coe e transfira para frasco escuro.',
    formaAplicacao: '3–4 gotas aplicadas após o tônico, com leve massagem circular. Use à noite.',
    validade: 'Até 3 meses em local fresco', tipoPele: 'Pele sensível, seca e reativa',
  },
];

const antiAgeRituals: AntiAgeRitual[] = [
  {
    number: 24, name: 'A Massagem Facial Coreana de 5 Minutos',
    duracao: '5 minutos', frequencia: 'Diária — preferencialmente à noite',
    beneficio: 'Ativa a circulação, drena o líquido linfático e estimula a produção natural de colágeno',
    passos: [
      'Aplique 2–3 gotas de óleo facial nas palmas aquecidas',
      'Com as pontas dos dedos, pressione da mandíbula em direção às têmporas (7x)',
      'Deslize os dedos médios do canto interno ao externo dos olhos, sob a órbita (5x)',
      'Pressione as bochechas do nariz em direção às orelhas (7x)',
      'Com os nós dos dedos, movimentos suaves e ascendentes na testa (5x)',
      'Finalize pressionando todo o rosto com as palmas por 10 segundos',
    ],
  },
  {
    number: 25, name: 'O 7 Skin Method — Hidratação em Camadas',
    duracao: '5–10 minutos', frequencia: 'Diária ou sempre que a pele estiver muito seca',
    beneficio: 'Penetração profunda de umidade — mais eficaz do que qualquer creme isolado',
    passos: [
      'Após a limpeza, aplique uma camada fina do tônico com as palmas',
      'Tampe suavemente no rosto e aguarde 30 segundos para absorver',
      'Repita a aplicação por 5 a 7 camadas, esperando absorver entre cada uma',
      'Na última camada, faça o tapping (Ritual 28) para selar a umidade',
      'Aplique o sérum e o hidratante habitual por cima',
    ],
  },
  {
    number: 26, name: 'A Compressa Fria Coreana para Firmar a Pele',
    duracao: '2 minutos', frequencia: '3–5x por semana — ideal pela manhã',
    beneficio: 'Fecha os poros, desincha o rosto, firma e ilumina instantaneamente',
    passos: [
      'Prepare um recipiente com água gelada e alguns cubos de gelo',
      'Adicione 2 colheres de sopa de chá verde frio (opcional — potencializa o efeito)',
      'Apoie o rosto na água por 10 segundos sem forçar',
      'Repita 3 vezes',
      'Seque suavemente e aplique o tônico imediatamente',
    ],
  },
  {
    number: 27, name: 'O Ritual de Gua Sha com Colher Gelada',
    duracao: '3–5 minutos', frequencia: '3x por semana',
    beneficio: 'Drena a linfa, define o contorno facial e reduz papada sem custo algum',
    passos: [
      'Deixe uma colher de metal na geladeira por 10 minutos',
      'Aplique óleo facial no rosto para deslizamento suave',
      'Com o lado côncavo da colher, deslize do pescoço ao queixo (5x cada lado)',
      'Deslize da mandíbula em direção à orelha (5x cada lado)',
      'Passe suavemente sob os olhos, do canto interno ao externo (3x)',
      'Conclua deslizando da sobrancelha em direção à têmpora (5x)',
    ],
  },
  {
    number: 28, name: 'O Tapping Coreano — Aplicação Sem Puxar a Pele',
    duracao: '1–2 minutos', frequencia: 'Sempre que aplicar qualquer produto no rosto',
    beneficio: 'Maximiza a absorção dos produtos sem esticar nem comprometer o colágeno',
    passos: [
      'Nunca esfregue, nunca puxe — apenas pressione com as palmas',
      'Aplique o produto nas costas das mãos primeiro para aquecê-lo',
      'Leve as palmas ao rosto e pressione delicadamente (não deslize)',
      'Use as pontas dos dedos para batidas ritmadas suaves ao redor dos olhos',
      'Finalize pressionando com suavidade todo o rosto por 10 a 15 segundos',
    ],
  },
];

const foodRecipes: FoodRecipe[] = [
  {
    number: 29, name: 'Chá de Colágeno Natural com Caldo de Ossos',
    ingredients: ['500g de ossos de frango (pescoço ou pé)', '2 litros de água', '1 colher de sopa de vinagre de maçã', 'Sal, alho e cúrcuma a gosto'],
    modoPreparo: 'Coloque os ossos na panela com água e vinagre. Leve à fervura e reduza o fogo. Cozinhe por 4–6 horas (ou 1h30 na panela de pressão). Coe e tempere.',
    quando: '1 xícara por dia, preferencialmente no almoço',
    beneficio: 'Fornece colágeno tipo I e II de forma biodisponível — o suplemento que as avós coreanas consomem há séculos sem saber o nome científico.',
  },
  {
    number: 30, name: 'Smoothie Coreano de Pele com Pepino e Chá Verde',
    ingredients: ['1 pepino médio', '200ml de chá verde gelado (sem açúcar)', '1 colher de sopa de mel', '½ limão (suco)', 'Folhas de hortelã (opcional)'],
    modoPreparo: 'Bata todos os ingredientes no liquidificador até homogeneizar. Sirva imediatamente sem coar.',
    quando: 'Em jejum ou no café da manhã',
    beneficio: 'Combina silício (pepino), catequinas (chá verde) e vitamina C (limão) — trio que protege e regenera o colágeno de dentro para fora.',
  },
  {
    number: 31, name: 'Água Detox de Arroz Integral para Tomar em Jejum',
    ingredients: ['2 colheres de sopa de arroz integral cru', '1 litro de água filtrada', '1 fatia de gengibre', 'Suco de ½ limão'],
    modoPreparo: 'Deixe o arroz integral de molho na água por 8 horas. Coe a água, adicione gengibre e limão. Sirva em temperatura ambiente.',
    quando: 'Em jejum, 30 minutos antes do café da manhã',
    beneficio: 'Rico em vitaminas do complexo B e silício. As coreanas usam como ritual de purificação matinal — fortalece a estrutura da pele de dentro para fora.',
  },
];

const routines: Routine[] = [
  {
    tipoPele: 'Pele Seca após os 50', emoji: '🌿',
    problema: 'Ressecamento, descamação e linhas finas acentuadas pela falta de hidratação',
    manha: ['Limpeza: Receita 4 (Leite de Coco)', 'Tônico: Receita 9 (Água de Rosa + Glicerina)', '7 Skin Method com o tônico (Ritual 25)', 'Sérum: Receita 20 (Óleo de Jojoba)', 'Protetor solar (obrigatório)'],
    noite: ['Limpeza Dupla: Receita 1 (Óleo de Girassol)', 'Tônico: Receita 5 (Água de Arroz)', 'Massagem Facial 5min (Ritual 24)', 'Óleo Noturno: Receita 21 (Vitamina E)'],
    semanal: ['Seg + Qui: Máscara 12 (Babosa + Coco)', 'Sáb: Máscara 14 (Banana + Mel)', 'Gua Sha 3x por semana (Ritual 27)'],
    receitasIndicadas: 'R1, R4, R5, R9, R12, R14, R20, R21',
  },
  {
    tipoPele: 'Pele Oleosa após os 50', emoji: '💧',
    problema: 'Brilho excessivo e poros dilatados, mas ainda com necessidade de hidratação',
    manha: ['Limpeza Dupla: Receita 1 (Óleo de Girassol)', 'Compressa Fria (Ritual 26)', 'Tônico: Receita 8 (Chá Verde + Mel)', 'Sérum: Receita 22 (Babosa + Vitamina C)', 'Protetor solar oil-free'],
    noite: ['Limpeza: Receita 3 (Água Micelar Caseira)', 'Tônico: Receita 6 (Arroz Fermentada — 1x/sem)', 'Tapping (Ritual 28)', 'Sérum: Receita 19 (Rosa Mosqueta)'],
    semanal: ['Seg: Máscara 15 (Clara de Ovo)', 'Qui: Máscara 18 (Pepino + Argila)', 'Compressa Fria todas as manhãs'],
    receitasIndicadas: 'R1, R3, R6, R8, R15, R18, R19, R22',
  },
  {
    tipoPele: 'Pele Mista após os 50', emoji: '⚖️',
    problema: 'Zona T oleosa com bochechas secas — exige abordagem diferenciada por área',
    manha: ['Limpeza: Receita 2 (Mel Puro)', 'Tônico: Receita 7 (Pepino + Aloe) em todo o rosto', 'Sérum: Receita 20 (Jojoba) nas bochechas; Receita 22 (Vit C) na zona T', 'Protetor solar'],
    noite: ['Limpeza: Receita 1 (Óleo de Girassol)', 'Tônico: Receita 9 (Água de Rosa)', 'Óleo: Receita 23 (Girassol + Camomila) apenas nas bochechas', 'Massagem Facial (Ritual 24)'],
    semanal: ['Seg: Máscara 13 (Aveia + Iogurte) em todo o rosto', 'Qui: Máscara 18 (Argila) apenas na zona T', 'Sáb: Máscara 11 (Arroz + Mel) em todo o rosto'],
    receitasIndicadas: 'R1, R2, R7, R9, R11, R13, R18, R20, R22, R23',
  },
  {
    tipoPele: 'Pele Sensível após os 50', emoji: '🌸',
    problema: 'Vermelhidão, irritação e reatividade a ingredientes novos ou ácidos',
    manha: ['Limpeza: Receita 2 (Mel Puro)', 'Tônico: Receita 10 (Camomila)', 'Sérum: Receita 20 (Jojoba)', 'Protetor solar mineral (zinco)'],
    noite: ['Limpeza: Receita 4 (Leite de Coco)', 'Tônico: Receita 7 (Pepino + Aloe)', 'Óleo: Receita 23 (Girassol + Camomila)', 'Tapping (Ritual 28)'],
    semanal: ['Seg: Máscara 13 (Aveia + Iogurte)', 'Qui: Máscara 12 (Babosa + Coco)', 'Evite ácidos, argila forte e clara de ovo'],
    receitasIndicadas: 'R2, R4, R7, R10, R12, R13, R20, R23',
  },
  {
    tipoPele: 'Pele com Manchas após os 50', emoji: '✨',
    problema: 'Manchas de sol, melasma e hiperpigmentação hormonal',
    manha: ['Limpeza Dupla: Receita 1 (Óleo de Girassol)', 'Tônico: Receita 6 (Arroz Fermentada)', 'Sérum: Receita 22 (Babosa + Vit C)', 'Protetor solar FPS 50+ — obrigatório e inegociável'],
    noite: ['Limpeza: Receita 3 (Água Micelar)', 'Tônico: Receita 5 (Água de Arroz)', 'Sérum: Receita 19 (Rosa Mosqueta)', 'Compressa de batata crua nas manchas por 10min (opcional)'],
    semanal: ['3x/sem: Máscara 16 (Batata Crua)', '2x/sem: Máscara 17 (Cúrcuma + Leite)', '1x/sem: Tônico de Arroz Fermentada aplicado como sérum concentrado'],
    receitasIndicadas: 'R3, R5, R6, R16, R17, R19, R22',
  },
  {
    tipoPele: 'Pele Flácida após os 50', emoji: '💪',
    problema: 'Perda de firmeza, contorno indefinido e papada em formação',
    manha: ['Compressa Fria (Ritual 26) — obrigatório todo dia', 'Limpeza: Receita 1 (Limpeza Dupla)', 'Tônico: Receita 5 (Água de Arroz)', 'Massagem com Colher Gelada (Ritual 27)', 'Sérum: Receita 19 (Rosa Mosqueta)'],
    noite: ['Massagem Facial 5min (Ritual 24)', 'Tônico: Receita 6 (Arroz Fermentada)', 'Óleo Noturno: Receita 21 (Vitamina E)'],
    semanal: ['3x/sem: Gua Sha (Ritual 27)', '2x/sem: Máscara 14 (Banana + Mel)', 'Receitas 29 e 30 de alimentação diariamente'],
    receitasIndicadas: 'R1, R5, R6, R14, R19, R21, R24, R26, R27, R29',
  },
  {
    tipoPele: 'Pele Desidratada após os 50', emoji: '🌊',
    problema: 'Pele que absorve produto mas continua com aparência seca — falta água, não óleo',
    manha: ['Limpeza: Receita 2 (Mel Puro)', '7 Skin Method (Ritual 25) com Receita 9 (Água de Rosa)', 'Sérum: Receita 20 (Jojoba)', 'Protetor solar'],
    noite: ['Limpeza: Receita 4 (Leite de Coco)', '7 Skin Method (Ritual 25) com Receita 10 (Camomila)', 'Óleo: Receita 21 (Vitamina E)'],
    semanal: ['3x/sem: Máscara 12 (Babosa + Coco)', '1x/sem: Máscara 11 (Arroz + Mel)', 'Beba 2L de água por dia — comece com Receita 31 (Água Detox)'],
    receitasIndicadas: 'R2, R4, R9, R10, R11, R12, R20, R21, R25, R31',
  },
  {
    tipoPele: 'Pele Madura com Múltiplos Problemas', emoji: '👑',
    problema: 'Combinação de manchas + flacidez + ressecamento + poros dilatados',
    manha: ['Compressa Fria (Ritual 26)', 'Limpeza Dupla: Receita 1 (Óleo de Girassol)', 'Tônico: Receita 6 (Arroz Fermentada — 3x/sem)', 'Sérum: Receita 22 (Babosa + Vit C)', 'Protetor solar FPS 50+'],
    noite: ['Massagem Facial 5min (Ritual 24)', 'Tônico: Receita 5 (Arroz Simples)', 'Sérum: Receita 19 (Rosa Mosqueta)', 'Óleo: Receita 21 (Vitamina E)'],
    semanal: ['Seg: Máscara 17 (Cúrcuma)', 'Qua: Máscara 14 (Banana)', 'Sex: Máscara 15 (Clara de Ovo)', 'Gua Sha 3x/sem (Ritual 27)'],
    receitasIndicadas: 'R1, R5, R6, R14, R15, R17, R19, R21, R22, R24, R26, R27',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}

function Tag({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
      style={{ background: color ?? C.roseLight, color: C.rose, border: `1px solid ${C.roseBorder}` }}
    >
      {children}
    </span>
  );
}

function Label({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <div className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.15em]" style={{ color: color ?? C.rose }}>
      {children}
    </div>
  );
}

function InfoBox({ children, variant = 'rose' }: { children: ReactNode; variant?: 'rose' | 'gold' | 'teal' }) {
  const map = {
    rose: { bg: C.roseLight, border: C.roseBorder, color: C.rose },
    gold: { bg: C.goldLight, border: C.goldBorder, color: C.gold },
    teal: { bg: C.tealLight, border: C.tealBorder, color: C.teal },
  };
  const s = map[variant];
  return (
    <div className="rounded-xl px-4 py-3" style={{ background: s.bg, borderLeft: `3px solid ${s.border}` }}>
      <div className="text-[13px] leading-snug" style={{ color: s.color }}>{children}</div>
    </div>
  );
}

function BulletList({ items, color }: { items: string[]; color?: string }) {
  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2.5 text-[13px] leading-snug text-foreground/85">
          <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full" style={{ background: color ?? C.rose }} aria-hidden />
          {item}
        </div>
      ))}
    </div>
  );
}

function StepList({ steps, color }: { steps: string[]; color?: string }) {
  return (
    <div className="space-y-1.5">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-2.5 text-[13px] leading-snug text-foreground/85">
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ background: color ?? C.rose }}
          >
            {i + 1}
          </span>
          {step}
        </div>
      ))}
    </div>
  );
}

function ModuleBadge({ number, title, color }: { number: number; title: string; color?: string }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-black text-white"
        style={{ background: color ?? C.rose }}
      >
        {number}
      </div>
      <div className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: color ?? C.rose }}>
        {title}
      </div>
    </div>
  );
}

function RecipeNumber({ n, color }: { n: number; color?: string }) {
  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
      style={{ background: color ?? C.rose }}
    >
      {n}
    </span>
  );
}

// ── Cards de Receita ──────────────────────────────────────────────────────

function CleansingCard({ recipe }: { recipe: CleansingRecipe }) {
  return (
    <div className="avoid-page-break flex-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2.5 border-b border-gray-100 pb-3">
        <RecipeNumber n={recipe.number} />
        <h4 className="font-display text-[1.05rem] font-semibold leading-tight" style={{ color: C.dark }}>
          {recipe.name}
        </h4>
      </div>
      <div className="flex flex-col gap-3">
        <div className="rounded-xl px-3.5 py-3" style={{ background: C.roseLight }}>
          <Label>Ingredientes</Label>
          <BulletList items={recipe.ingredients} />
        </div>
        <div>
          <Label>Modo de Preparo</Label>
          <p className="text-[13px] leading-snug text-foreground/85">{recipe.modoPreparo}</p>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 rounded-xl px-3 py-2.5" style={{ background: C.goldLight }}>
            <Label color={C.gold}>Tempo</Label>
            <p className="text-[13px] font-semibold" style={{ color: C.gold }}>{recipe.tempo}</p>
          </div>
          <div className="flex-1 rounded-xl px-3 py-2.5" style={{ background: C.tealLight }}>
            <Label color={C.teal}>Tipo de Pele</Label>
            <p className="text-[12px] leading-snug" style={{ color: C.teal }}>{recipe.tipoPele}</p>
          </div>
        </div>
        <InfoBox variant="rose">
          <strong>Resultado esperado:</strong> {recipe.resultadoEsperado}
        </InfoBox>
      </div>
    </div>
  );
}

function TonicCard({ recipe }: { recipe: TonicRecipe }) {
  return (
    <div className="avoid-page-break flex-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2.5 border-b border-gray-100 pb-3">
        <RecipeNumber n={recipe.number} color={C.teal} />
        <h4 className="font-display text-[1.05rem] font-semibold leading-tight" style={{ color: C.dark }}>
          {recipe.name}
        </h4>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="rounded-xl px-3.5 py-2.5" style={{ background: C.tealLight }}>
          <Label color={C.teal}>Ingredientes</Label>
          <BulletList items={recipe.ingredients} color={C.teal} />
        </div>
        <div>
          <Label color={C.teal}>Modo de Preparo</Label>
          <p className="text-[13px] leading-snug text-foreground/85">{recipe.modoPreparo}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg px-3 py-2" style={{ background: C.roseLight }}>
            <Label>Descanso</Label>
            <p className="text-[12px] font-semibold" style={{ color: C.rose }}>{recipe.tempoDescanso}</p>
          </div>
          <div className="rounded-lg px-3 py-2" style={{ background: C.goldLight }}>
            <Label color={C.gold}>Validade</Label>
            <p className="text-[12px] font-semibold" style={{ color: C.gold }}>{recipe.validade}</p>
          </div>
        </div>
        <div>
          <Label color={C.teal}>Como Aplicar</Label>
          <p className="text-[13px] leading-snug text-foreground/85">{recipe.formaAplicacao}</p>
        </div>
        <Tag color={C.tealLight}>{recipe.tipoPele}</Tag>
      </div>
    </div>
  );
}

function MaskCard({ recipe }: { recipe: MaskRecipe }) {
  return (
    <div className="avoid-page-break flex-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2.5 border-b border-gray-100 pb-3">
        <RecipeNumber n={recipe.number} color={C.gold} />
        <h4 className="font-display text-[1.05rem] font-semibold leading-tight" style={{ color: C.dark }}>
          {recipe.name}
        </h4>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="rounded-xl px-3.5 py-2.5" style={{ background: C.goldLight }}>
          <Label color={C.gold}>Ingredientes</Label>
          <BulletList items={recipe.ingredients} color={C.gold} />
        </div>
        <div>
          <Label color={C.gold}>Modo de Preparo</Label>
          <p className="text-[13px] leading-snug text-foreground/85">{recipe.modoPreparo}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg px-3 py-2" style={{ background: C.roseLight }}>
            <Label>Tempo</Label>
            <p className="text-[12px] font-semibold" style={{ color: C.rose }}>{recipe.tempoAplicacao}</p>
          </div>
          <div className="rounded-lg px-3 py-2" style={{ background: C.tealLight }}>
            <Label color={C.teal}>Frequência</Label>
            <p className="text-[12px] font-semibold" style={{ color: C.teal }}>{recipe.frequenciaSemanal}</p>
          </div>
        </div>
        <Tag color={C.goldLight}>{recipe.tipoPele}</Tag>
      </div>
    </div>
  );
}

function SerumCard({ recipe }: { recipe: SerumRecipe }) {
  return (
    <div className="avoid-page-break rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3 border-b border-gray-100 pb-4">
        <RecipeNumber n={recipe.number} color={C.roseMd} />
        <div>
          <h4 className="font-display text-[1.1rem] font-semibold leading-tight" style={{ color: C.dark }}>
            {recipe.name}
          </h4>
          <p className="mt-0.5 text-[12px] italic" style={{ color: C.roseMd }}>{recipe.purpose}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <div className="rounded-xl px-3.5 py-3" style={{ background: C.roseLight }}>
            <Label>Ingredientes</Label>
            <BulletList items={recipe.ingredients} />
          </div>
          <div>
            <Label>Modo de Preparo</Label>
            <p className="text-[13px] leading-snug text-foreground/85">{recipe.modoPreparo}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <Label>Como Aplicar</Label>
            <p className="text-[13px] leading-snug text-foreground/85">{recipe.formaAplicacao}</p>
          </div>
          <div className="rounded-xl px-3.5 py-3" style={{ background: C.goldLight }}>
            <Label color={C.gold}>Validade</Label>
            <p className="text-[13px] font-semibold" style={{ color: C.gold }}>{recipe.validade}</p>
          </div>
          <div className="rounded-xl px-3.5 py-2.5" style={{ background: C.tealLight }}>
            <Label color={C.teal}>Indicado Para</Label>
            <p className="text-[12px]" style={{ color: C.teal }}>{recipe.tipoPele}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RitualCard({ ritual }: { ritual: AntiAgeRitual }) {
  return (
    <div className="avoid-page-break rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2.5 border-b border-gray-100 pb-3">
        <RecipeNumber n={ritual.number} color={C.roseMd} />
        <h4 className="font-display text-[1.05rem] font-semibold leading-tight" style={{ color: C.dark }}>
          {ritual.name}
        </h4>
      </div>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg px-3 py-2" style={{ background: C.roseLight }}>
            <Label>Duração</Label>
            <p className="text-[12px] font-semibold" style={{ color: C.rose }}>{ritual.duracao}</p>
          </div>
          <div className="rounded-lg px-3 py-2" style={{ background: C.goldLight }}>
            <Label color={C.gold}>Frequência</Label>
            <p className="text-[12px] font-semibold" style={{ color: C.gold }}>{ritual.frequencia}</p>
          </div>
        </div>
        <InfoBox variant="rose">
          <strong>Benefício:</strong> {ritual.beneficio}
        </InfoBox>
        <div>
          <Label>Passo a Passo</Label>
          <StepList steps={ritual.passos} />
        </div>
      </div>
    </div>
  );
}

function FoodRecipeCard({ recipe }: { recipe: FoodRecipe }) {
  return (
    <div className="avoid-page-break rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2.5 border-b border-gray-100 pb-3">
        <RecipeNumber n={recipe.number} color={C.teal} />
        <h4 className="font-display text-[1.1rem] font-semibold leading-tight" style={{ color: C.dark }}>
          {recipe.name}
        </h4>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <div className="rounded-xl px-3.5 py-3" style={{ background: C.tealLight }}>
            <Label color={C.teal}>Ingredientes</Label>
            <BulletList items={recipe.ingredients} color={C.teal} />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <Label color={C.teal}>Modo de Preparo</Label>
            <p className="text-[13px] leading-snug text-foreground/85">{recipe.modoPreparo}</p>
          </div>
          <div className="rounded-xl px-3.5 py-2.5" style={{ background: C.goldLight }}>
            <Label color={C.gold}>Quando Tomar</Label>
            <p className="text-[12px]" style={{ color: C.gold }}>{recipe.quando}</p>
          </div>
        </div>
      </div>
      <InfoBox variant="teal">
        <strong>Por que funciona:</strong> {recipe.beneficio}
      </InfoBox>
    </div>
  );
}

function RoutineCard({ routine }: { routine: Routine }) {
  return (
    <div className="avoid-page-break rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{routine.emoji}</span>
          <h4 className="font-display text-[1.12rem] font-bold" style={{ color: C.dark }}>
            {routine.tipoPele}
          </h4>
        </div>
        <p className="text-[12.5px] italic" style={{ color: C.muted }}>{routine.problema}</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ background: C.gold }} />
            <Label color={C.gold}>Manhã</Label>
          </div>
          <div className="space-y-1.5">
            {routine.manha.map((s, i) => (
              <p key={i} className="text-[12px] leading-snug text-foreground/80">{s}</p>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ background: C.rose }} />
            <Label>Noite</Label>
          </div>
          <div className="space-y-1.5">
            {routine.noite.map((s, i) => (
              <p key={i} className="text-[12px] leading-snug text-foreground/80">{s}</p>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ background: C.teal }} />
            <Label color={C.teal}>Semanal</Label>
          </div>
          <div className="space-y-1.5">
            {routine.semanal.map((s, i) => (
              <p key={i} className="text-[12px] leading-snug text-foreground/80">{s}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 rounded-lg px-3 py-2" style={{ background: C.roseLight }}>
        <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: C.rose }}>Receitas indicadas: </span>
        <span className="text-[11px]" style={{ color: C.dark }}>{routine.receitasIndicadas}</span>
      </div>
    </div>
  );
}

// ── Capa ──────────────────────────────────────────────────────────────────

function Cover() {
  return (
    <section
      className="relative flex h-[297mm] flex-col overflow-hidden page-break-after print:shadow-none"
      style={{ backgroundImage: 'url(/capa-coreana.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    />
  );
}

// ── EbookDezessete ────────────────────────────────────────────────────────

export default function EbookDezessete() {
  return (
    <>
      <Cover />

      {/* Página 2 — Apresentação */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Introdução"
        title="Por que a pele coreana envelheceu diferente — e o que isso tem a ver com você"
        subtitle="Este guia é o resultado de centenas de rituais ancestrais adaptados para a rotina real da mulher brasileira acima dos 50."
      >
        <div className="space-y-3.5">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Você provavelmente já viu: mulheres coreanas de 60, 70 anos com uma pele que parece ter
            metade da idade. E a primeira explicação que todo mundo dá é genética. Mas a genética não
            explica tudo — e as pesquisas confirmam isso.
          </p>
          <InfoBox variant="rose">
            O diferencial coreano não é o que está na pele. É o que está <strong>na cultura</strong>.
            Décadas de rituais consistentes, ingredientes naturais e uma relação diferente com o
            processo de envelhecimento.
          </InfoBox>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Este guia foi criado para traduzir esse conhecimento para ingredientes que você já tem em
            casa — sem importações, sem produtos caros, sem complicação.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-1">
            {[
              { n: '31', label: 'Receitas e rituais caseiros' },
              { n: '8', label: 'Rotinas por tipo de pele' },
              { n: '0', label: 'Produtos industrializados necessários' },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl p-4 text-center" style={{ background: C.roseLight }}>
                <p className="font-display text-[2.2rem] font-black" style={{ color: C.rose }}>{s.n}</p>
                <p className="text-[11px] leading-snug" style={{ color: C.muted }}>{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[13px] leading-relaxed text-foreground/80">
            Você não precisa entender química nem ter tempo extra. Precisa apenas seguir os rituais
            na ordem certa, com consistência. A pele responde — e ela vai responder à sua.
          </p>
        </div>
      </PdfContentPage>

      {/* Página 3 — Sumário */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Estrutura do Guia"
        title="O que você vai encontrar aqui"
        subtitle="10 módulos + 7 bônus organizados da teoria à prática."
      >
        <div className="grid grid-cols-2 gap-3">
          {[
            { mod: 'Módulo 1', titulo: 'Por Que a Pele Muda Após os 50', cor: C.rose },
            { mod: 'Módulo 2', titulo: 'Os Rituais de Limpeza Coreanos (R1–R4)', cor: C.rose },
            { mod: 'Módulo 3', titulo: 'Os Tônicos Coreanos Caseiros (R5–R10)', cor: C.teal },
            { mod: 'Módulo 4', titulo: 'As Máscaras Coreanas da Cozinha (R11–R18)', cor: C.gold },
            { mod: 'Módulo 5', titulo: 'Os Óleos e Séruns Naturais (R19–R23)', cor: C.rose },
            { mod: 'Módulo 6', titulo: 'Os Rituais Anti-Idade Coreanos (R24–R28)', cor: C.roseMd },
            { mod: 'Módulo 7', titulo: 'A Alimentação Coreana Para a Pele (R29–R31)', cor: C.teal },
            { mod: 'Módulo 8', titulo: '8 Rotinas Prontas Por Tipo de Pele', cor: C.gold },
            { mod: 'Módulo 9', titulo: 'Calendário Coreano de Máscaras (12 sem.)', cor: C.rose },
            { mod: 'Módulo 10', titulo: 'Diário da Pele de 6 Semanas', cor: C.teal },
          ].map((item) => (
            <div key={item.mod} className="flex gap-2.5 rounded-xl p-3" style={{ background: C.roseLight }}>
              <div
                className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                style={{ background: item.cor }}
              />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: item.cor }}>
                  {item.mod}
                </p>
                <p className="text-[12.5px] font-medium leading-snug" style={{ color: C.dark }}>
                  {item.titulo}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl px-4 py-3" style={{ background: C.goldLight, borderLeft: `3px solid ${C.goldBorder}` }}>
          <p className="text-[12px]" style={{ color: C.gold }}>
            <strong>+7 Bônus:</strong> Rotina com R$0 · Ritual 5min · Pescoço e Colo · Lista de Compras ·
            Anti-Manchas · Ritual do Sono · Ingredientes Proibidos após os 50
          </p>
        </div>
      </PdfContentPage>

      {/* Página 4 — Módulo 1, parte 1 */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Módulo 1"
        title="O que acontece com a pele depois dos 50"
        subtitle="Entenda a biologia por trás das mudanças — sem precisar de diploma em dermatologia."
      >
        <ModuleBadge number={1} title="Por que a pele muda após os 50" />
        <div className="space-y-3.5">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Após os 50, três processos acontecem simultaneamente na pele — e entender cada um deles
            muda completamente a forma como você cuida do rosto.
          </p>
          <div className="space-y-2.5">
            {[
              {
                titulo: 'A queda do colágeno e da elastina',
                texto: 'A produção de colágeno cai cerca de 1% ao ano após os 25. Depois da menopausa, essa queda acelera para até 30% nos primeiros 5 anos. O resultado visível: linhas mais profundas, pele mais fina e menos resistência à gravidade.',
                cor: C.rose,
              },
              {
                titulo: 'A alteração do pH da pele',
                texto: 'O pH saudável da pele fica entre 4,5 e 5,5 (levemente ácido). Com o envelhecimento e as alterações hormonais, ele sobe — tornando a pele mais suscetível a bactérias, ressecamento e irritação. Muitos sabonetes comuns pioram esse desequilíbrio.',
                cor: C.gold,
              },
              {
                titulo: 'O enfraquecimento da barreira cutânea',
                texto: 'A camada protetora da pele — responsável por reter a umidade e bloquear agressores externos — fica mais fina e porosa. A pele perde água mais rápido e absorve menos os produtos que você aplica.',
                cor: C.teal,
              },
            ].map((item) => (
              <div key={item.titulo} className="rounded-xl p-3.5" style={{ background: 'white', borderLeft: `3px solid ${item.cor}` }}>
                <p className="mb-1 text-[12px] font-bold" style={{ color: item.cor }}>{item.titulo}</p>
                <p className="text-[13px] leading-snug text-foreground/85">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </PdfContentPage>

      {/* Página 5 — Módulo 1, parte 2 */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Módulo 1"
        title="Os três pilares do método coreano"
        subtitle="Por que coreanas envelhecem diferente — e o que você pode copiar começando hoje."
      >
        <div className="space-y-3.5">
          <InfoBox variant="gold">
            O erro mais comum: reagir às mudanças da pele com produtos mais agressivos — ácidos fortes,
            esfoliantes abrasivos, cremes com retinol em alta concentração. Isso acelera exatamente o
            que você quer frear.
          </InfoBox>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Coreanas não envelhecem diferente por sorte. Elas constroem uma rotina baseada em três
            princípios que vêm sendo passados de geração em geração:
          </p>
          <div className="space-y-2.5">
            {[
              {
                num: '01', titulo: 'Prevenção contínua',
                texto: 'O cuidado começa cedo e nunca para. Não é tratamento — é manutenção diária. A pele que você tem aos 50 é o resultado de décadas de como você a tratou.',
                cor: C.rose,
              },
              {
                num: '02', titulo: 'Hidratação em camadas',
                texto: 'Em vez de aplicar um creme pesado e esperar que ele penetre, o método coreano empilha camadas leves. Cada camada prepara a pele para absorver melhor a próxima.',
                cor: C.teal,
              },
              {
                num: '03', titulo: 'Ingredientes naturais de baixo custo',
                texto: 'Água de arroz, mel, babosa, chá verde — ingredientes que as avós coreanas usam há séculos porque funcionam. A complexidade não é o que faz a pele melhorar. A consistência é.',
                cor: C.gold,
              },
            ].map((p) => (
              <div key={p.num} className="flex gap-3 rounded-xl bg-white p-3.5">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-black text-white"
                  style={{ background: p.cor }}
                >
                  {p.num}
                </div>
                <div>
                  <p className="mb-0.5 text-[13px] font-bold" style={{ color: p.cor }}>{p.titulo}</p>
                  <p className="text-[13px] leading-snug text-foreground/85">{p.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PdfContentPage>

      {/* Páginas 6–7 — Módulo 2: Limpeza (2 receitas por página) */}
      {chunk(cleansingRecipes, 2).map((pair, i) => (
        <PdfContentPage accentGradient={ACCENT}
          key={`cleanse-${i}`}
          kicker="Módulo 2 · Rituais de Limpeza"
          title="Os Rituais de Limpeza Coreanos"
          subtitle={i === 0 ? 'O passo que ninguém ensina — e que muda tudo. Sempre comece por aqui.' : undefined}
        >
          <div className="flex flex-1 flex-col gap-4">
            {pair.map((r) => <CleansingCard key={r.number} recipe={r} />)}
          </div>
        </PdfContentPage>
      ))}

      {/* Página 8 — Módulo 2: Ritual Bônus massagem */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Módulo 2 · Ritual Bônus"
        title="A Massagem de Limpeza Coreana de 60 Segundos"
        subtitle="Sem produto extra — apenas a técnica que ativa a circulação e prepara a pele para absorver tudo que vem depois."
      >
        <div className="space-y-4">
          <InfoBox variant="rose">
            Este ritual é feito <strong>durante a limpeza</strong>, com qualquer um dos produtos dos Módulos 2 ou 3
            aplicados no rosto. Não precisa de nada especial — apenas 60 segundos de atenção.
          </InfoBox>
          <div className="rounded-2xl bg-white p-5">
            <Label>Os 6 Movimentos — Execute nessa ordem exata</Label>
            <div className="mt-2 space-y-3">
              {[
                { passo: '1', area: 'Mandíbula → Têmporas', desc: 'Com as pontas dos 4 dedos, pressione levemente e deslize da mandíbula até as têmporas. Repita 5 vezes de cada lado.' },
                { passo: '2', area: 'Nariz → Bochechas', desc: 'Pressione levemente ao lado do nariz e deslize em direção às orelhas. Repita 5 vezes.' },
                { passo: '3', area: 'Canto interno → Externo dos olhos', desc: 'Com os dedos médios, deslize suavemente sob os olhos, do canto interno ao externo. Nunca puxe. Repita 3 vezes.' },
                { passo: '4', area: 'Testa (ascendente)', desc: 'Com os nós dos dedos, movimentos suaves de baixo para cima na testa, da sobrancelha à linha do cabelo. Repita 5 vezes.' },
                { passo: '5', area: 'Pescoço (ascendente)', desc: 'Com as palmas espalmadas, deslize do pescoço em direção ao queixo. Sempre de baixo para cima. Repita 5 vezes.' },
                { passo: '6', area: 'Pressão final', desc: 'Cubra todo o rosto com as palmas e pressione levemente por 10 segundos. Respiração lenta e profunda.' },
              ].map((m) => (
                <div key={m.passo} className="flex gap-3">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                    style={{ background: C.rose }}
                  >
                    {m.passo}
                  </span>
                  <div>
                    <p className="text-[12px] font-bold" style={{ color: C.dark }}>{m.area}</p>
                    <p className="text-[12.5px] leading-snug text-foreground/80">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <InfoBox variant="gold">
            <strong>Regra de ouro:</strong> nunca esfregue, nunca puxe. Todo movimento é de pressão suave e
            deslizamento ascendente. A gravidade já puxa a pele para baixo — não ajude ela.
          </InfoBox>
        </div>
      </PdfContentPage>

      {/* Páginas 9–11 — Módulo 3: Tônicos (2 por página) */}
      {chunk(tonicRecipes, 2).map((pair, i) => (
        <PdfContentPage accentGradient={ACCENT}
          key={`tonic-${i}`}
          kicker="Módulo 3 · Tônicos Coreanos"
          title="Os Tônicos Coreanos Caseiros"
          subtitle={i === 0 ? 'O passo que as coreanas nunca pulam — e que custa zero. Aplicado sempre após a limpeza.' : undefined}
        >
          <div className="flex flex-1 flex-col gap-4">
            {pair.map((r) => <TonicCard key={r.number} recipe={r} />)}
          </div>
        </PdfContentPage>
      ))}

      {/* Páginas 12–15 — Módulo 4: Máscaras (2 por página) */}
      {chunk(maskRecipes, 2).map((pair, i) => (
        <PdfContentPage accentGradient={ACCENT}
          key={`mask-${i}`}
          kicker="Módulo 4 · Máscaras da Cozinha"
          title="As Máscaras Coreanas da Cozinha"
          subtitle={i === 0 ? 'Tratamento semanal com o que você já tem em casa. Aplique sempre após a limpeza e o tônico.' : undefined}
        >
          <div className="flex flex-1 flex-col gap-4">
            {pair.map((r) => <MaskCard key={r.number} recipe={r} />)}
          </div>
        </PdfContentPage>
      ))}

      {/* Páginas 16–20 — Módulo 5: Séruns (1 por página) */}
      {serumRecipes.map((recipe, i) => (
        <PdfContentPage accentGradient={ACCENT}
          key={`serum-${i}`}
          kicker="Módulo 5 · Óleos e Séruns"
          title="Os Óleos e Séruns Naturais Coreanos"
          subtitle={i === 0 ? 'A nutrição profunda que as coreanas usam desde os 30. Aplicados após o tônico.' : undefined}
        >
          <SerumCard recipe={recipe} />
          {i === 0 && (
            <InfoBox variant="gold">
              <strong>Como usar séruns em camadas:</strong> sempre do mais leve (aquoso) para o mais denso (oleoso).
              Tônico → Sérum aquoso → Sérum oleoso → Hidratante. Nunca o contrário.
            </InfoBox>
          )}
          {i === 1 && (
            <InfoBox variant="teal">
              <strong>Sobre o óleo de jojoba:</strong> quimicamente, é uma cera líquida — não um óleo. Por isso
              não obstrui poros e pode ser usado por todos os tipos de pele, inclusive oleosa.
            </InfoBox>
          )}
          {i === 2 && (
            <InfoBox variant="rose">
              <strong>O segredo do tratamento noturno:</strong> entre 23h e 5h, a pele está em modo de
              regeneração ativa. É o momento em que ela mais absorve e mais responde aos nutrientes aplicados.
            </InfoBox>
          )}
          {i === 3 && (
            <InfoBox variant="rose">
              <strong>Atenção:</strong> vitamina C é instável ao contato com luz e ar. Sempre prepare
              em pequenas quantidades, guarde em frasco escuro e use em até 7 dias.
            </InfoBox>
          )}
          {i === 4 && (
            <InfoBox variant="teal">
              <strong>Técnica da infusão a frio:</strong> para uma versão mais delicada, deixe o saquinho de
              camomila no óleo à temperatura ambiente por 48 horas em vez de usar banho-maria.
            </InfoBox>
          )}
        </PdfContentPage>
      ))}

      {/* Páginas 21–23 — Módulo 6: Rituais Anti-Idade */}
      {chunk(antiAgeRituals, 2).map((pair, i) => (
        <PdfContentPage accentGradient={ACCENT}
          key={`ritual-${i}`}
          kicker="Módulo 6 · Rituais Anti-Idade"
          title="Os Rituais Anti-Idade Coreanos"
          subtitle={i === 0 ? 'As técnicas físicas que nenhum creme substitui. Consistência é mais importante que intensidade.' : undefined}
        >
          <div className="flex flex-col gap-4">
            {pair.map((r) => <RitualCard key={r.number} ritual={r} />)}
          </div>
        </PdfContentPage>
      ))}

      {/* Página 24 — Módulo 7: Alimentação, texto */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Módulo 7 · Alimentação"
        title="A Alimentação Coreana Para a Pele"
        subtitle="O que você come aparece no rosto. As coreanas sabem disso há gerações."
      >
        <div className="space-y-3.5">
          <InfoBox variant="teal">
            O eixo intestino-pele é real: bactérias intestinais regulam a inflamação sistêmica que se manifesta
            em acne, vermelhidão, ressecamento e envelhecimento acelerado. Alimentar o intestino é
            alimentar a pele.
          </InfoBox>
          <div className="rounded-2xl bg-white p-4">
            <Label color={C.teal}>Os 10 Alimentos que Coreanas Comem Todo Dia</Label>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[
                '🌾 Arroz integral — silício e vitaminas B',
                '🥒 Pepino — silício e hidratação intracelular',
                '🍵 Chá verde — catequinas e anti-inflamatório',
                '🧄 Alho fermentado — prebiótico natural',
                '🐟 Peixe gordo (atum, salmão) — ômega-3',
                '🥬 Alga marinha — iodo, ferro e colágeno marinho',
                '🍠 Batata-doce roxa — antocianinas antioxidantes',
                '🫚 Gergelim e óleo de gergelim — vitamina E',
                '🥚 Ovos inteiros — biotina e proteína completa',
                '🍋 Frutas cítricas — vitamina C para o colágeno',
              ].map((item) => (
                <p key={item} className="text-[12.5px] leading-snug text-foreground/85">{item}</p>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <Label>Os 3 Alimentos que Envelhecem a Pele Por Dentro</Label>
            <div className="space-y-1.5 mt-2">
              {[
                'Açúcar refinado — glicação das proteínas de colágeno (endurece e quebra as fibras)',
                'Álcool — desidratação celular profunda e inflamação crônica de baixo grau',
                'Ultra-processados com sódio alto — retenção de líquido e inchaço que acentua rugas',
              ].map((item, i) => (
                <div key={i} className="flex gap-2 text-[13px] leading-snug text-foreground/85">
                  <span className="mt-0.5 text-[11px]" style={{ color: C.rose }}>✗</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </PdfContentPage>

      {/* Páginas 25–27 — Módulo 7: Receitas de alimentação (1 por página) */}
      {foodRecipes.map((recipe, i) => (
        <PdfContentPage accentGradient={ACCENT}
          key={`food-${i}`}
          kicker="Módulo 7 · Alimentação"
          title={i === 0 ? 'O Chá Diário das Avós Coreanas' : 'Receitas de Dentro Para Fora'}
          subtitle={i === 0 ? 'O caldo de ossos é o suplemento de colágeno que as coreanas usam há séculos — sem saber o nome científico.' : undefined}
        >
          <FoodRecipeCard recipe={recipe} />
          {i === 0 && (
            <InfoBox variant="gold">
              <strong>Versão rápida:</strong> se não tiver tempo para o caldo longo, pressão por 1h30 já extrai
              colágeno suficiente. O truque do vinagre de maçã é fundamental — ele dissolve os minerais
              dos ossos na água.
            </InfoBox>
          )}
          {i === 1 && (
            <InfoBox variant="teal">
              <strong>Por que tomar imediatamente:</strong> a vitamina C do limão é instável e oxida rapidamente.
              Prepare e consuma em até 10 minutos para aproveitar o efeito completo.
            </InfoBox>
          )}
          {i === 2 && (
            <InfoBox variant="rose">
              <strong>O ritual matinal coreano:</strong> antes de qualquer coisa — antes do café, antes do celular —
              as coreanas bebem um copo de água em temperatura ambiente. Esse hábito simples hidrata as
              células da pele antes de qualquer produto ser aplicado.
            </InfoBox>
          )}
        </PdfContentPage>
      ))}

      {/* Páginas 28–35 — Módulo 8: Rotinas (1 por página) */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Módulo 8 · Rotinas Prontas"
        title="8 Rotinas Completas Por Tipo de Pele"
        subtitle="Nada para pensar — apenas siga. Cada rotina inclui manhã, noite e ritual semanal com as receitas exatas dos módulos anteriores."
      >
        <div className="space-y-3.5">
          <InfoBox variant="rose">
            <strong>Como identificar seu tipo de pele após os 50:</strong> observe como ela fica 1 hora após a
            limpeza, sem nenhum produto. Brilhosa = oleosa. Puxando = seca. Mista nas duas zonas = mista.
            Vermelha ou coçando = sensível. Apagada mesmo limpa = desidratada.
          </InfoBox>
          <div className="grid grid-cols-2 gap-2.5">
            {routines.map((r) => (
              <div key={r.tipoPele} className="flex items-center gap-2 rounded-xl p-3" style={{ background: C.roseLight }}>
                <span className="text-lg">{r.emoji}</span>
                <div>
                  <p className="text-[12.5px] font-bold" style={{ color: C.dark }}>{r.tipoPele}</p>
                  <p className="text-[11px]" style={{ color: C.muted }}>{r.receitasIndicadas}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[13px] leading-relaxed text-foreground/80">
            Cada rotina nas próximas páginas usa apenas receitas que você já aprendeu neste guia.
            Não é necessário preparar tudo ao mesmo tempo — comece com 2 ou 3 receitas da sua rotina
            e vá adicionando gradualmente.
          </p>
        </div>
      </PdfContentPage>

      {routines.map((routine, i) => (
        <PdfContentPage accentGradient={ACCENT}
          key={`routine-${i}`}
          kicker={`Módulo 8 · Rotina ${i + 1} de 8`}
          title={routine.tipoPele}
          subtitle={routine.problema}
        >
          <RoutineCard routine={routine} />
          <InfoBox variant={i % 3 === 0 ? 'rose' : i % 3 === 1 ? 'gold' : 'teal'}>
            <strong>Dica:</strong> nas primeiras 2 semanas, use apenas as receitas de limpeza e tônico da sua
            rotina. Introduza as máscaras na semana 3. Assim a pele se adapta sem reação.
          </InfoBox>
        </PdfContentPage>
      ))}

      {/* Página — Módulo 9: Calendário */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Módulo 9 · Calendário"
        title="Calendário Coreano de Máscaras — 12 Semanas"
        subtitle="Siga essa ordem para potencializar os resultados. Cada combinação foi pensada para respeitar a barreira da pele."
      >
        <div className="space-y-1.5">
          {[
            { semanas: 'Semanas 1–2', foco: 'Adaptação e limpeza profunda', seg: 'R11 (Arroz+Mel)', qua: 'Descanso', sex: 'R13 (Aveia+Iogurte)', obs: 'Apenas 2x/sem. A pele precisa se adaptar.' },
            { semanas: 'Semanas 3–4', foco: 'Hidratação intensiva', seg: 'R12 (Babosa+Coco)', qua: 'R11 (Arroz+Mel)', sex: 'R14 (Banana+Mel)', obs: 'Aumente para 3x/sem se a pele pedir mais.' },
            { semanas: 'Semanas 5–6', foco: 'Tratamento de manchas', seg: 'R16 (Batata)', qua: 'R17 (Cúrcuma)', sex: 'R11 (Arroz+Mel)', obs: 'Protetor FPS 50+ obrigatório nessa fase.' },
            { semanas: 'Semanas 7–8', foco: 'Firmeza e contorno', seg: 'R14 (Banana)', qua: 'R15 (Clara de Ovo)', sex: 'R12 (Babosa)', obs: 'Combine com o Ritual 27 (Gua Sha).' },
            { semanas: 'Semanas 9–10', foco: 'Uniformização do tom', seg: 'R17 (Cúrcuma)', qua: 'R16 (Batata)', sex: 'R11 (Arroz+Mel)', obs: 'Diferença visível esperada nessa fase.' },
            { semanas: 'Semanas 11–12', foco: 'Manutenção e brilho', seg: 'R12 (Babosa)', qua: 'R11 (Arroz+Mel)', sex: 'R14 (Banana)', obs: 'Sua rotina definitiva começa aqui.' },
          ].map((row) => (
            <div key={row.semanas} className="rounded-xl bg-white px-3 py-2">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-[11.5px] font-bold" style={{ color: C.rose }}>{row.semanas}</p>
                <p className="text-[10.5px] italic" style={{ color: C.muted }}>{row.foco}</p>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                <div className="rounded-lg px-2 py-1" style={{ background: C.roseLight }}>
                  <p className="font-bold leading-tight" style={{ color: C.rose }}>Seg</p>
                  <p className="leading-tight" style={{ color: C.dark }}>{row.seg}</p>
                </div>
                <div className="rounded-lg px-2 py-1" style={{ background: C.goldLight }}>
                  <p className="font-bold leading-tight" style={{ color: C.gold }}>Qua</p>
                  <p className="leading-tight" style={{ color: C.dark }}>{row.qua}</p>
                </div>
                <div className="rounded-lg px-2 py-1" style={{ background: C.tealLight }}>
                  <p className="font-bold leading-tight" style={{ color: C.teal }}>Sex</p>
                  <p className="leading-tight" style={{ color: C.dark }}>{row.sex}</p>
                </div>
                <div className="rounded-lg px-2 py-1" style={{ background: 'hsl(0 0% 97%)' }}>
                  <p className="font-bold leading-tight text-foreground/50">Obs</p>
                  <p className="leading-tight text-foreground/70">{row.obs}</p>
                </div>
              </div>
            </div>
          ))}
          <InfoBox variant="rose">
            <strong>O que evitar misturar:</strong> cúrcuma e clara de ovo na mesma semana intensa podem irritar.
            Argila e rosa mosqueta no mesmo dia podem ressecar. Sempre espaçe tratamentos ativos.
          </InfoBox>
        </div>
      </PdfContentPage>

      {/* Página — Módulo 10: Diário */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Módulo 10 · Diário da Pele"
        title="Diário da Pele — 6 Semanas de Acompanhamento"
        subtitle="Registre sua evolução. O que não é medido não é gerenciado — e a pele não é diferente."
      >
        <div className="space-y-1.5">
          <div className="rounded-2xl bg-white p-2.5">
            <Label>Avaliação Inicial — Antes de Começar</Label>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              {['Hidratação (1–10)', 'Brilho / Luminosidade (1–10)', 'Firmeza percebida (1–10)', 'Tom uniforme (1–10)', 'Tamanho dos poros (1–10)', 'Conforto geral (1–10)'].map((item) => (
                <div key={item} className="rounded-lg px-2.5 py-1.5" style={{ background: C.roseLight }}>
                  <p className="text-[11px] text-foreground/70">{item}</p>
                  <div className="mt-1 h-px w-full" style={{ background: C.roseBorder }} />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-white px-2.5 py-2">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-[12px] font-bold" style={{ color: C.rose }}>Semana {i + 1}</p>
                  <span className="text-[10.5px]" style={{ color: C.muted }}>Data: ___/___/___</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <div className="rounded-lg px-2 py-1.5" style={{ background: C.roseLight }}>
                    <p className="font-bold mb-0.5" style={{ color: C.rose }}>Receitas usadas</p>
                    <div className="h-5 border-b" style={{ borderColor: C.roseBorder }} />
                  </div>
                  <div className="rounded-lg px-2 py-1.5" style={{ background: C.goldLight }}>
                    <p className="font-bold mb-0.5" style={{ color: C.gold }}>Resultados notados</p>
                    <div className="h-5 border-b" style={{ borderColor: C.goldBorder }} />
                  </div>
                  <div className="rounded-lg px-2 py-1.5" style={{ background: C.tealLight }}>
                    <p className="font-bold mb-0.5" style={{ color: C.teal }}>Ajustes na rotina</p>
                    <div className="h-5 border-b" style={{ borderColor: C.tealBorder }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PdfContentPage>

      {/* Página Bônus 1 — Rotina com R$0 + Bônus 2 — 5 minutos */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Bônus Exclusivos"
        title="Bônus 1 — Rotina Completa com R$0"
        subtitle="Apenas ingredientes da cozinha. Nenhum produto comprado."
      >
        <div className="space-y-3.5">
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                periodo: 'Manhã', cor: C.gold,
                steps: ['Limpeza: Receita 2 (Mel Puro)', 'Tônico: Receita 5 (Água de Arroz)', 'Compressa Fria (Ritual 26)'],
              },
              {
                periodo: 'Noite', cor: C.rose,
                steps: ['Limpeza: Receita 1 (Óleo de Girassol)', 'Tônico: Receita 5 (Água de Arroz)', 'Óleo: Receita 21 sem amêndoas — só gergelim + vit E'],
              },
              {
                periodo: 'Semanal', cor: C.teal,
                steps: ['R11 (Arroz+Mel)', 'R12 (Babosa+Coco)', 'Massagem 5min (Ritual 24)'],
              },
            ].map((col) => (
              <div key={col.periodo} className="rounded-xl bg-white p-3">
                <div className="mb-2 flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: col.cor }} />
                  <Label color={col.cor}>{col.periodo}</Label>
                </div>
                <div className="space-y-1.5">
                  {col.steps.map((s, i) => (
                    <p key={i} className="text-[12px] leading-snug text-foreground/80">{s}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 border-t border-gray-100 pt-4">
            <div className="mb-2 flex items-center gap-2">
              <div
                className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white"
                style={{ background: C.roseMd }}
              >
                Bônus 2
              </div>
              <p className="font-display text-[1.1rem] font-semibold" style={{ color: C.dark }}>
                Ritual Coreano de 5 Minutos Para Dias Corridos
              </p>
            </div>
            <p className="mb-3 text-[13px]" style={{ color: C.muted }}>
              A versão compacta do método para quando o tempo é curto mas o resultado não pode falhar.
            </p>
            <div className="space-y-1.5">
              {[
                { t: '00:00–01:00', a: 'Limpeza rápida com a Receita 2 (Mel) — 60 segundos' },
                { t: '01:00–02:00', a: 'Tônico Receita 9 (Água de Rosa) com tapping — 60 segundos' },
                { t: '02:00–03:30', a: 'Compressa Fria (Ritual 26) — 90 segundos' },
                { t: '03:30–04:30', a: '2 gotas do Sérum 20 (Jojoba) com pressão de palmas' },
                { t: '04:30–05:00', a: 'Protetor solar aplicado com tapping (Ritual 28)' },
              ].map((s) => (
                <div key={s.t} className="flex gap-3 items-start text-[13px]">
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: C.roseLight, color: C.rose }}>
                    {s.t}
                  </span>
                  <span className="leading-snug text-foreground/85">{s.a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PdfContentPage>

      {/* Bônus 3 — Pescoço e Colo + Bônus 4 — Lista de Compras */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Bônus 3 e 4"
        title="Bônus 3 — Os Segredos Coreanos Para Pescoço e Colo"
        subtitle="A área que mais entrega a idade — e que quase ninguém cuida."
      >
        <div className="space-y-3.5">
          <InfoBox variant="teal">
            A pele do pescoço tem menos glândulas sebáceas que o rosto — resseca mais e envelhece mais
            rápido. E a maioria das mulheres aplica todos os produtos apenas no rosto. Estenda tudo que
            você aplica no rosto até o colo.
          </InfoBox>
          <div className="grid grid-cols-2 gap-3">
            {[
              { titulo: 'Direção dos movimentos', desc: 'Sempre de baixo para cima — do peito em direção ao queixo. Nunca o contrário.' },
              { titulo: 'Máscara semanal do pescoço', desc: 'Receita 14 (Banana + Mel) aplicada do colo ao queixo por 20 minutos. 2x por semana.' },
              { titulo: 'Sérum específico para o pescoço', desc: 'Receita 21 (Óleo Noturno com Vitamina E) aplicada com movimentos ascendentes toda noite.' },
              { titulo: 'Gua Sha no pescoço', desc: 'Ritual 27 (Colher Gelada) descendo do queixo em direção ao ombro. 3x por semana.' },
            ].map((item) => (
              <div key={item.titulo} className="rounded-xl bg-white p-3.5">
                <p className="mb-1 text-[12px] font-bold" style={{ color: C.teal }}>{item.titulo}</p>
                <p className="text-[12.5px] leading-snug text-foreground/85">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white" style={{ background: C.gold }}>
                Bônus 4
              </div>
              <p className="font-display text-[1.05rem] font-semibold" style={{ color: C.dark }}>
                Lista de Compras — Supermercado
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { secao: 'Hortifrúti', items: ['Pepino', 'Banana madura', 'Batata inglesa', 'Limão', 'Gengibre'] },
                { secao: 'Grãos e Cereais', items: ['Arroz branco', 'Arroz integral', 'Aveia fina', 'Cúrcuma em pó'] },
                { secao: 'Laticínios', items: ['Mel puro', 'Leite de coco', 'Iogurte natural', 'Clara de ovo'] },
                { secao: 'Óleos', items: ['Óleo de girassol', 'Óleo de coco', 'Óleo de oliva', 'Óleo de gergelim'] },
                { secao: 'Farmácia / Empório', items: ['Glicerina vegetal', 'Água de rosa', 'Gel de babosa', 'Vitamina E (cápsulas)', 'Argila branca'] },
                { secao: 'Chás', items: ['Chá verde', 'Camomila', 'Chá de arroz'] },
              ].map((col) => (
                <div key={col.secao} className="rounded-xl p-3" style={{ background: C.goldLight }}>
                  <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wide" style={{ color: C.gold }}>{col.secao}</p>
                  {col.items.map((item) => (
                    <p key={item} className="text-[12px] leading-snug text-foreground/80">☐ {item}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </PdfContentPage>

      {/* Bônus 5, 6 e 7 */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Bônus 5, 6 e 7"
        title="Bônus 5 — Guia Anti-Manchas Coreano"
        subtitle="As cinco receitas mais eficazes das avós coreanas especificamente para manchas de idade."
      >
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { n: 'R6', nome: 'Arroz Fermentada', freq: 'Diário' },
              { n: 'R16', nome: 'Batata Crua', freq: '3x/sem' },
              { n: 'R17', nome: 'Cúrcuma+Leite', freq: '2x/sem' },
              { n: 'R19', nome: 'Rosa Mosqueta', freq: 'Diário (noite)' },
              { n: 'R22', nome: 'Babosa+Vit C', freq: 'Diário (noite)' },
            ].map((item) => (
              <div key={item.n} className="rounded-xl p-2.5" style={{ background: C.roseLight }}>
                <p className="text-[1rem] font-black" style={{ color: C.rose }}>{item.n}</p>
                <p className="text-[11px] font-medium leading-tight" style={{ color: C.dark }}>{item.nome}</p>
                <p className="mt-1 text-[10px]" style={{ color: C.muted }}>{item.freq}</p>
              </div>
            ))}
          </div>
          <InfoBox variant="rose">
            <strong>A regra número um do protocolo anti-manchas:</strong> protetor solar FPS 50+ todos os dias,
            mesmo nublado, mesmo em casa perto de janelas. Sem protetor, nenhuma receita funciona.
          </InfoBox>

          <div className="border-t border-gray-100 pt-3">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white" style={{ background: C.teal }}>Bônus 6</div>
              <p className="font-display text-[1rem] font-semibold" style={{ color: C.dark }}>O Ritual do Sono Coreano</p>
            </div>
            <p className="mb-2 text-[12.5px]" style={{ color: C.muted }}>O que aplicar antes de dormir para acordar com a pele restaurada.</p>
            <div className="space-y-1.5">
              {[
                'Limpeza dupla — nunca durma com resíduos de protetor ou maquiagem',
                'Tônico Receita 10 (Camomila) com 7 Skin Method (Ritual 25)',
                'Sérum Receita 19 (Rosa Mosqueta) — 3 gotas em movimentos ascendentes',
                'Óleo Receita 21 (Vitamina E) — última camada, sela tudo',
                'Umidificador no quarto — a umidade do ar protege a barreira cutânea durante o sono',
              ].map((s, i) => (
                <div key={i} className="flex gap-2 text-[12.5px] leading-snug text-foreground/85">
                  <span className="mt-0.5 text-[11px]" style={{ color: C.teal }}>→</span>{s}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white" style={{ background: C.rose }}>Bônus 7</div>
              <p className="font-display text-[1rem] font-semibold" style={{ color: C.dark }}>Ingredientes Proibidos Após os 50</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { item: 'Álcool desnaturado (SD Alcohol)', motivo: 'Destrói a barreira lipídica e resseca cronicamente' },
                { item: 'Retinol em alta concentração (>0,5%)', motivo: 'Irrita e inflama pele madura — use apenas com dermatologista' },
                { item: 'Esfoliantes físicos abrasivos', motivo: 'Microlacerações que aceleram flacidez. Use enzimáticos ou suaves' },
                { item: 'Sabonetes com pH alcalino (>6)', motivo: 'Desequilibram o pH da pele madura, já alterado pela menopausa' },
                { item: 'Perfumes sintéticos diretamente na pele', motivo: 'Alta irritabilidade em pele sensibilizada após os 50' },
                { item: 'AHAs/BHAs sem protetor solar', motivo: 'Fotossensibilizam — sem FPS, pioram manchas em vez de tratar' },
                { item: 'Suco de limão puro no rosto', motivo: 'Causa fitofotodermatite: queimaduras e manchas permanentes ao contato com o sol' },
                { item: 'Óleos essenciais sem diluição', motivo: 'Puros são irritantes e sensibilizantes — sempre dilua em óleo vegetal' },
              ].map((i) => (
                <div key={i.item} className="rounded-lg bg-white p-2.5">
                  <p className="text-[11.5px] font-bold" style={{ color: C.rose }}>✗ {i.item}</p>
                  <p className="text-[11px] leading-snug text-foreground/70">{i.motivo}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PdfContentPage>

      {/* Encerramento */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Mensagem Final"
        title="A consistência é o único segredo que ninguém vende"
        subtitle="Você tem tudo que precisa. O resto é começar."
      >
        <div className="space-y-4">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Mulheres coreanas não têm pele perfeita porque nasceram assim. Elas têm porque, por
            décadas, todo dia, fizeram coisas simples de forma consistente.
          </p>
          <InfoBox variant="rose">
            A pele não muda em uma semana. Mas ela começa a responder em 3 dias — você vai sentir a
            diferença na textura antes de vê-la no espelho.
          </InfoBox>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Não tente fazer tudo de uma vez. Escolha uma rotina. Comece com a limpeza e um tônico.
            Na semana seguinte, adicione uma máscara. Na terceira, introduza o sérum.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { semana: 'Semana 1', acao: 'Limpeza + Tônico da sua rotina' },
              { semana: 'Semana 2', acao: 'Adicione 1 máscara semanal' },
              { semana: 'Semana 3+', acao: 'Adicione o sérum e os rituais físicos' },
            ].map((s) => (
              <div key={s.semana} className="rounded-2xl p-4 text-center" style={{ background: C.roseLight }}>
                <p className="font-display text-[1rem] font-bold" style={{ color: C.rose }}>{s.semana}</p>
                <p className="mt-1 text-[12px] leading-snug" style={{ color: C.muted }}>{s.acao}</p>
              </div>
            ))}
          </div>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            O método coreano não promete milagres. Promete resultado — para quem respeita o processo.
          </p>
          <div
            className="rounded-2xl p-5 text-center"
            style={{ background: 'linear-gradient(135deg, hsl(340 40% 14%), hsl(15 45% 20%))' }}
          >
            <p className="font-display text-[1.4rem] font-bold leading-snug" style={{ color: 'hsl(28 60% 90%)' }}>
              "Cuide da pele que você tem hoje.<br />A que você terá amanhã depende disso."
            </p>
          </div>
        </div>
      </PdfContentPage>

      {/* Página final — Aviso Legal */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Aviso Legal"
        title="Informações importantes antes de começar"
        subtitle="Leia esta página com atenção. Ela protege você e garante o uso seguro de todas as receitas deste guia."
      >
        <div className="space-y-3">
          <InfoBox variant="rose">
            <strong>Este material tem finalidade exclusivamente informativa e educativa.</strong> Não constitui
            consulta, diagnóstico, prescrição ou tratamento médico, e não substitui o acompanhamento
            de um dermatologista ou profissional de saúde qualificado.
          </InfoBox>

          <div className="rounded-2xl bg-white p-4">
            <Label>Teste de sensibilidade — obrigatório antes de qualquer receita</Label>
            <p className="mt-1 text-[13px] leading-snug text-foreground/85">
              Antes de aplicar qualquer preparo no rosto pela primeira vez, faça o teste de contato:
              aplique uma pequena quantidade na parte interna do antebraço e aguarde 24 horas. Se
              houver vermelhidão, coceira, ardência ou inchaço, não utilize a receita. Ingredientes
              naturais também causam alergia.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              {
                titulo: 'Procure um dermatologista se',
                desc: 'Você tem rosácea, dermatite, psoríase, melasma extenso, feridas abertas, acne severa ou qualquer condição de pele diagnosticada.',
                cor: C.rose,
              },
              {
                titulo: 'Consulte antes de usar se',
                desc: 'Está grávida, amamentando, faz uso de ácidos, retinoides ou isotretinoína, ou realizou procedimento estético recente (peeling, laser, preenchimento).',
                cor: C.gold,
              },
              {
                titulo: 'Alergias e intolerâncias',
                desc: 'Verifique cada ingrediente antes do preparo. Mel, laticínios, aveia, frutos secos e óleos vegetais estão entre os alérgenos mais comuns das receitas.',
                cor: C.teal,
              },
              {
                titulo: 'Interrompa imediatamente se',
                desc: 'Surgir ardência persistente, vermelhidão que não passa, descamação intensa ou qualquer reação incomum. Lave com água corrente e procure orientação médica.',
                cor: C.roseMd,
              },
            ].map((item) => (
              <div key={item.titulo} className="rounded-xl bg-white p-3.5" style={{ borderLeft: `3px solid ${item.cor}` }}>
                <p className="mb-1 text-[12px] font-bold" style={{ color: item.cor }}>{item.titulo}</p>
                <p className="text-[12px] leading-snug text-foreground/85">{item.desc}</p>
              </div>
            ))}
          </div>

          <InfoBox variant="gold">
            <strong>Sobre os resultados:</strong> os efeitos descritos neste guia são baseados em uso
            tradicional e variam de pessoa para pessoa conforme tipo de pele, idade, genética, saúde
            geral e constância na aplicação. Nenhum resultado específico é garantido, e este material
            não promete cura ou reversão de condições de pele.
          </InfoBox>

          <div className="rounded-2xl bg-white p-4">
            <Label color={C.teal}>Preparo, conservação e higiene</Label>
            <div className="mt-1.5 space-y-1">
              {[
                'Use utensílios e frascos limpos e secos. Preparos caseiros não contêm conservantes.',
                'Respeite os prazos de validade indicados em cada receita e descarte após o período.',
                'Descarte imediatamente qualquer preparo com odor, cor ou textura alterada.',
                'Nunca aplique preparos sobre pele lesionada, com feridas, queimaduras ou irritação ativa.',
                'Mantenha todos os preparos fora do alcance de crianças e longe dos olhos.',
              ].map((s, i) => (
                <div key={i} className="flex gap-2 text-[12px] leading-snug text-foreground/85">
                  <span className="mt-0.5 text-[10px]" style={{ color: C.teal }}>→</span>{s}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl px-4 py-3" style={{ background: 'hsl(0 0% 97%)' }}>
            <p className="text-[11.5px] leading-snug text-foreground/70">
              <strong>Responsabilidade e direitos autorais.</strong> Ao utilizar as informações deste
              guia, o leitor assume integral responsabilidade pela aplicação das receitas e técnicas
              aqui descritas. Os autores e distribuidores não se responsabilizam por eventuais reações
              adversas, danos ou prejuízos decorrentes do uso indevido do conteúdo. Este material é
              protegido por direitos autorais — a reprodução, revenda ou distribuição total ou parcial
              sem autorização expressa é proibida.
            </p>
          </div>
        </div>
      </PdfContentPage>
    </>
  );
}
