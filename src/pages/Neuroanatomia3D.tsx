import { useState, useEffect, Suspense } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, AlertCircle, Loader2 } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { BrainModel } from "@/components/3d/BrainModel";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

const brainPartsInfo: Record<string, { title: string; description: string; role: string }> = {
  prefrontal: {
    title: "Córtex Pré-Frontal",
    description: "A parte da frente do cérebro, responsável pelo pensamento lógico, planejamento, tomada de decisões e controle dos impulsos.",
    role: "Na ansiedade, o córtex pré-frontal tenta 'frear' o sistema de alarme (amígdala). Quando o estresse é muito alto, ele pode perder a força e você passa a agir mais por emoção do que por razão.",
  },
  amygdala: {
    title: "Amígdala",
    description: "Uma pequena estrutura em forma de amêndoa. É o centro emocional e o 'sistema de alarme' do cérebro.",
    role: "Quando percebe uma ameaça (real ou imaginária), ela dispara a resposta de 'lutar, fugir ou congelar', liberando adrenalina e causando os sintomas físicos da ansiedade.",
  },
  hippocampus: {
    title: "Hipocampo",
    description: "A estrutura responsável pela formação e armazenamento de novas memórias e pelo aprendizado.",
    role: "Trabalha junto com a amígdala para lembrar de situações perigosas. No estresse crônico ou trauma, o hipocampo pode encolher, dificultando a diferenciação entre uma lembrança antiga e um perigo atual.",
  }
};

export default function Neuroanatomia3D() {
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Neuroanatomia 3D | Psicoeducação | Bruno SG";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  const selectedInfo = selectedPartId ? brainPartsInfo[selectedPartId] : null;

  return (
    <div className="flex flex-col min-h-screen bg-[var(--c-bg)]">
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <main id="main" className="flex-1 flex flex-col md:flex-row pt-20">
        {/* Painel Esquerdo: Canvas 3D */}
        <div className="flex-1 relative h-[50vh] md:h-auto border-b md:border-b-0 md:border-r border-[var(--c-border)] bg-black/5">
          <Link
            to="/psicoeducacao"
            className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 text-sm text-[var(--c-text)] hover:text-[var(--c-accent)] transition-colors bg-[var(--c-surface)]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--c-border)] shadow-sm"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>
          
          <div className="absolute top-4 right-4 z-10 bg-[var(--c-surface)]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--c-border)] shadow-sm text-xs text-[var(--c-muted)]">
            Use o mouse/dedo para girar e dar zoom
          </div>

          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <Suspense fallback={
              <Html center>
                <div className="flex flex-col items-center text-[var(--c-text)]">
                  <Loader2 className="w-8 h-8 animate-spin mb-2 text-[var(--c-accent)]" />
                  <span className="text-sm font-semibold">Carregando Modelo...</span>
                </div>
              </Html>
            }>
              <BrainModel onSelectPart={setSelectedPartId} selectedPartId={selectedPartId} />
              <OrbitControls 
                enablePan={false}
                minDistance={2}
                maxDistance={10}
                autoRotate={!selectedPartId}
                autoRotateSpeed={0.5}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Painel Direito: Informações Psicoeducativas */}
        <div className="w-full md:w-[400px] lg:w-[480px] bg-[var(--c-surface)] overflow-y-auto h-[50vh] md:h-[calc(100vh-80px)] p-6 md:p-8">
          <div className="mb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--c-accent)] font-semibold mb-2">
              Laboratório 3D
            </p>
            <h1 className="text-3xl font-semibold text-[var(--c-text)] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Neuroanatomia da Ansiedade
            </h1>
            <p className="text-sm text-[var(--c-muted)]">
              Entenda como diferentes partes do seu cérebro interagem para gerar e controlar as emoções. Clique em uma parte do modelo 3D para saber mais.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {selectedInfo ? (
              <motion.div
                key={selectedPartId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-[var(--c-text)] mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                    {selectedInfo.title}
                  </h2>
                  <div className="bg-[var(--c-bg)] p-4 rounded-xl border border-[var(--c-border)]">
                    <div className="flex items-start gap-3 mb-2">
                      <BookOpen className="w-5 h-5 text-[var(--c-accent)] shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-[var(--c-text)] text-sm mb-1">O que é?</h3>
                        <p className="text-sm text-[var(--c-muted)] leading-relaxed">
                          {selectedInfo.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-orange-600 dark:text-orange-400 text-sm mb-1">
                        O Papel na Ansiedade
                      </h3>
                      <p className="text-sm text-[var(--c-muted)] leading-relaxed">
                        {selectedInfo.role}
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedPartId(null)}
                  className="w-full py-3 rounded-xl border border-[var(--c-border)] text-sm font-medium hover:bg-[var(--c-bg)] transition-colors"
                >
                  Limpar Seleção
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-48 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[var(--c-border)] rounded-2xl bg-[var(--c-bg)]/50"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--c-accent)]/10 flex items-center justify-center mb-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--c-accent)]/20 animate-ping" />
                </div>
                <p className="text-[var(--c-muted)] text-sm font-medium">
                  Selecione uma área no modelo 3D para ver como ela afeta suas emoções.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer só aparece no final se a pessoa rolar em mobile */}
      <div className="hidden md:block border-t border-[var(--c-border)]">
        <EthicalFooter />
      </div>
    </div>
  );
}
