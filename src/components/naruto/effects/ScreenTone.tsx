interface ScreenToneProps {
  className?: string;
  color?: string;
  dotSize?: number;
  opacity?: number;
}

export default function ScreenTone({
  className = "",
  color = "#000000",
  dotSize = 4,
  opacity = 0.12,
}: ScreenToneProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
      style={{
        backgroundImage: `radial-gradient(circle, ${color} 1.5px, transparent 1.5px)`,
        backgroundSize: `${dotSize}px ${dotSize}px`,
        opacity,
      }}
    />
  );
}
