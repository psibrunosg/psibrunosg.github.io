import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import CofreForças from "@/components/exercicios/CofreForças";

export default function ForcasPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Cofre de Forças | Bruno Souza";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="Cofre de Forças" subtitulo="Colete suas superações: cada adversidade vencida é um recurso seu." tempo="7 min">
      <CofreForças />
    </ExercicioShell>
  );
}

