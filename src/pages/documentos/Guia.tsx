import { DocumentLayout, DocSection } from "@/components/shared/DocumentLayout";

const linhas = [
  {
    nome: "Infantil",
    cor: "var(--c-warm)",
    texto: "Atendimento lúdico, com orientação aos pais para apoiar o desenvolvimento da criança.",
  },
  {
    nome: "Adolescente",
    cor: "var(--c-accent)",
    texto: "Um espaço de escuta sem julgamento, respeitando o ritmo e as descobertas dessa fase.",
  },
  {
    nome: "Adulto",
    cor: "var(--c-moss-dk)",
    texto: "Psicoterapia individual, voltada para as demandas e desafios da vida adulta.",
  },
  {
    nome: "Empresas",
    cor: "var(--c-deep)",
    texto: "Palestras, treinamentos e psicologia organizacional para times e lideranças.",
  },
];

export default function Guia() {
  return (
    <DocumentLayout
      eyebrow="Boas-vindas"
      titulo="Guia de Boas-Vindas"
      subtitulo="Clínica Bruno Souza · Psicólogo, CRP 07/44472"
    >
      <DocSection titulo="Uma clínica que enxerga você por inteiro">
        <p>
          A saúde mental não existe separada do corpo, nem da vida. Por isso, o cuidado aqui é
          integral — mente, corpo e contexto caminham juntos. Trabalhamos com ciência, mas em
          linguagem simples, para que você entenda de verdade o que está acontecendo e o que pode
          ajudar.
        </p>
      </DocSection>

      <DocSection titulo="Por que um lobo?">
        <p>
          O lobo solitário é um mito. Na natureza, os lobos vivem em matilha — pertencer é uma
          necessidade básica, tanto para eles quanto para nós. É por isso que escolhemos o lobo
          como símbolo: ninguém precisa atravessar tudo sozinho.
        </p>
        <p>
          As cores da nossa identidade também contam essa história: o verde representa a mente, o
          terracota representa o corpo, e a sálvia representa o contexto — tudo o que está ao seu
          redor e também importa.
        </p>
      </DocSection>

      <DocSection titulo="Como cuidamos">
        <p>
          O trabalho é conduzido a partir de abordagens com base em evidências científicas,
          explicadas sem jargão técnico:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>TCC (Terapia Cognitivo-Comportamental):</strong> ajuda a identificar padrões de
            pensamento e comportamento que mantêm o sofrimento, buscando alternativas mais
            funcionais.
          </li>
          <li>
            <strong>Terapia do Esquema:</strong> olha para padrões mais antigos, formados ao longo
            da vida, que continuam influenciando como você se sente e se relaciona hoje.
          </li>
          <li>
            <strong>DBT (Terapia Comportamental Dialética):</strong> trabalha habilidades para lidar
            com emoções intensas e melhorar relações, com equilíbrio entre aceitação e mudança.
          </li>
        </ul>
        <p>
          Além disso, consideramos aspectos como sono, alimentação, movimento e rotina — porque
          tudo isso também influencia o seu bem-estar.
        </p>
      </DocSection>

      <DocSection titulo="Linhas de atendimento">
        <div className="grid gap-3 sm:grid-cols-2">
          {linhas.map((l) => (
            <div
              key={l.nome}
              className="rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)] p-4"
              style={{ borderLeftWidth: 4, borderLeftColor: l.cor }}
            >
              <p className="mb-1 text-sm font-semibold text-[var(--c-text)]">{l.nome}</p>
              <p className="text-xs leading-relaxed text-[var(--c-muted)]">{l.texto}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection titulo="Sua primeira sessão">
        <p>
          A primeira sessão é uma conversa no seu ritmo. Não há certo ou errado no que trazer.
          Tudo o que é compartilhado é protegido por sigilo profissional, um compromisso ético e
          legal que garante a você um espaço seguro para falar.
        </p>
      </DocSection>

      <DocSection titulo="Contato">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>WhatsApp: (53) 99189-8309</li>
          <li>Instagram: @psibruno.sg</li>
          <li>Responsável técnico: Psicólogo Bruno Souza, CRP 07/44472</li>
        </ul>
      </DocSection>

      <p
        className="pt-2 text-center text-lg font-semibold text-[var(--c-accent)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Vem fazer parte da matilha.
      </p>
    </DocumentLayout>
  );
}
