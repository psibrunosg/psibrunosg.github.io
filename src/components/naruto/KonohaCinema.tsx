import { useCinematicScroll } from "@/hooks/useCinematicScroll";

export default function KonohaCinema() {
  useCinematicScroll({
    layers: [
      { name: "bg", yStart: 0, yEnd: -60, scaleStart: 1, scaleEnd: 1.1 },
      { name: "leaves", yStart: 0, yEnd: -120, scaleStart: 1, scaleEnd: 1.05, opacityStart: 0.6, opacityEnd: 1 },
    ],
    mouseParallax: true,
    lerp: 0.07,
  });

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{ background: "#1a1510" }}
    >
      {/* Background da Vila da Folha */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate3d(calc(var(--cinema-mouse-x) * -12px), calc(var(--bg-y, 0px) + var(--cinema-mouse-y) * -8px), 0) scale(var(--bg-scale, 1))`,
        }}
      >
        <img
          src="/naruto/generated/background.png"
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Vinheta escura para legibilidade do texto */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, transparent 0%, rgba(10,10,10,0.4) 70%, rgba(5,5,5,0.75) 100%)",
          }}
        />
      </div>

      {/* Folhas caindo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate3d(calc(var(--cinema-mouse-x) * -24px), var(--leaves-y, 0px), 0) scale(var(--leaves-scale, 1))`,
          opacity: "var(--leaves-opacity, 0.6)",
        }}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${(i * 7) % 100}%`,
              top: `${-10 - (i % 5) * 5}%`,
              width: `${8 + (i % 6)}px`,
              height: `${6 + (i % 5)}px`,
              background: i % 3 === 0 ? "#f6ad55" : i % 3 === 1 ? "#c05621" : "#d69e2e",
              opacity: 0.7,
              animation: `naruto-fall ${6 + (i % 5)}s linear ${(i % 7) * 0.8}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
