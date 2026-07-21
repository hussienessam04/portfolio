'use client';

import { useEffect } from 'react';

export function Preloader() {
  useEffect(() => {
    const hide = () => {
      const pre = document.getElementById('pre');
      if (pre) pre.classList.add('hidden');
      document.body.classList.add('ready');
    };
    if (document.readyState === 'complete') {
      setTimeout(hide, 1900);
    } else {
      window.addEventListener('load', () => setTimeout(hide, 1900), { once: true });
    }
  }, []);

  return (
    <div className="pre" id="pre" aria-hidden="true">
      <div className="pre-inner">
        <p className="pre-name">
          <span>H</span>
          <span>u</span>
          <span>s</span>
          <span>s</span>
          <span>i</span>
          <span>e</span>
          <span>n</span>
        </p>
        <div className="pre-bar"><i /></div>
        <p className="pre-cap">Loading portfolio</p>
      </div>
    </div>
  );
}
