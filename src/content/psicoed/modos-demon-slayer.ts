// Território "Modos do Esquema" — Demon Slayer. Conteúdo adaptado 1:1 do
// material original (G:\Meu Drive\Demons slayer\modos.html). Dados puros.
// Ver docs/mundo-torajo-playbook.md seção 13.

import type { CenaTorajo } from "@/components/psicoed/TerritorioTorajo";

export const modosDemonSlayer: CenaTorajo[] = [
  {
    numero: "01",
    id: "crianca-vulneravel",
    titulo: "Modo: Criança Vulnerável",
    subtitulo: "Vulnerable Child Mode",
    personagem: "muichiro",
    oQueE:
      "É a parte mais frágil de nós. Sente-se triste, sozinha, assustada, indefesa ou abandonada. É a pura dor crua do nosso passado que vem à tona.",
    descricao:
      "Antes de usar a máscara da frieza e perder a memória, Muichiro ativava esse modo dolorosamente enquanto assistia o seu irmão gêmeo morrer em seus braços — apenas um garoto sentindo o mais profundo abandono e desespero.",
    frase: "Por favor, não morra! Não me deixe sozinho! Eu não sei o que fazer! Deus, me ajude!",
    vidaBox:
      "Quando esse modo ativa e você quer apenas sentar e chorar, não se julgue. A criança interna precisa ser abraçada. Dê a si mesmo o colo que você daria a um amigo em sofrimento.",
  },
  {
    numero: "02",
    id: "crianca-zangada",
    titulo: "Modo: Criança Zangada",
    subtitulo: "Angry Child Mode",
    personagem: "daki",
    oQueE:
      "Sente-se injustiçada e reage com muita raiva, birra e irritação. Não tem paciência e grita ou explode quando as coisas não saem como ela esperava.",
    descricao:
      "Quando Tengen Uzui corta sua cabeça facilmente, Daki desmorona. Em vez de agir estrategicamente, ela literalmente faz birra, chorando compulsivamente, xingando e batendo os pés de raiva.",
    frase: "Eu odeio vocês! Vocês são feios e ruins! Gyutaro, acaba com eles, eles me trataram mal! Waaaaah!",
    vidaBox:
      "Sentir raiva quando há injustiça é normal, mas fazer birra e ofender os outros faz você perder a razão. Reconheça a raiva, respire e tente se comunicar sem gritar.",
  },
  {
    numero: "03",
    id: "crianca-impulsiva",
    titulo: "Modo: Criança Impulsiva",
    subtitulo: "Impulsive / Undisciplined Child Mode",
    personagem: "inosuke",
    oQueE:
      "Age por impulso, sem medir consequências. Quer fazer apenas o que dá prazer no momento ou seguir seus instintos crus sem qualquer disciplina.",
    descricao:
      "Inosuke é a definição perfeita da criança impulsiva. Ele quebra portas em vez de abri-las, ataca aliados porque se sente desafiado e rouba a comida do prato dos outros só porque sentiu vontade, sem freio social.",
    frase: "Eu faço o que eu quiser, na hora que eu quiser! Quem se importa com regras? Eu vou esmagar isso agora mesmo!",
    vidaBox:
      "Agir sem pensar pode dar um alívio momentâneo, mas destrói seus objetivos a longo prazo. O autocontrole é o que separa alguém maduro de alguém escravo dos próprios impulsos.",
  },
  {
    numero: "04",
    id: "protetor-desligado",
    titulo: "Modo: Protetor Desligado",
    subtitulo: "Detached Protector Mode",
    personagem: "giyu",
    oQueE:
      "Um mecanismo de defesa. Para não sentir dor, você \"desliga\" suas emoções. Fica frio, distante, vazio, robótico e se isola fisicamente e mentalmente das pessoas.",
    descricao:
      "Para lidar com a morte esmagadora da sua irmã e de seu amigo Sabito, Giyu se distanciou das emoções. Ele entra no modo Protetor Desligado, com rosto sem expressão, evitando interações e parecendo apático.",
    frase: "... (Silêncio total, rosto vazio, virando as costas para o resto do grupo enquanto olha pro horizonte).",
    vidaBox:
      "Desligar a chave das emoções impede você de sentir a tristeza, mas também impede você de sentir a alegria genuína. O muro que te protege de chorar, te prende na solidão.",
  },
  {
    numero: "05",
    id: "protetor-evitativo",
    titulo: "Modo: Protetor Evitativo",
    subtitulo: "Avoidant Protector Mode",
    personagem: "zenitsu",
    oQueE:
      "Outro mecanismo de defesa. Você foge ativamente de situações difíceis para evitar ansiedade. Pode usar procrastinação, sono excessivo ou fugir fisicamente dos problemas.",
    descricao:
      "O cérebro de Zenitsu não consegue lidar com o terror consciente da batalha, então, como defesa máxima, ele entra num estado de evitação extrema: foge gritando e literalmente dorme/desmaia para não encarar a realidade.",
    frase: "Eu não vou! Eu me recuso! É perigoso demais! Zzzzzzzz... (desmaia de medo para escapar da realidade).",
    vidaBox:
      "Dormir para não fazer a tarefa, faltar à aula por medo da apresentação ou ignorar mensagens não resolve o problema. Apenas adia o desastre e aumenta a ansiedade futura.",
  },
  {
    numero: "06",
    id: "supercompensador",
    titulo: "Modo: Supercompensador",
    subtitulo: "Overcompensator Mode",
    personagem: "muzan",
    oQueE:
      "Defesa pelo contra-ataque. Para não se sentir inferior, fraco ou vulnerável, a pessoa tenta parecer grandiosa, superior, controladora ou até cruel com os outros.",
    descricao:
      "Por dentro, Muzan é assombrado pelo medo terrível da doença e da morte (sua Criança Vulnerável). Para compensar, ele usa a máscara de um ser perfeito e supremo, tentando controlar todos ao seu redor.",
    frase: "Não fale comigo. Eu sou uma existência perfeita que se aproxima dos deuses. O medo de vocês é a minha força.",
    vidaBox:
      "Diminuir os outros não te faz maior. Tentar controlar tudo é o sinal mais claro de que, no fundo, você sente que não tem controle sobre nada.",
  },
  {
    numero: "07",
    id: "voz-punitiva",
    titulo: "Modo: Voz Punitiva",
    subtitulo: "Punitive Parent Mode",
    personagem: "sanemi",
    oQueE:
      "Uma voz interna (normalmente interiorizada no passado) que diz coisas cruéis para você. Te xinga, te culpa por tudo de errado e exige punição quando você falha.",
    descricao:
      "Sanemi carrega uma voz punitiva tão forte que isso transborda para o mundo. Por se odiar e se culpar pelo passado da família, ele constantemente ataca o próprio irmão e age de forma autodestrutiva no campo de batalha.",
    frase: "Você é lixo, Genya! Não tem talento nenhum, desista! E eu... eu só sirvo para ser um cão de caça raivoso!",
    vidaBox:
      "Se você dissesse para um amigo as coisas cruéis que você diz para si mesmo diante do espelho, esse amigo não falaria mais com você. Expulse o crítico severo da sua cabeça.",
  },
  {
    numero: "08",
    id: "voz-exigente",
    titulo: "Modo: Voz Exigente",
    subtitulo: "Demanding Parent Mode",
    personagem: "rengoku",
    oQueE:
      "Diferente da punitiva, esta voz não te xinga, ela apenas exige que você atinja padrões absurdamente altos, trabalhe sem parar e foque 100% no dever e na perfeição.",
    descricao:
      "Ativando fortemente a \"Voz Exigente\" de sua mãe, Rengoku vive sua vida para cumprir sua função no mais alto nível possível. O dever de salvar os fracos ecoa em sua mente sem permitir pausas, até o fim.",
    frase: "É meu dever proteger a todos! Não importam as minhas dores ou as minhas limitações físicas. Cumprirei o que esperam de mim perfeitamente!",
    vidaBox:
      "O trabalho duro é essencial, mas você não é uma máquina. Se a sua voz interna nunca deixa você relaxar ou descansar sem sentir culpa, ela está sendo exigente demais.",
  },
  {
    numero: "09",
    id: "crianca-feliz",
    titulo: "Modo: Criança Feliz",
    subtitulo: "Happy Child Mode",
    personagem: "mitsuri",
    oQueE:
      "O estado onde nos sentimos seguros, amados, alegres, brincalhões e tranquilos. Quando necessidades emocionais básicas são atendidas.",
    descricao:
      "Quando Mitsuri está rodeada de amigos que a aceitam, comendo panquecas de mel ou expressando seu amor livremente, ela ativa a sua Criança Feliz. Ela é radiante, espontânea e genuinamente contente consigo mesma.",
    frase: "Isso é tão delicioso! Eu estou tão feliz por estar com todos vocês! O meu coração está super acelerado de alegria! Kyaa!",
    vidaBox:
      "Aprender a acessar esse modo é tão importante quanto trabalhar. Permita-se ter hobbies, dar risadas sem motivo e aproveitar momentos simples apenas pelo prazer de existir.",
  },
  {
    numero: "10",
    id: "adulto-saudavel",
    titulo: "Modo: Adulto Saudável",
    subtitulo: "Healthy Adult Mode",
    personagem: "tanjiro",
    oQueE:
      "A versão equilibrada de você. Cuida da criança vulnerável, cala as vozes punitivas, administra os defensores e toma decisões sábias, lógicas e compassivas baseadas na realidade, não em traumas passados.",
    descricao:
      "O coração de Tanjiro é a manifestação máxima do Adulto Saudável. Ele luta de forma focada para proteger os outros (sem exagerar na fúria cega) e é maduro o suficiente para sentir compaixão até pelos demônios que derrota.",
    frase: "Eu cortarei a sua cabeça porque as suas atitudes machucaram as pessoas. Mas eu rogo aos céus para que, na sua próxima vida, você não seja mais um demônio mergulhado em tristeza.",
    vidaBox:
      "O objetivo da psicoterapia é exatamente fortalecer o \"Adulto Saudável\" dentro de você. É a voz serena, compassiva e racional que te pega pela mão quando as tempestades emocionais vêm.",
  },
];
