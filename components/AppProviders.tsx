'use client';

import { LanguageProvider } from '@/context/LanguageContext';
import { TransitionProvider } from '@/context/TransitionContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <TransitionProvider>{children}</TransitionProvider>
    </LanguageProvider>
  );
}
