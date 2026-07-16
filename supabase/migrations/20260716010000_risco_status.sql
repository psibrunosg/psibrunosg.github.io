-- Feature 10: status persistente do painel de risco (aberto / em acompanhamento / resolvido).
-- Nullable: null é tratado pela UI como "aberto" (ver src/pages/bruno/Painel.tsx).
ALTER TABLE public.respostas_questionarios ADD COLUMN IF NOT EXISTS risco_status text;
