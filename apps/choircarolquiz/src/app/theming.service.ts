import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const DEFAULT_THEME = 'light_mode';
export const THEMES = ['light_mode', 'dark_mode'];

@Injectable({
  providedIn: 'root'
})
export class ThemingService {
  theme$ = new BehaviorSubject(DEFAULT_THEME);

  constructor() {
    window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches &&
      this.theme$.next('dark_mode');

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) =>
        this.theme$.next(e.matches ? 'dark_mode' : 'light_mode')
      );
  }
}
