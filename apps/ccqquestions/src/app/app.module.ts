import { NgModule } from '@angular/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo
} from '@angular/fire/auth-guard';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFabMenuModule } from '@angular-material-extensions/fab-menu';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { firebase, FirebaseUIModule } from 'firebaseui-angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { SignInComponent } from './sign-in/sign-in.component';
import { QuestionsPageComponent } from './questions-page/questions-page.component';
import { QuestionFormComponent } from './question-form/question-form.component';

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
  declarations: [
    AppComponent,
    SignInComponent,
    QuestionsPageComponent,
    QuestionFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    TextFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatFabMenuModule,
    NgxPaginationModule,
    NgxUiLoaderModule,
    NgxUiLoaderRouterModule
  ],
  providers: [
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
