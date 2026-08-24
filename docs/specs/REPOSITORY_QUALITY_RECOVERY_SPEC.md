# Recuperação integral da qualidade do repositório

**Spec ID:** `SPEC-REPOSITORY-QUALITY-RECOVERY-001`
**Versão:** `0.1`
**Status:** `APPROVED`
**Data:** `2026-08-24`
**Estratégia escolhida:** correção única e integrada.
**Aprovação:** confirmação explícita do usuário em `2026-08-24`.
**Gate seguinte:** escrever e aprovar o plano de implementação antes de editar código ou remover arquivos.

## 1. Objetivo

Restabelecer uma linha de base de qualidade confiável para o repositório inteiro, concluindo a limpeza segura já aprovada, cancelando integralmente a experiência Hogwarts e corrigindo todos os problemas reais de lint e typecheck sem ocultá-los.

A entrega será um único patch e um único commit. O patch só poderá ser considerado concluído quando todos os gates da raiz e do pacote independente `video/` estiverem verdes ao mesmo tempo.

Esta especificação não autoriza implementação. Ela fixa o contrato que o plano posterior deverá executar.

## 2. Decisões aprovadas e não reabertas

1. A limpeza segura e os planos aprovados anteriormente continuam válidos.
2. A experiência Hogwarts será removida, não reparada.
3. A fronteira de remoção Hogwarts é exata e está definida na seção 6.
4. `public/scenes/` e `docs/cenarios-modos-prompts.md` serão preservados.
5. `video/` é um pacote independente e terá verificações próprias.
6. Excluir `video/` do lint da raiz não poderá criar uma brecha de qualidade.
7. A implementação será uma correção única e integrada, seguida de um único commit.
8. Não serão desativadas regras, introduzidas exceções locais ou aceitas falhas parciais para produzir PASS.
9. O vertical slice do NeuroAtlas permanece um trabalho separado e não será implementado por esta correção.

## 3. Fontes de verdade e conflitos

Ordem de autoridade:

1. esta especificação, depois de aprovada;
2. decisões explícitas do usuário nesta conversa;
3. `docs/superpowers/plans/2026-08-24-safe-project-cleanup.md`;
4. `docs/superpowers/plans/2026-08-24-neuroatlas-vertical-slice.md`;
5. `docs/specs/NEUROATLAS_VERTICAL_SLICE_SPEC.md` versão `0.3`;
6. arquivos atuais do repositório.

Se uma correção exigir mudança de produto, contrato clínico, persistência, payload externo ou comportamento público não prevista aqui, a execução deve parar e registrar:

```text
CONFLICT DETECTED
FILE:
CURRENT CONTRACT:
REQUIRED CHANGE:
IMPACT:
RECOMMENDED DECISION:
```

O conflito não pode ser resolvido silenciosamente.

## 4. Estado local que deve ser preservado

A árvore de trabalho contém alterações do usuário e trabalho da limpeza aprovada. Não é permitido executar reset destrutivo, checkout de descarte, limpeza ampla ou sobrescrever arquivos inteiros para facilitar a correção.

Já existem, sem commit:

- exclusões aprovadas de `.claude-flow/`, `graphify-out/`, `public/admin/` e componentes sem consumidores;
- atualização de `.gitignore`, `README.md`, `package.json` e `scripts/check-repo-hygiene.mjs`;
- correções limitadas em `src/components/3d/BrainModel.tsx` para `brainstem` e anchors parciais seguros;
- outras alterações e arquivos não rastreados pertencentes ao usuário.

Regras de preservação:

1. registrar `git status`, diff e hashes relevantes antes da implementação;
2. editar `src/App.tsx` cirurgicamente, preservando todas as mudanças não relacionadas;
3. não remover arquivos não rastreados apenas por serem não rastreados;
4. não criar stash, reset ou commit intermediário como atalho;
5. o único commit ocorrerá depois do PASS integral.

