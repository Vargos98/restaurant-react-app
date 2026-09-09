import React, { useRef } from 'react';
import { SubHeading, ImageFrame } from '../../components/ui';
import { images, data } from '../../constants';
import { useReveal } from '../../lib/gsap/useReveal';
import { useAppReady } from '../../app/AppContext';
import './Laurels.css';

const AwardCard = ({ award: { imgUrl, title, subtitle } }) => (
  <div className="app__laurels_awards-card" data-reveal-item>
    <img src={imgUrl} alt="" />
    <div className="app__laurels_awards-card_content">
      <p className="p__cormorant" style={{ color: 'var(--color-golden)' }}>
        {title}
      </p>
      <p className="p__opensans" style={{ color: 'var(--color-grey)' }}>
        {subtitle}
      </p>
    </div>
  </div>
);

const Laurels = () => {
  const ref = useRef(null);
  const { ready } = useAppReady();
  useReveal(ref, ready);

  return (
    <section className="app__laurels app__bg app__wrapper section__padding" id="awards" ref={ref}>
      <div className="app__wrapper_info" data-reveal="left">
        <SubHeading title="Awards & recognition" />
        <h2 className="headtext__cormorant">Our Laurels</h2>
        <div className="app__laurels_awards" data-reveal-stagger>
          {data.awards.map((award) => (
            <AwardCard award={award} key={award.title} />
          ))}
        </div>
      </div>
      <div className="app__wrapper_img" data-reveal="up">
        <ImageFrame src={images.laurels} alt="House pasta tossed tableside" />
      </div>
    </section>
  );
};

export default Laurels;
