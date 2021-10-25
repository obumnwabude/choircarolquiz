import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

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

  constructor(public dialog: MatDialog, private title: Title) {
    this.prevTitle = this.title.getTitle();
    this.title.setTitle(`Sign In | ${this.prevTitle}`);
    // this.dialog.open(UnauthorizedDialogComponent, {
    //   autoFocus: true,
    //   closeOnNavigation: true,
    //   disableClose: true,
    //   hasBackdrop: true
    // });
  }

  ngOnDestroy(): void {
    this.title.setTitle(this.prevTitle);
  }
}
