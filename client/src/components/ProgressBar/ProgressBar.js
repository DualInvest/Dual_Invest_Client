import React from "react";
import PropTypes from "prop-types";
import GradientCircleProgressbar from "../../components/GradientCircleProgressbar/GradientCircleProgressbar.js";

const ProgressBar = ({ investedAmount }) => {
  const maxAmount = 300000; // Update the max amount as per your requirement
  const progress = (investedAmount / maxAmount) * 100;
  return (
    <center>
      <GradientCircleProgressbar
        percentage={progress}
        investedAmount={investedAmount.toFixed(2)}
        width={300}
        primaryColor={["#ff9891", "#8784dc"]}
      />
    </center>
  );
};

ProgressBar.propTypes = {
  investedAmount: PropTypes.number.isRequired,
};

export default ProgressBar;
