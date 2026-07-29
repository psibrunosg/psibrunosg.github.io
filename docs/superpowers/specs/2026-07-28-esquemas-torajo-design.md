# Território "Esquemas Iniciais Desadaptativos" — Mundo Torajo (scrollytelling)

Data: 2026-07-28
Status: aprovado para plano de implementação

## Contexto

O site já tem um Mapa Exploratório de Psicoeducação (`/psicoeducacao`) com territórios
como Distorções Cognitivas e Modos do Esquema (quiz + flashcards + badge genéricos).
Falta um território para os **Esquemas Iniciais Desadaptativos** (Jeffrey Young).

Bruno tem um material próprio e ilustrado — **Mundo Torajo**: 7 personagens (Torajo,
Morajo, Zulmi, Linn, Pessy, Azedo, Margo), cada um em estilo cartoon/webtoon vibrante
(1 cor sólida por personagem, ligada a uma fruta: Torajo=verde/maçã, Morajo=roxo/lima,
Zulmi=azul/uva, Linn=amarelo/limão, Pessy=laranja, Azedo=vermelho, Margo=rosa/tomate) —
já mapeando 12 dos 18 esquemas de Young a situações do dia a dia deles (fonte:
`G:\Meu Drive\Torajo\esquemas.html`, material estático em PDF/HTML).

Esta página é a versão **pública, lúdica, sem gamificação** do tema. Ela não substitui
nem duplica o sistema clínico já existente em `DeOndeVemPadroes.tsx` /
`narrativas-esquemas.ts` (18 esquemas do YSQ, narrativas autorais aprovadas pelo
terapeuta, ligado a escore do paciente) — ao final, a página linka para lá para quem
quiser ir mais fundo.

## Conteúdo (extraído de esquemas.html, reaproveitado 1:1)

| # | Esquema | Personagem | Cor |
|---|---------|-----------|-----|
| 01 | Abandono / Instabilidade | Torajo | verde |
| 02 | Desconfiança / Abuso | Pessy | laranja |
| 03 | Privação Emocional | Linn | amarelo |
| 04 | Defectividade / Vergonha | Azedo | vermelho |
| 05 | Isolamento Social / Alienação | Margo | rosa |
| 06 | Dependência / Incompetência | Zulmi | azul |
| 07 | Vulnerabilidade ao Perigo | Pessy | laranja |
| 08 | Arrogo / Grandiosidade | Azedo | vermelho |
| 09 | Autocontrole Insuficiente | Torajo | verde |
| 10 | Busca de Aprovação | Torajo | verde |
| 11 | Padrões Inflexíveis | Morajo | roxo |
| 12 | Inibição Emocional | Morajo | roxo |

Cada esquema carrega: número, título, subtítulo em inglês, "o que é" (definição),
personagem, descrição em personagem, frase (quote) em personagem, box "E na sua vida?"
(aplicação prática). Todo esse texto já existe no HTML de origem e vai para
`src/content/psicoed/esquemas.ts`.

## Arquitetura

- **Rota nova**: `/psicoeducacao/esquemas` → `src/pages/EsquemasIniciais.tsx`.
- **Conteúdo**: `src/content/psicoed/esquemas.ts` — array de 12 objetos (dados puros,
  sem lógica de UI), seguindo o padrão de `narrativas-esquemas.ts`.
- **Fundo 3D ambiente**: `src/components/psicoed/LensShardsBackground.tsx` — componente
  isolado, `<Canvas>` do R3F (já instalado) fixo atrás do conteúdo, ~40-60 cacos de
  vidro (geometria simples, icosahedron/tetrahedron achatado) à deriva lenta; recebe
  `activeColor` via prop e faz lerp suave de cor a cada frame. Não sabe nada de scroll
  nem de GSAP — só recebe uma cor.
- **Página**: `EsquemasIniciais.tsx` monta as 12 cenas + hero + fechamento, registra os
  `ScrollTrigger` do GSAP (um por cena) que: (1) fixam a cena em viewport cheio no
  desktop, (2) animam entrada do personagem/título/quote/box, (3) disparam
  `setActiveColor` pro fundo 3D. Trilho de atalho fixo no topo com os 7 avatares.
- **Assets**: 7 renders + `fundo.png` copiados para `public/img/torajo/`. 2 animações
  Lottie baixadas do LottieFiles (gratuitas, formato dotLottie extraído para JSON puro):
  - `public/media/lottie/coracao-partido.json` — coração se partindo, cena de abertura.
  - `public/media/lottie/vidro-estilhacado.json` — vidro colorido se estilhaçando;
    tocada normal na abertura (entrando no mundo dos esquemas) e **em reverso** no
    fechamento (as lentes se recompõem — resolução/esperança). Um asset só, dois usos.
- **Libs novas**: `gsap` (ScrollTrigger incluso) e `lottie-react`. Three.js/R3F e
  Framer Motion são reaproveitados (já instalados, já usados em `Neuroanatomia3D` e no
  resto do site).

## Fluxo da página

1. **Hero**: círculo dos 7 personagens monta com stagger (GSAP); Lottie do coração
   partido toca; vidro se estilhaça revelando o título "Esquemas Iniciais
   Desadaptativos" e a intro (adaptada do texto de `esquemas.html`: "o que é um
   esquema", metáfora da lente).
2. **Trilho de atalho**: 7 avatares fixos no topo (desktop), clique rola suave até a
   cena daquele personagem.
3. **12 cenas** (uma por esquema, na ordem 01→12 da tabela acima — mesma ordem do
   material original): render do personagem entra, número +
   título + subtítulo em inglês aparecem, quote em balão estilizado, box "E na sua
   vida?" fecha a cena. Cor de destaque = cor do personagem. Fundo 3D faz lerp pra essa
   cor.
4. **Fechamento**: Lottie do vidro em reverso (lentes se recompondo) + texto de
   resolução + link para "De onde vêm seus padrões" (território clínico existente,
   pra quem quiser aprofundar) + link de volta ao mapa.

## Mobile e acessibilidade

- Pin do ScrollTrigger só ativa em `md:` pra cima (breakpoint do Tailwind já usado no
  site). Mobile usa reveal simples por scroll (toggleClass, sem pin), mesmo padrão de
  `hidden md:block` / `md:hidden` já usado em `MapaExploratorio.tsx`.
- `prefers-reduced-motion`: desliga pin, timelines viram fade estático, fundo 3D para
  de animar (ou nem monta), Lottie mostra frame estático. Mesmo padrão de
  `useReducedMotion` já usado em todas as páginas de território.
- Sem quiz/flashcard/badge nesta página (decisão do Bruno) — não usa
  `QuizEngine`/`Flashcards`/`Badge`/`useProgresso`.

## Registro no mapa

- `territorios` em `src/content/psicoed.ts` ganha entrada `esquemas-iniciais` →
  `/psicoeducacao/esquemas`.
- `Territorio.icone` ganha novo valor `"eye"` (metáfora da lente/óculos); import do
  ícone `Eye` do lucide-react no mapa de ícones de `MapaExploratorio.tsx`.
- Rota registrada em `App.tsx`.

## Fora de escopo

- Não mexe em `Distorcoes.tsx` nem `ModosEsquema.tsx` (ficam como estão).
- Não mexe no sistema clínico de 18 esquemas (`DeOndeVemPadroes.tsx`,
  `narrativas-esquemas.ts`) — só linka pra ele no fechamento.
- Sem quiz/flashcard/badge/progresso salvo nesta página.
