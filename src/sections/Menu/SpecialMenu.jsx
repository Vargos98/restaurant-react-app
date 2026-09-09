import React, { useLayoutEffect, useRef } from 'react';
import { SubHeading, MenuItem, Button } from '../../components/ui';
import { images, data } from '../../constants';
import { gsap } from '../../lib/gsap/gsapSetup';
import { useReveal } from '../../lib/gsap/useReveal';
import { useAppReady } from '../../app/AppContext';
import './SpecialMenu.css';

const SpecialMenu = () => {
  const ref = useRef(null);
  const { ready, reducedMotion } = useAppReady();
  useReveal(ref, ready);

  useLayoutEffect(() => {
    if (!ready || reducedMotion || !ref.current) return undefined;
    const img = ref.current.querySelector('.app__specialMenu-menu_img img');
    if (!img) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { scale: 1.08 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top 90%',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [ready, reducedMotion]);

  return (
    <section className="app__specialMenu flex__center section__padding" id="menu" ref={ref}>
      <div className="app__specialMenu-title" data-reveal="up">
        <SubHeading title="Menu that fits your palate" />
        <h2 className="headtext__cormorant">Today's Special</h2>
      </div>
      <div className="app__specialMenu-menu">
        <div className="app__specialMenu-menu_wine flex__center" data-reveal="left">
          <p className="app__specialMenu-menu_heading">Wine & Beer</p>
          <div className="app__specialMenu-menu_items" data-reveal-stagger>
            {data.wines.map((wine, index) => (
              <MenuItem key={wine.title + index} title={wine.title} price={wine.price} tags={wine.tags} />
            ))}
          </div>
        </div>
        <div className="app__specialMenu-menu_img">
          <img src={images.menu} alt="House cocktail service" />
        </div>
        <div className="app__specialMenu-menu_cocktails flex__center" data-reveal="right">
          <p className="app__specialMenu-menu_heading">Cocktails</p>
          <div className="app__specialMenu-menu_items" data-reveal-stagger>
            {data.cocktails.map((cocktail, index) => (
              <MenuItem
                key={cocktail.title + index}
                title={cocktail.title}
                price={cocktail.price}
                tags={cocktail.tags}
              />
            ))}
          </div>
        </div>
      </div>
      <div data-reveal="up">
        <Button href="#gallery">View More</Button>
      </div>
    </section>
  );
};

export default SpecialMenu;
