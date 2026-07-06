import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html, Sparkles, Center } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { brainPartsData, disordersData, type BrainPartId, type BrainPartData, type DisorderId } from '@/content/neuroanatomia';

interface BrainPartProps {
  data: BrainPartData;
  selected: boolean;
  hasSelection: boolean;
  stressLevel: number;
  isExploded: boolean;
  isMindfulness: boolean;
  isMedicated: boolean;
  quizTarget: BrainPartId | null;
  activeDisorder: DisorderId | null;
  onClick: () => void;
  scale?: number;
}

function BrainPart({ data, selected, hasSelection, stressLevel, isExploded, isMindfulness, isMedicated, quizTarget, activeDisorder, onClick, scale = 1 }: BrainPartProps) {
  const objs = useLoader(OBJLoader, data.urls);
  const [hovered, setHover] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  const meshes = useMemo(() => {
    const combined = new THREE.Group();
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
    return combined;
  }, [objs, data.color]);

  useFrame((state: any) => {
    if (groupRef.current) {
      const targetScale = selected ? scale * 1.05 : hovered ? scale * 1.02 : scale;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      const targetPos = isExploded && data.explodePosition 
        ? new THREE.Vector3(...data.explodePosition) 
        : new THREE.Vector3(0, 0, 0);
      groupRef.current.position.lerp(targetPos, 0.05);
    }

    materialsRef.current.forEach((mat) => {
      let targetOpacity = 0.7;
      let targetColor = new THREE.Color(data.color);

      // Quiz mode override (Pulso de alvo)
      if (quizTarget && data.id === quizTarget) {
        // Nada drástico, só mantemos
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
            targetColor.lerpColors(new THREE.Color(data.color), new THREE.Color(1, 0, 0), pulse);
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
          targetColor.lerp(new THREE.Color('#000000'), 0.7);
          targetOpacity = 0.3;
        } else if (activeDisorder === 'tdah') {
          if (data.id === 'prefrontal') {
            const noise = Math.random(); 
            const pulse = Math.sin(state.clock.elapsedTime * 8) * 0.5 + 0.5;
            targetColor.setRGB(0.2, 0.4 + (pulse * noise * 0.4), 0.8 + (pulse * noise * 0.2));
            targetOpacity = 0.4 + (noise * 0.3);
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
            const baseRed = new THREE.Color(data.color);
            const highRed = new THREE.Color(1, pulse * 0.2, pulse * 0.2);
            targetColor.lerpColors(baseRed, highRed, stress);
            targetOpacity = 0.7 + (stress * 0.3);
          }
        } else if (data.id === 'prefrontal') {
          if (stress > 0) {
            const baseColor = new THREE.Color(data.color);
            const grayColor = new THREE.Color('#4b5563');
            targetColor.lerpColors(baseColor, grayColor, stress);
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
        <Html position={[0, 100, 0]} center zIndexRange={[100, 0]}>
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

  if (isExploded) return null;

  const start = new THREE.Vector3(...(brainPartsData.prefrontal.cameraTarget || [0,0,0]));
  const end = new THREE.Vector3(...(brainPartsData.amygdala.cameraTarget || [0,0,0]));
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5).add(new THREE.Vector3(5, 5, 0)); 

  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  useFrame((state: any) => {
    if (lineRef.current) {
      if (isTherapyActive) {
        lineRef.current.material.opacity = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.5;
      } else {
        lineRef.current.material.opacity = 0;
      }
    }
  });

  return (
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
}

export function BrainModel({ onSelectPart, selectedPartId, stressLevel, isExploded, isMindfulness, isTherapyActive, activeDisorder, isMedicated, quizTarget }: BrainModelProps) {
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

  if (activeDisorder && disordersData[activeDisorder]) {
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
            onClick={() => {
              if (part.id !== 'context') {
                onSelectPart(part.id);
              }
            }}
          />
        ))}
      </Center>
    </group>
  );
}
