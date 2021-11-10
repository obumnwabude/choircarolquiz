import * as functions from 'firebase-functions';
import admin from './admin';

export const incQ = functions.firestore
  .document('questions/{questionNo}')
  .onCreate(() =>
    admin
      .firestore()
      .doc('/questions/counter')
      .set({ count: admin.firestore.FieldValue.increment(1) }, { merge: true })
      .catch((error) => console.log(error))
  );

export const decQ = functions.firestore
  .document('questions/{questionNo}')
  .onDelete(() =>
    admin
      .firestore()
      .doc('/questions/counter')
      .set({ count: admin.firestore.FieldValue.increment(-1) }, { merge: true })
      .catch((error) => console.log(error))
  );

export const incP = functions.auth.user().onCreate(() =>
  admin
    .firestore()
    .doc('/participants/counter')
    .set({ count: admin.firestore.FieldValue.increment(1) }, { merge: true })
    .catch((error) => console.log(error))
);

export const decP = functions.auth.user().onDelete(() =>
  admin
    .firestore()
    .doc('/participants/counter')
    .set({ count: admin.firestore.FieldValue.increment(-1) }, { merge: true })
    .catch((error) => console.log(error))
);
