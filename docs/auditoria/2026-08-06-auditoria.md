# Auditoria completa — psibrunosg.github.io

**Data:** 2026-08-06 · **Commit base:** `62024b5` · **Método:** 7 subagentes read-only + consolidação · **Status:** auditoria de código completa; passagem ao vivo no navegador pendente

Nenhum arquivo de código foi alterado. Toda afirmação carrega âncora `arquivo:linha`. O relatório não contém dado de paciente.

**Severidade**

| Sev | Significado |
|---|---|
| **P0** | Segurança, PII ou perda de dado clínico |
| **P1** | Quebrado em produção hoje |
| **P2** | Confusão / UX / prejuízo clínico |
| **P3** | Dívida técnica e limpeza |

**Cobertura**

| Agente | Escopo | Estado |
|---|---|---|
| S1 | Segurança & banco de dados | ✅ |
| S2 | Painel do terapeuta — crítica + nova arquitetura | ✅ |
| S3 | Exercícios — ludicidade & interatividade | ✅ |
| S4 | Psicoeducação & cérebro 3D | ✅ |
| H1 | Acessibilidade WCAG 2.1 AA | ✅ |
| H2 | Bloat & duplicação | ✅ |
| H3 | Build, performance, SEO, PWA | ✅ |
| S5 | Passagem ao vivo no navegador (produção, logado) | ⏳ não executada |

---

## Sumário executivo

O site é quatro produtos empilhados que cresceram por acréscimo: painel do terapeuta, escalas psicométricas, 35+ exercícios e uma camada de psicoeducação com laboratório 3D. Cada frente trouxe seu próprio padrão de layout, persistência, progresso e identidade de paciente — e nenhuma conversa com as outras.

**Três coisas estão quebradas em silêncio.** Nenhuma delas emite erro; todas parecem funcionar.

1. **A escala de risco suicida não dispara alerta nenhum.** `classificarCssrs` está escrita, testada, exportada — e nunca é importada em lugar nenhum do app. `detectarRiscos` só conhece PHQ-9 item 9 e BHS. Um paciente que endossa tentativa ou preparação no C-SSRS não gera linha na triagem, não recebe selo, e o toast de tempo real se auto-dispensa em 8 segundos calculando `critico = false`.
2. **A "exclusão permanente" LGPD apaga 1 de 7 tabelas.** Sobrevivem transcrições de IA sobre o paciente, texto integral de PDFs de prontuário, perfil de conceituação, configuração de psicoeducação e o nome em `patient_codes`. A UI pede que o terapeuta digite o nome do paciente para confirmar "exclusão permanente".
3. **Nenhum exercício foi gravado no banco desde a migração para códigos de 8 dígitos.** Dois bloqueios independentes: `save-session` valida `/^\d{5}$/` e `exercise_sessions.code` continua `varchar(5)`. O cliente só faz `console.warn`. E mesmo que gravasse, não adiantaria: a leitura do banco nunca foi implementada — os ramos `if (code)` e `else` de `useExerciseSession` são o mesmo código, e o comentário admite.

**O resto em uma linha cada:** três edge functions dizem "valida JWT" no comentário e apenas decodificam sem verificar assinatura · um endpoint público é oráculo de enumeração que devolve esquemas clínicos ativos · conteúdo restrito é liberado por uma flag de localStorage editável no devtools · CPF e contato de emergência são gravados em localStorage a cada tecla e ficam lá indefinidamente se o formulário for abandonado · o botão primário do app tem contraste 1,95:1 no modo escuro e 2,19:1 no noturno · o loop de recompensa paga por clique, não por reflexão, e tem um farm infinito · a psicoeducação desenha uma trilha e a copy diz que não há ordem · o laboratório 3D carrega ~18 MB atrás de um spinner indeterminado, num bundle único de 3,4 MB sem nenhum code splitting · o CI não roda lint nem testes.

**O que está bem.** As defesas que existem são boas: `generate-code` autentica corretamente e é o modelo a replicar; `validate-code` tem rate-limit real com janela deslizante; os helpers SQL foram movidos para o schema `private`, fechando o oráculo via RPC; a página de Escala do paciente é notavelmente mais cuidadosa que o resto do app (radiogroup com roving tabindex, autosave com retomar/descartar, `aria-live`, `useReducedMotion`) — ela é a referência interna que as outras frentes deveriam copiar; os disclaimers clínicos são consistentes e evitam causalidade simplista; 65 testes passam.

---

## Prioridade 0 e 1 — consolidado

Deduplicado entre agentes. Ordenado por urgência clínica.

| # | Sev | Achado | Evidência | Frente |
|---|-----|--------|-----------|--------|
| 1 | P0 | **C-SSRS não dispara triagem.** `detectarRiscos` só trata `phq9` e `bhs`. `classificarCssrs` tem 0 importadores em todo o repo | `src/lib/scoring.ts:158-183`, `:212-221` | Painel |
| 2 | P0 | **Exclusão LGPD apaga só `respostas_questionarios`.** `pacientes` não tem FK para ela; nenhum cascade dispara. Sobrevivem 6 tabelas, inclusive `paciente_mensagens` e `paciente_anexos` | `src/pages/bruno/Painel.tsx:960-967`; migrações `20260718000000:17-19,52-53,77-79,105-107` | Banco |
| 3 | P0 | **Gravação de exercício falha em silêncio.** `save-session` exige `/^\d{5}$/`; `generate-code:51` emite 8 dígitos; `exercise_sessions.code` é `varchar(5)` | `supabase/functions/save-session/index.ts:20`; `supabase/schema_exercicios.sql:15`; erro só em `console.warn` (`useExerciseSession.ts:85,142`) | Banco / Exercícios |
| 4 | P0 | **Leitura de sessão do banco nunca implementada.** Ramos `if (code)` e `else` idênticos, ambos só localStorage; comentário admite | `src/hooks/useExerciseSession.ts:22-45` | Exercícios |
| 5 | P0 | **`jwtDecode` sem verificação de assinatura** em 2 edge functions — o comentário do código diz "Valida token JWT" e o código só decodifica | `unlock-restricted/index.ts:24-26`; `patient-progress/index.ts:23-26` | Segurança |
| 6 | P0 | **`conceituacao-chat` sem checagem de auth**, operando com service role sobre `pacienteId` arbitrário do body | `conceituacao-chat/index.ts:238-256`, `:95`, `:150`, `:210` | Segurança |
| 7 | P0 | **`psicoed-personalizada` é oráculo de enumeração**: sem auth, sem rate-limit, sem regex; respostas distintas por estado e devolve esquemas YSQ ativos | `psicoed-personalizada/index.ts:66-123` | Segurança |
| 8 | P0 | **Conteúdo restrito liberado por localStorage** editável no devtools | `src/pages/ExerciciosRestritos.tsx:112-127`; escrita em `Exercicios.tsx:437` | Segurança |
| 9 | P0 | **PII completa em localStorage a cada tecla** — nome, CPF, nascimento, e-mail, telefone, contato de emergência, responsável. Limpa só em submit ou descarte explícito | `src/pages/paciente/Escala.tsx:167-177`; limpeza `:256`, `:304` | Segurança |
| 10 | P1 | **Escala aparenta sucesso e descarta os dados quando o Supabase não está configurado.** `salvarResposta` retorna `{error: null}` com o cliente nulo; a página segue para a tela de resultado | `src/lib/supabase.ts:51-55`; `Escala.tsx:255-257` | Banco |
| 11 | P1 | **Botão primário ilegível nos temas escuro e noturno.** `text-white` sobre `--c-accent` = 1,95:1 (escuro) e 2,19:1 (noturno). Padrão em ~50 arquivos | `src/styles/theme-lobo.css:43`, `:71` | A11y |
| 12 | P1 | **`ChuvaPreocupacoes` só é jogável arrastando** — sem teclado, sem botão, sem `useReducedMotion`, com cards caindo e timer | `src/components/exercicios/ChuvaPreocupacoes.tsx:126-140`, `:132-133` | Exercícios / A11y |
| 13 | P1 | **Zero code splitting.** 0 hits de `React.lazy`/`import()` em `src/`; 77 rotas estáticas em `App.tsx`; sem `manualChunks`. Bundle único de 3.361.855 B | `src/App.tsx:1-162`; `vite.config.ts` | Build |
| 14 | P1 | **CI não roda lint, testes nem `check:neuro-models`**, e `npm run lint` falha hoje com 63 erros | `.github/workflows/deploy.yml` — só `npm ci` + `npm run build` | Build |
| 15 | P1 | **Trilha do 3D não reseta os outros modos**, e o ramo `activeTour` está abaixo de therapy/mindfulness/stress no ternário: a câmera voa a trilha enquanto o texto mostra outro modo | `src/pages/Neuroanatomia3D.tsx:484-492` vs `:655`,`:670`,`:685`,`:700`; prioridade em `:122-134` | 3D |
| 16 | P1 | **9 exercícios nunca chamam `save()`** — só `complete(score)`. Em `RoletaTerapeutica` o payload clínico inteiro (estimativa antes → depois) é descartado | `RoletaTerapeutica.tsx:143-154`; `AcerteDistorcao.tsx:24`; `BalaoPensamentos.tsx:16` + 6 outros | Exercícios |
| 17 | P1 | **Farm de XP/streak**: `complete()` a cada balão solto; e mais 6 exercícios contam replay como sessão nova | `BalaoPensamentos.tsx:22-33`; `ParesMente.tsx:70,127`; `ChuvaPreocupacoes.tsx:44-47,154`; +4 | Exercícios |
| 18 | P1 | **Psicoeducação infla XP e streak de qualquer trilha** — `useTrilha` conta todas as regas, inclusive `psicoed:*` | `useProgresso.ts:14`; `useTrilha.ts:90-91` | Exercícios |
| 19 | P1 | **`save()` sem debounce** apesar do comentário; sliders disparam um POST por `onChange` | `useExerciseSession.ts:50-97`; `InundacaoIncertezas.tsx:48-53` | Exercícios |
| 20 | P1 | **`complete()` na rodada 3 não muda estado** — "Finalizar" fica na tela sem efeito visível, e cliques repetidos re-disparam | `MuralhaEvidencias.tsx:60-69` | Exercícios |
| 21 | P1 | **Delete em massa de dados clínicos sem confirmação**, enquanto apagar um post de blog confirma | `Painel.tsx:954-958` vs `:900` | Painel |
| 22 | P1 | **Falha de fetch se apresenta como "sem dados"** — `carregar()` descarta o `error` e a tela diz "Nenhuma resposta" | `Painel.tsx:838-844`; render `:1427` | Painel |
| 23 | P1 | **Abrir uma linha do histórico apaga a síntese não salva** do parecer, sem aviso | `Painel.tsx:1087-1088`, chamado de `:1516`, `:701-703`, `:680`, `:1209` | Painel |
| 24 | P1 | **"Excluir código" não exclui** — confirma exclusão e faz `active=false`; a lista filtra `active=true`, então some sem caminho de volta | `painelPacientes.tsx:258-275`, `:108` | Painel |
| 25 | P1 | **`select("*")` traz PII de toda a base a cada load**, sem colunas nem paginação; a UI usa 4 campos | `Painel.tsx:841`; colunas em `supabase.ts:31-39` | Painel |
| 26 | P1 | **`respostas_questionarios` aceita INSERT anônimo com `patient_code` arbitrário** para escalas não restritas → YSQ falso vira "o mais recente" lido pela psicoeducação personalizada | policy `20260712120000:23-49`; `psicoed-personalizada:94-101` | Segurança |
| 27 | P1 | **Schema drift**: `respostas_questionarios` e `blog_posts` sem `CREATE TABLE` nem policy de leitura em nenhuma migração, embora o painel faça CRUD | `grep create table` → 9 tabelas; `blog_posts` = 0 ocorrências em `*.sql` | Banco |
| 28 | P1 | **Seis tabelas com RLS `using(true) with check(true)`** para `authenticated`, e o `revoke` de `respostas_questionarios` mira só `anon` | `20260718000000:40,64,92,120`; `20260718170000:26`; `20260722000000:30`; `20260711014942:99-100` | Segurança |
| 29 | P1 | **`exercise_sessions` SELECT `to public` sem checar posse** — conhecendo qualquer código ativo, lê-se sessão de qualquer paciente | `20260711120000:64-69`, `:71` | Segurança |
| 30 | P1 | **Redação cobre só o nome próprio**; anexos guardam CPF, endereço e terceiros em claro — e são reinjetados no prompt do LLM | `_shared/redacao.ts:16-38`; `conceituacao-chat:122-124` | Segurança |
| 31 | P1 | **Prompt injection com exfiltração**: anexo entra sem sanitização, saída do modelo volta ao cliente e é persistida | `conceituacao-chat:118-131`, `:146`, `:224-228` | Segurança |
| 32 | P1 | **Transferência de dado clínico a 7 provedores de LLM sem base documentada** (art. 11 + art. 33 LGPD) | `_shared/ai-providers.ts:7-18` | Segurança |
| 33 | P1 | **Chave de API de LLM em localStorage** | `useConceituacaoIA.ts:150,199`; `nineRouter.ts:70` | Segurança |
| 34 | P1 | **`showContext` default `true`** carrega o córtex no primeiro paint; e o toggle usa o mesmo `<Suspense>` do modelo, então a cena inteira some e volta ao spinner | `Neuroanatomia3D.tsx:117`; `BrainModel.tsx:35`,`:491`; `Neuroanatomia3D.tsx:281-288` | 3D |
| 35 | P1 | **2 de 5 territórios do mapa nunca podem acender conclusão** — o 3D tem quiz inline que não persiste; Mundos grava com id que não bate com o do território | `Neuroanatomia3D.tsx:382-430` (sem `useProgresso`); `PersonagensTorajo.tsx:59` vs `psicoed.ts:60` | Psicoed |

