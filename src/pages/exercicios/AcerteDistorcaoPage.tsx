import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import AcerteDistorcao from "@/components/exercicios/AcerteDistorcao";

export default function AcerteDistorcaoPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Acerte a Distorção | Bruno Souza";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell
      titulo="Acerte a Distorção"
      subtitulo="Identifique pensamentos distorcidos em tempo real. Um jogo arcade rápido onde você bate em pensamentos distorcidos e deixa passar os equilibrados."
      tempo="3 min"
    >
      <AcerteDistorcao />
    </ExercicioShell>
  );
}

