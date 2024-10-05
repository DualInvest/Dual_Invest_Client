// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserSessionPersistence, deleteUser } from "firebase/auth";
import { getFirestore, setDoc, addDoc, doc, getDoc, deleteDoc,query, where, collection, getDocs,updateDoc, arrayUnion} from "firebase/firestore";
import { getStorage  } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyC_Tcx4yIyJCfJK6VhpHRM8Vq9TRKK6dgU",
  authDomain: "tatainvest-71bd6.firebaseapp.com",
  projectId: "tatainvest-71bd6",
  storageBucket: "tatainvest-71bd6.appspot.com",
  messagingSenderId: "1022642675405",
  appId: "1:1022642675405:web:2eebe654aa302eb17e9384",
  measurementId: "G-TR5BYENGCZ"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable persistence 
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Session persistence enabled");
  })
  .catch((error) => {
    console.error("Error enabling session persistence:", error);
  });

export { auth };


export const createUserDocument = async (user, name, parentReferralCode,phone,address) => {
  if (!user) return;
  console.log(user.uid);
  try {
    await setDoc(doc(db, "users", user.uid),
      {
        name: name,
        email: "",
        phone: phone,
        address: address,
        investedAmount: 0,
        referralCode: user.uid,
        parentReferralCode: parentReferralCode,
        referralAmount: 0,
        interestAmount: 0,
        withdrawableAmount: 0,
        investmentTransactions: [],
        withdrawalTransactions: [],
        kycDone: false,
        referralUsers: [],
        createdAt: new Date(),
        documentUrl: ''
      });

    console.log("User document created successfully!");
  } catch (error) {
    console.log('Error in creating user', error);
  }
}
export const createUserDocumentFast2SMS = async (userId, name, parentReferralCode,phone,email) => {
  if (!userId) return;
  try {
    await setDoc(doc(db, "users", userId),
      {
        name: name,
        email: email,
        phone:phone,
        address: "",
        investedAmount: 0,
        referralCode: userId,
        parentReferralCode: parentReferralCode,
        referralAmount: 0,
        interestAmount: 0,
        withdrawableAmount: 0,
        investmentTransactions: [],
        withdrawalTransactions: [],
        kycDone: false,
        referralUsers: [],
        createdAt: new Date(),
        documentUrl: ''
      });
      if(parentReferralCode !== "")  {  
        const parentRef = doc(db, 'users', parentReferralCode);
        await updateParentReferralArray(parentRef, userId);  
      }

    console.log("User document created successfully!");
  } catch (error) {
    console.log('Error in creating user', error);
  }
}
const updateParentReferralArray = async (parentRef, childId) => {
  try {
    const parentRefDoc = await getDoc(parentRef);
    if (parentRefDoc.exists()) {
      const parentData = parentRefDoc.data();
      const investmentTransactions = parentData.referralUsers || [];
      if (!investmentTransactions.includes(childId)) {
        investmentTransactions.push(childId);
        await updateDoc(parentRef, { referralUsers: investmentTransactions });
        console.log("Parent referralUsers array updated successfully!");
      }
    } else {
      console.log("Parent document not found");
    }
  } catch (error) {
    console.error("Error updating parent referralUsers array:", error);
  }
}


export const getSingleUser = async (uid) => {
  // Wait until auth.currentUser is available
  while (!auth.currentUser) {
    // Wait for a short interval before checking again
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Once auth.currentUser is available, fetch the user data
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data returned successfully");
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    return null;
  }
};

export default getSingleUser;



