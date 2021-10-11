import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'ccq-questions-page',
  templateUrl: './questions-page.component.html',
  styleUrls: ['./questions-page.component.scss']
})
export class QuestionsPageComponent {
  constructor(private auth: AngularFireAuth, private router: Router) { }

  signOut(): void {
    this.router.navigate(['/sign-in']);
    this.auth.signOut();
  }
}
