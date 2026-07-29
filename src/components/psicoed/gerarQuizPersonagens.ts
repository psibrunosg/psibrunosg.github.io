// Gera um QuizConfig automaticamente a partir dos itens de um território
// (frase em personagem → "qual distorção/crença/esquema/modo é essa?"). Não
// precisa de conteúdo escrito à mão por território/mundo — reaproveita os
// dados que a página já tem. Ver docs/mundo-torajo-playbook.md.

import type { CenaTorajo } from "@/components/psicoed/TerritorioTorajo";
import type { QuizConfig } from "@/components/psicoed/QuizEngine";

function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function gerarQuizPersonagens(itens: CenaTorajo[], tipoConceito: string): QuizConfig {
  const perguntas = itens
    .filter((item) => !!item.frase)
    .map((item) => {
      const distratores = embaralhar(itens.filter((it) => it.titulo !== item.titulo)).slice(0, 2);
      const opcoes = embaralhar([
        {
          id: item.id,
          texto: item.titulo,
          correta: true,
          explicacao: `Isso mesmo — ${item.titulo}. ${item.oQueE}`,
        },
        ...distratores.map((it) => ({
          id: it.id,
          texto: it.titulo,
          correta: false,
          explicacao: `A resposta certa é "${item.titulo}": ${item.oQueE}`,
        })),
      ]);

      return {
        id: `qp-${item.id}`,
        pergunta: `Isso é qual ${tipoConceito}: "${item.frase}"?`,
        opcoes,
      };
    });

  return { perguntas };
}
