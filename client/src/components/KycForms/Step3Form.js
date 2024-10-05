import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { storage, updateDocumentUrlsAndBankDetails } from '../../Firebase/config.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ToastMessage from '../Toast/Toast.js';
import { getUser } from '../../utils/getUser.js';
import axios from 'axios';
import { createKYCApprovalRequest } from '../../Firebase/config.js';

function Step3Form() {
  const history = useNavigate();
  const [aadharCard, setAadharCard] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const currentUser = localStorage.getItem('userId');
  const [showToast, setShowToast] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIFSCCode] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [formCompleted, setFormCompleted] = useState(false);
  const [user, setUser]= useState(null);
  useEffect(() => {
    // Check if all fields are filled
    if (aadharCard && panCard && accountNumber && ifscCode && cardholderName) {
      setFormCompleted(true);
    } else {
      setFormCompleted(false);
    }
  }, [aadharCard, panCard, accountNumber, ifscCode, cardholderName]);
  useEffect(() => {
    const fetchedUser = localStorage.getItem('userId');
    if (fetchedUser) {
      getUser(fetchedUser)
        .then((userData) => {
          if (userData) {
            setUser(userData);
          } else {
            console.log('User not found');
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log('Error fetching user data:', error);
          setLoading(false);
        });
    } else {
      history('/login');
    }
  }, [history]);

  const prevStep = () => {
    history("/dashboard");
  };

  const handleAadharCardUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/jpg')) {
      setAadharCard(file);
    } else {
      alert('Please upload a valid PDF or JPEG/JPG file for Aadhar card.');
    }
  };

  const handlePanCardUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/jpg')) {
      setPanCard(file);
    } else {
      alert('Please upload a valid PDF or JPEG/JPG file for PAN card.');
    }
  };

  const handleSaveDocument = async () => {
    setLoading(true);
    try {
      const uploadTasks = [];
      const uploadStorageRefs = [];

      // Upload Aadhar card
      if (aadharCard) {
        const aadharStorageRef = ref(storage, `documents/${aadharCard.name}`);
        uploadTasks.push(uploadBytes(aadharStorageRef, aadharCard));
        uploadStorageRefs.push(aadharStorageRef);
      }

      // Upload PAN card
      if (panCard) {
        const panStorageRef = ref(storage, `documents/${panCard.name}`);
        uploadTasks.push(uploadBytes(panStorageRef, panCard));
        uploadStorageRefs.push(panStorageRef);
      }

      // Wait for all uploads to complete
      await Promise.all(uploadTasks);
      console.log('Documents uploaded successfully');

      // Get download URLs for uploaded documents
      const downloadURLs = await Promise.all(uploadStorageRefs.map(ref => getDownloadURL(ref)));

      // Update document URLs and bank details in the database
      await createKYCApprovalRequest(currentUser, downloadURLs[0], downloadURLs[1], accountNumber, ifscCode, cardholderName,user.email);

      await axios.get(`/api/send-email-kyc/${user.email}`); 
      setShowToast(true);
      setLoading(false);
      setAadharCard(null);
      setPanCard(null);

      setTimeout(() => {
        history("/dashboard");
      }, 2000);
    } catch (error) {
      console.error('Error uploading documents:', error);
      alert('Failed to upload documents. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="step3-form-container">
      {showToast && (
        <ToastMessage message="KYC Successful" onClose={() => setShowToast(false)} />
      )}
      <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h6">Authentication/ Bank Details</Typography>
        </div>
        <CardContent>
          <div>
            <Typography variant="p" style={{ fontWeight: 'bold', color: '#808080' }}>
              Upload Aadhar Card
            </Typography>
            <div style={{ padding: '20px' }}>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg"
                onChange={handleAadharCardUpload}
              />
              {aadharCard && (
                <img src={URL.createObjectURL(aadharCard)} alt="Aadhar Card" height="200px" />
              )}
            </div>
          </div>
          <div>
            <Typography variant="p" style={{ fontWeight: 'bold', color: '#808080' }}>
              Upload PAN Card
            </Typography>
            <div style={{ padding: '20px' }}>
              <input type="file" accept=".pdf,.jpg,.jpeg" onChange={handlePanCardUpload} />
              {panCard && (
                <img src={URL.createObjectURL(panCard)} alt="PAN Card" height="200px" />
              )}
            </div>
          </div>
          <Typography variant="p" style={{ fontWeight: 'bold', color: '#808080' }}>
            Enter Bank Details
          </Typography>
          <div style={{ padding: '12px' }}>
            <TextField
              label="Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              fullWidth
              className="custom-text-field"
            />
          </div>
          <div style={{ padding: '12px' }}>
            <TextField
              label="IFSC Code"
              value={ifscCode}
              onChange={(e) => setIFSCCode(e.target.value)}
              fullWidth
              className="custom-text-field"
            />
          </div>

          <div style={{ paddingTop: '12px', paddingLeft: '12px', paddingRight: '12px' }}>
            <TextField
              label="Cardholder Name"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              fullWidth
              className="custom-text-field"
            />
          </div>
        </CardContent>
      </div>
      <div className="buttons-container">
        {(!loading && !showToast) && (
          <button className="generate-otp-button" color="primary" onClick={handleSaveDocument} disabled={!formCompleted}>
            Save
          </button>
        )}
        {loading && (
          <button className="generate-otp-button" color="primary" disabled={loading}>
            <i className="fa-solid fa-spinner fa-spin"></i>
          </button>
        )}
        {showToast && (
          <Button variant="contained" color="success">
            Redirecting to Dashboard...
          </Button>
        )}
      </div>
      {/* <center>
        <Button color="error" variant="contained" onClick={prevStep}>
          Cancel KYC
        </Button>
      </center> */}
    </div>

  );
}

export default Step3Form;
