export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[var(--c-accent)] focus:text-white focus:rounded focus:outline-none"
    >
      Pular para o conteúdo principal
    </a>
  );
}
