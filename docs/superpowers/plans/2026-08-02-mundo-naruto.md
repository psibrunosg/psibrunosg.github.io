# Mundo Naruto Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar Naruto como um único mundo de psicoeducação, no qual cada tema começa no Naruto Clássico e avança para Naruto Shippuden preservando o assunto em estudo.

**Architecture:** A galeria recebe um único `Mundo` com ID `naruto`; seu hub lista Crenças, Distorções, Esquemas e Modos. Cada rota temática resolve uma query `tempo`: sem query ou `origem` apresenta Naruto Clássico como hipóteses de formação de padrões; `vida-atual` apresenta Shippuden como expressão desses padrões em relações e questões sociais. A mudança de etapa altera a URL, não salva dados de visitante e mantém o mesmo `temaId`.

**Tech Stack:** React 19, TypeScript, React Router 7, Tailwind CSS v4, Framer Motion, Lucide React, Vitest, Testing Library e jsdom.

## Global Constraints

- Público: adolescentes e adultos; a linguagem deve ser acolhedora, acessível e não diagnóstica.
- Manter exatamente quatro temas: `crencas`, `distorcoes`, `esquemas` e `modos`.
- Naruto Clássico aborda necessidades emocionais, vínculos, pertencimento, autonomia, proteção e limites como hipóteses de formação; não atribui causa única nem culpa a família, pares ou pessoa.
- Naruto Shippuden aborda como os padrões podem aparecer hoje em identidade, vínculos, perdas, responsabilidade, comparação, violência e efeitos sociais; não patologiza sofrimento nem a obra.
- Em cada tema, a ação “Avançar no tempo” deve levar de `tempo=origem` para `tempo=vida-atual`, preservando `temaId`.
- Em `vida-atual`, oferecer “Voltar à origem” e “Escolher outro tema”; não oferecer uma continuação temporal falsa.
- URLs inválidas (`temaId` inexistente ou `tempo` diferente de `origem|vida-atual`) redirecionam para `/psicoeducacao/mundos/naruto`.
- Não incluir quiz, pontuação, exercícios, banco de dados, coleta de dados pessoais ou inferência clínica nesta entrega.
- Os mundos e URLs atuais de Torajo, Demon Slayer e Jujutsu Kaisen devem continuar funcionando.
- Não usar imagens, logos, screenshots, trilha sonora ou arte oficial de Naruto sem autorização documentada. Até ela existir, usar placeholder local abstrato e não identificável como personagem.
- Todo controle deve funcionar por teclado, ter foco visível, alvo de toque mínimo de 44 px, contraste textual mínimo de 4.5:1 e comunicar o estado sem depender de cor ou animação. Respeitar `prefers-reduced-motion`.

---

## Estrutura de arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `package.json` | Dependências de teste de interface e ambiente DOM. |
| `vitest.config.ts` | Configurar ambiente `jsdom`, aliases e setup do Vitest. |
| `src/test/setup.ts` | Carregar matchers do Testing Library e limpar o DOM após cada teste. |
| `src/content/psicoed-mundos.ts` | Registro navegável do único mundo `naruto` e seus quatro temas. |
| `src/content/psicoed/naruto.ts` | Contrato editorial e conteúdo das duas etapas, indexado por tema. |
| `src/content/psicoed/naruto.test.ts` | Garantir cobertura dos quatro temas e das duas etapas. |
| `src/components/psicoed/LinhaDoTempoNaruto.tsx` | Indicador semântico e acessível de Origem → Vida atual. |
| `src/components/psicoed/AvancarNoTempo.tsx` | Links temporais que preservam o tema atual. |
| `src/pages/MundoNaruto.tsx` | Hub do mundo, com introdução, linha do tempo e quatro temas. |
| `src/pages/NarutoTema.tsx` | Template único que resolve rota e query, renderiza a etapa e apresenta as ações corretas. |
| `src/pages/NarutoTema.test.tsx` | Rotas, transição temporal, validação de URL e rótulos acessíveis. |
| `src/App.tsx` | Registro explícito das duas rotas públicas de Naruto. |

## Task 1: Preparar o ambiente de testes de interface

