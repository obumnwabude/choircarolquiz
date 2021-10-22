import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import {
  AngularFireAnalyticsModule,
  ScreenTrackingService
} from '@angular/fire/analytics';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';
import { CountdownModule } from '@ccq/countdown';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { environment } from '../environments/environment';

const routes: Routes = [
  { path: 'cantata', component: HomePageComponent },
  {
    path: 'quiz',
    loadChildren: () => import('@ccq/quiz').then((m) => m.QuizModule)
  },
  { path: '**', redirectTo: '/cantata', pathMatch: 'full' }
];

@NgModule({
  declarations: [AppComponent, HomePageComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    NgxUiLoaderModule,
    NgxUiLoaderRouterModule,
    CountdownModule
  ],
  providers: [ScreenTrackingService, Title],
  bootstrap: [AppComponent]
})
export class AppModule {}
