// Página "A Turma do Mundo Torajo" — hub de personagens fora do mapa de
// territórios: escolhe um personagem, vê quais crenças/distorções/esquemas/
// modos ele representa nos 4 territórios Torajo, e uma seção de prática
// (quiz + flashcards + simulador) que reaproveita o conteúdo clínico genérico
// que ficaria órfão com o revamp de Distorções/Modos.
// Ver docs/mundo-torajo-playbook.md seção 11.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";
import { personagens, type PersonagemId } from "@/content/psicoed/personagens";
import { crencas } from "@/content/psicoed/crencas";
import { distorcoesTorajo } from "@/content/psicoed/distorcoes-torajo";
import { esquemas } from "@/content/psicoed/esquemas";
import { modosTorajo } from "@/content/psicoed/modos-torajo";
import { distorcoesQuiz, distorcoesFlashcards } from "@/content/psicoed";
import { modosQuiz, modosFlashcards, cenariosModo } from "@/content/psicoed/modos";
import QuizEngine from "@/components/psicoed/QuizEngine";
import Flashcards from "@/components/psicoed/Flashcards";
import Badge from "@/components/psicoed/Badge";
import MiniSimuladorModos from "@/components/psicoed/MiniSimuladorModos";
import { useProgresso } from "@/components/psicoed/useProgresso";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

const perfis: Record<PersonagemId, string> = {
  torajo: "O líder criativo e impulsivo do canal — vive pela aprovação e pela emoção do momento.",
  morajo: "O lado lógico e metódico da dupla — exige perfeição e vê o mundo em regras rígidas.",
  zulmi: "A harmonizadora do grupo — evita conflito a qualquer custo e sente demais o clima ao redor.",
  linn: "O quieto e observador — se isola quando o caos aumenta e guarda o que sente pra si.",
  pessy: "A detetive conspiracionista — vive em alerta, sempre esperando o próximo desastre.",
  azedo: "O debochado da turma — ataca e provoca antes que possam magoá-lo primeiro.",
  margo: "A alienada digital — trata as pessoas como código e mantém distância emocional de tudo.",
  jay: "O observador atento — percebe os detalhes que os outros ignoram e age com cautela.",
  abel: "O sonhador reservado — vive em seu próprio ritmo e encontra beleza no que passa despercebido.",
};

const listas = [
  { titulo: "Crenças centrais", rota: "/psicoeducacao/crencas", dados: crencas },
  { titulo: "Distorções cognitivas", rota: "/psicoeducacao/distorcoes", dados: distorcoesTorajo },
  { titulo: "Esquemas iniciais", rota: "/psicoeducacao/esquemas", dados: esquemas },
  { titulo: "Modos do esquema", rota: "/psicoeducacao/modos-do-esquema", dados: modosTorajo },
];

type EtapaDistorcoes = "intro" | "quiz" | "flashcards" | "concluido";

function PraticaDistorcoes() {
  const [etapa, setEtapa] = useState<EtapaDistorcoes>("intro");
  const { hasCode, save, complete } = useProgresso("distorcoes-cognitivas");

  return (
    <div>
      {etapa === "intro" && (
        <div>
          <p className="text-sm text-[var(--c-muted)] leading-relaxed mb-4">
            8 situações do dia a dia pra identificar a distorção, seguidas de um baralho de revisão com as 6 mais
            comuns.
          </p>
          {!hasCode && (
            <p className="text-xs text-[var(--c-muted)]/80 italic mb-4">
              Você não está com um código de paciente ativo — seu progresso não será salvo, mas o exercício funciona normalmente.
            </p>
          )}
          <button
            onClick={() => setEtapa("quiz")}
            className="px-6 py-3 rounded-full bg-[var(--c-accent)] text-[var(--c-on-accent)] font-semibold text-sm"
          >
            Começar
          </button>
        </div>
      )}
      {etapa === "quiz" && (
        <QuizEngine
          config={distorcoesQuiz}
          onComplete={(acertos, total) => {
            save({ quiz: { acertos, total } }, { partial: true });
            setEtapa("flashcards");
          }}
        />
      )}
      {etapa === "flashcards" && (
        <Flashcards
          cartas={distorcoesFlashcards}
          onFinalizar={(acertosTotais, totalCartas) => {
            complete(acertosTotais);
            save({ flashcards: { acertosTotais, totalCartas } }, { partial: false });
            setEtapa("concluido");
          }}
        />
      )}
      {etapa === "concluido" && (
        <div className="space-y-4">
          <Badge titulo="Distorções Cognitivas" />
          <button
            onClick={() => setEtapa("flashcards")}
            className="px-5 py-2.5 rounded-full border border-[var(--c-border)] text-[var(--c-text)] font-semibold text-sm hover:border-[var(--c-accent)]/60 transition-colors"
          >
            Revisar cartas de novo
          </button>
        </div>
      )}
    </div>
  );
}

