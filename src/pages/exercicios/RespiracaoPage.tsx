import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import RespiracaoGuiada from "@/components/exercicios/RespiracaoGuiada";

export default function RespiracaoPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Respiração Guiada | Bruno de Souza Gonçalves";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell
      titulo="Respiração Guiada"
      subtitulo="Técnica 4-7-8: inspire, segure, expire. Um ciclo simples para acalmar o sistema nervoso."
      tempo="5 min"
    >
      <RespiracaoGuiada />
    </ExercicioShell>
  );
}
