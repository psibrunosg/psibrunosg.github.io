import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import InundacaoIncertezas from "@/components/exercicios/InundacaoIncertezas";

export default function InundacaoPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Inundação com Incertezas | Bruno Souza";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="Inundação com Incertezas" subtitulo="Explore cenários; ajuste quanto de incerteza você aguenta. Gradualmente aumente tolerância." tempo="7 min">
      <InundacaoIncertezas />
    </ExercicioShell>
  );
}

