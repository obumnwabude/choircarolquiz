import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private auth: AngularFireAuth, private router: Router) {}

  async signOut(): Promise<void> {
    await this.auth.signOut();
    this.router.navigate(['/sign-in']);
  }
}
