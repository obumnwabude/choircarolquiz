import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CANTATA_DATE } from '@ccq/data';
import { THEMES, ThemingService } from '../theming.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const FlipDown: any;

@Component({
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements AfterViewInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  flipdown: any;
  @ViewChild('flipdown') flipdownDivRef: ElementRef;

  constructor(public theming: ThemingService) { }

  ngAfterViewInit(): void {
    this.theming.theme$.subscribe((theme: string) => {
      theme = THEMES.map((t) => t.split('_')[0]).filter(
        (t) => t != theme.split('_')[0]
      )[0];

      if (!this.flipdown) {
        this.flipdown = new FlipDown(
          Math.round(new Date(CANTATA_DATE).getTime() / 1000),
          this.flipdownDivRef.nativeElement,
          { theme }
        );
        this.flipdown.start();
      } else {
        this.flipdown.element.classList.remove(
          Array.from(this.flipdown.element.classList).filter((t) =>
            /flipdown__theme/.test(t as string)
          )
        );
        this.flipdown.element.classList.add(`flipdown__theme-${theme}`);
      }
    });
  }
}