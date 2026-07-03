import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import TortaResponsabilidade from "@/components/exercicios/TortaResponsabilidade";

export default function TortaPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Torta da Responsabilidade | Bruno SG";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="Torta da Responsabilidade" subtitulo="Distribua a culpa entre fatores (seu comportamento, circunstâncias, ação de outros, sorte). Reduza a culpa realista." tempo="4 min">
      <TortaResponsabilidade />
    </ExercicioShell>
  );
}
