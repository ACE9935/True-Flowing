import { configurations } from '@/app-configurations';
import { Resend } from 'resend';


const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendClientEmail(params: {userName:string,subject:string,emailContent:string,identifier:{content:string}[],sender:string }) {
  const { emailContent,subject,identifier, sender,userName} = params

  try {
    const data = await resend.emails.send({
      from: `${sender} <${userName.toLowerCase().replace(/\s+/g, '')}@${configurations.domain}>`,
      to: identifier.map((o: { content: string }) => o.content),
      subject: subject,
      html:emailContent
    })
    return { success: true, data }
  } catch (error) {
    throw new Error('Failed to send email.')
  }
}
