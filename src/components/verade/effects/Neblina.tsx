// Camadas de neblina — multiuso

interface NeblinaProps {
  cor?: string;
  intensidade?: "leve" | "media" | "densa";
}

export default function Neblina({ cor = "#7b1fa2", intensidade = "media" }: NeblinaProps) {
  const opacities = { leve: 0.12, media: 0.22, densa: 0.34 };
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="verade-fog absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, ${cor}88 0%, transparent 70%)`,
          opacity: opacities[intensidade],
          animation: "verade-fog-drift 12s ease-in-out infinite alternate",
        }}
      />
      <div
        className="verade-fog absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 20% 100%, ${cor}66 0%, transparent 60%)`,
          opacity: opacities[intensidade] * 0.7,
          animation: "verade-fog-drift 16s ease-in-out infinite alternate-reverse",
        }}
      />
    </div>
  );
}
