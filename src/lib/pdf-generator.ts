import { jsPDF } from "jspdf";

interface ResultadoPDF {
  tipo: "PHQ-9" | "GAD-7";
  nome: string;
  pontuacao: number;
  nivel: string;
  respostas: number[];
  perguntas: string[];
  data: string;
}

export function gerarPDF(r: ResultadoPDF): jsPDF {
  const doc = new jsPDF();
  const w = doc.internal.pageSize.getWidth();

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(r.tipo + " - Resultado", w / 2, 25, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Bruno SG - Psicologo - CRP 07/44472", w / 2, 33, { align: "center" });
  doc.text("Documento gerado em " + r.data, w / 2, 39, { align: "center" });

  doc.setDrawColor(176, 93, 58);
  doc.line(20, 44, w - 20, 44);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Paciente: " + r.nome, 20, 55);
  doc.text("Pontuacao: " + r.pontuacao + " / " + (r.respostas.length * 3), 20, 63);
  doc.text("Classificacao: " + r.nivel, 20, 71);

  doc.line(20, 76, w - 20, 76);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Respostas detalhadas:", 20, 85);

  const opcLabels = ["Nenhuma vez (0)", "Varios dias (1)", "Mais da metade (2)", "Quase todos (3)"];
  let y = 95;

  doc.setFontSize(9);
  r.perguntas.forEach((p, i) => {
    if (y > 270) {
      doc.addPage();
      y = 25;
    }
    doc.setFont("helvetica", "bold");
    doc.text((i + 1) + ". " + p, 20, y, { maxWidth: w - 40 });
    const lines = doc.splitTextToSize((i + 1) + ". " + p, w - 40);
    y += lines.length * 4.5;
    doc.setFont("helvetica", "normal");
    doc.text("   R: " + opcLabels[r.respostas[i]], 20, y);
    y += 8;
  });

  y += 5;
  doc.setDrawColor(176, 93, 58);
  doc.line(20, y, w - 20, y);
  y += 10;

  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text("Este documento e de rastreio e nao constitui diagnostico.", 20, y);
  y += 5;
  doc.text("Resultado para uso exclusivo do psicologo responsavel.", 20, y);
  y += 5;
  doc.text("Sigilo profissional garantido conforme Codigo de Etica do Psicologo.", 20, y);

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