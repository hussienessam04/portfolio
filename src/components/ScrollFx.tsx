'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ScrollFx() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // 1. Tape: scrubbed horizontal translation. Replaces the vanilla JS in Fx.tsx
      //    so cleanup, scrubbing, and refresh all flow through GSAP.
      const tapePin = document.getElementById('tapePin');
      const tapeTrack = document.getElementById('tapeTrack');
      if (tapePin && tapeTrack && !reduced) {
        const setup = () => {
          const total = Math.max(0, tapeTrack.scrollWidth - window.innerWidth + 60);
          gsap.to(tapeTrack, {
            x: -total,
            ease: 'none',
            scrollTrigger: {
              trigger: tapePin,
              start: 'top 55%',
              end: () => `+=${Math.max(400, window.innerHeight * 0.6)}`,
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });
        };
        requestAnimationFrame(() => requestAnimationFrame(setup));
      }

      // 2. Hero status dot: subtle infinite breath. CSS can't easily do "respect
      //    reduced-motion" on this so JS owns it.
      const dot = document.querySelector<HTMLElement>('.hero-meta-top .dot');
      if (dot && !reduced) {
        gsap.to(dot, { opacity: 0.35, duration: 1.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      }

      // 3. Contact split-words: extra cinematic scrub reveal on top of CSS.
      const contactWords = document.querySelectorAll<HTMLElement>('.contact h2 .split-word');
      if (contactWords.length && !reduced) {
        gsap.set(contactWords, { opacity: 0.3, filter: 'blur(6px)' });
        gsap.to(contactWords, {
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'none',
          stagger: 0.06,
          scrollTrigger: {
            trigger: '.contact h2',
            start: 'top 85%',
            end: 'top 30%',
            scrub: 1,
          },
        });
      }

      // 4. Refresh after fonts settle so tape scrollWidth is accurate.
      if ('fonts' in document) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    },
    { scope: root }
  );

  return <div ref={root} aria-hidden="true" style={{ display: 'none' }} />;
}
