import { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "True Flowing - Loading...",
  icons: {
    icon: '/logoLight.png',
  },
  description: "Unlock your business's potential with True Flowing! Sign in today to access Premium QR Codes and personalized notifications that enhance client engagement and gather valuable feedback. Don’t miss the chance to transform your customer interactions—sign in now and start building lasting relationships!",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
