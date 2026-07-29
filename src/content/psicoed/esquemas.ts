// Território "Esquemas Iniciais Desadaptativos" — Mundo Torajo.
// Conteúdo adaptado 1:1 do material original (G:\Meu Drive\Torajo\esquemas.html),
// baseado na Terapia do Esquema de Jeffrey Young. Dados puros — sem lógica de UI.
// Ver docs/superpowers/specs/2026-07-28-esquemas-torajo-design.md.

import { personagens, type PersonagemId, type Personagem } from "@/content/psicoed/personagens";

export { personagens };
export type { PersonagemId, Personagem };

export interface Esquema {
  numero: string;
  id: string;
  titulo: string;
  subtitulo: string;
  personagem: PersonagemId;
  oQueE: string;
  origem: string;
  descricao: string;
  frase: string;
  vidaBox: string;
  microPratica: string;
}

export const esquemas: Esquema[] = [
  {
    numero: "01",
    id: "abandono-instabilidade",
    titulo: "Abandono / Instabilidade",
    subtitulo: "Abandonment / Instability",
    personagem: "torajo",
    oQueE:
      "A sensação constante de que as pessoas que você ama vão te deixar, seja porque vão encontrar alguém melhor, porque são imprevisíveis ou porque o mundo é frágil.",
    origem:
      "Costuma nascer quando, na infância, alguém importante foi embora, morreu ou esteve fisicamente presente mas emocionalmente ausente com frequência.",
    descricao:
      "Como líder e criador do canal, Torajo tem uma necessidade profunda de manter a turma unida. O medo de que o canal acabe, de que os inscritos sumam ou de que seus amigos o abandonem o faz tentar agarrar todos ao seu redor com unhas e dentes.",
    frase:
      "A Zulmi e o Morajo não podem parar de gravar! Se eles forem embora, meu mundo desmorona e eu ficarei sozinho para sempre!",
    vidaBox:
      "Lembre-se que as pessoas têm vidas próprias e nem toda ausência é um abandono. Confie que os laços reais resistem à distância e não dependem do controle.",
    microPratica:
      "Da próxima vez que alguém demorar pra responder, note o pensamento automático (\"vai me abandonar\") e pergunte: existe evidência real disso, ou é o medo antigo falando?",
  },
  {
    numero: "02",
    id: "desconfianca-abuso",
    titulo: "Desconfiança / Abuso",
    subtitulo: "Mistrust / Abuse",
    personagem: "pessy",
    oQueE:
      "A expectativa de que as outras pessoas vão te machucar, enganar, mentir, tirar vantagem ou te humilhar. Você está sempre esperando o pior das intenções alheias.",
    origem:
      "Costuma se formar quando a criança foi exposta a mentiras, manipulação, humilhação ou traição por parte de quem deveria protegê-la.",
    descricao:
      "A Pessy, com suas teorias da conspiração, raramente confia no que está na superfície. Para ela, sempre há um plano maligno por trás de um simples \"bom dia\". Ela vive na defensiva.",
    frase:
      "Eles me deram um presente? Obviamente tem um microfone escondido aí dentro para roubar minhas ideias! Eles querem me sabotar.",
    vidaBox:
      "Tente dar às pessoas o \"benefício da dúvida\". Nem todos estão contra você ou querendo te enganar. Procure evidências reais de perigo antes de se fechar totalmente.",
    microPratica:
      "Antes de presumir má intenção em alguém, pergunte-se: existe prova concreta, ou é o alarme antigo disparando por hábito?",
  },
  {
    numero: "03",
    id: "privacao-emocional",
    titulo: "Privação Emocional",
    subtitulo: "Emotional Deprivation",
    personagem: "linn",
    oQueE:
      "A crença de que o seu desejo por conexão emocional, carinho e empatia nunca será atendido pelos outros. A sensação de que ninguém nunca vai te entender de verdade.",
    origem:
      "Geralmente vem de um cuidado presente no básico (comida, casa, escola) mas ausente no emocional — pouco colo, pouca escuta, pouca validação de sentimentos.",
    descricao:
      "O Linn é quieto, observador e, muitas vezes, fica na dele enquanto o caos reina. É fácil ele sentir que as pessoas estão ocupadas demais gritando e brigando para realmente ouvir o que ele sente ou precisa.",
    frase:
      "Não adianta eu falar como me sinto sobre esse roteiro. Ninguém vai parar para me ouvir no meio dessa bagunça mesmo. Eles não ligam.",
    vidaBox:
      "As pessoas não leem mentes. Para ter suas necessidades atendidas, você precisa expressá-las de forma clara e assertiva, em vez de se isolar esperando que os outros adivinhem.",
    microPratica:
      "Escolha uma pessoa de confiança e pratique dizer em voz alta o que você sente, mesmo que pareça estranho no início — é um músculo que se desenvolve com uso.",
  },
  {
    numero: "04",
    id: "defectividade-vergonha",
    titulo: "Defectividade / Vergonha",
    subtitulo: "Defectiveness / Shame",
    personagem: "azedo",
    oQueE:
      "O sentimento de ser falho, ruim, inferior ou inválido por dentro. O medo de que, se as pessoas virem quem você realmente é, elas vão te rejeitar.",
    origem:
      "Costuma vir de críticas duras, comparações constantes ou de ter sido feito de bode expiatório dentro da família ou do grupo.",
    descricao:
      "O Azedo se mascara com atitudes irritantes, pegadinhas pesadas e deboche. Muitas vezes, quem age de forma tão reativa o faz para esconder uma crença profunda de não ser \"bom o suficiente\". Ele repele os outros antes de ser rejeitado.",
    frase:
      "Se eu for legal e sincero, eles vão ver que eu não sou tão incrível assim. É melhor eu zoar todo mundo primeiro e bancar o difícil!",
    vidaBox:
      "Você tem valor. As suas falhas fazem de você humano, não um defeito de fábrica. Pratique a autocompaixão em vez da autocrítica pesada, e permita-se ser vulnerável.",
    microPratica:
      "Quando a autocrítica aparecer, tente falar consigo mesmo como falaria com um amigo na mesma situação.",
  },
  {
    numero: "05",
    id: "isolamento-social-alienacao",
    titulo: "Isolamento Social / Alienação",
    subtitulo: "Social Isolation / Alienation",
    personagem: "margo",
    oQueE:
      "A sensação de estar isolado do resto do mundo, sentindo que você é fundamentalmente diferente das outras pessoas e que não pertence a nenhum grupo.",
    origem:
      "Pode se desenvolver quando a pessoa se sentiu, de fato, diferente do grupo — por aparência, cultura, interesses ou condição — sem espaço de pertencimento.",
    descricao:
      "A Margo enxerga o mundo do YouTube de fora, como linhas de código. Ela literalmente se alienou da \"vida real\" da turma para viver nos bastidores digitais, tratando as pessoas como NPCs porque se sente completamente à parte deles.",
    frase:
      "Eles são apenas dados corrompidos. Eu não faço parte da realidade deles, eu estou acima (e fora) desse sistema patético e falho.",
    vidaBox:
      "Focar excessivamente no que te faz diferente dos outros gera isolamento. Procure as semelhanças: o que você tem em comum com as pessoas ao seu redor? A conexão começa aí.",
    microPratica:
      "Procure um grupo, por menor que seja, organizado em torno de algo que você genuinamente gosta — pertencimento se constrói em volta de interesses reais.",
  },
  {
    numero: "06",
    id: "dependencia-incompetencia",
    titulo: "Dependência / Incompetência",
    subtitulo: "Dependence / Incompetence",
    personagem: "zulmi",
    oQueE:
      "A crença de que você não consegue lidar com as responsabilidades do dia a dia sozinho. Precisa constantemente de ajuda externa para sobreviver e tomar decisões.",
    origem:
      "Costuma se formar quando decisões e tarefas foram sempre feitas por outra pessoa, sem espaço pra errar e aprender sozinho(a).",
    descricao:
      "Apesar de carinhosa, Zulmi muitas vezes entra em pânico quando tem que decidir as coisas sob pressão e sem apoio. O medo do conflito faz com que ela dependa que o grupo resolva as coisas para que ela se sinta segura.",
    frase:
      "Eu não sei o que fazer sobre isso! Alguém me diz como resolver, por favor! Sozinha eu não dou conta de tomar uma decisão!",
    vidaBox:
      "Celebre as pequenas vitórias que você consegue por conta própria. A competência é um músculo que se constrói tentando, errando e assumindo as rédeas das suas escolhas.",
    microPratica:
      "Escolha uma decisão pequena essa semana (o que cozinhar, como resolver um imprevisto) e tome sozinho(a), mesmo com desconforto.",
  },
  {
    numero: "07",
    id: "vulnerabilidade-ao-perigo",
    titulo: "Vulnerabilidade ao Perigo",
    subtitulo: "Vulnerability to Harm or Illness",
    personagem: "pessy",
    oQueE:
      "Um medo exagerado de que uma catástrofe iminente (médica, financeira, criminal, fim do mundo) vai acontecer a qualquer momento e que você não conseguirá se proteger.",
    origem:
      "Muitas vezes se origina em um ambiente onde perigo, doença ou catástrofe eram temas constantes — um cuidador ansioso, notícias alarmantes, ou um evento real e assustador.",
    descricao:
      "A mente investigativa e conspiratória da Pessy a faz ver perigos avassaladores onde não existem. Um barulho na janela não é o vento, é o fim do mundo se aproximando. Ela vive em estado crônico de alerta.",
    frase:
      "O Wi-Fi caiu por 5 minutos! É o início do apocalipse cibernético planejado pelos alienígenas, estamos totalmente desprotegidos!",
    vidaBox:
      "Foque em lidar com os problemas apenas se eles acontecerem, no presente. A ansiedade tenta prever o futuro imaginando o pior; mantenha a âncora no momento \"agora\".",
    microPratica:
      "Quando o medo catastrófico aparecer, pergunte: qual é o cenário mais provável, não o mais assustador?",
  },
  {
    numero: "08",
    id: "arrogo-grandiosidade",
    titulo: "Arrogo / Grandiosidade",
    subtitulo: "Entitlement / Grandiosity",
    personagem: "azedo",
    oQueE:
      "A crença de que você é superior aos outros e, portanto, merece privilégios especiais. Regras comuns não se aplicam a você. O foco é sempre em ter poder e controle.",
    origem:
      "Pode se formar tanto pela indulgência excessiva (nunca ouvir um \"não\") quanto pelo oposto — compensação por ter se sentido pequeno(a) demais em algum momento da vida.",
    descricao:
      "O Azedo se acha no direito de pregar peças e desrespeitar os outros sem sofrer as consequências, achando que as regras da boa convivência não se aplicam a ele, por se achar mais \"esperto\".",
    frase:
      "Eu posso sabotar o vídeo deles e bagunçar tudo o quanto eu quiser, porque eu sou o Azedo, e as regras estúpidas do canal não importam para mim.",
    vidaBox:
      "A verdadeira força de caráter está na empatia e na cooperação, não em diminuir os outros ou se colocar acima da lei. Reconhecer e respeitar os limites alheios é sinal de maturidade.",
    microPratica: "Antes de agir, pergunte: essa regra vale só pros outros, ou vale pra mim também?",
  },
  {
    numero: "09",
    id: "autocontrole-insuficiente",
    titulo: "Autocontrole Insuficiente",
    subtitulo: "Insufficient Self-Control / Self-Discipline",
    personagem: "torajo",
    oQueE:
      "Dificuldade constante em tolerar a frustração, de seguir regras ou de conter impulsos e emoções. A busca é sempre pela gratificação imediata sem pensar nas consequências.",
    origem:
      "Costuma se desenvolver quando não houve limites consistentes na infância, ou quando a própria frustração nunca precisou ser tolerada.",
    descricao:
      "Torajo é caótico, criativo e altamente impulsivo. Ele quer as coisas para ontem, quer fazer o vídeo mais insano possível e tem extrema dificuldade de se disciplinar ao cronograma chato e metódico do Morajo.",
    frase:
      "Quem liga pra esse roteiro e cronograma chato?! Vamos explodir isso agora, colocar fogo no cenário e ver no que dá, não consigo esperar!",
    vidaBox:
      "A disciplina é a ponte entre seus objetivos e suas realizações. Pratique adiar recompensas: termine a obrigação primeiro, jogue depois. O desconforto passageiro traz paz no futuro.",
    microPratica:
      "Treine o \"ainda não\" em vez do \"não\": adie a gratificação por 10 minutos e observe que o desconforto passa.",
  },
  {
    numero: "10",
    id: "busca-de-aprovacao",
    titulo: "Busca de Aprovação",
    subtitulo: "Approval-Seeking / Recognition-Seeking",
    personagem: "torajo",
    oQueE:
      "Colocar uma ênfase exagerada em ganhar a aprovação, o reconhecimento ou a atenção dos outros, muitas vezes em detrimento do seu próprio senso de si mesmo verdadeiro.",
    origem:
      "Frequentemente nasce quando o afeto ou a atenção dos pais/cuidadores dependia de desempenho, comportamento ou aparência — nunca vinha incondicional.",
    descricao:
      "Sendo focado no canal e no número de inscritos, a vida do Torajo gira em torno do engajamento. Ele pode se perder tentando ser o que ele acha que o público (ou os amigos) quer que ele seja, esquecendo de si.",
    frase:
      "Se esse vídeo não bater 1 milhão de likes, vai significar que ninguém gosta mais de mim. Eu preciso fazer qualquer loucura para as pessoas me notarem!",
    vidaBox:
      "A única aprovação que você controla e que realmente importa a longo prazo é a sua. Viva pelos seus valores, não pelas palmas (ou curtidas) dos outros.",
    microPratica:
      "Essa semana, tome uma decisão pequena pensando só no que é importante pra você — sem checar o que os outros vão achar.",
  },
  {
    numero: "11",
    id: "padroes-inflexiveis",
    titulo: "Padrões Inflexíveis",
    subtitulo: "Unrelenting Standards / Hypercriticalness",
    personagem: "morajo",
    oQueE:
      "A crença de que você deve se esforçar para atingir padrões internos de perfeição absurdamente altos. Resulta em estresse, julgamento constante (de si e dos outros) e nunca estar satisfeito.",
    origem:
      "Costuma vir de ambientes onde só o desempenho perfeito era reconhecido, e erros eram tratados como inaceitáveis.",
    descricao:
      "Morajo exige excelência lógica e precisão cirúrgica de todos à sua volta. Quando as coisas não atingem seu padrão impossível, ele se frustra violentamente e critica tudo e a todos.",
    frase:
      "O roteiro está 99% perfeito, mas tem UM erro lógico de continuação. Jogue fora. Se não for para fazer de forma perfeitamente racional, é melhor apagar o canal.",
    vidaBox:
      "\"Feito é melhor que perfeito não feito\". A busca incessante pela perfeição rouba a sua alegria e afasta as pessoas ao seu redor. Dê espaço para o erro humano.",
    microPratica: "Escolha uma tarefa essa semana e entregue-a em 80% em vez de 100% — observe o que realmente acontece.",
  },
  {
    numero: "12",
    id: "inibicao-emocional",
    titulo: "Inibição Emocional",
    subtitulo: "Emotional Inhibition",
    personagem: "morajo",
    oQueE:
      "Repressão excessiva de emoções, impulsos ou comportamentos espontâneos. Geralmente para evitar a desaprovação, a vergonha ou a perda de controle emocional. A lógica fria domina.",
    origem: "Geralmente se forma em famílias onde mostrar emoção era visto como fraqueza, bagunça ou motivo de vergonha.",
    descricao:
      "Morajo vê a emoção (e o caos que vem com ela) como algo irracional, inútil e indigno. Ele prefere reprimir seus sentimentos verdadeiros sob uma espessa e pesada camada de \"racionalidade\".",
    frase:
      "Sentimentos são completamente irrelevantes e só servem para atrapalhar a produtividade geral. Tudo deve ser resolvido através de pura matemática e lógica.",
    vidaBox:
      "Emoções engarrafadas explodem mais tarde de forma incontrolável, ou te deixam vazio. Expressar o que você sente (alegria, tristeza, raiva) de forma saudável é sinal de força.",
    microPratica: "Escolha uma pessoa segura e nomeie um sentimento em voz alta hoje, sem justificar ou minimizar.",
  },
];
