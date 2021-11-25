import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireFunctions } from '@angular/fire/functions';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LOCALSTORAGE_THEME_KEY, Participant } from '@ccq/data';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DEFAULT_THEME, ThemingService, THEMES } from '../theming.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  participant = new Participant('', '+234');
  THEMES = THEMES;
  @HostBinding('class') public theme = DEFAULT_THEME;
  @ViewChild('form') form: NgForm;
  constructor(
    private auth: AngularFireAuth,
    private fns: AngularFireFunctions,
    private ngxLoader: NgxUiLoaderService,
    private overlay: OverlayContainer,
    private router: Router,
    private snackBar: MatSnackBar,
    public theming: ThemingService
  ) { }

  ngOnInit(): void {
    this.theming.theme$.subscribe((theme: string) => {
      this.theme = theme;
      const overlayClasses = this.overlay.getContainerElement().classList;
      overlayClasses.remove(...Array.from(THEMES));
      overlayClasses.add(this.theme);
    });
  }

  changeTheme(): void {
    this.theme = THEMES.indexOf(this.theme) === 0 ? THEMES[1] : THEMES[0];
    this.theming.theme$.next(this.theme);
    localStorage.setItem(LOCALSTORAGE_THEME_KEY, this.theme);
  }

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
