import { auth } from "firebase-admin";
import { customInitApp } from "@/firebase/firebase-admin";
import { sendVerificationRequest } from "@/utils/sendVerificationEmail";

customInitApp()

export async function POST(req: Request): Promise<Response> {
    try {
      
      const {email,token,id,accessToken} = await req.json()
      const decodedToken = await auth().verifyIdToken(accessToken);
      await sendVerificationRequest({identifier:email!,id:id!,token:token!})
      return Response.json({ status: "Success"});
    } catch (error: unknown) {
      console.error({ error });
      return Response.json({ error });
    }
  }