import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { LeaderboardRecord } from '@ccq/data';

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
    this.dialog.open(NoDataDialogComponent);
  }

  ngOnDestroy(): void {
    this.title.setTitle(this.prevTitle);
  }
}

@Component({
  styles: [
    `
      .ccq-section-heading {
        margin-top: 32px;
      }
    `
  ],
  template: `
    <h2 class="ccq-section-heading">Leaderboard</h2>

    <ul class="pl-4 list-disc list-outside text-2xl mx-auto">
      <li class="mb-4">No data yet for Leaderboards.</li>
      <li class="mb-4">This because quiz is still to take place.</li>
    </ul>

    <p class="text-center mt-8">
      <button
        mat-raised-button
        color="primary"
        (click)="this.dialogRef.close()"
      >
        Ok, roger that!
      </button>
    </p>
  `
})
export class NoDataDialogComponent {
  constructor(public dialogRef: MatDialogRef<NoDataDialogComponent>) {}
}
