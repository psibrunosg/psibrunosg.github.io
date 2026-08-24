# NeuroAtlas Synchronized Vertical Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar o fluxo Hipocampo 3D → 2.5D → TEPT/circuito → 3D com estado preservado, usando um núcleo JavaScript independente e mantendo o laboratório React atual como rollback.

**Architecture:** A migração segue expand → migrate → verify → contract. Primeiro o núcleo vanilla é adicionado ao lado do laboratório atual; depois a rota existente passa a montar o novo módulo, com `?legacy=1` como fallback. O contrato do legado só poderá ser removido em outro plano, após paridade aprovada.

**Tech Stack:** JavaScript ES Modules, Three.js `0.185.1`, SVG DOM, CSS, Vite 8, React 19 somente como host temporário, Vitest 3, jsdom `30.0.1`, Playwright Test `1.62.1`.

**Spec:** `docs/specs/NEUROATLAS_VERTICAL_SLICE_SPEC.md`

## Global Constraints

- Pré-requisito: `docs/superpowers/plans/2026-08-24-safe-project-cleanup.md` concluído e validado.
- Implementar exatamente a spec `0.3` aprovada; mudanças de contrato exigem nova revisão da spec.
- O núcleo em `src/features/neuroatlas/` usa somente `.js`, `.css` e dados JavaScript; nenhum `.tsx` ou dependência de React.
- Nenhum arquivo do núcleo importa React, React Three Fiber, Drei, Framer Motion, Supabase ou PHP.
- Carregar somente os oito OBJ aprovados; não carregar o córtex completo nem os outros `232` modelos.
- Manter IDs canônicos `anat.*`, `clinical.ptsd`, `circuit.threat-context-regulation` e `view.medial` em todos os adapters.
- Não apresentar TEPT como causado ou diagnosticado por uma estrutura cerebral.
- Não persistir estado entre reloads neste slice.
- Não remover `src/pages/NeuroanatomiaLegacy.tsx` nem `src/components/3d/BrainModel.tsx` neste plano.
- Não modificar `src/App.tsx`; a rota existente continuará importando `src/pages/Neuroanatomia3D.tsx`.
- Não tocar em rotas, Supabase, dados clínicos, vídeo ou experiências narrativas fora dos arquivos enumerados.
- Usar `rtk` em todos os comandos de terminal.
- Usar `apply_patch` para edições; movimentos mecânicos devem resolver e conferir os caminhos antes.
- Nunca usar `git add -A`, `git add .`, reset ou checkout destrutivo.
- Os testes unitários usam injeção/fakes; nenhum teste Node tenta criar WebGL real.
- Playwright Chromium cobre o fluxo real, mobile, teclado, reduced motion e fallback WebGL.
- Gate externo já conhecido: este plano não edita os arquivos Hogwarts protegidos. Se os dez erros preexistentes deles ainda existirem na Task 10, o slice recebe `FAIL` em `AC-N-028` e não pode ser declarado concluído, mesmo que todos os testes específicos passem.

---

### Task 1: Checkpoint coerente do NeuroAtlas atual

**Files:**
- Commit existing approved baseline: `docs/specs/NEUROATLAS_VERTICAL_SLICE_SPEC.md`
- Commit plans: `docs/superpowers/plans/2026-08-24-safe-project-cleanup.md`
- Commit plans: `docs/superpowers/plans/2026-08-24-neuroatlas-vertical-slice.md`
- Commit related local baseline: `src/content/neuroanatomia.ts`
- Commit related local baseline: `src/pages/Neuroanatomia3D.tsx`
- Commit related local baseline: `src/components/3d/BrainModel.tsx`

**Interfaces:**
- Consumes: worktree após limpeza; três arquivos NeuroAtlas relacionados ainda não commitados.
- Produces: checkpoint recuperável e internamente compatível antes do expand.

- [ ] **Step 1: Verificar pré-requisitos e sobreposição**

Run:

```powershell
rtk git status --short --branch
rtk npm run check:repo-hygiene
rtk npm run check:neuro-models
rtk npm exec tsc -- --project tsconfig.app.json --noEmit --pretty false
```

Expected: branch `codex/cleanup-neuroatlas-slice`; higiene e modelos exit `0`. O typecheck não contém mais os três erros de `BrainModel.tsx`; pode conter somente os dez erros Hogwarts protegidos já inventariados. Qualquer erro adicional bloqueia o checkpoint. Mudanças locais alheias continuam presentes.

- [ ] **Step 2: Revisar somente o trio relacionado**

Run:

```powershell
rtk git diff -- src/content/neuroanatomia.ts src/pages/Neuroanatomia3D.tsx src/components/3d/BrainModel.tsx
```

Expected: expansão anatômica/`brainstem`, referências atualizadas na página e correção segura de anchors/cliques no renderer legado. Se houver outra funcionalidade não descrita, parar e registrar antes de commitar.

- [ ] **Step 3: Commitar documentação aprovada**

Run:

```powershell
rtk git add docs/specs/NEUROATLAS_VERTICAL_SLICE_SPEC.md docs/superpowers/plans/2026-08-24-safe-project-cleanup.md docs/superpowers/plans/2026-08-24-neuroatlas-vertical-slice.md
rtk git diff --cached --name-status
rtk git commit -m "docs(neuro): approve synchronized slice plan"
```

Expected: somente os três documentos.

- [ ] **Step 4: Commitar o checkpoint NeuroAtlas relacionado**

Esta etapa é a autorização explícita, mediante aprovação deste plano, para preservar juntas as mudanças locais já auditadas nesses três arquivos.

Run:

```powershell
rtk git add src/content/neuroanatomia.ts src/pages/Neuroanatomia3D.tsx src/components/3d/BrainModel.tsx
rtk git diff --cached --name-status
rtk git commit -m "chore(neuro): checkpoint current laboratory baseline"
```

Expected: somente o trio NeuroAtlas. Arquivos Hogwarts, `src/App.tsx`, `video/` e settings continuam fora do commit.

---

### Task 2: Harness de teste para JavaScript e browser

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `eslint.config.js`
- Create: `vitest.neuroatlas.config.js`
- Create: `playwright.config.js`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: Node `24.16.0` e Vite existente.
- Produces: `test:legacy`, `test:neuroatlas`, `test:e2e:neuroatlas`, `typecheck` e `verify:neuroatlas`.

- [ ] **Step 1: Instalar versões verificadas e fixas**

Run:

```powershell
rtk npm install --save-dev --save-exact jsdom@30.0.1 @playwright/test@1.62.1
rtk npm exec playwright install chromium
```

Expected: `package.json` e `package-lock.json` atualizados; Chromium instalado no cache do usuário, não no repositório.

- [ ] **Step 2: Criar a configuração Vitest do módulo**

Create `vitest.neuroatlas.config.js`:

```js
import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  test: {
    environment: 'jsdom',
    include: ['src/features/neuroatlas/**/*.test.js'],
    clearMocks: true,
    restoreMocks: true,
  },
});
```

- [ ] **Step 3: Criar a configuração Playwright**

Create `playwright.config.js`:

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: 'neuroatlas.spec.js',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
```

- [ ] **Step 4: Separar os scripts sem perder testes existentes**

Set these `package.json` scripts:

```json
"test:legacy": "vitest run --config vitest.config.ts",
"test:neuroatlas": "vitest run --config vitest.neuroatlas.config.js",
"test": "npm run test:legacy && npm run test:neuroatlas",
"test:e2e:neuroatlas": "playwright test --config playwright.config.js",
"typecheck": "tsc --project tsconfig.app.json --noEmit --pretty false",
"verify:neuroatlas": "npm run check:repo-hygiene && npm run check:neuro-models && npm run lint && npm run typecheck && npm run test && npm run test:e2e:neuroatlas && npm run build"
```

- [ ] **Step 5: Fazer ESLint cobrir JavaScript novo e ignorar relatórios gerados**

Replace the existing `globalIgnores(['dist'])` entry with the first line below,
then add the three config objects after the TypeScript block in `eslint.config.js`:

```js
globalIgnores(['dist', 'playwright-report', 'test-results']),
{
  files: ['src/features/neuroatlas/**/*.js'],
  extends: [js.configs.recommended],
  languageOptions: { globals: globals.browser },
},
{
  files: ['src/features/neuroatlas/**/*.test.js'],
  languageOptions: { globals: { ...globals.browser, ...globals.node } },
},
{
  files: ['scripts/**/*.mjs', '*.config.js', 'tests/**/*.js'],
  extends: [js.configs.recommended],
  languageOptions: { globals: globals.node },
},
```

- [ ] **Step 6: Ignorar relatórios reproduzíveis**

Append to `.gitignore`:

```gitignore
playwright-report/
test-results/
```

- [ ] **Step 7: Provar que o novo runner existe mas ainda não possui testes**

Run:

```powershell
rtk npm run test:legacy
rtk npm run test:neuroatlas -- --passWithNoTests
```

Expected: testes legados passam; runner NeuroAtlas encerra `0` somente por `--passWithNoTests` nesta etapa.

- [ ] **Step 8: Commitar infraestrutura isolada**

Run:

```powershell
rtk git add package.json package-lock.json eslint.config.js vitest.neuroatlas.config.js playwright.config.js .gitignore
rtk git diff --cached --name-status
rtk git commit -m "test(neuro): add vanilla module and browser harness"
```

---

### Task 3: Erros, estado imutável e ciclo de vida

**Files:**
- Create: `src/features/neuroatlas/errors.js`
- Create: `src/features/neuroatlas/state.js`
- Test: `src/features/neuroatlas/state.test.js`

**Interfaces:**
- Consumes: nenhum renderer.
- Produces: `ERROR_CODES`, `NeuroAtlasError`, `toDiagnostic()`, `ENTITY_IDS`, `CIRCUIT_ENTITY_IDS`, `DEFAULT_STATE`, `createNeuroAtlasStore()`.

- [ ] **Step 1: Escrever primeiro os testes dos contratos AC-N-001–008**

Create `src/features/neuroatlas/state.test.js`:

```js
import { describe, expect, it, vi } from 'vitest';
import { ERROR_CODES } from './errors.js';
import {
  CIRCUIT_ENTITY_IDS,
  createNeuroAtlasStore,
} from './state.js';

const openPtsd = {
  selectedConditionId: 'clinical.ptsd',
  selectedCircuitId: 'circuit.threat-context-regulation',
  highlightedEntityIds: CIRCUIT_ENTITY_IDS,
};

