# Safe Project Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remover somente resíduos técnicos comprovadamente dispensáveis, impedir seu retorno e restaurar um baseline verificável sem apagar rotas, conteúdo funcional ou trabalho local do usuário.

**Architecture:** A limpeza usa uma allowlist fechada: dois diretórios gerados, o CMS Decap sem consumidor e treze componentes sem importadores. Um verificador de higiene impede regressão; todo o restante fica protegido. As correções de typecheck são cirúrgicas e preservam as experiências locais ainda não commitadas.

**Tech Stack:** Git, Node.js 24, npm, TypeScript 6, Vite 8, ESLint 10, Vitest 3.

**Spec:** `docs/specs/NEUROATLAS_VERTICAL_SLICE_SPEC.md`

## Global Constraints

- Esta execução ocorre antes do vertical slice e não implementa o NeuroAtlas.
- Não usar `git reset`, `git checkout --`, `git clean`, `git add -A` ou `git add .`.
- Não executar `git pull`, merge ou rebase enquanto a árvore contiver trabalho local não commitado.
- Manter todas as rotas atuais; nenhuma página ou conteúdo temático é removido por esta limpeza.
- Não tocar em `.claude/settings.local.json`, `video/`, `public/scenes/`, `public/models/`, `vault/`, `supabase/`, `docs/auditoria/` ou nos assets/arquivos Hogwarts.
- Não remover os `240` OBJ de `public/models` nem a cópia local ainda não rastreada em `video/public/models`.
- Remover somente os caminhos enumerados nas Tasks 3 e 4.
- Comandos de terminal devem usar o prefixo `rtk`, conforme `RTK.md`.
- Toda operação recursiva deve resolver e conferir os caminhos absolutos antes da remoção.
- Commits devem adicionar caminhos explícitos; alterações locais preexistentes não entram no commit desta limpeza.
- `src/components/3d/BrainModel.tsx`, `src/content/neuroanatomia.ts` e `src/pages/Neuroanatomia3D.tsx` serão preservados juntos no checkpoint da Task 1 do plano do vertical slice; não commitar nenhum deles isoladamente aqui.

---

### Task 1: Baseline, proteção e branch de trabalho

**Files:**
- Inspect only: all current worktree paths

**Interfaces:**
- Consumes: árvore atual na branch `main`.
- Produces: branch `codex/cleanup-neuroatlas-slice` e inventário terminal do baseline; nenhum arquivo alterado.

- [ ] **Step 1: Confirmar diretório e branch**

Run:

```powershell
rtk git rev-parse --show-toplevel
rtk git status --short --branch
```

Expected:

```text
C:/Users/ACPO Empreendimentos/Documents/Github/psibrunosg.github.io
main...origin/main [behind 5]
```

O status também deve listar as alterações locais conhecidas. Se aparecer remoção ou alteração em `.gitignore`, `README.md`, `package.json`, `scripts/check-repo-hygiene.mjs`, `.claude-flow/`, `graphify-out/`, `public/admin/` ou nos treze componentes da Task 4, interromper e reportar sobreposição antes de editar.

- [ ] **Step 2: Confirmar que a branch de trabalho ainda não existe**

Run:

```powershell
rtk git branch --list codex/cleanup-neuroatlas-slice
```

Expected: nenhuma saída.

- [ ] **Step 3: Criar a branch sem mexer na árvore suja**

Run:

```powershell
rtk git switch -c codex/cleanup-neuroatlas-slice
rtk git status --short --branch
```

Expected: branch `codex/cleanup-neuroatlas-slice`; as alterações locais continuam listadas.

- [ ] **Step 4: Registrar no handoff os caminhos protegidos e seus hashes**

Copiar a saída completa de `git status --short --branch` para o relatório de execução, não para um arquivo do repositório. Conferir que nenhum caminho sumiu após a troca de branch.

Run and retain the ordered output in the same report:

```powershell
rtk git hash-object src/components/HogwartsCrestInteractive.tsx src/hooks/useCinematicScroll.ts src/pages/GryffindorStory.tsx src/pages/HufflepuffStory.tsx src/pages/ModosEsquemaCinema.tsx src/pages/RavenclawStory.tsx src/pages/SlytherinStory.tsx
```

---

### Task 2: Verificador de higiene em estado vermelho

**Files:**
- Create: `scripts/check-repo-hygiene.mjs`
- Modify: `package.json`
- Test: `scripts/check-repo-hygiene.mjs`

