import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { DocumentSnapshot } from 'firebase-functions/v1/firestore';
import { Q_PER_1ST_ROUND, QuestionToParticipant, Question } from '@ccq/data';
import admin from './admin';

export const check = functions.https.onCall(async (data, context) => {
  if (!context?.auth?.token?.phone_number) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Please Sign In First!'
    );
  } else if (Number.isNaN(data?.timeTaken)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Please provide valid Time Taken.'
    );
  } else if (Number.isNaN(data?.questionId)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Please provide valid Question Index'
    );
  }

  let questionDetails: DocumentSnapshot;
  let question: Question;
  try {
    questionDetails = await admin
      .firestore()
      .doc(`/questions/question${data.questionId}`)
      .get();
  } catch (error) {
    functions.logger.error(error);
    throw new functions.https.HttpsError(
      'internal',
      `Error occured at fetching question information: ${error}`
    );
  }

  if (!questionDetails.exists) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Inexistent question index provided'
    );
  } else {
    question = questionDetails.data() as Question;
  }

  const phone = context.auth.token.phone_number;
  const participantRef = admin.firestore().doc(`/participants/${phone}`);
  let participantDetails: DocumentSnapshot;
  let participantData: any;
  try {
    participantDetails = await participantRef.get();
  } catch (error) {
    functions.logger.error(error);
    throw new functions.https.HttpsError(
      'internal',
      `Error occured at fetching participant data: ${error}`
    );
  }

  if (!participantDetails.exists) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      "You shouldn't be here"
    );
  } else {
    participantData = participantDetails.data();
    participantData.round1.data.filter(
      (d) => d.questionId === Number(data.questionId)
    )[0].answerId = data?.answerId ?? '';
    participantData.round1.data.filter(
      (d) => d.questionId === Number(data.questionId)
    )[0].correct = data?.answerId === question.correct;
    participantData.round1.data.filter(
      (d) => d.questionId === Number(data.questionId)
    )[0].questionId = data.questionId;
    participantData.round1.data.filter(
      (d) => d.questionId === Number(data.questionId)
    )[0].timeTaken = data.timeTaken;

    try {
      await participantRef.set(participantData, { merge: true });
    } catch (error) {
      throw new functions.https.HttpsError(
        'internal',
        `Error at updating saving progress. Error: ${error}.`
      );
    }
  }

  return question.correct;
});

export const start = functions.https.onCall(async (__, context) => {
  if (!context?.auth?.token?.phone_number) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Please Sign In First!'
    );
  }

  const phone = context.auth.token.phone_number;
  const participantRef = admin.firestore().doc(`/participants/${phone}`);
  let participantDetails: DocumentSnapshot;
  let participantData: any;
  try {
    participantDetails = await participantRef.get();
  } catch (error) {
    functions.logger.error(error);
    throw new functions.https.HttpsError(
      'internal',
      `Error occured at fetching participant data: ${error}`
    );
  }

  if (!participantDetails.exists) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You are not authorized to take the quiz'
    );
  } else {
    participantData = participantDetails.data();
  }

  let randomQIds: number[];
  if (!participantData?.round1) {
    const totalNoOfQs = (
      await admin.firestore().doc('/questions/counter').get()
    ).data().count;
    randomQIds = _.sampleSize(_.range(1, totalNoOfQs + 1), Q_PER_1ST_ROUND);
    participantData.round1 = {
      data: randomQIds.map((i: number) => {
        return {
          questionId: i,
          answerId: '',
          correct: false,
          timeTaken: 0
        };
      })
    };
    await participantRef.set(participantData, { merge: true });
  } else {
    randomQIds = participantData.round1.data
      .filter((d) => d.answerId === '' && d.timeTaken === 0)
      .map((d) => d.questionId);
  }

  const randomQs1: QuestionToParticipant[] = (
    await admin
      .firestore()
      .collection('/questions')
      .where('index', 'in', _.chunk(randomQIds, 10)[0])
      .get()
  ).docs.map((d) => {
    const question = d.data() as Question;
    _.unset(question, 'correct');
    return question;
  });
  let randomQs2: QuestionToParticipant[] = [];
  if (randomQIds.length > 10) {
    randomQs2 = (
      await admin
        .firestore()
        .collection('/questions')
        .where('index', 'in', _.chunk(randomQIds, 10)[1])
        .get()
    ).docs.map((d) => {
      const question = d.data() as Question;
      _.unset(question, 'correct');
      return question;
    });
  }
  const randomQs: QuestionToParticipant[] = _.shuffle([
    ...randomQs1,
    ...randomQs2
  ]);
  return randomQs;
});
