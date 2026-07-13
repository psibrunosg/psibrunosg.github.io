import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import SeparandoTudo from "@/components/exercicios/SeparandoTudo";

export default function SeparandoTudoPage() {
  useEffect(() => {
    document.title = "Separando Tudo | Bruno de Souza Gonçalves";
  }, []);

  return (
    <ExercicioShell
      theme="lobo"
      titulo="Separando Tudo"
      subtitulo="O que aconteceu de verdade, o que sua cabeça pensou e o que seu corpo sentiu — são 3 coisas diferentes. Vamos separar?"
      tempo="4 min"
    >
      <SeparandoTudo />
    </ExercicioShell>
  );
}
