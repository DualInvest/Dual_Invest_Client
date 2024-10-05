import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './maximizeWealth.css'; // Import the CSS file for styling

export default function MaximizeWealth() {
    return (
        <div className="wealth-container">
            <div className="container inside-container">
                <div className="leftColumn">
                    <h2 className="maximizeWealthText">MAXIMIZE YOUR WEALTH</h2>
                    <div className="line" />
                    <h1 className="industryLeadingText">Grow with industry leading returns</h1>
                    <div className="buttons">
                        <a href="https://play.google.com/store/games?hl=en&gl=US&pli=1" className="appButton">
                            <LazyLoadImage
                                src='/assets/playstore.png'
                                alt='playstore'
                                effect="blur"
                            />
                        </a>
                        <a href="https://www.apple.com/in/app-store/" className="appButton">
                            <LazyLoadImage
                                src='/assets/appstore.png'
                                alt='appstore'
                                effect="blur"
                            />
                        </a>
                    </div>
                </div>
                <div className="rightColumn">
                    <div className="mobileImageContainer">
                        <a href="#">
                            <LazyLoadImage
                                src="/assets/mobile-image-paisa.png"
                                alt="Mobile Investment App"
                                className="mobileImage"
                                effect="blur"
                            />
                        </a>
                    </div>
                </div>
            </div>
            <div className="investment-section">
                <h2 className='perfectPlanText2'>What makes it a great investment?</h2>
                <div className="card-container">
                    <div className="card">
                        <LazyLoadImage
                            src="/assets/zero.svg"
                            alt="Card Image"
                            effect="blur"
                        />
                        <h4>Zero joining fee</h4> 
                    </div>
                    <div className="card">
                        <LazyLoadImage
                            src="/assets/seamless.svg"
                            alt="Card Image"
                            effect="blur"
                        />
                        <h4>Seamless digital convenience</h4>
                    </div>
                    <div className="card">
                        <LazyLoadImage
                            src="/assets/handtrust.svg"
                            alt="Card Image"
                            effect="blur"
                        />
                        <h4>Trusted by millions</h4>
                    </div>
                    <div className="card">
                        <LazyLoadImage
                            src="/assets/safe.svg"
                            alt="Card Image"
                            effect="blur"
                        />
                        <h4>Safe, easy and transparent</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}
