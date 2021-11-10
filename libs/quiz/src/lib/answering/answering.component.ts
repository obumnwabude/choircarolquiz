import { Component } from '@angular/core';

@Component({
  selector: 'ccq-answering',
  templateUrl: './answering.component.html',
  styleUrls: ['./answering.component.scss']
})
export class AnsweringComponent {
  answers = [
    { index: 'A', checked: false, value: 'Answer A' },
    { index: 'B', checked: false, value: 'Answer B' },
    { index: 'C', checked: false, value: 'Answer C' },
    { index: 'D', checked: false, value: 'Answer D' }
  ];
  selectedAnswer = '';

  selectAnswer(answer: string): void {
    this.selectedAnswer = answer;
    this.answers.forEach((a) => (a.checked = false));
    this.answers.filter((a) => a.index === answer)[0].checked = true;
  }
}
