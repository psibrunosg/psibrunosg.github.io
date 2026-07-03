import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import CacaFatos from "@/components/exercicios/CacaFatos";

export default function CacaFatosPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Caça aos Fatos | Bruno SG";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell
      titulo="Caça aos Fatos"
      subtitulo="Encontre os fatos favoráveis que o pensamento negativo ignora. Desafie conclusões precipitadas."
      tempo="4 min"
    >
      <CacaFatos />
    </ExercicioShell>
  );
}
