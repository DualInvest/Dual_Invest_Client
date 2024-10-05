import React from 'react';
import { Link } from 'react-router-dom';
import "./css/aboutus.css";

function AboutUs() {

  return (
    <>
      <div className="container mt-5">
        {/* Logo */}
        {/* <div className="text-center mb-4">
          <img src="https://firebasestorage.googleapis.com/v0/b/tatainvest-71bd6.appspot.com/o/logo.png?alt=media&token=47531390-01cb-40a6-9ab0-bca7f18cfec0" alt="Logo" className="img-fluid" />
        </div> */}

        {/* About Us Title */}
        <h2 className="text-center mb-4">About Us</h2>

        {/* About Us Content */}
        <div className='center text-center'>
          <p style={{fontSize:19}}>
            Welcome to our Dual Invest platform! These Terms and Conditions ("Terms") govern your access to and use of our product and services, including but not limited to investment services, referral programs, and any related features or functionalities (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms. Please read them carefully before using our platform.
          </p>
        </div>

        <div className='center'>
        <Link to="/faqs" className="text-center card component">
          FAQs
        </Link>
        <Link to="/howtouse" className="text-center card component">
          How To Use
        </Link>
        <Link to="/privacypolicy" className="text-center card component">
          Privacy Policy
        </Link>
        <Link to="/tnc" className="text-center card component">
          Documents, Terms and Conditions
        </Link>
        </div>
        <br />
      </div>
    </>

  );
}

export default AboutUs;
