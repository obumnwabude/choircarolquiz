import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ROUND_ONE_DATE } from '@ccq/data';

@Component({
  templateUrl: './about-round.component.html',
  styles: [
    '.ccq-section-heading { margin-top: 32px; }',
    '.ready-button { margin-left: 16px;}'
  ]
})
export class AboutRoundComponent {
  constructor(public router: Router) {}
}

@Component({
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnDestroy {
  ROUND_ONE_DATE = ROUND_ONE_DATE;
  prevTitle: string;

  constructor(public dialog: MatDialog, private title: Title) {
    this.prevTitle = this.title.getTitle();
    this.title.setTitle(`Take Quiz | ${this.prevTitle}`);
  }

  startRoundOne(): void {
    this.dialog.open(AboutRoundComponent, {
      autoFocus: true,
      closeOnNavigation: true,
      disableClose: true,
      hasBackdrop: true
    });
  }

  ngOnDestroy(): void {
    this.title.setTitle(this.prevTitle);
  }
}
