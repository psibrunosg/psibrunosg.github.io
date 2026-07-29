// Config dos "mundos temáticos" (Torajo, Demon Slayer, Jujutsu Kaisen) — a
// aba separada do mapa principal de Psicoeducação. Fluxo: mapa geral →
// /psicoeducacao/mundos (escolhe o mundo) → /psicoeducacao/mundos/:mundoId
// (escolhe o tema) → página do território (scrollytelling). Dado puro, sem
// lógica de UI. Ver docs/mundo-torajo-playbook.md.

export interface TemaMundo {
  id: string;
  titulo: string;
  rota: string;
  icone: "gem" | "scale" | "eye" | "layers";
}

export interface Mundo {
  id: string;
  titulo: string;
  descricaoCurta: string;
  cor: string;
  imagemCapa: string;
  temas: TemaMundo[];
  linkExtra?: { titulo: string; rota: string };
}

export const mundos: Mundo[] = [
  {
    id: "torajo",
    titulo: "Mundo Torajo",
    descricaoCurta: "A turma original — Torajo, Morajo, Zulmi, Linn, Pessy, Azedo e Margo.",
    cor: "#4CAF50",
    imagemCapa: "/img/torajo/torajo.png",
    temas: [
      { id: "crencas", titulo: "Crenças Centrais", rota: "/psicoeducacao/crencas", icone: "gem" },
      { id: "distorcoes", titulo: "Distorções Cognitivas", rota: "/psicoeducacao/distorcoes", icone: "scale" },
      { id: "esquemas", titulo: "Esquemas Iniciais Desadaptativos", rota: "/psicoeducacao/esquemas", icone: "eye" },
      { id: "modos", titulo: "Modos do Esquema", rota: "/psicoeducacao/modos-do-esquema", icone: "layers" },
    ],
    linkExtra: { titulo: "Conheça a turma do Mundo Torajo", rota: "/psicoeducacao/personagens" },
  },
  {
    id: "demon-slayer",
    titulo: "Demon Slayer",
    descricaoCurta: "Tanjiro, Zenitsu, Inosuke, Rengoku e o resto dos caçadores de demônios.",
    cor: "#43A047",
    imagemCapa: "/img/demon-slayer/tanjiro.png",
    temas: [
      { id: "crencas", titulo: "Crenças Centrais", rota: "/psicoeducacao/demon-slayer/crencas", icone: "gem" },
      { id: "distorcoes", titulo: "Distorções Cognitivas", rota: "/psicoeducacao/demon-slayer/distorcoes", icone: "scale" },
      { id: "esquemas", titulo: "Esquemas Iniciais Desadaptativos", rota: "/psicoeducacao/demon-slayer/esquemas", icone: "eye" },
      { id: "modos", titulo: "Modos do Esquema", rota: "/psicoeducacao/demon-slayer/modos", icone: "layers" },
    ],
  },
  {
    id: "jujutsu-kaisen",
    titulo: "Jujutsu Kaisen",
    descricaoCurta: "Gojo, Itadori, Megumi, Nobara e o resto dos feiticeiros amaldiçoados.",
    cor: "#29B6F6",
    imagemCapa: "/img/jujutsu-kaisen/gojo.png",
    temas: [
      { id: "crencas", titulo: "Crenças Centrais", rota: "/psicoeducacao/jujutsu-kaisen/crencas", icone: "gem" },
      { id: "distorcoes", titulo: "Distorções Cognitivas", rota: "/psicoeducacao/jujutsu-kaisen/distorcoes", icone: "scale" },
      { id: "esquemas", titulo: "Esquemas Iniciais Desadaptativos", rota: "/psicoeducacao/jujutsu-kaisen/esquemas", icone: "eye" },
      { id: "modos", titulo: "Modos do Esquema", rota: "/psicoeducacao/jujutsu-kaisen/modos", icone: "layers" },
    ],
  },
];

export const mundoPorId = (id: string) => mundos.find((m) => m.id === id);
