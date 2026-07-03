import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import RodaEmocoes from "@/components/exercicios/RodaEmocoes";

export default function RodaPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Roda das Emoções | Bruno SG";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="Roda das Emoções" subtitulo="Nomeie e avalie intensidade. Nomear reduz o poder da emoção." tempo="4 min">
      <RodaEmocoes />
    </ExercicioShell>
  );
}
