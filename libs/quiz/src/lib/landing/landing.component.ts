import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ROUND_TWO_DATE } from '@ccq/data';

@Component({
  templateUrl: './about-round.component.html',
  styles: [
    '.ccq-section-heading { margin-top: 32px; }',
    '.ready-button { margin-left: 16px;}'
  ]
})
export class AboutRoundComponent {
  public round: number;
  constructor(public router: Router) {}
}

@Component({
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnDestroy, OnInit {
  ROUND_TWO_DATE = ROUND_TWO_DATE;
  prevTitle: string;
  round1Eligible = false;
  round2Eligible = false;

  constructor(
    public dialog: MatDialog,
    private fns: AngularFireFunctions,
    private title: Title
  ) {
    this.prevTitle = this.title.getTitle();
    this.title.setTitle(`Take Quiz | ${this.prevTitle}`);
  }

  async ngOnInit(): Promise<void> {
    this.round1Eligible = await this.fns
      .httpsCallable('checkEligibility')({ round: 1 })
      .toPromise();
    this.round2Eligible = await this.fns
      .httpsCallable('checkEligibility')({ round: 2 })
      .toPromise();
  }

  startRound(round: number): void {
    const infoRef = this.dialog.open(AboutRoundComponent, {
      autoFocus: true,
      closeOnNavigation: true,
      disableClose: true,
      hasBackdrop: true
    });
    const infoInstance = infoRef.componentInstance;
    infoInstance.round = round;
  }

  ngOnDestroy(): void {
    this.title.setTitle(this.prevTitle);
  }
}
