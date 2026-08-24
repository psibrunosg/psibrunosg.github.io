# NeuroAtlas — especificação do vertical slice sincronizado

**Spec ID:** `SPEC-NEUROATLAS-VERTICAL-SLICE-001`
**Versão:** `0.3`
**Status:** `APPROVED`
**Data:** `2026-08-24`
**Aprovação:** confirmação explícita do usuário em `2026-08-24`.
**Gate seguinte:** aprovação explícita do plano de implementação. Nenhuma implementação está autorizada antes disso.

## 1. Objetivo

Validar o coração arquitetônico do NeuroAtlas com o menor fluxo completo:

```text
selecionar Hipocampo no 3D
→ mudar para 2.5D
→ continuar no Hipocampo
→ abrir TEPT
→ destacar o circuito piloto
→ voltar para 3D
→ ver as mesmas entidades destacadas
```

O slice prova continuidade de estado, equivalência de IDs e independência entre estado, conteúdo e renderizadores. Ele não tenta provar escala de conteúdo, migração geral do site ou acabamento visual.

## 2. Fontes de verdade e regra de conflito

Ordem de autoridade para este slice:

1. arquivos atuais do repositório;
2. esta especificação, depois de aprovada;
3. decisões `D001`–`D024` do `NEUROATLAS_HANDOFF.md` consolidado em `2026-08-24`;
4. auditoria read-only do NeuroAtlas de `2026-08-24`;
5. conversa.

Informação não definida por essas fontes permanece `UNKNOWN` e não pode ser inventada durante a implementação.

Se implementação e especificação divergirem, o agente deve registrar:

```text
CONFLICT DETECTED
SOURCE A:
SOURCE B:
IMPACT:
RECOMMENDED RESOLUTION:
```

O agente não pode resolver silenciosamente conflito arquitetônico, clínico, visual ou de dados.

## 3. Decisões aprovadas aplicadas sem reabertura

- 3D para explorar; 2.5D para entender.
- Um único Switch de visualização.
- Uma fonte de estado, dois renderizadores.
- Three.js direto por ES Modules no núcleo 3D.
- SVG DOM em camadas no 2.5D.
- Store JavaScript framework-agnostic.
- Conteúdo científico separado da UI.
- IDs anatômicos estáveis entre conteúdo, 3D e 2.5D.
- NeuroAtlas como módulo JavaScript independente do backend e do framework host.
- DSM-5-TR como camada clínica, sem equivalência diagnóstico ↔ área cerebral.
- Relações clínicas acompanhadas de limites e referências rastreáveis.
- O host React atual é temporário; não pode contaminar o núcleo do módulo.
- A arquitetura-alvo do site permanece PHP + HTML + CSS + JavaScript.

## 4. Escopo fechado

### Incluído

- rota host existente `/psicoeducacao/neuroanatomia`;
- módulo NeuroAtlas montável por uma API pública;
- modos `3d` e `25d`;
- três entidades: hipocampo, amígdala e córtex pré-frontal;
- uma condição clínica: TEPT;
- circuito piloto de ameaça, contexto e regulação;
- vista 2.5D medial esquemática;
- seleção, Switch, painel de conhecimento e destaque do circuito;
- equivalentes para mouse, touch e teclado;
- fallback textual e 2.5D se WebGL falhar;
- testes dos contratos e do fluxo completo.

### Fora do escopo

- PHP, autenticação, banco ou progresso persistente;
- limpeza geral do repositório;
- migração das demais rotas;
- learning engine, quiz e casos clínicos;
- TOC, depressão, TDAH ou outras condições;
- exploded view e controle de transparência;
- views lateral, sagital, coronal e axial;
- conversão global dos OBJ para GLB;
- motion cinematográfico entre 3D e 2.5D;
- arte 2.5D final;
- comparação entre condições;
- editor de conteúdo.

## 5. Baseline local obrigatório

O plano futuro deve partir deste baseline, sem apagar trabalho local:

- branch local: `main`, cinco commits atrás da referência local `origin/main` na auditoria de `2026-08-24`;
- árvore de trabalho com alterações do usuário, inclusive em `src/App.tsx`, `src/pages/Neuroanatomia3D.tsx` e `src/content/neuroanatomia.ts`;
- rota atual em `src/App.tsx`;
- página atual em `src/pages/Neuroanatomia3D.tsx`;
- renderer atual em `src/components/3d/BrainModel.tsx`;
- dados atuais em `src/content/neuroanatomia.ts`;
- verificador atual em `scripts/check-neuro-models.mjs`;
- `npm run check:neuro-models` passa com `62` referências, `4` pares obrigatórios e `83` modelos corticais;
- `npm exec tsc -- --project tsconfig.app.json --noEmit --pretty false` possui falhas preexistentes: três referências obsoletas a `context` no renderer 3D e erros em arquivos locais da experiência Hogwarts.

Regras:

1. não executar reset, checkout destrutivo ou limpeza ampla;
2. não editar arquivos da experiência Hogwarts para fazer o slice passar;
3. preservar as alterações locais de `brainstem` e dos novos conteúdos anatômicos;
4. separar, nos resultados de teste, falhas preexistentes de regressões introduzidas pelo slice;
5. o plano de implementação deve definir um checkpoint recuperável antes de qualquer edição;
6. a conclusão futura exige typecheck global verde; corrigir erros preexistentes somente com escopo explícito no plano aprovado.

## 6. Contrato de montagem e independência

O módulo expõe uma única entrada pública:

```ts
type NeuroAtlasStatePatch = Partial<
  Pick<
    NeuroAtlasState,
    | 'visualizationMode'
    | 'selectedEntityId'
    | 'selectedConditionId'
    | 'selectedCircuitId'
    | 'highlightedEntityIds'
    | 'anatomyView'
    | 'showLabels'
    | 'showConnections'
  >
>

type NeuroAtlasErrorCode =
  | 'HOST_INVALID'
  | 'INSTANCE_DESTROYED'
  | 'STATE_INVALID'
  | 'UNKNOWN_ID'
  | 'INVALID_STATE_COMBINATION'
  | 'LISTENER_FAILED'
  | 'WEBGL_UNAVAILABLE'
  | 'ASSET_LOAD_FAILED'
  | 'SVG_CONTRACT_INVALID'
  | 'RENDERER_INIT_FAILED'

type NeuroAtlasDiagnostic = {
  code: NeuroAtlasErrorCode
  message: string
  recoverable: boolean
  details?: Readonly<Record<string, string>>
}

type NeuroAtlasInstance = {
  getState(): Readonly<NeuroAtlasState>
  setState(patch: NeuroAtlasStatePatch): void
  subscribe(listener: (state: Readonly<NeuroAtlasState>) => void): () => void
  destroy(): void
}

createNeuroAtlas(options: {
  element: HTMLElement
  initialState?: NeuroAtlasStatePatch
  onError?: (diagnostic: NeuroAtlasDiagnostic) => void
}): NeuroAtlasInstance
```

Contratos:

- `element` inexistente ou desconectado lança erro antes de criar listeners ou renderizadores;
- `initialState` é validado como uma transação inteira antes de substituir defaults;
- `status` pertence ao ciclo de vida interno e não pode ser alterado por `initialState` ou `setState()`;
- `getState()` devolve snapshot imutável, incluindo uma cópia readonly de `highlightedEntityIds`;
- `setState()` rejeita o patch inteiro quando qualquer ID, enum ou combinação for inválida;
- rejeição síncrona lança erro com `code` estável e também chama `onError`, quando fornecido;
- falha assíncrona de renderer/asset chama `onError` uma vez por ocorrência e atualiza o fallback descrito na seção 15;
- `onError` recebe somente dados seguros para UI/log, sem stack, segredo ou conteúdo arbitrário do asset;
- `subscribe()` observa somente commits válidos, não é chamado no registro e retorna unsubscribe idempotente;
- cada commit chama cada listener ativo exatamente uma vez com o snapshot pós-commit;
- erro lançado por um listener não impede os demais listeners nem desfaz um commit já validado; ele gera `LISTENER_FAILED` recuperável no `onError`;
- `destroy()` é idempotente e remove listeners, subscriptions, `requestAnimationFrame`, canvas, SVG e recursos WebGL criados pela instância;
- repetir `destroy()` não causa erro;
- `getState()` após destruição devolve o último snapshot imutável;
- `setState()` e `subscribe()` após destruição são rejeitados com `INSTANCE_DESTROYED`;
- múltiplas instâncias não compartilham estado implícito.

