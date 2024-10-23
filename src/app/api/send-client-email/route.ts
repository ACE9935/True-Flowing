import { firestore } from "firebase-admin";
import { customInitApp } from "@/firebase/firebase-admin";
import { sendClientEmail } from "@/utils/sendClientEmail";
import { AutomatedNotification } from "@/types";
import getDateAfter from "@/utils/getDateAfter";
import generateRandomId from "@/utils/generateRandomId";

customInitApp();

export async function POST(req: Request): Promise<Response> {
  try {
    const { emails, emailContent, sender, subject, automate, automateValue, automateType, userId,userName } = await req.json();

    // Send the email
    await sendClientEmail({ emailContent, subject, identifier: emails,sender,userName });

    // If automate is true, update the user's automated notifications
    if (automate) {
      const usersCollection = firestore().collection("users");
      const userQuery = await usersCollection.where("id", "==", userId).get();

      if (userQuery.empty) {
        return Response.json({ error: "User not found" });
      }

      const userDocRef = userQuery.docs[0].ref;

      const newNotification:AutomatedNotification = {
        id:generateRandomId(10),
        every: automateValue,
        activated:true,
        type: automateType,
        content: {
          sender,
          subject,
          email: emailContent,
        },
        scheduledDate:getDateAfter(automateValue)
      };

      await userDocRef.update({
        automatedNotifications: firestore.FieldValue.arrayUnion(newNotification)
      });
    }

    return Response.json({ status: "Success" });
  } catch (error: unknown) {
    console.error({ error });
    return Response.json({ error});
  }
}
