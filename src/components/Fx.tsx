'use client';

import { useEffect } from 'react';

const REDUCED = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const CURSOR_OK = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export function Fx() {
  useEffect(() => {
    const reduced = REDUCED();
    const cursorOk = CURSOR_OK();

    // ponytail: enable `html.has-custom-cursor` so we can suppress the
    // native cursor only on devices where we render the custom one.
    if (cursorOk) document.documentElement.classList.add('has-custom-cursor');

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
    let cx = 0, cy = 0, rx = 0, ry = 0, rafId = 0;

    const onMove = (e: MouseEvent) => {
      cx = e.clientX; cy = e.clientY;
      // Dot snaps to the pointer — no lerp.
      if (curDot) curDot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    // Ring follows with a slightly tighter lerp (0.22) — previous 0.12 felt laggy.
    const LERP = 0.22;
    const animRing = () => {
      rx += (cx - rx) * LERP;
      ry += (cy - ry) * LERP;
      if (curRing) curRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(animRing);
    };
    if (cursorOk) rafId = requestAnimationFrame(animRing);

    // Cursor state labels (home / hire / open / set / etc.)
    document.querySelectorAll<HTMLElement>('[data-cursor]').forEach((el) => {
      const label = el.dataset.cursor ?? '';
      el.addEventListener('mouseenter', () => {
        if (!cursorOk) return;
        // Shrink the dot so the ring's label / shape is the focus.
        curDot?.classList.add('is-hover');
        if (!curRing) return;
        if (['mail', 'hire', 'read', 'open', 'see', 'view', 'ln', 'cv', 'home'].includes(label)) {
          curRing.classList.add('is-big');
          curRing.classList.remove('is-pill', 'is-press');
          curRing.textContent = label;
        } else if (label === 'set' || label === 'top') {
          curRing.classList.remove('is-big', 'is-press');
          curRing.classList.add('is-pill');
          curRing.textContent = '↗';
        } else {
          curRing.classList.remove('is-big', 'is-pill', 'is-press');
          curRing.textContent = '';
        }
      });
      el.addEventListener('mouseleave', () => {
        curDot?.classList.remove('is-hover');
        if (!curRing) return;
        curRing.classList.remove('is-big', 'is-pill', 'is-press');
        curRing.textContent = '';
      });
    });

    // Hide custom cursor over form fields — the OS caret reads better there.
    if (cursorOk) {
      const overField = () => {
        if (curDot) curDot.style.opacity = '0';
        if (curRing) curRing.style.opacity = '0';
      };
      const offField = () => {
        if (curDot) curDot.style.opacity = '1';
        if (curRing) curRing.style.opacity = '1';
      };
      document.querySelectorAll<HTMLElement>('input, textarea, select').forEach((el) => {
        el.addEventListener('mouseenter', overField);
        el.addEventListener('mouseleave', offField);
        el.addEventListener('focus', overField);
        el.addEventListener('blur', offField);
      });
    }

    // Click ripple + ring press state
    let rippleCleanup: (() => void) | null = null;
    if (cursorOk && !reduced) {
      const spawnRipple = (x: number, y: number) => {
        const r = document.createElement('div');
        r.className = 'cur-ripple';
        r.style.left = `${x}px`;
        r.style.top = `${y}px`;
        document.body.appendChild(r);
        // Ponytail: one-shot CSS-driven expand + fade. No GSAP needed —
        // a single rAF-driven timeline keeps the bundle smaller.
        const start = performance.now();
        const dur = 620;
        const step = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          const ease = 1 - Math.pow(1 - p, 3);
          const scale = 1 + ease * 16; // 1 → 17
          r.style.transform = `translate(-50%, -50%) scale(${scale})`;
          r.style.opacity = String(0.6 * (1 - p));
          if (p < 1) requestAnimationFrame(step);
          else r.remove();
        };
        requestAnimationFrame(step);
      };
      const onDown = (e: MouseEvent) => {
        curRing?.classList.add('is-press');
        if (e.button === 0) spawnRipple(e.clientX, e.clientY);
      };
      const onUp = () => curRing?.classList.remove('is-press');
      window.addEventListener('mousedown', onDown);
      window.addEventListener('mouseup', onUp);
      rippleCleanup = () => {
        window.removeEventListener('mousedown', onDown);
        window.removeEventListener('mouseup', onUp);
      };
    }

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
      rippleCleanup?.();
      document.documentElement.classList.remove('has-custom-cursor');
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
