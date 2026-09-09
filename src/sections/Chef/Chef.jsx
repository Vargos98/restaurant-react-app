import React, { useRef } from 'react';
import { SubHeading, ImageFrame } from '../../components/ui';
import { images } from '../../constants';
import { useReveal } from '../../lib/gsap/useReveal';
import { useAppReady } from '../../app/AppContext';
import './Chef.css';

const Chef = () => {
  const ref = useRef(null);
  const { ready } = useAppReady();
  useReveal(ref, ready);

  return (
    <section className="app__chef app__bg app__wrapper section__padding" id="chef" ref={ref}>
      <div className="app__wrapper_img app__wrapper_img-reverse" data-reveal="up">
        <ImageFrame src={images.chef} alt="Chef El Galiardo" />
      </div>
      <div className="app__wrapper_info" data-reveal="right">
        <SubHeading title="Chef's word" />
        <h2 className="headtext__cormorant">What we believe in</h2>
        <div className="app__chef-content">
          <div className="app__chef-content_quote">
            <img src={images.quote} alt="" />
            <p className="p__opensans">
              Cooking is not performance. It is attention — to heat, to harvest, to the guest who waited for this hour.
            </p>
          </div>
          <p className="p__opensans" style={{ marginTop: '1.25rem', color: 'var(--color-grey)' }}>
            We plate what the season allows and nothing more. The dining room is a pause in the city: linen, candlelight, and a kitchen that still tastes every sauce twice.
          </p>
        </div>
        <div className="app__chef-sign">
          <p>El Galiardo</p>
          <p className="p__opensans">Chef & Founder</p>
          <img src={images.sign} alt="Signature of Chef El Galiardo" />
        </div>
      </div>
    </section>
  );
};

export default Chef;
