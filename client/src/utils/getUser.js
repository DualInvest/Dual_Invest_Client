import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/config.js";

export const getUser = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const docSnapshot = await getDoc(userRef);
        if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            return userData;
        } else {
            console.log('No such document!');
            return null;
        }
    } catch (error) {
        console.log('Error getting document:', error);
        return null;
    }
}