type EtapaModos = "intro" | "quiz" | "flashcards" | "simulador" | "concluido";

function PraticaModos() {
  const [etapa, setEtapa] = useState<EtapaModos>("intro");
  const { hasCode, save, complete } = useProgresso("modos-do-esquema");

  return (
    <div>
      {etapa === "intro" && (
        <div>
          <p className="text-sm text-[var(--c-muted)] leading-relaxed mb-4">
            Treino em 3 partes: reconhecer qual modo está falando, revisar os 4 modos num baralho, e escolher a
            resposta do Adulto Saudável em cenários do dia a dia.
          </p>
          {!hasCode && (
            <p className="text-xs text-[var(--c-muted)]/80 italic mb-4">
              Você não está com um código de paciente ativo — seu progresso não será salvo, mas o exercício funciona normalmente.
            </p>
          )}
          <button
            onClick={() => setEtapa("quiz")}
            className="px-6 py-3 rounded-full bg-[var(--c-accent)] text-[var(--c-on-accent)] font-semibold text-sm"
          >
            Começar
          </button>
        </div>
      )}
      {etapa === "quiz" && (
        <QuizEngine
          config={modosQuiz}
          onComplete={(acertos, total) => {
            save({ quiz: { acertos, total } }, { partial: true });
            setEtapa("flashcards");
          }}
        />
      )}
      {etapa === "flashcards" && (
        <Flashcards
          cartas={modosFlashcards}
          onFinalizar={(acertosTotais, totalCartas) => {
            save({ flashcards: { acertosTotais, totalCartas } }, { partial: true });
            setEtapa("simulador");
          }}
        />
      )}
      {etapa === "simulador" && (
        <MiniSimuladorModos
          cenarios={cenariosModo}
          onFinalizar={(acertos, total) => {
            complete(acertos);
            save({ simulador: { acertos, total } }, { partial: false });
            setEtapa("concluido");
          }}
        />
      )}
      {etapa === "concluido" && (
        <div className="space-y-4">
          <Badge titulo="Modos do Esquema" />
          <button
            onClick={() => setEtapa("simulador")}
            className="px-5 py-2.5 rounded-full border border-[var(--c-border)] text-[var(--c-text)] font-semibold text-sm hover:border-[var(--c-accent)]/60 transition-colors"
          >
            Praticar de novo
          </button>
        </div>
      )}
    </div>
  );
}