## 5. Baseline verificado em 2026-08-24

### 5.1 Raiz após aplicar logicamente as fronteiras aprovadas

Ao ignorar somente `video/**` e os arquivos Hogwarts que serão removidos, o lint da raiz encontra:

```text
23 arquivos com erro
63 erros
1 aviso
```

Distribuição por regra:

| Regra | Quantidade |
|---|---:|
| `@typescript-eslint/no-explicit-any` | 20 |
| `react-hooks/set-state-in-effect` | 14 |
| `react-hooks/refs` | 8 |
| `no-useless-assignment` | 8 |
| `react-hooks/static-components` | 5 |
| `react-hooks/purity` | 4 |
| `prefer-const` | 1 |
| `react-refresh/only-export-components` | 1 |
| `react-hooks/immutability` | 1 |
| erro de parser | 1 |
| `@typescript-eslint/no-unused-vars` | 1 |

O typecheck global possui somente os dez erros associados aos arquivos Hogwarts cancelados depois das correções já feitas em `BrainModel.tsx`. A remoção desses arquivos deve levar o typecheck a zero; qualquer erro restante pertence ao patch.

Os testes legados passaram fora da restrição de travessia do sandbox:

```text
6 arquivos
65 testes
0 falhas
```

Também passam:

- `npm run check:repo-hygiene`;
- `npm run check:neuro-models`, com 62 referências, 4 pares obrigatórios e 83 modelos.

### 5.2 Pacote `video/`

- `video/tsconfig.json` é estrito e o typecheck atual passa;
- `video/package.json` não possui scripts de lint ou typecheck;
- não existe configuração ESLint própria;
- sob regras equivalentes às da raiz, há 8 erros:
  - 7 em `video/src/compositions/BrainModelRemotion.tsx`;
  - 1 em `video/src/compositions/NeuroLutaFuga.tsx`.

## 6. Cancelamento da experiência Hogwarts

### 6.1 Edição cirúrgica obrigatória

Remover de `src/App.tsx` somente:

- cinco imports de `ModosEsquemaCinema` e das quatro páginas de casas;
- as rotas:
  - `/psicoeducacao/modos-cinema`;
  - `/psicoeducacao/modos-cinema/lufa-lufa`;
  - `/psicoeducacao/modos-cinema/corvinal`;
  - `/psicoeducacao/modos-cinema/sonserina`;
  - `/psicoeducacao/modos-cinema/grifinoria`.

As URLs canceladas passarão pelo fallback existente `path="*"`, que redireciona para `/`. Nenhuma rota substituta ou tela morta será criada.

### 6.2 Allowlist exata de arquivos a remover

```text
download.cjs
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
src/components/HogwartsCrestInteractive.tsx
src/hooks/useCinematicScroll.ts
src/pages/GryffindorStory.tsx
src/pages/HufflepuffStory.tsx
src/pages/ModosEsquemaCinema.tsx
src/pages/RavenclawStory.tsx
src/pages/SlytherinStory.tsx
src/styles/CinemaScroll.css
src/styles/CrestInteractive.css
src/styles/HouseStory.css
```

Todos esses arquivos estão atualmente não rastreados. A implementação deve validar novamente seus caminhos absolutos antes da remoção.

### 6.3 Preservação explícita

Não remover nem editar por causa do cancelamento Hogwarts:

```text
public/scenes/
docs/cenarios-modos-prompts.md
```

Esses itens não possuem dependência operacional das rotas Hogwarts e foram explicitamente preservados pelo usuário.

## 7. Fronteira de qualidade entre raiz e `video/`

### 7.1 Projeto raiz

- `eslint.config.js` deve excluir `video/**` por fronteira de pacote, além dos artefatos já ignorados;
- `npm run lint` deve verificar todo o código pertencente à raiz;
- não será permitido ignorar nenhum dos 23 arquivos com erro;
- o comando de aceite deve tratar avisos como falha.

