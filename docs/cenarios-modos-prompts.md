# Cenários — Psicoeducação de Modos Esquemáticos

Prompts de geração de imagem para o rig de scroll cinemático (base: `Promt inspiração.txt`).
Gerar no **Nano Banana (Gemini)**. Página é **offline** → todos os assets ficam locais em `public/`.

---

## 0. Como o rig consome as imagens

O rig usa **7 camadas por cena**, cada uma animada por variável CSS separada. Não é uma
imagem bonita — é um conjunto de recortes empilhados.

| Camada | Papel | Formato | Alpha? |
|---|---|---|---|
| **L1** | céu / fundo mais distante | 2560×1440, `object-fit: cover` | não |
| **L2** | brilho traseiro (`mix-blend-mode: screen`) | 2048×1152 sobre **preto puro** | não* |
| **L3** | massa média, ancorada no rodapé (`object-fit: contain`) | 2048×1152 | **sim** |
| **L4** | splitframe ESQUERDO (abre para −46vw) | 1600×1600 | **sim** |
| **L5** | splitframe DIREITO (abre para +46vw) | 1600×1600 | **sim** |
| **L6** | herói em primeiro plano (voa −760px e escala +0.46 na saída) | 2400×1400 | **sim** |
| **L7** | close-up revelado quando o arco abre | 2560×1440 | não |

\* **L2 não precisa de alpha.** `screen` descarta preto puro automaticamente. Gere sobre
`#000000` e use o JPG/PNG direto — economiza uma etapa de recorte por cena.

**L4 e L5 são o mesmo objeto cortado ao meio.** Gere **uma** imagem do arco/porta inteiro,
centralizado e simétrico, e corte na vertical no meio (Photopea, ImageMagick). Gerar as
duas metades em prompts separados dá metades que não casam.

```bash
magick arco.png -crop 50%x100% +repage l4-split-left.png l5-split-right.png
```

### Recorte de fundo (L3, L4, L5, L6)

> **CORRIGIDO após teste real em 11/08/2026.** A instrução `isolated on a flat pure
> white background` **não funciona** no Nano Banana e piora o resultado:
>
> - nas camadas **largas** (flash) ela é simplesmente ignorada — o objeto vem sobre céu
>   gradiente com névoa;
> - nas camadas **quadradas** (pro) ela é interpretada como *"pinte um quadro e coloque
>   numa folha branca"* — o resultado vem em letterbox, uma pintura 4:3 centralizada
>   dentro de uma moldura branca inútil.
>
> **Não use essa instrução.** Deixe o modelo pintar a cena na atmosfera dele.

Duas rotas, nenhuma envolvendo prompt de fundo branco:

1. **Matting por IA** — `pip install rembg` e `rembg i entrada.png saida.png`. Segmenta o
   objeto independente da cor do fundo. Bom para o portão, a escadaria, o orrery, os
   ícones. Ruim para névoa e god-rays: corta a fumaça no contorno duro.

2. **Máscara CSS em vez de alpha** — para as camadas cujo fundo já é escuro e próximo da
   paleta do céu (L3 e L6 de quase todas as cenas), não recorte nada. Aplique
   `mask-image: linear-gradient(...)` nas bordas, ou `mix-blend-mode: lighten`. A emenda
   some porque o fundo da camada e o céu atrás são a mesma família de teal escuro. É a
   rota barata e a que preserva a névoa.

---

## 1. Style bible

**Cole este bloco no início de TODO prompt.** É o que mantém as 35 imagens parecendo o
mesmo mundo. Sem ele, cada geração vira um estilo diferente e a montagem não fecha.

```
STYLE: cinematic matte painting, painterly concept art, 19th-century Scottish
highland gothic academy, candlelit arcane atmosphere. Heavy volumetric fog and
god-rays. Aged stone, tarnished brass, dark oak, leaded glass. Palette: deep
teal-navy night #0b1a24, warm candle gold #e8b661, parchment cream #fdf1e1,
cold moon silver. One dominant warm light source plus a cold rim light.
Low horizon, wide cinematic framing, slight upward camera tilt. Painterly
brushwork, soft edges, no photographic sharpness.

NEGATIVE: no text, no letters, no watermark, no signature, no logo, no people,
no faces, no modern objects, no lens flare, no vignette, no border, no frame,
no UI, no 3D render look, no plastic shading, no oversaturation.
```

