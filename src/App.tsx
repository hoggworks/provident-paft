import { useState, useEffect } from "react";
// import "./Webflow.css";
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
  const [showResetMessage, setShowResetMessage] = useState<boolean>(false);
  const formData = useSelector((state: RootState) => state.form);
  const submission = useSelector((state: RootState) => state.submission);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentFormPage(location.pathname);
  }, [location]);

  useEffect(() => {
    // Check if any form fields have data
    let applicationInProgress = false;
    for (const key in formData) {
      if (key !== "pageVisited" && formData[key] !== "") {
        console.log(key, formData[key]);
        applicationInProgress = true;
        break;
      } else if (key === "pageVisited") {
        // If the pageVisited field is empty, it means the user is starting a new application
        if (formData.pageVisited.length === 0) {
          applicationInProgress = false;
        } else {
          // If the pageVisited field has data, it means the user has visited pages
          applicationInProgress = true;
        }
      }
    }

    if (submission.submitted && location.pathname === "/") {
      dispatch(clearForm());
      dispatch(clearSubmission());
      setShowResetMessage(false);
    } else {
      setShowResetMessage(applicationInProgress);
    }

    // if application is submitted and am not on page 6, redirect to page 6

    if (
      submission.submitted &&
      location.pathname.indexOf("form_page6") === -1
    ) {
      navigate("/form_page6");
    }
  }, []); // Only run on mount

  const handleStartOver = () => {
    dispatch(clearForm());
    dispatch(clearSubmission());
    setShowResetMessage(false);
    navigate("/");
  };

  return (
    <>
      <Alert open={showResetMessage} onClose={() => setShowResetMessage(false)}>
        <AlertTitle>You have an application in-progress</AlertTitle>
        <AlertDescription>
          If you start a new application, all your progress will be lost. Are
          you sure you want to start over?
        </AlertDescription>
        <AlertActions>
          <Button plain onClick={() => setShowResetMessage(false)}>
            Close
          </Button>
          <Button onClick={() => handleStartOver()}>Start Over</Button>
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
