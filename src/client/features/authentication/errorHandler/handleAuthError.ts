// Possible errors throw by GCP Auth module
// https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signinwithemailandpassword
// https://firebase.google.com/docs/reference/js/firebase.auth.Auth#sendpasswordresetemail
// https://firebase.google.com/docs/reference/js/firebase.auth.Auth#sendpasswordresetemail
import React from "react";

enum LoginError {
  INVALID_EMAIL = "auth/invalid-email",
  USER_DISABLED = "auth/user-disabled",
  USER_NOT_FOUND = "auth/user-not-found",
  WRONG_PASSWORD = "auth/wrong-password",
  EMAIL_IN_USE = "auth/email-already-in-use",
  NOT_ALLOWED = "auth/operation-not-allowed",
  WEAK_PASSWORD = "auth/weak-password",
}

export const handleAuthError = (
  { code, message }: { code: LoginError; message: string },
  setFieldError: (field: string, message: string) => void,
  setFormError: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  switch (code) {
    case LoginError.INVALID_EMAIL:
      setFieldError("email", "Please enter a valid email address");
      break;
    case LoginError.USER_NOT_FOUND:
      setFieldError(
        "email",
        "The email you've entered doesn't match any account."
      );
      break;
    case LoginError.WRONG_PASSWORD:
      setFieldError("password", "The password you've entered is incorrect.");
      break;
    case LoginError.USER_DISABLED:
      setFormError("This account is disabled");
      break;
    case LoginError.EMAIL_IN_USE:
      setFieldError("email", "The email you've entered is already in use.");
      break;
    case LoginError.NOT_ALLOWED:
      setFormError(
        "Account creation is currently disabled. Please try again later."
      );
      break;
    case LoginError.WEAK_PASSWORD:
      setFieldError("password", message);
      break;
    default:
      setFormError(message);
      break;
  }
};
