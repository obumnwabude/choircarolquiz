import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { DocumentSnapshot } from 'firebase-functions/v1/firestore';
import { Q_PER_ROUND, QuestionToParticipant, Question } from '@ccq/data';
import admin from '../admin';

export const start = functions.https.onCall(async (data, context) => {
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
      'Provide valid round number'
    );
  }

  const phone = context.auth.token.phone_number;
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
      'You are not authorized to take the quiz'
    );
  }

  const participantData = participantDetails.data();
  const round = Number(data.round) === 1 ? 'one' : 'two';
  let randomQIds: number[];
  if (!participantData?.rounds?.[round]) {
    const totalNoOfQs = (
      await admin.firestore().doc('/questions/counter').get()
    ).data().count;
    randomQIds = _.sampleSize(_.range(1, totalNoOfQs + 1), Q_PER_ROUND);
    if (!participantData?.rounds) participantData.rounds = {};
    participantData.rounds[round] = {
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
  } else if (
    participantData.rounds[round].data.filter(
      (d) => d.answerId === '' && d.timeTaken === 0
    ).length === 0
  ) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      "You shouldn't be here"
    );
  } else {
    randomQIds = participantData.rounds[round].data
      .filter((d) => d.answerId === '' && d.timeTaken === 0)
      .map((d) => d.questionId);
  }

  const randomQs1: QuestionToParticipant[] = (
    await admin
      .firestore()
      .collection('/questions')
      .where('index', 'in', _.chunk(randomQIds, Q_PER_ROUND / 2)[0])
      .get()
  ).docs.map((d) => {
    const question = d.data() as Question;
    _.unset(question, 'correct');
    return question;
  });
  let randomQs2: QuestionToParticipant[] = [];
  if (randomQIds.length > Q_PER_ROUND / 2) {
    randomQs2 = (
      await admin
        .firestore()
        .collection('/questions')
        .where('index', 'in', _.chunk(randomQIds, Q_PER_ROUND / 2)[1])
        .get()
    ).docs.map((d) => {
      const question = d.data() as Question;
      _.unset(question, 'correct');
      return question;
    });
  }

  let randomQs: QuestionToParticipant[] = [...randomQs1, ...randomQs2];
  randomQs = _.shuffle(randomQs);
  return randomQs;
});
