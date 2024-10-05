import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../Firebase/config.js";
import { RecaptchaVerifier, signInWithPhoneNumber, signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import "./signIn.css"; // CSS file 
import { useDispatch } from "react-redux";
import { authActions } from "../../redux/store.js";
import { Skeleton } from "@mui/material";
import { checkUserExists } from "../../Firebase/config.js";
import axios from 'axios';
import { generateOTP } from "../../utils/generateCodes.js";

function Login() {
  const history = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [user, setUser] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otp1, setOtp1] = useState('');
const [userUID, setUserUID] = useState('');

  useEffect(() => {
    setOtp1(generateOTP());
    const fetchedUser = localStorage.getItem('userId');
    if (fetchedUser) {
      history('/dashboard');
    }
  }, []);

  const handleGenerateOtp = async () => {
    if (!phone === '') {
      alert('Please enter your phone number and full name.');
      return;
    }


    fetch('')
    try {
      const userLocalId= await checkUserExists(phone);
      
        // .then(referralCode => {
          // console.log("Referral Code : ",referralCode);
          if (userLocalId!=="") {
            setUserUID(userLocalId);
            const number = phone + otp1;
            const response = await axios.get(`/api/sendotp/${number}`);
            console.log("Response Data: ", response.data);
            setOtpSent(true);

            let interval = setInterval(() => {
              setTimer((prevTimer) => {
                if (prevTimer === 1) {
                  clearInterval(interval);
                }
                return prevTimer - 1;
              });
            }, 1000);
          } else {
            history('/signup');
          }
        // });

    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
    }
  };

  // const sendOTP = async () => {
  //   try {
  //     if (phone === '') {
  //       alert("Phone Number is required");
  //       return;
  //     }

  //     const recaptcha = new RecaptchaVerifier(auth, 'recaptcha', {});
  //     const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);
  //     console.log("confirmation", confirmation);
  //     setUser(confirmation);
  //     setOtpSent(true);

  //     // Start the timer for 30 seconds
  //     let interval = setInterval(() => {
  //       setTimer((prevTimer) => {
  //         if (prevTimer === 1) {
  //           clearInterval(interval);
  //         }
  //         return prevTimer - 1;
  //       });
  //     }, 1000);
  //   } catch (error) {
  //     console.log("Error", error);
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp === '') {
      alert("OTP is required");
      return;
    }
    try {
      if (otp !== otp1) {
        alert('Incorrect OTP. Please try again.');
        setOtp('');
        return;
      } else {
        localStorage.setItem("userId", userUID);
        // localStorage.setItem("phoneNumber", data?.user.phone);
        dispatch(authActions.login());
        if (phone === "7976189199" || phone === '9772090543') {
          history('/admin');
        } else {
          history('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Invalid OTP. Please try again.');
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (otp === '') {
  //     alert("OTP is required");
  //     return;
  //   }
  //   checkUserExists(phone)
  //     .then((userExists) => {
  //       if (userExists) {
  //         // If the user exists, log them in
  //         user.confirm(otp)
  //           .then((data) => {
  //             localStorage.setItem("userId", data?.user.uid);
  //             localStorage.setItem("phoneNumber", data?.user.phone);
  //             dispatch(authActions.login());
  //             if ( phone === "+917976189199" || phone === '9772090543') {
  //               history('/admin');
  //             } else {
  //               history('/dashboard');
  //             }
  //           })
  //           .catch((err) => {
  //             console.log("Error", err);
  //           });
  //       } else {
  //         history('/signup');
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error checking user existence:', error);
  //     });
  // };


  setTimeout(() => {
    setLoading(false);
  }, 500);

  return (
    <div className="container-signin">
      <div className="signin-container">
        <h1>Sign In</h1>
        {loading ? (
          <>
            <Skeleton variant="text" width={200} height={50} />
            <Skeleton variant="text" width={300} height={50} />
            <Skeleton variant="text" width={300} height={50} />
          </>
        ) : (
          <form onSubmit={handleSubmit} className="signin-form">
            <div className="form-group">
              <input
                name="phoneNumber"
                type="tel"
                placeholder="Phone Number"
                className="input-field"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            {!otpSent && <div id="recaptcha" className="recaptcha"></div>}
            {otpSent ? (
              <div className="form-group">
                <input
                  name="otp"
                  type="text"
                  placeholder="OTP"
                  className="input-field"
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            ) : (
              <center className="form-group">
                <button
                  type="button"
                  className="btn get-otp-button"
                  // onClick={sendOTP}
                  onClick={handleGenerateOtp}
                >
                  Get OTP
                </button>
              </center>
            )}
            <div className="signup-link">
              <Link to="/signup" className="signup-link-text" style={{ color: '#fff', fontSize: '16px' }}>
                Don't have an account? <span style={{ color: 'blue', textDecoration: 'underline' }}> Sign Up</span>
              </Link>
            </div>
            {otpSent && <button type="submit" className="signin-button">Sign In</button>}
            {/* {otpSent && (
              <div className="resend-otp-container">
                <button
                  className="resend-otp-button"
                  disabled={timer > 0}
                  // onClick={sendOTP}
                  onClick={handleGenerateOtp}
                >
                  Resend OTP {timer > 0 && `(${timer}s)`}
                </button>
              </div>
            )} */}
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;