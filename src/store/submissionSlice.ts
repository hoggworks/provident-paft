import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SubmissionState {
  [key: string]: string | string[] | undefined | null | boolean;
  submitting: boolean;
  submitted: boolean;
  error: string | null;
}

export const emptySubmission: SubmissionState = {
  submitting: false,
  submitted: false,
  error: null,
};

const getInitialState = (): SubmissionState => {
  const savedData = localStorage.getItem("paftSubmissionData");
  if (savedData) {
    return JSON.parse(savedData);
  }
  return JSON.parse(JSON.stringify(emptySubmission)) as SubmissionState;
};

const submissionSlice = createSlice({
  name: "submission",
  initialState: getInitialState(),
  reducers: {
    updateField: (
      state,
      action: PayloadAction<{
        field: keyof SubmissionState;
        value: string | boolean;
      }>,
    ) => {
      const { field, value } = action.payload;
      if (field !== "pageVisited") {
        state[field] = value;
      }
      try {
        localStorage.setItem("paftSubmissionData", JSON.stringify(state));
      } catch (error) {}
    },
    clearSubmission: (state) => {
      localStorage.removeItem("paftSubmissionData");
    },
  },
});

export const { updateField, clearSubmission } = submissionSlice.actions;
export default submissionSlice.reducer;
