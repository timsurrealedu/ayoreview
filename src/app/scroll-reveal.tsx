'use client';

import { useEffect } from 'react';

export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('reveal-js');
    const targets = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return () => root.classList.remove('reveal-js');
    }

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });

    targets.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      root.classList.remove('reveal-js');
    };
  }, []);

  return null;
}
