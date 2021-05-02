import * as admin from "firebase-admin";
import { NextFunction, RequestHandler } from "express";
import { Users } from "../../db";

const serviceAccount = {
  projectId: process.env.GCP_PROJECT_ID,
  clientEmail: process.env.GCP_CLIENT_EMAIL,
  privateKey: process.env.GCP_PRIVATE_KEY,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pomi-67d31.firebaseio.com",
});

export const parseAuthHeader: RequestHandler = async (req, res, next) => {
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
    const { uid: firebaseId } = await admin.auth().verifyIdToken(token);
    res.locals.firebaseId = firebaseId;
    next();
  } catch (e) {
    res.status(401);
    next(new Error("Authorization token was invalid"));
  }
};

export const authenticate: RequestHandler = async (req, res, next) => {
  const innerNext: NextFunction = (err?: any) => {
    if (err) {
      next(err);
    }
  };
  await parseAuthHeader(req, res, innerNext);

  const firebaseId: string = res.locals.firebaseId;

  const user = await Users.getByFirebaseId(firebaseId);
  if (!user) {
    res.status(424);
    next(new Error("User does not exist. Create a user and try again."));
  } else {
    res.locals.userId = user.id;
    next();
  }
};
