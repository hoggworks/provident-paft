import { useDispatch, useSelector } from "react-redux";
import { updateField } from "./store/formSlice";
import { RootState } from "./store/store";
import NavButton from "./components/NavButton";
import { useLocation, useNavigate } from "react-router";
import { withPrefix } from "./utils/withPrefix";
import { isPageValid } from "./utils/isPageValid";
import { AllFieldsRequiredMessage } from "./components/AllFieldsRequiredMessage";
import { useId, useState } from "react";

import { Checkbox, CheckboxField } from "./components/checkbox";
import { FooterWrapper } from "./components/FooterWrapper";

function FormPage5() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formData = useSelector((state: RootState) => state.form);
  const [showValidationError, setShowValidationError] =
    useState<boolean>(false);
  const pageIsValid = isPageValid("/page5");
  const termsCheckboxId = useId();
  const termsLabelId = useId();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const from = urlParams.get("from");
  const [announceKey, setAnnounceKey] = useState<number>(0);

  return (
    <div className={withPrefix("p-4 w-full max-w-[400px] m-auto pb-24")}>
      <h2 className={withPrefix("py-4 text-2xl")}>Terms And Conditions</h2>
      <main>
        <p>
          Provident Energy Management Inc. (“Provident”) has been retained
          pursuant to an Agreement (the “Master Agreement”) by the developer,
          the owner, the condominium corporation and/or the authorized agent, as
          applicable (the “Owner/Condominium”), of the premises in which the
          above‐noted Service Address is located and/or of premises that are
          invoiced for utilities that include utilities consumed at or by the
          above‐noted Service Address (the “Premises”) to supply the Services
          (as defined below) including meter reading, billing and collection
          services. The terms and conditions set out in this agreement comprise
          the legally binding agreement between the individual(s) named as
          Primary Account Holder and Secondary Account Holder (if any)
          (“Customer”) and Provident governing Customer’s use of the Services
          (as defined below). This Agreement is subject to Provident’s
          Conditions of Service (as applicable to the services provided by
          Provident at the Premises) (the “Conditions”), which may be accessed
          at www.pemi.com. In consideration of Provident providing the Services,
          and for other good and valuable consideration, the receipt of which is
          acknowledged by Customer, Customer acknowledges and agrees as follows:
        </p>

        <CheckboxField
          className={withPrefix(
            "border-1 rounded-md pf:overflow-hidden p-2 mt-4",
            showValidationError && formData.accept_terms_and_conditions === ""
              ? "border-(--validation-error-color)"
              : "border-transparent",
          )}
        >
          <Checkbox
            color="green"
            id={termsCheckboxId}
            aria-labelledby={termsLabelId}
            aria-label="I accept the terms and conditions of pre-auth payments"
            value={formData.accept_terms_and_conditions}
            checked={formData.accept_terms_and_conditions == "true"}
            onChange={(checked) => {
              dispatch(
                updateField({
                  field: "accept_terms_and_conditions",
                  value: checked ? "true" : "",
                }),
              );
            }}
          />
          <span id={termsLabelId} className={withPrefix("font-bold")}>
            I accept the terms and conditions of pre-auth payments
          </span>
        </CheckboxField>
      </main>
      <div className={withPrefix("mt-4")}>
        <AllFieldsRequiredMessage
          show={showValidationError}
          id="/page5"
          announceKey={announceKey}
        />
        <FooterWrapper>
          <NavButton
            label="Save and Continue"
            action={() => {
              if (pageIsValid) {
                navigate(from ? `/form_${from}` : "/form_page6");
              } else {
                setShowValidationError(true);
                setAnnounceKey((prev) => prev + 1);
              }
            }}
            currentPage="page5"
            disabledButClickable={!pageIsValid}
          />
        </FooterWrapper>
      </div>
    </div>
  );
}

export default FormPage5;
