import { customInitApp } from "@/firebase/firebase-admin";
import { auth, firestore } from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import jwt from 'jsonwebtoken'

customInitApp()

export async function POST(
  req:Request
) {
  
  const {password,token,id} = await req.json()
  
  if (!token || !id) {
    throw new Error("Token or ID is missing in the request URL");
  }

  try{
    const decoded:any = jwt.verify(token!, process.env.JWT_SECRET!);
    const user=await auth().getUserByEmail(decoded.email)
    
    if(user){
      await auth().updateUser(user.uid, {password})
      const db = firestore();
     const querySnapshot = await db.collection("users").where("id", "==", id).get();
  
  // Iterate over the query results and update documents
  querySnapshot.forEach(async (doc) => {
    const docRef = db.collection("users").doc(doc.id);
    await docRef.update({
      emailVerified: true,
      resetPasswordToken:FieldValue.delete(),
    });
  });
  }
  return Response.json({status:"Success"})
}
  catch (e:unknown){
    console.log({error:e})
    return Response.json({error:e})
}
}