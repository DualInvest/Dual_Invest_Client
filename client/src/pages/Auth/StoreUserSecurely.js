import CryptoJS from 'crypto-js';

// Secret key for encryption (can be stored in environment variables in a real project)
const secretId = 'tatainvest@123'; // Replace with your actual secret key

/**
 * Encrypt and store the userId securely in localStorage
 * @param {string} userId - The userId to be encrypted and stored
 */
export const storeUserIdSecurely = (userId) => {
  const userIdWithSecret = secretId + userId;

  // Encrypt the userId with the secret
  const encryptedUserId = CryptoJS.AES.encrypt(userIdWithSecret, secretId).toString();

  // Store the encrypted userId in localStorage
  localStorage.setItem('secureUserId', encryptedUserId);
};

/**
 * Retrieve and decrypt the userId from localStorage
 * @returns {string|null} The decrypted userId or null if not found
 */
export const retrieveUserIdSecurely = () => {
  const encryptedUserId = localStorage.getItem('secureUserId');

  if (!encryptedUserId) {
    console.log('No user session found');
    return null; // No user is logged in
  }

  try {
    // Decrypt the encrypted userId
    const bytes = CryptoJS.AES.decrypt(encryptedUserId, secretId);
    const decryptedUserIdWithSecret = bytes.toString(CryptoJS.enc.Utf8);

    // Extract the original userId (remove the secretId from the decrypted string)
    const userId = decryptedUserIdWithSecret.replace(secretId, '');

    return userId; // Return the original userId
  } catch (error) {
    console.error('Error decrypting the userId:', error);
    return null;
  }
};

/**
 * Clear the stored encrypted userId from localStorage
 */
export const clearStoredUserId = () => {
  localStorage.removeItem('secureUserId');
};
