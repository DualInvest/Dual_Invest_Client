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
    const [lifetimeEarning, setLifetimeEarning] = useState(0);
    const [selectedOption, setSelectedOption] = useState('investments');
    const [transactionsArray, settransactionsArray] = useState([]);
    const [withdrawalsArray, setwithdrawalsArray] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [expandedUserId, setExpandedUserId] = useState(null);
    const [referredUsers, setReferredUsers] = useState([]);
    const [nestedReferredUsersMap, setNestedReferredUsersMap] = useState({});

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleCollapse_2 = (userId) => {
        setExpandedUserId((prevUserId) => (prevUserId === userId ? null : userId));
    };

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
                console.log('Withdrawals:', withdrawals);
                settransactionsArray(sortedTransactions);
                setwithdrawalsArray(sortedWithdrawals);
            }
        };

        fetchTransactions();
    }, [userData]);

    useEffect(() => {
        const fetchReferredUsers = async () => {
            if (userData && userData.referralUsers.length > 0) {
                const users = await Promise.all(
                    userData.referralUsers.map(async (userId) => {
                        const userDoc = await getDoc(doc(db, 'users', userId));
                        return userDoc.data();
                    })
                );
                setReferredUsers(users);
                console.log('Referred Users:', users);

            };
        };
        fetchReferredUsers();
    }, [userData]);

    useEffect(() => {
        const fetchAllNestedUsers = async () => {
            const nestedUsersMap = {};
            for (const user of referredUsers) {
                const nestedUsers = await fetchReferredUsers_2(user);
                // console.log('Nested Users:', nestedUsers);
                nestedUsersMap[user.referralCode] = nestedUsers;
                // console.log('First Nested Users:', nestedUsersMap);
                
            }
            setNestedReferredUsersMap(nestedUsersMap);
            // console.log('Second Nested Users Map:', nestedUsersMap);
        };

        fetchAllNestedUsers();
    }, [referredUsers]);
    const fetchReferredUsers_2 = async (userData) => {
        // console.log('userData:', userData);
        try {
            const users = await Promise.all(
                userData.referralUsers.map(async (userId) => {
                    const userDoc = await getDoc(doc(db, 'users', userId));
                    return userDoc.data();
                })
            );
            // console.log('Nested Referred Users:', users);
            
            return users;
        } catch (error) {
            console.error('Error fetching referred users:', error);
            return [];
        }
    };

  

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
                <div className="summary-item" onClick={toggleCollapse} style={{ cursor: 'pointer' }}>
                    <p className="item-label">Referral Income :  <i className="fas fa-chevron-down"></i> </p>
                    <p className="item-value">₹ {referralAmount || 0}</p>
                </div>
                {!isCollapsed && referredUsers.length > 0 && (
                    <div className="referral-users">
                        <center><strong>First Tier - Referred Users:{referredUsers.length} </strong></center>
                        {referredUsers.map((user, index) => {
                            const referralAmount = user.interestAmount * 0.03;
                            const isFirstItem = index === 0;
                            const isLastItem = index === referredUsers.length - 1;
                            const nestedReferredUsers = nestedReferredUsersMap[user.referralCode] || [];

                            return (
                                <>
                                    <div className="referral-item-1" style={{
                                        borderTopLeftRadius: isFirstItem ? '20px' : '0',
                                        borderTopRightRadius: isFirstItem ? '20px' : '0',
                                        borderBottomLeftRadius: isLastItem ? '20px' : '0',
                                        borderBottomRightRadius: isLastItem ? '20px' : '0',
                                        cursor: 'pointer'
                                    }}
                                        key={index}
                                        onClick={() => toggleCollapse_2(user.referralCode)} >
                                        <p className="item-label">{user.name} <i className='fas fa-chevron-down'></i></p>
                                        <p className="item-value">₹ {referralAmount.toFixed(2)}</p>
                                    </div>
                                    {
                                        expandedUserId === user.referralCode && nestedReferredUsers.length > 0 && (
                                            <div className="referral-users">
                                                <center><strong>Second Tier - Referred Users: {nestedReferredUsers.length}</strong></center>

                                                {nestedReferredUsers.map((nestedUser, nestedIndex) => {
                                                        const nestedReferralAmount = nestedUser.interestAmount * 0.02;
                                                        const isNestedFirstItem = nestedIndex === 0;
                                                        const isNestedLastItem = nestedIndex === nestedReferredUsers.length - 1;
                                                        return (
                                                            <div
                                                                className="referral-item-2"
                                                                style={{
                                                                    borderTopLeftRadius: isNestedFirstItem ? '20px' : '0',
                                                                    borderTopRightRadius: isNestedFirstItem ? '20px' : '0',
                                                                    borderBottomLeftRadius: isNestedLastItem ? '20px' : '0',
                                                                    borderBottomRightRadius: isNestedLastItem ? '20px' : '0',
                                                                    marginBottom: isNestedLastItem ? '10px' : '0',
                                                                }}
                                                                key={nestedIndex}
                                                            >
                                                                <p className="item-label">{nestedUser.name}</p>
                                                                <p className="item-value">₹ {nestedReferralAmount.toFixed(2)}</p>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        )
                                    }
                                    {
                                        expandedUserId === user.referralCode && nestedReferredUsers.length === 0 && (
                                            <div className="referral-users">
                                                <center><strong>No Referred Users:</strong></center>
                                            </div>
                                        )
                                    }
                                </>

                            )
                        })}
                    </div>
                )}
                {
                    !isCollapsed && referredUsers.length === 0 && (
                        <center><strong>No Referred Users:</strong></center>
                    )
                }
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
                                            <h6 style={{ paddingRight: '10px' }}>{index + 1} .</h6>
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
                                            <h6 style={{ paddingRight: '10px' }}>{index + 1} .</h6>
                                            <div className="payment-item-details">
                                                <p className="payment-item-name"><strong>Amount:</strong> ₹ {Number(withdrawal.amount).toFixed(2)}</p>
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
