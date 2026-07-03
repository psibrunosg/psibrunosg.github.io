import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import TecnicaTedio from "@/components/exercicios/TecnicaTedio";

export default function TedioPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Técnica do Tédio | Bruno SG";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="Técnica do Tédio" subtitulo="Observe a sensação sem evitar. O tédio é uma onda que sobe, fica e desce." tempo="5 min">
      <TecnicaTedio />
    </ExercicioShell>
  );
}
