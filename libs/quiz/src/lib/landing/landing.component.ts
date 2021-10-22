import { Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ROUND_ONE_DATE } from '@ccq/data';

@Component({
  selector: 'ccq-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnDestroy {
  ROUND_ONE_DATE = ROUND_ONE_DATE;
  prevTitle: string;

  constructor(private title: Title) {
    this.prevTitle = this.title.getTitle();
    this.title.setTitle(`Take Quiz | ${this.prevTitle}`);
  }

  ngOnDestroy(): void {
    this.title.setTitle(this.prevTitle);
  }
}
