import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo
} from '@angular/fire/auth-guard';
import { Route, RouterModule } from '@angular/router';
import { firebase, FirebaseUIModule } from 'firebaseui-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    NgxUiLoaderModule,
    NgxUiLoaderRouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
