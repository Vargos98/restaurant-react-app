import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsapSetup';
import { setLenis } from './lenisInstance';

export const useLenis = (enabled) => {
  useEffect(() => {
    if (!enabled) return undefined;

    const lenis = new Lenis({
      lerp: 0.075,
      duration: 1.2,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      autoRaf: false,
      anchors: false,
    });

    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);

    const ticker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(refresh);
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      cancelAnimationFrame(raf);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      setLenis(null);
    };
  }, [enabled]);
};
