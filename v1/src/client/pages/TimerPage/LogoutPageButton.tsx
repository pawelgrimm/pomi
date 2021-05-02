import React from "react";
import { useHistory } from "react-router-dom";
import { ActionButton } from "../../components";

export const LogoutPageButton: React.FC = () => {
  const history = useHistory();
  const onClick = () => history.push("/logout");
  return (
    <ActionButton variant="outlined" onClick={onClick}>
      Logout Page
    </ActionButton>
  );
};
