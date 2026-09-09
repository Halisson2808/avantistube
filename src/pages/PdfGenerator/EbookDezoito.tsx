/**
 * PDF 18 — Rota: /pdf/ebook-dezoito
 * O Método Raiz Forte — Cabelo e Unhas Para Mulheres 50+
 */
import type { ReactNode } from 'react';
import { PdfContentPage } from '@/components/ebook/PdfContentPage';

const ACCENT = 'linear-gradient(to bottom, hsl(30 62% 38%), hsl(38 58% 46%), hsl(95 32% 34%))';

const C = {
  amber:       'hsl(30 62% 36%)',
  amberMd:     'hsl(32 58% 48%)',
  amberLight:  'hsl(36 68% 95%)',
  amberBorder: 'hsl(34 52% 78%)',
  olive:       'hsl(95 34% 30%)',
  oliveLight:  'hsl(95 32% 94%)',
  oliveBorder: 'hsl(95 26% 74%)',
  plum:        'hsl(330 34% 40%)',
  plumLight:   'hsl(330 36% 95%)',
  plumBorder:  'hsl(330 28% 80%)',
  dark:        'hsl(28 32% 15%)',
  muted:       'hsl(28 8% 45%)',
};

// ── Tipos ─────────────────────────────────────────────────────────────────

type HairOil = {
  number: number; name: string;
  ingredients: string[]; modoPreparo: string;
  formaAplicacao: string; frequencia: string;
  validade: string; indicadoPara: string;
};

type HairMask = {
  number: number; name: string;
  ingredients: string[]; modoPreparo: string;
  tempoAplicacao: string; frequenciaSemanal: string;
  indicadoPara: string; resultadoEsperado: string;
};

type ScalpRitual = {
  number: number; name: string;
  duracao: string; frequencia: string; beneficio: string;
  passos: string[];
};

type NailRecipe = {
  number: number; name: string; purpose: string;
  ingredients: string[]; modoPreparo: string;
  formaAplicacao: string; frequencia: string;
};

type FoodRecipe = {
  number: number; name: string;
  ingredients: string[]; modoPreparo: string;
  quando: string; beneficio: string;
};

type Routine = {
  tipo: string; emoji: string; problema: string;
  diario: string[]; semanal: string[]; mensal: string[];
  receitasIndicadas: string;
};

// ── Dados ─────────────────────────────────────────────────────────────────

const hairOils: HairOil[] = [
  {
    number: 1, name: 'Óleo de Alecrim com Coco para Estimular a Raiz',
    ingredients: ['2 colheres de sopa de óleo de coco virgem', '5 gotas de óleo essencial de alecrim', 'Frasco de vidro escuro com tampa'],
    modoPreparo: 'Aqueça o óleo de coco em banho-maria apenas até liquefazer — nunca deixe ferver. Retire do fogo, espere amornar e só então adicione o óleo essencial de alecrim. Misture e transfira para o frasco escuro.',
    formaAplicacao: 'Aplique diretamente no couro cabeludo, repartindo os cabelos em mechas. Massageie por 5 minutos com as pontas dos dedos. Deixe agir de 30 minutos a 1 hora e lave normalmente.',
    frequencia: '2x por semana', validade: 'Até 3 meses em local fresco e escuro',
    indicadoPara: 'Queda, afinamento do fio e falta de densidade',
  },
  {
    number: 2, name: 'Óleo de Rícino com Amêndoas para Densidade',
    ingredients: ['1 colher de sopa de óleo de rícino', '2 colheres de sopa de óleo de amêndoas doce', '3 gotas de óleo essencial de lavanda (opcional)'],
    modoPreparo: 'Misture os óleos no frasco e agite bem. O rícino é muito denso — a diluição com amêndoas é o que torna a aplicação e a remoção possíveis.',
    formaAplicacao: 'Aplique somente no couro cabeludo e na linha do crescimento. Massageie por 3 minutos. Deixe agir por 1 hora ou durante a noite com uma touca. Lave com dois shampoos.',
    frequencia: '1 a 2x por semana', validade: 'Até 6 meses',
    indicadoPara: 'Entradas, sobrancelhas ralas e fios finos',
  },
  {
    number: 3, name: 'Tônico de Água de Arroz Fermentada para os Fios',
    ingredients: ['½ xícara de arroz cru', '1 xícara de água filtrada', 'Frasco com borrifador'],
    modoPreparo: 'Lave o arroz, cubra com a água filtrada e deixe em temperatura ambiente por 24 horas até fermentar levemente. Coe e dilua com água na proporção de 1 parte de tônico para 3 de água.',
    formaAplicacao: 'Borrife no couro cabeludo e no comprimento após a lavagem. Massageie por 1 minuto e enxágue com água fria após 5 minutos.',
    frequencia: '1x por semana', validade: 'Até 7 dias na geladeira',
    indicadoPara: 'Fios opacos, sem brilho e quebradiços',
  },
  {
    number: 4, name: 'Tônico de Chá Verde e Alecrim Anti-Queda',
    ingredients: ['200ml de água filtrada', '1 saquinho de chá verde', '1 colher de sopa de alecrim seco', 'Frasco com borrifador'],
    modoPreparo: 'Ferva a água, retire do fogo e adicione o chá verde e o alecrim seco. Tampe e deixe em infusão por 20 minutos. Coe completamente e espere esfriar antes de envasar.',
    formaAplicacao: 'Borrife no couro cabeludo seco ou úmido e massageie. Não precisa enxaguar.',
    frequencia: 'Até 4x por semana', validade: 'Até 7 dias na geladeira',
    indicadoPara: 'Queda sazonal e couro cabeludo sem estímulo',
  },
  {
    number: 5, name: 'Sérum de Jojoba para Pontas Ressecadas',
    ingredients: ['1 colher de sopa de óleo de jojoba', '3 gotas de vitamina E (óleo de cápsula)'],
    modoPreparo: 'Misture em um frasco conta-gotas. A jojoba é quimicamente próxima ao sebo natural, o que torna a absorção rápida e sem efeito pesado.',
    formaAplicacao: '2 a 3 gotas aquecidas entre as palmas, aplicadas apenas do meio do comprimento até as pontas, com o cabelo úmido ou seco.',
    frequencia: 'Diária, conforme necessidade', validade: 'Até 12 meses',
    indicadoPara: 'Pontas duplas, ressecadas e cabelo com frizz',
  },
  {
    number: 6, name: 'Tônico Calmante de Babosa para Couro Cabeludo Irritado',
    ingredients: ['3 colheres de sopa de gel de babosa puro', '100ml de chá de camomila frio', '1 colher de chá de glicerina vegetal'],
    modoPreparo: 'Prepare o chá de camomila forte e deixe esfriar completamente. Bata com o gel de babosa e a glicerina até homogeneizar. Coe se ficarem grumos.',
    formaAplicacao: 'Aplique diretamente no couro cabeludo com as pontas dos dedos ou borrifador. Deixe agir 20 minutos e enxágue com água morna.',
    frequencia: '2x por semana', validade: 'Até 5 dias na geladeira',
    indicadoPara: 'Coceira, descamação leve e couro cabeludo sensibilizado',
  },
  {
    number: 7, name: 'Óleo de Gergelim Morno — O Ritual Ayurvédico',
    ingredients: ['3 colheres de sopa de óleo de gergelim', '1 colher de chá de sementes de feno-grego (opcional)'],
    modoPreparo: 'Aqueça o óleo em banho-maria por 5 minutos com as sementes de feno-grego. Retire do fogo, deixe amornar até ficar confortável ao toque e coe.',
    formaAplicacao: 'Aplique morno no couro cabeludo com massagem lenta de 10 minutos. Envolva a cabeça com uma toalha morna por 30 minutos e lave.',
    frequencia: '1x por semana', validade: 'Prepare na hora do uso',
    indicadoPara: 'Cabelo seco, sem elasticidade e couro cabeludo com má circulação',
  },
];

