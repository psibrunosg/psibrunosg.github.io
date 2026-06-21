import jsPDF from "jspdf";
import {
  classificarPorFaixa, classificarG36, classificarNeoT, calcularTScoreNeoFFI,
  classificarAtencao, teadiSP, tealtSP,
  phq9Faixas, gad7Faixas, baiFaixas, bdiFaixas, bhsFaixas, asrsFaixas,
  neoDominioNomes, neoFacetasNomes, neoFacetasPorDominio,
  type NeoFFIDominio, type NeoSexo, type G36Escolaridade, type TesteId,
} from "@/content/normative-tables";
import {
  templatesPorTeste, templatesNeoDominio, templatesNeoFaceta, templatesNeoFFIDominio,
} from "@/content/parecer-templates";

export interface DadosPaciente {
  nome: string;
  idade: string;
  dataAvaliacao: string;
  escolaridade: string;
}

export interface ResultadoTeste {
  testeId: TesteId;
  sigla: string;
  nome: string;
  dados: Record<string, string | number>;
  resultado?: { classificacao: string; detalhes: string };
  texto?: string;
  textoEditado?: boolean;
}

function gerarTextoInterpretativo(testeId: string, classificacao: string, dados: Record<string, string | number>): string {
  if (testeId === "neo-pi") {
    const partes: string[] = [];
    const dominios: NeoFFIDominio[] = ["N", "E", "O", "A", "C"];
    for (const dom of dominios) {
      const tScore = Number(dados[dom] ?? 0);
      if (!tScore) continue;
      const cl = classificarNeoT(tScore);
      const tpl = templatesNeoDominio[dom]?.[cl];
      if (tpl) partes.push(tpl);
      for (const fac of neoFacetasPorDominio[dom]) {
        const ft = Number(dados[fac] ?? 0);
        if (!ft) continue;
        const fcl = classificarNeoT(ft);
        const ftpl = templatesNeoFaceta[fac]?.[fcl];
        if (ftpl) partes.push(`  ${fac} (${neoFacetasNomes[fac]}): ${ftpl}`);
      }
    }
    return partes.join("\n") || "Preencha os escores T para gerar o texto interpretativo.";
  }

  if (testeId === "neo-ffi") {
    const partes: string[] = [];
    const sexo = (dados.sexo as NeoSexo) || "combinado";
    const dominios: NeoFFIDominio[] = ["N", "E", "O", "A", "C"];
    for (const dom of dominios) {
      const bruto = Number(dados[dom] ?? 0);
      if (!bruto) continue;
      const t = calcularTScoreNeoFFI(dom, bruto, sexo);
      const cl = classificarNeoT(t);
      const tpl = templatesNeoFFIDominio[dom]?.[cl];
      if (tpl) partes.push(tpl);
    }
    return partes.join("\n") || "Preencha os escores brutos para gerar o texto interpretativo.";
  }

  return templatesPorTeste[testeId]?.[classificacao] ?? "";
}

export function processarTeste(t: ResultadoTeste): ResultadoTeste {
  const d = t.dados;
  const escore = Number(d.escore ?? 0);
  let resultado: { classificacao: string; detalhes: string };

  switch (t.testeId) {
    case "phq9": {
      const r = classificarPorFaixa(escore, phq9Faixas);
      resultado = { classificacao: r.classificacao, detalhes: `Escore total: ${escore}/27. ${r.descricao}` };
      break;
    }
    case "gad7": {
      const r = classificarPorFaixa(escore, gad7Faixas);
      resultado = { classificacao: r.classificacao, detalhes: `Escore total: ${escore}/21. ${r.descricao}` };
      break;
    }
    case "bai": {
      const r = classificarPorFaixa(escore, baiFaixas);
      resultado = { classificacao: r.classificacao, detalhes: `Escore total: ${escore}/63. ${r.descricao}` };
      break;
    }
    case "bdi": {
      const r = classificarPorFaixa(escore, bdiFaixas);
      resultado = { classificacao: r.classificacao, detalhes: `Escore total: ${escore}/63. ${r.descricao}` };
      break;
    }
    case "bhs": {
      const r = classificarPorFaixa(escore, bhsFaixas);
      resultado = { classificacao: r.classificacao, detalhes: `Escore total: ${escore}/20. ${r.descricao}` };
      break;
    }
    case "asrs": {
      const r = classificarPorFaixa(escore, asrsFaixas);
      resultado = { classificacao: r.classificacao, detalhes: `Escore total: ${escore}. ${r.descricao}` };
      break;
    }
    case "g36": {
      const esc = (d.escolaridade as G36Escolaridade) || "geral";
      const r = classificarG36(escore, esc);
      resultado = { classificacao: r.classificacao, detalhes: `Acertos: ${escore}/36. Percentil: ${r.percentil}. Classificação: ${r.classificacao}.` };
      break;
    }
    case "neo-ffi": {
      const sexo = (d.sexo as NeoSexo) || "combinado";
      const dominios: NeoFFIDominio[] = ["N", "E", "O", "A", "C"];
      const linhas = dominios.map((dom) => {
        const bruto = Number(d[dom] ?? 0);
        if (!bruto) return null;
        const tVal = calcularTScoreNeoFFI(dom, bruto, sexo);
        const cl = classificarNeoT(tVal);
        return `${neoDominioNomes[dom]}: bruto=${bruto}, T=${tVal} (${cl})`;
      }).filter(Boolean);
      resultado = { classificacao: "Ver detalhes", detalhes: linhas.join("\n") };
      break;
    }
    case "neo-pi": {
      const dominios: NeoFFIDominio[] = ["N", "E", "O", "A", "C"];
      const linhas: string[] = [];
      for (const dom of dominios) {
        const tScore = Number(d[dom] ?? 0);
        if (!tScore) continue;
        const cl = classificarNeoT(tScore);
        linhas.push(`${neoDominioNomes[dom]} (${dom}): T=${tScore} — ${cl}`);
        for (const fac of neoFacetasPorDominio[dom]) {
          const ft = Number(d[fac] ?? 0);
          if (!ft) continue;
          const fcl = classificarNeoT(ft);
          linhas.push(`  ${fac} ${neoFacetasNomes[fac]}: T=${ft} — ${fcl}`);
        }
      }
      resultado = { classificacao: "Ver detalhes", detalhes: linhas.join("\n") || "Preencha os escores T." };
      break;
    }
    case "teadi": {
      const r = classificarAtencao(escore, teadiSP);
      resultado = { classificacao: r.classificacao, detalhes: `Pontuação: ${escore}. Percentil: ${r.percentil}. Classificação: ${r.classificacao}. (Normas SP)` };
      break;
    }
    case "tealt": {
      const r = classificarAtencao(escore, tealtSP);
      resultado = { classificacao: r.classificacao, detalhes: `Pontuação: ${escore}. Percentil: ${r.percentil}. Classificação: ${r.classificacao}. (Normas SP)` };
      break;
    }
    default:
      resultado = { classificacao: "N/A", detalhes: `Escore: ${escore}` };
  }

  const textoAuto = gerarTextoInterpretativo(t.testeId, resultado.classificacao, d);
  return {
    ...t,
    resultado,
    texto: t.textoEditado ? t.texto : textoAuto,
  };
}

