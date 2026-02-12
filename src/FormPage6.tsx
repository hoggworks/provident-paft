import { useDispatch, useSelector } from "react-redux";
import { updateField } from "./store/formSlice";
import { RootState } from "./store/store";
import NavButton from "./components/NavButton";
import { useNavigate } from "react-router";
import SignatureCanvas from "react-signature-canvas";
import { useEffect, useRef, useState } from "react";
import { withPrefix } from "./utils/withPrefix";
import { isPageValid } from "./utils/isPageValid";
import { useMeasure } from "react-use";
import { AllFieldsRequiredMessage } from "./components/AllFieldsRequiredMessage";
import { Checkbox, CheckboxField } from "./components/checkbox";
import { Button } from "./components/button";
import { FooterWrapper } from "./components/FooterWrapper";
import { WrappedInput } from "./components/WrappedInput";
import { FormCheckbox } from "./components/formControls";

function FormPage6() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formData = useSelector((state: RootState) => state.form);
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [showValidationError, setShowValidationError] =
    useState<boolean>(false);
  const pageIsValid = isPageValid("/page6");
  const [announceKey, setAnnounceKey] = useState<number>(0);
  const clearForm = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      dispatch(updateField({ field: "signature_image", value: "" }));
    }
  };
  const [signatureMethod, setSignatureMethod] = useState<"draw" | "type">(
    formData.signature_method === "draw" || formData.signature_method === "type"
      ? formData.signature_method
      : formData.signature_text
        ? "type"
        : "draw",
  );
  useEffect(() => {
    if (!formData.signature_method) {
      dispatch(
        updateField({ field: "signature_method", value: signatureMethod }),
      );
    }
  }, [dispatch, formData.signature_method, signatureMethod]);
  const [containerRef, { width, height }] = useMeasure();

  const redrawSignature = () => {
    if (formData.signature_image && sigCanvas.current) {
      sigCanvas.current.clear();
      const img = new window.Image();
      img.addEventListener("load", function () {
        sigCanvas.current?.getCanvas().getContext("2d")?.drawImage(img, 0, 0);
      });
      img.setAttribute("src", formData.signature_image);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setTimeout(redrawSignature, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [formData.signature_image]);

  useEffect(() => {
    const timeoutId = setTimeout(redrawSignature, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={withPrefix("p-4 w-full max-w-[400px] m-auto pb-24")}>
      <h2 className={withPrefix("py-4 text-2xl")}>Signature</h2>
      <main>
        <div>
          By typing your name in the fields below, you are legally signing this
          digital form.
        </div>
        <div className={withPrefix("mt-4")}>
          <fieldset>
            <legend className={withPrefix("font-bold mb-2")}>
              Signature method
            </legend>
            <div className={withPrefix("flex gap-4 text-sm")}>
              <label className={withPrefix("inline-flex items-center gap-2")}>
                <input
                  type="radio"
                  name="signature-method"
                  value="draw"
                  checked={signatureMethod === "draw"}
                  onChange={() => {
                    setSignatureMethod("draw");
                    dispatch(
                      updateField({ field: "signature_method", value: "draw" }),
                    );
                    dispatch(
                      updateField({ field: "signature_text", value: "" }),
                    );
                  }}
                />
                Draw signature
              </label>
              <label className={withPrefix("inline-flex items-center gap-2")}>
                <input
                  type="radio"
                  name="signature-method"
                  value="type"
                  checked={signatureMethod === "type"}
                  onChange={() => {
                    setSignatureMethod("type");
                    dispatch(
                      updateField({ field: "signature_method", value: "type" }),
                    );
                    sigCanvas.current?.clear();
                    dispatch(
                      updateField({ field: "signature_image", value: "" }),
                    );
                  }}
                />
                Type signature
              </label>
            </div>
          </fieldset>
        </div>
        {signatureMethod === "type" && (
          <div className={withPrefix("mt-4")}>
            <label
              htmlFor="typed-signature"
              className={withPrefix("font-bold")}
            >
              Typed Signature
            </label>
            <WrappedInput
              id="typed-signature"
              showSearch={false}
              invalid={
                showValidationError &&
                !formData.signature_text &&
                formData.signature_image === ""
              }
              type="text"
              name="typed-signature"
              placeholder="Type your full name"
              value={formData.signature_text || ""}
              onChange={(value: string) => {
                dispatch(updateField({ field: "signature_text", value }));
              }}
              clearAction={() => {
                dispatch(updateField({ field: "signature_text", value: "" }));
              }}
            />
          </div>
        )}

        {signatureMethod === "draw" && (
          <>
            <p
              id="signature-instructions"
              className={withPrefix("mt-4 text-sm text-gray-600")}
            >
              Draw your signature using a mouse, trackpad, or touch.
            </p>
            <div
              className={`${formData.signature_image === "" ? "sig-canvas" : ""} ${withPrefix(
                "border-1 rounded p-4 mt-4 w-full h-full min-h-[130px] mb-4",
                showValidationError && formData.signature_image === ""
                  ? "border-(--validation-error-color)"
                  : "border-gray-300",
              )} `}
              ref={containerRef as unknown as React.RefObject<HTMLDivElement>}
            >
              <SignatureCanvas
                penColor="#26aae1"
                canvasProps={{
                  width: width,
                  height: "200px",
                  className: "sigCanvas",
                }}
                onEnd={() => {
                  const base64 = sigCanvas.current?.toDataURL();
                  if (base64) {
                    dispatch(
                      updateField({
                        field: "signature_image",
                        value: base64 as string,
                      }),
                    );
                  }
                }}
                ref={sigCanvas}
              />
            </div>
            <Button color="white" onClick={clearForm}>
              Clear
            </Button>
          </>
        )}

        <CheckboxField
          className={withPrefix(
            "border-1 rounded-md pf:overflow-hidden p-2 mt-4",
            showValidationError && formData.verify_entered_information === ""
              ? "border-(--validation-error-color)"
              : "border-transparent",
          )}
        >
          <FormCheckbox
            color="green"
            name="verify_entered_information"
            value={formData.verify_entered_information}
            checked={formData.verify_entered_information == "true"}
            onChange={(checked) => {
              dispatch(
                updateField({
                  field: "verify_entered_information",
                  value: checked ? "true" : "",
                }),
              );
            }}
          />{" "}
          I verify that all information entered is correct
        </CheckboxField>
      </main>

      <div className={withPrefix("mt-4")}>
        <AllFieldsRequiredMessage
          show={showValidationError}
          id="/page6"
          announceKey={announceKey}
        />
        <FooterWrapper>
          <NavButton
            label="Submit"
            action={() => {
              if (pageIsValid) {
                navigate("/form_page7");
              } else {
                setShowValidationError(true);
                setAnnounceKey((prev) => prev + 1);
              }
            }}
            currentPage="page6"
            disabledButClickable={!pageIsValid}
          />
        </FooterWrapper>
      </div>
    </div>
  );
}

export default FormPage6;
