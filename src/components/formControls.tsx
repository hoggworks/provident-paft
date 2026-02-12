import { useId } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { RadioGroup } from "./radio";
import { Checkbox } from "./checkbox";
import { withPrefix } from "../utils/withPrefix";

type RadioGroupBaseProps = ComponentPropsWithoutRef<typeof RadioGroup>;
type CheckboxBaseProps = ComponentPropsWithoutRef<typeof Checkbox>;

type FormRadioGroupProps = Omit<
  RadioGroupBaseProps,
  "name" | "aria-labelledby"
> & {
  name: string;
  label: string;
  children: ReactNode;
};

export function FormRadioGroup({
  name,
  label,
  value,
  defaultValue,
  className,
  children,
  ...props
}: FormRadioGroupProps) {
  const labelId = useId();
  const hiddenValue =
    value === undefined || value === null ? (defaultValue ?? "") : value;

  return (
    <>
      <span id={labelId} className={withPrefix("sr-only")}>
        {label}
      </span>
      <RadioGroup
        {...props}
        className={className}
        aria-labelledby={labelId}
        value={value}
        defaultValue={defaultValue}
      >
        {children}
      </RadioGroup>
      <input
        type="hidden"
        name={name}
        value={
          hiddenValue === undefined || hiddenValue === null
            ? ""
            : String(hiddenValue)
        }
      />
    </>
  );
}

type FormCheckboxProps = Omit<CheckboxBaseProps, "name"> & {
  name: string;
};

export function FormCheckbox({ name, value, ...props }: FormCheckboxProps) {
  return (
    <>
      <input
        type="hidden"
        name={name}
        value={value === undefined || value === null ? "" : String(value)}
      />
      <Checkbox {...props} value={value} />
    </>
  );
}
