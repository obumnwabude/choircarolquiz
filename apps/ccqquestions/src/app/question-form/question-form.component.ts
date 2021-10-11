import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Answer, Question } from '@ccq/data';

@Component({
  selector: 'ccq-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss']
})
export class QuestionFormComponent implements OnInit {
  @Input() question: Question;
  @Output() questionChange = new EventEmitter<Question>();
  questionForm: FormGroup;

  buildAnswerGroup(answer: Answer): FormGroup {
    return new FormGroup({
      index: new FormControl(answer.index, Validators.required),
      value: new FormControl(answer.value, Validators.required)
    });
  }

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.questionForm = new FormGroup({
      value: new FormControl(this.question.value, Validators.required),
      correct: new FormControl(this.question.correct, Validators.required),
      answers: this.question.answers.reduce((formArray, answer) => {
        formArray.push(this.buildAnswerGroup(answer));
        return formArray;
      }, new FormArray([])) as FormArray
    });
  }

  onSubmit(): void {
    if (this.questionForm.status === 'INVALID') {
      this.snackBar.open('Please correct the errors', '', {
        panelClass: ['snackbar-error']
      });
    } else {
      // re-include question index to emitted question
      // as there was no input in the form for quesiton's index
      this.questionChange.emit({
        index: this.question.index,
        ...this.questionForm.value
      });
    }
  }

  asFormArray(array: unknown): FormArray { return array as FormArray; }
}
