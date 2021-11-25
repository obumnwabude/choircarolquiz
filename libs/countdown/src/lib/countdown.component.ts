import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import { THEMES, ThemingService } from '@ccq/theming';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const FlipDown: any;

@Component({
  selector: 'ccq-countdown',
  template: `
    <div class="my-16" data-aos="fade-up">
      <h2 class="text-3xl font-bold text-center mb-4 mx-auto underline">
        {{ targetName | uppercase }} IN
      </h2>
      <div #flipdown class="flipdown mx-auto"></div>
    </div>
  `
})
export class CountdownComponent implements AfterViewInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  flipdown: any;
  @ViewChild('flipdown') flipdownDivRef: ElementRef;
  @Input() targetName: string;
  @Input() targetDate: string;

  constructor(public theming: ThemingService) {}

  ngAfterViewInit(): void {
    this.theming.theme$.subscribe((theme: string) => {
      theme = THEMES.map((t) => t.split('_')[0]).filter(
        (t) => t != theme.split('_')[0]
      )[0];

      if (!this.flipdown) {
        this.flipdown = new FlipDown(
          Math.round(new Date(this.targetDate).getTime() / 1000),
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
