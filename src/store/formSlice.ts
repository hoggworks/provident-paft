import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FormState {
  [key: string]: string | string[] | undefined;
  occupancy_type: "TENANT" | "HOME_OWNER" | "";
  occupancy_day: string;
  occupancy_month: string;
  occupancy_year: string;
  selected_address: string;
  selected_unit: string;
  first_name: string;
  last_name: string;
  business_name: string;
  email: string;
  payment_mode: string;
  pageVisited: string[];
  accept_preauth_terms_and_conditions?: string;
  accept_terms_and_conditions: string;
  void_cheque_image: string;
  branch_transit_number: string;
  financial_institution_number: string;
  bank_account_number: string;
  verify_entered_information?: string;
  signature_image: string;
  submission_id: string;
}

export const emptyForm: FormState = {
  selected_address: "",
  selected_unit: "",
  occupancy_type: "",
  occupancy_day: "",
  occupancy_month: "",
  occupancy_year: "",
  first_name: "",
  last_name: "",
  business_name: "",
  email: "",
  location_id: "",
  payment_mode: "",
  pageVisited: [],
  accept_preauth_terms_and_conditions: "",
  accept_terms_and_conditions: "",
  void_cheque_image: "",
  branch_transit_number: "",
  financial_institution_number: "",
  bank_account_number: "",
  verify_entered_information: "",
  signature_image: "",
  submission_id: "",
};

const getInitialState = (): FormState => {
  const savedData = localStorage.getItem("paftFormData");
  if (savedData) {
    return JSON.parse(savedData);
  }
  return JSON.parse(JSON.stringify(emptyForm)) as FormState;
};

const formSlice = createSlice({
  name: "form",
  initialState: getInitialState(),
  reducers: {
    updateField: (
      state,
      action: PayloadAction<{ field: keyof FormState; value: string }>,
    ) => {
      const { field, value } = action.payload;
      if (field !== "pageVisited") {
        state[field] = value;
      }
      try {
        localStorage.setItem("paftFormData", JSON.stringify(state));
      } catch (error) {}
    },
    clearForm: (state) => {
      localStorage.removeItem("paftFormData");
      localStorage.removeItem("paftSubmissionData");
    },
    addPageVisit: (state, action: PayloadAction<string>) => {
      if (!state.pageVisited.includes(action.payload)) {
        state.pageVisited.push(action.payload);
        localStorage.setItem("paftFormData", JSON.stringify(state));
      }
    },
  },
});

export const { updateField, clearForm, addPageVisit } = formSlice.actions;
export default formSlice.reducer;
