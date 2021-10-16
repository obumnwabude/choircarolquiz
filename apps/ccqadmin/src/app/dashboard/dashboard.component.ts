import { Component, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireFunctions } from '@angular/fire/functions';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Participant } from '@ccq/data';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @ViewChild('form') form: NgForm;
  participant = new Participant('', '+234');
  constructor(
    private auth: AngularFireAuth,
    private fns: AngularFireFunctions,
    private ngxLoader: NgxUiLoaderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async signOut(): Promise<void> {
    await this.auth.signOut();
    this.router.navigate(['/sign-in']);
  }

  async onSubmit(): Promise<void> {
    try {
      this.ngxLoader.start();
      await this.fns
        .httpsCallable('createParticipant')(this.participant)
        .toPromise();
      this.snackBar.open('Participant successfully created.', '', {
        panelClass: ['snackbar-success']
      });
      this.form.resetForm();
      this.participant = new Participant('', '+234');
    } catch (error) {
      console.error(error);
      this.snackBar.open(`${error}. `, '', {
        panelClass: ['snackbar-error']
      });
    } finally {
      this.ngxLoader.stop();
    }
  }
}
