import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../Firebase/config.js';
import './css/UpdateInfo.css'; // Import CSS file for styling

const EditUsersDetails = () => {
    const { referralCode } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [newUserData, setNewUserData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        accountNumber: '',
        cardholderName: '',
        ifscCode: ''
    });
    const [isUpdating, setIsUpdating] = useState(false); // Button animation state

    const userFields = ['name', 'email', 'phone', 'address'];
    const bankFields = ['accountNumber', 'cardholderName', 'ifscCode'];

    useEffect(() => {
        const fetchData = async () => {
            if (referralCode) {
                const docRef = doc(db, 'users', referralCode);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserData(data);
                    const filteredUserData = userFields.reduce((obj, key) => {
                        if (data[key]) {
                            obj[key] = data[key];
                        }
                        return obj;
                    }, {});
                    const filteredBankData = bankFields.reduce((obj, key) => {
                        if (data[key]) {
                            obj[key] = data[key];
                        }
                        return obj;
                    }, {});
                    setNewUserData({ ...filteredUserData, ...filteredBankData });
                } else {
                    console.log('No such document!');
                }
            }
        };

        fetchData();
    }, [referralCode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUserData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleUpdateInfo = async () => {
        if (referralCode) {
            const docRef = doc(db, 'users', referralCode);
            setIsUpdating(true); // Start button animation
            await updateDoc(docRef, newUserData);
            setTimeout(() => {
                setIsUpdating(false); // Stop button animation
                navigate(`/profile`); // Redirect to profile page
            }, 1000); // Delay for animation
        }
    };


    return (
        <div className="edit-user-container">
            <h1>Edit User Details</h1>
            <div className="form-section">
                <h2>User Details</h2>
                <table className="user-details-table">
                    <tbody>
                        {userFields.map((key) => (
                            <tr key={key}>
                                <td>{key}</td>
                                <td>
                                    <input
                                        type="text"
                                        name={key}
                                        value={newUserData[key] || ''}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {userData.kycDone && (
                <div className="form-section">
                    <h2>Bank Account Details</h2>
                    <table className="user-details-table">
                        <tbody>
                            {bankFields.map((key) => (
                                <tr key={key}>
                                    <td>{key}</td>
                                    <td>
                                        <input
                                            type="text"
                                            name={key}
                                            value={newUserData[key] || ''}
                                            onChange={handleChange}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <button
                className={`update-button ${isUpdating ? 'updating' : ''}`}
                onClick={handleUpdateInfo}
                disabled={isUpdating}
            >
                {isUpdating ? 'Updating...' : 'Update Info'}
            </button>
        </div>
    );
};

export default EditUsersDetails;