**Interfaces:**
- Consumes: raiz retornada por `process.cwd()`.
- Produces: comando `npm run check:repo-hygiene`; exit `1` se qualquer resíduo enumerado existir, exit `0` caso contrário.

- [ ] **Step 1: Criar o verificador antes da remoção**

Create `scripts/check-repo-hygiene.mjs` with exactly this behavior:

```js
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const forbiddenPaths = [
  '.claude-flow',
  'graphify-out',
  'public/admin',
  'src/components/ui/AuroraBackground.tsx',
  'src/components/ui/BentoGrid.tsx',
  'src/components/ui/CardHoverEffect.tsx',
  'src/components/ui/FloatingBlobs.tsx',
  'src/components/ui/FloatingNav.tsx',
  'src/components/ui/HeroParallax.tsx',
  'src/components/ui/InfiniteMovingCards.tsx',
  'src/components/ui/MagneticCursor.tsx',
  'src/components/ui/ScrollProgress.tsx',
  'src/components/ui/Spotlight.tsx',
  'src/components/ui/StickyScrollReveal.tsx',
  'src/components/ui/TextGenerateEffect.tsx',
  'src/components/ui/WaveDivider.tsx',
];

const remaining = forbiddenPaths.filter((relativePath) =>
  fs.existsSync(path.join(root, relativePath)),
);

const gitignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
const requiredIgnoreEntries = ['.claude-flow/', 'graphify-out/'];
const missingIgnoreEntries = requiredIgnoreEntries.filter(
  (entry) => !gitignore.split(/\r?\n/).includes(entry),
);

if (remaining.length || missingIgnoreEntries.length) {
  console.error('Repo hygiene check failed.', {
    remaining,
    missingIgnoreEntries,
  });
  process.exit(1);
}

console.log('Repo hygiene OK: generated reports, obsolete CMS and dead UI files are absent.');
```

- [ ] **Step 2: Adicionar o script npm sem alterar os comandos existentes**

Add this entry inside `package.json` → `scripts`:

```json
"check:repo-hygiene": "node scripts/check-repo-hygiene.mjs"
```

- [ ] **Step 3: Executar o teste vermelho**

Run:

```powershell
rtk npm run check:repo-hygiene
```

Expected: FAIL com `remaining` contendo `.claude-flow`, `graphify-out`, `public/admin` e os treze componentes; `missingIgnoreEntries` contém as duas entradas.

- [ ] **Step 4: Não fazer commit ainda**

O teste deve permanecer vermelho até as Tasks 3 e 4 concluírem a allowlist de remoção.

---

### Task 3: Remover relatórios e estado de ferramentas gerados

**Files:**
- Delete: `.claude-flow/` — `283` arquivos rastreados no baseline
- Delete: `graphify-out/` — `12` arquivos rastreados no baseline
- Modify: `.gitignore`

**Interfaces:**
- Consumes: allowlist aprovada e verificação de caminho.
- Produces: diretórios ausentes e permanentemente ignorados.

- [ ] **Step 1: Confirmar contagens antes da remoção**

Run:

```powershell
rtk git ls-files .claude-flow | rtk rg -c "^"
rtk git ls-files graphify-out | rtk rg -c "^"
```

Expected:

```text
283
12
```

Se as contagens divergirem, parar e revisar o diff; não ampliar a remoção automaticamente.

- [ ] **Step 2: Resolver os alvos absolutos**

Run:

```powershell
rtk powershell.exe -NoProfile -Command "Resolve-Path -LiteralPath '.claude-flow','graphify-out' | Format-List Path"
```

Expected: ambos os caminhos ficam diretamente sob `C:\Users\ACPO Empreendimentos\Documents\Github\psibrunosg.github.io`.

- [ ] **Step 3: Remover somente os dois diretórios rastreados**

Run:

```powershell
rtk git rm -r -- .claude-flow graphify-out
```

Expected: somente caminhos sob esses dois diretórios entram como deleted.

- [ ] **Step 4: Impedir o retorno dos artefatos**

Append these exact lines to `.gitignore` using `apply_patch`:

```gitignore
.claude-flow/
graphify-out/
```

- [ ] **Step 5: Conferir escopo**

Run:

```powershell
rtk git diff --name-status -- .claude-flow graphify-out .gitignore
```

Expected: deleções apenas nos dois diretórios e uma modificação em `.gitignore`.

