// Config de territórios do Mapa Exploratório de Psicoeducação.
// Dados puros — sem lógica de UI. O motor (MapaExploratorio.tsx) apenas lê isto.

import { distorcoes } from "@/content/distorcoes";
import type { QuizConfig } from "@/components/psicoed/QuizEngine";
import type { FlashcardItem } from "@/components/psicoed/Flashcards";

export type TerritorioStatus = "disponivel" | "em-breve";

export interface Territorio {
  id: string;
  titulo: string;
  descricaoCurta: string;
  icone: "brain" | "waves" | "scale" | "compass" | "moon" | "layers";
  rota: string;
  status: TerritorioStatus;
  teaser?: string; // exibido quando status = "em-breve"
  // posição relativa no mapa SVG (0-100), usada no desktop
  posicao: { x: number; y: number };
}

export const territorios: Territorio[] = [
  {
    id: "neuroanatomia",
    titulo: "Laboratório de Neuroanatomia 3D",
    descricaoCurta: "Explore um modelo 3D do cérebro e entenda como as emoções são processadas.",
    icone: "brain",
    rota: "/psicoeducacao/neuroanatomia",
    status: "disponivel",
    posicao: { x: 18, y: 22 },
  },
  {
    id: "distorcoes-cognitivas",
    titulo: "Distorções Cognitivas",
    descricaoCurta: "Identifique os padrões de pensamento que distorcem a realidade — e aprenda a questioná-los.",
    icone: "scale",
    rota: "/psicoeducacao/distorcoes",
    status: "disponivel",
    posicao: { x: 55, y: 15 },
  },
  {
    id: "ciclo-do-panico",
    titulo: "Ciclo do Pânico",
    descricaoCurta: "Como uma sensação física vira uma espiral de medo — e onde é possível interromper o ciclo.",
    icone: "waves",
    rota: "/psicoeducacao/ciclo-do-panico",
    status: "disponivel",
    posicao: { x: 82, y: 32 },
  },
  {
    id: "janela-de-tolerancia",
    titulo: "Janela de Tolerância",
    descricaoCurta: "A faixa em que conseguimos pensar com clareza — e o que acontece quando saímos dela.",
    icone: "compass",
    rota: "/psicoeducacao/janela-de-tolerancia",
    status: "disponivel",
    posicao: { x: 30, y: 55 },
  },
  {
    id: "sono",
    titulo: "Sono",
    descricaoCurta: "Por que a mente ansiosa e o sono brigam entre si — e como negociar essa relação.",
    icone: "moon",
    rota: "/psicoeducacao/sono",
    status: "disponivel",
    posicao: { x: 68, y: 68 },
  },
  {
    id: "modos-do-esquema",
    titulo: "Modos do Esquema",
    descricaoCurta: "As diferentes 'vozes' internas que assumem o controle em momentos difíceis — e como fortalecer a que cuida de você.",
    icone: "layers",
    rota: "/psicoeducacao/modos-do-esquema",
    status: "disponivel",
    posicao: { x: 50, y: 85 },
  },
];

// ---------------------------------------------------------------------------
// Módulo demo: Distorções Cognitivas
// ---------------------------------------------------------------------------

const distorcaoPorId = (id: string) => distorcoes.find((d) => d.id === id)!;

