import { useEffect } from "react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import CartaFonte from "@/components/exercicios/CartaFonte";

export default function CartaPage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Carta à Fonte do Esquema | Bruno Souza";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ExercicioShell titulo="Carta à Fonte do Esquema" subtitulo="Diálogo imaginário com figura significativa que ensinou este padrão." tempo="10 min">
      <CartaFonte />
    </ExercicioShell>
  );
}