---

### Task 4: Remover CMS sem consumidor e componentes UI sem importadores

**Files:**
- Delete: `public/admin/index.html`
- Delete: `public/admin/config.yml`
- Delete: `src/components/ui/AuroraBackground.tsx`
- Delete: `src/components/ui/BentoGrid.tsx`
- Delete: `src/components/ui/CardHoverEffect.tsx`
- Delete: `src/components/ui/FloatingBlobs.tsx`
- Delete: `src/components/ui/FloatingNav.tsx`
- Delete: `src/components/ui/HeroParallax.tsx`
- Delete: `src/components/ui/InfiniteMovingCards.tsx`
- Delete: `src/components/ui/MagneticCursor.tsx`
- Delete: `src/components/ui/ScrollProgress.tsx`
- Delete: `src/components/ui/Spotlight.tsx`
- Delete: `src/components/ui/StickyScrollReveal.tsx`
- Delete: `src/components/ui/TextGenerateEffect.tsx`
- Delete: `src/components/ui/WaveDivider.tsx`

**Interfaces:**
- Consumes: confirmação de ausência de importadores/referências.
- Produces: CMS Decap antigo e treze módulos mortos ausentes; componentes UI ativos preservados.

- [ ] **Step 1: Provar ausência de consumidores do CMS**

Run:

```powershell
rtk rg -n -i "decap|netlify identity|public/admin|admin/index\.html" . --glob '!node_modules/**' --glob '!video/node_modules/**' --glob '!.git/**' --glob '!public/admin/**'
```

Expected: nenhuma referência executável; menções históricas em documentação, se surgirem, não contam como consumidor.

- [ ] **Step 2: Provar ausência de importadores dos treze componentes**

Run:

```powershell
rtk rg -n "AuroraBackground|BentoGrid|CardHoverEffect|FloatingBlobs|FloatingNav|HeroParallax|InfiniteMovingCards|MagneticCursor|ScrollProgress|Spotlight|StickyScrollReveal|TextGenerateEffect|WaveDivider" src --glob '!src/components/ui/AuroraBackground.tsx' --glob '!src/components/ui/BentoGrid.tsx' --glob '!src/components/ui/CardHoverEffect.tsx' --glob '!src/components/ui/FloatingBlobs.tsx' --glob '!src/components/ui/FloatingNav.tsx' --glob '!src/components/ui/HeroParallax.tsx' --glob '!src/components/ui/InfiniteMovingCards.tsx' --glob '!src/components/ui/MagneticCursor.tsx' --glob '!src/components/ui/ScrollProgress.tsx' --glob '!src/components/ui/Spotlight.tsx' --glob '!src/components/ui/StickyScrollReveal.tsx' --glob '!src/components/ui/TextGenerateEffect.tsx' --glob '!src/components/ui/WaveDivider.tsx'
```

Expected: nenhuma saída. Se houver consumidor, parar e reportar a divergência; não remover o arquivo nem alterar a allowlist aprovada durante a execução.

- [ ] **Step 3: Remover os caminhos exatos**

Run:

```powershell
rtk git rm -- public/admin/index.html public/admin/config.yml src/components/ui/AuroraBackground.tsx src/components/ui/BentoGrid.tsx src/components/ui/CardHoverEffect.tsx src/components/ui/FloatingBlobs.tsx src/components/ui/FloatingNav.tsx src/components/ui/HeroParallax.tsx src/components/ui/InfiniteMovingCards.tsx src/components/ui/MagneticCursor.tsx src/components/ui/ScrollProgress.tsx src/components/ui/Spotlight.tsx src/components/ui/StickyScrollReveal.tsx src/components/ui/TextGenerateEffect.tsx src/components/ui/WaveDivider.tsx
```

- [ ] **Step 4: Executar o verificador em estado verde**

Run:

```powershell
rtk npm run check:repo-hygiene
```

Expected:

```text
Repo hygiene OK: generated reports, obsolete CMS and dead UI files are absent.
```

---

### Task 5: Substituir o README genérico pelo contrato operacional real

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: scripts existentes de `package.json` e variáveis de `src/lib/supabase.ts`.
- Produces: instruções reais para desenvolvimento, teste, segurança e direção de migração.

- [ ] **Step 1: Substituir integralmente o README de template**

Use this exact content as the baseline; update the command list only if an earlier approved task changed `package.json`:

