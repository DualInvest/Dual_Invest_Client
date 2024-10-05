import React, { useEffect } from 'react';
import { Snackbar } from '@mui/material';

function ToastMessage({ message, onClose }) {
  // Automatically close the toast after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Snackbar 
      open={true} 
      autoHideDuration={3000} 
      onClose={onClose} 
      message={message} 
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Display at the top center
      sx={{
        backgroundColor: 'green',
        color: 'white',
        borderRadius: '8px',
        marginTop: '10px', // Adjust margin as needed
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: '600px', // Limit width for better readability
      }} 
    />
  );
}

export default ToastMessage;
