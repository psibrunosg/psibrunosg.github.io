import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import ParesMente from "@/components/exercicios/ParesMente";

export default function ParesMentePage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Pares da Mente | Bruno Souza";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell
      titulo="Pares da Mente"
      subtitulo="Jogo de memória: empareille distorções com seus exemplos reais. Identifique padrões de pensamento."
      tempo="4 min"
    >
      <ParesMente />
    </ExercicioShell>
  );
}

