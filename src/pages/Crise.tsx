import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, MessageCircle, MapPin, Users, ArrowLeft } from "lucide-react";
import { SkipLink } from "@/components/shared/SkipLink";
import { contato } from "@/content/copy";

export default function Crise() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Precisa de ajuda agora? | Bruno Souza Psicólogo";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <>
      <SkipLink />

      <main
        id="main"
        className="min-h-screen px-6 py-10 md:py-16"
        style={{ background: "var(--c-bg)", color: "var(--c-text)" }}
      >
        <div className="mx-auto max-w-xl">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: "var(--c-muted)" }}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar ao site
          </Link>

          <h1
            className="mb-3 text-3xl font-bold leading-tight md:text-4xl"
            style={{ fontFamily: "var(--font-heading)", color: "var(--c-text)" }}
          >
            Precisa de ajuda agora?
          </h1>

          <p className="mb-10 text-base leading-relaxed" style={{ color: "var(--c-text)" }}>
            Se você está em sofrimento intenso ou em risco, não precisa passar por isso sozinho.
            Existem pessoas preparadas para te ouvir agora, 24 horas por dia. Ligar não resolve
            tudo de uma vez, mas pode ser um primeiro passo importante.
          </p>

          {/* CVV */}
          <section
            className="mb-5 rounded-2xl border-2 p-6"
            style={{ borderColor: "var(--c-accent)", background: "var(--c-surface)" }}
            aria-labelledby="cvv-heading"
          >
            <h2 id="cvv-heading" className="mb-1 text-lg font-bold" style={{ color: "var(--c-text)" }}>
              CVV — Centro de Valorização da Vida
            </h2>
            <p className="mb-4 text-sm" style={{ color: "var(--c-muted)" }}>
              Apoio emocional e prevenção do suicídio. Gratuito, sigiloso, 24 horas por dia, todos os dias.
            </p>
            <a
              href="tel:188"
              className="mb-3 flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 text-lg font-bold text-white"
              style={{ background: "var(--c-accent)" }}
            >
              <Phone size={22} aria-hidden="true" />
              Ligar para 188 (gratuito)
            </a>
            <a
              href="https://www.cvv.org.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-xl border-2 px-6 py-3.5 text-base font-semibold"
              style={{ borderColor: "var(--c-accent)", color: "var(--c-accent)" }}
            >
              <MessageCircle size={20} aria-hidden="true" />
              Conversar por chat em cvv.org.br
            </a>
          </section>

          {/* SAMU */}
          <section
            className="mb-5 rounded-2xl border-2 p-6"
            style={{ borderColor: "var(--c-warm)", background: "var(--c-surface)" }}
            aria-labelledby="samu-heading"
          >
            <h2 id="samu-heading" className="mb-1 text-lg font-bold" style={{ color: "var(--c-text)" }}>
              SAMU — Emergência médica
            </h2>
            <p className="mb-4 text-sm" style={{ color: "var(--c-muted)" }}>
              Use em caso de risco imediato à vida, seja seu ou de outra pessoa.
            </p>
            <a
              href="tel:192"
              className="flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 text-lg font-bold text-white"
              style={{ background: "var(--c-warm)" }}
            >
              <Phone size={22} aria-hidden="true" />
              Ligar para 192 (SAMU)
            </a>
          </section>

          {/* UPA/CAPS */}
          <section
            className="mb-5 rounded-2xl border p-6"
            style={{ borderColor: "var(--c-border)", background: "var(--c-surface)" }}
            aria-labelledby="upa-heading"
          >
            <div className="mb-2 flex items-center gap-2">
              <MapPin size={20} style={{ color: "var(--c-accent)" }} aria-hidden="true" />
              <h2 id="upa-heading" className="text-lg font-bold" style={{ color: "var(--c-text)" }}>
                UPA ou CAPS mais próximo
              </h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>
              As Unidades de Pronto Atendimento (UPA) e os Centros de Atenção Psicossocial (CAPS)
              oferecem acolhimento presencial em situações de crise. Procure a unidade mais próxima
              da sua cidade — se preferir, ligue para o SAMU (192) e peça orientação sobre onde ir.
            </p>
          </section>

          {/* Pessoa de confiança */}
          <section
            className="mb-10 rounded-2xl border p-6"
            style={{ borderColor: "var(--c-border)", background: "var(--c-surface)" }}
            aria-labelledby="apoio-heading"
          >
            <div className="mb-2 flex items-center gap-2">
              <Users size={20} style={{ color: "var(--c-accent)" }} aria-hidden="true" />
              <h2 id="apoio-heading" className="text-lg font-bold" style={{ color: "var(--c-text)" }}>
                Chame alguém de confiança
              </h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>
              Se for possível, avise um familiar, amigo ou outra pessoa próxima sobre o que você
              está sentindo agora. Não precisa explicar tudo — só pedir companhia já pode ajudar.
            </p>
          </section>

          <p
            className="rounded-xl px-5 py-4 text-center text-sm leading-relaxed"
            style={{ background: "var(--c-warm-lt)", color: "var(--c-text)" }}
          >
            Você não precisa atravessar isso sozinho. Buscar ajuda é um ato de coragem, não de fraqueza.
          </p>

          <p className="mt-8 text-center text-xs" style={{ color: "var(--c-muted)" }}>
            {contato.nome} · Psicólogo · {contato.crp}
          </p>
        </div>
      </main>
    </>
  );
}
