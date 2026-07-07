export type BrainPartId = 'prefrontal' | 'amygdala' | 'hippocampus' | 'hypothalamus' | 'cingulate' | 'insula' | 'caudate' | 'cerebellum' | 'motor_cortex' | 'somatosensory' | 'putamen' | 'context';

export interface BrainPartData {
  id: BrainPartId;
  title: string;
  description: string;
  role: string;
  color: string;
  urls: string[];
  cameraTarget?: [number, number, number];
  cameraPosition?: [number, number, number];
  explodePosition?: [number, number, number]; 
}

export const brainPartsData: Record<BrainPartId, BrainPartData> = {
  prefrontal: {
    id: 'prefrontal',
    title: "Córtex Pré-Frontal",
    description: "Sede das funções executivas, atenção sustentada, planejamento e controle inibitório (controle top-down).",
    role: "Inibe a resposta de medo da amígdala. Na ansiedade, perde força (hipoativação), reduzindo a capacidade de racionalizar medos. No TDAH, falha na inibição de impulsos.",
    color: "#3b82f6", 
    urls: [
      '/models/FJ3801_BP58201_FMA72658_Left inferior frontal gyrus.obj',
      '/models/FJ3802_BP58213_FMA72657_Right inferior frontal gyrus.obj',
      '/models/FJ3839_BP58174_FMA72656_Left middle frontal gyrus.obj',
      '/models/FJ3840_BP58164_FMA72655_Right middle frontal gyrus.obj',
      '/models/FJ3879_BP58158_FMA72654_Left superior frontal gyrus.obj',
      '/models/FJ3880_BP58162_FMA72653_Right superior frontal gyrus.obj'
    ],
    cameraTarget: [0, 2, 3],
    cameraPosition: [0, 4, 8],
    explodePosition: [0, 30, 40] 
  },
  amygdala: {
    id: 'amygdala',
    title: "Amígdala",
    description: "Centro de processamento do medo e detecção de ameaças. Modula a consolidação de memórias emocionais.",
    role: "O 'sistema de alarme'. Dispara cascatas neuroquímicas em frações de segundo. Na ansiedade e TEPT, torna-se hiper-reativa, disparando falsos alarmes.",
    color: "#ef4444", 
    urls: [
      '/models/MM179_BP58076_FMA72833_Left amygdala.obj',
      '/models/MM179M_BP58075_FMA72832_Right amygdala.obj'
    ],
    cameraTarget: [0, -1, 0],
    cameraPosition: [0, -1, 5],
    explodePosition: [-10, -10, 20] 
  },
  hippocampus: {
    id: 'hippocampus',
    title: "Hipocampo",
    description: "Estrutura essencial para a consolidação da memória declarativa e regulação espacial. Possui alta densidade de receptores de glicocorticoides.",
    role: "Fornece 'contexto' às memórias. O estresse crônico (altos níveis de cortisol) inibe a neurogênese e atrofia o hipocampo, dificultando diferenciar ameaças reais de memórias passadas (comum no TEPT).",
    color: "#10b981", 
    urls: [
      '/models/MM164_BP58046_FMA72714_Left hippocampus proper.obj',
      '/models/MM164M_BP58047_FMA72713_Right hippocampus proper.obj'
    ],
    cameraTarget: [0, -1, -1],
    cameraPosition: [-4, -1, 2],
    explodePosition: [-30, -5, 0] 
  },
  hypothalamus: {
    id: 'hypothalamus',
    title: "Hipotálamo",
    description: "Regulador central da homeostase e do sistema nervoso autônomo. Ponto de origem do Eixo HPA.",
    role: "Recebe o alarme da Amígdala e aciona o Eixo HPA (Hipotálamo-Pituitária-Adrenal), liberando CRH que culminará na produção de cortisol (hormônio do estresse) pelas adrenais, preparando o corpo para lutar ou fugir.",
    color: "#f59e0b", // amber
    urls: [
      '/models/FJ3817_BP58266_FMA62008_Hypothalamus.obj'
    ],
    cameraTarget: [0, -2, 1],
    cameraPosition: [0, -2, 6],
    explodePosition: [10, -15, 10]
  },
  cingulate: {
    id: 'cingulate',
    title: "Córtex Cingulado Anterior",
    description: "Interface crucial entre emoção (sistema límbico) e cognição (córtex pré-frontal).",
    role: "Envolvido na percepção da dor emocional, regulação autonômica e monitoramento de erros. No TOC, o cingulado anterior fica hiperativo, gerando a sensação de que 'algo está errado'.",
    color: "#8b5cf6", // violet
    urls: [
      '/models/MM193_BP58215_FMA72718_Left cingulate gyrus.obj',
      '/models/MM193M_BP58196_FMA72717_Right cingulate gyrus.obj'
    ],
    cameraTarget: [0, 4, 1],
    cameraPosition: [0, 8, 6],
    explodePosition: [0, 20, 0]
  },
  insula: {
    id: 'insula',
    title: "Ínsula (Córtex Insular)",
    description: "Centro da interocepção: o mapa consciente das sensações viscerais do nosso corpo.",
    role: "No pânico e na ansiedade, a Ínsula amplifica sensações normais (como o coração batendo) e as interpreta como perigos iminentes, criando um ciclo de retroalimentação catastrófica.",
    color: "#ec4899", // pink
    urls: [
      '/models/MM236_BP58308_FMA72725_Left first short gyrus of insula.obj',
      '/models/MM236M_BP58312_FMA72724_Right first short gyrus of insula.obj'
    ],
    cameraTarget: [2, 1, 0],
    cameraPosition: [6, 1, 2],
    explodePosition: [30, 0, 10]
  },
  caudate: {
    id: 'caudate',
    title: "Núcleo Caudato (Gânglios da Base)",
    description: "Fundamental no sistema de recompensa e na execução de rotinas motoras e cognitivas aprendidas (hábitos).",
    role: "Participa dos circuitos que nos prendem a comportamentos compulsivos (TOC) ou nos impulsionam em busca de dopamina rápida (vistos no TDAH e vícios).",
    color: "#14b8a6", // teal
    urls: [
      '/models/MM241_BP58034_FMA72827_Left caudate nucleus.obj',
      '/models/MM241M_BP58038_FMA72826_Right caudate nucleus.obj'
    ],
    cameraTarget: [0, 0, -2],
    cameraPosition: [0, 2, -6],
    explodePosition: [10, 10, -20]
  },
  cerebellum: {
    id: 'cerebellum',
    title: "Cerebelo",
    description: "O grande coordenador motor. Contém mais da metade dos neurônios do cérebro, apesar de seu tamanho.",
    role: "Fundamental na aprendizagem motora, ajuste fino de movimentos e equilíbrio. No esporte, é onde a 'memória muscular' e a técnica perfeita são consolidadas.",
    color: "#f43f5e", // rose
    urls: [
      '/models/FJ3834_BP58271_FMA67944_Cerebellum.obj'
    ],
    cameraTarget: [0, -5, -4],
    cameraPosition: [0, -5, -12],
    explodePosition: [0, -20, -30]
  },
  motor_cortex: {
    id: 'motor_cortex',
    title: "Córtex Motor Primário",
    description: "Localizado no giro pré-central. Responsável pelo planejamento e execução dos movimentos voluntários.",
    role: "É a origem dos sinais nervosos que descem para a medula espinhal para contrair os músculos. Ativado fortemente ao levantar peso ou executar um gesto esportivo.",
    color: "#eab308", // yellow
    urls: [
      '/models/FJ3852_BP58221_FMA72662_Left precentral gyrus.obj',
      '/models/FJ3853_BP58189_FMA72661_Right precentral gyrus.obj'
    ],
    cameraTarget: [0, 8, 2],
    cameraPosition: [0, 14, 6],
    explodePosition: [0, 40, 20]
  },
  somatosensory: {
    id: 'somatosensory',
    title: "Córtex Somatossensorial",
    description: "Localizado no giro pós-central. Processa as informações de tato, dor, temperatura e propriocepção.",
    role: "No esporte, a propriocepção é vital. Permite que o cérebro saiba a posição exata de cada articulação sem que você precise olhar para o seu próprio corpo.",
    color: "#0ea5e9", // sky
    urls: [
      '/models/FJ3849_BP58224_FMA72666_Left postcentral gyrus.obj',
      '/models/FJ3850_BP58212_FMA72665_Right postcentral gyrus.obj'
    ],
    cameraTarget: [0, 7, -1],
    cameraPosition: [0, 13, -5],
    explodePosition: [0, 35, -10]
  },
  putamen: {
    id: 'putamen',
    title: "Putâmen (Gânglios da Base)",
    description: "Estrutura do estriado profundamente envolvida na regulação de movimentos automáticos e no circuito de recompensa.",
    role: "Na nutrição, é ativado intensamente pela ingestão de açúcares, liberando dopamina. No esporte, atua junto com o cerebelo para automatizar sequências motoras (ex: pedalar).",
    color: "#a855f7", // purple
    urls: [
      '/models/FJ3829_BP58036_FMA72829_Left putamen.obj',
      '/models/FJ3870_BP58039_FMA72828_Right putamen.obj'
    ],
    cameraTarget: [-2, -1, 1],
    cameraPosition: [-6, 0, 3],
    explodePosition: [-20, 0, 20]
  },
  context: {
    id: 'context',
    title: "Tronco Cerebral",
    description: "Conecta o encéfalo à medula espinhal.",
    role: "Controla funções vitais autônomas, como respiração e batimentos cardíacos, que também se alteram drasticamente na ansiedade e pânico.",
    color: "#e5e7eb", 
    urls: [
      '/models/FJ3828_BP58274_FMA67943_Pons.obj',
      '/models/FJ3823_BP58279_FMA62004_Medulla oblongata.obj'
    ],
    explodePosition: [0, -40, -10] 
  }
};

