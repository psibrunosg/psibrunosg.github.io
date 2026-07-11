import { Component, type ReactNode } from "react";
import { AvisoBloco } from "./AvisoBloco";
import { MindMap } from "./MindMap";
import { Grafico } from "./Grafico";
import { Destaque } from "./Destaque";
import { Revelar } from "./Revelar";
import { Passos } from "./Passos";
import type { DestaqueData, GraficoData, MindMapData, PassosData, RevelarData } from "./types";

export const LINGUAGENS_RICAS = new Set(["mindmap", "grafico", "destaque", "revelar", "passos"]);

function isObjeto(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function validarMindMap(v: unknown): MindMapData | null {
  if (!isObjeto(v)) return null;
  if (typeof v.centro !== "string" || !Array.isArray(v.nos)) return null;
  const nos = v.nos.every(
    (n) => isObjeto(n) && typeof n.titulo === "string" && (n.filhos === undefined || Array.isArray(n.filhos)),
  );
  if (!nos) return null;
  return v as unknown as MindMapData;
}

function validarGrafico(v: unknown): GraficoData | null {
  if (!isObjeto(v)) return null;
  if (v.tipo !== "barras" && v.tipo !== "linha") return null;
  if (!Array.isArray(v.dados) || v.dados.length === 0) return null;
  const ok = v.dados.every((d) => isObjeto(d) && typeof d.label === "string" && typeof d.valor === "number");
  if (!ok) return null;
  return v as unknown as GraficoData;
}

function validarDestaque(v: unknown): DestaqueData | null {
  if (!isObjeto(v)) return null;
  if (!["dica", "alerta", "info", "mito"].includes(v.tipo as string)) return null;
  if (typeof v.texto !== "string") return null;
  return v as unknown as DestaqueData;
}

function validarRevelar(v: unknown): RevelarData | null {
  if (!isObjeto(v)) return null;
  if (typeof v.titulo !== "string" || typeof v.conteudo !== "string") return null;
  return v as unknown as RevelarData;
}

function validarPassos(v: unknown): PassosData | null {
  if (!isObjeto(v)) return null;
  if (!Array.isArray(v.passos) || v.passos.length === 0) return null;
  if (!v.passos.every((p) => typeof p === "string")) return null;
  return v as unknown as PassosData;
}

/**
 * Interpreta um fenced code block com linguagem custom (mindmap, grafico, destaque,
 * revelar, passos) e retorna o componente rico correspondente.
 * JSON invalido ou fora de forma nunca quebra a pagina: cai num aviso discreto.
 */
// Ultima linha de defesa: se algum bloco lancar em runtime (dado bem-formado mas
// inesperado), cai no aviso discreto em vez de derrubar a pagina inteira.
class LimiteErro extends Component<{ tipo: string; children: ReactNode }, { comErro: boolean }> {
  state = { comErro: false };
  static getDerivedStateFromError() {
    return { comErro: true };
  }
  render() {
    if (this.state.comErro) return <AvisoBloco tipo={this.props.tipo} />;
    return this.props.children;
  }
}

function renderizarBloco(lang: string, json: unknown): ReactNode {
  switch (lang) {
    case "mindmap": {
      const data = validarMindMap(json);
      return data ? <MindMap data={data} /> : <AvisoBloco tipo={lang} />;
    }
    case "grafico": {
      const data = validarGrafico(json);
      return data ? <Grafico data={data} /> : <AvisoBloco tipo={lang} />;
    }
    case "destaque": {
      const data = validarDestaque(json);
      return data ? <Destaque data={data} /> : <AvisoBloco tipo={lang} />;
    }
    case "revelar": {
      const data = validarRevelar(json);
      return data ? <Revelar data={data} /> : <AvisoBloco tipo={lang} />;
    }
    case "passos": {
      const data = validarPassos(json);
      return data ? <Passos data={data} /> : <AvisoBloco tipo={lang} />;
    }
    default:
      return <AvisoBloco tipo={lang} />;
  }
}

export function RichBlock({ lang, raw }: { lang: string; raw: string }) {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return <AvisoBloco tipo={lang} />;
  }

  return <LimiteErro tipo={lang}>{renderizarBloco(lang, json)}</LimiteErro>;
}
