import { withPrefix } from "../utils/withPrefix";
import { CloseIcon } from "./icons/CloseIcon";
import { SearchIcon } from "./icons/SearchIcon";
import { Input } from "./input";

export const WrappedInput = ({
  showSearch,
  value,
  onChange,
  clearAction,
  invalid,
  type,
  name,
  placeholder,
  id,
}: {
  showSearch?: boolean;
  value: string;
  onChange: Function;
  clearAction: Function;
  invalid?: boolean;
  type: string;
  name: string;
  placeholder?: string;
  id?: string;
}) => {
  return (
    <div
      className={withPrefix(
        `flex border shadow-md rounded-md p-1 pt-1 justify-between items-center w-full ${invalid ? "border-(--validation-error-color)" : "border-gray-300"}`,
      )}
    >
      {showSearch && (
        <div>
          <SearchIcon />
        </div>
      )}
      <Input
        id={id}
        invalid={invalid || false}
        type={type || "text"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value > "" && (
        <div
          className={withPrefix(
            "text-gray-400 rounded-full hover:text-gray-600 cursor-pointer pr-2",
          )}
          onClick={() => {
            clearAction();
          }}
        >
          <CloseIcon />
        </div>
      )}
    </div>
  );
};
