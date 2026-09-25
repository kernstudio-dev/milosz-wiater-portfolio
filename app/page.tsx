'use client';

import { useCallback, useState } from 'react';
import { useLenis } from '@/hooks/useLenis';
import { useWindowSize } from '@/hooks/useWindowSize';
import { ScrollProvider } from '@/context/ScrollContext';
import { BubbleProvider, useBubble } from '@/context/BubbleContext';
import { PageLoader } from '@/components/PageLoader';
import { BubbleScene } from '@/components/BubbleScene';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { SelectedWork } from '@/components/SelectedWork';
import { ServicesIndex } from '@/components/ServicesIndex';
import { TechPhilosophy } from '@/components/TechPhilosophy';
import { ContactFooter } from '@/components/ContactFooter';

function HomeInner() {
  const { setGridMetrics } = useBubble();
  const metricsCallback = useCallback(
    (m: Parameters<typeof setGridMetrics>[0]) => setGridMetrics(m),
    [setGridMetrics]
  );
  const { metrics } = useWindowSize(metricsCallback);
  useLenis(metrics.isPinned);

  const [loaderFinished, setLoaderFinished] = useState(false);

  return (
    <>
      <PageLoader onComplete={() => setLoaderFinished(true)} />

      <BubbleScene />

      <div
        id="main-content"
        style={{
          position: 'relative',
          opacity: loaderFinished ? 1 : 0,
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
    </>
  );
}

export default function Home() {
  return (
    <ScrollProvider>
      <BubbleProvider>
        <HomeInner />
      </BubbleProvider>
    </ScrollProvider>
  );
}