export default function PersonagensTorajo() {
  const [selecionado, setSelecionado] = useState<PersonagemId>("torajo");
  const [praticaTab, setPraticaTab] = useState<"distorcoes" | "modos">("distorcoes");
  const personagem = personagens[selecionado];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.documentElement.setAttribute("data-mode", "noturno");
    document.title = "A Turma do Mundo Torajo | Psicoeducação | Bruno de Souza Gonçalves";
    return () => {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.removeAttribute("data-mode");
    };
  }, []);

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <main id="main" className="relative min-h-screen bg-[var(--c-bg-dark)] pt-28 pb-24 px-6 overflow-hidden">
        {/* Background glow sutil baseado no personagem selecionado */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] -z-10 pointer-events-none transition-colors duration-1000 opacity-20"
          style={{ backgroundColor: personagem.cor }} 
        />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <Link
            to="/psicoeducacao/mundos/torajo"
            className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Voltar ao mapa
          </Link>

          <motion.div variants={stagger.container} initial="hidden" animate="visible" className="mb-8">
            <motion.p variants={fadeUp} className="text-xs tracking-[0.2em] uppercase text-[var(--c-accent)] font-semibold mb-2">
              Mundo Torajo
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-3xl md:text-4xl font-semibold text-[var(--c-text)] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              A Turma do Mundo Torajo
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[var(--c-muted)] leading-relaxed">
              Cada personagem carrega, de um jeito exagerado e cartunesco, padrões de pensamento e comportamento
              reais. Escolha um pra ver quais crenças, distorções, esquemas e modos ele representa nos territórios
              já explorados.
            </motion.p>
          </motion.div>

          {/* Seletor de personagem */}
          <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-4 mb-12 justify-center overflow-x-auto pb-2">
            {Object.values(personagens).map((p) => {
              const isSelected = selecionado === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelecionado(p.id as PersonagemId)}
                  className="group relative flex flex-col items-center gap-2 focus:outline-none transition-all duration-300"
                  style={{
                    transform: isSelected ? "scale(1.15) translateY(-4px)" : "scale(1)",
                    opacity: isSelected ? 1 : 0.5,
                  }}
                >
                  {/* Glow effect for selected */}
                  {isSelected && (
                    <div 
                      className="absolute inset-0 rounded-full blur-md opacity-40 -z-10" 
                      style={{ backgroundColor: p.cor }}
                    />
                  )}
                  <img
                    src={p.imagem}
                    alt={p.nome}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover object-top border-2 transition-all duration-300 group-hover:opacity-100 shadow-xl"
                    style={{
                      borderColor: isSelected ? p.cor : "var(--c-border)",
                      boxShadow: isSelected ? `0 0 20px -2px ${p.cor}88, inset 0 0 10px ${p.cor}44` : "none",
                    }}
                  />
                  <span
                    className="text-[10px] uppercase tracking-widest font-bold transition-colors"
                    style={{ color: isSelected ? p.cor : "var(--c-muted)" }}
                  >
                    {p.nome}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Perfil do personagem selecionado */}
          <motion.div
            key={selecionado}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative rounded-3xl overflow-hidden p-6 md:p-8 mb-16 backdrop-blur-2xl border"
            style={{ 
              borderColor: `${personagem.cor}33`, 
              background: `linear-gradient(135deg, ${personagem.cor}15 0%, rgba(10,10,15,0.7) 100%)`,
              boxShadow: `0 8px 32px -8px ${personagem.cor}22, inset 0 0 0 1px ${personagem.cor}11`
            }}
          >
            {/* Subtle glow highlight on top left */}
            <div className="absolute -top-16 -left-16 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: personagem.cor }} />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-3">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: personagem.cor, fontFamily: "var(--font-heading)" }}>
                  {personagem.nome}
                </h2>
                <div className="h-[1px] flex-1 opacity-20" style={{ background: `linear-gradient(to right, ${personagem.cor}, transparent)` }} />
              </div>
              
              <p className="text-base text-[var(--c-text)]/90 mb-8 font-medium leading-relaxed max-w-2xl">
                {perfis[selecionado]}
              </p>

              <div className="grid sm:grid-cols-2 gap-8">
                {listas.map((lista) => {
                  const itens = lista.dados.filter((d) => d.personagem === selecionado);
                  if (itens.length === 0) return null;
                  return (
                    <div key={lista.titulo} className="space-y-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "var(--c-muted)" }}>
                        {lista.titulo}
                      </p>
                      <ul className="space-y-2">
                        {itens.map((item) => (
                          <li key={item.id}>
                            <Link 
                              to={lista.rota} 
                              className="group flex items-start gap-2 text-sm text-[var(--c-text)] hover:text-white transition-colors"
                            >
                              <span className="opacity-0 -ml-3 transition-all duration-300 group-hover:opacity-100 group-hover:ml-0 mt-0.5" style={{ color: personagem.cor }}>
                                ✦
                              </span>
                              <span>{item.titulo}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Pratique */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[var(--c-accent)] font-semibold mb-2">Pratique</p>
            <p className="text-sm text-[var(--c-muted)] leading-relaxed mb-4">
              Dois exercícios de reconhecimento com quiz, baralho de revisão e simulador — não amarrados a um
              personagem específico.
            </p>
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setPraticaTab("distorcoes")}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  praticaTab === "distorcoes"
                    ? "bg-[var(--c-accent)] text-[var(--c-on-accent)] border-[var(--c-accent)]"
                    : "border-[var(--c-border)] text-[var(--c-muted)]"
                }`}
              >
                Distorções Cognitivas
              </button>
              <button
                onClick={() => setPraticaTab("modos")}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  praticaTab === "modos"
                    ? "bg-[var(--c-accent)] text-[var(--c-on-accent)] border-[var(--c-accent)]"
                    : "border-[var(--c-border)] text-[var(--c-muted)]"
                }`}
              >
                Modos do Esquema
              </button>
            </div>
            {praticaTab === "distorcoes" ? <PraticaDistorcoes /> : <PraticaModos />}
          </div>
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}
