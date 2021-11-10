import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as _ from 'lodash';
import { ADMIN_EMAILS, Question, QuestionToParticipant } from '@ccq/data';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
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

exports.incrementParticipantCounter = functions.auth.user().onCreate(() =>
  admin
    .firestore()
    .doc('/participants/counter')
    .set({ count: admin.firestore.FieldValue.increment(1) }, { merge: true })
    .catch((error) => console.log(error))
);

exports.decrementParticipantCounter = functions.auth.user().onDelete(() =>
  admin
    .firestore()
    .doc('/participants/counter')
    .set({ count: admin.firestore.FieldValue.increment(-1) }, { merge: true })
    .catch((error) => console.log(error))
);

exports.checkParticipant = functions.https.onCall(async (_, context) => {
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
});

exports.startQuiz = functions.https.onCall(async (__, context) => {
  if (!context?.auth?.token?.phone_number) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Please Sign In First!'
    );
  }

  const phone = context.auth.token.phone_number;
  const participantRef = admin.firestore().doc(`/participants/${phone}`);
  let participantDetails: DocumentSnapshot;
  let participantData: any;
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
  } else {
    participantData = participantDetails.data();
  }

  let randomQIds: number[];
  if (!participantData?.round1) {
    const totalNoOfQs = (
      await admin.firestore().doc('/questions/counter').get()
    ).data().count;
    randomQIds = _.sampleSize(_.range(1, totalNoOfQs + 1), 20);

    participantData.round1 = {
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
  } else {
    randomQIds = participantData.round1.data
      .filter((d) => d.answerId === '' && d.timeTaken === 0)
      .map((d) => d.questionId);
  }

  const randomQs1: QuestionToParticipant[] = (
    await admin
      .firestore()
      .collection('/questions')
      .where('index', 'in', _.chunk(randomQIds, 10)[0])
      .get()
  ).docs.map((d) => {
    const question = d.data() as Question;
    _.unset(question, 'correct');
    return question;
  });
  let randomQs2: QuestionToParticipant[] = [];
  if (randomQIds.length > 10) {
    randomQs2 = (
      await admin
        .firestore()
        .collection('/questions')
        .where('index', 'in', _.chunk(randomQIds, 10)[1])
        .get()
    ).docs.map((d) => {
      const question = d.data() as Question;
      _.unset(question, 'correct');
      return question;
    });
  }
  const randomQs: QuestionToParticipant[] = _.shuffle([
    ...randomQs1,
    ...randomQs2
  ]);
  return randomQs;
});
