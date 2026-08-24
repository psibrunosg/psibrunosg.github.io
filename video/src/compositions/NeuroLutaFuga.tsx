import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing, Audio, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { BrainModelRemotion } from "./BrainModelRemotion";

const BEATS: { id: string, texto: string; activePart: string }[] = [
  {
    id: "intro",
    texto: "Você já sentiu o coração acelerar do nada? Isso é o seu cérebro acionando o modo Luta ou Fuga.",
    activePart: "all",
  },
  {
    id: "amygdala",
    texto: "Tudo começa aqui, na Amígdala. Ela é o nosso sistema de alarme, focada em detectar ameaças em frações de segundo.",
    activePart: "amygdala",
  },
  {
    id: "brainstem",
    texto: "O alarme desce para o Tronco Encefálico, disparando batimentos cardíacos rápidos e respiração ofegante.",
    activePart: "brainstem",
  },
  {
    id: "prefrontal",
    texto: "Enquanto isso, o Córtex Pré-Frontal tenta avaliar a situação de forma lógica.",
    activePart: "prefrontal",
  },
  {
    id: "conflict",
    texto: "Mas, num estado de estresse agudo, a Amígdala rouba a energia, desligando nosso lado racional.",
    activePart: "conflict",
  },
  {
    id: "conclusion",
    texto: "Por isso, a primeira etapa para acalmar a mente é acalmar o corpo. Respire fundo e devolva o controle ao Córtex Pré-Frontal.",
    activePart: "prefrontal",
  }
];

const BG = "#050505"; // Premium pitch black para destacar o bloom 3D
const INK = "#f8fafc"; // slate-50

function BeatText({ index, drawFrames }: { index: number; drawFrames: number }) {
  const local = useCurrentFrame();
  const beat = BEATS[index];

  // Fade in and out effect for text
  const captionOpacity = interpolate(local, [drawFrames * 0.2, drawFrames * 0.2 + 20, 100, 120], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Slide up effect for premium feel
  const translateY = interpolate(local, [drawFrames * 0.2, drawFrames * 0.2 + 20], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic)
  });

  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 100,
          right: 100,
          opacity: captionOpacity,
          transform: `translateY(${translateY}px)`,
          fontFamily: "Inter, sans-serif",
          fontSize: 32,
          lineHeight: 1.5,
          color: INK,
          textAlign: "center",
          fontWeight: 400,
          letterSpacing: "-0.5px",
          padding: "32px 48px",
          borderRadius: "24px",
          backgroundColor: "rgba(15, 23, 42, 0.4)", // Glassmorphism
          backdropFilter: "blur(12px)", // Glassmorphism blur
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)", // Premium shadow
        }}
      >
        {beat.texto}
      </div>
      <div style={{
          position: "absolute",
          top: 60,
          left: 60,
          fontSize: 16,
          color: "rgba(255,255,255,0.4)",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          letterSpacing: "4px"
        }}>
        {String(index + 1).padStart(2, '0')} / {String(BEATS.length).padStart(2, '0')}
      </div>

      {/* Aqui carregamos o áudio (se ele não existir, o build da remotion loga um aviso). */}
      <Audio src={staticFile(`audio/${beat.id}.mp3`)} />
    </>
  );
}

export const NeuroLutaFuga: React.FC = () => {
  const { fps, width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  const BEAT_FRAMES = Math.round(fps * 4.0); // Reduzido de 6.5 para 4.0s para ser mais dinâmico
  const DRAW_FRAMES = Math.round(fps * 1.5);

  // Calcula qual é o beat atual baseado no frame
  const currentBeatIndex = Math.min(Math.floor(frame / BEAT_FRAMES), BEATS.length - 1);
  const activePart = BEATS[currentBeatIndex]?.activePart || "all";

  // Câmera muito mais dinâmica: viaja pelo cérebro em cada fase
  const cameraZ = interpolate(frame, [0, BEAT_FRAMES * BEATS.length], [15, 30]);
  const cameraY = interpolate(frame, [0, BEAT_FRAMES * BEATS.length], [5, 2]);
  const cameraX = interpolate(frame, [0, BEAT_FRAMES * BEATS.length], [-5, 5]);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Camada 3D */}
      <ThreeCanvas width={width} height={height} camera={{ position: [cameraX, cameraY, cameraZ], fov: 45 }}>
         <BrainModelRemotion activePart={activePart} />
      </ThreeCanvas>

      {/* Camada UI Textual sobreposta */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", paddingTop: 32, fontFamily: "Inter, sans-serif", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: "#94a3b8", fontWeight: 700 }}>
        Anatomia do Estresse
      </div>

      {BEATS.map((_, i) => (
        <Sequence key={i} from={i * BEAT_FRAMES} durationInFrames={BEAT_FRAMES + (i === BEATS.length - 1 ? 60 : 0)} layout="none">
          <BeatText index={i} drawFrames={DRAW_FRAMES} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
