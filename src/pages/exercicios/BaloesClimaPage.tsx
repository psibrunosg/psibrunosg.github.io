import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import BaloesDoClima from "@/components/exercicios/BaloesDoClima";

export default function BaloesClimaPage() {
  useEffect(() => {
    document.title = "Balões do Clima | Bruno Souza";
  }, []);

  return (
    <ExercicioShell
      theme="lobo"
      titulo="Balões do Clima"
      subtitulo="Cada pensamento traz um clima diferente. Adivinhe se vai dar sol ou chuva antes de estourar o balão."
      tempo="3 min"
    >
      <BaloesDoClima />
    </ExercicioShell>
  );
}
