import { Resend } from 'resend';
import MagicLinkEmail from '@/emails/VerificationEmail';
import { configurations } from '@/app-configurations';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationRequest(params: {identifier:string; id: any; token:{data:string} }) {
  const { identifier,id,token} = params
  const link=`${process.env.HOST}/api/verify-user?token=${token.data}&id=${id}`
  
  try {
    const data = await resend.emails.send({
      from: `${configurations.emailAdress}`,
      to: [identifier],
      subject: `Log in to ${configurations.appName}`,
      text: text(),
      react: MagicLinkEmail(link)
    })
    return { success: false, data }
  } catch (error) {
    throw new Error('Failed to send the verification Email.')
  }
}

function text() {
  return `Sign in to ${configurations.appName}\n\n`
}