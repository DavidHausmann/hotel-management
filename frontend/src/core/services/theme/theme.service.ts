import { Injectable } from '@angular/core';

export type AppTheme = 'light' | 'dark';

const STORAGE_KEY = 'hotel_theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private theme: AppTheme = 'light';

  constructor() {}

  init(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log('Stored theme:', stored);
      if (stored === 'dark' || stored === 'light') {
        this.theme = stored as AppTheme;
        this.applyThemeToDocument(this.theme);
        this.attachStorageListener();
        return;
      }
  } catch (error) {}

    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      this.theme = prefersDark ? 'dark' : 'light';
      this.applyThemeToDocument(this.theme);
    } else {
      this.theme = 'light';
      this.applyThemeToDocument(this.theme);
    }
    this.attachStorageListener();
  }

  getTheme(): AppTheme {
    return this.theme;
  }

  isDarkMode(): boolean {
    return this.theme === 'dark';
  }

  setTheme(t: AppTheme) {
    this.theme = t;
    try {
      localStorage.setItem(STORAGE_KEY, t);
  } catch (error) {}
    this.applyThemeToDocument(t);
  }

  toggleTheme() {
    this.setTheme(this.isDarkMode() ? 'light' : 'dark');
  }

  private applyThemeToDocument(theme: AppTheme) {
    try {
      if (typeof document === 'undefined') return;
      const html = document.documentElement;
      html.classList.remove('theme--light', 'theme--dark');
      html.classList.add(`theme--${theme}`);
  } catch (error) {}
  }

  private attachStorageListener() {
    try {
      if (typeof window === 'undefined' || !('addEventListener' in window))
        return;
      if ((<any>this)._storageListenerAttached) return;
      (<any>this)._storageListenerAttached = true;
      window.addEventListener('storage', (e: StorageEvent) => {
        if (!e.key || e.key !== STORAGE_KEY) return;
        const newVal = e.newValue;
        if (newVal === 'dark' || newVal === 'light') {
          this.theme = newVal as AppTheme;
          this.applyThemeToDocument(this.theme);
        }
      });
  } catch (error) {}
  }
}
