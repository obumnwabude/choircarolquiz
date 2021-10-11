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
