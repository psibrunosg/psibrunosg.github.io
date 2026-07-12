-- Espelho de migration já aplicada manualmente no banco remoto em 2026-07-12.
-- Adiciona a coluna nome_paciente para que o painel deixe de depender de
-- localStorage como fonte de verdade dos nomes dos pacientes.
-- RLS já restringe leitura/escrita de patient_codes ao terapeuta autenticado
-- (policy "Therapist manage codes"), então nenhuma policy nova é necessária.

alter table public.patient_codes
  add column if not exists nome_paciente text;
