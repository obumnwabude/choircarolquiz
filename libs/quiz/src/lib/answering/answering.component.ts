import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import {
  AnswerToParticipant,
  QuestionToParticipant,
  TEMPLATE_QUESTION
} from '@ccq/data';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import shuffle from 'lodash-es/shuffle';

@Component({
  selector: 'ccq-answering',
  templateUrl: './answering.component.html',
  styleUrls: ['./answering.component.scss']
})
export class AnsweringComponent implements OnInit {
  currentQ = 0;
  questions: QuestionToParticipant[] = [TEMPLATE_QUESTION];
  answers: AnswerToParticipant[] = [];
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
      this.questions = await this.fns
        .httpsCallable('startQuiz')({})
        .toPromise();
      this.answers = this.setAnswers(this.questions[this.currentQ]);

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

  setAnswers(question: QuestionToParticipant): AnswerToParticipant[] {
    const answers = question.answers.map((a) => {
      return {
        ...a,
        checked: false
      };
    });
    return shuffle(answers);
  }
}
