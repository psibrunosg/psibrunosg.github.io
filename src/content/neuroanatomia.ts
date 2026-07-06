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
}

export const brainPartsData: Record<BrainPartId, BrainPartData> = {
  prefrontal: {
    id: 'prefrontal',
    title: "Córtex Pré-Frontal",
    description: "A parte da frente do cérebro, responsável pelo pensamento lógico, planejamento, tomada de decisões e controle dos impulsos.",
    role: "Na ansiedade, o córtex pré-frontal tenta 'frear' o sistema de alarme (amígdala). Quando o estresse é muito alto, ele pode perder a força e você passa a agir mais por emoção do que por razão.",
    color: "#3b82f6", // blue-500
    urls: [
      '/models/FJ3801_BP58201_FMA72658_Left inferior frontal gyrus.obj',
      '/models/FJ3802_BP58213_FMA72657_Right inferior frontal gyrus.obj',
      '/models/FJ3839_BP58174_FMA72656_Left middle frontal gyrus.obj',
      '/models/FJ3840_BP58164_FMA72655_Right middle frontal gyrus.obj',
      '/models/FJ3879_BP58158_FMA72654_Left superior frontal gyrus.obj',
      '/models/FJ3880_BP58162_FMA72653_Right superior frontal gyrus.obj'
    ],
    cameraTarget: [0, 2, 3],
    cameraPosition: [0, 4, 8]
  },
  amygdala: {
    id: 'amygdala',
    title: "Amígdala",
    description: "Uma pequena estrutura em forma de amêndoa. É o centro emocional e o 'sistema de alarme' do cérebro.",
    role: "Quando percebe uma ameaça (real ou imaginária), ela dispara a resposta de 'lutar, fugir ou congelar', liberando adrenalina e causando os sintomas físicos da ansiedade.",
    color: "#ef4444", // red-500
    urls: [
      '/models/MM179_BP58076_FMA72833_Left amygdala.obj',
      '/models/MM179M_BP58075_FMA72832_Right amygdala.obj'
    ],
    cameraTarget: [0, -1, 0],
    cameraPosition: [0, -1, 5]
  },
  hippocampus: {
    id: 'hippocampus',
    title: "Hipocampo",
    description: "A estrutura responsável pela formação e armazenamento de novas memórias e pelo aprendizado.",
    role: "Trabalha junto com a amígdala para lembrar de situações perigosas. No estresse crônico ou trauma, o hipocampo pode encolher, dificultando a diferenciação entre uma lembrança antiga e um perigo atual.",
    color: "#10b981", // emerald-500
    urls: [
      '/models/MM164_BP58046_FMA72714_Left hippocampus proper.obj',
      '/models/MM164M_BP58047_FMA72713_Right hippocampus proper.obj'
    ],
    cameraTarget: [0, -1, -1],
    cameraPosition: [-4, -1, 2]
  },
  context: {
    id: 'context',
    title: "Tronco Cerebral",
    description: "Conecta o cérebro à medula espinhal.",
    role: "Controla funções vitais autônomas, como respiração e batimentos cardíacos, que também se alteram na ansiedade.",
    color: "#e5e7eb", // gray-200
    urls: [
      '/models/FJ3828_BP58274_FMA67943_Pons.obj',
      '/models/FJ3823_BP58279_FMA62004_Medulla oblongata.obj'
    ]
  }
};
