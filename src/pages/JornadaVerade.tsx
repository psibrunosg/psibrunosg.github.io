// Página "Jornada por Verade" — experiência scroll-driven narrativa que liga
// Terapia do Esquema aos personagens do Mundo Torajo. 7 capítulos, cada um com
// cenário, personagem, quiz e recompensa visual. Adaptada ao design system do
// site (tema lobo) e à stack existente (React, Tailwind, GSAP, Framer Motion).

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowDown, Mail, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { personagens } from "@/content/psicoed/personagens";
import { capitulos, personagensVerade, type Capitulo } from "@/content/psicoed/verade";

import CenarioChegada from "@/components/verade/CenarioChegada";
import CenarioPraca from "@/components/verade/CenarioPraca";
import CenarioJardim from "@/components/verade/CenarioJardim";
import CenarioCaverna from "@/components/verade/CenarioCaverna";
import CenarioFloresta from "@/components/verade/CenarioFloresta";
import CenarioTorre from "@/components/verade/CenarioTorre";
import CenarioReencontro from "@/components/verade/CenarioReencontro";
import QuizCapitulo from "@/components/verade/QuizCapitulo";
import AdultoSaudavelModal from "@/components/verade/AdultoSaudavelModal";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

const STORAGE_KEY = "verade-progresso-v1";

const cenariosPorCapitulo: Record<string, React.ComponentType<{
  recompensaAtivada?: boolean;
  cor?: string;
  glow?: string;
  reducedMotion?: boolean;
  progresso?: number;
}>> = {
  chegada: CenarioChegada,
  praca: CenarioPraca,
  jardim: CenarioJardim,
  caverna: CenarioCaverna,
  floresta: CenarioFloresta,
  torre: CenarioTorre,
  reencontro: CenarioReencontro,
};

function lerProgressoSalvo(): { recompensas: Set<string>; reflexao: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        recompensas: Array.isArray(parsed.recompensas) ? new Set(parsed.recompensas) : new Set(),
        reflexao: typeof parsed.reflexao === "string" ? parsed.reflexao : "",
      };
    }
  } catch {
    // ignora storage corrompido
  }
  return { recompensas: new Set(), reflexao: "" };
}

function useVeradeProgresso() {
  const [recompensas, setRecompensas] = useState<Set<string>>(() => lerProgressoSalvo().recompensas);
  const [reflexao, setReflexao] = useState<string>(() => lerProgressoSalvo().reflexao);

  const salvar = (next: Set<string>, nextReflexao?: string) => {
    const atualizado = {
      recompensas: Array.from(next),
      reflexao: nextReflexao ?? reflexao,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizado));
    } catch {
      // storage pode estar indisponível
    }
  };

  const ativarRecompensa = (id: string) => {
    setRecompensas((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      salvar(next);
      return next;
    });
  };

  const salvarReflexao = (texto: string) => {
    setReflexao(texto);
    salvar(recompensas, texto);
  };

  return { recompensas, ativarRecompensa, reflexao, salvarReflexao };
}

