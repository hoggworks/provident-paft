import { useDispatch } from "react-redux";
import { addPageVisit } from "../store/formSlice";
import { Button } from "./button";
import { withPrefix } from "../utils/withPrefix";

function NavButton({
  action,
  label,
  disabled,
  outline,
  currentPage,
  disabledButClickable,
}: {
  action: Function;
  label: string;
  disabled?: boolean;
  currentPage?: string;
  outline?: boolean;
  fullWidth?: string;
  disabledButClickable?: boolean;
}) {
  const dispatch = useDispatch();
  return (
    <Button
      color={"brand"}
      {...((outline as any) && { outline })}
      onClick={() => {
        action();
        if (disabledButClickable) {
          setTimeout(() => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          }, 100);
        }
        dispatch(addPageVisit(currentPage as string));
      }}
      className={withPrefix(`w-full !rounded-full !font-normal !text-sm`)}
    >
      {label}
    </Button>
  );
}

export default NavButton;
