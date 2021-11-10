import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'ccq-answering',
  templateUrl: './answering.component.html',
  styleUrls: ['./answering.component.scss']
})
export class AnsweringComponent implements OnInit {
  answers = [
    { index: 'A', checked: false, value: 'Answer A' },
    { index: 'B', checked: false, value: 'Answer B' },
    { index: 'C', checked: false, value: 'Answer C' },
    { index: 'D', checked: false, value: 'Answer D' }
  ];
  selectedAnswer = '';
  isInCheck = false;
  selectedIndex = '';
  correctIndex = '';
  secondsLeft = 30;
  countdownInterval: number;

  constructor(
    private fns: AngularFireFunctions,
    private ngxLoader: NgxUiLoaderService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.ngxLoader.start();
      const result = await this.fns
        .httpsCallable('startQuiz')({})
        .toPromise();
      console.log(result);

      setTimeout(() => {
        this.countdownInterval = window.setInterval(() => {
          this.secondsLeft--;
          if (this.secondsLeft === 0) {
            clearInterval(this.countdownInterval);
          }
        }, 1000);
      }, 1500);
    } catch (_) {
      window.location.reload();
    } finally {
      this.ngxLoader.stop();
    }
  }

  selectAnswer(answer: string): void {
    if (this.isInCheck) return;
    this.selectedAnswer = answer;
    this.answers.forEach((a) => (a.checked = false));
    this.answers.filter((a) => a.index === answer)[0].checked = true;
  }
}
