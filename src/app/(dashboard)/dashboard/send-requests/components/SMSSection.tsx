"use client";

import { AutomateType, User } from "@/types";
import { Alert, Checkbox, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { StyledSelect } from "./PageContainer";
import SMSCustomizerForm from "./SMSCustomizerForm";
import { useUser } from "@/context/authContext";
import { useRouter } from "next/navigation";

function SMSSection() {

   const [automate, setAutomate] = useState(false);
   const { user, updateUser, loading } = useUser();
   const [automateType, setAutomateType] = useState("SMS");
   const [automateValue, setAutomateValue] = useState<AutomateType>("3-day");
   const router = useRouter();

   return ( 
      <div>
         <h2 className="font-bold text-lg pb-3">Request Feedback via SMS</h2>
         <div className="bg-white rounded-lg border-2 py-8 px-6">
         {!user?.clients.length&&<Alert severity="warning" className="mb-5">You need atleat 1 registered client to start sending notifications</Alert>}
            <h3 className="font-semibold pb-6">Invite Your Clients</h3>
            <button 
               onClick={() => router.push("/dashboard/clients")} 
               className="rounded-md font-bold text-white bg-black p-3">
               View Your Registered Clients
            </button>
            <div className="mt-3 flex items-center opacity-60">
               <Checkbox 
                  disableRipple 
                  disabled
                  className="!px-0" 
                  id="automate-checkbox" 
                  checked={automate} 
                  onChange={() => setAutomate(prev => !prev)} 
                  color="default" 
               />
               <label htmlFor="automate-checkbox" className="font-bold text-md pl-2">Enable Automation</label>
            </div>
            <Alert severity="info">Automated SMS are currently disabled</Alert>
            {automate && (
               <div className="p-3 border-l-2 mt-1">
                  <StyledSelect
                     value={automateValue}
                     onChange={(e) => setAutomateValue(e.target.value as AutomateType)}
                  >
                     <MenuItem value={"3-day"}>Every 3 days</MenuItem>
                     <MenuItem value={"1-week"}>Every week</MenuItem>
                     <MenuItem value={"1-month"}>Every month</MenuItem>
                     <MenuItem value={"3-month"}>Every 3 months</MenuItem>
                  </StyledSelect>
               </div>
            )}
            <SMSCustomizerForm automateType={automateType} user={user} automate={automate} automateValue={automateValue} />
         </div>
      </div>
   );
}

export default SMSSection;
