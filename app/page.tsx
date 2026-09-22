'use client';

import { useState } from 'react';
import { useLenis } from '@/hooks/useLenis';
import { useWindowSize } from '@/hooks/useWindowSize';
import { ThemeProvider } from '@/context/ThemeContext';
import { PageLoader } from '@/components/PageLoader';
import { GlobalBubbleScene } from '@/components/GlobalBubbleScene';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { SelectedWork } from '@/components/SelectedWork';
import { ServicesIndex } from '@/components/ServicesIndex';
import { TechPhilosophy } from '@/components/TechPhilosophy';
import { ContactFooter } from '@/components/ContactFooter';

export default function Home() {
  // Initialize Lenis smooth scroll synchronized with GSAP ScrollTrigger
  useLenis();

  // Dynamic responsive CAD grid block-size computation
  useWindowSize();

  const [loaderFinished, setLoaderFinished] = useState(false);

  return (
    <ThemeProvider>
      {/* Cinematic Blueprint CAD Page Loader */}
      <PageLoader onComplete={() => setLoaderFinished(true)} />

      {/* Global Traveling 3D Three.js Particle Bubble Scene (vanlent.dev 1:1) */}
      <GlobalBubbleScene />

      {/* Main Experience Canvas */}
      <div
        id="main-content"
        style={{
          position: 'relative',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-canvas)',
          opacity: loaderFinished ? 1 : 0.98,
          transition: 'opacity 0.5s ease',
        }}
      >
        <Navigation />

        <main>
          <HeroSection />
          <SelectedWork />
          <ServicesIndex />
          <TechPhilosophy />
          <ContactFooter />
        </main>
      </div>
    </ThemeProvider>
  );
}
