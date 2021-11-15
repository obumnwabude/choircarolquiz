import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/v1/firestore';
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

  if (!participantDetails.exists) return false;
  const participantData = participantDetails.data();
  return Number(data.round) === 1
    ? !participantData?.results?.one
    : participantData?.results?.one?.score >= 50;
});
