import React, { useState, useEffect } from 'react';
import { db } from "../../Firebase/config.js";
import { getDoc, doc } from "firebase/firestore";
import './css/statement.css';
import './../Admin/css/paymentRequests.css';

const Statement = () => {
    const [userData, setUser] = useState(null);
    const [investedAmount, setInvestedAmount] = useState(0);
    const [referralAmount, setReferralAmount] = useState(0);
    const [interestAmount, setInterestAmount] = useState(0);
    const [withdrawableAmount, setWithdrawableAmount] = useState(0);
    const [lifetimeEarning,setLifetimeEarning] = useState(0);
    const [selectedOption, setSelectedOption] = useState('investments');
    const [transactionsArray, settransactionsArray] = useState([]);
    const [withdrawalsArray, setwithdrawalsArray] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    throw new Error('User ID not found');
                }

                const userRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userRef);

                if (!userDoc.exists()) {
                    throw new Error('User document not found');
                }

                const userData = userDoc.data();
                setUser(userData);
                setInvestedAmount(userData.investedAmount.toFixed(2));
                setReferralAmount(userData.referralAmount.toFixed(2));
                setInterestAmount(userData.interestAmount.toFixed(2));
                setWithdrawableAmount(userData.withdrawableAmount.toFixed(2));
                setLifetimeEarning((userData.interestAmount + userData.referralAmount).toFixed(2));
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUser(null);
            }
        };

        fetchUserData();
    }, []);
    useEffect(() => {
        const fetchTransactions = async () => {
            if (userData && userData.investmentTransactions) {
                const transactions = await Promise.all(userData.investmentTransactions.map(async (transactionId) => {
                    const transactionRef = doc(db, 'paymentApprovalRequests', transactionId);
                    const transactionDoc = await getDoc(transactionRef);
                    return transactionDoc.data();
                }));
                const sortedTransactions = transactions.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
                const withdrawals = await Promise.all(userData.withdrawalTransactions.map(async (withdrawalId) => {
                    const transactionRef = doc(db, 'withdrawalApprovalRequests', withdrawalId);
                    const transactionDoc = await getDoc(transactionRef);
                    return transactionDoc.data();
                }));
                const sortedWithdrawals = withdrawals.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
                console.log('Transactions:', transactions);
                console.log('Transactions:', withdrawals);
                settransactionsArray(sortedTransactions);
                setwithdrawalsArray(sortedWithdrawals);
            }
        };

        fetchTransactions();
    }, [userData]);



    const handleToggle = (option) => {
        setSelectedOption(option);
    };
    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year}, ${hours}:${minutes}`;
    };


    return (
        <div className="mx-2 mt-3 my-5">
            <h1 className="text-center my-3">Account Summary</h1>
            <div className="summary-box">
                <div className="summary-item">
                    <p className="item-label">Invested Amount:</p>
                    <p className="item-value">₹ {investedAmount || 0}</p>
                </div>
                <div className="summary-item">
                    <p className="item-label">Interest Income:</p>
                    <p className="item-value">₹ {interestAmount}</p>
                </div>
                <div className="summary-item">
                    <p className="item-label">Referral Income:</p>
                    <p className="item-value">₹ {referralAmount || 0}</p>
                </div>
                <div className="summary-item">
                    <p className="item-label">Life Time Earning:</p>
                    <p className="item-value">₹ {lifetimeEarning}</p>
                </div>
                <div className="summary-item">
                    <p className="item-label">Balance Withdrawable:</p>
                    <p className="item-value">₹ {withdrawableAmount}</p>
                </div>
            </div>

            <h1 className="mt-5 text-center my-3">Recent Transactions</h1>
            <div className="d-flex justify-content-center">
                <button className={selectedOption === 'investments' ? 'btn btn-success mx-3' : 'btn btn-outline-success mx-3'} onClick={() => handleToggle('investments')}>
                    Investments
                </button>
                <button className={selectedOption === 'withdrawals' ? 'btn btn-success mx-3' : 'btn btn-outline-success mx-3'} onClick={() => handleToggle('withdrawals')}>
                    Withdrawals
                </button>
            </div>

            <div className="payment-container">
                <h1 className="mx-3">{selectedOption === 'investments' ? 'Investments' : 'Withdrawals'}</h1>
                <div>
                    {userData ? (
                        selectedOption === 'investments' ? (
                            transactionsArray.length > 0 ? (
                                <ul className="payment-list-group">
                                    {transactionsArray.map((transaction, index) => (
                                        <li 
                                        key={index}
                                        className='payment-item d-flex justify-content-between align-items-center'
                                        style={{ border: '2px solid black' }}
                                        >
                                            <h6 style={{paddingRight:'10px'}}>{index + 1} .</h6>
                                            <div className="payment-item-details">
                                                <p className="payment-item-name"><strong>UTR No:</strong> {transaction.UTR}</p>
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
                            ) : (
                                <p className="mx-3">No investment transactions available</p>
                            )
                        ) : (
                            userData.withdrawalTransactions && userData.withdrawalTransactions.length > 0 ? (
                                <ul className="payment-list-group">
                                    {withdrawalsArray.map((withdrawal, index) => (
                                        <li 
                                        key={index}
                                        className='payment-item d-flex justify-content-between align-items-center'
                                        
                                        style={{ border: '2px solid black' }}>
                                            <h6 style={{paddingRight:'10px'}}>{index + 1} .</h6>
                                            <div className="payment-item-details">
                                                <p className="payment-item-name"><strong>Amount:</strong> ₹ {withdrawal.amount.toFixed(2)}</p>
                                                <p className="payment-item-name"><strong>Status:</strong> {
                                                    withdrawal.status === 'pending' ? <>Pending  <i class="fa fa-clock-o" aria-hidden="true"></i>
                                                    </>
                                                        :
                                                        (withdrawal.status === 'accepted' ? <>Accepted  <i class="fa fa-check-circle-o" aria-hidden="true"></i>
                                                        </> :
                                                            <>Rejected  <i class="fa fa-times" aria-hidden="true"></i>
                                                            </>
                                                        )}
                                                </p>
                                                <p className="payment-item-name"><strong>Date:</strong> {formatDate(withdrawal.createdAt.toDate())}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mx-3">No investment withdrawals available</p>
                            )
                        )
                    ) : (
                        <p>No data available</p>
                    )
                    }
                </div>
            </div>

        </div>
    );
};

export default Statement;
