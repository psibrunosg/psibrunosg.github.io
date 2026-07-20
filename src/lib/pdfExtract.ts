// Extração de texto de PDF no browser (pdfjs-dist) — usado pelo anexo de
// referência da Conceituação Cognitiva. Texto extraído passa pela mesma
// redação de nome (src/lib/redacao.ts) antes de sair pro backend/IA.
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

/** Extrai o texto de todas as páginas de um PDF (arquivo local, no browser). */
export async function extrairTextoPDF(arquivo: File): Promise<string> {
  const buffer = await arquivo.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
  const paginas: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const pagina = await doc.getPage(i);
    const conteudo = await pagina.getTextContent();
    const texto = conteudo.items.map((item) => ("str" in item ? item.str : "")).join(" ");
    paginas.push(texto);
  }
  return paginas.join("\n\n").trim();
}
