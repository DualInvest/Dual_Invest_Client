import React from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './navbarbeforeLogin.css';
import { Link } from 'react-router-dom';

export default function NavbarBeforeLogin() {
    const history = useNavigate();
    const handleInvestNow = () => {
        history('/login');
    };
    return (
        <div className='nav-background'>
        <Link to='/'>
        <img src="/assets/logo.png" alt="TataInvest" height="50" width="70" />
        </Link>            <Button
                onClick={handleInvestNow}
                > Invest Now
            </Button>
        </div>
    )
}
