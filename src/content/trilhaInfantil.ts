// Trilha infantil — Capítulo 2 do Leahy: Evocação de Pensamentos.
// Fonte: Vault/adaptacoes_ferramentas_online.md (técnicas 2.1, 2.2, 2.6, 2.7/2.8).
// ⚠️ Cenas e frases são proposta inicial — revisão clínica do Bruno pendente.

// ---------- 2.1 — Separando Tudo (fato / pensamento / sentimento) ----------

export type CaixaTipo = "fato" | "pensamento" | "sentimento";

export interface CartaCena {
  texto: string;
  tipo: CaixaTipo;
}

export interface CenaSeparando {
  emoji: string;
  situacao: string;
  cartas: CartaCena[];
}

export const cenasSeparando: CenaSeparando[] = [
  {
    emoji: "🙋",
    situacao: "Você levantou a mão e a professora escolheu outro colega pra responder.",
    cartas: [
      { texto: "A professora escolheu o Pedro pra responder.", tipo: "fato" },
      { texto: "Ela deve achar que eu sou burro.", tipo: "pensamento" },
      { texto: "Fiquei triste e com raiva.", tipo: "sentimento" },
    ],
  },
  {
    emoji: "🎮",
    situacao: "Você chamou um amigo pra brincar e ele disse que não podia.",
    cartas: [
      { texto: "Ele disse que não podia brincar agora.", tipo: "fato" },
      { texto: "Ele não gosta mais de mim.", tipo: "pensamento" },
      { texto: "Fiquei magoado.", tipo: "sentimento" },
    ],
  },
  {
    emoji: "📝",
    situacao: "Você tirou uma nota baixa na prova de matemática.",
    cartas: [
      { texto: "Tirei 5 na prova.", tipo: "fato" },
      { texto: "Eu sou péssimo em matemática.", tipo: "pensamento" },
      { texto: "Fiquei envergonhado.", tipo: "sentimento" },
    ],
  },
  {
    emoji: "🐶",
    situacao: "Seu cachorro rasgou seu caderno.",
    cartas: [
      { texto: "O caderno ficou rasgado.", tipo: "fato" },
      { texto: "Agora vou levar bronca.", tipo: "pensamento" },
      { texto: "Fiquei com medo.", tipo: "sentimento" },
    ],
  },
  {
    emoji: "🎂",
    situacao: "Você não foi convidado pro aniversário de um colega.",
    cartas: [
      { texto: "Não recebi o convite.", tipo: "fato" },
      { texto: "Ninguém gosta de mim.", tipo: "pensamento" },
      { texto: "Fiquei triste.", tipo: "sentimento" },
    ],
  },
];

// ---------- 2.2 — Balões do Clima (pensamento → sol ou chuva) ----------

export interface BalaoPensamento {
  texto: string;
  clima: "sol" | "chuva";
}

export const baloesClima: BalaoPensamento[] = [
  { texto: "Vou brincar no parque hoje!", clima: "sol" },
  { texto: "Ninguém vai sentar comigo no recreio.", clima: "chuva" },
  { texto: "Consegui montar sozinho o quebra-cabeça!", clima: "sol" },
  { texto: "Vou esquecer a fala na apresentação.", clima: "chuva" },
  { texto: "Meu amigo vai adorar o presente que eu fiz.", clima: "sol" },
  { texto: "Todo mundo vai rir de mim se eu errar.", clima: "chuva" },
];

// ---------- 2.6 — Roda da Crença (grau de crença 0-100%) ----------

export interface PensamentoCrenca {
  texto: string;
}

export const pensamentosCrenca: PensamentoCrenca[] = [
  { texto: "Se eu errar a prova, todo mundo vai rir de mim." },
  { texto: "Meu melhor amigo vai continuar sendo meu amigo mesmo se eu perder o jogo." },
  { texto: "Se eu chorar na escola, os colegas vão me achar bebê." },
  { texto: "Consigo aprender a andar de bicicleta se eu treinar." },
  { texto: "Ninguém vai querer sentar perto de mim amanhã." },
];

export const FATIAS_RODA = [10, 25, 40, 50, 60, 75, 90, 100] as const;

// ---------- 2.7 / 2.8 — Lentes Mágicas (distorções em versão infantil) ----------

export type LenteId = "cinza" | "pretoebranco" | "boladecristal" | "leitor" | "monstro" | "sempre";

export interface Lente {
  id: LenteId;
  nome: string;
  emoji: string;
  cor: string;
  explicacao: string;
}

export const lentesMagicas: Record<LenteId, Lente> = {
  cinza: {
    id: "cinza",
    nome: "Lente Cinza",
    emoji: "🌫️",
    cor: "#6b7280",
    explicacao: "Só deixa você ver o que deu errado — some com tudo que deu certo.",
  },
  pretoebranco: {
    id: "pretoebranco",
    nome: "Lente Preto-e-Branco",
    emoji: "⚫",
    cor: "#374151",
    explicacao: "Só existe ótimo ou péssimo — o meio-termo desaparece.",
  },
  boladecristal: {
    id: "boladecristal",
    nome: "Lente da Bola de Cristal",
    emoji: "🔮",
    cor: "#8b5cf6",
    explicacao: "Finge que sabe o futuro e já espera o pior antes de tentar.",
  },
  leitor: {
    id: "leitor",
    nome: "Lente do Leitor de Mentes",
    emoji: "🧠",
    cor: "#ec4899",
    explicacao: "Acha que sabe o que o outro está pensando, sem perguntar.",
  },
  monstro: {
    id: "monstro",
    nome: "Lente do Monstro Gigante",
    emoji: "👹",
    cor: "#ef4444",
    explicacao: "Deixa qualquer problema pequeno do tamanho de um monstro gigante.",
  },
  sempre: {
    id: "sempre",
    nome: "Lente Sempre-ou-Nunca",
    emoji: "♾️",
    cor: "#f59e0b",
    explicacao: "Uma vez vira 'sempre' e 'nunca' — esquece todas as outras vezes.",
  },
};

export interface RodadaLente {
  frase: string;
  correta: LenteId;
  opcoes: LenteId[];
}

export const rodadasLentes: RodadaLente[] = [
  { frase: "Errei UMA questão, a prova inteira foi um DESASTRE.", correta: "cinza", opcoes: ["cinza", "monstro", "sempre"] },
  { frase: "Se eu não tirar 10, sou um fracasso total.", correta: "pretoebranco", opcoes: ["pretoebranco", "leitor", "boladecristal"] },
  { frase: "Eu sei que vou cair andando de patins.", correta: "boladecristal", opcoes: ["boladecristal", "cinza", "sempre"] },
  { frase: "Ela não sorriu, com certeza está brava comigo.", correta: "leitor", opcoes: ["leitor", "pretoebranco", "monstro"] },
  { frase: "Esqueci minha mochila, agora ferrou TUDO.", correta: "monstro", opcoes: ["monstro", "boladecristal", "cinza"] },
  { frase: "Perdi uma vez de bola, eu SEMPRE perco.", correta: "sempre", opcoes: ["sempre", "leitor", "pretoebranco"] },
];
