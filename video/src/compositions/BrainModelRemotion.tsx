import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { useCurrentFrame, staticFile } from 'remotion';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const atlasCenter: [number, number, number] = [0, -79.82, 1556.34];

interface VideoBrainPart {
  id: string;
  color: string;
  explodePosition: readonly [number, number, number];
  urls: string[];
}

const brainPartsData = {
  prefrontal: {
    id: 'prefrontal',
    color: "#3b82f6",
    explodePosition: [0, 40, 120], // move to front and slightly up
    urls: [
      staticFile('models/FJ3801_BP58201_FMA72658_Left inferior frontal gyrus.obj'),
      staticFile('models/FJ3802_BP58213_FMA72657_Right inferior frontal gyrus.obj'),
      staticFile('models/FJ3839_BP58174_FMA72656_Left middle frontal gyrus.obj'),
      staticFile('models/FJ3840_BP58164_FMA72655_Right middle frontal gyrus.obj'),
      staticFile('models/FJ3879_BP58158_FMA72654_Left superior frontal gyrus.obj'),
      staticFile('models/FJ3880_BP58162_FMA72653_Right superior frontal gyrus.obj')
    ]
  },
  amygdala: {
    id: 'amygdala',
    color: "#ef4444",
    explodePosition: [0, -20, 150], // move far to front (it's small)
    urls: [
      staticFile('models/MM179_BP58076_FMA72833_Left amygdala.obj'),
      staticFile('models/MM179M_BP58075_FMA72832_Right amygdala.obj')
    ]
  },
  brainstem: {
    id: 'brainstem',
    color: "#e5e7eb",
    explodePosition: [0, -50, 100], // move to front and down
    urls: [
      staticFile('models/FJ3865_BP58281_FMA61993_Midbrain.obj'),
      staticFile('models/FJ3824_BP58281_FMA61993_Midbrain.obj'),
      staticFile('models/FJ3828_BP58274_FMA67943_Pons.obj'),
      staticFile('models/FJ3869_BP58274_FMA67943_Pons.obj'),
      staticFile('models/FJ3823_BP58279_FMA62004_Medulla oblongata.obj'),
      staticFile('models/FJ3877_BP58279_FMA62004_Medulla oblongata.obj')
    ]
  }
} satisfies Record<string, VideoBrainPart>;

function BrainPart({ data, activePart }: { data: VideoBrainPart, activePart: string }) {
  const objs = useLoader(OBJLoader, data.urls);
  const groupRef = useRef<THREE.Group>(null);
  const scratch = useMemo(() => ({
    color: new THREE.Color(),
    position: new THREE.Vector3(),
    scale: new THREE.Vector3(),
  }), []);

  const geometry = useMemo(() => {
    const combined = new THREE.Group();
    const materials: THREE.MeshStandardMaterial[] = [];

    const objArray = Array.isArray(objs) ? objs : [objs];

    objArray.forEach((obj) => {
      if (!obj) return;
      const clone = obj.clone(true);
      clone.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const material = new THREE.MeshStandardMaterial({
            color: data.color,
            emissive: data.color,
            emissiveIntensity: 0,
            transparent: true,
            opacity: 0.9,
            roughness: 0.2,
            metalness: 0.8,
          });
          child.material = material;
          materials.push(material);
        }
      });
      combined.add(clone);
    });
    return { group: combined, materials };
  }, [objs, data.color]);

  useEffect(
    () => () => geometry.materials.forEach((material) => material.dispose()),
    [geometry.materials],
  );

  const frame = useCurrentFrame();

  useFrame(() => {
    // Animação de Posição (Explode para a frente se estiver isolado)
    if (groupRef.current) {
      if (activePart === data.id) {
        // Vem para a frente
        scratch.position.set(...data.explodePosition);
        // Escala um pouco
        groupRef.current.scale.lerp(scratch.scale.set(1.3, 1.3, 1.3), 0.05);
      } else {
        // Volta pro cérebro
        scratch.position.set(0, 0, 0);
        groupRef.current.scale.lerp(scratch.scale.set(1, 1, 1), 0.05);
      }
      groupRef.current.position.lerp(scratch.position, 0.06);
    }

    // Animação de Opacidade e Cores
    geometry.materials.forEach((mat) => {
      let targetOpacity = 0.0; // Some completamente por padrão
      let targetEmissive = 0.0;
      const targetColor = scratch.color.set(data.color);

      if (activePart === 'all') {
        targetOpacity = 0.8;
        targetEmissive = 0.5;
      } else if (activePart === data.id) {
        // Unidade Específica veio pra frente
        targetOpacity = 1.0;
        targetEmissive = 2.0;

        if (data.id === 'amygdala' || data.id === 'brainstem') {
           const pulse = Math.sin(frame * 0.15) * 0.5 + 0.5;
           targetEmissive = 1.0 + pulse * 3.0;
        }
      } else if (activePart === 'conflict') {
         // Conflito: O cérebro inteiro aparece, mas amígdala domina
         if (data.id === 'amygdala') {
            targetOpacity = 1.0;
            targetEmissive = 5.0;
            targetColor.set('#ff0000');
         } else if (data.id === 'prefrontal') {
            targetOpacity = 0.2;
            targetEmissive = 0.0;
            targetColor.set('#1e293b');
         } else {
            targetOpacity = 0.1;
         }
      }

      // Aplica suavemente as transições
      mat.opacity += (targetOpacity - mat.opacity) * 0.08;
      mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * 0.08;
      mat.color.lerp(targetColor, 0.08);
      mat.emissive.lerp(targetColor, 0.08);
    });
  });

  return (
    <group ref={groupRef}>
      <primitive object={geometry.group} />
    </group>
  );
}

export function BrainModelRemotion({ activePart }: { activePart: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const frame = useCurrentFrame();

  useFrame(() => {
    if (groupRef.current) {
       // Quando mostra "todos", o cérebro gira majestosamente
       // Quando foca em um, o cérebro alinha de frente para destacar a peça saindo
       const targetRotationY = (activePart === 'all' || activePart === 'conflict')
          ? (frame * 0.005)
          : 0;

       // Rotação cinemática suave
       groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
       groupRef.current.rotation.x += (0 - groupRef.current.rotation.x) * 0.05;
    }
  });

  const brainParts = Object.values(brainPartsData);

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[100, 100, 100]} intensity={2.0} color="#ffffff" />
      <directionalLight position={[-100, -100, -100]} intensity={1.5} color="#475569" />

      {/* Post Processing Cinematic Glow */}
      <EffectComposer>
        <Bloom luminanceThreshold={1.0} luminanceSmoothing={0.9} height={300} opacity={1.5} />
      </EffectComposer>

      {/* Como o OBJ é carregado de forma assíncrona, precisamos do Suspense no react-three-fiber */}
      <React.Suspense fallback={null}>
        <group ref={groupRef}>
          <group scale={0.08}>
            <group position={[-atlasCenter[0], -atlasCenter[1], -atlasCenter[2]]}>
              {brainParts.map((part) => (
                <BrainPart
                  key={part.id}
                  data={part}
                  activePart={activePart}
                />
              ))}
            </group>
          </group>
        </group>
      </React.Suspense>
    </>
  );
}
