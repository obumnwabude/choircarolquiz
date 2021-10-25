import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { LeaderboardRecord } from '@ccq/data';

@Component({
  templateUrl: './no-data-dialog.component.html',
  styles: ['.ccq-section-heading { margin-top: 32px; }']
})
export class NoDataDialogComponent {}

@Component({
  templateUrl: './leaderboards.component.html',
  styleUrls: ['./leaderboards.component.scss']
})
export class LeaderboardsComponent implements OnDestroy {
  prevTitle: string;
  records: LeaderboardRecord[] = [
    {
      name: '',
      points: 900,
      score: 50
    },
    {
      name: '',
      points: 900,
      score: 50
    },
    {
      name: '',
      points: 900,
      score: 50
    }
  ];
  selected_round = 'round_one';

  constructor(public dialog: MatDialog, private title: Title) {
    this.prevTitle = this.title.getTitle();
    this.title.setTitle(`Leaderboards | ${this.prevTitle}`);
    this.dialog.open(NoDataDialogComponent, {
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