---

## Conflitos entre agentes, resolvidos

Três divergências apareceram entre relatórios. Resolvidas por leitura direta do código.

**1. Quantos `.obj` são carga morta.** H2 diz 141 (34,5 MB); H3 diz 210 (41,9 MB). **H2 está certo.** H3 contou apenas os 30 referenciados por `neuroanatomia.ts` e ignorou o glob de `BrainModel.tsx:9`, que carrega dinamicamente os arquivos corticais. Apagar 210 quebraria a camada de contexto anatômico **e** faria `check:neuro-models` falhar, que exige ≥60 corticais em disco (`scripts/check-neuro-models.mjs:16`). Número correto: **141 arquivos nunca carregados**.

**2. Quantos arquivos corticais.** O script reporta 83 (12,2 MB); S4/H2 dizem 69 (8,98 MB). **Ambos estão certos** — não há drift. As duas listas de marcadores são idênticas, mas o runtime aplica um filtro a mais: `BrainModel.tsx:14` exclui os que já pertencem a uma região selecionável (`!usedUrls.has(url)`), o script não. Runtime carrega 69 dos 83 que casam com os marcadores.

**3. `dist/` está commitado?** O plano assumia que sim. **Não está** — `.gitignore:2` cobre e `git ls-files dist` retorna vazio. Falso alarme, removido dos achados. Já `graphify-out/` **está** rastreado (12 arquivos) e não tem entrada no `.gitignore`.

**4. `src/lib/motion.ts` é código morto?** Não — tem 27 importadores. O defeito real é o inverso: nenhum dos 32 arquivos de `components/exercicios/` o usa, preferindo 122 ocorrências inline de `whileHover`/`whileTap`.

**5. `/de-onde-vem-seus-padroes` é rota órfã?** Não. É linkada de `EsquemasIniciais.tsx:25`, e a ausência no mapa público é **deliberada e comentada** em `App.tsx:104-105` ("ainda NÃO surfaceado no mapa público até aprovação do Bruno"). O problema real é outro: o único acesso está a 3 cliques atrás de uma pele de anime.

---

## Verificação

**Âncoras amostradas.** 10 referências `arquivo:linha` de achados P0/P1 foram abertas e conferidas pelo orquestrador. Todas batem com o que o agente afirmou:

`scoring.ts:158-183` e `:212-221` (grep confirma 1 única ocorrência de `classificarCssrs`, a própria definição) · `Painel.tsx:960-967` · `useExerciseSession.ts:22-45` (ramos byte a byte iguais, com o comentário-TODO) · `save-session/index.ts:20` · `schema_exercicios.sql:15` · `unlock-restricted/index.ts:24-26` e `patient-progress/index.ts:23-26` · `supabase.ts:51-55` · `Neuroanatomia3D.tsx:117` · `ExerciciosRestritos.tsx:112-127` · `Escala.tsx:167-177`.

**Comandos, saída real.**

```bash
npm test
```
Passa. `6 arquivos, 65 testes, 2,32s`.

```bash
npm run check:neuro-models
```
Passa. `30 referências válidas, 4 pares completos e 83 modelos corticais (12.2 MB)`.

```bash
npm run lint
```
**Falha.** `✖ 64 problems (63 errors, 1 warning)` — 19 `no-explicit-any`, 15 `react-hooks/set-state-in-effect`, 8 `react-hooks/refs`, 8 `no-useless-assignment`, 5 `react-hooks/static-components`, 4 `react-hooks/purity`, 3 `exhaustive-deps`. Concentrado em `3d/BrainModel.tsx` (8), `paciente/Escala.tsx`, `psicoed/NarrativaEsquemaView.tsx` e 12 arquivos de `components/exercicios/`.

```bash
npm run build
```
**Falha localmente** em `tsc -b`:
```
src/components/psicoed/TerritorioTorajo.tsx(13,18): error TS2307: Cannot find module 'gsap' or its corresponding type declarations.
src/components/psicoed/TerritorioTorajo.tsx(14,31): error TS2307: Cannot find module 'gsap/ScrollTrigger' or its corresponding type declarations.
src/components/psicoed/TerritorioTorajo.tsx(15,44): error TS2307: Cannot find module 'lottie-web' or its corresponding type declarations.
```
Causa verificada: `gsap` e `lottie-web` estão em `package.json:21,24` e no `package-lock.json`, mas **ausentes do `node_modules` local**. O CI usa `npm ci`, que instala a partir do lock — então **isto é uma defasagem do ambiente local, não uma quebra de produção**. Rode `npm install` antes de qualquer trabalho neste repo.

**Consequência para os números de bundle:** não foi possível gerar `dist/` nesta rodada. Os tamanhos abaixo vêm de um `dist/` pré-existente de 24/jul e estão marcados como **defasados**. São **bytes em disco** — ninguém mediu bytes transferidos nesta auditoria (isso depende da passagem ao vivo, ainda pendente).

**Varredura de PII:** o relatório foi construído inteiramente a partir de código. Não contém nome, CPF, telefone, e-mail nem qualquer dado de paciente.

---

# S1 — Segurança & banco de dados

## Achados adicionais aos já listados nos P0/P1

| # | Sev | Achado | Evidência | Correção proposta | Esforço |
|---|-----|--------|-----------|-------------------|---------|
| S1-a | P2 | `validation_attempts` cresce sem limite — endpoint público insere a cada requisição, sem TTL. Degrada o próprio rate-limit e acumula IPs | `20260711014942:138-145`; `validate-code:53` | `pg_cron` diário apagando > 1 dia | S |
| S1-b | P2 | Código de paciente trafega em query string; fica em histórico, `Referer`, logs de proxy e no corpo da mensagem de WhatsApp | `painelPacientes.tsx:47-49,60-64`; `Escala.tsx:141-152` | Aceitar via fragmento `#codigo=` | S |
| S1-c | P2 | `Access-Control-Allow-Origin: *` nas 8 edge functions — amplia o alcance dos furos de auth | `validate-code:10` e os outros 7 | Allowlist do domínio | S |
| S1-d | P2 | Rate-limit fraco contra códigos legados de 5 dígitos (espaço de 10⁵, ~1.920 tentativas/dia/IP, paralelizável). Os de 8 dígitos estão fora de alcance | `validate-code:14-15`, `:28` | Aposentar os de 5 dígitos | S |

## Inventário RLS

| Tabela | RLS | Policies | Veredicto |
|---|---|---|---|
| `patient_codes` | on | nenhuma em migração; a citada em `20260712020000:5` só existe em comentário | **drift** — o painel faz SELECT/UPDATE, logo há policy fora do repo |
| `exercise_sessions` | on | INSERT/SELECT/UPDATE `to public`, predicado `private.code_is_active(code)`. Sem DELETE | **permissiva demais** — sem posse |
| `respostas_questionarios` | on | só INSERT | **drift + permissiva** |
| `validation_attempts` | on | nenhuma (service role) | OK — intencional |
| `pacientes` | on | `for all to authenticated using(true) with check(true)` | **permissiva demais** |
| `paciente_perfil` | on | idem | **permissiva demais** |
| `paciente_mensagens` | on | idem | **permissiva demais** |
| `paciente_anexos` | on | idem | **permissiva demais** |
| `paciente_psicoed` | on | idem | **permissiva demais** |
| `conceituacoes_registros` | on | idem | **permissiva demais** |
| `blog_posts` | ? | nenhuma referência em `*.sql` | **ausente/drift** |

