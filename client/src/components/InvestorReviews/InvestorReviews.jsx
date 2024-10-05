import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import './InvestorReviews.css'; // Import CSS for styling

const InvestorReviews = () => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="investor-reviews-container">
      <h2 className="reviews-heading" >Reviews & Experiences Of Our Investors</h2>
      <Slider {...settings}>
        <div className="review-card ">
          <h4>Very great experience</h4>
          <p className="review-text">“ Great investment platform! I've been using it for a year now and the returns are excellent. ”</p>
          <div className="reviewer-info">
            <span className="reviewer-name"> - Rohit Singh</span>
          </div>
        </div>
        <div className="review-card">
        <h4>Exceptional Application</h4>
          <p className="review-text">“Very secure app for investment, just go with Dual Invest ”</p>
          <div className="reviewer-info">
            <span className="reviewer-name"> - SamJain255</span>
          </div>
        </div>
        <div className="review-card">
        <h4>Can earn daily</h4>
          <p className="review-text">“ I've tried several investment platforms, but this one stands out for its simplicity and great returns. ”</p>
          <div className="reviewer-info">
            <span className="reviewer-name"> - a@5678</span>
          </div>
        </div>
        <div className="review-card">
          <h4>Very great experience</h4>
          <p className="review-text">“ Great investment platform! I've been using it for a year now and the returns are excellent. ”</p>
          <div className="reviewer-info">
            <span className="reviewer-name"> - Rohit Singh</span>
          </div>
        </div>
      </Slider>
      <br /><br />
    </div>
  );
};

export default InvestorReviews;
