# Repository Quality Recovery — Implementation Plan

> **Execution contract:** use `test-driven-development` for every behavioral correction, `executing-plans` while applying the tasks, and `verification-before-completion` before the final commit. The user explicitly selected one integrated patch and one commit, so the usual intermediate-commit cadence does not apply.

**Plan ID:** `PLAN-REPOSITORY-QUALITY-RECOVERY-001`
**Status:** `APPROVED`
**Date:** `2026-08-24`
**Approval:** explicit user confirmation on `2026-08-24`.
**Approval gate:** passed; implementation is authorized under this plan.

**Goal:** Finish the approved safe cleanup, remove the canceled Hogwarts experience, establish independent quality ownership for `video/`, and reduce every authorized lint/typecheck failure to zero without suppressions or unrelated product changes.

**Architecture:** The root Vite application owns all root TypeScript/React source and excludes the independent Remotion package from its ESLint traversal. `video/` owns a local flat ESLint configuration, manifest dependencies, lint script, and strict typecheck script. Behavioral lint fixes move render-time side effects into stable initialization, user events, asynchronous callbacks, or explicit lifecycle cleanup. Pure helpers receive focused Node/Vitest coverage. The entire result is staged and committed once, only after all acceptance gates pass.

**Tech stack:** React 19, TypeScript 6 in the root, TypeScript 5.9 in `video/`, ESLint 10 flat config, `typescript-eslint`, React Hooks ESLint, Three.js, React Three Fiber, Remotion, Vitest 3, Vite 8, PowerShell, Git.

**Approved spec:** `docs/specs/REPOSITORY_QUALITY_RECOVERY_SPEC.md` version `0.1`, status `APPROVED`.

---

## Global execution rules

1. Run every terminal command through `rtk`.
2. Use `apply_patch` for text edits and text-file deletions.
3. Do not run `git reset`, destructive checkout, broad cleanup, recursive delete, globbed delete, or `git add -A`.
4. Preserve `.claude/settings.local.json`, `public/scenes/`, `docs/cenarios-modos-prompts.md`, and unrelated user changes.
5. Do not add lint/TypeScript suppression directives or ignore source files to get PASS.
6. Do not create intermediate commits. The only commit is Task 11.
7. If a step exposes a product/clinical/persistence contract change not fixed by the approved spec, stop with `CONFLICT DETECTED`.
8. A test that initially fails for the expected missing behavior is RED. A test that crashes for environment or import reasons is not valid RED.
9. After each task, run the narrowest relevant lint/typecheck/test command. Do not wait until the end to discover cross-task regressions.
10. No push, deploy, PR, credential creation, paid service, or external account action is authorized.

## Task 1: Freeze the recoverable baseline

**Files:**

- Inspect only: entire worktree and index
- Protect: `.claude/settings.local.json`
- Protect: `public/scenes/**`
- Protect: `docs/cenarios-modos-prompts.md`

### Step 1: Confirm branch and capture both unstaged and staged state

Run:

```powershell
rtk git branch --show-current
rtk git status --short
rtk git diff --name-status
rtk git diff --cached --name-status
rtk git diff --check
rtk git diff --cached --check
```

Expected:

- branch `codex/cleanup-neuroatlas-slice` unless the user intentionally changed it;
- the 310 approved tracked deletions remain staged;
- unrelated user modifications remain present;
- no whitespace error introduced by the current task documents.

If the branch or staged deletion set differs, stop and re-audit rather than normalizing it.

### Step 2: Record protected-item hashes

Run an explicit hash command over:

```text
docs/cenarios-modos-prompts.md
public/scenes/s0/l1-sky.png
public/scenes/s0/l2-glow.png
public/scenes/s0/l3-mid.png
public/scenes/s0/l6-hero.png
public/scenes/s0/l7-close.png
public/scenes/s0/split-src.png
public/scenes/s1/l1-sky.png
public/scenes/s1/l2-glow.png
```

Command:

```powershell
rtk git hash-object docs/cenarios-modos-prompts.md public/scenes/s0/l1-sky.png public/scenes/s0/l2-glow.png public/scenes/s0/l3-mid.png public/scenes/s0/l6-hero.png public/scenes/s0/l7-close.png public/scenes/s0/split-src.png public/scenes/s1/l1-sky.png public/scenes/s1/l2-glow.png
```

