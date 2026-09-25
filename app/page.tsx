'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLenis } from '@/hooks/useLenis';
import { useWindowSize } from '@/hooks/useWindowSize';
import { ScrollProvider } from '@/context/ScrollContext';
import { BubbleProvider, useBubble } from '@/context/BubbleContext';
import { PageLoader } from '@/components/PageLoader';
import { BubbleScene } from '@/components/BubbleScene';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { SelectedWork, workProgressForProject } from '@/components/SelectedWork';
import { usePageTransition } from '@/context/TransitionContext';
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
  const { pageReady } = usePageTransition();

  // Deterministic entry: top of the page, unless we are returning from a case
  // study, in which case land on the project the visitor came from.
  useEffect(() => {
    let target: { section?: string; project?: number } | null = null;
    try {
      const raw = sessionStorage.getItem('kern-return');
      if (raw) target = JSON.parse(raw);
    } catch { /* storage unavailable */ }
    let timer = 0;
    let tries = 0;
    const place = () => {
      const section = document.getElementById('work');
      const pinnedLayout = window.innerWidth >= 768 && window.innerHeight >= 648;
      // Wait until the pinned layout (negative section margins) is applied.
      if (target?.section === 'work' && pinnedLayout && section && !section.style.marginTop && tries < 30) {
        tries += 1;
        timer = window.setTimeout(place, 34);
        return;
      }
      let y = 0;
      if (target?.section === 'work' && section) {
        y = Math.max(0, section.offsetTop - window.innerHeight + section.offsetHeight * workProgressForProject(target.project ?? 0));
      }
      // Consume the return target only once it has actually been applied
      // (effects can run twice in development).
      try { sessionStorage.removeItem('kern-return'); } catch { /* storage unavailable */ }
      window.scrollTo(0, y);
      window.kernLenis?.scrollTo(y, { immediate: true, force: true });
      requestAnimationFrame(() => requestAnimationFrame(pageReady));
    };
    timer = window.setTimeout(place, 50);
    return () => window.clearTimeout(timer);
  }, [pageReady]);

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
