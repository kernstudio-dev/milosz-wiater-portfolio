'use client';

interface LetterRevealProps {
  text: string;
  active: boolean;
  className?: string;
  delay?: number;
}

/** Per-letter fade matching reference TextReveal (0.1s fade, 17.5ms stagger). */
export function LetterReveal({ text, active, className = '', delay = 0 }: LetterRevealProps) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={`${char}-${i}`}
          className={`letter-reveal ${active ? 'letter-reveal--in' : ''}`}
          style={{ transitionDelay: active ? `${delay + i * 0.0175}s` : '0s' }}
        >
          {char === ' ' ? '\u00a0' : char}
        </span>
      ))}
      <style jsx>{`
        .letter-reveal {
          opacity: 0;
          transition: opacity 0.1s ease;
        }
        .letter-reveal--in {
          opacity: 1;
        }
      `}</style>
    </span>
  );
}
