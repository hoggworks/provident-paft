import { useLocation, useNavigate } from "react-router";

import NavButton from "./components/NavButton";
import AddressSearch from "./components/AddressSearch";
import { withPrefix } from "./utils/withPrefix";
import { isPageValid } from "./utils/isPageValid";
import { useState } from "react";
import { AllFieldsRequiredMessage } from "./components/AllFieldsRequiredMessage";
import { FooterWrapper } from "./components/FooterWrapper";

function FormPage1() {
  const navigate = useNavigate();
  const [showValidationError, setShowValidationError] =
    useState<boolean>(false);
  const pageIsValid = isPageValid("/");
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const from = urlParams.get("from");
  const [announceKey, setAnnounceKey] = useState<number>(0);

  return (
    <div className={withPrefix("p-4 w-full max-w-[400px] m-auto pb-24")}>
      <h2 className={withPrefix("py-4 text-2xl")}>Your Service Address</h2>

      <main>
        <div>This is the address you're moving to.</div>
        <AddressSearch />
      </main>

      <div className={withPrefix("mt-4")}>
        <AllFieldsRequiredMessage
          show={showValidationError}
          id="/"
          announceKey={announceKey}
        />
        <FooterWrapper>
          <NavButton
            label="Save and Continue"
            action={() => {
              if (pageIsValid) {
                navigate(from ? `/form_${from}` : "/form_page2");
              } else {
                setShowValidationError(true);
                setAnnounceKey((prev) => prev + 1);
              }
            }}
            currentPage="page1"
            disabledButClickable={!pageIsValid}
          />
        </FooterWrapper>
      </div>
    </div>
  );
}

export default FormPage1;