**Ordem de geração — importa.** Gere o **L1 da cena 0 primeiro**. Aprove. Depois use essa
imagem como *referência de estilo* em todas as outras gerações (no Gemini: anexe a imagem e
escreva `match the color palette, lighting and painterly style of the reference image`).
Sem isso a coerência entre cenas cai.

---

## 2. Cena 0 — Abertura: "O Castelo dos Modos"

Metáfora: a mente é um castelo. Cada janela acesa é um modo. Ninguém "é" o castelo inteiro.

**L1 — céu**
```
[STYLE BIBLE]
A vast twilight sky over highland moorland, storm clouds tearing open at the
centre to reveal a band of cold amber light on the horizon. First stars in the
upper third. Empty lower third, no landmass. Wide panoramic composition,
2560x1440.
```

**L2 — brilho traseiro**
```
[STYLE BIBLE]
A soft column of warm golden god-rays and faint aurora haze, radiating upward
from the bottom centre. Nothing else in frame. Rendered on a pure black
#000000 background so it can be screen-blended. Soft falloff at all edges.
```

**L3 — massa média**
```
[STYLE BIBLE]
Silhouetted mountain ridge and the far shore of a black mirror lake, anchored
to the bottom of the frame, receding into fog. Dark, near-monochrome, no
detail readable. Upper half of the frame completely empty.
isolated on a flat pure white background, no cast shadow touching the frame
edges, no ground plane
```

**L4 + L5 — splitframe (gerar inteiro, cortar ao meio)**
```
[STYLE BIBLE]
An enormous wrought-iron and carved-stone gate, closed, perfectly symmetrical,
centred in frame, seen straight on. Twisting iron vines, brass hinges, cold
moonlight raking across the metal. Square composition 1600x1600, the gate
fills the frame edge to edge.
isolated on a flat pure white background, no cast shadow touching the frame
edges, no ground plane
```

**L6 — herói**
```
[STYLE BIBLE]
A great candlelit castle on a sheer cliff, seen from below and far away.
Dozens of tall windows lit with individual warm flames, each a different
intensity — some bright, some nearly dark. Towers, buttresses, a covered
stone bridge. The building fills the lower two thirds; sky area left empty.
isolated on a flat pure white background, no cast shadow touching the frame
edges, no ground plane
```

**L7 — close-up revelado**
```
[STYLE BIBLE]
Interior courtyard of the castle at night, seen from ground level. Wet
flagstones reflecting torchlight, arched cloisters receding on both sides,
floating candles suspended in the open air above. Warm and enveloping.
Full frame 2560x1440.
```

---

## 3. Cena 1 — Ala das Crianças

Modos Criança: Vulnerável, Zangada, Impulsiva, Feliz.
Metáfora: o quarto da torre onde a parte mais nova de você ainda mora.

**L1 — céu**
```
[STYLE BIBLE]
Night sky in heavy rain, dense low clouds, a single distant lightning fork on
the left edge. Cold blue-grey, very little warmth. Empty lower third.
Wide panoramic, 2560x1440.
```

**L2 — brilho**
```
[STYLE BIBLE]
A small warm hearth-glow, low and off-centre, spreading a soft amber pool of
light upward and outward. Intimate scale, not a beam. Pure black #000000
background, soft falloff at all edges.
```

**L3 — massa média**
```
[STYLE BIBLE]
The silhouette of a castle's residential wing in driving rain — steep slate
roofs, chimney stacks, a few tiny lit windows. Anchored to the bottom edge,
dissolving into rain and fog at the top. Upper half empty.
isolated on a flat pure white background, no cast shadow touching the frame
edges, no ground plane
```

