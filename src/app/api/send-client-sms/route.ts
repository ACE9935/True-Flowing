const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: process.env.VONAGE_KEY,
  apiSecret: process.env.VONAGE_SECRET
})

export async function POST(req: Request): Promise<Response> {
  try {
    const { sender, phoneNumbers, content } = await req.json();

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

    return Response.json({ status: "Success" });
  } catch (error: unknown) {
    console.error({ error });
    return Response.json({ error });
  }
}

