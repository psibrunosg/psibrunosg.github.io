// Dados da Jornada "Terapia do Esquema × Mundo Torajo" — 7 capítulos
// scroll-driven narrativos. Cada capítulo liga um personagem a um modo do
// esquema e inclui uma situação, um quiz e uma recompensa visual.
// Dado puro, sem lógica de UI.

import type { PersonagemId } from "@/content/psicoed/personagens";

export interface VeradeOpcao {
  id: string;
  texto: string;
  correto: boolean;
  explicacao: string;
}

export interface VeradePergunta {
  id: string;
  situacao: string;
  pergunta: string;
  opcoes: VeradeOpcao[];
}

export interface VeradeRecompensa {
  titulo: string;
  descricao: string;
  efeito: string;
}

export interface VeradeAdulto {
  titulo: string;
  mensagem: string;
}

export interface Capitulo {
  id: string;
  numero: number;
  titulo: string;
  subtitulo: string;
  personagem: PersonagemId;
  modo: string;
  cor: string;
  glow: string;
  narrativa: string;
  pergunta: VeradePergunta;
  recompensa: VeradeRecompensa;
  adultoSaudavel: VeradeAdulto;
  /** Capítulo 6 é reflexivo, sem resposta certa/errada. */
  reflexivo?: boolean;
}

