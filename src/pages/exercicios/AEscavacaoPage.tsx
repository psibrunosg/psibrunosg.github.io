import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import AEscavacao from "@/components/exercicios/AEscavacao";

export default function AEscavacaoPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "A Escavação | Bruno de Souza Gonçalves";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="A Escavação" subtitulo="Cave camadas: e se fosse verdade? Descubra as crenças-núcleo profundas." tempo="8 min">
      <AEscavacao />
    </ExercicioShell>
  );
}

