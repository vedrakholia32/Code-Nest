import HeaderProfileBtn from "@/app/(root)/_components/HeaderProfileBtn";
import { SignedOut } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import Link from "next/link";

function NavigationHeader() {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group relative">
              {/* logo hover effect */}
              <div
                className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 
                group-hover:opacity-100 transition-all duration-500 blur-xl"
              />

              {/* Logo */}
              <img
                src="/logo.png"
                alt="CodeNest Logo"
                className="w-12 h-12 object-contain transform -rotate-6 group-hover:rotate-0 transition-transform duration-500 rounded-3xl"
                draggable={false}
              />
              <div className="relative flex flex-col">
                <span className="block text-lg font-semibold text-[#b3b3b3] group-hover:text-[#e0e0e0] transition-colors duration-300">
                  CodeNest
                </span>
                <span className="block text-xs font-medium text-[#b3b3b3] group-hover:text-[#e0e0e0] transition-colors duration-300">
                  Interactive Code Editor
                </span>
              </div>
            </Link>

            {/* Home Link */}
            <Link
              href="/"
              className="relative rounded-xl group flex items-center gap-2 px-4 py-1.5 
                border border-[#313244]/50 hover:border-[#414155] 
                bg-[#1e1e2e]/80 hover:bg-[#1e1e2e] 
                transition-all duration-300"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 
                to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-sm font-medium text-gray-400 group-hover:text-blue-400 
                relative z-10 transition-colors">
                Home
              </span>
            </Link>
          </div>

          {/* right rection */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <Link
                href="/pricing"
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-amber-500/20
                 hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10 
                to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 transition-all 
                duration-300"
              >
                <Sparkles className="w-4 h-4 text-amber-400 hover:text-amber-300" />
                <span className="text-sm font-medium text-amber-400/90 hover:text-amber-300">
                  Pro
                </span>
              </Link>
            </SignedOut>

            {/* profile button */}
            <HeaderProfileBtn />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavigationHeader;
