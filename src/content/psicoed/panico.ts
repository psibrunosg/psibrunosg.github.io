// Conteúdo do módulo "Ciclo do Pânico" — psicoeducação sobre a espiral
// sensação corporal → interpretação catastrófica → medo → mais sensações.
// Linguagem: pânico é um alarme falso do corpo — desconfortável, mas não
// perigoso. Sem promessa de cura (restrição do CFP).

import type { QuizConfig } from "@/components/psicoed/QuizEngine";

export interface EloCiclo {
  id: string;
  titulo: string;
  curto: string;
  explicacao: string;
}

export const cicloPanico: EloCiclo[] = [
  {
    id: "gatilho",
    titulo: "Gatilho",
    curto: "Subir escada, calor, discussão, café forte...",
    explicacao:
      "Qualquer estímulo — de fora (um lugar cheio) ou de dentro (um pensamento, uma sensação) — pode ativar o sistema de alerta do corpo. Às vezes nem dá para identificar qual foi.",
  },
  {
    id: "sensacao",
    titulo: "Sensação corporal",
    curto: "Coração acelera, falta de ar, tontura, formigamento...",
    explicacao:
      "O corpo reage como se houvesse um perigo real — é a resposta de luta-ou-fuga, a mesma que ajudaria a fugir de algo perigoso. O problema é que ela dispara mesmo sem perigo nenhum.",
  },
  {
    id: "interpretacao",
    titulo: "Interpretação catastrófica",
    curto: '"Vou morrer." "Vou desmaiar." "Estou tendo um troço."',
    explicacao:
      "Aqui está a virada do ciclo: a mente lê a sensação física como sinal de catástrofe iminente. Essa interpretação — não a sensação em si — é o que faz o alarme escalar.",
  },
  {
    id: "medo",
    titulo: "Medo / pânico",
    curto: "A interpretação catastrófica dispara mais medo.",
    explicacao:
      "Quando a mente acredita que algo terrível está para acontecer, o medo aumenta de verdade — e o medo também é sentido no corpo, como mais uma sensação física.",
  },
  {
    id: "mais-sintomas",
    titulo: "Mais sintomas",
    curto: "Mais adrenalina, sensações mais intensas.",
    explicacao:
      "O medo libera ainda mais adrenalina, que intensifica as sensações corporais — que voltam a ser lidas como perigo. É assim que o ciclo se realimenta, formando uma espiral.",
  },
];

export function mensagemReinterpretacao(v: number): string {
  if (v < 34) {
    return "Quando a sensação é lida como perigo real, o corpo mantém o alarme ligado — e o ciclo continua se realimentando.";
  }
  if (v < 67) {
    return "Começar a desconfiar do alarme (\"será que é perigo mesmo, ou só desconforto?\") já reduz um pouco a força do ciclo.";
  }
  return "Quando a sensação é reconhecida como alarme falso — desconfortável, mas não perigosa — o ciclo perde combustível. O corpo ainda pode reagir, mas o medo não se realimenta do mesmo jeito.";
}

export const panicoQuiz: QuizConfig = {
  perguntas: [
    {
      id: "p1",
      pergunta: "Durante uma crise de pânico, o coração dispara. Isso significa que:",
      opcoes: [
        { id: "a", texto: "O coração está correndo perigo real.", correta: false, explicacao: "Um coração saudável dispara com segurança em situações de estresse — é desconfortável, mas não é sinal de perigo cardíaco." },
        { id: "b", texto: "O corpo está numa resposta de alerta (luta-ou-fuga): desconfortável, mas não perigosa.", correta: true, explicacao: "Isso mesmo. É a mesma reação que ajudaria a fugir de um perigo real — só que disparada sem perigo nenhum por perto." },
        { id: "c", texto: "Um desmaio é praticamente certo.", correta: false, explicacao: "Desmaio costuma acontecer quando a pressão cai — no pânico, geralmente ela sobe. A sensação de 'vou desmaiar' é comum, mas raramente se confirma." },
      ],
    },
    {
      id: "p2",
      pergunta: "A respiração acelera e vem uma tontura com formigamento nas mãos. O que costuma explicar isso?",
      opcoes: [
        { id: "a", texto: "Falta real de oxigênio no corpo.", correta: false, explicacao: "Na crise de pânico geralmente há oxigênio de sobra — o problema é outro." },
        { id: "b", texto: "Hiperventilação: respirar rápido demais reduz o CO2 do sangue e causa tontura e formigamento.", correta: true, explicacao: "Exato. É um efeito químico temporário e reversível — desconfortável, mas não perigoso." },
        { id: "c", texto: "Sinal certo de um problema neurológico grave.", correta: false, explicacao: "É uma leitura catastrófica comum, mas a explicação mais frequente é a hiperventilação, não uma doença grave." },
      ],
    },
    {
      id: "p3",
      pergunta: 'Na crise, tudo parece "irreal" ou distante (despersonalização). Isso é sinal de que:',
      opcoes: [
        { id: "a", texto: "A pessoa está enlouquecendo.", correta: false, explicacao: "É uma leitura catastrófica frequente, mas não corresponde ao que realmente é esse sintoma." },
        { id: "b", texto: "É um sintoma comum de ansiedade intensa — assustador, mas conhecido e temporário.", correta: true, explicacao: "Isso mesmo. É uma das sensações mais assustadoras do pânico, mas também uma das mais estudadas e comuns." },
        { id: "c", texto: "O cérebro está sendo danificado.", correta: false, explicacao: "Não há dano ao cérebro nesse sintoma — é uma alteração temporária de percepção ligada à ansiedade intensa." },
      ],
    },
    {
      id: "p4",
      pergunta: "Sobre a duração de uma crise de pânico, o que costuma acontecer?",
      opcoes: [
        { id: "a", texto: "Ela tende a ter um pico e diminuir sozinha em minutos, mesmo sem fazer nada.", correta: true, explicacao: "Exato — fisiologicamente, o corpo não sustenta o pico de adrenalina por muito tempo. A crise tende a passar." },
        { id: "b", texto: "Sem uma ação imediata, ela só piora até um desfecho grave.", correta: false, explicacao: "Essa é a leitura catastrófica típica do próprio ciclo do pânico — mas não é o que costuma acontecer na prática." },
        { id: "c", texto: "Ela dura o tempo que a pessoa quiser controlar.", correta: false, explicacao: "A crise tem uma curva própria de subida e descida — não é uma questão de 'força de vontade'." },
      ],
    },
    {
      id: "p5",
      pergunta: "Evitar sempre os lugares/situações que 'dão gatilho' de pânico, a longo prazo:",
      opcoes: [
        { id: "a", texto: "Resolve o problema de vez.", correta: false, explicacao: "Evitar dá alívio na hora, mas costuma ter um efeito colateral importante — veja a próxima opção." },
        { id: "b", texto: "Costuma manter o ciclo do medo do medo, mesmo aliviando no curto prazo.", correta: true, explicacao: "Isso mesmo. A evitação alivia agora, mas reforça a ideia de que o lugar 'era' perigoso — e mantém o alarme sensível para a próxima vez." },
        { id: "c", texto: "Não tem nenhum efeito, positivo ou negativo.", correta: false, explicacao: "Tem efeito, sim — só que um efeito que tende a manter o ciclo ativo a médio prazo." },
      ],
    },
  ],
};