export type GuidedTourId = 'hpa_axis' | 'panic_loop' | 'habit_loop' | 'sports_neuro' | 'nutrition_behavior';

export interface TourStep {
  partId: BrainPartId;
  title: string;
  content: string;
}

export interface GuidedTourData {
  id: GuidedTourId;
  name: string;
  description: string;
  steps: TourStep[];
}

export const guidedToursData: Record<GuidedTourId, GuidedTourData> = {
  hpa_axis: {
    id: 'hpa_axis',
    name: 'A Cascata do Estresse (Eixo HPA)',
    description: 'Como o cérebro transforma medo em cortisol.',
    steps: [
      {
        partId: 'amygdala',
        title: '1. O Alarme Inicial',
        content: 'A Amígdala detecta rapidamente uma ameaça no ambiente antes mesmo da consciência plena e dispara um sinal de perigo.'
      },
      {
        partId: 'hypothalamus',
        title: '2. O Mestre da Homeostase',
        content: 'O sinal chega ao Hipotálamo, que atua como o centro de comando autonômico, iniciando a liberação de CRH (Hormônio Liberador de Corticotrofina).'
      },
      {
        partId: 'prefrontal',
        title: '3. A Tentativa de Freio',
        content: 'O Córtex Pré-Frontal tenta reavaliar a ameaça. Se o estresse for excessivo, sua função é suprimida, permitindo que a resposta instintiva domine.'
      },
      {
        partId: 'hippocampus',
        title: '4. Memória e Contexto',
        content: 'O Hipocampo armazena o contexto do estresse. Níveis crônicos de cortisol afetam sua capacidade de regular o próprio Eixo HPA no futuro.'
      }
    ]
  },
  panic_loop: {
    id: 'panic_loop',
    name: 'O Ciclo do Pânico',
    description: 'Interocepção e catastrofização no cérebro.',
    steps: [
      {
        partId: 'context',
        title: '1. Alteração Fisiológica',
        content: 'O Tronco Cerebral regula funções autônomas. Por um leve estresse ou esforço, o coração bate mais rápido e a respiração acelera.'
      },
      {
        partId: 'insula',
        title: '2. Interocepção Hipervigilante',
        content: 'A Ínsula lê ativamente essas mudanças corporais internas. No Pânico, ela é hiper-reativa, interpretando o coração acelerado como um infarto.'
      },
      {
        partId: 'cingulate',
        title: '3. Erro e Dor Emocional',
        content: 'O Cíngulo Anterior acende, sinalizando que "algo está muito errado". Isso gera angústia emocional imediata.'
      },
      {
        partId: 'amygdala',
        title: '4. Medo Confirmado',
        content: 'A Amígdala recebe esse sinal de erro e dispara mais medo, liberando mais adrenalina e piorando os sintomas físicos (fechando o ciclo).'
      }
    ]
  },
  habit_loop: {
    id: 'habit_loop',
    name: 'Hábitos e Compulsões',
    description: 'A anatomia da recompensa e repetição.',
    steps: [
      {
        partId: 'prefrontal',
        title: '1. Intenção Inicial',
        content: 'No início, o Córtex Pré-Frontal planeja conscientemente uma ação para obter uma recompensa ou aliviar uma ansiedade.'
      },
      {
        partId: 'caudate',
        title: '2. Formação do Hábito',
        content: 'O Núcleo Caudato (Gânglios da Base) automatiza a sequência. Com o tempo (TOC, vícios), a ação ocorre impulsivamente sem controle pré-frontal.'
      }
    ]
  },
  sports_neuro: {
    id: 'sports_neuro',
    name: 'Neurociência do Esporte',
    description: 'A jornada do movimento perfeito.',
    steps: [
      {
        partId: 'prefrontal',
        title: '1. A Intenção e Estratégia',
        content: 'O Córtex Pré-Frontal planeja a jogada. Decide, por exemplo, que você precisa correr e chutar a bola na direção do gol.'
      },
      {
        partId: 'motor_cortex',
        title: '2. O Comando de Ação',
        content: 'O Córtex Motor Primário envia o comando elétrico que desce pela medula espinhal para contrair os músculos da perna.'
      },
      {
        partId: 'somatosensory',
        title: '3. O Feedback do Corpo',
        content: 'Enquanto o movimento ocorre, o Córtex Somatossensorial recebe dados de propriocepção: "Onde minha perna está no espaço?"'
      },
      {
        partId: 'cerebellum',
        title: '4. O Ajuste Fino e a Técnica',
        content: 'O Cerebelo compara o movimento real com a intenção inicial. Se houve erro, ele ajusta a técnica. Com treino, a "memória muscular" fica guardada aqui.'
      }
    ]
  },
  nutrition_behavior: {
    id: 'nutrition_behavior',
    name: 'Comportamento Alimentar',
    description: 'Como o cérebro processa a fome e o vício em açúcar.',
    steps: [
      {
        partId: 'hypothalamus',
        title: '1. Fome e Saciedade',
        content: 'Hormônios como Grelina (fome) e Leptina (saciedade) atuam diretamente no Hipotálamo, regulando seu impulso biológico de procurar comida.'
      },
      {
        partId: 'insula',
        title: '2. O Sabor da Comida',
        content: 'Quando você come, a Ínsula atua como o córtex gustativo, interpretando conscientemente se a comida é doce, salgada ou amarga.'
      },
      {
        partId: 'putamen',
        title: '3. A Recompensa Dopaminérgica',
        content: 'Alimentos hiperpalatáveis (açúcar/gordura) causam um pico de dopamina no Putâmen e Gânglios da Base, gerando prazer extremo e desejo de repetição.'
      },
      {
        partId: 'prefrontal',
        title: '4. O Desafio Inibitório',
        content: 'O Córtex Pré-Frontal deve decidir se você come mais um pedaço de bolo ou não. Se a recompensa for muito forte, o controle inibitório falha.'
      }
    ]
  }
};

