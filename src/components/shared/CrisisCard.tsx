import { motion } from "framer-motion";
import { Phone, HeartHandshake } from "lucide-react";

/**
 * Card de apoio em crise exibido na tela de resultado quando há indicador de risco.
 * variant "suicida": ênfase em ideação suicida / desesperança (CVV 188 em destaque).
 * variant "apoio": tom mais leve para sofrimento elevado sem indicador suicida direto.
 */
export function CrisisCard({ variant = "suicida" }: { variant?: "suicida" | "apoio" }) {
  const suicida = variant === "suicida";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      role="alert"
      className="mx-auto mb-6 max-w-md rounded-2xl border-2 p-5 text-left"
      style={{ borderColor: "#b9472f", background: "color-mix(in oklab, #b9472f 8%, transparent)" }}
    >
      <div className="mb-2 flex items-center gap-2">
        <HeartHandshake size={18} style={{ color: "#b9472f" }} aria-hidden="true" />
        <strong className="text-sm" style={{ color: "#b9472f" }}>
          {suicida ? "Você não está sozinho(a)" : "Procure apoio"}
        </strong>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-[var(--c-text)]">
        {suicida
          ? "Suas respostas indicam que você pode estar passando por um momento muito difícil. Se você está pensando em se machucar ou sente que não vale a pena continuar, busque ajuda agora — há pessoas prontas para te ouvir, 24 horas por dia, de forma gratuita e sigilosa."
          : "Suas respostas indicam sofrimento elevado. Não precisa enfrentar isso sozinho(a) — converse com seu psicólogo e, se precisar de apoio imediato, os contatos abaixo estão disponíveis a qualquer hora."}
      </p>
      <div className="space-y-2">
        <a href="tel:188"
          className="flex items-center gap-2 rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-2.5 text-sm font-semibold text-[var(--c-text)] transition-colors hover:border-[#b9472f]">
          <Phone size={15} style={{ color: "#b9472f" }} aria-hidden="true" />
          CVV — Centro de Valorização da Vida · 188 (24h)
        </a>
        <a href="tel:192"
          className="flex items-center gap-2 rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-2.5 text-sm font-semibold text-[var(--c-text)] transition-colors hover:border-[#b9472f]">
          <Phone size={15} style={{ color: "#b9472f" }} aria-hidden="true" />
          SAMU · 192 (emergência médica)
        </a>
      </div>
      <p className="mt-3 text-[10px] leading-relaxed text-[var(--c-muted)]">
        Em caso de risco imediato à vida, procure o serviço de emergência mais próximo ou ligue 192.
      </p>
    </motion.div>
  );
}
