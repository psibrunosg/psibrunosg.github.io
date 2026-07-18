// Deploy:
//   supabase functions deploy psicoed-personalizada
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY são injetadas pelo runtime.
//
// Personalização da psicoeducação (território "De onde vêm seus padrões").
// O paciente (anon) NÃO consegue ler respostas_questionarios (revoke select),
// então a seleção do que mostrar é feita aqui, via service role.
//
// Retorna APENAS quais esquemas mostrar (ids) — o texto das narrativas é
// estático no frontend (src/content/psicoed/narrativas-esquemas.ts), nunca
// trafega aqui. Escore/nome só volta se o terapeuta ligou revelar_escore
// (default: não revela — decisão clínica do grilling 18/07).
//
// Fluxo: código -> resposta YSQ mais recente -> calcula esquemas ativos
// (média > 3.5) -> cruza com paciente_psicoed (liberado? ocultos? revelar?).
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const LIMIAR_ATIVACAO = 3.5; // igual ao frontend (interpret.ts)

// Mapa esquema -> itens (1-indexados) do YSQ, espelhado de src/content/escalas.ts.
// Deno não compartilha bundler com o Vite, então este mapa é duplicado de propósito.
const YSQ_ESQUEMAS: { id: string; itens: number[] }[] = [
  { id: "ed", itens: [1, 19, 37, 55, 73] },
  { id: "ab", itens: [2, 20, 38, 56, 74] },
  { id: "ma", itens: [3, 21, 39, 57, 75] },
  { id: "si", itens: [4, 22, 40, 58, 76] },
  { id: "ds", itens: [5, 23, 41, 59, 77] },
  { id: "fa", itens: [6, 24, 42, 60, 78] },
  { id: "di", itens: [7, 25, 43, 61, 79] },
  { id: "vu", itens: [8, 26, 44, 62, 80] },
  { id: "em", itens: [9, 27, 45, 63, 81] },
  { id: "et", itens: [14, 32, 50, 68, 86] },
  { id: "is", itens: [15, 33, 51, 69, 87] },
  { id: "sb", itens: [10, 28, 46, 64, 82] },
  { id: "ss", itens: [11, 29, 47, 65, 83] },
  { id: "as", itens: [16, 34, 52, 70, 88] },
  { id: "np", itens: [17, 35, 53, 71, 89] },
  { id: "ei", itens: [12, 30, 48, 66, 84] },
  { id: "us", itens: [13, 31, 49, 67, 85] },
  { id: "pu", itens: [18, 36, 54, 72, 90] },
];

function mediaEsquema(respostas: number[], itens: number[]): number {
  let soma = 0;
  for (const idx of itens) soma += respostas[idx - 1] ?? 1;
  return soma / itens.length;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const body = await req.json();
    const codigo: string = typeof body?.codigo === "string" ? body.codigo.trim() : "";
    if (!codigo) return new Response(JSON.stringify({ error: "Código não informado" }), { status: 400, headers: jsonHeaders });

    // Paciente pelo código.
    const { data: paciente } = await supabase
      .from("pacientes")
      .select("id")
      .eq("patient_code", codigo)
      .maybeSingle();

    if (!paciente) {
      // Sem paciente cadastrado → personalização não configurada.
      return new Response(JSON.stringify({ liberado: false, motivo: "sem-paciente" }), { status: 200, headers: jsonHeaders });
    }

    // Estado de liberação (interruptor mestre do terapeuta).
    const { data: estado } = await supabase
      .from("paciente_psicoed")
      .select("liberado, revelar_escore, esquemas_ocultos")
      .eq("paciente_id", paciente.id)
      .maybeSingle();

    if (!estado || !estado.liberado) {
      return new Response(JSON.stringify({ liberado: false, motivo: "nao-liberado" }), { status: 200, headers: jsonHeaders });
    }

    // Resposta YSQ mais recente.
    const { data: ysq } = await supabase
      .from("respostas_questionarios")
      .select("respostas, criado_em")
      .eq("patient_code", codigo)
      .eq("tipo", "ysq")
      .order("criado_em", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!ysq || !Array.isArray(ysq.respostas)) {
      // Liberado, mas ainda não respondeu o YSQ → nada a personalizar.
      return new Response(JSON.stringify({ liberado: true, semYsq: true, esquemas: [] }), { status: 200, headers: jsonHeaders });
    }

    const respostas: number[] = ysq.respostas;
    const revelar = !!estado.revelar_escore;
    const ocultos = new Set<string>(Array.isArray(estado.esquemas_ocultos) ? estado.esquemas_ocultos : []);

    const ativos = YSQ_ESQUEMAS
      .map((e) => ({ id: e.id, media: mediaEsquema(respostas, e.itens) }))
      .filter((e) => e.media > LIMIAR_ATIVACAO && !ocultos.has(e.id))
      .sort((a, b) => b.media - a.media)
      // Sem revelar: devolve só o id (o frontend mostra a narrativa, sem escore).
      // Com revelar: inclui a média arredondada para o painel/tela mostrar.
      .map((e) => (revelar ? { id: e.id, media: Math.round(e.media * 10) / 10 } : { id: e.id }));

    return new Response(
      JSON.stringify({ liberado: true, revelarEscore: revelar, esquemas: ativos }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (error) {
    console.error("psicoed-personalizada error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: jsonHeaders });
  }
});
