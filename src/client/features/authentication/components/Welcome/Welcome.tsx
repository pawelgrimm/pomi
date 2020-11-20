import React from "react";
import { AuthLayout } from "../AuthLayout";
import { ActionButton } from "../../../../components";
import { LoginState, SetsLoginState } from "../../../../pages/LoginPage";
import { SpacedContainer } from "../../../../components/SpacedContainer";

export const Welcome: React.FC<SetsLoginState> = ({ setLoginState }) => {
  const onLogIn = () => {
    setLoginState(LoginState.LOG_IN);
  };
  const onSignUp = () => {
    setLoginState(LoginState.SIGN_UP);
  };
  return (
    <AuthLayout titleText="Welcome to Pomi!" largeTitle>
      <SpacedContainer>
        <ActionButton onClick={onLogIn}>Log In</ActionButton>
        <ActionButton onClick={onSignUp} variant="outlined">
          Sign Up
        </ActionButton>
      </SpacedContainer>
    </AuthLayout>
  );
};
