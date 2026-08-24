import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useLoader, type ThreeEvent } from '@react-three/fiber';
import { Html, Sparkles, Line } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { brainPartsData, disordersData, type BrainPartId, type BrainPartData, type DisorderId } from '@/content/neuroanatomia';
import { cloneGroupsWithMaterials, disposeMaterials } from './brainModelGeometry';

// Carrega a lista de todos os arquivos OBJ disponíveis na pasta public/models
const allModelPaths = Object.keys(import.meta.glob('/public/models/*.obj')).map(p => p.replace('/public', ''));

// Mantém no contexto apenas a superfície cortical. O atlas também contém ventrículos,
// tratos e núcleos internos, que não podem ser tratados como córtex.
const usedUrls = new Set(Object.values(brainPartsData).flatMap(part => part.urls));
const corticalMarkers = ['gyrus', 'lobule', 'cuneus', 'precuneus', 'operculum', 'pole.obj', 'entorhinal area', 'subiculum', 'uncus'];
const cortexUrls = allModelPaths.filter(url => !usedUrls.has(url) && corticalMarkers.some(marker => url.toLowerCase().includes(marker)));
const atlasCenter: [number, number, number] = [0, -79.82, 1556.34];
const flowAnchors: Record<BrainPartId, [number, number, number]> = {
  prefrontal: [31.9, -111.66, 1588.49],
  amygdala: [22.9, -100.93, 1534.68],
  hippocampus: [25.5, -81.02, 1537.53],
  hypothalamus: [3.1, -101.21, 1542.16],
  cingulate: [10.9, -86.59, 1568.24],
  insula: [34.2, -105.18, 1558.47],
  caudate: [16.6, -92.11, 1557.42],
  cerebellum: [26, -40.32, 1513.87],
  motor_cortex: [31.7, -72.11, 1593.62],
  somatosensory: [33.9, -56.07, 1593.8],
  putamen: [25.3, -96.95, 1558.49],
  context: [9.9, -76.26, 1506.43],
};

// Componente para o Córtex Completo
function FullCortex({ visible, opacity }: { visible: boolean, opacity: number }) {
  // Só carrega os arquivos se estiver visível para não travar o início
  const objs = useLoader(OBJLoader, visible ? cortexUrls : []);

  const geometry = useMemo(() => {
    if (!visible) {
      return {
        group: new THREE.Group(),
        materials: [] as THREE.MeshLambertMaterial[],
      };
    }

    return cloneGroupsWithMaterials(
      objs,
      () => new THREE.MeshLambertMaterial({
            color: '#e5e7eb',
            transparent: true,
            opacity: opacity,
            depthWrite: false,
            side: THREE.DoubleSide,
          }),
    );
  }, [objs, opacity, visible]);

  useEffect(
    () => () => disposeMaterials(geometry.materials),
    [geometry.materials],
  );

  useFrame(() => {
    geometry.materials.forEach(mat => {
      mat.opacity += (opacity - mat.opacity) * 0.1;
    });
  });

  if (!visible) return null;

  return (
    <group>
      <primitive object={geometry.group} />
    </group>
  );
}

interface BrainPartProps {
  data: BrainPartData;
  selected: boolean;
  hasSelection: boolean;
  stressLevel: number;
  isExploded: boolean;
  isMindfulness: boolean;
  isMedicated: boolean;
  quizTarget: BrainPartId | null;
  quizHint: boolean;
  activeDisorder: DisorderId | null;
  onClick: () => void;
  scale?: number;
}

