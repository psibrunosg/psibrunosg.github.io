# Conceituações múltiplas com IA — design

## Contexto

Hoje só o Diagrama de Conceituação Cognitiva (Beck) tem IA: chat guiado com
memória por paciente, anexo de PDF/texto, rascunho automático a partir de
escalas. Tudo isso vive dentro de `ConceituacaoCognitiva.tsx`, específico do
Beck (rótulos, prompts, e a estrutura de `paciente_perfil` hardcoded).

Vamos levar o mesmo recurso pra mais 4 frameworks de conceituação de caso,
mantendo Beck funcionando como está.

## Escopo — 5 ferramentas

Categoria "Conceituação" no painel do terapeuta:

1. **Diagrama de Conceituação Cognitiva** (Beck) — já existe, só recebe o
   retrofit pro hook compartilhado (§ Arquitetura).
2. **Conceituação — Terapia do Esquema** (modelo Young)
3. **Conceituação Funcional (ABC)** — análise funcional/comportamental
4. **Conceituação ACT (Hexaflex)**
5. **Conceituação — Processos (EEMM/Hayes)** — Terapia Baseada em Processos

Cada uma é um `id` próprio em `ferramentas-terapeuta.ts`, categoria
"Conceituação", igual ao padrão já usado pelas ferramentas existentes.

## Arquitetura

### Frontend: hook compartilhado

Extrai de `ConceituacaoCognitiva.tsx` um hook `useConceituacaoIA(toolId,
respostas)` cobrindo o que é idêntico entre as 5 ferramentas:

- Seleção de paciente + resolução/criação de identidade (`resolverPacienteId`)
- Chat guiado (mensagens, sessão, janela de histórico, encerrar sessão,
  timeout de inatividade)
- Memória de longo prazo do paciente (perfil)
- Anexo de PDF/texto colado como referência
- Rascunho automático via escalas de-identificadas
- Seleção de provedor/modelo de IA (localStorage compartilhado, já existente)
- Desempacotamento do erro real da edge function (`mensagemErroEdgeFunction`)

Cada ferramenta vira um componente pequeno (ex. `ConceituacaoEsquema.tsx`) que:
- Define seus próprios campos/labels e o layout visual do diagrama (livre —
  não força um layout genérico, cada framework desenha o que faz sentido pra
  ele)
- Usa o hook pra tudo que é dado/ação (chat, perfil, anexo, draft, erro)

`ConceituacaoCognitiva.tsx` é retrofitado pro mesmo hook — comportamento
observável não muda pro terapeuta, só o código deixa de duplicar lógica.

### Backend: config por ferramenta

`conceituacao-draft` e `conceituacao-chat` hoje hardcodam os rótulos e o
prompt de sistema do Beck. Passam a ler de um novo
`supabase/functions/_shared/ferramentas-conceituacao.ts`:

```ts
interface ConfigFerramenta {
  labels: string[];          // rótulos do diagrama, na ordem que a IA deve preencher
  promptDraft: string;       // "conceituacao-draft": gera o rascunho a partir das escalas
  promptTurno: string;       // "conceituacao-chat" ação "turno": entrevista socrática, 1 pergunta por vez
  promptEncerrar: string;    // "conceituacao-chat" ação "encerrar": atualiza o perfil de longo prazo (JSON livre, cada ferramenta define o shape)
}
export const FERRAMENTAS: Record<string, ConfigFerramenta> = {
  "conceituacao-cognitiva": { labels: [...], promptDraft: "...", promptTurno: "...", promptEncerrar: "..." },
  "conceituacao-esquema": { labels: [...], promptDraft: "...", promptTurno: "...", promptEncerrar: "..." },
  "conceituacao-funcional": { labels: [...], promptDraft: "...", promptTurno: "...", promptEncerrar: "..." },
  "conceituacao-act": { labels: [...], promptDraft: "...", promptTurno: "...", promptEncerrar: "..." },
  "conceituacao-processos": { labels: [...], promptDraft: "...", promptTurno: "...", promptEncerrar: "..." },
};
```

`conceituacao-draft` (só `promptDraft`+`labels`) e `conceituacao-chat` (as 3
ações — `promptTurno`, `promptEncerrar`, `labels`) buscam a config pelo `tipo`
já enviado no body (campo que já existe hoje) em vez de usar
`LABELS_CONCEITUACAO_COGNITIVA`/`SYSTEM_PROMPT_TURNO`/`SYSTEM_PROMPT_ENCERRAR`
fixos. Erro claro ("Ferramenta desconhecida: X") se o `tipo` não estiver no
mapa. Beck migra seus 4 textos atuais pra dentro do mapa sem mudar o
comportamento.

`chamarProvedor`/`extrairJSON` (`_shared/ai-providers.ts`) não mudam — já são
genéricos.

`buscarPerfil`/`formatarPerfil`/o upsert em `acaoEncerrar` (hoje leem/gravam
colunas fixas — `crenca_central` etc) passam a ler/gravar o `dados jsonb`
genérico filtrado por `(paciente_id, ferramenta_id)`, mas o merge continua
com a mesma confiabilidade de hoje (código controla o delta, não a IA):

- `formatarPerfil(dados)` vira 100% genérico — itera `Object.entries(dados)`
  (exceto `situacoes_recorrentes`, tratado à parte) e formata `chave: valor`;
  cada `promptEncerrar` de ferramenta já descreve o que cada chave significa,
  então o texto sai legível sem o código saber os nomes de antemão.
- Cada `promptEncerrar` pede à IA os campos escalares estáveis daquela
  ferramenta (nomes definidos no próprio prompt) **+ `situacoesNovas`**
  (mesma chave universal em todas as 5 ferramentas — só os temas
  GENUINAMENTE novos desta sessão, nunca a lista inteira de novo).
