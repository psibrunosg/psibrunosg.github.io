import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import GPSDecisoes from "@/components/exercicios/GPSDecisoes";

export default function GPSPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "GPS de Decisões | Bruno SG";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="GPS de Decisões" subtitulo="Chat ramificado mapeando: curto/longo prazo, custos irrecuperáveis, humor, perdas, arrependimento." tempo="6 min">
      <GPSDecisoes />
    </ExercicioShell>
  );
}
