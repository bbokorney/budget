import { ChangeEvent } from "react";
import { Stack, Button, Typography } from "@mui/material";

const SelectFiles = () => {
  const onUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    Array(files?.length).fill(0).forEach(async (_, index) => {
      const file = files?.item(index);
      if (file) {
        console.log(file.name);
        console.log(file.type);
        const text = await file.text();
        text.split("\n").forEach((line) => {
          if (line !== "") {
            console.log(line);
          }
        });
      }
    });
  };
  return (
    <Stack>
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
