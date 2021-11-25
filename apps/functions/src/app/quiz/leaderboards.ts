import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import admin from '../admin';

export const leaderboards = functions.https.onCall(async (data, context) => {
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

  const round = Number(data.round) === 1 ? 'one' : 'two';
  const records = (
    await admin
      .firestore()
      .collection('/participants')
      .orderBy(`results.${round}.score`, 'desc')
      .orderBy(`results.${round}.points`, 'desc')
      .orderBy(`results.${round}.time`, 'desc')
      .get()
  ).docs.map((r) => {
    const record = r.data().results[round];
    _.unset(record, 'time');
    record.phone = r.id;
    return record;
  });
  for (const record of records) {
    record.name = (
      await admin.auth().getUserByPhoneNumber(record.phone)
    ).displayName;
    _.unset(record, 'phone');
  }
  return records;
});
