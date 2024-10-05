import React from 'react';

function ConfirmationStep({ formData }) {
  return ( 
    <div>
      <h2>KYC Confirmation</h2>
      <p>Thank you for completing the KYC process!</p>
      <p>Here's a summary of your submitted information:</p>
      <ul>
        <li>Name: {formData.name}</li>
        <li>Date of Birth: {formData.dob}</li>
        <li>Aadhaar Number: {formData.aadharNumber}</li>
        <li>PAN Number: {formData.panNumber}</li>
      </ul>
    </div>
  );
}

export default ConfirmationStep;
