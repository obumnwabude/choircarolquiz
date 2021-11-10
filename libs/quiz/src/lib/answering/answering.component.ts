import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import {
  AnswerToParticipant,
  QuestionToParticipant,
  SECS_PER_Q_1ST_ROUND,
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
  isInCheck = false;
  selectedIndex = '';
  correctIndex = '';
  secondsLeft = SECS_PER_Q_1ST_ROUND;
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
            this.checkAnswer();
          }
        }, 1000);
      }, 1500);
    } catch (_) {
      window.location.reload();
    } finally {
      this.ngxLoader.stop();
    }
  }

  checkAnswer(): void {
    if (this.isInCheck) return;
    this.ngxLoader.start();
    clearInterval(this.countdownInterval);
    this.isInCheck = true;
    //  const timeTaken = SECS_PER_Q_1ST_ROUND - this.secondsLeft;
    // TODO: link to cloud function to check correct answer and save selected
    this.correctIndex = 'B';
    this.ngxLoader.stop();
  }

  nextQuestion(): void {
    if (!this.isInCheck) return;
    this.correctIndex = '';
    this.currentQ++;
    this.isInCheck = false;
    this.selectedIndex = '';
    this.secondsLeft = SECS_PER_Q_1ST_ROUND;
    this.answers = this.setAnswers(this.questions[this.currentQ]);
    this.countdownInterval = window.setInterval(() => {
      this.secondsLeft--;
      if (this.secondsLeft === 0) {
        clearInterval(this.countdownInterval);
        this.checkAnswer();
      }
    }, 1000);
  }

  selectAnswer(answerId: string): void {
    if (this.isInCheck) return;
    this.selectedIndex = answerId;
    this.answers.forEach((a) => (a.checked = false));
    this.answers.filter((a) => a.index === answerId)[0].checked = true;
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
