import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export const setupGsap = () => {
  if (registered) return gsap;
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });
  registered = true;
  return gsap;
};

setupGsap();

export { gsap, ScrollTrigger };
