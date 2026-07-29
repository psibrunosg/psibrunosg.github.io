// Componente genérico de território "scrollytelling" no estilo Mundo Torajo:
// hero + N cenas (uma por item) + fechamento. Usado por todos os territórios
// baseados em personagens (Mundo Torajo, Demon Slayer, Jujutsu Kaisen) — mesmo
// padrão de Esquemas Iniciais (src/pages/EsquemasIniciais.tsx), parametrizado
// pra não duplicar ~300 linhas por território/universo. Recebe o mapa de
// personagens via prop (não fixo no Mundo Torajo) pra servir qualquer elenco.
// Ver docs/mundo-torajo-playbook.md.

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import lottie, { type AnimationItem } from "lottie-web";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import type { Personagem } from "@/content/psicoed/personagens";
import LensShardsBackground from "@/components/psicoed/LensShardsBackground";
import QuizEngine from "@/components/psicoed/QuizEngine";
import { gerarQuizPersonagens } from "@/components/psicoed/gerarQuizPersonagens";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

export interface CenaTorajo {
  numero: string;
  id: string;
  titulo: string;
  subtitulo: string;
  personagem: string;
  /** Rótulo do badge, quando difere do nome padrão do personagem (ex: "Toda a Turma"). */
  personagemLabel?: string;
  oQueE: string;
  descricao: string;
  /** Frase/quote em personagem — omitida quando o material fonte não trouxe uma. */
  frase?: string;
  /** Box "E na sua vida?" — omitido quando o material fonte não trouxe um. */
  vidaBox?: string;
}

export interface TerritorioTorajoProps {
  documentTitle: string;
  eyebrow: string;
  titulo: ReactNode;
  introCurta: string;
  introLonga: string;
  personagens: Record<string, Personagem>;
  itens: CenaTorajo[];
  fechamentoTitulo: string;
  fechamentoTexto: string;
  /** Rota do botão "Mapa"/"Voltar ao mapa" — default aponta pro mapa geral. */
  rotaVoltar?: string;
  /** Segundo botão no fechamento, ex: link pro território clínico equivalente. */
  fechamentoLinkExtra?: { titulo: string; rota: string };
}

function useLottieJson(url: string) {
  const [data, setData] = useState<object | null>(null);
  useEffect(() => {
    let ativo = true;
    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        if (ativo) setData(json);
      })
      .catch(() => {});
    return () => {
      ativo = false;
    };
  }, [url]);
  return data;
}

