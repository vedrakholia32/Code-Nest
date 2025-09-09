"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LandingPage from "./LandingPage";

interface AuthWrapperProps {
  children: React.ReactNode;
  redirectToLanding?: boolean;
}

export default function AuthWrapper({ children, redirectToLanding = true }: AuthWrapperProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if not authenticated and not already on home page
    if (isLoaded && !user && redirectToLanding && window.location.pathname !== "/") {
      router.push("/");
    }
  }, [user, isLoaded, router, redirectToLanding]);

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page if user is not authenticated
  if (!user) {
    if (redirectToLanding) {
      return <LandingPage />;
    }
    return null; // or redirect
  }

  // User is authenticated, show the protected content
  return <>{children}</>;
}
