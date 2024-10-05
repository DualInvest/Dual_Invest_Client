import React from 'react';
import { Container } from 'react-bootstrap';
import './css/aboutus.css';

const HowToUsePage = () => {
  return (
    <Container>
    <div className="text-center mb-4">
          <img src="https://firebasestorage.googleapis.com/v0/b/tatainvest-71bd6.appspot.com/o/logo.png?alt=media&token=47531390-01cb-40a6-9ab0-bca7f18cfec0" alt="Logo" className="img-fluid" />
        </div>
      <h1 className="mt-5 mb-4 text-center">How to Use</h1>
      <div className=" my-5">
        <h2>
        Total 4 Steps to use the platform: 
        </h2>
        <hr />
        <p className='sizeClass'>
        Step 1: Register and Login on the platform.
        </p>
        <hr />
        <p className='sizeClass'>
        Step 2: Deposit money in your account.
        </p>
        <hr />
        <p className='sizeClass'>
        Step 3: Activate Account by completing KYC process. 
        </p>
        <hr />
        <p className='sizeClass'>
        Step 4: Start investing in the platform.
        </p>
      </div>
    </Container>

  );
};

export default HowToUsePage;
