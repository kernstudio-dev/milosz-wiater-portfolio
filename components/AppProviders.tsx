'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { TransitionProvider } from '@/context/TransitionContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <TransitionProvider>{children}</TransitionProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
