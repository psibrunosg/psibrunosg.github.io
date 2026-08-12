export type ClanId = "hyuga" | "uchiha" | "nara" | "uzumaki" | "inuzuka" | "yamanaka" | "aburame";

export interface IrukaStage {
  id: number;
  pose: string;
  image: string;
  text: string;
}

export interface CharacterPhase {
  label: string;
  text: string;
}

export interface Clan {
  id: ClanId;
  name: string;
  symbol: string;
  mode: string;
  metaphor: string;
  color: string;
  characterYoung: string;
  characterYoungImage: string;
  characterMature: string;
  characterMatureImage: string;
  phase1: CharacterPhase;
  phase2: CharacterPhase;
}

export const clanIds: ClanId[] = [
  "hyuga",
  "uchiha",
  "nara",
  "uzumaki",
  "inuzuka",
  "yamanaka",
  "aburame",
];

export const irukaStages: IrukaStage[] = [
  {
    id: 1,
    pose: "correndo",
    image: "/naruto/generated/iruka-1.png",
    text:
      "Espera, espera, espera! Você aí! Sim... VOCÊ!\nBem-vindo à Vila da Folha.",
  },
  {
    id: 2,
    pose: "professor",
    image: "/naruto/generated/iruka-2.png",
    text:
      "Eu sou Iruka. Professor da Academia Ninja.\nE hoje... temos uma missão diferente.\nNão é uma missão de combate. É uma missão de conhecimento.\nSobre a mente. Sobre VOCÊ.",
  },
  {
    id: 3,
    pose: "pensativo",
    image: "/naruto/generated/iruka-3.png",
    text:
      "Sabe aquela voz na sua cabeça que fala: 'Você não consegue'?\nOu aquela raiva que aparece do nada...\nOu quando você some, vai pro seu canto, e não quer falar com ninguém?\nEssas não são fraquezas. São sinais.",
  },
  {
    id: 4,
    pose: "dramatico",
    image: "/naruto/generated/iruka-4.png",
    text:
      "ESSAS PARTES TÊM NOME!\nSão os MODOS da mente.\nCada um surgiu por um motivo. Cada um tentou te proteger de algo.\nE cada ninja da Vila... carrega os seus.",
  },
  {
    id: 5,
    pose: "sabio",
    image: "/naruto/generated/iruka-5.png",
    text:
      "Mas eu aprendi algo importante ao ensinar Naruto, Sasuke, Hinata...\nNão é lutando contra esses modos que você fica mais forte.\nÉ os conhecendo. É os ouvindo. É os entendendo.",
  },
  {
    id: 6,
    pose: "revelando",
    image: "/naruto/generated/iruka-6.png",
    text:
      "Cada clã da Vila tem sua história.\nE cada história é um espelho.\nEscolha um símbolo... e encontre a sua parte.",
  },
];

