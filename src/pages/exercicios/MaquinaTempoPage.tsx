import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import MaquinaDoTempo from "@/components/exercicios/MaquinaDoTempo";

export default function MaquinaTempoPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Máquina do Tempo | Bruno SG";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="Máquina do Tempo" subtitulo="Viaje 1sem/1mês/1ano/5anos. Veja como a importância da sua preocupação decai naturalmente." tempo="5 min">
      <MaquinaDoTempo />
    </ExercicioShell>
  );
}
