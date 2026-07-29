import TerritorioTorajo from "@/components/psicoed/TerritorioTorajo";
import { distorcoesTorajo } from "@/content/psicoed/distorcoes-torajo";
import { personagens } from "@/content/psicoed/personagens";

export default function Distorcoes() {
  return (
    <TerritorioTorajo
      documentTitle="Distorções Cognitivas | Psicoeducação | Bruno de Souza Gonçalves"
      personagens={personagens}
      eyebrow="Entender para cuidar · Mundo Torajo"
      titulo={
        <>
          Distorções
          <br />
          Cognitivas
        </>
      }
      introCurta="As armadilhas da mente que todo mundo cai — explicadas pelos personagens do Mundo Torajo."
      introLonga="A mente comete atalhos automáticos quando está sob pressão: exagera, generaliza, adivinha o pior. São como 'óculos tortos' que distorcem a realidade sem você perceber. Reconhecer uma distorção já tira boa parte do poder dela. Vamos ver 12 delas na turma do Mundo Torajo."
      itens={distorcoesTorajo}
      tipoConceito="distorção cognitiva"
      rotaVoltar="/psicoeducacao/mundos/torajo"
      fechamentoTitulo="E se você trocasse os óculos tortos?"
      fechamentoTexto="Reconhecer uma distorção não significa que o pensamento é mentira o tempo todo — é aprender a checar antes de acreditar de cara. Isso se treina com prática e, quando fizer sentido, com apoio profissional."
    />
  );
}
