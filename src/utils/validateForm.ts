import { FormState } from "../store/formSlice";
import humanizeString from "./humanizeFieldName";
import { validationRequirements } from "./validationRequirements";

export const validateForm = (formData: FormState) => {
  const humanizeFieldName = (fieldName: string) => {
    const source = [
      { replace: "selected_unit", with: "suite_or_unit_number" },
      { replace: "selected_address", with: "address" },
      { replace: "signature_image", with: "signature" },
      { replace: "signature_text", with: "signature" },
    ];

    const substitution = source.find(
      (sourceItem) => sourceItem.replace === fieldName,
    );

    return humanizeString(substitution?.with ?? fieldName);
  };

  const pageValidations: any = [];
  validationRequirements.forEach((requirement, index) => {
    const fieldErrors: Array<string> = JSON.parse("[]");
    let allFieldsValid: boolean = true;
    requirement.fields.forEach((field: any) => {
      if (field.conditional) {
        if (formData[field.conditional] === field.value) {
          const present =
            field &&
            field.id &&
            formData &&
            formData[field.id] &&
            (formData[field.id] as any) > "";

          let length;
          if (field && field.id && field.length) {
            length =
              field &&
              field.id &&
              field.length &&
              formData &&
              formData[field.id] &&
              (formData[field.id] as any).length === field.length;
          }

          if (field && field.id && !field.length) {
            // length field is not required
            length = true;
          }

          // check for empty string
          if (!present || !length) {
            fieldErrors.push(field.id);
            allFieldsValid = false;
          }

          if (field.format) {
            switch (field.format) {
              case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData[field.id] as string)) {
                  fieldErrors.push(field.id);
                  allFieldsValid = false;
                }
                break;
              case "phone":
                const phoneRegex =
                  /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
                if (!phoneRegex.test(formData[field.id] as string)) {
                  fieldErrors.push(field.id);
                  allFieldsValid = false;
                }
                break;
            }
          }
        } else if (
          formData[field.conditional] &&
          formData[field.conditional] !== field.value &&
          field.value !== ""
        ) {
          // allFieldsValid = true;
        } else {
          fieldErrors.push(field.id);
          allFieldsValid = false;
        }
      } else {
        if (field.name === "signature_image") {
          const signaturePresent =
            (formData.signature_image as string) > "" ||
            (formData.signature_text as string) > "";

          if (!signaturePresent) {
            fieldErrors.push("signature");
            allFieldsValid = false;
          }
          return;
        }
        if (
          !formData[field.name] ||
          (formData[field.name] &&
            formData[field.name] === "" &&
            field.format === undefined)
        ) {
          fieldErrors.push(field.name);
          allFieldsValid = false;
        } else {
          if (field.format) {
            switch (field.format) {
              case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData[field.name] as string)) {
                  fieldErrors.push(field.name);
                  allFieldsValid = false;
                }
                break;
              case "phone":
                const phoneRegex =
                  /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
                if (!phoneRegex.test(formData[field.name] as string)) {
                  fieldErrors.push(field.name);
                  allFieldsValid = false;
                }
                break;
            }
          }
        }
      }
    });

    pageValidations.push({
      ...requirement,
      valid: allFieldsValid,
      errors: fieldErrors.map((field: string) => humanizeFieldName(field)),
    });
  });

  return pageValidations;
};
