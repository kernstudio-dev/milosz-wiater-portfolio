'use client';

import React, { useRef, useState } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  cursorState?: string;
  cursorText?: string;
  style?: React.CSSProperties;
}

export function MagneticButton({
  children,
  href,
  onClick,
  className = '',
  cursorState = 'hover',
  cursorText = '',
  style = {},
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Subtle magnetic attraction factor: 0.25
    const distanceX = (e.clientX - centerX) * 0.25;
    const distanceY = (e.clientY - centerY) * 0.25;

    setPosition({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const content = (
    <div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor={cursorState}
      data-cursor-text={cursorText}
      className={`magnetic-button corner-box ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: position.x === 0 && position.y === 0 ? 'transform 0.4s var(--ease-out-expo)' : 'none',
        ...style,
      }}
      onClick={onClick}
    >
      <div className="magnetic-button__bg" />
      <span className="corner-crosshair corner-crosshair-tl" />
      <span className="corner-crosshair corner-crosshair-tr" />
      <span className="corner-crosshair corner-crosshair-bl" />
      <span className="corner-crosshair corner-crosshair-br" />
      <span style={{ position: 'relative', zIndex: 3, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        {children}
      </span>
    </div>
  );

  if (href) {
    return (
      <a href={href} style={{ textDecoration: 'none', display: 'inline-block' }}>
        {content}
      </a>
    );
  }

  return content;
}
