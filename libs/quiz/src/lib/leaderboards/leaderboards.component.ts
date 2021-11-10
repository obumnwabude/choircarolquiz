import { Component, OnDestroy } from '@angular/core';
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

  constructor(private title: Title) {
    this.prevTitle = this.title.getTitle();
    this.title.setTitle(`Leaderboards | ${this.prevTitle}`);
  }

  ngOnDestroy(): void {
    this.title.setTitle(this.prevTitle);
  }
}
