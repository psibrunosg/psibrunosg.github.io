# Conceituações Múltiplas com IA — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the AI-assisted case-conceptualization feature (chat, patient memory, PDF attachments, provider/model selection) from Beck's Cognitive Conceptualization to 4 more frameworks — Schema Therapy, Functional (ABC) Analysis, ACT (Hexaflex), and Process-Based Therapy (EEMM) — without duplicating the shared logic 5 times.

**Architecture:** A frontend hook (`useConceituacaoIA`) absorbs everything identical across the 5 tools (patient resolution, chat, long-term memory, PDF/text attachments, provider/model, error unwrapping, PDF export). A shared UI chrome component (`PainelIAConceituacao`) renders the identical selector/chat/attachment boxes. Each tool keeps its own small component for its diagram layout only. On the backend, `conceituacao-draft` and `conceituacao-chat` stop hardcoding Beck's labels/prompts and look them up from a new `_shared/ferramentas-conceituacao.ts` map keyed by tool id. `paciente_perfil` generalizes from fixed Beck columns to a `(paciente_id, ferramenta_id) → dados jsonb` shape, keeping the exact same delta-merge reliability Beck has today.

**Tech Stack:** React + TypeScript (Vite), Supabase (Postgres + Edge Functions/Deno), existing `_shared/ai-providers.ts` multi-provider adapter (unchanged).

## Global Constraints

- `tsc --noEmit -p .` must pass after every frontend task (repo has `noUnusedLocals`/`noUnusedParameters` — dead code left over from extraction will fail the build, not just warn).
- `supabase/functions/**` is Deno code, excluded from `tsconfig.app.json`'s `include: ["src"]` — no automated type-check exists for it in this repo today; verify those tasks by careful reading + manual smoke test in the logged-in painel (same convention already used for `conceituacao-draft`/`conceituacao-chat` today).
- No test framework exists for React components in this repo (only `src/lib/__tests__/*` has Vitest, for pure functions) — do not invent a component test harness; verify UI tasks by `tsc` + manual click-through, matching existing project convention.
- Beck's current observable behavior (labels, prompts, diagram layout, PDF export, provider list) must not change for the therapist — this is a refactor + extension, not a rewrite of what already works.
- Every new Supabase secret/provider already in use (`NVIDIA_API_KEY` … `GEMINI_API_KEY`) stays as-is; no new provider is added by this plan.
- Never commit real patient data. Migration only moves/reshapes existing columns — no data is fabricated.

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `supabase/migrations/20260721000000_paciente_perfil_por_ferramenta.sql` | new | Generalizes `paciente_perfil` to `(paciente_id, ferramenta_id, dados jsonb)` |
| `supabase/functions/_shared/ferramentas-conceituacao.ts` | new | Per-tool `{ labels, promptDraft, promptTurno, promptEncerrar }` map, 5 entries |
| `supabase/functions/conceituacao-draft/index.ts` | modify | Looks up labels/prompt from the shared map by `tipo` instead of hardcoding Beck's |
| `supabase/functions/conceituacao-chat/index.ts` | modify | Same lookup for all 3 actions; `formatarPerfil`/upsert become generic over `dados jsonb` |
| `src/content/ferramentas-terapeuta.ts` | modify | Adds 4 new tool entries (id/titulo/categoria/campos/referencia) |
| `src/components/conceituacao/CampoDiagrama.tsx` | new | Shared visual primitives (`box`, `labelCls`, `inputCls`, `Campo`, `Seta`) — pure styling, zero logic, used by all 5 diagrams |
| `src/hooks/useConceituacaoIA.ts` | new | All shared IA logic/state, extracted and generalized from `ConceituacaoCognitiva.tsx` |
| `src/components/conceituacao/PainelIAConceituacao.tsx` | new | Shared UI chrome (patient/provider/model/context/draft-button/chat/attachments/banners) — identical across all 5 tools |
| `src/components/ConceituacaoCognitiva.tsx` | modify | Retrofit to use the hook + shared chrome; keeps its own diagram layout + PDF export unchanged |
| `src/components/ConceituacaoEsquema.tsx` | new | Schema Therapy diagram |
| `src/components/ConceituacaoFuncional.tsx` | new | Functional (ABC) Analysis diagram |
| `src/components/ConceituacaoACT.tsx` | new | ACT (Hexaflex) diagram |
| `src/components/ConceituacaoProcessos.tsx` | new | EEMM / Process-Based diagram |
| `src/pages/bruno/Painel.tsx` | modify | Routes the 4 new tool ids to their dedicated components (same pattern as the existing Beck branch) |

---

### Task 1: Migration — generalize `paciente_perfil`

**Files:**
- Create: `supabase/migrations/20260721000000_paciente_perfil_por_ferramenta.sql`

**Interfaces:**
- Produces: `public.paciente_perfil(paciente_id bigint, ferramenta_id text, dados jsonb, atualizado_em timestamptz)`, primary key `(paciente_id, ferramenta_id)`. Existing Beck rows get `ferramenta_id = 'conceituacao-cognitiva'` and `dados = {"crenca_central", "crencas_intermediarias", "estrategias_compensatorias", "situacoes_recorrentes"}` (same keys as the old columns).

- [ ] **Step 1: Write the migration**

```sql
-- Generaliza paciente_perfil pra suportar múltiplas ferramentas de conceituação
-- (antes só existia pro Diagrama de Conceituação Cognitiva/Beck, com colunas
-- fixas). Cada ferramenta passa a guardar seu próprio shape de perfil de longo
-- prazo em `dados` jsonb — sem migration nova a cada framework futuro.

alter table public.paciente_perfil
  add column if not exists ferramenta_id text not null default 'conceituacao-cognitiva',
  add column if not exists dados jsonb not null default '{}'::jsonb;

-- Backfill: move as colunas antigas do Beck pra dentro de `dados`, com as
-- mesmas chaves (mesmo nome), sem perder histórico.
update public.paciente_perfil
set dados = jsonb_strip_nulls(jsonb_build_object(
  'crenca_central', crenca_central,
  'crencas_intermediarias', crencas_intermediarias,
  'estrategias_compensatorias', estrategias_compensatorias,
  'situacoes_recorrentes', coalesce(situacoes_recorrentes, '[]'::jsonb)
))
where dados = '{}'::jsonb;

-- Chave composta: 1 perfil por (paciente, ferramenta) em vez de 1 por paciente.
alter table public.paciente_perfil drop constraint if exists paciente_perfil_pkey;
alter table public.paciente_perfil add primary key (paciente_id, ferramenta_id);

alter table public.paciente_perfil drop column if exists crenca_central;
alter table public.paciente_perfil drop column if exists crencas_intermediarias;
alter table public.paciente_perfil drop column if exists estrategias_compensatorias;
alter table public.paciente_perfil drop column if exists situacoes_recorrentes;
```

- [ ] **Step 2: Apply locally / review before applying to prod**

If a local Supabase stack is linked: `supabase db reset` (replays all migrations including this one) and confirm no error. If working directly against the hosted project (no local stack in this repo), read the SQL once more for typos before it's applied via `supabase db push` or the dashboard SQL editor in a later deploy step — do **not** apply directly from this task; applying to the live `paciente_perfil` table (which may hold real patient data) needs explicit user go-ahead, matching the "ask before irreversible action" rule. Flag this explicitly when the plan reaches this task.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260721000000_paciente_perfil_por_ferramenta.sql
git commit -m "feat(db): generaliza paciente_perfil pra (paciente_id, ferramenta_id, dados jsonb)"
```

---

### Task 2: Shared backend config — `_shared/ferramentas-conceituacao.ts`

**Files:**
- Create: `supabase/functions/_shared/ferramentas-conceituacao.ts`

**Interfaces:**
- Consumes: nothing (pure data + types)
- Produces: `export interface ConfigFerramenta { labels: string[]; promptDraft: string; promptTurno: string; promptEncerrar: string }` and `export const FERRAMENTAS: Record<string, ConfigFerramenta>` with 5 keys: `conceituacao-cognitiva`, `conceituacao-esquema`, `conceituacao-funcional`, `conceituacao-act`, `conceituacao-processos`. Consumed by Task 3 and Task 4.

- [ ] **Step 1: Write the file**

```ts
// Config por ferramenta de conceituação, consumida por conceituacao-draft
// (promptDraft) e conceituacao-chat (promptTurno/promptEncerrar) — 1 lugar
// só pra registrar rótulos e prompts de cada framework clínico.

export interface ConfigFerramenta {
  labels: string[];
  promptDraft: string;
  promptTurno: string;
  promptEncerrar: string;
}

