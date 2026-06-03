import type { UserSettings } from '@good-bodies/types';
import { useEffect } from 'react';

/**
 * Applies the user's saved theme and accent color to the page. Runs whenever
 * the settings change. Before settings load, the page stays on its default
 * dark theme (set on the html tag in index.html).
 */
export function useApplyTheme(settings: UserSettings | undefined): void {
  useEffect(() => {
    if (!settings) {
      return;
    }
    const root = document.documentElement;
    root.setAttribute('data-theme', settings.theme);
    root.style.setProperty('--accent', settings.accent);
  }, [settings]);
}
