import React from "react";
import { ActionButton } from "../../components";
import { auth } from "../../services/auth";
import { FlexColumnContainer } from "../../components/SpacedContainer";

export const LogoutPage: React.FC = () => {
  const onLogout = async () => await auth.signOut();
  const onRefresh = async () => await auth.currentUser?.getIdToken(true);
  return (
    <>
      <FlexColumnContainer>
        <ActionButton onClick={onLogout}>Logout</ActionButton>
        <ActionButton onClick={onRefresh}>Refresh Token</ActionButton>
      </FlexColumnContainer>
    </>
  );
};
