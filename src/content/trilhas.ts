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
];
