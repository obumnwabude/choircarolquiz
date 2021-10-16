import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ADMIN_EMAILS } from '@ccq/data';
admin.initializeApp();

exports.incrementQuestionCounter = functions.firestore
  .document('questions/{questionNo}')
  .onCreate(() =>
    admin
      .firestore()
      .doc('/questions/counter')
      .set({ count: admin.firestore.FieldValue.increment(1) }, { merge: true })
      .catch((error) => console.log(error))
  );

exports.decrementQuestionCounter = functions.firestore
  .document('questions/{questionNo}')
  .onDelete(() =>
    admin
      .firestore()
      .doc('/questions/counter')
      .set({ count: admin.firestore.FieldValue.increment(-1) }, { merge: true })
      .catch((error) => console.log(error))
  );

exports.createParticipant = functions.https.onCall(async (data, context) => {
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
  } else if (!/^\+234[789][01]\d{8}$/.test(data.phone)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid Phone Number provided.'
    );
  }
});
