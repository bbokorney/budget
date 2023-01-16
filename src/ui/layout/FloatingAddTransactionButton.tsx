import { Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "../../lib/store/hooks";
import { updateFormDialogState } from "../../lib/formDialog/formDialogSlice";

const FloatingAddTransactionButton = () => {
  const location = useLocation();
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
        display: location.pathname.startsWith("/settings") ? "none" : "",
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