export default function JornadaVerade() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { recompensas, ativarRecompensa, reflexao, salvarReflexao } = useVeradeProgresso();
  const [modalCapitulo, setModalCapitulo] = useState<Capitulo | null>(null);
  const [progressoChegada, setProgressoChegada] = useState(0);

  const quizConfig = useMemo(
    () => capitulos.filter((c) => !c.reflexivo && c.id !== "chegada" && c.id !== "reencontro"),
    [],
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.documentElement.setAttribute("data-mode", "noturno");
    document.title = "Jornada por Verade | Terapia do Esquema | Bruno de Souza Gonçalves";
    return () => {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.removeAttribute("data-mode");
    };
  }, []);

  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Progresso do bondinho no hero
      const chegada = capitulos[0];
      ScrollTrigger.create({
        trigger: `#cap-${chegada.id}`,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => setProgressoChegada(self.progress),
      });

      // Animações de entrada por capítulo
      capitulos.forEach((cap, i) => {
        const secao = `#cap-${cap.id}`;
        const direcao = i % 2 === 0 ? -1 : 1;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: secao,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });

        tl.fromTo(
          `${secao} .verade-personagem img`,
          { x: direcao * 90, opacity: 0, rotate: direcao * -4 },
          { x: 0, opacity: 1, rotate: 0, duration: 0.85, ease: "power2.out" },
        )
          .to(
            `${secao} .verade-personagem img`,
            { y: -10, duration: 0.16, repeat: 5, yoyo: true, ease: "sine.inOut" },
            0,
          )
          .fromTo(
            `${secao} .verade-texto > *`,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power2.out" },
            0.15,
          );
      });

      // Pin em desktop
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        capitulos.forEach((cap) => {
          ScrollTrigger.create({
            trigger: `#cap-${cap.id}`,
            start: "top top",
            end: "+=100%",
            pin: true,
          });
        });
        return () => undefined;
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reduced]);

  const handleEmailResumo = () => {
    const acertos = Array.from(recompensas).filter((id) => id !== "torre" && id !== "reencontro").length;
    const totalQuiz = quizConfig.length;
    const linhas = capitulos.map((c) => {
      const ativado = recompensas.has(c.id);
      return `- ${c.titulo}: ${ativado ? "recompensa ativada" : "ainda não ativada"}`;
    });
    const corpo = encodeURIComponent(
      `Minha jornada por Verade\n\nQuiz: ${acertos}/${totalQuiz} recompensas ativadas.\n\n${linhas.join("\n")}\n\nReflexão da Torre da Pessy:\n${reflexao || "(sem reflexão registrada)"}\n\n— enviado do site do Bruno de Souza Gonçalves`,
    );
    window.location.href = `mailto:?subject=Minha Verade&body=${corpo}`;
  };

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <Link
        to="/psicoeducacao/mundos/torajo"
        className="fixed top-24 left-4 z-30 inline-flex items-center gap-2 text-sm bg-[var(--c-surface)]/80 backdrop-blur px-3 py-2 rounded-full border border-[var(--c-border)] text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors"
      >
        <ArrowLeft size={16} />
        Mapa
      </Link>

      <div ref={containerRef} className="relative bg-[var(--c-bg-dark)]">
        {capitulos.map((cap) => {
          const personagem = personagens[cap.personagem];
          const recompensaAtivada = recompensas.has(cap.id);
          const Cenario = cenariosPorCapitulo[cap.id];
          const isFinal = cap.id === "reencontro";

          return (
            <section
              key={cap.id}
              id={`cap-${cap.id}`}
              className="relative min-h-screen flex items-center justify-center px-6 py-10 overflow-hidden"
            >
              {/* Cenário de fundo */}
              <div className="absolute inset-0 -z-10">
                <Cenario
                  recompensaAtivada={recompensaAtivada}
                  cor={cap.cor}
                  glow={cap.glow}
                  reducedMotion={!!reduced}
                  progresso={cap.id === "chegada" ? progressoChegada : undefined}
                />
              </div>

              {/* Overlay escuro para legibilidade */}
              <div
                className="absolute inset-0 -z-[5]"
                style={{
                  background: isFinal
                    ? "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)"
                    : "linear-gradient(180deg, rgba(10,10,15,0.55) 0%, rgba(10,10,15,0.4) 50%, rgba(10,10,15,0.65) 100%)",
                }}
              />

              <div className="relative z-10 max-w-5xl w-full grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Personagem */}
                <div
                  className="verade-personagem flex justify-center order-1"
                  style={{ filter: `drop-shadow(0 0 28px ${cap.glow}55)` }}
                >
                  <img
                    src={personagem.imagem}
                    alt={personagem.nome}
                    className="h-[32vh] md:h-[44vh] object-contain"
                  />
                </div>

                {/* Texto + quiz */}
                <div className="verade-texto order-2">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span
                      className="text-4xl md:text-5xl font-bold opacity-20 leading-none"
                      style={{ color: cap.cor }}
                    >
                      0{cap.numero}
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: cap.cor }}>
                      {personagem.nome} · {cap.modo}
                    </span>
                  </div>

                  <h2
                    className="text-2xl md:text-4xl font-semibold text-[var(--c-text)] mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {cap.titulo}
                  </h2>
                  <p className="text-xs italic text-[var(--c-muted)] mb-4">{cap.subtitulo}</p>

                  <p
                    className="text-base md:text-lg leading-relaxed mb-6"
                    style={{ color: "var(--c-text)", fontFamily: "var(--font-heading)", fontStyle: "italic" }}
                  >
                    "{cap.narrativa}"
                  </p>

                  {isFinal ? (
                    <div className="space-y-5">
                      <p className="text-sm text-[var(--c-muted)] leading-relaxed">
                        Clique em cada personagem para ler a mensagem do Adulto Saudável. Depois, envie seu resumo.
                      </p>

                      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                        {personagensVerade.map((pid) => {
                          const p = personagens[pid];
                          const capDoPersonagem = capitulos.find((c) => c.personagem === pid) ?? capitulos[0];
                          return (
                            <button
                              key={pid}
                              onClick={() => setModalCapitulo(capDoPersonagem)}
                              className="flex flex-col items-center gap-1.5 focus:outline-none"
                            >
                              <img
                                src={p.imagem}
                                alt={p.nome}
                                className="w-14 h-14 rounded-full object-cover object-top border-2 transition-transform hover:scale-110"
                                style={{ borderColor: p.cor, boxShadow: `0 0 12px 2px ${p.cor}44` }}
                              />
                              <span className="text-[10px] font-semibold text-[var(--c-muted)]">{p.nome}</span>
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={handleEmailResumo}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold"
                        style={{ background: cap.cor, boxShadow: `0 0 20px -4px ${cap.glow}` }}
                      >
                        <Mail size={16} />
                        Minha Verade
                      </button>
                    </div>
                  ) : (
                    <QuizCapitulo
                      capitulo={cap}
                      jaRespondido={recompensaAtivada}
                      onAcerto={() => ativarRecompensa(cap.id)}
                      onReflexao={cap.reflexivo ? salvarReflexao : undefined}
                    />
                  )}
                </div>
              </div>
            </section>
          );
        })}

        {/* Indicador de progresso flutuante */}
        <div className="fixed bottom-6 right-4 z-30 flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--c-surface)]/90 backdrop-blur border border-[var(--c-border)] text-xs text-[var(--c-muted)]">
          <Sparkles size={14} className="text-[var(--c-accent)]" />
          <span className="tabular-nums">{recompensas.size}/{capitulos.length}</span>
        </div>

        {/* Seta de scroll no hero */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 text-[var(--c-muted)] animate-bounce md:block hidden">
          <ArrowDown size={20} aria-hidden="true" />
        </div>
      </div>

      <EthicalFooter />

      <AnimatePresence>
        {modalCapitulo && <AdultoSaudavelModal capitulo={modalCapitulo} onClose={() => setModalCapitulo(null)} />}
      </AnimatePresence>
    </>
  );
}
