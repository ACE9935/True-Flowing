"use client";

import ClientInput from "@/app/(client-pages)/client/[...provider]/components/ClientInput";
import styled from '@emotion/styled';
import resolveConfig from 'tailwindcss/resolveConfig';
import Config from "../../../../../../tailwind.config";
import { useEffect, useState } from "react";
import { SMSInterface, User } from "@/types";
import 'react-quill/dist/quill.snow.css'; 
import { genericSMS } from "@/app-configurations";
import axios from 'axios';
import AppSpinner from "@/components/AppSpinner";
import { useUser } from "@/context/authContext";
import { Send } from "@mui/icons-material";

const tailwindConfig = resolveConfig(Config);
const colors = tailwindConfig.theme?.colors as unknown as { [key: string]: string };
const primaryBlue = colors["primary-black"];

const StyledTextArea = styled.textarea`
   :hover {
      outline-width: 2px;
   }
   :focus {
      outline: 2px solid ${primaryBlue || "black"}; 
   }
   outline: 1px solid lightgray;
   border-radius: 8px !important;
   min-height: 18rem;
   resize: none;
`;

function SMSCustomizerForm({ automate, automateValue, automateType, user }: { automate: boolean, automateType: string, automateValue: string, user: User | null }) {

   const [sms, setSms] = useState<SMSInterface>({ sender: "[Brand Name]", sms: "" });
   const [loading, setLoading] = useState(false);
   const {updateUser}=useUser()

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
         // Here, you should include the logic to send the SMS via an API
         const response = await axios.post('/api/send-client-sms', {
            phoneNumbers: user?.clientPhoneNumbers,
            sender: sms.sender,
            content: sms.sms,
         });
         await updateUser();
         console.log('SMS sent successfully:');
         // Handle success response
      } catch (error) {
         console.error('Error sending SMS:', error);
         // Handle error response
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      if (user) setSms(prev => ({ sender: user.name, sms: genericSMS(user.name) }));
   }, [user]);

   return (
      <>
         {user && (
            <div>
               <form className="flex flex-col gap-3 py-6" onSubmit={handleSubmit}>
                  <div>
                     <label htmlFor="sender-name" className="font-bold pb-1 block">Customize the sender</label>
                     <ClientInput
                        id="sender-name"
                        value={sms.sender}
                        onChange={(e) => setSms(prev => ({ ...prev, sender: e.target.value }))}
                     />
                  </div>
                  <div>
                     <label htmlFor="sms-body" className="font-bold pb-1 block">Customize the message</label>
                     <StyledTextArea
                        id="sms-body"
                        className={`w-full py-[0.6rem] px-3 !font-semibold transition-all text-sm`}
                        value={sms.sms}
                        onChange={(e) => setSms(prev => ({ ...prev, sms: e.target.value }))}
                     />
                  </div>
                  <div className="mt-8 flex justify-end gap-3">
                     <button
                        className="p-3 px-4 rounded-md font-bold text-md bg-primary-color text-white flex gap-2"
                        type="submit"
                        disabled={loading}
                     >
                        <>{loading && <AppSpinner variant="LIGHT" size={25} />}Send<Send/></>
                     </button>
                  </div>
               </form>
            </div>
         )}
      </>
   );
}

export default SMSCustomizerForm;
