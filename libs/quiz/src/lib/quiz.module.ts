import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo
} from '@angular/fire/auth-guard';
import {
  AngularFireFunctionsModule,
  ORIGIN,
  NEW_ORIGIN_BEHAVIOR,
  USE_EMULATOR as USE_FUNCTIONS_EMULATOR
} from '@angular/fire/functions';
import { firebase, FirebaseUIModule } from 'firebaseui-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatRadioModule,
  MAT_RADIO_DEFAULT_OPTIONS
} from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { CountdownModule } from '@ccq/countdown';
import { environment } from '@ccq/ccq/env';

import {
  SignInComponent,
  UnauthorizedDialogComponent
} from './sign-in/sign-in.component';
import {
  AboutRoundComponent,
  LandingComponent
} from './landing/landing.component';
import {
  LeaderboardsComponent,
  NoDataDialogComponent
} from './leaderboards/leaderboards.component';
import { AnsweringComponent } from './answering/answering.component';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
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
  declarations: [
    AboutRoundComponent,
    LandingComponent,
    LeaderboardsComponent,
    NoDataDialogComponent,
    SignInComponent,
    UnauthorizedDialogComponent,
    AnsweringComponent
  ],
  imports: [
    CommonModule,
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
      },
      {
        path: 'round1',
        component: AnsweringComponent,
        ...canActivate(() =>
          redirectUnauthorizedTo('/quiz/sign-in?next=%2Fquiz%2round1')
        )
      }
    ]),
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    AngularFireFunctionsModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    CountdownModule
  ],
  providers: [
    { provide: NEW_ORIGIN_BEHAVIOR, useValue: true },
    {
      provide: ORIGIN,
      useValue: environment.production ? location.origin : undefined
    },
    {
      provide: USE_FUNCTIONS_EMULATOR,
      useValue: environment.production ? undefined : ['localhost', 5001]
    },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'accent' }
    }
  ]
})
export class QuizModule {}
