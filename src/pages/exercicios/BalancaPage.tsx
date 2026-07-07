import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import BalancaTerapeutica from "@/components/exercicios/BalancaTerapeutica";

export default function BalancaPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Balança de Evidências | Bruno SG";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell
      titulo="Balança de Evidências"
      subtitulo="Coloque um pensamento na balança: só fatos pesam. Sentimentos e suposições ficam de fora — separar os dois é o jogo."
      tempo="4 min"
    >
      <BalancaTerapeutica />
    </ExercicioShell>
  );
}
