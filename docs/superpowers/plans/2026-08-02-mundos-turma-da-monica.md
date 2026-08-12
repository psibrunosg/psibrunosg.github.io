# Mundos da Turma da Mônica Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** Adicionar Turma da Mônica como um único mundo de psicoeducação, cuja narrativa avança da infância para a vida atual por uma transição explícita de tempo.

**Architecture:** A galeria exibe um único cartão “Turma da Mônica”. O mundo abre inicialmente no capítulo **Origem** (Clássica) e mantém uma linha do tempo persistente. No final de cada trilha temática, a ação “Avançar no tempo” troca para **Vida atual** (Jovem), preserva o tema em estudo e carrega o conteúdo correspondente. Dados clínico-pedagógicos continuam separados de rotas e componentes.

**Tech Stack:** React 19, TypeScript, React Router, Tailwind CSS v4, Framer Motion, Lucide React e Vitest.

- Os testes de componente requerem \`@testing-library/react\`, \`@testing-library/jest-dom\` e \`happy-dom\`; esta infraestrutura vem antes dos testes de UI.

## Task 0: Preparar testes de interface

**Files:**
- Modify: \`package.json\`
- Modify: \`package-lock.json\`
- Modify: \`vitest.config.ts\`
- Create: \`src/test/setup.ts\`
- Create: \`src/test/setup.test.tsx\`

**Interfaces:**
- Produces: Vitest executando \`.test.tsx\` em \`happy-dom\` e matchers de DOM.

- [ ] **Step 1: Escrever o teste de prova**

\`\`\`tsx
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

it("renderiza uma interface React", () => {
  render(<h1>Teste de interface</h1>);
  expect(screen.getByRole("heading")).toBeInTheDocument();
});
\`\`\`

- [ ] **Step 2: Rodar a falha esperada**

Run: \`npm test -- src/test/setup.test.tsx\`

Expected: FAIL: a configuração atual inclui apenas arquivos \`.ts\` e usa ambiente \`node\`.

- [ ] **Step 3: Instalar e configurar o suporte**

Run: \`npm install -D @testing-library/react @testing-library/jest-dom happy-dom\`

Em \`vitest.config.ts\`, usar \`environment: "happy-dom"\`, incluir \`src/**/*.{test,spec}.{ts,tsx}\` e definir \`setupFiles: ["./src/test/setup.ts"]\`. Em \`src/test/setup.ts\`, importar \`"@testing-library/jest-dom/vitest"\`.

- [ ] **Step 4: Rodar passagem e commit**

Run: \`npm test -- src/test/setup.test.tsx\`

Expected: PASS.

\`\`\`bash
git add package.json package-lock.json vitest.config.ts src/test/setup.ts src/test/setup.test.tsx
git commit -m "test: support React component tests"
\`\`\`



## Global Constraints

- Público: adolescentes e adultos; a experiência precisa funcionar tanto para quem vive essas questões agora quanto para quem revisita a própria adolescência.
- Clássica trata necessidades emocionais, vínculos, autonomia, pertencimento e limites na infância. Jovem trata identidade, pares, afetos, redes sociais, comparação e pressões sociais atuais; a passagem entre elas ocorre por “Avançar no tempo”, não por escolha inicial.
- Linguagem acolhedora, não diagnóstica e sem atribuir culpa a responsáveis, pares ou à pessoa.
- Os mundos já publicados e seus URLs devem continuar funcionando.
- Só usar nomes e assets da Turma da Mônica que estejam autorizados/licenciados. Sem autorização documentada, publicar somente placeholders neutros e não usar arte oficial.
- Sem banco de dados, quizzes, pontuação, exercícios ou coleta de dados pessoais nesta entrega.
- Respeitar teclado, foco visível, contraste mínimo de 4.5:1 e \`prefers-reduced-motion\`.

---

## Estrutura de arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| \`src/content/psicoed-mundos.ts\` | Contrato de coleção, capítulos e metadados navegáveis. |
| \`src/content/psicoed/monica-classica.ts\` | Conteúdo do capítulo Origem. |
| \`src/content/psicoed/monica-jovem.ts\` | Conteúdo do capítulo Vida atual. |
| \`src/components/psicoed/MundoCollectionCard.tsx\` | Cartão da coleção na galeria. |
| \`src/components/psicoed/MundoChapterCard.tsx\` | Cartão reutilizável de capítulo. |
| \`src/pages/MundosTematicos.tsx\` | Entrada reorganizada em coleções e mundos independentes. |
| \`src/pages/MundoMonica.tsx\` | Escolha entre Origem e Vida atual. |
| \`src/pages/MundoTemas.tsx\` | Contexto do capítulo + quatro temas. |
| \`src/pages/MonicaClassicaTema.tsx\` | Template de página de tema infantil. |
| \`src/pages/MonicaJovemTema.tsx\` | Template de página de tema contemporâneo. |
| \`src/App.tsx\` | Rotas públicas. |
| \`src/content/psicoed-mundos.test.ts\`, \`src/pages/MonicaTema.test.tsx\` | Integridade dos dados e rotas. |

## Task 1: Modelar a coleção e preservar os mundos atuais

**Files:**
- Modify: \`src/content/psicoed-mundos.ts\`
- Create: \`src/content/psicoed-mundos.test.ts\`

**Interfaces:**
- Produces: \`MundoCollection\`, \`MundoChapter\`, \`colecoesMundo\`, \`colecaoPorId(id)\`.
- Consumes: \`Mundo\` e \`TemaMundo\` existentes.

- [ ] **Step 1: Escrever o teste de contrato**

\`\`\`ts
import { describe, expect, it } from "vitest";
import { colecaoPorId, mundoPorId } from "./psicoed-mundos";

describe("coleção Turma da Mônica", () => {
  it("expõe Origem e Vida atual", () => {
    expect(colecaoPorId("turma-da-monica")?.capitulos.map(({ id }) => id))
      .toEqual(["classica", "jovem"]);
  });

  it("mantém quatro temas em cada capítulo", () => {
    expect(mundoPorId("turma-da-monica-classica")?.temas).toHaveLength(4);
    expect(mundoPorId("turma-da-monica-jovem")?.temas).toHaveLength(4);
  });
});
\`\`\`

- [ ] **Step 2: Rodar a falha esperada**

Run: \`npm test -- src/content/psicoed-mundos.test.ts\`

Expected: FAIL porque coleção e IDs ainda não existem.

- [ ] **Step 3: Implementar os tipos e os dados mínimos**

\`\`\`ts
export interface MundoChapter {
  id: "classica" | "jovem";
  titulo: string;
  rotulo: "Origem" | "Vida atual";
  descricao: string;
  rota: string;
  mundoId: string;
}
export interface MundoCollection {
  id: string;
  titulo: string;
  descricaoCurta: string;
  imagemCapa?: string;
  capitulos: MundoChapter[];
}
\`\`\`

Adicionar \`turma-da-monica\`, com capítulos \`classica\` e \`jovem\`, e dois objetos \`Mundo\` com os IDs acima. Os dois possuem \`crencas\`, \`distorcoes\`, \`esquemas\` e \`modos\`. Usar imagem local neutra/placeholder até autorização de assets.

- [ ] **Step 4: Rodar teste, lint e commit**

Run: \`npm test -- src/content/psicoed-mundos.test.ts && npm run lint\`

Expected: PASS.

\`\`\`bash
git add src/content/psicoed-mundos.ts src/content/psicoed-mundos.test.ts
git commit -m "feat: model Mônica thematic collection"
\`\`\`

## Task 2: Produzir conteúdo clínico-pedagógico isolado

**Files:**
- Create: \`src/content/psicoed/monica-classica.ts\`
- Create: \`src/content/psicoed/monica-jovem.ts\`
- Create: \`src/content/psicoed/monica-worlds.test.ts\`

**Interfaces:**
- Produces: \`MonicaTema\`, \`temasMonicaClassica\`, \`temasMonicaJovem\`.
- Consumes: IDs de \`TemaMundo\`.

- [ ] **Step 1: Escrever teste de escopo**

\`\`\`ts
it("diferencia origem de vida atual", () => {
  expect(temasMonicaClassica.every((tema) => tema.foco === "origem")).toBe(true);
  expect(temasMonicaJovem.every((tema) => tema.foco === "vida-atual")).toBe(true);
});
\`\`\`

- [ ] **Step 2: Rodar a falha esperada**

Run: \`npm test -- src/content/psicoed/monica-worlds.test.ts\`

Expected: FAIL porque os módulos não existem.

- [ ] **Step 3: Criar o contrato editorial**

\`\`\`ts
export interface MonicaTema {
  id: "crencas" | "distorcoes" | "esquemas" | "modos";
  foco: "origem" | "vida-atual";
  chamada: string;
  explicacao: string;
  exemplos: string[];
  perguntaReflexiva: string;
}
\`\`\`

Clássica: abordar experiências de casa, escola e amizades como hipóteses de formação — nunca como explicação definitiva. Jovem: abordar relações, grupos, comparação, identidade e contexto social sem patologizar a adolescência. Cada tema deve ter nota breve de cuidado e convite opcional a conversar em terapia.

- [ ] **Step 4: Revisar e validar**

Checar que não há diagnóstico, promessas, culpabilização ou uso de nomes/imagens protegidos sem autorização. Rodar \`npm test -- src/content/psicoed/monica-worlds.test.ts\`.

- [ ] **Step 5: Commit**

\`\`\`bash
git add src/content/psicoed/monica-classica.ts src/content/psicoed/monica-jovem.ts src/content/psicoed/monica-worlds.test.ts
git commit -m "feat: add Mônica psychoeducation content"
\`\`\`

## Task 3: Criar os componentes de coleção e capítulo

**Files:**
- Create: \`src/components/psicoed/MundoCollectionCard.tsx\`
- Create: \`src/components/psicoed/MundoChapterCard.tsx\`
- Create: \`src/components/psicoed/MundoCollectionCard.test.tsx\`

**Interfaces:**
- Consumes: \`MundoCollection\`, \`MundoChapter\`.
- Produces: links para coleção e capítulos, com fallback visual de imagem.

- [ ] **Step 1: Escrever teste de destino acessível**

\`\`\`tsx
render(<MemoryRouter><MundoCollectionCard collection={monica} /></MemoryRouter>);
expect(screen.getByRole("link", { name: /turma da mônica/i }))
  .toHaveAttribute("href", "/psicoeducacao/mundos/turma-da-monica");
\`\`\`

- [ ] **Step 2: Rodar a falha esperada**

Run: \`npm test -- src/components/psicoed/MundoCollectionCard.test.tsx\`

Expected: FAIL porque o componente não existe.

- [ ] **Step 3: Implementar os cartões**

O cartão da coleção deve trazer “Uma jornada em dois momentos”, os rótulos Origem/Vida atual e uma única ação “Explorar a jornada”. O cartão de capítulo contém rótulo, título, descrição e um único \`<Link>\`. Usar \`focus-visible\`; assets decorativos recebem \`alt=""\`; imagem informativa recebe alternativa específica.

- [ ] **Step 4: Implementar fallback e validar**

Em erro ou ausência de imagem, exibir bloco de cor e \`BookOpen\` do Lucide, sem perder título ou destino. Rodar teste e lint.

- [ ] **Step 5: Commit**

\`\`\`bash
git add src/components/psicoed/MundoCollectionCard.tsx src/components/psicoed/MundoChapterCard.tsx src/components/psicoed/MundoCollectionCard.test.tsx
git commit -m "feat: add thematic journey cards"
\`\`\`

## Task 4: Reformular a galeria sem criar um carrossel

**Files:**
- Modify: \`src/pages/MundosTematicos.tsx\`
- Modify: \`src/content/psicoed-mundos.ts\`

**Interfaces:**
- Consumes: \`colecoesMundo\`, \`mundos\`, \`MundoCollectionCard\`.
- Produces: coleção em destaque, seguida por mundos independentes.

- [ ] **Step 1: Escrever teste de separação**

\`\`\`ts
it("não mistura a coleção aos mundos independentes", () => {
  expect(mundos.map(({ id }) => id)).not.toContain("turma-da-monica");
});
\`\`\`

- [ ] **Step 2: Implementar a nova hierarquia**

Substituir “Escolha um mundo” por “Escolha uma forma de explorar”. Criar seção “Jornadas conectadas” com Mônica em largura total e seção “Outros mundos” para Torajo, Demon Slayer e Jujutsu Kaisen. Em desktop, os mundos seguem em grade de duas colunas; em 375 px, uma coluna. Não ocultar destinos em carrossel ou interação por arraste.

- [ ] **Step 3: Ajustar movimento e validar**

Com redução de movimento, renderizar o estado final sem deslocamento vertical. Conferir alvos de toque ≥44 px em 375 px. Rodar \`npm run lint && npm test -- src/content/psicoed-mundos.test.ts\`.

- [ ] **Step 4: Commit**

\`\`\`bash
git add src/pages/MundosTematicos.tsx src/content/psicoed-mundos.ts src/content/psicoed-mundos.test.ts
git commit -m "feat: organize thematic worlds by journey"
\`\`\`

## Task 5: Criar a página de jornada e registrar rotas

**Files:**
- Create: \`src/pages/MundoMonica.tsx\`
- Modify: \`src/App.tsx\`
- Modify: \`src/pages/MundoTemas.tsx\`
- Create: \`src/pages/MundoMonica.test.tsx\`

**Interfaces:**
- Produces: \`/psicoeducacao/mundos/turma-da-monica\`, \`/psicoeducacao/mundos/turma-da-monica-classica\`, \`/psicoeducacao/mundos/turma-da-monica-jovem\`.

- [ ] **Step 1: Escrever teste da rota**

\`\`\`tsx
window.history.pushState({}, "", "/psicoeducacao/mundos/turma-da-monica");
render(<App />);
expect(await screen.findByRole("heading", { name: /turma da mônica/i })).toBeVisible();
\`\`\`

- [ ] **Step 2: Rodar a falha esperada**

Run: \`npm test -- src/pages/MundoMonica.test.tsx\`

Expected: FAIL porque a rota ainda não está registrada.

- [ ] **Step 3: Implementar a página**

Exibir título, introdução que liga “o que foi aprendido” a “como pode aparecer hoje”, e os capítulos em ordem fixa: Clássica/Origem → Jovem/Vida atual. A página deve ter retorno para Mundos. Textos longos ficam nos módulos de conteúdo.

- [ ] **Step 4: Registrar rotas e contexto**

Adicionar rota explícita da coleção em \`App.tsx\`. Em \`MundoTemas.tsx\`, mostrar rótulo do capítulo acima do título. IDs inválidos continuam redirecionando a \`/psicoeducacao/mundos\`.

- [ ] **Step 5: Verificar e commit**

Run: \`npm test -- src/pages/MundoMonica.test.tsx && npm run build\`

\`\`\`bash
git add src/pages/MundoMonica.tsx src/pages/MundoTemas.tsx src/pages/MundoMonica.test.tsx src/App.tsx
git commit -m "feat: add Mônica thematic journey routes"
\`\`\`

## Task 6: Criar oito páginas de tema, sem personalização clínica

**Files:**
- Create: \`src/pages/MonicaClassicaTema.tsx\`
- Create: \`src/pages/MonicaJovemTema.tsx\`
- Modify: \`src/App.tsx\`
- Create: \`src/pages/MonicaTema.test.tsx\`

**Interfaces:**
- Consumes: \`temasMonicaClassica\`, \`temasMonicaJovem\` e \`temaId\`.
- Produces: oito URLs de conteúdo e fallback seguro.

- [ ] **Step 1: Escrever teste de rota de Vida atual**

\`\`\`tsx
window.history.pushState({}, "", "/psicoeducacao/turma-da-monica-jovem/crencas");
render(<App />);
expect(await screen.findByText(/identidade|comparação|relações/i)).toBeVisible();
\`\`\`

- [ ] **Step 2: Rodar a falha esperada**

Run: \`npm test -- src/pages/MonicaTema.test.tsx\`

Expected: FAIL porque os templates e rotas não existem.

- [ ] **Step 3: Implementar templates**

Cada página mostra: contexto Origem/Vida atual, chamada, explicação, exemplos, pergunta reflexiva, nota de cuidado e links de retorno. Não incluir quiz, escores, badges, armazenamento ou inferência sobre o visitante.

- [ ] **Step 4: Implementar fallback de ID**

Se \`temaId\` não estiver no array correto, renderizar \`<Navigate to="/psicoeducacao/mundos/turma-da-monica" replace />\`; nunca página vazia.

- [ ] **Step 5: Verificar e commit**

Run: \`npm test -- src/pages/MonicaTema.test.tsx && npm run build\`

\`\`\`bash
git add src/pages/MonicaClassicaTema.tsx src/pages/MonicaJovemTema.tsx src/pages/MonicaTema.test.tsx src/App.tsx
git commit -m "feat: add Mônica psychoeducation topic pages"
\`\`\`

## Task 7: Validar navegador, acessibilidade e publicação

**Files:**
- Modify: \`README.md\` somente se já houver documentação de rotas de psicoeducação.

- [ ] **Step 1: Gerar e servir a prévia**

Run: \`npm run build && npm run preview -- --host 127.0.0.1\`

Expected: prévia local disponível.

- [ ] **Step 2: Executar roteiro manual**

Em desktop e 375 px: Mundos → coleção Mônica → Clássica → tema → voltar → Jovem → tema. Verificar também os URLs existentes de Torajo, Demon Slayer e Jujutsu Kaisen.

- [ ] **Step 3: Conferir acessibilidade e movimento**

Navegar por teclado, conferir nomes acessíveis dos links, ordem de foco, foco visível, retorno previsível e redução de movimento. A página deve manter contraste e nunca depender de hover.

- [ ] **Step 4: Rodar o portão final**

Run: \`npm run lint && npm test && npm run build\`

Expected: todos terminam com código 0.

- [ ] **Step 5: Conferir direito de uso antes de publicar**

Anexar ao PR/registro de deploy a origem e a autorização dos assets. Se faltar comprovação, manter placeholder neutro e não publicar elementos protegidos.

- [ ] **Step 6: Commit final**

\`\`\`bash
git add README.md
git commit -m "docs: document Mônica thematic worlds"
\`\`\`

## Revisão do plano

- Cobertura: dados, conteúdo, UX, rotas, páginas, testes, responsividade, acessibilidade e publicação possuem tarefas próprias.
- Limite de escopo: nenhum dado de paciente, Supabase ou mecanismo de exercício é alterado.
- Dependência externa: o uso de propriedade intelectual está explicitamente bloqueado até autorização; o fluxo permanece funcional com placeholders.

## Atualização de escopo: mundo temporal único

Esta seção substitui a ideia anterior de uma coleção com cartões “Clássica” e “Jovem”. As tarefas que criariam \`MundoCollectionCard\`, \`MundoChapterCard\` e uma página de escolha de capítulo devem ser substituídas pelos itens abaixo.

### Fluxo aprovado

\`\`\`text
Mundos temáticos
  → Turma da Mônica
    → escolha de Crenças, Distorções, Esquemas ou Modos
      → Origem: conteúdo Clássica
        → Avançar no tempo
          → Vida atual: conteúdo Jovem, no mesmo tema
\`\`\`

A troca temporal é sempre dentro do mesmo tema. Por exemplo, “Crenças” começa na infância e o botão carrega “Crenças” na vida atual; ele não leva a outro tema nem reinicia a navegação.

### Rotas e estado

- \`/psicoeducacao/mundos/turma-da-monica\`: hub do mundo único, com os quatro temas.
- \`/psicoeducacao/turma-da-monica/:temaId?tempo=origem\`: primeira parte; ausência de \`tempo\` equivale a \`origem\`.
- \`/psicoeducacao/turma-da-monica/:temaId?tempo=vida-atual\`: segunda parte, alcançada pelo botão “Avançar no tempo”.
- \`temaId\` inválido ou \`tempo\` diferente de \`origem|vida-atual\`: redirecionar ao hub do mundo.

A query string torna a etapa compartilhável e permite que o botão Voltar do navegador recupere o momento anterior. Nenhum estado clínico ou pessoal é salvo.

### Arquivos revisados

| Arquivo | Alteração |
| --- | --- |
| \`src/content/psicoed-mundos.ts\` | Um único \`Mundo\` com ID \`turma-da-monica\`; remover modelo de coleção/capítulos. |
| \`src/content/psicoed/monica-classica.ts\` e \`monica-jovem.ts\` | Dados indexados por \`temaId\`; cada tema tem as duas eras. |
| \`src/components/psicoed/LinhaDoTempoMonica.tsx\` | Indicador acessível “Origem → Vida atual”; etapa atual marcada por \`aria-current="step"\`. |
| \`src/components/psicoed/AvancarNoTempo.tsx\` | Ação primária que navega para o mesmo \`temaId\` com \`tempo=vida-atual\`. |
| \`src/pages/MundoMonica.tsx\` | Hub do mundo: introdução, linha do tempo e quatro temas; não há escolha entre versões. |
| \`src/pages/MonicaTema.tsx\` | Um único template que resolve \`temaId\` e \`tempo\`, renderiza o conteúdo correto e controla a transição. |
| \`src/App.tsx\` | Uma rota para o hub e uma rota temporal de tema; retirar rotas por versão. |

### Substituição das tarefas de implementação

1. Criar um único registro de mundo, título “Turma da Mônica”, descrição “Da infância à vida atual” e uma capa autorizada ou placeholder neutro.
2. Implementar \`MundoMonica\` como hub dos quatro temas. A primeira instrução deve explicar que a jornada começa na Origem e pode avançar no tempo ao final.
3. Criar \`MonicaTema\` com \`useParams()\` e \`useSearchParams()\`. Resolver \`tempo\` para \`"origem"\` por padrão e carregar o dado do mesmo \`temaId\` na era escolhida.
4. Na etapa Origem, renderizar somente um botão visível: “Avançar no tempo”. Seu destino deve ser \`/psicoeducacao/turma-da-monica/\${temaId}?tempo=vida-atual\`.
5. Na etapa Vida atual, substituir a ação por “Voltar à origem” e “Escolher outro tema”; não apresentar uma falsa continuação futura.
6. Escrever testes de rota para: entrada sem query abre Origem; avançar preserva \`temaId\`; URL de Vida atual mostra somente o conteúdo Jovem; query inválida volta ao hub.
7. Verificar em 375 px e desktop que a linha do tempo informa o estado também sem cor, possui foco correto e não requer animação para comunicar a mudança.
