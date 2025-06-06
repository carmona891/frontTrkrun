import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themes: Theme[] = [
    {
      name: 'racing-red',
      primary: '#e53e3e',
      secondary: '#c53030',
      accent: '#feb2b2',
      gradient: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)'
    },
    {
      name: 'speed-blue',
      primary: '#3182ce',
      secondary: '#2c5282',
      accent: '#90cdf4',
      gradient: 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)'
    },
    {
      name: 'turbo-green',
      primary: '#38a169',
      secondary: '#2f855a',
      accent: '#9ae6b4',
      gradient: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)'
    },
    {
      name: 'nitro-purple',
      primary: '#805ad5',
      secondary: '#6b46c1',
      accent: '#d6bcfa',
      gradient: 'linear-gradient(135deg, #805ad5 0%, #6b46c1 100%)'
    }
  ];

  private currentThemeSubject = new BehaviorSubject<Theme>(this.themes[0]);
  public currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themes[0]);
  }

  getThemes(): Theme[] {
    return this.themes;
  }

  setTheme(themeName: string): void {
    const theme = this.themes.find(t => t.name === themeName);
    if (theme) {
      this.currentThemeSubject.next(theme);
      this.applyTheme(theme);
    }
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--secondary-color', theme.secondary);
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--gradient-bg', theme.gradient);
  }
}