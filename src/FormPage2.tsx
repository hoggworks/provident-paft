import { useDispatch, useSelector } from "react-redux";
import { updateField } from "./store/formSlice";
import { RootState } from "./store/store";
import NavButton from "./components/NavButton";
import { useLocation, useNavigate } from "react-router";
import { withPrefix } from "./utils/withPrefix";
import { isPageValid } from "./utils/isPageValid";
import { AllFieldsRequiredMessage } from "./components/AllFieldsRequiredMessage";
import { useState } from "react";
import { validateForm } from "./utils/validateForm";
import { Field, Label } from "./components/fieldset";
import { FooterWrapper } from "./components/FooterWrapper";
import { WrappedInput } from "./components/WrappedInput";

function FormPage2() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formData = useSelector((state: RootState) => state.form);
  const [showValidationError, setShowValidationError] =
    useState<boolean>(false);
  const pageIsValid = isPageValid("/page2");
  const validatedForm = validateForm(formData).find(
    (requirement: any) => requirement.id === "/page2",
  );
  const [announceKey, setAnnounceKey] = useState<number>(0);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const from = urlParams.get("from");

  return (
    <div className={withPrefix("p-4 w-full max-w-[400px] m-auto pb-24")}>
      <h2 className={withPrefix("py-4 text-2xl")}>Primary Account Holder</h2>
      <main>
        <Field className={withPrefix("mb-4")}>
          <Label className={withPrefix("text-sm font-bold")}>First Name</Label>

          <WrappedInput
            showSearch={false}
            invalid={
              showValidationError &&
              validatedForm?.errors.includes("First Name")
            }
            type="text"
            name="first_name"
            placeholder={""}
            value={formData.first_name}
            onChange={(e: any) => {
              dispatch(
                updateField({
                  field: "first_name",
                  value: e,
                }),
              );
            }}
            clearAction={(e: any) => {
              dispatch(updateField({ field: "first_name", value: "" }));
            }}
          />
        </Field>
        <Field className={withPrefix("mb-4")}>
          <Label className={withPrefix("text-sm font-bold")}>Last Name</Label>
          <WrappedInput
            showSearch={false}
            invalid={
              showValidationError && validatedForm?.errors.includes("Last Name")
            }
            type="text"
            name="last_name"
            placeholder={""}
            value={formData.last_name}
            onChange={(e: any) => {
              dispatch(
                updateField({
                  field: "last_name",
                  value: e,
                }),
              );
            }}
            clearAction={(e: any) => {
              dispatch(updateField({ field: "last_name", value: "" }));
            }}
          />
        </Field>

        <Field className={withPrefix("mb-4")}>
          <Label className={withPrefix("text-sm font-bold")}>
            Business Name
            <br />
            <div className={withPrefix("font-normal text-gray-500 mb-1")}>
              If you wish this account be under a business enter the name below
            </div>
          </Label>
          <WrappedInput
            showSearch={false}
            invalid={
              showValidationError &&
              validatedForm?.errors.includes("Business Name")
            }
            type="text"
            name="business_name"
            placeholder={""}
            value={formData.business_name}
            onChange={(e: any) => {
              dispatch(
                updateField({
                  field: "business_name",
                  value: e,
                }),
              );
            }}
            clearAction={(e: any) => {
              dispatch(updateField({ field: "business_name", value: "" }));
            }}
          />
        </Field>

        <Field className={withPrefix("mb-4")}>
          <Label className={withPrefix("text-sm font-bold")}>
            Email Address
          </Label>
          <WrappedInput
            showSearch={false}
            invalid={
              showValidationError && validatedForm?.errors.includes("Email")
            }
            type="email"
            name="email"
            placeholder={""}
            value={formData.email}
            onChange={(e: any) => {
              dispatch(
                updateField({
                  field: "email",
                  value: e,
                }),
              );
            }}
            clearAction={(e: any) => {
              dispatch(updateField({ field: "email", value: "" }));
            }}
          />
        </Field>
      </main>
      <div className={withPrefix("mt-4")}>
        <AllFieldsRequiredMessage
          show={showValidationError}
          id="/page2"
          announceKey={announceKey}
        />
        <FooterWrapper>
          <NavButton
            label="Save and Continue"
            action={() => {
              if (pageIsValid) {
                navigate(from ? `/form_${from}` : "/form_page3");
              } else {
                setShowValidationError(true);
                setAnnounceKey((prev) => prev + 1);
              }
            }}
            currentPage="page2"
            disabledButClickable={!validatedForm.valid}
          />
        </FooterWrapper>
      </div>
    </div>
  );
}

export default FormPage2;
