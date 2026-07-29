// Território "Crenças Centrais" — Mundo Torajo.
// Conteúdo adaptado 1:1 do material original (G:\Meu Drive\Torajo\crencas.html),
// baseado na Terapia Cognitivo-Comportamental. Dados puros — sem lógica de UI.
// Ver docs/mundo-torajo-playbook.md.

import type { PersonagemId } from "@/content/psicoed/personagens";

export interface CrencaCentral {
  numero: string;
  id: string;
  titulo: string;
  subtitulo: string;
  personagem: PersonagemId;
  oQueE: string;
  descricao: string;
  frase: string;
  vidaBox: string;
}

export const crencas: CrencaCentral[] = [
  {
    numero: "01",
    id: "sou-incapaz",
    titulo: '"Eu sou incapaz"',
    subtitulo: "Família do Desamparo",
    personagem: "zulmi",
    oQueE:
      "A crença raiz de que você é incompetente, fraco, ou que nunca vai conseguir dar conta das responsabilidades da vida, não importa o quanto tente. É a sensação de fracasso inevitável.",
    descricao:
      "Sob pressão extrema de roteiros caóticos e brigas no estúdio, Zulmi às vezes trava e deixa de agir por achar que não tem as habilidades necessárias para resolver o problema.",
    frase:
      "Eu não consigo fazer isso... Sou muito fraca para lidar com toda essa pressão. Eu vou acabar estragando tudo, eu não dou conta!",
    vidaBox:
      "Lembre-se de todas as vezes que você achou que não ia conseguir e conseguiu. Você não precisa saber tudo antes de começar. Aprender no caminho já é sinal de extrema capacidade.",
  },
  {
    numero: "02",
    id: "nao-sou-amavel",
    titulo: '"Eu não sou amável"',
    subtitulo: "Família do Desamor",
    personagem: "azedo",
    oQueE:
      "A certeza profunda de que, se as pessoas conhecerem o seu verdadeiro \"eu\", elas não vão gostar de você. Você sente que é fundamentalmente indesejável ou tem um \"defeito\".",
    descricao:
      "As atitudes agressivas do Azedo nascem dessa raiz. Ele ataca e irrita todo mundo porque, lá no fundo, acredita que nunca seria amado. Ele repele as pessoas antes de se decepcionar.",
    frase: "Ninguém nunca vai gostar de mim de verdade ou me achar legal mesmo, então eu prefiro que me odeiem logo pelas minhas piadas!",
    vidaBox:
      "O amor não precisa ser conquistado sendo perfeito. Você tem qualidades reais. O fato de você ter defeitos humanos não anula o seu direito de ser amado e acolhido.",
  },
  {
    numero: "03",
    id: "nao-tenho-importancia",
    titulo: '"Eu não tenho importância"',
    subtitulo: "Família do Desvalor",
    personagem: "linn",
    oQueE:
      "O sentimento de que você é um fardo, de que você não importa para ninguém e que sua existência não faz diferença no mundo. É a dolorosa sensação de ser \"invisível\".",
    descricao:
      "Por ser muito quieto e observador, o Linn pode acabar sendo atropelado pelas personalidades escandalosas do Torajo e Morajo. Isso alimenta a mentira de que o que ele sente ou faz não tem valor.",
    frase: "Se eu simplesmente sumir do estúdio hoje, acho que ninguém nem vai notar. Eu não sou tão importante assim para a vida deles de qualquer forma.",
    vidaBox:
      "A sua voz importa, mas você precisa usá-la. Seu valor não é medido pelo barulho que você faz, mas pela essência que você carrega. Não deixe de ocupar o seu espaço legítimo.",
  },
  {
    numero: "04",
    id: "outros-nao-confiaveis",
    titulo: '"Os outros não são confiáveis"',
    subtitulo: "Crença sobre as Pessoas",
    personagem: "pessy",
    oQueE:
      "Você acha que a natureza humana é fundamentalmente ruim. Ninguém ajuda de graça e, mais cedo ou mais tarde, quem se aproxima vai te machucar, enganar ou abandonar.",
    descricao:
      "A mente investigativa de Pessy a faz questionar qualquer ato de bondade. Para ela, se alguém deu um sorriso, é porque está escondendo algum plano maquiavélico por trás.",
    frase: "A Zulmi me ofereceu um pedaço de bolo? Certeza absoluta que ela colocou uma poção de controle mental aí dentro. Não confio em ninguém!",
    vidaBox:
      "As pessoas falham, mas a maioria não acorda pensando em como te prejudicar. Confiança é um risco calculado; quem nunca se arrisca a confiar, nunca ganha conexões profundas e verdadeiras.",
  },
  {
    numero: "05",
    id: "mundo-perigoso",
    titulo: '"O mundo é perigoso"',
    subtitulo: "Crença sobre o Mundo/Futuro",
    personagem: "pessy",
    oQueE:
      "A vida é vista como um campo minado caótico onde desastres (doenças, crises, perdas) estão sempre prestes a acontecer e acabar com a sua paz e segurança.",
    descricao:
      "Pessy gasta a maior parte de sua energia se preparando para catástrofes irreais. O mundo, para ela, é imprevisível e hostil, e ela precisa monitorar tudo para não ser pega de surpresa.",
    frase: "Tem uma nuvem meio escura lá fora! Com certeza é o início de uma chuva de meteoros alienígenas! Vamos todos para o bunker de gravação agora!",
    vidaBox:
      "A vida é imprevisível sim, e isso inclui as surpresas boas. Aceite que não temos controle sobre quase nada (como o clima), a não ser sobre a forma como reagimos. Relaxe.",
  },
  {
    numero: "06",
    id: "preciso-ser-perfeito",
    titulo: '"Preciso ser perfeito"',
    subtitulo: "Desvalor Condicionado",
    personagem: "morajo",
    oQueE:
      "O seu valor como ser humano está totalmente amarrado à sua produção e perfeição. Um único erro ou falha e você sente que todo o seu valor foi deletado.",
    descricao:
      "Morajo amarra seu senso de importância à lógica e ao sucesso impecável. Se um plano tem uma vírgula fora do lugar, ele sente que tudo falhou. O valor dele está nos resultados numéricos.",
    frase: "Se este cálculo de engajamento estiver 0,1% errado, todo o meu trabalho e a minha inteligência superior não serviram para absolutamente nada.",
    vidaBox:
      "Você não é o que você produz. O seu valor não flutua como o número de likes de um vídeo dependendo do que você fez de perfeito hoje. Erros são provas de que você é humano.",
  },
  {
    numero: "07",
    id: "nao-pertenco-a-lugar-nenhum",
    titulo: '"Eu não pertenço a lugar nenhum"',
    subtitulo: "Crença de Alienação",
    personagem: "margo",
    oQueE:
      "A crença de ser um \"alienígena\" entre os humanos. Você sente que a sua mente e os seus interesses funcionam de um jeito que ninguém nunca vai conseguir compreender ou aceitar.",
    descricao:
      "Margo trata os outros como meros códigos de computador, porque no fundo ela se sente totalmente alienada da convivência emocional normal. Ela transformou o isolamento em um pedestal.",
    frase: "Vocês são meros dados em um sistema obsoleto. Eu vivo em outra frequência da Matrix, eu não me misturo com essa realidade inferior de vocês.",
    vidaBox:
      "Todo mundo se sente desajustado em algum momento. O pertencimento verdadeiro não acontece quando você encontra o lugar perfeito, acontece quando você se permite ser visto como realmente é.",
  },
  {
    numero: "08",
    id: "valor-depende-da-atencao",
    titulo: '"Meu valor depende da atenção"',
    subtitulo: "Crença de Dependência Externa",
    personagem: "torajo",
    oQueE:
      "A crença de que você só \"existe\" de verdade se estiver sob os holofotes. Se as pessoas não estão te aplaudindo, elogiando ou assistindo o tempo todo, você sente um vazio gigantesco.",
    descricao:
      "Por ser o rosto do canal, Torajo precisa constantemente da aprovação de Morajo e dos inscritos para validar quem ele é. Sem a euforia, o barulho e a atenção, o silêncio pode ser assustador para ele.",
    frase: "Se a gente não bater o recorde de views hoje e viralizar, significa que eu deixei de ser o incrível Torajo e ninguém mais se importa comigo!",
    vidaBox:
      "Você não é um palco de show. Quando as luzes se apagam e não há plateia para te aplaudir, o silêncio não é o seu fim; é a sua oportunidade de finalmente escutar a sua própria voz.",
  },
];
