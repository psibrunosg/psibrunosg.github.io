import TerritorioTorajo from "@/components/psicoed/TerritorioTorajo";
import { modosTorajo } from "@/content/psicoed/modos-torajo";
import { personagens } from "@/content/psicoed/personagens";

export default function ModosEsquema() {
  return (
    <TerritorioTorajo
      documentTitle="Modos do Esquema | Psicoeducação | Bruno de Souza Gonçalves"
      personagens={personagens}
      eyebrow="Entender para cuidar · Mundo Torajo"
      titulo={
        <>
          Modos do
          <br />
          Esquema
        </>
      }
      introCurta="As diferentes 'vozes' que assumem o controle nos momentos difíceis — explicadas pelos personagens do Mundo Torajo."
      introLonga="Sabe quando você age de um jeito tão impulsivo ou agressivo que depois pensa 'nossa, parecia que não era eu'? Chamamos isso de modo: uma parte de você que assume o controle da mente e do corpo em um momento de estresse. Vamos conhecer 10 modos principais na turma do Mundo Torajo — e qual deles é quem você quer fortalecer."
      itens={modosTorajo}
      rotaVoltar="/psicoeducacao/mundos/torajo"
      fechamentoTitulo="Quem você quer que segure o microfone?"
      fechamentoTexto="O objetivo não é nunca mais sentir raiva ou medo, mas fortalecer o Adulto Saudável — a parte que acolhe, coloca limites e escolhe com calma. Isso se treina com prática e, quando fizer sentido, com apoio profissional."
    />
  );
}
