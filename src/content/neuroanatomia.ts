export type BrainPartId = 'prefrontal' | 'amygdala' | 'hippocampus' | 'context';

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
    description: "A parte da frente do cérebro, responsável pelo pensamento lógico, planejamento, tomada de decisões e controle dos impulsos.",
    role: "Na ansiedade, o córtex pré-frontal tenta 'frear' o sistema de alarme (amígdala). Quando o estresse é muito alto, ele pode perder a força e você passa a agir mais por emoção do que por razão.",
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
    explodePosition: [0, 20, 30] 
  },
  amygdala: {
    id: 'amygdala',
    title: "Amígdala",
    description: "Uma pequena estrutura em forma de amêndoa. É o centro emocional e o 'sistema de alarme' do cérebro.",
    role: "Quando percebe uma ameaça (real ou imaginária), ela dispara a resposta de 'lutar, fugir ou congelar', liberando adrenalina e causando os sintomas físicos da ansiedade.",
    color: "#ef4444", 
    urls: [
      '/models/MM179_BP58076_FMA72833_Left amygdala.obj',
      '/models/MM179M_BP58075_FMA72832_Right amygdala.obj'
    ],
    cameraTarget: [0, -1, 0],
    cameraPosition: [0, -1, 5],
    explodePosition: [0, -20, 30] 
  },
  hippocampus: {
    id: 'hippocampus',
    title: "Hipocampo",
    description: "A estrutura responsável pela formação e armazenamento de novas memórias e pelo aprendizado.",
    role: "Trabalha junto com a amígdala para lembrar de situações perigosas. No estresse crônico ou trauma, o hipocampo pode encolher, dificultando a diferenciação entre uma lembrança antiga e um perigo atual.",
    color: "#10b981", 
    urls: [
      '/models/MM164_BP58046_FMA72714_Left hippocampus proper.obj',
      '/models/MM164M_BP58047_FMA72713_Right hippocampus proper.obj'
    ],
    cameraTarget: [0, -1, -1],
    cameraPosition: [-4, -1, 2],
    explodePosition: [-30, 0, -20] 
  },
  context: {
    id: 'context',
    title: "Tronco Cerebral",
    description: "Conecta o cérebro à medula espinhal.",
    role: "Controla funções vitais autônomas, como respiração e batimentos cardíacos, que também se alteram na ansiedade.",
    color: "#e5e7eb", 
    urls: [
      '/models/FJ3828_BP58274_FMA67943_Pons.obj',
      '/models/FJ3823_BP58279_FMA62004_Medulla oblongata.obj'
    ],
    explodePosition: [0, -40, -10] 
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
