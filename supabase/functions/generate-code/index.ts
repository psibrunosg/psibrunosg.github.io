import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { jwtDecode } from "https://esm.sh/jwt-decode@4";

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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: jsonHeaders });

    // Valida token JWT (terapeuta autenticado)
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwtDecode(token) as { sub?: string; email?: string };
    if (!decoded.sub) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: jsonHeaders });

    // Gera código único de 5 dígitos
    let code: string;
    let exists = true;
    while (exists) {
      code = String(Math.floor(Math.random() * 100000)).padStart(5, "0");
      const { data } = await supabase.from("patient_codes").select("code").eq("code", code).single();
      exists = !!data;
    }

    // Insere código na DB
    const { error } = await supabase.from("patient_codes").insert({ code, active: true });
    if (error) throw error;

    return new Response(JSON.stringify({ code }), { status: 200, headers: jsonHeaders });
  } catch (error) {
    console.error("generate-code error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: jsonHeaders });
  }
});
