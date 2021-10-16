import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo
} from '@angular/fire/auth-guard';
import {
  AngularFireFunctionsModule,
  ORIGIN,
  NEW_ORIGIN_BEHAVIOR,
  USE_EMULATOR
} from '@angular/fire/functions';
import { FormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { firebase, FirebaseUIModule } from 'firebaseui-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { environment } from '../environments/environment';

const routes: Route[] = [
  {
    path: '',
    component: DashboardComponent,
    ...canActivate(() => redirectUnauthorizedTo(['sign-in']))
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    ...canActivate(() => redirectLoggedInTo(['']))
  },
  { path: '**', redirectTo: 'sign-in' }
];

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      disableSignUp: {
        status: true
      }
    }
  ]
};

@NgModule({
  declarations: [AppComponent, SignInComponent, DashboardComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    AngularFireFunctionsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatToolbarModule,
    NgxUiLoaderModule,
    NgxUiLoaderRouterModule
  ],
  providers: [
    { provide: NEW_ORIGIN_BEHAVIOR, useValue: true },
    {
      provide: ORIGIN,
      useValue: environment.production ? location.origin : undefined
    },
    {
      provide: USE_EMULATOR,
      useValue: environment.production ? undefined : ['localhost', 5001]
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000,
        verticalPosition: 'top'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