### 7.2 Pacote `video/`

`video/` deve possuir, dentro de sua própria fronteira:

- configuração ESLint flat local;
- dependências de desenvolvimento locais necessárias ao lint TypeScript e às regras de React Hooks;
- script `lint`;
- script `typecheck` usando seu próprio `tsconfig.json` e sua versão local do TypeScript;
- lockfile coerente com `video/package.json`;
- zero erros e zero avisos nos dois gates.

A configuração não deve importar a configuração da raiz nem depender de `node_modules` da raiz para funcionar. Regras específicas do Vite, como React Refresh, não são obrigatórias no pacote Remotion quando não correspondem ao seu runtime.

## 8. Inventário obrigatório da raiz

Todos os itens desta tabela pertencem ao escopo. As quantidades são baseline, não meta de supressão.

| Arquivo | Erros | Avisos |
|---|---:|---:|
| `src/components/3d/BrainModel.tsx` | 23 | 0 |
| `src/components/blog/RichBlock.tsx` | 1 | 0 |
| `src/components/exercicios/AcerteDistorcao.tsx` | 1 | 0 |
| `src/components/exercicios/Bussola.tsx` | 1 | 0 |
| `src/components/exercicios/CartaFonte.tsx` | 1 | 0 |
| `src/components/exercicios/ChuvaPreocupacoes.tsx` | 1 | 0 |
| `src/components/exercicios/CofreForças.tsx` | 2 | 0 |
| `src/components/exercicios/DiarioLapsos.tsx` | 1 | 0 |
| `src/components/exercicios/JardimMente.tsx` | 3 | 0 |
| `src/components/exercicios/LaboratorioPrevisoes.tsx` | 1 | 0 |
| `src/components/exercicios/ParesMente.tsx` | 1 | 0 |
| `src/components/exercicios/PontosTensao.tsx` | 1 | 0 |
| `src/components/exercicios/ReformulacaoHistoria.tsx` | 1 | 0 |
| `src/components/psicoed/Badge.tsx` | 2 | 0 |
| `src/components/psicoed/NarrativaEsquemaView.tsx` | 3 | 0 |
| `src/components/psicoed/useProgresso.ts` | 1 | 0 |
| `src/hooks/useConceituacaoIA.ts` | 1 | 0 |
| `src/pages/BlogPost.tsx` | 1 | 0 |
| `src/pages/bruno/Painel.tsx` | 5 | 0 |
| `src/pages/DeOndeVemPadroes.tsx` | 1 | 1 |
| `src/pages/Neuroanatomia3D.tsx` | 3 | 0 |
| `src/pages/paciente/Escala.tsx` | 6 | 0 |
| `src/pages/PesquisaPublica.tsx` | 2 | 0 |

Se a configuração correta de `video/` ou uma correção revelar um erro adicional genuíno nos arquivos em escopo, ele também deve ser corrigido no mesmo patch. Isso não autoriza ampliar a feature ou editar arquivos não relacionados.

## 9. Política de correção

### 9.1 Proibições

Não é permitido:

- adicionar `eslint-disable`, `eslint-disable-next-line` ou exceção equivalente;
- reduzir severidade de regra para esconder a linha de base;
- adicionar arquivo com erro à lista de ignores;
- usar `@ts-ignore`, `@ts-expect-error` sem erro contratual deliberado em teste, ou cast duplo para contornar tipos;
- trocar `any` por `unknown` sem narrowing real;
- alterar testes para aceitar comportamento incorreto;
- remover funcionalidade fora da allowlist Hogwarts;
- declarar PASS com aviso, teste pulado ou gate ausente.

### 9.2 Correções esperadas por família

