import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import DiarioLapsos from "@/components/exercicios/DiarioLapsos";

export default function DiarioPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Diário de Lapsos | Bruno Souza";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="Diário de Lapsos" subtitulo="Reconstrói cadeia do lapso: disparador→reação→consequência→lição." tempo="8 min">
      <DiarioLapsos />
    </ExercicioShell>
  );
}

