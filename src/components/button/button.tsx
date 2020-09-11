import React, { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const Button: React.FC<Props> = ({ children, ...rest }) => {
  return <button {...rest}>{children}</button>;
};

export default Button;
