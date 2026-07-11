// Aviso discreto exibido quando um bloco rico tem JSON invalido ou dados incompletos.
// Nunca deve quebrar a renderizacao da pagina.

export function AvisoBloco({ tipo }: { tipo: string }) {
  return (
    <div
      className="not-prose my-4 rounded-xl border border-dashed border-[var(--c-border)] bg-[var(--c-surface)] px-4 py-3 text-xs text-[var(--c-muted)]"
      role="note"
    >
      Nao foi possivel exibir o bloco &ldquo;{tipo}&rdquo; deste artigo (conteudo malformado).
    </div>
  );
}
