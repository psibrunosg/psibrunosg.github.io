import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import EscritaExpressiva from "@/components/exercicios/EscritaExpressiva";

export default function EscritaPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Escrita Expressiva | Bruno de Souza Gonçalves";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="Escrita Expressiva" subtitulo="10 minutos escrevendo sem filtro: tudo o que você sente, sem censura." tempo="10 min">
      <EscritaExpressiva />
    </ExercicioShell>
  );
}

