"use client";
import BasicInput from "./BasicInput";
import BasicButton from "./BasicButton";
import BrandButton from "./BrandButton";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "@/firebase/auth";
import { Alert } from "@mui/material";
import { LoginResponse, SignUpResponse } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import ResetPwd from "./ResetPwd";
import { useToast } from "@chakra-ui/react";
import AppToast from "../AppToast";
import { Check, CheckCircle } from "@mui/icons-material";
import AppSpinner from "../AppSpinner";
import Logo from "../Logo";

function LoginForm({ resetPassword }: { resetPassword: string | null }) {
    
    const searchParams = useSearchParams();
    const [initialUser, setInitialUser] = useState({ email: "", pwd: "" });
    const [response, setResponse] = useState<LoginResponse>({ errorMsg: null, status: null });
    const [isRegistering, setIsRegistering] = useState(false);
    const toast = useToast();
    const router = useRouter();

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!isRegistering) {
            setIsRegistering(true);
            const serverResponse = await doSignInWithEmailAndPassword(initialUser.email, initialUser.pwd);
            
            setIsRegistering(false);
            setResponse(serverResponse);
        }
    }
    
    useEffect(() => {
        if (resetPassword === "true") toast({
            position: 'bottom-left',
            render: () => (<AppToast variant='SUCCESS' title='Your password has been reset' Icon={CheckCircle} />),
            duration: 3000,
        });
    }, []);

    useEffect(() => {
        if (response.status === "OK") router.push("/dashboard");
    }, [response]);

  useEffect(() => {
    if (searchParams.get("verifiedUser")) {
      toast({
        position: "bottom-left",
        render: () => (
          <AppToast variant="SUCCESS" title="Email successfully verified, log in to access your account" Icon={Check} />
        ),
      });
    }
  }, [searchParams, toast]);

    return (
        <div className="bg-secondary-color p-9 rounded-lg w-full max-w-[28rem]">
            {isRegistering && <AppSpinner size={50} variant="LIGHT" className="fixed top-0 right-0 m-4" />}
            <div className="text-md sm:text-lg pb-11"><Logo variation="light"/></div>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                {response.status === "ERROR" && <Alert severity="error">{response.errorMsg}</Alert>}
                <BasicInput
                    value={initialUser.email} 
                    type="email"
                    onChange={(e) => setInitialUser(prev => ({ ...prev, email: e.target.value }))} 
                    label="Email" />
                <BasicInput
                    value={initialUser.pwd} 
                    onChange={(e) => setInitialUser(prev => ({ ...prev, pwd: e.target.value }))} 
                    label="Password" type="password" />
                <ResetPwd />
                <BasicButton>Log in</BasicButton>
            </form>
            <div className="flex flex-col pt-4">
                <BrandButton
                    onClick={async () => {
                        const response = await doSignInWithGoogle()
                            .then((responseData: SignUpResponse) => setResponse({ errorMsg: "", status: responseData.status }));
                    }}
                    url="/google.png">Log in with Google</BrandButton>
                <span className="text-center font-bold mt-2">Don't have an account? <Link href='/signup' className="underline text-primary-blue">Sign up</Link></span>
            </div>
        </div>
    );
}

export default LoginForm;
