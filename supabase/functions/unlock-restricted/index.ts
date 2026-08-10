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
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

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

    const { code, slug } = await req.json();
    if (!code || !slug) {
      return new Response(JSON.stringify({ error: "Missing code or slug" }), { status: 400, headers: jsonHeaders });
    }

    // Busca código
    const { data: patient } = await supabase
      .from("patient_codes")
      .select("code, restricted_unlocked")
      .eq("code", code)
      .single();

    if (!patient) {
      return new Response(JSON.stringify({ error: "Code not found" }), { status: 400, headers: jsonHeaders });
    }

    // Adiciona slug se não existir
    const current = patient.restricted_unlocked || [];
    if (!current.includes(slug)) {
      current.push(slug);
    }

    // Update
    await supabase.from("patient_codes").update({ restricted_unlocked: current }).eq("code", code);

    return new Response(JSON.stringify({ success: true, restricted_unlocked: current }), { status: 200, headers: jsonHeaders });
  } catch (error) {
    console.error("unlock-restricted error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: jsonHeaders });
  }
});
