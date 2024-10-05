import React, { useState } from 'react';
import Step2Form from '../../components/KycForms/Step2Form.js';
import Step1Form from '../../components/KycForms/Step1Form.js';
import Step3Form from '../../components/KycForms/Step3Form.js';
import ConfirmationStep from '../../components/KycForms/ConfirmationStep.js';

function Kyc() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    aadharNumber: '',
    panNumber: '',
    email: '',
    authType: '',
    otp: ''
  });

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <div>
      <h1 className='text-center mt-3'><img src="https://firebasestorage.googleapis.com/v0/b/tatainvest-71bd6.appspot.com/o/assets%2Faadhar-log.png?alt=media&token=2f84a256-2cac-4fe3-abc9-5fb3097ab664" alt="adhaar-logo" height="40px" width="40px" className='mx-3'/>KYC Process</h1>
      {loading && <p>Loading...</p>}
      {step === 1 && (
        <Step1Form formData={formData} handleChange={handleChange} nextStep={nextStep} />
      )}
      {step === 2 && (
        <Step2Form formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />
      )}
      {step === 3 && (
        <Step3Form formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} setLoading={setLoading} />
      )}
      {step === 4 && (
        <ConfirmationStep formData={formData} />
      )}
    </div>
  );
}

export default Kyc;
