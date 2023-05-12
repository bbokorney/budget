import React, { useState, useEffect } from "react";
import {
  CircularProgress, List, ListItem, ListItemText, Stack, TextField, Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";

type SimpleListFormProps = {
  title: string;
  textFieldLabel: string;
  items: string[];
  isLoading: boolean;
  isUpsertSuccess: boolean;
  isUpserting: boolean;
  // eslint-disable-next-line no-unused-vars
  validateItem: (item: string) => string | undefined;
  // eslint-disable-next-line no-unused-vars
  onSaveButtonClicked: (item: string) => void;
  reset: () => void;
}

const SimpleListForm: React.FC<SimpleListFormProps> = ({
  title, textFieldLabel, items, validateItem,
  onSaveButtonClicked, reset, isUpsertSuccess, isLoading, isUpserting,
}) => {
  const [newItem, setNewItem] = useState("");
  const [validationError, setValidationError] = useState("");

  const onNewItemFieldChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newValue = event.target.value;
    setNewItem(newValue);
    const vError = validateItem(newValue);
    if (vError) {
      setValidationError(vError);
      return;
    }

    setValidationError("");
  };

  useEffect(() => {
    if (isUpsertSuccess) {
      setTimeout(() => {
        setNewItem("");
        reset();
      }, 1000);
    }
  }, [isUpsertSuccess]);

  return (
    <Stack>
      <Typography variant="h6">
        {title}
      </Typography>

      <Stack alignItems="center">
        {isLoading && <CircularProgress /> }
      </Stack>

      {items && (
        <Stack sx={{ pt: 1, width: "100%", maxWidth: 360 }}>

          <Stack direction="row" spacing={1} justifyContent="space-between">

            <TextField
              label={textFieldLabel}
              error={validationError !== ""}
              helperText={validationError}
              disabled={isLoading || isUpserting || isUpsertSuccess}
              value={newItem}
              onChange={onNewItemFieldChange}
            />

            <Stack direction="row" alignItems="center">
              <LoadingButton
                color="secondary"
                variant="contained"
                onClick={() => onSaveButtonClicked(newItem)}
                disabled={validationError !== "" || isUpsertSuccess}
                loadingPosition="start"
                startIcon={<Save />}
                loading={isUpserting}
              >
                {isUpsertSuccess ? "Saved" : "Save"}
              </LoadingButton>
            </Stack>

          </Stack>

          <List>
            {items && items
              .slice()
              .sort()
              .map((item) => (
                <ListItem key={item}>
                  <ListItemText>{item}</ListItemText>
                </ListItem>
              ))}
          </List>

        </Stack>
      )}
    </Stack>
  );
};
export default SimpleListForm;
