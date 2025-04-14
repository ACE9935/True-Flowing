import { User } from "@/types";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { auth } from "./firebase";
import { db } from "./firebase";
import axios from "axios";



export async function addUser(user:User,provider:"Google"|"Email") {
    try {
        const collectionRef = collection(db, 'users'); 
        if(provider=="Email"){
            const response = await axios.post('/api/generate-verification-token', {
             email:user.email
            });
            if(!response.data){
                await deleteUser(auth.currentUser!);
                throw Error("Unable to signin user")
              }
            user={...user,verificationToken:response.data}
        }
        // Check if a document with the same ID already exists
        const q = query(collectionRef, where("id", "==", user.id));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            const docRef = await addDoc(collectionRef, user);
            console.log("User added to the store");
            return user
        }else{
            console.log("User already exists in the store");
            return null
        }

    } catch (error) {
        console.error("Error adding document: ", error);
        throw error; // Re-throwing the error to be handled by the caller
    }
}