## Proposta de modelo de dados

**Identidade canônica: `pacientes.id`.** Já existe, com backfill correto (`20260718000000:17`, `:130-148`). Falta o resto do sistema apontar para ela.

- **`patient_codes`** deixa de ser identidade e vira credencial: `add column paciente_id`. Um paciente tem vários códigos ao longo do tempo — hoje trocar o código cria um "paciente" novo.
- **`chavePaciente()`** some. É chave derivada, recalculada a cada render, duplicada em dois arquivos, que quebra quando o paciente digita o nome diferente. Substituir por `respostas_questionarios.paciente_id`; o agrupamento vira `group by` no banco em vez de `Map` no cliente (`Painel.tsx:445-449`).
- **`exercise_sessions.code varchar(5)`** → `paciente_id`. Mata o bug de largura e a FK para uma credencial.

**O drift real é o oposto do esperado.** `nome, cpf, nascimento, email, telefone, contato_emergencia_*, responsavel_*` são colunas de `respostas_questionarios`, gravadas de novo a cada escala (`Escala.tsx:238-254`). Um paciente com seis escalas tem seis cópias do CPF. É simultaneamente o problema de LGPD (seis lugares para apagar) e o de modelagem (nenhuma fonte de verdade). Mover para `pacientes`.

**Fica em jsonb, legitimamente:** `paciente_perfil.dados` (descolunizado de propósito em `20260721000000`, para não exigir DDL a cada ferramenta), `exercise_sessions.payload` (shape por slug, nunca consultado por campo), `conceituacoes_registros.dados` (snapshot histórico), `respostas_questionarios.respostas` (array posicional). Nada hoje em jsonb precisa virar coluna.

## Índices faltantes

| Índice | Query que o justifica |
|---|---|
| `respostas_questionarios(criado_em desc)` | `Painel.tsx:841` — sem filtro nem limite, a cada carga e após cada delete |
| `respostas_questionarios(patient_code, tipo, criado_em desc)` | `psicoed-personalizada:94-101` — endpoint público, a cada visita |
| `exercise_sessions(code, started_at desc)` | `patient-progress:35-39`; o índice `(code, exercise_slug)` não cobre a ordenação |
| `blog_posts(publicado, criado_em desc)` | `supabase.ts:84`, em toda carga do blog público |
| `pacientes(lower(btrim(nome_paciente)))` acessível ao planner | `useConceituacaoIA.ts:79` e `Painel.tsx:529` usam `.ilike()`, que não casa com o índice sobre a expressão → seq scan |

**Não** recomendado: índice em `tipo`/`risco_status`. O painel filtra os dois no cliente (`Painel.tsx:1285`) depois de trazer a tabela inteira. Corrigir a query primeiro.

## Ciclo de vida de PII / LGPD

**Criação:** `Escala.tsx`, etapa "dados".

**Persistência em 4 lugares:** rascunho em localStorage reescrito a cada tecla (`Escala.tsx:167-177`) · `respostas_questionarios`, PII completa por linha, insert com anon key · `pacientes.nome_paciente`/`nascimento` · `paciente_anexos.conteudo_redigido`, texto integral de PDFs com só o nome redigido.

**Trânsito:** para 7 provedores de LLM (`_shared/ai-providers.ts:7-18`), via `conceituacao-chat:118-131` e `nineRouter.ts:176-187`. Nenhum DPA no repo.

**Quem lê:** terapeuta autenticado; edge functions com service role; e, pelas policies `using(true)` e pelos grants residuais, qualquer conta autenticada do projeto. Somando os furos de auth, também qualquer anônimo, para partes relevantes.

**Direito ao esquecimento:** parcial e enganoso (achado 2). As FKs com `on delete cascade` existem — bastaria deletar de `pacientes`, o que o código nunca faz.

**Retenção:** inexistente. Nenhum TTL em nenhuma tabela. Sem log de auditoria de leitura, sem export/portabilidade, sem registro de operações de tratamento.

## Não confirmado

- **`verify_jwt` das edge functions.** Não existe `supabase/config.toml` no repo, então o gateway pode verificar assinatura antes do handler. Contra-indício forte: `useExerciseSession.ts:69-83` chama `save-session` sem nenhum header `Authorization` — se `verify_jwt` estivesse ligado, esse caminho nunca teria funcionado.
- **Se o signup do projeto Supabase está aberto.** Determina se as policies `using(true)` são risco teórico ou exposição direta. Só verificável no dashboard.
- **Conteúdo real das policies** de `respostas_questionarios`, `patient_codes` e `blog_posts` — aplicadas fora de versionamento. É o próprio achado do schema drift.
- **Se `exercise_sessions.code` foi alargado à mão no remoto.** Se sim, só metade do achado 3 vale.

---

# S2 — Painel do terapeuta

## Achados adicionais

| # | Sev | Achado | Evidência | Correção proposta | Esforço |
|---|-----|--------|-----------|-------------------|---------|
| S2-a | P2 | A mesma métrica de risco mostra números diferentes em duas telas: a Visão geral ignora `risco_status`, a aba Respostas filtra `resolvido` | `Painel.tsx:1161-1162`,`:1184` vs `:1287-1289`,`:1328` | Derivar ambos do mesmo cálculo | S |
| S2-b | P2 | O número mais urgente do painel não é clicável — o card de risco é `<div>` puro, e a tela inicial abre numa grade de 4 métricas de vaidade | `Painel.tsx:1191-1198`, `:1180-1185` | Card vira botão; melhor, triagem sobe para a tela inicial | S |
| S2-c | P2 | "Acessos" e "Respostas" tratam o mesmo paciente sem se falarem — e `last_seen_at`, que ligaria os dois, é buscado, mapeado e nunca renderizado | `painelPacientes.tsx:107`,`:35`,`:14` | Renderizar (~1 linha) e depois unificar | M |
| S2-d | P2 | Overlay de parecer empilha todos os instrumentos, todos expandidos. NEO-PI = ~35 inputs numéricos num card; nomes de faceta truncados em 8 caracteres, visíveis só em hover | `Painel.tsx:1081-1085`, `:1563-1665`, `:1595-1615`, `:1608` | Accordion; `<details>` nativo resolve | M |
| S2-e | P2 | Dois sistemas de feedback: 7 `alert`/`confirm` bloqueantes em `painelPacientes` vs erro inline em `Painel` | `painelPacientes.tsx:151,189,211,229,259,272` | Padronizar no inline | M |
| S2-f | P2 | Chamada de edge function feita à mão descarta o erro do servidor — e o helper que resolve isso já existe e já é usado em 5 lugares | `painelPacientes.tsx:156-169`,`:233-242`; `mensagemErroEdgeFunction` em `src/lib/supabase.ts` | Trocar por `supabase.functions.invoke` | S |
| S2-g | P2 | Conteúdo clínico real em 9-10px (nascimento, última resposta, contagens) — num painel usado durante a sessão | `Painel.tsx:472,479,1195,1215,1256`; `painelPacientes.tsx:291,377-379` | Piso de 12px para conteúdo | M |
| S2-h | P2 | CMS de blog dentro do painel clínico, e `carregarBlog()` roda em todo login — busca dados de marketing antes de o painel clínico terminar de carregar | `Painel.tsx:817`,`:920`; aba `:1788-1984` | Rota `/bruno/blog`, lazy | M |
| S2-i | P3 | Zero memoização em 2016 linhas: 54 `useState`, 0 `useMemo`. Cada tecla na busca reprocessa a base inteira | `Painel.tsx` inteiro; recálculos `:1279`,`:1444`,`:1169-1179` | `useMemo` nos 3 blocos derivados | S |
| S2-j | P3 | Helpers triplicados, e a versão canônica **já está exportada** — inclusive `resolverPacienteId`, que **cria linha** em `pacientes` | `Painel.tsx:39-41,438-442,519-535` vs `useConceituacaoIA.ts:12-19,69-85` | Importar do hook, apagar as cópias | S |
| S2-k | P3 | Card de alerta de risco duplicado byte a byte — e as duas cópias já divergiram (uma tem select de status) | `Painel.tsx:654-661` e `:1336-1352` | Um `<AlertaRisco>` | S |
| S2-l | P3 | Migração localStorage→banco roda em todo mount, para sempre; se a chave reaparecer, sobrescreve `nome_paciente` no banco sem aviso | `painelPacientes.tsx:123-146` | Apagar o bloco | S |
| S2-m | P3 | Dois mecanismos de dispensar risco lado a lado, um só na sessão e outro persistente, sem indicação de qual é qual | `Painel.tsx:764`,`:1342`,`:1348` | Remover o `X` | S |

## Proposta — nova arquitetura de informação

**Objeto central: o PACIENTE, não a resposta.** O fluxo real é sempre ancorado numa pessoa: gera código *para alguém*, tria risco *de alguém*, monta dossiê *de alguém*. A resposta de escala é o ponto de partida do *schema do banco*, não do trabalho — e o painel herdou essa forma. A prova está no próprio código: o agrupamento por paciente é reconstruído em três lugares independentes (`Painel.tsx:445-449`, `:452-458`, `useConceituacaoIA.ts:176-180`). O modelo mental já é paciente; só a navegação não é. O único fluxo genuinamente centrado em resposta é a exportação em lote de PDFs (`:930-952`), que é administrativa e cabe como filtro.

**Navegação: `Hoje · Pacientes · Ferramentas`.** Três, não cinco.

1. **Hoje** — a tela que abre, ordenada por urgência e não por contagem: (a) triagem de risco em largura total, movida de `:1325-1355`, incluindo C-SSRS depois do achado 1; (b) respostas novas desde o último acesso; (c) códigos gerados que ninguém usou, alimentados pelo `last_seen_at` hoje descartado. As 4 métricas de vaidade (`:1180-1185`) e as métricas agregadas anônimas (`:1236-1273`) saem — não mudam decisão nenhuma entre sessões e hoje ocupam a posição de maior destaque.
2. **Pacientes** — lista → detalhe. O detalhe absorve o que hoje está espalhado: perfil, timeline, evolução, correlações, psicoed (`:600-746`), **os códigos daquele paciente** (hoje presos em `painelPacientes.tsx`), dossiê, parecer e o botão LGPD. Gerar código deixa de ser um destino e vira uma ação no paciente ("Enviar escala").
3. **Ferramentas** — como está. Já é centrada em paciente por dentro.

O overlay de parecer (`:1467-1713`) vira rota `/bruno/paciente/:chave/parecer` — o que resolve o achado 23 de graça: sair do parecer passa a ser navegação explícita, não um clique acidental numa linha.

