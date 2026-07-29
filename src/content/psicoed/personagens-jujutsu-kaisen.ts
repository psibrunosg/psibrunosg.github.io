// Elenco Jujutsu Kaisen — território scrollytelling paralelo ao Mundo Torajo,
// mas usando personagens de terceiros (Gege Akutami / Shueisha / MAPPA).
// Ver docs/mundo-torajo-playbook.md seção 13 (aviso de direitos autorais).

import type { Personagem } from "@/content/psicoed/personagens";

export type PersonagemIdJujutsuKaisen =
  | "geto"
  | "gojo"
  | "itadori"
  | "mahito"
  | "maki"
  | "megumi"
  | "nanami"
  | "nobara"
  | "sukuna"
  | "todo"
  | "toji"
  | "yuta";

export const personagensJujutsuKaisen: Record<PersonagemIdJujutsuKaisen, Personagem> = {
  geto: { id: "geto", nome: "Suguru Geto", cor: "#616161", imagem: "/img/jujutsu-kaisen/geto.png" },
  gojo: { id: "gojo", nome: "Satoru Gojo", cor: "#29B6F6", imagem: "/img/jujutsu-kaisen/gojo.png" },
  itadori: { id: "itadori", nome: "Yuji Itadori", cor: "#F06292", imagem: "/img/jujutsu-kaisen/itadori.png" },
  mahito: { id: "mahito", nome: "Mahito", cor: "#EC407A", imagem: "/img/jujutsu-kaisen/mahito.png" },
  maki: { id: "maki", nome: "Maki Zenin", cor: "#6C3483", imagem: "/img/jujutsu-kaisen/maki.png" },
  megumi: { id: "megumi", nome: "Megumi Fushiguro", cor: "#455A64", imagem: "/img/jujutsu-kaisen/megumi.png" },
  nanami: { id: "nanami", nome: "Kento Nanami", cor: "#A1887F", imagem: "/img/jujutsu-kaisen/nanami.png" },
  nobara: { id: "nobara", nome: "Nobara Kugisaki", cor: "#E67E22", imagem: "/img/jujutsu-kaisen/nobara.png" },
  sukuna: { id: "sukuna", nome: "Ryomen Sukuna", cor: "#C62828", imagem: "/img/jujutsu-kaisen/sukuna.png" },
  todo: { id: "todo", nome: "Aoi Todo", cor: "#9C4FBF", imagem: "/img/jujutsu-kaisen/todo.png" },
  toji: { id: "toji", nome: "Toji Fushiguro", cor: "#2E3B41", imagem: "/img/jujutsu-kaisen/toji.png" },
  yuta: { id: "yuta", nome: "Yuta Okkotsu", cor: "#7E57C2", imagem: "/img/jujutsu-kaisen/yuta.png" },
};