const hairMasks: HairMask[] = [
  {
    number: 8, name: 'Máscara de Abacate e Azeite para Nutrição Profunda',
    ingredients: ['½ abacate maduro', '2 colheres de sopa de azeite extravirgem', '1 colher de sopa de mel'],
    modoPreparo: 'Amasse o abacate até virar um creme sem pedaços — use um garfo e depois passe por uma peneira se necessário. Misture o azeite e o mel até obter uma pasta lisa.',
    tempoAplicacao: '30 minutos', frequenciaSemanal: '1x por semana',
    indicadoPara: 'Cabelo seco, poroso e sem maleabilidade',
    resultadoEsperado: 'Fios visivelmente mais macios e pesados já na primeira aplicação, com redução imediata do frizz.',
  },
  {
    number: 9, name: 'Máscara de Ovo e Iogurte para Reposição de Proteína',
    ingredients: ['1 ovo inteiro', '2 colheres de sopa de iogurte natural integral', '1 colher de chá de azeite'],
    modoPreparo: 'Bata o ovo com um garfo e misture o iogurte e o azeite. Aplique sempre com o produto em temperatura ambiente — nunca aqueça, pois o ovo cozinha.',
    tempoAplicacao: '20 minutos', frequenciaSemanal: 'A cada 15 dias',
    indicadoPara: 'Fios elásticos demais, que esticam e arrebentam',
    resultadoEsperado: 'Devolve resistência e corpo ao fio. Enxágue apenas com água fria ou morna.',
  },
  {
    number: 10, name: 'Umectação com Óleo de Coco Antes da Lavagem',
    ingredients: ['2 a 3 colheres de sopa de óleo de coco virgem', 'Touca ou toalha'],
    modoPreparo: 'Derreta o óleo de coco entre as mãos. Aplique no cabelo seco, do meio às pontas, mecha por mecha, até que todo o comprimento esteja coberto.',
    tempoAplicacao: '2 horas ou durante a noite', frequenciaSemanal: '1x por semana',
    indicadoPara: 'Cabelo quimicamente tratado, com coloração ou muito ressecado',
    resultadoEsperado: 'Reduz a perda de proteína do fio durante a lavagem — é o único óleo com essa ação comprovada.',
  },
  {
    number: 11, name: 'Máscara de Babosa e Mel para Hidratação',
    ingredients: ['3 colheres de sopa de gel de babosa puro', '1 colher de sopa de mel', '1 colher de sopa do seu condicionador habitual'],
    modoPreparo: 'Bata o gel de babosa até ficar líquido e sem grumos. Misture o mel e o condicionador até obter um creme homogêneo.',
    tempoAplicacao: '25 minutos', frequenciaSemanal: '1x por semana',
    indicadoPara: 'Cabelo desidratado, opaco e sem movimento',
    resultadoEsperado: 'Hidratação sem peso — indicada inclusive para quem tem raiz oleosa e comprimento seco.',
  },
  {
    number: 12, name: 'Máscara de Banana e Azeite para Elasticidade',
    ingredients: ['1 banana bem madura', '1 colher de sopa de azeite extravirgem', '2 colheres de sopa de leite'],
    modoPreparo: 'Bata todos os ingredientes no liquidificador — bater é essencial, pois pedaços de banana ressecam nos fios e são difíceis de remover.',
    tempoAplicacao: '20 minutos', frequenciaSemanal: '1x por semana',
    indicadoPara: 'Cabelo quebradiço que arrebenta ao pentear',
    resultadoEsperado: 'Devolve flexibilidade ao fio e reduz a quebra durante a escovação.',
  },
  {
    number: 13, name: 'Enxágue Ácido de Vinagre de Maçã para Brilho',
    ingredients: ['1 colher de sopa de vinagre de maçã', '500ml de água filtrada fria'],
    modoPreparo: 'Dilua o vinagre na água. A proporção é obrigatória: vinagre puro no cabelo agride o couro cabeludo e resseca o fio.',
    tempoAplicacao: '2 minutos', frequenciaSemanal: '1x por semana',
    indicadoPara: 'Fios opacos e com acúmulo de resíduo de produto',
    resultadoEsperado: 'Fecha a cutícula e devolve brilho imediato. Use como último enxágue, após o condicionador.',
  },
  {
    number: 14, name: 'Máscara de Argila Verde para Raiz Oleosa',
    ingredients: ['2 colheres de sopa de argila verde', '3 colheres de sopa de chá de camomila frio', '1 colher de chá de gel de babosa'],
    modoPreparo: 'Dissolva a argila no chá frio usando uma colher de plástico ou madeira — nunca metal. Adicione a babosa e misture até virar uma pasta cremosa.',
    tempoAplicacao: '15 minutos', frequenciaSemanal: 'A cada 15 dias',
    indicadoPara: 'Couro cabeludo oleoso com comprimento seco',
    resultadoEsperado: 'Controla a oleosidade da raiz sem ressecar o comprimento. Aplique somente no couro cabeludo.',
  },
  {
    number: 15, name: 'Gel de Linhaça para Força e Definição',
    ingredients: ['4 colheres de sopa de sementes de linhaça', '500ml de água filtrada'],
    modoPreparo: 'Leve a linhaça e a água ao fogo baixo, mexendo sempre. Quando começar a formar um gel transparente (cerca de 10 minutos), desligue e coe ainda quente com uma peneira fina.',
    tempoAplicacao: 'Sem enxágue', frequenciaSemanal: 'Uso diário conforme necessidade',
    indicadoPara: 'Cabelo sem definição, com frizz e fios rebeldes',
    resultadoEsperado: 'Define e dá corpo sem ressecar. Rico em ômega-3 e vitamina E.',
  },
  {
    number: 16, name: 'Máscara de Feno-Grego para Queda',
    ingredients: ['3 colheres de sopa de sementes de feno-grego', 'Água para hidratar', '2 colheres de sopa de iogurte natural'],
    modoPreparo: 'Deixe as sementes de molho em água por 12 horas. Escorra e bata no liquidificador até formar uma pasta. Misture o iogurte.',
    tempoAplicacao: '30 minutos', frequenciaSemanal: '1x por semana',
    indicadoPara: 'Queda acentuada e couro cabeludo enfraquecido',
    resultadoEsperado: 'Um dos preparos tradicionais mais usados para queda. Aplique no couro cabeludo e no comprimento.',
  },
];

const scalpRituals: ScalpRitual[] = [
  {
    number: 17, name: 'A Massagem Capilar de 5 Minutos',
    duracao: '5 minutos', frequencia: 'Diária — de preferência à noite',
    beneficio: 'Aumenta o fluxo sanguíneo no folículo e, com constância, favorece fios mais espessos',
    passos: [
      'Comece com o cabelo seco e as mãos limpas, sentada e confortável',
      'Apoie as pontas dos dedos (nunca as unhas) na nuca, dos dois lados',
      'Faça círculos lentos e firmes, movendo o couro cabeludo — não deslizando sobre ele',
      'Suba gradualmente em direção ao topo da cabeça, cobrindo toda a área em 3 minutos',
      'Dedique 1 minuto às têmporas e 1 minuto à linha frontal do cabelo',
      'Finalize com pressão suave e sustentada de toda a mão espalmada por 15 segundos',
    ],
  },
  {
    number: 18, name: 'A Escovação Correta Após os 50',
    duracao: '3 minutos', frequencia: 'Diária — manhã e antes de dormir',
    beneficio: 'Distribui a oleosidade natural pelo comprimento e reduz a quebra mecânica dos fios',
    passos: [
      'Use escova de cerdas naturais ou pente de dentes largos — nunca escova fina em cabelo molhado',
      'Comece sempre pelas pontas, desembaraçando de baixo para cima em seções',
      'Só depois de as pontas estarem livres, escove do couro cabeludo até o comprimento',
      'Cabelo molhado é 3x mais frágil: se precisar desembaraçar, use os dedos ou pente largo',
      'Finalize com 10 passadas suaves do topo às pontas para distribuir a oleosidade natural',
    ],
  },
  {
    number: 19, name: 'O Ritual da Toalha Morna',
    duracao: '20 minutos', frequencia: 'Sempre que fizer óleo ou máscara',
    beneficio: 'O calor abre a cutícula e multiplica a absorção de qualquer óleo ou máscara aplicada',
    passos: [
      'Aplique o óleo ou a máscara escolhida normalmente',
      'Molhe uma toalha com água morna e torça bem até parar de pingar',
      'Enrole a toalha na cabeça, cobrindo todo o cabelo',
      'Deixe agir por 20 minutos — reaqueça a toalha na metade do tempo se esfriar',
      'Enxágue sempre com água morna ou fria, nunca quente',
    ],
  },
  {
    number: 20, name: 'O Enxágue Final Frio',
    duracao: '30 segundos', frequencia: 'Toda lavagem',
    beneficio: 'Fecha a cutícula do fio, o que se traduz em brilho imediato e menos frizz',
    passos: [
      'Termine toda a lavagem normalmente, com shampoo e condicionador',
      'No último enxágue, reduza a temperatura da água até ficar fria mas tolerável',
      'Incline a cabeça para frente e deixe a água correr do couro cabeludo às pontas por 30 segundos',
      'Não esfregue os fios com a toalha — pressione e absorva a água',
      'Prefira secar com camiseta de algodão em vez de toalha felpuda',
    ],
  },
  {
    number: 21, name: 'O Ritual Noturno de Proteção',
    duracao: '2 minutos', frequencia: 'Toda noite',
    beneficio: 'Evita o atrito que causa quebra e pontas duplas durante o sono',
    passos: [
      'Nunca durma com o cabelo preso apertado ou com elástico de borracha',
      'Faça uma trança frouxa lateral ou um coque alto solto preso com scrunchie de tecido',
      'Aplique 2 gotas do Sérum 5 (Jojoba) apenas nas pontas antes de dormir',
      'Use fronha de cetim ou seda — reduz o atrito de forma perceptível em poucas semanas',
      'Nunca durma com o cabelo molhado: o fio úmido é frágil e quebra com o movimento',
    ],
  },
];