**L4 + L5 — splitframe**
```
[STYLE BIBLE]
A pair of tall carved oak nursery doors, closed, perfectly symmetrical, seen
straight on. Worn brass handles, carved birds and stars in the wood panels,
one small round window in each door leaf. Warm lamplight from the left.
Square 1600x1600, doors fill the frame.
isolated on a flat pure white background, no cast shadow touching the frame
edges, no ground plane
```

**L6 — herói**
```
[STYLE BIBLE]
A small round tower room seen from outside, floating detached against nothing
— cut stone, one large arched window glowing warm gold, rain streaking the
glass. Three folded paper birds circling the tower in flight. Fragile, small
against the frame.
isolated on a flat pure white background, no cast shadow touching the frame
edges, no ground plane
```

**L7 — close-up**
```
[STYLE BIBLE]
Interior of the small tower room, ground level. A narrow child's bed with a
heavy quilt, a wooden toy chest, a single candle on the sill. The storm
lashing the arched window. Warm inside, cold outside, sharp contrast between
the two. Full frame 2560x1440.
```

---

## 4. Cena 2 — Corredor dos Enfrentamentos

Modos de Enfrentamento: Protetor Desligado, Auto-acalmador Desligado,
Submisso Complacente, Autoengrandecedor.
Metáfora: o corredor de espelhos e armaduras — as máscaras que você veste para atravessar.

**L1 — fundo**
```
[STYLE BIBLE]
A vast stone corridor receding to a single vanishing point, filled with
waist-high cold fog. Ribbed vaulting overhead, tall narrow windows on both
sides admitting weak silver light. Desaturated, almost colourless.
Wide panoramic, 2560x1440.
```

**L2 — brilho**
```
[STYLE BIBLE]
Cold silver-blue light scattering off unseen mirrored surfaces, several
overlapping soft glows across the middle of the frame, no warm tones.
Pure black #000000 background, soft falloff at all edges.
```

**L3 — massa média**
```
[STYLE BIBLE]
Two receding rows of empty suits of plate armour standing at attention along
a corridor, symmetrical, disappearing into fog toward the centre. Tarnished
steel, no faces, visors closed. Anchored to the bottom edge, upper half empty.
isolated on a flat pure white background, no cast shadow touching the frame
edges, no ground plane
```

**L4 + L5 — splitframe**
```
[STYLE BIBLE]
Two enormous free-standing mirrors in heavy ornate gilt frames, side by side,
symmetrical, facing the viewer. The glass is fogged and shows no reflection —
only grey depth. Tarnished gold, cracked gesso. Square 1600x1600.
isolated on a flat pure white background, no cast shadow touching the frame
edges, no ground plane
```

**L6 — herói**
```
[STYLE BIBLE]
A grand stone staircase suspended in mid-air, disconnected at both ends,
leading nowhere. Carved balustrade, worn steps, a wrought-iron lantern hanging
from its underside. Seen from below at a slight angle. Floating, unmoored.
isolated on a flat pure white background, no cast shadow touching the frame
edges, no ground plane
```

**L7 — close-up**
```
[STYLE BIBLE]
Extreme close-up of a fogged antique mirror surface, filling the entire frame.
A blurred, unrecognisable warm shape somewhere behind the fog. Fine cracks in
the silvering, dust on the glass. Full frame 2560x1440.
```

---

## 5. Cena 3 — Câmara dos Pais Internalizados

Modos Parentais: Punitivo, Exigente.
Metáfora: o salão frio onde retratos gigantes julgam de cima — vozes que não são suas.

**L1 — fundo**
```
[STYLE BIBLE]
The interior of an immense cold stone hall, ribbed vaulted ceiling far
overhead, enormous clerestory windows admitting hard grey daylight. No warmth
anywhere. Severe, vertical, oppressive scale. Wide panoramic, 2560x1440.
```

**L2 — brilho**
```
[STYLE BIBLE]
A single hard shaft of cold white-grey light falling steeply from the upper
right, sharp-edged, dust motes suspended in it. Nothing else.
Pure black #000000 background.
```

