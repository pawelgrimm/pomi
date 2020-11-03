import * as admin from "firebase-admin";
import {
  project_id,
  client_email,
  private_key,
} from "../config/firebaseServiceAccountKey.json";
import { RequestHandler } from "express";

const serviceAccount = {
  projectId: project_id,
  clientEmail: client_email,
  privateKey: private_key,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pomi-67d31.firebaseio.com",
});

export const authenticate: RequestHandler = async (req, res, next) => {
  const authHeader = req.header("Authorization") as string;
  try {
    // TODO: parse Bearer more elegantly for testing
    const uid = authHeader.slice(7);
    if (!uid) {
      res.status(401);
      next(new Error("No auth header"));
    }
    res.locals.userId = uid;
    next();
    //
    // const { uid } = await admin.auth().verifyIdToken(token);
  } catch (e) {
    res.status(401);
    next(e);
  }
};