const nailRecipes: NailRecipe[] = [
  {
    number: 22, name: 'Banho de Óleo de Oliva Morno',
    purpose: 'Fortalece unhas quebradiças e amolece cutículas ressecadas',
    ingredients: ['4 colheres de sopa de azeite extravirgem', '1 tigela pequena'],
    modoPreparo: 'Aqueça o azeite em banho-maria até ficar morno e confortável ao toque — teste sempre no pulso antes de mergulhar os dedos.',
    formaAplicacao: 'Mergulhe as pontas dos dedos por 10 minutos. Massageie o óleo restante nas cutículas e não lave as mãos por pelo menos 1 hora.',
    frequencia: '2x por semana',
  },
  {
    number: 23, name: 'Fortalecedor de Alho e Azeite',
    purpose: 'Preparo tradicional para unhas que descamam e lascam',
    ingredients: ['3 dentes de alho amassados', '4 colheres de sopa de azeite extravirgem', 'Frasco de vidro escuro'],
    modoPreparo: 'Amasse o alho e cubra com o azeite no frasco. Deixe descansar em local escuro por 7 dias, agitando uma vez por dia. Coe antes de usar.',
    formaAplicacao: 'Passe uma camada fina nas unhas limpas e sem esmalte com um pincel ou cotonete, antes de dormir.',
    frequencia: '3x por semana, em ciclos de 1 mês',
  },
  {
    number: 24, name: 'Óleo de Cutícula de Rícino e Vitamina E',
    purpose: 'Hidrata a cutícula e estimula o crescimento saudável a partir da matriz',
    ingredients: ['1 colher de sopa de óleo de rícino', '1 colher de sopa de óleo de amêndoas', '3 cápsulas de vitamina E'],
    modoPreparo: 'Perfure as cápsulas de vitamina E e esprema o conteúdo. Misture aos óleos em um frasco pequeno com conta-gotas ou pincel.',
    formaAplicacao: '1 gota na base de cada unha, massageada em movimentos circulares por 30 segundos por dedo.',
    frequencia: 'Todas as noites',
  },
  {
    number: 25, name: 'Banho de Babosa e Chá Verde',
    purpose: 'Acalma cutículas inflamadas e hidrata unhas que descamam em camadas',
    ingredients: ['200ml de chá verde morno', '2 colheres de sopa de gel de babosa puro'],
    modoPreparo: 'Prepare o chá verde, deixe amornar e dissolva o gel de babosa mexendo bem até incorporar.',
    formaAplicacao: 'Mergulhe as unhas por 10 minutos. Seque sem esfregar e finalize com o Óleo 24.',
    frequencia: '2x por semana',
  },
  {
    number: 26, name: 'Compressa de Cavalinha para Unhas Fracas',
    purpose: 'A cavalinha é uma das fontes vegetais mais concentradas de silício',
    ingredients: ['2 colheres de sopa de cavalinha seca', '300ml de água fervente'],
    modoPreparo: 'Faça uma infusão forte com a cavalinha e a água fervente. Tampe e deixe descansar por 20 minutos. Coe e espere amornar.',
    formaAplicacao: 'Mergulhe as unhas por 15 minutos. Não enxágue — apenas seque suavemente com uma toalha macia.',
    frequencia: '3x por semana',
  },
  {
    number: 27, name: 'Esfoliação de Açúcar e Azeite para as Mãos',
    purpose: 'Remove células mortas das mãos e melhora a aparência ao redor da unha',
    ingredients: ['2 colheres de sopa de açúcar cristal', '2 colheres de sopa de azeite', '1 colher de chá de mel'],
    modoPreparo: 'Misture os ingredientes até formar uma pasta granulada que não escorra.',
    formaAplicacao: 'Massageie nas mãos por 2 minutos, com atenção aos dedos e ao redor das unhas. Enxágue com água morna e aplique creme.',
    frequencia: '1x por semana',
  },
];

const foodRecipes: FoodRecipe[] = [
  {
    number: 28, name: 'Chá de Cavalinha com Hibisco',
    ingredients: ['1 colher de chá de cavalinha seca', '1 colher de chá de hibisco', '300ml de água filtrada', 'Rodela de limão (opcional)'],
    modoPreparo: 'Ferva a água, desligue o fogo e adicione as ervas. Tampe e deixe em infusão por 10 minutos. Coe antes de beber.',
    quando: '1 xícara por dia, longe das refeições principais',
    beneficio: 'A cavalinha é rica em silício, mineral que participa da formação da queratina — a proteína que estrutura tanto o cabelo quanto a unha.',
  },
  {
    number: 29, name: 'Vitamina de Aveia, Banana e Castanha',
    ingredients: ['1 banana', '3 colheres de sopa de aveia em flocos', '200ml de leite ou bebida vegetal', '2 castanhas-do-pará', '1 colher de chá de sementes de abóbora'],
    modoPreparo: 'Bata tudo no liquidificador até ficar cremoso. Sirva imediatamente para preservar os nutrientes.',
    quando: 'No café da manhã ou como lanche da tarde',
    beneficio: 'Combina biotina (aveia), selênio (castanha-do-pará) e zinco (semente de abóbora) — os três micronutrientes mais associados à saúde do fio e da unha.',
  },
  {
    number: 30, name: 'Bowl de Gergelim, Linhaça e Frutas Vermelhas',
    ingredients: ['1 pote de iogurte natural integral', '1 colher de sopa de gergelim', '1 colher de sopa de linhaça moída', '½ xícara de frutas vermelhas', '1 colher de chá de mel'],
    modoPreparo: 'Moa a linhaça na hora — moída com antecedência, ela oxida e perde o ômega-3. Monte o bowl com o iogurte na base e distribua os demais ingredientes por cima.',
    quando: 'Café da manhã ou lanche',
    beneficio: 'Ômega-3 e vitamina E combatem a inflamação do folículo, enquanto a proteína do iogurte fornece os aminoácidos que constroem a queratina.',
  },
];

const routines: Routine[] = [
  {
    tipo: 'Cabelo Fino e Ralo', emoji: '🌾',
    problema: 'Fios que afinaram com os anos e couro cabeludo cada vez mais visível',
    diario: ['Massagem Capilar 5min (Ritual 17)', 'Tônico Receita 4 (Chá Verde + Alecrim)', 'Escovação correta (Ritual 18)', 'Ritual noturno de proteção (Ritual 21)'],
    semanal: ['2x: Óleo Receita 1 (Alecrim + Coco) antes da lavagem', '1x: Máscara 16 (Feno-Grego)', 'Enxágue frio em toda lavagem (Ritual 20)'],
    mensal: ['Registrar foto da linha frontal para comparação', 'Receita 28 (Chá de Cavalinha) diariamente'],
    receitasIndicadas: 'R1, R4, R16, R17, R18, R20, R21, R28',
  },
  {
    tipo: 'Queda Acentuada', emoji: '🍂',
    problema: 'Perda de fios visível no travesseiro, no ralo e na escova',
    diario: ['Tônico Receita 4 (Chá Verde + Alecrim) no couro cabeludo', 'Massagem Capilar 5min (Ritual 17)', 'Evitar prender o cabelo apertado'],
    semanal: ['2x: Óleo Receita 1 (Alecrim + Coco)', '1x: Máscara 16 (Feno-Grego)', '1x: Óleo Receita 2 (Rícino) nas entradas'],
    mensal: ['Receitas 28 e 29 na rotina alimentar diária', 'Avaliação médica se a queda persistir por mais de 3 meses'],
    receitasIndicadas: 'R1, R2, R4, R16, R17, R28, R29',
  },
  {
    tipo: 'Cabelo Seco e Quebradiço', emoji: '🏜️',
    problema: 'Fios ásperos que arrebentam ao pentear e pontas duplas constantes',
    diario: ['Sérum Receita 5 (Jojoba) nas pontas', 'Escovação correta (Ritual 18)', 'Ritual noturno de proteção (Ritual 21)'],
    semanal: ['1x: Umectação Receita 10 (Óleo de Coco) antes da lavagem', '1x: Máscara 8 (Abacate + Azeite) com Ritual 19 (Toalha Morna)', '1x: Máscara 12 (Banana + Azeite)'],
    mensal: ['Aparar 1cm das pontas a cada 8 a 10 semanas', 'A cada 15 dias: Máscara 9 (Ovo + Iogurte)'],
    receitasIndicadas: 'R5, R8, R9, R10, R12, R18, R19, R21',
  },
  {
    tipo: 'Cabelo Grisalho e Branco', emoji: '🤍',
    problema: 'Fios mais grossos, porosos, ressecados e com tendência a amarelar',
    diario: ['Sérum Receita 5 (Jojoba) nas pontas', 'Escovação correta (Ritual 18)'],
    semanal: ['1x: Máscara 11 (Babosa + Mel)', '1x: Enxágue Receita 13 (Vinagre de Maçã) para brilho', '1x: Gel de Linhaça (Receita 15) para controlar o frizz'],
    mensal: ['Máscara 8 (Abacate) 1x ao mês para porosidade', 'Proteção solar: chapéu ou lenço em exposição prolongada'],
    receitasIndicadas: 'R5, R8, R11, R13, R15, R18',
  },
  {
    tipo: 'Couro Cabeludo Oleoso', emoji: '💧',
    problema: 'Raiz que satura em um dia enquanto o comprimento continua seco',
    diario: ['Tônico Receita 4 (Chá Verde + Alecrim)', 'Massagem Capilar 5min (Ritual 17)', 'Evitar tocar e coçar o couro cabeludo'],
    semanal: ['1x: Máscara 11 (Babosa + Mel) somente no comprimento', '1x: Enxágue Receita 13 (Vinagre de Maçã)', 'Enxágue frio em toda lavagem (Ritual 20)'],
    mensal: ['A cada 15 dias: Máscara 14 (Argila Verde) apenas na raiz'],
    receitasIndicadas: 'R4, R11, R13, R14, R17, R20',
  },
  {
    tipo: 'Unhas Fracas e Descamando', emoji: '💅',
    problema: 'Unhas que lascam em camadas, quebram na ponta e não crescem',
    diario: ['Óleo Receita 24 (Rícino + Vitamina E) na cutícula à noite', 'Usar luvas para lavar louça e limpar a casa'],
    semanal: ['2x: Banho Receita 22 (Azeite Morno)', '3x: Compressa Receita 26 (Cavalinha)', '1x: Esfoliação Receita 27 (Açúcar + Azeite)'],
    mensal: ['1 mês de Receita 23 (Alho + Azeite), seguido de 1 mês de pausa', 'Manter as unhas curtas durante a fase de recuperação'],
    receitasIndicadas: 'R22, R23, R24, R26, R27, R28, R29',
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
      style={{ background: color ?? C.amberLight, color: C.amber, border: `1px solid ${C.amberBorder}` }}
    >
      {children}
    </span>
  );
}

function Label({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <div className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.15em]" style={{ color: color ?? C.amber }}>
      {children}
    </div>
  );
}

