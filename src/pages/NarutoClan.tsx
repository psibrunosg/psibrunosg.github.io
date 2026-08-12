import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { getClanById } from "@/content/naruto";
import ClanStory from "@/components/naruto/ClanStory";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

export default function NarutoClan() {
  const { clanId } = useParams<{ clanId: string }>();
  const clan = clanId ? getClanById(clanId) : undefined;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    if (clan) {
      document.title = `${clan.name} — ${clan.mode} | Naruto | Bruno de Souza Gonçalves`;
    }
    return () => document.documentElement.removeAttribute("data-theme");
  }, [clan]);

  if (!clan) {
    return <Navigate to="/psicoeducacao/naruto" replace />;
  }

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <main id="main">
        <ClanStory clan={clan} />
      </main>

      <EthicalFooter />
    </>
  );
}
