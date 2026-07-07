import { useMemo } from "react";
import { MIN_PARA_DESBLOQUEAR, TRILHAS, XP_POR_CONCLUSAO, type TrilhaTratamento, type TrilhaUnidade } from "@/content/trilhas";

// Progresso da trilha derivado do log local de conclusões (jardim_regas),
// alimentado por useExerciseSession.complete() em todos os exercícios.
// ponytail: local-first — progresso multi-dispositivo via exercise_sessions fica para depois do piloto.

interface Rega {
  slug: string;
  data: string;
}

export interface UnidadeProgresso extends TrilhaUnidade {
  concluidos: string[];
  desbloqueada: boolean;
  completa: boolean;
}

export interface TrilhaProgresso {
  trilha: TrilhaTratamento | null;
  unidades: UnidadeProgresso[];
  totalConcluidos: number;
  totalExercicios: number;
  pct: number;
  xp: number;
  streak: number;
}

function lerRegas(): Rega[] {
  try {
    const raw = JSON.parse(localStorage.getItem("jardim_regas") || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function diaLocal(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function calcularStreak(regas: Rega[]): number {
  const dias = new Set(regas.map((r) => diaLocal(r.data)));
  if (dias.size === 0) return 0;
  const cursor = new Date();
  // streak pode começar hoje ou ontem (dia ainda não praticado não quebra)
  if (!dias.has(diaLocal(cursor.toISOString()))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (dias.has(`${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`)) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function useTrilha(trilhaId: string): TrilhaProgresso {
  return useMemo(() => {
    const trilha = TRILHAS.find((t) => t.id === trilhaId) ?? null;
    const regas = lerRegas();
    const feitos = new Set(regas.map((r) => r.slug));

    const unidades: UnidadeProgresso[] = [];
    if (trilha) {
      trilha.unidades.forEach((u, i) => {
        const concluidos = u.exercicios.filter((e) => feitos.has(e.slug)).map((e) => e.slug);
        const anterior = unidades[i - 1];
        const desbloqueada =
          i === 0 ||
          (anterior != null &&
            anterior.concluidos.length >= Math.min(MIN_PARA_DESBLOQUEAR, anterior.exercicios.length));
        unidades.push({
          ...u,
          concluidos,
          desbloqueada,
          completa: concluidos.length === u.exercicios.length,
        });
      });
    }

    const totalExercicios = unidades.reduce((n, u) => n + u.exercicios.length, 0);
    const totalConcluidos = unidades.reduce((n, u) => n + u.concluidos.length, 0);

    return {
      trilha,
      unidades,
      totalConcluidos,
      totalExercicios,
      pct: totalExercicios ? Math.round((totalConcluidos / totalExercicios) * 100) : 0,
      xp: regas.length * XP_POR_CONCLUSAO,
      streak: calcularStreak(regas),
    };
  }, [trilhaId]);
}
