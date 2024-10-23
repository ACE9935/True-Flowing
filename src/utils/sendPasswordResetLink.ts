import { Resend } from 'resend';
import MagicLinkEmail from '@/emails/VerificationEmail';
import { configurations } from '@/app-configurations';
import ResetLinkEmail from '@/emails/ResetPasswordEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetRequest(params: {identifier:string; id: any; token:{data:string} }) {
  const { identifier,id,token} = params
  const link=`${process.env.HOST}/reset-password?token=${token}&id=${id}`
  try {
    const data = await resend.emails.send({
      from: `${configurations.emailAdress}`,
      to: [identifier],
      subject: `Reset your password ${configurations.appName}`,
      text: text(),
      react: ResetLinkEmail(link)
    })
    return { success: false, data }
  } catch (error) {
    throw new Error('Failed to send the password-reset Email.')
  }
}

function text() {
  return `Reset your password for ${configurations.appName}\n\n`
}