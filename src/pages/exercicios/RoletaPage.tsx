import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import RoletaTerapeutica from "@/components/exercicios/RoletaTerapeutica";

export default function RoletaPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Roleta do E Se | Bruno de Souza Gonçalves";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell
      titulo="Roleta do E Se?"
      subtitulo="Gire a roleta, encare um 'E se...?' e descubra o que acontece com a catástrofe quando você examina todos os finais possíveis."
      tempo="5 min"
    >
      <RoletaTerapeutica />
    </ExercicioShell>
  );
}

