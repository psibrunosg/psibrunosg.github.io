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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const code = req.headers.get("X-Patient-Code");
    if (!code || !/^\d{5}(\d{3})?$/.test(code)) {
      return new Response(JSON.stringify({ error: "Invalid code" }), { status: 400, headers: jsonHeaders });
    }

    // GET: devolve a sessao de UM exercicio deste codigo.
    //
    // Existe para tirar o acesso anonimo direto de exercise_sessions. A policy
    // que o cliente usava era `to public using (code_is_active(code))` — o
    // predicado olha a linha, nao o chamador, entao conhecer um unico codigo
    // ativo dava leitura das sessoes de TODOS os codigos ativos. Aqui o codigo
    // vem do header e vira filtro obrigatorio, e o service role nunca sai deste
    // escopo.
    if (req.method === "GET") {
      const slug = new URL(req.url).searchParams.get("exercise_slug");
      if (!slug) {
        return new Response(JSON.stringify({ error: "Missing exercise_slug" }), { status: 400, headers: jsonHeaders });
      }

      const { data: sessao, error } = await supabase
        .from("exercise_sessions")
        .select("payload, score, partial, completed_at")
        .eq("code", code)
        .eq("exercise_slug", slug)
        .maybeSingle();

      if (error) {
        console.error("save-session GET error:", error);
        return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: jsonHeaders });
      }

      // Sem sessao ainda nao e erro: e a primeira vez que o paciente abre o
      // exercicio. O cliente cai no cache local.
      return new Response(JSON.stringify({ session: sessao ?? null }), { status: 200, headers: jsonHeaders });
    }

    const { exercise_slug, payload, score, partial } = await req.json();
    if (!exercise_slug) {
      return new Response(JSON.stringify({ error: "Missing exercise_slug" }), { status: 400, headers: jsonHeaders });
    }

    // Valida que o código existe e está ativo
    const { data: patient } = await supabase
      .from("patient_codes")
      .select("code")
      .eq("code", code)
      .eq("active", true)
      .single();

    if (!patient) {
      return new Response(JSON.stringify({ error: "Code not found or inactive" }), { status: 400, headers: jsonHeaders });
    }

    // Upsert: busca última sessão deste código/exercício, ou cria nova
    const { data: existing } = await supabase
      .from("exercise_sessions")
      .select("id")
      .eq("code", code)
      .eq("exercise_slug", exercise_slug)
      .order("started_at", { ascending: false })
      .limit(1)
      .single();

    const updates = {
      payload: payload || {},
      score: score || null,
      partial: partial !== false,
      completed_at: partial === false ? new Date().toISOString() : null,
    };

    if (existing) {
      // Update
      await supabase.from("exercise_sessions").update(updates).eq("id", existing.id);
    } else {
      // Insert
      await supabase.from("exercise_sessions").insert({ code, exercise_slug, ...updates });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: jsonHeaders });
  } catch (error) {
    console.error("save-session error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: jsonHeaders });
  }
});
