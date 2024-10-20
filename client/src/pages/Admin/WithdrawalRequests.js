import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import './css/withdrawalRequests.css'; // Updated CSS file path
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase/config.js';
// import { useNavigate } from 'react-router-dom';
import { formatDate } from './FormatDate.js'; // Import formatDate function

export default function WithdrawalRequest() {
    const [withdrawalRequests, setWithdrawalRequests] = useState([]);
    const [selectedWithdrawalRequest, setSelectedWithdrawalRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [acceptButtonLoading, setAcceptButtonLoading] = useState(false); // Add loading state for accept button
    const [rejectButtonLoading, setRejectButtonLoading] = useState(false); // Add loading state for reject button

    // const history = useNavigate();

    useEffect(() => {
        const fetchWithdrawalRequests = async () => {
            try {
                const response = await axios.get(`/api/getAllWithdrawalRequests`);
                const filteredWithdrawalRequests = response.data.filter(request => !request.isDeletedByAdmin);
                const sortedWithdrawalRequests = filteredWithdrawalRequests.sort((a, b) => {
                    const dateA = new Date(a.createdAt._seconds * 1000 + a.createdAt._nanoseconds / 1000000);
                    const dateB = new Date(b.createdAt._seconds * 1000 + b.createdAt._nanoseconds / 1000000);
                    return dateB - dateA; // Sort in descending order (newest first)
                });

                setWithdrawalRequests(sortedWithdrawalRequests);
            } catch (error) {
                console.error('Error fetching withdrawal requests:', error);
                setWithdrawalRequests([]);
            }
        };

        fetchWithdrawalRequests();
    }, []);

    const handleDelete = async (requestId) => {
        try {
           const reqName='withdrawalApprovalRequests';
            // Make a PATCH request to the server to mark the payment request as deleted
           const res = await axios.get(`/api/deleteReq/${reqName}/${requestId}`);
            setWithdrawalRequests(prevRequests =>
              prevRequests.filter(request => request.id !== requestId)
            );
            if(res.status === 200) {
                console.log(res.data);
            }else{
                console.error('Error deleting withdrawal request:', res.status);
                alert('Error deleting withdrawal request. Please try again.');
            }
          } catch (error) {
            console.error('Error calling api request:', error);
            alert('Error  calling api . Please try again.');
          }
    };
    const handleAccept = async (userId, amount, request) => {
        // Implement logic for accepting withdrawal request
        if (acceptButtonLoading) return; // If button is already loading, prevent further action
        setAcceptButtonLoading(true); // Set loading state to true when accept button is clicked

        let balance = -1 * Number(amount);
        try {
            // Update the status to "accepted" in Firestore
            await updateDoc(doc(db, 'withdrawalApprovalRequests', request.id), {
                status: 'accepted'
            });
            const userRef = doc(db, 'users', userId);
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                balance += userData.withdrawableAmount; // Subtracting from existing balance
                await updateDoc(userRef, {
                    withdrawableAmount: balance,
                    withdrawalReq: "accepted",
                });
                fetch('/send-email-withdrawal-accepted', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: userData.email,
                        withdrawalAmount: amount,
                        name: userData.name,
                    }),
                }).then((res) => {
                    console.log("email-sent succesfully");
                })
                    .catch((error) => {
                        console.log("failed sending email", error);
                    })
                console.log('User balance updated successfully!');
            } else {
                console.error('User not found');
            }
            // Update the UI by removing the buttons and displaying "Accepted"
            setWithdrawalRequests(prevRequests => prevRequests.map(req =>
                req.id === request.id ? { ...req, status: 'accepted' } : req
            ));
        } catch (error) {
            console.error('Error updating user balance:', error);
        } finally{
            setAcceptButtonLoading(false);
        }
    };

    const handleReject = async (userId, amount, request) => {
        if (rejectButtonLoading) return; // If button is already loading, prevent further action
        setRejectButtonLoading(true); // Set loading state to true when reject button is clicked

        try {
            // Update the status to "rejected" in Firestore
            await updateDoc(doc(db, 'withdrawalApprovalRequests', request.id), {
                status: 'rejected'
            });
            // Update the UI by removing the buttons and displaying "Rejected"
            setWithdrawalRequests(prevRequests => prevRequests.map(req =>
                req.id === request.id ? { ...req, status: 'rejected' } : req
            ));
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                withdrawalReq: "rejected",
            });
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                fetch('/send-email-withdrawal-rejected', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: userData.email,
                        withdrawalAmount: amount,
                        name: userData.name,
                    }),
                }).then((res) => {
                    console.log("email-sent succesfully");
                })
                .catch((error) => {
                    console.log("failed sending email", error);
                })
            }
        } catch (error) {
            console.error('Error rejecting withdrawal request:', error);
        } finally{
            setRejectButtonLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedWithdrawalRequest(null);
    };

    return (
        <div className="withdrawal-container"> {/* Updated container class name */}
            <h1 className='text-center mt-5 my-5'>Withdrawal Requests</h1>
            <div className='my-5'>
                <ul className="withdrawal-list-group"> {/* Updated list group class name */}
                    {[...withdrawalRequests].map((request, index) => (
                        <li
                            key={request.id}
                            className="withdrawal-item d-flex justify-content-between align-items-center"
                        >
                            <div className="withdrawal-item-details"> {/* Updated details class name */}
                                <span className="withdrawal-item-name">{index + 1} .  {request.name}</span>
                                <br />
                                <small className="payment-item-amount"><i className="fas fa-rupee-sign"></i> : ₹{request.amount}</small>
                                <br />
                                <small className="payment-item-amount">Acc no. : {request.accountNumber}</small>
                                <br />
                                <small className="payment-item-amount">IFSC  : {request.ifscCode}</small>
                                <br />
                                <small className="payment-item-amount">Name : {request.cardholderName}</small>
                                <br />
                                <small className="payment-item-amount">
                                    <i className="fas fa-calendar"></i> : {formatDate(new Date(request.createdAt._seconds * 1000))}
                                </small>
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
                    {withdrawalRequests.length === 0 && (
                        <li className="withdrawal-item d-flex justify-content-center align-items-center">
                            <span>No withdrawal requests found</span>
                        </li>
                    )}
                </ul>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Display user details here */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
