import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import BalaoPensamentos from "@/components/exercicios/BalaoPensamentos";

export default function BalaoPensamentosPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Balão de Pensamentos | Bruno de Souza Gonçalves";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell
      titulo="Balão de Pensamentos"
      subtitulo="Digite um pensamento desconfortável e escolha uma metáfora para observá-lo passar sem lutar contra."
      tempo="3 min"
    >
      <BalaoPensamentos />
    </ExercicioShell>
  );
}

