import { configurations } from "@/app-configurations";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA5hXw00_VQNjq9Izc0Hbl0yfKP_TPSawk",
  authDomain: "abt-digital.firebaseapp.com",
  projectId: "abt-digital",
  storageBucket: "abt-digital.appspot.com",
  messagingSenderId: "1042338414736",
  appId: "1:1042338414736:web:1cd7126384062471735815",
  measurementId: "G-T1HH7R6VRC"
};

export const actionCodeSettings = {
  url: `${configurations.host}/dashboard?verified=true`, // URL where the link will redirect to after email verification
  handleCodeInApp: true, // This must be true for redirects to work on mobile devices// Optional, if you're using Firebase Dynamic Links
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
const db = getFirestore(app)
const storage=getStorage(app)

export {app,auth,db,storage}