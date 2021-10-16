export interface Answer {
  index: string;
  value: string;
}

export class Participant {
  constructor(public name: string, public phone: string) {}
}

export interface Question {
  index: number;
  value: string;
  correct: string;
  answers: Answer[];
}

export const ADMIN_EMAILS = ['obumnwabude@gmail.com'];

export const CANTATA_DATE = '2021-11-20T10:00:00.000Z';

export const LOCALSTORAGE_THEME_KEY = 'theme';

export const QUESTIONS_PER_PAGE = 40;

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
