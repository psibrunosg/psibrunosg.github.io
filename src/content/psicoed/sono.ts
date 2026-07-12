// Conteúdo do módulo "Sono" — mito ou fato sobre higiene do sono, baseado
// nos princípios da CBT-I (terapia cognitivo-comportamental para insônia).

import type { QuizConfig } from "@/components/psicoed/QuizEngine";
import type { FlashcardItem } from "@/components/psicoed/Flashcards";

export const sonoQuiz: QuizConfig = {
  perguntas: [
    {
      id: "s1",
      pergunta: "Álcool ajuda a dormir melhor.",
      opcoes: [
        { id: "mito", texto: "Mito", correta: true, explicacao: "O álcool até acelera pegar no sono, mas fragmenta e piora a qualidade do sono na segunda metade da noite — é comum acordar mais vezes e se sentir menos descansado." },
        { id: "fato", texto: "Fato", correta: false, explicacao: "É uma crença comum, mas o efeito real do álcool é piorar a qualidade do sono, mesmo ajudando a 'desligar' mais rápido no início." },
      ],
    },
    {
      id: "s2",
      pergunta: "Usar o celular na cama antes de dormir atrapalha o sono.",
      opcoes: [
        { id: "fato", texto: "Fato", correta: true, explicacao: "A luz da tela e o estímulo mental (redes sociais, notícias) atrasam a liberação de melatonina e mantêm o cérebro 'ligado' quando deveria desacelerar." },
        { id: "mito", texto: "Mito", correta: false, explicacao: "Na verdade é um dos hábitos mais estudados como prejudiciais ao sono — tanto pela luz quanto pelo estímulo mental." },
      ],
    },
    {
      id: "s3",
      pergunta: "Cochilos longos à tarde não afetam o sono da noite.",
      opcoes: [
        { id: "mito", texto: "Mito", correta: true, explicacao: "Cochilos longos ou tardios consomem parte da 'pressão de sono' acumulada, tornando mais difícil pegar no sono à noite." },
        { id: "fato", texto: "Fato", correta: false, explicacao: "Cochilos curtos e no início da tarde costumam ter menos impacto — mas cochilos longos ou tardios afetam, sim, o sono noturno." },
      ],
    },
    {
      id: "s4",
      pergunta: "Todo mundo precisa de exatas 8 horas de sono por noite.",
      opcoes: [
        { id: "mito", texto: "Mito", correta: true, explicacao: "A necessidade de sono varia por pessoa (em geral entre 7 e 9 horas para adultos). Regularidade e qualidade importam tanto quanto a quantidade exata." },
        { id: "fato", texto: "Fato", correta: false, explicacao: "8 horas é uma média de referência, não uma regra fixa igual para todos — a necessidade individual varia." },
      ],
    },
    {
      id: "s5",
      pergunta: "A cama deveria ser usada só para dormir (evitar trabalhar, comer ou assistir TV nela).",
      opcoes: [
        { id: "fato", texto: "Fato", correta: true, explicacao: "Um dos pilares da CBT-I: associar a cama só ao sono fortalece o 'sinal' de que aquele lugar é para dormir, não para ficar acordado fazendo outras coisas." },
        { id: "mito", texto: "Mito", correta: false, explicacao: "Essa associação é justamente uma das técnicas mais estudadas para melhorar o sono — não é um mito." },
      ],
    },
    {
      id: "s6",
      pergunta: "Ficar na cama tentando dormir, mesmo sem sono, ajuda a pegar no sono mais rápido.",
      opcoes: [
        { id: "mito", texto: "Mito", correta: true, explicacao: "Ficar rolando na cama sem sono ensina o cérebro a associar a cama com vigília e frustração. Costuma ajudar mais levantar, fazer algo calmo em pouca luz, e voltar quando bater sono." },
        { id: "fato", texto: "Fato", correta: false, explicacao: "É uma estratégia comum, mas tende a piorar o problema — reforça a cama como lugar de 'ficar tentando', não de dormir." },
      ],
    },
    {
      id: "s7",
      pergunta: "Dormir tarde num dia e 'compensar' dormindo muito no dia seguinte resolve o problema.",
      opcoes: [
        { id: "mito", texto: "Mito", correta: true, explicacao: "Esse é o chamado efeito rebote: compensar alivia um pouco o cansaço acumulado, mas tende a desregular ainda mais o ritmo circadiano nos dias seguintes." },
        { id: "fato", texto: "Fato", correta: false, explicacao: "Compensar ajuda pontualmente, mas não 'resolve' — costuma desregular ainda mais o relógio biológico." },
      ],
    },
    {
      id: "s8",
      pergunta: "Manter horário regular de dormir e acordar, mesmo nos finais de semana, melhora a qualidade do sono.",
      opcoes: [
        { id: "fato", texto: "Fato", correta: true, explicacao: "Regularidade é um dos pilares mais fortes da higiene do sono — ajuda o ritmo circadiano a se manter estável e previsível." },
        { id: "mito", texto: "Mito", correta: false, explicacao: "É justamente o contrário: a regularidade é um dos fatores com mais evidência para melhorar a qualidade do sono." },
      ],
    },
  ],
};

export interface PassoNoturno {
  titulo: string;
  descricao: string;
}

export const passosRotinaNoturna: PassoNoturno[] = [
  { titulo: "Baixe as luzes cerca de 1 hora antes de dormir", descricao: "Luz forte sinaliza 'dia' para o cérebro e atrasa a liberação de melatonina." },
  { titulo: "Pare telas 30 a 60 minutos antes de deitar", descricao: "Celular, TV e computador combinam luz e estímulo mental — os dois atrapalham o processo de desacelerar." },
  { titulo: "Crie um sinal fixo de 'hora de dormir'", descricao: "Escovar os dentes, trocar de roupa, ler algumas páginas — repetir a mesma sequência ensina o corpo a reconhecer que o sono está chegando." },
  { titulo: "Evite cafeína à tarde e à noite", descricao: "O efeito estimulante pode durar muitas horas no organismo, mesmo sem sensação consciente de estar 'ligado'." },
  { titulo: "Deixe o quarto escuro, silencioso e fresco", descricao: "Esses três fatores favorecem a manutenção do sono ao longo da noite, não só o início dele." },
];

export const sonoFlashcards: FlashcardItem[] = [
  {
    id: "pressao-sono",
    frente: "Pressão de sono",
    verso: "Quanto mais tempo acordado, maior a 'pressão' (relacionada à adenosina) que empurra o corpo para o sono. Cochilos longos aliviam essa pressão e tornam mais difícil pegar no sono à noite.",
  },
  {
    id: "ritmo-circadiano",
    frente: "Ritmo circadiano",
    verso: "O relógio biológico interno de aproximadamente 24 horas, regulado principalmente pela luz, que determina quando o corpo tende a sentir sono e quando tende a ficar alerta. Horários irregulares o desalinham.",
  },
  {
    id: "efeito-rebote",
    frente: "Efeito rebote",
    verso: "Quando, depois de dormir pouco, a pessoa tenta compensar dormindo muito mais no dia seguinte. Alivia parte do cansaço acumulado, mas tende a desregular ainda mais o ritmo circadiano nos dias seguintes.",
  },
  {
    id: "restricao-cama",
    frente: "Cama associada só ao sono",
    verso: "Usar a cama apenas para dormir (evitando trabalhar, comer ou rolar o celular nela) fortalece a associação mental entre 'cama' e 'sono' — um dos princípios centrais da CBT-I.",
  },
];
