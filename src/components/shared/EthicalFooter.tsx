import { Link } from "react-router-dom";
import { contato } from "@/content/copy";

export function EthicalFooter() {
  return (
    <footer
      className="border-t border-[var(--c-border)] px-6 py-12"
      aria-label="Rodapé profissional"
    >
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.35fr_2fr]">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[var(--c-text)]">
            {contato.nome} · Psicólogo · <strong>{contato.crp}</strong>
          </p>
          <p className="text-xs text-[var(--c-muted)]">{contato.modalidade}</p>
          <p className="max-w-md pt-2 text-xs leading-relaxed text-[var(--c-muted)] opacity-80">
            Atuação conforme o Código de Ética Profissional do Psicólogo e, no atendimento online, a Resolução CFP nº 09/2024.
          </p>
        </div>

        <nav aria-label="Mapa do site" className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div className="flex flex-col items-start gap-3">
            <strong className="text-xs uppercase tracking-[0.14em] text-[var(--c-text)]">Atendimento</strong>
            <Link to="/" className="text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]">Início</Link>
            <Link to="/como-funciona" className="text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]">Como funciona</Link>
            <Link to="/faq" className="text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]">Dúvidas</Link>
          </div>
          <div className="flex flex-col items-start gap-3">
            <strong className="text-xs uppercase tracking-[0.14em] text-[var(--c-text)]">Recursos</strong>
            <Link to="/exercicios" className="text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]">Exercícios</Link>
            <Link to="/psicoeducacao" className="text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]">Psicoeducação</Link>
            <Link to="/paciente" className="text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]">Área do paciente</Link>
            <Link to="/blog" className="text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]">Blog</Link>
          </div>
          <div className="flex flex-col items-start gap-3">
            <strong className="text-xs uppercase tracking-[0.14em] text-[var(--c-text)]">Cuidado e dados</strong>
            <Link to="/crise" className="text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]">Ajuda imediata</Link>
            <Link to="/privacidade" className="text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]">Privacidade</Link>
          </div>
        </nav>
      </div>
    </footer>
  );
}