Store the output in the execution notes, not in a generated repository file.

### Step 3: Reconfirm the failing baseline

Run:

```powershell
rtk npm run lint
rtk npm exec tsc -- --project tsconfig.app.json --noEmit --pretty false
rtk npm test -- --run
rtk npm run check:repo-hygiene
rtk npm run check:neuro-models
```

Expected baseline:

- global root lint: 74 errors and 1 warning before removing Hogwarts and separating `video/`;
- root typecheck: only the ten Hogwarts errors;
- tests: 65 passing;
- repository hygiene: PASS;
- Neuro models: PASS with 62 references, 4 required pairs, and 83 models.

If Vitest fails only because the sandbox cannot traverse the parent directory, rerun the same test command with the previously approved elevated execution. Do not change Vitest configuration to mask the environment issue.

### Step 4: Reconfirm `video/` independently

Run inside `video/`:

```powershell
rtk npm exec tsc -- --project tsconfig.json --noEmit --pretty false
```

Expected: PASS before changes.

## Task 2: Remove exactly the canceled Hogwarts package

**Files:**

- Modify: `src/App.tsx`
- Delete: `download.cjs`
- Delete: `src/components/HogwartsCrestInteractive.tsx`
- Delete: `src/hooks/useCinematicScroll.ts`
- Delete: `src/pages/ModosEsquemaCinema.tsx`
- Delete: `src/pages/GryffindorStory.tsx`
- Delete: `src/pages/HufflepuffStory.tsx`
- Delete: `src/pages/RavenclawStory.tsx`
- Delete: `src/pages/SlytherinStory.tsx`
- Delete: `src/styles/CinemaScroll.css`
- Delete: `src/styles/CrestInteractive.css`
- Delete: `src/styles/HouseStory.css`
- Delete: ten explicitly listed `public/` assets from the approved spec
- Preserve: `public/scenes/**`
- Preserve: `docs/cenarios-modos-prompts.md`

### Step 1: Revalidate the allowlist and consumers

Run:

```powershell
rtk git status --short -- src/App.tsx download.cjs public src/components/HogwartsCrestInteractive.tsx src/hooks/useCinematicScroll.ts src/pages/ModosEsquemaCinema.tsx src/pages/GryffindorStory.tsx src/pages/HufflepuffStory.tsx src/pages/RavenclawStory.tsx src/pages/SlytherinStory.tsx src/styles/CinemaScroll.css src/styles/CrestInteractive.css src/styles/HouseStory.css
rtk rg -n "HogwartsCrestInteractive|useCinematicScroll|ModosEsquemaCinema|GryffindorStory|HufflepuffStory|RavenclawStory|SlytherinStory|/psicoeducacao/modos-cinema" src
```

Expected: operational consumers are limited to the five imports/routes in `src/App.tsx` and the allowlisted package itself.

### Step 2: Edit `src/App.tsx` surgically

Use `apply_patch` to remove only:

- five imports at the current Hogwarts import block;
- five `<Route>` entries for `/psicoeducacao/modos-cinema` and the four houses.

Do not reformat the route table. Confirm that `path="*"` still redirects to `/`.

### Step 3: Delete the eleven text files with `apply_patch`

Delete only the text files listed under Task 2. Do not delete a directory.

### Step 4: Resolve and delete the ten binary/static assets literally

First confirm that every resolved absolute path is inside the workspace and equals one of these targets:

```text
public/gryffindor-bg.jpg
public/hogwarts-bg.jpg
public/hogwarts-crest.svg
public/hufflepuff-bg.jpg
public/luggage.jpg
public/luggage.svg
public/ravenclaw-bg.jpg
public/slytherin-bg.jpg
public/train.jpg
public/train.svg
```

Then use PowerShell `Remove-Item -LiteralPath` with the ten explicit absolute paths. Do not use variables, globs, `-Recurse`, or a computed parent path.

### Step 5: Prove removal and preservation

Run:

