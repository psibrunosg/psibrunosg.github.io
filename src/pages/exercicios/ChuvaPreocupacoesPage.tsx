import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import ChuvaPreocupacoes from "@/components/exercicios/ChuvaPreocupacoes";

export default function ChuvaPreocupacoesPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Chuva de Preocupações | Bruno SG";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell
      titulo="Chuva de Preocupações"
      subtitulo="Sorting arcade: preocupações caem, você arrasta para 'ação hoje' ou 'estacionamento'. Aprenda a categorizar."
      tempo="3 min"
    >
      <ChuvaPreocupacoes />
    </ExercicioShell>
  );
}
