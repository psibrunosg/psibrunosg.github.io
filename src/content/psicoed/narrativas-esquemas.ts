// ============================================================
// Território "De onde vêm seus padrões": narrativas autorais por esquema.
//
// Modelo (definido no grilling 18/07):
//   Espinha (B): a história de uma criança e uma necessidade básica.
//   Profundidade (A): as "linhas" conectando necessidade, esquema, modo e gatilho de hoje.
//   Beat (C): cuidar da necessidade, como seria atendê-la e o passo do Adulto Saudável.
//
// Uma narrativa por esquema do YSQ (18 no total). Conteúdo AUTORAL. Nenhuma IA
// gera isto em runtime na frente do paciente. O terapeuta aprova antes de liberar
// (ver paciente_psicoed). Os ids batem com os esquemas de src/content/escalas.ts.
//
// Tom: acolhedor, concreto, sem jargão cru, sem afirmar diagnóstico. A criança é
// uma pessoa, não um caso. Fala com "você" só no presente (o hoje), nunca acusando.
// ============================================================

// As 5 necessidades emocionais básicas (Young), ancoradas nos 5 domínios do YSQ.
export interface Necessidade {
  dominioId: string; // bate com os domínios de escalas.ts (d1..d5)
  nome: string;
  descricao: string; // o que essa necessidade é, em linguagem de criança
  cor: string;
}

export const necessidades: Record<string, Necessidade> = {
  d1: {
    dominioId: "d1",
    nome: "Vínculo seguro",
    descricao:
      "Ter alguém que fica, que cuida, que aceita você do jeito que você é. E a certeza de que esse afeto não vai desaparecer.",
    cor: "#6B8BA4",
  },
  d2: {
    dominioId: "d2",
    nome: "Autonomia e competência",
    descricao:
      "Descobrir que você dá conta, que o mundo é um lugar razoavelmente seguro, e que dá pra se separar sem se perder.",
    cor: "#7A9CA4",
  },
  d3: {
    dominioId: "d3",
    nome: "Limites realistas",
    descricao:
      "Aprender que existem limites que não são punição. Eles são o contorno que ensina a esperar, a lidar com a frustração e a considerar o outro.",
    cor: "#A4926B",
  },
  d4: {
    dominioId: "d4",
    nome: "Expressar o que se sente e se precisa",
    descricao:
      "Poder ter vontade própria, dizer 'não', mostrar o que dói, sem medo de perder o amor de quem cuida por causa disso.",
    cor: "#A47A8B",
  },
  d5: {
    dominioId: "d5",
    nome: "Espontaneidade e leveza",
    descricao:
      "Ter espaço pra brincar, errar, relaxar, sem que tudo precise ser perfeito, controlado ou merecido primeiro.",
    cor: "#8B8BA4",
  },
};

export interface NarrativaEsquema {
  id: string; // bate com o id do esquema em escalas.ts
  esquema: string; // nome do esquema
  dominioId: string;
  cor: string;
  // Espinha B: a história da criança
  crianca: {
    abertura: string; // "Era uma vez uma criança que..."
    faltou: string; // a necessidade que não foi atendida o suficiente
    aprendeu: string; // a conclusão que a criança tirou (a semente do esquema)
  };
  // Profundidade A: as linhas conectando origem e presente
  conexao: {
    hoje: string; // como o esquema se manifesta hoje
    modo: string; // qual "voz interna" (modo) assume quando você é mobilizado
    gatilho: string; // um gatilho cotidiano concreto
  };
  // Beat C: cuidar da necessidade
  cuidado: {
    atendida: string; // como seria essa necessidade sendo atendida agora
    passo: string; // um passo pequeno e possível do Adulto Saudável
  };
  // Vídeo whiteboard opcional (piloto). Renderizado em video/ (projeto Remotion
  // separado, não entra no build do Vite) e commitado em public/videos/.
  // Ausente = a narrativa em texto funciona sozinha, sem quebrar nada.
  videoUrl?: string;
}

// ---------------------------------------------------------------------------
// Domínio d1: Desconexão e Rejeição · necessidade: Vínculo seguro
// ---------------------------------------------------------------------------

