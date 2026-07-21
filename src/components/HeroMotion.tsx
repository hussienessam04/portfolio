'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

export function HeroMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  // ponytail: useGSAP handles scope, revertOnUpdate, and cleanup automatically.
  // Children carry data-hero-* attributes; the ref scopes every selector to this
  // island. matchMedia() gates the reveals on prefers-reduced-motion.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { isMotionOK: '(prefers-reduced-motion: no-preference)' },
        () => {
          gsap.from('[data-hero-eyebrow]', { opacity: 0, y: 12, duration: 0.5, ease: 'power3.out' });
          gsap.from('[data-hero-line]', {
            opacity: 0,
            y: 28,
            duration: 0.7,
            stagger: 0.08,
            delay: 0.1,
            ease: 'power3.out',
          });
          gsap.from('[data-hero-lede]', { opacity: 0, y: 12, duration: 0.6, delay: 0.45, ease: 'power3.out' });
          gsap.from('[data-hero-cta]', { opacity: 0, y: 10, duration: 0.5, stagger: 0.06, delay: 0.55, ease: 'power3.out' });
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  return <div ref={root}>{children}</div>;
}
