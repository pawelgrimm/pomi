const firebaseAdmin: any = jest.createMockFromModule("firebase-admin");

export const credential = {
  cert: jest.fn(),
};

export const mockVerifyIdToken = jest.fn((token: string) => ({
  uid: token,
}));

export const auth = () => ({
  verifyIdToken: mockVerifyIdToken,
});

export const initializeApp = jest.fn();

firebaseAdmin.initializeApp = initializeApp;
firebaseAdmin.credential = credential;
firebaseAdmin.auth = auth;

export default firebaseAdmin;
