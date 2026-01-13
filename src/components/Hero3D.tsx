import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import type { Mesh } from 'three';

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

// Simple CSS fallback for mobile
function MobileFallback() {
  return (
    <div className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
      <div className="relative w-48 h-48">
        {/* Animated gradient circle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00d4ff]/20 to-[#a855f7]/20 animate-pulse" />
        <div className="absolute inset-4 rounded-full border border-[#00d4ff]/30 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="absolute inset-8 rounded-full border border-[#00d4ff]/50 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
        <div className="absolute inset-12 rounded-full bg-[#00d4ff]/10" />
      </div>
    </div>
  );
}

export default function Hero3D() {
  const [isMobile, setIsMobile] = useState(true); // Default to mobile to prevent flash

  useEffect(() => {
    // Check if mobile or iOS Safari (which has WebGL issues)
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      // Disable 3D on mobile OR iOS Safari
      setIsMobile(isMobileDevice || (isIOS && isSafari));
    };

    checkMobile();
  }, []);

  // Show simple fallback on mobile/iOS to prevent crashes
  if (isMobile) {
    return <MobileFallback />;
  }

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