function BrainPart({ data, selected, hasSelection, stressLevel, isExploded, isMindfulness, isMedicated, quizTarget, quizHint, activeDisorder, onClick, scale = 1 }: BrainPartProps) {
  const objs = useLoader(OBJLoader, data.urls);
  const [hovered, setHover] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  // Objetos reutilizáveis para evitar alocação por frame dentro de useFrame (pressão de GC em mobile)
  const scratch = useMemo(() => ({
    color: new THREE.Color(),
    colorA: new THREE.Color(),
    colorB: new THREE.Color(),
    vector: new THREE.Vector3(),
  }), []);

  const geometry = useMemo(
    () => cloneGroupsWithMaterials(
      objs,
      () => new THREE.MeshLambertMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.9,
      }),
      { labelOffsetY: 20 },
    ),
    [data.color, objs],
  );

  useEffect(
    () => () => disposeMaterials(geometry.materials),
    [geometry.materials],
  );

  useFrame((state) => {
    if (groupRef.current) {
      const targetScale = selected ? scale * 1.05 : hovered ? scale * 1.02 : scale;
      groupRef.current.scale.lerp(scratch.vector.set(targetScale, targetScale, targetScale), 0.1);

      if (isExploded && data.explodePosition) {
        scratch.vector.set(...data.explodePosition);
      } else {
        scratch.vector.set(0, 0, 0);
      }
      groupRef.current.position.lerp(scratch.vector, 0.05);
    }

    geometry.materials.forEach((mat) => {
      let targetOpacity = 0.7;
      const targetColor = scratch.color.set(data.color);

      // Dica progressiva do quiz: só acende depois de 2 respostas erradas (retrieval practice
      // com scaffolding — evita dar a resposta de graça, mas previne frustração/abandono)
      if (quizTarget && data.id === quizTarget && quizHint) {
        const pulse = Math.sin(state.clock.elapsedTime * 6) * 0.5 + 0.5;
        targetColor.lerpColors(scratch.colorA.set(data.color), scratch.colorB.set('#facc15'), pulse * 0.6);
        targetOpacity = Math.max(targetOpacity, 0.6 + pulse * 0.3);
      }

      // Prioridade de Modos: Medicação > Transtorno > Mindfulness > Estresse
      if (isMedicated) {
        if (data.id === 'prefrontal' || data.id === 'hippocampus') {
          targetColor.set('#34d399');
          targetOpacity = 0.9;
        } else if (data.id === 'amygdala') {
          targetColor.set('#f472b6');
          targetOpacity = 0.4;
        } else {
          targetOpacity = 0.7;
        }
      }
      else if (activeDisorder) {
        if (activeDisorder === 'tag') {
          if (data.id === 'amygdala') {
            const pulse = Math.sin(state.clock.elapsedTime * 15) * 0.5 + 0.5;
            targetColor.lerpColors(scratch.colorA.set(data.color), scratch.colorB.set(1, 0, 0), pulse);
            targetOpacity = 0.9;
          } else if (data.id === 'prefrontal') {
            targetColor.set('#4b5563');
            targetOpacity = 0.4;
          }
        } else if (activeDisorder === 'tept') {
          if (data.id === 'hippocampus') {
            targetColor.set('#1f2937');
            targetOpacity = 0.2;
          } else if (data.id === 'amygdala') {
            const pulse = Math.sin(state.clock.elapsedTime * 20) * 0.5 + 0.5;
            targetColor.setRGB(0.8 + pulse * 0.2, 0, 0);
            targetOpacity = 1.0;
          } else if (data.id === 'prefrontal') {
            targetColor.set('#374151');
            targetOpacity = 0.3;
          }
        } else if (activeDisorder === 'tdm') {
          targetColor.lerp(scratch.colorA.set('#000000'), 0.7);
          targetOpacity = 0.3;
        } else if (activeDisorder === 'tdah') {
          // Disfunção frontoestriatal (não só frontal): dopamina/noradrenalina desreguladas
          // no circuito PFC <-> núcleo caudato/putâmen (Volkow et al.) — os 3 oscilam juntos.
          if (data.id === 'prefrontal') {
            const noise = Math.random();
            const pulse = Math.sin(state.clock.elapsedTime * 8) * 0.5 + 0.5;
            targetColor.setRGB(0.2, 0.4 + (pulse * noise * 0.4), 0.8 + (pulse * noise * 0.2));
            targetOpacity = 0.4 + (noise * 0.3);
          } else if (data.id === 'caudate' || data.id === 'putamen') {
            const noise = Math.random();
            const pulse = Math.sin(state.clock.elapsedTime * 6 + (data.id === 'putamen' ? 1.5 : 0)) * 0.5 + 0.5;
            targetColor.setRGB(0.3, 0.35 + (pulse * noise * 0.3), 0.75 + (pulse * noise * 0.15));
            targetOpacity = 0.45 + (noise * 0.25);
          } else {
            targetOpacity = 0.5;
          }
        }
      }
      else if (isMindfulness) {
        if (data.id === 'prefrontal') {
          targetColor.set('#60a5fa');
          targetOpacity = 1.0;
        } else if (data.id === 'amygdala') {
          targetColor.set('#fca5a5');
          targetOpacity = 0.4;
        } else {
          targetOpacity = 0.6;
        }
      } else {
        const stress = stressLevel / 100;
        if (data.id === 'amygdala') {
          if (stress > 0) {
            const speed = stress * 20;
            const pulse = Math.sin(state.clock.elapsedTime * speed) * 0.5 + 0.5;
            targetColor.lerpColors(scratch.colorA.set(data.color), scratch.colorB.set(1, pulse * 0.2, pulse * 0.2), stress);
            targetOpacity = 0.7 + (stress * 0.3);
          }
        } else if (data.id === 'prefrontal') {
          if (stress > 0) {
            targetColor.lerpColors(scratch.colorA.set(data.color), scratch.colorB.set('#4b5563'), stress);
            targetOpacity = 0.7 - (stress * 0.4);
          }
        } else {
          if (stress > 0) {
            targetOpacity -= (stress * 0.3);
          }
        }
      }

      if (selected || hovered) {
        targetOpacity = 1.0;
        targetColor.set('#ffffff');
      } else if (hasSelection && !isExploded) {
        targetOpacity = 0.15; 
      }

      mat.opacity += (targetOpacity - mat.opacity) * 0.1;
      mat.color.lerp(targetColor, 0.1);
    });
  });

  return (
    <group 
      ref={groupRef}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHover(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <primitive object={geometry.group} />
      
      {(selected || hovered || isExploded) && data.id !== 'context' && (
        <Html position={[geometry.labelCenter.x, geometry.labelCenter.y, geometry.labelCenter.z]} center zIndexRange={[100, 0]}>
          <div className="px-2 py-1 rounded bg-black/80 text-white text-xs font-bold whitespace-nowrap backdrop-blur-sm border border-white/20 pointer-events-none">
            {data.title}
          </div>
        </Html>
      )}
    </group>
  );
}

