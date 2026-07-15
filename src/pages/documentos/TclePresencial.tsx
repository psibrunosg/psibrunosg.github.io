import { DocumentLayout, DocSection, SignatureBlock } from "@/components/shared/DocumentLayout";

export default function TclePresencial() {
  return (
    <DocumentLayout
      eyebrow="Documento clínico"
      titulo="Termo de Consentimento Livre e Esclarecido"
      subtitulo="Atendimento psicológico presencial · Bruno Souza, Psicólogo, CRP 07/44472"
    >
      <DocSection titulo="Identificação">
        <p>
          <strong>Paciente:</strong> Nome completo: [a combinar] · CPF: [a combinar] · Data de
          nascimento: [a combinar].
        </p>
        <p>
          <strong>Responsável legal</strong> (quando o paciente for menor de idade ou estiver sob
          curatela): Nome completo: [a combinar] · CPF: [a combinar].
        </p>
      </DocSection>

      <DocSection titulo="1. Natureza do atendimento">
        <p>
          O presente termo tem por finalidade esclarecer sobre o processo psicoterapêutico a ser
          realizado, fundamentado em abordagens com base em evidências científicas — Terapia
          Cognitivo-Comportamental (TCC), Terapia do Esquema e Terapia Comportamental Dialética
          (DBT) — conduzido na modalidade presencial. O atendimento constitui uma obrigação de
          meio, e não de resultado, ou seja, o profissional se compromete a empregar seus
          conhecimentos técnicos e éticos da melhor forma possível, sem garantir resultados
          específicos.
        </p>
      </DocSection>

      <DocSection titulo="2. Participação voluntária">
        <p>
          A participação no processo terapêutico é voluntária. O paciente pode interromper o
          acompanhamento a qualquer momento, sem necessidade de justificativa. Recomenda-se, no
          entanto, a realização de uma sessão de encerramento, para que o processo seja concluído
          de forma cuidadosa e para o bem-estar de ambas as partes.
        </p>
      </DocSection>

      <DocSection titulo="3. Riscos e benefícios">
        <p>
          O processo terapêutico pode, em alguns momentos, mobilizar emoções desconfortáveis, à
          medida que assuntos sensíveis são abordados. Esse é um aspecto esperado do trabalho
          terapêutico. Entre os benefícios esperados estão o autoconhecimento, o desenvolvimento de
          estratégias mais saudáveis de enfrentamento e a promoção do bem-estar geral.
        </p>
      </DocSection>

      <DocSection titulo="4. Especificidades do atendimento presencial">
        <p>
          As sessões serão realizadas no endereço da clínica, em horário previamente combinado. Em
          caso de sintomas gripais, febre ou outros sinais de doença transmissível, solicita-se que
          o paciente comunique previamente o profissional, para que a sessão seja reagendada, como
          forma de cuidado com a saúde de todos.
        </p>
      </DocSection>

      <DocSection titulo="5. Sigilo profissional">
        <p>
          Todas as informações compartilhadas durante o processo terapêutico são protegidas por
          sigilo profissional, conforme o Código de Ética Profissional do Psicólogo (CFP). Esse
          sigilo é flexibilizado apenas nas hipóteses previstas em lei — como risco iminente à vida
          ou determinação judicial — e, mesmo nesses casos, a quebra de sigilo é restrita ao
          mínimo necessário.
        </p>
      </DocSection>

      <DocSection titulo="6. Registros e proteção de dados (LGPD)">
        <p>
          As informações do atendimento são registradas em prontuário psicológico, com guarda
          mínima de 5 (cinco) anos, conforme normativa do CFP. Os dados sensíveis relacionados à
          saúde são tratados exclusivamente para fins de cuidado clínico, em conformidade com a
          Lei Geral de Proteção de Dados (Lei 13.709/2018), com acesso restrito ao profissional
          responsável.
        </p>
      </DocSection>

      <DocSection titulo="7. Honorários">
        <p>
          As condições referentes a valores, forma de pagamento e política de cancelamento estão
          descritas no Contrato Terapêutico, documento complementar a este termo.
        </p>
      </DocSection>

      <DocSection titulo="8. Consentimento">
        <p>
          Declaro que li e compreendi as informações apresentadas neste Termo de Consentimento
          Livre e Esclarecido, e que concordo livremente em participar do processo psicoterapêutico
          nas condições aqui descritas, podendo revogar este consentimento a qualquer momento.
        </p>
      </DocSection>

      <SignatureBlock
        lines={[
          "Bruno Souza — Psicólogo, CRP 07/44472 (profissional)",
          "Assinatura do paciente",
          "Assinatura do responsável legal (quando aplicável)",
        ]}
      />
    </DocumentLayout>
  );
}
