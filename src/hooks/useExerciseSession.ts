import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface ExerciseSessionState {
  payload: Record<string, unknown>;
  score?: number;
  partial: boolean;
  completedAt?: string;
}

const SAVE_DEBOUNCE_MS = 500;

async function postSession(slug: string, body: Record<string, unknown>) {
  const code = localStorage.getItem("exercise_patient_code");
  if (!code || !supabase) return;
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Patient-Code": code },
      body: JSON.stringify({ exercise_slug: slug, ...body }),
    });
    if (!response.ok) {
      console.warn("save-session failed:", await response.text());
    }
  } catch (e) {
    console.error("save-session error:", e);
  }
}

// Rega o Jardim da Mente: no máximo UMA por slug por dia.
// Vários exercícios chamam complete() a cada balão solto / replay / revisão;
// sem esse guarda, XP, streak e jardim medem clique em vez de prática.
function regarUmaVezPorDia(slug: string) {
  const agora = new Date();
  try {
    const regas = JSON.parse(localStorage.getItem("jardim_regas") || "[]") as Array<{ slug: string; data: string }>;
    const hoje = agora.toDateString();
    if (regas.some((r) => r.slug === slug && new Date(r.data).toDateString() === hoje)) return;
    regas.push({ slug, data: agora.toISOString() });
    localStorage.setItem("jardim_regas", JSON.stringify(regas));
  } catch {
    localStorage.setItem("jardim_regas", JSON.stringify([{ slug, data: agora.toISOString() }]));
  }
}

export function useExerciseSession(slug: string) {
  const [state, setState] = useState<ExerciseSessionState>({ payload: {}, partial: true });
  const [loading, setLoading] = useState(true);
  // stateRef é a fonte da verdade para as escritas: setState é assíncrono e
  // o save com debounce precisa gravar o payload mais recente, não o do render.
  const stateRef = useRef<ExerciseSessionState>(state);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const apply = useCallback((next: ExerciseSessionState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  // Carrega estado salvo do localStorage.
  // ponytail: leitura do DB (exercise_sessions) fica para outra rodada — o save já persiste lá.
  useEffect(() => {
    (async () => {
      setLoading(true);
      const local = localStorage.getItem(`exercise_${slug}`);
      if (local) {
        try {
          apply(JSON.parse(local));
        } catch {
          // Fallback
        }
      }
      setLoading(false);
    })();
  }, [slug, apply]);

  // Limpa o timer no unmount: nada de gravar depois de desmontado.
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // Save com debounce de 500ms — payload é MESCLADO ao anterior (saves parciais
  // não apagam campos já salvos). O estado em memória atualiza na hora; só as
  // escritas (localStorage + POST) esperam, senão um arrasto de slider gera dezenas.
  const save = useCallback(
    (newPayload: Record<string, unknown>, options?: { partial?: boolean }) => {
      const prev = stateRef.current;
      apply({
        ...prev,
        payload: { ...prev.payload, ...newPayload },
        partial: options?.partial !== false,
      });

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        const atual = stateRef.current;
        localStorage.setItem(`exercise_${slug}`, JSON.stringify(atual));
        postSession(slug, { payload: atual.payload, partial: atual.partial });
      }, SAVE_DEBOUNCE_MS);
    },
    [slug, apply]
  );

  // Complete (marca completo, envia score) — imediato, sem debounce.
  const complete = useCallback(
    (score: number) => {
      // Cancela o save pendente: a gravação abaixo já leva o payload mais recente,
      // e um POST partial:true chegando depois marcaria a sessão como incompleta.
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      regarUmaVezPorDia(slug);

      const updated: ExerciseSessionState = {
        ...stateRef.current,
        score,
        partial: false,
        completedAt: new Date().toISOString(),
      };
      apply(updated);
      localStorage.setItem(`exercise_${slug}`, JSON.stringify(updated));
      postSession(slug, { payload: updated.payload, score, partial: false });
    },
    [slug, apply]
  );

  return { state, loading, save, complete };
}
