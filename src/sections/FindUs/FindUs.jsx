import React, { useRef } from 'react';
import { SubHeading, Button, ImageFrame } from '../../components/ui';
import { images } from '../../constants';
import { useReveal } from '../../lib/gsap/useReveal';
import { useAppReady } from '../../app/AppContext';
import ReservationForm from './ReservationForm';
import './FindUs.css';

const FindUs = () => {
  const ref = useRef(null);
  const { ready } = useAppReady();
  useReveal(ref, ready);

  return (
    <section className="app__findus app__bg section__padding" id="contact" ref={ref}>
      <div className="app__wrapper">
        <div className="app__wrapper_info" data-reveal="left">
          <SubHeading title="Contact" />
          <h2 className="headtext__cormorant" style={{ marginBottom: '3rem' }}>
            Find Us
          </h2>
          <div className="app__wrapper-content">
            <p className="p__opensans">Lane Ends Bungalow, Whatcroft Hall Lane, Rudheath, CW9 7SG</p>
            <p className="p__cormorant" style={{ color: 'var(--color-golden)', margin: '2rem 0' }}>
              Opening Hours
            </p>
            <p className="p__opensans">Mon – Fri: 10:00 am – 02:00 am</p>
            <p className="p__opensans">Sat – Sun: 10:00 am – 03:00 am</p>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <Button>Visit Us</Button>
          </div>
        </div>
        <div className="app__wrapper_img" data-reveal="up">
          <ImageFrame src={images.findus} alt="The dining room at Fiesta La Blanc" />
        </div>
      </div>
      <ReservationForm />
    </section>
  );
};

export default FindUs;
