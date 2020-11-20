import React, { useState } from "react";
import { Welcome } from "../../features/authentication/components/Welcome";
import { EmailLogin } from "../../features/authentication/components/EmailLogin";
import { EmailSignup } from "../../features/authentication/components/EmailSignup";

export enum LoginState {
  WELCOME = "WELCOME",
  LOG_IN = "LOG_IN",
  SIGN_UP = "SIGN_UP",
}

export type SetsLoginState = {
  setLoginState: React.Dispatch<React.SetStateAction<LoginState>>;
};

export const LoginPage: React.FC = () => {
  const [loginState, setLoginState] = useState<LoginState>(LoginState.WELCOME);

  const switchCase = () => {
    switch (loginState) {
      case LoginState.WELCOME:
        return <Welcome setLoginState={setLoginState} />;
      case LoginState.LOG_IN:
        return <EmailLogin setLoginState={setLoginState} />;
      case LoginState.SIGN_UP:
        return <EmailSignup setLoginState={setLoginState} />;
      default:
        return <Welcome setLoginState={setLoginState} />;
    }
  };

  return switchCase();
};
