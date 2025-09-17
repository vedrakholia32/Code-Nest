import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/comonents/providers/ConvexClientProvider";
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
      { url: '/Code-Nest-new.png', sizes: '32x32', type: 'image/png' },
      // { url: '/logo.jpg', sizes: 'any', type: 'image/jpeg' },
    ],
    apple: '/Code-Nest-new.png',
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
          colorTextSecondary: "#9ca3af",
          colorDanger: "#ef4444",
          colorSuccess: "#10b981",
          colorWarning: "#f59e0b",
          colorNeutral: "#6b7280",
        },
        elements: {
          card: "bg-[#1e1e2e] border border-[#313244]",
          headerTitle: "text-[#e6edf3]",
          headerSubtitle: "text-gray-400",
          socialButtonsBlockButton: "bg-[#262637] border border-[#313244] hover:bg-[#2a2a3a] text-[#e6edf3]",
          socialButtonsBlockButtonText: "text-[#e6edf3]",
          dividerLine: "bg-[#313244]",
          dividerText: "text-gray-400",
          formFieldLabel: "text-[#e6edf3]",
          formFieldInput: "bg-[#262637] border-[#313244] text-[#e6edf3]",
          formFieldInputShowPasswordButton: "text-gray-400",
          formButtonPrimary: "bg-[#7c3aed] hover:bg-[#6d28d9] text-white",
          formButtonSecondary: "text-[#7c3aed] hover:text-[#6d28d9]",
          formHeaderTitle: "text-[#e6edf3]",
          formHeaderSubtitle: "text-gray-400",
          identityPreviewText: "text-[#e6edf3]",
          identityPreviewEditButtonIcon: "text-gray-400",
          footerActionLink: "text-[#7c3aed] hover:text-[#6d28d9]",
          footerActionText: "text-gray-400",
          footerText: "text-gray-400",
          modalContent: "bg-[#1e1e2e]",
          modalCloseButton: "text-gray-400 hover:text-[#e6edf3]",
          modalBackdrop: "bg-black bg-opacity-50",
          userButtonPopoverCard: "bg-[#1e1e2e] border border-[#313244]",
          userButtonPopoverActionButton: "text-[#e6edf3] hover:bg-[#262637]",
          userButtonPopoverActionButtonText: "text-[#e6edf3]",
          userButtonPopoverFooter: "bg-[#1e1e2e] border-t border-[#313244]",
          alternativeMethods: "text-gray-400",
          alternativeMethodsBlockButton: "bg-[#262637] border border-[#313244] hover:bg-[#2a2a3a] text-[#e6edf3]",
          alternativeMethodsBlockButtonText: "text-[#e6edf3]",
          otpCodeFieldInput: "bg-[#262637] border-[#313244] text-[#e6edf3]",
          formResendCodeLink: "text-[#7c3aed] hover:text-[#6d28d9]",
          alertText: "text-[#e6edf3]",
          formFieldSuccessText: "text-[#10b981]",
          formFieldWarningText: "text-[#f59e0b]",
          formFieldErrorText: "text-[#ef4444]",
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
