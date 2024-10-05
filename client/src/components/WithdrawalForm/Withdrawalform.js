import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, TextField, Button, Box } from '@mui/material';

function WithdrawalForm({ open, onClose, onSubmit }) {
  const [amount, setAmount] = useState('');
  // const [UPI_ID, setUPI_ID] = useState('');

  const handleSubmit = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.');

      if(amount < 1000){
        alert("Minimum Withdrawal Amount is ₹1000");
      }
      return;
    }

    onSubmit(amount);
    setAmount('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Withdrawal Form</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default WithdrawalForm;