O host React atual somente fornece o `HTMLElement`, chama `createNeuroAtlas()` e chama `destroy()` ao desmontar. Nenhum arquivo do núcleo NeuroAtlas pode importar React, React Three Fiber, Drei, Framer Motion ou código PHP/backend. Uma futura página PHP deve conseguir usar a mesma API.

## 7. IDs canônicos

```text
anat.hippocampus
anat.amygdala
anat.prefrontal

clinical.ptsd
circuit.threat-context-regulation

view.medial
```

Adapter legado:

```text
hippocampus → anat.hippocampus
amygdala    → anat.amygdala
prefrontal  → anat.prefrontal
tept        → clinical.ptsd
```

IDs canônicos nunca mudam conforme renderizador, idioma ou rota. Um ID desconhecido rejeita a mutação completa e preserva o estado anterior.

## 8. Estado compartilhado

```ts
type EntityId =
  | 'anat.hippocampus'
  | 'anat.amygdala'
  | 'anat.prefrontal'

type NeuroAtlasState = {
  visualizationMode: '3d' | '25d'
  selectedEntityId: EntityId | null
  selectedConditionId: 'clinical.ptsd' | null
  selectedCircuitId: 'circuit.threat-context-regulation' | null
  highlightedEntityIds: readonly EntityId[]
  anatomyView: 'view.medial'
  showLabels: boolean
  showConnections: boolean
  status: 'booting' | 'ready' | 'degraded' | 'error'
}
```

Estado inicial:

```ts
{
  visualizationMode: '3d',
  selectedEntityId: null,
  selectedConditionId: null,
  selectedCircuitId: null,
  highlightedEntityIds: [],
  anatomyView: 'view.medial',
  showLabels: true,
  showConnections: true,
  status: 'booting'
}
```

Invariantes:

1. alterar `visualizationMode` não modifica outro campo;
2. selecionar entidade mantém condição e circuito ativos;
3. abrir TEPT exige `selectedEntityId === 'anat.hippocampus'` no fluxo normativo e define condição, circuito e destaques exatamente como `['anat.amygdala', 'anat.hippocampus', 'anat.prefrontal']`;
4. o array de destaques usa sempre essa ordem canônica e não contém duplicatas;
5. abrir TEPT mantém `selectedEntityId` como `anat.hippocampus`;
6. fechar TEPT limpa condição, circuito e destaques, mas mantém entidade e modo;
7. `showConnections: false` oculta linhas, sem alterar `selectedCircuitId` ou a legenda textual;
8. `showLabels: false` oculta apenas labels visuais; nomes acessíveis permanecem;
9. renderizadores são consumidores do estado e não mantêm cópias concorrentes do estado pedagógico;
10. não há persistência entre reloads neste slice.
11. `status` só pode ser alterado pelo ciclo de vida interno dos renderizadores.

## 9. Assets 3D exatos e adapter

O slice reutiliza somente os oito OBJ abaixo. Nenhum outro arquivo de `public/models` entra no carregamento inicial.

| Asset ID | Entidade | Arquivo legado |
|---|---|---|
| `asset.hippocampus.left` | `anat.hippocampus` | `/models/MM164_BP58046_FMA72714_Left hippocampus proper.obj` |
| `asset.hippocampus.right` | `anat.hippocampus` | `/models/MM164M_BP58047_FMA72713_Right hippocampus proper.obj` |
| `asset.amygdala.left` | `anat.amygdala` | `/models/MM179_BP58076_FMA72833_Left amygdala.obj` |
| `asset.amygdala.right` | `anat.amygdala` | `/models/MM179M_BP58075_FMA72832_Right amygdala.obj` |
| `asset.prefrontal.middle-left` | `anat.prefrontal` | `/models/FJ3839_BP58174_FMA72656_Left middle frontal gyrus.obj` |
| `asset.prefrontal.middle-right` | `anat.prefrontal` | `/models/FJ3840_BP58164_FMA72655_Right middle frontal gyrus.obj` |
| `asset.prefrontal.superior-left` | `anat.prefrontal` | `/models/FJ3879_BP58158_FMA72654_Left superior frontal gyrus.obj` |
| `asset.prefrontal.superior-right` | `anat.prefrontal` | `/models/FJ3880_BP58162_FMA72653_Right superior frontal gyrus.obj` |

