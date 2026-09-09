import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { images } from '../../../constants';
import { gsap } from '../../../lib/gsap/gsapSetup';
import { usePreloadAssets } from '../../../hooks/usePreloadAssets';
import './Preloader.css';

const PRELOAD = [
  images.Logo2,
  images.welcome,
  images.chef,
  images.menu,
  images.knife,
  images.laurels,
];

const Preloader = ({ onComplete, reducedMotion }) => {
  const rootRef = useRef(null);
  const countRef = useRef(null);
  const countValue = useRef({ value: 0 });
  const completed = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const [gone, setGone] = useState(false);
  const { done } = usePreloadAssets(PRELOAD, 3000);

  onCompleteRef.current = onComplete;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    if (reducedMotion) {
      gsap.set('.preloader__logo', { autoAlpha: 1, scale: 1 });
      gsap.set('.preloader__line span', { scaleX: 1 });
      if (countRef.current) countRef.current.textContent = '100';
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(
          '.preloader__kicker',
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        )
        .to(
          '.preloader__logo',
          { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'power2.out' },
          0.1
        )
        .to(
          '.preloader__line span',
          { scaleX: 1, duration: 1.45, ease: 'power2.inOut' },
          0.25
        )
        .to(
          countValue.current,
          {
            value: 92,
            duration: 1.65,
            ease: 'power1.out',
            onUpdate: () => {
              if (countRef.current) {
                countRef.current.textContent = String(
                  Math.round(countValue.current.value)
                ).padStart(2, '0');
              }
            },
          },
          0.2
        );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (!done || completed.current) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    completed.current = true;

    if (reducedMotion) {
      onCompleteRef.current();
      setGone(true);
      return undefined;
    }

    gsap.context(() => {
      const tl = gsap.timeline();
      tl.to(countValue.current, {
        value: 100,
        duration: 0.35,
        ease: 'power1.out',
        onUpdate: () => {
          if (countRef.current) {
            countRef.current.textContent = String(
              Math.round(countValue.current.value)
            ).padStart(2, '0');
          }
        },
      })
        .add(() => onCompleteRef.current())
        .to(
          root,
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 1.05,
            ease: 'power4.inOut',
          },
          '+=0.12'
        )
        .add(() => setGone(true));
    }, root);

    return undefined;
  }, [done, reducedMotion]);

  if (gone) return null;

  return (
    <div className="preloader" ref={rootRef} aria-hidden="true">
      <div className="preloader__inner">
        <p className="preloader__kicker">Fine dining</p>
        <img className="preloader__logo" src={images.Logo2} alt="Fiesta La Blanc" />
        <div className="preloader__line">
          <span />
        </div>
        <span className="preloader__count" ref={countRef}>
          00
        </span>
      </div>
    </div>
  );
};

export default Preloader;
