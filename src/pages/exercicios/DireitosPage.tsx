import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import ConstruorDireitos from "@/components/exercicios/ConstruorDireitos";

export default function DireitosPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Construtor de Direitos | Bruno Souza";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="Construtor de Direitos" subtitulo="Construa sua declaração peça por peça: direito → ação permitida → sentimento." tempo="6 min">
      <ConstruorDireitos />
    </ExercicioShell>
  );
}

