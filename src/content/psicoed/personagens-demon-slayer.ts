// Elenco Demon Slayer — território scrollytelling paralelo ao Mundo Torajo,
// mas usando personagens de terceiros (Koyoharu Gotouge / Shueisha / Aniplex).
// Ver docs/mundo-torajo-playbook.md seção 13 (aviso de direitos autorais).

import type { Personagem } from "@/content/psicoed/personagens";

export type PersonagemIdDemonSlayer =
  | "tanjiro"
  | "zenitsu"
  | "inosuke"
  | "giyu"
  | "shinobu"
  | "mitsuri"
  | "muichiro"
  | "sanemi"
  | "obanai"
  | "rengoku"
  | "muzan"
  | "daki";

export const personagensDemonSlayer: Record<PersonagemIdDemonSlayer, Personagem> = {
  tanjiro: { id: "tanjiro", nome: "Tanjiro Kamado", cor: "#43A047", imagem: "/img/demon-slayer/tanjiro.png" },
  zenitsu: { id: "zenitsu", nome: "Zenitsu Agatsuma", cor: "#FBC02D", imagem: "/img/demon-slayer/zenitsu.png" },
  inosuke: { id: "inosuke", nome: "Inosuke Hashibira", cor: "#5C6BC0", imagem: "/img/demon-slayer/inosuke.png" },
  giyu: { id: "giyu", nome: "Giyu Tomioka", cor: "#26838F", imagem: "/img/demon-slayer/giyu.png" },
  shinobu: { id: "shinobu", nome: "Shinobu Kocho", cor: "#8E5FBF", imagem: "/img/demon-slayer/shinobu.png" },
  mitsuri: { id: "mitsuri", nome: "Mitsuri Kanroji", cor: "#EC5C9D", imagem: "/img/demon-slayer/mitsuri.png" },
  muichiro: { id: "muichiro", nome: "Muichiro Tokito", cor: "#66BFAE", imagem: "/img/demon-slayer/muichiro.png" },
  sanemi: { id: "sanemi", nome: "Sanemi Shinazugawa", cor: "#6E5DA6", imagem: "/img/demon-slayer/sanemi.png" },
  obanai: { id: "obanai", nome: "Obanai Iguro", cor: "#55707A", imagem: "/img/demon-slayer/obanai.png" },
  rengoku: { id: "rengoku", nome: "Kyojuro Rengoku", cor: "#E4572E", imagem: "/img/demon-slayer/rengoku.png" },
  muzan: { id: "muzan", nome: "Muzan Kibutsuji", cor: "#7A1F2B", imagem: "/img/demon-slayer/muzan.png" },
  daki: { id: "daki", nome: "Daki", cor: "#C2295B", imagem: "/img/demon-slayer/daki.png" },
};