Valores legados preservados pelo adapter:

| Entidade | `modelCenter` | `cameraTarget` | `cameraPosition` |
|---|---|---|---|
| `anat.hippocampus` | `[0.01, -81.02, 1537.53]` | `[0, -0.06, -0.94]` | `[-4, -1, 2]` |
| `anat.amygdala` | `[0.04, -100.93, 1534.68]` | `[0, -1.05, -1.08]` | `[0, -1, 5]` |
| `anat.prefrontal` | `[-0.75, -111.66, 1588.49]` | `[0, -1.6, 1.6]` | `[0, 4, 8]` |

Esses valores são baseline de compatibilidade, não aprovação anatômica ou visual definitiva. O slice pode aplicar transformação comum de normalização, mas não pode alterar individualmente os valores sem registrar evidência visual no plano/teste.

O nó `anat.prefrontal` é amplo. Os quatro OBJ representam giros frontais médio e superior e não constituem uma demarcação precisa de vmPFC. A interface deve tornar essa limitação explícita sempre que usar evidência referente a vmPFC.

## 10. Conteúdo piloto e referências

### 10.1 Contrato de entidade

```ts
type SliceAnatomicalEntity = {
  id: EntityId
  name: string
  aliases: string[]
  summary: string
  visual3d: {
    assetIds: string[]
    modelCenter: [number, number, number]
    defaultCamera: {
      target: [number, number, number]
      position: [number, number, number]
    }
  }
  visual25d: {
    viewId: 'view.medial'
    elementIds: string[]
  }
  sourceIds: string[]
}
```

Textos anatômicos existentes são matéria-prima, não copy automaticamente aprovada. O slice deve usar linguagem descritiva e evitar causalidade clínica não sustentada.

### 10.2 Circuito

`circuit.threat-context-regulation` contém exatamente:

```text
anat.amygdala
anat.hippocampus
anat.prefrontal
```

Edges didáticos não direcionais:

```text
edge.amygdala-hippocampus
edge.hippocampus-prefrontal
edge.prefrontal-amygdala
```

As conexões representam relações funcionais didáticas, não um biomarcador diagnóstico individual. O slice não mostra setas nem ordem causal.

### 10.3 Copy clínica normativa

Título:

```text
TEPT: ameaça, contexto e regulação
```

Resumo:

> O TEPT envolve processos distribuídos de detecção de saliência e ameaça, memória contextual e regulação emocional. Estudos de grupo relacionam esses processos a padrões de atividade ou volume envolvendo amígdala, hipocampo e regiões pré-frontais. Esses achados não permitem diagnosticar uma pessoa por imagem cerebral nem afirmar que uma única estrutura causa o transtorno.

Notas por nó:

- `anat.amygdala`: estudos de grupo relacionam a amígdala à saliência de ameaça, expressão do medo e aprendizagem de extinção; os achados variam conforme tarefa e amostra.
- `anat.hippocampus`: participa da memória contextual e da recordação da extinção; estudos de grupo relatam diferenças de ativação ou volume médio, sem valor diagnóstico individual.
- `anat.prefrontal`: regiões pré-frontais, especialmente vmPFC nas fontes do slice, participam de processos regulatórios e da recordação da extinção; o destaque 3D amplo do piloto é uma aproximação didática e não uma demarcação de vmPFC.

Seção obrigatória `Limites da evidência`:

- associações de grupo não demonstram causalidade;
- resultados variam por amostra, tarefa e método;
- não existe biomarcador individual validado por este slice;
- o circuito é uma simplificação pedagógica de processos distribuídos;
- o nó pré-frontal 3D é anatomicamente amplo.

### 10.4 Fontes mínimas

