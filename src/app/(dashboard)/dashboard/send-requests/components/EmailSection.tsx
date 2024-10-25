"use client";
import { AutomateType, User } from "@/types";
import { Checkbox, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { StyledSelect } from "./PageContainer";
import EmailCustomizerForm from "./EmailCustomizerForm";
import { useUser } from "@/context/authContext";
import { useRouter } from "next/navigation";

function EmailSection() {
   const [automate, setAutomate] = useState(false);
   const [init, setInit] = useState(true);
   const { user, updateUser, loading } = useUser();
   const [automateType, setAutomateType] = useState("Email");
   const [automateValue, setAutomateValue] = useState<AutomateType>("3-day");
   const router = useRouter();

   return ( 
      <div>
         <h2 className="font-bold text-lg pb-3">Email Review Request</h2>
         <div className="bg-white rounded-lg border-2 py-8 px-6">
            <h3 className="font-semibold pb-6">Invite Your Clients</h3>
            <button className="rounded-md font-bold text-white bg-black p-3" onClick={() => router.push("/dashboard/clients")}>View Your Registered Clients</button>
            <div className="mt-3 flex items-center">
               <Checkbox disableRipple className="!px-0" id="automate-checkbox" checked={automate} onChange={() => setAutomate(prev => !prev)} color="default" />
               <label htmlFor="automate-checkbox" className="font-bold text-md pl-2">Enable Automation</label>
            </div>
            {automate && (
               <div>
               <div className="p-3 border-l-2 mt-1">
                  <StyledSelect
                     value={automateValue}
                     onChange={(e) => setAutomateValue(e.target.value as AutomateType)}
                  >
                     <MenuItem value={"3-day"}>Every 3 Days</MenuItem>
                     <MenuItem value={"1-week"}>Every Week</MenuItem>
                     <MenuItem value={"1-month"}>Every Month</MenuItem>
                     <MenuItem value={"3-month"}>Every 3 Months</MenuItem>
                  </StyledSelect>
                  <div className="mt-3 flex items-center">
               <Checkbox disableRipple className="!px-0" id="automate-checkbox" checked={init} onChange={() => setInit(prev => !prev)} color="default" />
               <label htmlFor="automate-checkbox" className="font-bold text-md pl-2">Send initial message</label>
               </div>
               </div>
               </div>
            )}
            <EmailCustomizerForm automateType={automateType} init={init} automate={automate} automateValue={automateValue} />
         </div>
      </div>
   );
}

export default EmailSection;