```powershell
rtk rg -n "HogwartsCrestInteractive|useCinematicScroll|ModosEsquemaCinema|GryffindorStory|HufflepuffStory|RavenclawStory|SlytherinStory|/psicoeducacao/modos-cinema|hogwarts-bg|hogwarts-crest|gryffindor-bg|hufflepuff-bg|ravenclaw-bg|slytherin-bg" src public
rtk git hash-object docs/cenarios-modos-prompts.md public/scenes/s0/l1-sky.png public/scenes/s0/l2-glow.png public/scenes/s0/l3-mid.png public/scenes/s0/l6-hero.png public/scenes/s0/l7-close.png public/scenes/s0/split-src.png public/scenes/s1/l1-sky.png public/scenes/s1/l2-glow.png
rtk npm exec tsc -- --project tsconfig.app.json --noEmit --pretty false
```

Expected:

- no operational Hogwarts match under `src` or `public`;
- protected hashes exactly match Task 1;
- root typecheck becomes PASS. Any remaining type error is now a patch regression or a stale baseline and must be diagnosed.

## Task 3: Establish independent root and `video/` quality gates

**Files:**

- Modify: `eslint.config.js`
- Modify: `video/package.json`
- Modify: `video/package-lock.json`
- Create: `video/eslint.config.mjs`

### Step 1: Make the root ownership explicit

Update the root flat config so its global ignores are exactly the existing build output plus the package boundary:

```js
globalIgnores(['dist', 'video/**'])
```

Do not add any source file or error-producing directory to the ignore list.

### Step 2: Add local quality dependencies to `video/`

Inside `video/`, install versions compatible with and aligned to the currently installed root toolchain:

```powershell
rtk npm install --save-dev eslint@^10.3.0 @eslint/js@^10.0.1 typescript-eslint@^8.59.2 eslint-plugin-react-hooks@^7.1.1 globals@^17.6.0
```

This command must update only `video/package.json`, `video/package-lock.json`, and local `video/node_modules`. Preserve all existing Remotion/Three dependencies already present in the manifest.

If network or sandbox restrictions block the install, request the narrowly scoped approval for this exact `npm install`; do not reuse root dependencies silently.

### Step 3: Add package-local scripts

Add to `video/package.json`:

```json
"lint": "eslint .",
"typecheck": "tsc --project tsconfig.json --noEmit --pretty false"
```

Preserve `dev` and `render:piloto` exactly.

### Step 4: Create `video/eslint.config.mjs`

Use flat config with:

- `js.configs.recommended`;
- `tseslint.configs.recommended`;
- `reactHooks.configs.flat.recommended`;
- browser globals needed by Remotion;
- `files: ['src/**/*.{ts,tsx}']`;
- global ignores for `node_modules` and `out` only.

Do not include React Refresh because `video/` is Remotion, not the root Vite runtime. Do not import `../../eslint.config.js` or any root `node_modules` path.

### Step 5: Verify the boundary

Run at root:

```powershell
rtk npm run lint -- --max-warnings=0
```

Expected intermediate state: exactly the authorized root failures remain; no path begins with `video/`.

Run inside `video/`:

```powershell
rtk npm run lint -- --max-warnings=0
rtk npm run typecheck
```

Expected intermediate state:

- lint reports the known `BrainModelRemotion.tsx` and `NeuroLutaFuga.tsx` issues, plus any genuine package-local issue revealed by the correct config;
- typecheck passes.

## Task 4: Fix Three.js object ownership and typing with regression tests

**Files:**

- Create: `src/components/3d/brainModelGeometry.ts`
- Create: `src/components/3d/brainModelGeometry.test.ts`
- Modify: `src/components/3d/BrainModel.tsx`
- Modify: `src/pages/Neuroanatomia3D.tsx`
- Modify: `video/src/compositions/BrainModelRemotion.tsx`

### Step 1: Write the root geometry lifecycle tests

Create node-compatible Vitest tests proving that the new pure geometry helper:

1. clones source OBJ groups rather than mutating the loader cache;
2. replaces cloned mesh materials with `MeshLambertMaterial` instances;
3. returns the created materials explicitly with the combined group;
4. leaves non-mesh objects intact;
5. disposes every returned material through an explicit cleanup helper;
6. computes a stable label center when requested.