- `no-explicit-any`: introduzir tipos de domínio, contratos de biblioteca ou `unknown` com narrowing verificável;
- `set-state-in-effect`: preferir estado derivado, inicializador lazy, atualização no evento responsável ou sincronização externa idempotente;
- `refs`: não ler ou escrever `ref.current` durante render; mover interação para evento, callback ref ou fase de efeito apropriada;
- `no-useless-assignment` e `prefer-const`: remover atribuição sem efeito preservando o valor realmente usado;
- `static-components`: mover definições estáveis para escopo de módulo e passar dados por props;
- `purity`: retirar relógio, aleatoriedade ou mutação do render; estabilizar o valor no ciclo de vida correto;
- `immutability`: produzir novos valores em vez de mutar entrada ou estado existente;
- React Refresh: separar exports não componentes quando necessário, sem desativar a regra;
- parser e variáveis não usadas: corrigir a sintaxe/configuração responsável e remover código morto local.

Correções mecânicas só são aceitas quando preservarem comprovadamente comportamento. Mudanças em hooks, refs, aleatoriedade, formulários, Supabase, armazenamento local ou 3D exigem teste direcionado ou evidência equivalente definida no plano.

## 10. Comportamentos que devem permanecer invariantes

Exceto pela remoção Hogwarts, o patch deve preservar:

- rotas públicas existentes;
- contratos de props e exports consumidos;
- chaves e formatos de `localStorage`/`sessionStorage`;
- payloads e tratamento de erros do Supabase;
- cálculos, pontuação e progressão dos exercícios;
- conteúdo clínico e psicoeducativo;
- modelos, câmera, seleção e interações do 3D;
- composição e resultado visual intencional do pacote Remotion;
- acessibilidade, foco e controles por teclado existentes;
- a especificação aprovada do NeuroAtlas.

Nenhum redesign, reescrita editorial ou refactor amplo será aceito como consequência desta recuperação.

## 11. Estratégia de patch único

Embora seja uma única entrega, o plano deve ordenar internamente o trabalho para permitir diagnóstico e reversão manual:

1. registrar checkpoint somente leitura da árvore atual;
2. criar ou fortalecer testes de caracterização nas correções de risco comportamental;
3. remover exatamente a experiência Hogwarts;
4. estabelecer a fronteira e os gates próprios de `video/`;
5. corrigir integralmente o inventário da raiz;
6. corrigir integralmente o inventário de `video/`;
7. executar todos os gates do zero;
8. revisar diff e allowlists;
9. criar um único commit.

Não haverá commit intermediário. Se qualquer gate falhar, o patch permanece incompleto e não deve ser publicado.

## 12. Estados de falha e resposta

| Falha | Resposta obrigatória |
|---|---|
| Arquivo de remoção fora da allowlist | Não remover; parar e registrar conflito. |
| Arquivo da allowlist mudou desde o baseline | Reinspecionar conteúdo e consumidores antes de remover. |
| Correção exige mudança de produto | Parar e pedir decisão; não inferir. |
| Novo lint de `video/` revela erro adicional | Corrigir se estiver dentro de `video/src`; não suprimir. |
| Dependência de qualidade não instala | Não usar dependência global ou da raiz como fallback silencioso. |
| Teste requer credencial ou serviço externo | Usar teste isolado/mock já autorizado; nunca criar chave, conta ou cobrança. |
| Teste legado falha após a correção | Tratar como regressão até demonstrar evidência contrária. |
| Build ou lint produz aviso | Considerar FAIL. |
| Diff contém arquivo não previsto | Excluir a edição do patch ou obter nova autorização. |

## 13. Critérios de aceite

### Cancelamento Hogwarts

- `AC-Q-001`: os cinco imports e as cinco rotas Hogwarts não existem em `src/App.tsx`.
- `AC-Q-002`: os 21 arquivos da allowlist da seção 6.2 não existem.
- `AC-Q-003`: busca global não encontra consumidores operacionais de `HogwartsCrestInteractive`, `useCinematicScroll`, das cinco rotas ou dos assets removidos.
- `AC-Q-004`: `public/scenes/` e `docs/cenarios-modos-prompts.md` permanecem intactos.
- `AC-Q-005`: uma URL Hogwarts cai no fallback existente e redireciona para `/`, sem erro de renderização.