export const FERRAMENTAS: Record<string, ConfigFerramenta> = {
  "conceituacao-cognitiva": {
    labels: [
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
    ],
    promptDraft: `Você é um assistente de psicologia clínica que redige RASCUNHOS de Conceituação
Cognitiva de Caso (modelo de Judith Beck), em português do Brasil, com tom profissional.
Nunca afirme diagnóstico com certeza — use linguagem de hipótese ("hipótese:", "sugere",
"pode indicar"). Deixe explícito que o rascunho deve ser revisado e editado pelo psicólogo
responsável antes de qualquer uso clínico. Responda SOMENTE em JSON estrito, sem texto fora
do JSON, com uma chave para cada rótulo de campo fornecido pelo usuário.`,
    promptTurno: `Você conduz uma entrevista socrática para ajudar um psicólogo clínico a
preencher o Diagrama de Conceituação Cognitiva (modelo de Judith Beck), em português do Brasil.
Faça UMA pergunta objetiva de cada vez, focada no que ainda falta preencher — nunca repita pergunta
sobre campo já respondido. Use tom profissional e colaborativo, como um par clínico pensando junto,
nunca prescritivo. Nunca afirme diagnóstico com certeza — use linguagem de hipótese quando inferir
algo. Com base no que o terapeuta acabou de responder, você pode atualizar um ou mais campos do
diagrama. Responda SOMENTE em JSON estrito, sem texto fora do JSON, no formato:
{"resposta": "sua próxima pergunta ou comentário", "campos": {"Rótulo do campo": "valor inferido"}}
"campos" só deve conter campos que você tem confiança para preencher/atualizar agora — pode ser
um objeto vazio {} se ainda não há nada novo a registrar.`,
    promptEncerrar: `Você é um assistente de psicologia clínica que mantém um perfil evolutivo
e duradouro de um paciente, em português do Brasil, a partir de conversas de conceituação
cognitiva. Diferente do diagrama de trabalho de uma sessão (que tem "Situação 1"/"Situação 2"
pontuais), este perfil guarda o que é ESTÁVEL ao longo do tempo. Nunca afirme diagnóstico com
certeza. Responda SOMENTE em JSON estrito no formato:
{"crenca_central": "...", "crencas_intermediarias": "...", "estrategias_compensatorias": "...",
 "situacoesNovas": ["tema ou padrão recorrente novo observado nesta sessão", "..."]}
"situacoesNovas" deve conter só temas GENUINAMENTE novos em relação ao perfil já existente — se
nada de novo surgiu, retorne uma lista vazia []. Nunca repita um tema já registrado no perfil atual.`,
  },

  "conceituacao-esquema": {
    labels: [
      "Necessidades emocionais não supridas na infância (origem)",
      "Esquemas Iniciais Desadaptativos (EIDs) identificados",
      "Estilo de Enfrentamento predominante (Rendição / Evitação / Supercompensação)",
      "Situação 1",
      "Modo de Esquema ativado (Sit. 1)",
      "Pensamento (Sit. 1)",
      "Resposta Emocional (Sit. 1)",
      "Resposta Comportamental (Sit. 1)",
      "Situação 2",
      "Modo de Esquema ativado (Sit. 2)",
      "Pensamento (Sit. 2)",
      "Resposta Emocional (Sit. 2)",
      "Resposta Comportamental (Sit. 2)",
      "Padrão relacional/vincular geral",
    ],
    promptDraft: `Você é um assistente de psicologia clínica que redige RASCUNHOS de Conceituação
de Caso segundo a Terapia do Esquema (Jeffrey Young), em português do Brasil, com tom profissional.
Nunca afirme diagnóstico com certeza — use linguagem de hipótese ("hipótese:", "sugere",
"pode indicar"). Deixe explícito que o rascunho deve ser revisado e editado pelo psicólogo
responsável antes de qualquer uso clínico. Responda SOMENTE em JSON estrito, sem texto fora
do JSON, com uma chave para cada rótulo de campo fornecido pelo usuário.`,
    promptTurno: `Você conduz uma entrevista socrática para ajudar um psicólogo clínico a
preencher uma Conceituação de Caso segundo a Terapia do Esquema (Jeffrey Young), em português
do Brasil. Faça UMA pergunta objetiva de cada vez, focada no que ainda falta preencher — nunca
repita pergunta sobre campo já respondido. Investigue necessidades emocionais não supridas na
infância, Esquemas Iniciais Desadaptativos (EIDs), o estilo de enfrentamento predominante
(Rendição, Evitação ou Supercompensação), os Modos de Esquema ativados em situações concretas,
e o padrão relacional/vincular resultante. Use tom profissional e colaborativo, como um par
clínico pensando junto, nunca prescritivo. Nunca afirme diagnóstico com certeza — use linguagem
de hipótese quando inferir algo. Com base no que o terapeuta acabou de responder, você pode
atualizar um ou mais campos do diagrama. Responda SOMENTE em JSON estrito, sem texto fora do
JSON, no formato:
{"resposta": "sua próxima pergunta ou comentário", "campos": {"Rótulo do campo": "valor inferido"}}
"campos" só deve conter campos que você tem confiança para preencher/atualizar agora — pode ser
um objeto vazio {} se ainda não há nada novo a registrar.`,
    promptEncerrar: `Você é um assistente de psicologia clínica que mantém um perfil evolutivo
e duradouro de um paciente segundo a Terapia do Esquema, em português do Brasil, a partir de
conversas de conceituação de caso. Diferente do diagrama de trabalho de uma sessão (que tem
"Situação 1"/"Situação 2" pontuais), este perfil guarda o que é ESTÁVEL ao longo do tempo. Nunca
afirme diagnóstico com certeza. Responda SOMENTE em JSON estrito no formato:
{"eids_identificados": "Esquemas Iniciais Desadaptativos estáveis identificados até agora",
 "estilo_enfrentamento_predominante": "...", "padrao_vincular": "...",
 "situacoesNovas": ["tema ou padrão recorrente novo observado nesta sessão", "..."]}
"situacoesNovas" deve conter só temas GENUINAMENTE novos em relação ao perfil já existente — se
nada de novo surgiu, retorne uma lista vazia []. Nunca repita um tema já registrado no perfil atual.`,
  },

  "conceituacao-funcional": {
    labels: [
      "Comportamento-alvo",
      "Função hipotética (fuga/esquiva, atenção, reforço tangível, autorregulação)",
      "Situação 1 — Antecedente",
      "Situação 1 — Comportamento",
      "Situação 1 — Consequência (o que mantém)",
      "Situação 2 — Antecedente",
      "Situação 2 — Comportamento",
      "Situação 2 — Consequência",
      "Consequências de longo prazo / custo do padrão",
    ],
    promptDraft: `Você é um assistente de psicologia clínica que redige RASCUNHOS de Conceituação
de Caso por Análise Funcional (modelo ABC — Antecedente, Comportamento, Consequência), em
português do Brasil, com tom profissional. Nunca afirme diagnóstico com certeza — use linguagem
de hipótese ("hipótese:", "sugere", "pode indicar"). Deixe explícito que o rascunho deve ser
revisado e editado pelo psicólogo responsável antes de qualquer uso clínico. Responda SOMENTE em
JSON estrito, sem texto fora do JSON, com uma chave para cada rótulo de campo fornecido pelo
usuário.`,
    promptTurno: `Você conduz uma entrevista socrática para ajudar um psicólogo clínico a
preencher uma Conceituação de Caso por Análise Funcional (modelo ABC), em português do Brasil.
Faça UMA pergunta objetiva de cada vez, focada no que ainda falta preencher — nunca repita
pergunta sobre campo já respondido. Investigue o comportamento-alvo, os antecedentes (contexto,
gatilhos, estímulos discriminativos), as consequências imediatas que mantêm o comportamento
(reforço positivo/negativo), a função hipotética (fuga/esquiva, busca de atenção, reforço
tangível, autorregulação sensorial), e o custo de longo prazo do padrão. Use tom profissional e
colaborativo, como um par clínico pensando junto, nunca prescritivo. Nunca afirme diagnóstico
com certeza — use linguagem de hipótese quando inferir algo. Com base no que o terapeuta acabou
de responder, você pode atualizar um ou mais campos do diagrama. Responda SOMENTE em JSON
estrito, sem texto fora do JSON, no formato:
{"resposta": "sua próxima pergunta ou comentário", "campos": {"Rótulo do campo": "valor inferido"}}
"campos" só deve conter campos que você tem confiança para preencher/atualizar agora — pode ser
um objeto vazio {} se ainda não há nada novo a registrar.`,
    promptEncerrar: `Você é um assistente de psicologia clínica que mantém um perfil evolutivo
e duradouro de um paciente segundo a Análise Funcional (ABC), em português do Brasil, a partir de
conversas de conceituação de caso. Diferente do diagrama de trabalho de uma sessão (que tem
"Situação 1"/"Situação 2" pontuais), este perfil guarda o que é ESTÁVEL ao longo do tempo. Nunca
afirme diagnóstico com certeza. Responda SOMENTE em JSON estrito no formato:
{"funcao_predominante": "...", "padrao_reforco": "...", "custo_longo_prazo": "...",
 "situacoesNovas": ["tema ou padrão recorrente novo observado nesta sessão", "..."]}
"situacoesNovas" deve conter só temas GENUINAMENTE novos em relação ao perfil já existente — se
nada de novo surgiu, retorne uma lista vazia []. Nunca repita um tema já registrado no perfil atual.`,
  },

  "conceituacao-act": {
    labels: [
      "Valores identificados",
      "Ação comprometida (passos práticos)",
      "Fusão cognitiva (pensamentos aos quais está fundido)",
      "Esquiva experiencial (do que foge)",
      "Self conceitualizado (história que conta sobre si)",
      "Situação 1 — gatilho",
      "Situação 1 — reação de inflexibilidade",
      "Situação 1 — custo",
      "Situação 2 — gatilho",
      "Situação 2 — reação de inflexibilidade",
      "Situação 2 — custo",
    ],
    promptDraft: `Você é um assistente de psicologia clínica que redige RASCUNHOS de Conceituação
de Caso segundo a Terapia de Aceitação e Compromisso (ACT, modelo Hexaflex), em português do
Brasil, com tom profissional. Nunca afirme diagnóstico com certeza — use linguagem de hipótese
("hipótese:", "sugere", "pode indicar"). Deixe explícito que o rascunho deve ser revisado e
editado pelo psicólogo responsável antes de qualquer uso clínico. Responda SOMENTE em JSON
estrito, sem texto fora do JSON, com uma chave para cada rótulo de campo fornecido pelo usuário.`,
    promptTurno: `Você conduz uma entrevista socrática para ajudar um psicólogo clínico a
preencher uma Conceituação de Caso segundo a ACT (modelo Hexaflex), em português do Brasil.
Faça UMA pergunta objetiva de cada vez, focada no que ainda falta preencher — nunca repita
pergunta sobre campo já respondido. Investigue os valores do paciente, a ação comprometida em
direção a eles, a fusão cognitiva (pensamentos aos quais está fundido), a esquiva experiencial
(do que foge), o self conceitualizado (a história que conta sobre si), e situações concretas de
gatilho/reação de inflexibilidade psicológica/custo. Use tom profissional e colaborativo, como
um par clínico pensando junto, nunca prescritivo. Nunca afirme diagnóstico com certeza — use
linguagem de hipótese quando inferir algo. Com base no que o terapeuta acabou de responder, você
pode atualizar um ou mais campos do diagrama. Responda SOMENTE em JSON estrito, sem texto fora do
JSON, no formato:
{"resposta": "sua próxima pergunta ou comentário", "campos": {"Rótulo do campo": "valor inferido"}}
"campos" só deve conter campos que você tem confiança para preencher/atualizar agora — pode ser
um objeto vazio {} se ainda não há nada novo a registrar.`,
    promptEncerrar: `Você é um assistente de psicologia clínica que mantém um perfil evolutivo
e duradouro de um paciente segundo a ACT, em português do Brasil, a partir de conversas de
conceituação de caso. Diferente do diagrama de trabalho de uma sessão (que tem "Situação
1"/"Situação 2" pontuais), este perfil guarda o que é ESTÁVEL ao longo do tempo. Nunca afirme
diagnóstico com certeza. Responda SOMENTE em JSON estrito no formato:
{"valores_identificados": "...", "padrao_fusao": "...", "padrao_esquiva": "...",
 "self_conceitualizado": "...",
 "situacoesNovas": ["tema ou padrão recorrente novo observado nesta sessão", "..."]}
"situacoesNovas" deve conter só temas GENUINAMENTE novos em relação ao perfil já existente — se
nada de novo surgiu, retorne uma lista vazia []. Nunca repita um tema já registrado no perfil atual.`,
  },

  "conceituacao-processos": {
    labels: [
      "Processo Afetivo",
      "Processo Cognitivo",
      "Processo Atencional",
      "Processo do Self",
      "Processo Motivacional",
      "Processo Comportamental",
      "Hipótese do processo central de manutenção",
    ],
    promptDraft: `Você é um assistente de psicologia clínica que redige RASCUNHOS de Conceituação
de Caso segundo a Terapia Baseada em Processos (Steven Hayes, modelo EEMM — Extended Evolutionary
Meta-Model), em português do Brasil, com tom profissional. Nunca afirme diagnóstico com certeza —
use linguagem de hipótese ("hipótese:", "sugere", "pode indicar"). Deixe explícito que o rascunho
deve ser revisado e editado pelo psicólogo responsável antes de qualquer uso clínico. Responda
SOMENTE em JSON estrito, sem texto fora do JSON, com uma chave para cada rótulo de campo fornecido
pelo usuário.`,
    promptTurno: `Você conduz uma entrevista socrática para ajudar um psicólogo clínico a
preencher uma Conceituação de Caso segundo a Terapia Baseada em Processos (EEMM, Hayes), em
português do Brasil. Faça UMA pergunta objetiva de cada vez, focada no que ainda falta preencher
— nunca repita pergunta sobre campo já respondido. Investigue os 6 processos centrais do modelo
(Afetivo, Cognitivo, Atencional, do Self, Motivacional, Comportamental) e construa junto com o
terapeuta uma hipótese de qual processo é o elo central que mais sustenta o quadro clínico. Use
tom profissional e colaborativo, como um par clínico pensando junto, nunca prescritivo. Nunca
afirme diagnóstico com certeza — use linguagem de hipótese quando inferir algo. Com base no que o
terapeuta acabou de responder, você pode atualizar um ou mais campos do diagrama. Responda
SOMENTE em JSON estrito, sem texto fora do JSON, no formato:
{"resposta": "sua próxima pergunta ou comentário", "campos": {"Rótulo do campo": "valor inferido"}}
"campos" só deve conter campos que você tem confiança para preencher/atualizar agora — pode ser
um objeto vazio {} se ainda não há nada novo a registrar.`,
    promptEncerrar: `Você é um assistente de psicologia clínica que mantém um perfil evolutivo
e duradouro de um paciente segundo a Terapia Baseada em Processos (EEMM), em português do Brasil,
a partir de conversas de conceituação de caso. Diferente do diagrama de trabalho de uma sessão
(situacional), este perfil guarda o que é ESTÁVEL ao longo do tempo. Nunca afirme diagnóstico com
certeza. Responda SOMENTE em JSON estrito no formato:
{"processo_central_manutencao": "...", "perfil_processos": "resumo estável dos 6 processos
 observados até agora",
 "situacoesNovas": ["tema ou padrão recorrente novo observado nesta sessão", "..."]}
"situacoesNovas" deve conter só temas GENUINAMENTE novos em relação ao perfil já existente — se
nada de novo surgiu, retorne uma lista vazia []. Nunca repita um tema já registrado no perfil atual.`,
  },
};
```

- [ ] **Step 2: Read-through check**

Confirm all 5 keys match exactly the tool ids used later in Task 5 (`ferramentas-terapeuta.ts`) and Task 9–13 (component files): `conceituacao-cognitiva`, `conceituacao-esquema`, `conceituacao-funcional`, `conceituacao-act`, `conceituacao-processos`. A typo here breaks the lookup silently (falls into the "Ferramenta desconhecida" branch from Task 3/4).

- [ ] **Step 3: Commit**

```bash
git add supabase/functions/_shared/ferramentas-conceituacao.ts
git commit -m "feat(ia): config por ferramenta (labels + prompts) pra 5 frameworks de conceituação"
```

---

### Task 3: Generalize `conceituacao-draft/index.ts`

**Files:**
- Modify: `supabase/functions/conceituacao-draft/index.ts`

**Interfaces:**
- Consumes: `FERRAMENTAS` from Task 2.
- Produces: same HTTP contract as before (`{ draft }` / `{ error }` / `{ texto }` for modo "parecer") — no frontend change needed for this task alone.

- [ ] **Step 1: Replace the hardcoded Beck constants and lookup with the shared map**

Replace lines 15–53 (the `Escala` interface through `LABELS_CONCEITUACAO_COGNITIVA`) with:

```ts
import { FERRAMENTAS } from "../_shared/ferramentas-conceituacao.ts";

