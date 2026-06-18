import { contato } from "@/content/copy";

export function EthicalFooter() {
  return (
    <footer
      className="border-t border-[var(--c-border)] py-10 px-6 text-center"
      aria-label="Rodapé profissional"
    >
      <div className="max-w-xl mx-auto space-y-2">
        <p className="text-sm font-medium text-[var(--c-text)]">
          {contato.nome} · Psicólogo · <strong>{contato.crp}</strong>
        </p>
        <p className="text-xs text-[var(--c-muted)]">
          {contato.modalidade}
        </p>
        <p className="text-xs text-[var(--c-muted)] opacity-70">
          Exercício profissional em conformidade com o Código de Ética Profissional do Psicólogo (CFP / Resolução 11/2018)
        </p>
      </div>
    </footer>
  );
}