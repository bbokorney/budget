import React, { useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { TextField } from "@mui/material";

export type FormDatePickerProps = {
  label?: string;
  initialValue?: Date;
  // eslint-disable-next-line no-unused-vars
  onChange?: (date: Date | null) => void;
  multiline?: boolean;
  maxRows?: number;
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({
  label, initialValue,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  onChange: onChangeCallback = (_: Date | null) => {},
}) => {
  const [value, setValue] = useState<Date | null>(initialValue ?? new Date());
  const onChange = (selectedDate: Date | null) => {
    setValue(selectedDate);
    onChangeCallback(selectedDate);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileDatePicker
        label={label}
        inputFormat="MM/dd/yyyy"
        value={value}
        onChange={onChange}
        // eslint-disable-next-line react/jsx-props-no-spreading
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default FormDatePicker;
