// Adapter multi-provedor compartilhado entre conceituacao-draft e
// conceituacao-chat. Todos os provedores abaixo são compatíveis com a API
// /chat/completions da OpenAI — um único caminho de código serve a todos.
// Anthropic usa endpoint/schema diferente (POST /v1/messages, `system`
// top-level, sem role "system" em messages) — tratado à parte.

export const PROVIDERS: Record<string, { baseUrl: string; secret: string; defaultModel: string }> = {
  nvidia: { baseUrl: "https://integrate.api.nvidia.com/v1", secret: "NVIDIA_API_KEY", defaultModel: "meta/llama-3.3-70b-instruct" },
  openai: { baseUrl: "https://api.openai.com/v1", secret: "OPENAI_API_KEY", defaultModel: "gpt-4o-mini" },
  groq: { baseUrl: "https://api.groq.com/openai/v1", secret: "GROQ_API_KEY", defaultModel: "llama-3.3-70b-versatile" },
  openrouter: { baseUrl: "https://openrouter.ai/api/v1", secret: "OPENROUTER_API_KEY", defaultModel: "meta-llama/llama-3.3-70b-instruct" },
  deepseek: { baseUrl: "https://api.deepseek.com/v1", secret: "DEEPSEEK_API_KEY", defaultModel: "deepseek-chat" },
  // Google expõe um endpoint compatível com /chat/completions da OpenAI —
  // mesmo caminho genérico dos demais, sem adapter próprio como o Anthropic.
  // gemini-2.5-* está em rota de aposentadoria (geração atual é 3.x) — default atualizado 2026-07.
  gemini: { baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai", secret: "GEMINI_API_KEY", defaultModel: "gemini-3.6-flash" },
};
export const ANTHROPIC_DEFAULT_MODEL = "claude-opus-4-8";

// Sem timeout, um provedor lento/sobrecarregado trava a function até o
// runtime matar a invocação por esgotar o orçamento de execução (erro
// genérico e demorado). Falhar rápido com mensagem clara é bem melhor.
const TIMEOUT_MS = 25000;

export interface ChamadaIA {
  ok: true;
  conteudo: string;
}
export interface ChamadaIAErro {
  ok: false;
  status: number;
  erro: string;
}

async function fetchComTimeout(url: string, init: RequestInit, timeoutMs = TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Chama o provedor de IA configurado e retorna o texto bruto da resposta. */
export async function chamarProvedor(
  providerKey: string,
  modelInformado: string | undefined,
  systemPrompt: string,
  userMsg: string,
  temperature = 0.4,
  maxTokens = 1200
): Promise<ChamadaIA | ChamadaIAErro> {
  if (providerKey === "anthropic") {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) return { ok: false, status: 500, erro: "Secret ANTHROPIC_API_KEY não configurada" };
    const model = modelInformado?.trim() || ANTHROPIC_DEFAULT_MODEL;

    let resp: Response;
    try {
      resp = await fetchComTimeout("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          temperature,
          system: systemPrompt,
          messages: [{ role: "user", content: userMsg }],
        }),
      });
    } catch (e) {
      console.error("ai-providers: timeout/erro de rede anthropic", e);
      return { ok: false, status: 504, erro: "Provedor (anthropic) demorou demais para responder — tente novamente ou troque de provedor." };
    }

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("ai-providers: erro do provedor anthropic", resp.status, errText);
      return { ok: false, status: 500, erro: `Falha na API (anthropic): ${resp.status}` };
    }
    const data = await resp.json();
    return { ok: true, conteudo: data?.content?.[0]?.text ?? "" };
  }

  const cfg = PROVIDERS[providerKey];
  if (!cfg) return { ok: false, status: 400, erro: `Provedor desconhecido: ${providerKey}` };

  const apiKey = Deno.env.get(cfg.secret);
  if (!apiKey) return { ok: false, status: 500, erro: `Secret ${cfg.secret} não configurada` };

  const model = modelInformado?.trim() || Deno.env.get(`${providerKey.toUpperCase()}_MODEL`) || cfg.defaultModel;

  let resp: Response;
  try {
    resp = await fetchComTimeout(`${cfg.baseUrl}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMsg },
        ],
        temperature,
        max_tokens: maxTokens,
        stream: false,
      }),
    });
  } catch (e) {
    console.error("ai-providers: timeout/erro de rede", providerKey, e);
    return { ok: false, status: 504, erro: `Provedor (${providerKey}) demorou demais para responder — tente novamente ou troque de provedor/modelo.` };
  }

  if (!resp.ok) {
    const errText = await resp.text();
    console.error("ai-providers: erro do provedor", providerKey, resp.status, errText);
    return { ok: false, status: 500, erro: `Falha na API (${providerKey}): ${resp.status}` };
  }
  const data = await resp.json();
  return { ok: true, conteudo: data?.choices?.[0]?.message?.content ?? "" };
}

/** Extrai o primeiro objeto JSON de um texto (removendo cercas ```json se houver). */
export function extrairJSON(texto: string): Record<string, unknown> | null {
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
