<!--
  Arquivo de REFERENCIA para a sintaxe dos blocos ricos de blog.
  Nao e roteado / nao e importado por nenhum componente — serve apenas
  como cola de consulta para escrever posts no Supabase (campo `conteudo`).

  Os posts publicados vem do Supabase (ver src/content/posts-loader.ts).
  O parser fica em src/components/blog/RichBlock.tsx, despachado a partir
  do override do componente `pre` em src/pages/BlogPost.tsx.
-->

# Titulo do post (fica no campo `titulo`, nao no markdown)

Texto normal em markdown continua funcionando normalmente, com **negrito**,
_italico_, [links](https://exemplo.com), listas, etc.

## Mapa mental interativo

```mindmap
{"centro":"Ansiedade","nos":[{"titulo":"Corpo","cor":"#C97B4A","filhos":["Taquicardia","Tensão muscular","Falta de ar"]},{"titulo":"Mente","filhos":["Preocupação","Catastrofização"]},{"titulo":"Comportamento","filhos":["Evitação","Checagem"]}]}
```

- `centro` (string, obrigatorio): rotulo do no central.
- `nos` (array, obrigatorio): cada item tem `titulo` (obrigatorio), `cor` (opcional,
  hex ou var(--c-*)) e `filhos` (opcional, array de strings — vira sub-nos que
  expandem/recolhem ao clicar). Sem `cor`, usa as cores do tema em rodizio.

## Grafico

```grafico
{"tipo":"barras","titulo":"Prevalência de transtornos mentais","dados":[{"label":"Ansiedade","valor":9.3},{"label":"Depressão","valor":5.8},{"label":"Transtorno bipolar","valor":1.2}],"unidade":"%","fonte":"OMS 2023"}
```

```grafico
{"tipo":"linha","titulo":"Evolução dos sintomas ao longo das sessões","dados":[{"label":"Sessão 1","valor":8},{"label":"Sessão 4","valor":6.2},{"label":"Sessão 8","valor":4.1},{"label":"Sessão 12","valor":2.5}],"unidade":" pts"}
```

- `tipo`: `"barras"` (horizontal) ou `"linha"`.
- `dados`: array de `{label, valor}` (valor numerico).
- `unidade` e `fonte`: opcionais.

## Destaques (callouts)

```destaque
{"tipo":"dica","titulo":"Experimente","texto":"Pratique a respiração **4-7-8** antes de dormir por uma semana e observe o que muda."}
```

```destaque
{"tipo":"alerta","texto":"Este exercício não substitui acompanhamento profissional em quadros moderados a graves."}
```

```destaque
{"tipo":"info","titulo":"Você sabia?","texto":"O termo *ansiedade* vem do latim `anxietas`, relacionado a aperto, estreitamento."}
```

```destaque
{"tipo":"mito","titulo":"Mito vs Fato","texto":"Ansiedade é frescura e falta de força de vontade.|Ansiedade é uma resposta biológica real, com base neuroquímica e hormonal — não é escolha."}
```

- `tipo`: `"dica"` (verde) | `"alerta"` (ambar) | `"info"` (neutro) | `"mito"`
  (layout de 2 colunas quando `texto` tiver um `|` separando mito e fato).
- `titulo`: opcional.
- `texto`: markdown simples (negrito, italico, links, codigo inline).

## Aprofundamento (accordion)

```revelar
{"titulo":"Quer entender a neurobiologia da ansiedade?","conteudo":"A amígdala dispara a resposta de luta-ou-fuga liberando **cortisol** e **adrenalina**. Em quadros crônicos, o eixo HPA (hipotálamo-hipófise-adrenal) fica hiper-reativo, mantendo o corpo em alerta mesmo sem ameaça real."}
```

- `titulo` (obrigatorio): texto do cabecalho clicavel.
- `conteudo` (obrigatorio): markdown que aparece ao expandir.

## Passo a passo interativo

```passos
{"titulo":"Respiração 4-7-8","passos":["Inspire pelo nariz contando até 4","Segure o ar contando até 7","Solte todo o ar pela boca contando até 8","Repita o ciclo 4 vezes"]}
```

- `titulo`: opcional.
- `passos`: array de strings. Cada passo vira um item marcavel (checkbox),
  com barra de progresso.

## Tabelas (markdown padrão / GFM)

| Sintoma          | Ansiedade | Depressão |
| ----------------- | :-------: | :-------: |
| Insônia           |    Sim    |    Sim    |
| Perda de interesse|    Não    |    Sim    |
| Taquicardia       |    Sim    |    Não    |

Tabelas markdown normais (`remark-gfm`) já funcionam sem bloco especial —
role a tabela na horizontal em telas pequenas.

## Codigo normal continua normal

Blocos de codigo com linguagens comuns (`js`, `python`, etc.) e codigo
`inline` continuam renderizando como codigo, sem nenhum tratamento especial:

```js
function respirar4718() {
  return "inspire 4s, segure 7s, solte 8s";
}
```