function InfoBox({ children, variant = 'amber' }: { children: ReactNode; variant?: 'amber' | 'olive' | 'plum' }) {
  const map = {
    amber: { bg: C.amberLight, border: C.amberBorder, color: C.amber },
    olive: { bg: C.oliveLight, border: C.oliveBorder, color: C.olive },
    plum:  { bg: C.plumLight,  border: C.plumBorder,  color: C.plum },
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
          <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full" style={{ background: color ?? C.amber }} aria-hidden />
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
            style={{ background: color ?? C.amber }}
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
        style={{ background: color ?? C.amber }}
      >
        {number}
      </div>
      <div className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: color ?? C.amber }}>
        {title}
      </div>
    </div>
  );
}

function RecipeNumber({ n, color }: { n: number; color?: string }) {
  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
      style={{ background: color ?? C.amber }}
    >
      {n}
    </span>
  );
}

// ── Cards ─────────────────────────────────────────────────────────────────

function HairOilCard({ recipe }: { recipe: HairOil }) {
  return (
    <div className="avoid-page-break flex-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2.5 border-b border-gray-100 pb-3">
        <RecipeNumber n={recipe.number} />
        <h4 className="font-display text-[1.05rem] font-semibold leading-tight" style={{ color: C.dark }}>
          {recipe.name}
        </h4>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="rounded-xl px-3.5 py-2.5" style={{ background: C.amberLight }}>
          <Label>Ingredientes</Label>
          <BulletList items={recipe.ingredients} />
        </div>
        <div>
          <Label>Modo de Preparo</Label>
          <p className="text-[13px] leading-snug text-foreground/85">{recipe.modoPreparo}</p>
        </div>
        <div>
          <Label color={C.olive}>Como Aplicar</Label>
          <p className="text-[13px] leading-snug text-foreground/85">{recipe.formaAplicacao}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg px-3 py-2" style={{ background: C.oliveLight }}>
            <Label color={C.olive}>Frequência</Label>
            <p className="text-[12px] font-semibold" style={{ color: C.olive }}>{recipe.frequencia}</p>
          </div>
          <div className="rounded-lg px-3 py-2" style={{ background: C.plumLight }}>
            <Label color={C.plum}>Validade</Label>
            <p className="text-[12px] font-semibold" style={{ color: C.plum }}>{recipe.validade}</p>
          </div>
        </div>
        <Tag>{recipe.indicadoPara}</Tag>
      </div>
    </div>
  );
}

function HairMaskCard({ recipe }: { recipe: HairMask }) {
  return (
    <div className="avoid-page-break flex-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2.5 border-b border-gray-100 pb-3">
        <RecipeNumber n={recipe.number} color={C.olive} />
        <h4 className="font-display text-[1.05rem] font-semibold leading-tight" style={{ color: C.dark }}>
          {recipe.name}
        </h4>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="rounded-xl px-3.5 py-2.5" style={{ background: C.oliveLight }}>
          <Label color={C.olive}>Ingredientes</Label>
          <BulletList items={recipe.ingredients} color={C.olive} />
        </div>
        <div>
          <Label color={C.olive}>Modo de Preparo</Label>
          <p className="text-[13px] leading-snug text-foreground/85">{recipe.modoPreparo}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg px-3 py-2" style={{ background: C.amberLight }}>
            <Label>Tempo de Ação</Label>
            <p className="text-[12px] font-semibold" style={{ color: C.amber }}>{recipe.tempoAplicacao}</p>
          </div>
          <div className="rounded-lg px-3 py-2" style={{ background: C.plumLight }}>
            <Label color={C.plum}>Frequência</Label>
            <p className="text-[12px] font-semibold" style={{ color: C.plum }}>{recipe.frequenciaSemanal}</p>
          </div>
        </div>
        <InfoBox variant="olive">
          <strong>Resultado esperado:</strong> {recipe.resultadoEsperado}
        </InfoBox>
        <Tag color={C.oliveLight}>{recipe.indicadoPara}</Tag>
      </div>
    </div>
  );
}

