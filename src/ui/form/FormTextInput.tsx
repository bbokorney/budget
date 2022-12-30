import React, { useState } from "react";
import { TextField } from "@mui/material";

export type FormTextFieldProps = {
  label?: string;
  initialValue?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void;
  multiline?: boolean;
  maxRows?: number;
}

const FormTextField: React.FC<FormTextFieldProps> = ({
  label, initialValue,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  onChange: onChangeCallback = (_: string) => {},
  multiline, maxRows,
}) => {
  const [value, setValue] = useState(initialValue);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fieldVal = event.target.value;
    setValue(fieldVal);
    onChangeCallback(fieldVal);
  };
  return (
    <TextField
      label={label}
      multiline={multiline}
      maxRows={maxRows}
      value={value}
      onChange={onChange}
    />
  );
};

export default FormTextField;
