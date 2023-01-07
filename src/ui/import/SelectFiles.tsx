import { ChangeEvent } from "react";
import { Stack, Button, Typography } from "@mui/material";
import { parseFiles } from "../../lib/import/importSlice";
import { useAppDispatch } from "../../lib/store/hooks";

const SelectFiles = () => {
  const dispatch = useAppDispatch();
  const onUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      dispatch(parseFiles(e.target.files));
    }
  };
  return (
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-around">
        <Typography>
          Select CSV files to import.
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-around">
        <Button color="secondary" variant="contained" component="label">
          Select files
          <input hidden multiple accept="text/csv" type="file" onChange={onUploadChange} />
        </Button>
      </Stack>
    </Stack>
  );
};

export default SelectFiles;
