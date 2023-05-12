import React, { useState } from "react";
import {
  Autocomplete, TextField,
} from "@mui/material";

export type FormSelectOption = {
  id: string;
  value: string;
  displayValue: string;
}

export type FormSelectProps = {
  label?: string
  initialValue?: FormSelectOption | FormSelectOption[] | null
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: FormSelectOption | FormSelectOption[] | null) => void;
  options?: FormSelectOption[];
  multiple?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label, initialValue,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  onChange: onChangeCallback = (_: FormSelectOption | FormSelectOption[] | null) => {},
  options = [], multiple = false,
}) => {
  const [value, setValue] = useState<FormSelectOption | FormSelectOption[] | null>(initialValue ?? null);
  const onChange = (_: React.SyntheticEvent, newValue: FormSelectOption | FormSelectOption[] | null) => {
    setValue(newValue);
    onChangeCallback(newValue);
  };

  return (
    <Autocomplete
      disablePortal
      multiple={multiple}
      options={options}
      getOptionLabel={(option: FormSelectOption) => option.value}
      isOptionEqualToValue={(option, selectedValue) => option.id === selectedValue.id}
      // eslint-disable-next-line react/jsx-props-no-spreading
      renderInput={(params) => <TextField {...params} label={label} />}
      value={value}
      onChange={onChange}
      placeholder="Category"
    />
  );
};

export default FormSelect;
