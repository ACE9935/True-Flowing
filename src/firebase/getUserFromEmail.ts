
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

export async function getUserFromEmail(email:string) {
    try {
        const usersRef = collection(db, 'users');
        
        // Query for documents where the 'email' field matches the provided email
        const q = query(usersRef, where('email', '==', email));

        // Execute the query
        const querySnapshot = await getDocs(q);

        // Check if there are any matching documents
        if (!querySnapshot.empty) {
            // Assuming email is unique, there should be at most one matching document
            const userDoc = querySnapshot.docs[0];
            // Access the document data
            const userData = userDoc.data();
            return userData;
        } else {
            // No matching document found
            return null;
        }
    } catch (error) {
        console.error("Error getting user document: ", error);
        throw error; // Re-throwing the error to be handled by the caller
    }
}