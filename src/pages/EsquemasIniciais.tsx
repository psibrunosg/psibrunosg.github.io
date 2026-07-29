import TerritorioTorajo from "@/components/psicoed/TerritorioTorajo";
import { esquemas } from "@/content/psicoed/esquemas";
import { personagens } from "@/content/psicoed/personagens";

export default function EsquemasIniciais() {
  return (
    <TerritorioTorajo
      documentTitle="Esquemas Iniciais Desadaptativos | Psicoeducação | Bruno de Souza Gonçalves"
      eyebrow="Entender para cuidar · Mundo Torajo"
      titulo={
        <>
          Esquemas Iniciais
          <br />
          Desadaptativos
        </>
      }
      introCurta="As lentes profundas através das quais enxergamos o mundo — explicadas pelos personagens do Mundo Torajo."
      introLonga="Imagine que, durante a infância e adolescência, o cérebro instala um 'sistema operacional' pra entender como o mundo funciona. Um esquema é como uma lente de óculos super grossa — dita como você se sente em relação a si mesmo e aos outros. Vamos usar a turma do Mundo Torajo pra enxergar 12 deles."
      personagens={personagens}
      itens={esquemas}
      tipoConceito="esquema inicial"
      rotaVoltar="/psicoeducacao/mundos/torajo"
      fechamentoTitulo="E se essas lentes pudessem ser trocadas?"
      fechamentoTexto="Reconhecer um esquema não é se rotular — é entender de onde vieram essas lentes e treinar um jeito novo de olhar. Isso se trabalha com tempo, prática e, muitas vezes, com apoio profissional."
      fechamentoLinkExtra={{ titulo: "Quer ir mais fundo? Conheça \"De onde vêm seus padrões\"", rota: "/psicoeducacao/de-onde-vem-seus-padroes" }}
    />
  );
}
