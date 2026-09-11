import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdOutlineRestaurantMenu } from 'react-icons/md';
import images from '../../../constants/images';
import { Button } from '../../ui';
import { gsap } from '../../../lib/gsap/gsapSetup';
import { getLenis, onLenisReady } from '../../../lib/gsap/lenisInstance';
import { scrollToId } from '../../../lib/gsap/scrollTo';
import { useAppReady } from '../../../app/AppContext';
import './Navbar.css';

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'Awards', href: '#awards' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const { ready, reducedMotion } = useAppReady();
  const [toggleMenu, setToggleMenu] = useState(false);
  const navRef = useRef(null);
  const overlayRef = useRef(null);

  const menuOpenRef = useRef(toggleMenu);
  menuOpenRef.current = toggleMenu;

  useLayoutEffect(() => {
    if (!navRef.current || reducedMotion) return undefined;
    gsap.set(navRef.current, { autoAlpha: 0 });
    return undefined;
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (!ready || !navRef.current) return undefined;
    gsap.to(navRef.current, {
      autoAlpha: 1,
      duration: reducedMotion ? 0 : 0.8,
      ease: 'power3.out',
    });
    return undefined;
  }, [ready, reducedMotion]);

  const goTo = (href) => {
    setToggleMenu(false);
    getLenis()?.start();
    scrollToId(href);
  };

  useEffect(() => {
    if (!ready) return undefined;

    const nav = navRef.current;
    if (!nav) return undefined;

    let hidden = false;
    let lastY = 0;
    let accumulated = 0;
    const THRESHOLD = 16;
    const TOP = 96;

    const setHidden = (next) => {
      if (hidden === next) return;
      hidden = next;
      gsap.to(nav, {
        yPercent: next ? -110 : 0,
        duration: 0.4,
        ease: 'power3.out',
        overwrite: true,
      });
    };

    const onScroll = (source) => {
      if (menuOpenRef.current) return;
      const y = typeof source?.scroll === 'number' ? source.scroll : window.scrollY;
      const delta = y - lastY;
      lastY = y;

      if (y <= TOP) {
        accumulated = 0;
        setHidden(false);
        return;
      }

      if (Math.abs(delta) < 1) return;

      accumulated += delta;
      if (accumulated > THRESHOLD) {
        accumulated = 0;
        setHidden(true);
      } else if (accumulated < -THRESHOLD) {
        accumulated = 0;
        setHidden(false);
      }
    };

    const unbindReady = onLenisReady((lenis) => {
      if (!lenis) return;
      window.removeEventListener('scroll', onScroll);
      lenis.on('scroll', onScroll);
    });

    if (!getLenis()) {
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    return () => {
      unbindReady();
      getLenis()?.off('scroll', onScroll);
      window.removeEventListener('scroll', onScroll);
    };
  }, [ready]);

  useLayoutEffect(() => {
    if (!toggleMenu || !overlayRef.current) return undefined;
    getLenis()?.stop();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 0.65, ease: 'power3.inOut' }
      );
      gsap.from('.app__navbar-smallscreen_links li', {
        y: 28,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 0.55,
        delay: 0.18,
        ease: 'power3.out',
      });
    }, overlayRef);
    return () => ctx.revert();
  }, [toggleMenu]);

  useEffect(() => {
    if (!toggleMenu) getLenis()?.start();
  }, [toggleMenu]);

  return (
    <nav className="app__navbar" ref={navRef}>
      <a className="app__navbar-logo" href="#home" onClick={(e) => { e.preventDefault(); goTo('#home'); }}>
        <img src={images.Logo2} alt="Fiesta La Blanc" />
      </a>
      <ul className="app__navbar-links">
        {LINKS.map((link) => (
          <li key={link.href}>
            <a
              className="p__opensans"
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                goTo(link.href);
              }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="app__navbar-login">
        <Button href="#reserve" variant="ghost" className="btn--nav">
          Book Table
        </Button>
      </div>
      <div className="app_navbar-smallscreen">
        <GiHamburgerMenu
          color="#fff"
          fontSize={27}
          aria-label="Open menu"
          onClick={() => setToggleMenu(true)}
        />
        {toggleMenu && (
          <div className="app__navbar-smallscreen_overlay flex__center" ref={overlayRef}>
            <MdOutlineRestaurantMenu
              fontSize={27}
              className="overlay__close"
              aria-label="Close menu"
              onClick={() => setToggleMenu(false)}
            />
            <ul className="app__navbar-smallscreen_links">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(link.href);
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#reserve"
                  onClick={(e) => {
                    e.preventDefault();
                    goTo('#reserve');
                  }}
                >
                  Book Table
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
