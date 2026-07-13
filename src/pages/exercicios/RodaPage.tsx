import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import RodaEmocoes from "@/components/exercicios/RodaEmocoes";

export default function RodaPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Roda das Emoções | Bruno de Souza Gonçalves";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="Roda das Emoções" subtitulo="Nomeie e avalie intensidade. Nomear reduz o poder da emoção." tempo="4 min">
      <RodaEmocoes />
    </ExercicioShell>
  );
}