export const handleDeleteAccount = async () => {
  const currentUser = auth.currentUser;

  if (currentUser) {
    try {
      await deleteUser(currentUser);
      const userRef = doc(db, "users", currentUser.uid);
      await deleteDoc(userRef);

      console.log('User account deleted successfully!');
    } catch (error) {
      console.error('Error deleting user account:', error);
    }
  } else {
    console.warn('No user is signed in');
  }
};
export const updateInvestmentTransactionsArray = async(parentRef, investmentDetails)=>{
  try {
    const parentRefDoc = await getDoc(parentRef);
    if (parentRefDoc.exists()) {
      const parentData = parentRefDoc.data();
      const investmentTransactions = parentData.investmentTransactions || [];
      if (!investmentTransactions.includes(investmentDetails)) {
        investmentTransactions.push(investmentDetails);
        await updateDoc(parentRef, { investmentTransactions: investmentTransactions });
        console.log("investment Transaction array updated successfully!");
      }
    } else {
      console.log("Parent document not found");
    }
  } catch (error) {
    console.error("Error updating investment transactions array:", error);
  }
}
export const updateWithdrawalTransactionsArray = async(parentRef, withdrawalDetails)=>{
  try {
    const parentRefDoc = await getDoc(parentRef);
    if (parentRefDoc.exists()) {
      const parentData = parentRefDoc.data();
      const withdrawalTransactions = parentData.withdrawalTransactions || [];
      if (!withdrawalTransactions.includes(withdrawalDetails)) {
        withdrawalTransactions.push(withdrawalDetails);
        await updateDoc(parentRef, { withdrawalTransactions: withdrawalTransactions });
        console.log("withdrawal Transaction array updated successfully!");
      }
    } else {
      console.log("Parent document not found");
    }
  } catch (error) {
    console.error("Error updating investment transactions array:", error);
  }
}
export const checkUserExists = async (phone) => {
  try {
    // Create a query to check if a user with the given phone number exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('phone', '==', phone));

    // Execute the query
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Get the first document (assuming phone numbers are unique)
      const doc = querySnapshot.docs[0].data();
      // Return the referral code if available
      return doc.referralCode;
    } else {
      // If no user found, return empty string
      return '';
    }
    // Return true if a user with the given phone number exists, otherwise false
    // return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking user existence:', error);
    throw error;
  }
};




export const createPaymentApprovalRequest = async (userId, userName, phone, amount, utrNumber, screenshotUrl) => {
  try {
    // Add the payment approval request to the paymentApprovalRequests collection
    const paymentApprovalRef = await addDoc(collection(db, "paymentApprovalRequests"), {
      userId: userId,
      name: userName,
      phone: phone,
      amount: amount,
      status: 'pending',
      createdAt: new Date(),
      UTR: utrNumber, 
      proofURL: screenshotUrl
    });

    // Retrieve the user document
    const userRef = doc(db, 'users',userId);

    await updateInvestmentTransactionsArray(userRef, paymentApprovalRef.id)
  } catch (error) {
    console.log('Error in creating payment approval request', error);
  }
}


export const createWithdrawalApprovalRequest = async (userId, userName, phone, amount, accountNumber, ifscCode, cardholderName) => {
  try {
    const paymentWithdrawalRef = await addDoc(collection(db, "withdrawalApprovalRequests"),
      {
        userId: userId,
        name: userName,
        phone: phone,
        UPI_ID: "",
        amount: amount,
        status: 'pending',
        accountNumber:accountNumber,
        ifscCode:ifscCode,
        cardholderName:cardholderName,
        createdAt: new Date()
      });
      const userRef = doc(db, 'users',userId);

      await updateWithdrawalTransactionsArray(userRef, paymentWithdrawalRef.id)
    console.log("Withdrawl approval request created successfully!");
  } catch (error) {
    console.log('Error in creating Withdrawl approval request', error);
  }
}

export const deleteDocument = async (collectionName, documentId) => {
  try {
    // Get a reference to the document
    const docRef = doc(db, collectionName, documentId);

    // Delete the document
    await deleteDoc(docRef);

    console.log('Document deleted successfully');
  } catch (error) {
    console.error('Error deleting document:', error);
  }
};


export const createKYCApprovalRequest = async (userId, aadharUrl,panUrl,accountNumber, ifscCode, cardholderName,email) => {
  try {
    // Add the payment approval request to the paymentApprovalRequests collection
    const paymentApprovalRef = await addDoc(collection(db, "KYCApprovalRequests"), {
      userId: userId,
      aadharURL:aadharUrl,
      panURL:panUrl,
      status: 'pending',
      accountNumber:accountNumber,
      ifscCode:ifscCode,
      cardHolderName:cardholderName,
      createdAt: new Date(),
      email:email,
    });

    // Retrieve the user document
    // const userRef = doc(db, 'users',userId);

    // await updateInvestmentTransactionsArray(userRef, paymentApprovalRef.id)
    console.log("KYC doc created");
  } catch (error) {
    console.log('Error in creating payment approval request', error);
  }
}

export const acceptKYCApprovalRequest = async (userId, aadharURL,panURL,accountNumber, ifscCode, cardholderName) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      documentUrl: aadharURL,
      documentUrl2:panURL,
      accountNumber:accountNumber,
      ifscCode:ifscCode,
      cardholderName:cardholderName,
      kycDone: true
    });

    console.log('Document URL updated successfully');
  } catch (error) {
    console.error('Error updating document URL:', error);
  }
}
export const rejectKYCApprovalRequest = async (userId, downloadURL1,documentURL2,accountNumber, ifscCode, cardholderName) => {
  try {
    console.log('KYC Approval Rejected Succesfully');
  } catch (error) {
    console.error('Error updating document URL:', error);
  }
}