function FlowSegment({ from, to, active, index }: { from: BrainPartId, to: BrainPartId, active: boolean, index: number }) {
  const dotRef = useRef<THREE.Mesh>(null);
  const prefersReducedMotion = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...flowAnchors[from]);
    const end = new THREE.Vector3(...flowAnchors[to]);
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mid.x += 12;
    mid.z += 35;
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [from, to]);
  const points = useMemo(() => curve.getPoints(36), [curve]);
  const dotPosition = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (dotRef.current) {
      const progress = prefersReducedMotion ? 0.5 : (state.clock.elapsedTime * 0.18 + index * 0.2) % 1;
      curve.getPointAt(progress, dotPosition);
      dotRef.current.position.copy(dotPosition);
    }
  });

  return (
    <group>
      <Line
        points={points}
        color={active ? '#facc15' : '#38bdf8'}
        lineWidth={active ? 5 : 3.5}
        transparent
        opacity={active ? 0.95 : 0.55}
        depthTest={false}
        depthWrite={false}
        renderOrder={100}
      />
      <mesh ref={dotRef} renderOrder={101}>
        <sphereGeometry args={[active ? 5 : 3.2, 12, 12]} />
        <meshBasicMaterial color={active ? '#fef08a' : '#7dd3fc'} depthTest={false} depthWrite={false} />
      </mesh>
    </group>
  );
}

function BrainFlowNetwork({ partIds, activeStep, isExploded }: { partIds: BrainPartId[], activeStep: number, isExploded: boolean }) {
  if (isExploded || partIds.length < 2) return null;
  const activeSegment = Math.min(Math.max(activeStep - 1, 0), partIds.length - 2);

  return (
    <group>
      {partIds.slice(0, -1).map((from, index) => (
        <FlowSegment
          key={`${from}-${partIds[index + 1]}-${index}`}
          from={from}
          to={partIds[index + 1]}
          active={index === activeSegment}
          index={index}
        />
      ))}
    </group>
  );
}

interface BrainVisualSettings {
  ambientIntensity: number;
  dirIntensity: number;
  dirColor: string;
  sparkColor: string;
  sparkSpeed: number;
  sparkCount: number;
  sparkScale: number;
  sparkNoise: number;
}

function withMotionPreference(
  settings: BrainVisualSettings,
  prefersReducedMotion: boolean,
): BrainVisualSettings {
  return prefersReducedMotion ? { ...settings, sparkSpeed: 0 } : settings;
}

