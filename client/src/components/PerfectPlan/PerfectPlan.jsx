/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import './perfectPlan.css';
import { useNavigate } from 'react-router-dom';

export default function PerfectPlan() {
    const history = useNavigate();
    return (
        <div className="perfect-plan-section">
            <h1 className='perfectPlanText'>Find Your Perfect Plan</h1>
            <h2 className='perfectPlanText2'>~ Plans starting with 0 lock-in period ~</h2>
            <div className="perfect-plan-card-container">
                <div className="perfect-plan-card">
                    <img src="/assets/leaves.svg" alt="Card Image" />
                    <div>
                        <h6>Grow at up to</h6>
                        <h4>1.2% returns/day*</h4>
                        <p> <i className='fas fa-calender'></i>0 lock-in period</p>
                        <p> <i className='fas fa-money'></i>₹1000 min. amount</p>
                    </div>
                </div>
                <div className="perfect-plan-card">
                    <img src="/assets/leaves2.svg" alt="Card Image" />
                    <div>
                        <h6>Grow at up to</h6>
                        <h4>1.5% returns/day*</h4>
                        <p> <i className='fas fa-calender'></i>0 lock-in period</p>
                        <p> <i className='fas fa-money'></i>₹5000 min. amount</p>
                    </div>
                </div>
                <div className="perfect-plan-card">
                    <img src="/assets/leaves3.svg" alt="Card Image" />
                    <div>
                        <h6>Grow at up to</h6>
                        <h4>1.8% returns/day*</h4>
                        <p> <i className='fas fa-calender'></i>0 lock-in period</p>
                        <p> <i className='fas fa-money'></i>₹10,000 min. amount</p>
                    </div>
                </div>
            </div>
            <button className="invest-button" onClick={() => {
                history('/login')
            }}>Invest Now</button>
        </div>
    );
}
