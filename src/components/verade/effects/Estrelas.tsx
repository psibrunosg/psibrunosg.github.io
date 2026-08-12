// Céu estrelado — Capítulo 1 (Chegada)

interface EstrelasProps {
  quantidade?: number;
}

export default function Estrelas({ quantidade = 80 }: EstrelasProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: quantidade }).map((_, i) => {
        const top = `${(i * 13) % 100}%`;
        const left = `${(i * 17) % 100}%`;
        const size = `${1 + (i % 2)}px`;
        const delay = `${(i % 10) * 0.3}s`;
        return (
          <span
            key={i}
            className="verade-star absolute rounded-full bg-white"
            style={{
              top,
              left,
              width: size,
              height: size,
              opacity: 0.4 + (i % 6) / 10,
              animation: `verade-twinkle ${2 + (i % 3)}s ease-in-out ${delay} infinite alternate`,
            }}
          />
        );
      })}
    </div>
  );
}
