import { motion, useReducedMotion } from "framer-motion";

interface Blob {
  size: number;
  x: string;
  y: string;
  color: string;
  delay: number;
}

const blobs: Blob[] = [
  { size: 340, x: "6%",  y: "10%", color: "var(--c-accent)",    delay: 0 },
  { size: 260, x: "76%", y: "18%", color: "var(--c-moss)",      delay: 2 },
  { size: 220, x: "60%", y: "72%", color: "var(--c-warm)",      delay: 4 },
  { size: 180, x: "20%", y: "66%", color: "var(--c-accent-lt)", delay: 1.5 },
];

/**
 * Fundo aurora reutilizavel para as areas de paciente e admin.
 * withLandmark = adiciona marca d'agua do lobo + silhueta de montanhas (identidade BS).
 * Respeita prefers-reduced-motion.
 */
export function AppAurora({ withLandmark = false }: { withLandmark?: boolean }) {
  const reduced = useReducedMotion();

  return (
    <div className="app-aurora" aria-hidden="true">
      {!reduced &&
        blobs.map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{ width: b.size, height: b.size, left: b.x, top: b.y, background: b.color, opacity: 0.08 }}
            animate={{ x: [0, 26, -18, 0], y: [0, -22, 14, 0], scale: [1, 1.12, 0.94, 1] }}
            transition={{ duration: 20 + i * 4, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
          />
        ))}

      {withLandmark && (
        <>
          {/* Marca d'agua do lobo (identidade BS) */}
          <motion.img
            src="/img/simbolo-estendido.png"
            alt=""
            className="absolute select-none"
            style={{
              width: "min(60vw, 560px)",
              top: "-6%",
              right: "-8%",
              opacity: 0.07,
              mixBlendMode: "multiply",
            }}
            animate={reduced ? undefined : { y: [0, -14, 0], rotate: [0, -1.5, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            draggable={false}
          />

          {/* Silhueta de montanhas — "a montanha e o caminho" */}
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            style={{ height: "38vh", maxHeight: 360 }}
          >
            <defs>
              <linearGradient id="mtn-back" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--c-accent)" stopOpacity="0.10" />
                <stop offset="100%" stopColor="var(--c-accent)" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="mtn-mid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--c-moss)" stopOpacity="0.14" />
                <stop offset="100%" stopColor="var(--c-moss)" stopOpacity="0.03" />
              </linearGradient>
              <linearGradient id="mtn-front" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--c-accent)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--c-accent)" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path fill="url(#mtn-back)" d="M0,210 L260,90 L470,200 L720,70 L980,190 L1230,110 L1440,200 L1440,320 L0,320 Z" />
            <path fill="url(#mtn-mid)" d="M0,260 L210,160 L430,250 L680,150 L920,250 L1180,170 L1440,250 L1440,320 L0,320 Z" />
            <path fill="url(#mtn-front)" d="M0,300 L300,220 L560,300 L840,225 L1120,300 L1360,250 L1440,290 L1440,320 L0,320 Z" />
          </svg>
        </>
      )}
    </div>
  );
}