**Files:**
- Modify: `package.json`
- Modify: `vitest.config.ts`
- Create: `src/test/setup.ts`

**Interfaces:**
- Produces: execução de testes TSX com DOM, `@/` e matchers `toBeInTheDocument()`.
- Consumes: o script existente `npm test`.

- [ ] **Step 1: Instalar as dependências de teste necessárias**

Run:

```bash
npm install -D @testing-library/jest-dom @testing-library/react @testing-library/user-event jsdom
```

- [ ] **Step 2: Configurar Vitest para componentes React**

Substituir o conteúdo de `vitest.config.ts` por:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": resolve(__dirname, "src") } },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    clearMocks: true,
  },
});
```

- [ ] **Step 3: Criar o setup compartilhado**

```ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => cleanup());
```

- [ ] **Step 4: Verificar que o runner inicia**

Run: `npm test -- --passWithNoTests`

Expected: PASS; o Vitest deve iniciar com `jsdom` sem erro de resolução de alias.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/test/setup.ts
git commit -m "test: configure React component testing"
```

## Task 2: Modelar e validar o conteúdo temporal de Naruto

**Files:**
- Modify: `src/content/psicoed-mundos.ts`
- Create: `src/content/psicoed/naruto.ts`
- Create: `src/content/psicoed/naruto.test.ts`

**Interfaces:**
- Produces: `NarutoTemaId`, `TempoNaruto`, `NarutoTema`, `narutoPorTema` e o `Mundo` `naruto`.
- Consumes: `TemaMundo`, `Mundo` e `mundoPorId()` existentes.

- [ ] **Step 1: Escrever o teste de contrato que falha**

```ts
import { describe, expect, it } from "vitest";
import { mundoPorId } from "../psicoed-mundos";
import { narutoPorTema } from "./naruto";

describe("conteúdo temporal de Naruto", () => {
  it("expõe os mesmos quatro temas no hub e no conteúdo", () => {
    expect(mundoPorId("naruto")?.temas.map(({ id }) => id))
      .toEqual(["crencas", "distorcoes", "esquemas", "modos"]);
    expect(Object.keys(narutoPorTema)).toEqual(["crencas", "distorcoes", "esquemas", "modos"]);
  });

  it("oferece origem e vida atual para cada tema", () => {
    Object.values(narutoPorTema).forEach(({ origem, vidaAtual }) => {
      expect(origem.chamada).not.toHaveLength(0);
      expect(vidaAtual.chamada).not.toHaveLength(0);
    });
  });
});
```

- [ ] **Step 2: Rodar o teste para confirmar a falha**

Run: `npm test -- src/content/psicoed/naruto.test.ts`

Expected: FAIL porque o mundo e o módulo de conteúdo ainda não existem.

- [ ] **Step 3: Criar o contrato editorial e os dados**

Criar `src/content/psicoed/naruto.ts` com este contrato:

```ts
export const narutoTemaIds = ["crencas", "distorcoes", "esquemas", "modos"] as const;
export type NarutoTemaId = (typeof narutoTemaIds)[number];
export type TempoNaruto = "origem" | "vida-atual";

export interface EtapaNaruto {
  rotulo: "Naruto Clássico" | "Naruto Shippuden";
  fase: "Origem" | "Vida atual";
  chamada: string;
  explicacao: string;
  exemplos: string[];
  perguntaReflexiva: string;
  notaDeCuidado: string;
}

export interface NarutoTema {
  id: NarutoTemaId;
  titulo: string;
  origem: EtapaNaruto;
  vidaAtual: EtapaNaruto;
}

export const narutoPorTema: Record<NarutoTemaId, NarutoTema> = /* quatro temas */;
```

Preencher os quatro objetos completos. Em `origem`, cada explicação deve falar em possibilidade (“experiências podem contribuir”) e nunca em determinismo. Em `vidaAtual`, incluir pelo menos um exemplo contextual/social por tema, sem reduzir um fenômeno coletivo a uma escolha individual. Não usar nomes, falas ou imagens da obra na interface ou no conteúdo até autorização documentada.

Adicionar `naruto` em `mundos` com:

