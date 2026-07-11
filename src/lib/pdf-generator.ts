import { jsPDF } from "jspdf";
import type { RespostaInterpretada } from "@/lib/interpret";

interface ResultadoPDF {
  tipo: string;
  nome: string;
  pontuacao: number;
  nivel: string;
  respostas: number[];
  perguntas: string[];
  data: string;
  /** Rotulo por valor da escala (mata "undefined" em escalas 1-6). */
  optionLabel?: (valor: number) => string | null;
  /** Leitura rica (interpretarResposta): torna Classificacao especifica. */
  interp?: RespostaInterpretada;
}

const opcLabels = ["Nenhuma vez (0)", "Varios dias (1)", "Mais da metade (2)", "Quase todos (3)"];

function rotuloResposta(r: ResultadoPDF, valor: number): string {
  const label = r.optionLabel ? r.optionLabel(valor) : (opcLabels[valor] ?? null);
  if (label) return label.includes("(") ? label : `${label} (${valor})`;
  return valor === undefined || valor === null ? "-" : String(valor);
}

export function gerarPDF(r: ResultadoPDF): jsPDF {
  const doc = new jsPDF();
  const w = doc.internal.pageSize.getWidth();
  let y = 0;

  // Escritor com quebra de pagina automatica.
  const write = (
    text: string,
    opts: { size?: number; style?: "normal" | "bold" | "italic"; indent?: number; gap?: number } = {},
  ) => {
    const { size = 9, style = "normal", indent = 0, gap = 5 } = opts;
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    const lines = doc.splitTextToSize(text, w - 40 - indent) as string[];
    for (const ln of lines) {
      if (y > 278) { doc.addPage(); y = 25; }
      doc.text(ln, 20 + indent, y);
      y += gap;
    }
  };

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(r.tipo + " - Resultado", w / 2, 25, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Bruno Souza - Psicologo - CRP 07/44472", w / 2, 33, { align: "center" });
  doc.text("Documento gerado em " + r.data, w / 2, 39, { align: "center" });

  doc.setDrawColor(62, 107, 92);
  doc.line(20, 44, w - 20, 44);

  y = 55;
  write("Paciente: " + r.nome, { size: 12, style: "bold", gap: 8 });

  // --- Bloco Pontuacao/Classificacao ---
  const interp = r.interp;
  if (interp && interp.familia === "schema") {
    const unidadeCap = interp.unidade === "modo" ? "Modos" : "Esquemas";
    write(`${unidadeCap} ativos: ${interp.totalAtivos ?? 0} de ${interp.totalEsquemas ?? 0} mapeados`, { size: 12, style: "bold", gap: 8 });
    for (const rd of interp.rodadas ?? []) {
      const naoPositivos = rd.esquemas.filter((e) => !e.positivo).length;
      const titulo = rd.label ? `${rd.label}: ` : "";
      write(`${titulo}${rd.ativos.length} de ${naoPositivos} ${interp.unidade}s ativos`, { size: 10, style: "bold", gap: 6 });
      if (rd.ativos.length > 0) {
        for (const e of rd.ativos) {
          write(`- ${e.nome} (${e.dominio}) - media ${e.media.toFixed(1)}`, { size: 9, indent: 4 });
        }
      } else {
        write(`Nenhum ${interp.unidade} ativo (media acima de 3.5).`, { size: 9, indent: 4 });
      }
      if (rd.saudavelAtivo) {
        write(`Modo saudavel presente: ${rd.saudavelAtivo.nome} (${rd.saudavelAtivo.media.toFixed(1)})`, { size: 9, indent: 4 });
      }
      y += 1;
    }
  } else if (interp && interp.familia === "threshold") {
    const un = interp.unidadeDefesa ?? "defesa";
    write(`Pontuacao: ${interp.flagged?.length ?? 0} ${un}(s) ativa(s)`, { size: 12, style: "bold", gap: 8 });
    if (interp.flagged && interp.flagged.length > 0) {
      for (const f of interp.flagged) {
        write(`- ${f.texto} (nota ${f.valor})`, { size: 9, indent: 4 });
      }
    } else {
      write(`Nenhuma ${un} ativa (nenhum item com nota >= 5).`, { size: 9, indent: 4 });
    }
    y += 1;
  } else if (interp) {
    // faixa / dominio
    write(`Pontuacao: ${interp.total ?? r.pontuacao} / ${interp.max ?? (r.respostas.length * 3)}`, { size: 12, style: "bold", gap: 8 });
    write("Classificacao: " + (interp.classificacao ?? r.nivel), { size: 12, style: "bold", gap: 7 });
    if (interp.descricao) write(interp.descricao, { size: 9, gap: 5 });
    if (interp.dominios && interp.dominios.length > 0) {
      write("Dominios:", { size: 10, style: "bold", gap: 6 });
      for (const d of interp.dominios) {
        write(`- ${d.nome}: media ${d.media.toFixed(1)} (soma ${d.soma})`, { size: 9, indent: 4 });
      }
    }
    y += 1;
  } else {
    // Fallback (sem interp): comportamento antigo.
    write("Pontuacao: " + r.pontuacao + " / " + (r.respostas.length * 3), { size: 12, style: "bold", gap: 8 });
    write("Classificacao: " + r.nivel, { size: 12, style: "bold", gap: 7 });
  }

  y += 2;
  doc.setDrawColor(62, 107, 92);
  doc.line(20, y, w - 20, y);
  y += 9;

  write("Respostas detalhadas:", { size: 11, style: "bold", gap: 8 });

  r.perguntas.forEach((p, i) => {
    write((i + 1) + ". " + p, { size: 9, style: "bold", gap: 4.5 });
    write("   R: " + rotuloResposta(r, r.respostas[i]), { size: 9, style: "normal", gap: 8 });
  });

  y += 5;
  if (y > 278) { doc.addPage(); y = 25; }
  doc.setDrawColor(62, 107, 92);
  doc.line(20, y, w - 20, y);
  y += 10;

  write("Este documento e de rastreio e nao constitui diagnostico.", { size: 8, style: "italic", gap: 5 });
  write("Resultado para uso exclusivo do psicologo responsavel.", { size: 8, style: "italic", gap: 5 });
  write("Sigilo profissional garantido conforme Codigo de Etica do Psicologo.", { size: 8, style: "italic", gap: 5 });

  return doc;
}

export function baixarPDF(r: ResultadoPDF) {
  const doc = gerarPDF(r);
  doc.save(r.tipo + "_" + r.nome.replace(/\s+/g, "_") + "_" + r.data.replace(/\//g, "-") + ".pdf");
}

export function gerarWhatsAppLink(r: ResultadoPDF, telefonePsi: string): string {
  const msg = encodeURIComponent(
    "Ola Bruno, segue meu resultado do " + r.tipo + ":\n\n" +
    "Nome: " + r.nome + "\n" +
    "Pontuacao: " + r.pontuacao + "/" + (r.respostas.length * 3) + "\n" +
    "Classificacao: " + r.nivel + "\n" +
    "Data: " + r.data + "\n\n" +
    "O PDF com detalhes foi baixado no meu dispositivo."
  );
  return "https://wa.me/" + telefonePsi + "?text=" + msg;
}

export function gerarEmailLink(r: ResultadoPDF, emailPsi: string): string {
  const subject = encodeURIComponent(r.tipo + " - " + r.nome + " - " + r.data);
  const body = encodeURIComponent(
    "Resultado " + r.tipo + "\n\n" +
    "Paciente: " + r.nome + "\n" +
    "Pontuacao: " + r.pontuacao + "/" + (r.respostas.length * 3) + "\n" +
    "Classificacao: " + r.nivel + "\n" +
    "Data: " + r.data + "\n\n" +
    "Respostas:\n" +
    r.perguntas.map((p, i) => (i+1) + ". " + p + " -> " + r.respostas[i]).join("\n") +
    "\n\nO PDF com detalhes foi baixado no dispositivo do paciente." +
    "\n\nEste documento e de rastreio e nao constitui diagnostico."
  );
  return "mailto:" + emailPsi + "?subject=" + subject + "&body=" + body;
}
