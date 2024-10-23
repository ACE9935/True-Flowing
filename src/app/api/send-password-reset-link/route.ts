import { auth } from "firebase-admin";
import { customInitApp } from "@/firebase/firebase-admin";
import { updateUser } from "@/firebase/updateUser";
import { generateVerificationToken } from "@/utils/generateVerificationToken";
import { sendPasswordResetRequest } from "@/utils/sendPasswordResetLink";

customInitApp()

export async function POST(req: Request): Promise<Response> {
    try {
      
      const {email} = await req.json()
      const token=generateVerificationToken(email!)
      const updatedUserId=await updateUser("email",email,"resetPasswordToken",token)
      
      if(updatedUserId) await sendPasswordResetRequest({identifier:email,id:updatedUserId,token})
      return Response.json({ status: "Success"});
    } catch (error: unknown) {
      console.error({ error });
      return Response.json({ error });
    }
  }