**Sai do painel clínico:** o CMS de blog e as métricas agregadas anônimas. A aba "Respostas" desaparece como destino de topo e vira view filtrada dentro de Pacientes, preservando busca, filtros e seleção em massa.

## Proposta — quebra em módulos

Fronteira declarada como **dados / render / layout**. Quase tudo é recorte do que já existe.

| Módulo | Possui | Origem |
|---|---|---|
| `pages/bruno/Painel.tsx` | **Só layout**: gate de auth, estado de aba, header, toasts. ~150 linhas, zero dado clínico | `:1011-1040`, `:1133-1151`, `:1990-2014` |
| `hooks/usePainelDados.ts` | **Dados.** Fetch com colunas explícitas + estado de erro + canal realtime. Fonte única | substitui `:838-844` e `:823-834`; corrige os achados 22 e 25 num ponto só |
| `hooks/useConceituacaoIA.ts` (existente) | **Dados compartilhados.** Exportar `resolverPacienteId`; apagar as cópias de `Painel.tsx` | resolve S2-j sem arquivo novo |
| `pages/bruno/Hoje.tsx` | **Render** | triagem `:1325-1355` |
| `pages/bruno/PacienteLista.tsx` · `PacienteDetalhe.tsx` | **Render.** Recorte direto | `:451-485` · `:600-746` |
| `pages/bruno/Parecer.tsx` | **Dados próprios.** Os 8 `useState` de parecer que hoje vazam para o topo | `:1467-1713` + `:1042-1103` |
| `components/painel/InterpretBlock.tsx` | **Render puro** | `:233-433` |
| `components/painel/AlertaRisco.tsx` | **Render** | mata a duplicação `:654-661`/`:1336-1352` |
| `lib/pdf-doc.ts` | **Dados.** `txt()` numa cópia só; apagar `exportarFerramentaPDF`, que duplica `useConceituacaoIA.exportarPDF` | `:129-132`/`:1108-1111`/`useConceituacaoIA.ts:383-386` |
| `pages/bruno/Blog.tsx` | **Render.** Rota própria, lazy | `:1788-1984` |

`painelPacientes.tsx` não vira arquivo novo: dissolve-se em `PacienteDetalhe` + `Hoje`.

---

# S3 — Exercícios: ludicidade e interatividade

## Achados adicionais

| # | Sev | Achado | Evidência | Correção proposta | Esforço |
|---|-----|--------|-----------|-------------------|---------|
| S3-a | P2 | Prop `theme="c"` do Shell sobrescreve o `data-theme="lobo"` da raiz: conteúdo do exercício em paleta legada, menu e footer em paleta oficial, na mesma tela. Só 2 das 36 páginas passam a prop | `ExercicioShell.tsx:18,36`; passam: `BaloesClimaPage.tsx:12`, `SeparandoTudoPage.tsx:12` | Remover a prop; o `data-theme` da raiz basta | S |
| S3-b | P2 | `escrita_expressiva_local`: texto de escrita traumática gravado indefinidamente em localStorage, sem leitor e sem botão de apagar — enquanto a UI promete privacidade | `EscritaExpressiva.tsx:29`, `:57` | Exibir/exportar no resultado, ou não persistir | S |
| S3-c | P2 | `JardimMente` não usa `useExerciseSession` — nunca pode ser concluído, mas está no catálogo como exercício | `JardimMente.tsx:37-74`; `Exercicios.tsx:221-224` | Promover a widget do hub, tirar do catálogo | S |
| S3-d | P2 | O jardim mapeia nome de 13 slugs; **21** exercícios + todos os `psicoed:*` aparecem como slug cru ("less-ii", "psicoed:janela-de-tolerancia") | `JardimMente.tsx:21-35`, fallback `:121` | Derivar de `trilhas.ts`, que já tem slug+título | S |
| S3-e | P2 | Semântica do `score` incoerente e às vezes invertida: a Torta paga por baixa autoculpa, a Inundação por alta intolerância, 12 exercícios pagam 100 fixo | `TortaResponsabilidade.tsx:41`; `InundacaoIncertezas.tsx:59` | XP por etapa concluída, não pela resposta | M |
| S3-f | P2 | A balança é decorativa: o peso vai para o prato correto independentemente do palpite. A animação — o único elemento de jogo — mente sobre a agência | `BalancaTerapeutica.tsx:96-98` | Inclinar pelo palpite, corrigir na revelação | S |
| S3-g | P2 | `LESSII` avança no clique, sem voltar e sem editar; o estilo de "selecionado" é inalcançável. É o exercício que mais se parece com a Escala já bem resolvida | `LESSII.tsx:34-52,88-102` vs `Escala.tsx:601-644,167-177` | Reusar o padrão da Escala | M |
| S3-h | P2 | Sliders da torta são normalizados em silêncio: mexer em um muda a % de todos os outros, tornando impossível fechar a distribuição deliberadamente | `TortaResponsabilidade.tsx:35-36,123` | Mostrar total bruto, ou orçamento de 100 pts | S |
| S3-i | P3 | Wizard de 3 fases em **21** arquivos; barra de progresso idêntica em 5; slider em 9; `GPSDecisoes` é fork de `RegistroV2` | ver H2 | Contrato do Shell | L |
| S3-j | P3 | Shuffle enviesado (`sort(() => Math.random()-0.5)`) em 3 lugares — inclusive na ordem dos finais da roleta, que é justamente o que se quer neutro. Fisher-Yates correto já existe no repo | `RoletaTerapeutica.tsx:96-98`, `Bussola.tsx:12`, `ParesMente.tsx:41`; correto em `BaralhoAdulto.tsx:23-30` | Exportar e importar o do Baralho | S |
| S3-k | P3 | `score` nas deps do effect do timer: cada acerto recria o intervalo e descarta o segundo parcial — a rodada de "60 s" dura mais quanto melhor o jogador vai | `AcerteDistorcao.tsx:59-72` | Tirar `score` das deps | S |
| S3-l | P3 | `respiracao-guiada` é o único slug fora de qualquer trilha; `<audio>` atrás de prop que nenhuma página passa | `trilhas.ts:33-191`; `RespiracaoGuiada.tsx:6-7,204-211` | Incluir na trilha; remover o áudio morto | S |
| S3-m | P3 | Copy desatualizada: "reconheça padrão de esquema em 3 cenários" — são 5 | `ExerciciosRestritos.tsx:95` vs `OculosEsquemas.tsx:15-41` | Corrigir texto | S |

## Classificação dos 35 exercícios

**Totais: 9 INTERATIVO · 6 PASSIVO · 20 FORMULÁRIO.**

Dos 8 marcados "Jogos rápidos" no catálogo (`Exercicios.tsx:59,77-137`), **3 não são jogos**: `BalaoPensamentos` (textarea + animação), `SeparandoTudo` e `BaloesDoClima` (quiz de dois botões). E os 5 que **são** jogos de verdade são justamente os que não salvam nada.

**INTERATIVO** — `AcerteDistorcao` (arcade + timer 60s) · `ChuvaPreocupacoes` (drag + timer 90s) · `ParesMente` (memória) · `CacaFatos` (caça + timer 120s) · `RoletaTerapeutica` (roleta + 2 sliders) · `BaralhoAdulto` (quiz de cartas, 2 modos — melhor exemplar do conjunto) · `TecnicaTedio` (timer de exposição) · `RespiracaoGuiada` (animação como marcapasso) · `BalaoPensamentos` (animação é a metáfora).

**PASSIVO** — `SeparandoTudo` · `BaloesDoClima` · `BalancaTerapeutica` · `OculosEsquemas` · `LESSII` (honesto: diz "questionário") · `JardimMente` (painel, não exercício).

**FORMULÁRIO** — os 20 restantes. Honestos quase todos. Destaques: `LaboratorioPrevisoes` é o único com loop temporal real (previsão → prazo → veredito) e um dos 2 que reidratam; `CofreForças` é o outro; `RegistroV2` e `RodaEmocoes` são os únicos 2 com check-in e reflexão.

**Persistência:** só **2 de 34** reidratam o payload salvo. **9** nunca chamam `save()`.

## Loop de recompensa

Quatro moedas, nenhuma mede reflexão.

- **XP** = `regas.length × 10` (`useTrilha.ts:90`). Conta qualquer `complete()`, de qualquer slug, inclusive `psicoed:*`. Ler um módulo vale o mesmo que uma Escavação de 5 camadas.
- **Streak** = dias com ao menos uma rega. Soltar um balão mantém o streak. **O caminho mais barato para não quebrar a sequência é o exercício que exige menos pensamento** — o incentivo aponta para o lado errado.
- **Jardim** = uma planta por slug, estágio = nº de regas, murcha em 14 dias. Como replay rega, a planta mede repetição de clique, não retorno reflexivo.
- **Score por exercício** = descartado. `complete(score)` grava o número e nada o lê — nem a trilha, nem o jardim, nem a tela final.

**O que isso ensina:** que a métrica é presença, não trabalho. Quem digita uma linha e quem escreve com cuidado recebem o mesmo XP, a mesma planta, o mesmo streak. E nos dois exercícios onde o score depende da resposta, ele é legível pelo paciente como "resposta certa", transformando reestruturação cognitiva em adivinhação de gabarito.

## Proposta

**1. O contrato do `ExercicioShell`.** Hoje o Shell entrega cromo e cada exercício reimplementa a sessão. Inverta: **o Shell possui o ciclo de vida da sessão, o exercício possui só a mecânica clínica.**

O exercício dá ao Shell: `slug`, número de etapas, e um payload serializável a cada mudança de etapa. O Shell devolve: o payload salvo na montagem (retomar/descartar, como `Escala.tsx:167-177`) e um "avancei uma etapa". O Shell é quem renderiza a barra de progresso, chama `save` com debounce, decide quando a sessão está completa, mostra o `Badge`, monta a `ReflexaoPosExercicio` e oferece o "próximo da trilha" lendo `trilhas.ts`. O exercício nunca mais importa `useExerciseSession`.

Fronteira dura: **o exercício não decide o que vale XP nem quando a sessão conclui.** Isso mata os achados 16, 17, 19, 20, S3-e e a falta de reidratação num lugar só — é o diff mais curto, mesmo sendo o refactor maior. Faça o Shell primeiro e migre os 9 que não salvam nada; os 20 formulários vêm depois, sozinhos.

**2. Onde ludicidade agrega valor clínico.**

