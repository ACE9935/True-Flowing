export const configurations = {
  appName: "True Flowing",
  developer:"Anas ELMOUDEN",
  bluetheme: "rgb(94, 123, 238)",
  host: "https://true-flowing.vercel.app",
  staticQrCode: "https://firebasestorage.googleapis.com/v0/b/abt-digital.appspot.com/o/40415-bdc-qr-code.webp?alt=media&token=524eddee-f350-4466-a8ad-f2759bb0c9c5",
  darkSpinner: "https://firebasestorage.googleapis.com/v0/b/abt-digital.appspot.com/o/Rolling%401.5x-1.0s-200px-200px%20(1).gif?alt=media&token=6c4c257f-c455-49fb-b9ce-adfa5335d8bd",
  lightSpinner: "https://firebasestorage.googleapis.com/v0/b/abt-digital.appspot.com/o/Rolling%401.5x-1.0s-200px-200px%20(2).gif?alt=media&token=9ec69938-06c6-457b-a2b3-38866f0a79af",
  userImg: "https://firebasestorage.googleapis.com/v0/b/abt-digital.appspot.com/o/user.png?alt=media&token=9c8c42cf-a46c-4243-9ba3-a522c4d3e9e2",
  client: {
    desktopImg: "https://wallpaper.forfun.com/fetch/21/215e3ddf9d2d722a16e435992d354932.jpeg",
    introductorytext: "Leave us a review, it will help us grow and better serve customers like you."
  },
  emailAdress: "noreply@trueflowing.com",
  domain: "trueflowing.com"
};

export const genericEmail = (brandName: string) => `Hello,<br/>
<br/>
Thank you for visiting ${brandName}. We hope you had a pleasant time.
<br/><br/>
We look forward to seeing you again soon!
<br/><br/>
Best regards,`;

export const genericSMS = (brandName: string) => `Hello,\n
Thank you for visiting ${brandName}. We hope you had a pleasant time.
We look forward to seeing you again soon!\n
Best regards,`;

export const genericEmailSubject = (brandName: string) => `Thank you for visiting ${brandName}!`;

