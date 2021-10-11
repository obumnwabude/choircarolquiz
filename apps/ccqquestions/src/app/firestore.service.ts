import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Question, QUESTIONS_PER_PAGE } from '@ccq/data';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private db: AngularFirestore, private snackBar: MatSnackBar) {}

  getQuestionCount(): Observable<number> {
    return this.db
      .doc<{ count: number }>(`questions/counter`)
      .snapshotChanges()
      .pipe(switchMap((change) => of(change.payload.data().count)));
  }

  getQuestions(pageNumber: number): Observable<any[]> {
    const startQ = QUESTIONS_PER_PAGE * (pageNumber - 1) + 1;
    const endQ = QUESTIONS_PER_PAGE * pageNumber;

    return this.db
      .collection<Question>(`/questions`, (ref) =>
        ref.where('index', '>=', startQ).where('index', '<=', endQ)
      )
      .snapshotChanges();
  }

  async saveQuestion(question: Question): Promise<void> {
    try {
      await this.db
        .doc<Question>(`/questions/question${question.index}`)
        .set(question, { merge: true });
      this.snackBar.open(
        `Question ${question.index} successfully updated`,
        '',
        {
          panelClass: ['snackbar-success']
        }
      );
    } catch (error) {
      console.error(error);
      this.snackBar.open(`Error: ${error}. Please retry`, '', {
        panelClass: ['snackbar-error']
      });
    }
  }
}
