'use client';

import { useEffect } from 'react';

const REDUCED = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const CURSOR_OK = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export function Fx() {
  useEffect(() => {
    const reduced = REDUCED();
    const cursorOk = CURSOR_OK();

    // Scroll progress + nav scrolled state
    const nav = document.getElementById('topnav');
    const progress = document.getElementById('progress');
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (nav) nav.classList.toggle('scrolled', y > 60);
      if (progress) progress.style.transform = `scaleX(${Math.min(1, y / Math.max(h, 1))})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Custom cursor
    const curDot = document.getElementById('curDot');
    const curRing = document.getElementById('curRing');
    let cx = 0, cy = 0, rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => {
      cx = e.clientX; cy = e.clientY;
      if (curDot) curDot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    let rafId = 0;
    const animRing = () => {
      rx += (cx - rx) * 0.12;
      ry += (cy - ry) * 0.12;
      if (curRing) curRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(animRing);
    };
    if (cursorOk) rafId = requestAnimationFrame(animRing);

    document.querySelectorAll<HTMLElement>('[data-cursor]').forEach((el) => {
      const label = el.dataset.cursor ?? '';
      el.addEventListener('mouseenter', () => {
        if (!cursorOk || !curRing) return;
        if (['mail', 'hire', 'read', 'open', 'see', 'view', 'ln', 'cv', 'home'].includes(label)) {
          curRing.classList.add('is-big');
          curRing.classList.remove('is-pill');
          curRing.textContent = label;
        } else if (label === 'set' || label === 'top') {
          curRing.classList.remove('is-big');
          curRing.classList.add('is-pill');
          curRing.textContent = '↗';
        } else {
          curRing.classList.remove('is-big', 'is-pill');
          curRing.textContent = '';
        }
      });
      el.addEventListener('mouseleave', () => {
        if (!curRing) return;
        curRing.classList.remove('is-big', 'is-pill');
        curRing.textContent = '';
      });
    });

    // Magnetic
    if (!reduced) {
      const magStrength = 0.14;
      document.querySelectorAll<HTMLElement>('.magnetic').forEach((el) => {
        const isBtn = el.classList.contains('btn');
        const onMMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * magStrength;
          const y = (e.clientY - r.top - r.height / 2) * magStrength;
          el.style.transform = isBtn ? `translate(${x}px, ${y}px)` : `translate(${x}px, ${y * 0.6}px)`;
        };
        const reset = () => { el.style.transform = ''; };
        el.addEventListener('mousemove', onMMove);
        el.addEventListener('mouseleave', reset);
      });
    }

    // Reveal + split-word
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          en.target.classList.add('is-on');
          io.unobserve(en.target);
        }
      }
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll<HTMLElement>('.reveal, .split-word').forEach((el) => io.observe(el));

    // Count-up
    const cio = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        const el = en.target as HTMLElement;
        const target = parseInt(el.dataset.count ?? '', 10);
        if (!Number.isFinite(target)) continue;
        const start = performance.now();
        const dur = 2000;
        const step = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          const ease = 1 - Math.pow(1 - p, 4);
          el.textContent = String(Math.round(target * ease));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      }
    }, { threshold: 0.4 });
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => cio.observe(el));

    // Phrase rotator
    if (!reduced) {
      const phrases = document.querySelectorAll<HTMLElement>('#phrases .phrase');
      let ri = 0;
      if (phrases.length > 1) {
        const tick = () => {
          phrases[ri].classList.remove('is-on');
          ri = (ri + 1) % phrases.length;
          phrases[ri].classList.add('is-on');
        };
        const id = window.setInterval(tick, 4400);
        (window as unknown as { __phraseInterval?: number }).__phraseInterval = id;
      }
    }

    // Tape horizontal scroll — owned by ScrollFx via GSAP ScrollTrigger
    //    (see ScrollFx.tsx). The vanilla handler has been removed to avoid
    //    double-binding.

    // Theme toggle
    const themeBtn = document.getElementById('themeBtn');
    const onThemeClick = () => {
      const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', cur);
      try { localStorage.setItem('hp.theme', cur); } catch {}
    };
    themeBtn?.addEventListener('click', onThemeClick);

    // Mobile menu
    const mmBtn = document.getElementById('mmBtn');
    const mm = document.getElementById('mm');
    const setMm = (open: boolean) => {
      mmBtn?.classList.toggle('active', open);
      mmBtn?.setAttribute('aria-expanded', String(open));
      mm?.classList.toggle('open', open);
      mm?.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    const mmClick = () => setMm(!(mm?.classList.contains('open')));
    mmBtn?.addEventListener('click', mmClick);
    document.querySelectorAll<HTMLElement>('.mm a').forEach((a) => a.addEventListener('click', () => setMm(false)));
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && mm?.classList.contains('open')) setMm(false); };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
      const id = (window as unknown as { __phraseInterval?: number }).__phraseInterval;
      if (id) window.clearInterval(id);
      themeBtn?.removeEventListener('click', onThemeClick);
      mmBtn?.removeEventListener('click', mmClick);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <>
      <div className="progress" id="progress" aria-hidden="true" />
      <div className="cur" id="cur" aria-hidden="true" />
      <div className="cur-dot" id="curDot" aria-hidden="true" />
      <div className="cur-ring" id="curRing" aria-hidden="true" />
    </>
  );
}
