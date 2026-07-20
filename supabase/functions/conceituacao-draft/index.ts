// Deploy:
//   supabase functions deploy conceituacao-draft
// Secrets (set only the provider(s) you'll use):
//   supabase secrets set NVIDIA_API_KEY=... GROQ_API_KEY=... OPENAI_API_KEY=... OPENROUTER_API_KEY=... DEEPSEEK_API_KEY=... ANTHROPIC_API_KEY=... GEMINI_API_KEY=...
// Optional: NVIDIA_MODEL / GROQ_MODEL / OPENAI_MODEL / OPENROUTER_MODEL / DEEPSEEK_MODEL / GEMINI_MODEL to override the default model per provider.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { chamarProvedor, extrairJSON } from "../_shared/ai-providers.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

interface Escala { sigla: string; resumo: string; }

const SYSTEM_PROMPT = `Você é um assistente de psicologia clínica que redige RASCUNHOS de Conceituação
Cognitiva de Caso (modelo de Judith Beck), em português do Brasil, com tom profissional.
Nunca afirme diagnóstico com certeza — use linguagem de hipótese ("hipótese:", "sugere",
"pode indicar"). Deixe explícito que o rascunho deve ser revisado e editado pelo psicólogo
responsável antes de qualquer uso clínico. Responda SOMENTE em JSON estrito, sem texto fora
do JSON, com uma chave para cada rótulo de campo fornecido pelo usuário.`;

// Feature 5b: modo "parecer" — revisor de texto clínico (síntese/considerações de laudo),
// NÃO um gerador de rascunho. Só melhora clareza/formalidade/coesão em pt-BR, sem inventar
// fatos, diagnósticos ou dados novos. Responde com texto puro (nunca JSON).
const SYSTEM_PROMPT_PARECER = `Você é um revisor de texto clínico especializado em psicologia. Você
recebe um trecho de parecer psicológico (síntese ou considerações finais) em português do Brasil e
deve reescrevê-lo melhorando clareza, formalidade e coesão, mantendo o registro profissional da
psicologia clínica. NUNCA invente fatos, diagnósticos, escores ou informações que não estejam no
texto original — apenas reformule o que já foi escrito. Não adicione saudações, cabeçalhos nem
comentários. Responda SOMENTE com o texto revisado, sem aspas, sem markdown, sem JSON.`;

// ponytail: labels fixos do diagrama de Beck; se novas ferramentas de IA forem
// adicionadas, passar a lista de labels no body em vez de hardcodar aqui.
const LABELS_CONCEITUACAO_COGNITIVA = [
  "Dados relevantes da história",
  "Crença Central",
  "Crenças Intermediárias (pressupostos, regras, atitudes)",
  "Estratégias Compensatórias",
  "Situação 1",
  "Pensamento Automático (Sit. 1)",
  "Significado do PA (Sit. 1)",
  "Resposta Emocional (Sit. 1)",
  "Resposta Física (Sit. 1)",
  "Comportamento (Sit. 1)",
  "Situação 2",
  "Pensamento Automático (Sit. 2)",
  "Significado do PA (Sit. 2)",
  "Resposta Emocional (Sit. 2)",
  "Resposta Física (Sit. 2)",
  "Comportamento (Sit. 2)",
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const body = await req.json();
    // Defensivo: só usamos tipo/escalas/contexto/provider/model/modo/texto — nunca ecoamos PII
    // mesmo que campos extras (nome, cpf, etc.) venham no body por engano.
    const modo: string = typeof body?.modo === "string" ? body.modo : "conceituacao";
    const tipo: string = typeof body?.tipo === "string" ? body.tipo : "conceituacao-cognitiva";
    const escalas: Escala[] = Array.isArray(body?.escalas)
      ? body.escalas.filter((e: unknown): e is Escala => !!e && typeof (e as Escala).sigla === "string")
      : [];
    const contexto: string = typeof body?.contexto === "string" ? body.contexto : "";
    const textoParecer: string = typeof body?.texto === "string" ? body.texto : "";
    const providerKey: string = typeof body?.provider === "string" ? body.provider : "nvidia";
    const model: string | undefined = typeof body?.model === "string" && body.model.trim() ? body.model.trim() : undefined;

    const isParecer = modo === "parecer";
    const systemPrompt = isParecer ? SYSTEM_PROMPT_PARECER : SYSTEM_PROMPT;

    const labels = LABELS_CONCEITUACAO_COGNITIVA;
    const userMsg = isParecer
      ? `Revise o texto a seguir:\n\n${textoParecer}`
      : [
          `Ferramenta: ${tipo}`,
          escalas.length > 0
            ? `Escalas aplicadas (de-identificadas):\n${escalas.map((e) => `- ${e.sigla}: ${e.resumo}`).join("\n")}`
            : "Nenhuma escala informada.",
          contexto ? `Contexto clínico informado pelo terapeuta:\n${contexto}` : "",
          `Preencha um objeto JSON com exatamente estas chaves (rótulos do diagrama):\n${JSON.stringify(labels)}`,
        ].filter(Boolean).join("\n\n");

    const chamada = await chamarProvedor(providerKey, model, systemPrompt, userMsg);
    if (!chamada.ok) {
      return new Response(JSON.stringify({ error: chamada.erro }), { status: chamada.status, headers: jsonHeaders });
    }

    if (isParecer) {
      // Modo revisor: texto puro, sem parsing de JSON — apenas remove eventuais cercas de código.
      const textoRevisado = chamada.conteudo.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").trim();
      return new Response(JSON.stringify({ texto: textoRevisado }), { status: 200, headers: jsonHeaders });
    }

    const draft = extrairJSON(chamada.conteudo);
    if (!draft) {
      return new Response(JSON.stringify({ draft: {}, raw: chamada.conteudo }), { status: 200, headers: jsonHeaders });
    }
    return new Response(JSON.stringify({ draft }), { status: 200, headers: jsonHeaders });
  } catch (error) {
    console.error("conceituacao-draft error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: jsonHeaders });
  }
});
