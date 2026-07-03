import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import Bussola from "@/components/exercicios/Bussola";

export default function BussolaPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Bussola de Valores | Bruno SG";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="Bussola de Valores" subtitulo="Ordene seus valores: do mais ao menos importante. Identifique seus 3 principais." tempo="5 min">
      <Bussola />
    </ExercicioShell>
  );
}