interface Escala { sigla: string; resumo: string; }

// Feature 5b: modo "parecer" — revisor de texto clínico (síntese/considerações de laudo),
// NÃO um gerador de rascunho. Só melhora clareza/formalidade/coesão em pt-BR, sem inventar
// fatos, diagnósticos ou dados novos. Responde com texto puro (nunca JSON).
const SYSTEM_PROMPT_PARECER = `Você é um revisor de texto clínico especializado em psicologia. Você
recebe um trecho de parecer psicológico (síntese ou considerações finais) em português do Brasil e
deve reescrevê-lo melhorando clareza, formalidade e coesão, mantendo o registro profissional da
psicologia clínica. NUNCA invente fatos, diagnósticos, escores ou informações que não estejam no
texto original — apenas reformule o que já foi escrito. Não adicione saudações, cabeçalhos nem
comentários. Responda SOMENTE com o texto revisado, sem aspas, sem markdown, sem JSON.`;
```

(the `import { serve }` and `import { chamarProvedor, extrairJSON }` lines above stay as they are)

- [ ] **Step 2: Replace the label/prompt selection inside the handler**

Replace:

```ts
    const isParecer = modo === "parecer";
    const systemPrompt = isParecer ? SYSTEM_PROMPT_PARECER : SYSTEM_PROMPT;

    const labels = LABELS_CONCEITUACAO_COGNITIVA;
```

with:

```ts
    const isParecer = modo === "parecer";
    const config = FERRAMENTAS[tipo];
    if (!isParecer && !config) {
      return new Response(JSON.stringify({ error: `Ferramenta desconhecida: ${tipo}` }), { status: 400, headers: jsonHeaders });
    }
    const systemPrompt = isParecer ? SYSTEM_PROMPT_PARECER : config.promptDraft;
    const labels = isParecer ? [] : config.labels;
```

- [ ] **Step 3: Read-through check**

Confirm `tipo` is still read earlier in the handler (`const tipo: string = typeof body?.tipo === "string" ? body.tipo : "conceituacao-cognitiva";` — already present, unchanged) and that the rest of the function (the `userMsg` builder using `labels`, the `chamarProvedor` call, JSON parsing) is untouched — only the constant lookup changed.

- [ ] **Step 4: Commit**

```bash
git add supabase/functions/conceituacao-draft/index.ts
git commit -m "refactor(ia): conceituacao-draft busca labels/prompt pela ferramenta em vez de hardcode do Beck"
```

---

### Task 4: Generalize `conceituacao-chat/index.ts`

**Files:**
- Modify: `supabase/functions/conceituacao-chat/index.ts`

**Interfaces:**
- Consumes: `FERRAMENTAS` from Task 2.
- Produces: same 3-action HTTP contract (`turno`/`encerrar`/`anexo`), now requiring `tipo` (tool id) in the body for `turno` and `encerrar` (not for `anexo`, which stays tool-agnostic). `buscarPerfil` now returns `Record<string, unknown> | null` instead of the old fixed-column shape.

- [ ] **Step 1: Replace the hardcoded `LABELS`/prompts with the shared map import**

Replace lines 43–83 (`const LABELS = [...]` through `SYSTEM_PROMPT_ENCERRAR`) with:

```ts
import { FERRAMENTAS } from "../_shared/ferramentas-conceituacao.ts";
```

(remove the old `const LABELS`, `SYSTEM_PROMPT_TURNO`, `SYSTEM_PROMPT_ENCERRAR` block entirely — they now live in `_shared/ferramentas-conceituacao.ts`)

- [ ] **Step 2: Generalize `buscarPerfil` to read the jsonb `dados` scoped by ferramenta**

Replace:

```ts
async function buscarPerfil(pacienteId: number | null) {
  if (pacienteId == null) return null;
  const { data } = await supabase
    .from("paciente_perfil")
    .select("crenca_central, crencas_intermediarias, estrategias_compensatorias, situacoes_recorrentes")
    .eq("paciente_id", pacienteId)
    .maybeSingle();
  return data ?? null;
}
```

with:

```ts
async function buscarPerfil(pacienteId: number | null, ferramentaId: string): Promise<Record<string, unknown> | null> {
  if (pacienteId == null) return null;
  const { data } = await supabase
    .from("paciente_perfil")
    .select("dados")
    .eq("paciente_id", pacienteId)
    .eq("ferramenta_id", ferramentaId)
    .maybeSingle();
  return (data?.dados as Record<string, unknown>) ?? null;
}
```

- [ ] **Step 3: Generalize `formatarPerfil` to iterate arbitrary keys**

Replace:

```ts
function formatarPerfil(perfil: Awaited<ReturnType<typeof buscarPerfil>>): string {
  if (!perfil) return "Nenhum perfil de longo prazo registrado ainda para este paciente.";
  const situacoes = Array.isArray(perfil.situacoes_recorrentes) ? perfil.situacoes_recorrentes : [];
  return [
    perfil.crenca_central ? `Crença central conhecida: ${perfil.crenca_central}` : "",
    perfil.crencas_intermediarias ? `Crenças intermediárias conhecidas: ${perfil.crencas_intermediarias}` : "",
    perfil.estrategias_compensatorias ? `Estratégias compensatórias conhecidas: ${perfil.estrategias_compensatorias}` : "",
    situacoes.length > 0 ? `Temas/situações recorrentes já observados: ${situacoes.map((s: { texto?: string }) => s?.texto ?? String(s)).join("; ")}` : "",
  ].filter(Boolean).join("\n") || "Nenhum perfil de longo prazo registrado ainda para este paciente.";
}
```

with:

```ts
// Genérico: cada ferramenta define seus próprios nomes de campo (via promptEncerrar),
// então o formatador não precisa conhecê-los — só evita expor situacoes_recorrentes
// como uma linha bruta de JSON (essa é formatada à parte, abaixo).
function formatarPerfil(dados: Record<string, unknown> | null): string {
  if (!dados || Object.keys(dados).length === 0) return "Nenhum perfil de longo prazo registrado ainda para este paciente.";
  const situacoes = Array.isArray(dados.situacoes_recorrentes) ? dados.situacoes_recorrentes : [];
  const linhas = Object.entries(dados)
    .filter(([chave, valor]) => chave !== "situacoes_recorrentes" && valor != null && String(valor).trim() !== "")
    .map(([chave, valor]) => `${chave}: ${valor}`);
  if (situacoes.length > 0) {
    linhas.push(`Temas/situações recorrentes já observados: ${situacoes.map((s: { texto?: string }) => s?.texto ?? String(s)).join("; ")}`);
  }
  return linhas.length > 0 ? linhas.join("\n") : "Nenhum perfil de longo prazo registrado ainda para este paciente.";
}
```

- [ ] **Step 4: `acaoTurno` — read `tipo`, use the ferramenta's labels/prompt, scope perfil lookup**

Replace:

```ts
  const providerKey = typeof body.provider === "string" ? body.provider : "nvidia";
  const model = typeof body.model === "string" && body.model.trim() ? body.model.trim() : undefined;

  if (!mensagem.trim()) return { status: 400, body: { error: "Mensagem vazia" } };

  const paciente = await buscarPaciente(pacienteId);
  const perfil = paciente ? await buscarPerfil(pacienteId) : null;
```

with:

```ts
  const providerKey = typeof body.provider === "string" ? body.provider : "nvidia";
  const model = typeof body.model === "string" && body.model.trim() ? body.model.trim() : undefined;
  const tipo = typeof body.tipo === "string" ? body.tipo : "conceituacao-cognitiva";
  const config = FERRAMENTAS[tipo];
  if (!config) return { status: 400, body: { error: `Ferramenta desconhecida: ${tipo}` } };

  if (!mensagem.trim()) return { status: 400, body: { error: "Mensagem vazia" } };

  const paciente = await buscarPaciente(pacienteId);
  const perfil = paciente ? await buscarPerfil(pacienteId, tipo) : null;