*Agrega, porque a mecânica **é** a técnica:* `TecnicaTedio` e `RespiracaoGuiada` (o tempo real é a intervenção) · `ChuvaPreocupacoes` (arrastar sob pressão de tempo **é** decidir sob ansiedade — falta a alternativa por teclado) · `MaquinaDoTempo` (o gráfico que o paciente constrói é a descoberta; melhor uso de animação do repositório) · `RoletaTerapeutica` (girar sorteia o cenário sem deixar escolher o fácil — mas salve o delta) · `LaboratorioPrevisoes` (o único com loop temporal; **é aqui que ludicidade real cabe** — lembrete de vencimento, histórico de acurácia. Investir aqui rende mais que confete em 20 telas).

*É ruído:* `BalancaTerapeutica` (a balança que se inclina sozinha ensina que a resposta não importa) · `BalaoPensamentos` (a animação é boa; o `complete()` por soltura é o problema — tire o XP, mantenha o balão) · `SeparandoTudo` e `BaloesDoClima` (vendidos como cartas e balões, entregam dois botões — ou implemente a mecânica prometida, ou corrija a copy; a segunda são 10 linhas).

*Os 20 formulários:* **não gamifique.** Um Registro de Pensamentos com confete é pior, não melhor. Falta retomada, autosave e um fecho.

**3. Como medir esforço reflexivo.** Três sinais que o Shell já teria em mãos, sem novo modelo de dados: **profundidade** (etapas preenchidas / etapas totais — já existe como `progresso` em 6 arquivos, hoje só decoração) · **elaboração** (contagem de palavras nos campos abertos, com teto baixo — 2-3 frases já pontuam o máximo; `EscritaExpressiva.tsx:37` já conta) · **retorno** (dias distintos em que o slug foi trabalhado, não vezes — uma rega por slug por dia). E **remova o score do paciente onde ele é a resposta**: o número clínico vai para o payload do terapeuta.

**4. O que reaproveitar.** `Escala.tsx` é a referência pronta e em produção — o contrato do Shell é essencialmente extrair o que já está lá. `Badge.tsx` já existe, já respeita `prefers-reduced-motion` e tem o tom calibrado para o CFP: é a tela de conclusão do Shell, não escreva outra. `ReflexaoPosExercicio`/`CheckinEmoji` viram etapas opcionais do Shell. `trilhas.ts` é a fonte do "próximo passo" **e** dos nomes do jardim. `motion.ts` já tem `spring`/`ease`: adicione duas constantes de tap/hover e substitua as 122 inline. Fisher-Yates de `BaralhoAdulto.tsx:23-30`: exporte e importe nos 3 shuffles enviesados. Sem biblioteca nova em nenhum caso.

---

# S4 — Psicoeducação e cérebro 3D

## Achados adicionais

| # | Sev | Achado | Evidência | Correção proposta | Esforço |
|---|-----|--------|-----------|-------------------|---------|
| S4-a | P2 | A copy nega a ordem que a UI desenha: "não há ordem certa nem prazo" vs linhas tracejadas ligando territórios em fila (desktop) e trilha vertical numerada (mobile). A ordem é a de construção da feature, e o nó #1 é o conteúdo mais denso do site | `Psicoeducacao.tsx:55`; `MapaExploratorio.tsx:115-132`,`:156-193`; `psicoed.ts:22-68` | Assumir a trilha, reordenar, trocar a copy | M |
| S4-b | P2 | Navegação estrela pura: toda folha linka só de volta ao hub, no topo e no rodapé. Zero link lateral, zero link para exercício, nenhum próximo passo em lugar nenhum | `Sono.tsx:56,160`; `CicloPanico.tsx:180,280`; `JanelaTolerancia.tsx:117,232` | Rodapé "próximo território" derivado de `trilhas.ts` | S |
| S4-c | P2 | **Cada construto tem 4 peles, não 2-4 conteúdos.** `modos.ts` + `modos-torajo` + `modos-demon-slayer` + `modos-jujutsu-kaisen`; idem esquemas, distorções, crenças. Dos 10 ids de cada skin, **8 são literalmente os mesmos**; os outros 2 só mudam de nome. 12 arquivos, 1519 linhas. Nenhum cruza referência | `src/content/psicoed/` (20 arquivos) | Array canônico + tabela `skin → {nome, descricao}` por id | L |
| S4-d | P2 | `EthicalFooter` escondido no mobile só no 3D — a página com mais chance de ser aberta em celular por alguém ativado. CRP, aviso ético e contato de crise somem | `Neuroanatomia3D.tsx:806` | Mostrar no mobile | S |
| S4-e | P2 | Painel direito do 3D = ternário de 8 ramos mutuamente exclusivos, cada um com paleta própria, mais 2 de quiz. Nenhum estado é "o normal"; a cor muda de significado a cada modo | `Neuroanatomia3D.tsx:609-798`, `:382-431` | Ver proposta: 1 caminho default + camadas | L |
| S4-f | P2 | Estado inicial é uma caixa tracejada vazia dizendo "Interaja com os controles acima"; o tour guiado — o único conteúdo com narrativa — está enterrado no 2º `<select>` | `Neuroanatomia3D.tsx:780-797`; `:477-502` abaixo de `:434-474` | Trilha vira default; selects viram cards | M |
| S4-g | P2 | Jargão de graduação sem uma única citação: "controle top-down", "hipoativação", "alta densidade de receptores de glicocorticoides", "neurogênese", "Eixo HPA... liberando CRH", "interocepção", "estriado", "propriocepção". Enquanto **10 de 10** posts do blog têm campo `referencias` | `neuroanatomia.ts:20,21,54,55,70,99,159,174` | Reescrever em 2 níveis + campo `referencias` reusando o shape do blog | M |
| S4-h | P2 | O 3D é um beco: o único `<Link>` da página é "Voltar". O widget "Respirar" reimplementa respiração e não linka `/exercicios/respiracao` | `Neuroanatomia3D.tsx:221-227`, `:566-578` vs `App.tsx:112` | Cada trilha termina com CTA para exercício/escala | S |
| S4-i | P2 | Rótulos 3D só aparecem depois do tap (não há preview antes de escolher) e a dica "use o dedo para girar" é `hidden sm:block` — escondida justo no mobile | `BrainModel.tsx:285-291`,`:272-281`; `Neuroanatomia3D.tsx:275` | Mostrar a dica no mobile; rotular as peças da trilha ativa | S |
| S4-j | P2 | Sem detecção de WebGL; o ErrorBoundary imprime stack trace num bloco vermelho para o paciente | `Neuroanatomia3D.tsx:14-28`,`:24` | Fallback com imagem estática + texto das trilhas | S |
| S4-k | P3 | `navItems` duplicado em **23** arquivos, embora o repo já tenha **3** shells (`ExercicioShell`, `DocumentLayout`, `TerritorioTorajo`) | grep `navItems` → 23 arquivos | `PsicoedShell` irmão + `navItems` único | M |
| S4-l | P3 | Duas das cinco trilhas (`sports_neuro`, `nutrition_behavior`) e 4 das 12 estruturas são neurociência do esporte/nutrição num consultório de psicologia clínica — ampliam o menu e inflam o payload sem servir o paciente-alvo | `neuroanatomia.ts:291-344`; `Neuroanatomia3D.tsx:82-85` | Mover para trás de "Explorar mais", fora do caminho default | S |
| S4-m | P3 | `check:neuro-models` só existe no `package.json`; o workflow roda apenas `npm run build` | `package.json:12`; `deploy.yml:34` | Adicionar step | S |
| S4-n | P3 | `vault/handoff_neuroanatomia.md` descreve 4 estruturas; o código tem 12. Os itens de UX já foram absorvidos; o de performance, marcado "Crítico", continua aberto desde a v1.0 | `handoff_neuroanatomia.md:10-14,18-21,24-26,32-33` | Reduzir a doc ao item de performance | S |

## Por que a psicoeducação está confusa

**Sequência — é a causa raiz.** O produto não decidiu se é mapa ou trilha, então virou os dois e se contradiz. A copy diz "não há ordem certa"; o desenho diz o contrário — tracejado ligando os nós em fila no desktop, lista numerada no mobile. E a ordem que o desenho comunica não foi projetada: é a ordem em que as features foram construídas. O primeiro nó da fila é o Laboratório 3D, o conteúdo mais denso e mais jargonizado do site. **O paciente entra pela porta mais difícil achando que é a porta certa.**

**Duplicação.** O mesmo construto clínico existe em quatro versões incompatíveis, e nenhuma sabe da existência das outras. Quem visita dois territórios encontra "modo" com nome, metáfora e elenco diferentes, sem nada indicando que é o mesmo conceito. As peles de anime, que deviam ser recurso de engajamento, viraram um segundo currículo paralelo. Some-se o blog, que ensina esquema e eixo HPA sem cruzar com nenhuma página.

**Navegação.** Estrela sem galhos: cada folha só sabe voltar ao hub. Nenhuma página sugere um próximo passo. Nenhuma linka um exercício, embora existam 35+ e um motor de trilhas pronto. O maior corpo autoral do repo (18 esquemas YSQ) está a 3 cliques, atrás de uma pele de anime.

**Progresso morto.** Dois dos cinco territórios nunca acendem conclusão. Quem completa tudo vê 3/5 no mapa. O mecanismo de recompensa está lá e mente.

**Densidade e registro.** O painel do 3D tem 8 estados exclusivos com paletas próprias, alimentados por 6 sistemas de modo que se resetam em silêncio — e num caso não se resetam, produzindo câmera e texto discordando. O estado inicial é uma caixa vazia. O texto é de graduação, sem uma citação, num site cujo blog tem `referencias` em 10 de 10 posts.

**Estrutura.** O shell compartilhado já existe três vezes e a psicoeducação não usa nenhum. Consequência visível: o footer ético some no mobile só no 3D.

## Proposta

**1. Sequenciamento — usar `trilhas.ts`, não inventar outro.** O motor já faz o que falta: unidades ordenadas, desbloqueio, progresso derivado do mesmo `jardim_regas` que o mapa já lê. Adicionar **uma** entrada `TRILHAS` com `id: "entender"`, cujos itens apontam para as rotas de psicoeducação — `slug` = `psicoed:{id}`, que é o que `useProgresso.ts:14` já grava. Zero código novo de estado; `MapaExploratorio` troca o `useConcluidos` local por `useTrilha("entender")`.

Ordem pedagógica — do corpo para a história, do concreto para o abstrato:

