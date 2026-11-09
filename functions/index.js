'use strict';
const {initializeApp} = require('firebase-admin/app');
const {getAuth} = require('firebase-admin/auth');
const {getDatabase} = require('firebase-admin/database');
const {onCall, HttpsError} = require('firebase-functions/v2/https');
const {createManager} = require('./management');
initializeApp();
const manager = createManager({auth: getAuth(), db: getDatabase(), HttpsError});
exports.manageQuapUsers = onCall({region: 'us-central1', maxInstances: 3}, async request => {
  // A revoked session must not retain administrative access.
  const header = request.rawRequest.headers.authorization || '';
  if (!header.startsWith('Bearer ')) throw new HttpsError('unauthenticated', 'Entre novamente.');
  let identity;
  try { identity = await getAuth().verifyIdToken(header.slice(7), true); }
  catch { throw new HttpsError('unauthenticated', 'Entre novamente.'); }
  return manager(identity.uid, request.data, identity.auth_time);
});
