import TerritorioTorajo from "@/components/psicoed/TerritorioTorajo";
import { crencas } from "@/content/psicoed/crencas";
import { personagens } from "@/content/psicoed/personagens";

export default function CrencasCentrais() {
  return (
    <TerritorioTorajo
      documentTitle="Crenças Centrais | Psicoeducação | Bruno de Souza Gonçalves"
      personagens={personagens}
      eyebrow="Entender para cuidar · Mundo Torajo"
      titulo={
        <>
          Crenças
          <br />
          Centrais
        </>
      }
      introCurta="As raízes profundas da nossa mente — explicadas pelos personagens do Mundo Torajo."
      introLonga="Se a sua mente fosse uma árvore, as distorções seriam as folhas secas caindo, os esquemas seriam os galhos, e as crenças centrais seriam as raízes: verdades absolutas (e muitas vezes secretas) sobre você mesmo, as outras pessoas e o mundo. Vamos usar a turma do Mundo Torajo pra enxergar 8 delas."
      itens={crencas}
      fechamentoTitulo="E se essas raízes pudessem ser reescritas?"
      fechamentoTexto="Reconhecer uma crença central não é se rotular — é perceber que ela é uma história antiga, não um fato. Isso se trabalha com tempo, evidências novas e, muitas vezes, com apoio profissional."
    />
  );
}