1. **Janela de Tolerância** — dá o vocabulário de estado (calmo/hiper/hipo) que todo o resto usa. É a única página que descreve o *agora* do paciente sem exigir teoria.
2. **Ciclo do Pânico** — primeiro mecanismo fechado: sensação → interpretação → medo → sensação. Ensina que o ciclo tem pontos de saída. Concreto e imediatamente acionável.
3. **Sono** — aplica o mesmo raciocínio a um problema que quase todo paciente traz, e conecta corpo ↔ humor.
4. **Laboratório 3D** — só aqui, quando já se tem os mecanismos, o cérebro serve de *ilustração* deles. Hoje é o nó #1; deveria ser o #4.
5. **De onde vêm seus padrões / Mundos** — história de vida e esquemas: o mais abstrato e o mais longo, por último.

A contradição da copy resolve-se **assumindo a trilha**: "Uma trilha em cinco partes, na ordem que costuma funcionar melhor — você pode pular, mas cada parte usa a anterior." Mantém a autonomia e para de mentir sobre o desenho. Sem cadeado: `desbloqueada` vira ênfase visual, não bloqueio.

**2. Deduplicação — uma fonte canônica por construto.**

| Construto | Canônico | O que os outros viram |
|---|---|---|
| Esquemas / modos | `narrativas-esquemas.ts` (18 YSQ) em `/de-onde-vem-seus-padroes` | As 3 peles de anime continuam como **skins** — mesmos ids, rótulo "outra forma de contar a mesma coisa" + link para o canônico. `modos.ts` vira o dado que as skins consomem, não uma 4ª versão |
| Ciclo do pânico | `CicloPanico.tsx` + `psicoed/panico.ts` | O tour `panic_loop` do 3D vira **passo dentro da página de pânico** ("veja no cérebro"), com link de volta |
| Eixo HPA / cortisol | Tour `hpa_axis` no 3D | `Sono.tsx` linka o tour em vez de reexplicar; o post do blog vira a leitura aprofundada com fontes |
| Distorções | `distorcoes.ts` + quiz em `psicoed.ts` | As 3 peles linkam o canônico |

**Blog = camada de fontes**, não um 6º território: cada página ganha um bloco "Para ir mais fundo" com o post correspondente. O post já carrega `referencias`; a página não duplica bibliografia.

**3. Cérebro 3D — de 8 modos para 1 caminho.**

- **Default:** carregar `hpa_axis` no passo 1 assim que a página abre. O estado vazio desaparece; o primeiro contato vira uma narrativa de 4 passos com botão Próximo.
- **Trilha vira navegação primária:** os dois `<select>` viram 3 cards de trilha (HPA, Pânico, Hábitos) no topo do painel. Esporte e Nutrição saem do caminho default.
- **O que deixa de ser modo e vira camada:** Estresse, Mindfulness, TCC, Medicação e Transtorno não são 5 estados exclusivos — são **overlays sobre a trilha ativa**. Passam para dentro do `<details>` "Exploração livre" que já existe, como toggles que modificam a cena sem trocar o texto. O painel passa a ter 3 ramos, não 8: trilha (default) · peça selecionada · quiz. Isso mata o achado 15 por construção.
- **Links de saída:** HPA → `/exercicios/respiracao` (e o widget "Respirar" vira link, não reimplementação); Pânico → `/psicoeducacao/ciclo-do-panico`; Hábitos → `/exercicios/registro`. Quiz completo → `useProgresso("neuroanatomia").complete()`, que acende o território no mapa.
- **Registro do texto:** manter `description`/`role` (precisão clínica) e adicionar **um campo novo**, `resumo` — uma frase de nível leigo exibida primeiro; o técnico fica atrás de "Ver detalhe". Exemplo, hipocampo: resumo "guarda o contexto das memórias: onde, quando, com quem"; detalhe mantém glicocorticoides. E `referencias?: {titulo, url}[]` **com o mesmo shape do blog**, preenchido por trilha (5 campos, não 12).
- **Fallback:** detectar WebGL antes de montar o `<Canvas>`; trocar o `<pre>` por texto humano + conteúdo das trilhas em versão estática.
- **Mobile:** tirar o `hidden sm:` da dica; rotular permanentemente as peças da trilha ativa; mostrar o `EthicalFooter`.

**4. Payload — alvo: first paint ≤ 2 MB (de ~18,5 MB, bytes em disco).**

- **Vira GLB/Draco:** as 30 malhas de região (9,53 MB em `.obj` ASCII) mescladas em **12 GLB**, um por região, já unindo esquerda+direita. OBJ texto → GLB+Draco costuma render 10-30×; alvo conservador **≤ 1,5 MB para as 12**. `useLoader(OBJLoader, …)` vira `useGLTF` — drei já está instalado.
- **Sai do first paint:** `showContext` default passa a `false`. O córtex (69 arquivos carregados em runtime, 8,98 MB) vira **1 GLB decimado ≤ 500 KB**, carregado só no toggle, com `<Suspense>` próprio — o que também corrige o piscar da cena.
- **Lazy:** as 4 estruturas fora do caminho clínico só carregam com a trilha de esporte/nutrição.
- **Sai do repo:** os **141** `.obj` nunca carregados (~34,5 MB). Ver a nota de conflito — não são 210.
- **Device fraco:** sem WebGL ou `hardwareConcurrency <= 4` → versão estática das trilhas.
- **Spinner:** passa a mostrar progresso real (`useProgress` do drei, já disponível).
- **CI:** `check:neuro-models` entra no workflow, com o teto ajustado ao novo alvo.

**5. Layout — `PsicoedShell`, irmão de `ExercicioShell`.** Copiar a forma das 66 linhas do `ExercicioShell`, trocando destino do "Voltar" e cabeçalho. Possui: `SkipLink` · `MobileMenu` com o `navItems` **único** (extrair e apagar as 23 cópias) · `WhatsAppFloat` · `ThemeToggle` · `<main id="main">` com `data-theme` e `document.title` · header · **rodapé "próximo território"** derivado de `useTrilha("entender")` — é aqui que o achado S4-b morre de graça · `EthicalFooter` sempre visível. `Neuroanatomia3D` usa só o header/nav, mantendo o `<main>` full-bleed próprio.

---

# H1 — Acessibilidade WCAG 2.1 AA

Skill `design:accessibility-review` carregada; checklist aplicado sobre todo o `src/`.

| # | Sev | WCAG | Achado | Arquivos | Esforço |
|---|-----|------|--------|----------|---------|
| H1-1 | P1 | 1.4.3 | **Botão primário ilegível em 2 dos 3 temas.** `text-white` sobre `--c-accent`: 6,07:1 no claro, **1,95:1 no escuro**, **2,19:1 no noturno**. Padrão em ~50 arquivos — o modo noturno recém-lançado tornou ilegível o botão de ação de quase todo exercício | `theme-lobo.css:43`,`:71`; consumidores em `RespiracaoGuiada.tsx:152,196`, `QuizEngine.tsx:93`, `RoletaTerapeutica.tsx:179`, `Exercicios.tsx:770` +45 | M |
| H1-2 | P1 | 2.1.1, 2.5.7 | `ChuvaPreocupacoes` só jogável arrastando; sem teclado, sem botão | `ChuvaPreocupacoes.tsx:126-140` | M |
| H1-3 | P1 | 2.2.2, 2.3.3 | Mesmo componente: cards caem por 3 s com timer, sem `useReducedMotion`. Framer anima por style inline — o `@media prefers-reduced-motion` de `globals.css:139` **não** alcança | `ChuvaPreocupacoes.tsx:132-133` | M |
| H1-4 | P2 | 4.1.2 | 6 de 9 sliders sem nome acessível — o leitor anuncia "controle deslizante, 50" | `Neuroanatomia3D.tsx:523`, `MaquinaDoTempo.tsx:87`, `RodaEmocoes.tsx:126`, `InundacaoIncertezas.tsx:119`, `Perfeccionometro.tsx:43`, `Simulador.tsx:51` | S |
| H1-5 | P2 | 1.3.1, 4.1.2 | Grades de escolha única sem `role="radiogroup"`, `aria-checked` nem roving tabindex | `QuizEngine.tsx:136-152`, `MiniSimuladorModos.tsx:111-128`, `RodaEmocoes.tsx:86-110`, `BaralhoAdulto.tsx:170-176`, `OculosEsquemas.tsx:142` | M |
| H1-6 | P2 | 4.1.3 | **`aria-live` existe em 1 arquivo do repo inteiro.** Timer de respiração, score de jogo, feedback de quiz e mensagens de erro nunca são anunciados | correto só em `Escala.tsx:561`; faltando em `RespiracaoGuiada.tsx:135,141`, `ChuvaPreocupacoes.tsx:94-95`, `QuizEngine.tsx:155-170`, `DeOndeVemPadroes.tsx:140`, `Escala.tsx:360` | M |
| H1-7 | P2 | 3.3.1, 3.3.3 | Formulário de dados do paciente: labels corretos, mas erros não ligados ao campo (`aria-describedby`/`aria-invalid` ausentes), sem `role="alert"`, sem foco no primeiro erro. Inclui CPF e responsável legal de menor | `Escala.tsx:389-469`, validação `:474-487` | M |
| H1-8 | P2 | 2.4.1 | `SkipLink` aponta para `#main`, que não existe na página | `TerritorioTorajo.tsx:252` vs `:305`. Inverso: `Escala.tsx` tem `id="main"` e não renderiza SkipLink | S |
| H1-9 | P2 | 1.4.11 | `--c-border` fica em 1,2–1,5:1 nos três temas. É a borda de card, input, botão secundário e opção de escala — a fronteira do controle é invisível | `theme-lobo.css:17`,`:52`,`:80` | S |
| H1-10 | P2 | 4.1.2 | Botões com nome acessível vazio (só glifo ou ícone) | `Bussola.tsx:50,57` (paciente — prioridade); `painelPacientes.tsx:403`; `Painel.tsx:638,1471,1567,1723,1734,1796,1374,563-567`; `Neuroanatomia3D.tsx:580` | S |
| H1-11 | P2 | 1.3.1 | 8 páginas sem nenhum `<h1>` — começam em `<h2>`/`<h3>` | `Blog`, `BlogPost`, `Documentos`, `Privacidade`, `ComoFunciona`, `Exercicios`, `DeOndeVemPadroes`, `ExerciciosRestritos` | S |
| H1-12 | P2 | 1.2.2, 1.2.3 | Mídia com fala sem legenda nem transcrição | `NarrativaEsquemaView.tsx:53` (`<video>` sem `<track>`), `BlogPost.tsx:255` (áudio de narração), `RespiracaoGuiada.tsx:204-211` | M |
| H1-13 | P3 | 2.5.5 | 23 alvos clicáveis abaixo de 44×44 px; `min-h-[44px]` aparece em só 6 arquivos | paciente: `Bussola.tsx:50,57`, `MuralhaEvidencias.tsx:126,133`, `LaboratorioPrevisoes.tsx:150,156`, `ChuvaPreocupacoes.tsx:97`, `TerritorioTorajo.tsx:269,280`, `Blog.tsx:86` | S |
| H1-14 | P3 | 3.3.2 | ~40 campos sem label, `aria-label` ou placeholder. Quase todos no painel (uso próprio), mas atinge o público em `ConecteABC.tsx:95,112` e `Neuroanatomia3D.tsx:439,482` | ver lista | M |
| H1-15 | P3 | 1.4.3 | Cores secundárias abaixo de 4.5:1 como texto: `--c-warm`, `--c-accent-lt`, `--c-moss`, `--c-success`, `--c-danger`, `--c-neutral-text` | `theme-lobo.css:6,9,10,21,23,28` | S |
| H1-16 | P3 | 2.3.3 | `repeat: Infinity` do framer sem `useReducedMotion` | `Neuroanatomia3D.tsx:240` | S |

