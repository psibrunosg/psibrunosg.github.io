import { useEffect } from "react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { SceneEngine, SceneOpening, SceneIruka, SceneClanSelect } from "@/components/naruto/scenes";
import type { Scene } from "@/components/naruto/scenes";
import "@/styles/naruto.css";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

const scenes: Scene[] = [
  { id: "opening", component: SceneOpening },
  { id: "iruka", component: SceneIruka },
  { id: "clan-select", component: SceneClanSelect },
];

export default function NarutoHub() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Naruto — Vila da Folha | Psicoeducação | Bruno de Souza Gonçalves";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <main id="main" className="relative bg-[#0f1a16]">
        <SceneEngine scenes={scenes} />
      </main>

      <EthicalFooter />
    </>
  );
}
