import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, Html } from '@react-three/drei';
import * as THREE from 'three';

interface BrainPartProps {
  position: [number, number, number];
  color: string;
  name: string;
  selected: boolean;
  onClick: () => void;
  isBox?: boolean;
}

function BrainPart({ position, color, name, selected, onClick, isBox }: BrainPartProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      if (!selected) {
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        meshRef.current.rotation.y += 0.005;
      } else {
        meshRef.current.rotation.y += 0.01;
      }
    }
  });

  const scale = selected ? 1.2 : hovered ? 1.1 : 1;
  const opacity = selected ? 1 : 0.7;

  return (
    <group position={position}>
      {isBox ? (
        <Box
          ref={meshRef}
          args={[1.5, 1.5, 1.5]}
          scale={scale}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHover(false);
            document.body.style.cursor = 'auto';
          }}
        >
          <meshStandardMaterial color={hovered ? '#ffffff' : color} transparent opacity={opacity} />
        </Box>
      ) : (
        <Sphere
          ref={meshRef}
          args={[1, 32, 32]}
          scale={scale}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHover(false);
            document.body.style.cursor = 'auto';
          }}
        >
          <meshStandardMaterial color={hovered ? '#ffffff' : color} transparent opacity={opacity} />
        </Sphere>
      )}
      
      {/* Label */}
      {(selected || hovered) && (
        <Html position={[0, 1.5, 0]} center>
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
  // Placeholder para as partes do cérebro. 
  // No futuro, isso pode ser substituído por importações reais de modelos OBJ/GLTF do BodyParts3D.
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && !selectedPartId) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Córtex Pré-Frontal (Lógica, decisão) */}
      <BrainPart
        name="Córtex Pré-Frontal"
        position={[0, 1, 1.5]}
        color="#3b82f6" // blue-500
        selected={selectedPartId === 'prefrontal'}
        onClick={() => onSelectPart('prefrontal')}
      />

      {/* Amígdala (Medo, emoção) */}
      <BrainPart
        name="Amígdala"
        position={[-1, -0.5, 0]}
        color="#ef4444" // red-500
        selected={selectedPartId === 'amygdala'}
        onClick={() => onSelectPart('amygdala')}
      />
      <BrainPart
        name="Amígdala"
        position={[1, -0.5, 0]}
        color="#ef4444" 
        selected={selectedPartId === 'amygdala'}
        onClick={() => onSelectPart('amygdala')}
      />

      {/* Hipocampo (Memória) */}
      <BrainPart
        name="Hipocampo"
        position={[0, -0.2, -1]}
        color="#10b981" // emerald-500
        isBox
        selected={selectedPartId === 'hippocampus'}
        onClick={() => onSelectPart('hippocampus')}
      />
    </group>
  );
}
