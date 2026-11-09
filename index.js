/* Callable used by approved seniors to set a temporary password for another member. */
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

const USERS_PATH = "quapAccess/users";

exports.quapResetPassword = onCall({ region: "southamerica-east1" }, async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Login required.");

  const db = admin.database();
  const caller = (await db.ref(`${USERS_PATH}/${request.auth.uid}`).get()).val();
  const callerIsSenior = caller
    && caller.role === "senior"
    && caller.status === "approved"
    && !caller.mustChangePassword;
  if (!callerIsSenior) throw new HttpsError("permission-denied", "Senior profile required.");

  const { uid, password } = request.data || {};
  if (typeof uid !== "string" || !uid || uid === request.auth.uid) {
    throw new HttpsError("invalid-argument", "Invalid target user.");
  }
  if (typeof password !== "string" || password.length < 6 || password.length > 128) {
    throw new HttpsError("invalid-argument", "Password must have 6 to 128 characters.");
  }

  const targetRef = db.ref(`${USERS_PATH}/${uid}`);
  const target = (await targetRef.get()).val();
  if (!target) throw new HttpsError("not-found", "User not found.");
  // Seniors cannot change other seniors' credentials, matching the management panel.
  if (target.role === "senior") throw new HttpsError("permission-denied", "Cannot reset a senior.");

  await admin.auth().updateUser(uid, { password });
  // Ends active sessions and forces the member to choose a new password on next login.
  await admin.auth().revokeRefreshTokens(uid);
  await targetRef.update({ mustChangePassword: true });

  return { ok: true };
});
