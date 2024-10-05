export function generateRandomUID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uid = '';
    for (let i = 0; i < 26; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uid += characters[randomIndex];
    }
    return uid;
}
export const generateOTP = () => {
  // Generate random 6-digit OTP
  const randomOTP = Math.floor(100000 + Math.random() * 900000);
  return randomOTP.toString();
};