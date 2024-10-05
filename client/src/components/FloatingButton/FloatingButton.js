import React from 'react';
import './FloatingButton.css'; // Import CSS for styling

const FloatingButton = () => {

  // const shareOnWhatsApp = () => {
  //   const phoneNumber = '7976189199'; // Change to the desired phone number
  //   const message = `Hi, I need support with my account. Can you help me?`;
  //   // Construct the WhatsApp URL
  //   const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  //   window.open(whatsappUrl, '_blank');
  // };

  function sendEmail() {
    // Replace 'your-email@example.com' with the desired email address
    var emailAddress = 'relations@tatainvest.org';
    
    // Open default email client with a pre-filled subject
    window.location.href = 'mailto:' + emailAddress + '?subject=Call%20For%20Support%20';
}
  return (
    <div class='floatingButton'>
    <button
      class='round'
      // onClick={shareOnWhatsApp}
      onClick={sendEmail}
    >
      <i class="fa-solid fa-circle-question mx-1"></i>
    </button>
  </div>
  
  );
};

export default FloatingButton;
