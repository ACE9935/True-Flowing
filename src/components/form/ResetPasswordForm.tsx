"use client";
import BasicInput from "./BasicInput";
import BasicButton from "./BasicButton";
import { FormEvent, useEffect, useState } from "react";
import { updatePassword } from "@/firebase/auth";
import { Alert } from "@mui/material";
import { PwdResetSecondResponse } from "@/types";
import { useRouter } from "next/navigation";
import AppSpinner from "../AppSpinner";

function ResetPassword({ id, token }: { id: string, token: string }) {
    const [data, setData] = useState({ pwd: "", rePwd: "" });
    const [response, setResponse] = useState<PwdResetSecondResponse>({ errors: null, status: null });
    const [isRegistering, setIsRegistering] = useState(false);
    const router = useRouter();

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!isRegistering) {
            setIsRegistering(true);
            const serverResponse = await updatePassword(data.pwd, data.rePwd, token, id);
            
            setIsRegistering(false);
            setResponse(serverResponse);
        }
    }
    
    useEffect(() => {
        if (response.status === "OK") router.push("/login/?resetPassword=true");
    }, [response]);

    return (
        <div className="bg-secondary-color p-9 rounded-lg w-full max-w-[28rem]">
            {isRegistering && <AppSpinner size={50} variant="LIGHT" className="fixed top-0 right-0 m-4" />}
            <h1 className="text-primary-color text-4xl font-bold pb-11 text-center">Reset Your Password</h1>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                {response.status === "ERROR" && <Alert severity="error">An error occurred</Alert>}
                <BasicInput
                    value={data.pwd} 
                    error={!!response.errors?.pwd.length}
                    helperText={response.errors?.pwd}
                    onChange={(e) => setData(prev => ({ ...prev, pwd: e.target.value }))} 
                    label="Password" type="password" />
                
                <BasicInput
                    value={data.rePwd} 
                    error={!!response.errors?.rePwd.length}
                    helperText={response.errors?.rePwd}
                    onChange={(e) => setData(prev => ({ ...prev, rePwd: e.target.value }))} 
                    label="Confirm Password" type="password" />
                <BasicButton>Continue</BasicButton>
            </form>
        </div>
    );
}

export default ResetPassword;
