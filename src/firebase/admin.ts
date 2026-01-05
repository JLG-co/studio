import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

let app: admin.app.App;

export function initializeAdmin() {
  if (admin.apps.length) {
    app = admin.app();
  } else if (serviceAccount) {
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // This will initialize the app using Application Default Credentials
    // This is the recommended way for App Hosting and Cloud Functions
    app = admin.initializeApp();
  }
  return app;
}
