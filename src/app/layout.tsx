import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BridgeIt",
  description: "Your platform for connecting academia and industry.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="BridgeIt - Connecting academia and industry." />
        {/* Add any additional meta tags here */}
      </head>
      <body className={inter.className}>

        <main>{children}</main>
     
      </body>
    </html>
  );
}
