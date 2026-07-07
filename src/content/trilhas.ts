// Trilhas de Tratamento — sequências de exercícios com desbloqueio progressivo.
// ⚠️ Mapeamento exercício→unidade é proposta inicial — revisão clínica do Bruno pendente.
// slug = identificador gravado por useExerciseSession (não é a rota).

export interface TrilhaExercicio {
  slug: string;
  href: string;
  titulo: string;
  tempo: string;
}

export interface TrilhaUnidade {
  titulo: string;
  emoji: string;
  descricao: string;
  exercicios: TrilhaExercicio[];
}

export interface TrilhaTratamento {
  id: string;
  titulo: string;
  emoji: string;
  descricao: string;
  base: string;
  unidades: TrilhaUnidade[];
}

// Nº de exercícios concluídos na unidade anterior para desbloquear a próxima
export const MIN_PARA_DESBLOQUEAR = 2;

export const XP_POR_CONCLUSAO = 10;

export const TRILHAS: TrilhaTratamento[] = [
  {
    id: "ansiedade",
    titulo: "Desarmando a Ansiedade",
    emoji: "🎯",
    descricao:
      "A ansiedade é um alarme que dispara sem incêndio. Nesta trilha você aprende a reconhecer o alarme falso, investigar as ameaças fantasmas, testar a realidade e, por fim, enfrentar o que evitava.",
    base: "Clark & Beck · Bourne",
    unidades: [
      {
        titulo: "Alarme Falso",
        emoji: "🚨",
        descricao: "Reconheça o alarme disparando e observe-o sem obedecer.",
        exercicios: [
          { slug: "acerte-distorcao", href: "/exercicios/acerte-distorcao", titulo: "Acerte a Distorção", tempo: "3 min" },
          { slug: "chuva-preocupacoes", href: "/exercicios/chuva", titulo: "Chuva de Preocupações", tempo: "3 min" },
          { slug: "balao-pensamentos", href: "/exercicios/balao", titulo: "Balão de Pensamentos", tempo: "3 min" },
        ],
      },
      {
        titulo: "Ameaças Fantasmas",
        emoji: "👻",
        descricao: "Encare o 'E se...?' de frente e meça o tamanho real da ameaça.",
        exercicios: [
          { slug: "roleta", href: "/exercicios/roleta", titulo: "Roleta do E Se?", tempo: "5 min" },
          { slug: "gps-decisoes", href: "/exercicios/gps", titulo: "GPS de Decisões", tempo: "6 min" },
          { slug: "maquina-tempo", href: "/exercicios/maquina-tempo", titulo: "Máquina do Tempo", tempo: "5 min" },
        ],
      },
      {
        titulo: "Teste de Realidade",
        emoji: "🔬",
        descricao: "Coloque as previsões catastróficas à prova dos fatos.",
        exercicios: [
          { slug: "caca-fatos", href: "/exercicios/fatos", titulo: "Caça aos Fatos", tempo: "4 min" },
          { slug: "balanca", href: "/exercicios/balanca", titulo: "Balança de Evidências", tempo: "4 min" },
          { slug: "muralha-evidencias", href: "/exercicios/muralha-evidencias", titulo: "Muralha de Evidências", tempo: "10 min" },
          { slug: "lab-previsoes", href: "/exercicios/previsoes", titulo: "Laboratório de Previsões", tempo: "5 min" },
        ],
      },
      {
        titulo: "Exposição Gradual",
        emoji: "⛰️",
        descricao: "Com as ferramentas na mochila, enfrente o desconforto de propósito — e veja ele encolher.",
        exercicios: [
          { slug: "tedio", href: "/exercicios/tedio", titulo: "Técnica do Tédio", tempo: "8 min" },
          { slug: "inundacao", href: "/exercicios/inundacao", titulo: "Inundação de Incertezas", tempo: "6 min" },
          { slug: "fantasia-temida", href: "/exercicios/fantasia", titulo: "Fantasia Temida", tempo: "6 min" },
        ],
      },
    ],
  },
  {
    id: "esquemas",
    titulo: "Academia de Esquemas",
    emoji: "🧩",
    descricao:
      "Padrões antigos de infância continuam ditando reações hoje. Nesta trilha você identifica suas armadilhas, reconhece os modos que assumem o controle, fortalece o Adulto Saudável e monta cartões de enfrentamento pra usar na vida real.",
    base: "Young — Reinvente Sua Vida",
    unidades: [
      {
        titulo: "Armadilhas",
        emoji: "🕸️",
        descricao: "Mapeie os esquemas — os padrões que se repetem desde cedo.",
        exercicios: [
          { slug: "oculos-esquemas", href: "/exercicios/oculos", titulo: "Óculos dos Esquemas", tempo: "6 min" },
          { slug: "less-ii", href: "/exercicios/less", titulo: "LESS-II: Mapa de Esquemas", tempo: "10 min" },
          { slug: "carta-fonte", href: "/exercicios/carta", titulo: "Carta à Fonte do Esquema", tempo: "8 min" },
        ],
      },
      {
        titulo: "Modos",
        emoji: "🎭",
        descricao: "Reconheça qual modo assumiu o controle — e quem estava por trás dele.",
        exercicios: [
          { slug: "baralho-adulto", href: "/exercicios/baralho-adulto", titulo: "Baralho Adulto", tempo: "5 min" },
          { slug: "reformulacao-historia", href: "/exercicios/reformulacao", titulo: "Reformulação de História", tempo: "8 min" },
        ],
      },
      {
        titulo: "Adulto Saudável",
        emoji: "🌳",
        descricao: "Fortaleça a parte de você que sabe cuidar, decidir e proteger.",
        exercicios: [
          { slug: "direitos", href: "/exercicios/direitos", titulo: "Construtor de Direitos", tempo: "6 min" },
          { slug: "cofre-forcas", href: "/exercicios/forcas", titulo: "Cofre de Forças", tempo: "7 min" },
          { slug: "bussola-valores", href: "/exercicios/bussola", titulo: "Bússola de Valores", tempo: "5 min" },
        ],
      },
      {
        titulo: "Cartões de Enfrentamento",
        emoji: "🛡️",
        descricao: "Transforme o entendimento em estratégia pronta pra usar no momento difícil.",
        exercicios: [
          { slug: "escavacao", href: "/exercicios/escavacao", titulo: "A Escavação", tempo: "10 min" },
          { slug: "pontos-tensao", href: "/exercicios/pontos", titulo: "Pontos de Tensão", tempo: "6 min" },
          { slug: "torta-responsabilidade", href: "/exercicios/torta", titulo: "Torta da Responsabilidade", tempo: "4 min" },
        ],
      },
    ],
  },
  {
    id: "energia",
    titulo: "Reativando a Energia",
    emoji: "🌱",
    descricao:
      "Quando a energia cai, tudo parece maior e mais difícil. Nesta trilha você aprende a reconhecer o ciclo da letargia, questionar o filtro negativo que só vê o que deu errado, e agir mesmo quando a vontade não chega primeiro.",
    base: "Vencendo a Depressão · Vencendo o Burnout",
    unidades: [
      {
        titulo: "Ciclo da Letargia",
        emoji: "🌀",
        descricao: "Perceba o ciclo baixa energia → evitar → culpa → mais baixa energia.",
        exercicios: [
          { slug: "registro-v2", href: "/exercicios/registro", titulo: "Registro de Pensamentos", tempo: "8 min" },
          { slug: "diario-lapsos", href: "/exercicios/lapsos", titulo: "Diário de Lapsos", tempo: "8 min" },
        ],
      },
      {
        titulo: "Filtro Negativo",
        emoji: "🔍",
        descricao: "O que a mente cansada deixa de fora quando só vê o que deu errado?",
        exercicios: [
          { slug: "conecte-abc", href: "/exercicios/conecte", titulo: "Conecte A-B-C", tempo: "5 min" },
          { slug: "perfeccionometro", href: "/exercicios/perfeccionometro", titulo: "Perfeccionômetro", tempo: "4 min" },
        ],
      },
      {
        titulo: "Ativação Comportamental",
        emoji: "⚡",
        descricao: "Agir primeiro, esperar a vontade chegar depois — passos pequenos contam.",
        exercicios: [
          { slug: "pares-mente", href: "/exercicios/pares", titulo: "Pares da Mente", tempo: "4 min" },
          { slug: "escrita-expressiva", href: "/exercicios/escrita", titulo: "Escrita Expressiva", tempo: "10 min" },
          { slug: "roda-emocoes", href: "/exercicios/emocoes", titulo: "Roda das Emoções", tempo: "4 min" },
        ],
      },
    ],
  },
];
