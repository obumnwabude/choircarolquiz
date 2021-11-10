import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/v1/firestore';
import { ADMIN_EMAILS } from '@ccq/data';
import admin from './admin';

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

export const create = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Please Sign In First!'
      );
    } else if (!ADMIN_EMAILS.includes(context.auth.token.email)) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Only Admins are permitted!'
      );
    } else if (!data.name) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Please provide name.'
      );
    } else if (!/^\+234[789][01]\d{8}$/.test(data.phone)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid Phone Number provided.'
      );
    }

    const participantRef = admin.firestore().doc(`/participants/${data.phone}`);

    let participantDetails: DocumentSnapshot;
    try {
      participantDetails = await participantRef.get();
    } catch (error) {
      functions.logger.error(error);
      throw new functions.https.HttpsError(
        'internal',
        `Error occured at fetching firestore participant data: ${error}`
      );
    }

    if (participantDetails.exists) {
      throw new functions.https.HttpsError(
        'already-exists',
        'Participant exists already in Firestore.'
      );
    } else {
      try {
        participantRef.set({}, { merge: true });
      } catch (error) {
        functions.logger.error(error);
        throw new functions.https.HttpsError(
          'internal',
          `Error occured at creating firestore participant: ${error}`
        );
      }
    }

    try {
      await admin.auth().createUser({
        displayName: data.name,
        phoneNumber: data.phone,
        uid: data.phone
      });
    } catch (error) {
      functions.logger.error(error);
      throw new functions.https.HttpsError(
        'internal',
        `Error occured at creating auth participant: ${error}`
      );
    }
  }
);
