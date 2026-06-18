import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  variant?: "a" | "b" | "c";
}

const gradients: Record<string, string> = {
  a: "conic-gradient(from 230deg at 50% 50%, #0F1F1A 0deg, #2D4A35 72deg, #6BA585 144deg, #C8896B 216deg, #2D4A35 288deg, #0F1F1A 360deg)",
  b: "conic-gradient(from 200deg at 50% 50%, #0A1B2A 0deg, #1F4763 72deg, #4A7FA0 144deg, #B89968 216deg, #1F4763 288deg, #0A1B2A 360deg)",
  c: "conic-gradient(from 160deg at 50% 50%, #2B1810 0deg, #4A6B47 72deg, #B05D3A 144deg, #F2C9A4 216deg, #4A6B47 288deg, #2B1810 360deg)",
};

export function AuroraBackground({ children, className, variant = "a" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame: number;
    let angle = 0;

    const animate = () => {
      angle = (angle + 0.08) % 360;
      el.style.setProperty("--aurora-angle", `${angle}deg`);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <div
        className="absolute inset-0 opacity-30"
        aria-hidden="true"
        style={{
          background: gradients[variant],
          backgroundSize: "200% 200%",
          filter: "blur(72px) saturate(1.4)",
          transform: "scale(1.2)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
