import { motion } from "framer-motion";

interface SpeedLinesProps {
  color?: string;
  density?: number;
  className?: string;
}

export default function SpeedLines({
  color = "#ffffff",
  density = 48,
  className = "",
}: SpeedLinesProps) {
  const lines = Array.from({ length: density }, (_, i) => {
    const angle = (i / density) * 360;
    const length = 40 + (i % 5) * 20;
    const width = 1 + (i % 3);
    return { angle, length, width, delay: (i % 8) * 0.02 };
  });

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="speedFade">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="40%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#speedFade)" />
        {lines.map((line, i) => (
          <motion.line
            key={i}
            x1="50%"
            y1="50%"
            x2={`${50 + line.length * Math.cos((line.angle * Math.PI) / 180)}%`}
            y2={`${50 + line.length * Math.sin((line.angle * Math.PI) / 180)}%`}
            stroke={color}
            strokeWidth={line.width}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.8, 0] }}
            transition={{
              duration: 0.6,
              delay: line.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