// 8 situações "identifique a distorção" — reaproveita o baralho existente
// (src/content/distorcoes.ts) para manter consistência de conteúdo clínico.
export const distorcoesQuiz: QuizConfig = {
  perguntas: [
    {
      id: "q1",
      pergunta: '"Se não tirei nota máxima, fui um fracasso completo." Qual distorção é essa?',
      opcoes: [
        { id: "a", texto: "Tudo-ou-nada", correta: true, explicacao: "Isso mesmo — o pensamento só enxerga dois extremos, perfeito ou fracasso, sem meio-termo." },
        { id: "b", texto: "Personalização", correta: false, explicacao: "Personalização é assumir culpa por algo fora do seu controle. Aqui o padrão é ver tudo em extremos: correto." },
        { id: "c", texto: "Leitura mental", correta: false, explicacao: "Leitura mental é presumir o que o outro está pensando. Aqui não há isso — o padrão é tudo-ou-nada." },
      ],
    },
    {
      id: "q2",
      pergunta: '"Ela não respondeu minha mensagem, com certeza está brava comigo." Qual distorção é essa?',
      opcoes: [
        { id: "a", texto: "Catastrofização", correta: false, explicacao: "Catastrofização amplia um problema até o pior cenário possível. Aqui a pessoa está adivinhando o pensamento alheio: outra categoria." },
        { id: "b", texto: "Leitura mental", correta: true, explicacao: "Exato — presumir o que o outro pensa ou sente sem nenhuma evidência real." },
        { id: "c", texto: "Filtro mental", correta: false, explicacao: "Filtro mental é focar só no negativo de uma situação com vários aspectos. Aqui o problema é presumir a mente alheia." },
      ],
    },
    {
      id: "q3",
      pergunta: '"Errei uma vez no trabalho. Vou ser demitido e nunca mais vou conseguir outro emprego." Qual distorção é essa?',
      opcoes: [
        { id: "a", texto: "Catastrofização", correta: true, explicacao: "Isso mesmo — um problema real é ampliado até o desfecho mais dramático imaginável." },
        { id: "b", texto: "Desqualificação do positivo", correta: false, explicacao: "Desqualificar o positivo é diminuir uma conquista. Aqui o padrão é inflar uma consequência: catastrofização." },
        { id: "c", texto: "Supergeneralização", correta: false, explicacao: "Supergeneralização transforma um evento isolado em regra ('sempre', 'nunca'). Aqui o foco é o tamanho da consequência prevista." },
      ],
    },
    {
      id: "q4",
      pergunta: '"Deu errado uma vez, vai dar errado sempre." Qual distorção é essa?',
      opcoes: [
        { id: "a", texto: "Supergeneralização", correta: true, explicacao: "Exato — um evento isolado vira regra universal, ignorando as vezes em que deu certo." },
        { id: "b", texto: "Rotulação", correta: false, explicacao: "Rotulação cola um rótulo fixo na pessoa ('sou um fracassado'). Aqui o padrão generaliza um evento para todo o futuro." },
        { id: "c", texto: "Raciocínio emocional", correta: false, explicacao: "Raciocínio emocional é tratar um sentimento como prova de fato. Aqui o padrão é generalizar um evento único." },
      ],
    },
    {
      id: "q5",
      pergunta: '"A apresentação foi horrível — travei em UM slide." (Ignorando que o resto correu bem.) Qual distorção é essa?',
      opcoes: [
        { id: "a", texto: "Filtro mental", correta: true, explicacao: "Isso mesmo — a mente coa a experiência inteira e retém só o detalhe negativo." },
        { id: "b", texto: "Minimização", correta: false, explicacao: "Minimização diminui algo positivo próprio. Aqui o padrão é filtrar e ignorar o resto que foi bem: filtro mental." },
        { id: "c", texto: "Adivinhação do futuro", correta: false, explicacao: "Adivinhação do futuro é prever um desfecho ruim antes de acontecer. Aqui já aconteceu — o problema é o que foi retido na memória." },
      ],
    },
    {
      id: "q6",
      pergunta: '"Meus pais brigaram. Deve ter sido por minha causa." Qual distorção é essa?',
      opcoes: [
        { id: "a", texto: "Personalização", correta: true, explicacao: "Exato — assumir responsabilidade por algo que tem múltiplas causas fora do seu controle." },
        { id: "b", texto: "Tirania dos deveria", correta: false, explicacao: "Tirania dos 'deveria' é um padrão de regras rígidas sobre si mesmo. Aqui o padrão é assumir culpa alheia: personalização." },
        { id: "c", texto: "Tudo-ou-nada", correta: false, explicacao: "Tudo-ou-nada é enxergar em extremos (perfeito/fracasso). Aqui o padrão é assumir culpa indevida: personalização." },
      ],
    },
    {
      id: "q7",
      pergunta: '"Passei na prova, mas foi pura sorte, não porque estudei." Qual distorção é essa?',
      opcoes: [
        { id: "a", texto: "Desqualificação do positivo", correta: true, explicacao: "Isso mesmo — a conquista é descartada em vez de reconhecida como mérito próprio." },
        { id: "b", texto: "Filtro mental", correta: false, explicacao: "Filtro mental ignora o positivo em meio a vários fatos. Aqui um fato positivo específico é desqualificado: outra categoria." },
        { id: "c", texto: "Catastrofização", correta: false, explicacao: "Catastrofização amplia algo ruim. Aqui o padrão é descartar algo bom: desqualificação do positivo." },
      ],
    },
    {
      id: "q8",
      pergunta: '"Eu deveria dar conta de tudo sozinho, sem pedir ajuda nunca." Qual distorção é essa?',
      opcoes: [
        { id: "a", texto: "Tirania dos deveria", correta: true, explicacao: "Exato — regras rígidas de 'deveria/tenho que' que geram cobrança e culpa constantes." },
        { id: "b", texto: "Raciocínio emocional", correta: false, explicacao: "Raciocínio emocional trata sentimento como fato. Aqui o padrão é uma regra rígida autoimposta: tirania dos deveria." },
        { id: "c", texto: "Rotulação", correta: false, explicacao: "Rotulação cola um rótulo fixo sobre si mesmo. Aqui o padrão é uma regra de conduta rígida: tirania dos deveria." },
      ],
    },
  ],
};

// As 6 distorções clássicas usadas no flashcard deck do módulo demo.
const idsFlashcards = ["pretoebranco", "leitor", "dramatizador", "generalizador", "filtro", "culpa"];

export const distorcoesFlashcards: FlashcardItem[] = idsFlashcards.map((id) => {
  const d = distorcaoPorId(id);
  return {
    id: d.id,
    frente: d.distorcao,
    verso: `${d.exemplo}\n\n${d.antidoto}`,
  };
});
