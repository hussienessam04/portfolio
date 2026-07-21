'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function HeroMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
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
    }, root);

    return () => ctx.revert();
  }, []);

  return <div ref={root}>{children}</div>;
}
