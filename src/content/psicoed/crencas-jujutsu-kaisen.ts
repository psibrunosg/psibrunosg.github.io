// Território "Crenças Centrais" — Jujutsu Kaisen. Conteúdo adaptado do
// material original (G:\Meu Drive\Jujutsu Kaisen\crencas.html), que só trazia
// número + título + personagem + descrição (sem oQueE/frase/vidaBox
// separados). Completei esses 3 campos com definição clínica padrão + frase e
// box de aplicação no mesmo tom do resto do conteúdo, pra manter o padrão
// visual das outras 3 páginas. Ver docs/mundo-torajo-playbook.md seção 13.

import type { CenaTorajo } from "@/components/psicoed/TerritorioTorajo";

export const crencasJujutsuKaisen: CenaTorajo[] = [
  {
    numero: "01",
    id: "desamor",
    titulo: "Crença de Desamor",
    subtitulo: '"Eu não mereço ser amado(a)."',
    personagem: "yuta",
    oQueE:
      "O sentimento profundo de que há algo errado com você que afasta as pessoas — que você é fundamentalmente indigno de amor ou de estar perto de alguém.",
    descricao:
      "O sentimento profundo de que há algo errado com você que afasta as pessoas. Yuta acreditava que só levava morte e azar para os outros, convencendo a si mesmo de que era incapaz e indigno de ser amado ou estar com os outros.",
    frase: "Eu só trago morte e azar pra quem eu amo. É melhor eu me afastar antes que aconteça de novo.",
    vidaBox:
      "Seu passado não decide quem pode te amar hoje. Deixar alguém se aproximar é um risco, mas isolar-se pra sempre só garante a solidão que você mais teme.",
  },
  {
    numero: "02",
    id: "desvalor",
    titulo: "Crença de Desvalor",
    subtitulo: '"Eu não tenho valor, sou inferior."',
    personagem: "maki",
    oQueE:
      "A certeza de que você vale menos que os outros e precisa provar constantemente, com esforço redobrado, o seu direito de existir e ser respeitado.",
    descricao:
      "Nascer sem energia amaldiçoada fez o mundo gritar que Maki não tinha valor algum. Ela vive carregando o peso cruel de uma crença de Desvalor social, lutando sangrentamente o tempo todo apenas para provar seu direito de existir.",
    frase: "Eu nasci sem nada. Se eu parar de lutar por um segundo, provo que eles sempre estiveram certos sobre mim.",
    vidaBox:
      "Seu valor não depende de quanto poder você tem pra oferecer aos outros. Você não precisa sangrar pra merecer um lugar no mundo.",
  },
  {
    numero: "03",
    id: "desamparo",
    titulo: "Crença de Desamparo",
    subtitulo: '"Eu sou fraco e impotente."',
    personagem: "itadori",
    oQueE:
      "A sensação de ser fraco e incapaz de proteger quem você ama, de estar à mercê de forças (internas ou externas) maiores do que você.",
    descricao:
      "Após a possessão de Sukuna em Shibuya, Yuji quebra mentalmente, caindo na crença total do Desamparo: ele se enxerga como fraco, incapaz de proteger quem ama, totalmente vulnerável ao caos que habita dentro dele.",
    frase: "Eu não consigo controlar o que existe dentro de mim. Eu sou fraco demais pra proteger qualquer um.",
    vidaBox:
      "Sentir-se impotente numa crise não significa que você é impotente sempre. Pedir ajuda pra dividir o peso não é fraqueza, é estratégia.",
  },
  {
    numero: "04",
    id: "defeito-inadequacao",
    titulo: "Crença de Defeito (Inadequação)",
    subtitulo: '"Eu sou fundamentalmente falho."',
    personagem: "toji",
    oQueE:
      "A crença de que você é fundamentalmente defeituoso desde o nascimento — um erro que não tem conserto e que o afasta de qualquer pertencimento.",
    descricao:
      "A crença de que você é fundamentalmente defeituoso desde o nascimento. Toji acreditava que sua falta de Jujutsu o tornava \"falho\" e lidou com isso se isolando do mundo.",
    frase: "Eu nasci sem energia amaldiçoada. Isso me tornou um defeito de fábrica nesse mundo, então eu escolhi ficar sozinho.",
    vidaBox:
      "O que te falta numa área não te define por inteiro. Isolar-se por causa de um \"defeito\" imaginado só confirma uma mentira que você mesmo criou.",
  },
  {
    numero: "05",
    id: "falta-de-controle-submissao",
    titulo: "Crença de Falta de Controle (Submissão)",
    subtitulo: '"Não adianta lutar contra o destino."',
    personagem: "megumi",
    oQueE:
      "A crença de que você não tem controle real sobre o próprio destino ou sobre as decisões importantes da sua vida — então nem vale a pena lutar por mudança.",
    descricao:
      "Aceitar o sofrimento sem lutar porque \"não há como mudar o destino\". Megumi sempre se diminui acreditando que não possui controle real sobre vencer no limite.",
    frase: "Não há como mudar o destino. Eu não tenho controle real sobre isso, então é melhor eu me sacrificar logo.",
    vidaBox:
      "Aceitar o que não pode ser mudado é sabedoria; desistir do que pode ser mudado é resignação disfarçada. Você tem mais controle do que acredita.",
  },
  {
    numero: "06",
    id: "autossuficiencia-intransponivel",
    titulo: "Crença de Autossuficiência Intransponível",
    subtitulo: '"Ninguém pode me alcançar; estou destinado à solidão."',
    personagem: "gojo",
    oQueE:
      "A crença de que ser forte ou capaz demais condena inevitavelmente à solidão — que ninguém jamais vai conseguir alcançar, entender ou dividir esse peso com você.",
    descricao:
      "\"Eu sou o mais forte, e por ser tão poderoso, ninguém pode me alcançar e estou destinado à solidão absoluta.\"",
    frase: "Eu sou o mais forte, e por ser tão poderoso, ninguém pode me alcançar. Estou destinado à solidão absoluta.",
    vidaBox:
      "Força e conexão não se cancelam. Deixar alguém se aproximar não é fraqueza — é a única forma de a solidão parar de ser uma profecia que se cumpre sozinha.",
  },
];
