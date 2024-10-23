import { Resend } from 'resend';
const { defineString } = require('firebase-functions/params');

const apiKey = defineString('RESEND_KEY');

export async function sendClientEmail(params: {userName:string,subject:string,emailContent:string,identifier:{content:string}[],sender:string }) {
  const { emailContent,subject,identifier, sender,userName} = params
  const resend = new Resend(apiKey.value());
  try {
    const data = await resend.emails.send({
      from: `${sender} <${userName.toLowerCase().replace(/\s+/g, '')}@trueflowing.com>`,
      to: identifier.map((o: { content: string }) => o.content),
      subject: subject,
      html:emailContent
    })
    return { success: true, data }
  } catch (error) {
    throw new Error('Failed to send email.')
  }
}