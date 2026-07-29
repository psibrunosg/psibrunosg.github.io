import TerritorioTorajo from "@/components/psicoed/TerritorioTorajo";
import { distorcoesDemonSlayer } from "@/content/psicoed/distorcoes-demon-slayer";
import { personagensDemonSlayer } from "@/content/psicoed/personagens-demon-slayer";

export default function DistorcoesDemonSlayer() {
  return (
    <TerritorioTorajo
      documentTitle="Distorções Cognitivas | Demon Slayer | Psicoeducação"
      eyebrow="Entender para cuidar · Demon Slayer"
      titulo={
        <>
          Distorções
          <br />
          Cognitivas
        </>
      }
      introCurta="Os 12 principais erros de pensamento — explicados pelos caçadores e onis de Demon Slayer."
      introLonga="Assim como os caçadores precisam de espadas especiais para ver e cortar os onis, nós precisamos de ferramentas para enxergar e cortar os 'erros' da nossa mente. Distorções cognitivas são falhas em como o cérebro processa informações — óculos sujos e rachados que distorcem a realidade. Vamos ver 12 delas."
      personagens={personagensDemonSlayer}
      itens={distorcoesDemonSlayer}
      fechamentoTitulo="E se você trocasse os óculos sujos?"
      fechamentoTexto="Reconhecer uma distorção não significa que o pensamento é mentira o tempo todo — é aprender a checar antes de acreditar de cara. Isso se treina com prática e, quando fizer sentido, com apoio profissional."
    />
  );
}
