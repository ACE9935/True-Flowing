import { firestore } from 'firebase-admin'; // Import Firestore from Firebase Admin
import { customInitApp } from '@/firebase/firebase-admin'; // Custom initialization function for Firebase

customInitApp(); // Initialize Firebase Admin SDK

export async function POST(req: Request): Promise<Response> {
  const { userId, qrCodeId } = await req.json(); // Extract userId and qrCodeId from the request body

  try {
    // Reference the users collection
    const usersCollection = firestore().collection('users');
    const userQuery = await usersCollection.where('id', '==', userId).get(); // Query for the user by userId

    // Check if any documents match the query
    if (userQuery.empty) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Iterate over each matching document
    for (const docSnapshot of userQuery.docs) {
      const data = docSnapshot.data();

      if (data.qrCodes && Array.isArray(data.qrCodes)) {
        // Find the QR code item by ID
        const qrCodeIndex = data.qrCodes.findIndex((code: any) => code.id === qrCodeId);

        if (qrCodeIndex !== -1) {
          // Increment the scans field
          data.qrCodes[qrCodeIndex].scans = (data.qrCodes[qrCodeIndex].scans || 0) + 1;
          data.qrCodes[qrCodeIndex].scansPerDay = (data.qrCodes[qrCodeIndex].scansPerDay || 0) + 1;
          data.qrCodes[qrCodeIndex].scansPerWeek = (data.qrCodes[qrCodeIndex].scansPerWeek || 0) + 1;
          data.qrCodes[qrCodeIndex].scansPerMonth = (data.qrCodes[qrCodeIndex].scansPerMonth || 0) + 1;

          // Update the document
          const docRef = docSnapshot.ref; // Reference to the user's document
          await docRef.update({ qrCodes: data.qrCodes });

          console.log('Scans incremented successfully.');
        } else {
          console.log('QR code not found.');
        }
      } else {
        console.log('The document does not contain a qrCodes array.');
      }
    }

    // Return a success response
    return new Response(JSON.stringify({ status: 'OK', msg: 'Scans updated' }), { status: 200 });
  } catch (error: unknown) {
    console.error({ error });

    // Return an error response
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}