| Source ID | Fonte | Uso permitido | Limite obrigatório |
|---|---|---|---|
| `SRC-PTSD-HAYES-2012` | Hayes JP, Hayes SM, Mikedis AM. DOI `10.1186/2045-5380-2-9`; PMID `22738125`. | Contextualizar achados funcionais distribuídos envolvendo amígdala e regiões pré-frontais/regulatórias. | Meta-análise de estudos heterogêneos; não autoriza causalidade ou inferência diagnóstica individual. |
| `SRC-PTSD-MILAD-2009` | Milad MR et al. DOI `10.1016/j.biopsych.2009.06.026`; PMID `19748076`. | Explicar, como estudo de grupo, relações entre recordação da extinção, hipocampo, amígdala e vmPFC. | Amostra pequena e tarefa específica; não generalizar para toda apresentação de TEPT. |
| `SRC-PTSD-LOGUE-2018` | Logue MW et al. DOI `10.1016/j.biopsych.2017.09.006`; PMID `29217296`. | Contextualizar associação de grupo entre TEPT atual e menor volume hipocampal médio. | Efeito pequeno, associação de grupo e desenho observacional; não é biomarcador individual. |

Cada bloco clínico possui `sourceIds`, `evidenceLimit` e `lastReviewed: '2026-08-24'`.

Links canônicos:

- `https://pubmed.ncbi.nlm.nih.gov/22738125/`
- `https://pubmed.ncbi.nlm.nih.gov/19748076/`
- `https://pubmed.ncbi.nlm.nih.gov/29217296/`

Conteúdo clínico nunca fica dentro do renderer nem hardcoded no componente host.

## 11. Renderer 3D

- Three.js direto, sem React Three Fiber ou Drei.
- Carregar somente os oito OBJ da seção 9.
- Clique ou toque no mesh seleciona a entidade canônica correspondente.
- A entidade selecionada recebe estado `selected` distinto de `circuit-highlighted`.
- Com circuito ativo, as três entidades ficam destacadas; o hipocampo continua visualmente identificável como seleção primária.
- Orbit e zoom permanecem disponíveis por pointer/touch.
- Botões HTML permitem resetar câmera e selecionar cada entidade sem depender do canvas.
- Câmera e seleção não modificam condição ou circuito.
- O loop de renderização pausa e recursos são descartados por `destroy()`.
- O renderer não carrega o córtex contextual completo nem qualquer OBJ fora da whitelist do slice.

## 12. Renderer 2.5D

- SVG responsivo com `viewBox="0 0 1200 800"`.
- Vista medial esquemática, explicitamente marcada como protótipo visual.
- Uma silhueta cerebral neutra fornece contexto; três grupos interativos representam as entidades piloto.
- IDs DOM seguros:

```text
anat-hippocampus
anat-amygdala
anat-prefrontal
```

- Cada grupo expõe `data-entity-id` com o ID canônico completo.
- Clique, toque, Enter e Espaço selecionam a entidade.
- Labels podem ser ocultados sem remover nomes acessíveis.
- Com circuito ativo, três edges sem seta conectam as entidades.
- Legenda textual lista os mesmos três nós, mesmo quando conexões visuais estão ocultas.
- O renderer nunca infere entidade a partir de cor, posição ou ordem DOM.
- Ausência de qualquer grupo esperado impede o renderer de assumir estado `ready`.

As formas e coordenadas finais do SVG são entregáveis do blockout no plano de implementação. Elas podem mudar após QA visual sem alterar IDs, estado, fluxo ou semântica desta spec.

## 13. Switch e fluxo normativo

O Switch possui rótulo visível `Visualização`, opções `3D` e `2.5D` e semântica de grupo de seleção.

1. A rota inicia em 3D.
2. O usuário seleciona o hipocampo.
3. `selectedEntityId` passa a `anat.hippocampus`.
4. O painel exibe resumo anatômico e a ação `Explorar relação com TEPT`.
5. O usuário muda para 2.5D.
6. O SVG abre em `view.medial`, com hipocampo selecionado e painel preservado.
7. O usuário ativa `Explorar relação com TEPT`.
8. Condição e circuito tornam-se ativos; as três entidades e conexões aparecem no SVG.
9. O usuário muda para 3D.
10. O renderer 3D destaca os mesmos três IDs, mantém o hipocampo como seleção primária e conserva o painel clínico aberto.