export function gerarParecerPDF(paciente: DadosPaciente, testes: ResultadoTeste[], sintese: string, consideracoes: string): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 190;
  const ML = 10;
  let y = 15;

  function addLine(text: string, size = 10, bold = false, color: [number, number, number] = [40, 40, 40]) {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, W);
    for (const line of lines) {
      if (y > 275) { doc.addPage(); y = 15; }
      doc.text(line, ML, y);
      y += size * 0.45;
    }
  }

  function addSpace(mm = 4) { y += mm; }
  function addSeparator() {
    doc.setDrawColor(200, 200, 200);
    doc.line(ML, y, ML + W, y);
    y += 4;
  }

  addLine("PARECER PSICOLÓGICO", 16, true, [30, 30, 30]);
  addSpace(6);
  addSeparator();

  addLine("DADOS DO PACIENTE", 11, true);
  addSpace(2);
  addLine(`Nome: ${paciente.nome}`);
  addLine(`Idade: ${paciente.idade}`);
  addLine(`Data da avaliação: ${paciente.dataAvaliacao}`);
  addLine(`Escolaridade: ${paciente.escolaridade}`);
  addSpace(4);
  addSeparator();

  addLine("1. INSTRUMENTOS APLICADOS", 12, true);
  addSpace(2);
  for (const t of testes) {
    addLine(`• ${t.sigla} — ${t.nome}`);
  }
  addSpace(4);
  addSeparator();

  addLine("2. RESULTADOS", 12, true);
  addSpace(2);
  for (const t of testes) {
    addLine(`${t.sigla} — ${t.nome}`, 10, true);
    addSpace(1);
    if (t.resultado) {
      const detLines = t.resultado.detalhes.split("\n");
      for (const dl of detLines) {
        addLine(dl);
      }
    }
    if (t.texto) {
      addSpace(2);
      addLine("Interpretação:", 9, true, [80, 80, 80]);
      addSpace(1);
      const textoLines = t.texto.split("\n");
      for (const tl of textoLines) {
        addLine(tl, 9, false, [60, 60, 60]);
      }
    }
    addSpace(4);
  }
  addSeparator();

  if (sintese.trim()) {
    addLine("3. SÍNTESE", 12, true);
    addSpace(2);
    addLine(sintese);
    addSpace(4);
    addSeparator();
  }

  if (consideracoes.trim()) {
    addLine("4. CONSIDERAÇÕES FINAIS", 12, true);
    addSpace(2);
    addLine(consideracoes);
    addSpace(4);
    addSeparator();
  }

  addSpace(8);
  addLine(`Pelotas/RS, ${paciente.dataAvaliacao}`, 10, false, [100, 100, 100]);
  addSpace(12);
  addLine("_______________________________", 10, false, [100, 100, 100]);
  addSpace(2);
  addLine("Bruno SG", 10, true);
  addLine("Psicólogo — CRP 07/44472");
  addSpace(6);
  addLine("Este documento é de caráter sigiloso conforme o Código de Ética do Psicólogo.", 8, false, [140, 140, 140]);

  return doc;
}
