// Borboletas que mudam de cor — Capítulo 3 (Jardim Suspiro / Zulmi)

interface BorboletasProps {
  corInicial?: string;
  corFinal?: string;
  quantidade?: number;
  transformado?: boolean;
}

export default function Borboletas({
  corInicial = "#6b6b6b",
  corFinal = "#ba68c8",
  quantidade = 14,
  transformado = false,
}: BorboletasProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: quantidade }).map((_, i) => {
        const top = `${10 + (i * 6) % 70}%`;
        const delay = (i % 5) * 0.5;
        const dur = 4 + (i % 4);
        const size = `${12 + (i % 8)}px`;
        return (
          <span
            key={i}
            className="verade-butterfly absolute"
            style={{
              top,
              left: `${(i / quantidade) * 100}%`,
              width: size,
              height: size,
              background: transformado ? corFinal : corInicial,
              borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
              boxShadow: `0 0 10px 2px ${transformado ? corFinal : corInicial}`,
              transition: "background 1.2s ease, box-shadow 1.2s ease",
              animation: `verade-flutter-x ${dur}s ease-in-out ${delay}s infinite alternate, verade-flutter-y ${dur * 0.7}s ease-in-out ${delay}s infinite alternate`,
              opacity: transformado ? 0.9 : 0.5,
            }}
          />
        );
      })}
    </div>
  );
}
