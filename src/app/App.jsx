import React, { useCallback, useEffect, useState } from 'react';
import { Navbar, Footer, Preloader } from '../components/layout';
import {
  AboutUs,
  Chef,
  FindUs,
  Gallery,
  Header,
  Intro,
  Laurels,
  SpecialMenu,
} from '../sections';
import { AppReadyProvider } from './AppContext';
import { useLenis } from '../lib/gsap/useLenis';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { ScrollTrigger } from '../lib/gsap/gsapSetup';

const App = () => {
  const reducedMotion = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);

  const onPreloaderComplete = useCallback(() => {
    setReady(true);
  }, []);

  useLenis(ready && !reducedMotion);

  useEffect(() => {
    document.documentElement.classList.toggle('is-preloading', !ready);
    if (ready) {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, [ready]);

  return (
    <AppReadyProvider value={{ ready, reducedMotion }}>
      <Preloader onComplete={onPreloaderComplete} reducedMotion={reducedMotion} />
      <div className={`app ${ready ? 'is-ready' : ''}`}>
        <Navbar />
        <Header />
        <AboutUs />
        <SpecialMenu />
        <Chef />
        <Intro />
        <Laurels />
        <Gallery />
        <FindUs />
        <Footer />
      </div>
    </AppReadyProvider>
  );
};

export default App;
