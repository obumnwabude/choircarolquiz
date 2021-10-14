import { Component, HostBinding, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import * as AOS from 'aos';
import { SPINNER } from 'ngx-ui-loader';
import { DEFAULT_THEME, ThemingService, THEMES } from './theming.service';
import { LOCALSTORAGE_THEME_KEY } from '@ccq/data';

@Component({
  selector: 'ccq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  SPINNER = SPINNER;
  THEMES = THEMES;
  @HostBinding('class') public theme = DEFAULT_THEME;

  constructor(
    private overlay: OverlayContainer,
    public theming: ThemingService
  ) {}

  ngOnInit(): void {
    AOS.init({ duration: 2000 });
    this.theming.theme$.subscribe((theme: string) => {
      this.theme = theme;
      const overlayClasses = this.overlay.getContainerElement().classList;
      overlayClasses.remove(...Array.from(THEMES));
      overlayClasses.add(this.theme);
    });
  }

  changeTheme(): void {
    this.theme = THEMES.indexOf(this.theme) === 0 ? THEMES[1] : THEMES[0];
    this.theming.theme$.next(this.theme);
    localStorage.setItem(LOCALSTORAGE_THEME_KEY, this.theme);
  }
}
