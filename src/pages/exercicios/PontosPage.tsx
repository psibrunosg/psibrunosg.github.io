import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import PontosTensao from "@/components/exercicios/PontosTensao";

export default function PontosPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Pontos de Tensão | Bruno SG";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="Pontos de Tensão" subtitulo="Mapeie disparadores → emoção → ação impulsiva → custo → alternativa. 3 situações." tempo="8 min">
      <PontosTensao />
    </ExercicioShell>
  );
}
