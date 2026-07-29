import TerritorioTorajo from "@/components/psicoed/TerritorioTorajo";
import { crencasJujutsuKaisen } from "@/content/psicoed/crencas-jujutsu-kaisen";
import { personagensJujutsuKaisen } from "@/content/psicoed/personagens-jujutsu-kaisen";

export default function CrencasCentraisJujutsuKaisen() {
  return (
    <TerritorioTorajo
      documentTitle="Crenças Centrais | Jujutsu Kaisen | Psicoeducação"
      eyebrow="Entender para cuidar · Jujutsu Kaisen"
      titulo={
        <>
          Crenças
          <br />
          Centrais
        </>
      }
      introCurta="As raízes mais profundas que sustentam nossos pensamentos — explicadas por Jujutsu Kaisen."
      introLonga="Uma crença central é a verdade mais absoluta que você tem sobre quem você é, sobre os outros e sobre o mundo — geralmente dividida entre Desamor, Desvalor e Desamparo. Vamos ver 6 delas na vida dos feiticeiros de Jujutsu Kaisen."
      personagens={personagensJujutsuKaisen}
      itens={crencasJujutsuKaisen}
      rotaVoltar="/psicoeducacao/mundos/jujutsu-kaisen"
      fechamentoTitulo="E se essas raízes pudessem ser reescritas?"
      fechamentoTexto="Reconhecer uma crença central não é se rotular — é perceber que ela é uma história antiga, não um fato. Isso se trabalha com tempo, evidências novas e, muitas vezes, com apoio profissional."
    />
  );
}
