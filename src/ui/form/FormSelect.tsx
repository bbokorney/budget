import React, { useState } from "react";
import {
  Autocomplete, TextField,
} from "@mui/material";

export type FormSelectOption ={
  id: string;
  value: string;
  displayValue: string;
}

export type FormSelectProps = {
  label?: string
  initialValue?: FormSelectOption | null
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: FormSelectOption | null) => void;
  options?: FormSelectOption[];
}

const FormSelect: React.FC<FormSelectProps> = ({
  label, initialValue,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  onChange: onChangeCallback = (_: FormSelectOption | null) => {},
  options = [],
}) => {
  const [value, setValue] = useState<FormSelectOption | null>(initialValue ?? null);
  const onChange = (_: React.SyntheticEvent, newValue: FormSelectOption | null) => {
    setValue(newValue);
    onChangeCallback(newValue);
  };

  return (
    <Autocomplete
      disablePortal
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
