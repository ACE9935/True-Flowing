
import { db } from "./firebase";
import { addDoc, collection, getDocs, query, where, doc as firestoreDoc, updateDoc, arrayUnion } from "firebase/firestore";

export async function updateUserFieldOfTypeArray(userId:string, fieldToUpdate:string, newValue:any) {
    try {
      // Query the collection for the document with the specified id field value
      const collectionRef = collection(db, 'users'); 
      const q = query(collectionRef, where("id", "==", userId));
      const querySnapshot = await getDocs(q);
      // Check if any documents match the query
      if (!querySnapshot.empty) {
        // Iterate over each matching document
        querySnapshot.forEach(async (doc) => {
          // Document found, update the specific field
          const docRef = firestoreDoc(collection(db, "users"), doc.id);
          
          await updateDoc(docRef, {
            [fieldToUpdate]: arrayUnion(newValue)
          });
          console.log("Document field successfully updated!");
        });
      } else {
        console.log("No matching documents found.");
      }
    } catch (error) {
      console.error("Error updating document field:", error);
    }
  }
