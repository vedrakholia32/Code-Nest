import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/comonents/providers/ConvexClientProvider";
import Footer from "@/comonents/Footer";
import { Toaster } from "react-hot-toast";
import DesktopOnly from "@/DesktopOnly/DesktopOnly";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Code Nest",
  description: "Share and Run Code Snippets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-gray-900 to-gray-950`}
        >
          <ConvexClientProvider>
            {/* Show desktop-only message on mobile */}
            <div className="block md:hidden h-screen">
              <DesktopOnly />
            </div>
            {/* Show main content only on desktop */}
            <div className="hidden md:block">
              {children}
            </div>
          </ConvexClientProvider>
          <div className="hidden md:block">
            <Footer />
          </div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
