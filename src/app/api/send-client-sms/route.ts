import { firestore } from "firebase-admin";
import { customInitApp } from "@/firebase/firebase-admin";
import { formatDate } from "@/utils/formatDate";
import generateRandomId from "@/utils/generateRandomId";
import { Notification } from "@/types";

customInitApp();

const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: process.env.VONAGE_KEY,
  apiSecret: process.env.VONAGE_SECRET
})

export async function POST(req: Request): Promise<Response> {
  try {
    const { sender, phoneNumbers, content, userId } = await req.json();

    // Loop through the array of phone numbers, removing "+" if it exists
    const sendPromises = phoneNumbers.map((phoneNumber: {content:string}) => {
      const sanitizedPhoneNumber = phoneNumber.content.startsWith('+') 
        ? phoneNumber.content.slice(1)  // Remove the "+" at the start
        : phoneNumber.content;

      return vonage.sms.send({
        to: sanitizedPhoneNumber, 
        from: sender, 
        text: content
      });
    });

    // Wait for all the messages to be sent
    await Promise.all(sendPromises)
      .then(() => { console.log('Messages sent successfully') })
      .catch((err) => { 
        console.error('There was an error sending the messages:', err);
        throw err; 
      });

      const usersCollection = firestore().collection("users");
      const userQuery = await usersCollection.where("id", "==", userId).get();

      if (userQuery.empty) {
        return Response.json({ error: "User not found" });
      }

      const userDocRef = userQuery.docs[0].ref;

      const newNotification:Notification = {
        id:generateRandomId(10),
        type: "SMS",
        content: {
          sender,
          sms:  content,
        },
        sentDate:formatDate(new Date())
      };

      await userDocRef.update({
        notifications: firestore.FieldValue.arrayUnion(newNotification)
      });

    return Response.json({ status: "Success" });
  } catch (error: unknown) {
    console.error({ error });
    return Response.json({ error });
  }
}