Run:

```powershell
rtk npm test -- --run src/components/3d/brainModelGeometry.test.ts
```

Expected RED: module/helper is not implemented yet.

### Step 2: Implement the root helper minimally

In `brainModelGeometry.ts`:

- accept typed `THREE.Group` inputs;
- traverse as `THREE.Object3D` and narrow with `child instanceof THREE.Mesh`;
- return `{ group, materials, labelCenter? }`;
- expose one disposal function;
- contain no React hooks and no global mutable cache.

Run the focused test and expect PASS.

### Step 3: Refactor `FullCortex` and `BrainPart`

In `BrainModel.tsx`:

- replace render-time mutation of `materialsRef` with the helper result returned by `useMemo`;
- dispose the exact prior material array in `useEffect` cleanup;
- let `useFrame` close over the current material array;
- replace OBJ and traverse `any` with Three.js types/narrowing;
- infer the `useFrame` state or type it with React Three Fiber's public type;
- type pointer/click handlers with `ThreeEvent`;
- keep actual scene/group refs only for frame/event access;
- create scratch `Color`/`Vector3` objects without reading `.current` during render;
- remove the obsolete exhaustive-deps suppression;
- replace the mutable lighting/spark default assignments with one derived visual-config object, preserving every branch value;
- preserve the existing `brainstem` ID and partial `flowAnchors` behavior.

Do not change model URLs, clinical content, camera targets, colors, interaction priority, or animation formulas.

### Step 4: Type the host page without changing its UI

In `Neuroanatomia3D.tsx`:

- store Error Boundary errors as `unknown` and render a safe `Error`/string representation;
- type `getDerivedStateFromError` as `unknown`;
- type the OrbitControls ref from the public component/type contract rather than `any`.

Preserve all unrelated local NeuroAtlas/brainstem changes already in the file.

### Step 5: Apply the same ownership principle inside `video/`

In `BrainModelRemotion.tsx`:

- define a local `BrainPartData` type for IDs, color, explode tuple, and URL list;
- remove all three `any` annotations;
- produce `{ group, materials }` in `useMemo` without touching a ref;
- dispose materials in `useEffect` cleanup;
- keep group refs for `useFrame` only;
- preserve frame-based opacity, emissive, pulse, explode positions, and render output.

Do not import the root helper: the package boundary must remain independent.

### Step 6: Verify the 3D task

Run:

```powershell
rtk npm test -- --run src/components/3d/brainModelGeometry.test.ts
rtk npx eslint src/components/3d/BrainModel.tsx src/components/3d/brainModelGeometry.ts src/components/3d/brainModelGeometry.test.ts src/pages/Neuroanatomia3D.tsx --max-warnings=0
rtk npm exec tsc -- --project tsconfig.app.json --noEmit --pretty false
```

Inside `video/` run:

```powershell
rtk npm run lint -- --max-warnings=0
rtk npm run typecheck
```

At this point the only allowed `video/` failure is the known unused import in `NeuroLutaFuga.tsx`.

## Task 5: Replace unsafe local types at the responsible boundary

**Files:**

- Modify: `src/components/exercicios/AcerteDistorcao.tsx`
- Modify: `src/components/exercicios/CartaFonte.tsx`
- Modify: `src/components/exercicios/ChuvaPreocupacoes.tsx`
- Modify: `src/components/exercicios/CofreForças.tsx`
- Modify: `src/components/exercicios/DiarioLapsos.tsx`
- Modify: `src/components/exercicios/PontosTensao.tsx`
- Modify: `src/components/exercicios/ReformulacaoHistoria.tsx`
- Modify: `src/lib/supabase.ts`
- Modify: `src/pages/PesquisaPublica.tsx`
- Modify: `video/src/compositions/NeuroLutaFuga.tsx`

### Step 1: Correct exercise types locally

- `AcerteDistorcao.tsx`: model the selected entry as `string | (typeof DISTORCOES)[number]`; narrow before reading `desc`.
- `ChuvaPreocupacoes.tsx`: import Framer Motion's public `PanInfo` type and use it for `handleDragEnd`.
- `CartaFonte.tsx`, `CofreForças.tsx`, `DiarioLapsos.tsx`, `PontosTensao.tsx`, and `ReformulacaoHistoria.tsx`: remove the permissive `[key: string]: any` signatures. Their named string properties and existing `keyof` usage are sufficient.

