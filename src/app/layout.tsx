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
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      // { url: '/logo.jpg', sizes: 'any', type: 'image/jpeg' },
    ],
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#7c3aed",
          colorText: "#e6edf3",
          colorBackground: "#1e1e2e",
          colorInputBackground: "#262637",
          colorInputText: "#e6edf3",
        },
        elements: {
          card: "bg-[#1e1e2e] border border-[#313244]",
          headerTitle: "text-[#e6edf3]",
          headerSubtitle: "text-gray-400",
          socialButtonsBlockButton: "bg-[#262637] border border-[#313244] hover:bg-[#2a2a3a]",
          formButtonPrimary: "bg-[#7c3aed] hover:bg-[#6d28d9]",
          footerActionLink: "text-[#7c3aed] hover:text-[#6d28d9]",
          userButtonPopoverCard: "bg-[#1e1e2e] border border-[#313244]",
          userButtonPopoverActionButton: "text-[#e6edf3] hover:bg-[#262637]",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-gray-900 to-gray-950`}
          suppressHydrationWarning
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
            {/* <Footer /> */}
          </div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
