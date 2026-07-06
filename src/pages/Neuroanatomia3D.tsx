import { useState, useEffect, Suspense, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, AlertCircle, Loader2, Activity } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { CameraControls, Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { BrainModel } from "@/components/3d/BrainModel";
import { brainPartsData, type BrainPartId } from "@/content/neuroanatomia";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

function CameraManager({ selectedPartId }: { selectedPartId: BrainPartId | null }) {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (controlsRef.current) {
      if (selectedPartId && brainPartsData[selectedPartId]) {
        const data = brainPartsData[selectedPartId];
        if (data.cameraPosition && data.cameraTarget) {
          controlsRef.current.setLookAt(
            data.cameraPosition[0], data.cameraPosition[1], data.cameraPosition[2],
            data.cameraTarget[0], data.cameraTarget[1], data.cameraTarget[2],
            true
          );
        }
      } else {
        // Volta para a posição inicial
        controlsRef.current.setLookAt(0, 0, 5, 0, 0, 0, true);
      }
    }
  }, [selectedPartId]);

  return <CameraControls ref={controlsRef} minDistance={2} maxDistance={10} />;
}

export default function Neuroanatomia3D() {
  const [selectedPartId, setSelectedPartId] = useState<BrainPartId | null>(null);
  const [isAnxietyAttack, setIsAnxietyAttack] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Neuroanatomia 3D | Psicoeducação | Bruno SG";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  const selectedInfo = selectedPartId ? brainPartsData[selectedPartId] : null;

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
              <BrainModel 
                onSelectPart={setSelectedPartId} 
                selectedPartId={selectedPartId} 
                isAnxietyAttack={isAnxietyAttack} 
              />
              <CameraManager selectedPartId={selectedPartId} />
            </Suspense>
          </Canvas>

          {/* Overlay de Crise (Borda vermelha pulsante) */}
          <AnimatePresence>
            {isAnxietyAttack && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(239,68,68,0.2)]"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Painel Direito: Informações Psicoeducativas */}
        <div className="w-full md:w-[400px] lg:w-[480px] bg-[var(--c-surface)] overflow-y-auto h-[50vh] md:h-[calc(100vh-80px)] p-6 md:p-8 flex flex-col">
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

          {/* Botão de Simulação */}
          <div className="mb-6">
            <button
              onClick={() => {
                setIsAnxietyAttack(!isAnxietyAttack);
                if (!isAnxietyAttack) setSelectedPartId(null);
              }}
              className={`w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 ${
                isAnxietyAttack 
                ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]" 
                : "bg-[var(--c-bg)] border-2 border-[var(--c-border)] text-[var(--c-text)] hover:border-red-500/50 hover:text-red-500"
              }`}
            >
              <Activity className={isAnxietyAttack ? "animate-pulse" : ""} />
              {isAnxietyAttack ? "Parar Simulação de Crise" : "Simular Crise de Ansiedade"}
            </button>
          </div>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              {isAnxietyAttack ? (
                <motion.div
                  key="attack"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl space-y-4"
                >
                  <h2 className="text-xl font-bold text-red-600 dark:text-red-400" style={{ fontFamily: "var(--font-heading)" }}>
                    O Sequestro da Amígdala
                  </h2>
                  <p className="text-sm text-[var(--c-text)] leading-relaxed">
                    Durante uma crise de ansiedade ou pânico, a <strong>Amígdala</strong> (o centro de alarme) fica hiperativa. Ela assume o controle do cérebro para preparar você para uma ameaça imediata.
                  </p>
                  <p className="text-sm text-[var(--c-text)] leading-relaxed">
                    Neste processo, o <strong>Córtex Pré-Frontal</strong> (a parte racional) perde energia e fica "desligado". É por isso que é tão difícil pensar logicamente ou se acalmar apenas com a razão durante o pico de pânico.
                  </p>
                </motion.div>
              ) : selectedInfo ? (
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
        </div>
      </main>

      {/* Footer só aparece no final se a pessoa rolar em mobile */}
      <div className="hidden md:block border-t border-[var(--c-border)]">
        <EthicalFooter />
      </div>
    </div>
  );
}
