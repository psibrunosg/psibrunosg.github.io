import React, { useState, useEffect, Suspense, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, AlertCircle, Loader2, Activity, Maximize2, Minimize2, Flower2, Link as LinkIcon, Wind, Stethoscope, Pill, Target, CheckCircle2, XCircle, Brain, Map, ChevronLeft, ChevronRight } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { CameraControls, Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { contato } from "@/content/copy";
import { BrainModel } from "@/components/3d/BrainModel";
import { brainPartsData, disordersData, guidedToursData, type BrainPartId, type DisorderId, type GuidedTourId } from "@/content/neuroanatomia";

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-4 bg-red-500 text-white"><h1 className="font-bold">Algo quebrou no 3D:</h1><pre>{this.state.error?.toString()}</pre></div>;
    }
    return this.props.children;
  }
}


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
        // Quando volta pro estado default, usamos a posição inicial sem animar drasticamente se for a primeira vez
        controlsRef.current.setLookAt(0, 0, 6, 0, 0, 0, true);
      }
    }
  }, [selectedPartId]);

  return <CameraControls ref={controlsRef} makeDefault minDistance={1} maxDistance={30} />;
}

// Perguntas do Quiz
const quizQuestions: { target: BrainPartId, question: string }[] = [
  { target: 'amygdala', question: 'Qual destas estruturas atua como o "sistema de alarme" ou detector de ameaças do nosso cérebro?' },
  { target: 'prefrontal', question: 'Qual parte é responsável por frear os impulsos emocionais, raciocinar e planejar?' },
  { target: 'hippocampus', question: 'Onde ficam armazenadas as nossas memórias e o contexto das situações?' },
  { target: 'hypothalamus', question: 'Qual estrutura recebe o alarme e aciona a liberação de hormônios do estresse, como o cortisol (Eixo HPA)?' },
  { target: 'insula', question: 'Qual área do córtex está envolvida na interocepção, monitorando as sensações viscerais do corpo?' },
  { target: 'cingulate', question: 'Qual região processa a dor emocional e funciona como um detector de conflitos ("algo está errado")?' },
  { target: 'caudate', question: 'Qual núcleo faz parte dos gânglios da base e atua na formação de hábitos e recompensas?' },
  { target: 'cerebellum', question: 'Qual estrutura é a grande coordenadora motora, responsável pelo equilíbrio e pela consolidação da "memória muscular" no esporte?' },
  { target: 'motor_cortex', question: 'Qual área cortical origina os comandos elétricos voluntários para a contração dos músculos?' },
  { target: 'somatosensory', question: 'Onde o cérebro recebe e processa o feedback tátil e proprioceptivo do corpo durante o movimento?' },
  { target: 'putamen', question: 'Qual região do estriado libera picos de dopamina com alimentos hiperpalatáveis e ajuda a automatizar rotinas motoras?' }
];

