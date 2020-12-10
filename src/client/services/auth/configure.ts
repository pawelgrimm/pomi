import firebase from "firebase/app";
import "firebase/auth";
import { store } from "../../app/store";
import { fetchIdToken, logout } from "./auth";

const firebaseConfig = {
  apiKey: "AIzaSyBthDrLaM8N1UMq98McHsJC3_v5lvp7lgg",
  authDomain: "pomi-67d31.firebaseapp.com",
  databaseURL: "https://pomi-67d31.firebaseio.com",
  projectId: "pomi-67d31",
  storageBucket: "pomi-67d31.appspot.com",
  messagingSenderId: "832415322932",
  appId: "1:832415322932:web:3fced8f6cbba7e05bb8b61",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

auth.onIdTokenChanged(async (user) => {
  console.log("state changed", user);
  if (user) {
    store.dispatch(fetchIdToken());
  } else {
    store.dispatch(logout());
  }
});

export type User = firebase.User;
export type UserCredential = firebase.auth.UserCredential;
