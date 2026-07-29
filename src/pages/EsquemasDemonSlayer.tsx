import TerritorioTorajo from "@/components/psicoed/TerritorioTorajo";
import { esquemasDemonSlayer } from "@/content/psicoed/esquemas-demon-slayer";
import { personagensDemonSlayer } from "@/content/psicoed/personagens-demon-slayer";

export default function EsquemasDemonSlayer() {
  return (
    <TerritorioTorajo
      documentTitle="Esquemas Iniciais Desadaptativos | Demon Slayer | Psicoeducação"
      eyebrow="Entender para cuidar · Demon Slayer"
      titulo={
        <>
          Esquemas Iniciais
          <br />
          Desadaptativos
        </>
      }
      introCurta="As feridas emocionais profundas através das quais enxergamos o mundo — explicadas pelos caçadores de Demon Slayer."
      introLonga="Imagine que, durante a vida, o cérebro instala um 'sistema' pra entender como o mundo funciona, geralmente baseado em traumas. Um esquema é como uma ferida emocional profunda que dita como você se sente em relação a si mesmo e aos outros. Vamos ver 12 deles na história de Demon Slayer."
      personagens={personagensDemonSlayer}
      itens={esquemasDemonSlayer}
      fechamentoTitulo="E se essas feridas pudessem cicatrizar?"
      fechamentoTexto="Reconhecer um esquema não é se rotular — é entender de onde vieram essas feridas e treinar um jeito novo de olhar. Isso se trabalha com tempo, prática e, muitas vezes, com apoio profissional."
    />
  );
}