export default function Neuroanatomia3D() {
  const [selectedPartId, setSelectedPartId] = useState<BrainPartId | null>(null);
  const [activeDisorder, setActiveDisorder] = useState<DisorderId | null>(null);
  
  // Estados do Modelo Manual
  const [stressLevel, setStressLevel] = useState<number>(0);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [isMindfulness, setIsMindfulness] = useState<boolean>(false);
  const [isTherapyActive, setIsTherapyActive] = useState<boolean>(false);
  const [isBreathing, setIsBreathing] = useState<boolean>(false);
  
  // Novos Estados da Fase 5
  const [isMedicated, setIsMedicated] = useState<boolean>(false);
  
  // Estados do Quiz
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [quizStatus, setQuizStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [quizWrongAttempts, setQuizWrongAttempts] = useState<number>(0);
  const [quizFirstTryCorrect, setQuizFirstTryCorrect] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  // Default false: o Córtex Completo carrega ~200 malhas anatômicas pesadas — só sob demanda.
  const [showContext, setShowContext] = useState<boolean>(false);
  const [activeTour, setActiveTour] = useState<GuidedTourId | null>(null);
  const [tourStep, setTourStep] = useState<number>(0);

  const currentSelectedPartId = activeTour ? guidedToursData[activeTour].steps[tourStep].partId : selectedPartId;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Neuroanatomia 3D | Psicoeducação | Bruno Souza";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathing) {
      interval = setInterval(() => {
        setStressLevel((prev) => {
          if (prev <= 0) {
            setIsBreathing(false);
            return 0;
          }
          return Math.max(0, prev - 5);
        });
      }, 1000); 
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  const selectedInfo = currentSelectedPartId ? brainPartsData[currentSelectedPartId] : null;
  const disorderInfo = activeDisorder ? disordersData[activeDisorder] : null;

  const handleDisorderSelect = (disorderId: string) => {
    if (disorderId === "") {
      setActiveDisorder(null);
      setIsMedicated(false);
    } else {
      setActiveDisorder(disorderId as DisorderId);
      setStressLevel(0);
      setIsMindfulness(false);
      setIsTherapyActive(false);
      setIsBreathing(false);
      setIsMedicated(false);
      setIsQuizMode(false);
      setActiveTour(null);
      setTourStep(0);
      setSelectedPartId(null);
    }
  };

  const handlePartClick = (partId: BrainPartId) => {
    if (isQuizMode) {
      if (partId === quizQuestions[currentQuizIndex].target) {
        setQuizStatus('correct');
        if (quizWrongAttempts === 0) setQuizFirstTryCorrect((n) => n + 1);
        setTimeout(() => {
          setQuizStatus('idle');
          setQuizWrongAttempts(0);
          if (currentQuizIndex < quizQuestions.length - 1) {
            setCurrentQuizIndex(prev => prev + 1);
          } else {
            setQuizFinished(true);
          }
        }, 2000);
      } else {
        setQuizStatus('wrong');
        setQuizWrongAttempts((n) => n + 1);
        setTimeout(() => setQuizStatus('idle'), 1500);
      }
    } else if (!activeTour) {
      setSelectedPartId(partId);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setQuizStatus('idle');
    setQuizWrongAttempts(0);
    setQuizFirstTryCorrect(0);
    setQuizFinished(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--c-bg)]">
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />

      <main id="main" className="flex-1 flex flex-col md:flex-row pt-20">
        {/* Painel Esquerdo: Canvas 3D */}
        <div className="relative shrink-0 h-[56dvh] min-h-[360px] md:flex-1 md:h-[calc(100dvh-80px)] md:min-h-0 border-b md:border-b-0 md:border-r border-[var(--c-border)] bg-black/5">
          <Link
            to="/psicoeducacao"
            className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 text-sm text-[var(--c-text)] hover:text-[var(--c-accent)] transition-colors bg-[var(--c-surface)]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--c-border)] shadow-sm"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>

          <AnimatePresence>
            {isBreathing && !activeDisorder && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
              >
                <div className="relative w-48 h-48 rounded-full border-4 border-blue-400/30 flex items-center justify-center bg-blue-500/10 backdrop-blur-sm">
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1.5, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-32 h-32 rounded-full bg-blue-400/20"
                  />
                  <div className="text-blue-500 font-bold text-lg drop-shadow-md z-10 text-center">
                    <p>Acompanhe o círculo</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback do Quiz */}
          <AnimatePresence>
            {isQuizMode && quizStatus !== 'idle' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
              >
                {quizStatus === 'correct' ? (
                  <div className="bg-green-500/90 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
                    <CheckCircle2 size={32} />
                    <span className="text-xl font-bold">Correto!</span>
                  </div>
                ) : (
                  <div className="bg-red-500/90 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
                    <XCircle size={32} />
                    <span className="text-xl font-bold">Incorreto, tente de novo!</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="hidden sm:block absolute top-4 right-4 z-10 bg-[var(--c-surface)]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--c-border)] shadow-sm text-xs text-[var(--c-muted)]">
            Use o mouse/dedo para girar e dar zoom
          </div>

          <ErrorBoundary>
            <Canvas camera={{ position: [0, 0.5, 14], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: "high-performance" }}>
              <Suspense fallback={
                <Html center>
                  <div className="flex flex-col items-center text-[var(--c-text)]">
                    <Loader2 className="w-8 h-8 animate-spin mb-2 text-[var(--c-accent)]" />
                    <span className="text-sm font-semibold">Carregando Modelo...</span>
                  </div>
                </Html>
              }>
                <BrainModel 
                  onSelectPart={handlePartClick} 
                  selectedPartId={currentSelectedPartId} 
                  stressLevel={stressLevel}
                  isExploded={isExploded}
                  isMindfulness={isMindfulness}
                  isTherapyActive={isTherapyActive}
                  isMedicated={isMedicated}
                  activeDisorder={activeDisorder}
                  quizTarget={isQuizMode ? quizQuestions[currentQuizIndex].target : null}
                  quizHint={isQuizMode && quizWrongAttempts >= 2}
                  showContext={showContext}
                />
                <CameraManager selectedPartId={currentSelectedPartId} />
              </Suspense>
            </Canvas>
          </ErrorBoundary>

          <AnimatePresence>
            {!activeDisorder && stressLevel > 50 && !isMindfulness && !isMedicated && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: (stressLevel - 50) / 50 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(239,68,68,0.3)]"
              />
            )}
            {(!activeDisorder && isMindfulness) || isMedicated ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(52,211,153,0.2)]"
              />
            ) : null}
          </AnimatePresence>
        </div>

        {/* Painel Direito */}
        <div className="w-full md:w-[400px] lg:w-[480px] bg-[var(--c-surface)] overflow-y-auto min-h-[44dvh] md:h-[calc(100dvh-80px)] p-5 md:p-8 flex flex-col">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--c-accent)] font-semibold mb-2">
                Laboratório Clínico 3D
              </p>
              <h1 className="text-3xl font-semibold text-[var(--c-text)] mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                Neuroanatomia
              </h1>
              <p className="text-[11px] text-[var(--c-muted)] leading-snug max-w-[280px]">
                Representação visual simplificada. Redes cerebrais são dinâmicas e variam entre pessoas.
              </p>
            </div>
            {/* Botão do Quiz */}
            <button
              onClick={() => {
                setIsQuizMode(!isQuizMode);
                if (!isQuizMode) {
                  setActiveDisorder(null);
                  setStressLevel(0);
                  setIsMindfulness(false);
                  setIsTherapyActive(false);
                  setIsBreathing(false);
                  setIsMedicated(false);
                  setSelectedPartId(null);
                  setActiveTour(null);
                  resetQuiz();
                }
              }}
              className={`p-3 rounded-full transition-colors ${
                isQuizMode ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-[var(--c-bg)] text-[var(--c-text)] border border-[var(--c-border)] hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30"
              }`}
              title="Modo Quiz"
            >
              <Target size={20} />
            </button>
          </div>

          {isQuizMode && quizFinished ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center shadow-inner"
            >
              <CheckCircle2 className="mx-auto mb-4 text-emerald-500" size={32} />
              <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">Quiz completo!</h2>
              <p className="text-3xl font-bold text-[var(--c-text)] mb-1">
                {quizFirstTryCorrect}/{quizQuestions.length}
              </p>
              <p className="text-sm text-[var(--c-muted)] mb-6">
                acertos de primeira (sem precisar da dica)
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={resetQuiz}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold"
                >
                  Refazer quiz
                </button>
                <button
                  onClick={() => { setIsQuizMode(false); resetQuiz(); }}
                  className="px-4 py-2 rounded-xl border border-[var(--c-border)] text-[var(--c-text)] text-sm font-semibold"
                >
                  Sair
                </button>
              </div>
            </motion.div>
          ) : isQuizMode ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center shadow-inner"
            >
              <Target className="mx-auto mb-4 text-emerald-500" size={32} />
              <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">Modo Avaliação</h2>
              <div className="text-sm font-semibold text-emerald-700/80 dark:text-emerald-300/80 mb-4">
                Pergunta {currentQuizIndex + 1} de {quizQuestions.length} · {quizFirstTryCorrect} acertos
              </div>
              <p className="text-lg text-[var(--c-text)] font-medium leading-relaxed mb-6">
                "{quizQuestions[currentQuizIndex].question}"
              </p>
              <p className="text-sm text-[var(--c-muted)] italic">
                {quizWrongAttempts >= 2
                  ? "Dica: observe a área que está pulsando em amarelo no modelo 3D."
                  : "Gire o modelo 3D e clique na parte correta do cérebro."}
              </p>
            </motion.div>
          ) : (
            <>
              {/* Seletor DSM-5-TR */}
              <div className="mb-6">
                <label className="text-sm font-semibold flex items-center gap-2 text-[var(--c-text)] mb-2">
                  <Stethoscope size={16} className="text-purple-500" />
                  Temas clínicos
                </label>
                <select
                  value={activeDisorder || ""}
                  onChange={(e) => handleDisorderSelect(e.target.value)}
                  className="w-full bg-[var(--c-bg)] border border-[var(--c-border)] text-[var(--c-text)] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all appearance-none cursor-pointer font-medium"
                  style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "16px" }}
                >
                  <option value="">Escolha um tema para explorar...</option>
                  {Object.values(disordersData).map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                {activeDisorder && (
                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={() => handleDisorderSelect("")}
                      className="text-xs text-purple-500 hover:text-purple-600 font-semibold transition-colors"
                    >
                      Limpar tema
                    </button>
                    {activeDisorder !== 'tdah' && (
                      <>
                        <span className="text-xs text-[var(--c-muted)]">|</span>
                        <button
                          onClick={() => setIsMedicated(!isMedicated)}
                          className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
                            isMedicated ? "text-emerald-500" : "text-[var(--c-muted)] hover:text-[var(--c-text)]"
                          }`}
                        >
                          <Pill size={12} />
                          {isMedicated ? "Remover ilustração" : "Ilustrar apoio medicamentoso"}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Trilhas Guiadas (Tours) */}
              <div className="mb-6">
                <label className="text-sm font-semibold flex items-center gap-2 text-[var(--c-text)] mb-2">
                  <Map size={16} className="text-blue-500" />
                  Trilhas Clínicas
                </label>
                <select
                  value={activeTour || ""}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setActiveTour(null);
                      setTourStep(0);
                    } else {
                      setActiveTour(e.target.value as GuidedTourId);
                      setTourStep(0);
                      handleDisorderSelect(""); // clear disorders
                    }
                  }}
                  className="w-full bg-[var(--c-bg)] border border-[var(--c-border)] text-[var(--c-text)] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer font-medium"
                  style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "16px" }}
                >
                  <option value="">Selecione uma Trilha...</option>
                  {Object.values(guidedToursData).map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="w-full h-px bg-[var(--c-border)] my-6"></div>

              {/* Ferramentas Manuais */}
              <details className="mb-6 group" open={false}>
                <summary className="min-h-12 px-4 py-3 rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)] text-sm font-semibold text-[var(--c-text)] cursor-pointer list-none flex items-center justify-between">
                  <span>Exploração livre</span>
                  <span className="text-xs text-[var(--c-muted)] group-open:hidden">Abrir ferramentas</span>
                  <span className="text-xs text-[var(--c-muted)] hidden group-open:inline">Fechar ferramentas</span>
                </summary>
                <div className={`pt-4 space-y-4 transition-opacity ${activeDisorder ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                <div className={`p-4 rounded-2xl border transition-colors ${stressLevel > 0 ? 'border-red-500/30 bg-red-500/5' : 'border-[var(--c-border)] bg-[var(--c-bg)]'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold flex items-center gap-2 text-[var(--c-text)]">
                      <Activity size={16} className={stressLevel > 50 ? "text-red-500 animate-pulse" : "text-[var(--c-muted)]"} />
                      Nível de Estresse
                    </label>
                    <span className="text-xs font-bold text-[var(--c-muted)]">{stressLevel}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={stressLevel}
                    disabled={isMindfulness || isBreathing}
                    onChange={(e) => {
                      setStressLevel(Number(e.target.value));
                      if (Number(e.target.value) > 0) { setSelectedPartId(null); setActiveTour(null); }
                    }}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${(isMindfulness || isBreathing) ? 'opacity-50 grayscale' : ''}`}
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #10b981 30%, #f59e0b 60%, #ef4444 100%)`
                    }}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setIsMindfulness(!isMindfulness);
                      if (!isMindfulness) { setStressLevel(0); setIsBreathing(false); }
                    }}
                    className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors border ${
                      isMindfulness ? "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400" : "bg-[var(--c-bg)] border-[var(--c-border)] text-[var(--c-text)] hover:border-blue-500/30"
                    }`}
                  >
                    <Flower2 size={16} className={isMindfulness ? "animate-[spin_4s_linear_infinite]" : ""} />
                    Mindfulness
                  </button>

                  <button
                    onClick={() => {
                      setIsTherapyActive(!isTherapyActive);
                      if (!isTherapyActive) { setIsExploded(false); setSelectedPartId(null); }
                    }}
                    className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors border ${
                      isTherapyActive ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400" : "bg-[var(--c-bg)] border-[var(--c-border)] text-[var(--c-text)] hover:border-indigo-500/30"
                    }`}
                  >
                    <LinkIcon size={16} />
                    Terapia (TCC)
                  </button>

                  <button
                    onClick={() => {
                      if (!isBreathing && stressLevel < 50) setStressLevel(80);
                      setIsBreathing(!isBreathing);
                      setIsMindfulness(false);
                    }}
                    className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors border ${
                      isBreathing ? "bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400" : "bg-[var(--c-bg)] border-[var(--c-border)] text-[var(--c-text)] hover:border-teal-500/30"
                    }`}
                  >
                    <Wind size={16} />
                    Respirar
                  </button>

                  <button
                    onClick={() => {
                      setIsExploded(!isExploded);
                      if (!isExploded) setIsTherapyActive(false);
                    }}
                    className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors border ${
                      isExploded ? "bg-[var(--c-accent)]/10 border-[var(--c-accent)]/30 text-[var(--c-accent)]" : "bg-[var(--c-bg)] border-[var(--c-border)] text-[var(--c-text)] hover:border-[var(--c-accent)]/30"
                    }`}
                  >
                    {isExploded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    {isExploded ? "Agrupar Modelo" : "Visão Expandida"}
                  </button>

                  <button
                    onClick={() => setShowContext(!showContext)}
                    className={`w-full mt-2 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors border ${
                      showContext ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400" : "bg-[var(--c-bg)] border-[var(--c-border)] text-[var(--c-text)] hover:border-indigo-500/30"
                    }`}
                  >
                    <Brain size={16} />
                    {showContext ? "Ocultar Córtex" : "Mostrar Córtex"}
                  </button>
                </div>
                </div>
              </details>

              {/* Textos Psicoeducativos Dinâmicos */}
              <div className="flex-1 mt-4">
                <AnimatePresence mode="wait">
                  {isMedicated ? (
                    <motion.div
                      key="medicated"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl space-y-4"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Pill className="text-emerald-600 dark:text-emerald-400 shrink-0" size={24} />
                        <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                          Apoio medicamentoso
                        </h2>
                      </div>
                      <p className="text-sm text-[var(--c-text)] leading-relaxed">
                        Esta animação representa, de forma simplificada, que a medicação pode contribuir para regular circuitos envolvidos nos sintomas. Ela não mostra uma medição individual do cérebro.
                      </p>
                      <p className="text-sm text-[var(--c-text)] leading-relaxed">
                        A resposta varia entre pessoas, depende do quadro clínico e costuma fazer parte de um plano que também pode incluir psicoterapia, rotina, suporte social e outras intervenções.
                      </p>
                      <p className="text-xs text-emerald-700/70 dark:text-emerald-300/70 italic leading-relaxed border-t border-emerald-500/20 pt-3">
                        O efeito visual é uma metáfora psicoeducativa. Não representa mecanismo único, resposta garantida ou recomendação de medicamento.
                      </p>
                    </motion.div>
                  ) : activeDisorder && disorderInfo ? (
                    <motion.div
                      key={`disorder-${activeDisorder}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-2xl space-y-4"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Stethoscope className="text-purple-600 dark:text-purple-400 shrink-0" size={24} />
                        <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                          {disorderInfo.name}
                        </h2>
                      </div>
                      <p className="text-sm font-semibold text-purple-700/80 dark:text-purple-300/80">
                        {disorderInfo.description}
                      </p>
                      <div className="w-full h-px bg-purple-500/20 my-2"></div>
                      <p className="text-sm text-[var(--c-text)] leading-relaxed">
                        {disorderInfo.details}
                      </p>
                    </motion.div>
                  ) : isTherapyActive ? (
                    <motion.div
                      key="therapy"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl space-y-4"
                    >
                      <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400" style={{ fontFamily: "var(--font-heading)" }}>
                        Neuroplasticidade e TCC
                      </h2>
                      <p className="text-sm text-[var(--c-text)] leading-relaxed">
                        A TCC ajuda a fortalecer as conexões (linhas azuis) entre o <strong>Córtex Pré-Frontal</strong> e a <strong>Amígdala</strong>. Com treino repetido, o pensamento racional inibe o medo mais rapidamente.
                      </p>
                    </motion.div>
                  ) : isMindfulness ? (
                    <motion.div
                      key="mindfulness"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl space-y-4"
                    >
                      <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400" style={{ fontFamily: "var(--font-heading)" }}>
                        O Poder do Relaxamento
                      </h2>
                      <p className="text-sm text-[var(--c-text)] leading-relaxed">
                        O relaxamento <strong>esfria a Amígdala</strong> e inunda o cérebro com neurotransmissores calmantes. Isso devolve a energia ao Córtex Pré-Frontal.
                      </p>
                    </motion.div>
                  ) : stressLevel > 70 ? (
                    <motion.div
                      key="attack"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl space-y-4"
                    >
                      <h2 className="text-xl font-bold text-red-600 dark:text-red-400" style={{ fontFamily: "var(--font-heading)" }}>
                        Sequestro da Amígdala
                      </h2>
                      <p className="text-sm text-[var(--c-text)] leading-relaxed">
                        A Amígdala assume o controle. O Córtex Pré-Frontal perde energia e desliga. O foco deve ser no relaxamento fisiológico (respiração).
                      </p>
                    </motion.div>
                  ) : activeTour ? (
                    <motion.div
                      key={`tour-${activeTour}-${tourStep}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl space-y-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-xs font-bold text-blue-500 uppercase tracking-widest">Passo {tourStep + 1} de {guidedToursData[activeTour].steps.length}</div>
                        <button onClick={() => {setActiveTour(null); setTourStep(0);}} className="text-xs text-blue-500 hover:underline">Sair da Trilha</button>
                      </div>
                      <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400" style={{ fontFamily: "var(--font-heading)" }}>
                        {guidedToursData[activeTour].steps[tourStep].title}
                      </h2>
                      <p className="text-sm text-[var(--c-text)] leading-relaxed">
                        {guidedToursData[activeTour].steps[tourStep].content}
                      </p>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-blue-500/20">
                        <button 
                          disabled={tourStep === 0}
                          onClick={() => setTourStep(prev => prev - 1)}
                          className="p-2 rounded-full bg-blue-500/20 text-blue-600 disabled:opacity-30 transition-opacity"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button 
                          disabled={tourStep === guidedToursData[activeTour].steps.length - 1}
                          onClick={() => setTourStep(prev => prev + 1)}
                          className="p-2 rounded-full bg-blue-500/20 text-blue-600 disabled:opacity-30 transition-opacity"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
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
                              Papel Clínico
                            </h3>
                            <p className="text-sm text-[var(--c-muted)] leading-relaxed">
                              {selectedInfo.role}
                            </p>
                          </div>
                        </div>
                      </div>
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
                        {isExploded 
                          ? "Arraste a câmera para explorar a anatomia interna do cérebro."
                          : "Interaja com os controles acima ou clique no modelo 3D para explorar."
                        }
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </main>

      <div className="hidden md:block border-t border-[var(--c-border)]">
        <EthicalFooter />
      </div>
    </div>
  );
}

