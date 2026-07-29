// Território "Distorções Cognitivas" — Mundo Torajo (revamp do módulo antigo de quiz).
// Conteúdo adaptado 1:1 do material original (G:\Meu Drive\Torajo\index.html),
// baseado na Terapia Cognitivo-Comportamental. Dados puros — sem lógica de UI.
// Não confundir com src/content/distorcoes.ts (baralho clínico usado no exercício
// "Acerte a Distorção" e em outros pontos do site) — não mexer nele.
// Ver docs/mundo-torajo-playbook.md.

import type { PersonagemId } from "@/content/psicoed/personagens";

export interface DistorcaoTorajo {
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

export const distorcoesTorajo: DistorcaoTorajo[] = [
  {
    numero: "01",
    id: "catastrofizacao",
    titulo: "Catastrofização",
    subtitulo: "Catastrophizing",
    personagem: "zulmi",
    oQueE:
      "Imaginar automaticamente o pior cenário possível como se fosse o único resultado possível. É a certeza de que o futuro será terrível e insuportável.",
    descricao:
      "A Zulmi é a rainha da harmonia e quer sempre que todos estejam bem. Quando o caos se instaura e Torajo e Morajo começam a brigar, a mente dela pode focar no pior: ela não apenas fica preocupada, ela imagina que isso vai destruir a amizade deles para sempre.",
    frase: "Eles estão discutindo de novo sobre o roteiro! O canal vai acabar, vamos perder todos os inscritos e nossa amizade está arruinada para sempre!",
    vidaBox:
      "Avalie as probabilidades reais. Em vez de perguntar 'E se acontecer o pior?', pergunte-se 'Qual é o resultado mais provável de acontecer?'.",
  },
  {
    numero: "02",
    id: "tudo-ou-nada",
    titulo: "Pensamento Tudo-ou-Nada",
    subtitulo: "All-or-Nothing Thinking",
    personagem: "morajo",
    oQueE: "Ver o mundo em extremos absolutos, sem tons de cinza. Se uma situação não é perfeita, é um fracasso total.",
    descricao:
      "Morajo, como o lado lógico e metódico da dupla, muitas vezes enxerga as coisas de forma dicotômica: ou o vídeo é feito com pura lógica e racionalidade (o jeito dele), ou é um desastre caótico e sem sentido (o jeito do Torajo).",
    frase: "Se o vídeo não seguir 100% das regras lógicas e racionais que eu planejei, então ele é um completo lixo e nem deveria ser postado.",
    vidaBox:
      "Busque o 'caminho do meio'. A realidade raramente é um absoluto. Treine sua mente para avaliar situações em porcentagens (ex: '70% do trabalho deu certo e 30% pode melhorar').",
  },
  {
    numero: "03",
    id: "personalizacao",
    titulo: "Personalização",
    subtitulo: "Personalization",
    personagem: "torajo",
    oQueE:
      "Assumir a culpa por eventos externos negativos que não estão sob seu controle, achando que o sofrimento dos outros é sua responsabilidade direta.",
    descricao:
      "O coração gentil e otimista de Torajo faz dele um ótimo líder, mas isso é também sua armadilha. Se os amigos brigam ou o clima pesa, ele rapidamente acha que falhou na sua missão de animá-los.",
    frase: "A Zulmi está triste hoje e o Linn não quis gravar... A culpa é minha, eu devo ser um péssimo amigo e líder por não conseguir fazer todos rirem.",
    vidaBox:
      "Divida os fatores que contribuíram para um evento — o \"gráfico de pizza da responsabilidade\". Você verá que as escolhas dos outros ocupam a maior parte.",
  },
  {
    numero: "04",
    id: "desqualificacao-do-positivo",
    titulo: "Desqualificação do Positivo",
    subtitulo: "Disqualifying the Positive",
    personagem: "azedo",
    oQueE:
      "Quando algo bom acontece, você ignora ou insiste que 'não conta' por algum motivo. Mantém-se na crença negativa mesmo diante de evidências de sucesso.",
    descricao:
      "O Azedo adora implicar. Mesmo quando o grupo tem um momento incrivelmente divertido ou consegue bater uma meta no canal, ele arranja um jeito de desqualificar a conquista.",
    frase: "Tá, o vídeo de hoje bateu um milhão de visualizações... mas foi pura sorte. E vocês continuam sendo muito chatos e caóticos.",
    vidaBox: "Pratique aceitar elogios e vitórias com um simples 'obrigado', sem adicionar um 'mas...' na sequência. Reconheça seu sucesso.",
  },
  {
    numero: "05",
    id: "filtro-mental",
    titulo: "Filtro Mental",
    subtitulo: "Mental Filter",
    personagem: "linn",
    oQueE:
      "Focar exclusivamente em um detalhe negativo de uma situação e ignorar todo o resto, como uma gota de tinta escurecendo todo o copo d'água.",
    descricao:
      "Linn é contemplativo e prefere o silêncio. Num dia repleto de diversão, amizade e momentos legais, a lente dele pode focar absurdamente apenas naquele único instante em que alguém gritou alto demais.",
    frase: "O dia no canal foi incrível, mas vocês lembram daquele grito estridente que o Torajo deu às 14h? Aquilo destruiu totalmente a minha paz interior.",
    vidaBox: "Mude a lente. Quando perceber que sua mente grudou em um defeito, force-se a listar ativamente 3 aspectos positivos da mesma situação.",
  },
  {
    numero: "06",
    id: "leitura-mental",
    titulo: "Leitura Mental",
    subtitulo: "Mind Reading",
    personagem: "pessy",
    oQueE:
      "Assumir que você sabe o que os outros estão pensando, geralmente presumindo intenções hostis, de julgamento ou segredos, sem evidências reais.",
    descricao:
      "A 'louca do rolê' e detetive do grupo, Pessy ama mistérios e teorias da conspiração. Ela frequentemente interpreta demais os olhares e atitudes normais dos outros como sinais ocultos.",
    frase: "A Zulmi piscou duas vezes devagar enquanto sorria para mim... Eu JÁ SEI, ela está me julgando secretamente ou me escondendo um grande enigma cósmico!",
    vidaBox: "Faça o teste de realidade. Se acha que alguém está te julgando, confronte: 'Quais evidências REAIS eu tenho de que ele pensa isso?'. Você não lê mentes.",
  },
  {
    numero: "07",
    id: "raciocinio-emocional",
    titulo: "Raciocínio Emocional",
    subtitulo: "Emotional Reasoning",
    personagem: "zulmi",
    oQueE: "Assumir que suas emoções negativas refletem a verdadeira natureza das coisas. 'Eu sinto raiva, logo eu fui injustiçado.'",
    descricao:
      "Quando a ansiedade de querer agradar a todos foge do controle, Zulmi passa a acreditar que os sentimentos aflitos dela são a realidade. Se ela sente que o ambiente está pesado, ela conclui que algo terrível de fato aconteceu.",
    frase: "Eu estou com uma sensação tão ruim no peito... isso com certeza significa que todos estão secretamente bravos comigo e o clima está péssimo!",
    vidaBox: "Separe sentimento de fato. Uma emoção é temporária, não uma bússola da verdade absoluta. Sentir medo não significa que o perigo é real.",
  },
  {
    numero: "08",
    id: "afirmacoes-deveria",
    titulo: "Afirmações do tipo 'Deveria'",
    subtitulo: "Should Statements",
    personagem: "morajo",
    oQueE: "Ter regras internas rígidas de ferro sobre como você, os outros ou o mundo DEVEM se comportar. Gera culpa ou raiva desproporcional.",
    descricao:
      "A mente do Morajo é uma fábrica de regras lógicas. Ele sofre e se irrita profundamente porque acredita que todos 'deveriam' seguir a racionalidade dele.",
    frase: "O Torajo NÃO DEVERIA agir de forma tão caótica! Vídeos de YouTube DEVEM seguir um método rigoroso, é uma obrigação absoluta!",
    vidaBox: "Troque as palavras 'tenho que' e 'devo' por 'eu gostaria de' ou 'seria preferível'. Isso reduz a pressão esmagadora interna.",
  },
  {
    numero: "09",
    id: "supergeneralizacao",
    titulo: "Supergeneralização",
    subtitulo: "Overgeneralization",
    personagem: "azedo",
    oQueE: "Extrair uma regra universal negativa a partir de um único evento. Se algo ruim acontece uma vez, você cria a 'lei' de que sempre acontecerá.",
    descricao:
      "Se uma única brincadeira do Azedo dá errado ou alguém tira sarro dele num vídeo, ele não vê isso como um caso isolado. Ele transforma isso numa lei imutável sobre os outros.",
    frase: "Vocês riram de mim no desafio de hoje! É sempre assim, vocês são TODOS um bando de idiotas que NUNCA fazem nada que presta!",
    vidaBox: "Procure exceções. Desafie a regra absoluta. Pergunte: 'Existem situações ou pessoas que contrariam essa minha conclusão radical?'.",
  },
  {
    numero: "10",
    id: "rotulacao",
    titulo: "Rotulação",
    subtitulo: "Labeling",
    personagem: "margo",
    oQueE: "Em vez de descrever um comportamento ('eu errei'), você cola um rótulo fixo ('eu sou um fracasso'). O rótulo congela a complexidade da pessoa.",
    descricao:
      "A Margo hackeia o canal e vê o mundo como códigos e falhas de sistema. Para ela, é mais fácil aplicar rótulos simplistas a quem a atrapalha, reduzindo as pessoas a meros 'erros'.",
    frase: "O Torajo não é uma pessoa com sentimentos, ele é só um 'bug' inútil no sistema. A existência de vocês é um erro no meu código.",
    vidaBox: "Foque na ação, não no ser. Em vez de 'ele é um idiota', diga 'ele tomou uma atitude que não gostei'. Humanos são complexos e mudam.",
  },
  {
    numero: "11",
    id: "culpabilizacao",
    titulo: "Culpabilização",
    subtitulo: "Blaming",
    personagem: "azedo",
    oQueE: "Focar completamente em outras pessoas como a fonte de todos os seus problemas, recusando-se a assumir a responsabilidade pelas próprias escolhas.",
    descricao:
      "Quando o Azedo planeja uma armadilha ou pegadinha que acaba gerando o maior prejuízo, ele jamais assume a responsabilidade. Ele terceiriza a culpa para sair ileso.",
    frase: "A culpa de eu ter bagunçado todo o estúdio não foi minha! Se o Torajo e o Morajo não fossem tão chatos, eu nunca precisaria ter feito isso!",
    vidaBox: "Recupere o controle. Enquanto colocar 100% da culpa no outro, você fica impotente. Pergunte-se: 'O que ESTÁ sob meu controle para mudar a situação agora?'",
  },
  {
    numero: "12",
    id: "adivinhacao",
    titulo: "Adivinhação",
    subtitulo: "Fortune Telling",
    personagem: "pessy",
    oQueE: "Antecipar constantemente que as coisas vão dar errado, prevendo problemas futuros como se fossem certezas inescapáveis.",
    descricao:
      "Mergulhada nas suas teorias malucas, Pessy não precisa nem que as coisas comecem para já determinar que o resultado será catastrófico, graças às 'pistas do universo'.",
    frase: "Eu já li as mensagens subliminares na parede do cenário. Eu já SEI que o roteiro desse vídeo vai ser um desastre completo antes mesmo de começarmos!",
    vidaBox: "Trate pensamentos como hipóteses, não verdades. 'Isso é apenas um pensamento sobre o futuro, eu não tenho bola de cristal.' Foque no presente.",
  },
];
