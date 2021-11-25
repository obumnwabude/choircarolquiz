import { Component } from '@angular/core';
import { CANTATA_DATE } from '@ccq/data';

@Component({
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  CANTATA_DATE = CANTATA_DATE;
}
