import { useRef, useState, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { brainPartsData, type BrainPartId, type BrainPartData } from '@/content/neuroanatomia';

interface BrainPartProps {
  data: BrainPartData;
  selected: boolean;
  hasSelection: boolean;
  isAnxietyAttack: boolean;
  onClick: () => void;
  scale?: number;
  position?: [number, number, number];
}

function BrainPart({ data, selected, hasSelection, isAnxietyAttack, onClick, scale = 1, position = [0, 0, 0] }: BrainPartProps) {
  const objs = useLoader(OBJLoader, data.urls);
  const [hovered, setHover] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  
  // Guardamos as referências dos materiais para animá-los no useFrame sem recriar
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  const meshes = useMemo(() => {
    const combined = new THREE.Group();
    materialsRef.current = []; // Reseta na recriação
    
    objs.forEach((obj: THREE.Object3D) => {
      const clone = obj.clone(true);
      clone.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          const material = new THREE.MeshStandardMaterial({
            color: data.color,
            transparent: true,
            opacity: 0.7,
            roughness: 0.5,
            metalness: 0.1,
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
    }

    // Lógica visual: isolamento e crise de ansiedade
    materialsRef.current.forEach((mat) => {
      let targetOpacity = 0.7;
      let targetColor = new THREE.Color(data.color);

      if (selected || hovered) {
        targetOpacity = 1.0;
        targetColor.set('#ffffff');
      } else if (hasSelection) {
        targetOpacity = 0.15; // Isola as peças não selecionadas
      }

      // Efeito de Simulação de Crise
      if (isAnxietyAttack) {
        if (data.id === 'amygdala') {
          // Amígdala pulsa forte em vermelho
          const pulse = Math.sin(state.clock.elapsedTime * 10) * 0.5 + 0.5;
          targetColor.setRGB(1, pulse * 0.2, pulse * 0.2); // Fica mais intensa
          targetOpacity = 1.0;
        } else if (data.id === 'prefrontal') {
          // Córtex Pré-Frontal perde o brilho/opacidade
          targetColor.set('#4b5563'); // gray-600
          targetOpacity = 0.3;
        } else {
          targetOpacity *= 0.5; // Outras partes ficam fracas
        }
      }

      // Interpolação suave para não piscar seco
      mat.opacity += (targetOpacity - mat.opacity) * 0.1;
      mat.color.lerp(targetColor, 0.1);
    });
  });

  return (
    <group 
      ref={groupRef}
      position={position}
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
      
      {(selected || hovered) && !isAnxietyAttack && data.id !== 'context' && (
        <Html position={[0, 100, 0]} center>
          <div className="px-2 py-1 rounded bg-black/80 text-white text-xs font-bold whitespace-nowrap backdrop-blur-sm border border-white/20">
            {data.title}
          </div>
        </Html>
      )}
    </group>
  );
}

interface BrainModelProps {
  onSelectPart: (partId: BrainPartId) => void;
  selectedPartId: BrainPartId | null;
  isAnxietyAttack: boolean;
}

export function BrainModel({ onSelectPart, selectedPartId, isAnxietyAttack }: BrainModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state: any) => {
    // Rotaciona devagar se nada estiver selecionado e não estiver em crise
    if (groupRef.current && !selectedPartId && !isAnxietyAttack) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const globalScale = 0.05;
  const globalPosition: [number, number, number] = [0, -3, 0];

  const brainParts = Object.values(brainPartsData);

  return (
    <group ref={groupRef} scale={globalScale} position={globalPosition}>
      <ambientLight intensity={isAnxietyAttack ? 0.3 : 0.6} />
      <directionalLight position={[100, 100, 100]} intensity={isAnxietyAttack ? 2 : 1.2} color={isAnxietyAttack ? "#ffaaaa" : "#ffffff"} />
      <directionalLight position={[-100, -100, -100]} intensity={0.8} />

      {brainParts.map((part) => (
        <BrainPart
          key={part.id}
          data={part}
          selected={selectedPartId === part.id}
          hasSelection={selectedPartId !== null}
          isAnxietyAttack={isAnxietyAttack}
          onClick={() => {
            if (part.id !== 'context') {
              onSelectPart(part.id);
            }
          }}
        />
      ))}
    </group>
  );
}
