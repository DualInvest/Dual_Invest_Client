import React from 'react';
import tataCapitalLogo from '../../assets/Tata-capital.png';

export default function PoweredBy() {
  const containerStyle = {
    backgroundImage: 'linear-gradient(to bottom, #ffffff, #b2affe)',
    padding: "6%",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px", // Adjust the gap between the text and the image
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ margin: 0 }}>Powered By</h3> 
      <img src={tataCapitalLogo} alt="Tata Capital Logo" style={{ width: '180px', height: '80px' }} />
    </div>
  );
}
