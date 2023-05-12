import { Typography } from "@mui/material";
import GoalForm from "../../ui/form/GoalForm";

const Add = () => {
  const onClickSave = async () => {
    console.log("save");
  };

  return (
    <>
      <Typography variant="h6">
        Add spending goal
      </Typography>
      <GoalForm onClickSave={onClickSave} />
    </>
  );
};

export default Add;
