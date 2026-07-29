import TerritorioTorajo from "@/components/psicoed/TerritorioTorajo";
import { modosDemonSlayer } from "@/content/psicoed/modos-demon-slayer";
import { personagensDemonSlayer } from "@/content/psicoed/personagens-demon-slayer";

export default function ModosDemonSlayer() {
  return (
    <TerritorioTorajo
      documentTitle="Modos do Esquema | Demon Slayer | Psicoeducação"
      eyebrow="Entender para cuidar · Demon Slayer"
      titulo={
        <>
          Modos do
          <br />
          Esquema
        </>
      }
      introCurta="As máscaras e estados de humor que assumimos nos momentos difíceis — explicados pelo elenco de Demon Slayer."
      introLonga="Se os esquemas são as nossas feridas, os modos são as máscaras ou estados de humor que assumimos no dia a dia para lidar com elas. Existem modos infantis, vozes parentais, estilos de enfrentamento e o Adulto Saudável. Vamos conhecer os 10 principais através dos caçadores de demônios."
      personagens={personagensDemonSlayer}
      itens={modosDemonSlayer}
      fechamentoTitulo="Quem você quer que segure a espada?"
      fechamentoTexto="O objetivo não é nunca mais sentir raiva ou medo, mas fortalecer o Adulto Saudável — a parte que acolhe, coloca limites e escolhe com calma. Isso se treina com prática e, quando fizer sentido, com apoio profissional."
    />
  );
}