Do not change saved payload keys or exercise slugs.

### Step 2: Type the Supabase form result at its boundary

Change `getFormularioAnonimo` in `src/lib/supabase.ts` to return `FormularioAnonimoDB | null` data with the existing error value. Then:

- let `PesquisaPublica.tsx` infer each field as `FormCampo`;
- remove the explicit `any`;
- change `catch (e)` to `catch` because the value is unused.

Do not change table names, request filters, validation rules, or submitted payloads.

### Step 3: Remove the unused Remotion import

Delete only `useMemo` from the import list in `video/src/compositions/NeuroLutaFuga.tsx`.

### Step 4: Verify the typing task

Run:

```powershell
rtk npx eslint src/components/exercicios/AcerteDistorcao.tsx src/components/exercicios/CartaFonte.tsx src/components/exercicios/ChuvaPreocupacoes.tsx src/components/exercicios/CofreForças.tsx src/components/exercicios/DiarioLapsos.tsx src/components/exercicios/PontosTensao.tsx src/components/exercicios/ReformulacaoHistoria.tsx src/lib/supabase.ts src/pages/PesquisaPublica.tsx --max-warnings=0
rtk npm exec tsc -- --project tsconfig.app.json --noEmit --pretty false
```

Inside `video/`:

```powershell
rtk npm run lint -- --max-warnings=0
rtk npm run typecheck
```

Expected: `video/` is fully green.

## Task 6: Stabilize exercise initialization and persistence with pure tests

**Files:**

- Create: `src/components/exercicios/exerciseState.ts`
- Create: `src/components/exercicios/exerciseState.test.ts`
- Modify: `src/components/exercicios/Bussola.tsx`
- Modify: `src/components/exercicios/CofreForças.tsx`
- Modify: `src/components/exercicios/JardimMente.tsx`
- Modify: `src/components/exercicios/LaboratorioPrevisoes.tsx`
- Modify: `src/components/exercicios/ParesMente.tsx`
- Modify: `src/components/psicoed/useProgresso.ts`

### Step 1: Write focused RED tests

Test pure helpers for:

1. non-mutating Fisher-Yates shuffle with injected deterministic RNG;
2. creation of the 12 unique matching cards with reset score state;
3. parsing valid `jardim_regas` into plants sorted by completed sessions;
4. invalid garden JSON returning an empty snapshot;
5. stable day calculation from an injected reference timestamp;
6. selection of persisted exercise arrays until the user creates a local override.

Run:

```powershell
rtk npm test -- --run src/components/exercicios/exerciseState.test.ts
```

Expected RED for the missing helpers.

### Step 2: Implement the pure helpers

Keep the module domain-specific and small. It must not import React, access storage directly, or own timers. Inputs such as raw JSON, RNG, and reference time are injected.

Run the focused test and expect PASS.

### Step 3: Remove render-time randomness and effect hydration

- `Bussola.tsx`: initialize ranking through a lazy state initializer calling the tested shuffle; retain the randomized first visit.
- `ParesMente.tsx`: create the initial deck lazily and use the same event function for the “Novamente” reset; remove the mount effect and declaration-order violation.
- `JardimMente.tsx`: build one initial snapshot from storage through the pure parser; remove the state-setting mount effect and useless initial assignment; use one stable reference time for day labels.
- `CofreForças.tsx`: replace effect hydration with `localForcas ?? persistedForcas`; once the user adds an item, the local override becomes authoritative and is saved with the same payload.
- `LaboratorioPrevisoes.tsx`: use the same persisted-value/local-override pattern; derive the initial review mode from overdue saved predictions without a state-setting effect.
- `useProgresso.ts`: initialize `hasCode` lazily from `localStorage` without a mount effect.

Do not change exercise scoring, timers, saved field names, or completion calls.

### Step 4: Verify exercise behavior

Run:

