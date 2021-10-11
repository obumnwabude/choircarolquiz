import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
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
