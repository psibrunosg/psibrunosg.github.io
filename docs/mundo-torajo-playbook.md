# Playbook: territórios "Mundo Torajo" (psicoeducação incrível)

Guia de como o território **Esquemas Iniciais Desadaptativos**
(`/psicoeducacao/esquemas`) foi construído, pra repetir o processo nos
próximos (Crenças Centrais, revamp de Distorções/Modos, etc) sem redescobrir
os mesmos buracos.

Referência: [2026-07-28-esquemas-torajo-design.md](superpowers/specs/2026-07-28-esquemas-torajo-design.md)
(spec original aprovada). Este arquivo é o "como fazer", aquele é o "o que foi
decidido para essa página específica".

## 0. Contexto do universo Mundo Torajo

- Material fonte: `G:\Meu Drive\Torajo\` — HTMLs estáticos estilo PDF
  (`index.html` = Distorções, `crencas.html`, `esquemas.html`, `modos.html`) +
  7 renders de personagem (`torajo.png`, `morajo.png`, `zulmi.png`, `linn.png`,
  `pessy.png`, `azedo.png`, `margo.png`) + `fundo.png`.
- Cada HTML segue o mesmo template: capa → intro → N "páginas" de conteúdo,
  cada uma com `number-badge`, `distortion-title`/`subtitle` (EN), `oque-e`,
  `char-badge` (qual personagem), `description` (o personagem vivendo aquilo),
  `quote-box` (frase em personagem), `vida-box` ("E na sua vida?").
- **Personagens → cor** (puxada da arte, um por fruta): Torajo verde `#4CAF50`,
  Morajo roxo `#8B5FBF`, Zulmi azul `#4C5FD6`, Linn amarelo `#D6BB2E`, Pessy
  laranja `#E8833A`, Azedo vermelho `#E4483F`, Margo rosa `#F0578F`.
- Site já tem infra própria (não confundir): `src/pages/DeOndeVemPadroes.tsx` +
  `src/content/psicoed/narrativas-esquemas.ts` é o sistema **clínico** dos 18
  esquemas do YSQ, com narrativas autorais aprovadas pelo terapeuta e ligado a
  escore de paciente. O território Torajo é a versão **pública/lúdica**, sem
  paciente, sem escore — ao final, linka pro clínico pra quem quiser
  aprofundar. Não mexer no clínico ao criar um território Torajo novo.

## 1. Passo a passo (repita pra cada território novo)

1. **Ler o HTML fonte** (`G:\Meu Drive\Torajo\<nome>.html`) e extrair o
   conteúdo estruturado (título, subtítulo EN, oQueE, personagem, descrição,
   frase, vidaBox) pra um array TypeScript. Ver `src/content/psicoed/esquemas.ts`
   como modelo — é dado puro, sem lógica de UI, e reaproveita o texto original
   quase 1:1 (só adaptei/expandi onde fazia sentido, ver passo 6).
