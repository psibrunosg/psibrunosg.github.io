import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import FantasiaTemida from "@/components/exercicios/FantasiaTemida";

export default function FantasiaPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Fantasia Temida | Bruno Souza";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="Fantasia Temida" subtitulo="Redija o pior caso, o melhor, e o realista. Compare: seu medo vs. realidade." tempo="10 min">
      <FantasiaTemida />
    </ExercicioShell>
  );
}

