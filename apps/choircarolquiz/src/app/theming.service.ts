import { Injectable } from '@angular/core';
import { LOCALSTORAGE_THEME_KEY } from '@ccq/data';
import { BehaviorSubject } from 'rxjs';

export const DEFAULT_THEME = 'light_mode';
export const THEMES = ['light_mode', 'dark_mode'];

@Injectable({
  providedIn: 'root'
})
export class ThemingService {
  theme$ = new BehaviorSubject(DEFAULT_THEME);

  constructor() {
    const savedTheme = localStorage.getItem(LOCALSTORAGE_THEME_KEY);
    savedTheme
      ? this.theme$.next(savedTheme)
      : window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches &&
        this.theme$.next('dark_mode');

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        const theme = e.matches ? 'dark_mode' : 'light_mode';
        this.theme$.next(theme);
        localStorage.setItem(LOCALSTORAGE_THEME_KEY, theme);
      });
  }
}
