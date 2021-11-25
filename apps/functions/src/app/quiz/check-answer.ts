import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/v1/firestore';
import { Question } from '@ccq/data';
import admin from '../admin';

export const check = functions.https.onCall(async (data, context) => {
  if (!context?.auth?.token?.phone_number) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Please Sign In First!'
    );
  } else if (
    Number.isNaN(data?.round) ||
    ![1, 2].includes(Number(data?.round))
  ) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Please provide valid round'
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
  const round = Number(data.round) === 1 ? 'one' : 'two';
  const participantRef = admin.firestore().doc(`/participants/${phone}`);
  let participantDetails: DocumentSnapshot;
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
    const participantData = participantDetails.data();
    participantData.rounds[round].data.filter(
      (d) => d.questionId === Number(data.questionId)
    )[0].answerId = data?.answerId ?? '';
    participantData.rounds[round].data.filter(
      (d) => d.questionId === Number(data.questionId)
    )[0].correct = data?.answerId === question.correct;
    participantData.rounds[round].data.filter(
      (d) => d.questionId === Number(data.questionId)
    )[0].questionId = data.questionId;
    participantData.rounds[round].data.filter(
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
