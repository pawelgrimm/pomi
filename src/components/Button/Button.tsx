import React from "react";
import styles from "./Button.module.scss";
import { Button, createStyles, Theme, withStyles } from "@material-ui/core";

const buttonStyles = createStyles(({ spacing, typography }: Theme) => ({
  root: {
    fontSize: "1.5rem",
    fontWeight: typography.fontWeightRegular,
    padding: spacing(0.25, 0.5),
  },
}));

const StyledButton = withStyles(buttonStyles)(Button);

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   children?: React.ReactNode;
// }
//
// const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
//   return <button {...rest}>{children}</button>;
// };
//
// interface StyledButtonProps extends ButtonProps {
//   onPrimary?: boolean;
// }
//
// export const PrimaryButton: React.FC<StyledButtonProps> = ({
//   onPrimary,
//   children,
//   ...rest
// }) => {
//   return (
//     <button
//       className={onPrimary ? styles.primaryOnPrimary : styles.primary}
//       {...rest}
//     >
//       {children}
//     </button>
//   );
// };
//
// export const SecondaryButton: React.FC<StyledButtonProps> = ({
//   onPrimary,
//   children,
//   ...rest
// }) => {
//   return (
//     <button
//       className={
//         onPrimary ? styles.secondaryOnPrimaryOnPrimary : styles.secondary
//       }
//       {...rest}
//     >
//       {children}
//     </button>
//   );
// };

export default StyledButton;
