// Território "Modos do Esquema" — Mundo Torajo (revamp do módulo antigo de
// quiz+simulador). Conteúdo adaptado 1:1 do material original
// (G:\Meu Drive\Torajo\modos.html), baseado na Terapia do Esquema de Jeffrey
// Young. Dados puros — sem lógica de UI.
// Não confundir com src/content/psicoed/modos.ts (quiz/flashcards/simulador
// clínico usado antes) — este arquivo substitui o conteúdo da página, aquele
// pode ficar órfão ou ser removido depois se nada mais o usar.
// Ver docs/mundo-torajo-playbook.md.

import type { PersonagemId } from "@/content/psicoed/personagens";

export interface ModoTorajo {
  numero: string;
  id: string;
  titulo: string;
  subtitulo: string;
  personagem: PersonagemId;
  /** Rótulo do badge de personagem, quando difere do nome padrão (ex: "Toda a Turma", "Você!"). */
  personagemLabel?: string;
  oQueE: string;
  descricao: string;
  frase: string;
  vidaBox: string;
}

export const modosTorajo: ModoTorajo[] = [
  {
    numero: "01",
    id: "crianca-vulneravel",
    titulo: "A Criança Vulnerável",
    subtitulo: "Vulnerable Child Mode",
    personagem: "zulmi",
    oQueE:
      "É a parte mais frágil de nós. Quando esse modo assume o controle, nos sentimos assustados, sozinhos, rejeitados, tristes e desamparados, como uma criança perdida.",
    descricao:
      "Quando o clima pesa e as coisas dão errado no estúdio, Zulmi entra num estado de pura aflição e tristeza, sentindo-se pequena e incapaz de resolver o problema sozinha. Ela só quer colo e que tudo fique bem.",
    frase: "Por que isso está acontecendo? Eu não sei o que fazer, estou com muito medo de todo mundo ficar com raiva de mim e me abandonar.",
    vidaBox:
      "Não critique a sua Criança Vulnerável. Quando sentir vontade de chorar e se isolar, abrace esse sentimento com carinho. Você precisa se dar o conforto que busca nos outros.",
  },
  {
    numero: "02",
    id: "crianca-zangada",
    titulo: "A Criança Zangada",
    subtitulo: "Angry Child Mode",
    personagem: "azedo",
    oQueE:
      "É quando você explode porque suas necessidades emocionais não foram atendidas. É um estado de fúria, rebeldia e \"birra\". A emoção domina a razão completamente.",
    descricao:
      "Quando o Azedo se sente desrespeitado, provocado ou ignorado, ele não chora; ele vira a mesa. Ele grita, sabota os vídeos, quebra coisas e faz birra para chamar a atenção para a dor dele.",
    frase: "Eu odeio vocês! Vocês nunca me escutam ou me valorizam, então eu vou destruir todo esse roteiro para vocês verem como é bom!",
    vidaBox:
      "A raiva é só o \"segurança\" da tristeza. Por trás de toda Criança Zangada, tem uma Criança Vulnerável machucada. Respire fundo e tente entender o que realmente te magoou.",
  },
  {
    numero: "03",
    id: "crianca-impulsiva",
    titulo: "A Criança Impulsiva",
    subtitulo: "Impulsive Child Mode",
    personagem: "torajo",
    oQueE:
      "O modo que quer tudo agora. Foca apenas no prazer e na diversão imediata, ignorando qualquer regra, responsabilidade ou consequência a longo prazo.",
    descricao:
      "Torajo frequentemente deixa a impulsividade assumir. Ele ignora o cronograma, atrasa a gravação para jogar ou muda os planos na última hora só porque \"pareceu mais divertido\", enlouquecendo o pobre do Morajo.",
    frase: "Roteiro? Matemática? Que tédio inútil! Vamos jogar slime no estúdio inteiro agora porque vai ser muito mais épico e eu quero me divertir!",
    vidaBox:
      "A diversão é ótima, mas a disciplina é necessária. Negocie com sua Criança Impulsiva: \"Primeiro terminamos a obrigação, depois teremos o dobro de diversão sem culpa.\"",
  },
  {
    numero: "04",
    id: "protetor-desligado",
    titulo: "O Protetor Desligado",
    subtitulo: "Detached Protector Mode",
    personagem: "linn",
    oQueE:
      "Uma armadura que você veste para não sentir dor. Quando esse modo liga, você fica anestesiado, robótico, frio, ou foge das pessoas e dos problemas para não lidar com as emoções intensas.",
    descricao:
      "Linn se isola no silêncio. Ele desliga as emoções e cria um \"muro\" imaginário para que o caos, as brigas e o estresse do canal não o alcancem por dentro.",
    frase: "Tanto faz o que vocês estão discutindo. Eu não ligo e não vou me estressar. Vou ficar aqui no meu canto, em silêncio, mexendo no meu computador.",
    vidaBox:
      "Fugir da dor também faz você fugir da alegria. O Protetor Desligado te salva de sofrer na hora da crise, mas te impede de viver de verdade. Permita-se sentir aos poucos.",
  },
  {
    numero: "05",
    id: "rendicao-submissa",
    titulo: "A Rendição Submissa",
    subtitulo: "Compliant Surrenderer Mode",
    personagem: "zulmi",
    oQueE:
      "Você desiste de si mesmo para agradar os outros. Você concorda com tudo, aceita ser deixado de lado ou cala a própria voz só para evitar conflitos e não ser rejeitado.",
    descricao:
      "Para manter a paz no grupo, Zulmi muitas vezes abre mão do que ela realmente quer. Ela engole os próprios sentimentos e cede à vontade dos mais barulhentos.",
    frase: "Tudo bem, a gente faz exatamente do seu jeito... Eu não queria muito isso, mas se vocês pararem de brigar, eu aceito qualquer coisa.",
    vidaBox:
      "A paz que custa a sua voz é muito cara. O seu \"não\" é a sua maior ferramenta de proteção e respeito próprio. Discordar não significa que vão te odiar.",
  },
  {
    numero: "06",
    id: "hipercompensador",
    titulo: "O Hipercompensador",
    subtitulo: "Overcompensator Mode",
    personagem: "azedo",
    oQueE:
      "Você veste a máscara do \"durão\" intocável. Para não parecer fraco ou evitar que te machuquem, você ataca primeiro, tenta dominar a situação, age com arrogância ou humilha os outros.",
    descricao:
      "O Azedo morre de medo de ser a piada ou o fraco da turma. Por isso, ele hipercompensa: age como se fosse o vilão genial e invencível que está no controle de tudo.",
    frase: "Vocês são meros insetos patéticos e eu sou o gênio invencível por trás de tudo isso! Ninguém manda em mim ou me atinge!",
    vidaBox:
      "Atacar os outros não cura a sua própria dor. A vulnerabilidade não é fraqueza. Você não precisa agir como o \"chefão intocável\" para ser respeitado.",
  },
  {
    numero: "07",
    id: "voz-critica-punitiva",
    titulo: "A Voz Crítica Punitiva",
    subtitulo: "Punitive Parent Mode",
    personagem: "margo",
    oQueE:
      "Uma voz na sua cabeça (internalizada do passado ou da cultura) que te xinga, te pune e diz impiedosamente que você não tem valor, que é burro, feio ou completamente inútil.",
    descricao:
      "Assim como a Margo pode julgar friamente que os outros são \"erros\" do sistema, essa voz dentro da nossa cabeça nos ataca sem piedade quando cometemos qualquer deslize.",
    frase: "Você fracassou de novo. Você é inútil, um bug que não consegue fazer nada direito, nunca vai aprender ou consertar seus erros.",
    vidaBox:
      "Expulse essa voz! Imagine que ela é um hacker intruso no sistema da sua mente. Você não falaria com um amigo do jeito que essa voz fala com você. Defenda-se dela.",
  },
  {
    numero: "08",
    id: "voz-critica-exigente",
    titulo: "A Voz Crítica Exigente",
    subtitulo: "Demanding Parent Mode",
    personagem: "morajo",
    oQueE:
      "Diferente da punitiva que te ofende, a exigente coloca uma pressão esmagadora sobre você. Ela diz que você tem que ser o melhor, estar sempre ocupado e não pode errar, sem descanso.",
    descricao:
      "Morajo vive nesse modo. Ele exige de si e de Torajo uma produção impecável. Para ele, não basta estar bom, tem que seguir regras rigorosíssimas de eficiência máxima.",
    frase: "Descansar? Não! Nós temos que gravar 3 vídeos hoje, revisar todos os roteiros matematicamente e ser os número 1 da internet, sem falhas!",
    vidaBox:
      "Diga à sua voz exigente que você é um ser humano, não uma máquina. Descanso não é preguiça, é uma necessidade biológica para continuar bem.",
  },
  {
    numero: "09",
    id: "crianca-feliz",
    titulo: "A Criança Feliz",
    subtitulo: "Happy Child Mode",
    personagem: "torajo",
    personagemLabel: "Toda a Turma",
    oQueE:
      "É o seu estado de brincadeira, curiosidade, relaxamento, criatividade pura e alegria verdadeira. É quando você se sente amado, seguro, conectado e livre para ser você.",
    descricao:
      "Acontece naqueles momentos raros em que toda a turma do Mundo Torajo brinca junta, sem se preocupar com likes, planos malignos ou perfeccionismo. O caos se torna saudável e os risos são reais.",
    frase: "A gente gravou tudo errado, nos sujamos todos de tinta, mas isso foi divertido demais! Vamos esquecer o roteiro hoje e só comer pizza!",
    vidaBox:
      "Dê mais espaço e liberdade para ela! O que te faz rir sem motivo? Alimente e brinque com a sua Criança Feliz toda semana, sem pressões.",
  },
  {
    numero: "10",
    id: "adulto-saudavel",
    titulo: "O Adulto Saudável",
    subtitulo: "Healthy Adult Mode",
    personagem: "torajo",
    personagemLabel: "Você!",
    oQueE:
      "É o líder e diretor da sua mente. Ele abraça a Criança Vulnerável, coloca limites na Impulsiva, cala as Vozes Críticas severas e dispensa a armadura dos Protetores, agindo com sabedoria.",
    descricao:
      "Nenhum personagem sozinho é perfeito. O Torajo tem a criatividade, Morajo a lógica, Zulmi a empatia, Linn a observação, Pessy o cuidado. O Adulto Saudável é a junção equilibrada do melhor de todos eles.",
    frase: "Eu reconheço o meu erro, eu perdoo a mim mesmo, e agora eu escolho consertar essa situação com responsabilidade, compaixão e calma.",
    vidaBox:
      "O objetivo não é nunca mais sentir raiva ou medo, mas fortalecer o seu Adulto Saudável. É ele quem senta na cadeira de diretor da sua mente na crise e diz: \"Calma, eu assumo daqui.\"",
  },
];
