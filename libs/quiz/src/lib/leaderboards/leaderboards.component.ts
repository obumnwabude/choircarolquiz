import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Title } from '@angular/platform-browser';
import { LeaderboardRecord } from '@ccq/data';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  templateUrl: './leaderboards.component.html',
  styleUrls: ['./leaderboards.component.scss']
})
export class LeaderboardsComponent implements OnDestroy, OnInit {
  prevTitle: string;
  records: LeaderboardRecord[] = [];
  selected_round = 1;

  constructor(
    private fns: AngularFireFunctions,
    private ngxLoader: NgxUiLoaderService,
    private title: Title
  ) {
    this.prevTitle = this.title.getTitle();
    this.title.setTitle(`Leaderboards | ${this.prevTitle}`);
  }

  async ngOnInit(): Promise<void> {
    this.refreshRecords();
  }

  ngOnDestroy(): void {
    this.title.setTitle(this.prevTitle);
  }

  async refreshRecords(): Promise<void> {
    try {
      this.ngxLoader.start();
      this.records = await this.fns
        .httpsCallable('leaderboards')({
          round: this.selected_round
        })
        .toPromise();
      this.ngxLoader.stop();
    } catch (_) {
      window.location.reload();
    }
  }
}