function ScalpRitualCard({ ritual }: { ritual: ScalpRitual }) {
  return (
    <div className="avoid-page-break rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2.5 border-b border-gray-100 pb-3">
        <RecipeNumber n={ritual.number} color={C.amberMd} />
        <h4 className="font-display text-[1.05rem] font-semibold leading-tight" style={{ color: C.dark }}>
          {ritual.name}
        </h4>
      </div>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg px-3 py-2" style={{ background: C.amberLight }}>
            <Label>Duração</Label>
            <p className="text-[12px] font-semibold" style={{ color: C.amber }}>{ritual.duracao}</p>
          </div>
          <div className="rounded-lg px-3 py-2" style={{ background: C.oliveLight }}>
            <Label color={C.olive}>Frequência</Label>
            <p className="text-[12px] font-semibold" style={{ color: C.olive }}>{ritual.frequencia}</p>
          </div>
        </div>
        <InfoBox variant="amber">
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

function NailCard({ recipe }: { recipe: NailRecipe }) {
  return (
    <div className="avoid-page-break flex-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start gap-2.5 border-b border-gray-100 pb-3">
        <RecipeNumber n={recipe.number} color={C.plum} />
        <div>
          <h4 className="font-display text-[1.05rem] font-semibold leading-tight" style={{ color: C.dark }}>
            {recipe.name}
          </h4>
          <p className="mt-0.5 text-[12px] italic" style={{ color: C.plum }}>{recipe.purpose}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="rounded-xl px-3.5 py-2.5" style={{ background: C.plumLight }}>
          <Label color={C.plum}>Ingredientes</Label>
          <BulletList items={recipe.ingredients} color={C.plum} />
        </div>
        <div>
          <Label color={C.plum}>Modo de Preparo</Label>
          <p className="text-[13px] leading-snug text-foreground/85">{recipe.modoPreparo}</p>
        </div>
        <div>
          <Label color={C.plum}>Como Aplicar</Label>
          <p className="text-[13px] leading-snug text-foreground/85">{recipe.formaAplicacao}</p>
        </div>
        <div className="rounded-lg px-3 py-2" style={{ background: C.amberLight }}>
          <Label>Frequência</Label>
          <p className="text-[12px] font-semibold" style={{ color: C.amber }}>{recipe.frequencia}</p>
        </div>
      </div>
    </div>
  );
}

function FoodRecipeCard({ recipe }: { recipe: FoodRecipe }) {
  return (
    <div className="avoid-page-break rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2.5 border-b border-gray-100 pb-3">
        <RecipeNumber n={recipe.number} color={C.olive} />
        <h4 className="font-display text-[1.1rem] font-semibold leading-tight" style={{ color: C.dark }}>
          {recipe.name}
        </h4>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl px-3.5 py-3" style={{ background: C.oliveLight }}>
          <Label color={C.olive}>Ingredientes</Label>
          <BulletList items={recipe.ingredients} color={C.olive} />
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <Label color={C.olive}>Modo de Preparo</Label>
            <p className="text-[13px] leading-snug text-foreground/85">{recipe.modoPreparo}</p>
          </div>
          <div className="rounded-xl px-3.5 py-2.5" style={{ background: C.amberLight }}>
            <Label>Quando Consumir</Label>
            <p className="text-[12px]" style={{ color: C.amber }}>{recipe.quando}</p>
          </div>
        </div>
      </div>
      <InfoBox variant="olive">
        <strong>Por que funciona:</strong> {recipe.beneficio}
      </InfoBox>
    </div>
  );
}

function RoutineCard({ routine }: { routine: Routine }) {
  return (
    <div className="avoid-page-break rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 border-b border-gray-100 pb-3">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xl">{routine.emoji}</span>
          <h4 className="font-display text-[1.12rem] font-bold" style={{ color: C.dark }}>{routine.tipo}</h4>
        </div>
        <p className="text-[12.5px] italic" style={{ color: C.muted }}>{routine.problema}</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { titulo: 'Diário', itens: routine.diario, cor: C.amber },
          { titulo: 'Semanal', itens: routine.semanal, cor: C.olive },
          { titulo: 'Mensal', itens: routine.mensal, cor: C.plum },
        ].map((col) => (
          <div key={col.titulo}>
            <div className="mb-2 flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ background: col.cor }} />
              <Label color={col.cor}>{col.titulo}</Label>
            </div>
            <div className="space-y-1.5">
              {col.itens.map((s, i) => (
                <p key={i} className="text-[12px] leading-snug text-foreground/80">{s}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg px-3 py-2" style={{ background: C.amberLight }}>
        <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: C.amber }}>Receitas indicadas: </span>
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
      style={{ backgroundImage: 'url(/capa-raiz.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    />
  );
}

// ── EbookDezoito ──────────────────────────────────────────────────────────

export default function EbookDezoito() {
  return (
    <>
      <Cover />

      {/* Página 2 — Apresentação */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Introdução"
        title="Não é só a pele que muda depois dos 50"
        subtitle="O cabelo afina, a unha lasca e quase ninguém explica por quê. Este guia explica — e mostra o que fazer com o que você já tem em casa."
      >
        <div className="space-y-3.5">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            A maioria das mulheres percebe primeiro no rabo de cavalo: ele foi ficando mais fino.
            Depois vem a unha que lasca em camadas, o fio que arrebenta ao pentear, o couro cabeludo
            que aparece na risca. Nada disso é falta de cuidado — é biologia.
          </p>
          <InfoBox variant="amber">
            Cabelo e unha são feitos da mesma proteína: <strong>queratina</strong>. Quando o corpo passa
            a produzir menos, os dois enfraquecem juntos. É por isso que tratar um sem o outro raramente
            funciona — e é por isso que este guia trata os dois no mesmo método.
          </InfoBox>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            As receitas aqui usam ingredientes de supermercado e feira. Nenhuma exige produto importado,
            aparelho ou conhecimento técnico. O que elas exigem é constância — e é exatamente sobre isso
            que os módulos finais tratam.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-1">
            {[
              { n: '30', label: 'Receitas e rituais caseiros' },
              { n: '6', label: 'Rotinas prontas por tipo' },
              { n: '0', label: 'Produtos industrializados necessários' },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl p-4 text-center" style={{ background: C.amberLight }}>
                <p className="font-display text-[2.2rem] font-black" style={{ color: C.amber }}>{s.n}</p>
                <p className="text-[11px] leading-snug" style={{ color: C.muted }}>{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[13px] leading-relaxed text-foreground/80">
            Comece pelo Módulo 2 e identifique o seu caso. A partir daí, o Módulo 8 já entrega a rotina
            pronta — sem que você precise montar nada sozinha.
          </p>
        </div>
      </PdfContentPage>

      {/* Página 3 — Sumário */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Estrutura do Guia"
        title="O que você vai encontrar aqui"
        subtitle="10 módulos + 6 bônus organizados do diagnóstico à rotina pronta."
      >
        <div className="grid grid-cols-2 gap-3">
          {[
            { mod: 'Módulo 1', titulo: 'Por Que Cabelo e Unhas Mudam Após os 50', cor: C.amber },
            { mod: 'Módulo 2', titulo: 'Diagnóstico: Identifique o Seu Caso', cor: C.plum },
            { mod: 'Módulo 3', titulo: 'Óleos e Tônicos Capilares (R1–R7)', cor: C.amber },
            { mod: 'Módulo 4', titulo: 'Máscaras e Umectações (R8–R16)', cor: C.olive },
            { mod: 'Módulo 5', titulo: 'Rituais de Couro Cabeludo (R17–R21)', cor: C.amberMd },
            { mod: 'Módulo 6', titulo: 'O Protocolo das Unhas (R22–R27)', cor: C.plum },
            { mod: 'Módulo 7', titulo: 'Alimentação para Fios e Unhas (R28–R30)', cor: C.olive },
            { mod: 'Módulo 8', titulo: '6 Rotinas Prontas Por Tipo', cor: C.amber },
            { mod: 'Módulo 9', titulo: 'Calendário de 12 Semanas', cor: C.plum },
            { mod: 'Módulo 10', titulo: 'Diário de Acompanhamento de 8 Semanas', cor: C.olive },
          ].map((item) => (
            <div key={item.mod} className="flex gap-2.5 rounded-xl p-3" style={{ background: C.amberLight }}>
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ background: item.cor }} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: item.cor }}>{item.mod}</p>
                <p className="text-[12.5px] font-medium leading-snug" style={{ color: C.dark }}>{item.titulo}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl px-4 py-3" style={{ background: C.oliveLight, borderLeft: `3px solid ${C.oliveBorder}` }}>
          <p className="text-[12px]" style={{ color: C.olive }}>
            <strong>+6 Bônus:</strong> Rotina com R$0 · Ritual de 10 Minutos · Lista de Compras ·
            Cabelo Grisalho · Erros que Quebram o Fio · Guia das Mãos
          </p>
        </div>
      </PdfContentPage>

      {/* Página 4 — Módulo 1, parte 1 */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Módulo 1"
        title="O que acontece com o cabelo depois dos 50"
        subtitle="Três mudanças simultâneas que explicam quase tudo o que você está vendo no espelho."
      >
        <ModuleBadge number={1} title="Por que cabelo e unhas mudam" />
        <div className="space-y-3.5">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            O cabelo não cai de uma vez. Ele passa por um processo silencioso que começa anos antes de
            ficar visível — e entender esse processo muda a forma como você cuida dele.
          </p>
          <div className="space-y-2.5">
            {[
              {
                titulo: 'A miniaturização do fio',
                texto: 'Com a queda do estrogênio na menopausa, cada novo fio nasce um pouco mais fino que o anterior. Você não perde a quantidade de fios de uma vez — perde a espessura de cada um. Por isso o rabo de cavalo afina antes de o couro cabeludo aparecer.',
                cor: C.amber,
              },
              {
                titulo: 'O encurtamento da fase de crescimento',
                texto: 'Cada fio passa anos em fase de crescimento antes de cair naturalmente. Após os 50, essa fase encurta. O fio cai mais cedo e volta menor, o que reduz o comprimento máximo que o cabelo consegue atingir.',
                cor: C.olive,
              },
              {
                titulo: 'A queda na produção de sebo',
                texto: 'As glândulas do couro cabeludo produzem menos óleo natural. Esse óleo era o que protegia e lubrificava o comprimento. Sem ele, o fio fica áspero, poroso e quebra com muito mais facilidade.',
                cor: C.plum,
              },
            ].map((item) => (
              <div key={item.titulo} className="rounded-xl bg-white p-3.5" style={{ borderLeft: `3px solid ${item.cor}` }}>
                <p className="mb-1 text-[12px] font-bold" style={{ color: item.cor }}>{item.titulo}</p>
                <p className="text-[13px] leading-snug text-foreground/85">{item.texto}</p>
              </div>
            ))}
          </div>
          <InfoBox variant="plum">
            É por isso que produto sozinho não resolve: a mudança começa no folículo, e o folículo
            responde a estímulo (massagem, circulação) e a nutriente — não a espuma.
          </InfoBox>
        </div>
      </PdfContentPage>

      {/* Página 5 — Módulo 1, parte 2 */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Módulo 1"
        title="As unhas contam a mesma história"
        subtitle="E os três princípios que sustentam todo o método deste guia."
      >
        <div className="space-y-3.5">
          <div className="rounded-2xl bg-white p-4">
            <Label color={C.plum}>O que muda nas unhas após os 50</Label>
            <div className="mt-2 space-y-1.5">
              {[
                'O crescimento desacelera — a unha leva mais tempo para se renovar por completo',
                'A matriz produz queratina em camadas menos coesas, o que causa a descamação em folhas',
                'A retenção de água na lâmina diminui, deixando a unha rígida e quebradiça',
                'Sulcos verticais aparecem e se tornam permanentes — são normais e não indicam doença',
              ].map((item, i) => (
                <div key={i} className="flex gap-2 text-[13px] leading-snug text-foreground/85">
                  <span className="mt-0.5 text-[11px]" style={{ color: C.plum }}>→</span>{item}
                </div>
              ))}
            </div>
          </div>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Todas as receitas deste guia se apoiam em três princípios. Eles explicam por que o método
            funciona quando seguido — e por que não funciona quando aplicado pela metade:
          </p>
          <div className="space-y-2.5">
            {[
              {
                num: '01', titulo: 'Estímulo antes de produto',
                texto: 'Circulação no couro cabeludo é o que leva nutriente ao folículo. Cinco minutos de massagem diária valem mais que qualquer frasco aplicado sobre um couro cabeludo parado.',
                cor: C.amber,
              },
              {
                num: '02', titulo: 'Nutrição de dentro e de fora',
                texto: 'Queratina é proteína. Sem os aminoácidos, o zinco e o silício vindos da alimentação, nenhuma máscara constrói fio novo — ela apenas melhora o que já nasceu.',
                cor: C.olive,
              },
              {
                num: '03', titulo: 'Menos agressão, mais preservação',
                texto: 'Depois dos 50, metade do resultado vem de parar de quebrar o que você já tem: calor excessivo, elástico apertado, escovação errada e toalha felpuda.',
                cor: C.plum,
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

      {/* Página 6 — Módulo 2: Diagnóstico */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Módulo 2"
        title="Identifique o seu caso antes de começar"
        subtitle="Dois testes simples que você faz em casa hoje e que definem qual rotina do Módulo 8 seguir."
      >
        <div className="space-y-3">
          <div className="rounded-2xl bg-white p-4">
            <Label>Teste 1 — A espessura do rabo de cavalo</Label>
            <p className="mt-1 text-[13px] leading-snug text-foreground/85">
              Prenda todo o cabelo em um rabo de cavalo e meça a circunferência com uma fita métrica
              logo acima do elástico. Anote o número e a data. Repita a cada 8 semanas: esse é o único
              jeito caseiro confiável de saber se você está ganhando ou perdendo densidade, porque a
              mudança é lenta demais para o olho perceber.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <Label color={C.plum}>Teste 2 — A flexibilidade da unha</Label>
            <p className="mt-1 text-[13px] leading-snug text-foreground/85">
              Pressione suavemente a ponta livre da unha contra a mesa. Se ela dobra e volta, está
              saudável. Se dobra e fica marcada, está mole — falta proteína. Se lasca ou racha sem
              dobrar, está seca e quebradiça — falta óleo e hidratação. O tratamento é diferente para
              cada caso.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {routines.map((r) => (
              <div key={r.tipo} className="flex items-center gap-2 rounded-xl p-3" style={{ background: C.amberLight }}>
                <span className="text-lg">{r.emoji}</span>
                <div>
                  <p className="text-[12.5px] font-bold" style={{ color: C.dark }}>{r.tipo}</p>
                  <p className="text-[11px]" style={{ color: C.muted }}>{r.receitasIndicadas}</p>
                </div>
              </div>
            ))}
          </div>
          <InfoBox variant="olive">
            <strong>Pode haver mais de um:</strong> couro cabeludo oleoso com comprimento seco é a
            combinação mais comum após os 50. Nesse caso, siga a rotina do couro cabeludo na raiz e a
            do cabelo seco no comprimento.
          </InfoBox>
        </div>
      </PdfContentPage>

      {/* Módulo 3 — Óleos e Tônicos */}
      {chunk(hairOils, 2).map((pair, i) => (
        <PdfContentPage accentGradient={ACCENT}
          key={`oil-${i}`}
          kicker="Módulo 3 · Óleos e Tônicos"
          title="Óleos e Tônicos Capilares Caseiros"
          subtitle={i === 0 ? 'A base do método: o que age diretamente no couro cabeludo e no folículo.' : undefined}
        >
          <div className="flex flex-1 flex-col gap-4">
            {pair.map((r) => <HairOilCard key={r.number} recipe={r} />)}
          </div>
          {i === 0 && (
            <InfoBox variant="plum">
              <strong>Regra de segurança:</strong> óleo essencial nunca vai puro no couro cabeludo.
              Sempre diluído em um óleo vegetal (coco, amêndoas, jojoba) e sempre com teste de contato
              no antebraço 24 horas antes do primeiro uso.
            </InfoBox>
          )}
        </PdfContentPage>
      ))}

      {/* Módulo 4 — Máscaras */}
      {chunk(hairMasks, 2).map((pair, i) => (
        <PdfContentPage accentGradient={ACCENT}
          key={`mask-${i}`}
          kicker="Módulo 4 · Máscaras e Umectações"
          title="Máscaras e Umectações Caseiras"
          subtitle={i === 0 ? 'O tratamento do comprimento — o que devolve maciez, brilho e resistência ao fio.' : undefined}
        >
          <div className="flex flex-1 flex-col gap-4">
            {pair.map((r) => <HairMaskCard key={r.number} recipe={r} />)}
          </div>
        </PdfContentPage>
      ))}

      {/* Módulo 5 — Rituais de couro cabeludo */}
      {chunk(scalpRituals, 2).map((pair, i) => (
        <PdfContentPage accentGradient={ACCENT}
          key={`ritual-${i}`}
          kicker="Módulo 5 · Rituais de Couro Cabeludo"
          title="Os Rituais Que Não Custam Nada"
          subtitle={i === 0 ? 'Técnicas físicas sem nenhum ingrediente — e responsáveis por boa parte do resultado.' : undefined}
        >
          <div className="flex flex-col gap-4">
            {pair.map((r) => <ScalpRitualCard key={r.number} ritual={r} />)}
          </div>
        </PdfContentPage>
      ))}

      {/* Módulo 6 — Unhas */}
      {chunk(nailRecipes, 2).map((pair, i) => (
        <PdfContentPage accentGradient={ACCENT}
          key={`nail-${i}`}
          kicker="Módulo 6 · O Protocolo das Unhas"
          title="O Protocolo Completo das Unhas"
          subtitle={i === 0 ? 'A unha leva de 4 a 6 meses para se renovar por inteiro. Constância aqui importa mais do que em qualquer outro módulo.' : undefined}
        >
          <div className="flex flex-1 flex-col gap-4">
            {pair.map((r) => <NailCard key={r.number} recipe={r} />)}
          </div>
          {i === 0 && (
            <InfoBox variant="plum">
              <strong>O passo que quase ninguém dá:</strong> use luvas para lavar louça e limpar a casa.
              Detergente e água quente removem os óleos naturais da unha, e nenhuma receita compensa
              essa agressão diária.
            </InfoBox>
          )}
        </PdfContentPage>
      ))}

      {/* Módulo 7 — Alimentação (texto) */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Módulo 7 · Alimentação"
        title="Fio e unha se constroem no prato"
        subtitle="Nenhuma máscara cria fio novo. O que cria é o que chega ao folículo pelo sangue."
      >
        <div className="space-y-3.5">
          <InfoBox variant="olive">
            Cabelo e unha não são órgãos vitais. Quando falta nutriente, o corpo prioriza coração,
            cérebro e músculo — e corta o fornecimento para eles primeiro. É por isso que os dois são
            os primeiros a denunciar uma deficiência nutricional.
          </InfoBox>
          <div className="rounded-2xl bg-white p-4">
            <Label color={C.olive}>Os 5 nutrientes que mais importam</Label>
            <div className="mt-2 space-y-2">
              {[
                { n: 'Proteína', d: 'A matéria-prima da queratina. Sem ela, nada mais funciona.', f: 'Ovos, peixe, frango, feijão, lentilha, iogurte' },
                { n: 'Ferro', d: 'A deficiência mais associada à queda difusa em mulheres. Vale investigar com exame.', f: 'Carne vermelha magra, feijão, folhas verde-escuras' },
                { n: 'Zinco', d: 'Participa da multiplicação celular no folículo e da cicatrização da matriz da unha.', f: 'Sementes de abóbora, castanhas, frutos do mar, carne' },
                { n: 'Biotina', d: 'Vitamina do complexo B ligada diretamente à formação de queratina.', f: 'Ovos, aveia, amendoim, banana, batata-doce' },
                { n: 'Silício', d: 'Dá estrutura e resistência ao fio e à lâmina da unha.', f: 'Cavalinha, aveia, banana, cereais integrais' },
              ].map((item) => (
                <div key={item.n} className="rounded-lg px-3 py-2" style={{ background: C.oliveLight }}>
                  <p className="text-[12px] font-bold" style={{ color: C.olive }}>{item.n}</p>
                  <p className="text-[12px] leading-snug text-foreground/85">{item.d}</p>
                  <p className="mt-0.5 text-[11px] italic" style={{ color: C.muted }}>Fontes: {item.f}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <Label>O que atrapalha</Label>
            <div className="mt-2 space-y-1.5">
              {[
                'Dietas muito restritivas — a queda costuma aparecer 2 a 3 meses depois do início',
                'Pouca proteína no café da manhã — a maior lacuna alimentar da maioria das mulheres',
                'Excesso de álcool — prejudica a absorção de zinco e vitaminas do complexo B',
              ].map((item, i) => (
                <div key={i} className="flex gap-2 text-[13px] leading-snug text-foreground/85">
                  <span className="mt-0.5 text-[11px]" style={{ color: C.plum }}>✗</span>{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </PdfContentPage>

      {/* Módulo 7 — Receitas de alimentação */}
      {foodRecipes.map((recipe, i) => (
        <PdfContentPage accentGradient={ACCENT}
          key={`food-${i}`}
          kicker="Módulo 7 · Alimentação"
          title={i === 0 ? 'As Receitas de Dentro Para Fora' : 'Receitas de Dentro Para Fora'}
          subtitle={i === 0 ? 'Três preparos simples que cobrem os principais nutrientes do fio e da unha.' : undefined}
        >
          <FoodRecipeCard recipe={recipe} />
          {i === 0 && (
            <InfoBox variant="amber">
              <strong>Atenção:</strong> a cavalinha tem ação diurética. Não use de forma contínua por mais
              de 30 dias seguidos, e evite se você faz uso de diurético, tem pressão baixa ou problema renal.
            </InfoBox>
          )}
          {i === 1 && (
            <InfoBox variant="plum">
              <strong>Sobre a castanha-do-pará:</strong> duas unidades por dia já cobrem a necessidade
              diária de selênio. Mais que isso não traz benefício adicional e o excesso é prejudicial —
              essa é uma das poucas receitas em que a dose importa.
            </InfoBox>
          )}
          {i === 2 && (
            <InfoBox variant="olive">
              <strong>O detalhe que muda tudo:</strong> linhaça inteira passa pelo intestino sem ser
              aproveitada. Ela precisa estar moída — e moída na hora, porque oxida em poucos dias.
            </InfoBox>
          )}
        </PdfContentPage>
      ))}

      {/* Módulo 8 — Rotinas */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Módulo 8 · Rotinas Prontas"
        title="6 Rotinas Completas Por Tipo"
        subtitle="Nada para montar — apenas seguir. Cada rotina usa somente receitas dos módulos anteriores."
      >
        <div className="space-y-3.5">
          <InfoBox variant="amber">
            <strong>Como usar este módulo:</strong> escolha a rotina que corresponde ao resultado dos
            testes do Módulo 2. Siga por 8 semanas antes de julgar o resultado — é o tempo mínimo para
            o fio novo crescer o suficiente para ser visível.
          </InfoBox>
          <div className="grid grid-cols-2 gap-2.5">
            {routines.map((r) => (
              <div key={r.tipo} className="rounded-xl p-3" style={{ background: C.amberLight }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{r.emoji}</span>
                  <p className="text-[12.5px] font-bold" style={{ color: C.dark }}>{r.tipo}</p>
                </div>
                <p className="mt-1 text-[11.5px] leading-snug" style={{ color: C.muted }}>{r.problema}</p>
              </div>
            ))}
          </div>
          <p className="text-[13px] leading-relaxed text-foreground/80">
            Não tente aplicar tudo na primeira semana. Comece pelos itens da coluna "Diário" — eles são
            os de maior impacto e menor esforço. Adicione a coluna "Semanal" a partir da terceira semana.
          </p>
        </div>
      </PdfContentPage>

      {routines.map((routine, i) => (
        <PdfContentPage accentGradient={ACCENT}
          key={`routine-${i}`}
          kicker={`Módulo 8 · Rotina ${i + 1} de 6`}
          title={routine.tipo}
          subtitle={routine.problema}
        >
          <RoutineCard routine={routine} />
          <InfoBox variant={i % 3 === 0 ? 'amber' : i % 3 === 1 ? 'olive' : 'plum'}>
            <strong>Dica:</strong> fotografe a mesma área, com a mesma luz e no mesmo ângulo, a cada 4
            semanas. A mudança é gradual demais para a memória registrar — a foto é o que mostra o
            progresso real.
          </InfoBox>
        </PdfContentPage>
      ))}

      {/* Módulo 9 — Calendário */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Módulo 9 · Calendário"
        title="Calendário de 12 Semanas"
        subtitle="A ordem importa: cada fase prepara a seguinte e respeita o tempo de resposta do folículo."
      >
        <div className="space-y-1.5">
          {[
            { semanas: 'Semanas 1–2', foco: 'Adaptação e estímulo', seg: 'Massagem (R17)', qua: 'Óleo R1', sex: 'Máscara R11', obs: 'Só o básico. O couro cabeludo precisa se acostumar.' },
            { semanas: 'Semanas 3–4', foco: 'Nutrição do comprimento', seg: 'Massagem (R17)', qua: 'Óleo R1', sex: 'Máscara R8', obs: 'Introduza o Ritual 19 (Toalha Morna).' },
            { semanas: 'Semanas 5–6', foco: 'Força e proteína', seg: 'Massagem (R17)', qua: 'Óleo R2', sex: 'Máscara R9', obs: 'Máscara de proteína só a cada 15 dias.' },
            { semanas: 'Semanas 7–8', foco: 'Raiz e densidade', seg: 'Massagem (R17)', qua: 'Óleo R1', sex: 'Máscara R16', obs: 'Refaça o teste do rabo de cavalo e compare.' },
            { semanas: 'Semanas 9–10', foco: 'Brilho e selagem', seg: 'Massagem (R17)', qua: 'Tônico R3', sex: 'Enxágue R13', obs: 'Primeira fase em que o brilho fica evidente.' },
            { semanas: 'Semanas 11–12', foco: 'Manutenção definitiva', seg: 'Massagem (R17)', qua: 'Óleo R1', sex: 'Máscara R11', obs: 'Sua rotina permanente começa aqui.' },
          ].map((row) => (
            <div key={row.semanas} className="rounded-xl bg-white px-3 py-2">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-[11.5px] font-bold" style={{ color: C.amber }}>{row.semanas}</p>
                <p className="text-[10.5px] italic" style={{ color: C.muted }}>{row.foco}</p>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                <div className="rounded-lg px-2 py-1" style={{ background: C.amberLight }}>
                  <p className="font-bold leading-tight" style={{ color: C.amber }}>Diário</p>
                  <p className="leading-tight" style={{ color: C.dark }}>{row.seg}</p>
                </div>
                <div className="rounded-lg px-2 py-1" style={{ background: C.oliveLight }}>
                  <p className="font-bold leading-tight" style={{ color: C.olive }}>Pré-lavagem</p>
                  <p className="leading-tight" style={{ color: C.dark }}>{row.qua}</p>
                </div>
                <div className="rounded-lg px-2 py-1" style={{ background: C.plumLight }}>
                  <p className="font-bold leading-tight" style={{ color: C.plum }}>Pós-lavagem</p>
                  <p className="leading-tight" style={{ color: C.dark }}>{row.sex}</p>
                </div>
                <div className="rounded-lg px-2 py-1" style={{ background: 'hsl(0 0% 97%)' }}>
                  <p className="font-bold leading-tight text-foreground/50">Obs</p>
                  <p className="leading-tight text-foreground/70">{row.obs}</p>
                </div>
              </div>
            </div>
          ))}
          <InfoBox variant="plum">
            <strong>O erro mais comum:</strong> desistir na semana 4. O fio que você vê hoje foi formado
            há meses — o resultado do que você começa hoje só aparece a partir da oitava semana.
          </InfoBox>
        </div>
      </PdfContentPage>

      {/* Módulo 10 — Diário */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Módulo 10 · Diário"
        title="Diário de Acompanhamento — 8 Semanas"
        subtitle="A mudança é gradual demais para a memória perceber. O registro é o que mostra o progresso."
      >
        <div className="space-y-1.5">
          <div className="rounded-2xl bg-white p-2.5">
            <Label>Avaliação Inicial — Antes de Começar</Label>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              {['Circunferência do rabo de cavalo (cm)', 'Queda diária percebida (1–10)', 'Brilho dos fios (1–10)', 'Maciez ao toque (1–10)', 'Resistência da unha (1–10)', 'Crescimento da unha (1–10)'].map((item) => (
                <div key={item} className="rounded-lg px-2.5 py-1" style={{ background: C.amberLight }}>
                  <p className="text-[10px] leading-tight text-foreground/70">{item}</p>
                  <div className="mt-1 h-px w-full" style={{ background: C.amberBorder }} />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-stretch gap-1.5 rounded-xl bg-white px-2.5 py-1.5">
                <div className="w-[74px] shrink-0 self-center">
                  <p className="text-[11.5px] font-bold leading-tight" style={{ color: C.amber }}>Semana {i + 1}</p>
                  <p className="text-[9px] leading-tight" style={{ color: C.muted }}>___/___/___</p>
                </div>
                <div className="grid flex-1 grid-cols-3 gap-1.5">
                  {[
                    { l: 'Receitas usadas', bg: C.amberLight, cor: C.amber, borda: C.amberBorder },
                    { l: 'O que notei', bg: C.oliveLight, cor: C.olive, borda: C.oliveBorder },
                    { l: 'Ajustes', bg: C.plumLight, cor: C.plum, borda: C.plumBorder },
                  ].map((f) => (
                    <div key={f.l} className="rounded-lg px-2 py-1" style={{ background: f.bg }}>
                      <p className="text-[9px] font-bold uppercase tracking-wide leading-tight" style={{ color: f.cor }}>{f.l}</p>
                      <div className="mt-1 h-3.5 border-b" style={{ borderColor: f.borda }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PdfContentPage>

      {/* Bônus 1 e 2 */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Bônus Exclusivos"
        title="Bônus 1 — Rotina Completa com R$0"
        subtitle="Só o que já existe na sua cozinha e nas suas mãos. Nenhuma compra necessária."
      >
        <div className="space-y-3.5">
          <div className="grid grid-cols-3 gap-3">
            {[
              { periodo: 'Todo dia', cor: C.amber, steps: ['Massagem Capilar 5min (Ritual 17)', 'Escovação correta (Ritual 18)', 'Ritual noturno (Ritual 21)'] },
              { periodo: 'Toda lavagem', cor: C.olive, steps: ['Enxágue Final Frio (Ritual 20)', 'Enxágue R13 (Vinagre de Maçã diluído)'] },
              { periodo: 'Semanal', cor: C.plum, steps: ['Umectação R10 (Óleo de Coco)', 'Banho de unhas R22 (Azeite Morno)', 'Máscara R12 (Banana + Azeite)'] },
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
              <div className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white" style={{ background: C.amberMd }}>
                Bônus 2
              </div>
              <p className="font-display text-[1.1rem] font-semibold" style={{ color: C.dark }}>
                O Ritual de 10 Minutos Para a Semana Corrida
              </p>
            </div>
            <p className="mb-3 text-[13px]" style={{ color: C.muted }}>
              A versão mínima do método — para quando a semana não deixa espaço para nada além do essencial.
            </p>
            <div className="space-y-1.5">
              {[
                { t: '00:00–05:00', a: 'Massagem Capilar (Ritual 17) — o item de maior retorno do guia' },
                { t: '05:00–06:00', a: 'Tônico R4 (Chá Verde + Alecrim) borrifado no couro cabeludo' },
                { t: '06:00–08:00', a: 'Óleo de cutícula R24 nas dez unhas, uma a uma' },
                { t: '08:00–09:00', a: 'Sérum R5 (Jojoba) apenas nas pontas' },
                { t: '09:00–10:00', a: 'Trança frouxa ou coque solto para dormir (Ritual 21)' },
              ].map((s) => (
                <div key={s.t} className="flex items-start gap-3 text-[13px]">
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: C.amberLight, color: C.amber }}>
                    {s.t}
                  </span>
                  <span className="leading-snug text-foreground/85">{s.a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PdfContentPage>

      {/* Bônus 3 e 4 */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Bônus 3 e 4"
        title="Bônus 3 — Lista de Compras"
        subtitle="Tudo o que o guia inteiro utiliza, organizado por seção do mercado."
      >
        <div className="space-y-3.5">
          <div className="grid grid-cols-3 gap-2">
            {[
              { secao: 'Hortifrúti', items: ['Abacate', 'Banana', 'Alho', 'Limão', 'Frutas vermelhas'] },
              { secao: 'Grãos e Sementes', items: ['Aveia em flocos', 'Linhaça', 'Gergelim', 'Sementes de abóbora', 'Castanha-do-pará', 'Feno-grego'] },
              { secao: 'Laticínios e Ovos', items: ['Iogurte natural integral', 'Ovos', 'Leite', 'Mel'] },
              { secao: 'Óleos', items: ['Óleo de coco virgem', 'Azeite extravirgem', 'Óleo de rícino', 'Óleo de amêndoas', 'Óleo de jojoba', 'Óleo de gergelim'] },
              { secao: 'Farmácia / Empório', items: ['Óleo essencial de alecrim', 'Gel de babosa', 'Vitamina E (cápsulas)', 'Argila verde', 'Glicerina vegetal'] },
              { secao: 'Chás e Ervas', items: ['Chá verde', 'Camomila', 'Alecrim seco', 'Cavalinha', 'Hibisco', 'Vinagre de maçã'] },
            ].map((col) => (
              <div key={col.secao} className="rounded-xl p-3" style={{ background: C.amberLight }}>
                <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wide" style={{ color: C.amber }}>{col.secao}</p>
                {col.items.map((item) => (
                  <p key={item} className="text-[12px] leading-snug text-foreground/80">☐ {item}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white" style={{ background: C.olive }}>
                Bônus 4
              </div>
              <p className="font-display text-[1.05rem] font-semibold" style={{ color: C.dark }}>
                Cuidados Específicos do Cabelo Grisalho
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { titulo: 'Por que resseca mais', desc: 'O fio branco perde melanina e, junto com ela, parte da proteção natural. Ele nasce mais poroso e absorve e perde água muito mais rápido.' },
                { titulo: 'Por que amarela', desc: 'Poluição, resíduo de produto, água com cloro e sol oxidam o fio branco. O Enxágue R13 (Vinagre) semanal remove boa parte desse acúmulo.' },
                { titulo: 'Textura mais rebelde', desc: 'O fio grisalho costuma nascer mais grosso e ondulado. O Gel de Linhaça (R15) controla sem ressecar nem deixar efeito duro.' },
                { titulo: 'Proteção solar', desc: 'Sem melanina, o fio branco não tem barreira contra o UV. Chapéu ou lenço em exposição prolongada evita o amarelado e o ressecamento.' },
              ].map((item) => (
                <div key={item.titulo} className="rounded-xl bg-white p-3.5">
                  <p className="mb-1 text-[12px] font-bold" style={{ color: C.olive }}>{item.titulo}</p>
                  <p className="text-[12.5px] leading-snug text-foreground/85">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PdfContentPage>

      {/* Bônus 5 e 6 */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Bônus 5 e 6"
        title="Bônus 5 — Os Erros que Quebram o Fio"
        subtitle="Metade do resultado após os 50 vem de parar de danificar o que você já tem."
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {[
              { item: 'Secador e chapinha sem protetor', motivo: 'Calor direto acima de 180°C desnatura a queratina de forma irreversível' },
              { item: 'Toalha felpuda esfregando', motivo: 'O atrito levanta a cutícula e é uma das maiores causas de frizz e quebra' },
              { item: 'Elástico de borracha apertado', motivo: 'Marca, rompe o fio no ponto de tensão e, com o tempo, causa falhas na linha do cabelo' },
              { item: 'Pentear o cabelo encharcado', motivo: 'O fio molhado estica até 30% mais e arrebenta com muito menos força' },
              { item: 'Dormir com o cabelo solto e molhado', motivo: 'Combina fragilidade máxima com horas de atrito contra o travesseiro' },
              { item: 'Água muito quente na lavagem', motivo: 'Remove o pouco sebo natural que ainda é produzido após a menopausa' },
              { item: 'Lavar todo dia com shampoo forte', motivo: 'Sem oleosidade natural, o couro cabeludo resseca e a queda por fragilidade aumenta' },
              { item: 'Prender o cabelo sempre no mesmo ponto', motivo: 'A tração repetida no mesmo lugar causa afinamento localizado e permanente' },
            ].map((i) => (
              <div key={i.item} className="rounded-lg bg-white p-2.5">
                <p className="text-[11.5px] font-bold" style={{ color: C.plum }}>✗ {i.item}</p>
                <p className="text-[11px] leading-snug text-foreground/70">{i.motivo}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white" style={{ background: C.amber }}>Bônus 6</div>
              <p className="font-display text-[1rem] font-semibold" style={{ color: C.dark }}>O Guia das Mãos</p>
            </div>
            <p className="mb-2 text-[12.5px]" style={{ color: C.muted }}>
              A unha bonita em uma mão ressecada não passa a impressão que você quer. Estes cinco hábitos mudam isso.
            </p>
            <div className="space-y-1.5">
              {[
                'Luvas para qualquer contato com detergente, água quente ou produto de limpeza',
                'Creme nas mãos toda vez que lavá-las — deixe um pote em cada pia da casa',
                'Protetor solar nas mãos: elas recebem tanto sol quanto o rosto e quase nunca são protegidas',
                'Nunca corte a cutícula — empurre suavemente após o banho, quando está amolecida',
                'Lixe sempre em uma direção só. O movimento de vai e vem é o que causa a descamação em camadas',
              ].map((s, i) => (
                <div key={i} className="flex gap-2 text-[12.5px] leading-snug text-foreground/85">
                  <span className="mt-0.5 text-[11px]" style={{ color: C.amber }}>→</span>{s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </PdfContentPage>

      {/* Encerramento */}
      <PdfContentPage accentGradient={ACCENT}
        kicker="Mensagem Final"
        title="O cabelo responde — mas no tempo dele"
        subtitle="Você tem tudo o que precisa. O que falta é atravessar as primeiras oito semanas."
      >
        <div className="space-y-4">
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Cabelo e unha são os tecidos mais lentos do corpo. O fio que está no seu travesseiro hoje
            começou a se formar meses atrás. É por isso que quase todo mundo desiste antes da hora — e
            é exatamente por isso que quem não desiste vê resultado.
          </p>
          <InfoBox variant="amber">
            A unha se renova por inteiro em 4 a 6 meses. O ciclo do fio leva ainda mais. Julgar o método
            em duas semanas é julgar antes de existir qualquer coisa nova para ser julgada.
          </InfoBox>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Não tente aplicar as trinta receitas. Escolha a sua rotina, comece pelo que é diário e
            deixe o resto para depois que o hábito estiver formado.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { semana: 'Semanas 1–2', acao: 'Só a massagem diária e o ritual noturno' },
              { semana: 'Semanas 3–4', acao: 'Adicione um óleo e uma máscara por semana' },
              { semana: 'Semanas 5+', acao: 'Rotina completa e protocolo das unhas' },
            ].map((s) => (
              <div key={s.semana} className="rounded-2xl p-4 text-center" style={{ background: C.amberLight }}>
                <p className="font-display text-[1rem] font-bold" style={{ color: C.amber }}>{s.semana}</p>
                <p className="mt-1 text-[12px] leading-snug" style={{ color: C.muted }}>{s.acao}</p>
              </div>
            ))}
          </div>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">
            Este método não promete devolver o cabelo dos 20 anos. Promete o melhor cabelo e as
            melhores unhas possíveis para a fase em que você está agora — e isso é bem mais do que a
            maioria das mulheres imagina ser possível.
          </p>
          <div className="rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg, hsl(28 45% 14%), hsl(95 30% 18%))' }}>
            <p className="font-display text-[1.4rem] font-bold leading-snug" style={{ color: 'hsl(38 60% 90%)' }}>
              "Raiz forte não se compra em frasco.<br />Se constrói em rotina."
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
          <InfoBox variant="amber">
            <strong>Este material tem finalidade exclusivamente informativa e educativa.</strong> Não
            constitui consulta, diagnóstico, prescrição ou tratamento médico, e não substitui o
            acompanhamento de um dermatologista ou profissional de saúde qualificado.
          </InfoBox>

          <div className="rounded-2xl bg-white p-4">
            <Label>Teste de sensibilidade — obrigatório antes de qualquer receita</Label>
            <p className="mt-1 text-[13px] leading-snug text-foreground/85">
              Antes do primeiro uso, aplique uma pequena quantidade do preparo atrás da orelha ou na
              parte interna do antebraço e aguarde 24 horas. Se houver vermelhidão, coceira, ardência
              ou inchaço, não utilize a receita. Óleos essenciais, alho, feno-grego e derivados de
              castanhas estão entre os ingredientes mais associados a reações alérgicas.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              {
                titulo: 'Óleos essenciais — regras de uso',
                desc: 'Nunca aplique puros. Sempre diluídos em óleo vegetal, na proporção indicada em cada receita. Evite durante a gravidez e a amamentação sem orientação médica.',
                cor: C.amber,
              },
              {
                titulo: 'Procure um médico se',
                desc: 'A queda for súbita, em áreas circulares, acompanhada de dor, feridas ou descamação intensa. Queda abrupta pode indicar alteração de tireoide, anemia ou outra condição que exige exame.',
                cor: C.plum,
              },
              {
                titulo: 'Alterações nas unhas que exigem avaliação',
                desc: 'Mudança de cor, espessamento, descolamento da lâmina, manchas escuras ou dor não são resolvidos por receita caseira e podem indicar infecção fúngica ou outra condição.',
                cor: C.olive,
              },
              {
                titulo: 'Consulte antes de usar se',
                desc: 'Está grávida ou amamentando, tem doença renal, faz uso de anticoagulante, diurético ou medicação contínua, ou tem alergia conhecida a algum ingrediente citado.',
                cor: C.amberMd,
              },
            ].map((item) => (
              <div key={item.titulo} className="rounded-xl bg-white p-3.5" style={{ borderLeft: `3px solid ${item.cor}` }}>
                <p className="mb-1 text-[12px] font-bold" style={{ color: item.cor }}>{item.titulo}</p>
                <p className="text-[12px] leading-snug text-foreground/85">{item.desc}</p>
              </div>
            ))}
          </div>

          <InfoBox variant="olive">
            <strong>Sobre os resultados:</strong> os efeitos descritos baseiam-se em uso tradicional e
            variam conforme genética, idade, condição hormonal, saúde geral e constância. Nenhum
            resultado específico é garantido, e este material não promete reversão de calvície,
            alopecia ou qualquer condição diagnosticada.
          </InfoBox>

          <div className="rounded-2xl bg-white p-4">
            <Label color={C.olive}>Preparo, conservação e higiene</Label>
            <div className="mt-1.5 space-y-1">
              {[
                'Use utensílios e frascos limpos e secos — preparos caseiros não contêm conservantes.',
                'Respeite os prazos de validade de cada receita e descarte após o período indicado.',
                'Descarte qualquer preparo com odor, cor ou textura alterada.',
                'Nunca aplique sobre couro cabeludo com feridas, cortes ou irritação ativa.',
                'Teste sempre a temperatura de óleos e compressas mornas no pulso antes de aplicar.',
                'Mantenha todos os preparos fora do alcance de crianças e longe dos olhos.',
              ].map((s, i) => (
                <div key={i} className="flex gap-2 text-[12px] leading-snug text-foreground/85">
                  <span className="mt-0.5 text-[10px]" style={{ color: C.olive }}>→</span>{s}
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
