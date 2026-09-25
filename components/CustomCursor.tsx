'use client';

import { useEffect, useRef, useState } from 'react';
import { addFrameCallback, FRAME_ORDER } from '@/lib/frameLoop';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState<string>('');
  const [cursorState, setCursorState] = useState<string>('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on devices with fine pointer
    if (typeof window === 'undefined' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;
    let targetDirty = false;
    let lastScrollY = window.scrollY;
    let currentState = 'default';
    let currentText = '';
    let isVisible = false;

    const applyState = (nextState: string, nextText = '') => {
      if (nextState !== currentState) {
        currentState = nextState;
        setCursorState(nextState);
      }
      if (nextText !== currentText) {
        currentText = nextText;
        setCursorText(nextText);
      }
    };

    const readTarget = () => {
      const target = document.elementFromPoint(mouseX, mouseY) as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const mode = cursorTarget.getAttribute('data-cursor') || 'hover';
        const text = cursorTarget.getAttribute('data-cursor-text') || '';
        applyState(mode, text);
      } else if (target.closest('a, button, [role="button"]')) {
        applyState('hover');
      } else {
        applyState('default');
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        setVisible(true);
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      targetDirty = true;
    };
    const resetCursor = () => {
      isVisible = false;
      setVisible(false);
      applyState('default');
    };

    // Runs last on the frame clock: after every scroll-driven write of the
    // frame, so the hit-test reuses the frame's layout instead of forcing an
    // extra one mid-frame.
    const render = (_now: number, deltaMs: number) => {
      const dt = Math.min(.05, deltaMs / 1000);
      if (window.scrollY !== lastScrollY) {
        lastScrollY = window.scrollY;
        targetDirty = true;
      }
      if (targetDirty && isVisible) {
        targetDirty = false;
        readTarget();
      }
      const follow = 1 - Math.exp(-dt * 18);
      followerX += (mouseX - followerX) * follow;
      followerY += (mouseY - followerY) * follow;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('blur', resetCursor);
    document.addEventListener('mouseleave', resetCursor);
    const stop = addFrameCallback(render, FRAME_ORDER.CURSOR);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('blur', resetCursor);
      document.removeEventListener('mouseleave', resetCursor);
      stop();
    };
  }, []);

  return (
    <div className={`custom-cursor-root cursor--${cursorState} ${visible ? 'cursor--visible' : ''}`} aria-hidden="true">
      <div ref={dotRef} className="cursor-dot" />
      <div ref={followerRef} className="cursor-follower">
        {cursorText && <span>{cursorText}</span>}
      </div>
    </div>
  );
}
