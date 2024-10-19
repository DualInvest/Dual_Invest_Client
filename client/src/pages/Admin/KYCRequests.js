import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
// import './css/KYCRequests.css';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase/config.js';
// import { useNavigate } from 'react-router-dom';
import { formatDate } from './FormatDate.js';
import { acceptKYCApprovalRequest, rejectKYCApprovalRequest } from '../../Firebase/config.js';

export default function KYCRequest() {
  const [KYCRequests, setKYCRequests] = useState([]);
  // const [selectedKYCRequest, setSelectedKYCRequest] = useState(null);
  const [acceptButtonLoading, setAcceptButtonLoading] = useState(false); // Add loading state for accept button
  const [rejectButtonLoading, setRejectButtonLoading] = useState(false); // Add loading state for reject button
  // const [showModal, setShowModal] = useState(false);
  // const history = useNavigate();

  useEffect(() => {
    const fetchKYCRequests = async () => {
      try {
        const response = await axios.get(`/api/getAllKYCRequests`);
        const filteredKYCRequests = response.data.filter(request => !request.isDeletedByAdmin);
        const sortedKYCRequests = filteredKYCRequests.sort((a, b) => {
          const dateA = new Date(a.createdAt._seconds * 1000 + a.createdAt._nanoseconds / 1000000);
          const dateB = new Date(b.createdAt._seconds * 1000 + b.createdAt._nanoseconds / 1000000);
          return dateB - dateA; // Sort in descending order (newest first)
        });
        console.log(response.data);
        setKYCRequests(sortedKYCRequests);
      } catch (error) {
        console.error('Error fetching payment requests:', error);
        setKYCRequests([]);
      }
    };

    fetchKYCRequests();
  }, []);

  const handleDelete = async (requestId) => {
    try {
      const req = 'KYCApprovalRequests';
      // Make a PATCH request to the server to mark the payment request as deleted
      const res = await axios.get(`/api/deleteReq/${req}/${requestId}`);
      setKYCRequests(prevRequests =>
        prevRequests.filter(request => request.id !== requestId)
      );
      if (res.status === 200) {
        console.log(res.data);
      } else {
        console.error('Error deleting KYC request:', res.status);
        alert('Error deleting KYC request. Please try again.');
      }
    } catch (error) {
      console.error('Error calling api request:', error);
      alert('Error  calling api . Please try again.');
    }
  };
  const handleAccept = async (userId, aadharUrl, panUrl, accountNumber, ifscCode, cardholderName, request) => {
    // Implement logic for accepting payment request
    if (acceptButtonLoading) return;
    setAcceptButtonLoading(true); // Set loading state to true when accept button is clicked
    try {
      // Update the status to "accepted" in Firestore
      await updateDoc(doc(db, 'KYCApprovalRequests', request.id), {
        status: 'accepted'
      });
      await acceptKYCApprovalRequest(userId, aadharUrl, panUrl, accountNumber, ifscCode, cardholderName);

      await axios.get(`/api/send-email-kyc-accepted/${request.email}`);
      console.log('User info updated successfully!');
      // Update the UI by removing the buttons and displaying "Accepted"
      setKYCRequests(prevRequests => prevRequests.map(req =>
        req.id === request.id ? { ...req, status: 'accepted' } : req
      ));
    } catch (error) {
      console.error('Error updating user info:', error);
    } finally {
      setAcceptButtonLoading(false); // Reset loading state after action is completed
    }
  };

  const handleReject = async (userId, aadharUrl, panUrl, accountNumber, ifscCode, cardholderName, request) => {
    if (rejectButtonLoading) return;
    setRejectButtonLoading(true); // Set loading state to true when reject button is clicked

    try {
      // Update the status to "rejected" in Firestore
      await updateDoc(doc(db, 'paymentApprovalRequests', request.id), {
        status: 'rejected'
      });
      await rejectKYCApprovalRequest(userId, aadharUrl, panUrl, accountNumber, ifscCode, cardholderName);

      // Update the UI by removing the buttons and displaying "Rejected"
      setKYCRequests(prevRequests => prevRequests.map(req =>
        req.id === request.id ? { ...req, status: 'rejected' } : req
      ));
      await axios.get(`/api/send-email-kyc-rejected/${request.email}`);
    }
    finally {
      setRejectButtonLoading(false);
    }
  };

  // const handleCloseModal = () => {
  //     setShowModal(false);
  //     setSelectedKYCRequest(null);
  // };

  return (
    <div className="payment-container">
      <h1 className='text-center mt-5 my-5'>KYC Requests</h1>
      <div>
        <ul className="payment-list-group">
          {[...KYCRequests].map((request, index) => (
            <li
              key={request.id}
              className="payment-item d-flex flex-column align-items-start mb-3"
            >
              <div className="payment-item-details">
                <span className="payment-item-name">{index + 1} .  {request.name}</span>
                <br />
                <small className="payment-item-amount"> <strong>Acc. no.</strong>: {request.accountNumber}</small>
                <br />
                <small className="payment-item-amount"> <strong>IFSC</strong> :  {request.ifscCode}</small>
                <br />
                <small className="payment-item-amount"><strong>Acc Holder</strong> :  {request.cardHolderName}</small>
                <br />
                <i className="fas fa-calendar"></i> : {formatDate(new Date(request.createdAt._seconds * 1000))}
                <br />
                <p>
                  <strong>Aadhaar </strong> : <a href={request.aadharURL} download target="_blank">
                    Download PDF
                  </a>
                </p>
                <p>
                  <strong>PAN </strong> : <a href={request.panURL} download target="_blank">
                    Download PDF
                  </a>
                </p>
              </div>
              <div className="mt-2">
                {request.status === 'pending' && (
                  <>
                    <Button variant="success" className="me-2" onClick={() => handleAccept(request.userId, request.aadharURL, request.panURL, request.accountNumber, request.ifscCode, request.cardHolderName, request)} disabled={acceptButtonLoading}>Accept</Button>
                    <Button variant="danger" onClick={() => handleReject(request.userId, request.aadharURL, request.panURL, request.accountNumber, request.ifscCode, request.cardHolderName, request)} disabled={rejectButtonLoading}>Reject</Button>
                  </>
                )}
                {request.status === 'accepted' && (
                  <>
                    <span className="text-success payment-item-status-success" style={{ fontWeight: 'bold', marginRight: "15px" }}>Accepted</span>
                    <Button variant="danger" onClick={() => handleDelete(request.id)}><i className='fas fa-trash'></i></Button>
                  </>)}
                {request.status === 'rejected' && (
                  <>
                    <span className="text-danger payment-item-status-danger" style={{ fontWeight: 'bold', marginRight: "15px" }} >Rejected</span>
                    <Button variant="danger" onClick={() => handleDelete(request.id)}><i className='fas fa-trash'></i></Button>

                  </>)}
              </div>
            </li>
          ))}
          {KYCRequests.length === 0 && (
            <div className="text-center mt-5">
              <h2>No KYC requests found</h2>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