describe('NeuroAtlas store', () => {
  it('preserva todos os campos ao alternar somente o modo', () => {
    const store = createNeuroAtlasStore({ selectedEntityId: 'anat.hippocampus' });
    const before = store.getState();
    store.setState({ visualizationMode: '25d' });
    expect(store.getState()).toEqual({ ...before, visualizationMode: '25d' });
  });

  it('aceita TEPT apenas com o circuito e a ordem canônica completos', () => {
    const store = createNeuroAtlasStore({ selectedEntityId: 'anat.hippocampus' });
    store.setState(openPtsd);
    expect(store.getState().highlightedEntityIds).toEqual([
      'anat.amygdala',
      'anat.hippocampus',
      'anat.prefrontal',
    ]);
  });

  it('rejeita ID desconhecido sem mutação nem notificação', () => {
    const onError = vi.fn();
    const listener = vi.fn();
    const store = createNeuroAtlasStore({}, { onError });
    store.subscribe(listener);
    expect(() => store.setState({ selectedEntityId: 'anat.unknown' })).toThrowError();
    expect(store.getState().selectedEntityId).toBeNull();
    expect(listener).not.toHaveBeenCalled();
    expect(onError.mock.calls[0][0].code).toBe(ERROR_CODES.UNKNOWN_ID);
  });

  it('não aceita status pela API pública', () => {
    const onError = vi.fn();
    expect(() => createNeuroAtlasStore({ status: 'ready' }, { onError })).toThrowError();
    expect(onError.mock.calls[0][0].code).toBe(ERROR_CODES.STATE_INVALID);
    const store = createNeuroAtlasStore({}, { onError });
    expect(() => store.setState({ status: 'ready' })).toThrowError();
    expect(onError.mock.calls.at(-1)[0].code).toBe(ERROR_CODES.STATE_INVALID);
    expect(() => store.setState(new Date())).toThrowError();
  });

  it('rejeita combinação, ordem, duplicata e IDs clínicos inválidos de modo transacional', () => {
    const onError = vi.fn();
    const store = createNeuroAtlasStore(
      { selectedEntityId: 'anat.hippocampus' },
      { onError },
    );
    const before = store.getState();
    expect(() => store.setState({ selectedConditionId: 'clinical.unknown' })).toThrowError();
    expect(() => store.setState({ highlightedEntityIds: ['anat.hippocampus'] })).toThrowError();
    expect(() => store.setState({ highlightedEntityIds: ['anat.amygdala', 'anat.amygdala'] })).toThrowError();
    expect(store.getState()).toBe(before);
    expect(onError.mock.calls.map(([diagnostic]) => diagnostic.code)).toEqual([
      ERROR_CODES.UNKNOWN_ID,
      ERROR_CODES.INVALID_STATE_COMBINATION,
      ERROR_CODES.INVALID_STATE_COMBINATION,
    ]);
  });

  it('entrega um snapshot imutável uma vez por commit', () => {
    const listener = vi.fn();
    const store = createNeuroAtlasStore();
    const unsubscribe = store.subscribe(listener);
    store.setState({ selectedEntityId: 'anat.hippocampus' });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(Object.isFrozen(listener.mock.calls[0][0])).toBe(true);
    expect(Object.isFrozen(listener.mock.calls[0][0].highlightedEntityIds)).toBe(true);
    unsubscribe();
    unsubscribe();
    store.setState({ visualizationMode: '25d' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('isola falha de listener e notifica os demais', () => {
    const onError = vi.fn();
    const second = vi.fn();
    const store = createNeuroAtlasStore({}, { onError });
    store.subscribe(() => { throw new Error('listener broke'); });
    store.subscribe(second);
    store.setState({ selectedEntityId: 'anat.hippocampus' });
    expect(second).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0].code).toBe(ERROR_CODES.LISTENER_FAILED);
  });

  it('destroy é idempotente e bloqueia novas mutações/subscriptions com diagnóstico', () => {
    const onError = vi.fn();
    const store = createNeuroAtlasStore({}, { onError });
    store.destroy();
    store.destroy();
    expect(store.getState().status).toBe('booting');
    expect(() => store.setState({ visualizationMode: '25d' })).toThrowError();
    expect(() => store.subscribe(() => undefined)).toThrowError();
    expect(onError.mock.calls.map(([diagnostic]) => diagnostic.code)).toEqual([
      ERROR_CODES.INSTANCE_DESTROYED,
      ERROR_CODES.INSTANCE_DESTROYED,
    ]);
  });

  it('mantém instâncias isoladas', () => {
    const first = createNeuroAtlasStore();
    const second = createNeuroAtlasStore();
    first.setState({ selectedEntityId: 'anat.hippocampus' });
    expect(second.getState().selectedEntityId).toBeNull();
  });
});
```

- [ ] **Step 2: Executar e observar falha por módulos ausentes**

Run:

```powershell
rtk npm run test:neuroatlas -- state.test.js
```

Expected: FAIL porque `errors.js` e `state.js` ainda não existem.

- [ ] **Step 3: Implementar códigos de erro estáveis**

Create `src/features/neuroatlas/errors.js`:

```js
export const ERROR_CODES = Object.freeze({
  HOST_INVALID: 'HOST_INVALID',
  INSTANCE_DESTROYED: 'INSTANCE_DESTROYED',
  STATE_INVALID: 'STATE_INVALID',
  UNKNOWN_ID: 'UNKNOWN_ID',
  INVALID_STATE_COMBINATION: 'INVALID_STATE_COMBINATION',
  LISTENER_FAILED: 'LISTENER_FAILED',
  WEBGL_UNAVAILABLE: 'WEBGL_UNAVAILABLE',
  ASSET_LOAD_FAILED: 'ASSET_LOAD_FAILED',
  SVG_CONTRACT_INVALID: 'SVG_CONTRACT_INVALID',
  RENDERER_INIT_FAILED: 'RENDERER_INIT_FAILED',
});

export class NeuroAtlasError extends Error {
  constructor(code, message, { recoverable = false, details = {} } = {}) {
    super(message);
    this.name = 'NeuroAtlasError';
    this.code = code;
    this.recoverable = recoverable;
    this.details = Object.freeze({ ...details });
  }
}

export function toDiagnostic(error) {
  const normalized = error instanceof NeuroAtlasError
    ? error
    : new NeuroAtlasError(
      ERROR_CODES.RENDERER_INIT_FAILED,
      'O NeuroAtlas encontrou uma falha inesperada.',
      { recoverable: false },
    );

  return Object.freeze({
    code: normalized.code,
    message: normalized.message,
    recoverable: normalized.recoverable,
    details: normalized.details,
  });
}
```

- [ ] **Step 4: Implementar estado, validação transacional e lifecycle interno**

Create `src/features/neuroatlas/state.js` with these exact public exports and invariants:

```js
import { ERROR_CODES, NeuroAtlasError, toDiagnostic } from './errors.js';

export const ENTITY_IDS = Object.freeze([
  'anat.hippocampus',
  'anat.amygdala',
  'anat.prefrontal',
]);

export const CIRCUIT_ENTITY_IDS = Object.freeze([
  'anat.amygdala',
  'anat.hippocampus',
  'anat.prefrontal',
]);

const WRITABLE_KEYS = new Set([
  'visualizationMode',
  'selectedEntityId',
  'selectedConditionId',
  'selectedCircuitId',
  'highlightedEntityIds',
  'anatomyView',
  'showLabels',
  'showConnections',
]);

const STATUS_VALUES = new Set(['booting', 'ready', 'degraded', 'error']);

function freezeState(state) {
  return Object.freeze({
    ...state,
    highlightedEntityIds: Object.freeze([...state.highlightedEntityIds]),
  });
}

export const DEFAULT_STATE = freezeState({
  visualizationMode: '3d',
  selectedEntityId: null,
  selectedConditionId: null,
  selectedCircuitId: null,
  highlightedEntityIds: [],
  anatomyView: 'view.medial',
  showLabels: true,
  showConnections: true,
  status: 'booting',
});

function fail(code, message, details = {}) {
  throw new NeuroAtlasError(code, message, { details });
}

function validatePatch(patch) {
  const prototype = patch && typeof patch === 'object'
    ? Object.getPrototypeOf(patch)
    : null;
  if (!patch
    || typeof patch !== 'object'
    || Array.isArray(patch)
    || (prototype !== Object.prototype && prototype !== null)) {
    fail(ERROR_CODES.STATE_INVALID, 'O patch de estado deve ser um objeto.');
  }
  for (const key of Object.keys(patch)) {
    if (!WRITABLE_KEYS.has(key)) {
      fail(ERROR_CODES.STATE_INVALID, `Campo público não permitido: ${key}`, { key });
    }
  }
}

function validateState(state) {
  if (!['3d', '25d'].includes(state.visualizationMode)) {
    fail(ERROR_CODES.STATE_INVALID, 'Modo de visualização inválido.');
  }
  if (state.selectedEntityId !== null && !ENTITY_IDS.includes(state.selectedEntityId)) {
    fail(ERROR_CODES.UNKNOWN_ID, 'Entidade anatômica desconhecida.', { id: String(state.selectedEntityId) });
  }
  if (state.selectedConditionId !== null && state.selectedConditionId !== 'clinical.ptsd') {
    fail(ERROR_CODES.UNKNOWN_ID, 'Condição clínica desconhecida.', { id: String(state.selectedConditionId) });
  }
  if (state.selectedCircuitId !== null && state.selectedCircuitId !== 'circuit.threat-context-regulation') {
    fail(ERROR_CODES.UNKNOWN_ID, 'Circuito desconhecido.', { id: String(state.selectedCircuitId) });
  }
  if (!Array.isArray(state.highlightedEntityIds)) {
    fail(ERROR_CODES.STATE_INVALID, 'Destaques devem ser um array de IDs.');
  }
  const invalidHighlight = state.highlightedEntityIds.find((id) => !ENTITY_IDS.includes(id));
  if (invalidHighlight) {
    fail(ERROR_CODES.UNKNOWN_ID, 'Destaque anatômico desconhecido.', { id: String(invalidHighlight) });
  }
  if (new Set(state.highlightedEntityIds).size !== state.highlightedEntityIds.length) {
    fail(ERROR_CODES.INVALID_STATE_COMBINATION, 'Destaques não podem conter duplicatas.');
  }
  if (state.anatomyView !== 'view.medial') {
    fail(ERROR_CODES.UNKNOWN_ID, 'Vista anatômica desconhecida.', { id: String(state.anatomyView) });
  }
  if (typeof state.showLabels !== 'boolean' || typeof state.showConnections !== 'boolean') {
    fail(ERROR_CODES.STATE_INVALID, 'Controles visuais devem ser booleanos.');
  }
  if (!STATUS_VALUES.has(state.status)) {
    fail(ERROR_CODES.STATE_INVALID, 'Status interno inválido.');
  }

  const closed = state.selectedConditionId === null
    && state.selectedCircuitId === null
    && state.highlightedEntityIds.length === 0;
  const open = state.selectedConditionId === 'clinical.ptsd'
    && state.selectedCircuitId === 'circuit.threat-context-regulation'
    && JSON.stringify(state.highlightedEntityIds) === JSON.stringify(CIRCUIT_ENTITY_IDS);

  if (!closed && !open) {
    fail(
      ERROR_CODES.INVALID_STATE_COMBINATION,
      'Condição, circuito e destaques devem abrir ou fechar juntos.',
    );
  }
  return freezeState(state);
}

export function createNeuroAtlasStore(initialState = {}, { onError } = {}) {
  let destroyed = false;
  const listeners = new Set();

  const emit = (error) => {
    if (typeof onError === 'function') {
      try { onError(toDiagnostic(error)); } catch { /* callback externo não quebra o store */ }
    }
  };

  const transact = (operation) => {
    try { return operation(); }
    catch (error) {
      const normalized = error instanceof NeuroAtlasError
        ? error
        : new NeuroAtlasError(ERROR_CODES.STATE_INVALID, 'Falha ao validar estado.');
      emit(normalized);
      throw normalized;
    }
  };

  let state = transact(() => {
    validatePatch(initialState);
    return validateState({ ...DEFAULT_STATE, ...initialState });
  });

  const ensureActive = () => transact(() => {
    if (destroyed) fail(
      ERROR_CODES.INSTANCE_DESTROYED,
      'A instância do NeuroAtlas já foi destruída.',
    );
  });

  const notify = () => {
    for (const listener of listeners) {
      try { listener(state); }
      catch {
        emit(new NeuroAtlasError(
          ERROR_CODES.LISTENER_FAILED,
          'Um consumidor de estado falhou.',
          { recoverable: true },
        ));
      }
    }
  };

  return {
    getState: () => state,
    setState(patch) {
      ensureActive();
      transact(() => {
        validatePatch(patch);
        state = validateState({ ...state, ...patch });
      });
      notify();
    },
    setLifecycleStatus(status) {
      ensureActive();
      state = transact(() => validateState({ ...state, status }));
      notify();
    },
    subscribe(listener) {
      ensureActive();
      transact(() => {
        if (typeof listener !== 'function') {
          fail(ERROR_CODES.STATE_INVALID, 'Listener deve ser uma função.');
        }
      });
      listeners.add(listener);
      let subscribed = true;
      return () => {
        if (!subscribed) return;
        subscribed = false;
        listeners.delete(listener);
      };
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      listeners.clear();
    },
  };
}
```

- [ ] **Step 5: Executar testes e lint do núcleo**

Run:

```powershell
rtk npm run test:neuroatlas -- state.test.js
rtk npm exec eslint -- src/features/neuroatlas/errors.js src/features/neuroatlas/state.js src/features/neuroatlas/state.test.js
```

Expected: PASS.

- [ ] **Step 6: Commitar a base de estado**

Run:

```powershell
rtk git add src/features/neuroatlas/errors.js src/features/neuroatlas/state.js src/features/neuroatlas/state.test.js
rtk git commit -m "feat(neuro): add immutable framework-free state"
```

---

### Task 4: Conteúdo clínico, circuito e whitelist de assets

**Files:**
- Create: `src/features/neuroatlas/content.js`
- Create: `src/features/neuroatlas/assets.js`
- Test: `src/features/neuroatlas/content.test.js`
- Modify: `scripts/check-neuro-models.mjs`

**Interfaces:**
- Consumes: IDs de `state.js` e oito OBJ existentes.
- Produces: `ENTITIES`, `PTSD_CIRCUIT`, `PTSD_CONTENT`, `SOURCES`, `LEGACY_OBJ_ASSETS`, `ATLAS_TRANSFORM`, `assertContentContract()`.

- [ ] **Step 1: Escrever testes de conteúdo e assets antes dos dados**

Create `src/features/neuroatlas/content.test.js`:

```js
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  ENTITIES,
  PTSD_CIRCUIT,
  PTSD_CONTENT,
  SOURCES,
  assertContentContract,
} from './content.js';
import { LEGACY_OBJ_ASSETS } from './assets.js';

describe('NeuroAtlas content contract', () => {
  it('mantém os três IDs e o circuito na ordem normativa', () => {
    expect(Object.keys(ENTITIES).sort()).toEqual([
      'anat.amygdala',
      'anat.hippocampus',
      'anat.prefrontal',
    ]);
    expect(PTSD_CIRCUIT.entityIds).toEqual([
      'anat.amygdala',
      'anat.hippocampus',
      'anat.prefrontal',
    ]);
    expect(PTSD_CIRCUIT.edges.map((edge) => edge.id)).toEqual([
      'edge.amygdala-hippocampus',
      'edge.hippocampus-prefrontal',
      'edge.prefrontal-amygdala',
    ]);
    expect(PTSD_CIRCUIT.textAlternative).toContain(
      'Amígdala, Hipocampo e Córtex pré-frontal',
    );
  });

  it('resolve todas as fontes e limites clínicos', () => {
    expect(() => assertContentContract()).not.toThrow();
    expect(Object.keys(SOURCES)).toEqual([
      'SRC-PTSD-HAYES-2012',
      'SRC-PTSD-MILAD-2009',
      'SRC-PTSD-LOGUE-2018',
    ]);
    for (const source of Object.values(SOURCES)) {
      expect(source.url).toMatch(/^https:\/\/pubmed\.ncbi\.nlm\.nih\.gov\/[0-9]+\/$/);
      expect(source.allowedUse.length).toBeGreaterThan(0);
      expect(source.evidenceLimit.length).toBeGreaterThan(0);
    }
    expect(PTSD_CONTENT.lastReviewed).toBe('2026-08-24');
    expect(PTSD_CONTENT.evidenceLimit).toContain('grupo');
    expect(PTSD_CONTENT.evidenceLimits).toHaveLength(5);
    for (const block of [
      PTSD_CONTENT,
      PTSD_CIRCUIT,
      ...Object.values(PTSD_CONTENT.nodeNotes),
    ]) {
      expect(block.sourceIds.length).toBeGreaterThan(0);
      expect(block.evidenceLimit.length).toBeGreaterThan(0);
      expect(block.lastReviewed).toBe('2026-08-24');
    }
  });

  it('não contém equivalência diagnóstico-área ou biomarcador individual', () => {
    const serialized = JSON.stringify({ ENTITIES, PTSD_CIRCUIT, PTSD_CONTENT });
    expect(serialized).not.toMatch(/TEPT\s*=\s*/i);
    expect(serialized).not.toMatch(/biomarcador individual (válido|validado)/i);
  });

  it('mapeia exatamente oito OBJ existentes', () => {
    const assets = Object.values(LEGACY_OBJ_ASSETS).flatMap((entry) => entry.assets);
    const urls = assets.map((asset) => asset.url);
    expect(new Set(assets.map((asset) => asset.id)).size).toBe(8);
    expect(urls).toHaveLength(8);
    for (const url of urls) {
      expect(fs.existsSync(path.join(process.cwd(), 'public', url))).toBe(true);
    }
    for (const entity of Object.values(ENTITIES)) {
      expect(entity.visual3d.assetIds).toEqual(
        LEGACY_OBJ_ASSETS[entity.id].assets.map((asset) => asset.id),
      );
      expect(entity.visual25d.viewId).toBe('view.medial');
      expect(entity.visual25d.elementIds).toHaveLength(1);
    }
  });
});
```

- [ ] **Step 2: Executar teste vermelho**

Run:

```powershell
rtk npm run test:neuroatlas -- content.test.js
```

Expected: FAIL por módulos ausentes.

- [ ] **Step 3: Criar o conteúdo data-only**

Create `src/features/neuroatlas/content.js`. Use the exact clinical copy below; renderers must receive presentation data by dependency injection and may not import or hardcode these clinical strings:

```js
import { LEGACY_OBJ_ASSETS } from './assets.js';
import { CIRCUIT_ENTITY_IDS, ENTITY_IDS } from './state.js';

export const SOURCES = Object.freeze({
  'SRC-PTSD-HAYES-2012': Object.freeze({
    title: 'Quantitative meta-analysis of neural activity in posttraumatic stress disorder',
    doi: '10.1186/2045-5380-2-9',
    pmid: '22738125',
    url: 'https://pubmed.ncbi.nlm.nih.gov/22738125/',
    allowedUse: 'Contextualizar achados funcionais distribuídos envolvendo amígdala e regiões pré-frontais/regulatórias.',
    evidenceLimit: 'Meta-análise de estudos heterogêneos; não autoriza causalidade ou inferência diagnóstica individual.',
  }),
  'SRC-PTSD-MILAD-2009': Object.freeze({
    title: 'Neurobiological basis of failure to recall extinction memory in posttraumatic stress disorder',
    doi: '10.1016/j.biopsych.2009.06.026',
    pmid: '19748076',
    url: 'https://pubmed.ncbi.nlm.nih.gov/19748076/',
    allowedUse: 'Explicar relações de grupo entre recordação da extinção, hipocampo, amígdala e vmPFC.',
    evidenceLimit: 'Amostra pequena e tarefa específica; não generalizar para toda apresentação de TEPT.',
  }),
  'SRC-PTSD-LOGUE-2018': Object.freeze({
    title: 'Smaller Hippocampal Volume in Posttraumatic Stress Disorder: A Multisite ENIGMA-PGC Study',
    doi: '10.1016/j.biopsych.2017.09.006',
    pmid: '29217296',
    url: 'https://pubmed.ncbi.nlm.nih.gov/29217296/',
    allowedUse: 'Contextualizar associação de grupo entre TEPT atual e menor volume hipocampal médio.',
    evidenceLimit: 'Efeito pequeno, associação de grupo e desenho observacional; não é biomarcador individual.',
  }),
});

function visual3d(entityId) {
  const entry = LEGACY_OBJ_ASSETS[entityId];
  return Object.freeze({
    assetIds: Object.freeze(entry.assets.map((asset) => asset.id)),
    modelCenter: entry.modelCenter,
    defaultCamera: Object.freeze({
      target: entry.cameraTarget,
      position: entry.cameraPosition,
    }),
  });
}

export const ENTITIES = Object.freeze({
  'anat.hippocampus': Object.freeze({
    id: 'anat.hippocampus',
    name: 'Hipocampo',
    aliases: Object.freeze(['hippocampus']),
    summary: 'Participa da formação de memórias declarativas e da organização do contexto espacial e temporal.',
    visual3d: visual3d('anat.hippocampus'),
    visual25d: Object.freeze({ viewId: 'view.medial', elementIds: Object.freeze(['anat-hippocampus']) }),
    sourceIds: Object.freeze(['SRC-PTSD-MILAD-2009', 'SRC-PTSD-LOGUE-2018']),
  }),
  'anat.amygdala': Object.freeze({
    id: 'anat.amygdala',
    name: 'Amígdala',
    aliases: Object.freeze(['amygdala']),
    summary: 'Participa da detecção de saliência, da aprendizagem emocional e de respostas relacionadas à ameaça.',
    visual3d: visual3d('anat.amygdala'),
    visual25d: Object.freeze({ viewId: 'view.medial', elementIds: Object.freeze(['anat-amygdala']) }),
    sourceIds: Object.freeze(['SRC-PTSD-HAYES-2012', 'SRC-PTSD-MILAD-2009']),
  }),
  'anat.prefrontal': Object.freeze({
    id: 'anat.prefrontal',
    name: 'Córtex pré-frontal',
    aliases: Object.freeze(['prefrontal']),
    summary: 'Conjunto amplo de regiões envolvidas em controle, avaliação e regulação; o mesh piloto não demarca vmPFC com precisão.',
    visual3d: visual3d('anat.prefrontal'),
    visual25d: Object.freeze({ viewId: 'view.medial', elementIds: Object.freeze(['anat-prefrontal']) }),
    sourceIds: Object.freeze(['SRC-PTSD-HAYES-2012', 'SRC-PTSD-MILAD-2009']),
  }),
});

export const PTSD_CIRCUIT = Object.freeze({
  id: 'circuit.threat-context-regulation',
  name: 'Ameaça, contexto e regulação',
  textAlternative: 'Estruturas deste circuito didático: Amígdala, Hipocampo e Córtex pré-frontal; as conexões não indicam direção causal.',
  entityIds: CIRCUIT_ENTITY_IDS,
  edges: Object.freeze([
    Object.freeze({ id: 'edge.amygdala-hippocampus', from: 'anat.amygdala', to: 'anat.hippocampus' }),
    Object.freeze({ id: 'edge.hippocampus-prefrontal', from: 'anat.hippocampus', to: 'anat.prefrontal' }),
    Object.freeze({ id: 'edge.prefrontal-amygdala', from: 'anat.prefrontal', to: 'anat.amygdala' }),
  ]),
  sourceIds: Object.freeze(Object.keys(SOURCES)),
  evidenceLimit: 'Circuito didático não direcional; simplifica processos distribuídos e não é biomarcador diagnóstico.',
  lastReviewed: '2026-08-24',
});

export const PTSD_CONTENT = Object.freeze({
  id: 'clinical.ptsd',
  title: 'TEPT: ameaça, contexto e regulação',
  summary: 'O TEPT envolve processos distribuídos de detecção de saliência e ameaça, memória contextual e regulação emocional. Estudos de grupo relacionam esses processos a padrões de atividade ou volume envolvendo amígdala, hipocampo e regiões pré-frontais. Esses achados não permitem diagnosticar uma pessoa por imagem cerebral nem afirmar que uma única estrutura causa o transtorno.',
  nodeNotes: Object.freeze({
    'anat.amygdala': Object.freeze({
      text: 'Estudos de grupo relacionam a amígdala à saliência de ameaça, expressão do medo e aprendizagem de extinção; os achados variam conforme tarefa e amostra.',
      sourceIds: Object.freeze(['SRC-PTSD-HAYES-2012', 'SRC-PTSD-MILAD-2009']),
      evidenceLimit: 'Achados de grupo variam conforme tarefa e amostra e não estabelecem diagnóstico individual.',
      lastReviewed: '2026-08-24',
    }),
    'anat.hippocampus': Object.freeze({
      text: 'Participa da memória contextual e da recordação da extinção; estudos de grupo relatam diferenças de ativação ou volume médio, sem valor diagnóstico individual.',
      sourceIds: Object.freeze(['SRC-PTSD-MILAD-2009', 'SRC-PTSD-LOGUE-2018']),
      evidenceLimit: 'Associações de ativação ou volume são médias de grupo e não têm valor diagnóstico individual.',
      lastReviewed: '2026-08-24',
    }),
    'anat.prefrontal': Object.freeze({
      text: 'Regiões pré-frontais, especialmente vmPFC nas fontes do slice, participam de processos regulatórios e da recordação da extinção; o destaque 3D amplo é uma aproximação didática, não uma demarcação de vmPFC.',
      sourceIds: Object.freeze(['SRC-PTSD-HAYES-2012', 'SRC-PTSD-MILAD-2009']),
      evidenceLimit: 'O mesh pré-frontal amplo do piloto não demarca vmPFC e não autoriza inferência anatômica precisa.',
      lastReviewed: '2026-08-24',
    }),
  }),
  evidenceLimits: Object.freeze([
    'Associações de grupo não demonstram causalidade.',
    'Resultados variam por amostra, tarefa e método.',
    'Este slice não fornece biomarcador para avaliação individual.',
    'O circuito simplifica processos distribuídos para fins pedagógicos.',
    'O nó pré-frontal 3D é anatomicamente amplo.',
  ]),
  sourceIds: Object.freeze(Object.keys(SOURCES)),
  evidenceLimit: 'Achados são associações de grupo heterogêneas, sem causalidade ou diagnóstico individual.',
  lastReviewed: '2026-08-24',
});

function assertClinicalBlock(block, label) {
  if (!Array.isArray(block.sourceIds) || block.sourceIds.length === 0) {
    throw new Error(`${label} has no sources.`);
  }
  if (typeof block.evidenceLimit !== 'string' || block.evidenceLimit.length === 0) {
    throw new Error(`${label} has no evidence limit.`);
  }
  if (block.lastReviewed !== '2026-08-24') {
    throw new Error(`${label} has an invalid review date.`);
  }
  for (const sourceId of block.sourceIds) {
    if (!SOURCES[sourceId]) throw new Error(`${label} uses unknown source: ${sourceId}`);
  }
}

export function assertContentContract() {
  if (JSON.stringify(Object.keys(ENTITIES).sort()) !== JSON.stringify([...ENTITY_IDS].sort())) {
    throw new Error('Entity catalog does not match canonical IDs.');
  }
  assertClinicalBlock(PTSD_CONTENT, 'PTSD content');
  assertClinicalBlock(PTSD_CIRCUIT, 'PTSD circuit');
  for (const [entityId, note] of Object.entries(PTSD_CONTENT.nodeNotes)) {
    assertClinicalBlock(note, `PTSD node ${entityId}`);
  }
  if (JSON.stringify(PTSD_CIRCUIT.entityIds) !== JSON.stringify(CIRCUIT_ENTITY_IDS)) {
    throw new Error('PTSD circuit order is invalid.');
  }
}
```

- [ ] **Step 4: Criar a whitelist 3D exata**

Create `src/features/neuroatlas/assets.js`:

```js
export const ATLAS_TRANSFORM = Object.freeze({
  center: Object.freeze([0, -79.82, 1556.34]),
  scale: 0.05,
});

export const LEGACY_OBJ_ASSETS = Object.freeze({
  'anat.hippocampus': Object.freeze({
    assets: Object.freeze([
      Object.freeze({ id: 'asset.hippocampus.left', url: '/models/MM164_BP58046_FMA72714_Left hippocampus proper.obj' }),
      Object.freeze({ id: 'asset.hippocampus.right', url: '/models/MM164M_BP58047_FMA72713_Right hippocampus proper.obj' }),
    ]),
    modelCenter: Object.freeze([0.01, -81.02, 1537.53]),
    cameraTarget: Object.freeze([0, -0.06, -0.94]),
    cameraPosition: Object.freeze([-4, -1, 2]),
  }),
  'anat.amygdala': Object.freeze({
    assets: Object.freeze([
      Object.freeze({ id: 'asset.amygdala.left', url: '/models/MM179_BP58076_FMA72833_Left amygdala.obj' }),
      Object.freeze({ id: 'asset.amygdala.right', url: '/models/MM179M_BP58075_FMA72832_Right amygdala.obj' }),
    ]),
    modelCenter: Object.freeze([0.04, -100.93, 1534.68]),
    cameraTarget: Object.freeze([0, -1.05, -1.08]),
    cameraPosition: Object.freeze([0, -1, 5]),
  }),
  'anat.prefrontal': Object.freeze({
    assets: Object.freeze([
      Object.freeze({ id: 'asset.prefrontal.middle-left', url: '/models/FJ3839_BP58174_FMA72656_Left middle frontal gyrus.obj' }),
      Object.freeze({ id: 'asset.prefrontal.middle-right', url: '/models/FJ3840_BP58164_FMA72655_Right middle frontal gyrus.obj' }),
      Object.freeze({ id: 'asset.prefrontal.superior-left', url: '/models/FJ3879_BP58158_FMA72654_Left superior frontal gyrus.obj' }),
      Object.freeze({ id: 'asset.prefrontal.superior-right', url: '/models/FJ3880_BP58162_FMA72653_Right superior frontal gyrus.obj' }),
    ]),
    modelCenter: Object.freeze([-0.75, -111.66, 1588.49]),
    cameraTarget: Object.freeze([0, -1.6, 1.6]),
    cameraPosition: Object.freeze([0, 4, 8]),
  }),
});
```

- [ ] **Step 5: Ampliar o verificador existente sem apagar suas verificações atuais**

In `scripts/check-neuro-models.mjs`, import no browser modules. Read `src/features/neuroatlas/assets.js` as text and extract the same `/models/*.obj` pattern into `sliceReferenced`. Add these failure conditions:

```js
const sliceContent = fs.readFileSync(
  path.join(root, 'src/features/neuroatlas/assets.js'),
  'utf8',
);
const sliceReferenced = [...sliceContent.matchAll(/['"](\/models\/[^'"]+\.obj)['"]/g)]
  .map((match) => match[1]);
const missingSlice = sliceReferenced.filter(
  (url) => !fs.existsSync(path.join(root, 'public', url)),
);
const duplicateSlice = sliceReferenced.filter(
  (url, index) => sliceReferenced.indexOf(url) !== index,
);
```

The failing condition must include:

```js
sliceReferenced.length !== 8 || missingSlice.length || duplicateSlice.length
```

The error object must include `sliceCount`, `missingSlice` and `duplicateSlice`; the success message must end with `8 assets canônicos do slice`.

- [ ] **Step 6: Executar testes e verificador**

Run:

```powershell
rtk npm run test:neuroatlas -- content.test.js
rtk npm run check:neuro-models
```

Expected: PASS; verificador informa `8 assets canônicos do slice`.

- [ ] **Step 7: Commitar conteúdo e adapter**

Run:

```powershell
rtk git add src/features/neuroatlas/content.js src/features/neuroatlas/assets.js src/features/neuroatlas/content.test.js scripts/check-neuro-models.mjs
rtk git commit -m "feat(neuro): add canonical content and asset adapter"
```

---

### Task 5: Renderer SVG 2.5D acessível

**Files:**
- Create: `src/features/neuroatlas/svg-renderer.js`
- Test: `src/features/neuroatlas/svg-renderer.test.js`

**Interfaces:**
- Consumes: store com `getState`, `setState`, `subscribe`; `{ id, textAlternative }` do circuito injetado pela composição.
- Produces: `createSvgRenderer({ element, store })` → `{ ready, destroy }`.

- [ ] **Step 1: Escrever testes de equivalência, labels e circuito**

Create `src/features/neuroatlas/svg-renderer.test.js`:

```js
import { describe, expect, it } from 'vitest';
import { PTSD_CIRCUIT } from './content.js';
import { createNeuroAtlasStore, CIRCUIT_ENTITY_IDS } from './state.js';
import { assertSvgContract, createSvgRenderer } from './svg-renderer.js';

describe('SVG renderer', () => {
  it('cria os três grupos canônicos e seleciona por click/teclado', async () => {
    const element = document.createElement('div');
    const store = createNeuroAtlasStore({ visualizationMode: '25d' });
    const renderer = createSvgRenderer({ element, store, circuit: PTSD_CIRCUIT });
    await renderer.ready;
    const hippocampus = element.querySelector('[data-entity-id="anat.hippocampus"]');
    hippocampus.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(store.getState().selectedEntityId).toBe('anat.hippocampus');
    expect(element.querySelectorAll('[data-entity-id]')).toHaveLength(3);
    expect([...element.querySelectorAll('.na-hit-target')].every(
      (node) => Number(node.getAttribute('r')) >= 92,
    )).toBe(true);
    renderer.destroy();
  });

  it('mantém nomes acessíveis quando labels visuais estão ocultos', async () => {
    const element = document.createElement('div');
    const store = createNeuroAtlasStore({ visualizationMode: '25d', showLabels: false });
    const renderer = createSvgRenderer({ element, store, circuit: PTSD_CIRCUIT });
    await renderer.ready;
    expect(element.querySelector('[data-labels]')?.getAttribute('hidden')).toBe('');
    expect(element.querySelector('[aria-label="Hipocampo"]')).not.toBeNull();
    renderer.destroy();
  });

  it('desenha três edges sem seta e preserva legenda textual', async () => {
    const element = document.createElement('div');
    const store = createNeuroAtlasStore({
      visualizationMode: '25d',
      selectedEntityId: 'anat.hippocampus',
      selectedConditionId: 'clinical.ptsd',
      selectedCircuitId: 'circuit.threat-context-regulation',
      highlightedEntityIds: CIRCUIT_ENTITY_IDS,
    });
    const renderer = createSvgRenderer({ element, store, circuit: PTSD_CIRCUIT });
    await renderer.ready;
    expect(element.querySelectorAll('[data-circuit-edge]')).toHaveLength(3);
    expect(element.querySelector('marker')).toBeNull();
    expect(element.querySelector('[data-circuit-legend]').textContent).toContain('Amígdala, Hipocampo e Córtex pré-frontal');
    renderer.destroy();
  });

  it('rejeita payload sem os três grupos canônicos', () => {
    const element = document.createElement('div');
    element.innerHTML = '<svg><path data-entity-id="anat.hippocampus" /></svg>';
    expect(() => assertSvgContract(element)).toThrowError(
      expect.objectContaining({ code: 'SVG_CONTRACT_INVALID' }),
    );
  });
});
```

- [ ] **Step 2: Executar teste vermelho**

Run:

```powershell
rtk npm run test:neuroatlas -- svg-renderer.test.js
```

Expected: FAIL por módulo ausente.

- [ ] **Step 3: Implementar SVG blockout e eventos**

Create `src/features/neuroatlas/svg-renderer.js`. The SVG must use this exact blockout and no `marker-end`:

```js
import { ERROR_CODES, NeuroAtlasError } from './errors.js';

const EXPECTED_SVG_IDS = Object.freeze([
  'anat.amygdala',
  'anat.hippocampus',
  'anat.prefrontal',
]);

const SVG = `
<svg viewBox="0 0 1200 800" role="img" aria-labelledby="atlas25d-title atlas25d-desc">
  <title id="atlas25d-title">Vista medial esquemática do cérebro</title>
  <desc id="atlas25d-desc">Protótipo com hipocampo, amígdala e córtex pré-frontal.</desc>
  <path class="na-brain-silhouette" d="M150 430 C145 230 310 120 560 120 C830 120 1040 250 1045 455 C1050 630 860 700 615 680 C390 700 190 620 150 430 Z" />
  <g id="anat-prefrontal" data-entity-id="anat.prefrontal" role="button" tabindex="0" aria-label="Córtex pré-frontal">
    <circle class="na-hit-target" cx="850" cy="280" r="92" />
    <path d="M735 205 C875 220 970 310 965 430 C895 405 820 365 750 310 Z" />
  </g>
  <g id="anat-hippocampus" data-entity-id="anat.hippocampus" role="button" tabindex="0" aria-label="Hipocampo">
    <circle class="na-hit-target" cx="580" cy="510" r="92" />
    <path d="M470 485 C535 430 650 438 700 505 C655 555 545 570 475 530 Z" />
  </g>
  <g id="anat-amygdala" data-entity-id="anat.amygdala" role="button" tabindex="0" aria-label="Amígdala">
    <circle class="na-hit-target" cx="780" cy="510" r="92" />
    <ellipse cx="780" cy="510" rx="42" ry="36" />
  </g>
  <g data-circuit-lines hidden>
    <line data-circuit-edge="edge.amygdala-hippocampus" x1="780" y1="510" x2="580" y2="510" />
    <line data-circuit-edge="edge.hippocampus-prefrontal" x1="580" y1="510" x2="850" y2="280" />
    <line data-circuit-edge="edge.prefrontal-amygdala" x1="850" y1="280" x2="780" y2="510" />
  </g>
  <g data-labels>
    <text x="790" y="190">Córtex pré-frontal</text>
    <text x="495" y="600">Hipocampo</text>
    <text x="705" y="565">Amígdala</text>
  </g>
</svg>
<p data-circuit-legend hidden></p>`;

export function assertSvgContract(element) {
  const actual = [...element.querySelectorAll('[data-entity-id]')]
    .map((node) => node.dataset.entityId)
    .sort();
  if (JSON.stringify(actual) !== JSON.stringify(EXPECTED_SVG_IDS)) {
    throw new NeuroAtlasError(
      ERROR_CODES.SVG_CONTRACT_INVALID,
      'A vista 2.5D não contém os três grupos anatômicos esperados.',
    );
  }
}

export function createSvgRenderer({ element, store, circuit }) {
  element.innerHTML = SVG;
  assertSvgContract(element);
  const entityNodes = [...element.querySelectorAll('[data-entity-id]')];
  element.querySelector('[data-circuit-legend]').textContent = circuit.textAlternative;
  let destroyed = false;

  const activate = (event) => {
    const entityId = event.currentTarget.dataset.entityId;
    if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    store.setState({ selectedEntityId: entityId });
  };
  for (const node of entityNodes) {
    node.addEventListener('click', activate);
    node.addEventListener('keydown', activate);
  }

  const render = (state) => {
    element.toggleAttribute('hidden', state.visualizationMode !== '25d');
    for (const node of entityNodes) {
      const id = node.dataset.entityId;
      node.dataset.selected = String(state.selectedEntityId === id);
      node.dataset.highlighted = String(state.highlightedEntityIds.includes(id));
    }
    element.querySelector('[data-labels]').toggleAttribute('hidden', !state.showLabels);
    const showCircuit = state.selectedCircuitId === circuit.id;
    element.querySelector('[data-circuit-lines]').toggleAttribute('hidden', !(showCircuit && state.showConnections));
    element.querySelector('[data-circuit-legend]').toggleAttribute('hidden', !showCircuit);
  };

  render(store.getState());
  const unsubscribe = store.subscribe(render);

  return {
    ready: Promise.resolve(),
    destroy() {
      if (destroyed) return;
      destroyed = true;
      unsubscribe();
      for (const node of entityNodes) {
        node.removeEventListener('click', activate);
        node.removeEventListener('keydown', activate);
      }
      element.replaceChildren();
    },
  };
}
```

- [ ] **Step 4: Executar testes**

Run:

```powershell
rtk npm run test:neuroatlas -- svg-renderer.test.js
```

Expected: PASS.

- [ ] **Step 5: Commitar renderer 2.5D**

Run:

```powershell
rtk git add src/features/neuroatlas/svg-renderer.js src/features/neuroatlas/svg-renderer.test.js
rtk git commit -m "feat(neuro): add accessible medial SVG renderer"
```

---

### Task 6: Renderer Three.js direto e testável

**Files:**
- Create: `src/features/neuroatlas/three-renderer.js`
- Test: `src/features/neuroatlas/three-renderer.test.js`

**Interfaces:**
- Consumes: `LEGACY_OBJ_ASSETS`, `ATLAS_TRANSFORM`, store e callbacks de erro.
- Produces: `createThreeRenderer({ element, store, onError, dependencies? })` → `{ ready, resetCamera, destroy }`; `applyThreeState()` e `applyCameraPreset()` para testes puros. O callback interno recebe `NeuroAtlasError`; somente a composição pública converte para diagnóstico seguro.

- [ ] **Step 1: Escrever testes puros antes de WebGL**

Create `src/features/neuroatlas/three-renderer.test.js`:

```js
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { createNeuroAtlasStore } from './state.js';
import {
  applyCameraPreset,
  applyThreeState,
  collectPickableMeshes,
  commitPickedEntity,
  createThreeRenderer,
} from './three-renderer.js';

function entityGroup(id) {
  const group = new THREE.Group();
  group.userData.entityId = id;
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshLambertMaterial({ color: '#94a3b8', transparent: true }),
  );
  mesh.userData.entityId = id;
  group.add(mesh);
  return group;
}

describe('Three renderer state projection', () => {
  it('mantém seleção primária distinta dos demais destaques', () => {
    const groups = new Map([
      ['anat.hippocampus', entityGroup('anat.hippocampus')],
      ['anat.amygdala', entityGroup('anat.amygdala')],
      ['anat.prefrontal', entityGroup('anat.prefrontal')],
    ]);
    applyThreeState(groups, {
      selectedEntityId: 'anat.hippocampus',
      highlightedEntityIds: ['anat.amygdala', 'anat.hippocampus', 'anat.prefrontal'],
    });
    expect(groups.get('anat.hippocampus').children[0].material.color.getHexString()).toBe('f59e0b');
    expect(groups.get('anat.amygdala').children[0].material.color.getHexString()).toBe('38bdf8');
  });

  it('coleta meshes com o mesmo ID do grupo', () => {
    const group = entityGroup('anat.hippocampus');
    const mesh = collectPickableMeshes(new Map([['anat.hippocampus', group]]))[0];
    const store = createNeuroAtlasStore();
    expect(commitPickedEntity(store, { object: mesh })).toBe('anat.hippocampus');
    expect(store.getState().selectedEntityId).toBe('anat.hippocampus');
  });

  it('aplica sem alterar os presets legados de câmera', () => {
    const camera = new THREE.PerspectiveCamera();
    const controls = { target: new THREE.Vector3(), update() {} };
    applyCameraPreset(camera, controls, 'anat.hippocampus');
    expect(camera.position.toArray()).toEqual([-4, -1, 2]);
    expect(controls.target.toArray()).toEqual([0, -0.06, -0.94]);
  });

  it('solicita oito assets e destrói canvas, frame, observers e GPU uma só vez', async () => {
    const element = document.createElement('div');
    const store = createNeuroAtlasStore();
    const loader = {
      loadAsync: vi.fn(async () => {
        const object = new THREE.Group();
        object.add(new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshBasicMaterial(),
        ));
        return object;
      }),
    };
    const rendererAdapter = {
      domElement: document.createElement('canvas'),
      setPixelRatio: vi.fn(),
      setSize: vi.fn(),
      render: vi.fn(),
      dispose: vi.fn(),
    };
    const controls = {
      enableDamping: false,
      target: new THREE.Vector3(),
      update: vi.fn(),
      dispose: vi.fn(),
    };
    const resizeObserver = { observe: vi.fn(), disconnect: vi.fn() };
    const cancelFrame = vi.fn();
    const renderer = createThreeRenderer({
      element,
      store,
      dependencies: {
        createRenderer: () => rendererAdapter,
        loader,
        createControls: () => controls,
        createResizeObserver: () => resizeObserver,
        requestFrame: () => 17,
        cancelFrame,
      },
    });
    await renderer.ready;
    expect(loader.loadAsync).toHaveBeenCalledTimes(8);
    renderer.destroy();
    renderer.destroy();
    expect(cancelFrame).toHaveBeenCalledTimes(1);
    expect(resizeObserver.disconnect).toHaveBeenCalledTimes(1);
    expect(controls.dispose).toHaveBeenCalledTimes(1);
    expect(rendererAdapter.dispose).toHaveBeenCalledTimes(1);
    expect(element.querySelector('canvas')).toBeNull();
  });
});
```

- [ ] **Step 2: Executar teste vermelho**

Run:

```powershell
rtk npm run test:neuroatlas -- three-renderer.test.js
```

Expected: FAIL por módulo ausente.

- [ ] **Step 3: Implementar projeção visual pura**

In `src/features/neuroatlas/three-renderer.js`, export these helpers:

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { ATLAS_TRANSFORM, LEGACY_OBJ_ASSETS } from './assets.js';
import { ERROR_CODES, NeuroAtlasError } from './errors.js';

const COLORS = Object.freeze({
  base: '#94a3b8',
  selected: '#f59e0b',
  highlighted: '#38bdf8',
  muted: '#475569',
});

export function collectPickableMeshes(groups) {
  const meshes = [];
  for (const [entityId, group] of groups) {
    group.traverse((object) => {
      if (!object.isMesh) return;
      object.userData.entityId = entityId;
      meshes.push(object);
    });
  }
  return meshes;
}

export function commitPickedEntity(store, intersection) {
  const entityId = intersection?.object?.userData?.entityId;
  if (!entityId) return null;
  store.setState({ selectedEntityId: entityId });
  return entityId;
}

export function applyThreeState(groups, state) {
  const hasHighlight = state.highlightedEntityIds.length > 0;
  for (const [entityId, group] of groups) {
    const selected = state.selectedEntityId === entityId;
    const highlighted = state.highlightedEntityIds.includes(entityId);
    const color = selected
      ? COLORS.selected
      : highlighted
        ? COLORS.highlighted
        : hasHighlight
          ? COLORS.muted
          : COLORS.base;
    group.traverse((object) => {
      if (!object.isMesh) return;
      object.material.color.set(color);
      object.material.opacity = selected || highlighted || !hasHighlight ? 0.95 : 0.3;
      object.material.transparent = true;
    });
  }
}

export function applyCameraPreset(camera, controls, entityId) {
  const preset = LEGACY_OBJ_ASSETS[entityId];
  if (!preset) return;
  camera.position.fromArray(preset.cameraPosition);
  controls.target.fromArray(preset.cameraTarget);
  controls.update();
}
```

- [ ] **Step 4: Implementar inicialização, whitelist, raycast e descarte**

Continue the same file with `createThreeRenderer`. Required concrete sequence:

```js
export function createThreeRenderer({
  element,
  store,
  onError,
  dependencies = {},
}) {
  const createRenderer = dependencies.createRenderer
    ?? (() => new THREE.WebGLRenderer({ antialias: true, alpha: true }));
  const loader = dependencies.loader ?? new OBJLoader();
  const createControls = dependencies.createControls
    ?? ((camera, canvas) => new OrbitControls(camera, canvas));
  const createResizeObserver = dependencies.createResizeObserver
    ?? ((callback) => new ResizeObserver(callback));
  const requestFrame = dependencies.requestFrame ?? requestAnimationFrame;
  const cancelFrame = dependencies.cancelFrame ?? cancelAnimationFrame;
  let renderer;
  try {
    renderer = createRenderer();
  } catch {
    throw new NeuroAtlasError(
      ERROR_CODES.WEBGL_UNAVAILABLE,
      'A visualização 3D não está disponível neste dispositivo.',
      { recoverable: true },
    );
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(0, 0.5, 14);
  const controls = createControls(camera, renderer.domElement);
  controls.enableDamping = true;
  scene.add(new THREE.AmbientLight('#ffffff', 1.2));
  const light = new THREE.DirectionalLight('#ffffff', 1.5);
  light.position.set(5, 8, 8);
  scene.add(light);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.domElement.setAttribute('aria-hidden', 'true');
  element.append(renderer.domElement);

  const atlasRoot = new THREE.Group();
  atlasRoot.scale.setScalar(ATLAS_TRANSFORM.scale);
  atlasRoot.position.set(
    -ATLAS_TRANSFORM.center[0] * ATLAS_TRANSFORM.scale,
    -ATLAS_TRANSFORM.center[1] * ATLAS_TRANSFORM.scale,
    -ATLAS_TRANSFORM.center[2] * ATLAS_TRANSFORM.scale,
  );
  scene.add(atlasRoot);

  const groups = new Map();
  let pickable = [];
  let frameId = 0;
  let destroyed = false;
  let lastSelectedEntityId = null;
  let pointerStart = null;

  const report = (error) => {
    if (typeof onError === 'function') onError(error);
  };

  const disposeObject = (object) => object.traverse((child) => {
    if (!child.isMesh) return;
    child.geometry?.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    for (const material of materials) material?.dispose();
  });

  const ready = Promise.allSettled(
    Object.entries(LEGACY_OBJ_ASSETS).flatMap(([entityId, entry]) =>
      entry.assets.map(async ({ url }) => {
        try {
          const object = await loader.loadAsync(url);
          if (destroyed) {
            disposeObject(object);
            return;
          }
          let group = groups.get(entityId);
          if (!group) {
            group = new THREE.Group();
            group.userData.entityId = entityId;
            groups.set(entityId, group);
            atlasRoot.add(group);
          }
          object.traverse((child) => {
            if (!child.isMesh) return;
            const previousMaterial = child.material;
            child.material = new THREE.MeshLambertMaterial({ color: COLORS.base });
            const materials = Array.isArray(previousMaterial) ? previousMaterial : [previousMaterial];
            for (const material of materials) material?.dispose();
          });
          group.add(object);
        } catch {
          report(new NeuroAtlasError(
            ERROR_CODES.ASSET_LOAD_FAILED,
            'Uma estrutura 3D não pôde ser carregada.',
            { recoverable: true, details: { entityId, asset: url } },
          ));
        }
      }),
    ),
  ).then(() => {
    if (destroyed) return;
    pickable = collectPickableMeshes(groups);
    applyThreeState(groups, store.getState());
  });

  const resize = () => {
    const width = Math.max(element.clientWidth, 1);
    const height = Math.max(element.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const resizeObserver = createResizeObserver(resize);
  resizeObserver.observe(element);
  resize();

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const rememberPointer = (event) => {
    pointerStart = { x: event.clientX, y: event.clientY };
  };
  const selectFromPointer = (event) => {
    if (!pointerStart) return;
    const travel = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
    pointerStart = null;
    if (travel > 6) return;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(pickable, false)[0];
    commitPickedEntity(store, hit);
  };
  renderer.domElement.addEventListener('pointerdown', rememberPointer);
  renderer.domElement.addEventListener('pointerup', selectFromPointer);

  const renderState = (state) => {
    element.toggleAttribute('hidden', state.visualizationMode !== '3d');
    applyThreeState(groups, state);
    if (state.selectedEntityId && state.selectedEntityId !== lastSelectedEntityId) {
      applyCameraPreset(camera, controls, state.selectedEntityId);
    }
    lastSelectedEntityId = state.selectedEntityId;
  };
  renderState(store.getState());
  const unsubscribe = store.subscribe(renderState);

  const tick = () => {
    if (destroyed) return;
    controls.update();
    renderer.render(scene, camera);
    frameId = requestFrame(tick);
  };
  tick();

  return {
    ready,
    resetCamera() {
      camera.position.set(0, 0.5, 14);
      controls.target.set(0, 0, 0);
      controls.update();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cancelFrame(frameId);
      unsubscribe();
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', rememberPointer);
      renderer.domElement.removeEventListener('pointerup', selectFromPointer);
      controls.dispose();
      for (const group of groups.values()) {
        group.traverse((object) => {
          if (!object.isMesh) return;
          object.geometry.dispose();
          object.material.dispose();
        });
      }
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
```

- [ ] **Step 5: Executar testes sem WebGL real**

Run:

```powershell
rtk npm run test:neuroatlas -- three-renderer.test.js
```

Expected: PASS.

- [ ] **Step 6: Executar scan de dependências proibidas**

Run:

```powershell
rtk rg -n "react|@react-three|drei|framer-motion|supabase|\.php" src/features/neuroatlas -g '*.js'
```

Expected: nenhuma saída.

- [ ] **Step 7: Commitar renderer 3D**

Run:

```powershell
rtk git add src/features/neuroatlas/three-renderer.js src/features/neuroatlas/three-renderer.test.js
rtk git commit -m "feat(neuro): add direct Three.js renderer"
```

---

### Task 7: Shell, painel, controles e API pública

**Files:**
- Create: `src/features/neuroatlas/shell.js`
- Create: `src/features/neuroatlas/create-neuroatlas.js`
- Create: `src/features/neuroatlas/index.js`
- Create: `src/features/neuroatlas/neuroatlas.css`
- Test: `src/features/neuroatlas/create-neuroatlas.test.js`

**Interfaces:**
- Consumes: store, conteúdo e dois renderers.
- Produces: única API pública `createNeuroAtlas(options)` e DOM com test IDs estáveis.

- [ ] **Step 1: Escrever integração com renderers falsos**

Create `src/features/neuroatlas/create-neuroatlas.test.js`:

```js
import { describe, expect, it, vi } from 'vitest';
import { ERROR_CODES, NeuroAtlasError } from './errors.js';
import { createNeuroAtlasWithDependencies } from './create-neuroatlas.js';

function fakeRenderer() {
  return { ready: Promise.resolve(), destroy: vi.fn(), resetCamera: vi.fn() };
}

function connectedHost() {
  const element = document.createElement('div');
  document.body.append(element);
  return element;
}

describe('createNeuroAtlas', () => {
  it('executa o fluxo normativo e preserva o painel entre modos', async () => {
    const element = connectedHost();
    const runtime = createNeuroAtlasWithDependencies(
      { element },
      {
        createThreeRenderer: () => fakeRenderer(),
        createSvgRenderer: () => fakeRenderer(),
      },
    );
    await runtime.ready;
    runtime.instance.setState({ selectedEntityId: 'anat.hippocampus' });
    element.querySelector('[data-testid="mode-25d"]').click();
    element.querySelector('[data-testid="open-ptsd"]').click();
    element.querySelector('[data-testid="mode-3d"]').click();
    expect(runtime.instance.getState()).toMatchObject({
      visualizationMode: '3d',
      selectedEntityId: 'anat.hippocampus',
      selectedConditionId: 'clinical.ptsd',
      selectedCircuitId: 'circuit.threat-context-regulation',
    });
    expect(element.querySelector('[data-testid="knowledge-panel"]').textContent).toContain('Limites da evidência');
    expect(element.querySelector('[data-circuit-alternative]').textContent).toContain(
      'Amígdala, Hipocampo e Córtex pré-frontal',
    );
    runtime.instance.setState({ selectedEntityId: 'anat.prefrontal' });
    expect(element.querySelector('[data-testid="knowledge-panel"]').textContent).toContain(
      'não demarca vmPFC',
    );
    expect(Object.keys(runtime.instance).sort()).toEqual([
      'destroy', 'getState', 'setState', 'subscribe',
    ]);
    runtime.instance.destroy();
  });

  it('destrói shell, renderers e store sem deixar DOM', async () => {
    const element = connectedHost();
    const three = fakeRenderer();
    const svg = fakeRenderer();
    const runtime = createNeuroAtlasWithDependencies(
      { element },
      { createThreeRenderer: () => three, createSvgRenderer: () => svg },
    );
    await runtime.ready;
    runtime.instance.destroy();
    runtime.instance.destroy();
    expect(three.destroy).toHaveBeenCalledTimes(1);
    expect(svg.destroy).toHaveBeenCalledTimes(1);
    expect(element.children).toHaveLength(0);
  });

  it('falha antes de criar renderer quando o host está desconectado', () => {
    const onError = vi.fn();
    const createThreeRenderer = vi.fn();
    expect(() => createNeuroAtlasWithDependencies(
      { element: document.createElement('div'), onError },
      { createThreeRenderer, createSvgRenderer: vi.fn() },
    )).toThrowError(expect.objectContaining({ code: ERROR_CODES.HOST_INVALID }));
    expect(onError.mock.calls[0][0].code).toBe(ERROR_CODES.HOST_INVALID);
    expect(createThreeRenderer).not.toHaveBeenCalled();
  });

  it('degrada WebGL, mantém texto/SVG e permite tentar 3D novamente', async () => {
    const element = connectedHost();
    const onError = vi.fn();
    const createThreeRenderer = vi.fn()
      .mockImplementationOnce(() => {
        throw new NeuroAtlasError(
          ERROR_CODES.WEBGL_UNAVAILABLE,
          'WebGL indisponível.',
          { recoverable: true },
        );
      })
      .mockImplementationOnce(() => fakeRenderer());
    const runtime = createNeuroAtlasWithDependencies(
      { element, onError },
      { createThreeRenderer, createSvgRenderer: () => fakeRenderer() },
    );
    await runtime.ready;
    expect(runtime.instance.getState()).toMatchObject({
      visualizationMode: '25d',
      status: 'degraded',
    });
    expect(onError.mock.calls[0][0].code).toBe(ERROR_CODES.WEBGL_UNAVAILABLE);
    element.querySelector('[data-testid="retry-3d"]').click();
    await vi.waitFor(() => expect(runtime.instance.getState().status).toBe('ready'));
    expect(createThreeRenderer).toHaveBeenCalledTimes(2);
    runtime.instance.destroy();
  });

  it.each([
    {
      name: 'asset',
      expectedCode: ERROR_CODES.ASSET_LOAD_FAILED,
      expectedStatus: 'degraded',
      createSvgRenderer: () => fakeRenderer(),
      createThreeRenderer: ({ onError }) => {
        onError(new NeuroAtlasError(
          ERROR_CODES.ASSET_LOAD_FAILED,
          'Asset indisponível.',
          { recoverable: true, details: { asset: '/models/test.obj' } },
        ));
        return fakeRenderer();
      },
    },
    {
      name: 'svg',
      expectedCode: ERROR_CODES.SVG_CONTRACT_INVALID,
      expectedStatus: 'error',
      createSvgRenderer: () => {
        throw new NeuroAtlasError(ERROR_CODES.SVG_CONTRACT_INVALID, 'SVG inválido.');
      },
      createThreeRenderer: () => fakeRenderer(),
    },
    {
      name: 'renderer',
      expectedCode: ERROR_CODES.RENDERER_INIT_FAILED,
      expectedStatus: 'degraded',
      createSvgRenderer: () => fakeRenderer(),
      createThreeRenderer: () => { throw new Error('init'); },
    },
  ])('normaliza falha de $name uma vez e preserva o fallback', async ({
    expectedCode,
    expectedStatus,
    createSvgRenderer,
    createThreeRenderer,
  }) => {
    const onError = vi.fn();
    const runtime = createNeuroAtlasWithDependencies(
      { element: connectedHost(), onError },
      { createSvgRenderer, createThreeRenderer },
    );
    await runtime.ready;
    expect(runtime.instance.getState().status).toBe(expectedStatus);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0].code).toBe(expectedCode);
    runtime.instance.destroy();
  });

  it('mantém duas instâncias montadas sem estado compartilhado', async () => {
    const first = createNeuroAtlasWithDependencies(
      { element: connectedHost() },
      { createThreeRenderer: () => fakeRenderer(), createSvgRenderer: () => fakeRenderer() },
    );
    const second = createNeuroAtlasWithDependencies(
      { element: connectedHost() },
      { createThreeRenderer: () => fakeRenderer(), createSvgRenderer: () => fakeRenderer() },
    );
    await Promise.all([first.ready, second.ready]);
    first.instance.setState({ selectedEntityId: 'anat.hippocampus' });
    expect(second.instance.getState().selectedEntityId).toBeNull();
    first.instance.destroy();
    second.instance.destroy();
  });
});
```

- [ ] **Step 2: Executar teste vermelho**

Run:

```powershell
rtk npm run test:neuroatlas -- create-neuroatlas.test.js
```

Expected: FAIL por módulos ausentes.

- [ ] **Step 3: Criar shell sem conteúdo clínico hardcoded**

`src/features/neuroatlas/shell.js` must export `createShell(element)`. Build only static labels and return exact element references:

```js
export function createShell(element) {
  element.innerHTML = `
    <section class="neuroatlas" data-testid="neuroatlas-root" data-mode="3d">
      <header class="neuroatlas__header">
        <div><p class="neuroatlas__eyebrow">Neuroanatomia, cognição e psicopatologia</p><h1>NeuroAtlas</h1></div>
        <div>
          <a href="/psicoeducacao">Voltar à Psicoeducação</a>
          <a href="?legacy=1" data-testid="legacy-link">Abrir laboratório anterior</a>
        </div>
      </header>
      <div class="neuroatlas__toolbar" aria-label="Controles do NeuroAtlas">
        <fieldset><legend>Visualização</legend>
          <button type="button" data-testid="mode-3d" aria-pressed="true">3D</button>
          <button type="button" data-testid="mode-25d" aria-pressed="false">2.5D</button>
        </fieldset>
        <button type="button" data-testid="reset-camera">Resetar câmera</button>
        <button type="button" data-testid="retry-3d" hidden>Tentar 3D novamente</button>
        <label><input type="checkbox" data-testid="toggle-labels" checked> Labels</label>
        <label><input type="checkbox" data-testid="toggle-connections" checked> Conexões</label>
      </div>
      <nav class="neuroatlas__entities" aria-label="Estruturas anatômicas">
        <button type="button" data-entity-button="anat.hippocampus" data-testid="entity-hippocampus">Hipocampo</button>
        <button type="button" data-entity-button="anat.amygdala" data-testid="entity-amygdala">Amígdala</button>
        <button type="button" data-entity-button="anat.prefrontal" data-testid="entity-prefrontal">Córtex pré-frontal</button>
      </nav>
      <div class="neuroatlas__workspace">
        <div class="neuroatlas__visualization">
          <div data-three-host></div>
          <div data-svg-host></div>
          <div class="neuroatlas__status" role="status" aria-live="polite" data-status></div>
        </div>
        <aside class="neuroatlas__panel" data-testid="knowledge-panel" aria-live="polite"></aside>
      </div>
    </section>`;
  return {
    root: element.querySelector('[data-testid="neuroatlas-root"]'),
    threeHost: element.querySelector('[data-three-host]'),
    svgHost: element.querySelector('[data-svg-host]'),
    panel: element.querySelector('[data-testid="knowledge-panel"]'),
    status: element.querySelector('[data-status]'),
    mode3d: element.querySelector('[data-testid="mode-3d"]'),
    mode25d: element.querySelector('[data-testid="mode-25d"]'),
    resetCamera: element.querySelector('[data-testid="reset-camera"]'),
    retry3d: element.querySelector('[data-testid="retry-3d"]'),
    labels: element.querySelector('[data-testid="toggle-labels"]'),
    connections: element.querySelector('[data-testid="toggle-connections"]'),
    entityButtons: [...element.querySelectorAll('[data-entity-button]')],
  };
}
```

- [ ] **Step 4: Implementar painel por `textContent` e ações exatas**

In `create-neuroatlas.js`, use helper functions that create nodes and assign all content with `textContent`. Required behavior:

```js
function renderPanel(panel, state) {
  panel.replaceChildren();
  const entity = state.selectedEntityId ? ENTITIES[state.selectedEntityId] : null;
  const title = document.createElement('h2');
  title.textContent = entity?.name ?? 'Escolha uma estrutura';
  const summary = document.createElement('p');
  summary.textContent = entity?.summary ?? 'Use o cérebro ou a lista textual para iniciar.';
  panel.append(title, summary);

  if (state.selectedEntityId === 'anat.hippocampus' && !state.selectedConditionId) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.testid = 'open-ptsd';
    button.textContent = 'Explorar relação com TEPT';
    panel.append(button);
  }

  if (state.selectedConditionId === 'clinical.ptsd') {
    const clinicalTitle = document.createElement('h3');
    clinicalTitle.textContent = PTSD_CONTENT.title;
    const clinicalSummary = document.createElement('p');
    clinicalSummary.textContent = PTSD_CONTENT.summary;
    const limitsTitle = document.createElement('h4');
    limitsTitle.textContent = 'Limites da evidência';
    const limits = document.createElement('ul');
    for (const text of PTSD_CONTENT.evidenceLimits) {
      const item = document.createElement('li');
      item.textContent = text;
      limits.append(item);
    }
    const nodeNote = PTSD_CONTENT.nodeNotes[state.selectedEntityId];
    const nodeText = document.createElement('p');
    nodeText.textContent = nodeNote?.text ?? '';
    const nodeLimit = document.createElement('p');
    nodeLimit.textContent = nodeNote ? `Limite específico: ${nodeNote.evidenceLimit}` : '';
    const circuitAlternative = document.createElement('p');
    circuitAlternative.dataset.circuitAlternative = '';
    circuitAlternative.textContent = PTSD_CIRCUIT.textAlternative;
    const sourcesTitle = document.createElement('h4');
    sourcesTitle.textContent = 'Fontes';
    const sources = document.createElement('ul');
    for (const sourceId of PTSD_CONTENT.sourceIds) {
      const source = SOURCES[sourceId];
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = source.url;
      link.textContent = `${source.title} (PMID ${source.pmid})`;
      link.rel = 'noreferrer';
      item.append(link);
      sources.append(item);
    }
    const close = document.createElement('button');
    close.type = 'button';
    close.dataset.testid = 'close-ptsd';
    close.textContent = 'Fechar relação com TEPT';
    panel.append(
      clinicalTitle,
      clinicalSummary,
      nodeText,
      nodeLimit,
      circuitAlternative,
      limitsTitle,
      limits,
      sourcesTitle,
      sources,
      close,
    );
  }
}
```

Delegate panel clicks to the panel container. `open-ptsd` must send one transaction with condition, circuit and `CIRCUIT_ENTITY_IDS`; `close-ptsd` must send one transaction with all three cleared.

- [ ] **Step 5: Implementar orchestration e fallback**

`createNeuroAtlasWithDependencies()` is a test seam and returns `{ instance, ready }`.
`createNeuroAtlas()` strips that seam and returns only the four methods in the
approved public contract. Implement `src/features/neuroatlas/create-neuroatlas.js`
with the imports below, the `renderPanel()` from Step 4, and this exact composition:

```js
import { CIRCUIT_ENTITY_IDS, createNeuroAtlasStore } from './state.js';
import { ENTITIES, PTSD_CIRCUIT, PTSD_CONTENT, SOURCES } from './content.js';
import { ERROR_CODES, NeuroAtlasError, toDiagnostic } from './errors.js';
import { createShell } from './shell.js';
import { createSvgRenderer } from './svg-renderer.js';
import { createThreeRenderer } from './three-renderer.js';

function asRendererError(error, code, message, recoverable) {
  if (error instanceof NeuroAtlasError) return error;
  return new NeuroAtlasError(code, message, { recoverable });
}

export function createNeuroAtlasWithDependencies(options, dependencies) {
  const { element, initialState = {}, onError } = options ?? {};
  const report = (error) => {
    const diagnostic = toDiagnostic(error);
    if (typeof onError === 'function') {
      try { onError(diagnostic); } catch { /* callback externo não controla o módulo */ }
    }
    return diagnostic;
  };

  if (typeof HTMLElement === 'undefined'
    || !(element instanceof HTMLElement)
    || !element.isConnected) {
    const error = new NeuroAtlasError(
      ERROR_CODES.HOST_INVALID,
      'O host do NeuroAtlas deve ser um HTMLElement conectado ao documento.',
    );
    report(error);
    throw error;
  }

  const store = createNeuroAtlasStore(initialState, { onError });
  const shell = createShell(element);
  let destroyed = false;
  let svg = null;
  let three = null;
  let pendingThree = null;
  let threeAttempt = 0;
  let fatalSvgError = false;
  let threeDegraded = false;
  const removeListeners = [];

  const listen = (target, eventName, listener) => {
    target.addEventListener(eventName, listener);
    removeListeners.push(() => target.removeEventListener(eventName, listener));
  };

  try {
    svg = dependencies.createSvgRenderer({
      element: shell.svgHost,
      store,
      circuit: PTSD_CIRCUIT,
    });
  } catch (error) {
    fatalSvgError = true;
    report(asRendererError(
      error,
      ERROR_CODES.SVG_CONTRACT_INVALID,
      'A vista 2.5D não pôde ser validada.',
      false,
    ));
    store.setLifecycleStatus('error');
  }

  const setFallbackState = () => {
    if (svg && store.getState().visualizationMode !== '25d') {
      store.setState({ visualizationMode: '25d' });
    }
    store.setLifecycleStatus(fatalSvgError ? 'error' : 'degraded');
  };

  const startThree = async () => {
    if (destroyed) return;
    const attempt = ++threeAttempt;
    const previousThree = three;
    threeDegraded = false;
    if (!fatalSvgError) store.setLifecycleStatus('booting');

    let candidate;
    try {
      candidate = dependencies.createThreeRenderer({
        element: shell.threeHost,
        store,
        onError(error) {
          if (destroyed || attempt !== threeAttempt) return;
          threeDegraded = true;
          report(error);
          store.setLifecycleStatus(fatalSvgError ? 'error' : 'degraded');
        },
      });
      pendingThree = candidate;
      await candidate.ready;
    } catch (error) {
      candidate?.destroy();
      if (destroyed || attempt !== threeAttempt) return;
      pendingThree = null;
      report(asRendererError(
        error,
        error instanceof NeuroAtlasError
          ? error.code
          : ERROR_CODES.RENDERER_INIT_FAILED,
        'A visualização 3D não pôde ser iniciada.',
        true,
      ));
      if (!previousThree) setFallbackState();
      else store.setLifecycleStatus(fatalSvgError ? 'error' : 'degraded');
      return;
    }

    if (destroyed || attempt !== threeAttempt) {
      candidate.destroy();
      return;
    }
    pendingThree = null;
    previousThree?.destroy();
    three = candidate;
    store.setLifecycleStatus(
      fatalSvgError ? 'error' : threeDegraded ? 'degraded' : 'ready',
    );
  };

  const render = (state) => {
    shell.root.dataset.mode = state.visualizationMode;
    shell.root.dataset.status = state.status;
    shell.mode3d.setAttribute('aria-pressed', String(state.visualizationMode === '3d'));
    shell.mode25d.setAttribute('aria-pressed', String(state.visualizationMode === '25d'));
    shell.mode3d.disabled = state.status === 'booting' || !three;
    shell.mode25d.disabled = !svg;
    shell.resetCamera.disabled = !three;
    shell.retry3d.toggleAttribute(
      'hidden',
      !(state.status === 'degraded' && state.visualizationMode === '25d'),
    );
    shell.labels.checked = state.showLabels;
    shell.connections.checked = state.showConnections;
    for (const button of shell.entityButtons) {
      const selected = button.dataset.entityButton === state.selectedEntityId;
      const highlighted = state.highlightedEntityIds.includes(button.dataset.entityButton);
      button.dataset.selected = String(selected);
      button.dataset.highlighted = String(highlighted);
      button.setAttribute('aria-pressed', String(selected));
    }
    shell.status.textContent = {
      booting: 'Preparando visualização 3D; texto e 2.5D continuam disponíveis.',
      ready: '',
      degraded: 'Modo reduzido ativo. O conteúdo textual permanece disponível.',
      error: 'Uma visualização falhou. Use a lista textual para continuar.',
    }[state.status];
    renderPanel(shell.panel, state);
  };

  listen(shell.mode3d, 'click', () => store.setState({ visualizationMode: '3d' }));
  listen(shell.mode25d, 'click', () => store.setState({ visualizationMode: '25d' }));
  listen(shell.resetCamera, 'click', () => three?.resetCamera());
  listen(shell.retry3d, 'click', () => { void startThree(); });
  listen(shell.labels, 'change', () => store.setState({ showLabels: shell.labels.checked }));
  listen(shell.connections, 'change', () => store.setState({ showConnections: shell.connections.checked }));
  for (const button of shell.entityButtons) {
    listen(button, 'click', () => store.setState({
      selectedEntityId: button.dataset.entityButton,
    }));
  }
  listen(shell.panel, 'click', (event) => {
    const action = event.target.closest('button[data-testid]')?.dataset.testid;
    if (action === 'open-ptsd' && store.getState().selectedEntityId === 'anat.hippocampus') {
      store.setState({
        selectedConditionId: 'clinical.ptsd',
        selectedCircuitId: 'circuit.threat-context-regulation',
        highlightedEntityIds: CIRCUIT_ENTITY_IDS,
      });
    }
    if (action === 'close-ptsd') {
      store.setState({
        selectedConditionId: null,
        selectedCircuitId: null,
        highlightedEntityIds: [],
      });
    }
  });

  const unsubscribe = store.subscribe(render);
  render(store.getState());
  const ready = startThree();

  const instance = Object.freeze({
    getState: () => store.getState(),
    setState: (patch) => store.setState(patch),
    subscribe: (listener) => store.subscribe(listener),
    destroy() {
      if (destroyed) return;
      destroyed = true;
      threeAttempt += 1;
      unsubscribe();
      for (const removeListener of removeListeners) removeListener();
      pendingThree?.destroy();
      three?.destroy();
      svg?.destroy();
      store.destroy();
      element.replaceChildren();
    },
  });

  return Object.freeze({ instance, ready });
}

