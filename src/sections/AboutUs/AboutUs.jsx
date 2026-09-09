import React, { useLayoutEffect, useRef } from 'react';
import { images } from '../../constants';
import { Button } from '../../components/ui';
import { gsap } from '../../lib/gsap/gsapSetup';
import { useReveal } from '../../lib/gsap/useReveal';
import { useAppReady } from '../../app/AppContext';
import './AboutUs.css';

const AboutUs = () => {
  const ref = useRef(null);
  const { ready, reducedMotion } = useAppReady();
  useReveal(ref, ready);

  useLayoutEffect(() => {
    if (!ready || reducedMotion || !ref.current) return undefined;
    const knife = ref.current.querySelector('.app__aboutus-content_knife img');
    if (!knife) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        knife,
        { y: -40 },
        {
          y: 40,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [ready, reducedMotion]);

  return (
    <section className="app__aboutus app__bg flex__center section__padding" id="about" ref={ref}>
      <div className="app__aboutus-overlay flex__center">
        <img src={images.V} alt="" />
      </div>
      <div className="app__aboutus-content flex__center">
        <div className="app__aboutus-content_about" data-reveal="left">
          <h2 className="headtext__cormorant">About Us</h2>
          <img src={images.spoon} alt="" className="spoon__img" />
          <p className="p__opensans">
            Fiesta La Blanc is a house of seasonal tasting menus, where every course is composed like a small ceremony — fire, time, and the people at the table.
          </p>
          <Button href="#chef">Know More</Button>
        </div>
        <div className="app__aboutus-content_knife flex__center">
          <img src={images.knife} alt="Ceremonial carving knife" />
        </div>
        <div className="app__aboutus-content_history" data-reveal="right">
          <h2 className="headtext__cormorant">Our History</h2>
          <img src={images.spoon} alt="" className="spoon__img" />
          <p className="p__opensans">
            What began as a private supper club is now a dining room built around harvest and hospitality — still intimate, still unhurried.
          </p>
          <Button href="#awards">Know More</Button>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
