'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useBudget } from '@/contexts/BudgetContext';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { user, toggleTheme } = useBudget();
  const { theme, setTheme } = useTheme();
  const isDarkMode = user ? user.preferences.theme === 'dark' : theme === 'dark';

  const handleThemeToggle = () => {
    if (user) {
      toggleTheme();
      setTheme(isDarkMode ? 'light' : 'dark');
    } else {
      setTheme(isDarkMode ? 'light' : 'dark');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleThemeToggle}
      aria-label="Toggle theme"
      className="rounded-full transition-colors hover:bg-accent"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}
    </Button>
  );
}