## Contraste calculado

| Par | Tema | Razão | Passa? |
|---|---|---|---|
| `--c-text` / `--c-bg` | claro | 12,29:1 | sim |
| `--c-muted` / `--c-bg` | claro | 4,89:1 | sim |
| `--c-accent` / `--c-bg` | claro | 5,49:1 | sim |
| branco / `--c-accent` (botão) | claro | 6,07:1 | sim |
| `--c-accent-lt` / `--c-bg` | claro | 3,53:1 | **não** |
| `--c-warm` / `--c-bg` | claro | 2,96:1 | **não** |
| branco / `--c-warm` (botão) | claro | 3,27:1 | **não** |
| `--c-moss` / `--c-bg` | claro | 1,71:1 | **não** |
| `--c-border` / `--c-bg` | claro | 1,22:1 | **não** (3.0) |
| `--c-success` / `--c-success-bg` | claro | 3,00:1 | **não** |
| `--c-danger` / `--c-danger-bg` | claro | 4,41:1 | **não** |
| `--c-neutral-text` / `--c-neutral-bg` | claro | 4,39:1 | **não** |
| `--c-text` / `--c-bg` | escuro | 15,85:1 | sim |
| `--c-accent` / `--c-bg` | escuro | 9,30:1 | sim |
| **branco / `--c-accent` (botão)** | **escuro** | **1,95:1** | **não** |
| branco / `--c-warm` (botão) | escuro | 2,39:1 | **não** |
| `--c-border` / `--c-bg` | escuro | 1,51:1 | **não** (3.0) |
| `--c-text` / `--c-bg` | noturno | 14,37:1 | sim |
| `--c-accent` / `--c-bg` | noturno | 7,69:1 | sim |
| **branco / `--c-accent` (botão)** | **noturno** | **2,19:1** | **não** |
| `--c-moss` / `--c-surface` | noturno | 2,66:1 | **não** |
| `--c-border` / `--c-bg` | noturno | 1,44:1 | **não** (3.0) |

**A correção de raiz é uma só:** criar `--c-on-accent` por tema (branco no claro; `#0F1813`/`#171D2B` no escuro/noturno) e trocar `text-white` por `text-[var(--c-on-accent)]` nos botões com fundo accent.

---

# H2 — Bloat e duplicação

**Saldo estimado: ~−2.500 linhas, −34,5 MB de asset, 0 dependências removíveis.**

| # | Sev | Achado | Evidência | Linhas | Esforço |
|---|-----|--------|-----------|--------|---------|
| H2-1 | P3 | **141 dos 240 `.obj` nunca são carregados por código nenhum** (34,5 MB). Vite copia `public/` inteiro para `dist/` | `BrainModel.tsx:9,14-15`; `neuroanatomia.ts` (30 refs) | −34,5 MB | S |
| H2-2 | P2 | **36 páginas em `src/pages/exercicios/` são clones de 18-22 linhas** que diferem em 3 strings | `src/pages/exercicios/` | ~500 | M |
| H2-3 | P2 | **`navItems` declarado à mão em 23 arquivos** | grep → 23 | ~110 | S |
| H2-4 | P2 | **Esqueleto de layout copiado em 20 páginas**, embora `DocumentLayout` já exista e seja usado por 4 | `shared/DocumentLayout.tsx` (4 importadores) | ~200 | M |
| H2-5 | P2 | **12 arquivos de skin, 1519 linhas**, taxonomia quase idêntica: dos 10 ids de cada, 8 são os mesmos; os outros 2 só mudam de nome | `content/psicoed/modos*`, `esquemas*`, `distorcoes*`, `crencas*`, `personagens*` | ~700 | L |
| H2-6 | P2 | **`nineRouter.ts` (262 l.) reimplementa no browser a edge function `conceituacao-chat` (256 l.)** — duas fontes de verdade para a mesma lógica clínica | `nineRouter.ts:24,118,153,179,192,227,234` vs `conceituacao-chat:25,82,121,134,172,179` | ~200 | L |
| H2-7 | P2 | **`GPSDecisoes` é fork de `RegistroV2`** — mesmo wizard, mesmo chat, mesma barra | ambos | ~150 | M |
| H2-8 | P2 | **Wizard `type Fase` em 21 arquivos** (não 18) | grep → 21 | ~150 | L |
| H2-9 | P2 | **`chavePaciente`/`nomeSeguro` duplicados** — o hook **já os exporta** e o Painel redeclara. Drift silencioso na chave de identidade do paciente | `useConceituacaoIA.ts:12,17` vs `Painel.tsx:39,438` | ~12 | S |
| H2-10 | P3 | Barra de progresso idêntica em 5 arquivos, + 2 variantes | `AEscavacao.tsx:88-99` +4 | ~50 | S |
| H2-11 | P3 | Widget de slider em 9 arquivos com a mesma linha de 3 spans | 9 arquivos | ~70 | S |
| H2-12 | P3 | `MOODS` duplicado com os mesmos 5 emojis, só o tipo do `id` difere | `CheckinEmoji.tsx:9-15` vs `ReflexaoPosExercicio.tsx:8-14` | ~45 | S |
| H2-13 | P3 | Helper `txt()` de PDF idêntico em 3 lugares | `Painel.tsx:129-132`, `:1108-1111`, `useConceituacaoIA.ts:383-386` | ~8 | S |
| H2-14 | P3 | `corticalMarkers` duplicado entre runtime e script de CI (as listas são idênticas; os filtros é que diferem — ver nota de conflito) | `BrainModel.tsx:14` e `check-neuro-models.mjs:12` | ~2 | S |
| H2-15 | P3 | Validação de PII repetida como `with check` nas 4 migrações; lista de escalas restritas hardcoded em 6 lugares | 4 migrações + `generate-code:15` + `escalas-restritas.ts` | ~60 | M |
| H2-16 | P3 | **`supabase/schema_exercicios.sql` não é migração e contradiz o schema vivo** — declara `varchar(5)` onde a migração já alterou para `varchar(8)` | `schema_exercicios.sql:5` vs `20260711014942:10` | −40 | S |
| H2-17 | P3 | `patient_codes.last_used_at` — coluna nunca lida nem escrita; único hit é o `add column` | `20260711014942:14` | 1 | S |
| H2-18 | P3 | `lastSeenAt` buscado, mapeado e nunca renderizado (a coluna **é** escrita por `validate-code:81`; o campo no cliente é que é morto) | `painelPacientes.tsx:14,35,107,178` | ~4 | S |
| H2-19 | P3 | `conceituacoes_registros` é write-only — único uso é um INSERT | `useConceituacaoIA.ts:410` | — | S |
| H2-20 | P3 | `paciente_psicoed.esquemas_ocultos` lido pela edge function, **nunca escrito por UI nenhuma** — feature meio-construída | `psicoed-personalizada:85,110`; 0 writes em `src/` | — | M |
| H2-21 | P3 | `graphify-out/` rastreado (12 arquivos, 327 KB), sem entrada no `.gitignore` | `git ls-files graphify-out` → 12 | — | S |

## Exports mortos

68 símbolos exportados sem importador; 39 são `const`/`function` (o resto são tipos usados só internamente — over-export, não código morto). Os que valem apagar ou desexportar:

| Símbolo | Arquivo | Importadores |
|---|---|---|
| **`classificarCssrs`** + `CssrsResultado` | `src/lib/scoring.ts:212-221` | **0** — confirmado por dois agentes e pelo orquestrador |
| `baixarPDF`, `gerarWhatsAppLink`, `gerarEmailLink` | `src/lib/pdf-generator.ts:137,142+` | 0 |
| `procesarChat`, `ChatNodo` | `src/lib/chatEngine.ts` | 0 — só os tipos `ChatScript`/`ChatHistorico` são importados |
| `fade` | `src/lib/motion.ts:14` | 0 |
| `pensamentosCrenca`, `FATIAS_RODA`, `lentesMagicas`, `rodadasLentes` | `src/content/trilhaInfantil.ts` | 0 |
| `manifesto`, `principiosEticos` | `src/content/copy.ts` | 0 |
| `monstroImg` | `src/content/distorcoes.ts` | 0 |
| 9 símbolos de `normative-tables.ts`, 11 de `neo-percentis.ts`, 6 de `neo-tabelas-t.ts` | — | 0 externos — provável uso interno; **desexportar, não apagar** |

## Dependências

**Nenhuma órfã.** As 18 entradas de `dependencies` têm importador. `gsap` e `lottie-web` têm um consumidor cada (`TerritorioTorajo.tsx`) — candidatos a corte se aquela página sair.

## Peso

| Caminho | Tamanho | Rastreado? |
|---|---|---|
| `dist/` | 73 MB | **não** — `.gitignore:2`, `git ls-files dist` = 0 |
| `public/models/` | 53,9 MB (240 `.obj`) | sim — 34,5 MB nunca carregados |
| `.claude-flow/` | 12 MB | não rastreado, mas **também não está no `.gitignore`** — suja `git status` |
| `graphify-out/` | 327 KB | **sim, 12 arquivos**, sem entrada no `.gitignore` |
| `docs/` · `video/` · `vault/` | 200 + 127 + 4 KB | sim |

**10 maiores de `src/`** (32.990 linhas no total): `bruno/Painel.tsx` 2016 · `escalas-gerais.ts` 1611 · `Neuroanatomia3D.tsx` 812 · `Exercicios.tsx` 790 · `VariantC.tsx` 724 · `paciente/Escala.tsx` 683 · `narrativas-esquemas.ts` 618 · `escalas.ts` 598 · `3d/BrainModel.tsx` 496 · `painelPacientes.tsx` 486. **`Painel.tsx` é o único que destoa por código** — o resto é dado.

