import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-patient-code",
};
const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

const THERAPIST_USER_ID = "d0dddd26-7dd0-4b5c-911a-7d541c7826e6";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: jsonHeaders });

    // Valida assinatura do token (terapeuta autenticado) — jwtDecode não verifica nada.
    const token = authHeader.replace("Bearer ", "");
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData.user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: jsonHeaders });

    if (authData.user.id !== THERAPIST_USER_ID) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: jsonHeaders });
    }

    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code) {
      return new Response(JSON.stringify({ error: "Missing code parameter" }), { status: 400, headers: jsonHeaders });
    }

    // Busca todas as sessões deste paciente
    const { data: sessions, error } = await supabase
      .from("exercise_sessions")
      .select("id, exercise_slug, score, partial, completed_at, started_at")
      .eq("code", code)
      .order("started_at", { ascending: false });

    if (error) throw error;

    // Conta sessões completas (Jardim)
    const completed = (sessions || []).filter((s) => s.completed_at).length;

    // Frequência por exercício (últimas 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = (sessions || []).filter((s) => new Date(s.started_at) > thirtyDaysAgo);
    const byExercise = new Map<string, number>();
    for (const s of recent) {
      byExercise.set(s.exercise_slug, (byExercise.get(s.exercise_slug) || 0) + 1);
    }

    return new Response(JSON.stringify({
      code,
      total_sessions: sessions?.length || 0,
      completed_sessions: completed,
      sessions_last_30_days: recent.length,
      by_exercise: Object.fromEntries(byExercise),
      recent_sessions: (sessions || []).slice(0, 10),
    }), { status: 200, headers: jsonHeaders });
  } catch (error) {
    console.error("patient-progress error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: jsonHeaders });
  }
});
