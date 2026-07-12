// Conteúdo do módulo "Modos do Esquema" — introdução simplificada aos modos
// esquemáticos (Terapia do Esquema), com foco em 4 modos amplos e acessíveis:
// Criança Vulnerável, Protetor Desligado, Crítico Interno e Adulto Saudável.
// Objetivo é reconhecimento cotidiano, não diagnóstico.

import type { QuizConfig } from "@/components/psicoed/QuizEngine";
import type { FlashcardItem } from "@/components/psicoed/Flashcards";

export type ModoId = "crianca-vulneravel" | "protetor-desligado" | "critico-interno" | "adulto-saudavel";

export interface Modo {
  id: ModoId;
  nome: string;
  cor: string;
  descricao: string;
  reconhecer: string[];
}

export const modos: Modo[] = [
  {
    id: "crianca-vulneravel",
    nome: "Criança Vulnerável",
    cor: "#6B8BA4",
    descricao:
      "A parte que sente medo, tristeza, solidão ou vergonha de forma crua — como se a necessidade não atendida de antes ainda estivesse presente agora.",
    reconhecer: ["Sensação de pequenez ou desamparo", "Medo de ser rejeitado ou abandonado", "Vontade de se esconder ou chorar", "Sentir que 'ninguém vai entender'"],
  },
  {
    id: "protetor-desligado",
    nome: "Protetor Desligado",
    cor: "#8B8B8B",
    descricao:
      "A parte que desliga o contato com a emoção para não sentir a dor — evita, adia, distrai, some. Protege no curto prazo, mas afasta da própria vida.",
    reconhecer: ["Vontade de fugir, adiar ou evitar", "Sensação de vazio ou 'piloto automático'", "Usar tela, comida ou distração para não sentir", "Dificuldade de dizer o que sente"],
  },
  {
    id: "critico-interno",
    nome: "Crítico Interno",
    cor: "#D97757",
    descricao:
      "A voz interna que cobra, compara e pune — muitas vezes ecoando mensagens recebidas no passado. Fala como se exigir fosse a única forma de cuidar.",
    reconhecer: ["Frases como 'você não é bom o suficiente'", "Comparação constante com os outros", "Pouca tolerância a erros próprios", "Sensação de nunca ser suficiente"],
  },
  {
    id: "adulto-saudavel",
    nome: "Adulto Saudável",
    cor: "#7FA37F",
    descricao:
      "A parte que consegue acolher a Criança Vulnerável, colocar limite no Crítico Interno e agir com equilíbrio, mesmo sentindo desconforto. É a que se busca fortalecer.",
    reconhecer: ["Reconhece a emoção sem ser dominado por ela", "Consegue se falar com gentileza e firmeza", "Toma decisões considerando necessidades reais", "Pede ajuda quando precisa, sem se punir por isso"],
  },
];

export const modoPorId = (id: ModoId) => modos.find((m) => m.id === id)!;