```markdown
# Psi Bruno SG

Site psicoeducativo e ferramentas clínicas de Bruno Souza. O repositório contém páginas públicas, exercícios, área do paciente, painel profissional e experiências interativas.

## Estado técnico

- Aplicação atual: Vite + React + TypeScript.
- Dados e funções: Supabase.
- Publicação atual: build estático.
- Arquitetura-alvo: HTML semântico, CSS, PHP e JavaScript com ES Modules.
- Migração: progressiva e reversível; nenhuma rota clínica pode perder comportamento ou controles de acesso.

## Requisitos locais

- Node.js 24.
- npm compatível com o lockfile.
- Variáveis locais em `.env.local`:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

Nunca commitar `.env`, chaves administrativas, service-role keys ou credenciais de provedores.

## Comandos

```bash
npm ci
npm run dev
npm run lint
npm run test
npm run check:neuro-models
npm run check:repo-hygiene
npm run build
```

## Estrutura

- `src/pages/`: rotas e páginas atuais.
- `src/components/`: componentes compartilhados e experiências.
- `src/content/`: conteúdo estruturado.
- `src/lib/`: integrações e regras reutilizáveis.
- `public/`: assets públicos.
- `supabase/`: migrations e Edge Functions.
- `docs/specs/`: especificações aprovadas.
- `docs/superpowers/plans/`: planos de implementação revisáveis.

## Segurança e dados clínicos

O projeto manipula dados pessoais e clínicos. Mudanças em autenticação, RLS, códigos de paciente, formulários, escalas ou painel profissional exigem testes específicos e validação de autorização. Nunca substituir dado ausente por zero nem expor segredo no navegador.

## Regra de contribuição

1. Ler a especificação aplicável.
2. Trabalhar em tarefas pequenas e testáveis.
3. Preservar mudanças locais não relacionadas.
4. Executar os verificadores proporcionais ao risco.
5. Registrar evidência antes de declarar conclusão.
```

- [ ] **Step 2: Validar comandos documentados**

Run:

```powershell
rtk rg -n '"(dev|lint|test|check:neuro-models|check:repo-hygiene|build)"' package.json
```

Expected: os seis scripts existem.

---

### Task 6: Reparar somente a incompatibilidade anatômica legada

**Files:**
- Modify: `src/components/3d/BrainModel.tsx`
- Do not modify: arquivos locais da experiência Hogwarts

**Interfaces:**
- Consumes: `BrainPartId` atual, que substituiu `context` por `brainstem` e adicionou entidades.
- Produces: remove os três erros obsoletos de `context`; preserva integralmente o baseline Hogwarts, cujos erros preexistentes continuam registrados como bloqueio externo do gate global.

- [ ] **Step 1: Reproduzir o baseline vermelho**

Run:

```powershell
rtk npm exec tsc -- --project tsconfig.app.json --noEmit --pretty false
```

Expected: três erros ligados a `context` em `BrainModel.tsx` e dez erros de import/variável não utilizada nos arquivos Hogwarts listados.

- [ ] **Step 2: Tornar os anchors compatíveis com o catálogo expandido**

In `src/components/3d/BrainModel.tsx`, change:

```ts
const flowAnchors: Record<BrainPartId, [number, number, number]> = {
```

to:

```ts
const flowAnchors: Partial<Record<BrainPartId, [number, number, number]>> = {
```

Rename the existing key only:

```ts
brainstem: [9.9, -76.26, 1506.43],
```

Do not invent anchors for the new lobes. In `FlowSegment`, guard both lookups before constructing vectors:

```ts
const startAnchor = flowAnchors[from];
const endAnchor = flowAnchors[to];
if (!startAnchor || !endAnchor) return null;

const start = new THREE.Vector3(...startAnchor);
const end = new THREE.Vector3(...endAnchor);
```

- [ ] **Step 3: Remover as duas exclusões obsoletas de `context`**

The label condition must become:

```tsx
{(selected || hovered || isExploded) && (
```

The click handler must call the existing callback directly:

```tsx
onClick={() => onSelectPart(part.id)}
```

This makes `brainstem` a normal selectable anatomical entity.

- [ ] **Step 4: Reexecutar o typecheck e isolar o bloqueio protegido**

Run:

```powershell
rtk npm exec tsc -- --project tsconfig.app.json --noEmit --pretty false
```

