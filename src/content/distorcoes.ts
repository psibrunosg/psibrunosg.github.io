// Baralho das Distorções — 12 monstros (public/img/monstros/<id>.webp) mapeados
// para as distorções cognitivas clássicas da TCC (Beck/Burns).
// ⚠️ Textos e mapeamento são proposta inicial — revisão clínica do Bruno pendente (ver Vault/Plano.md).

export type Distorcao = {
  id: string; // casa com public/img/monstros/<id>.webp
  apelido: string; // nome lúdico do monstro
  distorcao: string; // nome clínico
  resumo: string; // o que o monstro faz
  exemplo: string; // pensamento típico (verso da carta)
  antidoto: string; // pergunta socrática de contraponto
  frases: string[]; // pensamentos para o modo jogo (quiz)
};

export const distorcoes: Distorcao[] = [
  {
    id: "pretoebranco",
    apelido: "O Preto-e-Branco",
    distorcao: "Pensamento tudo-ou-nada",
    resumo: "Vê o mundo em 8 ou 80: ou é perfeito, ou é um fracasso total. Meio-termo não existe no vocabulário dele.",
    exemplo: "Se não tirei 10, sou um fracasso.",
    antidoto: "O que existe entre o perfeito e o desastre? Onde está o meio-termo?",
    frases: [
      "Se não tirei 10, sou um fracasso.",
      "Ou faço tudo certo, ou nem vale a pena começar.",
    ],
  },
  {
    id: "generalizador",
    apelido: "O Generalizador",
    distorcao: "Supergeneralização",
    resumo: "Transforma um evento isolado em regra universal: um \"não\" vira \"sempre\" e \"nunca\".",
    exemplo: "Deu errado uma vez, sempre vai dar errado.",
    antidoto: "Isso acontece de fato sempre, ou aconteceu uma vez? Quais foram as exceções?",
    frases: [
      "Deu errado uma vez, sempre vai dar errado.",
      "Ninguém nunca me escuta.",
    ],
  },
  {
    id: "filtro",
    apelido: "O Filtro",
    distorcao: "Filtro mental",
    resumo: "Coa a realidade e deixa passar só o negativo. Dez elogios e uma crítica? Só a crítica fica retida.",
    exemplo: "A apresentação foi horrível — travei em um slide.",
    antidoto: "O que mais aconteceu que estou deixando fora da foto?",
    frases: [
      "A apresentação foi horrível — travei em um slide.",
      "O dia foi péssimo, peguei trânsito de manhã.",
    ],
  },
  {
    id: "vampiro",
    apelido: "O Vampiro do Positivo",
    distorcao: "Desqualificação do positivo",
    resumo: "Suga a força de tudo que é bom: elogio vira \"educação\", conquista vira \"sorte\", carinho vira \"pena\".",
    exemplo: "Só me elogiaram por educação.",
    antidoto: "Se foi só sorte, por que deu certo outras vezes? O que EU fiz pra isso acontecer?",
    frases: [
      "Só me elogiaram por educação.",
      "Passei na prova, mas foi pura sorte.",
    ],
  },
  {
    id: "leitor",
    apelido: "O Leitor de Mentes",
    distorcao: "Leitura mental",
    resumo: "Tem certeza absoluta do que os outros estão pensando — sem nenhuma prova.",
    exemplo: "Ela não respondeu, com certeza está brava comigo.",
    antidoto: "Que evidência real eu tenho? Já perguntei, em vez de adivinhar?",
    frases: [
      "Ela não respondeu, com certeza está brava comigo.",
      "Todo mundo ali achou que eu era ridículo.",
    ],
  },
  {
    id: "bolacristal",
    apelido: "A Bola de Cristal",
    distorcao: "Adivinhação do futuro",
    resumo: "Prevê desastres com convicção de vidente: o futuro ruim deixa de ser hipótese e vira certeza.",
    exemplo: "Vou mal na entrevista, nem adianta ir.",
    antidoto: "Quantas previsões minhas já erraram? O que é possível, e o que é provável?",
    frases: [
      "Vou mal na entrevista, nem adianta ir.",
      "Isso não vai dar certo, eu já sei como termina.",
    ],
  },
  {
    id: "dramatizador",
    apelido: "O Dramatizador",
    distorcao: "Catastrofização",
    resumo: "Pega um problema real e amplia, amplia, amplia — até virar o fim do mundo.",
    exemplo: "Errei no trabalho. Vou ser demitido e nunca mais vou me recuperar.",
    antidoto: "Qual é o pior cenário, o melhor e o MAIS PROVÁVEL? Eu sobreviveria ao pior?",
    frases: [
      "Errei no trabalho. Vou ser demitido e nunca mais vou me recuperar.",
      "Meu coração acelerou — deve ser algo gravíssimo.",
    ],
  },
  {
    id: "zarolho",
    apelido: "O Zarolho",
    distorcao: "Minimização",
    resumo: "Enxerga com um olho só: diminui suas qualidades e conquistas até quase desaparecerem.",
    exemplo: "Passei, mas foi fácil — qualquer um passaria.",
    antidoto: "Se um amigo tivesse feito o mesmo, eu diminuiria o feito dele assim?",
    frases: [
      "Passei, mas foi fácil — qualquer um passaria.",
      "Isso que eu fiz não conta, era obrigação.",
    ],
  },
  {
    id: "detetive",
    apelido: "O Detetive do Sentimento",
    distorcao: "Raciocínio emocional",
    resumo: "Trata sentimento como prova definitiva: se eu sinto, então é verdade.",
    exemplo: "Sinto que sou um fardo, então devo ser mesmo.",
    antidoto: "Sentir algo torna isso um fato? Que provas existem além do sentimento?",
    frases: [
      "Sinto que sou um fardo, então devo ser mesmo.",
      "Estou com medo, então tem perigo de verdade aqui.",
    ],
  },
  {
    id: "etiquetadora",
    apelido: "A Etiquetadora",
    distorcao: "Rotulação",
    resumo: "Cola um rótulo por cima do erro: em vez de \"eu errei\", vira \"eu sou um erro\".",
    exemplo: "Sou burro. Sou um fracassado.",
    antidoto: "Estou descrevendo um comportamento ou me condenando como pessoa inteira?",
    frases: [
      "Sou burro. Sou um fracassado.",
      "Ele atrasou de novo: é um completo irresponsável.",
    ],
  },
  {
    id: "culpa",
    apelido: "O Culpador",
    distorcao: "Personalização",
    resumo: "Assume a culpa por tudo — até pelo que nunca esteve sob o seu controle.",
    exemplo: "Meus pais brigaram por minha causa.",
    antidoto: "O que estava de fato sob meu controle? Quantos outros fatores existiam?",
    frases: [
      "Meus pais brigaram por minha causa.",
      "O grupo foi mal na dinâmica porque eu estava lá.",
    ],
  },
  {
    id: "perfeccionista",
    apelido: "O Perfeccionista",
    distorcao: "Tirania dos \"deveria\"",
    resumo: "Governa com um chicote de \"deveria\", \"tenho que\", \"preciso ser\". Nada nunca é suficiente.",
    exemplo: "Eu deveria dar conta de tudo sem reclamar.",
    antidoto: "Quem escreveu essa regra? O que muda se eu trocar \"devo\" por \"gostaria\"?",
    frases: [
      "Eu deveria dar conta de tudo sem reclamar.",
      "Não posso descansar enquanto houver algo por fazer.",
    ],
  },
];

export const monstroImg = (id: string) => `/img/monstros/${id}.webp`;
