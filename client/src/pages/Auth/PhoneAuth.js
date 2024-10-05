import React  from 'react';

export default function PhoneAuth() {
    // const [phone, setPhone] = useState('');
    // const [otp, setOtp] = useState('');
    // const [user, setUser] = useState(null);
    // const [newUser, setNewUser] = useState(false);
    // const [newUserr, setNewUserr] = useState('');

    // const sendOTP = async () => {
    //     try {
    //         if (phone === '') {
    //             alert("Phone Number is required");
    //             return;
    //         }
    //         const recaptcha = new RecaptchaVerifier(auth, 'recaptcha', {});
    //         const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);
    //         console.log("confirmation", confirmation);
    //         setUser(confirmation);
    //     } catch (error) {
    //         console.log("Error", error);
    //     }
    // }

    // const verifyOTP = async () => {
    //     try {
    //         if (otp === '') {
    //             alert("OTP is required");
    //             return;
    //         }
    //         const data = await user.confirm(otp);
    //         console.log("OTP Verified");
    //         console.log("User", data.user);
    //         setNewUserr(data.user.uid);
    //         setNewUser(true);
    //     } catch (error) {
    //         console.log("Error", error);
    //     }
    // }

    // const handleLogout = () => {
    //     signOut(auth)
    //         .then(() => {
    //             console.log('User signed out successfully');
    //             setNewUser(false); // Reset newUser state to indicate user is logged out
    //             setUser(null); // Reset user state to indicate user is logged out
    //         })
    //         .catch((error) => {
    //             console.error('Error signing out:', error);
    //         });
    // };

    return (
        <div>
            {/* <div className="form-group my-5 mx-5 mt-5">
                <input
                    name="phoneNumber"
                    type="tel"
                    placeholder="Phone Number"
                    className="input-field"
                    onChange={(e) => setPhone("+91" + e.target.value)}
                />
                <br />
                <Button onClick={sendOTP} variant='contained'>Send OTP</Button>
                <div id="recaptcha"></div>
                <input
                    name="otp"
                    type="text"
                    placeholder="OTP"
                    className="input-field"
                    onChange={(e) => setOtp(e.target.value)}
                />
                <Button onClick={verifyOTP} variant='contained'>Verify OTP</Button>
                <br />
            </div> */}
        </div>
    );
}