Trocar modo altera apenas `visualizationMode`. O controle de destino fica desabilitado somente enquanto esse renderer inicializa. Não há loading global se o outro modo já está utilizável.

## 14. Layout, input e acessibilidade

### Desktop de referência — `1440 × 900`

- visualização à esquerda;
- painel à direita com `360–420 CSS px`;
- Switch acima da visualização;
- nenhum controle cobre a seleção.

### Mobile de referência — `390 × 844`

- Switch e controles essenciais em barra superior compacta;
- visualização em toda a largura, altura mínima `360 CSS px`;
- painel abaixo da visualização ou bottom sheet não modal;
- alvos HTML/SVG com mínimo `44 × 44 CSS px`;
- lista textual de entidades sempre utilizável.

Entre `320` e `1920 CSS px`, não há rolagem horizontal da página.

Regras comuns:

- nenhuma ação depende só de hover, cor ou gesto;
- seleção usa cor mais contorno/ícone/texto;
- painel anuncia mudança de entidade em região de status não intrusiva;
- ordem de foco: Switch → controles → lista de entidades → painel;
- Escape fecha apenas tooltip/detalhe temporário e não limpa estado;
- `prefers-reduced-motion: reduce` elimina pulsos contínuos e limita transições a `100 ms`;
- legenda textual do circuito é obrigatória;
- HTML host mantém resumo textual e link de retorno à Psicoeducação sem JavaScript.

## 15. Estados de erro

| Falha | Comportamento obrigatório |
|---|---|
| `element` host inválido | `HOST_INVALID`, não recuperável; falhar antes de listeners/renderizadores. |
| Chamada mutável após `destroy()` | `INSTANCE_DESTROYED`, não recuperável para a instância; não recriar recursos. |
| `initialState` ou patch malformado | `STATE_INVALID`; rejeitar transação inteira e preservar estado anterior. |
| ID desconhecido | `UNKNOWN_ID`; rejeitar transação inteira e nunca limpar estado válido. |
| Combinação semanticamente inválida | `INVALID_STATE_COMBINATION`; rejeitar transação inteira. |
| WebGL indisponível | `WEBGL_UNAVAILABLE`, recuperável; `status: 'degraded'`, abrir 2.5D e oferecer `Tentar 3D novamente`. |
| OBJ de uma entidade falha | `ASSET_LOAD_FAILED`, recuperável; manter entidade na lista/painel, omitir só o mesh e permanecer `degraded`. |
| SVG ou grupo esperado ausente | `SVG_CONTRACT_INVALID`, não recuperável para esse payload; `status: 'error'` e conteúdo textual disponível. |
| Inicialização de renderer falha | `RENDERER_INIT_FAILED`; manter o último renderer utilizável e oferecer retry quando recuperável. |
| Renderer demora para iniciar | Manter `booting` local e painel utilizável; não inventar timeout fatal sem decisão no plano. |
| JavaScript desabilitado | Exibir resumo HTML e link de retorno; não há diagnóstico JS. |
| `destroy()` repetido | Não lançar erro nem manter recursos ativos. |

## 16. Acceptance criteria

### Estado e ciclo de vida

- `AC-N-001`: com hipocampo selecionado, alternar `3d → 25d → 3d` preserva todos os campos exceto `visualizationMode`.
- `AC-N-002`: ativar TEPT produz exatamente condição, circuito, edges e o array ordenado de IDs definidos nesta spec.
- `AC-N-003`: patch com ID ou combinação inválida não altera o estado anterior.
- `AC-N-004`: `destroy()` repetido remove subscriptions, listeners, frames, canvas, SVG e recursos criados sem erro.
- `AC-N-005`: duas instâncias montadas em hosts diferentes não compartilham estado.
- `AC-N-006`: `status` não é aceito por `initialState` nem pela API pública `setState()`.
- `AC-N-007`: listener recebe exatamente um snapshot imutável por commit válido; patch rejeitado não notifica.
- `AC-N-008`: cada falha contratual emite o código estável correspondente sem mutação parcial.

### Assets e renderizadores