function getBrainVisualSettings(
  activeDisorder: DisorderId | null,
  isMedicated: boolean,
  isMindfulness: boolean,
  stressLevel: number,
  prefersReducedMotion: boolean,
): BrainVisualSettings {
  if (activeDisorder && isMedicated) {
    const disorder = disordersData[activeDisorder];
    return withMotionPreference({
      ambientIntensity: (disorder.ambientIntensity + 0.7) / 2,
      dirIntensity: (disorder.dirIntensity + 1.0) / 2,
      dirColor: '#ecfdf5',
      sparkColor: '#34d399',
      sparkSpeed: disorder.sparkles.speed * 0.15,
      sparkCount: Math.floor(disorder.sparkles.count * 0.15),
      sparkScale: disorder.sparkles.scale * 0.7,
      sparkNoise: disorder.sparkles.noise * 0.3,
    }, prefersReducedMotion);
  }

  if (activeDisorder) {
    const disorder = disordersData[activeDisorder];
    return withMotionPreference({
      ambientIntensity: disorder.ambientIntensity,
      dirIntensity: disorder.dirIntensity,
      dirColor: disorder.dirColor,
      sparkColor: disorder.sparkles.color,
      sparkSpeed: disorder.sparkles.speed * 0.5,
      sparkCount: Math.floor(disorder.sparkles.count * 0.3),
      sparkScale: disorder.sparkles.scale,
      sparkNoise: disorder.sparkles.noise,
    }, prefersReducedMotion);
  }

  if (isMindfulness) {
    return withMotionPreference({
      ambientIntensity: 0.8,
      dirIntensity: 0.8,
      dirColor: '#dbeafe',
      sparkColor: '#93c5fd',
      sparkSpeed: 0.02,
      sparkCount: 30,
      sparkScale: 1,
      sparkNoise: 1,
    }, prefersReducedMotion);
  }

  if (isMedicated) {
    return withMotionPreference({
      ambientIntensity: 0.7,
      dirIntensity: 1.0,
      dirColor: '#ecfdf5',
      sparkColor: '#34d399',
      sparkSpeed: 0.05,
      sparkCount: 25,
      sparkScale: 1,
      sparkNoise: 1,
    }, prefersReducedMotion);
  }

  const stress = stressLevel / 100;
  return withMotionPreference({
    ambientIntensity: 0.6 - stress * 0.4,
    dirIntensity: 1.2 + stress * 0.8,
    dirColor: stressLevel > 50 ? '#fee2e2' : '#ffffff',
    sparkColor: stressLevel > 50 ? '#ef4444' : '#fbbf24',
    sparkSpeed: 0.1 + stress * 0.5,
    sparkCount: 15 + Math.floor(stress * 30),
    sparkScale: 1,
    sparkNoise: 1,
  }, prefersReducedMotion);
}

interface BrainModelProps {
  onSelectPart: (partId: BrainPartId) => void;
  selectedPartId: BrainPartId | null;
  stressLevel: number;
  isExploded: boolean;
  isMindfulness: boolean;
  isMedicated: boolean;
  activeDisorder: DisorderId | null;
  quizTarget: BrainPartId | null;
  quizHint: boolean;
  showContext: boolean;
  flowPartIds: BrainPartId[];
  flowStep: number;
}

export function BrainModel({ onSelectPart, selectedPartId, stressLevel, isExploded, isMindfulness, activeDisorder, isMedicated, quizTarget, quizHint, showContext, flowPartIds, flowStep }: BrainModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const prefersReducedMotion = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  useFrame((state) => {
    if (!prefersReducedMotion && groupRef.current && !selectedPartId && stressLevel === 0 && !isMindfulness && !activeDisorder && !isMedicated) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const globalScale = 0.05;
  const brainParts = Object.values(brainPartsData);

  const {
    ambientIntensity,
    dirIntensity,
    dirColor,
    sparkColor,
    sparkSpeed,
    sparkCount,
    sparkScale,
    sparkNoise,
  } = getBrainVisualSettings(
    activeDisorder,
    isMedicated,
    isMindfulness,
    stressLevel,
    prefersReducedMotion,
  );

  // Córtex opacity based on selection
  const cortexOpacity = isExploded ? 0.1 : (selectedPartId ? 0.15 : 0.3);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[100, 100, 100]} intensity={dirIntensity} color={dirColor} />
      <directionalLight position={[-100, -100, -100]} intensity={0.8} />

      {(!isExploded) && (
        <Sparkles 
          count={sparkCount} 
          scale={9}
          size={sparkScale} 
          speed={sparkSpeed} 
          color={sparkColor}
          opacity={0.6}
          noise={sparkNoise}
        />
      )}

      <group scale={globalScale}>
        <group position={[-atlasCenter[0], -atlasCenter[1], -atlasCenter[2]]}>
        <BrainFlowNetwork partIds={flowPartIds} activeStep={flowStep} isExploded={isExploded} />
        {brainParts.map((part) => (
          <BrainPart
            key={part.id}
            data={part}
            selected={selectedPartId === part.id}
            hasSelection={selectedPartId !== null}
            stressLevel={stressLevel}
            isExploded={isExploded}
            isMindfulness={isMindfulness}
            isMedicated={isMedicated}
            activeDisorder={activeDisorder}
            quizTarget={quizTarget}
            quizHint={quizHint}
            onClick={() => {
              if (part.id !== 'context') {
                onSelectPart(part.id);
              }
            }}
          />
        ))}
        {/* Renderiza o córtex de fundo, se habilitado */}
        {showContext && <FullCortex visible={showContext} opacity={cortexOpacity} />}
        </group>
      </group>
    </group>
  );
}
