// Território "Esquemas Iniciais Desadaptativos" — Jujutsu Kaisen. Conteúdo
// adaptado 1:1 do material original (G:\Meu Drive\Jujutsu Kaisen\esquemas.html)
// — 6 esquemas (a fonte não cobre os 12 clássicos, diferente de Demon
// Slayer/Torajo). Dados puros. Ver docs/mundo-torajo-playbook.md seção 13.

import type { CenaTorajo } from "@/components/psicoed/TerritorioTorajo";

export const esquemasJujutsuKaisen: CenaTorajo[] = [
  {
    numero: "01",
    id: "abandono-instabilidade",
    titulo: "Abandono / Instabilidade",
    subtitulo: "Abandonment / Instability",
    personagem: "yuta",
    oQueE:
      "A sensação constante e desesperadora de que as pessoas que você ama inevitavelmente vão te deixar ou morrer, deixando-o completamente sozinho.",
    descricao:
      "Yuta sofreu a tragédia suprema na infância quando o amor da sua vida, Rika, morreu tragicamente num acidente. O medo do abandono era tão absurdo que a alma de Yuta inconscientemente \"amaldiçoou\" Rika para que ela não pudesse ir embora.",
    frase: "Não me deixe! Nós prometemos que nos casaríamos quando crescêssemos! Não vá embora!",
    vidaBox:
      "Prender alguém pelo medo de ficar sozinho sufoca a relação e destrói vocês dois. Amar de verdade exige soltar as cordas e confiar que os laços, mesmo livres, não vão se desfazer tão fácil.",
  },
  {
    numero: "02",
    id: "desconfianca-abuso",
    titulo: "Desconfiança / Abuso",
    subtitulo: "Mistrust / Abuse",
    personagem: "toji",
    oQueE:
      "A expectativa cruel de que as outras pessoas, intencionalmente, vão te machucar, humilhar ou usar em benefício próprio. A total incapacidade de baixar a guarda.",
    descricao:
      "Nascido sem energia amaldiçoada num clã obcecado por poder, Toji foi tratado como o lixo absoluto da família Zenin. O abuso ensinou a Toji que o mundo não tem calor, ninguém é confiável, e as únicas coisas reais são a violência e o dinheiro.",
    frase: "Feiticeiros, clãs, sentimentos... tudo não passa de lixo para ser destruído. Eu não confio em nada além da força dos meus punhos.",
    vidaBox: "A armadura que te protege hoje de ser abusado de novo é a mesma que te impede de receber os abraços que poderiam te curar.",
  },
  {
    numero: "03",
    id: "privacao-emocional",
    titulo: "Privação Emocional",
    subtitulo: "Emotional Deprivation",
    personagem: "gojo",
    oQueE:
      "A crença profunda de que ninguém ao seu redor vai conseguir te entender, te proteger ou te dar amor e atenção genuína. É uma solidão gélida mesmo cercado de pessoas.",
    descricao:
      "Gojo é aclamado como \"o Mais Forte\" e amado por todos, mas a que preço? O abismo de poder entre ele e o resto do mundo gerou o isolamento supremo: ninguém pode realmente entender a carga emocional que ele vive, principalmente após perder o Geto.",
    frase: "Sim, eu sou o mais forte. Eu posso salvar todos, mas... no fim do dia, a visão do topo é uma visão muito fria e solitária.",
    vidaBox: "Ninguém pode ler sua mente nem sentir 100% o que você sente. Mas expressar e dizer o que você precisa permite que os outros, do jeito deles, tentem preencher o seu vazio.",
  },
  {
    numero: "04",
    id: "sacrificio-subjugacao",
    titulo: "Sacrifício (Subjugação de Si)",
    subtitulo: "Self-Sacrifice / Subjugation",
    personagem: "megumi",
    oQueE:
      "A crença de que as suas necessidades e a sua própria vida importam menos que a dos outros. Você se sacrifica constantemente para evitar conflitos, abandono ou por um senso extremo de dever e empatia exagerada.",
    descricao:
      "A primeira resposta de Megumi para qualquer perigo sério nunca é fugir; é sacrificar a própria vida para salvar Itadori ou os inocentes, usando sua técnica suicida do Mahoraga. Ele não se vê como digno de sobreviver no lugar dos outros.",
    frase: "Eu não sou um herói justo... eu sou apenas um feiticeiro. E se eu tiver que me entregar à morte invocando o Mahoraga para te salvar, é o que farei.",
    vidaBox: "Ser empático é lindo, mas a empatia sem limites é autodestrutiva. Você não precisa se anular ou se ferir para provar que tem valor para os outros.",
  },
  {
    numero: "05",
    id: "arrogo-grandiosidade",
    titulo: "Arrogo / Grandiosidade",
    subtitulo: "Entitlement / Grandiosity",
    personagem: "sukuna",
    oQueE:
      "A crença absoluta de que você é fundamentalmente superior a qualquer outro ser humano e que, por isso, você não precisa se curvar às regras ou empatia normais.",
    descricao:
      "A essência total de Sukuna. Ele vive baseado exclusivamente no seu próprio prazer supremo, comendo ou chacinando de acordo com seu humor. Ele não entende empatia, não sente culpa e se coloca genuinamente como o centro de todo o universo.",
    frase: "Vocês não são feiticeiros nem heróis. Vocês são um prato de comida e brinquedos. Ajoelhem-se, pois não permiti que falassem.",
    vidaBox: "Um complexo de superioridade quase sempre esconde um medo gigante de vulnerabilidade. Aprender a tratar todos, do lixeiro ao rei, com respeito igualitário, é o que define grandeza real.",
  },
  {
    numero: "06",
    id: "padroes-inflexiveis",
    titulo: "Padrões Inflexíveis",
    subtitulo: "Unrelenting Standards / Hypercriticalness",
    personagem: "maki",
    oQueE:
      "A obsessão irredutível por atingir um nível imenso de perfeição e objetivo. O fracasso, a humilhação ou o \"descanso\" não são aceitáveis para você em momento algum.",
    descricao:
      "Maki impôs a si mesma um fardo indescritível: determinou que precisava se tornar absurdamente forte, lutar melhor do que qualquer ser no mundo Jujutsu, apenas para jogar seu sucesso na cara da família que a renegou.",
    frase: "Eu deixei minha casa. E eu não volto até me tornar a chefe do clã Zenin. Se eu fraquejar, meu corpo sem técnica amaldiçoada não será nada.",
    vidaBox: "Focar a sua vida inteira em \"provar pros outros que eles estavam errados sobre mim\" é a maior prisão do mundo. Liberte-se: mude os padrões e faça as coisas apenas por você.",
  },
];