- `AC-N-009`: o loader solicita somente os oito arquivos OBJ da whitelist.
- `AC-N-010`: clicar no mesh e ativar o grupo SVG do hipocampo produzem o mesmo `selectedEntityId`.
- `AC-N-011`: com circuito ativo, ambos os renderizadores recebem o mesmo array ordenado de IDs.
- `AC-N-012`: falha forçada de WebGL mantém fluxo, conteúdo e seleção disponíveis em 2.5D/texto.
- `AC-N-013`: nenhum arquivo do núcleo importa React, React Three Fiber, Drei, Framer Motion ou backend.
- `AC-N-014`: verificador de modelos valida existência e mapping canônico dos oito assets.

### Fluxo principal

- `AC-N-015`: o fluxo normativo da seção 13 completa sem reset, erro ou perda do painel.
- `AC-N-016`: o mesmo fluxo completa apenas com teclado.
- `AC-N-017`: em `390 × 844`, Switch, três entidades, ação de TEPT e painel são alcançáveis sem rolagem horizontal.
- `AC-N-018`: com reduced motion, não há pulso contínuo e transições não excedem `100 ms`.

### Conteúdo e rigor científico

- `AC-N-019`: todo bloco clínico possui `sourceIds`, `evidenceLimit` e `lastReviewed: '2026-08-24'`.
- `AC-N-020`: cada `sourceId` resolve para um dos três registros e links definidos.
- `AC-N-021`: busca automatizada não encontra relação do tipo `TEPT = <estrutura>` nem afirmação de biomarcador individual nos conteúdos do slice.
- `AC-N-022`: conteúdo referente a vmPFC mostra a limitação do mesh `anat.prefrontal` no mesmo contexto acessível.
- `AC-N-023`: circuito visual possui alternativa textual com os mesmos três IDs.

### Baseline e qualidade

- `AC-N-024`: nenhuma alteração do slice toca arquivos não relacionados sem previsão no plano aprovado.
- `AC-N-025`: `npm run check:neuro-models` passa com os mappings canônicos adicionados.
- `AC-N-026`: testes unitários cobrem store, validação transacional, diagnósticos, adapter e ciclo de vida.
- `AC-N-027`: teste de integração cobre o fluxo normativo e o fallback WebGL.
- `AC-N-028`: lint, typecheck, testes e build globais passam antes da declaração de conclusão; falhas preexistentes devem ser resolvidas por tarefa explicitamente prevista, não ocultadas.

## 17. Critério de aprovação desta especificação

Esta especificação está pronta para aprovação porque:

- preserva as decisões `D001`–`D024`;
- separa protótipo, migração PHP futura e limpeza geral;
- fixa rota, API pública, IDs, estado, invariantes, assets, fluxo, copy clínica, limites, erros, mobile e testes;
- registra o baseline local sem sobrescrever mudanças do usuário;
- não transforma TEPT em mapa de estruturas isoladas;
- não deixa decisão arquitetônica aberta dentro do slice;
- mantém geometria de blockout e detalhes de organização de arquivos como assuntos do plano, sem alterar os contratos.

A especificação recebeu aprovação explícita do usuário em `2026-08-24`. A próxima entrega é um plano de implementação autocontido, em tarefas pequenas, com checkpoints, arquivos, comandos, testes e rollback. A implementação continua bloqueada até aprovação desse plano.

## 18. Handoff

```text
TASK: SPEC-NEUROATLAS-VERTICAL-SLICE-001
STATUS: APPROVED

INPUTS:
- START_HERE_CODEX.md
- AGENTS.md do pacote NeuroAtlas
- NEUROATLAS_HANDOFF.md v0.2
- NEUROATLAS_AUDIT.md
- arquivos atuais do repositório
- referências PubMed 22738125, 19748076 e 29217296

OUTPUT:
- docs/specs/NEUROATLAS_VERTICAL_SLICE_SPEC.md

VALIDATION:
- auditoria do estado atual
- conferência de rota, dependências, assets e IDs legados
- verificador de modelos PASS
- baseline de typecheck registrado
- metadados e limites das três fontes clínicas conferidos
- revisão de escopo, estados, erros, acessibilidade e acceptance criteria

OPEN ISSUES INSIDE THE SLICE:
- none

NEXT TASK AFTER USER APPROVAL:
- escrever o plano detalhado de implementação; não implementar ainda
```
