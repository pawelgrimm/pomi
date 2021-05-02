import React from "react";
import { LoginState } from "../../../../pages/LoginPage";
import { ActionButton, FlexColumnContainer } from "../../../../components";
import { AuthLayout } from "../";
import { SetsLoginState } from "../../types";

export const Welcome: React.FC<SetsLoginState> = ({ setLoginState }) => {
  const onLogIn = () => {
    setLoginState(LoginState.LOG_IN);
  };
  const onSignUp = () => {
    setLoginState(LoginState.SIGN_UP);
  };
  return (
    <AuthLayout titleText="Welcome to Pomi!" largeTitle>
      <FlexColumnContainer>
        <ActionButton onClick={onLogIn}>Log In</ActionButton>
        <ActionButton onClick={onSignUp} variant="outlined">
          Sign Up
        </ActionButton>
      </FlexColumnContainer>
    </AuthLayout>
  );
};