```ts
{
  id: "naruto",
  titulo: "Naruto",
  descricaoCurta: "Da formação dos padrões à forma como eles podem aparecer na vida atual.",
  cor: "#C65C2E",
  imagemCapa: "/img/mundos/naruto-placeholder.svg",
  temas: [
    { id: "crencas", titulo: "Crenças Centrais", rota: "/psicoeducacao/naruto/crencas", icone: "gem" },
    { id: "distorcoes", titulo: "Distorções Cognitivas", rota: "/psicoeducacao/naruto/distorcoes", icone: "scale" },
    { id: "esquemas", titulo: "Esquemas Iniciais Desadaptativos", rota: "/psicoeducacao/naruto/esquemas", icone: "eye" },
    { id: "modos", titulo: "Modos do Esquema", rota: "/psicoeducacao/naruto/modos", icone: "layers" },
  ],
}
```

- [ ] **Step 4: Adicionar o placeholder de capa**

Criar `public/img/mundos/naruto-placeholder.svg` como ilustração abstrata própria, sem símbolos, cores de uniforme, silhuetas ou outros elementos que identifiquem a obra. Usar apenas formas geométricas em `#C65C2E`, `#23313A` e `#F6EFE6`; o SVG recebe `<title>Ilustração abstrata para o mundo Naruto</title>`.

- [ ] **Step 5: Rodar os testes e o lint**

Run: `npm test -- src/content/psicoed/naruto.test.ts && npm run lint`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/content/psicoed-mundos.ts src/content/psicoed/naruto.ts src/content/psicoed/naruto.test.ts public/img/mundos/naruto-placeholder.svg
git commit -m "feat: add Naruto temporal world data"
```

## Task 3: Criar os controles temporais acessíveis

**Files:**
- Create: `src/components/psicoed/LinhaDoTempoNaruto.tsx`
- Create: `src/components/psicoed/AvancarNoTempo.tsx`
- Create: `src/components/psicoed/LinhaDoTempoNaruto.test.tsx`

**Interfaces:**
- Consumes: `TempoNaruto`, `NarutoTemaId` e React Router.
- Produces: `<LinhaDoTempoNaruto tempo={tempo} />` e `<AvancarNoTempo temaId={temaId} tempo={tempo} />`.

- [ ] **Step 1: Escrever o teste de semântica e destinos**

```tsx
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import AvancarNoTempo from "./AvancarNoTempo";
import LinhaDoTempoNaruto from "./LinhaDoTempoNaruto";

it("marca origem como etapa atual e avança no mesmo tema", () => {
  render(<MemoryRouter><><LinhaDoTempoNaruto tempo="origem" /><AvancarNoTempo temaId="crencas" tempo="origem" /></></MemoryRouter>);
  expect(screen.getByText("Origem")).toHaveAttribute("aria-current", "step");
  expect(screen.getByRole("link", { name: "Avançar no tempo" }))
    .toHaveAttribute("href", "/psicoeducacao/naruto/crencas?tempo=vida-atual");
});
```

- [ ] **Step 2: Rodar o teste para confirmar a falha**

Run: `npm test -- src/components/psicoed/LinhaDoTempoNaruto.test.tsx`

Expected: FAIL porque os componentes não existem.

- [ ] **Step 3: Implementar a linha do tempo**

`LinhaDoTempoNaruto` deve renderizar uma lista ordenada com duas etapas: “Origem — Naruto Clássico” e “Vida atual — Naruto Shippuden”. O item da prop `tempo` recebe `aria-current="step"`, texto “Etapa atual” visualmente disponível e um ícone complementar; cor nunca é o único sinal de estado. O componente não usa animação para comunicar a mudança.

- [ ] **Step 4: Implementar as ações de tempo**

`AvancarNoTempo` deve ter estas regras exatas:

```ts
if (tempo === "origem") {
  // Link nomeado "Avançar no tempo"
  // to={`/psicoeducacao/naruto/${temaId}?tempo=vida-atual`}
}

