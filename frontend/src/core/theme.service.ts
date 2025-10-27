import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme = 'light';
  constructor() { }

  isDarkMode(): boolean {
    return this.theme === 'dark';
  }

  toggleTheme() {
    this.theme = this.isDarkMode() ? 'light' : 'dark';
  }
}
