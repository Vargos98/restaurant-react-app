import { getLenis } from './lenisInstance';

export const scrollToId = (hash) => {
  if (!hash) return;
  const id = hash.startsWith('#') ? hash.slice(1) : hash;
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: -16, duration: 1.35 });
    return;
  }

  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
