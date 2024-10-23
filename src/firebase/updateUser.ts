import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { User } from '@/types';

export async function updateUser(index:"email"|"id",indexValue:string,field:keyof User, newValue:any) {
    try {
        const usersRef = collection(db, 'users');
        
        // Query for documents where the 'email' field matches the provided email
        const q = query(usersRef, where(index, '==', indexValue));

        // Execute the query
        const querySnapshot = await getDocs(q);

        // Check if there are any matching documents
        if (!querySnapshot.empty) {
            // Assuming email is unique, there should be at most one matching document
            const userDoc = querySnapshot.docs[0];
            // Get the document reference
            const docRef = doc(db, 'users', userDoc.id);
            // Update the document
            const updateData:Partial<User> = {};
            updateData[field] = newValue;
            await updateDoc(docRef, updateData);
            console.log(`user ${field} updated successfully`);
            const updatedDocSnapshot = await getDoc(docRef)
            if (updatedDocSnapshot.exists()) return updatedDocSnapshot.data().id
            return 
        } else {
            console.log('No user found with the provided '+index);
            return null;
        }
    } catch (error) {
        console.error("Error updating user document: ", error);
        throw error; // Re-throwing the error to be handled by the caller
    }
}
