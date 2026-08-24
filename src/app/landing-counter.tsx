'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Illustrative count-up for the hero dashboard mock. The number is a
 * synthetic demonstration, labeled as such by the surrounding caption.
 */
export function LandingCounter() {
  const target = 1284;
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    const duration = 1600;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="dash-count">
      <strong>{value.toLocaleString('id-ID')}</strong>
      <span className="dash-delta">+12 minggu ini</span>
    </div>
  );
}
