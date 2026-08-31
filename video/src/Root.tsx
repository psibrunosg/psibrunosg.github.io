import { Composition } from "remotion";
import { PrivacaoEmocional } from "./compositions/PrivacaoEmocional";
import { NeuroLutaFuga } from "./compositions/NeuroLutaFuga";

const FPS = 30;
const BEAT_FRAMES = 135; // ~4.5s por beat
const BEATS = 8;
const DURATION = BEAT_FRAMES * BEATS + 60; // + respiro final

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PrivacaoEmocional"
        component={PrivacaoEmocional}
        durationInFrames={DURATION}
        fps={FPS}
        width={1080}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="NeuroLutaFuga"
        component={NeuroLutaFuga}
        durationInFrames={Math.round(FPS * 4.0) * 6 + 60} // 6 beats * 4.0s + respiro
        fps={FPS}
        width={1080}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