// Em vida-atual, dois links:
// "Voltar à origem" → `/psicoeducacao/naruto/${temaId}?tempo=origem`
// "Escolher outro tema" → "/psicoeducacao/mundos/naruto"
```

Usar `Link`, alvos mínimos `min-h-11`, `focus-visible:ring-2` e texto completo; não substituir essas ações por botões que alteram estado local.

- [ ] **Step 5: Verificar teste e lint**

Run: `npm test -- src/components/psicoed/LinhaDoTempoNaruto.test.tsx && npm run lint`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/psicoed/LinhaDoTempoNaruto.tsx src/components/psicoed/AvancarNoTempo.tsx src/components/psicoed/LinhaDoTempoNaruto.test.tsx
git commit -m "feat: add Naruto temporal navigation"
```

## Task 4: Implementar hub e página temática única

**Files:**
- Create: `src/pages/MundoNaruto.tsx`
- Create: `src/pages/NarutoTema.tsx`
- Modify: `src/App.tsx`
- Create: `src/pages/NarutoTema.test.tsx`

**Interfaces:**
- Consumes: `mundoPorId("naruto")`, `narutoPorTema`, `LinhaDoTempoNaruto` e `AvancarNoTempo`.
- Produces: `/psicoeducacao/mundos/naruto` e `/psicoeducacao/naruto/:temaId?tempo=origem|vida-atual`.

- [ ] **Step 1: Escrever os testes de rota que falham**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it } from "vitest";
import App from "../App";

beforeEach(() => window.history.replaceState({}, "", "/psicoeducacao/naruto/crencas"));

it("abre a origem sem query e avança para o mesmo tema", async () => {
  const user = userEvent.setup();
  render(<App />);
  expect(await screen.findByText("Naruto Clássico")).toBeInTheDocument();
  await user.click(screen.getByRole("link", { name: "Avançar no tempo" }));
  expect(await screen.findByText("Naruto Shippuden")).toBeInTheDocument();
  expect(window.location.search).toBe("?tempo=vida-atual");
  expect(window.location.pathname).toBe("/psicoeducacao/naruto/crencas");
});

it("redireciona tema ou tempo inválido para o hub", async () => {
  window.history.replaceState({}, "", "/psicoeducacao/naruto/invalido?tempo=futuro");
  render(<App />);
  expect(await screen.findByRole("heading", { name: "Naruto" })).toBeInTheDocument();
  expect(window.location.pathname).toBe("/psicoeducacao/mundos/naruto");
});
```

- [ ] **Step 2: Rodar os testes para confirmar a falha**

Run: `npm test -- src/pages/NarutoTema.test.tsx`

Expected: FAIL porque as rotas e páginas ainda não existem.

- [ ] **Step 3: Implementar `MundoNaruto`**

Usar a mesma moldura de `MundoTemas.tsx`: `SkipLink`, `MobileMenu`, `WhatsAppFloat`, `EthicalFooter`, tema `lobo` e link de retorno a `/psicoeducacao/mundos`. Mostrar título “Naruto”, a capa placeholder com `alt=""`, introdução curta “Comece pela origem de um padrão e avance para como ele pode aparecer na vida atual.” e os quatro `mundo.temas` como links. A introdução deve explicar que contexto influencia, mas não define destino.

- [ ] **Step 4: Implementar `NarutoTema`**

Usar `useParams<{ temaId: string }>()` e `useSearchParams()`. Resolver estado por esta lógica:

```ts
const tempoQuery = searchParams.get("tempo");
const tempo = tempoQuery ?? "origem";
const temaValido = narutoTemaIds.includes(temaId as NarutoTemaId);
const tempoValido = tempo === "origem" || tempo === "vida-atual";

if (!temaValido || !tempoValido) {
  return <Navigate to="/psicoeducacao/mundos/naruto" replace />;
}

