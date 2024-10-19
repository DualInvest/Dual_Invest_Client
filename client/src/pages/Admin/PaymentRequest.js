import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import './css/paymentRequests.css';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase/config.js';
// import { useNavigate } from 'react-router-dom';
import { formatDate } from './FormatDate.js';

export default function PaymentRequest() {
    const [paymentRequests, setPaymentRequests] = useState([]);
    // const [selectedPaymentRequest, setSelectedPaymentRequest] = useState(null);
    const [acceptButtonLoading, setAcceptButtonLoading] = useState(false); // Add loading state for accept button
    const [rejectButtonLoading, setRejectButtonLoading] = useState(false); // Add loading state for reject button
    const [showModal, setShowModal] = useState(false);
    // const history = useNavigate();

    useEffect(() => {
        const fetchPaymentRequests = async () => {
            try {
                const response = await axios.get(`/api/getAllPaymentRequests`);
                // Filter out payment requests that are marked as deleted by admin
                const filteredPaymentRequests = response.data.filter(request => !request.isDeletedByAdmin);
                const sortedPaymentRequests = filteredPaymentRequests.sort((a, b) => {
                // const sortedPaymentRequests = response.data.sort((a, b) => {
                    // Debugging: Log the createdAt fields
                    // console.log("createdAt A:", a.createdAt);
                    // console.log("createdAt B:", b.createdAt);

                    // Convert createdAt to Date objects
                    const dateA = new Date(a.createdAt._seconds * 1000 + a.createdAt._nanoseconds / 1000000);
                    const dateB = new Date(b.createdAt._seconds * 1000 + b.createdAt._nanoseconds / 1000000);

                    // Debugging: Log the converted dates
                    // console.log("Dates", dateA, dateB);

                    // Sort in descending order (newest first)
                    return dateB - dateA;
                });
                console.log(sortedPaymentRequests);

                setPaymentRequests(sortedPaymentRequests);
            } catch (error) {
                console.error('Error fetching payment requests:', error);
                setPaymentRequests([]);
            }
        };

        fetchPaymentRequests();
    }, []);

    const handleAccept = async (userId, amount, request) => {
        // Implement logic for accepting payment request
        if (acceptButtonLoading) return;
        setAcceptButtonLoading(true); // Set loading state to true when accept button is clicked
        let investedAmount = Number(amount);
        try {
            // Update the status to "accepted" in Firestore
            await updateDoc(doc(db, 'paymentApprovalRequests', request.id), {
                status: 'accepted'
            });
            const userRef = doc(db, 'users', userId);
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                investedAmount += userData.investedAmount; // Adding to existing invested amount
                await updateDoc(userRef, {
                    investedAmount: investedAmount,
                });
                fetch('/send-email-addmoney-accepted', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: userData.email,
                        paidAmount: amount,
                        name: userData.name,
                        investedAmount: investedAmount,
                    }),
                }).then((res) => {
                    console.log("email-sent succesfully");
                })
                    .catch((error) => {
                        console.log("failed sending email", error);
                    })
                console.log('User info updated successfully!');
            } else {
                console.error('User not found');
            }
            // Update the UI by removing the buttons and displaying "Accepted"
            setPaymentRequests(prevRequests => prevRequests.map(req =>
                req.id === request.id ? { ...req, status: 'accepted' } : req
            ));
        } catch (error) {
            console.error('Error updating user info:', error);
        } finally {
            setAcceptButtonLoading(false); // Reset loading state after action is completed
        }
    };

    const handleReject = async (userId, amount, request) => {
        if (rejectButtonLoading) return;
        setRejectButtonLoading(true); // Set loading state to true when reject button is clicked

        try {
            // Update the status to "rejected" in Firestore
            await updateDoc(doc(db, 'paymentApprovalRequests', request.id), {
                status: 'rejected'
            });
            // Update the UI by removing the buttons and displaying "Rejected"
            setPaymentRequests(prevRequests => prevRequests.map(req =>
                req.id === request.id ? { ...req, status: 'rejected' } : req
            ));
            const userRef = doc(db, 'users', userId);
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                fetch('/send-email-addmoney-rejected', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: userData.email,
                        paidAmount: amount,
                        name: userData.name,
                        investedAmount: userData.investedAmount,
                    }),
                }).then((res) => {
                    console.log("email-sent succesfully");
                })
                    .catch((error) => {
                        console.log("failed sending email", error);
                    })
            }
        } catch (error) {
            console.error('Error rejecting payment request:', error);
        }
        finally {
            setRejectButtonLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        // setSelectedPaymentRequest(null);
    };
    // const updateRequests = async () => {
    //     try {
    //         const response = await axios.get(`/api/updateAllRequests`);
    //         if (response.status === 200) {
    //             console.log('All paymentRequests updated successfully:', response.data);
    //             return response.data;
    //         } else {
    //             console.error('Error updating paymentRequests:', response.status);
    //             return null;
    //         }
    //     } catch (error) {
    //         console.error('Error making the API request: ', error);
    //     }
    // };
    const handleDelete = async (requestId) => {
        try {
            const req = 'paymentApprovalRequests';
            // Make a PATCH request to the server to mark the payment request as deleted
           const res = await axios.get(`/api/deleteReq/${req}/${requestId}`);
            setPaymentRequests(prevRequests =>
              prevRequests.filter(request => request.id !== requestId)
            );
            if(res.status === 200) {
                console.log(res.data);
            }else{
                console.error('Error deleting payment request:', res.status);
                alert('Error deleting payment request. Please try again.');
            }
          } catch (error) {
            console.error('Error calling api request:', error);
            alert('Error  calling api . Please try again.');
          }
    };
    return (
        <div className="payment-container">
            <h1 className='text-center mt-5 my-5'>Payment Requests</h1>
            <div>
                <ul className="payment-list-group">
                    {/* {[...paymentRequests].sort((a, b) => {
                        // Sort by status: pending requests first, then accepted, then rejected
                        if (a.status === 'pending' && (b.status === 'accepted' || b.status === 'rejected')) return -1;
                        if (b.status === 'pending' && (a.status === 'accepted' || a.status === 'rejected')) return 1;
                        return 0;
                    }).map((request, index) => ( */}
                    {[...paymentRequests].map((request, index) => (
                        <li
                            key={request.id}
                            className="payment-item d-flex justify-content-between align-items-center"
                        >
                            <div className="payment-item-details">
                                <span className="payment-item-name">{index + 1} .  {request.name}</span>
                                <br />
                                <small className="payment-item-amount"><i className="fas fa-rupee-sign"></i> : ₹{request.amount}</small>
                                <br />
                                <small className="payment-item-amount"> <i className="fas fa-phone"></i> :  {request.phone}</small>
                                <br />
                                <small className="payment-item-amount"><strong>UTR</strong> :  {request.UTR}</small>
                                <br />
                                <small className="payment-item-amount">
                                    <i className="fas fa-calendar"></i> : {formatDate(new Date(request.createdAt._seconds * 1000))}
                                </small>
                                <p>
                                    <strong>Proof</strong> : <a href={request.proofURL} download target="_blank">
                                        Download PDF
                                    </a>
                                    {/* <button onClick={handleDelete}> updatePaymentRequests </button> */}
                                </p>

                            </div>
                            <div>
                                {request.status === 'pending' && (
                                    <>
                                        <Button variant="success" className="me-2" onClick={() => handleAccept(request.userId, request.amount, request)} disabled={acceptButtonLoading}>Accept</Button>
                                        <Button variant="danger" onClick={() => handleReject(request.userId, request.amount, request)} disabled={rejectButtonLoading}>Reject</Button>
                                    </>
                                )}
                                {request.status === 'accepted' && (
                                    <>
                                        <span className="text-success payment-item-status-success" style={{ fontWeight: 'bold', marginRight:"15px" }}>Accepted</span>
                                        <Button variant="danger" onClick={() => handleDelete(request.id)}><i className='fas fa-trash'></i></Button>
                                    </>)}
                                {request.status === 'rejected' && (
                                    <>
                                        <span className="text-danger payment-item-status-danger" style={{ fontWeight: 'bold', marginRight:"15px" }} >Rejected</span>
                                        <Button variant="danger" onClick={() => handleDelete(request.id)}><i className='fas fa-trash'></i></Button>

                                    </>)}
                            </div>
                        </li>
                    ))}
                    {paymentRequests.length === 0 && (
                        <li className="payment-item d-flex justify-content-center align-items-center">
                            <span>No payment requests found</span>
                        </li>
                    )}
                </ul>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title className="payment-modal-title">User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="payment-modal-body">
                    {/* Display user details here */}
                </Modal.Body>
                <Modal.Footer className="payment-modal-footer">
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