```

Then, further down in the same function, replace:

```ts
  const userMsg = [
    `Campos do diagrama já preenchidos:\n${JSON.stringify(camposAtuais)}`,
    `Rótulos disponíveis (use exatamente estas chaves em "campos"):\n${JSON.stringify(LABELS)}`,
```

with:

```ts
  const userMsg = [
    `Campos do diagrama já preenchidos:\n${JSON.stringify(camposAtuais)}`,
    `Rótulos disponíveis (use exatamente estas chaves em "campos"):\n${JSON.stringify(config.labels)}`,
```

and replace:

```ts
  const chamada = await chamarProvedor(providerKey, model, SYSTEM_PROMPT_TURNO, userMsg);
```

with:

```ts
  const chamada = await chamarProvedor(providerKey, model, config.promptTurno, userMsg);
```

- [ ] **Step 5: `acaoEncerrar` — read `tipo`, scope perfil, generic upsert into `dados`**

Replace the whole function body with:

```ts
async function acaoEncerrar(body: Record<string, unknown>) {
  const pacienteId = typeof body.pacienteId === "number" ? body.pacienteId : null;
  const sessaoId = typeof body.sessaoId === "string" ? body.sessaoId : "";
  const providerKey = typeof body.provider === "string" ? body.provider : "nvidia";
  const model = typeof body.model === "string" && body.model.trim() ? body.model.trim() : undefined;
  const tipo = typeof body.tipo === "string" ? body.tipo : "conceituacao-cognitiva";
  const config = FERRAMENTAS[tipo];
  if (!config) return { status: 400, body: { error: `Ferramenta desconhecida: ${tipo}` } };

  if (pacienteId == null || !sessaoId) return { status: 400, body: { error: "pacienteId e sessaoId são obrigatórios para encerrar sessão" } };

  const { data: mensagens } = await supabase
    .from("paciente_mensagens")
    .select("papel, conteudo")
    .eq("paciente_id", pacienteId)
    .eq("sessao_id", sessaoId)
    .order("criado_em", { ascending: true });

  if (!mensagens || mensagens.length === 0) return { status: 400, body: { error: "Nenhuma mensagem encontrada nessa sessão" } };

  const dadosAtuais = (await buscarPerfil(pacienteId, tipo)) ?? {};

  const userMsg = [
    `Perfil atual do paciente:\n${formatarPerfil(dadosAtuais)}`,
    `Transcrição completa da sessão de hoje:\n${mensagens.map((m: Mensagem) => `${m.papel === "terapeuta" ? "Terapeuta" : "Assistente"}: ${m.conteudo}`).join("\n")}`,
  ].join("\n\n");

  const chamada = await chamarProvedor(providerKey, model, config.promptEncerrar, userMsg);
  if (!chamada.ok) return { status: chamada.status, body: { error: chamada.erro } };

  const parsed = extrairJSON(chamada.conteudo);
  if (!parsed) return { status: 500, body: { error: "IA não retornou um perfil válido" } };

  // Delta controlado no código (não pela IA): só situacoesNovas é aceito como
  // adição, com timestamp gerado no servidor — mesma confiabilidade que o
  // Beck já tinha antes de generalizar pra múltiplas ferramentas.
  const { situacoesNovas: situacoesNovasRaw, ...escalares } = parsed;
  const situacoesExistentes = Array.isArray(dadosAtuais.situacoes_recorrentes) ? dadosAtuais.situacoes_recorrentes : [];
  const situacoesNovas = Array.isArray(situacoesNovasRaw) ? situacoesNovasRaw : [];
  const situacoesAtualizadas = [
    ...situacoesExistentes,
    ...situacoesNovas
      .filter((s: unknown): s is string => typeof s === "string" && s.trim().length > 0)
      .map((texto: string) => ({ texto, criado_em: new Date().toISOString() })),
  ];

  const dadosNovos = { ...dadosAtuais, ...escalares, situacoes_recorrentes: situacoesAtualizadas };

  const { error: upsertError } = await supabase.from("paciente_perfil").upsert(
    { paciente_id: pacienteId, ferramenta_id: tipo, dados: dadosNovos, atualizado_em: new Date().toISOString() },
    { onConflict: "paciente_id,ferramenta_id" }
  );
  if (upsertError) {
    console.error("conceituacao-chat: erro ao salvar perfil", upsertError);
    return { status: 500, body: { error: "Falha ao salvar perfil atualizado" } };
  }

  return { status: 200, body: { perfil: dadosNovos } };
}
```

- [ ] **Step 6: Read-through check**

Confirm `acaoAnexo` is untouched (attachments stay tool-agnostic per the design). Confirm `interface Mensagem` and `buscarPaciente`/`buscarAnexosRecentes` are untouched. Confirm every `LABELS`/`SYSTEM_PROMPT_TURNO`/`SYSTEM_PROMPT_ENCERRAR` reference in the file was replaced — grep the file for those 3 identifiers, expect zero matches.

- [ ] **Step 7: Commit**

```bash
git add supabase/functions/conceituacao-chat/index.ts
git commit -m "refactor(ia): conceituacao-chat generaliza labels/prompts/perfil por ferramenta"
```

---

### Task 5: Register the 4 new tools in `ferramentas-terapeuta.ts`

**Files:**
- Modify: `src/content/ferramentas-terapeuta.ts`

**Interfaces:**
- Produces: 4 new `FerramentaTerapeuta` entries with ids `conceituacao-esquema`, `conceituacao-funcional`, `conceituacao-act`, `conceituacao-processos` — consumed by Task 9–13 components (`ferramentas.find(f => f.id === "...")!`) and by Task 13's `Painel.tsx` grid (auto-lists any entry in `ferramentas`).

- [ ] **Step 1: Add the 4 entries**

Insert immediately after the existing `conceituacao-cognitiva` entry (after its closing `},` around line 49) in `src/content/ferramentas-terapeuta.ts`:

```ts
  {
    id: "conceituacao-esquema",
    titulo: "Conceituação — Terapia do Esquema",
    categoria: "Conceituação",
    campos: [
      { label: "Necessidades emocionais não supridas na infância (origem)", tipo: "area" },
      { label: "Esquemas Iniciais Desadaptativos (EIDs) identificados", tipo: "area" },
      { label: "Estilo de Enfrentamento predominante (Rendição / Evitação / Supercompensação)", tipo: "texto" },
      { label: "Situação 1", tipo: "texto" },
      { label: "Modo de Esquema ativado (Sit. 1)", tipo: "texto" },
      { label: "Pensamento (Sit. 1)", tipo: "texto" },
      { label: "Resposta Emocional (Sit. 1)", tipo: "texto" },
      { label: "Resposta Comportamental (Sit. 1)", tipo: "texto" },
      { label: "Situação 2", tipo: "texto" },
      { label: "Modo de Esquema ativado (Sit. 2)", tipo: "texto" },
      { label: "Pensamento (Sit. 2)", tipo: "texto" },
      { label: "Resposta Emocional (Sit. 2)", tipo: "texto" },
      { label: "Resposta Comportamental (Sit. 2)", tipo: "texto" },
      { label: "Padrão relacional/vincular geral", tipo: "area" },
    ],
    referencia: "Terapia do Esquema — Jeffrey Young.",
  },
  {
    id: "conceituacao-funcional",
    titulo: "Conceituação Funcional (ABC)",
    categoria: "Conceituação",
    campos: [
      { label: "Comportamento-alvo", tipo: "texto" },
      { label: "Função hipotética (fuga/esquiva, atenção, reforço tangível, autorregulação)", tipo: "area" },
      { label: "Situação 1 — Antecedente", tipo: "texto" },
      { label: "Situação 1 — Comportamento", tipo: "texto" },
      { label: "Situação 1 — Consequência (o que mantém)", tipo: "texto" },
      { label: "Situação 2 — Antecedente", tipo: "texto" },
      { label: "Situação 2 — Comportamento", tipo: "texto" },
      { label: "Situação 2 — Consequência", tipo: "texto" },
      { label: "Consequências de longo prazo / custo do padrão", tipo: "area" },
    ],
    referencia: "Análise Funcional do Comportamento — modelo ABC.",
  },
  {
    id: "conceituacao-act",
    titulo: "Conceituação ACT (Hexaflex)",
    categoria: "Conceituação",
    campos: [
      { label: "Valores identificados", tipo: "area" },
      { label: "Ação comprometida (passos práticos)", tipo: "area" },
      { label: "Fusão cognitiva (pensamentos aos quais está fundido)", tipo: "area" },
      { label: "Esquiva experiencial (do que foge)", tipo: "area" },
      { label: "Self conceitualizado (história que conta sobre si)", tipo: "area" },
      { label: "Situação 1 — gatilho", tipo: "texto" },
      { label: "Situação 1 — reação de inflexibilidade", tipo: "texto" },
      { label: "Situação 1 — custo", tipo: "texto" },
      { label: "Situação 2 — gatilho", tipo: "texto" },
      { label: "Situação 2 — reação de inflexibilidade", tipo: "texto" },
      { label: "Situação 2 — custo", tipo: "texto" },
    ],
    referencia: "Terapia de Aceitação e Compromisso — modelo Hexaflex (Steven Hayes).",
  },
  {
    id: "conceituacao-processos",
    titulo: "Conceituação — Processos (EEMM/Hayes)",
    categoria: "Conceituação",
    campos: [
      { label: "Processo Afetivo", tipo: "area" },
      { label: "Processo Cognitivo", tipo: "area" },
      { label: "Processo Atencional", tipo: "area" },
      { label: "Processo do Self", tipo: "area" },
      { label: "Processo Motivacional", tipo: "area" },
      { label: "Processo Comportamental", tipo: "area" },
      { label: "Hipótese do processo central de manutenção", tipo: "area" },
    ],
    referencia: "Terapia Baseada em Processos — EEMM (Steven Hayes).",
  },
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit -p .`
Expected: `TypeScript: No errors found` — this file has no logic, just data conforming to the existing `FerramentaTerapeuta` interface.

- [ ] **Step 3: Commit**

```bash
git add src/content/ferramentas-terapeuta.ts
git commit -m "content: registra 4 novas ferramentas de conceituação (esquema/ABC/ACT/EEMM)"
```

---

### Task 6: Shared diagram primitives — `CampoDiagrama.tsx`

**Files:**
- Create: `src/components/conceituacao/CampoDiagrama.tsx`

**Interfaces:**
- Produces: `box: string`, `labelCls: string`, `inputCls: string`, `Campo` (component), `Seta` (component) — consumed by Task 8 (retrofit) and Task 9–12 (new diagrams).

- [ ] **Step 1: Write the file**

```tsx
// Primitivas visuais compartilhadas por todos os diagramas de conceituação —
// puro CSS/JSX, sem lógica de IA (essa vive em useConceituacaoIA). Cada
// diagrama continua livre pra montar seu próprio layout com essas peças.
import { ArrowDown } from "lucide-react";

export const box = "rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)]/60 p-4";
export const labelCls = "mb-1 block text-[11px] font-medium text-[var(--c-accent)]";
export const inputCls = "w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none";

export function Campo({ label, valor, onChange, area }: { label: string; valor: string; onChange: (v: string) => void; area?: boolean }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {area ? (
        <textarea value={valor} onChange={(e) => onChange(e.target.value)} rows={3} className={`${inputCls} resize-y`} />
      ) : (
        <input value={valor} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      )}
    </div>
  );
}

