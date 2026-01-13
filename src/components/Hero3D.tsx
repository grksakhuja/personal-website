import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import type { Mesh } from 'three';

function RotatingIcosahedron() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      // Subtle float animation
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <Icosahedron ref={meshRef} args={[1.5, 1]}>
      <MeshDistortMaterial
        color="#00d4ff"
        wireframe
        distort={0.2}
        speed={2}
        transparent
        opacity={0.8}
      />
    </Icosahedron>
  );
}

export default function Hero3D() {
  return (
    <div className="w-64 h-64 md:w-80 md:h-80">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <RotatingIcosahedron />
      </Canvas>
    </div>
  );
}