export function createNeuroAtlas(options) {
  const runtime = createNeuroAtlasWithDependencies(options, {
    createThreeRenderer,
    createSvgRenderer,
  });
  return runtime.instance;
}
```

Create `src/features/neuroatlas/index.js`:

```js
export { createNeuroAtlas } from './create-neuroatlas.js';
```

- [ ] **Step 6: Criar CSS responsivo e estados sem depender só de cor**

Create `src/features/neuroatlas/neuroatlas.css` with these required selectors and values:

```css
.neuroatlas { --na-bg: #07111f; --na-panel: #0f1f32; --na-text: #f8fafc; --na-muted: #b6c2d1; --na-focus: #f59e0b; min-height: 100vh; padding: 1rem; color: var(--na-text); background: radial-gradient(circle at 20% 10%, #17304b, var(--na-bg) 55%); }
.neuroatlas *, .neuroatlas *::before, .neuroatlas *::after { box-sizing: border-box; }
.neuroatlas__header, .neuroatlas__toolbar, .neuroatlas__workspace, .neuroatlas__entities { width: min(100%, 1440px); margin-inline: auto; }
.neuroatlas__header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.neuroatlas__eyebrow { color: var(--na-muted); }
.neuroatlas__toolbar, .neuroatlas__entities { display: flex; flex-wrap: wrap; gap: .75rem; padding-block: 1rem; }
.neuroatlas button, .neuroatlas a { min-width: 44px; min-height: 44px; }
.neuroatlas button:focus-visible, .neuroatlas a:focus-visible, .neuroatlas [data-entity-id]:focus-visible { outline: 3px solid var(--na-focus); outline-offset: 3px; }
.neuroatlas [data-entity-button][data-highlighted="true"] { border-style: dashed; font-weight: 700; }
.neuroatlas [data-entity-button][data-selected="true"] { outline: 3px double var(--na-focus); outline-offset: 2px; }
.neuroatlas__workspace { display: grid; grid-template-columns: minmax(0, 1fr) minmax(360px, 420px); gap: 1rem; }
.neuroatlas__visualization { position: relative; min-height: 560px; overflow: hidden; border: 1px solid #29445f; border-radius: 1rem; background: #081522; }
.neuroatlas__visualization > [data-three-host], .neuroatlas__visualization > [data-svg-host] { position: absolute; inset: 0; }
.neuroatlas__visualization canvas, .neuroatlas__visualization svg { width: 100%; height: 100%; display: block; }
.neuroatlas__panel { min-width: 0; padding: 1rem; border-radius: 1rem; background: var(--na-panel); }
.neuroatlas__status { position: absolute; inset: auto 1rem 1rem; z-index: 2; }
.na-brain-silhouette { fill: #172b3d; stroke: #7890a5; stroke-width: 8; }
.neuroatlas .na-hit-target { fill: transparent; stroke: transparent; pointer-events: all; }
.neuroatlas [data-entity-id] { fill: #94a3b8; stroke: #0f172a; stroke-width: 8; cursor: pointer; }
.neuroatlas [data-entity-id][data-highlighted="true"] { fill: #38bdf8; stroke-dasharray: 14 8; }
.neuroatlas [data-entity-id][data-selected="true"] { fill: #f59e0b; stroke: #fff7d6; stroke-width: 12; }
.neuroatlas [data-circuit-edge] { stroke: #38bdf8; stroke-width: 8; stroke-dasharray: 18 10; }
.neuroatlas [hidden] { display: none !important; }
@media (max-width: 760px) { .neuroatlas__header { align-items: flex-start; flex-direction: column; } .neuroatlas__workspace { grid-template-columns: 1fr; } .neuroatlas__visualization { min-height: 360px; } .neuroatlas__panel { min-width: 0; } }
@media (prefers-reduced-motion: reduce) { .neuroatlas *, .neuroatlas *::before, .neuroatlas *::after { scroll-behavior: auto !important; animation-duration: .1ms !important; transition-duration: .1ms !important; } }
```

- [ ] **Step 7: Executar integração e suíte do módulo**

Run:

```powershell
rtk npm run test:neuroatlas -- create-neuroatlas.test.js
rtk npm run test:neuroatlas
rtk npm exec eslint -- src/features/neuroatlas
```

Expected: PASS.

- [ ] **Step 8: Commitar API e shell**

Run:

```powershell
rtk git add src/features/neuroatlas/shell.js src/features/neuroatlas/create-neuroatlas.js src/features/neuroatlas/index.js src/features/neuroatlas/neuroatlas.css src/features/neuroatlas/create-neuroatlas.test.js
rtk git commit -m "feat(neuro): expose synchronized vanilla module"
```

---

### Task 8: Migrate da rota com fallback legado reversível

**Files:**
- Move: `src/pages/Neuroanatomia3D.tsx` → `src/pages/NeuroanatomiaLegacy.tsx`
- Create: `src/pages/Neuroanatomia3D.tsx`
- Modify: `index.html`
- Do not modify: `src/App.tsx`

**Interfaces:**
- Consumes: `createNeuroAtlas()` e rota já importando `Neuroanatomia3D.tsx`.
- Produces: novo slice como default; laboratório anterior em `?legacy=1`.

- [ ] **Step 1: Verificar origem e destino do movimento**

Run:

```powershell
rtk powershell.exe -NoProfile -Command "Resolve-Path -LiteralPath 'src/pages/Neuroanatomia3D.tsx' | Format-List Path"
rtk powershell.exe -NoProfile -Command "Test-Path -LiteralPath 'src/pages/NeuroanatomiaLegacy.tsx'"
```

Expected: origem dentro do workspace; destino `False`.

- [ ] **Step 2: Mover mecanicamente o baseline commitado**

Run:

```powershell
rtk powershell.exe -NoProfile -Command "Move-Item -LiteralPath 'src/pages/Neuroanatomia3D.tsx' -Destination 'src/pages/NeuroanatomiaLegacy.tsx'"
```

Expected: conteúdo integral preservado em `NeuroanatomiaLegacy.tsx`.

- [ ] **Step 3: Criar o host fino no caminho original**

Create `src/pages/Neuroanatomia3D.tsx`:

```tsx
import { useEffect, useRef } from 'react';
import { createNeuroAtlas } from '@/features/neuroatlas/index.js';
import '@/features/neuroatlas/neuroatlas.css';
import NeuroanatomiaLegacy from './NeuroanatomiaLegacy';

export default function Neuroanatomia3D() {
  const hostRef = useRef<HTMLDivElement>(null);
  const showLegacy = new URLSearchParams(window.location.search).get('legacy') === '1';

  useEffect(() => {
    if (showLegacy || !hostRef.current) return;
    const instance = createNeuroAtlas({
      element: hostRef.current,
      onError(diagnostic) {
        console.warn('[NeuroAtlas]', diagnostic.code, diagnostic.message);
      },
    });
    return () => instance.destroy();
  }, [showLegacy]);

  if (showLegacy) return <NeuroanatomiaLegacy />;

  return (
    <main id="main">
      <div ref={hostRef} />
    </main>
  );
}
```

- [ ] **Step 4: Colocar o fallback sem JavaScript no HTML realmente estático**

Replace `<div id="root"></div>` in `index.html` with:

```html
<div id="root">
  <noscript>
    <main id="main">
      <section aria-labelledby="neuroatlas-noscript-title">
        <h1 id="neuroatlas-noscript-title">NeuroAtlas</h1>
        <p>O NeuroAtlas apresenta conteúdos educativos sobre neuroanatomia; a visualização interativa requer JavaScript.</p>
        <a href="/?/psicoeducacao">Voltar à Psicoeducação</a>
      </section>
    </main>
  </noscript>
</div>
```

This location is required because JSX does not mount at all when JavaScript is disabled. With JavaScript enabled, React replaces the fallback normally.

- [ ] **Step 5: Confirmar que `App.tsx` não mudou**

Run:

```powershell
rtk git diff -- src/App.tsx
rtk rg -n "Neuroanatomia3D|/psicoeducacao/neuroanatomia" src/App.tsx
```

Expected: o diff mostra somente mudanças locais preexistentes, nenhuma alteração desta task; import e rota continuam apontando ao caminho original.

- [ ] **Step 6: Executar typecheck, unit tests e build**

Run:

```powershell
rtk npm run typecheck
rtk npm run test
rtk npm run build
```

Expected: testes e build PASS. O typecheck segue a regra do gate externo: sem erros é PASS; somente os dez erros Hogwarts conhecidos mantêm o trabalho executável, mas impedem a conclusão final; qualquer outro erro bloqueia esta task.

- [ ] **Step 7: Commitar expand/migrate sem contract**

Run:

```powershell
rtk git add index.html src/pages/Neuroanatomia3D.tsx src/pages/NeuroanatomiaLegacy.tsx
rtk git diff --cached --name-status
rtk git commit -m "feat(neuro): mount vanilla slice with legacy fallback"
```

Expected: Git reconhece rename/cópia e host; `src/App.tsx` não entra.

---

### Task 9: Fluxo real, mobile, teclado e fallback WebGL

**Files:**
- Create: `tests/e2e/neuroatlas.spec.js`

**Interfaces:**
- Consumes: rota real e test IDs definidos na Task 7.
- Produces: evidência browser dos AC-N-012, AC-N-015–018 e fallback.

- [ ] **Step 1: Criar o teste normativo e de persistência entre renderers**

Create `tests/e2e/neuroatlas.spec.js`:

```js
import { expect, test } from '@playwright/test';

test('fluxo Hipocampo 3D → 2.5D → TEPT → 3D preserva estado', async ({ page }) => {
  await page.goto('/psicoeducacao/neuroanatomia');
  const root = page.getByTestId('neuroatlas-root');
  await expect(root).toHaveAttribute('data-mode', '3d');
  await page.getByTestId('entity-hippocampus').click();
  await page.getByTestId('mode-25d').click();
  await expect(root).toHaveAttribute('data-mode', '25d');
  await expect(page.locator('[data-entity-id="anat.hippocampus"]')).toHaveAttribute('data-selected', 'true');
  await page.getByTestId('open-ptsd').click();
  await expect(page.locator('[data-circuit-legend]')).toBeVisible();
  await page.getByTestId('mode-3d').click();
  await expect(root).toHaveAttribute('data-mode', '3d');
  await expect(page.getByTestId('knowledge-panel')).toContainText('Limites da evidência');
  await expect(page.getByTestId('knowledge-panel')).toContainText('não permitem diagnosticar uma pessoa');
});

test('fluxo principal funciona por teclado', async ({ page }) => {
  await page.goto('/psicoeducacao/neuroanatomia');
  await page.getByTestId('entity-hippocampus').focus();
  await page.keyboard.press('Enter');
  await page.getByTestId('mode-25d').focus();
  await page.keyboard.press('Enter');
  await page.getByTestId('open-ptsd').focus();
  await page.keyboard.press('Enter');
  await page.getByTestId('mode-3d').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('knowledge-panel')).toContainText('TEPT: ameaça, contexto e regulação');
});

test('mobile 390×844 não possui overflow horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/psicoeducacao/neuroanatomia');
  await expect(page.getByTestId('mode-3d')).toBeVisible();
  for (const id of ['entity-hippocampus', 'entity-amygdala', 'entity-prefrontal']) {
    await expect(page.getByTestId(id)).toBeVisible();
  }
  await page.getByTestId('entity-hippocampus').click();
  await expect(page.getByTestId('open-ptsd')).toBeVisible();
  await page.getByTestId('open-ptsd').click();
  await expect(page.getByTestId('knowledge-panel')).toContainText('Limites da evidência');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test('reduced motion não mantém animação CSS contínua', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/psicoeducacao/neuroanatomia');
  const duration = await page.getByTestId('neuroatlas-root').evaluate((node) =>
    getComputedStyle(node).transitionDuration,
  );
  expect(['0s', '0.0001s']).toContain(duration);
});

test('WebGL indisponível degrada para 2.5D e mantém conteúdo', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function getContext(type, ...args) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
      return original.call(this, type, ...args);
    };
  });
  await page.goto('/psicoeducacao/neuroanatomia');
  await expect(page.getByTestId('neuroatlas-root')).toHaveAttribute('data-mode', '25d');
  await expect(page.getByTestId('retry-3d')).toBeVisible();
  await page.getByTestId('entity-hippocampus').click();
  await expect(page.getByTestId('open-ptsd')).toBeVisible();
});

test('fallback legado continua acessível', async ({ page }) => {
  await page.goto('/psicoeducacao/neuroanatomia?legacy=1');
  await expect(page.getByRole('heading', { name: 'Neuroanatomia', exact: true })).toBeVisible();
});
```

- [ ] **Step 2: Executar E2E e corrigir somente o contrato observado**

Run:

```powershell
rtk npm run test:e2e:neuroatlas
```

Expected: seis testes PASS; o seletor legado usa o `h1` real e estável já auditado na página atual.

- [ ] **Step 3: Commitar E2E**

Run:

```powershell
rtk git add tests/e2e/neuroatlas.spec.js
rtk git commit -m "test(neuro): cover synchronized browser flow"
```

---

### Acceptance coverage checkpoint

Before Task 10, confirm every approved criterion has the evidence below. A blank,
skipped or failing row makes the slice `FAIL`; it is not converted into follow-up debt.

| Criterion | Required evidence |
|---|---|
| `AC-N-001` | `state.test.js` mode-only transaction plus normative Playwright flow. |
| `AC-N-002` | Store canonical-order test, content edge test and SVG three-edge test. |
| `AC-N-003` | Transactional unknown-ID/invalid-combination store tests. |
| `AC-N-004` | Store, SVG, Three and composed-instance idempotent destroy tests/review. |
| `AC-N-005` | Two connected composed instances in `create-neuroatlas.test.js`. |
| `AC-N-006` | Initial-state and public-patch status rejection test. |
| `AC-N-007` | Immutable one-notification test plus idempotent unsubscribe. |
| `AC-N-008` | Stable-code tests for all ten codes across store, SVG and composition. |
| `AC-N-009` | Eight-asset content test, checker and loader iteration over the closed map. |
| `AC-N-010` | Three pick adapter test and SVG click/keyboard test resolve the same ID. |
| `AC-N-011` | Pure Three projection and SVG circuit tests consume `CIRCUIT_ENTITY_IDS`. |
| `AC-N-012` | Forced WebGL composition test and forced-WebGL Playwright flow. |
| `AC-N-013` | Forbidden-import scans in Tasks 6 and 10. |
| `AC-N-014` | Expanded `check-neuro-models` run in Tasks 4 and 10. |
| `AC-N-015` | Composed integration test and normative Playwright flow. |
| `AC-N-016` | Keyboard-only Playwright flow. |
| `AC-N-017` | `390×844` Playwright flow plus SVG hit-target assertion. |
| `AC-N-018` | Reduced-motion Playwright assertion and CSS media rule. |
| `AC-N-019` | Per-block source, evidence-limit and review-date content tests. |
| `AC-N-020` | Canonical PubMed URL resolution and source metadata tests. |
| `AC-N-021` | Serialized-content prohibited-claim scan. |
| `AC-N-022` | Prefrontal node-note assertion in the accessible knowledge panel. |
| `AC-N-023` | SVG legend test and always-accessible panel alternative. |
| `AC-N-024` | Explicit path staging, protected hashes and final status review. |
| `AC-N-025` | Global model checker exit `0`. |
| `AC-N-026` | State, content, SVG, Three and composition unit suites. |
| `AC-N-027` | Normative composition test, failure matrix and browser fallback. |
| `AC-N-028` | Full `verify:neuroatlas` exit `0`; protected Hogwarts failures mean `FAIL`. |

---

### Task 10: Auditoria final, QA visual e handoff

**Files:**
- Verify: all files from Tasks 1–9
- Do not modify: `docs/specs/NEUROATLAS_VERTICAL_SLICE_SPEC.md`; qualquer divergência de evidência bloqueia a execução e volta para decisão do usuário.

**Interfaces:**
- Consumes: implementação completa e commits separados.
- Produces: evidência requisito por requisito; nenhum contract/delete do legado.

- [ ] **Step 1: Executar o gate automatizado completo**

Run:

```powershell
rtk npm run verify:neuroatlas
```

Expected: higiene, modelos, lint, typecheck, unitários, E2E e build todos exit `0`.

- [ ] **Step 2: Provar ausência de dependências estruturais proibidas**

Run:

```powershell
rtk rg -n "react|@react-three|drei|framer-motion|supabase|\.php" src/features/neuroatlas -g '*.js'
rtk rg -n -F "'context'" src/components/3d/BrainModel.tsx src/pages/NeuroanatomiaLegacy.tsx src/content/neuroanatomia.ts
rtk rg -n -F '"context"' src/components/3d/BrainModel.tsx src/pages/NeuroanatomiaLegacy.tsx src/content/neuroanatomia.ts
```

Expected: os três comandos sem saída.

- [ ] **Step 3: Provar whitelist e rotas**

Run:

```powershell
rtk npm run check:neuro-models
rtk rg -n "Neuroanatomia3D|/psicoeducacao/neuroanatomia" src/App.tsx
rtk rg -n "legacy=1|createNeuroAtlas" src/pages/Neuroanatomia3D.tsx
```

Expected: oito assets canônicos; rota original intacta; host contém API e rollback.

- [ ] **Step 4: Inspecionar desktop e mobile**

Usar o browser local em:

```text
http://127.0.0.1:5173/psicoeducacao/neuroanatomia
```

Validar manualmente:

```text
1440×900: visualização e painel lado a lado, nenhum controle cobre seleção.
390×844: visualização mínima 360 px, painel abaixo, sem overflow horizontal.
3D: orbit, zoom, seleção e reset funcionam.
2.5D: três grupos, labels e linhas aparecem conforme estado.
TEPT: copy, limites e fontes ficam legíveis.
?legacy=1: experiência anterior abre sem regressão observável.
```

- [ ] **Step 5: Revisar diff e status sem absorver trabalho alheio**

Run:

```powershell
rtk git diff --check
rtk git status --short --branch
rtk git log --oneline -10
```

Expected: nenhuma mudança do plano sem commit; mudanças locais alheias continuam separadas. Não usar árvore limpa como requisito porque o usuário possui trabalho paralelo protegido.

- [ ] **Step 6: Produzir handoff completo**

O handoff deve registrar `TASK: NEUROATLAS-VERTICAL-SLICE-001`, o status real,
a spec `0.3 APPROVED`, cada hash e mensagem realmente criados, cada comando com
exit code e contagem de testes, o resultado do QA manual nos seis cenários e o
`git status` filtrado das mudanças locais fora do escopo. O rollback documentado
é: abrir `?legacy=1` imediatamente e, se necessário, aplicar `git revert` aos
hashes reais do slice em ordem inversa. Não reverter o checkpoint baseline nem a
limpeza sem decisão separada. Registrar também que remover o legado fica adiado
até um plano de paridade completa e que o próximo trabalho é especificar as
demais ondas de migração para PHP + HTML + CSS + JS.

Não declarar o objetivo global concluído: este plano valida somente o primeiro módulo arquitetônico e mantém a migração total ativa.
