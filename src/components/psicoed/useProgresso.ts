import { useEffect, useState } from "react";
import { useExerciseSession } from "@/hooks/useExerciseSession";

/**
 * Hook de progresso dos módulos de psicoeducação.
 *
 * Persiste NO BANCO reutilizando a tabela exercise_sessions já existente
 * (via useExerciseSession), com exercise_slug prefixado "psicoed:{moduloId}".
 * Sem código de paciente: funciona normalmente, apenas fica local
 * (localStorage), sem persistir no banco — hasCode indica esse estado
 * para a UI mostrar um aviso discreto.
 */
export function useProgresso(moduloId: string) {
  const session = useExerciseSession(`psicoed:${moduloId}`);
  const [hasCode, setHasCode] = useState(false);

  useEffect(() => {
    setHasCode(!!localStorage.getItem("exercise_patient_code"));
  }, []);

  return { ...session, hasCode };
}
