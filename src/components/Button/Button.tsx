import React from "react";
import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return <button {...rest}>{children}</button>;
};

interface StyledButtonProps extends ButtonProps {
  onPrimary?: boolean;
}

export const PrimaryButton: React.FC<StyledButtonProps> = ({
  onPrimary,
  children,
  ...rest
}) => {
  return (
    <button
      className={onPrimary ? styles.primaryOnPrimary : styles.primary}
      {...rest}
    >
      {children}
    </button>
  );
};

export const SecondaryButton: React.FC<StyledButtonProps> = ({
  onPrimary,
  children,
  ...rest
}) => {
  return (
    <button
      className={
        onPrimary ? styles.secondaryOnPrimaryOnPrimary : styles.secondary
      }
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
