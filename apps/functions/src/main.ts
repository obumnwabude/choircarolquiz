import { decP, decQ, incP, incQ } from './app/counters';
import { check as checkParticipant } from './app/participants/check';
import { create as createParticipant } from './app/participants/create';
import { check as checkAnswer } from './app/quiz/check-answer';
import { check as checkEligibility } from './app/quiz/check-eligibility';
import { finish } from './app/quiz/finish';
import { start } from './app/quiz/start';

exports.incrementQuestionCounter = incQ;
exports.decrementQuestionCounter = decQ;
exports.incrementParticipantCounter = incP;
exports.decrementParticipantCounter = decP;
exports.checkParticipant = checkParticipant;
exports.createParticipant = createParticipant;
exports.checkAnswer = checkAnswer;
exports.checkEligibility = checkEligibility;
exports.finishQuiz = finish;
exports.startQuiz = start;
