import TerritorioTorajo from "@/components/psicoed/TerritorioTorajo";
import { esquemasJujutsuKaisen } from "@/content/psicoed/esquemas-jujutsu-kaisen";
import { personagensJujutsuKaisen } from "@/content/psicoed/personagens-jujutsu-kaisen";

export default function EsquemasJujutsuKaisen() {
  return (
    <TerritorioTorajo
      documentTitle="Esquemas Iniciais Desadaptativos | Jujutsu Kaisen | Psicoeducação"
      eyebrow="Entender para cuidar · Jujutsu Kaisen"
      titulo={
        <>
          Esquemas Iniciais
          <br />
          Desadaptativos
        </>
      }
      introCurta="As marcas que o trauma deixa na alma — explicadas pelo universo de Jujutsu Kaisen."
      introLonga="Na sociedade Jujutsu, ressentimentos e traumas geram maldições. Na vida real, nossos traumas e necessidades não atendidas na infância geram os Esquemas Iniciais Desadaptativos — feridas emocionais que ditam quem você ama, de quem foge e como reage ao medo. Vamos ver 6 delas."
      personagens={personagensJujutsuKaisen}
      itens={esquemasJujutsuKaisen}
      rotaVoltar="/psicoeducacao/mundos/jujutsu-kaisen"
      fechamentoTitulo="E se essas feridas pudessem cicatrizar?"
      fechamentoTexto="Reconhecer um esquema não é se rotular — é entender de onde vieram essas feridas e treinar um jeito novo de olhar. Isso se trabalha com tempo, prática e, muitas vezes, com apoio profissional."
    />
  );
}
