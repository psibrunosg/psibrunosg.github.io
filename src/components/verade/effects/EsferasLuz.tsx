// Esferas de luz coloridas — Capítulo 7 (Reencontro)

interface Esfera {
  cor: string;
  glow: string;
  left: string;
  delay: string;
}

const esferasPadrao: Esfera[] = [
  { cor: "#3949ab", glow: "#3949ab", left: "12%", delay: "0s" },
  { cor: "#ba68c8", glow: "#ba68c8", left: "28%", delay: "0.4s" },
  { cor: "#ef5350", glow: "#ef5350", left: "44%", delay: "0.8s" },
  { cor: "#66bb6a", glow: "#66bb6a", left: "60%", delay: "1.2s" },
  { cor: "#ffb74d", glow: "#ffb74d", left: "76%", delay: "1.6s" },
  { cor: "#fff176", glow: "#fff176", left: "88%", delay: "2s" },
];

interface EsferasLuzProps {
  esferas?: Esfera[];
  ativo?: boolean;
}

export default function EsferasLuz({ esferas = esferasPadrao, ativo = true }: EsferasLuzProps) {
  if (!ativo) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {esferas.map((e, i) => (
        <span
          key={i}
          className="verade-orb absolute rounded-full"
          style={{
            left: e.left,
            bottom: "-10%",
            width: "18px",
            height: "18px",
            background: e.cor,
            boxShadow: `0 0 24px 8px ${e.glow}`,
            animation: `verade-rise-orb ${5 + (i % 3)}s ease-in-out ${e.delay} infinite`,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
}
