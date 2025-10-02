import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import bannerImage from '../../../assets/banner2.jpg';

const LINES = [
  'IITG Indian Jobs Welcomes You',
  'Attration Control Guaranteed',
  'End to End Hiring Support Under very Special Model - PPM',
];

const DURATION = 0.6; // in/out duration
const PAUSE = 2.2; // visible time per line
const EASE = 'power2.inOut';
const START_X = '100%';
const END_X = '-100%';

const HeroBanner = () => {
  const containerRef = useRef(null);
  const bgLayerRef = useRef(null);
  const spotlightRef = useRef(null);
  const lineRefs = useRef([]);

  const ctaSecondaryRef = useRef(null);

  useEffect(() => {
    // Intro fade for CTAs only
    const tlIntro = gsap.timeline({ defaults: { ease: 'power2.out' } });
   


    // Rotating headline loop
    const tlLoop = gsap.timeline({ repeat: -1, defaults: { duration: DURATION, ease: EASE } });
    // Prepare all lines
    gsap.set(lineRefs.current, { x: START_X, opacity: 0, display: 'none' });

    LINES.forEach((_, i) => {
      const el = lineRefs.current[i];
      // Ensure only one line is visible at a time
      tlLoop.set(lineRefs.current, { display: 'none', opacity: 0 });
      tlLoop.set(el, { x: START_X, display: 'block' });
      tlLoop.to(el, { x: '0%', opacity: 1 });
      tlLoop.to(el, {}, `+=${PAUSE}`);
      tlLoop.to(el, { x: END_X, opacity: 0 });
      tlLoop.set(el, { x: START_X, display: 'none' });
    });

    // Ken Burns subtle background zoom
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let tlKen;
    if (!reduceMotion && bgLayerRef.current) {
      tlKen = gsap.to(bgLayerRef.current, {
        scale: 1.12,
        duration: 16,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    // Parallax spotlight on scroll
    const onScroll = () => {
      if (!spotlightRef.current) return;
      const y = window.scrollY * 0.06;
      spotlightRef.current.style.transform = `translateY(${y}px)`;
    };
    if (!reduceMotion) {
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    return () => {
      tlIntro.kill();
      tlLoop.kill();
      if (tlKen) tlKen.kill();
      if (!reduceMotion) window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-[100vw] ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] min-h-[100svh] flex items-center justify-center overflow-hidden"
      style={{}}
    >
      {/* Background image layer for Ken Burns effect */}
      <div
        ref={bgLayerRef}
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transformOrigin: 'center',
          willChange: 'transform',
        }}
      />
      {/* Base dark overlay */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.58) 45%, rgba(0,0,0,0.42) 100%)',
        }}
      />
      {/* Subtle spotlight behind text */}
      <div
        ref={spotlightRef}
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60rem 30rem at 50% 40%, rgba(99,102,241,0.14), transparent 60%)',
          willChange: 'transform',
          transform: 'translateY(0px)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl px-4 md:px-6 text-center text-white">
        <div
          role="heading"
          aria-level={1}
          className="mx-auto relative max-w-5xl text-balance"
          style={{ height: 'clamp(56px, 14vh, 160px)' }}
        >
          {LINES.map((text, idx) => (
            <h1
              key={idx}
              ref={(el) => (lineRefs.current[idx] = el)}
              className="font-extrabold tracking-tight"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                margin: 0,
                whiteSpace: 'nowrap',
                fontSize: 'clamp(1.4rem, 4.5vw, 3rem)',
                lineHeight: 1.12,
                letterSpacing: '0.2px',
                textShadow: '0 2px 14px rgba(0,0,0,0.65)',
                backgroundImage: 'linear-gradient(90deg, #ffffff 0%, #dbeafe 40%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                willChange: 'transform, opacity',
                display: 'none',
              }}
            >
              {text}
            </h1>
          ))}
        </div>


        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          
          <a
            ref={ctaSecondaryRef}
            href="/contact-us"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 hover:shadow-lg hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            Contact Us
          </a>
        </div>
      </div>

      {/* Bottom wave divider */}
      <svg
        aria-hidden
        className="absolute inset-x-0 bottom-0 w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path d="M0,64L48,58.7C96,53,192,43,288,74.7C384,107,480,181,576,186.7C672,192,768,128,864,117.3C960,107,1056,149,1152,154.7C1248,160,1344,128,1392,112L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="rgba(0,0,0,0.55)" />
      </svg>
    </section>
  );
};

export default HeroBanner;
