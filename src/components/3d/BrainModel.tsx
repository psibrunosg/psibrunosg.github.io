import { useRef, useState, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { brainPartsData, type BrainPartId, type BrainPartData, type DisorderId } from '@/content/neuroanatomia';

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

function BrainPart({ data, selected, hasSelection, isExploded, onClick, scale = 1 }: BrainPartProps) {
  const objs = useLoader(OBJLoader, data.urls);
  const [hovered, setHover] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  const meshes = useMemo(() => {
    const combined = new THREE.Group();
    
    const objArray = Array.isArray(objs) ? objs : [objs];

    objArray.forEach((obj: any) => {
      if (!obj) return;
      const clone = obj.clone(true);
      clone.traverse((child: any) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: data.color,
            transparent: true,
            opacity: 0.8,
            roughness: 0.5,
            metalness: 0.1,
          });
        }
      });
      combined.add(clone);
    });
    return combined;
  }, [objs, data.color]);

  useFrame(() => {
    if (groupRef.current) {
      const targetScale = selected ? scale * 1.05 : hovered ? scale * 1.02 : scale;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      const targetPos = isExploded && data.explodePosition 
        ? new THREE.Vector3(...data.explodePosition) 
        : new THREE.Vector3(0, 0, 0);
      groupRef.current.position.lerp(targetPos, 0.05);
    }
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

export function BrainModel({ onSelectPart, selectedPartId, stressLevel, isExploded, isMindfulness, activeDisorder, isMedicated }: BrainModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state: any) => {
    if (groupRef.current && !selectedPartId && stressLevel === 0 && !isMindfulness && !activeDisorder && !isMedicated) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const globalScale = 0.05;
  const globalPosition: [number, number, number] = [0, -3, 0];

  const brainParts = Object.values(brainPartsData);

  return (
    <group ref={groupRef} scale={globalScale} position={globalPosition}>
      <ambientLight intensity={1.0} />
      <directionalLight position={[100, 100, 100]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-100, -100, -100]} intensity={1.0} />

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
          quizTarget={null}
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
