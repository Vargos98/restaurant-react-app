import React, { useLayoutEffect, useRef, useState } from 'react';
import { BsFillPlayFill, BsPauseFill } from 'react-icons/bs';
import { meal } from '../../constants';
import { gsap } from '../../lib/gsap/gsapSetup';
import { useAppReady } from '../../app/AppContext';
import './Intro.css';

const Intro = () => {
  const { ready, reducedMotion } = useAppReady();
  const [playVideo, setPlayVideo] = useState(false);
  const vidRef = useRef(null);
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (!ready || reducedMotion || !sectionRef.current) return undefined;
    const overlay = sectionRef.current.querySelector('.app__video-overlay');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlay,
        { backgroundColor: 'rgba(0,0,0,0.72)' },
        {
          backgroundColor: 'rgba(0,0,0,0.42)',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 0.6,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, reducedMotion]);

  const toggle = () => {
    const video = vidRef.current;
    if (!video) return;
    if (playVideo) video.pause();
    else video.play();
    setPlayVideo(!playVideo);
  };

  return (
    <section className="app__video" ref={sectionRef}>
      <video ref={vidRef} src={meal} loop muted playsInline />
      <div className="app__video-overlay flex__center">
        <button
          type="button"
          className="app__video-overlay_circle flex__center"
          onClick={toggle}
          aria-label={playVideo ? 'Pause film' : 'Play film'}
        >
          {playVideo ? (
            <BsPauseFill color="#fff" fontSize={30} />
          ) : (
            <BsFillPlayFill color="#fff" fontSize={30} />
          )}
        </button>
      </div>
    </section>
  );
};

export default Intro;