### Fronteiras e tooling

- `AC-Q-006`: o lint da raiz não percorre `video/**`.
- `AC-Q-007`: nenhum outro arquivo-fonte da raiz é ignorado para obter PASS.
- `AC-Q-008`: `video/` executa lint e typecheck apenas com seu manifesto, lockfile, configuração e dependências locais.
- `AC-Q-009`: não há diretiva nova de supressão de lint ou TypeScript no patch.

### Qualidade da raiz

- `AC-Q-010`: `npm run lint -- --max-warnings=0` passa com zero erro e zero aviso.
- `AC-Q-011`: `npm exec tsc -- --project tsconfig.app.json --noEmit --pretty false` passa.
- `AC-Q-012`: `npm test -- --run` passa com os 65 testes legados e todos os testes adicionados, sem skip novo.
- `AC-Q-013`: `npm run build` passa.
- `AC-Q-014`: `npm run check:repo-hygiene` passa.
- `AC-Q-015`: `npm run check:neuro-models` passa e mantém 62 referências, 4 pares obrigatórios e 83 modelos, salvo mudança explicitamente autorizada por outra especificação.

### Qualidade de `video/`

- `AC-Q-016`: executado dentro de `video/`, `npm run lint -- --max-warnings=0` passa.
- `AC-Q-017`: executado dentro de `video/`, `npm run typecheck` passa com o TypeScript local.
- `AC-Q-018`: as duas composições do inventário não contêm os oito erros registrados nem substitutos suprimidos.

### Integridade e entrega

- `AC-Q-019`: testes direcionados demonstram preservação das áreas de risco alteradas.
- `AC-Q-020`: revisão final do diff mostra apenas a limpeza já aprovada, a remoção Hogwarts e os arquivos necessários à recuperação de qualidade.
- `AC-Q-021`: nenhum segredo, dado pessoal, artefato destrutivo ou arquivo gerado indevido entra no commit.
- `AC-Q-022`: existe exatamente um novo commit para toda esta correção e nenhum push/deploy é feito sem autorização específica.
- `AC-Q-023`: o resultado final registra comandos, códigos de saída e contagens suficientes para auditoria.

## 14. Evidência mínima da entrega futura

O relatório de conclusão deverá incluir:

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

Somente `PASS` integral autoriza chamar a correção de concluída.

## 15. Fora do escopo

- implementar o vertical slice do NeuroAtlas;
- alterar `public/scenes/` ou `docs/cenarios-modos-prompts.md`;
- redesenhar páginas ou exercícios;
- atualizar dependências não necessárias aos gates locais de `video/`;
- migrar frameworks, roteamento, Supabase ou persistência;
- renderizar ou publicar novos vídeos;
- deploy, push, criação de PR ou alteração remota;
- corrigir problemas não demonstrados pelos gates e não necessários para preservar os contratos desta especificação.

## 16. Gate de aprovação

Esta especificação foi aprovada e autoriza somente a redação do plano de implementação autocontido. O plano deverá indicar arquivos, testes, comandos, checkpoints, tratamento de conflitos e revisão final do patch único.

A implementação continuará bloqueada até a aprovação explícita desse plano.

## 17. Handoff

```text
TASK: SPEC-REPOSITORY-QUALITY-RECOVERY-001
STATUS: APPROVED

INPUTS:
- árvore de trabalho atual
- planos aprovados de limpeza e NeuroAtlas
- inventário ESLint da raiz e de video/
- decisões explícitas de remoção Hogwarts e fronteira de video/

OUTPUT:
- docs/specs/REPOSITORY_QUALITY_RECOVERY_SPEC.md

OPEN DECISIONS INSIDE THE SPEC:
- none

NEXT TASK:
- escrever o plano detalhado; não implementar
```
