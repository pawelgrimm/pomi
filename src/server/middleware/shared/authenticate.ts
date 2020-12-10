import * as admin from "firebase-admin";
import { RequestHandler } from "express";

const serviceAccount = {
  projectId: process.env.GCP_PROJECT_ID,
  clientEmail: process.env.GCP_CLIENT_EMAIL,
  privateKey: process.env.GCP_PRIVATE_KEY,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pomi-67d31.firebaseio.com",
});

export const authenticate: RequestHandler = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    res.status(401);
    next(new Error("'Authorization' header is missing"));
    return;
  }
  try {
    const token = authHeader.match(/^Bearer (?<token>.+)$/)?.groups?.token;
    if (!token) {
      res.status(401);
      next(new Error("Could not parse 'Authorization' header"));
      return;
    }
    const { uid } = await admin.auth().verifyIdToken(token);
    res.locals.userId = uid;
    next();
  } catch (e) {
    res.status(401);
    next(e);
  }
};
