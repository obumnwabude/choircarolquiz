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
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Route, RouterModule } from '@angular/router';
import { firebase, FirebaseUIModule } from 'firebaseui-angular';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { SignInComponent } from './sign-in/sign-in.component';
import { QuestionsPageComponent } from './questions-page/questions-page.component';

const routes: Route[] = [
  {
    path: 'sign-in',
    component: SignInComponent,
    ...canActivate(() => redirectLoggedInTo(['questions']))
  },
  {
    path: 'questions',
    component: QuestionsPageComponent,
    ...canActivate(() => redirectUnauthorizedTo(['sign-in']))
  },
  { path: '**', redirectTo: 'sign-in' }
];

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInSuccessUrl: '/questions',
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
  declarations: [AppComponent, SignInComponent, QuestionsPageComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    MatButtonModule,
    MatToolbarModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
