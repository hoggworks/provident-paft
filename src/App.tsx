import { useState, useEffect, useRef } from "react";

import "./App.css";
import { Routes, Route } from "react-router";
import { useLocation } from "react-router-dom";
import Stepper from "./Stepper";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store/store";
import { clearForm } from "./store/formSlice";
import { useNavigate } from "react-router-dom";
import FormPage1 from "./FormPage1";
import FormPage2 from "./FormPage2";
import FormPage3 from "./FormPage3";
import FormPage4 from "./FormPage4";
import FormPage5 from "./FormPage5";

import FormPage6 from "./FormPage6";
import FormPage7 from "./FormPage7";
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from "./components/alert";
import { Button } from "./components/button";
import { clearSubmission } from "./store/submissionSlice";

function App() {
  const [currentFormPage, setCurrentFormPage] = useState<string>("");
  const formData = useSelector((state: RootState) => state.form);
  const submission = useSelector((state: RootState) => state.submission);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const startOverRef = useRef<HTMLButtonElement>(null);

  const hasInProgress = (data: RootState["form"]) => {
    for (const key in data) {
      if (key !== "pageVisited" && data[key] !== "") {
        return true;
      } else if (key === "pageVisited") {
        return data.pageVisited.length > 0;
      }
    }
    return false;
  };

  const [showResetMessage, setShowResetMessage] = useState<boolean>(() =>
    hasInProgress(formData),
  );

  useEffect(() => {
    setCurrentFormPage(location.pathname);
  }, [location]);

  useEffect(() => {
    if (submission.submitted && location.pathname === "/") {
      dispatch(clearForm());
      dispatch(clearSubmission());
      setShowResetMessage(false);
    }
  }, [submission.submitted, location.pathname, dispatch, navigate]);

  const handleStartOver = () => {
    dispatch(clearForm());
    dispatch(clearSubmission());
    setShowResetMessage(false);
    navigate("/");
  };

  return (
    <>
      <Alert
        open={showResetMessage}
        onClose={() => setShowResetMessage(false)}
        initialFocus={startOverRef}
        role="alertdialog"
      >
        <AlertTitle>You have an application in-progress</AlertTitle>
        <AlertDescription>
          If you start a new application, all your progress will be lost. Are
          you sure you want to start over?
        </AlertDescription>
        <AlertActions>
          <Button plain onClick={() => setShowResetMessage(false)} tabIndex={1}>
            Continue
          </Button>
          <Button
            ref={startOverRef}
            onClick={() => handleStartOver()}
            tabIndex={0}
          >
            Start Over
          </Button>
        </AlertActions>
      </Alert>

      <Stepper currentFormPage={currentFormPage} />
      <Routes>
        <Route path={"/"} element={<FormPage1 />} />
        <Route path="/form_page2" element={<FormPage2 />} />
        <Route path="/form_page3" element={<FormPage3 />} />
        <Route path="/form_page4" element={<FormPage4 />} />
        <Route path="/form_page5" element={<FormPage5 />} />
        <Route path="/form_page6" element={<FormPage6 />} />
        <Route path="/form_page7" element={<FormPage7 />} />
      </Routes>
    </>
  );
}

export default App;