export const Seta = () => (
  <div className="flex justify-center py-1 text-[var(--c-muted)]"><ArrowDown size={16} /></div>
);
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit -p .`
Expected: `TypeScript: No errors found`

- [ ] **Step 3: Commit**

```bash
git add src/components/conceituacao/CampoDiagrama.tsx
git commit -m "refactor(ia): extrai primitivas visuais de diagrama pra arquivo compartilhado"
```

---

### Task 7: Shared hook — `useConceituacaoIA`

**Files:**
- Create: `src/hooks/useConceituacaoIA.ts`

**Interfaces:**
- Consumes: `supabase`, `mensagemErroEdgeFunction` from `@/lib/supabase`; `interpretarResposta` from `@/lib/interpret`; `extrairTextoPDF` from `@/lib/pdfExtract`; `FerramentaTerapeuta` type from `@/content/ferramentas-terapeuta`; `RespostaRegistro` from `@/lib/scoring`.
- Produces: `export type Resposta`, `export function chavePaciente`, `export function nomeSeguro`, `export const PROVEDORES`, `export const MODELOS_POR_PROVEDOR`, `export interface MensagemChat`, `export function useConceituacaoIA(toolId: string, respostas: Resposta[], ferramenta: FerramentaTerapeuta): UseConceituacaoIAResult`. Consumed by Task 8 (retrofit) and Task 9–12 (new components), and by Task 8's `PainelIAConceituacao` via the `UseConceituacaoIAResult` shape.

- [ ] **Step 1: Write the file**

```ts
import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import { supabase, mensagemErroEdgeFunction } from "@/lib/supabase";
import { interpretarResposta } from "@/lib/interpret";
import { extrairTextoPDF } from "@/lib/pdfExtract";
import type { FerramentaTerapeuta } from "@/content/ferramentas-terapeuta";
import type { RespostaRegistro } from "@/lib/scoring";

export type Resposta = RespostaRegistro & { patient_code?: string; email?: string };

export function chavePaciente(r: Resposta): string {
  if (r.patient_code) return "code:" + r.patient_code;
  if (r.nome && r.nome.trim()) return "nome:" + r.nome.trim().toLowerCase() + "|" + (r.nascimento ?? "");
  return "resp:" + r.id;
}
export function nomeSeguro(r: Resposta): string {
  return r.nome?.trim() || (r.patient_code ? `Código ${r.patient_code}` : `Paciente #${r.id}`);
}

export const PROVEDORES = [
  { id: "nvidia", label: "NVIDIA" },
  { id: "openai", label: "OpenAI" },
  { id: "groq", label: "Groq" },
  { id: "openrouter", label: "OpenRouter" },
  { id: "deepseek", label: "DeepSeek" },
  { id: "anthropic", label: "Anthropic (Claude)" },
  { id: "gemini", label: "Google Gemini" },
];

