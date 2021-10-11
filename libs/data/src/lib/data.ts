export interface Answer {
  index: string;
  value: string;
}

export interface Question {
  index: number;
  value: string;
  correct: string;
  answers: Answer[];
}

export const TEMPLATE_QUESTION: Question = {
  index: 1,
  value: '',
  correct: 'A',
  answers: [
    { index: 'A', value: '' },
    { index: 'B', value: '' },
    { index: 'C', value: '' },
    { index: 'D', value: '' }
  ]
};
