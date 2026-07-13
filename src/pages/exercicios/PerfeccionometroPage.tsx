import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import Perfeccionometro from "@/components/exercicios/Perfeccionometro";

export default function PerfeccionometroPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Perfeccionometro | Bruno de Souza Gonçalves";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="Perfeccionômetro" subtitulo="Avalie rigidez em 6 facetas. Radar mostra onde você gasta energia em perfeição." tempo="4 min">
      <Perfeccionometro />
    </ExercicioShell>
  );
}

