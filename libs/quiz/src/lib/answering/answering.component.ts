import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioButton } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  AnswerToParticipant,
  QuestionToParticipant,
  SECS_PER_Q_1ST_ROUND,
  TEMPLATE_QUESTION
} from '@ccq/data';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import shuffle from 'lodash-es/shuffle';

@Component({
  templateUrl: './congratulations.component.html',
  styles: ['.ccq-section-heading { margin-top: 32px; }']
})
export class CongratulationsComponent {
  score: number;
  points: number;
  constructor(public router: Router) {}
}

@Component({
  templateUrl: './answering.component.html',
  styleUrls: ['./answering.component.scss']
})
export class AnsweringComponent implements OnInit {
  answers: AnswerToParticipant[] = [];
  correctIndex = '';
  countdownInterval: number;
  currentQ = 0;
  hasSetQuestions = false;
  isInCheck = false;
  questions: QuestionToParticipant[] = [TEMPLATE_QUESTION];
  selectedIndex = '';
  secondsLeft = SECS_PER_Q_1ST_ROUND;

  @ViewChild('finishButton') finishButton: MatButton;
  @ViewChild('nextButton') nextButton: MatButton;
  @ViewChild(MatRadioButton) radio: MatRadioButton;

  constructor(
    private fns: AngularFireFunctions,
    private ngxLoader: NgxUiLoaderService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.ngxLoader.start();
      this.questions = await this.fns
        .httpsCallable('startQuiz')({})
        .toPromise();
      this.answers = this.setAnswers(this.questions[this.currentQ]);
      this.hasSetQuestions = true;

      setTimeout(() => {
        this.radio.focus();
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

  async checkAnswer(): Promise<void> {
    if (this.isInCheck) return;
    try {
      this.ngxLoader.start();
      clearInterval(this.countdownInterval);
      this.correctIndex = await this.fns
        .httpsCallable('checkAnswer')({
          questionId: this.questions[this.currentQ].index,
          timeTaken: SECS_PER_Q_1ST_ROUND - this.secondsLeft,
          answerId: this.selectedIndex
        })
        .toPromise();
      this.isInCheck = true;
      setTimeout(() => {
        if (this.currentQ + 1 === this.questions.length) {
          this.finishButton.focus();
        } else {
          this.nextButton.focus();
        }
      });
    } catch (error) {
      this.snackBar.open(
        `Error: ${error}. We couldn't save your progress, press check again.`
      );
      this.isInCheck = false;
    } finally {
      this.ngxLoader.stop();
    }
  }

  async finishQuiz(): Promise<void> {
    if (this.currentQ + 1 <= this.questions.length && !this.isInCheck) return;
    try {
      this.ngxLoader.start();
      const result = await this.fns.httpsCallable('finishQuiz')({}).toPromise();
      const congratsRef = this.dialog.open(CongratulationsComponent, {
        autoFocus: true,
        closeOnNavigation: true,
        disableClose: true,
        hasBackdrop: true
      });
      const congratsInstance = congratsRef.componentInstance;
      congratsInstance.score = result.score;
      congratsInstance.points = result.points;
    } catch (error) {
      this.snackBar.open(
        `Error: ${error}. We couldn't determine your progress, press finish again.`
      );
      this.isInCheck = false;
    } finally {
      this.ngxLoader.stop();
    }
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
    setTimeout(() => this.radio.focus());
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
