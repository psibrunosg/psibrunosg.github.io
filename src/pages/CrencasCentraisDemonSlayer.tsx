import TerritorioTorajo from "@/components/psicoed/TerritorioTorajo";
import { crencasDemonSlayer } from "@/content/psicoed/crencas-demon-slayer";
import { personagensDemonSlayer } from "@/content/psicoed/personagens-demon-slayer";

export default function CrencasCentraisDemonSlayer() {
  return (
    <TerritorioTorajo
      documentTitle="Crenças Centrais | Demon Slayer | Psicoeducação"
      eyebrow="Entender para cuidar · Demon Slayer"
      titulo={
        <>
          Crenças
          <br />
          Centrais
        </>
      }
      introCurta="As raízes profundas da nossa mente — explicadas pelos personagens de Demon Slayer."
      introLonga="Se a sua mente fosse uma árvore, as distorções seriam as folhas secas caindo, os esquemas seriam os galhos, e as crenças centrais seriam as raízes: ideias absolutas sobre você mesmo, os outros e o mundo. Vamos ver 8 delas nos caçadores e onis de Demon Slayer."
      personagens={personagensDemonSlayer}
      itens={crencasDemonSlayer}
      rotaVoltar="/psicoeducacao/mundos/demon-slayer"
      fechamentoTitulo="E se essas raízes pudessem ser reescritas?"
      fechamentoTexto="Reconhecer uma crença central não é se rotular — é perceber que ela é uma história antiga, não um fato. Isso se trabalha com tempo, evidências novas e, muitas vezes, com apoio profissional."
    />
  );
}