```powershell
rtk npm test -- --run src/components/exercicios/exerciseState.test.ts
rtk npx eslint src/components/exercicios/exerciseState.ts src/components/exercicios/exerciseState.test.ts src/components/exercicios/Bussola.tsx src/components/exercicios/CofreForças.tsx src/components/exercicios/JardimMente.tsx src/components/exercicios/LaboratorioPrevisoes.tsx src/components/exercicios/ParesMente.tsx src/components/psicoed/useProgresso.ts --max-warnings=0
rtk npm exec tsc -- --project tsconfig.app.json --noEmit --pretty false
```

If the purity rule rejects a lazy initializer that captures time/randomness, move that impure read to module initialization or an explicit user event while preserving first-visit behavior. Do not suppress the rule.

## Task 7: Stabilize render-only UI and blog loading

**Files:**

- Modify: `src/components/blog/RichBlock.tsx`
- Create: `src/components/blog/richBlockLanguages.ts`
- Modify: `src/components/psicoed/Badge.tsx`
- Modify: `src/components/psicoed/NarrativaEsquemaView.tsx`
- Modify: `src/pages/BlogPost.tsx`
- Modify: `src/pages/DeOndeVemPadroes.tsx`

### Step 1: Separate the Fast Refresh export

Move `LINGUAGENS_RICAS` to `richBlockLanguages.ts`. Import it in both `RichBlock.tsx` and `BlogPost.tsx`. Keep `RichBlock.tsx` exporting only the React component.

### Step 2: Make decorative output deterministic

In `Badge.tsx`, replace render-time `Math.random()` calls with a module-level deterministic confetti layout derived from particle index. Preserve:

- 14 particles;
- the same colors;
- varied horizontal positions and delays;
- reduced-motion behavior;
- no semantic/clinical copy changes.

### Step 3: Hoist static components

Move `Elo` in `NarrativaEsquemaView.tsx` to module scope, import `ReactNode` as a type, and pass only `children` and `corDot`. Preserve markup and styles byte-for-byte where practical.

### Step 4: Derive BlogPost loading instead of setting it synchronously

Refactor the loader so:

- the post is always resolved for the current `slug` from `getPost`;
- loading is derived from “slug exists, no post, dynamic catalog not loaded”;
- `loadDynamicPosts()` triggers a rerender only in its asynchronous completion callback;
- route changes cannot display the prior slug's post;
- the title/theme effect only synchronizes the DOM and does not set React state.

Do not change Markdown rendering, JSON-LD, TOC, rich-block behavior, redirects, or copy.

### Step 5: Initialize the saved patient code without an effect update

In `DeOndeVemPadroes.tsx`:

- initialize `codigo` lazily from `exercise_patient_code`;
- keep the asynchronous personalization attempt on mount when a saved code exists;
- remove the synchronous `setCodigo` and obsolete eslint directive;
- preserve the same Supabase function name and body.

### Step 6: Verify the UI/blog task

Run:

```powershell
rtk npx eslint src/components/blog/RichBlock.tsx src/components/blog/richBlockLanguages.ts src/components/psicoed/Badge.tsx src/components/psicoed/NarrativaEsquemaView.tsx src/pages/BlogPost.tsx src/pages/DeOndeVemPadroes.tsx --max-warnings=0
rtk npm exec tsc -- --project tsconfig.app.json --noEmit --pretty false
rtk npm test -- --run
```

Expected: no parser warning and no new skipped test.

## Task 8: Refactor patient scale state transitions under pure tests

**Files:**

- Create: `src/pages/paciente/escalaState.ts`
- Create: `src/pages/paciente/escalaState.test.ts`
- Modify: `src/pages/paciente/Escala.tsx`

### Step 1: Write RED tests for the state contract

Test:

1. response initialization creates exactly `total` null slots;
2. draft parsing accepts only response/index/stage data and discards legacy identification fields;
3. invalid JSON and malformed drafts return no resumable draft;
4. roving index resolves the current answer or falls back to zero;
5. the next uncrossed milestone is emitted once at 25/50/75/100;
6. score branch selection preserves the existing general/schema/threshold result.

Run:

```powershell
rtk npm test -- --run src/pages/paciente/escalaState.test.ts
```

Expected RED for missing helpers.

### Step 2: Implement pure scale helpers