2. **Copiar assets**: os 7 PNGs (+ fundo, se usar) de `G:\Meu Drive\Torajo\`
   pra `public/img/torajo/` (já existe, não precisa recriar — os personagens
   são os mesmos em todos os territórios).
3. **Criar a página** em `src/pages/<Nome>.tsx` seguindo o padrão de
   `EsquemasIniciais.tsx` (ver seção 3 abaixo pra arquitetura).
4. **Registrar**:
   - Rota em `src/App.tsx` (import + `<Route>`).
   - Entrada em `territorios` (`src/content/psicoed.ts`) com ícone, posição no
     mapa, rota.
   - Se precisar de ícone novo, adiciona no union type `Territorio.icone` +
     importa no mapa de ícones do `MapaExploratorio.tsx`.
5. **Testar local** (seção 4) antes de mexer em conteúdo/estilo — pega os bugs
   de plataforma cedo.
6. **Enriquecer o texto** além do material original: o HTML fonte é só
   personagem+frase+dica. Adicionei um campo `origem` ("de onde costuma vir",
   1 frase sobre infância/formação) pra dar profundidade sem virar aula. Pode
   adicionar mais campos assim, mas **pergunta antes quantos blocos de texto
   cabem na tela** (ver seção 5 — isso já causou retrabalho).
7. **Deploy**: `npm run build` local primeiro (pega erro de TS/build antes do
   CI), depois `git add` + commit + `git push origin main`. O
   `.github/workflows/deploy.yml` builda e publica sozinho no push pra main
   (sem staging, sem branch de preview — é produção direto). Confirmar com o
   Bruno antes do push, é ação visível/irreversível.

## 2. Stack usada (e por que essa, não outra)

| Pedaço | Lib | Por quê |
|---|---|---|
| Scroll-driven reveal/pin | `gsap` + `ScrollTrigger` | Pedido explícito do Bruno (queria usar GSAP). Já registrado globalmente no topo da página (`gsap.registerPlugin(ScrollTrigger)`). |
| Fundo ambiente 3D | `@react-three/fiber` + `three` (já instalados, usados em `Neuroanatomia3D.tsx`) | Reaproveita dependência existente, não adiciona peso novo. |
| Microanimação decorativa | `lottie-web` **direto** (NÃO `lottie-react`) | Ver bug crítico na seção 4. |
| Nav/footer/tema | Framer Motion + componentes compartilhados (`MobileMenu`, `EthicalFooter`, `SkipLink`, `WhatsAppFloat`, `contato` de `@/content/copy`) | Padrão de toda página de território do site. |

## 3. Arquitetura de arquivos (por território)

```
src/content/psicoed/<territorio>.ts       # dados puros (array de itens + personagens)
src/pages/<Territorio>.tsx                # página: hero + N cenas + fechamento
src/components/psicoed/LensShardsBackground.tsx  # fundo 3D — REAPROVEITAR, não recriar
public/img/torajo/*.png                   # já existe, reaproveitar
public/media/lottie/*.json                # 1 arquivo por microanimação (ver seção 6)
```

`LensShardsBackground` é genérico (recebe só uma `color` e faz lerp suave) —
não precisa de versão nova por território, só importar.

## 4. Bug crítico: `lottie-react` quebra sob Vite 8

`lottie-react` (wrapper React de `lottie-web`) causa
`Element type is invalid: expected a string ... but got: object` e a página
inteira fica com `<div id="root"></div>` vazio, **sem erro nenhum no console
do browser** — só aparece no log do servidor Vite (`[Unhandled error]`). Não é
bug de cache do Vite (testei limpar `node_modules/.vite` e reiniciar do zero,
mesmo erro). É incompatibilidade real entre o wrapper e esse Vite/React.

**Solução**: não usar `lottie-react`. Usar `lottie-web` diretamente (já é
dependência transitiva de qualquer coisa que use lottie, mas melhor declarar
direto no `package.json`):

```ts
import lottie, { type AnimationItem } from "lottie-web";

function useLottiePlayer(data: object | null, opts: { loop?: boolean; autoplay?: boolean } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  useEffect(() => {
    if (!containerRef.current || !data) return;
    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: opts.loop ?? false,
      autoplay: opts.autoplay ?? true,
      animationData: data,
    });
    return () => { animRef.current?.destroy(); animRef.current = null; };
  }, [data]);
  return { containerRef, animRef };
}
```

Uso: `<div ref={containerRef} className="w-56 h-56" />` — sem componente
`<Lottie>` nenhum. Pra tocar em reverso (ex: fechamento "lentes se
recompondo"): `anim.setDirection(-1); anim.goToAndPlay(anim.totalFrames, true);`.

**Nota de lint**: se o `containerRef` vier de um hook customizado (não
`useRef()` direto no componente), o eslint-plugin-react-hooks novo (`v7`,
regra `react-hooks/refs`) as vezes falso-positiva em `ref={hook.containerRef}`
(acesso por member-expression). Resolve destruturando pra uma variável local
antes do JSX (`const containerRef = hook.containerRef`) — aí o linter aceita.

## 5. Bug: `pin: true` + texto de tamanho variável = corte de conteúdo

Cada cena usa `ScrollTrigger.create({ trigger, start: "top top", end: "+=100%", pin: true })`
pra travar a cena em tela cheia enquanto anima. Isso **trava a altura em
exatamente 1 viewport** — se o conteúdo de texto for maior que isso, ele
simplesmente corta (sem scroll, sem aviso).

O que resolve (na ordem que o Bruno pediu, testado e funcionando):
1. **Não** adicionar `overflow-y-auto` no card de texto — ele pediu
   explicitamente sem scroll interno (sensação de "preso", ruim dentro de um
   pin).
2. Reduzir tamanho/espaçamento até caber: títulos menores (`text-xl md:text-2xl`
   em vez de `text-3xl md:text-4xl`), corpo em `text-sm`/`text-xs`,
   `leading-snug` em vez de `leading-relaxed`, paddings de card/caixas de
   `p-5` pra `p-3`, gaps de grid de `gap-10` pra `gap-6`, imagem do
   personagem menor (`md:h-[46vh]` em vez de `md:h-[60vh]`), padding vertical
   da seção reduzido (`py-8 md:py-10` em vez de `py-20`).
3. **Antes de adicionar campo de texto novo**, pergunta quantos blocos cabem —
   descobri isso tarde (adicionei "De onde costuma vir" + "Experimente essa
   semana" junto, estourou, tive que cortar um).
4. Se mesmo assim não couber pra algum item específico, a saída correta é
   **encurtar o texto daquele item**, não adicionar scroll — mantém a
   sensação de "cena fixa" que é o ponto todo do pin.

## 6. Sourcing de assets Lottie (LottieFiles, grátis, sem baixar arquivo errado)

LottieFiles não deixa baixar o `.json` puro de forma óbvia — o link direto
fica embutido no HTML da página de detalhe (React Router + Remix). Caminho
que funcionou:

1. Abrir a página de detalhe da animação no browser
   (`https://lottiefiles.com/free-animation/<slug>` ou
   `/free-animations/<tag>` pra listagem).
2. Rodar no console:
   ```js
   window.__reactRouterContext.state.loaderData['en-free-animation-detail'].data.lottiePath
   // ou, numa página de listagem por tag:
   window.__reactRouterContext.state.loaderData['en-free-animations-tag-detail'].animations
     .map(a => ({name: a.name, lottiePath: a.lottiePath}))
     .filter(a => a.lottiePath)  // presença de lottiePath = asset realmente grátis
   ```
3. O `lottiePath` é um `.lottie` (zip dotLottie), não JSON puro. Baixar com
   `curl` e extrair:
   ```bash
   curl -sL -o x.lottie "<lottiePath>"
   unzip -o x.lottie -d x_extraido   # dá animations/<id>.json — é esse que usa
   ```
4. Guardar o JSON extraído em `public/media/lottie/<nome-descritivo>.json`.

Usei assim: `coracao-partido.json` (abertura, coração se partindo) e
`vidro-estilhacado.json` (vidro colorido estilhaçando — toca normal na
abertura, e em reverso no fechamento, um asset só pra dois momentos).

## 7. Ambiente de preview local (armadilhas do harness)

- `.claude/launch.json` já tem config `"site"` (porta 5174). Às vezes
  `preview_start({name: "site"})` falha com erro de porta 3000 conflitando
  com "outra sessão" mesmo configurando `autoPort`/porta explícita — parece
  bug do broker de portas do harness, não do projeto. **Contorno**: subir o
  vite manualmente (`Bash` com `run_in_background: true`,
  `npx vite --port 5174 --strictPort`) e depois
  `preview_start({url: "http://localhost:5174"})` — isso funciona.
- `preview_start({url})` só aceita a **origem** (sem path) — pra abrir uma
  rota específica, chama `navigate` depois, separado.
- Quando o painel de preview não tá aberto do lado do usuário,
  `window.innerHeight` fica `0` e `computer{screenshot}` falha
  ("pane is not displayed"). Isso quebra qualquer verificação visual
  ou de scroll (`vh`, `scrollIntoView`, etc não têm como ser confirmados
  daqui). Nesses casos: verificar só o que dá (DOM presente, contagem de
  elementos, console sem erro, lint/typecheck limpos) e pedir pro usuário
  confirmar visualmente no navegador dele — não fingir que "parece bom".

## 8. Geração de pose nova via IA (não resolvido ainda — próxima vez começar por aqui)

Bruno queria pose de "andando" gerada por IA a partir do render único de cada
personagem (referência + prompt de pose). Tentativas nessa sessão, todas
bloqueadas:

1. **Open-Generative-AI** (GitHub Anil-matcha) — só o instalador (.exe)
   parado no Downloads, nunca rodado. É app desktop Electron; mesmo instalado,
   Claude Code não controla GUI nativa Windows (só navega páginas web).
   Versão web existe (`muapi.ai`) mas exige conta/créditos.
2. **Gerador Higgsfield já integrado no Claude Code** (`generate_image` /
   modelo `autosprite`, que literalmente anima 1 imagem em spritesheet de
   "walk" — seria ideal) — bloqueado por **saldo zero**
   (`balance` = 0 créditos, sem trial grátis disponível).
3. **Chave Gemini/Google própria do Bruno** — a chave copiada do AI Studio
   (formato `AQ.xxx`) foi **rejeitada** pela Generative Language API com
   `ACCESS_TOKEN_TYPE_UNSUPPORTED` (testado via query param `?key=` e via
   header `x-goog-api-key`, mesmo erro nos dois). Sugestão pra próxima vez:
   confirmar no ai.google.dev que o projeto tem a *Generative Language API*
   habilitada (não só "Gemini API" no nome) e gerar uma chave nova de lá — o
   formato usual de chave que funciona começa com `AIzaSy...`; se vier
   `AQ....` de novo, provavelmente é chave de outro produto/fluxo OAuth, não
   serve pra chamada REST direta com `?key=`.

**Importante sobre segurança**: nunca colar chave de API direto no chat — se
acontecer, tratar como comprometida e revogar/gerar nova depois. Prefira
sempre variável de ambiente (`GEMINI_API_KEY` etc) que o próprio Bruno seta
localmente.

Enquanto isso não resolve, a "entrada andando" é simulada com o render único +
GSAP (deslizar da lateral + bamboleio vertical rápido + leve giro — ver
`EsquemasIniciais.tsx`, o `timeline` dentro do `useEffect` principal). Fica
razoável, mas se quiser pose de verdade, resolver o item de crédito/chave
primeiro.

## 9. Atualização 2026-07-29: componente genérico + 3 territórios feitos

Depois do primeiro território (Esquemas), fizemos os outros três de uma vez:
**Crenças Centrais** (novo, 8 itens), **Distorções Cognitivas** (revamp do
antigo módulo de quiz) e **Modos do Esquema** (revamp do antigo
quiz+simulador). Mudanças no processo que valem pra próxima vez:

- **Não copie `EsquemasIniciais.tsx` de novo.** Extraí o miolo (hero + N cenas
  + fechamento + GSAP + Lottie + fundo 3D) pra
  `src/components/psicoed/TerritorioTorajo.tsx`, componente genérico que
  recebe `itens: CenaTorajo[]` + copy do hero/fechamento via props. Cada
  território novo agora é um arquivo de ~20 linhas (ver `CrencasCentrais.tsx`,
  `Distorcoes.tsx`, `ModosEsquema.tsx`) que só importa o componente + o
  content `.ts`. `EsquemasIniciais.tsx` ficou como está (não vale o risco de
  mexer numa página já testada só pra usar o componente novo).
- **`personagens` (cor/imagem por personagem) virou compartilhado**:
  `src/content/psicoed/personagens.ts`. `esquemas.ts` re-exporta de lá (não
  duplica mais). Todo content `.ts` novo importa `PersonagemId` de lá.
- **Sem `origem`/`microPratica` nos territórios novos** — só os 7 blocos que
  já existem no HTML fonte (número, título, subtítulo EN, oQueE, descrição,
  frase, vidaBox). A seção 5 documentava que adicionar blocos extras sem
  perguntar já causou estouro de altura; manter no que a fonte já tem evita o
  problema de novo, sem precisar perguntar de novo.
- **Personagem que não é um dos 7 fixos** (Modos #09 "Toda a Turma" e #10
  "Você!" — a fonte usa a imagem do Torajo mas o texto do badge é outro):
  campo opcional `personagemLabel` no item, sobrescreve o nome padrão só no
  badge, sem precisar de um 8º "personagem" fake no mapa de cores.
- **Lottie reaproveitado**: os mesmos dois JSONs
  (`coracao-partido.json`/`vidro-estilhacado.json`) servem pra todos os
  territórios — não precisa sourcing novo do LottieFiles (seção 6) a cada
  território, só reaproveitar os que já existem em `public/media/lottie/`.
- **Revamp de território existente (Distorções, Modos) = trocar o arquivo da
  página inteiro**, mantendo a mesma rota. Os exports antigos de
  quiz/flashcard (`distorcoesQuiz`/`distorcoesFlashcards` em
  `src/content/psicoed.ts`, `modosQuiz`/`modosFlashcards`/`cenariosModo` em
  `src/content/psicoed/modos.ts`) ficaram órfãos — não deletei nessa sessão
  (fora de escopo), mas é dead code pra limpar depois.
- **Harness**: além da porta 3000 vs 5174 (seção 7), reparei que depois de um
  `navigate` dentro da SPA (client-side route), o resultado da própria
  chamada `navigate` às vezes mostra a URL antiga/base mesmo a rota tendo
  mudado de verdade — confirma pelo `document.title` ou `get_page_text`, não
  pela string de URL que a tool devolve.

## 11. Atualização 2026-07-29 (2): página "A Turma do Mundo Torajo"

Em vez de deletar o conteúdo órfão apontado na seção 9 (quiz/flashcards de
Distorções, quiz/flashcards/simulador de Modos), criamos
`src/pages/PersonagensTorajo.tsx` (rota `/psicoeducacao/personagens`) — hub
com os 7 personagens; escolher um mostra, cruzando os 4 arrays de conteúdo
(`crencas`, `distorcoesTorajo`, `esquemas`, `modosTorajo`), quais itens aquele
personagem representa em cada território, com link pra lá. Abaixo, seção
"Pratique" reaproveita o quiz/flashcards/simulador antigos (que ficariam
mortos) em abas.

- **Atenção**: esse conteúdo de quiz (`distorcoesQuiz`/`distorcoesFlashcards`
  em `src/content/psicoed.ts`, `modosQuiz`/`modosFlashcards`/`cenariosModo` em
  `src/content/psicoed/modos.ts`) **não é sobre os personagens Torajo** — é o
  módulo clínico genérico que existia antes (ex: `modosQuiz` usa o framework
  de 4 modos largos — Criança Vulnerável, Protetor Desligado, Crítico Interno,
  Adulto Saudável —, diferente dos 10 modos do Young usados em
  `modos-torajo.ts`). Por isso a seção "Pratique" é rotulada como genérica
  ("não amarrados a um personagem específico"), não como parte do perfil do
  personagem selecionado — não force esse tipo de conteúdo a parecer que é
  sobre o personagem, é enganoso.
- `MiniSimuladorModos` (antes só dentro de `ModosEsquema.tsx`) virou
  componente compartilhado em `src/components/psicoed/MiniSimuladorModos.tsx`
  (aceita `cenarios` via prop em vez de importar fixo).
- Não virou território no mapa (`territorios[]`) — só um link de texto em
  `Psicoeducacao.tsx`, abaixo do grid.
- Rota registrada em `App.tsx`; `useProgresso("distorcoes-cognitivas")` /
  `useProgresso("modos-do-esquema")` continuam funcionando aqui, mesmos ids
  de antes (progresso de paciente não perde histórico).

## 13. Atualização 2026-07-29 (3): Demon Slayer e Jujutsu Kaisen (⚠️ não públicos)

Mesmo padrão de scrollytelling aplicado a dois universos de terceiros, a
partir de material em `G:\Meu Drive\Demons slayer\` e
`G:\Meu Drive\Jujutsu Kaisen\` (mesmos 4 arquivos por universo: `crencas.html`,
`distorcoes.html`, `esquemas.html`, `modos.html` + `fundo.png` + PNGs de
personagem).

- **⚠️ Direitos autorais**: diferente do Mundo Torajo (IP própria do Bruno),
  os personagens de Demon Slayer e Jujutsu Kaisen são arte oficial de
  terceiros (Koyoharu Gotouge/Shueisha/Aniplex; Gege Akutami/Shueisha/MAPPA).
  Isso foi sinalizado explicitamente antes de codar, com risco explicado
  (reclamação de direitos autorais numa página comercial/profissional).
  Decisão do Bruno, confirmada duas vezes: seguir mesmo assim, **e depois
  também indexar os 8 territórios no mapa público** (`territorios[]`, cards
  visíveis em `/psicoeducacao`, mesmo padrão dos outros 9). Não ficou nada
  "escondido" — se algum dia precisar reverter por causa de direitos
  autorais, é só remover as 8 entradas de `territorios[]` em
  `src/content/psicoed.ts` (as rotas em si podem continuar existindo, só
  não indexadas — ver seção 11 do PersonagensTorajo pra esse padrão
  "não-linkado").
- **Componente `TerritorioTorajo` generalizado**: antes recebia o mapa de
  personagens do Mundo Torajo fixo via import. Agora recebe via prop
  `personagens: Record<string, Personagem>` — qualquer elenco serve. O campo
  `CenaTorajo.personagem` virou `string` (antes `PersonagemId` do Torajo).
  `Personagem.id` (em `personagens.ts`) também virou `string` genérico. Os 4
  callers antigos (`CrencasCentrais`, `Distorcoes`, `ModosEsquema`,
  `EsquemasIniciais` — este não usa o componente) foram atualizados pra passar
  `personagens={personagens}` explicitamente.
- **Rotas**: `/psicoeducacao/<mundo>/<territorio>` — ex:
  `/psicoeducacao/demon-slayer/crencas`,
  `/psicoeducacao/jujutsu-kaisen/modos`. Assets em
  `public/img/demon-slayer/*.png` e `public/img/jujutsu-kaisen/*.png`
  (copiados 1:1 da pasta fonte, mesmos nomes de arquivo).
- **Cores por personagem**: nenhum dos dois materiais fonte definia cor por
  personagem (diferente do Torajo, que já vinha com "1 cor por fruta"). Defini
  uma cor hex por personagem a mão (inspirada no visual canônico de cada um —
  ex: Gojo azul-céu, Tanjiro verde, Sukuna vermelho) em
  `personagens-demon-slayer.ts` / `personagens-jujutsu-kaisen.ts`. Critério
  livre, sem fonte oficial — ajustar se o Bruno preferir outra paleta.
- **Qualidade do material fonte variou muito entre os 4 arquivos por mundo**,
  ao contrário do Torajo (que era uniforme). Demon Slayer veio completo nos 4
  (mesmos 5 blocos: oQueE, personagem, descrição, frase, vidaBox). Jujutsu
  Kaisen veio bem mais cru:
  - `crencas.html`: só 6 itens (não 8), sem oQueE/frase/vidaBox — só
    número+título+personagem+descrição. Completei oQueE/frase/vidaBox à mão,
    no mesmo tom do resto do conteúdo.
  - `esquemas.html`: só 6 itens (não 12) — ok, esses vieram completos
    (oQueE+frase+vidaBox presentes), só é uma lista mais curta mesmo.
  - `modos.html`: o mais incompleto — sem oQueE em nenhum item, sem
    frase/vidaBox na maioria, e 2 cartões combinando 2 personagens cada
    ("07 & 08" = Geto+Nanami, "09 & 10" = Gojo+Itadori). Completei oQueE
    reaproveitando a **definição clínica padrão de cada modo** (mesmo texto
    usado em `modos-demon-slayer.ts` — é o mesmo framework de Young, não muda
    por universo, então reaproveitar não é invenção de conteúdo clínico) e
    separei os 2 cartões combinados em 4 itens individuais pra fechar os 10
    modos no mesmo padrão das outras 3 páginas. `frase`/`vidaBox` sintetizados
    a mão quando ausentes, sempre ancorados na descrição que a fonte já dava
    (nunca inventando fatos novos do enredo).
  - Por causa disso, `CenaTorajo.frase` e `CenaTorajo.vidaBox` viraram
    **opcionais** no componente (bloco só renderiza se o campo existir) — só
    não sobrou nenhum caso de uso real disso porque acabei preenchendo os 2
    campos em tudo; manter opcional mesmo assim, é mais honesto pra próxima
    fonte incompleta que aparecer.
- **Build/preview**: `npm run build` limpo, testei as 8 rotas novas
  (contagem de cenas confere com o número de itens de cada array: 8/12/12/10
  Demon Slayer, 6/12/6/10 Jujutsu Kaisen) + regressão rápida nas 4 páginas
  Torajo que usam o componente generalizado — sem erro de console em nenhuma.

## 14. Atualização 2026-07-29 (4): mundos viram aba separada + quiz + clicker

Pedido do Bruno: tirar os 12 territórios (4 temas × Torajo/Demon
Slayer/Jujutsu Kaisen) do mapa principal de `/psicoeducacao` (fica só com
neuroanatomia, pânico, janela, sono), e trocar por navegação em 2 níveis numa
aba própria: escolhe o **mundo** → escolhe o **tema** → carrega a página.
Mais 2 pedidos que valem pra qualquer território futuro:

- **Quiz automático no fechamento de cada página**: gerado dos próprios dados
  do território (`item.frase` → "quem diria isso?", opções = personagem
  certo + 2 distratores aleatórios do elenco daquele mundo). Função em
  `src/components/psicoed/gerarQuizPersonagens.ts`, chamada dentro do
  `TerritorioTorajo` (`useMemo`), renderizada com o `QuizEngine` que já
  existia. **Zero conteúdo novo pra escrever** — funciona igual em qualquer
  território, inclusive futuros, só precisa que os itens tenham `frase`
  preenchida (se não tiver, aquele item não vira pergunta — o `.filter` já
  trata isso).
- **Navegação por cena via clicker/teclado**: pedido específico pra usar em
  projetor com apresentador (PowerPoint clicker) em sessão com paciente.
  `ArrowLeft`/`ArrowRight`/`PageUp`/`PageDown` (`e.preventDefault()` pra não
  duplicar o scroll nativo do navegador) navegam pela lista
  `["hero", ...cenas, "quiz-final", "fechamento"]` via `scrollIntoView`.
  Também tem par de setinhas fixas no rodapé da tela (clique com mouse,
  redundante com o teclado) com indicador "3/12". Mesma lógica serve pra
  passar slide com o polegar no clicker sem precisar rolar manualmente.

### Estrutura de navegação nova

```
src/content/psicoed-mundos.ts     # 3 mundos × 4 temas + link extra opcional
src/pages/MundosTematicos.tsx     # /psicoeducacao/mundos — escolhe o mundo
src/pages/MundoTemas.tsx          # /psicoeducacao/mundos/:mundoId — escolhe o tema
```

- `territorios[]` (`src/content/psicoed.ts`) perdeu os 12 territórios Torajo/
  Demon Slayer/JJK e ganhou 1 entrada só: "Mundos Temáticos" →
  `/psicoeducacao/mundos`.
- Todo `TerritorioTorajo` agora recebe `rotaVoltar` (aponta pro
  `/psicoeducacao/mundos/<mundo>` certo, não mais pro `/psicoeducacao` geral).
- **`EsquemasIniciais.tsx` foi migrado pra usar `TerritorioTorajo`** (era o
  único território ainda com implementação própria, ~340 linhas, de antes do
  componente genérico existir). Isso quase causou uma regressão: a página
  original tinha um **segundo botão no fechamento** (link pro território
  clínico `/psicoeducacao/de-onde-vem-seus-padroes`), que o componente
  genérico não suportava. Adicionei prop opcional
  `fechamentoLinkExtra?: {titulo, rota}` antes de migrar, pra não perder essa
  feature. **Lição**: ao migrar uma página bespoke pro componente genérico,
  ler a implementação antiga inteira primeiro e listar toda feature antes de
  trocar — não só o "formato geral".
- `PersonagensTorajo.tsx` (hub de personagens Torajo) não virou território
  no `territorios[]` nem entrou no `MundoTemas` como "tema" — ficou como
  `linkExtra` (link de texto simples) na página `MundoTemas` do Torajo,
  mesmo padrão de antes (só mudou de onde o link mora).
- Testado: mapa principal (5 itens), `/mundos` (3 cards), `/mundos/torajo`
  (4 temas + link extra), quiz gerando pergunta correta em pelo menos 2
  territórios diferentes, `ArrowRight` avançando o índice (confirmado via
  keydown real, não só dispatch sintético — o dispatch sintético "falhou" na
  primeira tentativa por race condition da própria verificação, não bug real:
  ler o estado *depois* de um `setTimeout`, não no mesmo tick).

## 15. Checklist rápido pra próximo território

- [ ] Ler HTML fonte em `G:\Meu Drive\Torajo\`, extrair conteúdo pro `.ts`
- [ ] Assets de personagem já existem em `public/img/torajo/` (reaproveitar)
- [ ] Decidir com o Bruno: quantos blocos de texto por cena, antes de escrever
      (ver seção 5 — já causou retrabalho)
- [ ] Página nova segue o padrão de `EsquemasIniciais.tsx`
- [ ] `lottie-web` direto, nunca `lottie-react` (seção 4)
- [ ] Registrar rota + território + ícone
- [ ] `npm run build` local antes de qualquer push
- [ ] Testar local, pedir confirmação visual do Bruno (harness não vê `vh`)
- [ ] Commit + push pra `main` só com confirmação explícita (deploy é direto
      pra produção, sem staging)
