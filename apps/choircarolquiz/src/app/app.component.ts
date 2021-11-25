import { Component, HostBinding, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import * as AOS from 'aos';
import { SPINNER } from 'ngx-ui-loader';
import { DEFAULT_THEME, ThemingService, THEMES } from './theming.service';
import { LOCALSTORAGE_THEME_KEY } from '@ccq/data';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

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
    private auth: AngularFireAuth,
    private overlay: OverlayContainer,
    private router: Router,
    public theming: ThemingService
  ) {}

  async ngOnInit(): Promise<void> {
    AOS.init({ duration: 2000 });
    this.theming.theme$.subscribe((theme: string) => {
      this.theme = theme;
      const overlayClasses = this.overlay.getContainerElement().classList;
      overlayClasses.remove(...Array.from(THEMES));
      overlayClasses.add(this.theme);
    });
    await this.auth.signOut();
  }

  changeTheme(): void {
    this.theme = THEMES.indexOf(this.theme) === 0 ? THEMES[1] : THEMES[0];
    this.theming.theme$.next(this.theme);
    localStorage.setItem(LOCALSTORAGE_THEME_KEY, this.theme);
  }
}
