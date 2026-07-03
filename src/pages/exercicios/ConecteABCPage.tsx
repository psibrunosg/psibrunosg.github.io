import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import ConecteABC from "@/components/exercicios/ConecteABC";

export default function ConecteABCPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Conecte A-B-C | Bruno SG";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="Conecte A-B-C" subtitulo="Mapeie a cadeia: Evento → Pensamento → Emoção → Comportamento. Veja como mudar B transforma C e D." tempo="5 min">
      <ConecteABC />
    </ExercicioShell>
  );
}
