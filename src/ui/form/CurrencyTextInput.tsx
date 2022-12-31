import React, { useState } from "react";
import { TextField } from "@mui/material";
import { formatWholeNumbers } from "../../lib/currency/format";

export type CurrencyTextInputProps = {
  label?: string;
  initialValue?: number;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: number) => void;
}

const CurrencyTextInput: React.FC<CurrencyTextInputProps> = ({
  label, initialValue,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  onChange: onChangeCallback = (_: number) => {},
}) => {
  const validDigitKeys = Array(10).fill(0).map((_, index) => index.toString());
  const [value, setValue] = useState(initialValue ? initialValue.toFixed(2) : "");
  const [error, setError] = useState("");
  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let newValue = value;
    if (e.key === "Backspace") {
      newValue = value.toString().substring(0, value.toString().length - 1);
    } else if (e.key === ".") {
      newValue = `${value.toString()}.`;
    } else if (validDigitKeys.includes(e.key)) {
      if (!(value.split(".").length === 2 && value.split(".")[1].length === 2)) {
        newValue += e.key;
      }
    }
    newValue = newValue.replaceAll(",", "");
    const parsed = parseFloat(newValue);
    if (Number.isNaN(parsed)) {
      setError("Amount must be a positive number");
    } else {
      if (parsed <= 0) {
        setError("Amount must be a positive number");
        return;
      }

      const wholeNumbers = newValue.split(".")[0];
      const wholeNumbersFormatted = formatWholeNumbers(wholeNumbers);

      let suffix = "";
      const tokens = newValue.split(".");
      if (tokens.length === 2) {
        suffix = `.${tokens[1]}`;
      }

      newValue = `${wholeNumbersFormatted}${suffix}`;
      setError("");
      onChangeCallback(parsed);
    }

    setValue(newValue);
  };

  const onBlur = () => {
    const newValue = value.replaceAll(",", "");
    const tokens = newValue.split(".");
    setValue(`${formatWholeNumbers(tokens[0])
    }.${parseFloat(newValue).toFixed(2).split(".")[1]}`);
  };

  return (
    <TextField
      label={label}
      error={error !== ""}
      inputProps={{ inputMode: "decimal" }}
      variant="outlined"
      value={value !== "" ? `$ ${value}` : ""}
      helperText={error}
      placeholder="$ 0.00"
      onKeyUp={onKeyUp}
      onBlur={onBlur}
    />
  );
};

export default CurrencyTextInput;