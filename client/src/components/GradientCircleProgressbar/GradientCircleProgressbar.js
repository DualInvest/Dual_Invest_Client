import React from "react";
import PropTypes from "prop-types";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link } from "react-router-dom";

const GradientCircleProgressbar = ({
  percentage,
  investedAmount,
  width,
  primaryColor,
}) => {
  return (
    <center style={{ position: 'relative', width: width, height: '200px' }}>
      <CircularProgressbar
        value={percentage}
        text={
          <Link to='/statement'>
            ₹ {investedAmount}
          </Link>
        }
        circleRatio={0.5}
        styles={{
          trail: {
            strokeLinecap: 'butt',
            transform: 'rotate(-90deg)',
            transformOrigin: 'center center'
          },
          path: {
            strokeLinecap: 'butt',
            transform: 'rotate(-90deg)',
            transformOrigin: 'center center',
            color: 'purple'
          },
          text: {
            fill: 'black',
            fontSize: '13px'
          }
        }}
      />
      <defs>
        <linearGradient id={`gradient-${primaryColor[0]}-${primaryColor[1]}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor[0]} />
          <stop offset="100%" stopColor={primaryColor[1]} />
        </linearGradient>
      </defs>
    </center>
  );
};

GradientCircleProgressbar.propTypes = {
  percentage: PropTypes.number.isRequired,
  width: PropTypes.number,
  strokeWidth: PropTypes.number,
  strokeLinecap: PropTypes.oneOf(["round", "square", "butt"]),
  fontSize: PropTypes.string,
  fontColor: PropTypes.string,
  fontFamily: PropTypes.string,
  primaryColor: PropTypes.array,
  secondaryColor: PropTypes.string,
  fill: PropTypes.string,
  hidePercentageText: PropTypes.bool,
};


export default GradientCircleProgressbar;