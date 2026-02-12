import { withPrefix } from "../utils/withPrefix";

export const FooterWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={withPrefix("mt-4 w-full pt-4 pl-0 pr-0 pb-6 flex gap-2")}>
      {children}
    </div>
  );
};
