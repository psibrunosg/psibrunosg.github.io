// Deploy:
//   supabase functions deploy conceituacao-draft
// Secrets (set only the provider(s) you'll use):
//   supabase secrets set NVIDIA_API_KEY=... GROQ_API_KEY=... OPENAI_API_KEY=... OPENROUTER_API_KEY=... DEEPSEEK_API_KEY=... ANTHROPIC_API_KEY=...
// Optional: NVIDIA_MODEL / GROQ_MODEL / OPENAI_MODEL / OPENROUTER_MODEL / DEEPSEEK_MODEL to override the default model per provider.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

// Todos os provedores abaixo são compatíveis com a API /chat/completions da OpenAI —
// um único caminho de código serve a todos. Anthropic usa endpoint/schema diferente
// (POST /v1/messages, `system` top-level, sem role "system" em messages) — tratado
// à parte no adapter `chamarAnthropic` abaixo, fora deste mapa.
const PROVIDERS: Record<string, { baseUrl: string; secret: string; defaultModel: string }> = {
  nvidia: { baseUrl: "https://integrate.api.nvidia.com/v1", secret: "NVIDIA_API_KEY", defaultModel: "meta/llama-3.3-70b-instruct" },
  openai: { baseUrl: "https://api.openai.com/v1", secret: "OPENAI_API_KEY", defaultModel: "gpt-4o-mini" },
  groq: { baseUrl: "https://api.groq.com/openai/v1", secret: "GROQ_API_KEY", defaultModel: "llama-3.3-70b-versatile" },
  openrouter: { baseUrl: "https://openrouter.ai/api/v1", secret: "OPENROUTER_API_KEY", defaultModel: "meta-llama/llama-3.3-70b-instruct" },
  deepseek: { baseUrl: "https://api.deepseek.com/v1", secret: "DEEPSEEK_API_KEY", defaultModel: "deepseek-chat" },
};
const ANTHROPIC_DEFAULT_MODEL = "claude-opus-4-8";

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

function extrairJSON(texto: string): Record<string, string> | null {
  const semCercas = texto.replace(/```json/gi, "").replace(/```/g, "").trim();
  const inicio = semCercas.indexOf("{");
  const fim = semCercas.lastIndexOf("}");
  if (inicio === -1 || fim === -1 || fim <= inicio) return null;
  try {
    const obj = JSON.parse(semCercas.slice(inicio, fim + 1));
    return typeof obj === "object" && obj !== null ? obj : null;
  } catch {
    return null;
  }
}

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

    let conteudo: string;

    if (providerKey === "anthropic") {
      const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "Secret ANTHROPIC_API_KEY não configurada" }), { status: 500, headers: jsonHeaders });
      }
      const model: string = typeof body?.model === "string" && body.model.trim() ? body.model.trim() : ANTHROPIC_DEFAULT_MODEL;

      // Anthropic não é compatível com /chat/completions da OpenAI: endpoint próprio
      // (/v1/messages), `system` é campo top-level, e `messages` só leva user/assistant.
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        body: JSON.stringify({
          model,
          max_tokens: 1200,
          temperature: 0.4,
          system: systemPrompt,
          messages: [{ role: "user", content: userMsg }],
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        console.error("conceituacao-draft: erro do provedor anthropic", resp.status, errText);
        return new Response(JSON.stringify({ error: `Falha na API (anthropic): ${resp.status}` }), { status: 500, headers: jsonHeaders });
      }

      const data = await resp.json();
      conteudo = data?.content?.[0]?.text ?? "";
    } else {
      const cfg = PROVIDERS[providerKey];
      if (!cfg) {
        return new Response(JSON.stringify({ error: `Provedor desconhecido: ${providerKey}` }), { status: 400, headers: jsonHeaders });
      }

      const apiKey = Deno.env.get(cfg.secret);
      if (!apiKey) {
        return new Response(JSON.stringify({ error: `Secret ${cfg.secret} não configurada` }), { status: 500, headers: jsonHeaders });
      }

      const model: string = typeof body?.model === "string" && body.model.trim() ? body.model.trim() : (Deno.env.get(`${providerKey.toUpperCase()}_MODEL`) || cfg.defaultModel);

      const resp = await fetch(`${cfg.baseUrl}/chat/completions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMsg },
          ],
          temperature: 0.4,
          max_tokens: 1200,
          stream: false,
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        console.error("conceituacao-draft: erro do provedor", providerKey, resp.status, errText);
        return new Response(JSON.stringify({ error: `Falha na API (${providerKey}): ${resp.status}` }), { status: 500, headers: jsonHeaders });
      }

      const data = await resp.json();
      conteudo = data?.choices?.[0]?.message?.content ?? "";
    }

    if (isParecer) {
      // Modo revisor: texto puro, sem parsing de JSON — apenas remove eventuais cercas de código.
      const textoRevisado = conteudo.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").trim();
      return new Response(JSON.stringify({ texto: textoRevisado }), { status: 200, headers: jsonHeaders });
    }

    const draft = extrairJSON(conteudo);

    if (!draft) {
      return new Response(JSON.stringify({ draft: {}, raw: conteudo }), { status: 200, headers: jsonHeaders });
    }

    return new Response(JSON.stringify({ draft }), { status: 200, headers: jsonHeaders });
  } catch (error) {
    console.error("conceituacao-draft error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: jsonHeaders });
  }
});
