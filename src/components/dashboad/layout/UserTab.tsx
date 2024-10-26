"use client"

import { StyledEditableText } from "@/app/(dashboard)/dashboard/create-qrcode/components/qr-code-edit-tab/ClientFormInstance";
import { handleUpload } from "@/app/(dashboard)/dashboard/create-qrcode/components/qr-code-edit-tab/QrcodeEditor";
import AppSpinner from "@/components/AppSpinner";
import AppToast from "@/components/AppToast";
import { useUser } from "@/context/authContext";
import { auth, db } from "@/firebase/firebase";
import { updateUser } from "@/firebase/updateUser";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { Check, Close, Edit, Logout } from "@mui/icons-material";
import { Modal, Skeleton } from "@mui/material";
import { signOut } from "firebase/auth";
import { ChangeEvent, useRef, useState } from "react";
import { getAuth, deleteUser as deleteAuthUser } from "firebase/auth"; 
import { collection, query, where, getDocs, doc as firestoreDoc, deleteDoc } from "firebase/firestore";
import { arrayRemove, updateDoc } from "firebase/firestore"; // Ensure you have the necessary Firestore functions

function UserTabSkeleton() {
    return ( 
        <div className="flex flex-col gap-3 items-center pb-4 w-full">
        <Skeleton variant="rounded" height={30} width={100} sx={{background:"rgba(255,255,255,0.8)"}}/>
        <Skeleton variant="rounded" height={40} width={180} sx={{background:"rgba(255,255,255,0.8)"}}/>
        </div>
     );
}


function UserTab() {

    const {user,updateUser:updateCurrentUser}=useUser()
    const [editIntroductoryText, setEditIntroductoryText] = useState(false);
    const paragraphRef = useRef<HTMLParagraphElement>(null);
    const [userNewName,setUserNewName]=useState(user?.name)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [loading,setLoading]=useState(false)
    const toast = useToast();
    
    async function deleteUser(userId: string) { 
        try {
          setLoading(true);
      
          // Step 1: Query the Firestore users collection for the document with the specified id field value
          const collectionRef = collection(db, 'users'); 
          const q = query(collectionRef, where("id", "==", userId));
          const querySnapshot = await getDocs(q);
      
          // Check if any documents match the query
          if (!querySnapshot.empty) {
            // Iterate over each matching document (although usually userId should be unique)
            querySnapshot.forEach(async (doc) => {
              const docRef = firestoreDoc(collection(db, "users"), doc.id);
      
              // Step 2: Remove user document from Firestore
              await deleteDoc(docRef);
              console.log("User document successfully deleted from Firestore!");
      
              // Step 3: Delete the user from Firebase Authentication
              const auth = getAuth();
              const currentUser = auth.currentUser;
              if (currentUser?.uid === userId) {
                await deleteAuthUser(currentUser);
                console.log("User successfully deleted from Firebase Authentication!");
              } else {
                console.log("No authenticated user matches the specified userId.");
              }
            });
          } else {
            console.log("No matching documents found.");
          }
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      }

    return ( 
        <>{user? <div className="flex flex-col gap-3 items-center pb-4">
            <Modal open={isOpen} onClose={() => {
                onClose();
            }} disableAutoFocus>
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                    className="bg-white rounded-md p-6 flex gap-7 flex-col sm:w-auto w-[90%]">
                    <p className="text-xl">
                        Do you really want to delete your account?</p>

                    <div className="flex gap-3">
                        <button className="border-2 border-primary-color font-bold text-black rounded-full py-3 flex gap-2 items-center px-5" onClick={onClose}>Cancel</button>
                        <button onClick={() => deleteUser(auth.currentUser?.uid!)} className="bg-primary-color font-bold text-white rounded-full py-3 px-5 flex gap-2 items-center">{loading && <AppSpinner variant="LIGHT" size={26} />}Delete</button>
                    </div>
                </div>
            </Modal>
            <div className="flex gap-3">
            <div className="cursor-pointer rounded-full relative h-fit">
            <div className="absolute hover:bg-blue-400/60 text-white w-full h-full pt-[0.35rem] pl-[0.5rem] hover:opacity-100 opacity-0 rounded-full">
            <input onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files[0]) {
                 const selectedImage = e.target.files[0];
                 const newUrl=await handleUpload(selectedImage, "logos")
                 await updateUser("id",user.id,"photoUrl",newUrl)
                 .then(async ()=>{
                    await updateCurrentUser()
                    toast({
                        position: 'bottom-left',
                        render: () => (
                           <AppToast variant="SUCCESS" title="Profile picture updated" Icon={Check} />
                        ),
                     });
                 })
               }
              }} 
             type="file" id="logoInputUser" className='opacity-0 w-0 h-0'/>
            <label htmlFor="logoInputUser" className="w-full h-full rounded-full cursor-pointer absolute"></label>
                <Edit/></div>
            <div style={{background:`url(${user.photoUrl})`}} className="w-[40px] h-[40px] rounded-full !bg-cover !bg-center"></div></div>
            <div className="flex flex-col">
            <div className="relative w-full">
          <StyledEditableText
            suppressContentEditableWarning={true}
            ref={paragraphRef}
            className="text-white font-bold relative"
            autoFocus={editIntroductoryText}
            contentEditable={editIntroductoryText}
          >
            {user.name}
          </StyledEditableText>
          {!editIntroductoryText && (
            <button
              onClick={() =>{
                setEditIntroductoryText(true)}}
              className="w-fit h-fit border-2 border-primary-blue hover:underline text-white py-1 px-2 font-bold rounded-full !text-xs mt-2"
            >
              Edit name
            </button>
          )}
        </div>
        {editIntroductoryText && (
          <div className="flex gap-2 m-1 mt-3">
            <button
              className="rounded-full bg-green-500 py-1 px-[0.30rem] text-white transition-all h-fit text-sm"
              onClick={async() => {
                setEditIntroductoryText(false)
                await updateUser("id",user.id,"name",paragraphRef.current?.innerText)
                
                await updateCurrentUser()
                .then(async ()=>{
                    await updateCurrentUser()
                    toast({
                        position: 'bottom-left',
                        render: () => (
                           <AppToast variant="SUCCESS" title="Account name updated" Icon={Check} />
                        ),
                     });
                 })
              }}
            >
              <Check style={{fontSize:"18px"}}/>
            </button>
            <button
              className="rounded-full bg-red-500 text-white transition-all py-1 px-[0.30rem] h-fit text-sm"
              onClick={() => {
                setEditIntroductoryText(false);
                setUserNewName(user.name)
                if (paragraphRef.current && user.name) {
                    paragraphRef.current.innerText = user.name;
                  }
              }}
            >
              <Close style={{fontSize:"18px"}}/>
            </button>
          </div>
        )}
            </div>
            </div>
            <div className="flex flex-col gap-3">
            <button onClick={()=>signOut(auth)} className="text-white hover:bg-primary-blue-dark text-sm font-bold justify-center px-3 py-2 p rounded-md bg-primary-blue flex items-center gap-2 transition-all">Log out <Logout/></button>
            <button onClick={onOpen} className="text-sm hover:bg-red-400 text-center transition-all hover:text-white font-bold px-3 py-2 rounded-md border-2 text-red-400 border-red-400">Delete account</button>
            </div>
            </div>: <UserTabSkeleton/>}</>
     );
}

export default UserTab;