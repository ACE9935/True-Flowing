import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {ThemeProvider} from '@mui/material/styles';
import "../globals.css";
import theme from "@/providers/theme";
import Chakra from "@/providers/ChakraProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "True Flowing",
  description: "Unlock Free, Tailored Marketing Strategies to Drive Enterprise Successs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Chakra>
      <ThemeProvider theme={theme}>
        {children}
        </ThemeProvider>
        </Chakra>
        </body>
    </html>
  );
}