// Quiz "qual modo está falando?" — 8 falas cotidianas.
export const modosQuiz: QuizConfig = {
  perguntas: [
    {
      id: "m1",
      pergunta: '"Não aguento mais, quero só sumir e não pensar em nada." Qual modo está falando?',
      opcoes: [
        { id: "protetor-desligado", texto: "Protetor Desligado", correta: true, explicacao: "Isso mesmo — é a parte que busca desligar do sentimento em vez de processá-lo, uma forma de proteção pelo afastamento." },
        { id: "crianca-vulneravel", texto: "Criança Vulnerável", correta: false, explicacao: "A Criança Vulnerável sentiria e expressaria a dor diretamente. Aqui a fala busca desligar da dor, não senti-la: Protetor Desligado." },
        { id: "critico-interno", texto: "Crítico Interno", correta: false, explicacao: "O Crítico cobra e julga. Aqui não há cobrança, há um pedido de desligamento: Protetor Desligado." },
      ],
    },
    {
      id: "m2",
      pergunta: '"Você é um fracasso, todo mundo vai perceber que você não dá conta." Qual modo está falando?',
      opcoes: [
        { id: "critico-interno", texto: "Crítico Interno", correta: true, explicacao: "Exato — a voz que julga e ameaça com exposição costuma ser o Crítico Interno, mesmo quando parece 'só realista'." },
        { id: "adulto-saudavel", texto: "Adulto Saudável", correta: false, explicacao: "O Adulto Saudável fala com firmeza, mas sem humilhar. Essa fala pune e ameaça: Crítico Interno." },
        { id: "protetor-desligado", texto: "Protetor Desligado", correta: false, explicacao: "O Protetor evita sentir, não ataca com julgamento. Essa fala julga diretamente: Crítico Interno." },
      ],
    },
    {
      id: "m3",
      pergunta: '"Tenho tanto medo de ficar sozinho, ninguém vai gostar de mim de verdade." Qual modo está falando?',
      opcoes: [
        { id: "crianca-vulneravel", texto: "Criança Vulnerável", correta: true, explicacao: "Isso mesmo — o medo cru de abandono e a sensação de não ser querido são marcas típicas da Criança Vulnerável." },
        { id: "critico-interno", texto: "Crítico Interno", correta: false, explicacao: "O Crítico julga com dureza. Aqui há medo e vulnerabilidade, não julgamento: Criança Vulnerável." },
        { id: "protetor-desligado", texto: "Protetor Desligado", correta: false, explicacao: "O Protetor evitaria sentir esse medo diretamente. Aqui o medo está exposto, cru: Criança Vulnerável." },
      ],
    },
    {
      id: "m4",
      pergunta: '"Estou com medo, mas vou tentar mesmo assim — dá pra pedir ajuda se precisar." Qual modo está falando?',
      opcoes: [
        { id: "adulto-saudavel", texto: "Adulto Saudável", correta: true, explicacao: "Exato — reconhece o medo sem negá-lo e ainda assim age com equilíbrio, incluindo pedir apoio. Essa é a marca do Adulto Saudável." },
        { id: "crianca-vulneravel", texto: "Criança Vulnerável", correta: false, explicacao: "A Criança sentiria o medo sem necessariamente conseguir agir com equilíbrio. Aqui há ação equilibrada apesar do medo: Adulto Saudável." },
        { id: "critico-interno", texto: "Crítico Interno", correta: false, explicacao: "Não há cobrança nem julgamento aqui — há acolhimento e ação: Adulto Saudável." },
      ],
    },
    {
      id: "m5",
      pergunta: '"Vou adiar de novo essa conversa difícil, depois eu penso nisso." Qual modo está falando?',
      opcoes: [
        { id: "protetor-desligado", texto: "Protetor Desligado", correta: true, explicacao: "Isso mesmo — adiar repetidamente para não sentir o desconforto é uma estratégia clássica do Protetor Desligado." },
        { id: "adulto-saudavel", texto: "Adulto Saudável", correta: false, explicacao: "O Adulto Saudável também pode adiar às vezes, mas de forma consciente e planejada, não como fuga automática: aqui o padrão é evitação, Protetor Desligado." },
        { id: "crianca-vulneravel", texto: "Criança Vulnerável", correta: false, explicacao: "A Criança sentiria e expressaria a dificuldade, não a evitaria de forma automática: Protetor Desligado." },
      ],
    },
    {
      id: "m6",
      pergunta: '"Errei de novo. Sou sempre assim, incompetente em tudo que faço." Qual modo está falando?',
      opcoes: [
        { id: "critico-interno", texto: "Crítico Interno", correta: true, explicacao: "Exato — generalizar um erro pontual em um rótulo fixo ('sempre', 'incompetente em tudo') é típico do Crítico Interno." },
        { id: "crianca-vulneravel", texto: "Criança Vulnerável", correta: false, explicacao: "A Criança sentiria tristeza pelo erro, mas o julgamento generalizado e duro vem do Crítico Interno." },
        { id: "adulto-saudavel", texto: "Adulto Saudável", correta: false, explicacao: "O Adulto reconheceria o erro sem generalizar ou se punir com dureza: aqui há punição generalizada, Crítico Interno." },
      ],
    },
    {
      id: "m7",
      pergunta: '"Não sinto nada, é mais fácil assim, não quero nem pensar no assunto." Qual modo está falando?',
      opcoes: [
        { id: "protetor-desligado", texto: "Protetor Desligado", correta: true, explicacao: "Isso mesmo — o desligamento da própria emoção como forma de proteção é a marca central desse modo." },
        { id: "critico-interno", texto: "Crítico Interno", correta: false, explicacao: "O Crítico julgaria a situação com dureza. Aqui há desligamento, não julgamento: Protetor Desligado." },
        { id: "crianca-vulneravel", texto: "Criança Vulnerável", correta: false, explicacao: "A Criança sentiria a emoção de forma crua. Aqui a emoção está sendo evitada: Protetor Desligado." },
      ],
    },
    {
      id: "m8",
      pergunta: '"Isso doeu, e tudo bem doer. Vou cuidar de mim e seguir no meu ritmo." Qual modo está falando?',
      opcoes: [
        { id: "adulto-saudavel", texto: "Adulto Saudável", correta: true, explicacao: "Exato — validar a dor sem se punir ou se desligar dela, e ainda assim seguir cuidando de si, é a marca do Adulto Saudável." },
        { id: "crianca-vulneravel", texto: "Criança Vulnerável", correta: false, explicacao: "A Criança sentiria a dor sem necessariamente conseguir se acolher com equilíbrio. Aqui há acolhimento ativo: Adulto Saudável." },
        { id: "protetor-desligado", texto: "Protetor Desligado", correta: false, explicacao: "O Protetor evitaria sentir a dor. Aqui a dor é reconhecida e acolhida, não evitada: Adulto Saudável." },
      ],
    },
  ],
};