export const MODELOS_POR_PROVEDOR: Record<string, { id: string; label: string }[]> = {
  nvidia: [
    { id: "meta/llama-3.3-70b-instruct", label: "Llama 3.3 70B" },
    { id: "meta/llama-3.1-405b-instruct", label: "Llama 3.1 405B" },
  ],
  openai: [
    { id: "gpt-4o-mini", label: "GPT-4o mini" },
    { id: "gpt-4o", label: "GPT-4o" },
  ],
  groq: [
    { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B Versatile" },
    { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B Instant" },
  ],
  openrouter: [
    { id: "meta-llama/llama-3.3-70b-instruct", label: "Llama 3.3 70B" },
    { id: "openai/gpt-4o-mini", label: "GPT-4o mini" },
  ],
  deepseek: [
    { id: "deepseek-chat", label: "DeepSeek Chat" },
    { id: "deepseek-reasoner", label: "DeepSeek Reasoner" },
  ],
  anthropic: [
    { id: "claude-opus-4-8", label: "Claude Opus 4.8" },
    { id: "claude-sonnet-5", label: "Claude Sonnet 5" },
    { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5" },
  ],
  gemini: [
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  ],
};

const INATIVIDADE_MS = 20 * 60 * 1000;
const JANELA_HISTORICO = 8;

export interface MensagemChat { papel: "terapeuta" | "ia"; conteudo: string; }

async function resolverPacienteId(r: Resposta): Promise<number | null> {
  if (!supabase) return null;
  if (r.patient_code) {
    const { data: existente } = await supabase.from("pacientes").select("id").eq("patient_code", r.patient_code).maybeSingle();
    if (existente) return existente.id;
    const { data: criado } = await supabase.from("pacientes").insert({ patient_code: r.patient_code, nome_paciente: r.nome ?? null }).select("id").single();
    return criado?.id ?? null;
  }
  if (r.nome && r.nome.trim()) {
    const nome = r.nome.trim();
    const { data: existente } = await supabase.from("pacientes").select("id").is("patient_code", null).ilike("nome_paciente", nome).eq("nascimento", r.nascimento ?? "").maybeSingle();
    if (existente) return existente.id;
    const { data: criado } = await supabase.from("pacientes").insert({ nome_paciente: nome, nascimento: r.nascimento ?? null }).select("id").single();
    return criado?.id ?? null;
  }
  return null;
}

export interface UseConceituacaoIAResult {
  dados: Record<string, string>;
  set: (label: string, v: string) => void;
  pacienteChave: string;
  setPacienteChave: (v: string) => void;
  grupos: [string, Resposta[]][];
  pacienteId: number | null;
  perfil: Record<string, unknown> | null;
  contexto: string;
  setContexto: (v: string) => void;
  provider: string;
  model: string;
  escolherProvider: (p: string) => void;
  escolherModel: (m: string) => void;
  loading: boolean;
  erro: string | null;
  aiUsado: boolean;
  sugerirRascunho: () => Promise<void>;
  mensagens: MensagemChat[];
  inputChat: string;
  setInputChat: (v: string) => void;
  chatLoading: boolean;
  chatErro: string | null;
  enviarMensagemChat: () => Promise<void>;
  encerrarSessao: () => Promise<void>;
  encerrarLoading: boolean;
  anexoTexto: string;
  setAnexoTexto: (v: string) => void;
  anexoLoading: boolean;
  anexoErro: string | null;
  anexoOk: boolean;
  anexoTruncado: boolean;
  salvarAnexo: (tipo: "pdf" | "texto", conteudo: string, nomeArquivo?: string) => Promise<void>;
  handleUploadPDF: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  exportarPDF: () => void;
}

export function useConceituacaoIA(toolId: string, respostas: Resposta[], ferramenta: FerramentaTerapeuta): UseConceituacaoIAResult {
  const L = ferramenta.campos.map((c) => c.label);

  const [dados, setDados] = useState<Record<string, string>>({});
  const [pacienteChave, setPacienteChave] = useState("");
  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [perfil, setPerfil] = useState<Record<string, unknown> | null>(null);
  const [contexto, setContexto] = useState("");
  const [provider, setProvider] = useState(() => localStorage.getItem("conceituacao_provider") || "nvidia");
  const [model, setModel] = useState(() => {
    const salvo = localStorage.getItem("conceituacao_model");
    const opcoes = MODELOS_POR_PROVEDOR[localStorage.getItem("conceituacao_provider") || "nvidia"];
    return salvo && opcoes?.some((o) => o.id === salvo) ? salvo : opcoes[0].id;
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aiUsado, setAiUsado] = useState(false);

  const [sessaoId, setSessaoId] = useState(() => crypto.randomUUID());
  const [mensagens, setMensagens] = useState<MensagemChat[]>([]);
  const [inputChat, setInputChat] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatErro, setChatErro] = useState<string | null>(null);
  const [encerrarLoading, setEncerrarLoading] = useState(false);
  const inatividadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [anexoTexto, setAnexoTexto] = useState("");
  const [anexoLoading, setAnexoLoading] = useState(false);
  const [anexoErro, setAnexoErro] = useState<string | null>(null);
  const [anexoOk, setAnexoOk] = useState(false);
  const [anexoTruncado, setAnexoTruncado] = useState(false);

  const set = (label: string, v: string) => setDados((d) => ({ ...d, [label]: v }));

  const grupos = (() => {
    const m = new Map<string, Resposta[]>();
    for (const r of respostas) { const k = chavePaciente(r); const a = m.get(k) ?? []; a.push(r); m.set(k, a); }
    return Array.from(m.entries());
  })();

  function escolherProvider(p: string) {
    setProvider(p);
    localStorage.setItem("conceituacao_provider", p);
    const modeloPadrao = MODELOS_POR_PROVEDOR[p][0].id;
    setModel(modeloPadrao);
    localStorage.setItem("conceituacao_model", modeloPadrao);
  }
  function escolherModel(m: string) {
    setModel(m);
    localStorage.setItem("conceituacao_model", m);
  }

  useEffect(() => {
    setPerfil(null);
    setMensagens([]);
    setSessaoId(crypto.randomUUID());
    if (!pacienteChave || !supabase) { setPacienteId(null); return; }
    const grupo = grupos.find(([k]) => k === pacienteChave);
    if (!grupo) { setPacienteId(null); return; }
    let cancelado = false;
    (async () => {
      const id = await resolverPacienteId(grupo[1][0]);
      if (cancelado) return;
      setPacienteId(id);
      if (id != null) {
        const { data } = await supabase!.from("paciente_perfil")
          .select("dados")
          .eq("paciente_id", id).eq("ferramenta_id", toolId).maybeSingle();
        if (!cancelado && data) setPerfil(data.dados as Record<string, unknown>);
      }
    })();
    return () => { cancelado = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacienteChave, toolId]);

  async function encerrarSessao() {
    if (!supabase || pacienteId == null || mensagens.length === 0) return;
    setEncerrarLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("conceituacao-chat", {
        body: { acao: "encerrar", tipo: toolId, pacienteId, sessaoId, provider, model: model || undefined },
      });
      if (error) throw error;
      if (data?.error) { setChatErro(data.error); return; }
      if (data?.perfil) setPerfil(data.perfil as Record<string, unknown>);
      setMensagens([]);
      setSessaoId(crypto.randomUUID());
    } catch (e) {
      setChatErro(await mensagemErroEdgeFunction(e, "Erro ao encerrar sessão."));
    } finally {
      setEncerrarLoading(false);
    }
  }

  useEffect(() => {
    if (inatividadeTimer.current) clearTimeout(inatividadeTimer.current);
    if (pacienteId == null || mensagens.length === 0) return;
    inatividadeTimer.current = setTimeout(() => { encerrarSessao(); }, INATIVIDADE_MS);
    return () => { if (inatividadeTimer.current) clearTimeout(inatividadeTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mensagens, pacienteId]);

  async function enviarMensagemChat() {
    const texto = inputChat.trim();
    if (!texto || !supabase) return;
    setChatLoading(true);
    setChatErro(null);
    const historico = mensagens.slice(-JANELA_HISTORICO);
    setMensagens((m) => [...m, { papel: "terapeuta", conteudo: texto }]);
    setInputChat("");
    try {
      const { data, error } = await supabase.functions.invoke("conceituacao-chat", {
        body: {
          acao: "turno", tipo: toolId, pacienteId, sessaoId, mensagem: texto, historico,
          camposAtuais: dados, provider, model: model || undefined,
        },
      });
      if (error) throw error;
      if (data?.error) { setChatErro(data.error); return; }
      const resposta: string = data?.resposta ?? "";
      const campos: Record<string, string> = data?.campos ?? {};
      setMensagens((m) => [...m, { papel: "ia", conteudo: resposta }]);
      if (Object.keys(campos).length > 0) {
        setDados((d) => ({ ...d, ...campos }));
        setAiUsado(true);
      }
    } catch (e) {
      setChatErro(await mensagemErroEdgeFunction(e, "Erro ao conversar com a IA."));
    } finally {
      setChatLoading(false);
    }
  }

  async function salvarAnexo(tipo: "pdf" | "texto", conteudo: string, nomeArquivo?: string) {
    if (!supabase || pacienteId == null || !conteudo.trim()) return;
    setAnexoLoading(true);
    setAnexoErro(null);
    setAnexoOk(false);
    setAnexoTruncado(false);
    try {
      const { data, error } = await supabase.functions.invoke("conceituacao-chat", {
        body: { acao: "anexo", pacienteId, tipo, nomeArquivo, conteudo },
      });
      if (error) throw error;
      if (data?.error) { setAnexoErro(data.error); return; }
      setAnexoOk(true);
      if (data?.truncado) setAnexoTruncado(true);
      if (tipo === "texto") setAnexoTexto("");
    } catch (e) {
      setAnexoErro(await mensagemErroEdgeFunction(e, "Erro ao salvar referência."));
    } finally {
      setAnexoLoading(false);
    }
  }

  async function handleUploadPDF(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    e.target.value = "";
    if (!arquivo) return;
    setAnexoLoading(true);
    setAnexoErro(null);
    setAnexoOk(false);
    try {
      const texto = await extrairTextoPDF(arquivo);
      if (!texto.trim()) { setAnexoErro("Não foi possível extrair texto desse PDF."); return; }
      await salvarAnexo("pdf", texto, arquivo.name);
    } catch {
      setAnexoErro("Falha ao ler o PDF.");
    } finally {
      setAnexoLoading(false);
    }
  }

  async function sugerirRascunho() {
    if (!supabase) { setErro("Supabase não configurado — não é possível gerar rascunho."); return; }
    setLoading(true);
    setErro(null);
    try {
      const rs = respostas.filter((r) => chavePaciente(r) === pacienteChave);
      const escalasPayload = rs.map((r) => {
        const interp = interpretarResposta(r.tipo, r.respostas, r.pontuacao);
        return { sigla: interp.sigla, resumo: interp.resumo };
      });
      const { data, error } = await supabase.functions.invoke("conceituacao-draft", {
        body: { tipo: toolId, escalas: escalasPayload, contexto, provider, model: model || undefined },
      });
      if (error) throw error;
      if (data?.error) { setErro(data.error); return; }
      const draft: Record<string, string> = data?.draft ?? {};
      setDados((d) => {
        const novo = { ...d };
        for (const label of L) if (!novo[label]?.trim() && draft[label]) novo[label] = draft[label];
        return novo;
      });
      setAiUsado(true);
    } catch (e) {
      setErro(await mensagemErroEdgeFunction(e, "Erro ao gerar rascunho."));
    } finally {
      setLoading(false);
    }
  }

  function exportarPDF() {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 180; const ML = 15; let y = 20;
    function txt(text: string, size = 10, bold = false, color: [number, number, number] = [40, 40, 40]) {
      doc.setFontSize(size); doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setTextColor(...color);
      for (const line of doc.splitTextToSize(text, W)) { if (y > 275) { doc.addPage(); y = 20; } doc.text(line, ML, y); y += size * 0.45; }
    }
    txt(ferramenta.titulo, 14, true, [30, 30, 30]); y += 3;
    txt(ferramenta.categoria, 9, false, [120, 120, 120]); y += 5;
    doc.setDrawColor(200, 200, 200); doc.line(ML, y, ML + W, y); y += 6;
    for (const label of L) {
      txt(label, 10, true); y += 1;
      const val = dados[label]?.trim();
      txt(val || "(não preenchido)", 10, false, val ? [40, 40, 40] : [180, 180, 180]); y += 4;
    }
    y += 4; doc.setDrawColor(200, 200, 200); doc.line(ML, y, ML + W, y); y += 6;
    txt(ferramenta.referencia, 8, false, [120, 120, 120]); y += 6;
    txt("Bruno de Souza Gonçalves · CRP 07/44472", 9, true, [120, 120, 120]);
    doc.save(`${toolId}_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  return {
    dados, set, pacienteChave, setPacienteChave, grupos, pacienteId, perfil,
    contexto, setContexto, provider, model, escolherProvider, escolherModel,
    loading, erro, aiUsado, sugerirRascunho,
    mensagens, inputChat, setInputChat, chatLoading, chatErro, enviarMensagemChat, encerrarSessao, encerrarLoading,
    anexoTexto, setAnexoTexto, anexoLoading, anexoErro, anexoOk, anexoTruncado, salvarAnexo, handleUploadPDF,
    exportarPDF,
  };
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit -p .`
Expected: at this point `ConceituacaoCognitiva.tsx` still has its own copy of everything (not yet retrofitted in Task 9) — this file compiles standalone since nothing imports it yet. Confirm `TypeScript: No errors found`.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useConceituacaoIA.ts
git commit -m "feat(ia): extrai useConceituacaoIA — chat/memória/anexo/erro compartilhados entre ferramentas"
```

---

### Task 8: Shared UI chrome — `PainelIAConceituacao.tsx`

**Files:**
- Create: `src/components/conceituacao/PainelIAConceituacao.tsx`

**Interfaces:**
- Consumes: `UseConceituacaoIAResult` from Task 7; `PROVEDORES`, `MODELOS_POR_PROVEDOR`, `nomeSeguro` from `@/hooks/useConceituacaoIA`; `box`, `labelCls`, `inputCls` from Task 6.
- Produces: `export function PainelIAConceituacao(props: { ia: UseConceituacaoIAResult }): JSX.Element` — consumed by Task 9 (retrofit) and Task 10–12 (new components).

- [ ] **Step 1: Write the file**

```tsx
import { Sparkles, Loader2, Info, Send, Paperclip, LogOut } from "lucide-react";
import { PROVEDORES, MODELOS_POR_PROVEDOR, nomeSeguro, type UseConceituacaoIAResult } from "@/hooks/useConceituacaoIA";
import { box, labelCls, inputCls } from "./CampoDiagrama";

// Chrome de IA compartilhado por todas as ferramentas de conceituação: seleção
// de paciente/provedor/modelo, contexto + rascunho automático, chat guiado,
// e anexos de referência. Cada ferramenta só desenha seu próprio diagrama por
// fora deste bloco — ver ConceituacaoCognitiva.tsx / ConceituacaoEsquema.tsx etc.
export function PainelIAConceituacao({ ia }: { ia: UseConceituacaoIAResult }) {
  return (
    <>
      <div className="glass-card mb-6 rounded-2xl p-5">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[var(--c-accent)]">Sugerir rascunho com IA</p>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className={labelCls}>Paciente (opcional — usa escalas de-identificadas)</label>
            <select value={ia.pacienteChave} onChange={(e) => ia.setPacienteChave(e.target.value)} className={inputCls}>
              <option value="">Nenhum / genérico</option>
              {ia.grupos.map(([chave, rs]) => (
                <option key={chave} value={chave}>{nomeSeguro(rs[0])} ({rs.length} resposta{rs.length !== 1 ? "s" : ""})</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className={labelCls}>Provedor</label>
              <select value={ia.provider} onChange={(e) => ia.escolherProvider(e.target.value)} className={inputCls}>
                {PROVEDORES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className={labelCls}>Modelo</label>
              <select value={ia.model} onChange={(e) => ia.escolherModel(e.target.value)} className={inputCls}>
                {MODELOS_POR_PROVEDOR[ia.provider].map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <label className={labelCls}>Contexto clínico (opcional)</label>
          <textarea value={ia.contexto} onChange={(e) => ia.setContexto(e.target.value)} rows={2}
            placeholder="Observações livres — NÃO inclua nome, CPF, telefone ou outros dados identificáveis"
            className={`${inputCls} resize-y`} />
          <p className="mt-1 text-[10px] text-[var(--c-muted)]">Você é responsável por não digitar dados que identifiquem o paciente aqui.</p>
        </div>
        <button onClick={ia.sugerirRascunho} disabled={ia.loading}
          className="mt-3 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
          style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
          {ia.loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {ia.loading ? "Gerando..." : "Sugerir rascunho (IA)"}
        </button>
        {ia.erro && <p className="mt-2 text-xs text-[var(--c-danger,#dc2626)]">{ia.erro}</p>}
      </div>

      {!ia.pacienteChave && (
        <div className="mb-6 flex items-start gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-[var(--c-text)]">
          <Info size={14} className="mt-0.5 flex-shrink-0 text-amber-500" />
          <span>Sem paciente selecionado: modo genérico — sem memória entre sessões e sem redação automática de nome. Não digite dados identificáveis.</span>
        </div>
      )}

      {ia.perfil && Object.keys(ia.perfil).length > 0 && (
        <div className={`${box} mb-6`}>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--c-accent)]">Perfil de longo prazo deste paciente</p>
          <div className="space-y-1.5 text-xs text-[var(--c-text)]">
            {Object.entries(ia.perfil).filter(([chave, valor]) => chave !== "situacoes_recorrentes" && valor).map(([chave, valor]) => (
              <p key={chave}><span className="font-semibold">{chave}:</span> {String(valor)}</p>
            ))}
            {Array.isArray(ia.perfil.situacoes_recorrentes) && ia.perfil.situacoes_recorrentes.length > 0 && (
              <p><span className="font-semibold">Temas recorrentes:</span> {(ia.perfil.situacoes_recorrentes as { texto?: string }[]).map((s) => s?.texto ?? String(s)).join("; ")}</p>
            )}
          </div>
        </div>
      )}

      <div className="glass-card mb-6 rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--c-accent)]">Conversa guiada</p>
          {ia.pacienteId != null && ia.mensagens.length > 0 && (
            <button onClick={ia.encerrarSessao} disabled={ia.encerrarLoading}
              className="flex items-center gap-1.5 rounded-full border border-[var(--c-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)] disabled:opacity-60">
              {ia.encerrarLoading ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
              Encerrar sessão
            </button>
          )}
        </div>

        {ia.mensagens.length > 0 && (
          <div className="mb-3 max-h-72 space-y-2 overflow-y-auto rounded-xl border border-[var(--c-border)] p-3">
            {ia.mensagens.map((m, i) => (
              <div key={i} className={`rounded-xl px-3 py-2 text-xs ${m.papel === "terapeuta" ? "ml-6 bg-[var(--c-accent)]/10 text-[var(--c-text)]" : "mr-6 bg-[var(--c-surface)] text-[var(--c-text)]"}`}>
                <p className="mb-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--c-muted)]">{m.papel === "terapeuta" ? "Você" : "IA"}</p>
                {m.conteudo}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input value={ia.inputChat} onChange={(e) => ia.setInputChat(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !ia.chatLoading) ia.enviarMensagemChat(); }}
            placeholder="Responda ou descreva o caso — a IA vai perguntando e preenchendo o diagrama"
            className={inputCls} />
          <button onClick={ia.enviarMensagemChat} disabled={ia.chatLoading || !ia.inputChat.trim()}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
            style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
            {ia.chatLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
        {ia.chatErro && <p className="mt-2 text-xs text-[var(--c-danger,#dc2626)]">{ia.chatErro}</p>}
      </div>

      {ia.pacienteId != null && (
        <div className={`${box} mb-6`}>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--c-accent)]">Referências (prontuário / documentos)</p>
          <p className="mb-3 text-[10px] text-[var(--c-muted)]">
            O nome deste paciente é trocado por iniciais+nascimento antes do envio à IA. Outros dados sensíveis do documento
            (CPF, endereço, nomes de terceiros) NÃO são filtrados — você é responsável por essa checagem.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--c-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--c-text)] transition-colors hover:border-[var(--c-accent)]">
              <Paperclip size={12} /> Anexar PDF
              <input type="file" accept="application/pdf" className="hidden" onChange={ia.handleUploadPDF} disabled={ia.anexoLoading} />
            </label>
          </div>
          <div className="mt-3">
            <label className={labelCls}>Ou cole um trecho do prontuário</label>
            <textarea value={ia.anexoTexto} onChange={(e) => ia.setAnexoTexto(e.target.value)} rows={3} className={`${inputCls} resize-y`} />
            <button onClick={() => ia.salvarAnexo("texto", ia.anexoTexto)} disabled={ia.anexoLoading || !ia.anexoTexto.trim()}
              className="mt-2 rounded-full border border-[var(--c-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--c-text)] transition-colors hover:border-[var(--c-accent)] disabled:opacity-60">
              {ia.anexoLoading ? "Salvando..." : "Salvar como referência"}
            </button>
          </div>
          {ia.anexoErro && <p className="mt-2 text-xs text-[var(--c-danger,#dc2626)]">{ia.anexoErro}</p>}
          {ia.anexoOk && !ia.anexoErro && (
            <p className="mt-2 text-xs text-[var(--c-accent)]">
              Referência salva — a IA vai usá-la nas próximas mensagens.
              {ia.anexoTruncado && " Documento grande: só o início foi guardado (limite de tamanho)."}
            </p>
          )}
        </div>
      )}

      {ia.aiUsado && (
        <div className="mb-6 flex items-start gap-2 rounded-2xl border border-[var(--c-accent)]/30 bg-[var(--c-accent)]/10 p-3 text-xs text-[var(--c-text)]">
          <Info size={14} className="mt-0.5 flex-shrink-0 text-[var(--c-accent)]" />
          <span>Rascunho gerado por IA — revise e edite antes de usar. Não é laudo.</span>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit -p .`
Expected: `TypeScript: No errors found`

- [ ] **Step 3: Commit**

```bash
git add src/components/conceituacao/PainelIAConceituacao.tsx
git commit -m "feat(ia): extrai chrome de UI (seletor/chat/anexos) compartilhado entre ferramentas"
```

---

### Task 9: Retrofit `ConceituacaoCognitiva.tsx` onto the hook

**Files:**
- Modify: `src/components/ConceituacaoCognitiva.tsx` (full rewrite of the file body — same external behavior)

**Interfaces:**
- Consumes: `useConceituacaoIA` (Task 7), `PainelIAConceituacao` (Task 8), `Campo`/`box`/`Seta` (Task 6).
- Produces: same `export function ConceituacaoCognitiva({ respostas }: { respostas: Resposta[] })` signature Task 13/`Painel.tsx` already calls — no caller change needed.

- [ ] **Step 1: Replace the whole file**

```tsx
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { ferramentas } from "@/content/ferramentas-terapeuta";
import { fadeUp } from "@/lib/motion";
import { useConceituacaoIA, type Resposta } from "@/hooks/useConceituacaoIA";
import { PainelIAConceituacao } from "@/components/conceituacao/PainelIAConceituacao";
import { box, Campo, Seta } from "@/components/conceituacao/CampoDiagrama";

const FERRAMENTA = ferramentas.find((f) => f.id === "conceituacao-cognitiva")!;
const L = FERRAMENTA.campos.map((c) => c.label);

export function ConceituacaoCognitiva({ respostas }: { respostas: Resposta[] }) {
  const ia = useConceituacaoIA("conceituacao-cognitiva", respostas, FERRAMENTA);

  return (
    <motion.div variants={fadeUp}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--c-muted)]">{FERRAMENTA.categoria}</p>
          <h2 className="text-lg font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{FERRAMENTA.titulo}</h2>
        </div>
        <button onClick={ia.exportarPDF}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
          style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
          <Download size={14} /> Salvar PDF
        </button>
      </div>

      <PainelIAConceituacao ia={ia} />

      <div className="space-y-0">
        <div className={box}><Campo label={L[0]} valor={ia.dados[L[0]] ?? ""} onChange={(v) => ia.set(L[0], v)} area /></div>
        <Seta />
        <div className={box}><Campo label={L[1]} valor={ia.dados[L[1]] ?? ""} onChange={(v) => ia.set(L[1], v)} /></div>
        <Seta />
        <div className={box}><Campo label={L[2]} valor={ia.dados[L[2]] ?? ""} onChange={(v) => ia.set(L[2], v)} area /></div>
        <Seta />
        <div className={box}><Campo label={L[3]} valor={ia.dados[L[3]] ?? ""} onChange={(v) => ia.set(L[3], v)} area /></div>
        <Seta />
        {/* ponytail: 2 situações fixas (igual ao formulário original); adicionar add/remove dinâmico se necessário */}
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1].map((sit) => {
            const base = 4 + sit * 6;
            return (
              <div key={sit} className="space-y-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={box}>
                    <Campo label={L[base + i]} valor={ia.dados[L[base + i]] ?? ""} onChange={(v) => ia.set(L[base + i], v)} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--c-border)] p-3">
        <p className="text-[9px] text-[var(--c-muted)]">{FERRAMENTA.referencia}</p>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit -p .`
Expected: `TypeScript: No errors found`. If it fails on an unused import in the old file, that's expected — this step fully replaces the file, so there should be nothing left over.

- [ ] **Step 3: Manual smoke test**

Start the dev server (`preview_start` with the `site` launch config, port 5174), log into `/bruno/painel`, open "Diagrama de Conceituação Cognitiva" from Ferramentas, and confirm: patient selector, provider/model selector, chat box, attachments box, and the Beck diagram all render and look the same as before the retrofit (same fields, same PDF export). This is the regression gate before multiplying the pattern to 4 more tools.

- [ ] **Step 4: Commit**

```bash
git add src/components/ConceituacaoCognitiva.tsx
git commit -m "refactor(ia): retrofit ConceituacaoCognitiva pro hook/chrome compartilhados"
```

---

### Task 10: New component — `ConceituacaoEsquema.tsx`

**Files:**
- Create: `src/components/ConceituacaoEsquema.tsx`

**Interfaces:**
- Consumes: same as Task 9 (`useConceituacaoIA`, `PainelIAConceituacao`, `CampoDiagrama` primitives), plus the `conceituacao-esquema` entry from Task 5.
- Produces: `export function ConceituacaoEsquema({ respostas }: { respostas: Resposta[] })` — consumed by Task 13 (`Painel.tsx` routing).

- [ ] **Step 1: Write the file**

```tsx
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { ferramentas } from "@/content/ferramentas-terapeuta";
import { fadeUp } from "@/lib/motion";
import { useConceituacaoIA, type Resposta } from "@/hooks/useConceituacaoIA";
import { PainelIAConceituacao } from "@/components/conceituacao/PainelIAConceituacao";
import { box, Campo, Seta } from "@/components/conceituacao/CampoDiagrama";

const FERRAMENTA = ferramentas.find((f) => f.id === "conceituacao-esquema")!;
const L = FERRAMENTA.campos.map((c) => c.label);

export function ConceituacaoEsquema({ respostas }: { respostas: Resposta[] }) {
  const ia = useConceituacaoIA("conceituacao-esquema", respostas, FERRAMENTA);

  return (
    <motion.div variants={fadeUp}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--c-muted)]">{FERRAMENTA.categoria}</p>
          <h2 className="text-lg font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{FERRAMENTA.titulo}</h2>
        </div>
        <button onClick={ia.exportarPDF}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
          style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
          <Download size={14} /> Salvar PDF
        </button>
      </div>

      <PainelIAConceituacao ia={ia} />

      <div className="space-y-0">
        <div className={box}><Campo label={L[0]} valor={ia.dados[L[0]] ?? ""} onChange={(v) => ia.set(L[0], v)} area /></div>
        <Seta />
        <div className={box}><Campo label={L[1]} valor={ia.dados[L[1]] ?? ""} onChange={(v) => ia.set(L[1], v)} area /></div>
        <Seta />
        <div className={box}><Campo label={L[2]} valor={ia.dados[L[2]] ?? ""} onChange={(v) => ia.set(L[2], v)} /></div>
        <Seta />
        {/* 2 situações fixas: Situação, Modo, Pensamento, Resposta Emocional, Resposta Comportamental (5 campos cada) */}
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1].map((sit) => {
            const base = 3 + sit * 5;
            return (
              <div key={sit} className="space-y-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className={box}>
                    <Campo label={L[base + i]} valor={ia.dados[L[base + i]] ?? ""} onChange={(v) => ia.set(L[base + i], v)} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <Seta />
        <div className={box}><Campo label={L[13]} valor={ia.dados[L[13]] ?? ""} onChange={(v) => ia.set(L[13], v)} area /></div>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--c-border)] p-3">
        <p className="text-[9px] text-[var(--c-muted)]">{FERRAMENTA.referencia}</p>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit -p .`
Expected: `TypeScript: No errors found`

- [ ] **Step 3: Commit**

```bash
git add src/components/ConceituacaoEsquema.tsx
git commit -m "feat(ia): diagrama de Conceituação — Terapia do Esquema"
```

---

### Task 11: New component — `ConceituacaoFuncional.tsx`

**Files:**
- Create: `src/components/ConceituacaoFuncional.tsx`

**Interfaces:**
- Same pattern as Task 10, using the `conceituacao-funcional` entry from Task 5.
- Produces: `export function ConceituacaoFuncional({ respostas }: { respostas: Resposta[] })` — consumed by Task 13.

- [ ] **Step 1: Write the file**

```tsx
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { ferramentas } from "@/content/ferramentas-terapeuta";
import { fadeUp } from "@/lib/motion";
import { useConceituacaoIA, type Resposta } from "@/hooks/useConceituacaoIA";
import { PainelIAConceituacao } from "@/components/conceituacao/PainelIAConceituacao";
import { box, Campo, Seta } from "@/components/conceituacao/CampoDiagrama";

const FERRAMENTA = ferramentas.find((f) => f.id === "conceituacao-funcional")!;
const L = FERRAMENTA.campos.map((c) => c.label);

export function ConceituacaoFuncional({ respostas }: { respostas: Resposta[] }) {
  const ia = useConceituacaoIA("conceituacao-funcional", respostas, FERRAMENTA);

  return (
    <motion.div variants={fadeUp}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--c-muted)]">{FERRAMENTA.categoria}</p>
          <h2 className="text-lg font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{FERRAMENTA.titulo}</h2>
        </div>
        <button onClick={ia.exportarPDF}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
          style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
          <Download size={14} /> Salvar PDF
        </button>
      </div>

      <PainelIAConceituacao ia={ia} />

      <div className="space-y-0">
        <div className={box}><Campo label={L[0]} valor={ia.dados[L[0]] ?? ""} onChange={(v) => ia.set(L[0], v)} /></div>
        <Seta />
        <div className={box}><Campo label={L[1]} valor={ia.dados[L[1]] ?? ""} onChange={(v) => ia.set(L[1], v)} area /></div>
        <Seta />
        {/* 2 situações fixas: Antecedente, Comportamento, Consequência (3 campos cada) */}
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1].map((sit) => {
            const base = 2 + sit * 3;
            return (
              <div key={sit} className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={box}>
                    <Campo label={L[base + i]} valor={ia.dados[L[base + i]] ?? ""} onChange={(v) => ia.set(L[base + i], v)} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <Seta />
        <div className={box}><Campo label={L[8]} valor={ia.dados[L[8]] ?? ""} onChange={(v) => ia.set(L[8], v)} area /></div>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--c-border)] p-3">
        <p className="text-[9px] text-[var(--c-muted)]">{FERRAMENTA.referencia}</p>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit -p .`
Expected: `TypeScript: No errors found`

- [ ] **Step 3: Commit**

```bash
git add src/components/ConceituacaoFuncional.tsx
git commit -m "feat(ia): diagrama de Conceituação Funcional (ABC)"
```

---

### Task 12: New components — `ConceituacaoACT.tsx` and `ConceituacaoProcessos.tsx`

**Files:**
- Create: `src/components/ConceituacaoACT.tsx`
- Create: `src/components/ConceituacaoProcessos.tsx`

**Interfaces:**
- Same pattern as Task 10/11, using the `conceituacao-act` and `conceituacao-processos` entries from Task 5.
- Produces: `export function ConceituacaoACT({ respostas }: { respostas: Resposta[] })`, `export function ConceituacaoProcessos({ respostas }: { respostas: Resposta[] })` — both consumed by Task 13.

- [ ] **Step 1: Write `ConceituacaoACT.tsx`**

```tsx
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { ferramentas } from "@/content/ferramentas-terapeuta";
import { fadeUp } from "@/lib/motion";
import { useConceituacaoIA, type Resposta } from "@/hooks/useConceituacaoIA";
import { PainelIAConceituacao } from "@/components/conceituacao/PainelIAConceituacao";
import { box, Campo, Seta } from "@/components/conceituacao/CampoDiagrama";

const FERRAMENTA = ferramentas.find((f) => f.id === "conceituacao-act")!;
const L = FERRAMENTA.campos.map((c) => c.label);

export function ConceituacaoACT({ respostas }: { respostas: Resposta[] }) {
  const ia = useConceituacaoIA("conceituacao-act", respostas, FERRAMENTA);

  return (
    <motion.div variants={fadeUp}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--c-muted)]">{FERRAMENTA.categoria}</p>
          <h2 className="text-lg font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{FERRAMENTA.titulo}</h2>
        </div>
        <button onClick={ia.exportarPDF}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
          style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
          <Download size={14} /> Salvar PDF
        </button>
      </div>

      <PainelIAConceituacao ia={ia} />

      <div className="space-y-0">
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={box}><Campo label={L[i]} valor={ia.dados[L[i]] ?? ""} onChange={(v) => ia.set(L[i], v)} area /></div>
          ))}
        </div>
        <Seta />
        {/* 2 situações fixas: gatilho, reação de inflexibilidade, custo (3 campos cada) */}
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1].map((sit) => {
            const base = 5 + sit * 3;
            return (
              <div key={sit} className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={box}>
                    <Campo label={L[base + i]} valor={ia.dados[L[base + i]] ?? ""} onChange={(v) => ia.set(L[base + i], v)} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--c-border)] p-3">
        <p className="text-[9px] text-[var(--c-muted)]">{FERRAMENTA.referencia}</p>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Write `ConceituacaoProcessos.tsx`**

```tsx
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { ferramentas } from "@/content/ferramentas-terapeuta";
import { fadeUp } from "@/lib/motion";
import { useConceituacaoIA, type Resposta } from "@/hooks/useConceituacaoIA";
import { PainelIAConceituacao } from "@/components/conceituacao/PainelIAConceituacao";
import { box, Campo, Seta } from "@/components/conceituacao/CampoDiagrama";

const FERRAMENTA = ferramentas.find((f) => f.id === "conceituacao-processos")!;
const L = FERRAMENTA.campos.map((c) => c.label);

export function ConceituacaoProcessos({ respostas }: { respostas: Resposta[] }) {
  const ia = useConceituacaoIA("conceituacao-processos", respostas, FERRAMENTA);

  return (
    <motion.div variants={fadeUp}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--c-muted)]">{FERRAMENTA.categoria}</p>
          <h2 className="text-lg font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{FERRAMENTA.titulo}</h2>
        </div>
        <button onClick={ia.exportarPDF}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
          style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
          <Download size={14} /> Salvar PDF
        </button>
      </div>

      <PainelIAConceituacao ia={ia} />

      <div className="space-y-0">
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={box}><Campo label={L[i]} valor={ia.dados[L[i]] ?? ""} onChange={(v) => ia.set(L[i], v)} area /></div>
          ))}
        </div>
        <Seta />
        <div className={box}><Campo label={L[6]} valor={ia.dados[L[6]] ?? ""} onChange={(v) => ia.set(L[6], v)} area /></div>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--c-border)] p-3">
        <p className="text-[9px] text-[var(--c-muted)]">{FERRAMENTA.referencia}</p>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit -p .`
Expected: `TypeScript: No errors found`

- [ ] **Step 4: Commit**

```bash
git add src/components/ConceituacaoACT.tsx src/components/ConceituacaoProcessos.tsx
git commit -m "feat(ia): diagramas de Conceituação ACT (Hexaflex) e Processos (EEMM)"
```

---

### Task 13: Wire the 4 new tools into `Painel.tsx`

**Files:**
- Modify: `src/pages/bruno/Painel.tsx`

**Interfaces:**
- Consumes: `ConceituacaoEsquema`, `ConceituacaoFuncional`, `ConceituacaoACT`, `ConceituacaoProcessos` (Tasks 10–12).

- [ ] **Step 1: Add the imports**

Next to the existing `import { ConceituacaoCognitiva } from "@/components/ConceituacaoCognitiva";` (line 24), add:

```ts
import { ConceituacaoEsquema } from "@/components/ConceituacaoEsquema";
import { ConceituacaoFuncional } from "@/components/ConceituacaoFuncional";
import { ConceituacaoACT } from "@/components/ConceituacaoACT";
import { ConceituacaoProcessos } from "@/components/ConceituacaoProcessos";
```

- [ ] **Step 2: Add the routing branches**

Replace:

```tsx
                {ferramentaAberta?.id === "conceituacao-cognitiva" ? (
                  <div>
                    <button onClick={() => { setFerramentaAberta(null); setFerramentaDados({}); }} className="mb-4 rounded-full border border-[var(--c-border)] p-2 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]"><X size={15} /></button>
                    <ConceituacaoCognitiva respostas={respostas} />
                  </div>
                ) : ferramentaAberta ? (
```

with:

```tsx
                {ferramentaAberta && ["conceituacao-cognitiva", "conceituacao-esquema", "conceituacao-funcional", "conceituacao-act", "conceituacao-processos"].includes(ferramentaAberta.id) ? (
                  <div>
                    <button onClick={() => { setFerramentaAberta(null); setFerramentaDados({}); }} className="mb-4 rounded-full border border-[var(--c-border)] p-2 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]"><X size={15} /></button>
                    {ferramentaAberta.id === "conceituacao-cognitiva" && <ConceituacaoCognitiva respostas={respostas} />}
                    {ferramentaAberta.id === "conceituacao-esquema" && <ConceituacaoEsquema respostas={respostas} />}
                    {ferramentaAberta.id === "conceituacao-funcional" && <ConceituacaoFuncional respostas={respostas} />}
                    {ferramentaAberta.id === "conceituacao-act" && <ConceituacaoACT respostas={respostas} />}
                    {ferramentaAberta.id === "conceituacao-processos" && <ConceituacaoProcessos respostas={respostas} />}
                  </div>
                ) : ferramentaAberta ? (
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit -p .`
Expected: `TypeScript: No errors found`

- [ ] **Step 4: Manual smoke test**

With the dev server running and logged into `/bruno/painel` → Ferramentas: confirm all 5 conceptualization tools now appear in the grid (auto-generated from `ferramentas`), each opens its own dedicated component (not the generic form), and the "close" (X) button returns to the grid for each. Pick one new tool (e.g. Esquema) and run through: select a patient, run "Sugerir rascunho", send one chat message, confirm fields populate and no console error appears.

- [ ] **Step 5: Commit**

```bash
git add src/pages/bruno/Painel.tsx
git commit -m "feat(painel): roteia as 4 novas ferramentas de conceituação pros componentes dedicados"
```

---

### Task 14: Final full-repo check

**Files:** none (verification only)

- [ ] **Step 1: Full type-check**

Run: `npx tsc --noEmit -p .`
Expected: `TypeScript: No errors found`

- [ ] **Step 2: Grep for leftover references to the old fixed-column perfil shape**

Run: `grep -rn "crenca_central\|crencas_intermediarias\|estrategias_compensatorias" supabase/functions src`
Expected: no matches outside `supabase/migrations/` (the migration is the only place those old column names should still appear, as backfill source columns).

- [ ] **Step 3: Deploy checklist (manual, needs explicit go-ahead before executing)**

- Apply the Task 1 migration to the live Supabase project (ask user first — touches real `paciente_perfil` data).
- `supabase functions deploy conceituacao-draft`
- `supabase functions deploy conceituacao-chat`
- Push `main` to trigger the GitHub Pages frontend deploy (same flow already used earlier this session).

- [ ] **Step 4: Post-deploy smoke test**

Log into the deployed painel, open each of the 5 conceptualization tools once, run one AI draft + one chat turn per tool, confirm no "Ferramenta desconhecida" error and no leftover generic error message (would indicate a `tipo`/`FERRAMENTAS` key mismatch missed by Task 2's read-through check).
