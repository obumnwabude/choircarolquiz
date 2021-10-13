import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: HomePageComponent }])
  ],
  declarations: [HomePageComponent],
  exports: [HomePageComponent]
})
export class HomePageModule {}
