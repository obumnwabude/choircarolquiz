import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Participant } from '@ccq/data';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  participant = new Participant('', '+234');
  constructor(private auth: AngularFireAuth, private router: Router) {}

  async signOut(): Promise<void> {
    await this.auth.signOut();
    this.router.navigate(['/sign-in']);
  }

  onSubmit(): void {
    console.log(this.participant);
  }
}
