import { Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './leaderboards.component.html',
  styleUrls: ['./leaderboards.component.scss']
})
export class LeaderboardsComponent implements OnDestroy {
  prevTitle: string;

  constructor(private title: Title) {
    this.prevTitle = this.title.getTitle();
    this.title.setTitle(`Leaderboards | ${this.prevTitle}`);
  }

  ngOnDestroy(): void {
    this.title.setTitle(this.prevTitle);
  }
}

