// Gera um QuizConfig automaticamente a partir dos itens de um território
// (frase em personagem → "quem diria isso?"). Não precisa de conteúdo
// escrito à mão por território/mundo — reaproveita os dados que a página já
// tem. Ver docs/mundo-torajo-playbook.md.

import type { CenaTorajo } from "@/components/psicoed/TerritorioTorajo";
import type { Personagem } from "@/content/psicoed/personagens";
import type { QuizConfig } from "@/components/psicoed/QuizEngine";

function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function gerarQuizPersonagens(itens: CenaTorajo[], personagens: Record<string, Personagem>): QuizConfig {
  const idsDisponiveis = Object.keys(personagens);

  const perguntas = itens
    .filter((item) => !!item.frase)
    .map((item) => {
      const correto = personagens[item.personagem];
      const nomeCorreto = item.personagemLabel ?? correto.nome;
      const distratoresIds = embaralhar(idsDisponiveis.filter((id) => id !== item.personagem)).slice(0, 2);
      const opcoes = embaralhar([
        {
          id: item.personagem,
          texto: nomeCorreto,
          correta: true,
          explicacao: `Isso mesmo — ${nomeCorreto}. ${item.oQueE}`,
        },
        ...distratoresIds.map((id) => ({
          id,
          texto: personagens[id].nome,
          correta: false,
          explicacao: `Quem diria isso é ${nomeCorreto}, não ${personagens[id].nome}. ${item.oQueE}`,
        })),
      ]);

      return {
        id: `qp-${item.id}`,
        pergunta: `Quem diria isso: "${item.frase}"?`,
        opcoes,
      };
    });

  return { perguntas };
}
