import TerritorioTorajo from "@/components/psicoed/TerritorioTorajo";
import { distorcoesJujutsuKaisen } from "@/content/psicoed/distorcoes-jujutsu-kaisen";
import { personagensJujutsuKaisen } from "@/content/psicoed/personagens-jujutsu-kaisen";

export default function DistorcoesJujutsuKaisen() {
  return (
    <TerritorioTorajo
      documentTitle="Distorções Cognitivas | Jujutsu Kaisen | Psicoeducação"
      eyebrow="Entender para cuidar · Jujutsu Kaisen"
      titulo={
        <>
          Distorções
          <br />
          Cognitivas
        </>
      }
      introCurta="Os 12 principais erros de pensamento — explicados pelos feiticeiros e maldições de Jujutsu Kaisen."
      introLonga="Assim como a energia amaldiçoada nasce das emoções negativas dos humanos, a nossa mente cria 'maldições invisíveis' na forma como enxergamos a realidade — interpretações exageradas, negativas e injustas. Vamos ver as 12 distorções cognitivas clássicas."
      personagens={personagensJujutsuKaisen}
      itens={distorcoesJujutsuKaisen}
      tipoConceito="distorção cognitiva"
      rotaVoltar="/psicoeducacao/mundos/jujutsu-kaisen"
      fechamentoTitulo="E se você exorcizasse esses erros de pensamento?"
      fechamentoTexto="Reconhecer uma distorção não significa que o pensamento é mentira o tempo todo — é aprender a checar antes de acreditar de cara. Isso se treina com prática e, quando fizer sentido, com apoio profissional."
    />
  );
}
