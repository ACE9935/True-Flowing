export async function POST(req: Request): Promise<Response> {
    try {
      const { winningCode, phoneNumber, prize, name } = await req.json();
  
      const accountSid = process.env.TWILO_KEY;
      const authToken = process.env.TWILO_SECRET;
      const client = require('twilio')(accountSid, authToken);
  
      // Create a dynamic message that includes the prize and winning code
      const messageBody = `Congratulations ${name}! You have won ${prize}. Use the winning code ${winningCode} to claim your prize.`;
  
      // Send the SMS
      await client.messages
        .create({
          body: messageBody,
          to: `${phoneNumber}`,
          from: '+18647340966'
        })
        .then(() => console.log(`Winning code ${winningCode} sent to client for prize ${prize}`));
  
      return Response.json({ status: "Success" });
    } catch (error: unknown) {
      console.error({ error });
      return Response.json({ error });
    }
  }
  