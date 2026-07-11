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

const RATE_LIMIT_WINDOW_MINUTES = 15;
const RATE_LIMIT_MAX_ATTEMPTS = 20;

function invalidResponse() {
  return new Response(JSON.stringify({ valid: false, error: "Código inválido" }), { status: 400, headers: jsonHeaders });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const { code, scale } = await req.json();

    if (!code || !/^\d{5}(\d{3})?$/.test(code) || (scale !== undefined && typeof scale !== "string")) {
      return new Response(JSON.stringify({ valid: false, error: "Invalid code format" }), { status: 400, headers: jsonHeaders });
    }

    // Rate limiting: throttle per client IP using a Postgres-backed counter
    // (edge functions are stateless, so in-memory counters wouldn't work).
    const forwardedFor = req.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";

    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count: attemptCount, error: countError } = await supabase
      .from("validation_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip", clientIp)
      .gte("attempted_at", windowStart);

    if (countError) {
      console.error("validate-code rate limit check error:", countError);
    } else if ((attemptCount ?? 0) >= RATE_LIMIT_MAX_ATTEMPTS) {
      return new Response(
        JSON.stringify({ valid: false, error: "Muitas tentativas. Tente novamente mais tarde." }),
        { status: 429, headers: jsonHeaders }
      );
    }

    await supabase.from("validation_attempts").insert({ ip: clientIp });

    // Busca o código na DB e atualiza last_seen_at
    const { data: patient, error } = await supabase
      .from("patient_codes")
      .select("code, active, restricted_unlocked, allowed_scales, expires_at")
      .eq("code", code)
      .eq("active", true)
      .single();

    if (error || !patient) {
      console.error("validate-code: code not found or inactive");
      return invalidResponse();
    }

    if (patient.expires_at && new Date(patient.expires_at).getTime() <= Date.now()) {
      console.error("validate-code: code expired");
      return invalidResponse();
    }

    if (typeof scale === "string") {
      if (!Array.isArray(patient.allowed_scales) || !patient.allowed_scales.includes(scale)) {
        console.error("validate-code: scale not authorized");
        return invalidResponse();
      }
    }

    // Atualiza last_seen_at
    await supabase.from("patient_codes").update({ last_seen_at: new Date().toISOString() }).eq("code", code);

    return new Response(JSON.stringify({ valid: true, code, restricted_unlocked: patient.restricted_unlocked || [] }), { status: 200, headers: jsonHeaders });
  } catch (error) {
    console.error("validate-code error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: jsonHeaders });
  }
});