function useLottiePlayer(data: object | null, opts: { loop?: boolean; autoplay?: boolean } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const { loop = false, autoplay = true } = opts;

  useEffect(() => {
    if (!containerRef.current || !data) return;
    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop,
      autoplay,
      animationData: data,
    });
    return () => {
      animRef.current?.destroy();
      animRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return { containerRef, animRef };
}

export default function TerritorioTorajo({
  documentTitle,
  eyebrow,
  titulo,
  introCurta,
  introLonga,
  personagens,
  itens,
  fechamentoTitulo,
  fechamentoTexto,
  rotaVoltar = "/psicoeducacao",
  fechamentoLinkExtra,
}: TerritorioTorajoProps) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const corPadrao = personagens[itens[0].personagem].cor;
  const [activeColor, setActiveColor] = useState(corPadrao);

  // Navegação por cena (setinhas na tela + teclado) — pra apresentar em
  // projetor com clicker (Left/Right ou PageUp/PageDown avançam 1 cena).
  const alvosNavegacao = useMemo(
    () => ["hero", ...itens.map((it) => `cena-${it.id}`), "quiz-final", "fechamento"],
    [itens],
  );
  const [indiceAtual, setIndiceAtual] = useState(0);
  const quizConfig = useMemo(() => gerarQuizPersonagens(itens, personagens), [itens, personagens]);

  const mover = (delta: number) => {
    setIndiceAtual((atual) => {
      const novo = Math.max(0, Math.min(alvosNavegacao.length - 1, atual + delta));
      document.getElementById(alvosNavegacao[novo])?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      return novo;
    });
  };

  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        mover(1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        mover(-1);
      }
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alvosNavegacao, reduced]);

  const heartData = useLottieJson("/media/lottie/coracao-partido.json");
  const glassData = useLottieJson("/media/lottie/vidro-estilhacado.json");
  const heart = useLottiePlayer(heartData, { loop: false, autoplay: true });
  const glass = useLottiePlayer(glassData, { loop: false, autoplay: false });
  const heartContainerRef = heart.containerRef;
  const glassContainerRef = glass.containerRef;
  const glassAnimRef = glass.animRef;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = documentTitle;
    return () => document.documentElement.removeAttribute("data-theme");
  }, [documentTitle]);

  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      itens.forEach((item, i) => {
        const cor = personagens[item.personagem].cor;
        const secao = `#cena-${item.id}`;
        const direcao = i % 2 === 0 ? -1 : 1;

        ScrollTrigger.create({
          trigger: secao,
          start: "top 70%",
          end: "bottom 30%",
          onEnter: () => setActiveColor(cor),
          onEnterBack: () => setActiveColor(cor),
        });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: secao, start: "top 78%", toggleActions: "play none none reverse" },
        });

        tl.fromTo(
          `${secao} .personagem-render img`,
          { x: direcao * 110, opacity: 0, rotate: direcao * -5 },
          { x: 0, opacity: 1, rotate: 0, duration: 0.85, ease: "power2.out" },
        )
          .to(
            `${secao} .personagem-render img`,
            { y: -13, duration: 0.14, repeat: 5, yoyo: true, ease: "sine.inOut" },
            0,
          )
          .fromTo(
            `${secao} .texto-cena > *`,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power2.out" },
            0.2,
          );
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        itens.forEach((item) => {
          ScrollTrigger.create({
            trigger: `#cena-${item.id}`,
            start: "top top",
            end: "+=100%",
            pin: true,
          });
        });
        return () => undefined;
      });

      ScrollTrigger.create({
        trigger: "#fechamento",
        start: "top 70%",
        onEnter: () => {
          const anim = glassAnimRef.current;
          if (!anim) return;
          anim.setDirection(-1);
          anim.goToAndPlay(anim.totalFrames, true);
        },
      });
    }, containerRef);

    return () => ctx.revert();
    // glassAnimRef is a ref (stable identity) — intentionally excluded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, glassData, itens]);

  const irParaPersonagem = (personagemId: string) => {
    const primeiro = itens.find((it) => it.personagem === personagemId);
    if (!primeiro) return;
    document.getElementById(`cena-${primeiro.id}`)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      {!reduced && <LensShardsBackground color={activeColor} />}

      <div ref={containerRef} className="relative min-h-screen">
        <Link
          to={rotaVoltar}
          className="fixed top-24 left-4 z-30 inline-flex items-center gap-2 text-sm bg-[var(--c-surface)]/80 backdrop-blur px-3 py-2 rounded-full border border-[var(--c-border)] text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors"
        >
          <ArrowLeft size={16} />
          Mapa
        </Link>

        {/* Navegação por cena — pra clicker de apresentação (setas do teclado também funcionam). */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-[var(--c-surface)]/90 backdrop-blur rounded-full px-3 py-2 border border-[var(--c-border)] shadow-lg">
          <button
            onClick={() => mover(-1)}
            disabled={indiceAtual === 0}
            aria-label="Cena anterior"
            className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--c-text)] disabled:opacity-30 hover:bg-[var(--c-border)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)]"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs text-[var(--c-muted)] tabular-nums w-10 text-center">
            {indiceAtual + 1}/{alvosNavegacao.length}
          </span>
          <button
            onClick={() => mover(1)}
            disabled={indiceAtual === alvosNavegacao.length - 1}
            aria-label="Próxima cena"
            className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--c-text)] disabled:opacity-30 hover:bg-[var(--c-border)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)]"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <nav className="hidden md:flex fixed top-24 right-4 z-30 flex-col gap-2 bg-[var(--c-surface)]/80 backdrop-blur rounded-full p-2 border border-[var(--c-border)]">
          {Object.values(personagens).map((p) => (
            <button
              key={p.id}
              onClick={() => irParaPersonagem(p.id)}
              title={p.nome}
              className="w-10 h-10 rounded-full overflow-hidden border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)]"
              style={{ borderColor: p.cor }}
            >
              <img src={p.imagem} alt={p.nome} className="w-full h-full object-cover object-top" />
            </button>
          ))}
        </nav>

        {/* Hero */}
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--c-accent)] font-semibold mb-2">{eyebrow}</p>
          <h1
            className="text-4xl md:text-6xl font-semibold mb-4 text-[var(--c-text)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {titulo}
          </h1>
          <p className="max-w-xl text-[var(--c-muted)] mb-8 leading-relaxed">{introCurta}</p>

          <div ref={heartContainerRef} className="w-56 h-56 -mb-4" />

          <div className="flex flex-wrap gap-3 justify-center max-w-md mb-2">
            {Object.values(personagens).map((p) => (
              <img
                key={p.id}
                src={p.imagem}
                alt={p.nome}
                className="w-14 h-14 rounded-full object-cover object-top border-2 shadow-sm"
                style={{ borderColor: p.cor }}
              />
            ))}
          </div>

          <p className="max-w-lg text-sm text-[var(--c-muted)] leading-relaxed mt-4">{introLonga}</p>

          <ArrowDown className="mt-10 text-[var(--c-muted)] animate-bounce" size={20} aria-hidden="true" />
        </section>

        {/* Cenas */}
        {itens.map((item) => {
          const personagem = personagens[item.personagem];
          return (
            <section
              key={item.id}
              id={`cena-${item.id}`}
              className="relative min-h-screen flex items-center justify-center px-6 py-8 md:py-10 overflow-hidden"
            >
              <div className="max-w-5xl w-full grid md:grid-cols-2 gap-6 items-center">
                <div className="personagem-render flex justify-center order-1">
                  <img
                    src={personagem.imagem}
                    alt={personagem.nome}
                    className="h-[34vh] md:h-[46vh] object-contain drop-shadow-2xl"
                  />
                </div>
                <div className="texto-cena order-2 rounded-3xl bg-[var(--c-surface)]/90 backdrop-blur-sm shadow-lg p-4 md:p-5">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold opacity-20 leading-none" style={{ color: personagem.cor }}>
                      {item.numero}
                    </span>
                    <p className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: personagem.cor }}>
                      {item.personagemLabel ?? personagem.nome}
                    </p>
                  </div>
                  <h2
                    className="text-xl md:text-2xl font-semibold text-[var(--c-text)] mb-0.5"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.titulo}
                  </h2>
                  <p className="text-[11px] italic text-[var(--c-muted)] mb-2">{item.subtitulo}</p>
                  <p
                    className="border-l-[3px] pl-3 mb-2 text-sm text-[var(--c-text)] leading-snug"
                    style={{ borderColor: personagem.cor }}
                  >
                    <b style={{ color: personagem.cor }}>O que é: </b>
                    {item.oQueE}
                  </p>
                  <p className="mb-2 text-sm text-[var(--c-text)] leading-snug">{item.descricao}</p>
                  {item.frase && (
                    <div
                      className="rounded-lg p-3 italic mb-2 text-sm leading-snug text-white border-l-4"
                      style={{ background: "#161428", borderColor: personagem.cor }}
                    >
                      "{item.frase}"
                    </div>
                  )}
                  {item.vidaBox && (
                    <div
                      className="rounded-lg border border-dashed p-3 mb-2"
                      style={{ borderColor: personagem.cor, background: `${personagem.cor}0d` }}
                    >
                      <p
                        className="text-[9px] font-bold uppercase tracking-wider mb-0.5"
                        style={{ color: personagem.cor }}
                      >
                        E na sua vida?
                      </p>
                      <p className="text-xs italic text-[var(--c-text)] leading-snug">{item.vidaBox}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}

        {/* Quiz final — testa o que o paciente aprendeu, gerado dos próprios itens. */}
        <section id="quiz-final" className="relative py-16 px-6">
          <div className="max-w-xl mx-auto">
            <p className="text-xs tracking-[0.2em] uppercase text-[var(--c-accent)] font-semibold mb-2 text-center">
              Praticar
            </p>
            <h2
              className="text-2xl md:text-3xl font-semibold text-[var(--c-text)] mb-6 text-center"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Teste o que você aprendeu
            </h2>
            <QuizEngine config={quizConfig} />
          </div>
        </section>

        {/* Fechamento */}
        <section
          id="fechamento"
          className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24"
        >
          {/* eslint-disable-next-line react-hooks/refs -- container ref only mounts the lottie player, read solely inside the scroll callback above, never during render */}
          <div ref={glassContainerRef} className="w-64 h-64 mb-4" />
          <h2
            className="text-3xl md:text-4xl font-semibold text-[var(--c-text)] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {fechamentoTitulo}
          </h2>
          <p className="max-w-xl text-[var(--c-muted)] leading-relaxed mb-8">{fechamentoTexto}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            {fechamentoLinkExtra && (
              <Link
                to={fechamentoLinkExtra.rota}
                className="px-6 py-3 rounded-full text-white text-sm font-semibold"
                style={{ background: "var(--c-accent)" }}
              >
                {fechamentoLinkExtra.titulo}
              </Link>
            )}
            <Link
              to={rotaVoltar}
              className={
                fechamentoLinkExtra
                  ? "px-6 py-3 rounded-full text-sm font-semibold border border-[var(--c-border)] text-[var(--c-muted)]"
                  : "px-6 py-3 rounded-full text-white text-sm font-semibold"
              }
              style={fechamentoLinkExtra ? undefined : { background: "var(--c-accent)" }}
            >
              Voltar ao mapa
            </Link>
          </div>
        </section>
      </div>

      <EthicalFooter />
    </>
  );
}
