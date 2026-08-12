import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import KonohaCinema from "@/components/naruto/KonohaCinema";
import IrukaStoryTeller from "@/components/naruto/IrukaStoryTeller";
import ClanSymbolGrid from "@/components/naruto/ClanSymbolGrid";
import "@/styles/naruto.css";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

export default function NarutoHub() {
  const [showClans, setShowClans] = useState(false);

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
        {/* Cena cinematográfica fixa */}
        <div className="sticky top-0 h-screen w-full overflow-hidden -z-10">
          <KonohaCinema />
        </div>

        {/* Conteúdo que rola por cima */}
        <div className="relative z-10 pb-32" style={{ marginTop: "-100vh" }}>
          {/* Seção do Iruka */}
          <section className="min-h-screen flex items-center justify-center py-20">
            <div className="w-full">
              <div className="text-center mb-10 md:mb-14">
                <p className="text-xs tracking-[0.25em] uppercase text-[#C65C2E] font-semibold mb-3">
                  Psicoeducação
                </p>
                <h1
                  className="text-3xl md:text-5xl font-semibold text-[#e8dcc0] mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Bem-vindo à Vila da Folha
                </h1>
                <p className="text-[#e8dcc0]/70 max-w-xl mx-auto px-4">
                  Uma jornada pelos modos da mente, contada pelos ninjas que já os conheceram de perto.
                </p>
              </div>

              <IrukaStoryTeller onComplete={() => setShowClans(true)} />
            </div>
          </section>

          {/* Seção dos clãs */}
          <section
            className={`min-h-screen flex flex-col items-center justify-center py-20 transition-opacity duration-1000 ${showClans ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            aria-hidden={!showClans}
          >
            <div className="text-center mb-10 md:mb-14 px-4">
              <h2
                className="text-2xl md:text-4xl font-semibold text-[#e8dcc0] mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Escolha um clã
              </h2>
              <p className="text-[#e8dcc0]/70 max-w-xl mx-auto">
                Cada símbolo representa um modo da mente. Clique para ouvir a história de quem o viveu.
              </p>
            </div>

            <ClanSymbolGrid />

            <Link
              to="/psicoeducacao/mundos"
              className="inline-flex items-center gap-2 mt-16 text-sm text-[#e8dcc0]/70 hover:text-[#C65C2E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C65C2E] rounded px-2 py-1"
            >
              <ArrowLeft size={16} />
              Outros mundos
            </Link>
          </section>
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}
