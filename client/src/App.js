import './App.css';
import React, { useState, useEffect } from "react";
import Home from './pages/Home/Home.js';
import Navbar from './components/Navbar/Navbar.js';
import NotFound from './components/NotFound/NotFound.js';
import { Routes, Route, useLocation } from 'react-router-dom';
import DashboardScreen from './pages/Dashboard/Dashboard.js';
import ForgotPassword from './pages/Auth/ForgotPassword.js';
import SignUp from './pages/Auth/SignUp.js';
import SignIn from './pages/Auth/SignIn.js';
import Profile from './pages/Dashboard/Profile.js';
import UpdateInfo from './pages/Dashboard/UpdateInfo.js';
import Statement from './pages/Dashboard/Statement.js';
import AboutUs from './pages/Dashboard/AboutUs.js';
import Step2Form from './components/KycForms/Step2Form.js';
import Step1Form from './components/KycForms/Step1Form.js';
import Step3Form from './components/KycForms/Step3Form.js';
import ConfirmationStep from './components/KycForms/ConfirmationStep.js';
import Kyc from './pages/KYC/Kyc.js';
import AddMoneyPage from './pages/Dashboard/AddMoney.js';
import Footer from './components/Footer/Footer.js';
import HowToUsePage from './pages/Dashboard/HowToUse.js';
import TnC from './pages/Dashboard/TnC.js';
import FAQs from './pages/Dashboard/FAQs.js';
import PrivacyPolicyPage from './pages/Dashboard/PrivacyPolicy.js';
import AdminDashboard from './pages/Admin/AdminDashboard.js';
import NavbarBeforeLogin from './components/NavbarBeforeLogin/NavbarBeforeLogin.jsx';
import PhoneAuth from './pages/Auth/PhoneAuth.js';
import PaymentRequest from './pages/Admin/PaymentRequest.js';
import EditUserDetails from './pages/Admin/EditUserDetails.js';
import WithdrawalRequest from './pages/Admin/WithdrawalRequests.js';
import KYCRequest from './pages/Admin/KYCRequests.js';
import { getUser } from "./utils/getUser.js";
import FloatingButton from './components/FloatingButton/FloatingButton.js';

function App() {
  // Check if user is authenticated
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // State to track loading status

  const fetchedUser = localStorage.getItem('userId');

  useEffect(() => {
    const checkAuthentication = () => {
      const userId = localStorage.getItem('userId');
      setAuthenticated(!!userId);
    };

    checkAuthentication();
  }, [location]);

  useEffect(() => {
    if (authenticated) {
      getUser(fetchedUser)
        .then(userData => {
          setUser(userData);
          setIsAdmin(userData.phone === "7976189199" || userData.phone === '9772090543');
          setLoading(false); // Set loading to false when user data is fetched
        })
        .catch(error => {
          console.log('Error fetching user data:', error);
        });
    } else {
      setLoading(false); // Set loading to false when user is not authenticate
    }
  }, [authenticated, fetchedUser]);

  if (loading) {
    // Render rotating progress bar loading animation while loading
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }


  return (
    <>
      {authenticated ? <Navbar /> : <NavbarBeforeLogin />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/resetpassword" element={<ForgotPassword />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/tnc" element={<TnC />} />
        <Route path="/howtouse" element={<HowToUsePage />} />
        <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        {authenticated && !isAdmin && (
          <>
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/updateinfo/:referralCode" element={<UpdateInfo />} />
            <Route path="/statement" element={<Statement />} />
            <Route path='/kyc' element={<Kyc />} />
            <Route path="/kyc-step1" element={<Step1Form />} />
            <Route path="/kyc-step2" element={<Step2Form />} />
            <Route path="/kyc-step3" element={<Step3Form />} />
            <Route path="/kyc-confirmation" element={<ConfirmationStep />} />
            <Route path="/addmoney" element={<AddMoneyPage />} />
          </>
        )}
        {isAdmin && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/paymentrequest" element={<PaymentRequest />} />
            <Route path="/withdrawalrequest" element={<WithdrawalRequest />} />
            <Route path="/kycrequest" element={<KYCRequest />} />
            <Route path="/edit-user/:userId" element={<EditUserDetails />} /> {/* Add route for EditUserDetails */}
          </>
        )}
        <Route path="/phoneauth" element={<PhoneAuth />} />
        {user && (
          <Route path="*" element={<NotFound />} />
        )}

      </Routes>
      {
        (authenticated && !isAdmin) &&
        <FloatingButton />
      }
      {
        !authenticated &&
        <FloatingButton />
      }
      <Footer />
    </>
  );
}

export default App;