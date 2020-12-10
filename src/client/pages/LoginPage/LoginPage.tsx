import React, { useState } from "react";
import { Welcome } from "../../features/authentication/components/Welcome";
import { EmailLogin } from "../../features/authentication/components/EmailLogin";
import { EmailSignup } from "../../features/authentication/components/EmailSignup";
import { ResetPassword } from "../../features/authentication/components/ForgotPassword";

export enum LoginState {
  WELCOME = "WELCOME",
  LOG_IN = "LOG_IN",
  SIGN_UP = "SIGN_UP",
  RESET_PASSWORD = "RESET_PASSWORD",
}

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
      case LoginState.RESET_PASSWORD:
        return <ResetPassword setLoginState={setLoginState} />;
      default:
        return <Welcome setLoginState={setLoginState} />;
    }
  };

  return switchCase();
};
