'use client';

import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState<string>('');
  const [cursorState, setCursorState] = useState<string>('default');

  useEffect(() => {
    // Only enable custom cursor on devices with fine pointer
    if (typeof window === 'undefined' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;
    let rafId: number;

    const readTarget = () => {
      const target = document.elementFromPoint(mouseX, mouseY) as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const mode = cursorTarget.getAttribute('data-cursor') || 'hover';
        setCursorState(mode);
        const text = cursorTarget.getAttribute('data-cursor-text') || '';
        setCursorText(text);
      } else if (target.closest('a, button, [role="button"]')) {
        setCursorState('hover');
        setCursorText('');
      } else {
        setCursorState('default');
        setCursorText('');
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      readTarget();
    };
    const resetCursor = () => {
      setCursorState('default');
      setCursorText('');
    };

    // Smooth lerping loop for outer cursor follower
    const render = () => {
      // Lerp factor 0.18 for tight, responsive, physical feel
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', readTarget, { passive: true });
    window.addEventListener('blur', resetCursor);
    document.addEventListener('mouseleave', resetCursor);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', readTarget);
      window.removeEventListener('blur', resetCursor);
      document.removeEventListener('mouseleave', resetCursor);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className={`custom-cursor-root cursor--${cursorState}`} aria-hidden="true">
      <div ref={dotRef} className="cursor-dot" />
      <div ref={followerRef} className="cursor-follower">
        {cursorText && <span>{cursorText}</span>}
      </div>
    </div>
  );
}
