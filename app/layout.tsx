"use client";
import Navbar from "@/components/Navbar";
import { PrivyProvider } from "@privy-io/react-auth";
import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/svg/lock.svg" />
      </head>
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PrivyProvider
          appId="cm1afgoqj0443tpxkbkmbe9ha"
          config={{
            appearance: {
              theme: "dark",
              accentColor: "#676FFF",
              logo: "https://your-logo-url",
            },
            // Create embedded wallets for users who don't have a wallet
            embeddedWallets: {
              createOnLogin: "users-without-wallets",
            },
          }}
        >
          <Navbar />
          {children}
        </PrivyProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
