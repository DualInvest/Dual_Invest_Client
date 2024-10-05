import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Grid, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './css/Step1Form.css'; // Import the CSS file

function Step1Form({ formData, handleChange, nextStep, prevStep }) {
  const documentsRequired = [
    { name: "Aadhaar Card", description: "This is your Aadhaar card", img: "https://firebasestorage.googleapis.com/v0/b/tatainvest-71bd6.appspot.com/o/assets%2Faadhar.jpg?alt=media&token=e2eb9284-ef13-4a58-a97b-1acebe2a279d" },
    { name: "PAN Card", description: "This is your PAN card", img: "https://firebasestorage.googleapis.com/v0/b/tatainvest-71bd6.appspot.com/o/assets%2Fpan.webp?alt=media&token=518d3fd1-a5cb-41b6-b1ad-92a55055cc83" },
    // { name: "Address Proof", description: "This is your address proof" },
    // { name: "Identity Proof", description: "This is your identity proof" },
  ];
  const history = useNavigate();

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const handleNext = () => {
    if (!isTermsAccepted) {
      alert('Please accept the Terms & Conditions to proceed.');
      return;
    }
    history("/kyc-step2");
  };
  const handleBack = () => {
    history("/dashboard");
  };

  return (
    <div className="step1-form-container"> {/* Main container */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h6">Necessary Documents</Typography>
      </div>

      <Grid container spacing={2} justifyContent="center" className="container-card"> {/* Center-aligned grid */}
        {documentsRequired.map((document, index) => (
          <Grid key={index} item xs={12} md={6} > {/* Responsive layout */}
            <Card className="document-card"> {/* Document card */}
              {/* Image */}
              <CardContent>
                <img src={document.img} alt={document.name} />
              </CardContent>
              {/* Document Name */}
              <CardContent className="document-card-content">
                <Typography variant="h6">{document.name}</Typography>
              </CardContent>
              {/* Document Description */}
              <CardContent className="document-card-content">
                <Typography variant="body2" color="textSecondary">
                  {document.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div className="terms-container">
        <FormControlLabel
          control={<Checkbox checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} />}
          label={
            <span>
              I understand and agree to the required{" "}
              <a href="/aboutus">Terms & Conditions</a> to complete this KYC process.
            </span>
          }
        />
      </div>
      <div className="buttons-container"> {/* Buttons container */}
        <Button variant="contained" onClick={handleBack} style={{fontSize:'12px', padding:'8px'}}> 
          I don't have these documents
        </Button>
        <Button variant="contained" color="primary" disabled={!isTermsAccepted} onClick={handleNext} style={{fontSize:'12px', padding:'8px'}}>
          I have these documents. Proceed.
        </Button>
      </div>
    </div>
  );
}

export default Step1Form;
