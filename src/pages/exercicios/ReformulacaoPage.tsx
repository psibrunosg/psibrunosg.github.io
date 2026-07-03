import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import ReformulacaoHistoria from "@/components/exercicios/ReformulacaoHistoria";

export default function ReformulacaoPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Reformulação de História | Bruno SG";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="Reformulação de História" subtitulo="Sua narrativa, seus fatos. Mude a interpretação, não a realidade." tempo="10 min">
      <ReformulacaoHistoria />
    </ExercicioShell>
  );
}
