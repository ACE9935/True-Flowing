"use client"
import { Client, ClientPhoneNumberOrEmail, User, UserQRCode } from "@/types";
import { FormEvent, useState } from "react";
import ClientInput from "./ClientInput";
import PhoneInput from "./PhoneInput";
import { updateUserFieldOfTypeArray } from "@/firebase/updateUserFieldOfTypeArray";
import { Alert } from "@mui/material";
import AppSpinner from "@/components/AppSpinner";
import { Box, Modal } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../client-state/hooks";
import { setClientEmail, setClientName, setClientPhoneNumber, setSubmitDate } from "../client-state/client-state";
import { TransitionalClientComponent } from "./ClientPageSections";
var validator = require('validator');
import { db } from "@/firebase/firebase";
import { collection, getDocs, query, where, doc as firestoreDoc, updateDoc, arrayUnion, DocumentData } from "firebase/firestore";
import { useDisclosure } from "@chakra-ui/react";
import { motion } from "framer-motion";
import axios from "axios";
import { formatDate } from "@/utils/formatDate";

export async function checkClientExists(userId: string, email: string, phoneNumber: string): Promise<boolean> {
  try {
      const collectionRef = collection(db, 'users');
      const q = query(collectionRef, where("id", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
          for (const doc of querySnapshot.docs) {
              const docData = doc.data();
              const clients = docData.clients || []; 

              const clientExists = clients.some((client:Client) => 
                  client.infos.email == email && client.infos.phoneNumber == ("+"+phoneNumber)
              );

              if (clientExists) {
                  console.log("Client exists in the user's clients array.");
                  return true;
              }
          }
      } else {
          console.log("No matching documents found.");
      }

      console.log("No matching client found.");
      return false;
  } catch (error) {
      console.error("Error checking client existence:", error);
      throw error; 
  }
}

export async function addClientPhoneNumberOrEmail(userId: string, fieldToUpdate: string, newValue: any) {
    try {
        const collectionRef = collection(db, 'users');
        const q = query(collectionRef, where("id", "==", userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach(async (doc) => {
                const docData = doc.data();
                const arrayField = docData[fieldToUpdate] as DocumentData[];

                const isUnique = !arrayField.some(item => item.content === newValue.content);

                if (isUnique) {
                    const docRef = firestoreDoc(collection(db, "users"), doc.id);
                    await updateDoc(docRef, {
                        [fieldToUpdate]: arrayUnion(newValue)
                    });
                    console.log("Document field successfully updated!");
                } else {
                    console.log("Element with this content already exists.");
                }
            });
        } else {
            console.log("No matching documents found.");
        }
    } catch (error) {
        console.error("Error updating document field:", error);
    }
}

export interface ClientInfos {
    submitDate: string
    id:string
    name:string
    email:string
    phoneNumber:string
    qrcodeId:string
    winningCode?:string
    prize?:string
}

export async function checkContentAndValidateStopToken(userId: string, arrayFieldToCheck: string, contentToMatch: string) {
  try {
      const collectionRef = collection(db, 'users');
      const q = query(collectionRef, where("id", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
          for (const doc of querySnapshot.docs) {
              const docData = doc.data();
              const arrayField = docData[arrayFieldToCheck]

              const matchedElement = arrayField.find((element:ClientPhoneNumberOrEmail) => element.content === contentToMatch);

              if (matchedElement) {
                if(!matchedElement.stopToken) return false
                try {
                  const response:any = await axios.post('/api/verify-jwt-token', { token:matchedElement.stopToken })
                  
                  if(response.data.error) return false
                  else return true
                } catch (error) {
                  console.error('Error fetching data', error);
                  return false
                }
              }
          }

          console.log("No matching element found with the specified content.");
      } else {
          console.log("No matching documents found.");
      }
  } catch (error) {
      console.error("Error querying document field:", error);
  }

  return null; 
}

function ClientForm({handler}:TransitionalClientComponent) {

  const [loading,setLoading]=useState(false)
  const globalState = useAppSelector(state => state.client);
  const dispatch = useAppDispatch();
  const [formError,setFormError]=useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [errors,setErrors]=useState({name:{status:false,msg:""},email:{status:false,msg:""},phoneNumber:{status:false,msg:""}})

  const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);
    
      try {
        setFormError("");
    
        let hasErrors = false; // Flag variable to track if any errors were found
        
        if (globalState.client.infos.name === "") {
          setErrors(prev => ({ ...prev, name: { status: true, msg: "" } }));
          hasErrors = true; // Set flag to true if an error is found
        }
        if (globalState.client.infos.email === "") {
          setErrors(prev => ({ ...prev, email: { status: true, msg: "" } }));
          hasErrors = true; // Set flag to true if an error is found
        }
    
        if (globalState.client.infos.phoneNumber === "") {
          setErrors(prev => ({ ...prev, phoneNumber: { status: true, msg: "" } }));
          hasErrors = true;
        } else if (!validator.isMobilePhone(globalState.client.infos.phoneNumber, 'any')) {
          setErrors(prev => ({ ...prev, phoneNumber: { status: true, msg: "Invalid number" } }));
          hasErrors = true;
        }
    
        if (globalState.client.infos.email !== "" && !validator.isEmail(globalState.client.infos.email)) {
          setErrors(prev => ({ ...prev, email: { status: true, msg: "Invalid email" } }));
          hasErrors = true;
        }
    
        // Execute the following block only if no errors were found
        if (!hasErrors) {
          const isValidStopToken=await checkContentAndValidateStopToken(globalState.providerId!,"clientPhoneNumbers","+"+globalState.client.infos.phoneNumber)
          if(isValidStopToken) onOpen()
            else{
              const currentDate = new Date();
              const formattedDate = formatDate(currentDate);
              dispatch(setSubmitDate(formattedDate))
          const newClient: Client = { 
              infos: {...globalState.client.infos,phoneNumber:"+"+globalState.client.infos.phoneNumber,submitDate:formattedDate,qrcodeId:globalState.qrCode?.id!} };
            await addClientPhoneNumberOrEmail(globalState.providerId!,"clientPhoneNumbers",{content:"+"+globalState.client.infos.phoneNumber})
            await addClientPhoneNumberOrEmail(globalState.providerId!,"clientEmails",{content:globalState.client.infos.email})
            const clientExists=await checkClientExists(globalState.providerId!,globalState.client.infos.email,globalState.client.infos.phoneNumber)
            if(!clientExists) await updateUserFieldOfTypeArray(globalState.providerId!, "clients", newClient)
            
            handler()
        }}
      } catch (e) {
        setFormError("An error occurred, please try again later");
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

  return (
      <div className="bg-secondary-color p-9 rounded-lg w-full max-w-[34rem] flex flex-col items-center">
        <Modal open={isOpen} onClose={onClose} disableAutoFocus>
          <>
           <Box sx={{
           position: 'absolute',
           top: '50%',
           left: '50%',
           transform: 'translate(-50%, -50%)',
           }}>
            <motion.div
            initial={{scale:0}}
            animate={{scale:1}}
            className='p-6 sm:px-14 flex flex-col items-center gap-6 rounded-md w-[30rem] bg-slate-100'
            transition={{type:"spring"}}
            >
            <h1 className='text-center text-2xl'>Alert</h1>
            <div className='text-center'>
            We inform you that you cannot play our roulette game at the moment. You will be able to try again only 2 hours after your previous attempt. Thank you for your understanding and patience.
            </div>
            <button onClick={onClose} className="bg-primary-color rounded-full text-white px-6 p-4 font-bold">Close</button>
            </motion.div>
           </Box>
           </>
          </Modal>
          <div className="flex flex-col gap-4">
          <img src={globalState.qrCode?.meta.logoImg} className="w-auto h-[6rem] self-center"/>
          <p className="text-lg text-center font-medium text-slate-600 relative pb-6">{globalState.qrCode?.meta.introductoryText}</p>
          </div>
       <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[90%]">
       {formError?<Alert severity="error">{formError}</Alert>:<></>}
              <ClientInput
              error={errors.name.status}
              helperText={errors.name.msg}
              value={globalState.client.infos.name} 
              type="name"
              onChange={(e) =>{
                  if(errors.name) setErrors(prev=>({...prev,name:{status:false,msg:""}}))
                    dispatch(setClientName(e.target.value))
              }}
              label="Your name"/>
              <ClientInput
              type="email"
              error={errors.email.status}
              helperText={errors.email.msg}
              value={globalState.client.infos.email} 
              onChange={(e) =>{
                  if(errors.email) setErrors(prev=>({...prev,email:{status:false,msg:""}}))
                    dispatch(setClientEmail(e.target.value))} 
              }
              label="Your email"/>
              <PhoneInput
              error={errors.phoneNumber.status}
              value={globalState.client.infos.phoneNumber} 
              helperText={errors.phoneNumber.msg}
              onChange={(x:string) =>{
                  if(errors.phoneNumber) setErrors(prev=>({...prev,phoneNumber:{status:false,msg:""}}))
                    dispatch(setClientPhoneNumber(x))} 
              }
              label="Phone number"/>
              
              <button type="submit" className="bg-primary-color p-3 font-bold rounded-full text-white self-center px-6 flex gap-2">Continue {loading&&<AppSpinner size={25} variant="LIGHT"/>}</button>
  </form>
  </div>
   );
}

export default ClientForm;

