import { DocumentLayout, DocSection, SignatureBlock } from "@/components/shared/DocumentLayout";

export default function Contrato() {
  return (
    <DocumentLayout
      eyebrow="Documento clínico"
      titulo="Contrato Terapêutico"
      subtitulo="Bruno Souza, Psicólogo, CRP 07/44472"
      pdfHref="/documentos/contrato-terapeutico.pdf"
    >
      <DocSection titulo="Identificação das partes">
        <p>
          <strong>Contratado:</strong> Bruno Souza, Psicólogo, CRP 07/44472.
        </p>
        <p>
          <strong>Contratante (paciente):</strong> Nome completo: [a combinar] · CPF: [a combinar]
          · Data de nascimento: [a combinar] · Telefone/e-mail: [a combinar].
        </p>
        <p>
          <strong>Responsável legal</strong> (quando o contratante for criança, adolescente ou
          estiver sob curatela): Nome completo: [a combinar] · CPF: [a combinar] · Vínculo: [a
          combinar].
        </p>
      </DocSection>

      <DocSection titulo="Cláusula 1 — Objeto">
        <p>
          O presente contrato tem por objeto a prestação de serviços de psicoterapia, com base em
          abordagens de evidência científica — Terapia Cognitivo-Comportamental (TCC), Terapia do
          Esquema e Terapia Comportamental Dialética (DBT). O atendimento constitui obrigação de
          meio, e não de resultado, não havendo garantia de "cura" ou de resultado específico.
        </p>
      </DocSection>

      <DocSection titulo="Cláusula 2 — Sessões">
        <p>
          As sessões têm duração de 50 minutos, com frequência sugerida semanal, em dia e horário
          fixos combinados entre as partes. A modalidade de atendimento poderá ser presencial,
          on-line ou mista, conforme acordado. É concedida tolerância de atraso de até 15 minutos
          por parte do paciente. Eventuais atrasos por parte do psicólogo serão repostos.
        </p>
      </DocSection>

      <DocSection titulo="Cláusula 3 — Honorários e política de valor social">
        <p>
          O valor da sessão é definido em conjunto entre as partes na entrevista inicial, conforme
          a realidade socioeconômica do paciente, em observância ao art. 4º do Código de Ética
          Profissional do Psicólogo. A qualidade do atendimento é a mesma, independentemente do
          valor acordado. O valor é reavaliado a cada 6 (seis) meses, e eventual reajuste será
          avisado com 30 (trinta) dias de antecedência. Os valores praticados são confidenciais.
          Formas de pagamento aceitas: Pix, cartão, dinheiro ou transferência bancária.
        </p>
      </DocSection>

      <DocSection titulo="Cláusula 4 — Faltas e cancelamentos">
        <p>
          Cancelamentos devem ser avisados com, no mínimo, 24 horas de antecedência. Faltas sem
          aviso prévio serão cobradas normalmente, salvo em situações de urgência devidamente
          justificadas. A remarcação da sessão poderá ocorrer dentro da mesma semana, conforme
          disponibilidade de agenda. Após 2 (duas) faltas consecutivas sem contato, o psicólogo
          buscará ativamente contato com o paciente.
        </p>
      </DocSection>

      <DocSection titulo="Cláusula 5 — Atendimento on-line">
        <p>
          Quando realizado na modalidade on-line, o atendimento observará as resoluções do
          Conselho Federal de Psicologia (CFP), incluindo o cadastro e-Psi, e será realizado por
          meio de plataforma segura. Eventuais falhas técnicas que comprometam a sessão serão
          repostas sem custo adicional.
        </p>
      </DocSection>

      <DocSection titulo="Cláusula 6 — Sigilo profissional">
        <p>
          Todas as informações compartilhadas no processo terapêutico são protegidas por sigilo
          profissional, conforme o Código de Ética Profissional do Psicólogo, ressalvadas as
          exceções previstas em lei. No caso de atendimento a crianças e adolescentes, os
          responsáveis legais recebem apenas as informações estritamente necessárias, de forma a
          preservar o vínculo terapêutico e o espaço de confiança do paciente.
        </p>
      </DocSection>

      <DocSection titulo="Cláusula 7 — Proteção de dados (LGPD)">
        <p>
          As informações do atendimento são registradas em prontuário psicológico, com guarda
          mínima de 5 (cinco) anos, conforme normativa do CFP. Os dados sensíveis relacionados à
          saúde são protegidos e tratados exclusivamente para fins de cuidado clínico, em
          conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018).
        </p>
      </DocSection>

      <SignatureBlock
        lines={[
          "Bruno Souza — Psicólogo, CRP 07/44472 (contratado)",
          "Assinatura do paciente (contratante)",
          "Assinatura do responsável legal (quando aplicável)",
        ]}
      />
    </DocumentLayout>
  );
}