// ==========================================
// DSM-5-TR CLINICAL PROFILES
// ==========================================

export type DisorderId = 'tag' | 'tept' | 'tdm' | 'tdah';

export interface DisorderData {
  id: DisorderId;
  name: string;
  description: string;
  details: string;
  // Visual overrides for BrainModel
  ambientIntensity: number;
  dirIntensity: number;
  dirColor: string;
  sparkles: {
    color: string;
    speed: number;
    count: number;
    scale: number;
    noise: number;
  };
}

export const disordersData: Record<DisorderId, DisorderData> = {
  tag: {
    id: 'tag',
    name: 'Transtorno de Ansiedade Generalizada',
    description: 'Sistema de alarme cronicamente ativado.',
    details: 'No TAG, a Amígdala encontra-se hiperativa, detectando ameaças em situações neutras. O Córtex Pré-Frontal, que deveria inibir essa resposta, perde força, gerando um estado de alerta constante (partículas vermelhas rápidas e agitadas).',
    ambientIntensity: 0.3,
    dirIntensity: 2.0,
    dirColor: '#fee2e2',
    sparkles: {
      color: '#ef4444',
      speed: 1.5,
      count: 120,
      scale: 5,
      noise: 4
    }
  },
  tept: {
    id: 'tept',
    name: 'Transtorno de Estresse Pós-Traumático',
    description: 'Falha no filtro de contexto do Hipocampo.',
    details: 'No TEPT, o Hipocampo (memória de contexto) se torna disfuncional e escurece. Ele não consegue avisar a Amígdala de que o evento traumático ficou no passado. A Amígdala, portanto, reage a gatilhos atuais com intensidade máxima de sobrevivência.',
    ambientIntensity: 0.2,
    dirIntensity: 2.5,
    dirColor: '#ffcccc',
    sparkles: {
      color: '#991b1b', // dark red
      speed: 2.5,
      count: 150,
      scale: 6,
      noise: 5
    }
  },
  tdm: {
    id: 'tdm',
    name: 'Transtorno Depressivo Maior',
    description: 'Letargia global e apagamento neuronal.',
    details: 'Na Depressão Maior, observamos uma hipoatividade global. O Córtex Pré-Frontal e o Hipocampo perdem brilho. As partículas, representando neurotransmissores como serotonina e dopamina, ficam extremamente escassas e lentas.',
    ambientIntensity: 0.1,
    dirIntensity: 0.3,
    dirColor: '#4b5563', // gray
    sparkles: {
      color: '#374151', // dark gray/blue
      speed: 0.05,
      count: 20,
      scale: 1.5,
      noise: 0.5
    }
  },
  tdah: {
    id: 'tdah',
    name: 'Transtorno de Déficit de Atenção (TDAH)',
    description: 'Disfunção Executiva por subativação do Córtex.',
    details: 'No TDAH, o Córtex Pré-Frontal sofre com a subativação devido à recaptação acelerada de dopamina e noradrenalina. Ele pisca de forma instável, o que explica a dificuldade em sustentar o foco, frear impulsos e gerenciar tarefas executivas.',
    ambientIntensity: 0.5,
    dirIntensity: 1.0,
    dirColor: '#fef3c7', // yellow tint
    sparkles: {
      color: '#fbbf24', // amber/gold
      speed: 0.8,
      count: 60,
      scale: 3,
      noise: 2
    }
  }
};
