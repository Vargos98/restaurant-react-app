import React, { useRef } from 'react';
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';
import { images } from '../../../constants';
import { useReveal } from '../../../lib/gsap/useReveal';
import { useAppReady } from '../../../app/AppContext';
import FooterOverlay from './FooterOverlay';
import Newsletter from './Newsletter';
import './Footer.css';

const Footer = () => {
  const ref = useRef(null);
  const { ready } = useAppReady();
  useReveal(ref, ready);

  return (
    <footer className="app__footer section__padding" ref={ref}>
      <FooterOverlay />
      <Newsletter />
      <div className="app__footer-links" data-reveal="up">
        <div className="app__footer-links_contact">
          <h2 className="app__footer-headtext">Contact Us</h2>
          <p className="p__opensans">9 W 53rd St, New York, NY 10019, USA</p>
          <p className="p__opensans">+1 212-344-1230</p>
          <p className="p__opensans">+1 212-555-1230</p>
        </div>
        <div className="app__footer-links_logo">
          <img src={images.logo} alt="Fiesta La Blanc" />
          <p className="p__opensans">
            &quot;The best way to find yourself is to lose yourself in the service of others.&quot;
          </p>
          <img src={images.spoon} className="spoon__img" style={{ margin: '15px auto 0' }} alt="" />
          <div className="app__footer-links_icons">
            <FiFacebook aria-label="Facebook" />
            <FiTwitter aria-label="Twitter" />
            <FiInstagram aria-label="Instagram" />
          </div>
        </div>
        <div className="app__footer-links_work">
          <h2 className="app__footer-headtext">Working Hours</h2>
          <p className="p__opensans">Monday–Friday</p>
          <p className="p__opensans">08:00 am – 12:00 am</p>
          <p className="p__opensans">Saturday–Sunday</p>
          <p className="p__opensans">07:00 am – 11:00 pm</p>
        </div>
      </div>
      <div className="footer__copyright">
        <p className="p__opensans">2026 Fiesta La Blanc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