**L3 — massa média**
```
[STYLE BIBLE]
Tiers of towering empty portrait frames stacked up a stone wall, receding
upward and outward, ornate and gilded but all canvases blank and dark. The
frames lean slightly forward, as if looking down. Anchored to the bottom edge.
isolated on a flat pure white background, no cast shadow touching the frame
edges, no ground plane
```

**L4 + L5 — splitframe**
```
[STYLE BIBLE]
An enormous carved stone lectern and judge's bench, symmetrical, seen straight
on and from below so it towers over the viewer. Cold grey granite, iron
fittings, worn edges. Square 1600x1600, filling the frame.
isolated on a flat pure white background, no cast shadow touching the frame
edges, no ground plane
```

**L6 — herói**
```
[STYLE BIBLE]
One colossal ornate gilded picture frame hanging alone, its canvas empty and
black. Heavy chains at the top. Seen from below. The gold is tarnished and
chipped. Imposing, disproportionate.
isolated on a flat pure white background, no cast shadow touching the frame
edges, no ground plane
```

**L7 — close-up**
```
[STYLE BIBLE]
Ground-level close-up of a worn flagstone floor, many long hard shadows
converging toward the viewer from off-frame above. Cold grey, high contrast,
nothing else in the frame. Full frame 2560x1440.
```

---

## 6. Cena 4 — Observatório: o Adulto Saudável

Modo Adulto Saudável.
Metáfora: a sala de trabalho ao amanhecer — quem consegue olhar todos os outros modos
sem virar nenhum deles.

**L1 — céu**
```
[STYLE BIBLE]
Clear dawn sky over highland hills, warm rose and gold low on the horizon
grading to soft blue above. Thin high clouds catching first light. Calm,
open, unhurried. Empty lower third. Wide panoramic, 2560x1440.
```

**L2 — brilho**
```
[STYLE BIBLE]
A broad warm sunrise bloom low and centred, golden and diffuse, spreading
gently upward. Generous and soft, not a beam.
Pure black #000000 background, soft falloff at all edges.
```

**L3 — massa média**
```
[STYLE BIBLE]
Treetops and rolling distant hills catching warm dawn light, anchored to the
bottom edge, soft mist in the valleys. Warm greens and golds. Upper half of
the frame empty.
isolated on a flat pure white background, no cast shadow touching the frame
edges, no ground plane
```

**L4 + L5 — splitframe**
```
[STYLE BIBLE]
A pair of tall arched leaded-glass windows with heavy linen curtains drawn
back, symmetrical, seen straight on, warm dawn light pouring through. Dark
oak frames, brass latches. Square 1600x1600.
isolated on a flat pure white background, no cast shadow touching the frame
edges, no ground plane
```

**L6 — herói**
```
[STYLE BIBLE]
A large brass orrery and astrolabe standing on a carved oak desk, rings and
spheres catching warm light, patinated metal, precise and well-used. Seen at
a three-quarter angle. Calm and grounded.
isolated on a flat pure white background, no cast shadow touching the frame
edges, no ground plane
```

**L7 — close-up**
```
[STYLE BIBLE]
Close-up of the desk surface: an open leather journal with blank pages, a
quill in an inkwell, a cooling cup of tea, spectacles folded beside them.
Warm morning light across the wood grain. Full frame 2560x1440.
```

---

## 7. Ícones dos cards (11 modos)

Vão nos `.sight-card` (`67.2×67.2px` renderizado — gere em **512×512**).
Objeto único, recortado, mesmo estilo pictórico.

**Sufixo obrigatório em todos:**
```
Single object, centred, square composition 512x512, painterly matte style,
warm candle gold and tarnished brass. isolated on a flat pure white
background, no cast shadow touching the frame edges, no ground plane, no text.
```

