// Conteúdo do módulo "Janela de Tolerância" — a faixa de ativação do
// sistema nervoso em que conseguimos pensar com clareza, sentir sem sermos
// dominados pela emoção e nos conectar com outras pessoas.

import type { QuizConfig } from "@/components/psicoed/QuizEngine";

export interface ZonaAtivacao {
  id: "hiper" | "janela" | "hipo";
  nome: string;
  cor: string; // usada em inline style para o simulador
  descricao: string;
  sinais: string[];
}

export const zonas: ZonaAtivacao[] = [
  {
    id: "hiper",
    nome: "Hiperativação",
    cor: "#D97757",
    descricao: "O sistema nervoso está em alerta máximo, como se um perigo estivesse acontecendo agora.",
    sinais: ["Coração acelerado", "Respiração curta", "Agitação, inquietação", "Pensamentos acelerados", "Dificuldade de ficar parado ou focar"],
  },
  {
    id: "janela",
    nome: "Dentro da janela",
    cor: "#7FA37F",
    descricao: "É possível sentir emoções fortes sem ser dominado por elas, e pensar com clareza mesmo sob pressão.",
    sinais: ["Corpo relativamente regulado", "Consigo ouvir e ser ouvido", "Emoções presentes, mas administráveis", "Consigo pensar em passos seguintes"],
  },
  {
    id: "hipo",
    nome: "Hipoativação",
    cor: "#6B8BA4",
    descricao: "O sistema nervoso 'desliga' como forma de proteção, quando a ativação foi longe demais.",
    sinais: ["Cansaço, peso no corpo", "Sensação de dormência ou vazio", "Desconexão de si e dos outros", "Dificuldade de se mexer, pensar ou falar"],
  },
];

export function zonaPorValor(v: number): ZonaAtivacao {
  if (v >= 67) return zonas[0];
  if (v <= 33) return zonas[2];
  return zonas[1];
}

export interface PassoExpansao {
  titulo: string;
  descricao: string;
}

export const passosExpansao: PassoExpansao[] = [
  {
    titulo: "Regularidade no sono e nas refeições",
    descricao: "Um corpo com rotina previsível gasta menos energia se regulando — sobra mais 'espaço' para lidar com o que aparece.",
  },
  {
    titulo: "Movimento no corpo",
    descricao: "Caminhar, alongar, respirar fundo — formas seguras de descarregar ativação acumulada, em vez de deixá-la se acumular.",
  },
  {
    titulo: "Conexões seguras",
    descricao: "Relações em que dá para ser você mesmo ajudam o sistema nervoso a perceber que, agora, não há perigo.",
  },
  {
    titulo: "Nomear o que sente",
    descricao: "Colocar em palavras o que está acontecendo ('estou ansioso', 'estou exausto') já tende a reduzir um pouco a intensidade da reação.",
  },
  {
    titulo: "Paciência com o processo",
    descricao: "A janela se expande aos poucos, com prática repetida ao longo do tempo — não de um dia para o outro.",
  },
];

export const janelaQuiz: QuizConfig = {
  perguntas: [
    {
      id: "j1",
      pergunta: "O que é 'estar dentro da janela de tolerância'?",
      opcoes: [
        { id: "a", texto: "Não sentir emoção nenhuma.", correta: false, explicacao: "Estar na janela não é ausência de emoção — é conseguir senti-la sem ser dominado por ela." },
        { id: "b", texto: "Conseguir sentir emoções fortes sem ser dominado por elas, pensando com alguma clareza.", correta: true, explicacao: "Isso mesmo — é a faixa em que emoção e razão convivem, mesmo sob pressão." },
        { id: "c", texto: "Estar sempre calmo e relaxado.", correta: false, explicacao: "A janela permite estresse e emoção intensa — o que muda é a capacidade de seguir funcionando dentro dela." },
      ],
    },
    {
      id: "j2",
      pergunta: "Coração acelerado, pensamentos correndo, dificuldade de ficar parado — isso costuma indicar:",
      opcoes: [
        { id: "a", texto: "Hipoativação.", correta: false, explicacao: "Hipoativação é o oposto: lentidão, dormência, desligamento." },
        { id: "b", texto: "Hiperativação.", correta: true, explicacao: "Exato — sinais de alerta máximo do sistema nervoso." },
        { id: "c", texto: "Estar dentro da janela.", correta: false, explicacao: "Dentro da janela o corpo está relativamente regulado, não em alerta máximo." },
      ],
    },
    {
      id: "j3",
      pergunta: "Sensação de vazio, cansaço extremo, dificuldade de se mexer ou falar — isso costuma indicar:",
      opcoes: [
        { id: "a", texto: "Hipoativação.", correta: true, explicacao: "Isso mesmo — o sistema nervoso 'desligou' como forma de proteção." },
        { id: "b", texto: "Hiperativação.", correta: false, explicacao: "Hiperativação é o oposto: agitação, aceleração." },
        { id: "c", texto: "Um sinal de preguiça ou falta de esforço.", correta: false, explicacao: "Não é uma questão de esforço — é uma resposta do sistema nervoso, não uma escolha." },
      ],
    },
    {
      id: "j4",
      pergunta: "A largura da janela de tolerância de uma pessoa:",
      opcoes: [
        { id: "a", texto: "É fixa e igual para todo mundo.", correta: false, explicacao: "Varia bastante entre pessoas e também no tempo, conforme sono, estresse acumulado e outros fatores." },
        { id: "b", texto: "Pode variar de pessoa para pessoa e de momento para momento, e pode ser trabalhada aos poucos.", correta: true, explicacao: "Exato — não é um traço fixo, é algo que se relaciona com o corpo, o contexto e a prática ao longo do tempo." },
        { id: "c", texto: "Só diminui, nunca aumenta.", correta: false, explicacao: "A janela pode se expandir com o tempo e com práticas de regulação — não é uma via de mão única." },
      ],
    },
    {
      id: "j5",
      pergunta: "Ao perceber sinais de hiperativação (coração acelerado, agitação), uma ação coerente com 'voltar à janela' é:",
      opcoes: [
        { id: "a", texto: "Tentar respirar mais devagar, mover o corpo ou buscar um ponto de apoio seguro.", correta: true, explicacao: "Isso mesmo — ações que ajudam a descarregar ou desacelerar a ativação, sem exigir 'parar de sentir'." },
        { id: "b", texto: "Ignorar completamente o que está sentindo até passar sozinho.", correta: false, explicacao: "Ignorar pode até funcionar às vezes, mas não é a estratégia mais consistente para voltar à janela." },
        { id: "c", texto: "Se cobrar para 'ficar calmo' imediatamente.", correta: false, explicacao: "Cobrança costuma aumentar a ativação, não diminuir — regular é diferente de forçar." },
      ],
    },
  ],
};
