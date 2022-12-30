import React, { useState } from "react";
import {
  InputLabel, Select, SelectChangeEvent,
  MenuItem,
} from "@mui/material";

export type FormSelectOption ={
  id: string;
  value: string;
  displayValue: string;
}

export type FormSelectProps = {
  label?: string
  initialValue?: string
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void;
  options?: FormSelectOption[];
}

const FormSelect: React.FC<FormSelectProps> = ({
  label, initialValue,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  onChange: onChangeCallback = (_: string) => {},
  options,
}) => {
  const [value, setValue] = useState(initialValue);
  const onChange = (event: SelectChangeEvent) => {
    const fieldVal = event.target.value;
    setValue(fieldVal);
    onChangeCallback(fieldVal);
  };
  return (
    <>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={onChange}
      >
        {options && options.map((o) => <MenuItem key={o.id} value={o.value}>{o.displayValue}</MenuItem>)}
      </Select>
    </>
  );
};

export default FormSelect;
