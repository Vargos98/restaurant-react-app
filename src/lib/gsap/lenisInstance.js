let lenis = null;
const listeners = new Set();

export const setLenis = (instance) => {
  lenis = instance;
  if (instance) listeners.forEach((fn) => fn(instance));
};

export const getLenis = () => lenis;

export const onLenisReady = (fn) => {
  if (lenis) fn(lenis);
  listeners.add(fn);
  return () => listeners.delete(fn);
};
