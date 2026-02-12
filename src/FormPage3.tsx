import { useDispatch, useSelector } from "react-redux";
import { updateField } from "./store/formSlice";
import { RootState } from "./store/store";
import NavButton from "./components/NavButton";
import { useLocation, useNavigate } from "react-router";
import { useId, useState } from "react";
import { Radio, RadioField, RadioGroup } from "./components/radio";
import { Description, Label } from "./components/fieldset";
import { withPrefix } from "./utils/withPrefix";
import { Checkbox, CheckboxField } from "./components/checkbox";
import { isPageValid } from "./utils/isPageValid";
import { AllFieldsRequiredMessage } from "./components/AllFieldsRequiredMessage";
import { validateForm } from "./utils/validateForm";
import { FooterWrapper } from "./components/FooterWrapper";
import { FormRadioGroup } from "./components/formControls";

function FormPage3() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formData = useSelector((state: RootState) => state.form);
  const [showValidationError, setShowValidationError] =
    useState<boolean>(false);
  const pageIsValid = isPageValid("/page3");
  const bankingRadioId = useId();
  const bankingLabelId = useId();
  const voidChequeRadioId = useId();
  const voidChequeLabelId = useId();
  const preauthCheckboxId = useId();
  const preauthLabelId = useId();

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const from = urlParams.get("from");
  const validatedForm = validateForm(formData).find(
    (requirement: any) => requirement.id === "/page3",
  );
  const [announceKey, setAnnounceKey] = useState<number>(0);
  return (
    <div className={withPrefix("p-4 w-full max-w-[400px] m-auto pb-24")}>
      <h2 className={withPrefix("py-4 text-2xl")}>Pre-Authorized Payments</h2>
      <main>
        <div>
          <FormRadioGroup
            className={withPrefix(
              "border-1 rounded-md pf:overflow-hidden p-2 pt-0",
              showValidationError && formData.payment_mode === ""
                ? "border-(--validation-error-color)"
                : "border-transparent",
            )}
            name="payment_mode"
            label="Payment mode"
            defaultValue="provide_banking_information"
            value={formData.payment_mode}
            onChange={(e) => {
              if (e === "provide_void_cheque") {
                dispatch(
                  updateField({ field: "branch_transit_number", value: "" }),
                );
                dispatch(
                  updateField({
                    field: "financial_institution_number",
                    value: "",
                  }),
                );
                dispatch(updateField({ field: "account_number", value: "" }));
              } else {
                dispatch(
                  updateField({ field: "void_cheque_image", value: "" }),
                );
              }
              dispatch(
                updateField({
                  field: "payment_mode",
                  value: e,
                }),
              );
            }}
          >
            <RadioField>
              <Radio
                id={bankingRadioId}
                value="provide_banking_information"
                color="green"
                aria-labelledby={bankingLabelId}
                aria-label="Provide banking information"
              />
              <span id={bankingLabelId} className={withPrefix("!font-bold")}>
                Provide banking information
              </span>
              <Description className={withPrefix("text-gray-600")}>
                Customers can provide their banking information for payments.
              </Description>
            </RadioField>
            <RadioField>
              <Radio
                id={voidChequeRadioId}
                value="provide_void_cheque"
                color="green"
                aria-labelledby={voidChequeLabelId}
                aria-label="Provide a void cheque"
              />
              <span id={voidChequeLabelId} className={withPrefix("!font-bold")}>
                Provide a void cheque
              </span>
              <Description className={withPrefix("text-gray-600")}>
                Customers can provide a void cheque for payments.
              </Description>
            </RadioField>
          </FormRadioGroup>
        </div>

        <CheckboxField
          className={withPrefix(
            "border-1 rounded-md pf:overflow-hidden p-2 mt-4",
            showValidationError &&
              formData.accept_preauth_terms_and_conditions === ""
              ? "border-(--validation-error-color)"
              : "border-transparent",
          )}
        >
          <Checkbox
            color="green"
            id={preauthCheckboxId}
            aria-labelledby={preauthLabelId}
            aria-label="I accept the terms and conditions of pre-auth payments"
            value={formData.accept_preauth_terms_and_conditions}
            checked={formData.accept_preauth_terms_and_conditions === "true"}
            onChange={(checked) => {
              dispatch(
                updateField({
                  field: "accept_preauth_terms_and_conditions",
                  value: checked ? "true" : "",
                }),
              );
            }}
          />
          <span id={preauthLabelId} className={withPrefix("text-sm font-bold")}>
            I accept the terms and conditions of pre-auth payments
          </span>
        </CheckboxField>
      </main>
      <div className={withPrefix("mt-4")}>
        <AllFieldsRequiredMessage
          show={showValidationError}
          id="/page3"
          announceKey={announceKey}
        />
        <FooterWrapper>
          <NavButton
            action={() => {
              if (pageIsValid) {
                navigate(from ? `/form_${from}` : "/form_page4");
              } else {
                setShowValidationError(true);
                setAnnounceKey((prev) => prev + 1);
              }
            }}
            label={"Save and Continue"}
            currentPage="page3"
            disabledButClickable={!validatedForm.valid}
          />
        </FooterWrapper>
      </div>
    </div>
  );
}

export default FormPage3;
