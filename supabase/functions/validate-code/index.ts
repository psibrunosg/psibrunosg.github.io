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
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const { code } = await req.json();

    if (!code || !/^\d{5}$/.test(code)) {
      return new Response(JSON.stringify({ valid: false, error: "Invalid code format" }), { status: 400, headers: jsonHeaders });
    }

    // Busca o código na DB e atualiza last_seen_at
    const { data: patient, error } = await supabase
      .from("patient_codes")
      .select("code, active, restricted_unlocked")
      .eq("code", code)
      .eq("active", true)
      .single();

    if (error || !patient) {
      return new Response(JSON.stringify({ valid: false, error: "Code not found or inactive" }), { status: 400, headers: jsonHeaders });
    }

    // Atualiza last_seen_at
    await supabase.from("patient_codes").update({ last_seen_at: new Date().toISOString() }).eq("code", code);

    return new Response(JSON.stringify({ valid: true, code, restricted_unlocked: patient.restricted_unlocked || [] }), { status: 200, headers: jsonHeaders });
  } catch (error) {
    console.error("validate-code error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: jsonHeaders });
  }
});
