import React, { useState } from "react";
import {
  Button, Stack, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../lib/store/hooks";
import { selectGoalForm, updateGoalFormState } from "../../lib/goals/goalFormSlice";
import { Goal } from "../../lib/budget/models";
import CurrencyTextInput from "./CurrencyTextInput";
import FormSelect from "./FormSelect";
import { useListCategoriesQuery, useListTagsQuery } from "../../lib/budget/budgetAPI";
import {
  selectOptionsFromCategories, optionFromCategoryName, optionsFromTagName, selectOptionsFromTags,
} from "./selectUtils";

type GoalFormProps = {
  onClickSave: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onClickSave }) => {
  const dispatch = useAppDispatch();
  const { goal } = useAppSelector(selectGoalForm);

  const [goalType, setGoalType] = useState("category");

  const handleGoalTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateGoalFormState({ goal: { category: undefined, tag: undefined } }));
    setGoalType((event.target as HTMLInputElement).value);
  };

  const updateGoal = (g: Goal) => {
    dispatch(updateGoalFormState({ goal: g }));
  };

  const { data: categories, isLoading: isCategoriesLoading } = useListCategoriesQuery();
  const categoryOptions = selectOptionsFromCategories(categories);

  const { data: tags, isLoading: isTagsLoading } = useListTagsQuery();
  const tagOptions = selectOptionsFromTags(tags);

  const formControlSx = { m: 1, minWidth: 120 };

  return (
    <>
      <Button onClick={() => onClickSave()}>
        Save
      </Button>
      <Stack sx={{ mt: 1 }}>
        <FormControl>
          <FormLabel>Goal type</FormLabel>
          <RadioGroup
            row
            value={goalType}
            onChange={handleGoalTypeChange}
          >
            <FormControlLabel value="category" control={<Radio />} label="Category" />
            <FormControlLabel value="tag" control={<Radio />} label="Tag" />
          </RadioGroup>
        </FormControl>
        {!isCategoriesLoading && goalType === "category"
        && (
        <FormControl sx={formControlSx}>
          <FormSelect
            label="Category"
            initialValue={optionFromCategoryName(goal.category, categoryOptions)}
            options={categoryOptions ?? []}
            onChange={(option) => {
              if (!(option instanceof Array)) {
                updateGoal({ ...goal, category: option?.value ?? "" });
              }
            }}
          />
        </FormControl>
        )}
        {!isTagsLoading && goalType === "tag"
        && (
        <FormControl sx={formControlSx}>
          <FormSelect
            label="Tag"
            initialValue={optionsFromTagName(goal.tag, tagOptions)}
            options={tagOptions ?? []}
            onChange={(option) => {
              if (!(option instanceof Array)) {
                updateGoal({ ...goal, tag: option?.value ?? "" });
              }
            }}
          />
        </FormControl>
        )}
        <FormControl sx={formControlSx}>
          <CurrencyTextInput
            label="Amount per month"
            initialValue={goal.amount}
            onChange={(value) => updateGoal({ ...goal, amount: value })}
          />
        </FormControl>
      </Stack>
    </>
  );
};

export default GoalForm;
