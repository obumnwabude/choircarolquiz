import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CANTATA_DATE } from '@ccq/data';

declare const FlipDown: any;

@Component({
  selector: 'ccq-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements AfterViewInit {
  flipdown: any;
  @ViewChild('flipdown') flipdownDivRef: ElementRef;

  ngAfterViewInit(): void {
    const deadline = new Date(CANTATA_DATE);

    this.flipdown = new FlipDown(
      Math.round(deadline.getTime() / 1000),
      this.flipdownDivRef.nativeElement
    );

    this.flipdown.start();
  }
}
