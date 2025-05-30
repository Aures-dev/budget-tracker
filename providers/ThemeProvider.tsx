'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useEffect } from 'react';
import { useBudget } from '@/contexts/BudgetContext';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useBudget();
  
  // Set theme based on user preference
  useEffect(() => {
    if (user) {
      document.documentElement.classList.toggle('dark', user.preferences.theme === 'dark');
    }
  }, [user]);

  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}