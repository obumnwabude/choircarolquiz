import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './unauthorized-dialog.component.html',
  styles: [
    '.ccq-section-heading { margin-top: 32px; }',
    '.home-button { margin-right: 16px; }'
  ]
})
export class UnauthorizedDialogComponent {
  constructor(public router: Router) {}
}

@Component({
  templateUrl: './sign-in.component.html',
  styles: [
    '.ccq-section-heading { margin-top: 16px; }',
    '.sign-in { max-width: 768px; }'
  ]
})
export class SignInComponent implements OnDestroy {
  prevTitle: string;
  showLoading = true;
  window = window;

  constructor(
    private auth: AngularFireAuth,
    private fns: AngularFireFunctions,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) {
    this.prevTitle = this.title.getTitle();
    this.title.setTitle(`Sign In | ${this.prevTitle}`);
  }

  async checkParticipant(): Promise<void> {
    this.showLoading = true;
    let result = false;
    try {
      result = await this.fns.httpsCallable('checkParticipant')({}).toPromise();
    } catch (_) {
      window.location.reload();
    }

    if (!result) {
      this.dialog.open(UnauthorizedDialogComponent, {
        autoFocus: true,
        closeOnNavigation: true,
        disableClose: true,
        hasBackdrop: true
      });
      await this.auth.signOut();
      this.showLoading = false;
    } else {
      const nextUrl = this.route.snapshot.paramMap.get('next');
      this.router.navigate([nextUrl ?? '/quiz']);
    }
  }

  ngOnDestroy(): void {
    this.title.setTitle(this.prevTitle);
  }
}
