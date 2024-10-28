"use client";
import { AutomateType, User } from "@/types";
import { Alert, Checkbox, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { StyledSelect } from "./PageContainer";
import EmailCustomizerForm from "./EmailCustomizerForm";
import { useUser } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { Info } from "@mui/icons-material";

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
         {!user?.clients.length&&<Alert severity="warning" className="mb-5">You need atleat 1 registered client to start sending notifications</Alert>}
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
            <p className=" text-slate-600 flex gap-1 mt-1 font-semibold"><Info sx={{color:"#97a2ff"}}/>Automated notifications are messages sent to users at scheduled intervals to inform them about important events or updates without manual intervention.</p>
            <EmailCustomizerForm automateType={automateType} init={init} automate={automate} automateValue={automateValue} />
         </div>
      </div>
   );
}

export default EmailSection;