export const capitulos: Capitulo[] = [
  {
    id: "chegada",
    numero: 1,
    titulo: "A Chegada",
    subtitulo: "Hero",
    personagem: "torajo",
    modo: "Introdução",
    cor: "#fbc02d",
    glow: "#fff176",
    narrativa:
      "Algo estranho aconteceu em Verade. A cidade dorme sob um céu estrelado, e um bondinho antigo desce lentamente em direção às luzes fracas lá embaixo. A noite é tranquila — mas a noite também esconde partes de nós que costumam ficar à espreita.",
    pergunta: {
      id: "chegada-q1",
      situacao: "Você desce do bondinho e sente que a cidade está diferente. Cada lugar parece carregar um humor, uma voz, um modo de ser.",
      pergunta: "O que a Terapia do Esquema chama de 'modo'?",
      opcoes: [
        {
          id: "a",
          texto: "Uma parte da gente que assume o controle em momentos de estresse",
          correto: true,
          explicacao:
            "Isso mesmo. Modo é o estado emocional-comportamental que assume a mente e o corpo num momento difícil — como se uma parte específica de nós estivesse no comando.",
        },
        {
          id: "b",
          texto: "Um medicamento usado para acalmar crises de ansiedade",
          correto: false,
          explicacao: "Não — 'modo' na Terapia do Esquema não é medicamento. É uma parte do funcionamento emocional que assume o controle.",
        },
        {
          id: "c",
          texto: "Uma técnica de respiração para dormir melhor",
          correto: false,
          explicacao: "Respiração é uma ferramenta, mas 'modo' é algo mais amplo: é quem está falando dentro de você naquele momento.",
        },
        {
          id: "d",
          texto: "Um tipo de personalidade que não muda nunca",
          correto: false,
          explicacao: "Modos mudam ao longo do dia. Não são traços fixos, mas estados que entram e saem conforme o que acontece.",
        },
      ],
    },
    recompensa: {
      titulo: "Verade se revela",
      descricao: "As luzes da cidade ficam mais claras. Você está pronto para conhecer cada modo.",
      efeito: "luzes-cidade",
    },
    adultoSaudavel: {
      titulo: "Olhar de diretor",
      mensagem:
        "O Adulto Saudável não nega a noite. Ele apenas acende uma lanterna e diz: 'Vamos conhecer uma parte de cada vez.'",
    },
  },
  {
    id: "praca",
    numero: 2,
    titulo: "A Praça Vazia",
    subtitulo: "Morajo — Protetor Punidor",
    personagem: "morajo",
    modo: "Protetor Punidor / Voz Crítica Exigente",
    cor: "#1a237e",
    glow: "#3949ab",
    narrativa:
      "A praça central está escura. A fonte está seca. No banco em frente à prefeitura, Morajo digita freneticamente no computador. Ele não para, porque se parar, 'tudo desaba'.",
    pergunta: {
      id: "praca-q1",
      situacao: "Morajo diz: 'Se eu parar, tudo desaba. Preciso produzir, revisar, corrigir tudo sozinho.'",
      pergunta: "Qual modo o Morajo está usando?",
      opcoes: [
        { id: "a", texto: "Criança Vulnerável", correto: false, explicacao: "A Criança Vulnerável sente medo, tristeza e abandono. Morajo aqui está no controle exigente, não na vulnerabilidade." },
        { id: "b", texto: "Protetor Punidor / Voz Crítica Exigente", correto: true, explicacao: "Isso mesmo. Regras rígidas, perfeccionismo e a sensação de que descansar é perigoso são marcas desse modo." },
        { id: "c", texto: "Adulto Saudável", correto: false, explicacao: "O Adulto Saudável equilibra esforço e descanso. Morajo está longe disso agora." },
        { id: "d", texto: "Protetor de Fuga", correto: false, explicacao: "O Protetor de Fuga se desliga ou foge. Morajo está hiperativo e cobrando, não fugindo." },
      ],
    },
    recompensa: {
      titulo: "A fonte jorra de novo",
      descricao: "Quando Morajo respira, a fonte volta a jorrar. A esfera azul sobe, dizendo que o controle pode ceder um pouco.",
      efeito: "fonte-azul",
    },
    adultoSaudavel: {
      titulo: "Para Morajo",
      mensagem:
        "Você não precisa ser perfeito para ser seguro. Descansar não faz tudo desabar — faz você durar o suficiente para construir o que importa.",
    },
  },
  {
    id: "jardim",
    numero: 3,
    titulo: "Jardim Suspiro",
    subtitulo: "Zulmi — Criança Vulnerável",
    personagem: "zulmi",
    modo: "Criança Vulnerável",
    cor: "#7b1fa2",
    glow: "#ba68c8",
    narrativa:
      "As flores estão murchas. As borboletas voam cinzas. Zulmi está escondida atrás de um arbusto, sozinha, depois de uma festa que não deu certo. Ela sente que foi deixada de fora do mundo.",
    pergunta: {
      id: "jardim-q1",
      situacao: "Zulmi está encolhida, com os olhos marejados, pensando: 'Ninguém se importa. Eu sou demais e, ao mesmo tempo, nunca o suficiente.'",
      pergunta: "Qual modo a Zulmi está usando?",
      opcoes: [
        { id: "a", texto: "Protetor Indignado", correto: false, explicacao: "O Protetor Indignado ataca ou se defende com raiva. Zulmi aqui está ferida, não irritada." },
        { id: "b", texto: "Criança Vulnerável", correto: true, explicacao: "Exato. Tristeza, abandono, medo de ser rejeitada e a sensação de ser pequena demais são marcas dessa criança interior." },
        { id: "c", texto: "Detetive / Metacognição", correto: false, explicacao: "A metacognição observa o próprio processo. Zulmi está mergulhada na dor, não observando de fora." },
        { id: "d", texto: "Protetor de Fuga", correto: false, explicacao: "A fuga desconecta. Zulmi está sentindo muito, muito intensamente." },
      ],
    },
    recompensa: {
      titulo: "O jardim desabrocha",
      descricao: "Borboletas azuis surgem e as flores voltam a corar. A Criança Vulnerável é acolhida, não julgada.",
      efeito: "borboletas-azuis",
    },
    adultoSaudavel: {
      titulo: "Para Zulmi",
      mensagem:
        "Sua dor não é exagero. É uma criança interior pedindo colo. Quando você a abraça em vez de fugir, ela começa a respirar.",
    },
  },
  {
    id: "caverna",
    numero: 4,
    titulo: "Caverna Tramanhas",
    subtitulo: "Azedo — Protetor Indignado",
    personagem: "azedo",
    modo: "Protetor Indignado / Hipercompensador",
    cor: "#b71c1c",
    glow: "#ef5350",
    narrativa:
      "Pedras escuras, cristais vermelhos pulsando como corações irritados. Azedo segura uma ferramenta, rindo de um jeito que não chega aos olhos. A defesa dele é atacar antes que possam machucá-lo.",
    pergunta: {
      id: "caverna-q1",
      situacao: "Azedo diz com escárnio: 'Vocês são todos ridículos. Eu não preciso de ninguém. Antes eu quebro tudo do que deixo alguém me ver com medo.'",
      pergunta: "Qual modo o Azedo está usando?",
      opcoes: [
        { id: "a", texto: "Criança Feliz", correto: false, explicacao: "A Criança Feliz brinca e relaxa. Azedo está tenso e na defensiva." },
        { id: "b", texto: "Protetor de Fuga", correto: false, explicacao: "A fuga some ou desliga. Azedo está bem presente — e atacando." },
        { id: "c", texto: "Protetor Indignado / Hipercompensador", correto: true, explicacao: "Isso mesmo. A raiva defensiva e a máscara de 'durão' escondem a vulnerabilidade de não se sentir seguro." },
        { id: "d", texto: "Adulto Saudável", correto: false, explicacao: "O Adulto Saudável reconhece a raiva sem destruir. Azedo ainda está no ataque." },
      ],
    },
    recompensa: {
      titulo: "A tramanha se desmonta",
      descricao: "A armadura de Azedo afrouxa. Os cristais vermelhos ficam transparentes, e a caverna respira.",
      efeito: "cristais-transparentes",
    },
    adultoSaudavel: {
      titulo: "Para Azedo",
      mensagem:
        "Atacar os outros não cura a sua própria dor. Por trás da armadura existe alguém que um dia precisou defender. Você já pode baixar as armas devagar.",
    },
  },
  {
    id: "floresta",
    numero: 5,
    titulo: "Floresta do Silêncio",
    subtitulo: "Linn — Protetor de Fuga",
    personagem: "linn",
    modo: "Protetor Desligado / Protetor de Fuga",
    cor: "#2e7d32",
    glow: "#66bb6a",
    narrativa:
      "A floresta é densa, iluminada só pelo luar. Linn está sentado num banco de musgo, desconectado, olhando para longe. Ao lado dele, Godofredo — seu peixinho dourado — flutua numa bolha de água, a única coisa que ainda brilha.",
    pergunta: {
      id: "floresta-q1",
      situacao: "Linn diz: 'Tanto faz. Não estou nem aí. Vou ficar aqui no meu canto, em silêncio, até tudo passar.'",
      pergunta: "Qual modo o Linn está usando?",
      opcoes: [
        { id: "a", texto: "Protetor Punidor", correto: false, explicacao: "O Punidor cobra e controla. Linn está se afastando, não cobrando." },
        { id: "b", texto: "Criança Vulnerável", correto: false, explicacao: "A Criança Vulnerável sente intensamente. Linn parece não sentir nada — é a armadilha da fuga." },
        { id: "c", texto: "Adulto Saudável", correto: false, explicacao: "O Adulto Saudável escolhe o silêncio com consciência. Linn está fugindo da dor." },
        { id: "d", texto: "Protetor de Fuga / Desligado", correto: true, explicacao: "Exato. Fugir, se isolar e desconectar as emoções são maneiras de não sentir a dor — mas também de não sentir a alegria." },
      ],
    },
    recompensa: {
      titulo: "A floresta canta",
      descricao: "Godofredo brilha mais forte, e os sons da floresta voltam. Desconectar ajudou um dia; agora, reconectar é possível.",
      efeito: "godofredo-brilha",
    },
    adultoSaudavel: {
      titulo: "Para Linn",
      mensagem:
        "Ficar no silêncio te salvou em algum momento. Mas você não precisa desaparecer para estar seguro. Pode voltar aos poucos, na velocidade que fizer sentido.",
    },
  },
  {
    id: "torre",
    numero: 6,
    titulo: "Torre da Pessy",
    subtitulo: "Pessy — Detetive / Metacognição",
    personagem: "pessy",
    modo: "Metacognição",
    cor: "#f57c00",
    glow: "#ffb74d",
    narrativa:
      "Uma torre feita de livros, lupas e papéis flutuantes. Pessy olha para você por cima da própria luneta e pergunta: 'E aí? Qual modo VOCÊ está usando AGORA?'",
    pergunta: {
      id: "torre-q1",
      situacao: "Pessy não quer uma resposta certa. Ela quer que você olhe para dentro.",
      pergunta: "Neste momento, qual modo parece estar mais ativo em você?",
      opcoes: [
        { id: "a", texto: "Estou tentando controlar tudo (Punidor/Exigente)", correto: true, explicacao: "Perceber já é metacognição. Não importa qual modo, importa que você está olhando." },
        { id: "b", texto: "Estou me sentindo pequeno ou abandonado (Vulnerável)", correto: true, explicacao: "Perceber já é metacognição. Não importa qual modo, importa que você está olhando." },
        { id: "c", texto: "Estou irritado ou na defensiva (Indignado)", correto: true, explicacao: "Perceber já é metacognição. Não importa qual modo, importa que você está olhando." },
        { id: "d", texto: "Estou fugindo ou desconectado (Fuga)", correto: true, explicacao: "Perceber já é metacognição. Não importa qual modo, importa que você está olhando." },
      ],
    },
    recompensa: {
      titulo: "A lupa vira espelho",
      descricao: "Quando você observa o próprio processo, a torre se ilumina. A esfera dourada sobe.",
      efeito: "esfera-dourada",
    },
    adultoSaudavel: {
      titulo: "Para Pessy",
      mensagem:
        "Investigar é útil, mas viver só como detetive de si mesmo cansa. Às vezes o melhor passo é notar e, na sequência, escolher com calma.",
    },
    reflexivo: true,
  },
  {
    id: "reencontro",
    numero: 7,
    titulo: "O Reencontro",
    subtitulo: "Torajo — Adulto Saudável",
    personagem: "torajo",
    modo: "Adulto Saudável / Criança Feliz",
    cor: "#fbc02d",
    glow: "#fff176",
    narrativa:
      "Verade amanheceu. A praça está restaurada, a fonte jorra, as flores dançam. Toda a turma se reuniu. Cada um carrega um modo, mas nenhum deles precisa dominar sozinho.",
    pergunta: {
      id: "reencontro-q1",
      situacao: "Torajo olha para o grupo e diz: 'A gente não precisa ser só um deles. O Adulto Saudável é a parte que acolhe, limita e escolhe com calma.'",
      pergunta: "Qual é o objetivo da Terapia do Esquema?",
      opcoes: [
        { id: "a", texto: "Nunca mais sentir raiva, medo ou tristeza", correto: false, explicacao: "Não. As emoções fazem parte da vida. O objetivo é fortalecer quem dirige a mente na crise." },
        { id: "b", texto: "Fortalecer o Adulto Saudável para cuidar dos outros modos", correto: true, explicacao: "Isso mesmo. O Adulto Saudável acolhe a criança, coloca limites no impulsivo e dispensa as armaduras quando não são mais necessárias." },
        { id: "c", texto: "Eliminar todos os modos difíceis para sempre", correto: false, explicacao: "Os modos difíceis surgem para proteger. O trabalho é integrá-los, não destruí-los." },
        { id: "d", texto: "Trocar de personalidade até ficar perfeito", correto: false, explicacao: "Não existe personalidade perfeita. O objetivo é flexibilidade, não substituição total." },
      ],
    },
    recompensa: {
      titulo: "Todas as esferas se unem",
      descricao: "Azul, roxa, vermelha, verde, laranja e dourada dançam juntas. Verade é de dia.",
      efeito: "esferas-unidas",
    },
    adultoSaudavel: {
      titulo: "Para Torajo",
      mensagem:
        "Você pode ser criativo como o Torajo, lógico como o Morajo, sensível como a Zulmi, observador como o Linn e curioso como a Pessy — tudo isso equilibrado pela calma do Adulto Saudável.",
    },
  },
];

export function capituloPorId(id: string): Capitulo | undefined {
  return capitulos.find((c) => c.id === id);
}

export const personagensVerade: PersonagemId[] = ["torajo", "morajo", "zulmi", "azedo", "linn", "pessy"];
