import React from "react";
import styles from "../Inputs.module.scss";
import { Card } from "../../index";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  setValue: (value: any) => void;
}

const Input: React.FC<InputProps> = ({
  value,
  setValue,
  placeholder,
  ...rest
}) => {
  return (
    <Card flex="column">
      <input
        className={styles.input}
        placeholder={placeholder || "Enter a project"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        {...rest}
      />
    </Card>
  );
};

export default Input;
