interface Props {
  from: string;
  to: string;
  height?: number;
  flip?: boolean;
}

export function WaveDivider({ from, to, height = 72, flip = false }: Props) {
  return (
    <div
      style={{ background: from, lineHeight: 0, fontSize: 0 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 72"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{
          display: "block",
          width: "100%",
          height,
          transform: flip ? "scaleX(-1)" : undefined,
        }}
      >
        <path
          d="M0,36 C240,72 480,0 720,36 C960,72 1200,0 1440,36 L1440,72 L0,72 Z"
          style={{ fill: to }}
        />
      </svg>
    </div>
  );
}
