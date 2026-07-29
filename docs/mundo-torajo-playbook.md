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

## 12. Checklist rápido pra próximo território

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
