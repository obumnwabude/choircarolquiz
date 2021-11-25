import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import {
  AngularFireAnalyticsModule,
  ScreenTrackingService
} from '@angular/fire/analytics';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { environment } from '../environments/environment';

const routes: Routes = [
  { path: 'cantata', component: HomePageComponent },
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
    AngularFireAuthModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    NgxUiLoaderModule,
    NgxUiLoaderRouterModule
  ],
  providers: [ScreenTrackingService, Title],
  bootstrap: [AppComponent]
})
export class AppModule {}
