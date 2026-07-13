import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import MuralhaEvidencias from "@/components/exercicios/MuralhaEvidencias";

export default function MuralhaEvidenciasPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Muralha de Evidências | Bruno de Souza Gonçalves";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell
      titulo="Muralha de Evidências"
      subtitulo="Teste um pensamento contra a realidade. Construa uma muralha de evidências em 3 rodadas para reformular crenças limitantes."
      tempo="10 min"
    >
      <MuralhaEvidencias />
    </ExercicioShell>
  );
}