- O upsert faz `{ ...dadosAtuais, ...escalaresRecebidos, situacoes_recorrentes:
  [...existentes, ...situacoesNovas.map(texto => ({texto, criado_em: now()}))] }`
  — o array só cresce por delta controlado no código (timestamp gerado no
  servidor), exatamente como o Beck já funciona hoje; generaliza sem perder
  confiabilidade.

`paciente_anexos` e `paciente_mensagens` **não** ganham `ferramenta_id`:
anexos (PDF/prontuário) fazem sentido como contexto compartilhado entre
qualquer framework do mesmo paciente; mensagens já são isoladas por
`sessao_id` (gerado novo a cada montagem do componente/troca de ferramenta) e
nunca são lidas sem esse filtro — não há como um chat de uma ferramenta vazar
pra outra hoje.

### Dados: memória do paciente por ferramenta

`paciente_perfil` hoje tem colunas fixas do Beck. Migration adiciona
`ferramenta_id text not null default 'conceituacao-cognitiva'` e generaliza
pra guardar o perfil de longo prazo em `dados jsonb` (cada ferramenta decide
o shape do próprio JSON). Constraint única passa a ser
`(paciente_id, ferramenta_id)` em vez de `(paciente_id)`.

Migration de dados: linhas existentes viram
`ferramenta_id = 'conceituacao-cognitiva'`, e as colunas antigas
(`crenca_central`, `crencas_intermediarias`, `estrategias_compensatorias`,
`situacoes_recorrentes`) são movidas pra dentro de `dados` como chaves desse
mesmo nome — sem perda de dado histórico do Beck.

## Campos de cada diagrama

**Terapia do Esquema (Young)**
1. Necessidades emocionais não supridas na infância (origem)
2. Esquemas Iniciais Desadaptativos (EIDs) identificados
3. Estilo de Enfrentamento predominante (Rendição / Evitação / Supercompensação)
4. Situação 1
5. Modo de Esquema ativado (Sit. 1)
6. Pensamento (Sit. 1)
7. Resposta Emocional (Sit. 1)
8. Resposta Comportamental (Sit. 1)
9. Situação 2
10. Modo de Esquema ativado (Sit. 2)
11. Pensamento (Sit. 2)
12. Resposta Emocional (Sit. 2)
13. Resposta Comportamental (Sit. 2)
14. Padrão relacional/vincular geral

**Conceituação Funcional (ABC)**
1. Comportamento-alvo
2. Função hipotética (fuga/esquiva, atenção, reforço tangível, autorregulação)
3. Situação 1 — Antecedente
4. Situação 1 — Comportamento
5. Situação 1 — Consequência (o que mantém)
6. Situação 2 — Antecedente
7. Situação 2 — Comportamento
8. Situação 2 — Consequência
9. Consequências de longo prazo / custo do padrão

**ACT (Hexaflex)**
1. Valores identificados
2. Ação comprometida (passos práticos)
3. Fusão cognitiva (pensamentos aos quais está fundido)
4. Esquiva experiencial (do que foge)
5. Self conceitualizado (história que conta sobre si)
6. Situação 1 — gatilho
7. Situação 1 — reação de inflexibilidade
8. Situação 1 — custo
9. Situação 2 — gatilho
10. Situação 2 — reação de inflexibilidade
11. Situação 2 — custo

**EEMM / Processos (Hayes)**
1. Processo Afetivo
2. Processo Cognitivo
3. Processo Atencional
4. Processo do Self
5. Processo Motivacional
6. Processo Comportamental
7. Hipótese do processo central de manutenção

## Fluxo de dados (igual pras 5, via hook)

1. Terapeuta seleciona paciente (opcional) → hook resolve/cria `pacientes`,
   carrega `paciente_perfil` filtrado por `(paciente_id, ferramenta_id)`.
2. Terapeuta conversa no chat ou clica "Sugerir rascunho" → edge function
   recebe `tipo` (id da ferramenta), busca config em `FERRAMENTAS`, monta
   prompt com os labels certos, chama o provedor de IA escolhido.
3. Resposta preenche os campos do diagrama (via `campos`/`draft`) — terapeuta
   revisa/edita antes de exportar em PDF (cada componente mantém seu próprio
   `exportarPDF`, já que o layout impresso também é específico do framework).
4. Ao encerrar sessão, resumo atualiza `paciente_perfil.dados` daquela
   ferramenta — memória de longo prazo só entra na próxima conversa da mesma
   ferramenta com o mesmo paciente (não vaza entre frameworks).

## Tratamento de erro

Reaproveita `mensagemErroEdgeFunction` (já existe) — nenhuma mudança aqui,
só passa a ser usado também pelas 4 ferramentas novas via hook.

## Teste

- `tsc --noEmit` depois de cada ferramenta implementada.
- Smoke test manual no painel logado: selecionar cada uma das 5 ferramentas,
  rodar 1 rascunho e 1 turno de chat, confirmar que preenche os campos certos
  e que a memória de perfil não mistura entre ferramentas do mesmo paciente.
- Migration testada localmente (`supabase db reset` ou equivalente) antes de
  aplicar em produção — envolve dado real de paciente_perfil existente.

## Ordem de implementação

Construir as 4 ferramentas novas juntas (decisão do usuário), na ordem:
1. Hook compartilhado + retrofit do Beck (garante que nada quebrou antes de
   multiplicar o padrão)
2. Migration de `paciente_perfil`
3. `_shared/ferramentas-conceituacao.ts` + generalização dos 2 edge functions
4. 4 componentes novos (Esquema, Funcional, ACT, EEMM), um de cada vez
5. Registro em `ferramentas-terapeuta.ts` + roteamento no `Painel.tsx`
