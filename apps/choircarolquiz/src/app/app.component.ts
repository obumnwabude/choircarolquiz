import {
  AfterViewInit,
  Component,
  HostBinding,
  OnInit,
  ViewChild
} from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import * as AOS from 'aos';
import { SPINNER } from 'ngx-ui-loader';
import { DEFAULT_THEME, ThemingService, THEMES } from './theming.service';
import { LOCALSTORAGE_THEME_KEY } from '@ccq/data';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'ccq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {
  SPINNER = SPINNER;
  THEMES = THEMES;
  isSignedIn = false;
  @HostBinding('class') public theme = DEFAULT_THEME;
  @ViewChild('snav') snav: MatDrawer;

  constructor(
    private auth: AngularFireAuth,
    private overlay: OverlayContainer,
    private router: Router,
    public theming: ThemingService
  ) {}

  ngAfterViewInit(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.snav.close());
  }

  ngOnInit(): void {
    AOS.init({ duration: 2000 });
    this.auth.authState.subscribe((user) => (this.isSignedIn = !!user));
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

  async signOut(): Promise<void> {
    await this.auth.signOut();
    const currentRoute = this.router.routerState.snapshot.url;
    if (/\/quiz/.test(currentRoute)) {
      this.router.navigate(['/quiz/sign-in'], {
        queryParams: { next: currentRoute }
      });
    } else {
      this.snav.close();
    }
  }
}
