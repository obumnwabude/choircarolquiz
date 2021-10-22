import { Component } from '@angular/core';
import { CANTATA_DATE } from '@ccq/data';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  CANTATA_DATE = CANTATA_DATE;
  constructor(public auth: AngularFireAuth) {}
}
