import TerritorioTorajo from "@/components/psicoed/TerritorioTorajo";
import { modosJujutsuKaisen } from "@/content/psicoed/modos-jujutsu-kaisen";
import { personagensJujutsuKaisen } from "@/content/psicoed/personagens-jujutsu-kaisen";

export default function ModosJujutsuKaisen() {
  return (
    <TerritorioTorajo
      documentTitle="Modos do Esquema | Jujutsu Kaisen | Psicoeducação"
      eyebrow="Entender para cuidar · Jujutsu Kaisen"
      titulo={
        <>
          Modos do
          <br />
          Esquema
        </>
      }
      introCurta="As máscaras de proteção e defesa que usamos no dia a dia — explicadas por Jujutsu Kaisen."
      introLonga="Quando um trauma do passado (esquema) é ativado no presente, nós assumimos um 'modo': o estado emocional em que entramos pra tentar nos proteger, atacar de volta ou fugir. Vamos conhecer os 10 principais modos através dos feiticeiros de Jujutsu Kaisen."
      personagens={personagensJujutsuKaisen}
      itens={modosJujutsuKaisen}
      rotaVoltar="/psicoeducacao/mundos/jujutsu-kaisen"
      fechamentoTitulo="Quem você quer que segure a técnica amaldiçoada?"
      fechamentoTexto="O objetivo não é nunca mais sentir raiva ou medo, mas fortalecer o Adulto Saudável — a parte que acolhe, coloca limites e escolhe com calma. Isso se treina com prática e, quando fizer sentido, com apoio profissional."
    />
  );
}
