import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatFabMenu } from '@angular-material-extensions/fab-menu';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription, of } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { TEMPLATE_QUESTION, Question, QUESTIONS_PER_PAGE } from '@ccq/data';
import { FirestoreService } from '../firestore.service';

declare let document: Document;

@Component({
  templateUrl: './questions-page.component.html',
  styleUrls: ['./questions-page.component.scss']
})
export class QuestionsPageComponent implements OnInit {
  question = TEMPLATE_QUESTION;
  maxQPP = QUESTIONS_PER_PAGE;
  pageNumber = 0;
  questionCount = 0;
  questionSub: Subscription = Subscription.EMPTY;
  questionCountSub: Subscription = Subscription.EMPTY;
  questions: Question[] = [TEMPLATE_QUESTION];

  fabButtons: MatFabMenu[] = [
    {
      id: 1,
      icon: 'arrow_downward'
    },
    {
      id: 2,
      icon: 'arrow_upward'
    },
    {
      id: 3,
      icon: 'add'
    }
  ];

  @ViewChild(MatAccordion) accordion: MatAccordion;

  windowScrolled = false;
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.windowScrolled = window.scrollY > window.innerHeight;
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  scrollToBottom(): void {
    window.scrollTo(0, document.body.scrollHeight);
  }

  constructor(
    private auth: AngularFireAuth,
    private firestore: FirestoreService,
    private ngxLoader: NgxUiLoaderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.assignSubs();
  }

  async signOut(): Promise<void> {
    await this.auth.signOut();
    this.router.navigate(['/sign-in']);
  }

  getLastPage(): number {
    return this.questionCount === 0
      ? 1
      : Math.ceil(this.questionCount / QUESTIONS_PER_PAGE);
  }

  getNewestQ(index: number) {
    const newestQ = TEMPLATE_QUESTION;
    newestQ.index = index;
    return newestQ;
  }

  assignQuestionsSub(): void {
    this.questionSub = this.firestore
      .getQuestions(this.pageNumber)
      .subscribe((changes) => {
        try {
          if (changes.length < 1) {
            this.questions = [this.getNewestQ(this.questionCount + 1)];
          } else {
            this.questions = changes.map((change) => change.payload.doc.data());
          }
        } catch (error) {
          console.error(error);
          this.snackBar.open(`Error: ${error}. Please inform developers`, '', {
            panelClass: ['snackbar-error']
          });
        } finally {
          this.ngxLoader.stop();
        }
      });
  }

  assignSubs(): void {
    this.ngxLoader.start();
    this.questionCountSub.unsubscribe();
    this.questionCountSub = this.firestore
      .getQuestionCount()
      .pipe(
        concatMap((value, index) =>
          index === 0
            ? of(value).pipe(
                tap((qC) => {
                  this.questionCount = qC;
                  this.pageNumber = this.getLastPage();
                  this.assignQuestionsSub();
                })
              )
            : of(value)
        )
      )
      .subscribe((count) => (this.questionCount = count));
    this.questionSub.unsubscribe();
  }

  changePage(event: number): void {
    this.ngxLoader.start();
    this.pageNumber = event;
    this.assignQuestionsSub();
  }

  fabAction(event: number): void {
    if (event === 1) {
      this.scrollToBottom();
    } else if (event === 2) {
      this.scrollToTop();
    } else {
      const qL = this.questions.length;
      if (this.questions[qL - 1].value === '') {
        this.snackBar.open(
          `
            Please complete and update question ${this.questions[qL - 1].index}
            before adding a new question
          `,
          '',
          {
            panelClass: ['snackbar-error']
          }
        );
      } else {
        if (this.getLastPage() > this.pageNumber) {
          this.changePage(this.getLastPage());
        } else {
          const lastQIndex = this.questions[this.questions.length - 1].index;
          if (lastQIndex % QUESTIONS_PER_PAGE !== 0) {
            this.questions.push(this.getNewestQ(lastQIndex + 1));
          } else {
            this.pageNumber++;
            this.assignQuestionsSub();
          }
        }
      }
      this.scrollToTop();
    }
  }
}
