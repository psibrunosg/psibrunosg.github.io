import React, { useRef, useState, useLayoutEffect } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

// Vídeo piloto whiteboard: "Privação Emocional" (domínio d1, Vínculo seguro).
// Texto copiado de src/content/psicoed/narrativas-esquemas.ts (id: "ed") — projeto
// separado do site (Remotion não compartilha bundler com o Vite), fonte de
// verdade do TEXTO é o arquivo de conteúdo do site; aqui é só a versão lida em voz.
const BEATS: { texto: string; icone: "coracao" | "vazio" | "muro" | "hoje" | "vozes" | "gatilho" | "porta" | "passo" }[] = [
  {
    texto:
      "Era uma criança que sentia coisas grandes por dentro. Ela precisava que alguém percebesse, chegasse perto e dissesse: eu tô aqui, me conta.",
    icone: "coracao",
  },
  {
    texto:
      "Nem sempre teve quem notasse. Os adultos estavam cansados, ocupados, ou também nunca aprenderam a se aproximar assim.",
    icone: "vazio",
  },
  {
    texto:
      "A criança aprendeu, sem perceber, uma regra silenciosa: minhas necessidades não vão ser atendidas de qualquer jeito. E parou de pedir.",
    icone: "muro",
  },
  {
    texto:
      "Hoje essa regra às vezes ainda funciona por baixo do pano. Você pode se sentir sozinho mesmo cercado de gente.",
    icone: "hoje",
  },
  {
    texto:
      "Quando isso é tocado, a Criança Vulnerável assume, com a sensação crua de ninguém vai me entender de verdade.",
    icone: "vozes",
  },
  {
    texto: "Um dia difícil em que você queria que alguém perguntasse como você está. E ninguém perguntou.",
    icone: "gatilho",
  },
  {
    texto: "Essa necessidade atendida parece simples: alguém que percebe, que pergunta, que fica.",
    icone: "porta",
  },
  {
    texto: "Um passo pequeno: da próxima vez, tente nomear o vazio em vez de desligar. E dizer isso pra alguém de confiança.",
    icone: "passo",
  },
];

const BG = "#F7F1E6"; // papel quente, casa com --c-bg do site
const INK = "#3A2A1F"; // tinta escura
const ACCENT = "#6B8BA4"; // cor da necessidade d1 (vínculo seguro), igual necessidades.d1.cor

// Desenha um path progressivamente (efeito "traço de caneta"), sincronizado ao frame.
function useDrawProgress(startFrame: number, drawFrames: number) {
  const frame = useCurrentFrame();
  return interpolate(frame, [startFrame, startFrame + drawFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });
}

function TracoPath({ d, progress, ...props }: { d: string; progress: number } & React.SVGProps<SVGPathElement>) {
  const ref = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);
  useLayoutEffect(() => {
    if (ref.current) setLen(ref.current.getTotalLength());
  }, [d]);
  return (
    <path
      ref={ref}
      d={d}
      fill="none"
      stroke={INK}
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={len}
      strokeDashoffset={len * (1 - progress)}
      {...props}
    />
  );
}

// Ícones em linha única, estilo desenho à mão, um por beat, reaproveitando o
// mesmo canvas (a cena vai se acumulando, como num quadro branco de verdade).
function Icone({ tipo, progress }: { tipo: (typeof BEATS)[number]["icone"]; progress: number }) {
  switch (tipo) {
    case "coracao":
      return <TracoPath progress={progress} d="M270,220 C230,180 150,180 150,250 C150,320 270,380 270,380 C270,380 390,320 390,250 C390,180 310,180 270,220 Z" />;
    case "vazio":
      return (
        <>
          <TracoPath progress={progress} d="M120,260 Q270,180 420,260" stroke={ACCENT} />
          <TracoPath progress={progress} d="M270,150 L270,110 M240,130 L210,100 M300,130 L330,100" />
        </>
      );
    case "muro":
      return (
        <>
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <TracoPath
                key={`${row}-${col}`}
                progress={progress}
                d={`M${140 + col * 70},${180 + row * 55} h60`}
              />
            ))
          )}
        </>
      );
    case "hoje":
      return (
        <>
          <TracoPath progress={progress} d="M270,150 a70,70 0 1,0 0.1,0 Z" />
          <TracoPath progress={progress} d="M240,270 q30,30 60,0" stroke={ACCENT} />
        </>
      );
    case "vozes":
      return (
        <>
          <TracoPath progress={progress} d="M150,180 h140 v80 h-90 l-30,30 v-30 h-20 Z" />
          <TracoPath progress={progress} d="M290,260 h140 v80 h-20 v30 l-30,-30 h-90 Z" stroke={ACCENT} />
        </>
      );
    case "gatilho":
      return <TracoPath progress={progress} d="M300,140 L200,280 L260,280 L230,400 L360,240 L290,240 Z" stroke={ACCENT} strokeWidth={6} />;
    case "porta":
      return (
        <>
          <TracoPath progress={progress} d="M190,380 v-220 h160 v220" />
          <TracoPath progress={progress} d="M310,270 a6,6 0 1,0 0.1,0 Z" stroke={ACCENT} />
        </>
      );
    case "passo":
      return (
        <>
          <TracoPath progress={progress} d="M200,350 q-10,-40 20,-50 q30,-10 20,30 q-10,30 -40,20 Z" />
          <TracoPath progress={progress} d="M320,270 q-10,-40 20,-50 q30,-10 20,30 q-10,30 -40,20 Z" stroke={ACCENT} />
        </>
      );
  }
}

function Beat({ index, drawFrames }: { index: number; drawFrames: number }) {
  const local = useCurrentFrame(); // já vem local: dentro da <Sequence>, frame 0 = início do beat
  const progress = useDrawProgress(0, drawFrames);
  const beat = BEATS[index];

  const captionOpacity = interpolate(local, [drawFrames * 0.3, drawFrames * 0.3 + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <svg viewBox="0 0 540 460" style={{ position: "absolute", top: 60, left: "50%", transform: "translateX(-50%)", width: 480 }}>
        <Icone tipo={beat.icone} progress={progress} />
      </svg>
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 80,
          right: 80,
          opacity: captionOpacity,
          fontFamily: "Georgia, serif",
          fontSize: 34,
          lineHeight: 1.4,
          color: INK,
          textAlign: "center",
        }}
      >
        {beat.texto}
      </div>
      <div style={{ position: "absolute", top: 40, left: 40, fontSize: 20, color: ACCENT, fontFamily: "Georgia, serif", fontStyle: "italic" }}>
        {index + 1} / {BEATS.length}
      </div>
    </>
  );
}

export const PrivacaoEmocional: React.FC = () => {
  const { fps } = useVideoConfig();
  const BEAT_FRAMES = Math.round(fps * 4.5);
  const DRAW_FRAMES = Math.round(fps * 2);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", paddingTop: 24, fontFamily: "Georgia, serif", fontSize: 16, letterSpacing: 3, textTransform: "uppercase", color: ACCENT }}>
        De onde vêm seus padrões · Privação Emocional
      </div>
      {BEATS.map((_, i) => (
        <Sequence key={i} from={i * BEAT_FRAMES} durationInFrames={BEAT_FRAMES + (i === BEATS.length - 1 ? 60 : 0)} layout="none">
          <Beat index={i} drawFrames={DRAW_FRAMES} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
