import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { handleDeleteAccount } from "../../Firebase/config.js";
import { getUser } from "../../utils/getUser.js";
import './css/profile.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [bankDetailsVisible, setBankDetailsVisible] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    const fetchedUser = localStorage.getItem('userId');
    if (fetchedUser) {
      getUser(fetchedUser)
        .then((userData) => {
          if (userData) {
            setUser(userData);
            setBankDetailsVisible(userData.kycDone); // Show bank details only if KYC is done
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
      navigate('/login');
    }
  }, [navigate]);

  const handleDeleteUserAccount = () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      handleDeleteAccount()
        .then(() => {
          localStorage.removeItem('userId');
          navigate('/login');
        })
        .catch((error) => {
          console.log('Error deleting user account:', error);
        });
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const shareOnWhatsApp = () => {
    const message = `Get daily 1.2% returns on investments at Tatainvest! 💰 Invest now for hassle-free earnings. Click on this link - https://tatainvest.org/signup?referralCode=${user.referralCode}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl;
  };

  const shareEverywhere = async () => {
    const message = `Get daily 1.2% returns on investments at Tatainvest! 💰 Invest now for hassle-free earnings. Click on the following link.`
    const url = `https://tatainvest.org/signup?referralCode=${user.referralCode}`
    const data = {
      text:message,
      url:url
    }
    if(window.navigator.canShare(data)){
      await window.navigator.share(data);
    }
  };

  return (
    <div className="profile-container">
      {loading ? (
        <p className="loading">Loading user data...</p>
      ) : user ? (
        <div className="profile-card">
          <div className="profile-header">
            <h1>Welcome, {user.name}!</h1>
            <h2>Account Details</h2>
          </div>
          {user.kycDone ? (
            <div className="kyc-status kyc-done">
              <i className="fas fa-check-circle"></i>
              <center>
                <h6>KYC Completed</h6>
                <p>You can start borrowing at 1.2% daily</p>
              </center>
            </div>
          ) : (
            <Link to="/kyc" className="kyc-status kyc-pending">
              <i className="fas fa-exclamation-circle"></i>
              <div>
                <h6>Complete Your KYC</h6>
                <p>Start borrowing at 1.2% daily</p>
              </div>
              <i className="fas fa-chevron-right"></i>
            </Link>
          )}
          <div className="user-details">
            <ul>
              <li>
                <i className="fas fa-phone"></i> Phone Number: {user.phone}
              </li>
              <li>
                <i className="fas fa-envelope"></i> Email: {user.email}
              </li>
              <li>
                <i className="fas fa-calendar"></i> Referral Code: 
                {copied ? (
                  <i className="fas fa-check-circle copied"></i>
                ) : (
                  <i className="far fa-copy copy-icon" onClick={copyReferralCode}></i>
                )}
                <i className="fab fa-whatsapp share-icon" onClick={shareOnWhatsApp}></i>
                <i class="fas fa-share" aria-hidden="true" onClick={shareEverywhere}></i>
              </li>
            </ul>
          </div>
          {bankDetailsVisible && (
            <>
            <div className='profile-header'>
              <h2>Bank Account Details</h2>
            </div>
            <div className="bank-details">
            <ul>
              <li>
                <i className="fas fa-phone"></i> Bank Account No.: {user.accountNumber}
              </li>
              <li>
                <i className="fas fa-envelope"></i> IFSC Code: {user.ifscCode}
              </li>
              <li>
                <i className="fas fa-envelope"></i> Account Holder Name: {user.cardHolderName}
              </li>
            </ul>
            </div></>
          )}

          <div className="action-buttons">
            <ActionButton onClick={handleDeleteUserAccount} text="Delete Account" iconClass="fas fa-trash" color="danger" />
            <ActionButton to={`/updateinfo/${user.referralCode}`} text="Update Info" iconClass="fas fa-edit" color="primary" />
          </div>
        </div>
      ) : (
        <p className="no-user">No user data found.</p>
      )}
    </div>
  );
};

export default ProfilePage;

const ActionButton = ({ onClick, to, iconClass, text, color }) => (
  <button className={`btn btn-${color}`} onClick={onClick}>
    <i className={iconClass}></i>
    {to ? <Link to={to} className="btn-link">{text}</Link> : <span>{text}</span>}
  </button>
);
