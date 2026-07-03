import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import RegistroV2 from "@/components/exercicios/RegistroV2";

export default function RegistroPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Registro de Pensamentos | Bruno SG";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell
      titulo="Registro de Pensamentos"
      subtitulo="Estrutura gamificada para identificar, questionar e reformular pensamentos automáticos através de um diálogo interativo."
      tempo="8 min"
    >
      <RegistroV2 />
    </ExercicioShell>
  );
}
