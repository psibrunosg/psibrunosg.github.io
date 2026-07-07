import { useRef, useState, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html, Sparkles, Center } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { brainPartsData, disordersData, type BrainPartId, type BrainPartData, type DisorderId } from '@/content/neuroanatomia';

// Carrega a lista de todos os arquivos OBJ disponíveis na pasta public/models
const allModelPaths = Object.keys(import.meta.glob('/public/models/*.obj')).map(p => p.replace('/public', ''));

// Descobre quais arquivos já estão sendo usados pelas peças principais para não duplicar
const usedUrls = new Set(Object.values(brainPartsData).flatMap(part => part.urls));
const cortexUrls = allModelPaths.filter(url => !usedUrls.has(url));

// Componente para o Córtex Completo
function FullCortex({ visible, opacity }: { visible: boolean, opacity: number }) {
  // Só carrega os arquivos se estiver visível para não travar o início
  const objs = useLoader(OBJLoader, visible ? cortexUrls : []);
  const materialsRef = useRef<THREE.MeshLambertMaterial[]>([]);

  const meshes = useMemo(() => {
    if (!visible) return new THREE.Group();
    const combined = new THREE.Group();
    materialsRef.current.forEach((mat) => mat.dispose());
    materialsRef.current = [];
    const objArray = Array.isArray(objs) ? objs : [objs];

    objArray.forEach((obj: any) => {
      if (!obj) return;
      const clone = obj.clone(true);
      clone.traverse((child: any) => {
        if (child.isMesh) {
          const material = new THREE.MeshLambertMaterial({
            color: '#e5e7eb',
            transparent: true,
            opacity: opacity,
          });
          child.material = material;
          materialsRef.current.push(material);
        }
      });
      combined.add(clone);
    });
    return combined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objs, visible]);

  useFrame(() => {
    materialsRef.current.forEach(mat => {
      mat.opacity += (opacity - mat.opacity) * 0.1;
    });
  });

  if (!visible) return null;

  return (
    <group>
      <primitive object={meshes} />
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
  const materialsRef = useRef<THREE.MeshLambertMaterial[]>([]);
  // Objetos reutilizáveis para evitar alocação por frame dentro de useFrame (pressão de GC em mobile)
  const tmpColor = useRef(new THREE.Color()).current;
  const tmpColorA = useRef(new THREE.Color()).current;
  const tmpColorB = useRef(new THREE.Color()).current;
  const tmpVec3 = useRef(new THREE.Vector3()).current;

  const { meshes, labelCenter } = useMemo(() => {
    const combined = new THREE.Group();
    materialsRef.current.forEach((mat) => mat.dispose());
    materialsRef.current = [];

    const objArray = Array.isArray(objs) ? objs : [objs];

    objArray.forEach((obj: any) => {
      if (!obj) return;
      const clone = obj.clone(true);
      clone.traverse((child: any) => {
        if (child.isMesh) {
          // MeshLambertMaterial é muito mais leve para a placa de vídeo
          const material = new THREE.MeshLambertMaterial({
            color: data.color,
            transparent: true,
            opacity: 0.9,
          });
          child.material = material;
          materialsRef.current.push(material);
        }
      });
      combined.add(clone);
    });

    // Calcula o centro exato desta peça anatômica para posicionar o rótulo HTML
    const box = new THREE.Box3().setFromObject(combined);
    const center = new THREE.Vector3();
    box.getCenter(center);
    center.y += 20; // Eleva um pouco para não ficar exatamente dentro da malha

    return { meshes: combined, labelCenter: center };
  }, [objs, data.color]);

  useFrame((state: any) => {
    if (groupRef.current) {
      const targetScale = selected ? scale * 1.05 : hovered ? scale * 1.02 : scale;
      groupRef.current.scale.lerp(tmpVec3.set(targetScale, targetScale, targetScale), 0.1);

      if (isExploded && data.explodePosition) {
        tmpVec3.set(...data.explodePosition);
      } else {
        tmpVec3.set(0, 0, 0);
      }
      groupRef.current.position.lerp(tmpVec3, 0.05);
    }

    materialsRef.current.forEach((mat) => {
      let targetOpacity = 0.7;
      const targetColor = tmpColor.set(data.color);

      // Dica progressiva do quiz: só acende depois de 2 respostas erradas (retrieval practice
      // com scaffolding — evita dar a resposta de graça, mas previne frustração/abandono)
      if (quizTarget && data.id === quizTarget && quizHint) {
        const pulse = Math.sin(state.clock.elapsedTime * 6) * 0.5 + 0.5;
        targetColor.lerpColors(tmpColorA.set(data.color), tmpColorB.set('#facc15'), pulse * 0.6);
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
            targetColor.lerpColors(tmpColorA.set(data.color), tmpColorB.set(1, 0, 0), pulse);
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
          targetColor.lerp(tmpColorA.set('#000000'), 0.7);
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
            targetColor.lerpColors(tmpColorA.set(data.color), tmpColorB.set(1, pulse * 0.2, pulse * 0.2), stress);
            targetOpacity = 0.7 + (stress * 0.3);
          }
        } else if (data.id === 'prefrontal') {
          if (stress > 0) {
            targetColor.lerpColors(tmpColorA.set(data.color), tmpColorB.set('#4b5563'), stress);
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
      onClick={(e: any) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e: any) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e: any) => {
        e.stopPropagation();
        setHover(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <primitive object={meshes} />
      
      {(selected || hovered || isExploded) && data.id !== 'context' && (
        <Html position={[labelCenter.x, labelCenter.y, labelCenter.z]} center zIndexRange={[100, 0]}>
          <div className="px-2 py-1 rounded bg-black/80 text-white text-xs font-bold whitespace-nowrap backdrop-blur-sm border border-white/20 pointer-events-none">
            {data.title}
          </div>
        </Html>
      )}
    </group>
  );
}

function TherapyLine({ isTherapyActive, isExploded }: { isTherapyActive: boolean, isExploded: boolean }) {
  const lineRef = useRef<any>(null);

  // Posições são estáticas (vêm de brainPartsData), então a curva é calculada uma única vez
  // e a BufferGeometry não é recriada (e descartada) a cada re-render do componente.
  const geometry = useMemo(() => {
    const start = new THREE.Vector3(...(brainPartsData.prefrontal.cameraTarget || [0, 0, 0]));
    const end = new THREE.Vector3(...(brainPartsData.amygdala.cameraTarget || [0, 0, 0]));
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5).add(new THREE.Vector3(5, 5, 0));
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
  }, []);

  // Hook sempre chamado (Rules of Hooks) — o early return por isExploded fica só no JSX abaixo.
  useFrame((state: any) => {
    if (lineRef.current) {
      if (isTherapyActive && !isExploded) {
        lineRef.current.material.opacity = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.5;
      } else {
        lineRef.current.material.opacity = 0;
      }
    }
  });

  if (isExploded) return null;

  return (
    // @ts-expect-error — R3F <line> resolve para o namespace JSX do SVG em vez do Object3DNode
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#3b82f6" transparent opacity={0} linewidth={2} />
    </line>
  );
}

interface BrainModelProps {
  onSelectPart: (partId: BrainPartId) => void;
  selectedPartId: BrainPartId | null;
  stressLevel: number;
  isExploded: boolean;
  isMindfulness: boolean;
  isTherapyActive: boolean;
  isMedicated: boolean;
  activeDisorder: DisorderId | null;
  quizTarget: BrainPartId | null;
  quizHint: boolean;
  showContext: boolean;
}

export function BrainModel({ onSelectPart, selectedPartId, stressLevel, isExploded, isMindfulness, isTherapyActive, activeDisorder, isMedicated, quizTarget, quizHint, showContext }: BrainModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state: any) => {
    if (groupRef.current && !selectedPartId && stressLevel === 0 && !isMindfulness && !activeDisorder && !isMedicated) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const globalScale = 0.05;
  const globalPosition: [number, number, number] = [0, -3, 0];

  const brainParts = Object.values(brainPartsData);

  // Default lights
  let ambientIntensity = 0.6;
  let dirIntensity = 1.2;
  let dirColor = new THREE.Color("#ffffff");
  
  let sparkColor = '#fbbf24';
  let sparkSpeed = 0.1;
  let sparkCount = 20; // Reduzido drasticamente para placas fracas
  let sparkScale = 1;
  let sparkNoise = 1;

  if (activeDisorder && disordersData[activeDisorder] && isMedicated) {
    // Fármaco simulado sobre um transtorno ativo: a ambiência deve suavizar visivelmente,
    // não ficar presa no clima "opressivo" do transtorno (senão o botão não parece fazer nada).
    const disorder = disordersData[activeDisorder];
    ambientIntensity = (disorder.ambientIntensity + 0.7) / 2;
    dirIntensity = (disorder.dirIntensity + 1.0) / 2;
    dirColor.set("#ecfdf5");

    sparkColor = '#34d399';
    sparkSpeed = disorder.sparkles.speed * 0.15;
    sparkCount = Math.floor(disorder.sparkles.count * 0.15);
    sparkScale = disorder.sparkles.scale * 0.7;
    sparkNoise = disorder.sparkles.noise * 0.3;
  } else if (activeDisorder && disordersData[activeDisorder]) {
    const disorder = disordersData[activeDisorder];
    ambientIntensity = disorder.ambientIntensity;
    dirIntensity = disorder.dirIntensity;
    dirColor.set(disorder.dirColor);

    sparkColor = disorder.sparkles.color;
    sparkSpeed = disorder.sparkles.speed * 0.5;
    sparkCount = Math.floor(disorder.sparkles.count * 0.3); // 30% do original
    sparkScale = disorder.sparkles.scale;
    sparkNoise = disorder.sparkles.noise;
  } else if (isMindfulness) {
    ambientIntensity = 0.8;
    dirIntensity = 0.8;
    dirColor.set("#dbeafe");
    sparkColor = '#93c5fd';
    sparkSpeed = 0.02;
    sparkCount = 30;
  } else if (isMedicated) {
    ambientIntensity = 0.7;
    dirIntensity = 1.0;
    dirColor.set("#ecfdf5"); // emerald tint
    sparkColor = '#34d399'; // calm green
    sparkSpeed = 0.05;
    sparkCount = 25;
  } else {
    // Stress normal calculation
    ambientIntensity = 0.6 - (stressLevel / 100) * 0.4;
    dirIntensity = 1.2 + (stressLevel / 100) * 0.8;
    if (stressLevel > 50) dirColor.set("#fee2e2");

    sparkColor = stressLevel > 50 ? '#ef4444' : '#fbbf24';
    sparkSpeed = 0.1 + (stressLevel / 100) * 0.5;
    sparkCount = 15 + Math.floor((stressLevel / 100) * 30);
  }

  // Córtex opacity based on selection
  const cortexOpacity = isExploded ? 0.1 : (selectedPartId ? 0.15 : 0.3);

  return (
    <group ref={groupRef} scale={globalScale} position={globalPosition}>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[100, 100, 100]} intensity={dirIntensity} color={dirColor} />
      <directionalLight position={[-100, -100, -100]} intensity={0.8} />

      {(!isExploded) && (
        <Sparkles 
          count={sparkCount} 
          scale={5} 
          size={sparkScale} 
          speed={sparkSpeed} 
          color={sparkColor}
          opacity={0.6}
          noise={sparkNoise}
        />
      )}

      {!activeDisorder && !isMedicated && <TherapyLine isTherapyActive={isTherapyActive} isExploded={isExploded} />}

      <Center>
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
      </Center>
    </group>
  );
}
