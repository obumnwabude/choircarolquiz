import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/v1/firestore';
import { SECS_PER_Q_1ST_ROUND } from '@ccq/data';
import admin from '../admin';

export const finish = functions.https.onCall(async (data, context) => {
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

  const participantData = participantDetails.data();
  const round = Number(data.round) === 1 ? 'one' : 'two';
  const leftOverQs = participantData?.rounds?.[round]?.data.filter(
    (d) => d.answerId === '' && d.timeTaken === 0
  );
  if (
    !participantDetails.exists ||
    !participantData?.rounds?.[round] ||
    leftOverQs.length > 0
  ) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      "You shouldn't be here"
    );
  }

  const roundInfo = participantData.rounds[round].data;
  const score = Math.round(
    (roundInfo.filter((d) => d.correct).length / roundInfo.length) * 100
  );
  const points = Math.round(
    roundInfo
      .filter((d) => d.correct)
      .map((d) => (SECS_PER_Q_1ST_ROUND - d.timeTaken) * 5)
      .reduce((a, b) => a + b)
  );

  if (!participantData?.results) participantData.results = {};
  participantData.results[round] = {
    points,
    score,
    time: admin.firestore.FieldValue.serverTimestamp()
  };
  try {
    await participantRef.set(participantData, { merge: true });
  } catch (error) {
    functions.logger.error(error);
    throw new functions.https.HttpsError(
      'internal',
      `Error occured at saving participant progress: ${error}`
    );
  }

  try {
    await admin
      .firestore()
      .doc('/participants/counter')
      .set(
        { rounds: { [round]: admin.firestore.FieldValue.increment(1) } },
        { merge: true }
      );
  } catch (error) {
    functions.logger.error(error);
    throw new functions.https.HttpsError(
      'internal',
      `Error occured at incrementing round participant count: ${error}`
    );
  }

  return { score, points };
});
