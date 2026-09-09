import React, { useLayoutEffect, useRef } from 'react';
import { images } from '../../constants';
import { Button, SubHeading, ImageFrame } from '../../components/ui';
import { gsap } from '../../lib/gsap/gsapSetup';
import { useAppReady } from '../../app/AppContext';
import './Header.css';

const Header = () => {
  const { ready, reducedMotion } = useAppReady();
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!ref.current || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.set('.app__header-h1 .line span', { yPercent: 110 });
      gsap.set('.header-intro, .app__header .btn', { autoAlpha: 0, y: 24 });
      gsap.set('.app__header .image-frame__media', { clipPath: 'inset(100% 0 0 0)' });
      gsap.set('.app__header .image-frame__corner', { scale: 0 });
    }, ref);

    return () => ctx.revert();
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (!ready || !ref.current) return undefined;

    if (reducedMotion) {
      gsap.set(
        ref.current.querySelectorAll(
          '.line span, .header-intro, .image-frame__media, .image-frame__corner, .btn'
        ),
        {
          autoAlpha: 1,
          y: 0,
          yPercent: 0,
          scale: 1,
          clipPath: 'none',
        }
      );
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .to('.header-intro', { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08 })
        .to('.app__header-h1 .line span', { yPercent: 0, duration: 1.05, stagger: 0.12 }, '-=0.35')
        .to('.app__header .btn', { y: 0, autoAlpha: 1, duration: 0.55 }, '-=0.55')
        .to(
          '.app__header .image-frame__media',
          { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power4.inOut' },
          '-=1'
        )
        .to(
          '.app__header .image-frame__corner',
          { scale: 1, duration: 0.45, stagger: 0.07 },
          '-=0.45'
        );
    }, ref);

    return () => ctx.revert();
  }, [ready, reducedMotion]);

  return (
    <header className="app__header app__wrapper section__padding" id="home" ref={ref}>
      <div className="app__wrapper_info">
        <div className="header-intro">
          <SubHeading title="Chase the flavour" />
        </div>
        <h1 className="app__header-h1">
          <span className="line">
            <span>The key to</span>
          </span>
          <span className="line">
            <span>fine dining</span>
          </span>
        </h1>
        <p className="p__opensans header-intro app__header-copy" style={{ margin: '2rem 0' }}>
          Precision, patience, and the quiet confidence of a kitchen that never rushes a plate.
        </p>
        <Button href="#menu">Explore Menu</Button>
      </div>
      <div className="app__wrapper_img">
        <ImageFrame src={images.welcome} alt="Seared salmon, the house signature" />
      </div>
    </header>
  );
};

export default Header;
