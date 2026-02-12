import { useDispatch, useSelector } from "react-redux";
import { clearForm } from "./store/formSlice";
import { clearSubmission, updateField } from "./store/submissionSlice";
import { RootState } from "./store/store";
import NavButton from "./components/NavButton";
import { useNavigate } from "react-router";

import { withPrefix } from "./utils/withPrefix";
import { Button } from "./components/button";
import { useEffect, useRef, useState } from "react";
import { submitForm } from "./utils/submitForm";
import { FooterWrapper } from "./components/FooterWrapper";
import { requestPDF } from "./utils/requestPDF";

function FormPage7() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasSubmitted = useRef(false);
  const formData = useSelector((state: RootState) => state.form);
  const submissionData = useSelector((state: RootState) => state.submission);
  const [pdfDownloadError, setPdfDownloadError] = useState<string | null>(null);

  const { submitted, error } = submissionData;

  useEffect(() => {
    // submit form
    if (
      !submitted &&
      formData &&
      formData.location_id !== "" &&
      !hasSubmitted.current &&
      document.hasFocus() &&
      !document.hidden
    ) {
      doSubmitForm();
      hasSubmitted.current = true;
    }
  }, [submitted, formData]);

  const doSubmitForm = async () => {
    try {
      const submission = await submitForm(formData);

      if (submission.result === true) {
        dispatch(
          updateField({
            field: "submission_id",
            value: submission.submissionId,
          }),
        );
        dispatch(updateField({ field: "submitted", value: true }));
      } else {
        dispatch(updateField({ field: "error", value: submission.error }));
      }
    } catch (error) {
      dispatch(updateField({ field: "error", value: error as string }));
    }
  };

  if (!submitted && !error) {
    return (
      <div className={withPrefix("p-4 w-full max-w-[400px] m-auto pb-24")}>
        <h2 className={withPrefix("py-4 text-2xl")}>Submitting Agreement...</h2>
        <main> </main>
      </div>
    );
  }

  if (!submitted && error) {
    return (
      <div className={withPrefix("p-4 w-full max-w-[400px] m-auto pb-24")}>
        <h2 className={withPrefix("py-4 text-2xl")}>Submission Error</h2>
        <div className={withPrefix("mb-4")}>
          <div className={withPrefix("mt-4 mb-4")}>
            There was a problem submitting your agreement. Please go back and
            try again.
          </div>
        </div>
        <div className={withPrefix("mt-4")}>
          <FooterWrapper>
            <NavButton
              outline={true}
              action={() => {
                dispatch(clearForm());
                dispatch(clearSubmission());
                navigate("/");
              }}
              label={"Start Over"}
              currentPage=""
            />
          </FooterWrapper>
        </div>
      </div>
    );
  }

  return (
    <div className={withPrefix("p-4 w-full max-w-[400px] m-auto pb-24")}>
      <h2 className={withPrefix("py-4 text-2xl")}>Submission Complete</h2>
      <main>
        <div className={withPrefix("mb-4")}>
          <h3>
            Thanks for completing the Customer Service Agreement with Provident
            Energy Management Inc.
          </h3>
          <div className={withPrefix("mb-4 mt-4")}>
            A copy of this contract will be sent to{" "}
            <strong>{formData.email}</strong>.
          </div>
        </div>

        <div className={withPrefix("flex gap-2 mt-8")}>
          <Button
            onClick={async () => {
              console.log("clicking");
              console.log(submissionData);
              setPdfDownloadError(null);
              try {
                // Check if we have a PDF blob from the new API response
                if (submissionData && submissionData.submission_id) {
                  await requestPDF(submissionData.submission_id);
                }
              } catch (error) {
                const errorMessage =
                  error instanceof Error ? error.message : String(error);
                setPdfDownloadError(errorMessage);
              }
            }}
          >
            Download PDF
          </Button>
          {pdfDownloadError && (
            <div className={withPrefix("text-(--validation-error-color)")}>
              Error downloading PDF: {pdfDownloadError}
            </div>
          )}
        </div>
      </main>
      <div className={withPrefix("mt-4")}>
        <FooterWrapper>
          <NavButton
            outline={true}
            action={() => {
              dispatch(clearForm());
              dispatch(clearSubmission());
              navigate("/");
            }}
            label={"Start Over"}
            currentPage=""
          />
        </FooterWrapper>
      </div>
    </div>
  );
}

export default FormPage7;
