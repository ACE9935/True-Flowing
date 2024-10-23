"use client"
import { UserQRCode } from "@/types";
import ClientForm from "./ClientForm";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { store } from "../client-state/store";
import { setClientId, setClientPhoneNumber, setProviderId, setQRCode, setQRCodeId, setSavedClient } from "../client-state/client-state";
import { Provider } from "react-redux";
import ClientReviewsForm from "./ClientReviewsForm";
import axios from "axios";
import { collection, getDocs, query, where, doc , updateDoc } from "firebase/firestore";
import ClientSpinWheel from "./ClientSpinWheel";
import { db } from "@/firebase/firebase";
import generateRandomId from "@/utils/generateRandomId";

export interface TransitionalClientComponent {
  handler:()=>void
}

export async function incrementQrCodesScans(userId: string, qrCodeId: string) {
  try {
      // Query the collection for the document with the specified id field value
      const collectionRef = collection(db, 'users');
      const q = query(collectionRef, where("id", "==", userId));
      const querySnapshot = await getDocs(q);

      // Check if any documents match the query
      if (!querySnapshot.empty) {
          // Iterate over each matching document
          for (const docSnapshot of querySnapshot.docs) {
              const data = docSnapshot.data();
              if (data.qrCodes && Array.isArray(data.qrCodes)) {
                  // Find the QR code item by ID
                  const qrCodeIndex = data.qrCodes.findIndex((code: any) => code.id === qrCodeId);

                  if (qrCodeIndex !== -1) {
                      // Increment the scans field
                      data.qrCodes[qrCodeIndex].scans = (data.qrCodes[qrCodeIndex].scans || 0) + 1;
                      data.qrCodes[qrCodeIndex].scansPerDay = (data.qrCodes[qrCodeIndex].scansPerDay || 0) + 1;
                      data.qrCodes[qrCodeIndex].scansPerWeek = (data.qrCodes[qrCodeIndex].scansPerWeek || 0) + 1;
                      data.qrCodes[qrCodeIndex].scansPerMonth = (data.qrCodes[qrCodeIndex].scansPerMonth || 0) + 1;

                      // Update the document
                      const docRef = doc(db, 'users', docSnapshot.id);
                      await updateDoc(docRef, { qrCodes: data.qrCodes });

                      console.log('Scans incremented successfully.');
                  } else {
                      console.log('QR code not found.');
                  }
              } else {
                  console.log('The document does not contain a qrCodes array.');
              }
          }
      } else {
          console.log("No matching documents found.");
      }
  } catch (error) {
      console.error("Error updating document field:", error);
  }
}


function ClientPageSections({qrCode,clientId}:{qrCode:UserQRCode,clientId:string}) {

    const [section,setSection]=useState(1)
    const [loading, setLoading]=useState(true)

    useEffect(() => {
       store.dispatch(setProviderId(clientId));
       store.dispatch(setQRCodeId(qrCode.id))
       store.dispatch(setClientId(generateRandomId(16)))
       store.dispatch(setQRCode(qrCode));

    const fetchData = async () => {
      const token = localStorage.getItem('clientAccessToken');
      if (!token) {
       
        await incrementQrCodesScans(clientId,qrCode.id)
        setLoading(false)
        return;
      }

      try {
        const response:any = await axios.post('/api/verify-jwt-token', { token })
        .then((x)=>{
          const { exp, iat, ...clientDataWithoutExpIat } = x.data.data;
          store.dispatch(setSavedClient(clientDataWithoutExpIat));
          })
        .then(()=>setSection(3))
        
      } catch (error) {
        console.error('Error fetching data', error);
        await incrementQrCodesScans(clientId,qrCode.id)
      }
      finally{
        setLoading(false)
      }
    };

    fetchData();
  }, []);

    const sections=[
        <ClientForm key={0} handler={()=>setSection(2)}/>,
        <ClientReviewsForm key={1} handler={()=>0}/>,
        <ClientSpinWheel key={2}/>
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
      <>{loading?
      <div className="flex flex-col items-center gap-4 fade-animation">
      <img src={qrCode.meta.logoImg} width={100}/>
      <img src={qrCode.url} width={260}/>
      </div>
      :<div className="overflow-hidden">
        <Provider store={store}>
          {wrappedSections[section-1]}
        </Provider>
    </div>}</>
     );
}

export default ClientPageSections;