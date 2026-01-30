import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import type { Mesh } from 'three';
import { useMobileDetection } from '../hooks/useMobileDetection';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';

function RotatingIcosahedron() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
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

// Simple CSS fallback for mobile - static glow to reduce CPU load
function MobileFallback() {
  return (
    <div className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
      <div className="relative w-48 h-48">
        {/* Simple static glow - no spinning animations */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00d4ff]/30 to-[#a855f7]/20 blur-xl" />
        <div className="absolute inset-4 rounded-full border border-[#00d4ff]/40" />
        <div className="absolute inset-8 rounded-full border border-[#00d4ff]/30" />
        <div className="absolute inset-12 rounded-full bg-[#00d4ff]/10" />
      </div>
    </div>
  );
}

export default function Hero3D() {
  const { isMobile, isIOSSafari } = useMobileDetection();

  // Hide completely on mobile - it doesn't add value and takes up space
  if (isMobile || isIOSSafari) {
    return null;
  }

  return (
    <div className="w-64 h-64 md:w-80 md:h-80">
      <WebGLErrorBoundary fallback={<MobileFallback />}>
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <RotatingIcosahedron />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
