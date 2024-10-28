"use client";
import { Alert, Box, Checkbox, FormControl, FormControlLabel, IconButton, Modal } from "@mui/material";
import { CloseOutlined } from '@mui/icons-material';
import { auth } from "@/firebase/firebase";
import { useRouter } from 'next/navigation';
import BasicInput from "./BasicInput";
import BasicButton from "./BasicButton";
import BrandButton from "./BrandButton";
import { FormEvent, useEffect, useState } from "react";
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from "@/firebase/auth";
import { InitialUser, SignUpErrors, SignUpResponse } from "@/types";
import Link from "next/link";
import { Button, useDisclosure } from "@chakra-ui/react";
import AppSpinner from "../AppSpinner";
import Logo from "../Logo";

export const ModalStyles = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "30rem",
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const OKStatusResponsesComponents = {
  "google": (
    <Alert severity="success">
      Your registration was successful! You can now access your account.
    </Alert>
  ),
  "credentials": (
    <Alert severity="info">
      To complete your registration, please open the link sent to your email address.
    </Alert>
  )
}

function SignUpForm() {
  const [initialUser, setInitialUser] = useState<InitialUser>({ userName: "", name: "", email: "", phone: "", pwd: "", rePwd: "", acceptPlcs: false });
  const [isRegistering, setIsRegistering] = useState(false);
  const [response, setResponse] = useState<SignUpResponse>({ errors: null, status: null });
  const errors: SignUpErrors | null = response.errors;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isRegistering) {
      setIsRegistering(true);
      const serverResponse = await doCreateUserWithEmailAndPassword({ ...initialUser });

      setIsRegistering(false);
      setResponse(serverResponse);
    }
  }

  useEffect(() => {
    if (response.status === "OK" && response.method === "credentials") onOpen();
  }, [response]);

  return (
    <>
      <Modal open={isOpen} onClose={onClose} disableAutoFocus>
        <Box sx={ModalStyles} className='!p-6 sm:w-[30rem] w-[90%] sm:px-14 !flex !flex-col !items-center !gap-8 !pb-14 !rounded-md'>
          <div className='flex self-end relative'><IconButton onClick={onClose}><CloseOutlined sx={{ fontSize: 30 }} /></IconButton></div>
          <h1 className='text-center text-2xl'>Check your inbox.</h1>
          <p className='text-center'>
            Click the link we sent to {auth.currentUser?.email} to complete your account setup.
          </p>
          <button onClick={onClose} className="text-white bg-primary-color py-2 px-6 font-bold rounded-full">OK</button>
        </Box>
      </Modal>
      <div className="bg-secondary-color p-9 rounded-lg w-full max-w-[30rem]">
        {isRegistering && <AppSpinner size={50} variant="LIGHT" className="fixed top-0 right-0 m-4" />}
        <div className="text-md sm:text-lg pb-11"><Logo variation="light"/></div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {response.status === "ERROR" ? <Alert severity="error">An error occurred</Alert> : response.status === "OK" ?
            OKStatusResponsesComponents[response.method!] : <></>}
          <BasicInput
            helperText={errors?.error.userName || null}
            error={!!errors?.error.userName}
            value={initialUser.userName}
            onChange={(e) => setInitialUser(prev => ({ ...prev, userName: e.target.value }))}
            label="Username"
            type="name"
          />
          <BasicInput
            helperText={errors?.error.name || null}
            error={!!errors?.error.name}
            value={initialUser.name}
            onChange={(e) => setInitialUser(prev => ({ ...prev, name: e.target.value }))}
            label="Establishment Name"
          />
          <BasicInput
            helperText={errors?.error.email || null}
            error={!!errors?.error.email}
            value={initialUser.email}
            onChange={(e) => setInitialUser(prev => ({ ...prev, email: e.target.value }))}
            label="Email"
            type="email"
          />
          <BasicInput
            helperText={errors?.error.pwd || null}
            error={!!errors?.error.pwd}
            value={initialUser.pwd}
            onChange={(e) => setInitialUser(prev => ({ ...prev, pwd: e.target.value }))}
            label="Password"
            type="password"
          />
          <BasicInput
            helperText={errors?.error.rePwd || null}
            error={!!errors?.error.rePwd}
            value={initialUser.rePwd}
            onChange={(e) => setInitialUser(prev => ({ ...prev, rePwd: e.target.value }))}
            label="Confirm Password"
            type="password"
          />
          <FormControl error={!!errors?.error.acceptPlcs}>
            {errors?.error.acceptPlcs && <span className="text-[0.75rem] text-[#d32f2f]">{errors?.error.acceptPlcs}</span>}
            <FormControlLabel sx={{
              alignItems: "start",
              gap: "3px"
            }}
              control={<Checkbox
                checked={initialUser.acceptPlcs} onChange={() => setInitialUser(prev => ({ ...prev, acceptPlcs: !prev.acceptPlcs }))} />} label={<p>I agree with the <a target="_blank" href="/terms-of-use" className="text-primary-blue underline">privacy policy and terms</a> of this website</p>} />
          </FormControl>
          <BasicButton type="submit">Sign Up</BasicButton>
        </form>
        <div className="flex flex-col pt-4">
          <BrandButton onClick={async () => {
            const response = await doSignInWithGoogle();
            setResponse(response);
            router.push("/dashboard");
          }} url="/google.png">Sign Up with Google</BrandButton>
          <span className="text-center font-bold mt-2">Already have an account? <Link href={"/login"} className="underline text-primary-blue">Log In</Link></span>
        </div>
      </div>
    </>
  );
}

export default SignUpForm;
