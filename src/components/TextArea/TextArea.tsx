import React from "react";
import styles from "./TextArea.module.scss";
import { Card } from "../index";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  setValue: (value: any) => void;
  placeholder: string;
}

const TextArea: React.FC<Props> = ({
  value,
  setValue,
  placeholder,
  ...rest
}) => {
  return (
    <Card flex="column">
      <textarea
        className={styles.textArea}
        placeholder={placeholder || "Enter a project"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        {...rest}
      />
    </Card>
  );
};

export default TextArea;
