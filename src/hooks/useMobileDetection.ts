import { useState, useEffect, useCallback } from 'react';

interface MobileDetectionResult {
  isMobile: boolean;
  isIOSSafari: boolean;
}

const MOBILE_BREAKPOINT = 768;
const RESIZE_DEBOUNCE_MS = 150;

/**
 * Shared hook for mobile device detection.
 * - Detects mobile devices (< 768px breakpoint)
 * - Detects iOS Safari specifically (for WebGL issues)
 * - Listens for resize/orientation changes (debounced)
 * - Defaults to mobile to prevent flash of desktop content
 */
export function useMobileDetection(): MobileDetectionResult {
  const [state, setState] = useState<MobileDetectionResult>({
    isMobile: true, // Default to mobile to prevent flash of desktop content
    isIOSSafari: false,
  });

  const checkDevice = useCallback(() => {
    const isMobileWidth = window.innerWidth < MOBILE_BREAKPOINT;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    setState({
      isMobile: isMobileWidth || (isIOS && isSafari),
      isIOSSafari: isIOS && isSafari,
    });
  }, []);

  useEffect(() => {
    // Initial check
    checkDevice();

    // Debounced resize handler
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkDevice, RESIZE_DEBOUNCE_MS);
    };

    // Listen for resize and orientation changes
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [checkDevice]);

  return state;
}
