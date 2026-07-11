import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import LESSII from "@/components/exercicios/LESSII";

export default function LESSPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "LESS-II: Mapa de Esquemas | Bruno Souza";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="LESS-II: Mapa de Esquemas" subtitulo="Questionário de 10 itens mapeando seus esquemas núcleo mais ativados. Acompanhe evolução." tempo="6 min">
      <LESSII />
    </ExercicioShell>
  );
}

