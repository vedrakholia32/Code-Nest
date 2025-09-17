"use client";

import HeaderProfileBtn from "@/app/(root)/_components/HeaderProfileBtn";
import { SignedOut, SignInButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

function NavigationHeader() {
  return (
    <motion.header 
      className="sticky top-0 z-50 w-full bg-gray-900 border-b border-gray-800"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src="/Code-Nest-new.png"
                alt="CodeNest"
                width={34}
                height={34}
                className="rounded-lg"
              />
              <span className="text-lg font-bold text-white">CodeNest</span>
            </motion.div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">
              HOME
            </Link>
            <Link href="/snippets" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">
              CODE GALLERY
            </Link>
            <Link href="/library" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">
              PROJECTS
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">
              PRICING
            </Link>
            <Link href="/profile" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">
              PROFILE
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-all duration-300">
                  SIGN IN
                </button>
              </SignInButton>
            </SignedOut>
            <HeaderProfileBtn />
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default NavigationHeader;