Expected: os três erros de `BrainModel.tsx` desapareceram. Permanecem somente os dez erros preexistentes nos arquivos Hogwarts protegidos; qualquer erro adicional bloqueia a limpeza.

- [ ] **Step 5: Confirmar que arquivos locais não foram staged nem modificados**

Run:

```powershell
rtk git diff --cached --name-only
rtk git hash-object src/components/HogwartsCrestInteractive.tsx src/hooks/useCinematicScroll.ts src/pages/GryffindorStory.tsx src/pages/HufflepuffStory.tsx src/pages/ModosEsquemaCinema.tsx src/pages/RavenclawStory.tsx src/pages/SlytherinStory.tsx
```

Expected: nenhum arquivo Hogwarts aparece no índice e os sete hashes são idênticos, na mesma ordem, ao baseline da Task 1. `BrainModel.tsx` permanece fora do índice e será incluído no checkpoint específico do próximo plano.

---

### Task 7: Verificação, commit explícito e rollback

**Files:**
- Verify: `.gitignore`
- Verify: `README.md`
- Verify: `package.json`
- Verify: `scripts/check-repo-hygiene.mjs`
- Verify: `src/components/3d/BrainModel.tsx`
- Verify deleted allowlist paths

**Interfaces:**
- Consumes: Tasks 1–6 completas.
- Produces: um commit de limpeza revertível e handoff que separa mudanças do plano de mudanças locais do usuário.

- [ ] **Step 1: Executar verificações proporcionais**

Run:

```powershell
rtk npm run check:repo-hygiene
rtk npm run check:neuro-models
rtk npm exec tsc -- --project tsconfig.app.json --noEmit --pretty false
rtk npm run test
rtk npm run lint
rtk npm run build
```

Expected: higiene, modelos, testes e build exit `0`. Typecheck e lint podem encerrar não-zero somente pelos erros Hogwarts já inventariados e não tocados; qualquer erro novo ou em caminho do plano bloqueia a limpeza. O handoff registra esse baseline como impedimento para declarar o vertical slice completo em `AC-N-028`.

- [ ] **Step 2: Revisar o diff sem caminhos protegidos**

Run:

```powershell
rtk git diff --check
rtk git status --short
```

Expected: nenhum whitespace error. As mudanças locais preexistentes continuam visíveis e separáveis.

- [ ] **Step 3: Commitar a limpeza com paths explícitos**

Run:

```powershell
rtk git add .gitignore README.md package.json scripts/check-repo-hygiene.mjs
rtk git add -u -- .claude-flow graphify-out public/admin
rtk git add -u -- src/components/ui/AuroraBackground.tsx src/components/ui/BentoGrid.tsx src/components/ui/CardHoverEffect.tsx src/components/ui/FloatingBlobs.tsx src/components/ui/FloatingNav.tsx src/components/ui/HeroParallax.tsx src/components/ui/InfiniteMovingCards.tsx src/components/ui/MagneticCursor.tsx src/components/ui/ScrollProgress.tsx src/components/ui/Spotlight.tsx src/components/ui/StickyScrollReveal.tsx src/components/ui/TextGenerateEffect.tsx src/components/ui/WaveDivider.tsx
rtk git diff --cached --name-status
rtk git commit -m "chore(repo): remove generated artifacts and dead UI"
```

Expected: o commit não inclui `src/App.tsx`, arquivos Hogwarts, `video/`, conteúdo clínico ou assets recentes.

- [ ] **Step 4: Confirmar que o trio NeuroAtlas permanece junto e fora do commit de limpeza**

Run:

```powershell
rtk git status --short -- src/components/3d/BrainModel.tsx src/content/neuroanatomia.ts src/pages/Neuroanatomia3D.tsx
```

Expected: os três caminhos relevantes continuam no worktree e serão tratados juntos pelo próximo plano. Não executar novo commit nesta task.

- [ ] **Step 5: Registrar o handoff**

O relatório deve registrar `TASK: SAFE-PROJECT-CLEANUP`, o status real da execução,
o hash real do commit, a allowlist removida, a saída atual dos caminhos locais
protegidos e cada comando de validação com seu exit code. O rollback documentado
deve usar `git revert` seguido pelo hash real produzido nesta execução. O próximo
passo registrado é executar `2026-08-24-neuroatlas-vertical-slice.md` somente após
o checkpoint previsto naquele plano.

Não executar o rollback; apenas registrar os comandos.
