// Território "Modos do Esquema" — Jujutsu Kaisen. Conteúdo adaptado do
// material original (G:\Meu Drive\Jujutsu Kaisen\modos.html), que era o mais
// incompleto dos 4 arquivos: sem "O que é" e sem frase/vida-box na maioria dos
// itens, e 2 cartões combinando 2 personagens cada ("07 & 08", "09 & 10").
// Completei com a definição clínica padrão de cada modo (mesmo texto usado em
// modos-demon-slayer.ts — é o mesmo framework de Jeffrey Young, não muda por
// universo) e separei os cartões combinados em 1 item por personagem, pra
// fechar os 10 modos no mesmo padrão das outras 3 páginas.
// Ver docs/mundo-torajo-playbook.md seção 13.

import type { CenaTorajo } from "@/components/psicoed/TerritorioTorajo";

export const modosJujutsuKaisen: CenaTorajo[] = [
  {
    numero: "01",
    id: "crianca-vulneravel",
    titulo: "Modo Criança Vulnerável",
    subtitulo: "Vulnerable Child Mode",
    personagem: "yuta",
    oQueE:
      "É a parte mais frágil de nós. Sente-se triste, sozinha, assustada, indefesa ou abandonada. É a pura dor crua do nosso passado que vem à tona.",
    descricao:
      "Yuta estava tão sobrecarregado pela dor, pela solidão e pelo medo de Rika ferir as pessoas que se encolheu e chorou, sentindo-se a vítima mais fraca do mundo, incapaz de lutar, apenas pedindo por socorro e aceitando a morte.",
    frase: "Eu não posso lutar. Só quero que alguém me tire daqui e me diga que vai ficar tudo bem.",
    vidaBox: "A Criança Vulnerável é a nossa dor pura e frágil. É o seu lado que só quer um abraço seguro.",
  },
  {
    numero: "02",
    id: "crianca-zangada",
    titulo: "Modo Criança Zangada",
    subtitulo: "Angry Child Mode",
    personagem: "maki",
    oQueE:
      "É quando você explode porque suas necessidades emocionais não foram atendidas. É um estado de fúria, rebeldia e \"birra\". A emoção domina a razão completamente.",
    descricao:
      "Maki não abaixou a cabeça para o sofrimento; ela canalizou tudo em uma raiva ardente e destrutiva contra o sistema injusto do Clã Zenin, lutando com fúria cega para quebrar as regras que a machucaram.",
    frase: "Vocês vão pagar por cada humilhação. Eu vou quebrar esse clã nojento com as próprias mãos.",
    vidaBox: "A Criança Zangada bate o pé quando se sente injustiçada. A raiva é legítima, mas a forma de expressá-la muitas vezes nos fere ainda mais.",
  },
  {
    numero: "03",
    id: "crianca-impulsiva",
    titulo: "Modo Criança Impulsiva",
    subtitulo: "Impulsive / Undisciplined Child Mode",
    personagem: "mahito",
    oQueE:
      "O modo que quer tudo agora. Foca apenas no prazer e na diversão imediata, ignorando qualquer regra, responsabilidade ou consequência a longo prazo.",
    descricao:
      "Sem controle, sem moral e buscando apenas o prazer instantâneo e sádico da destruição. Ele age pelo calor do momento e pelo puro instinto impulsivo.",
    frase: "Eu simplesmente sinto vontade, e faço. Consequência é um conceito chato demais pra mim.",
    vidaBox: "Agir só pelo impulso do momento traz alívio rápido e destruição maior depois. Pausar antes de agir é o que separa reação de escolha.",
  },
  {
    numero: "04",
    id: "protetor-desligado",
    titulo: "Protetor Desligado (Evitativo)",
    subtitulo: "Detached Protector Mode",
    personagem: "toji",
    oQueE:
      "Uma armadura que você veste para não sentir dor. Quando esse modo liga, você fica anestesiado, robótico, frio, ou foge das pessoas e dos problemas para não lidar com as emoções intensas.",
    descricao:
      "Para não sofrer mais, Toji \"desligou\" todas as emoções. Afastou-se da própria família, enterrou seus sentimentos em apostas e viveu uma vida fria e mecânica. Essa foi a sua armadura máxima contra a dor.",
    frase: "Sentimento é coisa que atrapalha o trabalho. Eu não sinto falta de nada, porque eu não deixo nada entrar.",
    vidaBox: "Desligar as emoções protege da dor, mas também bloqueia a alegria e o vínculo. A armadura que afasta o sofrimento também afasta quem quer te ajudar.",
  },
  {
    numero: "05",
    id: "protetor-apaziguador",
    titulo: "Protetor Apaziguador",
    subtitulo: "Compliant Surrenderer Mode",
    personagem: "megumi",
    oQueE:
      "Você desiste de si mesmo para agradar ou proteger os outros. Cede, se anula e sacrifica a própria vontade — ou até a própria segurança — só pra evitar conflito ou decepcionar alguém.",
    descricao:
      "Cede aos pedidos, suprime sua própria ambição e sacrifica sua força para ser o herói \"bom\" nos bastidores, apenas para não incomodar ou para proteger aqueles que julga importantes.",
    frase: "Não importa o que eu quero. Se for pra salvar vocês, eu abro mão de tudo, inclusive de mim.",
    vidaBox: "Cuidar dos outros até se apagar não é generosidade, é autossacrifício sem limite. Seu bem-estar também importa na conta.",
  },
  {
    numero: "06",
    id: "supercompensador",
    titulo: "Supercompensador (Lutador)",
    subtitulo: "Overcompensator Mode",
    personagem: "sukuna",
    oQueE:
      "Defesa pelo contra-ataque. Para não se sentir inferior, fraco ou vulnerável, você tenta parecer grandioso, superior, controlador ou até cruel com os outros.",
    descricao:
      "Ele ataca de volta o mundo. Para não ser controlado, ele controla. Para não se sentir inferior, ele age como um Deus arrogante e esmaga tudo ao seu redor.",
    frase: "Ajoelhem-se. Eu não peço respeito, eu tomo. Ninguém vai me diminuir de novo.",
    vidaBox:
      "Esmagar os outros pra nunca mais se sentir pequeno é uma armadura, não uma cura. Por trás da grandiosidade forçada, quase sempre existe um medo antigo de ser insuficiente.",
  },
  {
    numero: "07",
    id: "voz-critica-punitiva",
    titulo: "O Crítico Punitivo",
    subtitulo: "Punitive Parent Mode",
    personagem: "geto",
    oQueE:
      "Uma voz interna (normalmente interiorizada no passado) que diz coisas cruéis para você. Te xinga, te culpa por tudo de errado e exige punição quando você falha.",
    descricao:
      "Geto julgava e punia a humanidade com nojo absoluto — uma voz interna severa que não perdoa fraqueza nem imperfeição, nos outros ou em si mesmo.",
    frase: "Vocês não merecem nem existir do jeito que são. Eu deveria ter visto isso muito antes.",
    vidaBox: "Uma voz que só condena, nunca ensina, não é justiça — é crueldade disfarçada de princípio. Questione essa voz antes de obedecer a ela.",
  },
  {
    numero: "08",
    id: "voz-critica-exigente",
    titulo: "O Crítico Exigente",
    subtitulo: "Demanding Parent Mode",
    personagem: "nanami",
    oQueE:
      "Diferente da punitiva, esta voz não te xinga, ela apenas exige que você atinja padrões absurdamente altos, trabalhe sem parar e foque 100% no dever e na perfeição.",
    descricao:
      "Nanami impunha a si mesmo regras rígidas de como um feiticeiro adulto deve agir, sem espaço para falhas — sempre pontual, sempre controlado, sempre cumprindo o horário de trabalho até o fim.",
    frase: "Hora extra não é desculpa pra erro. Um adulto cumpre o que prometeu, dói ou não dói.",
    vidaBox: "Cobrar excelência de si é diferente de nunca se permitir descansar. Regras rígidas sem exceção viram prisão, não disciplina.",
  },
  {
    numero: "09",
    id: "adulto-saudavel",
    titulo: "Adulto Saudável",
    subtitulo: "Healthy Adult Mode",
    personagem: "gojo",
    personagemLabel: "Satoru Gojo (Mentor)",
    oQueE:
      "A versão equilibrada de você. Cuida da criança vulnerável, cala as vozes punitivas, administra os defensores e toma decisões sábias, lógicas e compassivas baseadas na realidade, não em traumas passados.",
    descricao:
      "Gojo atua como o Adulto Saudável que abraça os defeitos dos alunos e foca no potencial humano, mesmo carregando seu próprio peso e isolamento.",
    frase: "Vocês não precisam ser perfeitos pra merecer minha proteção. Errem, aprendam, cresçam — eu seguro a barra.",
    vidaBox: "O Adulto Saudável não elimina o medo ou a raiva — ele decide o que fazer apesar deles, com cuidado por si e pelos outros.",
  },
  {
    numero: "10",
    id: "crianca-feliz",
    titulo: "Criança Feliz",
    subtitulo: "Happy Child Mode",
    personagem: "itadori",
    oQueE:
      "O estado onde nos sentimos seguros, amados, alegres, brincalhões e tranquilos. Quando as necessidades emocionais básicas são atendidas.",
    descricao:
      "A Criança Feliz é o sorriso genuíno de Itadori e Nobara rindo juntos em Tóquio antes da tragédia bater — sem peso, sem culpa, só o prazer simples de estar vivo com os amigos.",
    frase: "Vamos comer alguma coisa boa depois disso! Hoje foi um dia gostoso, mesmo com toda a loucura.",
    vidaBox: "Dê espaço pra essa parte de você também. Rir à toa, comer algo bom, brincar sem culpa — isso não é perda de tempo, é manutenção da alma.",
  },
];
