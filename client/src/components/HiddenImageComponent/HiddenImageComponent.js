import React, { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './HiddenImageComponent.css'; // Import CSS for styling

const HiddenImageComponent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Simulate slight delay before showing "Know More" button
        const timeoutId = setTimeout(() => setIsVisible(true), 300);
        return () => clearTimeout(timeoutId);
    }, []); // Empty dependency array to run only once on component mount

    const handleKnowMoreClick = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsVisible(!isVisible);
            setIsAnimating(false);
        }, 500); // Control animation duration
    };

    return (
        <div className="mobile-image-container">
            <div className="image-wrapper" style={{paddingTop:'5%'}}>
                {/* Text on the left */}
                <div className="left-text">
                    <h3 className='step-text-small'>Get Started in</h3>
                </div>
                <LazyLoadImage
                    src="/assets/hidden-pic1.png"
                    alt="First"
                    className={`mobile-image ${isVisible ? '' : 'initial-opacity'}`} // Toggle initial opacity for first image
                    effect="blur"
                />
                <div className='right-text'>
                    <br />
                    <h2 className='step-text'>4 Easy Steps</h2>
                </div>
            </div>
            {isVisible && (
                <div className="know-more-button" onClick={handleKnowMoreClick}>
                    <span className="button-text">Know More</span>
                    <i
                        className={`arrow-icon fas fa-chevron-down ${isAnimating ? 'animate-arrow' : ''}`} // Animate arrow on click
                    ></i>
                </div>
            )}
            {!isVisible && ( // Wrap additional images with conditional rendering
                <> {/* Use React fragment to avoid unnecessary wrapper */}
                    <div className={`mobile-image-container-images ${isAnimating ? 'slide-down' : ''}`}>
                        <div className="image-wrapper">
                            <div className="left-text">
                                <h2 className='step-text' style={{opacity:'0.5'}}>
                                    Step-1
                                </h2>
                            </div>
                            <LazyLoadImage
                                src="/assets/hidden-pic2.png"
                                alt="Second"
                                className="mobile-image"
                                effect="blur"
                            />
                            <div className="right-text">
                                <h2 className='step-text'>
                                    Sign-Up
                                </h2>
                                <br />
                                <h2 className='step-text-small' style={{ fontSize: '25px' }}>
                                    Download the app from Google playstore or App store and sign-up
                                </h2>
                            </div>
                        </div>
                        <div className="image-wrapper">
                            <div className="left-text"><h2 className='step-text' style={{opacity:'0.5'}}>
                                Step-2
                            </h2></div>
                            <LazyLoadImage
                                src="/assets/hidden-pic3.png"
                                alt="Third"
                                className="mobile-image"
                                effect="blur"
                            />
                            <div className="right-text">
                                <h2 className='step-text'>
                                    Add details
                                </h2>
                                <br />
                                <br />
                                <h2 className='step-text-small' style={{ fontSize: '25px' }}>
                                    Add and verify your phone number, PAN number and bank account details
                                </h2>
                            </div>
                        </div>
                        <div className="image-wrapper">
                            <div className="left-text"><h2 className='step-text' style={{opacity:'0.5'}}>
                                Step-3
                            </h2></div>
                            <LazyLoadImage
                                src="/assets/hidden-pic4.png"
                                alt="Fourth"
                                className="mobile-image"
                                effect="blur"
                            />
                            <div className="right-text">
                                <h2 className='step-text'>
                                    Select tier
                                </h2>
                                <br />
                                <h2 className='step-text-small' style={{ fontSize: '25px' }}>
                                    Choose your preferred tier best suited to maximize your earnings
                                </h2>
                            </div>
                        </div>
                        <div className="image-wrapper">
                            <div className="left-text"><h2 className='step-text' style={{opacity:'0.5'}}>
                                Step-4
                            </h2></div>
                            <LazyLoadImage
                                src="/assets/hidden-pic5.png"
                                alt="Fifth"
                                className="mobile-image"
                                effect="blur"
                            />
                            <div className="right-text">
                                <h2 className='step-text'>
                                    Start earning!
                                </h2>
                                <br />
                                <h2 className='step-text-small' style={{ fontSize: '25px' }}>
                                    Add money and invest to see your money grow!
                                </h2>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default HiddenImageComponent;
