import ResetPassword from "@/components/form/ResetPasswordForm";
import { notFound } from "next/navigation";
import jwt from 'jsonwebtoken'
import { getUserById } from "@/firebase/getUserById";
import { customInitApp } from "@/firebase/firebase-admin";

customInitApp()

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}){
  try{
  const data=jwt.verify(searchParams.token!, process.env.JWT_SECRET!)
  const user=await getUserById(searchParams.id)
  if(!data) notFound()
  if(!user) notFound()
  if(!user.resetPasswordToken) notFound()
  return (
    <main className="wh-full min-h-screen bg-form grid place-items-center p-6">
      <ResetPassword id={searchParams.id} token={searchParams.token}/>
    </main>
  );
}catch{
  return notFound()
}
}