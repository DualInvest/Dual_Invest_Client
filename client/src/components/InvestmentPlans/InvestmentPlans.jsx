import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { investmentPlansSlidesMobile } from "../../data.js";
// import investmentImage from '../../assets/numbers.png';
// import investmentImageMobile from '../../assets/numbers-mobile.png';
import './investmentPlans.css';

const InvestmentPlans = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const history = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slides = investmentPlansSlidesMobile;

  useEffect(() => {
    const intervalId = setInterval(() => {
      const isLastSlide = currentIndex === slides.length - 1;
      const newIndex = isLastSlide ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
    }, 2000);
    return () => clearInterval(intervalId);
  }, [currentIndex, slides]);

  const handleInvestClick = () => {
    history('/login');
  };

  return (
    <div className="slider-container">
      <div className='numbers-image-container'>
        {/* <img src={isMobile ? investmentImageMobile : investmentImage} alt="Investment" className='numbers-image' /> */}
        <div>
          <h1 className="crore-heading">Rs 3,100 lakhs +</h1>
          <h3 className="subheading-crore">money invested</h3>
          <p className="content-crore">through us with NBFC P2P partners</p>
        </div>
        <div className="line">
        </div>
        <div>
          <h1 className="crore-heading">1.6 Mn+</h1>
          <h3 className="subheading-crore">investors community</h3>
          <p className="content-crore">Strong and Growing</p>
        </div>
      </div>
      <div className="container inside-container">
        <div className="slides-container leftColumnInvestment">
          <div className="slide">
            <LazyLoadImage
              src={slides[currentIndex].url}
              alt="Slide"
              className="slide-image"
              effect="blur"
            />
          </div>
          <div className="dots-container">
            {slides.map((_, index) => (
              <div key={index} className={`dot ${index === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(index)} />
            ))}
          </div>
        </div>
        <div className="rightColumnInvestment">
          <h1 className="ReturnGrowText">Watch your returns grow everyday</h1>
          <h4 className="DailyReturnText">Track returns daily along with your lifetime earnings</h4>
          <button className="invest-button" onClick={handleInvestClick}>Invest Now</button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPlans;
