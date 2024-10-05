import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Skeleton from './Skeletons/SkeletonAdmin.js';
import { db, deleteDocument } from "../../Firebase/config.js";
import { getDoc, doc } from "firebase/firestore";
import './admin.css';


export default function AdminDashboard() {
    const [usersData, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserTransactions, setSelectedUserTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    const history = useNavigate();

    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                const response = await axios.get(`/api/getAllUsers`);
                const filtered = response.data.filter(user => (user.phone !== "7976189199" || user.phone === '1111111111'));
                const sortedUsers = filtered.sort((a, b) => {
                    const dateA = new Date(a.createdAt._seconds * 1000);
                    const dateB = new Date(b.createdAt._seconds * 1000);
                    return dateB - dateA; // Sort in descending order (newest first)
                });

                setUsers(sortedUsers);
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUsers([]);
                setLoading(false); // Set loading to false even if there's an error
            }
        };

        fetchUsersData();
    }, []);

    const currentDate = new Date();

    const differenceInDays = (date1, date2) => {
        const diffInTime = date2.getTime() - date1.getTime();
        return diffInTime / (1000 * 3600 * 24);
    };

    const handleUserClick = async (user) => {
        console.log("User clicked:", user); // Check if this message appears in the console
        setSelectedUser(user);
        await fetchTransactions(user);
        setShowModal(true);
    };
    

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };
    const handleDeleteUser = async () => {
        try{
            await deleteDocument("users", selectedUser.referralCode)
        }
        catch(err){
            console.log("error while deleting user", err);
        }
    }
    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day}/${month}/${year}`;
    };

    const fetchTransactions = async (userData) => {
        setLoadingTransactions(true); // Set loading state to true while fetching transactions
        if (userData && userData.investmentTransactions) {
            try {
                const transactions = await Promise.all(userData.investmentTransactions.map(async (transactionId) => {
                    const transactionRef = doc(db, 'paymentApprovalRequests', transactionId);
                    const transactionDoc = await getDoc(transactionRef);
                    return transactionDoc.data();
                }));
                const sortedTransactions = transactions.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
                setSelectedUserTransactions(sortedTransactions);
                console.log(sortedTransactions[0].UTR)
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setSelectedUserTransactions([]); // Set transactions to empty array in case of error
            } finally {
                setLoadingTransactions(false); // Set loading state to false after fetching transactions
            }
        }
    };

    // Render Skeleton while loading
    if (loading) return <Skeleton />;

    return (
        <div className="container">
            <h1 className='text-center mt-5 my-5'>USERS - {usersData.length}</h1>
            {
                usersData.length === 0 ? (
                    <h5>
                        No user in data !
                    </h5>
                ) : (
                    <div className='my-5'>
                        <ul className="list-group">
                            {usersData.map((user, index) => {
                                const userCreatedAt = user.createdAt ? new Date(user.createdAt._seconds * 1000) : null;
                                const daysSinceCreation = differenceInDays(userCreatedAt, currentDate);
                                const isNewUser = daysSinceCreation < 7;

                                return (
                                    <li
                                        key={index}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div>
                                            <span>{index + 1} .  {user.name}</span>
                                            <br />
                                            <small className="text-muted">₹ {user.investedAmount.toFixed(2)} Invested</small>
                                        </div>
                                        <div>
                                            {isNewUser && (
                                                <span className="badge bg-success me-2">New</span>
                                            )}
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => handleUserClick(user)}
                                            >
                                                Details
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )
            }

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div className='details'>
                            <h5>Personal Details</h5>
                            <hr />
                            {selectedUser.createdAt && (
                                <p>Registration Date: {formatDate(new Date(selectedUser.createdAt._seconds * 1000))}</p>
                            )}
                            <p>Name : {selectedUser.name}</p>
                            <p>KYC : {selectedUser.kycDone ? "DONE" : "NOT DONE"}</p>
                            {selectedUser.kycDone &&
                                <div>
                                    <p>
                                        Aadhar Card : <a className='btn btn-success' href={selectedUser.documentUrl} download target="_blank">
                                            Download PDF
                                        </a>
                                    </p>
                                    <p>
                                        Pan Card : <a className='btn btn-success' href={selectedUser.documentUrl2} download target="_blank">
                                            Download PDF
                                        </a>
                                    </p>
                                    <p>
                                        Account Number : {selectedUser.accountNumber}
                                    </p>
                                    <p>
                                        IFSC Code : {selectedUser.ifscCode}
                                    </p>
                                    <p>
                                        Card Holder Name : {selectedUser.cardholderName}
                                    </p>
                                </div>
                            }
                            <br />
                            <h5>Contact Details</h5>
                            <hr />
                            <p>Phone : {selectedUser.phone}</p>
                            <br />
                            <h5>Investment Details</h5>
                            <hr />
                            <p>Invested Amount : ₹ {selectedUser.investedAmount.toFixed(2)}</p>
                            {/* <p>Investment Transactions :</p>
                            {loadingTransactions ? (
                                <p>Loading investment transactions...</p>
                            ) : (
                                selectedUserTransactions && selectedUserTransactions.length > 0 ? (
                                    <>
                                        <ul className="payment-list-group">
                                            {selectedUserTransactions.map((transaction, index) => (
                                                <li
                                                    key={index}
                                                    className='payment-item d-flex justify-content-between align-items-center'
                                                    style={{ border: '2px solid black' }}
                                                >
                                                    <h6 style={{ paddingRight: '10px' }}>{index + 1} .</h6>
                                                    <div className="payment-item-details">
                                                        <p className="payment-item-name"><strong>UTR No:</strong> {transaction?.UTR}</p>
                                                        <p className="payment-item-name"><strong>Amount:</strong> ₹ {transaction.amount}</p>
                                                        <p className="payment-item-name"><strong>Status:</strong> {
                                                            transaction.status === 'pending' ? <>Pending  <i class="fas fa-clock-o" aria-hidden="true"></i>
                                                            </>
                                                                :
                                                                (transaction.status === 'accepted' ? <>Accepted  <i class="fas fa-check-circle-o" aria-hidden="true"></i>
                                                                </> :
                                                                    <>Rejected  <i class="fas fa-times" aria-hidden="true"></i>
                                                                    </>
                                                                )}
                                                        </p>
                                                        <p className="payment-item-name"><strong>Date:</strong> {formatDate(transaction.createdAt.toDate())}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <p className="mx-3">No investment transactions available</p>

                                ))} */}
                            <br />
                            <h5>Income Details</h5>
                            <hr />
                            <p>Interest Amount : ₹ {selectedUser.interestAmount.toFixed(2)}</p>
                            <p>Referral Amount : ₹ {selectedUser.referralAmount.toFixed(2)}</p>
                            <p>Lifetime Income : ₹ {(selectedUser.interestAmount + selectedUser.referralAmount).toFixed(2)}</p>
                            <p>Withdrawable Amount : ₹ {selectedUser.withdrawableAmount.toFixed(2)}</p>
                            <br />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteUser}>
                        Delete User
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
