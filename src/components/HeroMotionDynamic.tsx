'use client';

import dynamic from 'next/dynamic';

export const HeroMotionDynamic = dynamic(
  () => import('./HeroMotion').then((m) => m.HeroMotion),
  { ssr: false }
);