const tema = narutoPorTema[temaId as NarutoTemaId];
const etapa = tempo === "origem" ? tema.origem : tema.vidaAtual;
```

Renderizar em ordem: retorno ao hub, `LinhaDoTempoNaruto`, título do tema, rótulo da obra/fase, `chamada`, `explicacao`, lista de `exemplos`, `perguntaReflexiva`, `notaDeCuidado` e `AvancarNoTempo`. A pergunta deve ser um convite opcional de reflexão, sem campo de resposta nem armazenamento. Atualizar `document.title` conforme `tema.titulo`, `etapa.fase` e `etapa.rotulo`.

- [ ] **Step 5: Registrar as rotas antes da rota dinâmica atual de mundos**

Adicionar imports e estas rotas em `App.tsx`:

```tsx
<Route path="/psicoeducacao/mundos/naruto" element={<MundoNaruto />} />
<Route path="/psicoeducacao/naruto/:temaId" element={<NarutoTema />} />
```

Manter `<Route path="/psicoeducacao/mundos/:mundoId" element={<MundoTemas />} />` depois da rota literal de Naruto. Não alterar as rotas existentes.

- [ ] **Step 6: Rodar os testes da página e o lint**

Run: `npm test -- src/pages/NarutoTema.test.tsx && npm run lint`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/pages/MundoNaruto.tsx src/pages/NarutoTema.tsx src/pages/NarutoTema.test.tsx src/App.tsx
git commit -m "feat: add Naruto temporal psychoeducation pages"
```

## Task 5: Verificar integração, acessibilidade e publicação segura

**Files:**
- Modify: `README.md` somente se já documentar rotas de psicoeducação.

**Interfaces:**
- Consumes: o fluxo público implementado nas Tasks 2–4.
- Produces: evidência de build, testes, navegação e política de assets antes do deploy.

- [ ] **Step 1: Rodar a suíte, lint e build**

Run: `npm test && npm run lint && npm run build`

Expected: os três comandos terminam com código 0.

- [ ] **Step 2: Servir e conferir o roteiro de navegação**

Run: `npm run preview -- --host 127.0.0.1`

Verificar em 1440 px e 375 px:

1. `/psicoeducacao/mundos` mostra Naruto junto aos mundos existentes.
2. `/psicoeducacao/mundos/naruto` mostra os quatro temas e explica a passagem temporal.
3. `/psicoeducacao/naruto/crencas` abre “Origem — Naruto Clássico”.
4. “Avançar no tempo” abre `/psicoeducacao/naruto/crencas?tempo=vida-atual` e mostra “Vida atual — Naruto Shippuden”.
5. “Voltar à origem” recupera o mesmo tema em `tempo=origem`; “Escolher outro tema” volta ao hub.
6. `/psicoeducacao/naruto/invalido?tempo=futuro` volta ao hub.
7. `/psicoeducacao/mundos/torajo`, `/psicoeducacao/mundos/demon-slayer` e `/psicoeducacao/mundos/jujutsu-kaisen` continuam acessíveis.

- [ ] **Step 3: Verificar teclado, estado e movimento**

Com teclado, confirmar que o foco começa no link de salto, passa pelo retorno, quatro temas e ações temporais em ordem visual. Em cada etapa, confirmar que “Etapa atual” e `aria-current="step"` indicam a fase sem depender de cor. Com `prefers-reduced-motion: reduce`, confirmar que a mudança de etapa permanece imediatamente compreensível sem deslocamento ou animação.

- [ ] **Step 4: Bloquear publicação de assets não autorizados**

Antes do deploy, registrar em PR ou release a origem e a autorização de cada asset Naruto. Se não houver documentação, conferir que somente `public/img/mundos/naruto-placeholder.svg` é referenciado e que nenhum nome de personagem, diálogo, logo, frame, imagem ou áudio oficial foi adicionado.

- [ ] **Step 5: Documentar rotas, se aplicável, e commit**

Se `README.md` já possuir seção de rotas de psicoeducação, adicionar:

```md
- `/psicoeducacao/mundos/naruto`
- `/psicoeducacao/naruto/:temaId?tempo=origem|vida-atual`
```

Run: `git add README.md`

Commit apenas se `README.md` foi alterado:

```bash
git commit -m "docs: document Naruto temporal routes"
```

## Revisão do plano

- Cobertura de escopo: Tasks 2 e 4 implementam os quatro temas, as duas fases e a preservação de `temaId`; Task 3 implementa a transição temporal; Task 5 valida responsividade, acessibilidade, regressão e assets.
- Limite de escopo: não altera Supabase, dados de pacientes, exercícios, quizzes, pontuação ou mundos existentes.
- Consistência de rota: o hub é `/psicoeducacao/mundos/naruto`; somente páginas de tema usam `/psicoeducacao/naruto/:temaId` e `tempo` aceita exclusivamente `origem` ou `vida-atual`.
