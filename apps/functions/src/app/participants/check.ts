import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/v1/firestore';
import admin from '../admin';

export const check = functions.https.onCall(async (_, context) => {
  if (!context?.auth?.token?.phone_number) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Please Sign In First!'
    );
  }

  const phone = context.auth.token.phone_number;
  let participantDetails: DocumentSnapshot;
  try {
    participantDetails = await admin
      .firestore()
      .doc(`/participants/${phone}`)
      .get();
  } catch (error) {
    functions.logger.error(error);
    throw new functions.https.HttpsError(
      'internal',
      `Error occured at fetching participant data: ${error}`
    );
  }

  if (participantDetails.exists) {
    return true;
  } else {
    try {
      const participantRecord = await admin.auth().getUserByPhoneNumber(phone);
      await admin.auth().deleteUser(participantRecord.uid);
    } catch (error) {
      functions.logger.error(error);
      throw new functions.https.HttpsError(
        'internal',
        `Error occured at clearing participant record: ${error}`
      );
    }
    return false;
  }
});
