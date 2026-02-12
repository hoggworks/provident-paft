import { useDispatch, useSelector } from "react-redux";
import { updateField } from "./store/formSlice";
import { RootState } from "./store/store";
import NavButton from "./components/NavButton";
import { useLocation, useNavigate } from "react-router";
import { withPrefix } from "./utils/withPrefix";
import { isPageValid } from "./utils/isPageValid";
import { useState } from "react";
import { AllFieldsRequiredMessage } from "./components/AllFieldsRequiredMessage";
import { Input } from "./components/input";
import { validateForm } from "./utils/validateForm";
import { Field, Label } from "./components/fieldset";
import { Button } from "./components/button";
import { FooterWrapper } from "./components/FooterWrapper";
import { WrappedInput } from "./components/WrappedInput";
import { CloudArrowUpIcon } from "./components/icons/CloudArrowUpIcon";
import { set } from "lodash";

function FormPage4() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formData = useSelector((state: RootState) => state.form);
  const [voidChequeImageError, setVoidChequeImageError] =
    useState<boolean>(false);
  const [showValidationError, setShowValidationError] =
    useState<boolean>(false);
  const pageIsValid = isPageValid("/page4");
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const from = urlParams.get("from");
  const [announceKey, setAnnounceKey] = useState<number>(0);

  const validatedForm = validateForm(formData).find(
    (requirement: any) => requirement.id === "/page4",
  );

  return (
    <div className={withPrefix("p-4 w-full max-w-[400px] m-auto pb-24")}>
      {formData.payment_mode === "" && (
        <div className={withPrefix("mb-4")}>
          <h2 className={withPrefix("py-4 text-2xl")}>Payment Mode Required</h2>
          <main>
            <NavButton
              outline={true}
              action={() => navigate("/form_page4")}
              label="Select Payment Mode"
              fullWidth="false"
            />
          </main>
        </div>
      )}
      {formData.payment_mode === "provide_banking_information" && (
        <div>
          <h2 className={withPrefix("py-4 text-2xl")}>
            Provide Banking Information
          </h2>
          <main>
            <Field className={withPrefix("mb-4")}>
              <Label className={withPrefix("text-sm font-bold")}>
                Branch Transit Number
              </Label>
              <WrappedInput
                showSearch={false}
                invalid={
                  showValidationError &&
                  validatedForm?.errors.includes("Branch Transit Number")
                }
                type="number"
                name="branch_transit_number"
                placeholder={"5-digit Branch Transit Number"}
                value={formData.branch_transit_number}
                onChange={(e: any) => {
                  if (e.length <= 5)
                    dispatch(
                      updateField({
                        field: "branch_transit_number",
                        value: e,
                      }),
                    );
                }}
                clearAction={(e: any) => {
                  dispatch(
                    updateField({ field: "branch_transit_number", value: "" }),
                  );
                }}
              />
            </Field>
            <Field className={withPrefix("mb-4")}>
              <Label className={withPrefix("text-sm font-bold")}>
                Financial Institution Number
              </Label>
              <WrappedInput
                showSearch={false}
                invalid={
                  showValidationError &&
                  validatedForm?.errors.includes("Financial Institution Number")
                }
                type="number"
                name="financial_institution_number"
                placeholder={"3-digit Financial Institution Number"}
                value={formData.financial_institution_number}
                onChange={(e: any) => {
                  if (e.length <= 3)
                    dispatch(
                      updateField({
                        field: "financial_institution_number",
                        value: e,
                      }),
                    );
                }}
                clearAction={(e: any) => {
                  dispatch(
                    updateField({
                      field: "financial_institution_number",
                      value: "",
                    }),
                  );
                }}
              />
            </Field>
            <Field className={withPrefix("mb-4")}>
              <Label className={withPrefix("text-sm font-bold")}>
                Bank Account Number
              </Label>
              <WrappedInput
                showSearch={false}
                invalid={
                  showValidationError &&
                  validatedForm?.errors.includes("Bank Account Number")
                }
                type="number"
                name="bank_account_number"
                placeholder={"7-digit Bank Account Number"}
                value={formData.bank_account_number}
                onChange={(e: any) => {
                  if (e.length <= 7)
                    dispatch(
                      updateField({
                        field: "bank_account_number",
                        value: e,
                      }),
                    );
                }}
                clearAction={(e: any) => {
                  dispatch(
                    updateField({ field: "bank_account_number", value: "" }),
                  );
                }}
              />
            </Field>
          </main>
        </div>
      )}

      {formData.payment_mode === "provide_void_cheque" && (
        <div>
          <h2 className={withPrefix("py-4 text-2xl")}>Upload a Void Cheque</h2>
          <main>
            <div className={withPrefix("mt-2 mb-4 pf:text-gray-600")}>
              Upload a picture of a void cheque from your camera roll or take a
              picture of a void cheque with you camera.
            </div>

            {(!formData.void_cheque_image ||
              (formData.void_cheque_image &&
                formData.void_cheque_image === "")) && (
              <div className={withPrefix("flex justify-center")}>
                <button
                  type="button"
                  className={withPrefix(
                    "border-2 border-gray-300 rounded-xl p-4 w-[200px] pf:bg-gray-100 text-center text-gray-600 flex flex-col  items-center justify-center cursor-pointer",
                  )}
                  onClick={() => {
                    const fileInput = document.querySelector(
                      'input[name="void_cheque"]',
                    ) as HTMLInputElement;
                    fileInput.click();
                  }}
                >
                  <CloudArrowUpIcon />
                  Click here to select an image or take a picture
                </button>
              </div>
            )}
            <Input
              invalid={
                showValidationError &&
                validatedForm?.errors.includes("Provide Void Cheque")
              }
              id="void_cheque_input"
              aria-label="Upload a void cheque image"
              type="file"
              className={withPrefix("hidden")}
              name="void_cheque"
              placeholder="Upload your void cheque"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) {
                  setVoidChequeImageError(true);
                  return;
                }
                if (file.type !== "image/jpeg" && file.type !== "image/png") {
                  setVoidChequeImageError(true);
                  return;
                }
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    if (reader.result) {
                      const imageData = reader.result.toString();
                      if (!imageData || file.size > 1500000) {
                        if (file.size > 1500000) {
                          const img = new Image();
                          img.onload = () => {
                            const canvas = document.createElement("canvas");
                            const ctx = canvas.getContext("2d");
                            if (!ctx) return;

                            const scaleFactor = Math.sqrt(1500000 / file.size);
                            canvas.width = img.width * scaleFactor;
                            canvas.height = img.height * scaleFactor;

                            ctx.drawImage(
                              img,
                              0,
                              0,
                              canvas.width,
                              canvas.height,
                            );
                            canvas.toBlob(
                              (blob) => {
                                if (blob && blob.size <= 1500000) {
                                  const resizedReader = new FileReader();
                                  resizedReader.onloadend = () => {
                                    if (resizedReader.result) {
                                      dispatch(
                                        updateField({
                                          field: "void_cheque_image",
                                          value:
                                            resizedReader.result.toString(),
                                        }),
                                      );
                                      setVoidChequeImageError(false);
                                    }
                                  };
                                  resizedReader.readAsDataURL(blob);
                                } else {
                                  setVoidChequeImageError(true);
                                }
                              },
                              "image/jpeg",
                              0.9,
                            );
                          };
                          img.src = imageData;
                        } else {
                          setVoidChequeImageError(true);
                        }
                      } else {
                        dispatch(
                          updateField({
                            field: "void_cheque_image",
                            value: imageData,
                          }),
                        );
                        setVoidChequeImageError(false);
                      }
                    }
                  };
                  reader.readAsDataURL(file);
                }

                // load image data from this file
              }}
            />

            {formData.void_cheque_image && formData.void_cheque_image > "" && (
              <div>
                <div className={withPrefix("max-w-full h-auto")}>
                  <img
                    alt={"Uploaded void cheque"}
                    className={withPrefix("object-contain")}
                    src={formData.void_cheque_image}
                  />
                </div>
              </div>
            )}
            {formData.payment_mode === "provide_void_cheque" &&
              formData.void_cheque_image > "" && (
                <div className={withPrefix("justify-end flex mt-4")}>
                  <Button
                    outline={true}
                    onClick={() => {
                      dispatch(
                        updateField({
                          field: "void_cheque_image",
                          value: "",
                        }),
                      );
                      const fileInput = document.querySelector(
                        'input[name="void_cheque"]',
                      ) as HTMLInputElement;
                      fileInput.click();
                    }}
                  >
                    Replace Image
                  </Button>
                </div>
              )}
          </main>
        </div>
      )}

      <div className={withPrefix("mt-4")}>
        <AllFieldsRequiredMessage
          show={showValidationError}
          id="/page4"
          announceKey={announceKey}
        />
        <FooterWrapper>
          <NavButton
            action={() => {
              console.log(formData.payment_mode);
              if (pageIsValid) {
                if (formData.payment_mode === "provide_banking_information") {
                  dispatch(
                    updateField({
                      field: "void_cheque_image",
                      value: "",
                    }),
                  );
                } else if (formData.payment_mode === "provide_void_cheque") {
                  dispatch(
                    updateField({
                      field: "branch_transit_number",
                      value: "",
                    }),
                  );
                  dispatch(
                    updateField({
                      field: "bank_account_number",
                      value: "",
                    }),
                  );
                  dispatch(
                    updateField({
                      field: "financial_institution_number",
                      value: "",
                    }),
                  );
                }
                navigate(from ? `/form_${from}` : "/form_page5");
              } else {
                setShowValidationError(true);
                setAnnounceKey((prev) => prev + 1);
              }
            }}
            label={"Save and Continue"}
            currentPage="page4"
            disabledButClickable={!pageIsValid}
          />
        </FooterWrapper>
      </div>
    </div>
  );
}

export default FormPage4;
