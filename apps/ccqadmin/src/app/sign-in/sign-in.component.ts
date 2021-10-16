import { Component } from '@angular/core';

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
export class SignInComponent {}
