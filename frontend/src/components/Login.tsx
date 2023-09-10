import React from "react";
import "../css/login.css";
import { useState } from "react";
import OtpInput from "./OtpInput";
import { useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

type SeverityType = "success" | "error" | "info" | "warning";

// eslint-disable-next-lin
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// import Snackbar from "../components/Snackbar";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {
  const navigate = useNavigate();
  const from = "/";
  const [position, setPosition] = useState(false);
  const [email, setEmail] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [message, setMessage] = useState("Otp sent, It might take time");
  const [severity, setSeverity] = useState<SeverityType>("success");

  const [otp, setOtp] = useState("");
  const onChange = (value: string) => setOtp(value);

  const [open, setOpen] = React.useState(false);
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  const goBack = () => {
    setEmail("");
    setOtp("");
    setPosition(false);
  };

  const sendOtp = async () => {
    // event?.preventDefault();
    setPosition(true);
    setOpen(true);
    // console.log("hello");
    // console.log(JSON.stringify(email));
    try {
      const response = await axios.post(
        "/auth/sendotp",
        JSON.stringify({ email: email }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      //   console.log(response?.data);
    } catch (error) {
      // Handle error
      console.error("Verification error:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    try {
      const response = await axios.post(
        "/auth/verify",
        JSON.stringify({ email: email, otp: otp }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      //   console.log(response?.data);
      sessionStorage.setItem("email", email);
      navigate(from, { replace: true });
    } catch (error) {
      setMessage("Invalid OTP");
      setSeverity("error");
      setOpen(true);
      setOtp("");
      // Handle error
      console.error("Verification error:", error);
    }
  };

  return (
    <div className="login_body">
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>

      <div className="login_form">
        <form action="" onSubmit={handleSubmit}>
          {!position && (
            <div className="login_comp">
              <h6 className="login_title">Book your slot now..</h6>
              <input
                className="login_email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email address"
                value={email}
                aria-invalid={validEmail ? "false" : "true"}
                aria-describedby="eidnote"
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                required
              />

              <button
                className="login_email_button"
                disabled={!validEmail ? true : false}
                onClick={sendOtp}
              >
                Sign in
              </button>
              <p
                id="eidnote"
                className={
                  emailFocus && email && !validEmail
                    ? "instructions"
                    : "offscreen"
                }
              >
                *Please enter valid email
              </p>
            </div>
          )}
          {position && (
            <div className="login_otp_form">
              <h5 className="login_otp_title">
                An otp has been sent to {email}
              </h5>
              <OtpInput value={otp} valueLength={6} onChange={onChange} />
              <button className="login_otp_button" type="submit">
                Verify OTP
              </button>
              <button className="login_back_button" onClick={goBack}>
                Go back
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
