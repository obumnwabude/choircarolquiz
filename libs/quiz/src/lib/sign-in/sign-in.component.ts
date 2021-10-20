import { Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  template: `
    <div class="sign-in">
      <firebase-ui></firebase-ui>
    </div>
  `,
  styles: [
    `
      .sign-in {
        max-width: 768px;
        margin: 32px auto;
        padding: 0px 24px;
      }
    `
  ]
})
export class SignInComponent implements OnDestroy {
  prevTitle: string;

  constructor(private title: Title) {
    this.prevTitle = this.title.getTitle();
    this.title.setTitle(`Sign In | ${this.prevTitle}`);
  }

  ngOnDestroy(): void {
    this.title.setTitle(this.prevTitle);
  }
}
