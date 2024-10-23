"use client"

import { auth, db } from "@/firebase/firebase";
import { getUserById } from "@/firebase/getUserById";
import { QRCode, User, UserQRCode } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import QrcodeEditorSecondSection from "../../create-qrcode/components/qr-code-edit-tab/QrcodeEditorSecondSection";
import QrcodeEditorThirdSection from "../../create-qrcode/components/qr-code-edit-tab/QrcodeEditorThirdSection";
import QrcodeEditorFourthSection from "../../create-qrcode/components/qr-code-edit-tab/QrcodeEditorFourthSection";
import { useAppDispatch, useAppSelector } from "../../create-qrcode/qr-code-state/hooks";
import { collection, query, where, getDocs, doc as firestoreDoc, updateDoc } from 'firebase/firestore';
import { setQRCode } from "../../create-qrcode/qr-code-state/qr-code-state";
import { useRouter } from "next/navigation";
import { handleUpload } from "../../create-qrcode/components/qr-code-edit-tab/QrcodeEditor";
import { useUser } from "@/context/authContext";
import { useToast } from "@chakra-ui/react";
import AppToast from "@/components/AppToast";
import { Check } from "@mui/icons-material";

function QrcodeEditor({qrCodeId}:{qrCodeId:string}) {

    const qrCodeState:UserQRCode = useAppSelector(state => state.qrCode);
    const dispatch = useAppDispatch();
    const {user,updateUser}=useUser()
    const [section,setSection]=useState(1)
    const [loading,setLoading]=useState(false)
    const router = useRouter();
    const toast = useToast();

    async function updateQRCode(userId:string, qrCodeId:string, newQRCodeData:UserQRCode) {
    
        try {
            setLoading(true);
            const logoUrl=await handleUpload(qrCodeState.meta.logoImg,"logos")

            if(logoUrl) newQRCodeData={...newQRCodeData,meta:{
                ...newQRCodeData.meta,
                logoImg:logoUrl
               }}

            // Query the collection for the document with the specified id field value
            const collectionRef = collection(db, 'users');
            const q = query(collectionRef, where("id", "==", userId));
            const querySnapshot = await getDocs(q);
    
            // Check if any documents match the query
            if (!querySnapshot.empty) {
                // Iterate over each matching document
                querySnapshot.forEach(async (doc) => {
                    // Document found, get the reference
                    const docRef = firestoreDoc(collection(db, "users"), doc.id);
    
                    // Get the current document data
                    const docData = doc.data();
                    const fieldArray = docData["qrCodes"] || [];
    
                    // Find the QR code to be updated
                    const qrCodeIndex = fieldArray.findIndex((qrCode:UserQRCode) => qrCode.id === qrCodeId);
    
                    if (qrCodeIndex !== -1) {
                        // Update the specific QR code in the array field
                        fieldArray[qrCodeIndex] = { ...fieldArray[qrCodeIndex], ...newQRCodeData };
    
                        // Update the document with the modified qrCodes array
                        await updateDoc(docRef, {
                            qrCodes: fieldArray
                        });
                        console.log("QR code successfully updated in the document field!");
                        toast({
                            position: 'bottom-left',
                            render: () => (
                               <AppToast variant="SUCCESS" title="QR code edited" Icon={Check} />
                            ),
                         });
                    } else {
                        console.log("No matching QR code found in the field.");
                    }
                });
            } else {
                console.log("No matching documents found.");
            }
        } catch (error) {
            console.error("Error updating document field:", error);
        } finally {
            setLoading(false);
            router.push("/dashboard/qrcodes");
        }
    }

    useEffect(() => {

                    if (user) {
                        dispatch(setQRCode(user.qrCodes?.find(o => o.id == qrCodeId)));
                    }
    }, []);

    const sections=[
        <QrcodeEditorSecondSection key={0} handlerForward={()=>setSection(2)} />,
        <QrcodeEditorThirdSection key={1} handlerForward={()=>setSection(3)} handlerPrevious={()=>setSection(1)}/>,
        <QrcodeEditorFourthSection key={2} handlerPrevious={()=>setSection(2)} handlerForward={()=>updateQRCode(auth.currentUser?.uid!,qrCodeId,qrCodeState)} isLoading={loading}/>
      ]

      const wrappedSections = sections.map((section, index) => (
        <motion.div
          key={index}  // Use index as key for simplicity, but consider using a unique identifier if available
          initial={{ opacity: 0, top: -100 }}
          animate={{ opacity: 1, top: 0 }}
          transition={{ type: "spring" }}
          style={{ position: 'relative', width: '100%' }}
        >
          {section}
        </motion.div>
      ));
      
return ( 
 <div className="md:flex-row flex flex-col gap-8 p-6 items-center lg:items-start">
 <div className="flex flex-col gap-2 pt-12">
 <div className="bg-primary-blue text-white p-3 rounded-t-xl font-bold text-center">{qrCodeState.name}</div>
  <img src={qrCodeState.url} className="w-full max-w-[18rem]"/>
  <button onClick={()=>router.push(`/dashboard/qrcode/${qrCodeId}`)} className="border-2 border-primary-color bg-slate-400/30 hover:bg-slate-400/70 transition-all font-bold text-black justify-center rounded-lg p-3 flex gap-2 items-center">Cancel edit</button>
   </div>
 <div className="overflow-hidden">
    <AnimatePresence>
    {wrappedSections[section-1]}
    </AnimatePresence>
    </div>
    </div>
);}

export default QrcodeEditor;