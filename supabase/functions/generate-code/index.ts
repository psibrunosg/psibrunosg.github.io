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
const ALLOWED_SCALES = ["neoffir", "neopir", "bdi", "bai", "bhs", "bss", "cssrs"];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: jsonHeaders });

    const token = authHeader.replace("Bearer ", "");
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData.user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: jsonHeaders });

    if (authData.user.id !== THERAPIST_USER_ID) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: jsonHeaders });
    }

    const body = await req.json().catch(() => ({}));
    const allowedScales = Array.isArray(body.allowed_scales)
      ? body.allowed_scales.filter((scale: unknown) => typeof scale === "string" && ALLOWED_SCALES.includes(scale))
      : [];
    const requestedHours = Number(body.expires_in_hours ?? 48);
    const expiresInHours = Number.isFinite(requestedHours) ? Math.min(Math.max(requestedHours, 1), 168) : 48;
    const expiresAt = allowedScales.length > 0
      ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString()
      : null;
    const nomePaciente = typeof body.nome_paciente === "string"
      ? body.nome_paciente.trim().slice(0, 120) || null
      : null;

    let code: string;
    let exists = true;
    while (exists) {
      const values = new Uint32Array(1);
      crypto.getRandomValues(values);
      code = String(values[0] % 100000000).padStart(8, "0");
      const { data } = await supabase.from("patient_codes").select("code").eq("code", code).single();
      exists = !!data;
    }

    const { error } = await supabase.from("patient_codes").insert({
      code,
      active: true,
      allowed_scales: allowedScales,
      expires_at: expiresAt,
      created_by: authData.user.id,
      nome_paciente: nomePaciente,
    });
    if (error) throw error;

    return new Response(JSON.stringify({ code, allowed_scales: allowedScales, expires_at: expiresAt, nome_paciente: nomePaciente }), { status: 200, headers: jsonHeaders });
  } catch (error) {
    console.error("generate-code error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: jsonHeaders });
  }
});
