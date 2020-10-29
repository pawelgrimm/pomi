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
  const uid = authHeader.slice(7); //TODO: parse Bearer more correctly
  try {
    //const { uid } = await admin.auth().verifyIdToken(token);
    res.locals.userId = uid;
    next();
  } catch (e) {
    res.status(401).send();
    return;
  }
};
