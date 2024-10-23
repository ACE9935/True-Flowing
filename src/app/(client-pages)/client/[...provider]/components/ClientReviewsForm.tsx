"use client"
import BrandButton from "@/components/form/BrandButton";
import { useAppSelector } from "../client-state/hooks";
import { TransitionalClientComponent } from "./ClientPageSections";
import axios from "axios";
import { useRouter } from "next/navigation";


function ClientReviewsForm({handler}:TransitionalClientComponent) {

    const globalState = useAppSelector(state => state.client);
    const router = useRouter()

    const handleAccessTokenCreation = async (url:string): Promise<void> => {
      try {
          const response = await axios.post("/api/generate-client-access-token",{data:globalState.client.infos});
          const token = response.data.data; // Assuming the token is in the `data.token` field
          localStorage.setItem('clientAccessToken', token);
          console.log('Token created and stored:');
          router.push(url)
      } catch (error) {
          console.error('Error generating token:', error);
      }
    };

    return ( 
      <div className="p-9 rounded-lg w-full max-w-[34rem] flex flex-col items-center">
           
         <div className="flex flex-col gap-4">
         <img src={globalState.qrCode?.meta.logoImg} className="w-auto h-[6rem] self-center"/>
         <p className="text-lg text-center font-medium text-slate-600 relative pb-6">
          Thank you for leaving a review by following one of the links provided above.</p>
         </div>
       
       <div className="flex flex-col gap-4">
         {globalState.qrCode?.meta.reviewLinks.google&&<BrandButton onClick={()=>handleAccessTokenCreation(globalState.qrCode?.meta.reviewLinks.google!)} url="/google.png">Leave a Google Review</BrandButton>}
         {globalState.qrCode?.meta.reviewLinks.facebook&&<BrandButton onClick={()=>handleAccessTokenCreation(globalState.qrCode?.meta.reviewLinks.facebook!)} url="/facebook.png">Leave a Facebook Review</BrandButton>}
       </div>
       </div>
      );
 
}

export default ClientReviewsForm;