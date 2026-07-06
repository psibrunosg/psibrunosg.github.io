import { useRef, useState, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

interface BrainPartProps {
  urls: string[];
  color: string;
  name: string;
  selected: boolean;
  onClick: () => void;
  scale?: number;
  position?: [number, number, number];
}

function BrainPart({ urls, color, name, selected, onClick, scale = 1, position = [0, 0, 0] }: BrainPartProps) {
  // Carrega todos os OBJs referentes a esta parte do cérebro
  const objs = useLoader(OBJLoader, urls);
  const [hovered, setHover] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  // Clona e ajusta a cor/material dos modelos carregados
  const meshes = useMemo(() => {
    const combined = new THREE.Group();
    objs.forEach((obj: THREE.Object3D) => {
      const clone = obj.clone(true);
      clone.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: hovered || selected ? '#ffffff' : color,
            transparent: true,
            opacity: selected ? 1 : (hovered ? 0.9 : 0.7),
            roughness: 0.5,
            metalness: 0.1,
          });
        }
      });
      combined.add(clone);
    });
    return combined;
  }, [objs, color, hovered, selected]);

  useFrame(() => {
    if (groupRef.current) {
      const targetScale = selected ? scale * 1.05 : hovered ? scale * 1.02 : scale;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
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
      
      {/* Label */}
      {(selected || hovered) && (
        <Html position={[0, 100, 0]} center>
          <div className="px-2 py-1 rounded bg-black/80 text-white text-xs font-bold whitespace-nowrap backdrop-blur-sm border border-white/20">
            {name}
          </div>
        </Html>
      )}
    </group>
  );
}

interface BrainModelProps {
  onSelectPart: (partId: string) => void;
  selectedPartId: string | null;
}

export function BrainModel({ onSelectPart, selectedPartId }: BrainModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state: any) => {
    if (groupRef.current && !selectedPartId) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  // Os modelos do BodyParts3D costumam vir em milímetros e são muito grandes para a câmera padrão.
  // Vamos reduzir a escala global.
  const globalScale = 0.05;
  // Centralizando um pouco o modelo (depende muito das coordenadas originais do BodyParts3D)
  const globalPosition: [number, number, number] = [0, -3, 0];

  return (
    <group ref={groupRef} scale={globalScale} position={globalPosition}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[100, 100, 100]} intensity={1.2} />
      <directionalLight position={[-100, -100, -100]} intensity={0.8} />

      {/* Córtex Pré-Frontal (Lógica, decisão) */}
      <BrainPart
        name="Córtex Pré-Frontal"
        urls={[
          '/models/FJ3801_BP58201_FMA72658_Left inferior frontal gyrus.obj',
          '/models/FJ3802_BP58213_FMA72657_Right inferior frontal gyrus.obj',
          '/models/FJ3839_BP58174_FMA72656_Left middle frontal gyrus.obj',
          '/models/FJ3840_BP58164_FMA72655_Right middle frontal gyrus.obj',
          '/models/FJ3879_BP58158_FMA72654_Left superior frontal gyrus.obj',
          '/models/FJ3880_BP58162_FMA72653_Right superior frontal gyrus.obj'
        ]}
        color="#3b82f6" // blue-500
        selected={selectedPartId === 'prefrontal'}
        onClick={() => onSelectPart('prefrontal')}
      />

      {/* Amígdala (Medo, emoção) */}
      <BrainPart
        name="Amígdala"
        urls={[
          '/models/MM179_BP58076_FMA72833_Left amygdala.obj',
          '/models/MM179M_BP58075_FMA72832_Right amygdala.obj'
        ]}
        color="#ef4444" // red-500
        selected={selectedPartId === 'amygdala'}
        onClick={() => onSelectPart('amygdala')}
      />

      {/* Hipocampo (Memória) */}
      <BrainPart
        name="Hipocampo"
        urls={[
          '/models/MM164_BP58046_FMA72714_Left hippocampus proper.obj',
          '/models/MM164M_BP58047_FMA72713_Right hippocampus proper.obj'
        ]}
        color="#10b981" // emerald-500
        selected={selectedPartId === 'hippocampus'}
        onClick={() => onSelectPart('hippocampus')}
      />
      
      {/* Contexto: Tronco Cerebral e outros elementos neutros apenas para dar forma (se existirem) */}
      {/* Podemos adicionar o Cerebelo ou Medulla para dar contexto visual, se desejado */}
      <BrainPart
        name="Contexto (Ponte e Bulbo)"
        urls={[
          '/models/FJ3828_BP58274_FMA67943_Pons.obj',
          '/models/FJ3823_BP58279_FMA62004_Medulla oblongata.obj'
        ]}
        color="#e5e7eb" // gray-200
        selected={false}
        onClick={() => {}}
      />
    </group>
  );
}
