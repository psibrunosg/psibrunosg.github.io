// Personagens do Mundo Torajo — compartilhado por todos os territórios (esquemas,
// crenças, distorções, modos). Dado puro, sem lógica de UI.
// Ver docs/mundo-torajo-playbook.md.

export type PersonagemId = "torajo" | "morajo" | "zulmi" | "linn" | "pessy" | "azedo" | "margo";

export interface Personagem {
  id: string;
  nome: string;
  cor: string;
  imagem: string;
}

export const personagens: Record<PersonagemId, Personagem> = {
  torajo: { id: "torajo", nome: "Torajo", cor: "#4CAF50", imagem: "/img/torajo/torajo.png" },
  morajo: { id: "morajo", nome: "Morajo", cor: "#8B5FBF", imagem: "/img/torajo/morajo.png" },
  zulmi: { id: "zulmi", nome: "Zulmi", cor: "#4C5FD6", imagem: "/img/torajo/zulmi.png" },
  linn: { id: "linn", nome: "Linn", cor: "#D6BB2E", imagem: "/img/torajo/linn.png" },
  pessy: { id: "pessy", nome: "Pessy", cor: "#E8833A", imagem: "/img/torajo/pessy.png" },
  azedo: { id: "azedo", nome: "Azedo", cor: "#E4483F", imagem: "/img/torajo/azedo.png" },
  margo: { id: "margo", nome: "Margo", cor: "#F0578F", imagem: "/img/torajo/margo.png" },
};
