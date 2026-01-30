import { useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';
import { useMobileDetection } from '../hooks/useMobileDetection';

export default function ParticleBackground() {
  const [init, setInit] = useState(false);
  const { isMobile } = useMobileDetection();

  useEffect(() => {
    // Disable particles entirely on mobile/iOS to prevent crashes
    if (!isMobile) {
      initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      }).then(() => {
        setInit(true);
      });
    }
  }, [isMobile]);

  const options: ISourceOptions = useMemo(() => ({
    fullScreen: false,
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60,
    particles: {
      color: {
        value: '#00d4ff',
      },
      links: {
        color: '#00d4ff',
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
        direction: 'none',
        random: false,
        straight: false,
        outModes: {
          default: 'bounce',
        },
      },
      number: {
        density: {
          enable: true,
          width: 1920,
          height: 1080,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse',
        },
        resize: {
          enable: false,
        },
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    detectRetina: true,
  }), []);

  // No particles on mobile - just a subtle gradient background
  if (isMobile || !init) {
    return null;
  }

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="absolute inset-0 -z-10"
    />
  );
}