export const modosFlashcards: FlashcardItem[] = modos.map((m) => ({
  id: m.id,
  frente: m.nome,
  verso: `${m.descricao}\n\nComo reconhecer: ${m.reconhecer.join("; ")}.`,
}));

// Mini-simulador: cenário → escolher a resposta do Adulto Saudável entre 3 opções.
export interface CenarioModo {
  id: string;
  situacao: string;
  opcoes: {
    id: string;
    texto: string;
    modo: ModoId;
    correta: boolean;
    feedback: string;
  }[];
}

export const cenariosModo: CenarioModo[] = [
  {
    id: "c1",
    situacao: "Você cometeu um erro perceptível numa reunião importante do trabalho.",
    opcoes: [
      {
        id: "a",
        texto: '"Sou um desastre, vou ser demitido, eu sempre estrago tudo."',
        modo: "critico-interno",
        correta: false,
        feedback: "Essa é a voz do Crítico Interno — generaliza o erro e pune com dureza, em vez de olhar o fato com proporção.",
      },
      {
        id: "b",
        texto: '"Prefiro nem pensar nisso agora, vou distrair a cabeça o resto do dia."',
        modo: "protetor-desligado",
        correta: false,
        feedback: "Essa é a saída do Protetor Desligado — evita o desconforto, mas também evita aprender com o que aconteceu.",
      },
      {
        id: "c",
        texto: '"Foi um erro, desconfortável, mas dá pra corrigir e seguir. Errar faz parte."',
        modo: "adulto-saudavel",
        correta: true,
        feedback: "Essa é a resposta do Adulto Saudável — reconhece o erro sem inflar nem negar, e mantém o foco no que pode ser feito a seguir.",
      },
    ],
  },
  {
    id: "c2",
    situacao: "Um amigo demorou dias para responder sua mensagem.",
    opcoes: [
      {
        id: "a",
        texto: '"Bom, ele deve ter motivo. Se continuar me incomodando, pergunto como ele está."',
        modo: "adulto-saudavel",
        correta: true,
        feedback: "Essa é a resposta do Adulto Saudável — não ignora o desconforto, mas também não presume o pior; pode agir com clareza se precisar.",
      },
      {
        id: "b",
        texto: '"Com certeza fiz alguma coisa errada, ele não gosta mais de mim."',
        modo: "crianca-vulneravel",
        correta: false,
        feedback: "Essa é a voz da Criança Vulnerável — o medo de abandono lê o silêncio como rejeição, sem evidência real disso.",
      },
      {
        id: "c",
        texto: '"Não vou nem mandar mensagem de novo, quem se importa mesmo."',
        modo: "protetor-desligado",
        correta: false,
        feedback: "Essa é a saída do Protetor Desligado — desliga do vínculo para não sentir a possível dor da rejeição.",
      },
    ],
  },
  {
    id: "c3",
    situacao: "Você recebeu uma crítica dura de alguém que não considerou o contexto todo.",
    opcoes: [
      {
        id: "a",
        texto: '"Ela tem toda razão, sou mesmo incapaz, deveria nem ter tentado."',
        modo: "critico-interno",
        correta: false,
        feedback: "Aqui o Crítico Interno assume a crítica externa como verdade absoluta, sem questionar se ela é justa ou completa.",
      },
      {
        id: "b",
        texto: '"A crítica doeu. Vou pensar no que faz sentido e deixar de lado o que não faz."',
        modo: "adulto-saudavel",
        correta: true,
        feedback: "Essa é a resposta do Adulto Saudável — acolhe o desconforto, avalia com discernimento o que é útil, sem se punir nem descartar tudo.",
      },
      {
        id: "c",
        texto: '"Vou fingir que não ouvi e mudar de assunto rapidinho."',
        modo: "protetor-desligado",
        correta: false,
        feedback: "Essa é a saída do Protetor Desligado — evita processar a crítica, o que impede tanto a dor quanto o aprendizado possível.",
      },
    ],
  },
];
