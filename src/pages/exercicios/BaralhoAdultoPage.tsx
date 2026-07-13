import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import BaralhoAdulto from "@/components/exercicios/BaralhoAdulto";

export default function BaralhoAdultoPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Baralho Adulto | Bruno de Souza Gonçalves";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell
      titulo="Baralho Adulto"
      subtitulo="Distorções cognitivas como arquétipos sóbrios. Explore padrões de pensamento disfuncional em contextos profissionais e pessoais."
      tempo="5 min"
    >
      <BaralhoAdulto />
    </ExercicioShell>
  );
}