export const clans: Record<ClanId, Clan> = {
  hyuga: {
    id: "hyuga",
    name: "Hyūga",
    symbol: "/naruto/generated/symbol-hyuga.png",
    mode: "Criança Vulnerável",
    metaphor:
      "O dom de ver tudo pode virar uma maldição quando você acredita que nunca é suficiente.",
    color: "#E8D5B5",
    characterYoung: "Hinata criança",
    characterYoungImage: "/naruto/generated/hyuga-young.png",
    characterMature: "Hinata Shippuden",
    characterMatureImage: "/naruto/generated/hyuga-mature.png",
    phase1: {
      label: "Como o modo surge",
      text:
        "Quando eu era pequena... eu tentava. Eu tentava tanto.\n\nAcordava antes do amanhecer pra treinar. Ficava até escurecer sozinha no quintal.\n\nMas quando meu pai me olhava... ele não precisava falar nada. Aquele olhar dizia tudo: 'Você não é o suficiente, Hinata.'\n\nE sabe o pior? Com o tempo, eu parei de precisar do olhar dele. Eu já dizia isso pra mim mesma.",
    },
    phase2: {
      label: "Como integrar com o Adulto Saudável",
      text:
        "Por anos eu acreditei que era fraca. Ficava no canto. Observando. Nunca levantava a mão.\n\nAté o dia em que vi alguém que eu amava sendo destruído. E algo em mim disse: não. Não hoje. Não assim.\n\nAinda sinto medo. Ainda tremo. Mas aprendi que coragem não é ausência de medo — é fazer o próximo movimento mesmo com as mãos tremendo.",
    },
  },
  uchiha: {
    id: "uchiha",
    name: "Uchiha",
    symbol: "/naruto/generated/symbol-uchiha.png",
    mode: "Modos de Defesa",
    metaphor:
      "O Sharingan copia tudo para sobreviver. Às vezes nossa mente faz o mesmo.",
    color: "#B91C1C",
    characterYoung: "Sasuke criança",
    characterYoungImage: "/naruto/generated/uchiha-young.png",
    characterMature: "Sasuke Shippuden",
    characterMatureImage: "/naruto/generated/uchiha-mature.png",
    phase1: {
      label: "Como o trauma ativa as armaduras",
      text:
        "Eu tinha uma família. Tinha uma casa cheia de risadas, de pratos, de histórias. Depois, numa noite, só sobrou eu.\n\nA dor era tão grande que o silêncio parecia um presente. Eu aprendi a não precisar de ninguém. Não confiar em ninguém. Não sentir nada que pudesse ser tirado de mim de novo.\n\nEssa armadura me manteve vivo. Mas também me manteve sozinho.",
    },
    phase2: {
      label: "O custo de viver em alerta constante",
      text:
        "A vingança me deu um norte. Me deu fogo. Me deu uma razão para acordar.\n\nMas quanto mais eu queimava, menos eu enxergava. Quanto mais eu me protegia, menos eu conseguia tocar em quem estava do meu lado.\n\nA armadura funciona. Só que ela não sabe a hora de descansar. E uma armadura que nunca tira acaba pesando mais do que protege.",
    },
  },
  nara: {
    id: "nara",
    name: "Nara",
    symbol: "/naruto/generated/symbol-nara.png",
    mode: "Modo Crítico",
    metaphor: "Que saco… mas e se eu errar? Nunca vai ser suficiente.",
    color: "#1F2937",
    characterYoung: "Shikamaru preguiçoso",
    characterYoungImage: "/naruto/generated/nara-young.png",
    characterMature: "Shikamaru estrategista",
    characterMatureImage: "/naruto/generated/nara-mature.png",
    phase1: {
      label: "Como a evitação protege",
      text:
        "'Que saco.' Eu dizia isso para tudo. Treino? Que saco. Prova? Que saco. Responsabilidade? Que saco.\n\nSó que por trás da preguiça tinha uma conta: se eu não tentasse de verdade, ninguém podia dizer que eu falhei. Se eu não me arriscasse, não dava para me comparar.\n\nEra mais seguro ficar pequeno. Mais fácil. Mais triste, também.",
    },
    phase2: {
      label: "Modo Crítico integrado",
      text:
        "Quando perdi alguém que eu amava, a preguiça não cabia mais. Eu precisei escolher: ficar deitado ou levantar e fazer valer a pena.\n\nFoi aí que descobri que meu cérebro crítico podia virar estratégia. Que pensar muito, quando tem um propósito, vira cuidado. Vira proteção de verdade.\n\nHoje eu ainda reclamo. Mas reclamo enquanto movo as peças.",
    },
  },
  uzumaki: {
    id: "uzumaki",
    name: "Uzumaki",
    symbol: "/naruto/generated/symbol-uzumaki.png",
    mode: "Adulto Saudável",
    metaphor:
      "Eu não vou desistir! Esse é o meu jeito ninja!",
    color: "#F97316",
    characterYoung: "Naruto menino",
    characterYoungImage: "/naruto/generated/uzumaki-young.png",
    characterMature: "Naruto Hokage",
    characterMatureImage: "/naruto/generated/uzumaki-mature.png",
    phase1: {
      label: "A semente do adulto saudável",
      text:
        "Quando eu era criança, as pessoas me olhavam com medo. Me fechavam portas. Me deixavam de fora.\n\nDentro de mim tinha algo enorme, barulhento e assustador. Eu podia ter deixado aquilo me definir. Podia ter virado raiva pura.\n\nMas eu escolhi outra coisa: gritar, de forma mais alta, que eu também existia. Que eu também merecia ser visto.",
    },
    phase2: {
      label: "A integração plena de todos os modos",
      text:
        "A Raposa não sumiu. Ela ainda está aqui, dentro de mim. Só que hoje a gente conversa.\n\nEu aprendi que ser forte não é empurrar as partes difíceis para longe. É liderar elas. É dar um lugar para a raiva, para a tristeza, para o medo — sem deixar nenhuma delas dirigir sozinha.\n\nEsse é o meu jeito ninja. Não desistir. Mas também não desistir de mim mesmo.",
    },
  },
  inuzuka: {
    id: "inuzuka",
    name: "Inuzuka",
    symbol: "/naruto/generated/symbol-inuzuka.png",
    mode: "Modo Raivoso",
    metaphor:
      "Primeiro reage, depois pensa. É o instinto falando mais alto.",
    color: "#7C3AED",
    characterYoung: "Kiba impulsivo",
    characterYoungImage: "/naruto/generated/inuzuka-young.png",
    characterMature: "Kiba maduro",
    characterMatureImage: "/naruto/generated/inuzuka-mature.png",
    phase1: {
      label: "Como o modo raivoso surge",
      text:
        "Eu ouço o grunhido primeiro. O raciocínio vem depois.\n\nAlguém me olha torto? Eu encaro. Alguém duvida? Eu pulo. Alguém machuca quem eu gosto? Eu perco a linha.\n\nA raiva é quente. É rápida. Ela me faz sentir vivo e no controle — mesmo quando eu estou destruindo tudo ao redor.",
    },
    phase2: {
      label: "Raiva como informação, não como ação",
      text:
        "Com o tempo eu percebi que a raiva é um cão leal. Ela avisa quando algo está errado. Mas se eu soltar a coleira, ela morde o mundo inteiro.\n\nHoje eu tento ouvir o aviso sem deixar o cão decidir. Ainda rosno. Ainda avanço. Mas escolho para onde.\n\nA raiva não é minha inimiga. Só precisa de um dono que saiba dizer 'sentou'.",
    },
  },
  yamanaka: {
    id: "yamanaka",
    name: "Yamanaka",
    symbol: "/naruto/generated/symbol-yamanaka.png",
    mode: "Modo Complacente",
    metaphor:
      "Faço tudo para agradar, mesmo quando isso me machuca.",
    color: "#EC4899",
    characterYoung: "Ino criança",
    characterYoungImage: "/naruto/generated/yamanaka-young.png",
    characterMature: "Ino adulta",
    characterMatureImage: "/naruto/generated/yamanaka-mature.png",
    phase1: {
      label: "O modo que se perde nos outros",
      text:
        "Eu aprendi cedo que ser aceita era mais seguro do que ser eu mesma.\n\nSe o grupo ria, eu ria. Se o grupo odiava, eu odiava. Se alguém precisava de algo, eu largava o que estava fazendo.\n\nEra como se eu não existisse fora do espelho dos outros. Como se minha própria opinião fosse um quarto escuro onde eu nunca entrava.",
    },
    phase2: {
      label: "Conectar sem se dissolver",
      text:
        "A empatia sempre foi meu dom. Só que eu usava ela para desaparecer.\n\nHoje ainda escuto. Ainda sinto. Ainda me importo. Mas deixo a minha voz ficar no mesmo volume da dos outros. Às vezes um pouco mais alto.\n\nConectar não precisa custar quem eu sou. Eu posso estar perto e ainda ser inteira.",
    },
  },
  aburame: {
    id: "aburame",
    name: "Aburame",
    symbol: "/naruto/generated/symbol-aburame.png",
    mode: "Modo Isolado",
    metaphor:
      "Melhor não sentir nada do que sentir demais.",
    color: "#475569",
    characterYoung: "Shino",
    characterYoungImage: "/naruto/generated/aburame-young.png",
    characterMature: "Shino professor",
    characterMatureImage: "/naruto/generated/aburame-mature.png",
    phase1: {
      label: "O modo que bloqueia as emoções",
      text:
        "As pessoas são barulhentas. Só querem coisas. Falam demais, sentem demais, esperam demais.\n\nEu aprendi que se eu ficasse quieto, ninguém me notava. Se eu não sentisse, ninguém machucava. Se eu me afastasse, ninguém me deixava para trás — porque eu já estava longe.\n\nO silêncio virou minha armadura. E a solidão, minha companhia mais confiável.",
    },
    phase2: {
      label: "Como o isolamento pode virar presença",
      text:
        "Ser observador me ensinou a ver o que os outros não veem. Mas ficar só vendo não é viver.\n\nQuando virei professor, descobri que minha calma podia ser um abrigo para alguém. Que eu podia usar minha capacidade de observar para perguntar, para escutar, para estar.\n\nAinda gosto do silêncio. Só que hoje eu deixo algumas pessoas sentarem nele comigo.",
    },
  },
};

export const getClanById = (id: string): Clan | undefined =>
  clanIds.includes(id as ClanId) ? clans[id as ClanId] : undefined;
