import { Component } from '@angular/core';
import { SPINNER } from 'ngx-ui-loader';

@Component({
  selector: 'ccq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  SPINNER = SPINNER;
}