Keep storage access and React state outside `escalaState.ts`. Accept raw strings and typed inputs. Do not include patient name, CPF, birth date, email, phone, or guardian data in the draft type.

Run the focused test and expect PASS.

### Step 3: Give each scale route a keyed state lifetime

Split the route resolver from the stateful form if necessary:

- outer `Escala` resolves `escalaId`, config, query code, and renders the inner form with `key={escalaId}`;
- inner form lazily initializes responses, code, and draft from the current route;
- a route change creates a fresh state instance without a reset effect.

Do not change public URLs or the fallback redirect.

### Step 4: Move state transitions to their responsible events

- remove the `total → setRespostas` effect;
- prefill `codigoDigitado` lazily and keep auto-validation in the asynchronous/validation path;
- parse the draft lazily; restore it only from the existing user action;
- update `rovingIndex` when selecting, advancing, going back, or restoring a draft;
- update milestone state in the answer/advance event using the tested helper;
- retain the focus effect because it synchronizes the DOM;
- retain the storage-writing effect because it synchronizes an external system;
- compute `pontuacao` as one branch expression rather than assigning an unused initial value.

Preserve accessibility, the 220 ms answer transition, the 800 ms pulse, consent flow, validation, Supabase payload, and clinical scoring.

### Step 5: Verify the scale task

Run:

```powershell
rtk npm test -- --run src/pages/paciente/escalaState.test.ts
rtk npx eslint src/pages/paciente/Escala.tsx src/pages/paciente/escalaState.ts src/pages/paciente/escalaState.test.ts --max-warnings=0
rtk npm exec tsc -- --project tsconfig.app.json --noEmit --pretty false
```

## Task 9: Correct asynchronous patient/therapist state ownership

**Files:**

- Modify: `src/hooks/useConceituacaoIA.ts`
- Modify: `src/pages/bruno/Painel.tsx`

### Step 1: Move patient-change resets into the selection action

In `useConceituacaoIA.ts`:

- memoize `grupos` from `respostas`;
- keep an internal state setter for the patient key;
- expose a wrapper with the existing `setPacienteChave` public name;
- in that wrapper, reset profile, messages, session ID, and patient ID before changing the key;
- let the effect perform only asynchronous patient/profile resolution and cancellation handling;
- include real dependencies and remove the exhaustive-deps suppression;
- preserve timer, provider, model, Nine Router, Supabase function, PDF, and saved-diagram contracts.

The effect may update state only from asynchronous completion callbacks, not synchronously in its body.

### Step 2: Fix therapist panel initialization and static controls

In `Painel.tsx`:

- initialize `ControlePsicoedPaciente.carregando` from `Boolean(supabase)` so the missing-client path needs no effect update;
- hoist its visual switch component to module scope with typed props;
- initialize main `loginLoading` from `Boolean(supabase)` and remove the synchronous no-client update;
- keep Supabase session callbacks, realtime subscription, cleanup, and payloads unchanged;
- replace the sort comparator's overwritten `cmp = 0` with a branch expression that calculates `cmp` once.

Do not modify default clinical release flags: both personalized territory release and score reveal remain false by default.

### Step 3: Verify asynchronous ownership

Run:

```powershell
rtk npx eslint src/hooks/useConceituacaoIA.ts src/pages/bruno/Painel.tsx --max-warnings=0
rtk npm exec tsc -- --project tsconfig.app.json --noEmit --pretty false
rtk npm test -- --run
```

If a fix would alter a Supabase table, function name, insert/upsert body, auth transition, or privacy default, stop with `CONFLICT DETECTED`.

## Task 10: Reach and prove the complete green baseline

**Files:**

- Inspect: all task files
- Modify only if a genuine in-scope error remains

### Step 1: Run the root gates from zero

Run:

```powershell
rtk npm run lint -- --max-warnings=0
rtk npm exec tsc -- --project tsconfig.app.json --noEmit --pretty false
rtk npm test -- --run
rtk npm run build
rtk npm run check:repo-hygiene
rtk npm run check:neuro-models
```

Expected:

- lint: 0 errors, 0 warnings;
- typecheck: PASS;
- tests: all 65 legacy tests plus new tests PASS, no new skip;
- build: PASS;
- repository hygiene: PASS;
- Neuro models: 62 references, 4 required pairs, 83 models.

