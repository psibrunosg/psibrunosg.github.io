import { Link } from "react-router-dom";

interface NavItem { label: string; href: string }

interface Props {
  items: NavItem[];
  whatsappLink: string;
  brand?: string;
}

export function Navbar({ items, whatsappLink, brand = "Clínica Bruno de Souza Gonçalves" }: Props) {
  return (
    <header className="hidden md:block fixed top-0 inset-x-0 z-[60]">
      <nav
        aria-label="Navegação principal"
        className="bg-[var(--c-bg-dark)]/80 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link
            to="/"
            className="text-lg text-white tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {brand}
          </Link>

          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                {item.href.startsWith("/") ? (
                  <Link
                    to={item.href}
                    className="block px-3 py-2 text-sm text-white/85 hover:text-white transition-colors rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className="block px-3 py-2 text-sm text-white/85 hover:text-white transition-colors rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-4 py-2 rounded-full bg-[var(--c-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Agendar
          </a>
        </div>
      </nav>
    </header>
  );
}
