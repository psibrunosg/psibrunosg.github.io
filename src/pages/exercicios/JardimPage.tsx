import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import JardimMente from "@/components/exercicios/JardimMente";

export default function JardimPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Jardim da Mente | Bruno Souza";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell
      titulo="Jardim da Mente"
      subtitulo="Visualize seu progresso. Cada sessão concluída rega uma planta que cresce ao longo de semanas. Compartilhado com seu terapeuta."
      tempo="1 min"
    >
      <JardimMente />
    </ExercicioShell>
  );
}

