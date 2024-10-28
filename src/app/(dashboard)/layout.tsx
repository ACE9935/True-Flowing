import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {ThemeProvider} from '@mui/material/styles';
import "../globals.css";
import theme from "@/providers/theme";
import UserProvider from "@/context/authContext";
import Chakra from "@/providers/ChakraProvider";
import DashBoardLayout from "@/components/dashboad/layout/DashBoardLayout";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard | True Flowing",
  icons: {
    icon: '/logoLight.png',
  },
  description: "True Flowing Dashboard provides a user-friendly interface for managing client interactions, tracking feedback, and analyzing engagement metrics, all designed to enhance business performance and customer loyalty.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Suspense>
      <UserProvider>
        <Chakra>
      <ThemeProvider theme={theme}>
        <DashBoardLayout>{children}</DashBoardLayout>
        </ThemeProvider>
        </Chakra>
        </UserProvider>
        </Suspense>
        </body>
    </html>
  );
}