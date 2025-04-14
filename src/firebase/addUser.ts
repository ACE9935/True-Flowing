import { User } from "@/types";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { auth } from "./firebase";
import { db } from "./firebase";
import axios from "axios";

export async function addUser(user: User, provider: "Google" | "Email") {
  const collectionRef = collection(db, "users");

  try {
    // Handle email verification if needed
    if (provider === "Email") {
      const response = await axios.post("/api/generate-verification-token", {
        email: user.email,
      });

      const token = response?.data;

      if (!token) {
        throw new Error("Unable to sign in user: missing verification token");
      }

      user = { ...user, verificationToken: token };
    }

    // Check if user already exists in Firestore
    const q = query(collectionRef, where("id", "==", user.id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(collectionRef, user);
      console.log("User added to the store");
      return user;
    } else {
      console.log("User already exists in the store");
      return null;
    }
  } catch (error) {
    console.error("Error adding user:", error);

    // Clean up the Firebase auth user if something went wrong
    try {
      await deleteUser(auth.currentUser!);
      console.log("Auth user deleted due to failure.");
    } catch (deleteError) {
      console.error("Failed to delete auth user:", deleteError);
    }

    throw error;
  }
}
