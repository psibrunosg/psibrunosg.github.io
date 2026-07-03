import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const code = req.headers.get("X-Patient-Code");
    if (!code || !/^\d{5}$/.test(code)) {
      return new Response(JSON.stringify({ error: "Invalid code" }), { status: 400 });
    }

    const { exercise_slug, payload, score, partial } = await req.json();
    if (!exercise_slug) {
      return new Response(JSON.stringify({ error: "Missing exercise_slug" }), { status: 400 });
    }

    // Valida que o código existe e está ativo
    const { data: patient } = await supabase
      .from("patient_codes")
      .select("code")
      .eq("code", code)
      .eq("active", true)
      .single();

    if (!patient) {
      return new Response(JSON.stringify({ error: "Code not found or inactive" }), { status: 400 });
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

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("save-session error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
});
