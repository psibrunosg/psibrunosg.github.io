import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import OculosEsquemas from "@/components/exercicios/OculosEsquemas";

export default function OculosPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Óculos dos Esquemas | Bruno Souza";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="Óculos dos Esquemas" subtitulo="Mini-game: reconheça padrão de esquema em 3 cenários. Quiz rápido." tempo="4 min">
      <OculosEsquemas />
    </ExercicioShell>
  );
}

