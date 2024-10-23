import { customInitApp } from "@/firebase/firebase-admin";
import { auth, firestore } from "firebase-admin";
import { FieldValue } from 'firebase-admin/firestore';
import jwt from 'jsonwebtoken'

customInitApp()

export async function GET(
  req:Request
) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  const id = searchParams.get('id')
  if (!token || !id) {
    throw new Error("Token or ID is missing in the request URL");
  }

  try{
    const decoded:any = jwt.verify(token!, process.env.JWT_SECRET!);
    const user=await auth().getUserByEmail(decoded.email)
    
    if(user){
        if(user.emailVerified==true) throw "email already verified"
        await auth().updateUser(user.uid, {emailVerified:true})
        const db = firestore();
       const querySnapshot = await db.collection("users").where("id", "==", id).get();
    
    // Iterate over the query results and update documents
    querySnapshot.forEach(async (doc) => {
      const docRef = db.collection("users").doc(doc.id);
      await docRef.update({
        emailVerified: true,
        verificationToken:FieldValue.delete(),
      });
    });
    }
    return Response.redirect(process.env.HOST+"/dashboard?verifiedUser=true")
  }
  catch (e:unknown){
    console.log({error:e})
    return Response.json({error:e})
}
}