---

# H3 — Build, performance, SEO, PWA

| # | Sev | Achado | Evidência | Esforço |
|---|-----|--------|-----------|---------|
| H3-1 | P1 | **Zero code splitting.** 0 hits de `React.lazy`/`import()`; 77 rotas estáticas; sem `manualChunks`. Home baixa three.js + r3f + drei + framer-motion + jspdf + jszip + supabase + 77 páginas num único JS de **3.361.855 B** (defasado) | `App.tsx:1-162`; `vite.config.ts` | M |
| H3-2 | P1 | **Escala aparenta sucesso e descarta os dados** quando o Supabase não está configurado — secret vazio no CI e o paciente responde a escala inteira, vê o resultado, e o psicólogo nunca recebe | `supabase.ts:53-56`; `Escala.tsx:255-257` | S |
| H3-3 | P1 | **CI não roda `lint`, `test` nem `check:neuro-models`; sem cache npm.** 63 erros de lint e 65 testes nunca barram deploy; um `.obj` renomeado quebra o 3D em produção sem detecção. O único portão é `tsc -b` | `.github/workflows/deploy.yml` | S |
| H3-4 | P2 | **Canonical de todas as 10 páginas OG de blog aponta para a home** — o gerador substitui title/description/og/twitter e nunca o `<link rel="canonical">` | `scripts/generate-og-pages.js`; herdado de `index.html` | S |
| H3-5 | P2 | `simbolo-estendido-cores.png` = **7.054.312 B**, sem nenhuma referência em `src/` ou `index.html` | grep = vazio | S |
| H3-6 | P2 | `public/img/foto.jpg` = **1.133.565 B**, é `og:image` e é usada. `sharp` já está em devDeps e `otimizar-monstros.mjs` mostra o padrão (webp q82, 640px) | `content/copy.ts` | S |
| H3-7 | P2 | **16,7 MB em 44 PNG/JPG contra 0,8 MB em 14 webp; nenhum avif.** Páginas de personagens pesadas (`sukuna.png` 1,6 MB, `daki.png` 423 KB, `fundo.png` 567 KB) | `find public` | M |
| H3-8 | P2 | **Sitemap cobre 13 de 77 rotas.** 64 fora, incluindo todo `/psicoeducacao/*` (23 páginas) e `/exercicios/*` (40) — o diferencial de busca orgânica do site é invisível ao Google | `sitemap.xml` vs `App.tsx` | M |
| H3-9 | P2 | **`/paciente` está no sitemap e não bloqueado no robots**; `/paciente/gad7`, `/phq9`, `/escala/:id` também não | `sitemap.xml:3`; `robots.txt` só tem `Disallow: /bruno/` | S |
| H3-10 | P2 | **Sem SEO por rota:** as 66 rotas não-blog servem `index.html` com title/description/canonical da home. SERP idêntica para todas | `generate-og-pages.js` só itera `content/blog/*.json` | M |
| H3-11 | P2 | **`strict` do TypeScript desligado** — ausente em todos os `tsconfig*.json`. Combina com os 19 `no-explicit-any` do lint | grep `strict` = 0 hits | L |
| H3-12 | P3 | Google Fonts como stylesheet externo bloqueia render (2 famílias, 11 pesos) | `index.html:19-23` | M |
| H3-13 | P3 | `src/assets/{hero.png,react.svg,vite.svg}` — restos do template Vite, nenhum importado. `public/img/BS_Psi.png` e `logo.png` (340 KB cada) sem referência | grep = 0 | S |

## Inventário de bundle

**Bytes em disco de um `dist/` defasado (24/jul).** O build atual falha em `tsc` por defasagem do `node_modules` local. Ninguém mediu bytes transferidos.

| Chunk | Bytes | Conteúdo |
|---|---|---|
| `index-CsEBQS_8.js` | 3.361.855 | Entry único: React 19, react-router (77 rotas), three.js, r3f + drei, framer-motion, jspdf, jszip, supabase-js, lucide-react, **todas as páginas** |
| `pdf.worker-CPbhI6B3.mjs` | 2.206.299 | worker do pdfjs-dist (sob demanda) |
| `html2canvas-CPksAkdf.js` | 199.568 | dependência dinâmica do jspdf |
| `index.es-CnuVgqFc.js` | 151.385 | idem |
| `index--BO-qk4_.css` | 104.946 | Tailwind 4 compilado |
| `purify.es-Bu4Grnl0.js` | 26.107 | DOMPurify (via jspdf) |
| **`dist/` total** | **73 MB** | inclui `public/` copiado |

Os 3 chunks separados existem só porque jspdf e pdfjs usam `import()` internamente — **nenhum split é do código da aplicação**.

## Inventário de assets

| Caminho | Qtd | Bytes em disco | Referenciado? |
|---|---|---|---|
| `public/models/*.obj` carregados | 99 (30 regiões + 69 córtex) | ~18,5 MB | sim |
| `public/models/*.obj` carga morta | 141 | ~34,5 MB | **não** |
| `.glb` / `.gltf` / `.draco` | 0 | 0 | ausente, confirmado |
| `public/img` | 53 | 16,3 MB | parcial — 7 MB só no símbolo não usado |
| `public/videos` | 1 | 2,4 MB | — |
| `public/media` | 4 | 1,4 MB | — |
| `src/assets/` | 3 | 36 KB | **não** |
| PNG+JPG em `public/` | 44 | 16,7 MB | — |
| WEBP em `public/` | 14 | 0,8 MB | — |

---

# Backlog priorizado

Ordenado por impacto clínico × esforço. As quatro frentes do Bruno aparecem na coluna direita.

## Faixa 1 — parar o sangramento (esforço S, impacto máximo)

| Ação | Achado | Frente |
|---|---|---|
| Ligar C-SSRS em `detectarRiscos`, reusando `classificarCssrs` que já existe e já está testada | 1 | Painel |
| Corrigir regex de `save-session` para `^\d{5}(\d{3})?$` **e** alargar `exercise_sessions.code` para `varchar(8)` | 3 | Banco |
| Trocar `jwtDecode` por `auth.getUser()` nas 2 edge functions, replicando `generate-code:22-31` | 5 | Segurança |
| Gate de auth em `conceituacao-chat`; rate-limit + regex em `psicoed-personalizada` | 6, 7 | Segurança |
| `salvarResposta` retornar erro quando `supabase === null` | 10 | Banco |
| Criar `--c-on-accent` por tema e trocar `text-white` nos botões accent | 11 | A11y |
| Tirar identificação (CPF, telefone, contatos) do rascunho de localStorage | 9 | Segurança |
| Adicionar `lint`, `test` e `check:neuro-models` ao workflow | 14 | Build |
| `confirm` no delete em massa; não limpar síntese ao abrir histórico; renomear "Excluir código" para "Desativar" | 21, 23, 24 | Painel |
| Filtrar `psicoed:*` do XP/streak de trilha; `complete()` idempotente por dia/slug | 17, 18 | Exercícios |

## Faixa 2 — consertar o que mente ao usuário (esforço S–M)

| Ação | Achado | Frente |
|---|---|---|
| RPC `excluir_paciente` apagando as 7 origens numa transação | 2 | Banco |
| Implementar a leitura de sessão do banco (ou remover o ramo morto e assumir "salvo neste dispositivo") | 4 | Exercícios |
| Revalidar acesso restrito no servidor a cada montagem, não pelo localStorage | 8 | Segurança |
| Debounce no `save`; `save()` antes de `complete()` nos 9 exercícios | 16, 19 | Exercícios |
| Estado de fim em `MuralhaEvidencias` | 20 | Exercícios |
| Trilha do 3D resetar os outros modos; `showContext` default `false`; `<Suspense>` próprio para o córtex | 15, 34 | 3D |
| `useProgresso("neuroanatomia").complete()` no fim do quiz; alinhar o id de Mundos | 35 | Psicoed |
| Colunas explícitas + paginação no fetch do painel; tratar `error` do Supabase | 22, 25 | Painel |
| Alternativa por teclado em `ChuvaPreocupacoes` + `useReducedMotion` | 12 | A11y |
| `aria-label` nos 6 sliders e nos botões-glifo; `role="radiogroup"` nas grades | H1-4, H1-5, H1-10 | A11y |
| `Disallow: /paciente/` no robots e remover do sitemap; corrigir canonical das páginas OG | H3-4, H3-9 | Build |
| Apagar os 141 `.obj` mortos e o PNG de 7 MB | H2-1, H3-5 | Build |

## Faixa 3 — as quatro reformas (esforço M–L)

**Painel** — nova IA `Hoje · Pacientes · Ferramentas`, quebra em 10 módulos, blog para rota própria. Ver proposta S2.

**Exercícios** — contrato do `ExercicioShell` (progresso, save/retomar, conclusão, reflexão, próximo passo) e migração dos 35. Mata sozinho ~8 achados. Loop de recompensa por profundidade/elaboração/retorno. Ver proposta S3.

**Psicoeducação** — trilha "entender" reusando `trilhas.ts`, reordenação pedagógica (Janela → Pânico → Sono → 3D → Padrões), deduplicação com fonte canônica por construto, `PsicoedShell`. Ver proposta S4.

**Cérebro 3D** — de 8 modos para 1 caminho com camadas, trilha como default, texto em 2 níveis + `referencias`, links de saída para exercícios, e o plano de payload (12 GLB/Draco, alvo ≤ 2 MB no first paint). Ver proposta S4.

**Banco** — `pacientes.id` como identidade canônica, PII para uma linha só, `patient_codes` como credencial, RLS por terapeuta em vez de `using(true)`, migração de reconciliação do schema drift. Ver proposta S1.

**Transversal** — code splitting por rota + `manualChunks`; `strict` do TypeScript; `navItems` único; 36 páginas de exercício viram uma rota `:slug`.

---

## Pendente

**S5 — passagem ao vivo no navegador** não foi executada. Fica de fora, e depende dela:

- Bytes **transferidos** (não em disco) da home e do laboratório 3D, com a cascata real de rede.
- Erros de console em produção.
- Comportamento responsivo medido em 375/768/1280 e nos três temas.
- As cinco abas do painel logado, abertura de dossiê, aba Acessos.
- Confirmação empírica de que o CI publica build funcional apesar de `npm run build` falhar localmente.

Para executá-la: `npm install` primeiro (o `node_modules` local está defasado), depois abrir `https://psibrunosg.github.io/bruno`, o Bruno loga, e a passagem roda somente-leitura — sem gerar código, desativar código, excluir resposta, salvar post, invocar IA ou exportar.
