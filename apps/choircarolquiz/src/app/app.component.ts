import { Component, HostBinding, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SPINNER } from 'ngx-ui-loader';
import { DEFAULT_THEME, ThemingService, THEMES } from '@ccq/ccq/theming';

@Component({
  selector: 'ccq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  SPINNER = SPINNER;
  @HostBinding('class') public cssThemeClass = DEFAULT_THEME;

  constructor(public theming: ThemingService, private overlay: OverlayContainer) {}

  ngOnInit(): void {
    this.theming.theme.subscribe((theme: string) => {
      this.cssThemeClass = theme;
      const overlayClasses = this.overlay.getContainerElement().classList;
      overlayClasses.remove(...Array.from(THEMES));
      overlayClasses.add(this.cssThemeClass);
    });
  }
}
