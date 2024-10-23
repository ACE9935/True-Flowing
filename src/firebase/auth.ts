import { InitialUser, SignUpErrors, SignUpResponse, User, LoginResponse, PwdResetResponse, PwdResetSecondResponse } from "@/types";
import { auth, } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { addUser } from "./addUser";
import { configurations } from "@/app-configurations";
import axios from "axios";
import { getUserFromEmail } from "./getUserFromEmail";
import { generateClientAccessToken } from "@/utils/generateClientAccessToken";
import generateRandomId from "@/utils/generateRandomId";
var validator = require('validator');

// Function to create a user with email and password
export const doCreateUserWithEmailAndPassword = async ({userName,name,email, pwd,rePwd,acceptPlcs,phone}:InitialUser):Promise<SignUpResponse> => {
  const errors:SignUpErrors={error:{userName:"",name:"",email:"",pwd:"",rePwd:"",phone:"",acceptPlcs:""}}
  
  if (!name) errors.error.name = "A name is required";
  if (!userName) errors.error.userName = "A username is required";
  
  // Check if email is provided and is valid
  if (!email) {
    errors.error.email = "An email address is required";
    return {errors:errors,status:"ERROR"}
  } else if (!validator.isEmail(email)) {
    errors.error.email = "Please provide a valid email address";
    return {errors:errors,status:"ERROR"}
  }

  // Check if password is provided and meets criteria
  if (!pwd) {
    errors.error.pwd = "A password is required";
    return {errors:errors,status:"ERROR"}
  } else if (pwd.length < 6) {
    errors.error.pwd = "The password must be at least 6 characters long";
    return {errors:errors,status:"ERROR"}
  }

  // Check if re-entered password matches the original password
  if (pwd !== rePwd) {
    errors.error.rePwd = "Passwords do not match";
    return {errors:errors,status:"ERROR"}
  }

  // Check if phone number is provided and is valid
  /*if (!phone) {
    errors.error.phone = "A phone number is required";
    return {errors:errors,status:"ERROR"}
  } else if (!validator.isMobilePhone(phone,false)) {
    errors.error.phone = "Please provide a valid phone number";
    return {errors:errors,status:"ERROR"}
  }*/

  // Check if terms and conditions are accepted
  if (!acceptPlcs) {
    errors.error.acceptPlcs = "Please check this box";
    return {errors:errors,status:"ERROR"}
  }

  try {
    await createUserWithEmailAndPassword(auth, email, pwd);

    // Update user profile with name
    if (auth.currentUser) {
      const data:User={userName,name,email,phone,acceptPlcs,id:auth.currentUser.uid,emailVerified:false,photoUrl:configurations.userImg,qrCodes:[],clients:[],clientEmails:[],clientPhoneNumbers:[],automatedNotifications:[],winnerClients:[]}
      await updateProfile(auth?.currentUser, { displayName: name,photoURL:data.photoUrl })
            .then(async user=>{
              const newUser=await addUser(data,"Email")
              const accessToken=await auth?.currentUser?.getIdToken()
              if(auth.currentUser) await axios.post('/api/send-verification-email', {
                email:newUser?.email!,
                token:newUser?.verificationToken,
                id:newUser?.id,
                accessToken:accessToken
               });
            })
    }

    // Return success status if everything is successful
    return { errors: null, status: "OK",method:"credentials" };
  } catch (error:any) {

      // Firebase authentication error
      if (error.code === 'auth/email-already-in-use') {
        // Handle the case where the email is already in use
        errors.error.email = "The email address is already associated with another account";
        return { errors: errors, status: "ERROR" };
      } else {
        // Handle other types of errors
        console.error('Error creating account:', error);
        // Set a generic error message or handle it based on your requirement
      }

    return { errors: { error: { ...errors.error, email: "An error occurred while creating the account." } }, status: "ERROR" };
  }
};

// Function to sign in with email and password
export const doSignInWithEmailAndPassword = async (email:string, password:string):Promise<LoginResponse> => {

  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    if (!result.user.emailVerified) return {errorMsg: "Please verify your email to log in", status: "ERROR"}
    return {errorMsg:null,status:"OK"}
  } catch (error:any) {

    if (error.code === 'auth/invalid-email') {
      // Handle the case where the email is invalid
      return { errorMsg: "Please provide a valid email address", status: "ERROR" };
    }
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/missing-password') {
      // Handle the case where the user is unfound
      return { errorMsg: "User not found. Please check your email and password", status: "ERROR" };
    } else {
      // Handle other types of errors
      console.error('Error login:', error);
      // Set a generic error message or handle it based on your requirement
    }

    return { errorMsg: 'An error occurred, please try again later', status: "ERROR" };
  }
};

// Function to sign in with Google
export const doSignInWithGoogle = async ():Promise<SignUpResponse> => {
  
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const data:User={name: `User${generateRandomId(6)}`, userName: user.displayName!, email: user.email!, emailVerified: user.emailVerified, id: user.uid, acceptPlcs: true, phone: user.phoneNumber, photoUrl: user.photoURL!, qrCodes: [], clients: [], clientEmails: [], clientPhoneNumbers: [], automatedNotifications: [],winnerClients:[]}
  await addUser(data, "Google")
  return { errors: null, status: "OK", method: "google" };      
};

// Function to sign out
export const doSignOut = () => {
  return auth.signOut();
};

// Function to reset password
export const resetPassword = async (email:string): Promise<PwdResetResponse> => {
  try {
    if (!validator.isEmail(email)) return { errorMsg: 'Please provide a valid email address', status: "ERROR" };

    const user = await getUserFromEmail(email);
    if (!user) return { errorMsg: 'User not found. Please check your email', status: "ERROR" };

    const response = await axios.post('/api/send-password-reset-link', {
      email: email
    });

    // Return success status if everything is successful
    return { errorMsg: null, status: "OK" };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { errorMsg: "An error occurred, please try again later", status: "ERROR" };
  }
}

// Function to update password
export const updatePassword = async (pwd:string,rePwd:string,token:string,id:string): Promise<PwdResetSecondResponse> => {
  const errors={pwd:"",rePwd:""};
  try {
    if (!pwd) {
      errors.pwd = "A password is required";
      return {errors:errors,status:"ERROR"}
    } else if (pwd.length < 6) {
      errors.pwd = "The password must be at least 6 characters long";
      return {errors:errors,status:"ERROR"}
    }
  
    // Check if re-entered password matches the original password
    if (pwd !== rePwd) {
      errors.rePwd = "Passwords do not match";
      return {errors:errors,status:"ERROR"}
    }

    await axios.post('/api/set-password', {
      password: pwd,
      token,
      id
    });

    // Return success status if everything is successful
    return { errors: null, status: "OK" };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { errors: {pwd: "An error occurred, please try again later", rePwd: ""}, status: "ERROR" };
  }
}
