import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Brain, Waves, Scale, Compass, Moon, Layers, Lock, Sparkles, ChevronRight } from "lucide-react";
import { useState } from "react";
import { territorios, type Territorio } from "@/content/psicoed";
import { fadeUp, stagger } from "@/lib/motion";

const icones = {
  brain: Brain,
  waves: Waves,
  scale: Scale,
  compass: Compass,
  moon: Moon,
  layers: Layers,
} as const;

function useConcluidos() {
  const [concluidos] = useState<Set<string>>(() => {
    try {
      const regas = JSON.parse(localStorage.getItem("jardim_regas") || "[]") as Array<{ slug: string }>;
      const ids = regas
        .filter((r) => r.slug?.startsWith("psicoed:"))
        .map((r) => r.slug.replace("psicoed:", ""));
      return new Set(ids);
    } catch {
      return new Set();
    }
  });
  return concluidos;
}

function TerritorioNo({ territorio, concluido }: { territorio: Territorio; concluido: boolean }) {
  const Icone = icones[territorio.icone];
  const emBreve = territorio.status === "em-breve";
  const [teaserAberto, setTeaserAberto] = useState(false);

  const conteudo = (
    <>
      <div
        className={`relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border-2 shadow-sm transition-colors ${
          emBreve
            ? "border-[var(--c-border)] bg-[var(--c-surface)]"
            : concluido
            ? "border-[var(--c-accent)] bg-[var(--c-accent)]/15"
            : "border-[var(--c-accent)]/50 bg-[var(--c-surface)]"
        }`}
      >
        <Icone size={28} className={emBreve ? "text-[var(--c-muted)]" : "text-[var(--c-accent)]"} />
        {concluido && !emBreve && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--c-accent)] text-white flex items-center justify-center">
            <Sparkles size={11} />
          </span>
        )}
        {emBreve && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--c-muted)] text-white flex items-center justify-center">
            <Lock size={10} />
          </span>
        )}
      </div>
      <div className="mt-2 text-center max-w-[9rem]">
        <p className="text-xs md:text-sm font-semibold text-[var(--c-text)] leading-tight">{territorio.titulo}</p>
        {emBreve && <p className="text-[10px] text-[var(--c-muted)] mt-0.5">Em breve</p>}
      </div>
    </>
  );

  if (emBreve) {
    return (
      <div className="flex flex-col items-center">
        <button
          onClick={() => setTeaserAberto((v) => !v)}
          className="flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)] rounded-xl"
        >
          {conteudo}
        </button>
        {teaserAberto && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="text-[11px] text-[var(--c-muted)] text-center max-w-[11rem] mt-2 leading-relaxed"
          >
            {territorio.teaser}
          </motion.p>
        )}
      </div>
    );
  }

  return (
    <Link
      to={territorio.rota}
      className="flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)] rounded-xl"
    >
      {conteudo}
    </Link>
  );
}

export default function MapaExploratorio() {
  const reduced = useReducedMotion();
  const concluidos = useConcluidos();

  return (
    <div>
      {/* Desktop: mapa SVG com trilhas conectando territórios */}
      <div className="hidden md:block relative w-full" style={{ minHeight: 460 }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        >
          {territorios.slice(1).map((t, i) => {
            const anterior = territorios[i];
            return (
              <motion.line
                key={t.id}
                x1={anterior.posicao.x}
                y1={anterior.posicao.y}
                x2={t.posicao.x}
                y2={t.posicao.y}
                stroke="var(--c-border)"
                strokeWidth={0.4}
                strokeDasharray="2 2"
                initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: i * 0.15 }}
              />
            );
          })}
        </svg>

        {territorios.map((t, i) => (
          <motion.div
            key={t.id}
            initial={reduced ? undefined : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${t.posicao.x}%`, top: `${t.posicao.y}%` }}
          >
            <TerritorioNo territorio={t} concluido={concluidos.has(t.id)} />
          </motion.div>
        ))}
      </div>

      {/* Mobile: trilha vertical scrollável */}
      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="visible"
        className="md:hidden flex flex-col gap-0"
      >
        {territorios.map((t, i) => {
          const Icone = icones[t.icone];
          const emBreve = t.status === "em-breve";
          const concluido = concluidos.has(t.id);
          return (
            <motion.div key={t.id} variants={fadeUp} custom={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 flex-shrink-0 ${
                    emBreve
                      ? "border-[var(--c-border)] bg-[var(--c-surface)]"
                      : concluido
                      ? "border-[var(--c-accent)] bg-[var(--c-accent)]/15"
                      : "border-[var(--c-accent)]/50 bg-[var(--c-surface)]"
                  }`}
                >
                  <Icone size={20} className={emBreve ? "text-[var(--c-muted)]" : "text-[var(--c-accent)]"} />
                </div>
                {i < territorios.length - 1 && (
                  <div className="w-0.5 flex-1 min-h-8 bg-[var(--c-border)] my-1" style={{ borderLeft: "2px dashed var(--c-border)", background: "none" }} />
                )}
              </div>

              {emBreve ? (
                <MobileTeaserItem territorio={t} />
              ) : (
                <Link to={t.rota} className="flex-1 pb-8 group">
                  <p className="text-sm font-semibold text-[var(--c-text)] flex items-center gap-1 group-hover:text-[var(--c-accent)] transition-colors">
                    {t.titulo}
                    {concluido && <Sparkles size={12} className="text-[var(--c-accent)]" />}
                    <ChevronRight size={14} className="text-[var(--c-muted)] group-hover:text-[var(--c-accent)]" />
                  </p>
                  <p className="text-xs text-[var(--c-muted)] mt-1 leading-relaxed">{t.descricaoCurta}</p>
                </Link>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

function MobileTeaserItem({ territorio }: { territorio: Territorio }) {
  const [aberto, setAberto] = useState(false);
  return (
    <button onClick={() => setAberto((v) => !v)} className="flex-1 pb-8 text-left">
      <p className="text-sm font-semibold text-[var(--c-muted)] flex items-center gap-1">
        {territorio.titulo}
        <span className="text-[10px] font-normal bg-[var(--c-border)]/60 text-[var(--c-muted)] px-2 py-0.5 rounded-full ml-1">
          Em breve
        </span>
      </p>
      <p className="text-xs text-[var(--c-muted)] mt-1 leading-relaxed">
        {aberto ? territorio.teaser : territorio.descricaoCurta}
      </p>
    </button>
  );
}
