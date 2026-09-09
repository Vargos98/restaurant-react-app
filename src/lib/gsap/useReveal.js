import { useLayoutEffect } from 'react';
import { gsap } from './gsapSetup';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const fromVars = (type) => {
  if (type === 'left') return { x: -48, autoAlpha: 0 };
  if (type === 'right') return { x: 48, autoAlpha: 0 };
  if (type === 'scale') return { scale: 1.12, autoAlpha: 0 };
  if (type === 'clip') return { clipPath: 'inset(100% 0% 0% 0%)' };
  return { y: 36, autoAlpha: 0 };
};

const toVars = (type) => {
  if (type === 'clip') {
    return { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'power4.out' };
  }
  return { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 1.05, ease: 'power3.out' };
};

export const useReveal = (ref, enabled = true) => {
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = ref?.current;
    if (!root || !enabled) return undefined;

    if (reduced) {
      gsap.set(root.querySelectorAll('[data-reveal], [data-reveal-item]'), {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        clipPath: 'none',
      });
      return undefined;
    }

    const ctx = gsap.context(() => {
      root.querySelectorAll('[data-reveal]').forEach((item) => {
        const type = item.getAttribute('data-reveal') || 'up';
        gsap.fromTo(item, fromVars(type), {
          ...toVars(type),
          scrollTrigger: {
            trigger: item,
            start: 'top 86%',
            once: true,
          },
        });
      });

      root.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
        const items = group.querySelectorAll('[data-reveal-item]');
        if (!items.length) return;
        gsap.fromTo(
          items,
          { y: 28, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: group,
              start: 'top 82%',
              once: true,
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, [ref, enabled, reduced]);
};
