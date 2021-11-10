import * as participants from './app/participants';
import * as quiz from './app/quiz';
import { decP, decQ, incP, incQ } from './app/counters';

exports.incrementQuestionCounter = incQ;
exports.decrementQuestionCounter = decQ;
exports.incrementParticipantCounter = incP;
exports.decrementParticipantCounter = decP;
exports.checkParticipant = participants.check;
exports.createParticipant = participants.create;
exports.startQuiz = quiz.start;
exports.checkAnswer = quiz.check;