export const narrativas: NarrativaEsquema[] = [
  {
    id: "ed",
    esquema: "Privação Emocional",
    dominioId: "d1",
    cor: "#6B8BA4",
    videoUrl: "/videos/privacao-emocional.mp4",
    crianca: {
      abertura:
        "Era uma criança que sentia coisas grandes por dentro. Ela precisava que alguém percebesse, chegasse perto e dissesse 'eu tô aqui, me conta'.",
      faltou:
        "Nem sempre teve quem notasse. Muitas vezes não era falta de amor: os adultos estavam cansados, ocupados, ou também nunca aprenderam a se aproximar assim. Mas o colo que ela esperava vinha pouco, ou não vinha.",
      aprendeu:
        "Então a criança aprendeu, sem perceber, uma regra silenciosa: 'as minhas necessidades não vão ser atendidas de qualquer jeito, melhor não esperar'. E parou de pedir.",
    },
    conexao: {
      hoje:
        "Hoje essa regra às vezes continua funcionando por baixo do pano. Você pode se sentir sozinho mesmo cercado de gente, achar difícil pedir carinho ou apoio, ou nem perceber que está com fome de um cuidado que nunca aprendeu a receber.",
      modo:
        "Quando isso é tocado, costuma ser a Criança Vulnerável que assume, com aquela sensação crua de 'ninguém vai me entender de verdade'. Logo em seguida chega o Protetor Desligado, que dá de ombros e diz 'não preciso de ninguém'.",
      gatilho:
        "Um dia difícil em que você queria que alguém perguntasse como você está, e ninguém perguntou. E você também não pediu.",
    },
    cuidado: {
      atendida:
        "Essa necessidade atendida parece simples: alguém que percebe, que pergunta, que fica. Com o tempo, você também vai aprendendo a ser esse alguém pra si mesmo, notando a própria fome de cuidado em vez de descartá-la.",
      passo:
        "Um passo pequeno: da próxima vez que sentir esse vazio, tente nomeá-lo em vez de desligar. Algo como 'estou precisando de contato agora'. E, se der, diga isso pra uma pessoa de confiança.",
    },
  },
  {
    id: "ab",
    esquema: "Abandono / Instabilidade",
    dominioId: "d1",
    cor: "#6B8BA4",
    crianca: {
      abertura:
        "Era uma criança que precisava de uma base firme. Pessoas que ficassem, uma rotina que não desmoronasse, a certeza de que o amor de hoje ainda estaria ali amanhã.",
      faltou:
        "Mas o chão às vezes tremia. Talvez alguém tenha ido embora, adoecido, aparecido e sumido. Talvez o clima em casa mudasse sem aviso. A criança nunca sabia bem se podia contar que as coisas iam permanecer.",
      aprendeu:
        "Aprendeu, então, a viver com uma antena ligada: 'o que eu amo pode ir embora a qualquer momento'. E passou a se agarrar com força, ou a se preparar o tempo todo pra perda.",
    },
    conexao: {
      hoje:
        "Hoje isso pode aparecer como um medo intenso de ser deixado, ciúme ou insegurança nos vínculos, ou uma dificuldade de relaxar dentro de uma relação. Como se a calmaria fosse só o intervalo antes do próximo abandono.",
      modo:
        "Quando o medo dispara, a Criança Vulnerável costuma assumir o microfone, com aquele pânico cru do 'vão me deixar'. Às vezes ela reage se agarrando, testando, ou se afastando primeiro pra não ser afastada.",
      gatilho:
        "Uma pessoa querida que demora a responder, muda de tom, ou fica distante sem explicar. A antena antiga liga na hora.",
    },
    cuidado: {
      atendida:
        "Essa necessidade atendida é a experiência de permanência: relações onde as pessoas voltam, explicam, ficam. E a descoberta, aos poucos, de que uma distância momentânea nem sempre é o começo de uma perda.",
      passo:
        "Um passo pequeno: quando a antena ligar, cheque o fato antes da conclusão. 'Ela está distante' é diferente de 'ela vai me abandonar'. Se precisar, pergunte em vez de presumir.",
    },
  },
  {
    id: "ma",
    esquema: "Desconfiança / Abuso",
    dominioId: "d1",
    cor: "#6B8BA4",
    crianca: {
      abertura:
        "Era uma criança que precisava de segurança. Precisava saber que os adultos ao redor eram lugares onde ela podia baixar a guarda sem ser machucada.",
      faltou:
        "Mas em algum momento a confiança foi quebrada. Pode ter sido dureza, humilhação, um limite invadido, uma promessa traída. A criança aprendeu que baixar a guarda tinha um custo.",
      aprendeu:
        "Então ela ergueu muros e ficou vigilante: 'se eu confiar, vão tirar vantagem de mim'. A guarda alta virou proteção, e também virou prisão.",
    },
    conexao: {
      hoje:
        "Hoje isso pode aparecer como uma dificuldade de confiar, uma leitura constante de segundas intenções, ou uma tensão em relações onde, racionalmente, você sabe que está seguro, mas o corpo não baixa a guarda.",
      modo:
        "Quando a antiga ameaça é tocada, às vezes é a Criança Vulnerável assustada que assume. Outras vezes, um Protetor que ataca ou se blinda primeiro, pra não correr o risco de ser ferido de novo.",
      gatilho:
        "Alguém se aproximando rápido demais, ou um gesto ambíguo que o alarme antigo lê na hora como perigo.",
    },
    cuidado: {
      atendida:
        "Essa necessidade atendida é a experiência repetida de segurança: pessoas que respeitam seus limites, que são consistentes, que não usam sua vulnerabilidade contra você. Aos poucos, o corpo reaprende que nem toda proximidade é ameaça.",
      passo:
        "Um passo pequeno: permita uma dose de confiança do tamanho do risco real. Não precisa escancarar os muros, só testar uma fresta com quem já se mostrou seguro, e observar o que de fato acontece.",
    },
  },
  {
    id: "si",
    esquema: "Isolamento Social / Alienação",
    dominioId: "d1",
    cor: "#6B8BA4",
    crianca: {
      abertura:
        "Era uma criança que precisava sentir que pertencia. Que fazia parte de um grupo, de uma turma, de um 'nós'.",
      faltou:
        "Mas por algum motivo ela se sentia de fora. Talvez fosse diferente de um jeito visível, talvez a família fosse isolada, talvez ela nunca achasse o próprio lugar. A sensação era de estar sempre olhando de longe uma festa da qual não fazia parte.",
      aprendeu:
        "Aprendeu, então, que era diferente por dentro: 'eu não me encaixo em lugar nenhum'. E foi ficando na margem, meio por dor, meio por hábito.",
    },
    conexao: {
      hoje:
        "Hoje isso pode aparecer como uma sensação persistente de não pertencer. De ser estranho ao grupo mesmo quando é bem recebido, de se sentir sozinho numa mesa cheia, de achar que os outros têm um manual de convivência que ninguém te deu.",
      modo:
        "Quando isso é tocado, a Criança Vulnerável costuma assumir com aquele aperto do 'eu sou diferente, não pertenço'. E o Protetor às vezes responde se afastando antes, pra não sentir a exclusão de perto.",
      gatilho:
        "Entrar num ambiente onde todos parecem se conhecer e se entender. A antiga sensação de ser o único de fora liga na hora.",
    },
    cuidado: {
      atendida:
        "Essa necessidade atendida é a experiência de pertencer: espaços onde sua diferença cabe, onde você é incluído sem ter que se disfarçar. E a descoberta de que pertencer raramente é sobre ser igual. É sobre ser aceito sendo você.",
      passo:
        "Um passo pequeno: em vez de esperar sentir que pertence pra se aproximar, arrisque um gesto pequeno de dentro do grupo, uma pergunta, um comentário. Repare que o pertencimento costuma se construir aos poucos, não de uma vez.",
    },
  },
  {
    id: "ds",
    esquema: "Defectividade / Vergonha",
    dominioId: "d1",
    cor: "#6B8BA4",
    crianca: {
      abertura:
        "Era uma criança que precisava sentir que era boa o bastante do jeito que era. Que havia nela algo digno de amor, sem precisar merecer.",
      faltou:
        "Mas em vez disso ela recebeu, de algum lugar, a mensagem de que havia algo errado com ela. Críticas, comparações, rejeições, ou um olhar que dizia 'você decepciona'. A criança acreditou.",
      aprendeu:
        "Aprendeu a carregar uma vergonha secreta: 'se me conhecerem de verdade, vão ver que eu não presto'. E passou a esconder as partes que achava defeituosas, que era quase tudo.",
    },
    conexao: {
      hoje:
        "Hoje isso pode aparecer como uma sensação de ser falho por dentro, um medo de ser 'descoberto', dificuldade de aceitar elogios, ou a certeza de que a proximidade real levaria a pessoa a te rejeitar.",
      modo:
        "Quando essa ferida é tocada, com frequência é o Crítico Interno que assume. É a voz dura que confirma 'viu, eu avisei que você não presta', enquanto a Criança Vulnerável se encolhe embaixo dela.",
      gatilho:
        "Um erro exposto, uma crítica, ou até um elogio que não bate com a imagem interna. Qualquer coisa que roce a suspeita antiga de não ser suficiente.",
    },
    cuidado: {
      atendida:
        "Essa necessidade atendida é a experiência de ser aceito por inteiro: pessoas que conhecem suas partes 'defeituosas' e ficam mesmo assim. E, com o tempo, a voz que cuida ganhando força sobre a voz que condena.",
      passo:
        "Um passo pequeno: quando o Crítico Interno disparar o veredito de sempre, tente responder a ele com a firmeza gentil do Adulto. 'Errar não me torna defeituoso.' Em vez de assinar embaixo automaticamente.",
    },
  },

  // -------------------------------------------------------------------------
  // Domínio d2: Autonomia e Desempenho Prejudicados · Autonomia e competência
  // -------------------------------------------------------------------------
  {
    id: "fa",
    esquema: "Fracasso",
    dominioId: "d2",
    cor: "#7A9CA4",
    crianca: {
      abertura:
        "Era uma criança que precisava descobrir que era capaz. Tentar, errar, tentar de novo e sentir, no fim, 'eu consigo'.",
      faltou:
        "Mas talvez os erros dela pesassem demais, ou as conquistas passassem batidas, ou sempre houvesse alguém mais rápido e mais elogiado ao lado. A sensação de competência não teve espaço pra crescer.",
      aprendeu:
        "Aprendeu, então, a se medir por baixo: 'eu não sou tão capaz quanto os outros, sempre vou ficar pra trás'. E passou a esperar o próprio fracasso antes mesmo de tentar.",
    },
    conexao: {
      hoje:
        "Hoje isso pode aparecer como uma sensação de ser menos competente que os demais, medo de tarefas que expõem seu desempenho, ou uma tendência a evitar desafios pra não confirmar a previsão de que vai falhar.",
      modo:
        "Quando isso é tocado, o Crítico Interno costuma assumir com a comparação e o veredito antecipado, o 'você não dá conta'. E a Criança Vulnerável desanima antes de começar.",
      gatilho:
        "Uma tarefa nova, uma avaliação, um lugar onde seu resultado vai ser comparado ao dos outros. A antiga certeza de inferioridade se ativa.",
    },
    cuidado: {
      atendida:
        "Essa necessidade atendida é a experiência acumulada de conseguir: tentativas que dão certo o suficiente, erros que viram aprendizado em vez de sentença. A competência se constrói fazendo, não esperando estar pronto.",
      passo:
        "Um passo pequeno: separe 'errei nisto' de 'sou um fracasso'. E escolha um desafio do tamanho certo pra colecionar uma prova concreta de que você é mais capaz do que a previsão antiga diz.",
    },
  },
  {
    id: "di",
    esquema: "Dependência / Incompetência",
    dominioId: "d2",
    cor: "#7A9CA4",
    crianca: {
      abertura:
        "Era uma criança que precisava aprender a se virar. Tomar pequenas decisões, resolver pequenos problemas e sentir 'eu dou conta disso sozinha'.",
      faltou:
        "Mas talvez tudo fosse resolvido por ela, ou o mundo fosse apresentado como perigoso demais pra ela enfrentar sozinha, ou suas tentativas fossem corrigidas antes de terminarem. A autonomia não teve chance de amadurecer.",
      aprendeu:
        "Aprendeu, então, a duvidar da própria capacidade de funcionar sem apoio: 'sozinho eu não consigo, preciso de alguém que saiba'. E passou a buscar quem decidisse por ela.",
    },
    conexao: {
      hoje:
        "Hoje isso pode aparecer como uma insegurança pra decidir sozinho, uma sensação de sobrecarga diante de tarefas comuns do dia a dia, ou a busca por alguém que confirme, aprove ou assuma no seu lugar.",
      modo:
        "Quando isso é tocado, a Criança Vulnerável costuma assumir com a sensação de desamparo, o 'eu não vou dar conta'. E busca alguém mais forte pra se apoiar.",
      gatilho:
        "Precisar decidir ou resolver algo importante sozinho, sem ninguém pra validar. A antiga sensação de incapacidade sobe.",
    },
    cuidado: {
      atendida:
        "Essa necessidade atendida é a descoberta prática de que você resolve mais do que pensa. Cada decisão tomada e cada problema enfrentado sozinho vira tijolo de uma confiança que ninguém dá de fora. Só a experiência constrói.",
      passo:
        "Um passo pequeno: escolha uma decisão pequena que você normalmente terceirizaria e tome ela sozinho, só pra sentir na prática que a competência estava mais disponível do que a dúvida deixava ver.",
    },
  },
  {
    id: "vu",
    esquema: "Vulnerabilidade ao Perigo ou à Doença",
    dominioId: "d2",
    cor: "#7A9CA4",
    crianca: {
      abertura:
        "Era uma criança que precisava sentir que o mundo era, no geral, um lugar seguro o bastante pra se viver sem estar em alerta o tempo todo.",
      faltou:
        "Mas talvez o medo fosse o clima de casa. Uma preocupação constante com doenças, catástrofes, acidentes. Um adulto ansioso avisando a todo instante do que podia dar errado. O perigo parecia estar sempre à espreita.",
      aprendeu:
        "Aprendeu, então, a viver na iminência da tragédia: 'algo ruim pode acontecer a qualquer momento, é melhor eu estar preparado'. E a vigilância virou um jeito de tentar controlar o incontrolável.",
    },
    conexao: {
      hoje:
        "Hoje isso pode aparecer como uma ansiedade de fundo, uma antecipação de catástrofes na saúde, nas finanças ou na segurança, ou uma dificuldade de relaxar porque baixar a guarda parece perigoso.",
      modo:
        "Quando isso é tocado, a Criança Vulnerável assustada costuma assumir, com o corpo em alerta e a mente projetando o pior. E o controle vira a tentativa de evitar a catástrofe imaginada.",
      gatilho:
        "Uma notícia ruim, uma sensação física estranha, uma incerteza sobre o futuro. A máquina de prever tragédias liga.",
    },
    cuidado: {
      atendida:
        "Essa necessidade atendida é a experiência repetida de que a maioria dos perigos previstos não acontece. E de que, quando algo difícil vem, você tem mais recursos pra lidar do que o medo supunha. Segurança não é ausência de risco, é confiança na própria capacidade de enfrentar.",
      passo:
        "Um passo pequeno: quando a previsão de catástrofe ligar, pergunte 'qual a chance real disso, e o que eu faria se acontecesse?'. Isso traz o medo do terreno do imaginado pro terreno do possível e manejável.",
    },
  },
  {
    id: "em",
    esquema: "Emaranhamento / Self Subdesenvolvido",
    dominioId: "d2",
    cor: "#7A9CA4",
    crianca: {
      abertura:
        "Era uma criança que precisava desenvolver um 'eu' próprio. Gostos, opiniões, um contorno que dissesse 'isto sou eu, aquilo é o outro'.",
      faltou:
        "Mas talvez a proximidade com um cuidador fosse intensa demais, sem espaço entre os dois. As emoções de um eram as do outro, a vida de um girava em torno do outro. A criança cresceu grudada, sem chance de descobrir onde ela terminava e o outro começava.",
      aprendeu:
        "Aprendeu, então, que existir separadamente era quase uma traição: 'eu e essa pessoa somos um só, não sei ser sem ela'. E o self próprio ficou de molho.",
    },
    conexao: {
      hoje:
        "Hoje isso pode aparecer como uma dificuldade de saber o que você mesmo quer, uma culpa ao se diferenciar de pessoas próximas, ou uma sensação de vazio quando está longe de quem te define.",
      modo:
        "Quando isso é tocado, a Criança Vulnerável costuma assumir com o medo da separação, o 'sem essa pessoa eu não sei quem sou'. E a diferenciação vira ameaça em vez de crescimento.",
      gatilho:
        "Um momento em que você precisa discordar, se afastar ou seguir um caminho próprio que desagrada alguém de quem você é muito próximo.",
    },
    cuidado: {
      atendida:
        "Essa necessidade atendida é a construção de um 'eu' que existe por conta própria: preferências, opiniões e uma vida que são suas, sem que isso signifique perder o vínculo. Separar-se com amor é diferente de abandonar.",
      passo:
        "Um passo pequeno: identifique uma preferência genuinamente sua, pequena que seja, e sustente ela mesmo que difira da de alguém próximo. Sinta que ter contorno próprio não rompe o laço.",
    },
  },

  // -------------------------------------------------------------------------
  // Domínio d3: Limites Prejudicados · Limites realistas
  // (Aqui a necessidade não atendida foi o contorno: faltou o limite firme e amoroso.)
  // -------------------------------------------------------------------------
  {
    id: "et",
    esquema: "Arrogo / Grandiosidade",
    dominioId: "d3",
    cor: "#A4926B",
    crianca: {
      abertura:
        "Era uma criança que precisava aprender que era especial e importante, e ao mesmo tempo que os outros também eram, e que os limites valiam pra ela também.",
      faltou:
        "Mas talvez ela tenha recebido a primeira parte sem a segunda: tratada como exceção, poupada de frustrações, colocada acima das regras. Ou o contrário, tenha aprendido que só sendo superior conseguiria valor. O contorno que ensina 'você é importante, e o outro também' não veio inteiro.",
      aprendeu:
        "Aprendeu, então, uma régua desigual: 'as regras comuns não são bem pra mim, eu mereço mais'. E a dificuldade de aceitar limites virou um jeito de se proteger de se sentir comum, ou pequeno.",
    },
    conexao: {
      hoje:
        "Hoje isso pode aparecer como impaciência com regras e limites, irritação quando não se recebe tratamento especial, ou uma dificuldade de tolerar o lugar de igual. Às vezes cobrindo, por baixo, um medo de não ser nada além do especial.",
      modo:
        "Quando isso é tocado, às vezes assume um modo mais grandioso e impaciente, que exige e passa por cima. E, por baixo dele, com frequência há uma Criança Vulnerável que teme não valer nada se não for superior.",
      gatilho:
        "Uma situação em que você precisa esperar, seguir a mesma regra que todos, ou aceitar um 'não'. A irritação de não ser exceção sobe rápido.",
    },
    cuidado: {
      atendida:
        "Essa necessidade atendida é a experiência de que você tem valor sendo um entre outros, não acima. Limites deixam de ser rebaixamento e viram o terreno comum onde relações de igual pra igual ficam possíveis, e onde você é querido sem precisar ser superior.",
      passo:
        "Um passo pequeno: numa situação em que a régua desigual ligar, experimente aceitar o limite comum e repare que ele não te diminui. Caber junto pode ser mais leve do que estar sempre acima.",
    },
  },
  {
    id: "is",
    esquema: "Autocontrole / Autodisciplina Insuficientes",
    dominioId: "d3",
    cor: "#A4926B",
    crianca: {
      abertura:
        "Era uma criança que precisava aprender a tolerar a frustração. A esperar, a concluir o que é chato, a segurar o impulso quando o resultado importa.",
      faltou:
        "Mas talvez esse contorno tenha faltado. Pouca rotina, pouca constância, ou adultos que cediam sempre pra evitar o choro. A criança não teve o andaime que ensina, aos poucos, a lidar com o desconforto de não ter tudo agora.",
      aprendeu:
        "Aprendeu, então, a fugir do desconforto: 'se é chato ou difícil, eu paro'. E a dificuldade de sustentar esforço e adiar recompensa acompanhou o crescimento.",
    },
    conexao: {
      hoje:
        "Hoje isso pode aparecer como dificuldade de concluir tarefas entediantes, adiamento crônico, impulsos difíceis de segurar, ou a sensação de que a disciplina dos outros é um talento que faltou a você.",
      modo:
        "Quando isso é tocado, costuma assumir uma parte mais impulsiva, que busca alívio imediato. Depois, muitas vezes, o Crítico Interno chega cobrando pela falta de constância, o que só aumenta a fuga.",
      gatilho:
        "Uma tarefa longa, chata ou frustrante que exige que você siga mesmo sem vontade. O impulso de largar e buscar algo mais fácil aparece.",
    },
    cuidado: {
      atendida:
        "Essa necessidade atendida é a descoberta de que você aguenta o desconforto mais do que pensava. Cada tarefa concluída apesar do tédio, cada impulso segurado, constrói um músculo. Ninguém nasce com ele pronto, ele se treina, com andaimes e paciência.",
      passo:
        "Um passo pequeno: divida uma tarefa evitada em um pedaço tão pequeno que fique difícil recusar, e complete ele. Isso prova ao sistema antigo que sustentar um pouco de desconforto é possível e não te esmaga.",
    },
  },

  // -------------------------------------------------------------------------
  // Domínio d4: Direcionamento para o Outro · Expressar o que se sente e precisa
  // -------------------------------------------------------------------------
  {
    id: "sb",
    esquema: "Subjugação",
    dominioId: "d4",
    cor: "#A47A8B",
    crianca: {
      abertura:
        "Era uma criança que precisava poder ter vontade própria. Dizer 'eu quero', 'eu não quero', 'isso me machuca', sem medo de perder o afeto por causa disso.",
      faltou:
        "Mas talvez expressar vontade tivesse um custo alto. Brigas, retaliação, um adulto que ficava magoado ou bravo quando ela discordava. A criança aprendeu que sua vontade era perigosa pros vínculos.",
      aprendeu:
        "Aprendeu, então, a ceder pra manter a paz: 'se eu fizer o que quero, os outros vão se afastar ou se voltar contra mim'. E a própria vontade foi ficando abafada, quase invisível.",
    },
    conexao: {
      hoje:
        "Hoje isso pode aparecer como uma dificuldade de dizer não, de expressar o que você quer, ou como uma raiva que se acumula por baixo do 'tudo bem'. Ceder virou automático, mesmo quando custa caro.",
      modo:
        "Quando isso é tocado, a Criança Vulnerável costuma assumir com o medo antigo, o 'se eu me impuser, vão me rejeitar ou retaliar'. E a submissão vira o jeito de garantir que ninguém se afaste.",
      gatilho:
        "Um momento em que você precisa discordar, recusar um pedido ou expressar uma necessidade que contraria a de alguém. O medo antigo faz você engolir e ceder.",
    },
    cuidado: {
      atendida:
        "Essa necessidade atendida é a experiência de que ter vontade própria não destrói os laços que valem a pena. Relações onde você pode discordar, pedir e recusar, e as pessoas ficam. Sua voz deixa de ser uma ameaça e vira parte de estar junto de verdade.",
      passo:
        "Um passo pequeno: escolha uma situação de baixo risco pra expressar uma preferência ou um 'não' pequeno. Observe que a maioria dos vínculos saudáveis aguenta, e alguns até se aproximam, quando você aparece por inteiro.",
    },
  },
  {
    id: "ss",
    esquema: "Autossacrifício",
    dominioId: "d4",
    cor: "#A47A8B",
    crianca: {
      abertura:
        "Era uma criança que precisava saber que suas necessidades importavam tanto quanto as dos outros. Que cuidar e ser cuidada podiam andar juntas.",
      faltou:
        "Mas talvez ela tenha sido colocada cedo no papel de quem cuida. Um adulto frágil pra amparar, irmãos pra criar, uma casa pra segurar. Ser boa passou a significar abrir mão de si. E ela foi elogiada por isso.",
      aprendeu:
        "Aprendeu, então, que seu valor estava em servir: 'sou uma boa pessoa quando ponho os outros antes de mim'. E as próprias necessidades foram pro fim da fila. Muitas vezes nem entravam na fila.",
    },
    conexao: {
      hoje:
        "Hoje isso pode aparecer como uma tendência a cuidar de todos e se esquecer de si, culpa ao priorizar as próprias necessidades, ou um esgotamento silencioso de quem dá muito mais do que recebe, sem nem perceber o desequilíbrio.",
      modo:
        "Quando isso é tocado, costuma assumir uma parte cuidadora que se sente boa servindo. E, por baixo, uma Criança Vulnerável que teme que só será querida enquanto for útil.",
      gatilho:
        "Um momento em que cuidar de você exigiria dizer não a alguém, ou receber ajuda em vez de dá-la. A culpa de 'estar sendo egoísta' aparece na hora.",
    },
    cuidado: {
      atendida:
        "Essa necessidade atendida é o equilíbrio: relações onde cuidar não é abrir mão de si, onde receber é tão possível quanto dar. Você descobrindo que suas necessidades não são um peso, e que quem te ama de verdade quer atendê-las também.",
      passo:
        "Um passo pequeno: identifique uma necessidade sua que você costuma engolir, e atenda ela, mesmo com a culpa aparecendo. Repare que se incluir na conta não te torna pior, te torna inteiro.",
    },
  },
  {
    id: "as",
    esquema: "Busca de Aprovação / Reconhecimento",
    dominioId: "d4",
    cor: "#A47A8B",
    crianca: {
      abertura:
        "Era uma criança que precisava sentir que tinha valor por ser quem era. Não pelo que produzia, exibia ou conquistava pros outros verem.",
      faltou:
        "Mas talvez o afeto viesse atrelado ao desempenho. Elogios quando brilhava, indiferença quando era só ela. A criança aprendeu a caçar o olhar de aprovação, porque parecia ser ali que o valor morava.",
      aprendeu:
        "Aprendeu, então, a se medir pelo espelho dos outros: 'eu valho pelo que os outros acham de mim'. E a autoestima virou refém do reconhecimento externo.",
    },
    conexao: {
      hoje:
        "Hoje isso pode aparecer como uma dependência da aprovação alheia, decisões guiadas pela imagem que você passa, ou uma sensação de vazio quando o reconhecimento externo falta. Como se sem a plateia você não soubesse quanto vale.",
      modo:
        "Quando isso é tocado, a Criança Vulnerável costuma assumir com a fome de aprovação, o 'preciso que notem, senão não valho'. E a performance vira a tentativa de preencher um valor que não se sente por dentro.",
      gatilho:
        "Uma situação em que você é pouco notado, criticado, ou comparado. A sensação de que seu valor despencou junto com a aprovação.",
    },
    cuidado: {
      atendida:
        "Essa necessidade atendida é a construção de um valor interno que não depende da plateia. A experiência de ser querido no comum, sem brilhar, e de gostar de escolhas suas mesmo quando ninguém aplaude. O reconhecimento vira um bônus, não o alicerce.",
      passo:
        "Um passo pequeno: faça uma escolha por um critério genuinamente seu, não pelo que renderia aprovação. Repare na satisfação que vem de dentro, independente de quem viu.",
    },
  },

  // -------------------------------------------------------------------------
  // Domínio d5: Supervigilância e Inibição · Espontaneidade e leveza
  // -------------------------------------------------------------------------
  {
    id: "np",
    esquema: "Negativismo / Pessimismo",
    dominioId: "d5",
    cor: "#8B8BA4",
    crianca: {
      abertura:
        "Era uma criança que precisava de espaço pra esperança. Pra acreditar que as coisas podiam dar certo, e brincar sem o peso do que podia dar errado.",
      faltou:
        "Mas talvez o clima ao redor fosse de preocupação e queixa. Adultos que enxergavam o problema antes da possibilidade, que se protegiam esperando o pior. A criança absorveu essa lente.",
      aprendeu:
        "Aprendeu, então, que esperar o ruim era mais seguro que se decepcionar: 'se algo vai bem, é só questão de tempo até desandar'. E o pessimismo virou uma armadura contra a frustração.",
    },
    conexao: {
      hoje:
        "Hoje isso pode aparecer como um foco automático no que pode dar errado, dificuldade de aproveitar o que vai bem, ou uma sensação de que celebrar é arriscado. Como se a alegria convidasse o azar.",
      modo:
        "Quando isso é tocado, costuma assumir uma parte vigilante e preocupada, que varre o horizonte atrás de ameaças. E a Criança Vulnerável se protege não deixando a esperança crescer, pra não doer depois.",
      gatilho:
        "Um momento bom, uma boa notícia, uma conquista. A mente imediatamente procura a rachadura, o 'mas', o que vai estragar.",
    },
    cuidado: {
      atendida:
        "Essa necessidade atendida é a permissão pra esperança. A experiência de que muitas coisas dão certo e podem ser aproveitadas sem que isso 'atraia' o oposto. A leveza deixa de ser ingenuidade e vira um direito.",
      passo:
        "Um passo pequeno: diante de algo bom, pratique demorar nele um instante a mais, nomeando o que está indo bem, em vez de correr pra próxima ameaça possível.",
    },
  },
  {
    id: "ei",
    esquema: "Inibição Emocional",
    dominioId: "d5",
    cor: "#8B8BA4",
    crianca: {
      abertura:
        "Era uma criança que precisava poder demonstrar o que sentia. Alegria, raiva, afeto, lágrima. E ser recebida nisso, sem ser corrigida ou envergonhada.",
      faltou:
        "Mas talvez a emoção fosse malvista em casa. 'Não chora', 'controle-se', 'não faça escândalo'. A espontaneidade emocional aprendeu a ser perigosa ou ridícula. Melhor guardar.",
      aprendeu:
        "Aprendeu, então, a se conter: 'demonstrar o que sinto é constrangedor ou arriscado'. E a expressão emocional foi trancada, inclusive a das emoções boas.",
    },
    conexao: {
      hoje:
        "Hoje isso pode aparecer como dificuldade de demonstrar afeto ou vulnerabilidade, uma rigidez no jeito, ou a sensação de estar sempre segurando algo. Como se soltar fosse perder o controle.",
      modo:
        "Quando isso é tocado, costuma assumir uma parte controladora que abafa a emoção antes que ela apareça. E a Criança Vulnerável, que queria se expressar, fica muda por baixo do controle.",
      gatilho:
        "Um momento que pede espontaneidade emocional: demonstrar carinho, chorar, comemorar sem reservas. O freio antigo trava a expressão.",
    },
    cuidado: {
      atendida:
        "Essa necessidade atendida é a liberdade de sentir e mostrar. Espaços onde a emoção é bem-vinda, onde chorar ou vibrar não te expõe ao ridículo. Você descobrindo que soltar um pouco não é perder o controle, é habitar a própria vida.",
      passo:
        "Um passo pequeno: permita uma expressão emocional pequena que você normalmente seguraria, um elogio afetuoso, um 'senti sua falta'. Repare que soltar de leve não desmorona nada.",
    },
  },
  {
    id: "us",
    esquema: "Padrões Inflexíveis / Postura Hipercrítica",
    dominioId: "d5",
    cor: "#8B8BA4",
    crianca: {
      abertura:
        "Era uma criança que precisava saber que 'bom o suficiente' bastava. Que ela seria amada mesmo sem ser perfeita, e que errar fazia parte de aprender.",
      faltou:
        "Mas talvez o padrão fosse alto demais. Elogio só na excelência, cobrança na falha, a régua sempre subindo. Ser boa passou a significar ser impecável. E impecável nunca chegava.",
      aprendeu:
        "Aprendeu, então, uma exigência sem trégua: 'eu tenho que dar o meu máximo sempre, o segundo lugar é fracasso'. E o descanso, o erro e o suficiente viraram inimigos.",
    },
    conexao: {
      hoje:
        "Hoje isso pode aparecer como perfeccionismo, autocrítica dura, dificuldade de relaxar ou de se contentar, e uma sensação de nunca ser suficiente por mais que você conquiste.",
      modo:
        "Quando isso é tocado, o Crítico Interno costuma assumir com a régua impossível, o 'não está bom, você podia mais'. E a Criança Vulnerável, exausta, nunca recebe o descanso que merece.",
      gatilho:
        "Um trabalho entregue, uma tarefa concluída, um momento de descanso. A voz que diz 'poderia ter sido melhor, você não pode parar' entra em cena.",
    },
    cuidado: {
      atendida:
        "Essa necessidade atendida é a experiência de que você é aceito sem ser perfeito. Pessoas que te querem no comum, no cansado, no 'bom o suficiente'. E a descoberta de que descansar e errar não te tornam menos, te tornam humano.",
      passo:
        "Um passo pequeno: entregue ou conclua algo em 'bom o suficiente' de propósito, sem o retoque final que o Crítico exige. Observe que o mundo não desaba, e que a régua podia ser mais gentil.",
    },
  },
  {
    id: "pu",
    esquema: "Postura Punitiva / Punição",
    dominioId: "d5",
    cor: "#8B8BA4",
    crianca: {
      abertura:
        "Era uma criança que precisava aprender que errar não é crime. Que falhas podem ser reparadas, e que ela merecia compreensão quando tropeçava.",
      faltou:
        "Mas talvez o erro fosse tratado com punição dura, sem espaço pra reparo. 'Quem erra paga.' A criança aprendeu que a falha exige castigo, não cuidado.",
      aprendeu:
        "Aprendeu, então, a se punir com rigor: 'se eu errei, mereço sofrer por isso'. E a compaixão pelo próprio tropeço nunca entrou na conta.",
    },
    conexao: {
      hoje:
        "Hoje isso pode aparecer como uma dureza consigo, e às vezes com os outros, diante de erros. Dificuldade de se perdoar, ou a sensação de que você merece o castigo quando falha, sem espaço pra reparo e reconciliação.",
      modo:
        "Quando isso é tocado, o Crítico Interno assume na sua forma mais punitiva. Não só cobra, condena. E a Criança Vulnerável recebe a sentença sem defesa.",
      gatilho:
        "Um erro seu, uma falha, uma decepção com você mesmo. A máquina de punição interna liga, exigindo pagamento em sofrimento.",
    },
    cuidado: {
      atendida:
        "Essa necessidade atendida é a experiência da falha reparável. Pessoas que respondem ao erro com correção e cuidado, não com castigo. Você aprendendo que a firmeza pode andar com a compaixão, que errar pede reparo, não pena.",
      passo:
        "Um passo pequeno: diante de um erro seu, troque a pergunta 'quanto eu mereço sofrer por isso?' por 'o que repara isso, e o que eu aprendo?'. Responda à falha como um adulto que cuida, não como um juiz que pune.",
    },
  },
];
