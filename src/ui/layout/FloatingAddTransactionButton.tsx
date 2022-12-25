import { Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch } from "../../lib/store/hooks";
import { updateFormDialogState } from "../../lib/formDialog/formDialogSlice";

const FloatingAddTransactionButton = () => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(updateFormDialogState({ open: true, actionType: "Add" }));
  };

  return (
    <Fab
      color="secondary"
      aria-label="add"
      onClick={handleClick}
      sx={{
        position: "fixed",
        bottom: "86px",
        right: "15px",
        transform: "translateZ(0px)",
        flexGrow: 1,
      }}
    >
      <Add />
    </Fab>
  );
};

export default FloatingAddTransactionButton;
