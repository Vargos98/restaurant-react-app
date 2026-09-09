import React, { useLayoutEffect, useRef } from 'react';
import { BsInstagram, BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';
import { SubHeading } from '../../components/ui';
import { images } from '../../constants';
import { gsap } from '../../lib/gsap/gsapSetup';
import { useReveal } from '../../lib/gsap/useReveal';
import { useAppReady } from '../../app/AppContext';
import './Gallery.css';

const galleryImages = [images.gallery01, images.gallery02, images.gallery03, images.gallery04];

const Gallery = () => {
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const { ready, reducedMotion } = useAppReady();
  useReveal(sectionRef, ready);

  useLayoutEffect(() => {
    if (!ready || reducedMotion || !sectionRef.current) return undefined;
    const cards = sectionRef.current.querySelectorAll('.app__gallery-images_card');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 24 },
        {
          y: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, reducedMotion]);

  const scroll = (direction) => {
    const current = scrollRef.current;
    if (!current) return;
    const delta = direction === 'left' ? -320 : 320;
    gsap.to(current, {
      scrollLeft: current.scrollLeft + delta,
      duration: 0.75,
      ease: 'power2.out',
    });
  };

  return (
    <section className="app__gallery flex__center" id="gallery" ref={sectionRef}>
      <div className="app__gallery-content" data-reveal="left">
        <SubHeading title="Instagram" />
        <h2 className="headtext__cormorant">Photo Gallery</h2>
        <p className="p__opensans" style={{ color: 'var(--color-grey)', marginTop: '2rem' }}>
          Follow the kitchen after hours — the plating, the fire, the last pour of the evening.
        </p>
      </div>
      <div className="app__gallery-images">
        <div className="app__gallery-images_container" ref={scrollRef}>
          {galleryImages.map((image, index) => (
            <div className="app__gallery-images_card flex__center" key={`gallery_image-${index + 1}`}>
              <img src={image} alt={`Gallery dish ${index + 1}`} />
              <BsInstagram className="gallery__image-icon" />
            </div>
          ))}
        </div>
        <div className="app__gallery-images_arrows">
          <BsArrowLeftShort
            className="gallery__arrow-icon"
            onClick={() => scroll('left')}
            aria-label="Previous images"
          />
          <BsArrowRightShort
            className="gallery__arrow-icon"
            onClick={() => scroll('right')}
            aria-label="Next images"
          />
        </div>
      </div>
    </section>
  );
};

export default Gallery;
