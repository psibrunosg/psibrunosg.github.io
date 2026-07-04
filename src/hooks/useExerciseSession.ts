import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface ExerciseSessionState {
  payload: Record<string, unknown>;
  score?: number;
  partial: boolean;
  completedAt?: string;
}


export function useExerciseSession(slug: string) {
  const [state, setState] = useState<ExerciseSessionState>({ payload: {}, partial: true });
  const [loading, setLoading] = useState(true);

  // Carrega estado salvo (DB se logado, localStorage local)
  useEffect(() => {
    (async () => {
      setLoading(true);
      const code = localStorage.getItem("exercise_patient_code");

      if (code) {
        // Fetch from DB via save-session endpoint (GET não existe, usar patient-progress?)
        // Por enquanto, carrega do localStorage + DB será feito no save
        const localKey = `exercise_${slug}`;
        const local = localStorage.getItem(localKey);
        if (local) {
          try {
            setState(JSON.parse(local));
          } catch {
            // Fallback
          }
        }
      } else {
        // Anônimo: localStorage local
        const localKey = `exercise_${slug}`;
        const local = localStorage.getItem(localKey);
        if (local) {
          try {
            setState(JSON.parse(local));
          } catch {
            // Fallback
          }
        }
      }
      setLoading(false);
    })();
  }, [slug]);

  // Save com debounce — payload é MESCLADO ao anterior (saves parciais não apagam campos já salvos)
  const save = useCallback(
    (newPayload: Record<string, unknown>, options?: { partial?: boolean }) => {
      setState((prev) => {
        const mergedPayload = { ...prev.payload, ...newPayload };
        const updated = {
          ...prev,
          payload: mergedPayload,
          partial: options?.partial !== false,
        };

        // Salva localmente sempre
        localStorage.setItem(`exercise_${slug}`, JSON.stringify(updated));

        // Se tem código, envia pra DB
        const code = localStorage.getItem("exercise_patient_code");
        if (code && supabase) {
          (async () => {
            try {
              const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-session`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "X-Patient-Code": code,
                  },
                  body: JSON.stringify({
                    exercise_slug: slug,
                    payload: mergedPayload,
                    partial: options?.partial !== false,
                  }),
                }
              );
              if (!response.ok) {
                console.warn("save-session failed:", await response.text());
              }
            } catch (e) {
              console.error("save-session error:", e);
            }
          })();
        }

        return updated;
      });
    },
    [slug]
  );

  // Complete (marca completo, envia score)
  const complete = useCallback(
    (score: number) => {
      // Rega o Jardim da Mente: log local de sessões concluídas (por slug + data)
      try {
        const regas = JSON.parse(localStorage.getItem("jardim_regas") || "[]") as Array<{ slug: string; data: string }>;
        regas.push({ slug, data: new Date().toISOString() });
        localStorage.setItem("jardim_regas", JSON.stringify(regas));
      } catch {
        localStorage.setItem("jardim_regas", JSON.stringify([{ slug, data: new Date().toISOString() }]));
      }

      setState((prev) => {
        const updated = {
          ...prev,
          score,
          partial: false,
          completedAt: new Date().toISOString(),
        };
        localStorage.setItem(`exercise_${slug}`, JSON.stringify(updated));

        // DB com partial: false
        const code = localStorage.getItem("exercise_patient_code");
        if (code && supabase) {
          (async () => {
            try {
              const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-session`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "X-Patient-Code": code,
                  },
                  body: JSON.stringify({
                    exercise_slug: slug,
                    payload: prev.payload,
                    score,
                    partial: false,
                  }),
                }
              );
              if (!response.ok) {
                console.warn("save-session (complete) failed:", await response.text());
              }
            } catch (e) {
              console.error("save-session (complete) error:", e);
            }
          })();
        }

        return updated;
      });
    },
    [slug]
  );

  return { state, loading, save, complete };
}
