import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import LaboratorioPrevisoes from "@/components/exercicios/LaboratorioPrevisoes";

export default function LabPrevisaoPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Laboratório de Previsões | Bruno Souza";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="Laboratório de Previsões" subtitulo="Registre previsões testáveis com prazo. Revise resultados e calcule sua taxa de acerto. Desafie a catastrofização." tempo="5 min">
      <LaboratorioPrevisoes />
    </ExercicioShell>
  );
}

