import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/v1/firestore';
import { SECS_PER_Q_1ST_ROUND } from '@ccq/data';
import admin from '../admin';

export const finish = functions.https.onCall(async (_, context) => {
  if (!context?.auth?.token?.phone_number) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Please Sign In First!'
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
  const leftOverQs = participantData?.round1.data.filter(
    (d) => d.answerId === '' && d.timeTaken === 0
  );
  if (
    !participantDetails.exists ||
    !participantData?.round1 ||
    leftOverQs.length > 0
  ) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      "You shouldn't be here"
    );
  }

  const roundInfo = participantData.round1.data;
  const score =
    (roundInfo.filter((d) => d.correct).length / roundInfo.length) * 100;
  const pointScore = score * 10;
  const pointTime = roundInfo
    .filter((d) => d.correct)
    .map((d) => (SECS_PER_Q_1ST_ROUND - d.timeTaken) * 5)
    .reduce((a, b) => a + b);
  const points = pointScore + pointTime;

  participantData.result1 = { score, points };
  try {
    await participantRef.set(participantData, { merge: true });
  } catch (error) {
    functions.logger.error(error);
    throw new functions.https.HttpsError(
      'internal',
      `Error occured at saving participant progress: ${error}`
    );
  }

  return { score, points };
});
