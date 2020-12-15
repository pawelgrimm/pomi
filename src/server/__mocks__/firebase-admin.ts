import { UserModel } from "../../shared/types";

const firebaseAdmin: any = jest.createMockFromModule("firebase-admin");

export const credential = {
  cert: jest.fn(),
};

export const mockVerifyIdToken = jest.fn((token: string) => ({
  uid: token,
}));

export const mockGetUser = jest.fn((user: UserModel) => user);

export const auth = () => ({
  verifyIdToken: mockVerifyIdToken,
  getUser: mockGetUser,
});

export const initializeApp = jest.fn();

firebaseAdmin.initializeApp = initializeApp;
firebaseAdmin.credential = credential;
firebaseAdmin.auth = auth;

export default firebaseAdmin;
