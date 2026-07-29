import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Fundo 3D ambiente do território "Esquemas Iniciais Desadaptativos": cacos de
// lente/vidro à deriva, cuja cor acompanha (com lerp suave) a cor do personagem
// da cena ativa. Não sabe nada de scroll/GSAP — só recebe `color`.

interface ShardsProps {
  color: string;
  count?: number;
}

function Shards({ color, count = 48 }: ShardsProps) {
  const targetColor = useMemo(() => new THREE.Color(color), [color]);
  const groupRefs = useRef<(THREE.Mesh | null)[]>([]);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: targetColor.clone(),
        transparent: true,
        opacity: 0.18,
        roughness: 0.15,
        metalness: 0.1,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const shards = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = i / count;
      return {
        position: [
          // Deslocado pra esquerda: cacos ficam mais atrás do personagem, menos atrás
          // do texto (coluna direita), preservando a legibilidade do conteúdo.
          (Math.sin(seed * 91.7) * 0.5 + Math.cos(seed * 13.1)) * 8 - 3.5,
          (Math.cos(seed * 57.3) * 0.5 + Math.sin(seed * 31.9)) * 6,
          -4 - (i % 6),
        ] as [number, number, number],
        rotation: [seed * 6.2, seed * 4.1, seed * 2.7] as [number, number, number],
        scale: 0.25 + (i % 5) * 0.12,
        speed: 0.05 + (i % 7) * 0.02,
      };
    });
  }, [count]);

  useFrame((state, delta) => {
    material.color.lerp(targetColor, Math.min(1, delta * 1.5));
    const t = state.clock.elapsedTime;
    groupRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const s = shards[i];
      mesh.rotation.x += s.speed * delta;
      mesh.rotation.y += s.speed * 0.7 * delta;
      mesh.position.y = s.position[1] + Math.sin(t * s.speed + i) * 0.6;
    });
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      {shards.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => {
            groupRefs.current[i] = el;
          }}
          position={s.position}
          rotation={s.rotation}
          scale={s.scale}
          material={material}
        >
          <tetrahedronGeometry args={[1, 0]} />
        </mesh>
      ))}
    </>
  );
}

export default function LensShardsBackground({ color }: { color: string }) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 1.5]}>
        <Shards color={color} />
      </Canvas>
    </div>
  );
}
