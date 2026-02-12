import * as Headless from "@headlessui/react";
import { useEffect } from "react";
import type React from "react";
import { Text } from "./text";
import { withPrefix } from "../utils/withPrefix";

const sizes = {
  xs: "sm:max-w-xs",
  sm: "sm:max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
};

export function Alert({
  size = "md",
  className,
  children,
  ...props
}: {
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
} & Omit<Headless.DialogProps, "as" | "className">) {
  const { open } = props;

  useEffect(() => {
    if (!open || typeof document === "undefined") {
      return;
    }
    const labelFocusGuards = () => {
      const focusGuards = document.querySelectorAll(
        "[data-headlessui-focus-guard]",
      );
      focusGuards.forEach((el, index) => {
        if (!el.getAttribute("aria-label")) {
          el.setAttribute("aria-label", `Focus guard ${index + 1}`);
        }
      });
    };

    labelFocusGuards();

    const observer = new MutationObserver(() => {
      labelFocusGuards();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [open]);

  return (
    <Headless.Dialog {...props}>
      <Headless.DialogBackdrop
        transition
        className={withPrefix(
          "fixed inset-0 flex w-screen justify-center overflow-y-auto bg-zinc-950/15 px-2 py-2 transition duration-100 focus:outline-0 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in sm:px-6 sm:py-8 lg:px-8 lg:py-16 z-[1]",
        )}
      />

      <div
        className={withPrefix(
          "fixed inset-0 w-screen overflow-y-auto pt-6 sm:pt-0 z-[2]",
        )}
      >
        <div
          className={withPrefix(
            "grid min-h-full grid-rows-[1fr_auto_1fr] justify-items-center p-8 sm:grid-rows-[1fr_auto_3fr] sm:p-4",
          )}
        >
          <Headless.DialogPanel
            transition
            className={withPrefix(
              className,
              sizes[size],
              "row-start-2 w-full rounded-2xl bg-white p-8 ring-1 shadow-lg ring-zinc-950/10 sm:rounded-2xl sm:p-6 forced-colors:outline z-[2]",
              "transition duration-100 will-change-transform data-closed:opacity-0 data-enter:ease-out data-closed:data-enter:scale-95 data-leave:ease-in",
            )}
          >
            {children}
          </Headless.DialogPanel>
        </div>
      </div>
    </Headless.Dialog>
  );
}

export function AlertTitle({
  className,
  ...props
}: { className?: string } & Omit<
  Headless.DialogTitleProps,
  "as" | "className"
>) {
  return (
    <Headless.DialogTitle
      {...props}
      className={withPrefix(
        className,
        "text-center text-base/6 font-semibold text-balance text-zinc-950 sm:text-left sm:text-sm/6 sm:text-wrap ",
      )}
    />
  );
}

export function AlertDescription({
  className,
  ...props
}: { className?: string } & Omit<
  Headless.DescriptionProps<typeof Text>,
  "as" | "className"
>) {
  return (
    <Headless.Description
      as={Text}
      {...props}
      className={withPrefix(
        className,
        "mt-2 text-center text-pretty sm:text-left",
      )}
    />
  );
}

export function AlertBody({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={withPrefix(className, "mt-4")} />;
}

export function AlertActions({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={withPrefix(
        className,
        "mt-6 flex flex-col-reverse items-center justify-end gap-3 *:w-full sm:mt-4 sm:flex-row sm:*:w-auto",
      )}
    />
  );
}
