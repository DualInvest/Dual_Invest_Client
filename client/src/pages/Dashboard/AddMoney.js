import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser } from "../../utils/getUser.js";
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage, createPaymentApprovalRequest } from '../../Firebase/config.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Container, Typography } from '@mui/material';
import './css/addmoney.css';

const AddMoneyPage = () => {
  const location = useLocation();
  const [amount, setAmount] = useState('');
  const history = useNavigate();
  const [user, setUser] = useState(null);
  const [paymentApprovalRequest, setPaymentApprovalRequest] = useState(false);
  const query = new URLSearchParams(location.search);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentRequestStatus, setPaymentRequestStatus] = useState('idle'); // New state for tracking request status
  const [copied, setCopied] = useState(false);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };
  const handleScreenshotChange = (event) => {
    setScreenshot(event.target.files[0]);
  };
  const handleSuggestionClick = (value) => {
    setAmount(value);
  };
  const validateFields = () => {
    return !!amount && !!utrNumber && screenshot;
  };

  const fetchedUser = localStorage.getItem('userId');

  useEffect(() => {
    const amount1 = query.get("amount");
    if (amount1) {
      setAmount(amount1);
    }
    if (fetchedUser) {
      getUser(fetchedUser)
        .then((userData) => {
          if (userData) {
            setUser(userData);
          } else {
            console.log('User not found');
          }
        })
        .catch((error) => {
          console.log('Error fetching user data:', error);
        });
    } else {
      history('/login');
    }
  }, [fetchedUser, history]);

  const handleUpdateInfo = async (investedAmount, transactionId) => {
    try {
      const userRef = doc(db, 'users', fetchedUser);
      await updateDoc(userRef, {
        investedAmount: user.investedAmount + Number(investedAmount),
        investmentTransactions: [...user.investmentTransactions,
        {
          transactionId: transactionId,
          amount: Number(investedAmount),
          date: new Date(),
        }
        ]
      });
      console.log('User info updated successfully!');
      history('/profile');
    } catch (error) {
      console.error('Error updating user name:', error);
    }
  };

  const uploadScreenshot = async (screenshotFile) => {
    try {
      const screenshotFileStorageRef = ref(storage, `paymentRequestProof/${screenshotFile.name}`);
      await uploadBytes(screenshotFileStorageRef, screenshotFile);
      const downloadURL = getDownloadURL(screenshotFileStorageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading screenshot:', error);
      return null;
    }
  };
  const copyUPI = (UPI) => {
    navigator.clipboard.writeText("tata.invest@ybl");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handelPaymentApprovalRequest = async () => {
    if (validateFields()) {
      setLoading(true);
      setPaymentRequestStatus('processing'); // Update status
      const screenshotUrl = await uploadScreenshot(screenshot);
      createPaymentApprovalRequest(fetchedUser, user.name, user.phone, amount, utrNumber, screenshotUrl)
        .then((response) => {
          setPaymentApprovalRequest(true);
          setPaymentRequestStatus('success'); // Update status
  
          fetch('/send-email-addmoney', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              paidAmount: amount,
              utrNumber: utrNumber,
              name: user.name,
            }),
          }).then((res) => {
            console.log("add money email-sent succesfully");
          })
          .catch((error) => {
            console.log("failed sending email", error);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Please fill all fields !");
    }
  };
  
  const handleUtrChange = (event) => {
    setUtrNumber(event.target.value);
  };

  return (
    <Container className="py-2" style={{ display: 'flex', justifyContent: 'left', textAlign: 'justify' }}>
      <Row className="each-row">
        <Col md={6} lg={12}>
          <Card className="bg-light shadow-sm rounded-lg p-4">
            <Typography variant="h5" className="text-center mb-4">
              Add Money
            </Typography>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Enter Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={handleAmountChange}
                />
              </Form.Group>
              <div className="mb-3">
                <p className="mb-1">Suggestions:</p>
                <Button variant="outline-primary" className="me-2 mb-1" onClick={() => handleSuggestionClick('1000')}>₹ 1000</Button>
                <Button variant="outline-primary" className="me-2 mb-1" onClick={() => handleSuggestionClick('5000')}>₹ 5000</Button>
                <Button variant="outline-primary" className="me-2 mb-1" onClick={() => handleSuggestionClick('10000')}>₹ 10000</Button>
                {/* Add more suggestion buttons as needed */}
              </div>
              <Form.Group className="mb-3">
                <h6>Step - 1</h6><br></br>
                <img src="/assets/qr.jpeg" alt="QR Code" className="mb-2" />
                <br></br>
                <strong>UPI - tata.invest@ybl</strong> {copied ? (
                  <i className="fas fa-check-circle copied"></i>
                ) : (
                  <i className="far fa-copy copy-icon" onClick={copyUPI}></i>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <h6>Step - 2</h6> <br></br>
                <Form.Label>Enter UTR Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter UTR number"
                  value={utrNumber}
                  onChange={handleUtrChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Upload Proof of payment</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  className='custom-file-input'
                  onChange={handleScreenshotChange}
                />
                {screenshot && (
                  <div className='mt-3'>
                    <img src={URL.createObjectURL(screenshot)} alt="Proof For Payment" height={"200px"} />
                  </div>
                )}
              </Form.Group>
              <div className="mb-4 text-left" style={{ justifyContent: 'justify', alignContent: 'justify', alignItems: 'left' }}>
                <h6 className="mb-1" style={{ color: 'red' }}>Important:</h6>
                <ul className="mb-0">
                  <li style={{ color: 'red' }}>Payment without UTR cannot be credited to our balance.</li>
                  <li style={{ color: 'red' }}>Make sure to input the correct UTR to avoid potential issues.</li>
                  <li style={{ color: 'red' }}>If you go back or anything, just come back and restart the process again. Keep UTR ready and then fill the form here again.</li>
                </ul>
              </div>

              {
                paymentRequestStatus === 'idle' && !paymentApprovalRequest ? (
                  <Button className='mt-2' onClick={handelPaymentApprovalRequest}>
                    Request Payment Approval
                  </Button>
                ) : paymentRequestStatus === 'processing' ? (
                  <div className='mt-2'>
                    <i className="fa-solid fa-spinner fa-spin"></i> Processing Payment Request...
                  </div>
                ) : paymentRequestStatus === 'success' ? (
                  <div className='mt-2'>
                    <div style={{ fontWeight: "bold", color: "green" }}>Payment Approval Request Sent Successfully!</div>
                    Please wait, your requested amount will be updated soon.
                  </div>
                ) : paymentRequestStatus === 'failed' ? (
                  <div className='mt-2'>
                    <div style={{ fontWeight: "bold", color: "red" }}>Payment Approval Request Failed!</div>
                    Please try again or contact support for assistance.
                  </div>
                ) : null
              }
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddMoneyPage;
