import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo
} from '@angular/fire/auth-guard';
import { firebase, FirebaseUIModule } from 'firebaseui-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CountdownModule } from '@ccq/countdown';

import { SignInComponent } from './sign-in/sign-in.component';
import { LandingComponent } from './landing/landing.component';
import { LeaderboardsComponent } from './leaderboards/leaderboards.component';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInSuccessUrl: '/quiz',
  queryParameterForSignInSuccessUrl: 'next',
  signInOptions: [
    {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      recaptchaParameters: {
        type: 'image',
        size: 'invisible',
        badge: 'bottomright'
      },
      defaultCountry: 'NG',
      whitelistedCountries: ['NG', '+234']
    }
  ]
};

@NgModule({
  imports: [
    CommonModule,
    AngularFireAuthModule,
    RouterModule.forChild([
      {
        path: 'sign-in',
        component: SignInComponent,
        ...canActivate(() => redirectLoggedInTo('/quiz'))
      },
      {
        path: 'leaderboards',
        component: LeaderboardsComponent,
        ...canActivate(() =>
          redirectUnauthorizedTo('/quiz/sign-in?next=%2Fquiz%2Fleaderboards')
        )
      },
      {
        path: '',
        component: LandingComponent,
        ...canActivate(() =>
          redirectUnauthorizedTo('/quiz/sign-in?next=%2Fquiz')
        )
      }
    ]),
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    MatButtonModule,
    MatDividerModule,
    MatProgressBarModule,
    MatSelectModule,
    CountdownModule
  ],
  declarations: [SignInComponent, LandingComponent, LeaderboardsComponent]
})
export class QuizModule {}