| # | Modo | Objeto |
|---|---|---|
| 1 | Criança Vulnerável | `a small candle stub in a cracked glass jar, the flame guttering and leaning` |
| 2 | Criança Zangada | `a cast-iron kettle glowing red-hot along a crack, venting a jet of steam` |
| 3 | Criança Impulsiva | `a painted wooden spinning top mid-wobble, throwing off small sparks` |
| 4 | Criança Feliz | `a folded paper bird in flight, edges catching golden light` |
| 5 | Protetor Desligado | `a brass lantern with its shutters closed tight, cold and unlit, frost on the metal` |
| 6 | Auto-acalmador Desligado | `a heavy pewter goblet with thick smoke curling and overflowing its rim` |
| 7 | Submisso Complacente | `a small silver key hanging on a chain, bowed and worn thin from use` |
| 8 | Autoengrandecedor | `an oversized ornate gilded crown on a narrow pedestal, too large for its base, slightly tilted` |
| 9 | Pai/Mãe Punitivo | `a cold iron gavel resting on a cracked stone block` |
| 10 | Pai/Mãe Exigente | `a brass balance scale, one pan piled with weights and sunk to the base, the other empty and high` |
| 11 | Adulto Saudável | `a warm brass mariner's compass lying open, needle steady, well-handled patina` |

---

## 8. Ajustes obrigatórios no código, por ser offline

O TXT original carrega **tudo** de CDN. Offline, três coisas quebram:

1. **Assets** → salvar em `public/scenes/s0/l1-sky.jpg` … e trocar as URLs remotas por
   caminhos relativos. Vite copia `public/` para o build sem hash.

2. **Fonte** → a `Ogg Medium` do TXT é comercial e vem de CloudFront. Offline exige
   `.woff2` local. Substitua por uma display serif livre com peso parecido —
   **Cormorant Garamond** ou **Playfair Display**, auto-hospedada em
   `public/fonts/`, mantendo `font-family` e os `font-size` do TXT.

3. **`height: calc(100vh + 3700px)`** é calibrado para 5 blocos de narrativa. Com 5 cenas
   completas, o rig precisa de ~5× isso, ou as cenas atropelam umas às outras. Os
   `smoothstep` do JS (`560/900/1300/1620`, `1760/2140/2540/2700`…) são offsets em px
   absolutos — reescalar a altura sem reescalar esses números quebra a coreografia.

---

## 9. Geração automática via 9router

Script: `scratchpad/gen.sh` (fora do repo, porque recebe a API key por env var).
É resume-safe — pula qualquer arquivo que já exista, então basta rodar de novo depois
de recarregar créditos.

```bash
NINEROUTER_KEY="sk-..." bash gen.sh
```

### Roteamento de modelo — medido, não documentado

A doc do 9router diz que gemini/nanobanana "aceitam só `prompt`". Só vale em parte:

| Modelo | `size` | Saída real |
|---|---|---|
| `nb/nanobanana-flash` | **respeita** | 1344×768 (16:9) |
| `nb/nanobanana-pro` | ignora em silêncio; **502 em `1792x1024`** | 1024×1024 sempre |
| `gemini/*` (3 modelos) | — | HTTP 429, quota 0 na chave Google free tier |

Daí a divisão: **camadas largas no `flash`**, **quadradas (arcos + ícones) no `pro`**.
O `pro` tem modelagem mais rica, mas é quadrado e não há como forçar 16:9 nele.

### Contagem

5 cenas × (5 camadas largas + 1 arco) + 11 ícones = **41 gerações**
(o arco é uma só, cortada em duas metades depois).

### Estado em 11/08/2026

**8 de 41 geradas** — créditos do nanobanana esgotaram no meio do lote:
`The current credits are insufficient. Please top up.`

- `s0/` — **completa**, 6/6
- `s1/` — 2/6 (`l1-sky`, `l2-glow`)
- `s2`, `s3`, `s4`, `icons/` — nada

### Ferramentas ausentes nesta máquina

- **`jq`** — não instalado. O script monta o JSON com `printf` e aborta se algum prompt
  contiver aspa dupla ou barra invertida.
- **ImageMagick** — não instalado. Cuidado: `convert` no PATH é o `convert.exe` do
  Windows (conversor FAT→NTFS), não o ImageMagick. O corte dos splitframes ao meio
  precisa de ImageMagick, Python/Pillow ou Photopea.
- **`rembg`** — não instalado.
