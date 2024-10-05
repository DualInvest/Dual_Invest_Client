import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from "../../utils/getUser.js";
import { auth } from '../../Firebase/config.js';
import './navbar.css';
import { Button, Drawer, List, ListItem, Typography } from '@mui/material';

function Navbar() {
  const history = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userData, setUser] = useState(null);

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
        })
        .catch((error) => {
          console.log('Error fetching user data:', error);
        });
    }
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSignOut = () => {
    // auth.signOut()
    //   .then(() => {
    localStorage.removeItem('userId');
    history('/');
    //   })
    //   .catch(error => {
    //     console.error('Error signing out:', error);
    //   });
  };

  return (
    <div className="container custom-bg-color mt-0 mb-0" style={{ maxWidth: '100%' }}>
      <nav className="navbar navbar-expand-lg " data-bs-theme="dark">

        <div className="container-fluid ">
          <Link to='/'>
            <img src="assets/logo.png" alt="TataInvest" height="50" width="70" />
          </Link>
          <button className="navbar-toggler d-lg-none" type="button" onClick={toggleDrawer}>
            <i className="fa fa-bars" aria-hidden="true"></i>
          </button>
          <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={toggleDrawer}
            className="full-screen-drawer"
          >
            <div className="drawer-content drawer-card" onClick={toggleDrawer}>
              <div style={{ paddingTop: '5px', paddingLeft: '15px', display: 'flex', flexDirection: 'row' }} className='drawer-header'>
                <h3 style={{ paddingRight: '10px' }}>
                  <Typography className="mt-3" variant="p" style={{ textAlign: 'left', fontSize: '20px' }}>Hi <strong>{userData?.name}</strong>,</Typography> <br></br>
                  <Typography className="mt-3" variant="p" style={{ textAlign: 'left', fontSize: '20px' }}>Welcome to <strong>Dual Invest</strong></Typography>
                  {/* <img src="assets/logo.png" alt="TataInvest" width="130" /> */}
                </h3>
                <div className="close-icon" onClick={toggleDrawer} style={{ marginRight: '20px', marginTop: '10px' }}>
                  <i className="fas fa-times" style={{ fontSize: '34px' }}></i>
                </div>
              </div>
              <List>
                {userData && (userData.phone === "7976189199" || userData.phone === '9772090543') ? (
                  <>
                    <ListItem className="list-item">
                      <Link to="/admin">
                        <i className="fas fa-person"></i> Users
                      </Link>
                    </ListItem>
                    <ListItem className="list-item">
                      <Link to="/paymentrequest">
                        <i className="fas fa-person"></i> Payment Requests
                      </Link>
                    </ListItem>
                    <ListItem className="list-item">
                      <Link to="/withdrawalrequest">
                        <i className="fas fa-person"></i> Withdrawal Requests
                      </Link>
                    </ListItem>
                    <ListItem className="list-item">
                      <Link to="/kycrequest">
                        <i className="fas fa-person"></i> KYC Requests
                      </Link>
                    </ListItem>
                  </>
                ) : (
                  <>
                    <ListItem className="list-item">
                      <Link to="/dashboard">
                        <i className="fas fa-home"></i> Home
                      </Link>
                    </ListItem>
                    <ListItem className="list-item">
                      <Link to="/profile">
                        <i className="fas fa-user"></i> Profile
                      </Link>
                    </ListItem>
                    <ListItem className="list-item">
                      <Link to="/statement">
                        <i className="fas fa-file-alt"></i> Statement
                      </Link>
                    </ListItem>
                    <ListItem className="list-item">
                      <Link to="/aboutus">
                        <i className="fas fa-info-circle"></i> About Us
                      </Link>
                    </ListItem>
                    <ListItem className="list-item">
                      <a href="/download">
                        <i className="fas fa-download"></i> Download App
                      </a>
                    </ListItem>
                  </>
                )}
                <ListItem className="list-item" style={{
                  color: 'red', /* Change text color */
                }} onClick={handleSignOut}>
                  <i className="fas fa-sign-out-alt"></i> Log Out
                </ListItem>
              </List>
            </div>
          </Drawer>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-none d-lg-flex">
              {userData && (userData.phone === "7976189199" || userData.phone === '9772090543') ? (
                <>
                  <li className="nav-item">
                    <Link to="/admin" className="nav-link active" aria-current="page">Users</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/paymentrequest" className="nav-link active" aria-current="page">Payment Requests</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/withdrawalrequest" className="nav-link active" aria-current="page">Withdrawal Requests</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/kycrequest" className="nav-link active" aria-current="page">KYC Requests</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/dashboard" className="nav-link active" aria-current="page">Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/profile" className="nav-link active" aria-current="page">Profile</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/statement" className="nav-link active" aria-current="page">Statement</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/aboutus" className="nav-link active" aria-current="page">About Us</Link>
                  </li>
                  <li className="nav-item">
                    <a href="/download" className="nav-link active"><i className="fas fa-download"></i> Download App</a>
                  </li>
                </>
              )}
            </ul>
            <Button onClick={handleSignOut} style={{ backgroundColor: 'white', fontSize: 12, padding: '10px 20px', borderRadius: '20px', margin: '5px' }}>Log Out</Button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;