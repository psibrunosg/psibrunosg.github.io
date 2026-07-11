-- Decisão clínica (09/07/2026): respostas_questionarios não deve mais exigir
-- identificação direta do paciente (nome, telefone). A identificação passa a
-- ser feita via patient_code (fluxo de código de acesso já implantado).
--
-- Esta migration NÃO remove nem apaga dados existentes: apenas torna a coluna
-- "nome" opcional para permitir novos envios sem PII direta. A coluna
-- "telefone" já era nullable. Nenhuma coluna é dropada — decisão sobre exclusão
-- de dados históricos (nome/telefone de respostas antigas) fica a critério do
-- psicólogo responsável, fora do escopo desta migration.

alter table public.respostas_questionarios
  alter column nome drop not null;

-- telefone já é nullable; comando idempotente apenas para deixar explícito
-- que ambos os campos de identificação direta são opcionais a partir de agora.
alter table public.respostas_questionarios
  alter column telefone drop not null;
