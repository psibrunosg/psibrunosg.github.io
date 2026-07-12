// Escalas de acesso restrito: exigem código gerado pelo psicólogo para
// serem respondidas (ver Escala.tsx, etapa "codigo", e a edge function
// validate-code). Não devem aparecer na listagem pública do Hub do
// paciente, apenas ser acessíveis por link direto.
export const ESCALAS_RESTRITAS = [
  { id: "neoffir", label: "NEO-FFI-R" },
  { id: "neopir", label: "NEO-PI-R" },
  { id: "bdi", label: "BDI" },
  { id: "bai", label: "BAI" },
  { id: "bhs", label: "BHS" },
  { id: "bss", label: "BSS" },
  { id: "cssrs", label: "C-SSRS (Rastreio)" },
] as const;

export const ESCALAS_RESTRITAS_IDS: Set<string> = new Set(ESCALAS_RESTRITAS.map((e) => e.id));

export type EscalaRestritaId = (typeof ESCALAS_RESTRITAS)[number]["id"];
