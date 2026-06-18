export interface PostSecao {
  tipo: "h2" | "h3" | "p" | "ul" | "nota";
  texto?: string;
  itens?: string[];
}

export interface Post {
  slug: string;
  titulo: string;
  subtitulo: string;
  categoria: string;
  tempoLeitura: string;
  resumo: string;
  tags: string[];
  secoes: PostSecao[];
}

export const posts: Post[] = [
  {
    slug: "o-que-e-tcc",
    titulo: "O que é a Terapia Cognitivo-Comportamental?",
    subtitulo: "Uma introdução à abordagem mais estudada da psicologia clínica",
    categoria: "Abordagens",
    tempoLeitura: "5 min",
    resumo:
      "A TCC é uma das abordagens terapêuticas com maior respaldo científico. Entenda como ela funciona, para quem é indicada e o que esperar do processo.",
    tags: ["TCC", "psicoterapia", "ansiedade", "depressão", "Pelotas"],
    secoes: [
      {
        tipo: "p",
        texto:
          "A Terapia Cognitivo-Comportamental, conhecida como TCC, é uma abordagem psicológica com sólida base em evidências científicas. Ela parte de uma ideia central: a forma como interpretamos os acontecimentos influencia diretamente o que sentimos e como agimos.",
      },
      {
        tipo: "h2",
        texto: "Como a TCC funciona na prática?",
      },
      {
        tipo: "p",
        texto:
          "O trabalho terapêutico na TCC envolve identificar padrões de pensamento que se repetem e que, muitas vezes, alimentam emoções difíceis como ansiedade, tristeza ou raiva. Não se trata de negar esses pensamentos, mas de examiná-los com mais cuidado e desenvolver formas mais funcionais de responder aos desafios do cotidiano.",
      },
      {
        tipo: "p",
        texto:
          "As sessões costumam ser estruturadas e orientadas por objetivos. Isso não significa que não há espaço para falar livremente, mas que existe uma direção no processo, o que ajuda a perceber mudanças de forma mais concreta ao longo do tempo.",
      },
      {
        tipo: "h2",
        texto: "Para quem a TCC é indicada?",
      },
      {
        tipo: "p",
        texto:
          "A TCC é amplamente estudada no tratamento de ansiedade, depressão, fobias, transtorno obsessivo-compulsivo, estresse pós-traumático e dificuldades do cotidiano. Também é utilizada no suporte a pessoas que passam por transições de vida, dificuldades relacionais ou queda no desempenho profissional.",
      },
      {
        tipo: "ul",
        itens: [
          "Ansiedade e preocupação excessiva",
          "Episódios depressivos",
          "Fobias específicas",
          "Dificuldades nos relacionamentos",
          "Estresse e esgotamento profissional",
          "Baixa autoestima",
        ],
      },
      {
        tipo: "h2",
        texto: "Quanto tempo dura o processo?",
      },
      {
        tipo: "p",
        texto:
          "O tempo varia de acordo com os objetivos de cada pessoa e com a complexidade do que está sendo trabalhado. Algumas pessoas percebem mudanças relevantes em alguns meses; outras optam por um processo mais longo. Não existe um tempo certo, existe o tempo necessário para cada um.",
      },
      {
        tipo: "nota",
        texto:
          "Este texto tem caráter informativo e não substitui a avaliação de um profissional de saúde mental. Se você está passando por dificuldades, considere buscar acompanhamento especializado.",
      },
    ],
  },
  {
    slug: "terapia-do-esquema",
    titulo: "Terapia do Esquema: quando os padrões vêm de longe",
    subtitulo: "Como experiências antigas moldam a forma como você se relaciona hoje",
    categoria: "Abordagens",
    tempoLeitura: "6 min",
    resumo:
      "A Terapia do Esquema amplia a TCC para trabalhar padrões emocionais profundos formados na infância. Entenda como ela pode ajudar em dificuldades relacionais e de autoestima.",
    tags: ["Terapia do Esquema", "TE", "padrões", "relacionamentos", "autoestima"],
    secoes: [
      {
        tipo: "p",
        texto:
          "Você já percebeu que certos padrões se repetem na sua vida, mesmo quando você tenta mudar? Relações que terminam do mesmo jeito, reações emocionais desproporcionais, sensações de inadequação que aparecem sem avisar. A Terapia do Esquema trabalha exatamente esse tipo de experiência.",
      },
      {
        tipo: "h2",
        texto: "O que são esquemas?",
      },
      {
        tipo: "p",
        texto:
          "Esquemas são padrões profundos de pensamento, emoção e comportamento formados, em geral, na infância e adolescência, a partir de experiências com as pessoas mais próximas. Quando necessidades emocionais básicas como segurança, afeto e autonomia não são atendidas de forma consistente, esses esquemas se desenvolvem como uma forma de adaptação.",
      },
      {
        tipo: "p",
        texto:
          "Na vida adulta, eles continuam ativos, influenciando a forma como interpretamos situações, como reagimos às pessoas e como nos vemos. O problema é que essas estratégias que um dia fizeram sentido podem se tornar fontes de sofrimento.",
      },
      {
        tipo: "h2",
        texto: "Como a Terapia do Esquema trabalha?",
      },
      {
        tipo: "p",
        texto:
          "A TE integra elementos da TCC com técnicas experienciais e relacionais. O processo envolve identificar os esquemas presentes, compreender sua origem e, gradualmente, desenvolver formas mais saudáveis de se relacionar consigo e com os outros.",
      },
      {
        tipo: "ul",
        itens: [
          "Medo de abandono ou rejeição",
          "Sensação persistente de inadequação",
          "Dificuldade em estabelecer limites",
          "Padrões repetitivos nos relacionamentos",
          "Autocrítica intensa e exigência excessiva",
        ],
      },
      {
        tipo: "h2",
        texto: "TCC e Terapia do Esquema: qual a diferença?",
      },
      {
        tipo: "p",
        texto:
          "A TCC trabalha, principalmente, pensamentos e comportamentos do presente. A Terapia do Esquema aprofunda esse trabalho ao incluir a história emocional da pessoa e os padrões que vêm de experiências mais antigas. As duas abordagens são complementares e frequentemente utilizadas de forma integrada.",
      },
      {
        tipo: "nota",
        texto:
          "Este texto tem caráter informativo e não substitui a avaliação de um profissional de saúde mental.",
      },
    ],
  },
  {
    slug: "ansiedade-quando-os-pensamentos-nao-dao-sossego",
    titulo: "Ansiedade: quando os pensamentos não dão sossego",
    subtitulo: "Entenda o que acontece no corpo e na mente durante um episódio de ansiedade",
    categoria: "Condições",
    tempoLeitura: "5 min",
    resumo:
      "Ansiedade é uma resposta natural do organismo, mas quando se torna excessiva, pode interferir no trabalho, nos relacionamentos e na qualidade de vida. Entenda mais.",
    tags: ["ansiedade", "preocupação", "TCC", "psicólogo Pelotas", "saúde mental"],
    secoes: [
      {
        tipo: "p",
        texto:
          "A ansiedade é uma experiência humana. Todos nós a sentimos em algum momento, especialmente diante de situações novas ou ameaçadoras. O problema aparece quando ela deixa de ser proporcional ao contexto e passa a ocupar um espaço desproporcional na vida cotidiana.",
      },
      {
        tipo: "h2",
        texto: "Como a ansiedade se manifesta?",
      },
      {
        tipo: "p",
        texto:
          "A ansiedade não é só um estado mental. Ela se manifesta no corpo, nos pensamentos e no comportamento ao mesmo tempo.",
      },
      {
        tipo: "ul",
        itens: [
          "Tensão muscular e dificuldade de relaxar",
          "Aceleração dos batimentos cardíacos",
          "Pensamentos acelerados ou em loop",
          "Dificuldade de concentração",
          "Evitação de situações que provocam desconforto",
          "Sensação de que algo ruim vai acontecer",
        ],
      },
      {
        tipo: "h2",
        texto: "Quando buscar ajuda?",
      },
      {
        tipo: "p",
        texto:
          "Se a ansiedade está interferindo no trabalho, nos relacionamentos, no sono ou na qualidade de vida de forma persistente, pode ser o momento de buscar apoio. Isso não significa que algo está errado com você, significa que você está carregando mais do que daria conta sozinho.",
      },
      {
        tipo: "h2",
        texto: "Como a terapia pode ajudar?",
      },
      {
        tipo: "p",
        texto:
          "A TCC é uma das abordagens mais estudadas no manejo da ansiedade. O trabalho terapêutico envolve identificar os pensamentos que alimentam a ansiedade, compreender os padrões de evitação e desenvolver estratégias para responder de forma diferente ao desconforto.",
      },
      {
        tipo: "p",
        texto:
          "Não se trata de eliminar a ansiedade, mas de aprender a se relacionar com ela de outra forma, para que ela deixe de ditar o que você pode ou não pode fazer.",
      },
      {
        tipo: "nota",
        texto:
          "Este texto tem caráter informativo e não substitui a avaliação de um profissional de saúde mental. Em casos de ansiedade intensa, a avaliação conjunta com um psiquiatra pode ser indicada.",
      },
    ],
  },
  {
    slug: "burnout-quando-o-esgotamento-vai-alem-do-cansaco",
    titulo: "Burnout: quando o esgotamento vai além do cansaço",
    subtitulo: "Entenda os sinais, as causas e como o acompanhamento psicológico pode ajudar",
    categoria: "Condições",
    tempoLeitura: "6 min",
    resumo:
      "O burnout é mais do que cansaço acumulado. É um estado de esgotamento profundo que afeta o corpo, a mente e a forma como a pessoa se vê no trabalho e na vida.",
    tags: ["burnout", "esgotamento", "trabalho", "saúde mental", "psicólogo Pelotas"],
    secoes: [
      {
        tipo: "p",
        texto:
          "O burnout entrou no vocabulário cotidiano, mas ainda é subestimado. Muita gente reconhece os sintomas em si mesma e, ainda assim, continua. Porque parar parece impossível, ou porque acredita que é fraqueza, ou porque não sabe bem como nomear o que está sentindo.",
      },
      {
        tipo: "h2",
        texto: "O que é o burnout, de fato?",
      },
      {
        tipo: "p",
        texto:
          "O burnout é um estado de esgotamento físico, emocional e mental relacionado, principalmente, ao contexto de trabalho. Ele não surge de um dia para o outro, mas se desenvolve ao longo do tempo, como resultado de uma exposição prolongada a demandas excessivas sem recuperação adequada.",
      },
      {
        tipo: "p",
        texto:
          "Desde 2022, o burnout é reconhecido pela Organização Mundial da Saúde como um fenômeno ocupacional. Não é frescura, não é falta de comprometimento. É uma condição real com impactos concretos na saúde.",
      },
      {
        tipo: "h2",
        texto: "Sinais que merecem atenção",
      },
      {
        tipo: "ul",
        itens: [
          "Cansaço que não passa mesmo após descanso",
          "Dificuldade de sentir prazer nas coisas que antes agradavam",
          "Sensação de distância ou indiferença em relação ao trabalho",
          "Queda no rendimento e na concentração",
          "Irritabilidade e dificuldade de regular as emoções",
          "Sensação de incompetência ou de não ser suficiente",
        ],
      },
      {
        tipo: "h2",
        texto: "O papel do acompanhamento psicológico",
      },
      {
        tipo: "p",
        texto:
          "A terapia não vai mudar o ambiente de trabalho, mas pode ajudar a compreender os padrões que levaram até o esgotamento, a reconectar com o que realmente importa e a desenvolver estratégias para proteger a saúde no futuro.",
      },
      {
        tipo: "p",
        texto:
          "Em muitos casos, o burnout vem acompanhado de crenças profundas sobre produtividade, valor pessoal e o que significa ser suficiente. Trabalhar essas questões é parte essencial do processo.",
      },
      {
        tipo: "nota",
        texto:
          "Este texto tem caráter informativo. O burnout pode se confundir com depressão e outras condições. Busque avaliação profissional para um diagnóstico adequado.",
      },
    ],
  },
  {
    slug: "terapia-para-adolescentes",
    titulo: "Terapia na adolescência: o que esperar?",
    subtitulo: "Um guia para adolescentes e pais que estão considerando iniciar um acompanhamento psicológico",
    categoria: "Público",
    tempoLeitura: "5 min",
    resumo:
      "A adolescência é uma fase intensa. A terapia pode ser um espaço importante de escuta e suporte durante esse período. Entenda como funciona e o que esperar do processo.",
    tags: ["terapia adolescente", "psicólogo adolescente", "saúde mental jovem", "Pelotas"],
    secoes: [
      {
        tipo: "p",
        texto:
          "A adolescência é, por natureza, uma fase de transformação intensa. O corpo muda, a identidade se constrói, as relações ganham uma complexidade nova e as pressões, de escola, família e grupo social, costumam aumentar ao mesmo tempo. Para muitos jovens, esse período é genuinamente difícil.",
      },
      {
        tipo: "h2",
        texto: "Para o adolescente: o que é a terapia, na prática?",
      },
      {
        tipo: "p",
        texto:
          "A terapia é um espaço de conversa onde você não precisa se explicar para ninguém, não precisa proteger ninguém dos seus sentimentos e não precisa ter as respostas prontas. É um lugar para pensar, com alguém ao lado.",
      },
      {
        tipo: "p",
        texto:
          "O psicólogo não vai te dizer o que fazer. Não vai contar para seus pais o que você fala (o sigilo é um dever ético e legal). E não vai ficar te passando lição de casa se isso não fizer sentido para você.",
      },
      {
        tipo: "h2",
        texto: "Para os pais: quando considerar a terapia?",
      },
      {
        tipo: "ul",
        itens: [
          "Mudanças de humor intensas e persistentes",
          "Isolamento social ou queda no desempenho escolar",
          "Dificuldade de lidar com frustrações",
          "Ansiedade frequente diante de situações do dia a dia",
          "Conflitos relacionais intensos com família ou amigos",
          "Quando o próprio adolescente pede ajuda",
        ],
      },
      {
        tipo: "h2",
        texto: "Como funciona o processo?",
      },
      {
        tipo: "p",
        texto:
          "As sessões são individuais e o adolescente é o protagonista do processo. Em alguns casos, pode haver um contato pontual com os pais, mas sempre com o conhecimento e o consentimento do jovem. A relação terapêutica é construída com respeito à autonomia de cada um.",
      },
      {
        tipo: "nota",
        texto:
          "Este texto tem caráter informativo. Para menores de 18 anos, o início do processo terapêutico requer autorização dos responsáveis legais, conforme o Código de Ética Profissional do Psicólogo.",
      },
    ],
  },
];