### Step 2: Run `video/` gates from its own directory

```powershell
rtk npm run lint -- --max-warnings=0
rtk npm run typecheck
rtk npm ls --depth=0
```

Expected: all PASS with no missing/invalid local dependency.

### Step 3: Recheck removal, preservation, and suppression policy

Run:

```powershell
rtk rg -n "HogwartsCrestInteractive|useCinematicScroll|ModosEsquemaCinema|GryffindorStory|HufflepuffStory|RavenclawStory|SlytherinStory|/psicoeducacao/modos-cinema|hogwarts-bg|hogwarts-crest|gryffindor-bg|hufflepuff-bg|ravenclaw-bg|slytherin-bg" src public
rtk rg -n "eslint-disable|@ts-ignore|@ts-expect-error" src video/src
rtk git hash-object docs/cenarios-modos-prompts.md public/scenes/s0/l1-sky.png public/scenes/s0/l2-glow.png public/scenes/s0/l3-mid.png public/scenes/s0/l6-hero.png public/scenes/s0/l7-close.png public/scenes/s0/split-src.png public/scenes/s1/l1-sky.png public/scenes/s1/l2-glow.png
rtk git diff --check
rtk git diff --cached --check
```

Expected:

- no operational Hogwarts matches;
- no newly added suppression directive; pre-existing directives outside edited lines must be distinguished by diff review;
- protected hashes equal Task 1;
- no whitespace errors.

### Step 4: Audit the full diff against scope

Run:

```powershell
rtk git status --short
rtk git diff --name-status
rtk git diff --cached --name-status
rtk git diff --stat
rtk git diff --cached --stat
```

Inspect full diffs for every modified quality file. Confirm:

- `.claude/settings.local.json` and other unrelated user files remain unstaged;
- `public/scenes/` is untouched;
- no route except Hogwarts was removed;
- no persistence/Supabase/scoring contract changed;
- the staged cleanup deletion set remains the approved one;
- no generated `dist/`, `out/`, log, cache, or secret is staged.

## Task 11: Stage the allowlisted patch, reverify it, and create the only commit (Concluída)

**Files:**

- Stage: approved cleanup changes already in the index
- Stage: approved specification and plans
- Stage: files modified/created by Tasks 2–9
- Do not stage: unrelated user changes listed by Task 1

### Step 1: Stage explicit paths only

Use explicit `rtk git add -- <path...>` commands grouped by task. Do not use `git add .`, `git add -A`, or a wildcard.

For files with pre-existing task-related changes (`BrainModel.tsx`, `Neuroanatomia3D.tsx`, `video/package.json`, and `video/package-lock.json`), review the entire staged file and confirm those existing changes are required by the currently validated code. If an unrelated user hunk appears, stage only the authorized hunks and leave the user hunk in the worktree.

### Step 2: Verify the candidate index

Run:

```powershell
rtk git diff --cached --check
rtk git diff --cached --name-status
rtk git diff --cached --stat
```

Then rerun the complete Task 10 root and `video/` gates without editing anything between verification and commit.

### Step 3: Create the single commit

Only after every gate passes:

```powershell
rtk git commit -m "chore: restore verified repository quality baseline"
```

Do not amend another commit and do not push.

### Step 4: Prove the final state

Run:

```powershell
rtk git show --stat --oneline --decorate HEAD
rtk git status --short
```

Expected:

- exactly one new commit for this integrated correction;
- unrelated user changes may remain visible and unstaged;
- no task change remains accidentally unstaged;
- no remote operation occurred.

## Final PASS report

Return exactly the evidence categories required by the approved spec:

```text
COMMIT:
FILES CHANGED:
HOGWARTS REMOVAL CHECK:
ROOT LINT:
ROOT TYPECHECK:
ROOT TESTS:
ROOT BUILD:
REPO HYGIENE:
NEURO MODELS:
VIDEO LINT:
VIDEO TYPECHECK:
DIFF ALLOWLIST REVIEW:
RESULT: PASS | FAIL
```

Do not claim completion if any item is unknown, skipped, warning-only, or failing.
